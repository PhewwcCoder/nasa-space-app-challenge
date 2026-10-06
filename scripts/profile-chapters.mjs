import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

// Run against a production preview for timings; use Vite dev for readable CPU stacks.
const [label = 'chapters', url = 'http://127.0.0.1:4173', recordingPath] = process.argv.slice(2);
const recording = recordingPath ? JSON.parse(await readFile(recordingPath, 'utf8')) : null;
const viewportStep = recording?.steps.find(step => step.type === 'setViewport');
const viewport = viewportStep ? { width: viewportStep.width, height: viewportStep.height } : { width: 1440, height: 900 };
const order = recording ? recording.steps.filter(step => step.type === 'click').map(step => JSON.stringify(step.selectors).match(/APOLLO 11|SOJOURNER|SPIRIT|OPPORTUNITY/)?.[0]).filter(Boolean) : ['APOLLO 11', 'SOJOURNER', 'SPIRIT', 'OPPORTUNITY', 'APOLLO 11', 'SOJOURNER', 'SPIRIT', 'OPPORTUNITY'];
const output = `docs/qa/performance/${label}`;
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.addInitScript(() => {
  window.chapterEvents = [];
  window.chapterTasks = [];
  new PerformanceObserver(list => list.getEntries().forEach(e => {
    if (e.interactionId) window.chapterEvents.push({ name: e.name, start: e.startTime, duration: e.duration, processing: e.processingEnd - e.processingStart, inputDelay: e.processingStart - e.startTime, target: e.target?.textContent?.slice(0, 100), interactionId: e.interactionId });
  })).observe({ type: 'event', buffered: true, durationThreshold: 16 });
  new PerformanceObserver(list => list.getEntries().forEach(e => window.chapterTasks.push({ start: e.startTime, duration: e.duration }))).observe({ type: 'longtask', buffered: true });
});
try {
  await page.goto(url);
  await page.locator('canvas').waitFor();
  await page.waitForTimeout(4000);
  if (recording) {
    // Recorder begins at the Apollo surface; reach that state through the public UI.
    await page.locator('.archive-index-trigger').click();
    await page.getByRole('button', { name: /APOLLO 11/ }).click();
    await page.waitForTimeout(2200);
    await page.locator('.discovery-dock [data-artifact="footprints"]').click();
    await page.getByRole('region', { name: 'Artifact inspection' }).waitFor();
    await page.keyboard.press('Escape');
  }
  const cdp = await page.context().newCDPSession(page);
  const results = [];
  for (const chapter of order) {
    const start = await page.evaluate(() => performance.now());
    await page.getByRole('button', { name: /ARCHIVE \/ / }).click();
    await page.waitForTimeout(250);
    await cdp.send('Profiler.enable');
    await cdp.send('Profiler.start');
    await page.getByRole('button', { name: new RegExp(chapter) }).click();
    await page.waitForTimeout(2200);
    const { profile } = await cdp.send('Profiler.stop');
    const name = `${results.length + 1}-${chapter.replaceAll(' ', '-')}`;
    await writeFile(`${output}/${name}.cpuprofile`, JSON.stringify(profile));
    await page.screenshot({ path: `${output}/${name}.png` });
    results.push({ chapter, ...await page.evaluate(start => ({ events: window.chapterEvents.filter(e => e.start >= start), longTasks: window.chapterTasks.filter(e => e.start >= start), resources: performance.getEntriesByType('resource').filter(e => e.startTime >= start && /models|textures|draco/.test(e.name)).map(e => ({ name: e.name, duration: e.duration, bytes: e.transferSize })), marks: performance.getEntriesByType('measure').filter(e => e.startTime >= start).map(e => ({ name: e.name, duration: e.duration })) }), start) });
  }
  await writeFile(`${output}/results.json`, JSON.stringify({ browser: browser.version(), url, viewport, deviceScaleFactor: 1, reducedMotion: true, recording: recording?.title, errors, results }, null, 2));
  console.log(JSON.stringify(results.map(r => ({ chapter: r.chapter, interactionMs: Math.max(0, ...r.events.filter(e => e.target?.includes(r.chapter)).map(e => e.duration)), maxLongTask: Math.max(0, ...r.longTasks.map(t => t.duration)), preparation: r.marks })), null, 2));
  if (errors.length) throw new Error(errors.join('\n'));
} finally { await browser.close(); }
