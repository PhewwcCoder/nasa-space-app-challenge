import { test, expect, type Page } from '@playwright/test';

async function ready(page: Page, world: string) {
  await expect(page.locator('canvas')).toHaveAttribute('data-world', world, { timeout: 60000 });
  await expect(page.locator('canvas')).toHaveAttribute('aria-busy', 'false', { timeout: 60000 });
}
async function attachProbe(page: Page) {
  await page.evaluate(async () => {
    const url = performance.getEntriesByType('resource').find(e => e.name.includes('/@react-three_fiber.js'))!.name;
    const fiber = await import(/* @vite-ignore */ url);
    const root = fiber._roots.get(document.querySelector('canvas')).store.getState();
    const probe = { root, scenes: {} as Record<string, any>, objects: {} as Record<string, any> };
    (window as any).efficiencyProbe = probe;
    const render = root.gl.render.bind(root.gl);
    root.gl.render = (scene: any, camera: any) => { probe.scenes[scene.name] = scene; render(scene, camera); };
  });
}

test('museum previews retain exact resources, stay assembled and share the original renderer', async ({ page }) => {
  test.setTimeout(180000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await ready(page, 'museum'); await attachProbe(page);
  const names = ['Apollo 11', 'Sojourner', 'Spirit', 'Opportunity', 'Voyager 1'];
  for (let round = 0; round < 2; round++) for (const [index, name] of names.entries()) {
    await page.getByRole('navigation', { name: 'Five missions' }).getByRole('button', { name: new RegExp(name) }).click();
    await expect.poll(() => page.evaluate(index => {
      const group = (window as any).efficiencyProbe.scenes['sol-3:museum']?.getObjectByName(`museum-exhibit-${index}`);
      let meshes = 0; group?.traverse((o: any) => { if (o.isMesh) meshes++; });
      return group?.visible && meshes > 0;
    }, index), { timeout: 30000 }).toBe(true);
    const result = await page.evaluate(({ index, round }) => {
      const probe = (window as any).efficiencyProbe;
      const scene = probe.scenes['sol-3:museum'];
      const group = scene.getObjectByName(`museum-exhibit-${index}`);
      const resources: string[] = [];
      group.traverse((o: any) => { resources.push(o.uuid); if (o.geometry) resources.push(o.geometry.uuid); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m: any) => resources.push(m.uuid)); });
      if (round === 0) probe.objects[index] = resources;
      const visible: string[] = []; scene.traverse((o: any) => { if (/^museum-exhibit-/.test(o.name) && o.visible) visible.push(o.name); });
      return { same: JSON.stringify(probe.objects[index]) === JSON.stringify(resources), visible, count: scene.children.length };
    }, { index, round });
    expect(result.same).toBe(true); expect(result.visible).toEqual([`museum-exhibit-${index}`]);
  }
  await page.getByRole('button', { name: 'Explore Voyager 1', exact: true }).click(); await ready(page, 'voyager');
  await page.locator('.mars-approach .action').click();
  await page.getByRole('button', { name: 'Explore without answering' }).click();
  await page.locator('.discovery-dock [data-artifact="voyager"]').click();
  await page.getByRole('button', { name: 'Separate hardware', exact: true }).click();
  await page.locator('.component-switch button').first().click();
  expect(await page.evaluate(() => {
    const group = (window as any).efficiencyProbe.scenes['sol-3:museum'].getObjectByName('voyager-power');
    return group.position.length();
  })).toBe(0);
  await page.keyboard.press('Escape'); await page.getByRole('button', { name: 'MUSEUM', exact: true }).click(); await ready(page, 'museum');
  expect(await page.evaluate(() => (window as any).efficiencyProbe.root.gl.domElement === document.querySelector('canvas'))).toBe(true);
  await expect(page.locator('canvas')).toHaveCount(1); expect(errors).toEqual([]);
});

