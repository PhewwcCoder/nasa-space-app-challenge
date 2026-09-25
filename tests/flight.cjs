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
