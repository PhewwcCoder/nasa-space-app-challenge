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
