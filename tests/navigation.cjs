const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const output = ts.transpileModule(fs.readFileSync('src/data/expedition.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const context = { exports: {} }; vm.runInNewContext(output, context);
const { routePosition, marsStops, sites } = context.exports;
for (const from of marsStops) for (const to of marsStops) {
  const start = routePosition(from, to, -1, 5), end = routePosition(from, to, 2, -5);
  assert.equal(start.lat, sites[from].lat);
  assert.ok(Math.abs(start.lon - sites[from].lon) < 1e-9);
  assert.ok(Math.abs(end.lat - sites[to].lat) < 1e-9);
  assert.ok(Math.abs(end.lon - sites[to].lon) < 1e-9);
  for (let i = 0; i <= 100; i++) {
    const pos = routePosition(from, to, i / 100, 5);
    assert.ok(pos.lon >= 0 && pos.lon < 360);
    assert.ok(pos.lat >= -90 && pos.lat <= 90);
  }
}
// Spirit -> Opportunity takes the shorter 178.99-degree longitude arc.
assert.ok(routePosition('spirit', 'opportunity', .5).lon > 260);
assert.ok(routePosition('spirit', 'sojourner', .5).lon > 250);
console.log('Pass: all Mars route endpoints, bounded progress, steering taper and east-longitude range.');

const localOutput = ts.transpileModule(fs.readFileSync('src/game/navigation.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const local = { exports: {} }; vm.runInNewContext(localOutput, local);
const { landingNavigation, landingMapScale } = local.exports;
// Regression: the reported 5.6 m offset hid almost 70 m of visible approach.
const sample = { x: 0, z: 5.6, altitude: 41, vx: 0, vz: 0, vy: -5.5 };
const nav = landingNavigation(sample);
assert.ok(Math.abs(nav.range - 75.3) < 1e-9);
assert.equal(nav.y, 19.68);
assert.ok(Math.abs(nav.descent - 2.64) < 1e-9);
assert.ok(nav.range > 6);
assert.equal(landingNavigation({ ...sample, altitude: 0 }).range, 5.6);
for (const x of [-500, -20, 0, 20, 500]) for (const z of [-500, -20, 0, 20, 500]) {
  const scale = landingMapScale(x, z);
  assert.ok(Math.abs(x / scale) <= 90 && Math.abs(z / scale) <= 72, 'Marker must fit without position clamping');
  assert.ok(scale >= .5);
}
assert.equal(landingMapScale(0, 190), landingMapScale(0, 180), 'Approach must move the marker between zoom steps');
console.log('Pass: scene-space range/height/descent, target radius, equal-axis unclamped map projection.');
