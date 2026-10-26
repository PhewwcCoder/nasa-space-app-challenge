import { test, expect, type Page } from '@playwright/test';

async function ready(page: Page, world: string) {
  await expect(page.locator('canvas')).toHaveAttribute('data-world', world, { timeout: 60000 });
  await expect(page.locator('canvas')).toHaveAttribute('aria-busy', 'false', { timeout: 60000 });
}
async function select(page: Page, name: string) {
  await page.locator('.archive-index-trigger').click();
  await page.locator('#archive-index').getByRole('button', { name: new RegExp(name) }).click();
}
async function arrive(page: Page) {
  await page.goto('/'); await ready(page, 'museum');
  await select(page, 'SOJOURNER'); await ready(page, 'mars');
  await page.getByRole('button', { name: 'Skip landing', exact: true }).click();
  await page.getByRole('button', { name: 'Skip walk', exact: true }).click();
  await page.getByRole('button', { name: 'Explore without answering' }).click();
}

test('selecting Chapter 3 or 4 during a shuttle journey opens the chosen chapter', async ({ page }) => {
  test.setTimeout(150000);
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await arrive(page);
  for (const [route, destination, world] of [['SPIRIT', 'SPIRIT', 'spirit'], ['SOJOURNER', 'OPPORTUNITY', 'opportunity']]) {
    await select(page, route); await ready(page, 'shuttle');
    await page.getByRole('button', { name: 'Pause journey', exact: true }).click();
    await select(page, destination);
    await expect(page.locator('.experience')).toHaveClass(new RegExp(`stage-${world}`), { timeout: 8000 });
    await ready(page, world);
    await expect(page.getByRole('region', { name: 'Mars shuttle flight' })).toHaveCount(0);
    await expect(page.locator('#archive-index')).not.toBeVisible();
  }
  await expect(page.locator('canvas')).toHaveCount(1); expect(errors).toEqual([]);
});

test('journey map skip, enlarged instructions and selector cancellation preserve travel', async ({ page }) => {
  test.setTimeout(120000);
  await arrive(page); await select(page, 'SPIRIT'); await ready(page, 'shuttle');
  await expect(page.locator('.shuttle-map')).not.toContainText('Not rover telemetry');
  const skip = page.locator('.shuttle-map').getByRole('button', { name: 'Skip journey', exact: true });
  await expect(skip).toBeVisible();
  await expect(skip).toHaveCSS('font-size', '16px');
  await expect(page.locator('.shuttle-keyboard-hint')).toHaveCSS('font-size', '16px');
  for (const viewport of [{ width: 1920, height: 1080 }, { width: 1366, height: 768 }]) {
    await page.setViewportSize(viewport);
    await expect(skip).toBeInViewport();
    await expect(page.locator('.shuttle-keyboard-hint')).toBeInViewport();
    await page.screenshot({ path: `docs/qa/journey-controls-${viewport.width}.png` });
  }
  await page.locator('.archive-index-trigger').click();
  await expect(page.getByRole('button', { name: 'Resume journey', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Pause journey', exact: true })).toBeVisible();
  await page.keyboard.down('KeyW');
  await expect.poll(async () => Number(await page.getByRole('progressbar').getAttribute('value'))).toBeGreaterThan(0);
  await page.keyboard.up('KeyW');
  await page.getByRole('button', { name: 'Pause journey', exact: true }).click();
  await skip.focus(); await page.keyboard.press('Enter'); await ready(page, 'spirit');
  await expect(page.getByRole('region', { name: 'Mars shuttle flight' })).toHaveCount(0);
  await select(page, 'OPPORTUNITY'); await ready(page, 'shuttle');
  await page.getByRole('button', { name: 'Skip journey', exact: true }).click(); await ready(page, 'opportunity');
  await select(page, 'SOJOURNER'); await ready(page, 'shuttle');
  await page.getByRole('button', { name: 'Return to departure', exact: true }).click(); await ready(page, 'opportunity');
});

test('hardware separation sits below each name and still toggles with component controls', async ({ page }) => {
  test.setTimeout(180000); await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await ready(page, 'museum');
  for (const [name, world, artifact] of [['Sojourner','mars','sojourner'],['Spirit','spirit','spirit'],['Opportunity','opportunity','opportunity'],['Voyager 1','voyager','voyager']]) {
    await page.getByRole('navigation', { name: 'Five missions' }).getByRole('button', { name: new RegExp(name) }).click();
    await page.getByRole('button', { name: `Explore ${name}`, exact: true }).click(); await ready(page, world);
    if (artifact !== 'voyager') await page.getByRole('button', { name: 'Skip landing', exact: true }).click();
    else await page.locator('.mars-approach .action').click();
    await page.getByRole('button', { name: 'Explore without answering' }).click();
    await page.locator(`.discovery-dock [data-artifact="${artifact}"]`).click();
    const button = page.getByRole('button', { name: 'Separate hardware', exact: true });
    await expect(button).toHaveCount(1); await expect(button).toHaveCSS('font-size','16px');
    const title = await page.locator('.investigation-title h2').boundingBox(), box = await button.boundingBox();
    expect(box!.y - title!.y - title!.height).toBeGreaterThanOrEqual(12);
    expect(Math.abs(box!.x - title!.x)).toBeLessThan(2);
    await page.screenshot({ path: `docs/qa/hardware-action-${artifact}.png` });
    await button.click(); await expect(page.getByRole('button', { name: 'Assemble hardware', exact: true })).toHaveAttribute('aria-pressed','true');
    await page.getByRole('navigation', { name: 'Hardware components' }).getByRole('button').first().click();
    await expect(page.locator('.part-poster')).toBeVisible();
    await page.getByRole('button', { name: 'Assemble hardware', exact: true }).click();
    await expect(button).toHaveAttribute('aria-pressed','false');
    await page.getByRole('button', { name: 'Reset view', exact: true }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('region', { name: 'Artifact inspection' })).toHaveCount(0);
    await page.getByRole('button', { name: 'MUSEUM', exact: true }).click(); await ready(page, 'museum');
  }
  await expect(page.locator('canvas')).toHaveCount(1); expect(errors).toEqual([]);
});
