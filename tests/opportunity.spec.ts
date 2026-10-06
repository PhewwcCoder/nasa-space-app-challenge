import { test, expect, type Page } from '@playwright/test';

async function visit(page:Page){
  await page.goto('/');
  await page.locator('.archive-index-trigger').click();
  const chapter=page.getByRole('button',{name:/04 — OPPORTUNITY/});
  await chapter.focus();await page.keyboard.press('Enter');
  await expect(page.locator('canvas')).toHaveAttribute('data-world','opportunity',{timeout:30000});
  await page.getByRole('button',{name:'Approach the familiar trace'}).click();
}
async function scan(page:Page,id:string){
  await page.locator(`.opportunity-dock [data-artifact="${id}"]`).click();
  await page.getByRole('button',{name:'Scan object',exact:true}).click();
  await expect(page.locator('.mars-scan-panel')).toHaveCount(0,{timeout:15000});
}

test('Opportunity full desktop investigation, source photos, guide and retained records',async({page})=>{
  test.setTimeout(150000);
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await visit(page);
  await page.locator('canvas').evaluate(el=>el.setAttribute('data-persistent','opportunity'));
  await expect(page.locator('.opportunity-dock')).not.toContainText('Opportunity');
  await expect(page.locator('[data-artifact="opportunityLog"]')).toHaveCount(0);
  await page.waitForTimeout(1900);await page.screenshot({path:'docs/qa/opportunity-desktop-surface.png'});
  await scan(page,'opportunity');
  await expect(page.getByRole('button',{name:/Inspect all parts/})).toBeDisabled();
  await page.waitForTimeout(1900);await page.screenshot({path:'docs/qa/opportunity-desktop-rover.png'});
  for(const name of [/Solar deck/,/Wheels \+ suspension/,/Mast \+ science arm/]){
    await page.getByRole('navigation',{name:'Hardware components'}).getByRole('button',{name}).click();
    await expect(page.locator('.part-poster .photo-window img')).toBeVisible();
    await expect.poll(()=>page.locator('.part-poster .photo-window img').evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBeTruthy();
  }
  await page.getByRole('button',{name:'Separate hardware',exact:true}).click();
  await page.waitForTimeout(1500);await page.screenshot({path:'docs/qa/opportunity-desktop-separated.png'});
  await page.getByRole('button',{name:'Isolate selection'}).click();
  await page.getByRole('button',{name:'Show all parts'}).click();
  for(const name of ['Rotate model left','Rotate model right','Zoom in','Zoom out','Reset view'])await page.getByRole('button',{name,exact:true}).click();
  await page.getByRole('button',{name:'FIELD GUIDE',exact:true}).click();
  await expect(page.getByRole('dialog',{name:'Opportunity: the journey that kept growing.'})).toBeVisible();
  await page.screenshot({path:'docs/qa/opportunity-desktop-guide.png'});
  await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'FIELD GUIDE',exact:true})).toBeFocused();
  await page.getByRole('button',{name:'Archive discovery',exact:true}).click();
  for(const [id,actions] of [
    ['opportunityLanding',['Unfold the landing cradle','Trace the discarded descent system','Follow the rover off the lander']],
    ['heatShieldRock',['Compare the two surfaces','Read the composition finding','Separate the two histories']],
    ['blueberries',['Look closely at the spheres','Compare the mineral evidence','Reconstruct the water clue']],
    ['purgatory',['Test more wheel spin','Test a careful retreat','Read the real recovery']],
    ['opportunityLog',['Unroll the route','Read the final sky observation','Save the completed mission']],
  ] as const){
    await scan(page,id);await expect(page.getByRole('button',{name:'Investigation incomplete'})).toBeDisabled();
    for(const action of actions){
      await page.getByRole('button',{name:action,exact:true}).click();
      await expect.poll(()=>page.locator('.mars-note .photo-window img').evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBeTruthy();
      if(action==='Read the final sky observation')await expect(page.getByRole('status')).toContainText('human paraphrase');
    }
    if(id==='blueberries')await expect(page.getByRole('status')).toContainText('neither fruit nor proof of life');
    if(id==='opportunityLog')await expect(page.getByRole('status')).toContainText('February 13, 2019');
    if(id==='purgatory'||id==='heatShieldRock'||id==='blueberries'){
      await page.waitForTimeout(1700);await page.screenshot({path:`docs/qa/opportunity-desktop-${id}.png`});
    }
    await page.getByRole('button',{name:'Replay investigation'}).click();
    await expect(page.getByRole('button',{name:'Investigation incomplete'})).toBeDisabled();
    for(const action of actions)await page.getByRole('button',{name:action,exact:true}).click();
    await page.getByRole('button',{name:'Archive discovery',exact:true}).click();
  }
  await expect(page.locator('.mars-site-note')).toContainText('6 / 06 RECORDS');
  await expect(page.locator('.spirit-next-signal')).toContainText('CHAPTER 05');
  await page.waitForTimeout(1900);await page.screenshot({path:'docs/qa/opportunity-desktop-complete.png'});
  await page.locator('.archive-index-trigger').click();await expect(page.locator('.corrupted-signal')).toHaveCount(1);
  await page.getByRole('button',{name:/APOLLO 11/}).click();await expect(page.locator('.expedition-log')).toContainText('00 / 06');
  await page.locator('.archive-index-trigger').click();await page.getByRole('button',{name:/04 — OPPORTUNITY/}).click();
  await expect(page.locator('.mars-site-note')).toContainText('6 / 06 RECORDS');
  await page.locator('.opportunity-dock [data-artifact="opportunity"]').click();
  await expect(page.getByRole('button',{name:'Scan object',exact:true})).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect.poll(()=>page.evaluate(()=>document.activeElement?.getAttribute('data-artifact'))).toBe('opportunity');
  await expect(page.locator('canvas')).toHaveAttribute('data-persistent','opportunity');
  expect(errors).toEqual([]);
});

