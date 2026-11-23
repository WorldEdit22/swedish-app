import { test } from 'node:test';
import assert from 'node:assert/strict';
import { patternExamples, wordExamples } from '../js/examples.js';

const drink = (id, sv, tr, o = {}) => ({ id, sv, tr, type: 'noun', g: 'ett', kind: 'drink', ...o });
const te = drink('te', 'te', 'çay');
const vatten = drink('vatten', 'vatten', 'su', { m: 1 });
const kaffe = drink('kaffe', 'kaffe', 'kahve');
const saft = drink('saft', 'saft', 'şurup', { g: 'en' });
const mjolk = drink('mjolk', 'mjölk', 'süt', { g: 'en' });
const komma = { id: 'komma', sv: 'komma', tr: 'gelmek', type: 'verb', vf: ['kommer', 'kom', 'kommit'] };
const WORDS = [te, vatten, kaffe, saft, mjolk, komma]; // most common first

const want = {
  key: 'p:want',
  sv: 'Jag vill ha ___',
  tr: '___ istiyorum',
  slot: 'noun:drink',
  variants: [
    {
      sv: 'Jag vill ha ___',
      tr: '___ istiyorum',
      ex: [['Jag vill ha en biljett.', 'Bir bilet istiyorum.'], ['Jag vill ha vatten.', 'Su istiyorum.']],
      t: [['Jag vill ha {w}.', '{w} istiyorum.']],
    },
    { sv: '___, tack', tr: 'Bir ___, lütfen', ex: [['Ett te, tack.', 'Bir çay, lütfen.']], t: [] },
  ],
};

const order = {
  key: 'p:order',
  sv: 'Kan jag få ___?',
  tr: '___ alabilir miyim?',
  slot: 'noun:drink',
  variants: [
    { sv: 'Kan jag få ___?', tr: '___ alabilir miyim?', ex: [['Kan jag få vatten?', 'Su alabilir miyim?']], t: [['Kan jag få {w}?', '{w} alabilir miyim?']] },
    { sv: 'Finns det ___?', tr: '___ var mı?', ex: [['Finns det vatten?', 'Su var mı?']], t: [['Finns det {w}?', '{w} var mı?']] },
  ],
};

const where = {
  key: 'p:where',
  sv: 'Var är ___?',
  tr: '___ nerede?',
  slot: 'noun:place',
  variants: [{ sv: 'Var är ___?', tr: '___ nerede?', ex: [['Var är skolan?', 'Okul nerede?']], t: [['Var är {w:def}?', '{w} nerede?']] }],
};

// A one-variant pattern that fits drinks, labelled "___ N · Kalıp N".
const numbered = (i) => ({
  key: `p:${i}`,
  sv: `___ ${i}`,
  tr: `Kalıp ${i}`,
  slot: 'noun:drink',
  variants: [{ sv: `___ ${i}`, tr: `___ ${i}`, ex: [[`Exempel ${i}.`, `Örnek ${i}.`]], t: [[`{w} ${i}.`, `{w} ${i}.`]] }],
});

const sel = (...items) => (x) => items.includes(x);
const none = () => false;
const generated = (rows) => rows.filter((r) => r.svParts);
const hlSv = (row) => row.svParts.find((p) => p.hl).text;
const all = (res) => [...res.selected, ...res.examples];

// ---------- pattern card ----------

test('pattern examples start with one sentence per selected word that fits, most common first', () => {
  const res = patternExamples(want, 0, { words: WORDS, isSelected: sel(vatten, te, komma), isKnown: none });
  assert.deepEqual(res.selected.map((r) => r.sv), ['Jag vill ha te.', 'Jag vill ha vatten.']);
  assert.ok(res.selected.every((r) => r.svParts.some((p) => p.hl)));
  assert.ok(!all(res).some((r) => /komm/i.test(r.sv)), 'a verb does not fit "Jag vill ha ___"');
});

test('a selected word that does not fit a form is listed as not used', () => {
  const res = patternExamples(want, 0, { words: WORDS, isSelected: sel(vatten, komma), isKnown: none });
  assert.deepEqual(res.notUsed, [komma]);
  assert.deepEqual(res.selected.map((r) => r.sv), ['Jag vill ha vatten.']);
});

test('with nothing selected there is no selection section', () => {
  const res = patternExamples(want, 0, { words: WORDS, isSelected: none, isKnown: none });
  assert.deepEqual(res.selected, []);
  assert.deepEqual(res.notUsed, []);
});

test('hand-written examples open the Examples section, without highlight', () => {
  const res = patternExamples(want, 0, { words: WORDS, isSelected: sel(te), isKnown: none });
  assert.equal(res.selected[0].sv, 'Jag vill ha te.');
  assert.deepEqual(res.examples[0], { sv: 'Jag vill ha en biljett.', tr: 'Bir bilet istiyorum.' });
});

test('a hand-written example equal to a generated one appears once, highlighted', () => {
  const res = patternExamples(want, 0, { words: WORDS, isSelected: sel(vatten), isKnown: none });
  const same = all(res).filter((r) => r.sv === 'Jag vill ha vatten.');
  assert.equal(same.length, 1);
  assert.ok(same[0].svParts, 'the highlighted, generated sentence is kept');
});

