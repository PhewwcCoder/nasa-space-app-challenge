import {test,expect,type Page} from '@playwright/test';

async function visitSpirit(page:Page){
  await page.goto('/');await page.locator('.archive-index-trigger').click();await page.getByRole('button',{name:/03 — SPIRIT/}).click();
  await expect(page.locator('canvas')).toHaveCount(1);await page.getByRole('button',{name:'Approach the trace'}).click();
}
async function scan(page:Page,id:string){
  await page.locator(`.spirit-dock [data-artifact="${id}"]`).click();await page.getByRole('button',{name:'Scan object',exact:true}).click();
  await expect(page.getByRole('button',{name:'Scan object',exact:true})).toHaveCount(0);
}

test('Spirit hardware, evidence actions, completion and chapter revisits',async({page})=>{
  test.setTimeout(150000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await visitSpirit(page);await page.locator('canvas').evaluate(el=>el.setAttribute('data-persistent','spirit'));
  await expect(page.locator('.spirit-dock')).not.toContainText('Spirit');await expect(page.locator('[data-artifact="spiritLog"]')).toHaveCount(0);
  await page.waitForTimeout(2800);await page.screenshot({path:'docs/qa/spirit-desktop-surface.png'});
  await scan(page,'spirit');await expect(page.getByRole('button',{name:/Inspect all parts/})).toBeDisabled();
  await page.getByRole('button',{name:/Solar deck/}).click();await expect(page.locator('.part-poster')).toContainText('Solar cells');
  await page.getByRole('button',{name:/Solar deck/}).click();await expect(page.locator('.part-poster')).toHaveCount(0);
  await page.getByRole('button',{name:/Wheels \+ suspension/}).click();await expect(page.locator('.part-poster')).toContainText('silica');
  await page.getByRole('button',{name:/Mast \+ science arm/}).click();await expect(page.locator('.part-poster')).toContainText('does not by itself prove life');
  await page.getByRole('button',{name:'Separate hardware',exact:true}).click();await page.waitForTimeout(1800);
  await page.screenshot({path:'docs/qa/spirit-desktop-inspection.png'});
  await page.getByRole('button',{name:'Isolate selection'}).click();await page.getByRole('button',{name:'Show all parts'}).click();
  for(const name of ['Rotate model left','Zoom in','Reset view'])await page.getByRole('button',{name,exact:true}).click();
  await page.getByRole('button',{name:'FIELD GUIDE',exact:true}).click();await expect(page.getByRole('dialog',{name:'Spirit: reading the history of water.'})).toBeVisible();
  await page.screenshot({path:'docs/qa/spirit-desktop-guide.png'});await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'FIELD GUIDE',exact:true})).toBeFocused();
  await expect(page.getByRole('region',{name:'Artifact inspection'})).toBeVisible();await page.getByRole('button',{name:'Archive discovery',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>document.activeElement?.getAttribute('data-artifact'))).toBe('spirit');
  for(const [id,actions] of [
    ['abrasion',['Brush away dust','Grind the weathered layer','Examine the exposed interior']],
    ['silica',['Follow the dragged wheel','Read the chemical measurement','Interpret the water clue']],
    ['spiritLanding',['Locate the descent hardware','Connect landing to exploration']],
    ['spiritLog',['Recover the mission timeline']],
  ] as const){
    await scan(page,id);await expect(page.getByRole('button',{name:'Investigation incomplete'})).toBeDisabled();
    for(const action of actions)await page.getByRole('button',{name:action,exact:true}).click();
    await expect(page.locator('.mars-note .poster-source')).toHaveAttribute('href',/science.nasa.gov/);
    if(id==='silica'){await expect(page.getByRole('status')).toContainText('neither is proof of life');await page.screenshot({path:'docs/qa/spirit-desktop-silica.png'});}
    if(id==='spiritLog')await expect(page.getByRole('status')).toContainText('March 22, 2010');
    await page.getByRole('button',{name:'Archive discovery',exact:true}).click();
  }
  await expect(page.getByRole('heading',{name:'It had a twin.'})).toBeVisible();await expect(page.locator('.spirit-next-signal')).toContainText('Continue to Meridiani Planum');
  await page.waitForTimeout(2000);await page.screenshot({path:'docs/qa/spirit-desktop-complete.png'});
  await page.locator('.archive-index-trigger').click();await expect(page.locator('.corrupted-signal')).toHaveCount(1);
  await page.getByRole('button',{name:/01 — APOLLO 11/}).click();await expect(page.locator('.expedition-log')).toContainText('00 / 06');
  await page.locator('.archive-index-trigger').click();await page.getByRole('button',{name:/03 — SPIRIT/}).click();
  await expect(page.getByRole('heading',{name:'It had a twin.'})).toBeVisible();await page.locator('.spirit-dock [data-artifact="spirit"]').click();
  await expect(page.getByRole('button',{name:'Scan object',exact:true})).toHaveCount(0);await page.keyboard.press('Escape');
  await expect.poll(()=>page.evaluate(()=>document.activeElement?.getAttribute('data-artifact'))).toBe('spirit');
  await expect(page.locator('canvas')).toHaveAttribute('data-persistent','spirit');expect(errors).toEqual([]);
});

