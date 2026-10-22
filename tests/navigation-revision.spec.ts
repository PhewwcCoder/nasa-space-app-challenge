import { test, expect, type Page } from '@playwright/test';

async function select(page: Page, name: string) {
  await page.locator('.archive-index-trigger').click();
  await page.locator('#archive-index').getByRole('button', { name: new RegExp(name) }).click();
}
async function ready(page: Page, world: string) {
  await expect(page.locator('canvas')).toHaveAttribute('data-world', world, { timeout: 45000 });
  await expect(page.locator('canvas')).toHaveAttribute('aria-busy', 'false', { timeout: 45000 });
}
async function observeScene(page: Page) {
  await page.evaluate(async () => {
    const url = performance.getEntriesByType('resource').find(e => e.name.includes('/@react-three_fiber.js'))!.name;
    const fiber = await import(/* @vite-ignore */ url);
    const root = fiber._roots.get(document.querySelector('canvas')).store.getState();
    const render = root.gl.render.bind(root.gl);
    root.gl.render = (scene: any, camera: any) => { (window as any).navigationScene = scene; render(scene, camera); };
  });
}

test('landing instruments agree with rendered Moon and Mars positions', async ({ page }) => {
  test.setTimeout(150000);
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await ready(page, 'museum'); await observeScene(page);
  for (const mars of [false, true]) {
    await select(page, mars ? 'SOJOURNER' : 'APOLLO');
    if (mars) await page.getByRole('button', { name: 'Skip travel', exact: true }).click();
    await ready(page, mars ? 'mars' : 'lunar');
    await expect(page.getByLabel('Landing map')).toBeVisible();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Pause flight', exact: true }).click();
    const actual = await page.evaluate(() => {
      const craft = (window as any).navigationScene.getObjectByName('landing-craft');
      return { x: craft.position.x, y: craft.position.y, z: craft.position.z };
    });
    const map = page.getByLabel('Landing map');
    const x = Number(await map.getAttribute('data-x')), z = Number(await map.getAttribute('data-z'));
    expect(Math.abs(x - (actual.x - (mars ? 10 : 0)))).toBeLessThan(.8);
    expect(Math.abs(z - (actual.z - (mars ? 4 : 0)))).toBeLessThan(1.5);
    expect(Math.abs(Number(await page.getByLabel('Flight controls').getAttribute('data-height')) - actual.y)).toBeLessThan(.5);
    expect(Number(await map.getAttribute('data-range'))).toBeGreaterThan(80);
    await expect(map).not.toContainText('OVER THE RING');
    const before = Number(await map.getAttribute('data-range'));
    await page.screenshot({ path: `docs/qa/navigation-${mars ? 'mars' : 'moon'}-approach.png` });
    await page.getByRole('button', { name: 'Resume flight', exact: true }).first().click();
    await page.keyboard.down('KeyW'); await page.waitForTimeout(1500); await page.keyboard.up('KeyW');
    expect(Number(await map.getAttribute('data-range'))).toBeLessThan(before - 5);
  }
  expect(errors).toEqual([]);
});

test('Moon map disappears at touchdown and stays absent during walking and exploration', async ({ page }) => {
  test.setTimeout(160000);
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await ready(page, 'museum'); await observeScene(page);
  await page.getByRole('button', { name: 'Explore Apollo 11', exact: true }).click(); await ready(page, 'lunar');
  await page.getByRole('button', { name: 'Enable flight assist' }).click();
  await expect(page.getByRole('button', { name: 'Skip walk', exact: true })).toBeVisible({ timeout: 90000 });
  await expect(page.getByLabel('Landing map')).toHaveCount(0);
  await expect(page.getByLabel('Expedition minimap')).toHaveCount(0);
  await page.keyboard.down('KeyW'); await page.waitForTimeout(1500); await page.keyboard.up('KeyW');
  await expect(page.getByLabel('Expedition minimap')).toHaveCount(0);
  expect(await page.evaluate(() => !!(window as any).navigationScene.getObjectByName('nasa-bangladesh-patch'))).toBe(true);
  await page.screenshot({ path: 'docs/qa/navigation-moon-walk-patch.png' });
  await page.getByRole('button', { name: 'Skip walk', exact: true }).click();
  await page.getByRole('button', { name: 'Explore the hardware', exact: true }).click();
  await page.getByRole('button', { name: 'Explore without answering' }).click();
  await page.locator('.discovery-dock [data-artifact="eagle"]').click();
  await expect(page.getByLabel('Expedition minimap')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.getByLabel('Expedition minimap')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.activeElement?.getAttribute('data-artifact'))).toBe('eagle');
  await page.waitForTimeout(1600);
  await page.screenshot({ path: 'docs/qa/navigation-moon-surface.png' }); expect(errors).toEqual([]);
});

test('desktop reduced motion omits takeoff and keeps Apollo landing and museum restoration', async ({ page }) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/'); await ready(page, 'museum');
  await page.getByRole('navigation', { name: 'Five missions' }).getByRole('button', { name: /Spirit/ }).click();
  for (const [name, world] of [['SOJOURNER', 'mars'], ['SPIRIT', 'spirit'], ['OPPORTUNITY', 'opportunity'], ['VOYAGER', 'voyager']]) {
    await select(page, name); await ready(page, world); await expect(page.locator('.travel-hud')).toHaveCount(0);
  }
  await select(page, 'APOLLO'); await ready(page, 'lunar'); await expect(page.getByLabel('Landing map')).toBeVisible();
  await page.getByRole('button', { name: 'MUSEUM', exact: true }).click();
  await expect(page.locator('.museum-model-label h2')).toHaveText('Spirit');
  await expect(page.getByRole('button', { name: 'Explore Spirit', exact: true })).toBeInViewport();
});
