import { test, expect, type Page } from '@playwright/test';

async function visit(page: Page, name: string, world: string, keyboard = false) {
  await page.locator('.archive-index-trigger').click();
  const button = page.getByRole('button', { name: new RegExp(name) });
  if (keyboard) { await button.focus(); await page.keyboard.press('Enter'); }
  else await button.click();
  await expect(page.locator('#archive-index')).not.toBeVisible();
  await expect(page.locator('.archive-index-trigger')).toBeFocused();
  await expect(page.locator('canvas')).toHaveAttribute('data-world', world, { timeout: 20000 });
  await expect(page.locator('canvas')).toHaveAttribute('aria-busy', 'false');
  await page.waitForTimeout(150);
}

test('recorded chapter order yields before scene work and reuses warmed GPU resources', async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 802, height: 911 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'orbit', { timeout: 20000 });
  await page.evaluate(async () => {
    const fiberUrl = performance.getEntriesByType('resource').find(e => e.name.includes('/@react-three_fiber.js'))!.name;
    const archiveUrl = performance.getEntriesByType('resource').find(e => e.name.includes('/src/stores/archive.ts'))!.name;
    const fiber = await import(/* @vite-ignore */ fiberUrl);
    const { useArchive } = await import(/* @vite-ignore */ archiveUrl);
    const root = fiber._roots.get(document.querySelector('canvas')).store.getState();
    const probe = { renderer: root.gl, camera: root.camera, canvas: root.gl.domElement, scenes: {} as Record<string, any>, snapshots: {} as Record<string, string>, frames: [] as { closed: boolean; unchanged: boolean }[] };
    (window as any).chapterProbe = probe;
    const render = root.gl.render.bind(root.gl);
    root.gl.render = (scene: any, camera: any) => {
      probe.scenes[scene.name] = scene;
      const resources: string[] = [scene.uuid];
      scene.traverse((o: any) => {
        if (o.geometry) resources.push(o.geometry.uuid);
        if (o.material) for (const m of Array.isArray(o.material) ? o.material : [o.material]) resources.push(m.uuid);
      });
      probe.snapshots[scene.name] = JSON.stringify(resources);
      render(scene, camera);
    };
    document.addEventListener('click', e => {
      if (!(e.target as HTMLElement).closest('#archive-index > button')) return;
      const chapter = useArchive.getState().chapter;
      requestAnimationFrame(() => probe.frames.push({ closed: !(document.querySelector('#archive-index') as HTMLDialogElement).open, unchanged: useArchive.getState().chapter === chapter }));
    }, true);
  });
  await visit(page, 'APOLLO 11', 'lunar');
  // The supplied Recorder starts after Apollo entry and opens footprints before Escape.
  await page.locator('.discovery-dock [data-artifact="footprints"]').click();
  await expect(page.getByRole('region', { name: 'Artifact inspection' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-artifact="footprints"]:focus')).toHaveCount(1);
  // Leaving extracted hardware must reset the retained group, not replay an old pose.
  await page.locator('.discovery-dock [data-artifact="eagle"]').click();
  await page.getByRole('navigation', { name: 'Hardware components' }).getByRole('button', { name: /Structure/ }).click();
  await expect.poll(() => page.evaluate(() => (window as any).chapterProbe.scenes['sol-3:lunar'].getObjectByName('apollo-structure').position.length())).toBeGreaterThan(1);
  await visit(page, 'SPIRIT', 'spirit');
  expect(await page.evaluate(() => (window as any).chapterProbe.scenes['sol-3:lunar'].getObjectByName('apollo-structure').position.toArray())).toEqual([0, 0, 0]);
  // Capture the reset lunar surface after the inspector's conditional overlays leave.
  await visit(page, 'APOLLO 11', 'lunar');
  await visit(page, 'SPIRIT', 'spirit');
  await visit(page, 'SOJOURNER', 'mars');
  await visit(page, 'OPPORTUNITY', 'opportunity');
  const before = await page.evaluate(() => ({ ...(window as any).chapterProbe.snapshots }));
  await visit(page, 'SPIRIT', 'spirit', true);
  await visit(page, 'APOLLO 11', 'lunar', true);
  await visit(page, 'SOJOURNER', 'mars');
  await visit(page, 'OPPORTUNITY', 'opportunity', true);
  const result = await page.evaluate(async () => {
    const probe = (window as any).chapterProbe;
    const url = performance.getEntriesByType('resource').find(e => e.name.includes('/@react-three_fiber.js'))!.name;
    const fiber = await import(/* @vite-ignore */ url);
    const root = fiber._roots.get(document.querySelector('canvas')).store.getState();
    return { frames: probe.frames, snapshots: probe.snapshots, sameCanvas: probe.canvas === document.querySelector('canvas'), sameRenderer: probe.renderer === root.gl, sameCamera: probe.camera === root.camera };
  });
  expect(result.frames).toHaveLength(10);
  expect(result.frames.every((f: { closed: boolean; unchanged: boolean }) => f.closed && f.unchanged)).toBe(true);
  for (const name of ['sol-3:lunar', 'sol-3:mars', 'sol-3:spirit', 'sol-3:opportunity']) {
    const initial = new Set<string>(JSON.parse(before[name]));
    const current = new Set<string>(JSON.parse(result.snapshots[name]));
    expect({ name, replaced: [...initial].filter(id => !current.has(id)).length, added: [...current].filter(id => !initial.has(id)).length }).toEqual({ name, replaced: 0, added: 0 });
  }
  expect(result.sameCanvas && result.sameRenderer && result.sameCamera).toBe(true);
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.screenshot({ path: 'docs/qa/performance/recorded-802x911.png' });
  expect(errors).toEqual([]);
});

