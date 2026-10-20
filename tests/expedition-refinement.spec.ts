import { test, expect } from '@playwright/test';

test('desktop mission questions, terrain views, Apollo map removal and forward routes', async ({ page }) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  const select = async (name: string) => {
    await page.locator('.archive-index-trigger').click();
    await page.locator('#archive-index').getByRole('button', { name: new RegExp(name) }).click();
  };
  await select('APOLLO');
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'lunar', { timeout: 30000 });
  await expect(page.locator('.minimap')).toHaveCount(0);
  await expect(page.locator('.archive-index-trigger')).toContainText('EXPLORE OTHER MISSIONS');
  await page.locator('canvas').evaluate(el => el.setAttribute('data-original', 'yes'));
  for (const [name, world] of [['SOJOURNER', 'mars'], ['SPIRIT', 'spirit'], ['OPPORTUNITY', 'opportunity'], ['VOYAGER', 'voyager']]) {
    await select(name);
    await expect(page.locator('canvas')).toHaveAttribute('data-world', world, { timeout: 30000 });
    const q = page.getByTestId('miso-question');
    const first = await q.innerText();
    await expect(page.locator('.mission-question .quiz-options button')).toHaveCount(3);
    await page.locator('.mission-question .quiz-options button').first().click();
    await expect(page.locator('.mission-question [role=status] a')).toHaveAttribute('href', /nasa.gov/);
    await page.screenshot({ path: `docs/qa/revision-${world}-question.png` });
    await page.getByRole('button', { name: 'Let’s explore', exact: true }).click();
    await expect(page.locator('.mission-question')).toHaveCount(0);
    await expect(page.locator('.mars-approach .action, .discovery-dock button').first()).toBeFocused();
    await page.screenshot({ path: `docs/qa/revision-${world}-surface.png` });
    await select('APOLLO');
    await select(name);
    await expect(q).not.toHaveText(first);
    await page.keyboard.press('Escape');
    await expect(page.locator('.mission-question')).toHaveCount(0);
  }
  await select('SOJOURNER');
  await page.getByRole('button', { name: 'Explore without answering' }).click();
  await page.getByText('Fly to another site', { exact: true }).click();
  await page.getByRole('button', { name: 'Fly to Gusev Crater' }).click();
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'shuttle', { timeout: 30000 });
  await expect(page.locator('.route-map')).toHaveAttribute('aria-label', /Destination is at the top/);
  const before = await page.getByTestId('route-marker').getAttribute('transform');
  await page.getByRole('button', { name: 'Cruise assist off' }).click();
  await expect.poll(() => page.getByTestId('route-marker').getAttribute('transform')).not.toBe(before);
  await page.getByRole('button', { name: 'Pause journey', exact: true }).click();
  await page.screenshot({ path: 'docs/qa/revision-forward-route.png' });
  await page.getByRole('button', { name: 'Skip travel', exact: true }).click();
  await page.getByRole('button', { name: 'Explore without answering' }).click();
  await page.getByText('Fly to another site', { exact: true }).click();
  await page.getByRole('button', { name: 'Fly to Ares Vallis' }).click();
  await expect(page.locator('.route-map')).toHaveAttribute('aria-label', /from Gusev Crater to Ares Vallis/);
  await page.getByRole('button', { name: 'Return to departure' }).click();
  await expect(page.locator('canvas')).toHaveAttribute('data-original', 'yes');
  await expect(page.locator('canvas')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('desktop reduced motion keeps questions optional and regional labels readable', async ({ page }) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  for (const name of ['SOJOURNER', 'SPIRIT', 'OPPORTUNITY', 'VOYAGER']) {
    await page.locator('.archive-index-trigger').click();
    await page.locator('#archive-index').getByRole('button', { name: new RegExp(name) }).click();
    await expect(page.getByTestId('miso-question')).toBeVisible();
    await page.getByRole('button', { name: 'Explore without answering' }).click();
    await expect(page.locator('canvas')).toHaveAttribute('aria-busy', 'false', { timeout: 30000 });
    if (name !== 'VOYAGER') await expect(page.locator('.minimap text').filter({ hasText: 'Ares Vallis' })).toBeVisible();
    await page.screenshot({ path: `docs/qa/revision-${name.toLowerCase()}-reduced.png` });
  }
});
