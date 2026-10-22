import {test,expect} from '@playwright/test';
test('museum and Voyager enter each Mars landing directly',async({page})=>{
 test.setTimeout(180000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 const select=async(name:string)=>{await page.locator('.archive-index-trigger').click();await page.locator('#archive-index').getByRole('button',{name:new RegExp(name)}).click();};
 for(const from of ['museum','voyager'])for(const [label,world] of [['Sojourner','mars'],['Spirit','spirit'],['Opportunity','opportunity']]){
 await page.getByRole('button',{name:'MUSEUM',exact:true}).click().catch(()=>{});
 if(from==='voyager'){await page.getByRole('navigation',{name:'Five missions'}).getByRole('button',{name:/Voyager/}).click();await page.getByRole('button',{name:'Explore Voyager 1',exact:true}).click();await expect(page.locator('.experience')).toHaveClass(/stage-voyager/);await select(label.toUpperCase());}
 else{await page.getByRole('navigation',{name:'Five missions'}).getByRole('button',{name:new RegExp(label)}).click();await page.getByRole('button',{name:'Explore '+label,exact:true}).click();}
 await expect(page.locator('.experience')).toHaveClass(/stage-mars-landing/);await expect(page.locator('.travel-hud')).toHaveCount(0);await expect(page.locator('canvas')).toHaveAttribute('data-world',world,{timeout:45000});await expect(page.locator('canvas')).toHaveAttribute('aria-busy','false',{timeout:45000});await expect(page.getByLabel('Landing map')).toBeVisible();await page.getByRole('button',{name:'Skip landing',exact:true}).click();await expect(page.locator('.experience')).toHaveClass(new RegExp('stage-'+world));await page.getByRole('button',{name:'Skip walk',exact:true}).click();
 }
 await page.getByRole('button',{name:'MUSEUM',exact:true}).click();await select('VOYAGER');await select('APOLLO');await expect(page.getByLabel('Flight controls')).toBeVisible();await expect(page.locator('.experience')).toHaveClass(/stage-approach/);await expect(page.locator('canvas')).toHaveCount(1);expect(errors).toEqual([]);
});