test('late cold preparation cannot replace a newer chapter request', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/models/spirit-refined.glb', async route => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    await route.continue();
  });
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'orbit', { timeout: 20000 });
  await page.locator('.archive-index-trigger').click();
  await page.getByRole('button', { name: /SPIRIT/ }).click();
  await expect(page.locator('main')).toHaveClass(/stage-spirit/);
  await visit(page, 'PROLOGUE', 'orbit');
  await page.waitForTimeout(3000);
  await expect(page.locator('canvas')).toHaveAttribute('data-world', 'orbit');
  await expect(page.locator('main')).toHaveClass(/stage-entry/);
  await expect(page.locator('canvas')).toHaveCount(1);
});

test('shader preparation survives disposal of transient source materials',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');await expect(page.locator('canvas')).toHaveAttribute('data-world','orbit',{timeout:30000});
 const result=await page.evaluate(async()=>{
  const fiberUrl=performance.getEntriesByType('resource').find(e=>e.name.includes('/@react-three_fiber.js'))!.name;const fiber=await import(/* @vite-ignore */fiberUrl);const root=fiber._roots.get(document.querySelector('canvas')).store.getState();
  const {preparationSnapshot}=await import(/* @vite-ignore */'/src/three/preparationSnapshot.ts');const THREE=await import(/* @vite-ignore */'/node_modules/.vite/deps/three.js');
  const source=new THREE.Scene(),material=new THREE.MeshStandardMaterial(),geometry=new THREE.BoxGeometry(),mesh=new THREE.Mesh(geometry,material);
  material.onBeforeCompile=(shader:any)=>{shader.fragmentShader=shader.fragmentShader.replace('#include <dithering_fragment>','#include <dithering_fragment>\n gl_FragColor.rgb *= 0.9;');};material.customProgramCacheKey=()=> 'preparation-lifetime-regression';source.add(mesh,new THREE.AmbientLight());
  const snapshot=preparationSnapshot(source),owned=snapshot.scene.children[0].material;let disposed=false;owned.addEventListener('dispose',()=>{disposed=true;});
  const pending=root.gl.compileAsync(snapshot.scene,root.camera);source.remove(mesh);material.dispose();await pending;
  const safe=!disposed&&owned!==material&&owned.onBeforeCompile===material.onBeforeCompile&&owned.customProgramCacheKey()===material.customProgramCacheKey();snapshot.dispose();geometry.dispose();return {safe,released:disposed};
 });
 expect(result).toEqual({safe:true,released:true});expect(errors).toEqual([]);
});
