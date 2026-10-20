import { test, expect, type Page } from '@playwright/test';

async function launch(page: Page) {
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'museum', { timeout: 30000 });
  await page.locator('canvas').evaluate(el => el.setAttribute('data-original', 'yes'));
  await page.getByRole('navigation', { name: 'Five missions' }).getByRole('button', { name: /Sojourner/ }).click();
  await page.getByRole('button', { name: 'Explore Sojourner', exact: true }).click();
}

test('Moon departure and spaceflight hand over to a manual Mars landing and hardware', async ({ page }) => {
  test.setTimeout(150000);
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await launch(page);
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'lunar', { timeout: 30000 });
  await page.keyboard.press('Escape');
  const progress = await page.locator('.travel-line i').getAttribute('style');
  await page.waitForTimeout(250);
  await expect(page.locator('.travel-line i')).toHaveAttribute('style', progress!);
  await page.keyboard.press('Escape');
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'transit', { timeout: 30000 });
  await expect(page.locator('.experience')).toHaveClass(/stage-mars-landing/, { timeout: 30000 });
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'mars', { timeout: 30000 });
  const flight = page.getByLabel('Flight controls');
  await expect(page.getByRole('button', { name: 'Enable flight assist' })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.minimap')).toHaveCount(0);
  await expect.poll(async () => Number(await flight.getAttribute('data-altitude'))).toBeLessThan(99.5);
  await page.keyboard.down('KeyW');
  await expect.poll(async () => Number(await flight.getAttribute('data-z')), { timeout: 20000 }).toBeLessThan(2);
  await page.keyboard.up('KeyW');
  await expect.poll(async () => Number(await flight.getAttribute('data-altitude')), { timeout: 40000 }).toBeLessThan(15);
  await page.keyboard.down('Space');
  await page.getByRole('button', { name: 'Skip walk', exact: true }).waitFor({ timeout: 40000 });
  await page.getByRole('button', { name: 'Skip walk', exact: true }).click();
  await page.keyboard.up('Space');
  await expect(page.locator('.mars-dock')).not.toContainText('Sojourner');
  await page.locator('.mars-dock [data-artifact="sojourner"]').click();
  await expect(page.getByRole('heading', { name: 'Sojourner', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Solar array/ }).click();
  await expect(page.locator('.part-poster')).toContainText('Solar cells');
  await page.keyboard.press('Escape');
  await expect.poll(()=>page.evaluate(()=>document.activeElement?.getAttribute('data-artifact'))).toBe('sojourner');
  await expect(page.locator('canvas')).toHaveAttribute('data-original', 'yes');
  await expect(page.locator('canvas')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('Mars missed landing retries, pauses, and lands with assist', async ({ page }) => {
  test.setTimeout(120000);
  await launch(page);
  await page.getByRole('button', { name: 'Skip travel', exact: true }).click();
  await page.getByRole('button', { name: 'Retry landing' }).waitFor({ timeout: 60000 });
  await expect(page.getByRole('alert')).toContainText('Outside the landing zone');
  await page.getByRole('button', { name: 'Retry landing' }).click();
  const flight = page.getByLabel('Flight controls');
  await expect.poll(async () => Number(await flight.getAttribute('data-altitude'))).toBeGreaterThan(90);
  await page.keyboard.press('Escape');
  const altitude = await flight.getAttribute('data-altitude');
  await page.waitForTimeout(300);
  await expect(flight).toHaveAttribute('data-altitude', altitude!);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Enable flight assist' }).click();
  await page.getByRole('button', { name: 'Skip walk', exact: true }).waitFor({ timeout: 60000 });
  await page.getByRole('button', { name: 'Skip walk', exact: true }).click();
  await expect(page.locator('canvas')).toHaveAttribute('data-original', 'yes');
});

test('reduced motion keeps the landing playable; skip and navigation cancel cleanly', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await launch(page);
  await expect(page.getByLabel('Travel to Mars')).toHaveCount(0);
  await expect(page.getByLabel('Flight controls')).toBeVisible();
  await page.getByRole('button', { name: 'Skip landing', exact: true }).click();if(await page.getByRole('button',{name:'Skip walk',exact:true}).isVisible())await page.getByRole('button',{name:'Skip walk',exact:true}).click();
  await expect(page.locator('.mars-dock')).toBeVisible();
  await page.getByRole('button', { name: 'MUSEUM', exact: true }).click();
  await expect(page.locator('.museum-model-label h2')).toHaveText('Sojourner');
  await page.getByRole('button', { name: 'Explore Sojourner model', exact: true }).click();
  await expect(page.getByLabel('Flight controls')).toBeVisible();
  await page.locator('.archive-index-trigger').click();
  await page.locator('#archive-index').getByRole('button', { name: /APOLLO/ }).click();
  await expect(page.locator('.experience')).toHaveClass(/stage-explore/);
  await expect(page.getByLabel('Flight controls')).toHaveCount(0);
  await expect(page.locator('canvas')).toHaveAttribute('data-original', 'yes');
});
