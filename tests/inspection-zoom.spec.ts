import { test, expect, type Page } from '@playwright/test';

// Inspect the existing R3F root; no production-only test hooks or extra canvas.
async function camera(page:Page){
  return page.evaluate(async()=>{
    const url=performance.getEntriesByType('resource').find(e=>e.name.includes('/@react-three_fiber.js'))!.name;
    const fiber=await import(/* @vite-ignore */ url);
    const s=fiber._roots.get(document.querySelector('canvas')).store.getState();
    return {distance:s.camera.position.distanceTo(s.controls.target),minimum:s.controls.minDistance,position:s.camera.position.toArray(),target:s.controls.target.toArray()};
  });
}

for(const [chapter,id,limit] of [['01.*APOLLO','eagle',17],['02.*SOJOURNER','sojourner',2],['03.*SPIRIT','spirit',4.8]] as const){
  test(`${id}: wheel and buttons share a bounded closest view; zoom out, reset and exit survive`,async({page})=>{
    test.setTimeout(90000);const errors:string[]=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    await page.goto('/');await page.locator('.archive-index-trigger').click();await page.getByRole('button',{name:new RegExp(chapter)}).click();
    if(id==='sojourner')await page.getByRole('button',{name:'Approach the signal'}).click();
    if(id==='spirit')await page.getByRole('button',{name:'Approach the trace'}).click();
    await page.locator(`[data-artifact="${id}"]`).last().click();
    if(id!=='eagle'){await page.getByRole('button',{name:'Scan object',exact:true}).click();await expect(page.getByRole('button',{name:'Scan object',exact:true})).toHaveCount(0);}
    await expect(page.getByRole('heading',{name:new RegExp(`^${id}$`,'i')})).toBeVisible({timeout:15000});
    await page.waitForTimeout(2300);
    const initial=await camera(page);expect(initial.minimum).toBe(limit);
    if(id==='eagle')await page.getByText('More model controls',{exact:true}).click();
    for(let i=0;i<20;i++)await page.getByRole('button',{name:'Zoom in',exact:true}).click();
    expect((await camera(page)).distance).toBeCloseTo(limit,3);
    await page.getByRole('button',{name:'Zoom out',exact:true}).click();
    expect((await camera(page)).distance).toBeGreaterThan(limit+.1);
    await page.mouse.move(1050,450);for(let i=0;i<4;i++)await page.mouse.wheel(0,-4000);
    await page.waitForTimeout(600);expect((await camera(page)).distance).toBeCloseTo(limit,3);
    await page.screenshot({path:`docs/qa/${id}-zoom-limit.png`});
    await page.getByRole('button',{name:'Reset view',exact:true}).click();await page.waitForTimeout(2300);
    expect((await camera(page)).distance).toBeCloseTo(initial.distance,2);
    await page.keyboard.press('Escape');await expect(page.getByRole('region',{name:'Artifact inspection'})).toHaveCount(0);
    await expect(page.locator('canvas')).toHaveCount(1);expect(errors).toEqual([]);
  });
}
