import {test,expect,type Page} from '@playwright/test';

test('supplied landing evidence loads and each stage is required',async({page})=>{
 await page.goto('/');await page.locator('.archive-index-trigger').click();await page.getByRole('button',{name:/SOJOURNER/}).click();await page.getByRole('button',{name:'Approach the signal'}).click();
 await page.locator('.mars-dock [data-artifact="airbags"]').click();await page.getByRole('button',{name:'Scan object',exact:true}).click();await page.getByRole('button',{name:'Reconstruct the landing'}).click();
 for(let i=1;i<=4;i++){
  await expect.poll(()=>page.locator('.mars-note .photo-reveal img').evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBeGreaterThan(0);
  if(i<4){await expect(page.getByRole('button',{name:'Investigation incomplete'})).toBeDisabled();await page.getByRole('button',{name:'Next landing stage'}).click();}
 }
 await page.locator('.mars-note').evaluate(el=>el.scrollTop=200);await page.screenshot({path:'docs/qa/mars-desktop-landing-evidence.png'});
 await page.getByRole('button',{name:'Archive discovery',exact:true}).click();
 await page.locator('.mars-dock [data-artifact="pathfinder"]').click();await page.getByRole('button',{name:'Scan object',exact:true}).click();await page.getByRole('button',{name:'Trace the relay'}).click();
 await expect(page.getByRole('button',{name:'Investigation incomplete'})).toBeDisabled();await page.getByRole('button',{name:'Unfurl the deployment ramp'}).click();
 await page.locator('.mars-note').evaluate(el=>el.scrollTop=0);await page.waitForTimeout(1500);await page.screenshot({path:'docs/qa/mars-desktop-deployment-evidence.png'});
 await expect(page.getByRole('button',{name:'Archive discovery',exact:true})).toBeEnabled();
});

// Fixtures enter at the completed Apollo boundary; experience.spec covers earning these records.
async function lunarBoundary(page:Page){
 await page.goto('/');
 await page.getByRole('button',{name:'Land on the Moon'}).click();
 await expect(page.locator('canvas')).toHaveCount(1);
 await page.evaluate(async()=>{
  const url=performance.getEntriesByType('resource').find(r=>r.name.includes('/src/stores/archive.ts'))!.name;
  const {useArchive}=await import(/* @vite-ignore */url);
  useArchive.setState({stage:'explore',chapter:'apollo11',walk:1});
  for(const id of ['eagle','footprints','camera','seismometer','reflector','messages'])useArchive.getState().discover(id);
 });
 await page.getByRole('button',{name:'Listen beyond the Moon'}).click();
}
test('continuous transit, Mars discoveries, guide, archive revisits and focus',async({page},info)=>{
 test.setTimeout(180000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await lunarBoundary(page);
 await expect(page.getByText('MARS ARCHIVE AVAILABLE',{exact:true})).toBeVisible();
 await page.locator('canvas').evaluate(el=>el.setAttribute('data-persistent','original'));
 await page.screenshot({path:`docs/qa/mars-${info.project.name}-signal.png`});
 await page.getByRole('button',{name:'Continue to Mars'}).click();
 if(info.project.name==='desktop'){
  await expect(page.getByLabel('Travel to Mars')).toBeVisible();
  await page.getByRole('button',{name:'Pause journey'}).click();
  const before=await page.locator('.travel-line i').getAttribute('style');await page.waitForTimeout(250);expect(await page.locator('.travel-line i').getAttribute('style')).toBe(before);
  await page.getByRole('button',{name:'Resume journey'}).click();
 }
 await page.getByRole('button',{name:'Approach the signal'}).waitFor({timeout:60000});
 await expect(page.locator('canvas')).toHaveAttribute('data-persistent','original');
 await expect(page.locator('.discovery-dock')).toHaveCount(0);
 await page.waitForTimeout(3000);await page.screenshot({path:`docs/qa/mars-${info.project.name}-wide.png`});
 await page.getByRole('button',{name:'Approach the signal'}).click();
 await expect(page.locator('.mars-dock')).not.toContainText('Sojourner');
 await expect(page.locator('.mars-dock [data-artifact="tracks"]')).toHaveCount(0);
 await page.locator('.mars-dock [data-artifact="sojourner"]').click();
 await expect(page.getByRole('heading',{name:'Sojourner',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Scan object',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Sojourner',exact:true})).toBeVisible();
 await page.getByRole('button',{name:/Solar array/}).click();
 await expect(page.locator('.part-poster')).toContainText('Solar cells');
 await page.getByRole('button',{name:'FIELD GUIDE',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'Sojourner: a small beginning.'})).toBeVisible();
 await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'FIELD GUIDE',exact:true})).toBeFocused();
 await expect(page.getByRole('region',{name:'Artifact inspection'})).toBeVisible();
 await page.getByRole('button',{name:/Six wheels/}).click();
 await page.getByRole('button',{name:/APXS \+ cameras/}).click();
 await expect(page.locator('.part-poster')).toContainText('chemistry');
 await page.getByRole('button',{name:'Separate hardware',exact:true}).click();
 await page.waitForTimeout(2200);await page.screenshot({path:`docs/qa/mars-${info.project.name}-inspect.png`});
 await page.getByRole('button',{name:'Rotate model left'}).click();await page.getByRole('button',{name:'Zoom in',exact:true}).click();await page.getByRole('button',{name:'Reset view'}).click();
 await page.getByRole('button',{name:'Archive discovery',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>document.activeElement?.getAttribute('data-artifact'))).toBe('sojourner');
 for(const [id,action] of [['pathfinder','Trace the relay'],['airbags','Reconstruct the landing'],['tracks','Recover the mission log']]){
  await page.locator(`.mars-dock [data-artifact="${id}"]`).click();await page.getByRole('button',{name:'Scan object',exact:true}).click();await page.getByRole('button',{name:action,exact:true}).click();
  if(id==='pathfinder')await page.getByRole('button',{name:'Unfurl the deployment ramp'}).click();
  if(id==='airbags')for(let i=0;i<3;i++)await page.getByRole('button',{name:'Next landing stage'}).click();
  await expect(page.locator('.mars-note a').first()).toHaveAttribute('href',/nasa.gov/);
  if(id==='tracks'){await expect(page.getByRole('status')).toContainText('83 SOLS');await page.screenshot({path:`docs/qa/mars-${info.project.name}-respect.png`});}
  await page.getByRole('button',{name:'Archive discovery',exact:true}).click();
 }
 await expect(page.getByRole('heading',{name:'Small was not insignificant.'})).toBeVisible();
 await page.locator('.archive-index-trigger').click();await expect(page.getByRole('dialog',{name:'Archive Index'})).toBeVisible();
 await expect(page.locator('.corrupted-signal')).toHaveCount(1);await expect(page.getByRole('button',{name:/SPIRIT/})).toBeEnabled();
 await page.screenshot({path:`docs/qa/mars-${info.project.name}-index.png`});
 await page.getByRole('button',{name:/01 — APOLLO 11/}).click();await expect(page.locator('.discovery-dock')).toContainText('Eagle');
 await page.waitForTimeout(7500);await expect(page.locator('.experience')).toHaveClass(/stage-explore/);
 await page.locator('.archive-index-trigger').click();await page.getByRole('button',{name:/02 — SOJOURNER/}).click();await expect(page.getByRole('heading',{name:'Small was not insignificant.'})).toBeVisible();
 await page.locator('.mars-dock [data-artifact="sojourner"]').click();await expect(page.getByRole('button',{name:'Scan object',exact:true})).toHaveCount(0);await page.keyboard.press('Escape');await expect.poll(()=>page.evaluate(()=>document.activeElement?.getAttribute('data-artifact'))).toBe('sojourner');
 await page.locator('.archive-index-trigger').click();await page.keyboard.press('Escape');await expect(page.locator('.archive-index-trigger')).toBeFocused();
 await expect(page.locator('canvas')).toHaveAttribute('data-persistent','original');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();expect(errors).toEqual([]);
});

