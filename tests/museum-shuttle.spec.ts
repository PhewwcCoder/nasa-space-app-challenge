import { test, expect, type Page } from '@playwright/test';

async function select(page: Page, chapter: string) {
  await page.locator('.archive-index-trigger').click();
  await page.locator('#archive-index').getByRole('button', { name: new RegExp(chapter) }).click();
}
test('museum has five real exhibits, remembers scroll, and preserves the canvas', async ({ page }) => {
  test.setTimeout(100000);
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'museum', { timeout: 30000 });
  await page.locator('canvas').evaluate(el => el.setAttribute('data-original', 'yes'));
  await expect(page.getByRole('navigation', { name: 'Five missions' }).getByRole('button')).toHaveCount(5);
  for (const name of ['Sojourner', 'Spirit', 'Opportunity', 'Voyager 1', 'Apollo 11']) {
    await page.getByRole('navigation', { name: 'Five missions' }).getByRole('button', { name, exact: false }).click();
    await expect(page.locator('.museum-model-label h2')).toHaveText(name);
    await expect(page.locator('.museum-exhibit').filter({ has: page.getByRole('button', { name: `Explore ${name}`, exact: true }) }).getByRole('link')).toHaveAttribute('href', /nasa.gov/);
  }
  await page.getByRole('navigation', { name: 'Five missions' }).getByRole('button', { name: /Sojourner/ }).click();
  await page.getByRole('button', { name: 'Explore Sojourner', exact: true }).click();
  await page.getByRole('button', { name: 'Skip landing', exact: true }).waitFor({timeout:60000});
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'mars', { timeout: 30000 });
  await page.getByRole('button', { name: 'MUSEUM', exact: true }).click();
  await expect(page.locator('.museum-model-label h2')).toHaveText('Sojourner');
  await expect(page.getByRole('button', { name: 'Explore Sojourner', exact: true })).toBeInViewport();
  await expect(page.locator('canvas')).toHaveAttribute('data-original', 'yes');
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.screenshot({ path: `docs/qa/museum-${test.info().project.name}.png` });
  expect(errors).toEqual([]);
});

test('map supports reversible shuttle travel, pause, and saved evidence', async ({ page }, info) => {
  test.setTimeout(120000);
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await select(page, 'APOLLO');
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'lunar', { timeout: 30000 });
  await expect(page.locator('.minimap')).toHaveCount(0);
  await page.locator('.discovery-dock [data-artifact="footprints"]').click();
  await expect(page.locator('.minimap')).toHaveCount(0);
  await page.getByRole('button', { name: 'Save discovery', exact: true }).click();
  await select(page, 'SOJOURNER');
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'mars', { timeout: 30000 });
  await expect(page.getByRole('complementary', { name: 'Expedition minimap' })).toBeVisible();
  await expect(page.getByTestId('coordinates')).toHaveText('19.47\u00b0 N / 326.75\u00b0 E');
  if (await page.getByRole('button', { name: 'Explore without answering' }).isVisible()) await page.getByRole('button', { name: 'Explore without answering' }).click();
  await page.getByText('Fly to another site', { exact: true }).click();
  await page.getByRole('button', { name: /Fly to Gusev Crater/ }).click();
  if (info.project.name === 'mobile-reduced') {
    await expect(page.locator('canvas')).toHaveAttribute('data-world', 'spirit', { timeout: 30000 });
  } else {
    await expect(page.locator('canvas')).toHaveAttribute('data-world', 'shuttle', { timeout: 30000 });
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0');
    const before = await page.getByTestId('coordinates').innerText();
    await page.keyboard.down('KeyW'); await page.keyboard.down('KeyD');
    await expect.poll(() => page.getByTestId('coordinates').innerText()).not.toBe(before);
    await page.keyboard.up('KeyW'); await page.keyboard.up('KeyD');
    await page.getByRole('button', { name: 'Cruise assist off' }).click();
    await expect.poll(async () => Number(await page.getByRole('progressbar').getAttribute('value'))).toBeGreaterThan(.02);
    await page.getByRole('button', { name: 'Pause journey', exact: true }).click();
    const p = await page.getByRole('progressbar').getAttribute('value'); await page.waitForTimeout(300);
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', p!);
    await page.screenshot({ path: 'docs/qa/shuttle-desktop.png' });
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Pause journey' })).toBeVisible();
    await page.getByRole('button', { name: 'Skip journey', exact: true }).click();
    await expect(page.locator('canvas')).toHaveAttribute('data-world', 'spirit', { timeout: 30000 });
  }
  if (await page.getByRole('button', { name: 'Explore without answering' }).isVisible()) await page.getByRole('button', { name: 'Explore without answering' }).click();
  await page.getByText('Fly to another site', { exact: true }).click();
  await expect(page.getByTestId('coordinates')).toHaveText('14.57° S / 175.48° E');
  await page.screenshot({ path: `docs/qa/flight-map-${info.project.name}.png` });
  await page.getByRole('button', { name: /Fly to Ares Vallis/ }).click();
  if (info.project.name !== 'mobile-reduced') await page.getByRole('button', { name: 'Skip journey', exact: true }).click();
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'mars', { timeout: 30000 });
  if (await page.getByRole('button', { name: 'Explore without answering' }).isVisible()) await page.getByRole('button', { name: 'Explore without answering' }).click();
  await page.getByText('Fly to another site', { exact: true }).click();
  await page.getByRole('button', { name: /Fly to Meridiani Planum/ }).click();
  if (info.project.name !== 'mobile-reduced') {
    await expect(page.locator('canvas')).toHaveAttribute('data-world', 'shuttle', { timeout: 30000 });
    await page.getByRole('button', { name: 'Cruise assist off' }).click();
  }
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'opportunity', { timeout: 45000 });
  await select(page, 'VOYAGER');
  await expect(page.getByRole('complementary', { name: 'Expedition minimap' })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await select(page, 'APOLLO');
  await expect(page.getByTestId('coordinates')).toHaveCount(0);
  await page.keyboard.press('Escape');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await expect(page.getByRole('button', { name: 'NOTEBOOK' })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(1); expect(errors).toEqual([]);
});

