import {test,expect} from '@playwright/test';
test('Voyager departs from each current Mars world',async({page})=>{
 test.setTimeout(150000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 for(const [label,world] of [['Sojourner','mars'],['Spirit','spirit'],['Opportunity','opportunity']]){
 await page.getByRole('navigation',{name:'Five missions'}).getByRole('button',{name:new RegExp(label)}).click();await page.getByRole('button',{name:'Explore '+label,exact:true}).click();await expect(page.locator('canvas')).toHaveAttribute('data-world',world,{timeout:45000});await expect(page.locator('canvas')).toHaveAttribute('aria-busy','false',{timeout:45000});await page.getByRole('button',{name:'Skip landing',exact:true}).click();
 await page.locator('.archive-index-trigger').click();await page.locator('#archive-index').getByRole('button',{name:/VOYAGER/}).click();await page.getByRole('button',{name:'Pause journey',exact:true}).click();await expect(page.locator('.experience')).toHaveClass(/stage-voyager-travel/);await expect(page.locator('canvas')).toHaveAttribute('data-world',world);await expect(page.getByRole('heading',{name:'Lifting off from Mars.'})).toBeVisible();
 if(world==='spirit'){await page.screenshot({path:'docs/qa/voyager-mars-departure.png'});await page.getByRole('button',{name:'Resume journey',exact:true}).click();}else await page.getByRole('button',{name:'Skip travel',exact:true}).click();
 await expect(page.locator('.experience')).toHaveClass(/stage-voyager(?:\s|$)/,{timeout:45000});await expect(page.locator('canvas')).toHaveAttribute('data-world','voyager',{timeout:45000});await page.getByRole('button',{name:'MUSEUM',exact:true}).click();
 }expect(errors).toEqual([]);await expect(page.locator('canvas')).toHaveCount(1);
});