test('built chapters are freely accessible from a fresh expedition and after refresh',async({page})=>{
 await page.goto('/');await page.locator('.archive-index-trigger').click();
 await expect(page.locator('.corrupted-signal')).toHaveCount(1);
 await expect(page.getByRole('button',{name:/APOLLO 11/})).toBeEnabled();
 await page.getByRole('button',{name:/SOJOURNER/}).click();
 await expect(page.getByRole('button',{name:'Approach the signal'})).toBeVisible();
 await page.locator('.archive-index-trigger').click();await page.getByRole('button',{name:/APOLLO 11/}).click();
 await expect(page.locator('.discovery-dock [data-artifact="eagle"]')).toBeVisible();
 await page.reload();await page.locator('.archive-index-trigger').click();
 await expect(page.getByRole('button',{name:/SOJOURNER/})).toBeEnabled();
 await expect(page.getByRole('button',{name:/APOLLO 11/})).toBeEnabled();
 await page.keyboard.press('Escape');await expect(page.locator('.archive-index-trigger')).toBeFocused();
});

test('reduced motion at a short desktop size preserves inspection gates',async({page})=>{
 await page.setViewportSize({width:1366,height:768});await page.emulateMedia({reducedMotion:'reduce'});
 await lunarBoundary(page);await page.getByRole('button',{name:'Continue to Mars'}).click();
 await page.getByRole('button',{name:'Approach the signal'}).click();
 await expect(page.getByLabel('Travel to Mars')).toHaveCount(0);
 await page.locator('.mars-dock [data-artifact="sojourner"]').click();await page.getByRole('button',{name:'Scan object',exact:true}).click();
 await expect(page.getByRole('button',{name:/Inspect all parts/})).toBeDisabled();
 await page.getByRole('button',{name:/Solar array/}).click();await page.getByRole('button',{name:'FIELD GUIDE',exact:true}).click();
 await expect(page.locator('.learning-bar')).toContainText('FIELD GUIDE / MARS');await page.keyboard.press('Escape');
 await page.screenshot({path:'docs/qa/mars-desktop-reduced-short.png'});
 const bounds=await page.locator('.part-poster').boundingBox();expect(bounds!.y+bounds!.height).toBeLessThan(700);
 await page.keyboard.press('Escape');await expect.poll(()=>page.evaluate(()=>document.activeElement?.getAttribute('data-artifact'))).toBe('sojourner');
 await expect(page.locator('canvas')).toHaveCount(1);
});
