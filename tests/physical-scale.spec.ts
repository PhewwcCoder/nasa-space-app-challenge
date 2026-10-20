import { test, expect } from '@playwright/test';

test('walking scenes use a consistent suited human and calibrated hardware heights', async ({ page }) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'museum', { timeout: 30000 });
  await page.evaluate(async () => {
    const url = performance.getEntriesByType('resource').find(e => e.name.includes('/@react-three_fiber.js'))!.name;
    const fiber = await import(/* @vite-ignore */ url);
    const root = fiber._roots.get(document.querySelector('canvas')).store.getState();
    const render = root.gl.render.bind(root.gl);
    root.gl.render = (scene: any, camera: any) => {
      (window as any).scaleScene = scene;
      render(scene, camera);
    };
  });
  for (const [chapter, hardware, expected] of [['APOLLO', 'eagle', 7.04], ['SOJOURNER', 'sojourner', .30], ['SPIRIT', 'spirit', 1.5], ['OPPORTUNITY', 'opportunity', 1.5]] as const) {
    await page.locator('.archive-index-trigger').click();
    await page.locator('#archive-index').getByRole('button', { name: new RegExp(chapter) }).click();
    await expect(page.locator('canvas')).toHaveAttribute('data-world', hardware === 'eagle' ? 'lunar' : hardware === 'sojourner' ? 'mars' : hardware);
    await expect(page.locator('canvas')).toHaveAttribute('aria-busy', 'false');
    if (hardware !== 'eagle') await page.locator('.mars-approach .action').click();
    const sizes = await page.evaluate((hardware) => {
      const scene = (window as any).scaleScene;
      const height = (name: string, meshesOnly = false) => {
        const object = scene.getObjectByName(name);
        object.updateWorldMatrix(true, true);
        let bounds: any;
        object.traverse((o: any) => {
          if (!o.geometry || o.isLine2 || (meshesOnly && !o.isMesh)) return;
          o.geometry.computeBoundingBox();
          const box = o.geometry.boundingBox.clone().makeEmpty();
          const point = box.min.clone();
          const positions = o.geometry.attributes.position;
          for (let i = 0; i < positions.count; i++) {
            point.fromBufferAttribute(positions, i).applyMatrix4(o.matrixWorld);
            box.expandByPoint(point);
          }
          if (bounds) bounds.union(box); else bounds = box;
        });
        return {height:bounds.max.y - bounds.min.y,min:bounds.min.y,max:bounds.max.y};
      };
      return { human: height('suited-visitor'), hardware: height(`${hardware}-hardware`, hardware === 'sojourner') };
    }, hardware);
    expect(sizes.human.height).toBeCloseTo(1.85, 2);
    expect(sizes.hardware.height).toBeCloseTo(expected, 2);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `docs/qa/physical-scale-${hardware}.png` });
  }
});
