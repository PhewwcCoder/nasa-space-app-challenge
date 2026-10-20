const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const output = ts.transpileModule(fs.readFileSync('src/data/missionQuestions.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
for (const storageAvailable of [true, false]) {
  const saved = new Map();
  const context = { exports: {}, sessionStorage: {
    getItem(key) { if (!storageAvailable) throw Error('Disabled'); return saved.get(key) ?? null; },
    setItem(key, value) { if (!storageAvailable) throw Error('Disabled'); saved.set(key, value); },
  }};
  vm.runInNewContext(output, context);
  const { missionQuestions, nextMissionQuestion, rememberMissionQuestion } = context.exports;
  for (const chapter of Object.keys(missionQuestions)) {
    assert.equal(missionQuestions[chapter].length, 5);
    let last;
    for (let visit = 0; visit < 100; visit++) {
      // React may discard initializer results before committing a render.
      nextMissionQuestion(chapter);
      const shown = nextMissionQuestion(chapter);
      assert.notEqual(shown, last);
      assert.ok(shown.options[shown.answer]);
      assert.match(shown.source, /^https:\/\/science\.nasa\.gov\//);
      rememberMissionQuestion(chapter, shown);
      last = shown;
    }
  }
}
console.log('Pass: 20 sourced questions; 800 visits without immediate repeats, including discarded renders and disabled storage.');