test('Apollo cached worker outlines match original geometry and survive all inspection controls', async ({ page }) => {
  test.setTimeout(180000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await ready(page, 'museum'); await attachProbe(page);
  await page.getByRole('button', { name: 'Explore Apollo 11', exact: true }).click(); await ready(page, 'lunar');
  await page.getByRole('button', { name: 'Enable flight assist' }).click();
  await page.getByRole('button', { name: 'Skip walk', exact: true }).click({ timeout: 90000 });
  await page.getByRole('button', { name: 'Explore the hardware', exact: true }).click();
  await page.getByRole('button', { name: 'Explore without answering' }).click();
  await page.locator('.discovery-dock [data-artifact="eagle"]').click();
  for (let round = 0; round < 2; round++) for (const [id, label] of [['structure', 'Structure'], ['engine', 'Engine'], ['gear', 'Landing gear']]) {
    await page.locator('.component-switch').getByRole('button', { name: new RegExp(label) }).click();
    await expect.poll(() => page.evaluate(id => !!(window as any).efficiencyProbe.scenes['sol-3:lunar'].getObjectByName(`apollo-${id}`).getObjectByName('prepared-hardware-outlines'), id)).toBe(true);
    const result = await page.evaluate(async ({ id, round }) => {
      const url = performance.getEntriesByType('resource').find(e => /\/three\.js\?/.test(e.name))!.name;
      const THREE = await import(/* @vite-ignore */ url);
      const probe = (window as any).efficiencyProbe;
      const assembly = probe.scenes['sol-3:lunar'].getObjectByName(`apollo-${id}`);
      const edges = assembly.getObjectByName('prepared-hardware-outlines');
      const meshes: any[] = []; assembly.children[0].traverse((o: any) => { if (o.isMesh) meshes.push(o); });
      let exact = edges.children.length === meshes.length;
      for (let i = 0; round === 0 && i < meshes.length; i++) {
        const reference = new THREE.EdgesGeometry(meshes[i].geometry, 65);
        const expected = reference.attributes.position.array, actual = edges.children[i].geometry.attributes.position.array;
        exact &&= expected.length === actual.length && expected.every((v: number, n: number) => v === actual[n]);
        exact &&= edges.children[i].matrix.equals(meshes[i].matrix);
        reference.dispose();
      }
      const resources = edges.children.map((o: any) => [o.uuid, o.geometry.uuid, o.material.uuid]);
      if (round === 0) probe.objects[id] = resources;
      return { exact, reused: JSON.stringify(resources) === JSON.stringify(probe.objects[id]), intact: meshes.every(m => m.geometry.attributes.position.count > 0) };
    }, { id, round });
    expect(result).toEqual({ exact: true, reused: true, intact: true });
    await expect(page.locator('.part-poster')).toBeVisible();
  }
  await page.getByRole('button', { name: 'Separate hardware', exact: true }).click();
  await page.getByRole('button', { name: 'Assemble hardware', exact: true }).click();
  await page.getByText('More model controls', { exact: true }).click();
  await page.getByRole('button', { name: 'Isolate selection', exact: true }).click();
  await page.getByRole('button', { name: 'Show all parts', exact: true }).click();
  await page.getByRole('button', { name: 'Rotate model left', exact: true }).click();
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await page.getByRole('button', { name: 'Zoom out', exact: true }).click();
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  await page.getByRole('button', { name: 'Open cross-section', exact: true }).click();
  await page.getByRole('button', { name: 'Close cross-section', exact: true }).click();
  await page.getByRole('button', { name: 'See what remains today', exact: true }).click();
  await page.getByRole('button', { name: 'See the complete Eagle', exact: true }).click();
  await page.getByRole('button', { name: 'Save discovery', exact: true }).click();
  await expect(page.locator('.discovery-dock [data-artifact="eagle"]')).toContainText('SAVED');
  await expect(page.locator('canvas')).toHaveCount(1); expect(errors).toEqual([]);
});
