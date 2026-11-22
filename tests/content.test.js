import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WORDS, CATEGORIES, TYPES } from '../data/words.js';
import { svForm, formsLine } from '../js/svenska.js';
import { hintOf } from '../js/uttal.js';
import { englishWords, allStrings } from './english.js';

const catIds = new Set(CATEGORIES.map((c) => c.id));
const word = (id) => {
  const w = WORDS.find((x) => x.id === id);
  assert.ok(w, `missing word ${id}`);
  return w;
};

test('word ids are unique', () => {
  const seen = new Set();
  for (const w of WORDS) {
    assert.ok(!seen.has(w.id), `duplicate word id ${w.id}`);
    seen.add(w.id);
  }
});

test('every word has sv, tr, a known type and topic', () => {
  for (const w of WORDS) {
    assert.ok(w.sv && w.tr, `${w.id} needs sv and tr`);
    assert.ok(TYPES[w.type], `${w.id} has unknown type ${w.type}`);
    assert.ok(catIds.has(w.cat), `${w.id} has unknown topic ${w.cat}`);
  }
});

test('nouns have g (en/ett) unless they are proper nouns', () => {
  const bad = WORDS.filter((w) => w.type === 'noun' && !w.prop && !['en', 'ett'].includes(w.g)).map((w) => w.id);
  assert.deepEqual(bad, []);
});

test('verbs have vg 1/2/3 or a three-form vf', () => {
  const bad = WORDS.filter((w) => w.type === 'verb' && ![1, 2, 3].includes(w.vg) && !(Array.isArray(w.vf) && w.vf.length === 3)).map((w) => w.id);
  assert.deepEqual(bad, []);
});

// Nouns, verbs and adjectives are put into sentences, so their Turkish meaning takes suffixes.
test('every Turkish meaning that goes into sentences can take suffixes', () => {
  const content = WORDS.filter((w) => ['noun', 'verb', 'adj'].includes(w.type));
  const bad = content.filter((w) => /[/,(]/.test(w.tr) || (w.type === 'verb' && !/m[ae]k$/.test(w.tr))).map((w) => `${w.id}: ${w.tr}`);
  assert.deepEqual(bad, []);
});

const FORMS = { noun: ['en', 'def', 'pl', 'pld'], verb: ['pres', 'past', 'sup', 'imp'], adj: ['t', 'a'] };

test('every form of every word is a real string', () => {
  const bad = [];
  for (const w of WORDS) {
    for (const f of FORMS[w.type] || []) {
      const s = svForm(w, f);
      if (!s || /undefined/.test(s)) bad.push(`${w.id} ${f}: ${s}`);
    }
    if (FORMS[w.type] && !w.prop && !formsLine(w)) bad.push(`${w.id}: empty forms line`);
  }
  assert.deepEqual(bad, []);
});

// Same spelling, different words: each pair is shown as two blocks with their own meanings.
const ALLOWED_DUPES = new Set([]);

test('Swedish spellings are unique, except known pairs', () => {
  const by = new Map();
  for (const w of WORDS) by.set(w.sv, [...(by.get(w.sv) || []), w.id]);
  const dupes = [...by].filter(([sv, ids]) => ids.length > 1 && !ALLOWED_DUPES.has(sv));
  assert.deepEqual(dupes, []);
});

test('Turkish text has no English', () => {
  const text = [
    ...WORDS.map((w) => [w.tr, w.gloss, w.note, w.ex?.[1]]),
    CATEGORIES.map((c) => c.label),
    Object.values(TYPES).map((t) => [t.label, t.one]),
  ];
  const found = allStrings(text).flatMap((s) => englishWords(s).map((e) => `${e} ← ${s}`));
  assert.deepEqual(found, []);
});

test('every hint is plain text', () => {
  const bad = WORDS.filter((w) => !hintOf(w) || /undefined/.test(hintOf(w))).map((w) => w.id);
  assert.deepEqual(bad, []);
});