test('Spirit boundary supports pause, skip, natural and reduced-motion arrival',async({page})=>{
  test.setTimeout(80000);await page.goto('/');
  const prepare=()=>page.evaluate(async()=>{
    const url=performance.getEntriesByType('resource').find(r=>r.name.includes('/src/stores/archive.ts'))!.name;
    const {useArchive}=await import(/* @vite-ignore */url);
    const s=useArchive.getState();s.visitChapter('spirit');
    for(const id of ['spirit','abrasion','silica','spiritLanding','spiritLog'])s.discover(id);
  });
  await prepare();await page.locator('canvas').evaluate(el=>el.setAttribute('data-persistent','boundary4'));
  await page.getByRole('button',{name:'Continue to Meridiani Planum'}).click();
  await page.getByRole('button',{name:'Pause journey'}).click();
  const before=await page.locator('.travel-line i').getAttribute('style');await page.waitForTimeout(250);
  expect(await page.locator('.travel-line i').getAttribute('style')).toBe(before);
  await page.getByRole('button',{name:'Resume journey'}).click();await page.getByRole('button',{name:'Skip travel'}).click();
  await expect(page.locator('canvas')).toHaveAttribute('data-world','opportunity',{timeout:30000});
  await prepare();await page.getByRole('button',{name:'Continue to Meridiani Planum'}).click();
  await expect(page.getByRole('button',{name:'Approach the familiar trace'})).toBeVisible({timeout:30000});
  await page.emulateMedia({reducedMotion:'reduce'});await prepare();await page.getByRole('button',{name:'Continue to Meridiani Planum'}).click();
  await expect(page.getByRole('button',{name:'Approach the familiar trace'})).toBeVisible();
  await expect(page.locator('canvas')).toHaveAttribute('data-persistent','boundary4');
});

test('short desktop reduced motion, lesson scroll reset and fresh access',async({page})=>{
  await page.setViewportSize({width:1366,height:768});await page.emulateMedia({reducedMotion:'reduce'});await visit(page);
  await scan(page,'opportunity');await page.getByRole('button',{name:/Solar deck/}).click();
  await page.locator('.part-poster').evaluate(el=>el.scrollTop=el.scrollHeight);
  await page.getByRole('button',{name:/Wheels \+ suspension/}).click();
  await expect.poll(()=>page.locator('.part-poster').evaluate(el=>el.scrollTop)).toBe(0);
  await page.screenshot({path:'docs/qa/opportunity-desktop-reduced-short.png'});
  const panel=await page.locator('.part-poster').boundingBox(),exit=await page.locator('.exit-inspection').boundingBox();
  expect(panel!.y).toBeGreaterThan(exit!.y+exit!.height);expect(panel!.y+panel!.height).toBeLessThan(650);
  await page.keyboard.press('Escape');
  await expect.poll(()=>page.evaluate(()=>document.activeElement?.getAttribute('data-artifact'))).toBe('opportunity');
  await page.reload();await page.locator('.archive-index-trigger').click();
  await expect(page.getByRole('button',{name:/04 — OPPORTUNITY/})).toBeEnabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
