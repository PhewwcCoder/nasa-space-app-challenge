import {test,expect} from '@playwright/test';
test('all six Mars selector directions stay on the rocky surface course',async({page})=>{
 test.setTimeout(150000);await page.goto('/');
 const select=async(name:string)=>{await page.locator('.archive-index-trigger').click();await page.locator('#archive-index').getByRole('button',{name:new RegExp(name)}).click();};
 await select('SOJOURNER');await page.getByRole('button',{name:'Skip landing',exact:true}).click();await expect(page.locator('canvas')).toHaveAttribute('data-world','mars',{timeout:45000});await expect(page.locator('canvas')).toHaveAttribute('aria-busy','false',{timeout:45000});await page.getByRole('button',{name:'Skip walk',exact:true}).click({timeout:30000});
 for(const name of ['OPPORTUNITY','SPIRIT','SOJOURNER','SPIRIT','OPPORTUNITY','SOJOURNER']){
 await select(name);await expect(page.getByRole('region',{name:'Mars shuttle flight'})).toBeVisible();await expect(page.locator('canvas')).toHaveAttribute('data-world','shuttle',{timeout:30000});await expect(page.locator('.travel-hud')).toHaveCount(0);
 await page.keyboard.down('KeyW');await expect.poll(async()=>Number(await page.getByRole('progressbar').getAttribute('value'))).toBeGreaterThan(0);await page.keyboard.up('KeyW');
 await page.getByRole('button',{name:'Skip travel',exact:true}).click();await expect(page.locator('.experience')).toHaveClass(new RegExp('stage-'+(name==='SOJOURNER'?'mars':name.toLowerCase())));
 }
 await expect(page.locator('canvas')).toHaveCount(1);
});