test('Sojourner boundary travels to Spirit with pause and skip',async({page})=>{
  await page.goto('/');await page.evaluate(async()=>{const url=performance.getEntriesByType('resource').find(r=>r.name.includes('/src/stores/archive.ts'))!.name;const {useArchive}=await import(/* @vite-ignore */url);useArchive.getState().visitChapter('sojourner');for(const id of ['sojourner','pathfinder','airbags','tracks'])useArchive.getState().discover(id);});
  await page.locator('canvas').evaluate(el=>el.setAttribute('data-persistent','boundary'));
  await page.getByRole('button',{name:'Continue to Gusev Crater'}).click();await page.getByRole('button',{name:'Pause journey'}).click();
  const before=await page.locator('.travel-line i').getAttribute('style');await page.waitForTimeout(200);expect(await page.locator('.travel-line i').getAttribute('style')).toBe(before);
  await page.getByRole('button',{name:'Resume journey'}).click();await page.getByRole('button',{name:'Skip travel'}).click();
  await expect(page.getByRole('button',{name:'Approach the trace'})).toBeVisible();await expect(page.locator('canvas')).toHaveAttribute('data-persistent','boundary');
});

test('natural Mars traverse and reduced-motion arrival retain the canvas',async({page})=>{
  test.setTimeout(60000);await page.goto('/');
  await page.locator('.archive-index-trigger').click();await page.getByRole('button',{name:/SOJOURNER/}).click();
  await page.locator('canvas').evaluate(el=>el.setAttribute('data-persistent','travel'));
  const start=async()=>page.evaluate(async()=>{const url=performance.getEntriesByType('resource').find(r=>r.name.includes('/src/stores/archive.ts'))!.name;const {useArchive}=await import(/* @vite-ignore */url);useArchive.getState().startSpiritTravel();});
  await start();await expect(page.getByRole('button',{name:'Approach the trace'})).toBeVisible({timeout:30000});
  await page.locator('.archive-index-trigger').click();await page.getByRole('button',{name:/SOJOURNER/}).click();
  await page.emulateMedia({reducedMotion:'reduce'});await start();await expect(page.getByRole('button',{name:'Approach the trace'})).toBeVisible();
  await expect(page.locator('canvas')).toHaveAttribute('data-persistent','travel');
});

test('short desktop reduced motion, inspection exit, scroll reset and refresh',async({page})=>{
  await page.setViewportSize({width:1366,height:768});await page.emulateMedia({reducedMotion:'reduce'});await visitSpirit(page);
  await page.locator('.spirit-dock [data-artifact="spirit"]').click();await page.keyboard.press('Escape');
  await expect.poll(()=>page.evaluate(()=>document.activeElement?.getAttribute('data-artifact'))).toBe('spirit');await scan(page,'spirit');
  await page.getByRole('button',{name:/Solar deck/}).click();await page.locator('.part-poster').evaluate(el=>el.scrollTop=el.scrollHeight);
  await page.getByRole('button',{name:/Wheels \+ suspension/}).click();await expect.poll(()=>page.locator('.part-poster').evaluate(el=>el.scrollTop)).toBe(0);
  await page.waitForTimeout(1800);await page.screenshot({path:'docs/qa/spirit-desktop-reduced-short.png'});
  const panel=await page.locator('.part-poster').boundingBox(),exit=await page.locator('.exit-inspection').boundingBox();expect(panel!.y).toBeGreaterThan(exit!.y+exit!.height);expect(panel!.y+panel!.height).toBeLessThan(650);
  await page.keyboard.press('Escape');await page.reload();await page.locator('.archive-index-trigger').click();await expect(page.getByRole('button',{name:/03 — SPIRIT/})).toBeEnabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
