// Run: node validate-flight.cjs "path/to/project/node_modules/typescript"
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require(process.argv[2] || 'typescript');
const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/game/flight.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const compiled = { exports: {} };
new Function('exports', 'module', code)(compiled.exports, compiled);
const { initialFlight, stepFlight } = compiled.exports;
const idle = { x: 0, z: 0, brake: false, assist: false };
function run(input, fps, seed = initialFlight()) {
  let state = seed, elapsed = 0;
  while (!state.landed && !state.failed && elapsed < 25) {
    state = stepFlight(state, input, 1 / fps); elapsed += 1 / fps;
  }
  return { state, elapsed };
}
for (const fps of [15, 30, 60, 144]) {
  const { state, elapsed } = run({ ...idle, assist: true }, fps);
  assert.ok(state.landed && elapsed <= 25, `Assist failed at ${fps}fps`);
  console.log(`Assist ${fps}fps: ${elapsed.toFixed(2)}s, fuel ${state.fuel.toFixed(1)}, touchdown ${state.vy.toFixed(2)}`);
}
assert.ok(run(idle, 60).state.failed, 'No-input descent must fail');
assert.ok(stepFlight({ ...initialFlight(), x: 0, z: 0, altitude: 0.01, vy: -4 }, idle, 0.05).failed);
assert.ok(stepFlight({ ...initialFlight(), x: 0, z: 0, altitude: 0.01, vy: -1 }, idle, 0.05).landed);
assert.ok(stepFlight({ ...initialFlight(), x: 7, z: 0, altitude: 0.01, vy: -1 }, idle, 0.05).failed);
const original = initialFlight(), snapshot = { ...original };
stepFlight(original, { ...idle, x: 1 }, 1 / 60);
assert.deepEqual(original, snapshot, 'Simulation must not mutate its input');
assert.deepEqual(stepFlight(original, idle, 999), stepFlight(original, idle, 0.1));
const moving = { ...initialFlight(), vx: 5, vz: -5, vy: -8 };
const braked = stepFlight(moving, { ...idle, brake: true }, 0.1);
assert.ok(braked.vx < moving.vx && braked.vz > moving.vz && braked.vy > moving.vy);
console.log('Pass: assist, unsafe touchdown, target radius, purity, dt clamp, manual braking.');
// Assisted steering must retain vertical protection, including after a long held key.
for (const fps of [15, 60, 144]) {
 let s=initialFlight();
 for(let i=0;i<fps*4;i++)s=stepFlight(s,{...idle,assist:true,x:1},1/fps);
 assert.ok(s.x>initialFlight().x && s.vx<3.1,'Guided steering should be responsive and speed-limited');
 assert.ok(s.vy>-7.1,'Steering must not disable automatic descent control');
 const recovered=run({...idle,assist:true},fps,s);
 assert.ok(recovered.state.landed,'Releasing steering must recover a safe landing');
}
let protectedApproach={...initialFlight(),x:15,z:0,altitude:7,vy:-1};
for(let i=0;i<600;i++)protectedApproach=stepFlight(protectedApproach,{...idle,assist:true,x:1},1/60);
assert.ok(!protectedApproach.failed && protectedApproach.altitude>0,'Assistance should hold above an unsafe landing');
assert.ok(run({...idle,assist:true},60,protectedApproach).state.landed,'Release should recover from an offset approach');
const coasting=stepFlight({...initialFlight(),vx:2,vz:-2},idle,.1);
assert.ok(coasting.vx<2 && coasting.vz>-2,'Manual release should damp lateral drift');
console.log('Pass: assisted key steering, descent protection, safe recovery and release damping.');

// Manual approach: forward, release to settle, brake close to the surface.
for(const fps of [15,30,60,144]){
 let s=initialFlight(), t=0;
 while(!s.landed&&!s.failed&&t<60){
  s=stepFlight(s,{...idle,z:s.z>1?-1:0,brake:s.altitude<15},1/fps);t+=1/fps;
 }
 assert.ok(s.landed,`Manual approach should be controllable at ${fps}fps`);
}
console.log('Pass: manual forward approach and held brake at four frame rates.');
