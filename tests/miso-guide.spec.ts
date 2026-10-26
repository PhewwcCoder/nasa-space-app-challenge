import { test, expect, type Page } from '@playwright/test';

async function ready(page: Page, world: string) {
  await expect(page.locator('canvas')).toHaveAttribute('data-world', world, { timeout: 60000 });
  await expect(page.locator('canvas')).toHaveAttribute('aria-busy', 'false', { timeout: 60000 });
}

test('Miso welcomes, supports all 12 FAQs, and preserves museum scroll and keyboard focus', async ({ page }) => {
  test.setTimeout(120000);
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await ready(page, 'museum');
  await expect(page.getByLabel('Welcome from Miso')).toContainText('First, let’s look around');
  await expect(page.locator('.miso-welcome-backdrop')).toHaveCSS('backdrop-filter', 'blur(3px)');
  const welcomeBox = await page.getByLabel('Welcome from Miso').boundingBox();
  expect(Math.abs(welcomeBox!.x + welcomeBox!.width / 2 - 720)).toBeLessThan(2);
  expect(Math.abs(welcomeBox!.y + welcomeBox!.height / 2 - 450)).toBeLessThan(2);
  expect((await page.locator('.miso-welcome > img').boundingBox())!.width).toBeGreaterThanOrEqual(180);
  await page.screenshot({ path: 'docs/qa/miso-welcome-desktop.png' });
  await page.getByRole('button', { name: 'Let’s browse the museum', exact: true }).click();
  await expect(page.locator('.miso-welcome-backdrop')).toHaveCount(0);
  await expect(page.locator('.museum-scroll')).toBeFocused();
  await expect(page.getByLabel('Miso museum suggestion')).toHaveCount(0);
  await page.getByRole('navigation', { name: 'Five missions' }).getByRole('button', { name: /Spirit/ }).click();
  await expect(page.getByRole('heading', { name: 'Spirit', level: 1 })).toBeInViewport();
  await expect.poll(() => page.locator('.museum-scroll').evaluate(el => Math.abs(el.scrollTop - (el.querySelectorAll<HTMLElement>('.museum-exhibit')[2].offsetTop)))).toBeLessThan(2);
  const scroll = await page.locator('.museum-scroll').evaluate(el => el.scrollTop);
  await page.getByRole('button', { name: 'Ask Miso', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Ask Miso', exact: true });
  await expect(dialog).toBeVisible();
  const questions = dialog.getByRole('navigation', { name: 'Questions for Miso' }).getByRole('button');
  await expect(questions).toHaveCount(12);
  for (let i = 0; i < 12; i++) {
    await questions.nth(i).click();
    await expect(questions.nth(i)).toHaveAttribute('aria-pressed', 'true');
    await expect(dialog.locator('.miso-answer p')).not.toBeEmpty();
    await expect(dialog.locator('.miso-answer')).toBeInViewport();
  }
  // Native smooth scrolling can settle its final fractional pixel after opening.
  expect(Math.abs(await page.locator('.museum-scroll').evaluate(el => el.scrollTop) - scroll)).toBeLessThan(2);
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.screenshot({ path: 'docs/qa/miso-faq-short-desktop.png' });
  await page.keyboard.press('Tab');
  await expect.poll(() => page.evaluate(() => !!document.activeElement?.closest('#miso-guide'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Ask Miso', exact: true })).toBeFocused();
  // Resize intentionally re-aligns the current exhibit; verify its selection survives.
  await expect(page.getByRole('navigation', { name: 'Five missions' }).getByRole('button', { name: /Spirit/ })).toHaveAttribute('aria-current', 'true');
  expect(scroll).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Keep browsing', exact: true }).click();
  await expect(page.getByLabel('Miso museum suggestion')).toHaveCount(0);
  await page.getByRole('navigation', { name: 'Five missions' }).getByRole('button', { name: /Opportunity/ }).click();
  await expect(page.getByLabel('Miso museum suggestion')).toHaveCount(0);
  await expect(page.getByLabel('Welcome from Miso')).toHaveCount(0);
  await page.reload(); await ready(page, 'museum');
  await page.screenshot({ path: 'docs/qa/miso-welcome-short-desktop.png' });
  await page.locator('.museum-scroll').hover({ position: { x: 450, y: 100 } }); await page.mouse.wheel(0, 350);
  await expect(page.locator('.miso-welcome-backdrop')).toHaveCount(0);
  await expect(page.getByLabel('Welcome from Miso')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('Miso preserves flight pause, introduces Eagle separation, and leaves inspection intact', async ({ page }) => {
  test.setTimeout(180000);
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await ready(page, 'museum');
  await expect(page.getByRole('button', { name: 'Start with Apollo 11', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Let’s browse the museum', exact: true }).click();
  await expect(page.getByLabel('Miso museum suggestion')).toHaveCount(0);
  await page.locator('.museum-scroll').hover(); await page.mouse.wheel(0, 900);
  await expect(page.getByLabel('Miso museum suggestion')).toBeVisible();
  await expect(page.getByLabel('Flight controls')).toHaveCount(0);
  await page.screenshot({ path: 'docs/qa/miso-after-browsing-desktop.png' });
  await page.getByRole('button', { name: 'Show me Apollo 11', exact: true }).click();
  await expect.poll(() => page.locator('.museum-scroll').evaluate(el => el.scrollTop)).toBeLessThan(2);
  await expect(page.getByLabel('Flight controls')).toHaveCount(0);
  await page.getByRole('button', { name: 'Explore with Miso', exact: true }).click();
  await ready(page, 'lunar');
  await page.getByRole('button', { name: 'Pause flight', exact: true }).click();
  await page.getByRole('button', { name: 'Ask Miso', exact: true }).click();
  await expect(page.locator('.miso-answer')).toContainText('You’re landing');
  const height = await page.getByLabel('Flight controls').getAttribute('data-altitude');
  await page.keyboard.press('KeyW');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Resume flight', exact: true }).first()).toBeVisible();
  expect(await page.getByLabel('Flight controls').getAttribute('data-altitude')).toBe(height);
  await page.getByRole('button', { name: 'Resume flight', exact: true }).first().click();
  await page.getByRole('button', { name: 'Ask Miso', exact: true }).click();
  await page.getByRole('button', { name: 'Close Miso guide', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pause flight', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Enable flight assist' }).click();
  await page.getByRole('button', { name: 'Skip walk', exact: true }).click({ timeout: 90000 });
  await page.getByRole('button', { name: 'Explore the hardware', exact: true }).click();
  await page.getByRole('button', { name: 'Explore without answering' }).click();
  await page.locator('.discovery-dock [data-artifact="eagle"]').click();
  const hint = page.getByLabel('Miso exploration tip');
  await expect(hint).toHaveText('Click Separate hardware to see the parts.');
  await expect(page.locator('.miso-eagle-backdrop')).toHaveCSS('backdrop-filter', 'blur(3px)');
  const buttonBox = (await page.getByRole('button', { name: 'Separate hardware', exact: true }).boundingBox())!;
  const hintBox = (await hint.boundingBox())!;
  expect(hintBox.x - buttonBox.x - buttonBox.width).toBeCloseTo(14, 0);
  expect(Math.abs(hintBox.y + hintBox.height / 2 - buttonBox.y - buttonBox.height / 2)).toBeLessThan(2);
  expect(await hint.locator('p').evaluate(el => el.clientHeight)).toBeLessThan(25);
  await page.screenshot({ path: 'docs/qa/miso-eagle-desktop.png' });
  await expect(hint).toHaveCount(0, { timeout: 4000 });
  await expect(page.locator('.miso-eagle-backdrop')).toHaveCount(0);
  await page.getByRole('button', { name: 'Ask Miso', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('region', { name: 'Artifact inspection' })).toBeVisible();
  await page.getByRole('button', { name: 'Separate hardware', exact: true }).click();
  await expect(page.getByLabel('Miso exploration tip')).toHaveCount(0);
  await page.locator('.component-switch button').first().click();
  await expect(page.locator('.part-poster')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect.poll(() => page.evaluate(() => document.activeElement?.getAttribute('data-artifact'))).toBe('eagle');
  await page.locator('.discovery-dock [data-artifact="eagle"]').click();
  await expect(page.getByLabel('Miso exploration tip')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'MUSEUM', exact: true }).click();
  await expect(page.getByLabel('Welcome from Miso')).toHaveCount(0);
  await expect(page.locator('canvas')).toHaveCount(1); expect(errors).toEqual([]);
});

test('later chapters have no automatic tips while questions, inspection and Ask Miso remain', async ({ page }) => {
  test.setTimeout(240000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await ready(page, 'museum');
  for (const [name, world, artifact] of [['Sojourner', 'mars', 'sojourner'], ['Spirit', 'spirit', 'spirit'], ['Opportunity', 'opportunity', 'opportunity'], ['Voyager 1', 'voyager', 'voyager']]) {
    await page.getByRole('navigation', { name: 'Five missions' }).getByRole('button', { name: new RegExp(name) }).click();
    await page.getByRole('button', { name: `Explore ${name}`, exact: true }).click();
    await ready(page, world);
    if (artifact !== 'voyager') {
      await expect(page.getByLabel('Miso exploration tip')).toHaveCount(0);
      await page.getByRole('button', { name: 'Skip landing', exact: true }).click();
      await expect(page.getByLabel('Miso mission question')).toBeVisible();
      await expect(page.getByLabel('Miso exploration tip')).toHaveCount(0);
      await page.getByRole('button', { name: 'Explore without answering' }).click();
    }
    await expect(page.getByLabel('Miso exploration tip')).toHaveCount(0);
    if (artifact !== 'voyager') await expect(page.locator('.minimap .planet-map')).toBeVisible();
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    await page.screenshot({ path: `docs/qa/miso-${artifact}-desktop.png` });
    await page.getByRole('button', { name: 'Ask Miso', exact: true }).click();
    await expect(page.locator('.miso-answer p')).not.toBeEmpty();
    await page.keyboard.press('Escape');
    if (artifact === 'voyager') {
      await page.locator('.mars-approach .action').click();
      await expect(page.getByLabel('Miso exploration tip')).toHaveCount(0);
      await page.getByRole('button', { name: 'Explore without answering' }).click();
    }
    await page.locator(`.discovery-dock [data-artifact="${artifact}"]`).click();
    await expect(page.getByLabel('Miso exploration tip')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(page.getByLabel('Miso exploration tip')).toHaveCount(0);
    await page.getByRole('button', { name: 'MUSEUM', exact: true }).click(); await ready(page, 'museum');
    await expect(page.getByRole('navigation', { name: 'Five missions' }).getByRole('button', { name: new RegExp(name) })).toHaveAttribute('aria-current', 'true');
  }
  await expect(page.locator('canvas')).toHaveCount(1); expect(errors).toEqual([]);
});