test('then up to 3 with learned words, never repeating a selected word', () => {
  for (let run = 0; run < 30; run++) {
    const res = patternExamples(want, 0, { words: WORDS, isSelected: sel(te), isKnown: sel(te, vatten, kaffe, saft, mjolk) });
    assert.equal(generated(res.examples).length, 3, '3 learned extras');
    assert.equal(all(res).filter((r) => r.sv === 'Jag vill ha te.').length, 1);
    assert.equal(new Set(all(res).map((r) => r.sv)).size, all(res).length, 'no sentence twice');
  }
});

test('with no fitting word learned, the extras come from the 15 most common fitting words', () => {
  const many = Array.from({ length: 20 }, (_, i) => drink(`d${i}`, `dryck${i}`, `içecek${i}`));
  const first15 = new Set(Array.from({ length: 15 }, (_, i) => `dryck${i}`));
  for (let run = 0; run < 50; run++) {
    const extras = generated(patternExamples(want, 0, { words: many, isSelected: none, isKnown: none }).examples);
    assert.equal(extras.length, 3);
    for (const r of extras) assert.ok(first15.has(hlSv(r)), `${hlSv(r)} is not among the 15 most common`);
  }
});

test('when every learned word is selected, the extras come from common words', () => {
  const res = patternExamples(want, 0, { words: WORDS, isSelected: sel(te), isKnown: sel(te) });
  assert.equal(res.selected.length, 1);
  assert.equal(generated(res.examples).length, 3, '3 common extras');
  assert.equal(all(res).filter((r) => r.sv === 'Jag vill ha te.').length, 1);
});

test('a form without templates lists every selected word as not used', () => {
  const res = patternExamples(want, 1, { words: WORDS, isSelected: sel(te, komma), isKnown: sel(vatten) });
  assert.deepEqual(res.selected, []);
  assert.deepEqual(res.notUsed, [te, komma]);
  assert.deepEqual(res.examples, [{ sv: 'Ett te, tack.', tr: 'Bir çay, lütfen.' }]);
});

// ---------- word card ----------

test('word examples start with each selected pattern, one sentence per variant the word fits', () => {
  const res = wordExamples(te, { patterns: [want, order, where], isSelected: sel(order, where), isKnown: none });
  assert.deepEqual(res.selected.map((r) => [r.sv, r.from]), [
    ['Kan jag få te?', 'Kan jag få ___? · ___ alabilir miyim?'],
    ['Finns det te?', 'Finns det ___? · ___ alabilir miyim?'],
  ]);
  assert.ok(!all(res).some((r) => r.from?.includes('Var är')), 'tea does not fit "Var är ___?"');
});

test('a word card lists selected patterns the word fits in no form as not used', () => {
  const res = wordExamples(te, { patterns: [want, order, where], isSelected: sel(order, where), isKnown: none });
  assert.deepEqual(res.notUsed, [where]);
  assert.equal(res.selected.length, 2);
});

test("then the word's own example, then up to 4 with learned patterns, skipping selected ones", () => {
  const tea = drink('te', 'te', 'çay', { ex: ['Dricker du te?', 'Çay içer misin?'] });
  const six = Array.from({ length: 6 }, (_, i) => numbered(i));
  for (let run = 0; run < 30; run++) {
    const res = wordExamples(tea, { patterns: six, isSelected: sel(six[2]), isKnown: () => true });
    assert.deepEqual(res.selected.map((r) => r.from), ['___ 2 · Kalıp 2']);
    assert.deepEqual(res.examples[0], { sv: 'Dricker du te?', tr: 'Çay içer misin?' });
    const extras = res.examples.slice(1);
    assert.equal(extras.length, 4);
    assert.ok(!extras.some((r) => r.from.endsWith('Kalıp 2')), 'a selected pattern is not repeated');
  }
});

test('when every learned pattern is selected, the extras come from the most useful patterns', () => {
  const six = Array.from({ length: 6 }, (_, i) => numbered(i));
  const res = wordExamples(te, { patterns: six, isSelected: sel(six[0]), isKnown: sel(six[0]) });
  assert.deepEqual(res.selected.map((r) => r.from), ['___ 0 · Kalıp 0']);
  assert.equal(res.examples.length, 4, '4 common extras');
  assert.ok(!res.examples.some((r) => r.from.endsWith('Kalıp 0')));
});

test('with no learned pattern, the extras come from the 15 most useful patterns', () => {
  const twenty = Array.from({ length: 20 }, (_, i) => numbered(i));
  const first15 = new Set(Array.from({ length: 15 }, (_, i) => `___ ${i} · Kalıp ${i}`));
  for (let run = 0; run < 50; run++) {
    const res = wordExamples(te, { patterns: twenty, isSelected: none, isKnown: none });
    assert.deepEqual(res.selected, []);
    assert.equal(res.examples.length, 4);
    for (const r of res.examples) assert.ok(first15.has(r.from), `${r.from} is not among the 15 most useful`);
  }
});
