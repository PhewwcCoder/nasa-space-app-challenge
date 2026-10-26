import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const [label = 'interactions', url = 'http://127.0.0.1:4173'] = process.argv.slice(2);
const output = `docs/qa/performance/${label}`;
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const errors = [], results = [];
page.on('pageerror', e => errors.push(e.message));
await page.addInitScript(() => {
  window.probe = { tasks: [], events: [], frames: [] };
  new PerformanceObserver(list => list.getEntries().forEach(e => window.probe.tasks.push({ start: e.startTime, duration: e.duration }))).observe({ type: 'longtask', buffered: true });
  new PerformanceObserver(list => list.getEntries().forEach(e => { if (e.interactionId) window.probe.events.push({ start: e.startTime, duration: e.duration, processing: e.processingEnd - e.processingStart }); })).observe({ type: 'event', buffered: true, durationThreshold: 16 });
  let previous = 0;
  function frame(now) { if (previous) window.probe.frames.push({ start: previous, duration: now - previous }); previous = now; requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
});
try {
  await page.goto(url);
  await page.waitForFunction(() => document.querySelector('canvas')?.dataset.world === 'museum' && document.querySelector('canvas')?.getAttribute('aria-busy') === 'false');
  await page.getByRole('button', { name: /browse the museum/i }).click();
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Profiler.enable');
  async function measure(name, action) {
    await cdp.send('Profiler.start');
    const start = await page.evaluate(() => performance.now());
    await action();
    await page.waitForTimeout(1600);
    const { profile } = await cdp.send('Profiler.stop');
    await writeFile(`${output}/${name}.cpuprofile`, JSON.stringify(profile));
    const result = await page.evaluate(start => {
      const tasks = window.probe.tasks.filter(e => e.start >= start);
      const events = window.probe.events.filter(e => e.start >= start);
      const frames = window.probe.frames.filter(e => e.start >= start).map(e => e.duration).sort((a,b) => a-b);
      return { maxTask: Math.max(0, ...tasks.map(e => e.duration)), longTasks: tasks.length, maxInteraction: Math.max(0, ...events.map(e => e.duration)), maxProcessing: Math.max(0, ...events.map(e => e.processing)), frameP95: frames[Math.floor(frames.length * .95)], maxFrame: Math.max(0, ...frames) };
    }, start);
    results.push({ name, ...result }); console.log(JSON.stringify(results.at(-1)));
  }
  for (const [i, name] of ['Spirit', 'Apollo 11', 'Spirit', 'Apollo 11'].entries()) {
    await measure(`museum-${i}-${name.replaceAll(' ', '-')}`, () => page.getByRole('navigation', { name: 'Five missions' }).getByRole('button', { name: new RegExp(name) }).click());
  }
  await page.getByRole('button', { name: 'Explore Apollo 11', exact: true }).click();
  await page.getByRole('button', { name: 'Enable flight assist' }).click();
  await page.getByRole('button', { name: 'Skip walk', exact: true }).click({ timeout: 90000 });
  await page.getByRole('button', { name: 'Explore the hardware', exact: true }).click();
  await page.getByRole('button', { name: 'Explore without answering' }).click();
  await page.locator('.discovery-dock [data-artifact="eagle"]').click();
  const gotIt = page.getByLabel('Miso exploration tip').getByRole('button', { name: 'Got it' });
  if (await gotIt.isVisible()) await gotIt.click();
  await page.waitForTimeout(3500);
  for (let round = 0; round < 2; round++) for (const name of ['Structure', 'Engine', 'Landing gear']) {
    await measure(`part-${round}-${name.replaceAll(' ', '-')}`, () => page.getByRole('navigation', { name: 'Hardware components' }).getByRole('button', { name: new RegExp(name) }).click());
  }
  await page.screenshot({ path: `${output}/hardware.png` });
  await writeFile(`${output}/results.json`, JSON.stringify({ browser: browser.version(), url, viewport: { width: 1440, height: 900 }, reducedMotion: true, errors, results }, null, 2));
  if (errors.length) throw new Error(errors.join('\n'));
} finally { await browser.close(); }
