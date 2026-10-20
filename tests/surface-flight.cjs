const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript');
const m={exports:{}};new Function('exports','module',ts.transpileModule(fs.readFileSync('src/game/surfaceFlight.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(m.exports,m);
const {newSurfaceFlight,stepSurfaceFlight}=m.exports;
const idle={steer:0,thrust:false,brake:false,cruise:false};
for(const route of ['spirit','opportunity','sojourner'])for(const fps of [15,30,60,144]){
 let s=newSurfaceFlight();for(let i=0;i<fps*40&&!s.failed&&!s.finished;i++)s=stepSurfaceFlight(s,{...idle,cruise:true},1/fps,route);
 assert.equal(s.failed,false,`${route} cruise collision at ${s.distance}`);assert.equal(s.finished,true);assert.equal(s.checkpoint,400);
}
let s=newSurfaceFlight();const original={...s};stepSurfaceFlight(s,{...idle,thrust:true},.1,'spirit');assert.deepEqual(s,original);
for(let i=0;i<500&&!s.failed;i++)s=stepSurfaceFlight(s,{...idle,thrust:true},.1,'spirit');assert.equal(s.failed,true);assert.ok(s.distance<70);
let brake={...newSurfaceFlight(),speed:25,distance:10};for(let i=0;i<120;i++)brake=stepSurfaceFlight(brake,{...idle,brake:true},1/60,'spirit');assert.equal(brake.speed,0);assert.ok(brake.distance<21);
assert.deepEqual(newSurfaceFlight(200),{distance:200,offset:0,speed:0,checkpoint:200,failed:false,finished:false});
assert.deepEqual(stepSurfaceFlight(s,idle,.1,'spirit'),s);assert.deepEqual(stepSurfaceFlight(original,idle,NaN,'spirit'),original);
console.log('Surface flight: 12 complete assisted runs, collision, braking, retry, immutable state and invalid-delta checks passed.');
const checkpointSeed=newSurfaceFlight(400);assert.equal(stepSurfaceFlight(checkpointSeed,idle,0,'spirit').distance,400);
for(const route of ['spirit','opportunity']){
 let retry=newSurfaceFlight(200);for(let i=0;i<2400&&!retry.finished&&!retry.failed;i++)retry=stepSurfaceFlight(retry,{...idle,cruise:true},1/60,route);
 assert.equal(retry.finished,true);assert.equal(retry.failed,false);
 let manual=newSurfaceFlight();for(let i=0;i<100;i++)manual=stepSurfaceFlight(manual,{...idle,steer:1},.1,route);assert.equal(manual.offset,11);
}
assert.deepEqual(stepSurfaceFlight(newSurfaceFlight(),{...idle,thrust:true},10,'spirit'),stepSurfaceFlight(newSurfaceFlight(),{...idle,thrust:true},.1,'spirit'));
console.log('Checkpoint recovery, course boundaries and long-frame clamp passed.');
