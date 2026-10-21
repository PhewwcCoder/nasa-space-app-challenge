import { test, expect } from '@playwright/test';

test('astronaut walks in all three Mars chapters, pauses, skips and preserves inspection', async ({ page }) => {
  test.setTimeout(150000);
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'museum', { timeout: 30000 });
  await page.locator('canvas').evaluate(el => el.setAttribute('data-walk-original', 'yes'));
  for (const [chapter, id, world] of [['SOJOURNER', 'sojourner', 'mars'], ['SPIRIT', 'spirit', 'spirit'], ['OPPORTUNITY', 'opportunity', 'opportunity']]) {
    await page.locator('.archive-index-trigger').click();
    await page.locator('#archive-index').getByRole('button', { name: new RegExp(chapter) }).click();
    await expect(page.locator('canvas')).toHaveAttribute('data-world', world, { timeout: 30000 });
    await page.locator('.mars-approach .action').click();
    const walk = page.getByRole('region', { name: 'Walk toward the Mars rover' });
    // The named section is exposed as a region.
    await expect(walk).toBeVisible();
    await expect(page.locator('.minimap')).toHaveCount(0);
    await page.keyboard.down('KeyW');
    await expect.poll(async () => Number(await walk.getAttribute('data-progress'))).toBeGreaterThan(.2);
    await page.keyboard.up('KeyW');
    const stopped = await walk.getAttribute('data-progress');
    await page.waitForTimeout(250);
    await expect(walk).toHaveAttribute('data-progress', stopped!);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Resume walk' })).toBeVisible();
    await page.keyboard.down('KeyW'); await page.waitForTimeout(200); await page.keyboard.up('KeyW');
    await expect(walk).toHaveAttribute('data-progress', stopped!);
    await page.screenshot({ path: `docs/qa/walk-${id}-desktop.png` });
    await page.getByRole('button', { name: 'Resume walk' }).click();
    if (id === 'sojourner') {
      await page.keyboard.down('ArrowUp');
      await expect(walk).toHaveCount(0, { timeout: 20000 });
      await page.keyboard.up('ArrowUp');
    } else {
      const button = page.getByRole('button', { name: 'Hold to walk' });
      const box = (await button.boundingBox())!;
      await page.mouse.move(box.x + 20, box.y + 20); await page.mouse.down();
      await expect.poll(async () => Number(await walk.getAttribute('data-progress'))).toBeGreaterThan(Number(stopped));
      await page.mouse.up();
      await page.getByRole('button', { name: 'Skip walk', exact: true }).click();
    }
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `docs/qa/walk-arrived-${id}.png` });
    await page.locator(`.discovery-dock [data-artifact="${id}"]`).click();
    await expect(page.getByRole('button', { name: 'Reset view', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect.poll(() => page.evaluate(() => document.activeElement?.getAttribute('data-artifact'))).toBe(id);
    await expect(page.locator('canvas')).toHaveAttribute('data-walk-original', 'yes');
  }
  expect(errors).toEqual([]);
});

test('Mars walking cancels on departure and reduced motion reaches the rover directly', async ({ page }) => {
  await page.goto('/');
  await page.locator('.archive-index-trigger').click();
  await page.locator('#archive-index').getByRole('button', { name: /SPIRIT/ }).click();
  await page.locator('.mars-approach .action').click();
  await page.keyboard.down('KeyW');
  await page.getByRole('button', { name: 'MUSEUM', exact: true }).click();
  await page.keyboard.up('KeyW');
  await expect(page.locator('.mars-walk-prompt')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.archive-index-trigger').click();
  await page.locator('#archive-index').getByRole('button', { name: /OPPORTUNITY/ }).click();
  await page.locator('.mars-approach .action').click();
  await expect(page.locator('.mars-walk-prompt')).toHaveCount(0);
  await expect(page.locator('.discovery-dock [data-artifact="opportunity"]')).toBeVisible();
});