test('touch thrust releases cleanly and flight can return to departure', async ({ page, context }, info) => {
  test.skip(info.project.name !== 'mobile-reduced', 'Dedicated touch flight check');
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/'); await select(page, 'SOJOURNER');
  if (await page.getByRole('button', { name: 'Explore without answering' }).isVisible()) await page.getByRole('button', { name: 'Explore without answering' }).click();
  await page.getByText('Fly to another site', { exact: true }).click();
  await page.getByRole('button', { name: /Fly to Gusev Crater/ }).click();
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'shuttle', { timeout: 30000 });
  const box = (await page.getByRole('button', { name: 'Thrust', exact: true }).boundingBox())!;
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }] });
  await expect.poll(async () => Number(await page.getByRole('progressbar').getAttribute('value'))).toBeGreaterThan(.02);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  // Releasing thrust now coasts to a stop; the surface course has inertia.
  await expect.poll(async()=>parseFloat(await page.locator('.surface-telemetry>span').first().innerText())).toBe(0);
  const p = await page.getByRole('progressbar').getAttribute('value');
  await page.waitForTimeout(250); await expect(page.getByRole('progressbar')).toHaveAttribute('value', p!);
  await page.screenshot({ path: 'docs/qa/shuttle-mobile-touch.png' });
  await page.getByRole('button', { name: 'Return to departure', exact: true }).click();
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'mars', { timeout: 30000 });
  await expect(page.locator('canvas')).toHaveCount(1);
  await cdp.detach();
});

 test('gallery model and Explore button both start the Moon landing', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'museum', { timeout: 30000 });
  await page.getByRole('button', { name: 'Explore Apollo 11 model', exact: true }).click();
  await expect(page.getByLabel('Flight controls')).toBeVisible();
  await page.getByRole('button', { name: 'MUSEUM', exact: true }).click();
  await page.getByRole('button', { name: 'Explore Apollo 11', exact: true }).click();
  await expect(page.getByLabel('Flight controls')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(1);
 });

test('inspection opens directly and its minimap does not cover the lesson', async ({ page }) => {
  await page.goto('/'); await select(page, 'SOJOURNER');
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'mars', { timeout: 30000 });
  await page.getByRole('button', { name: /Approach/ }).click();if(await page.getByRole('button',{name:'Skip walk',exact:true}).isVisible())await page.getByRole('button',{name:'Skip walk',exact:true}).click();
  await page.locator('.mars-dock [data-artifact="airbags"]').click();
  await expect(page.getByRole('button', { name: 'Scan object', exact: true })).toHaveCount(0);
  const map = page.getByRole('complementary', { name: 'Expedition minimap' });
  await expect(map).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reconstruct the landing' })).toBeVisible();
  const m = (await map.boundingBox())!, note = (await page.locator('.mars-note').boundingBox())!;
  expect(m.x + m.width).toBeLessThan(note.x);
  expect(m.y + m.height).toBeGreaterThan(840);
  expect(m.y).toBeGreaterThan(600);
  await page.screenshot({path: "docs/qa/map-evidence-bottom-left.png"});
  await page.keyboard.press('Escape');
  await expect(page.locator('.mars-dock [data-artifact="airbags"]')).toBeFocused();
});
