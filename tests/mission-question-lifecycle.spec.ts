import { test, expect } from '@playwright/test';

for (const reduced of [false, true]) {
  test(`questions stay dismissed through exploration and inspection (${reduced ? 'reduced' : 'normal'} motion)`, async ({ page }) => {
    test.setTimeout(180000);
    await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
    await page.goto('/');
    const select = async (name: string) => {
      await page.locator('.archive-index-trigger').click();
      await page.locator('#archive-index').getByRole('button', { name: new RegExp(name, 'i') }).click();
    };
    for (const chapter of ['sojourner', 'spirit', 'opportunity', 'voyager']) {
      await select(chapter);
      await expect(page.locator('canvas')).toHaveAttribute('aria-busy', 'false', { timeout: 60000 });
      const question = page.getByTestId('miso-question');
      await expect(question).toHaveCount(0);
      // Approach first; the optional question follows arrival.
      await page.locator('.mars-approach .action').click();
      if (chapter !== 'voyager' && !reduced) {
        await expect(question).toHaveCount(0);
        await page.getByRole('button', { name: 'Skip walk', exact: true }).click();
      }
      await expect(question).toBeVisible();
      await page.getByRole('button', { name: 'Explore without answering' }).click();
      await expect(question).toHaveCount(0);
      await page.locator(`.discovery-dock [data-artifact="${chapter}"]`).click();
      await expect(page.getByRole('button', { name: 'Reset view', exact: true })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('button', { name: 'Reset view', exact: true })).toHaveCount(0);
      await expect(question).toHaveCount(0);
      await expect.poll(() => page.evaluate(() => document.activeElement?.getAttribute('data-artifact'))).toBe(chapter);
      // A completed approach stays complete on revisit without an opening interruption.
      await select('apollo');
      await select(chapter);
      await expect(question).toHaveCount(0);
      await page.locator(`.discovery-dock [data-artifact="${chapter}"]`).click();
      await expect(page.getByRole('button', { name: 'Reset view', exact: true })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('button', { name: 'Reset view', exact: true })).toHaveCount(0);
      await expect(question).toHaveCount(0);
    }
  });
}
