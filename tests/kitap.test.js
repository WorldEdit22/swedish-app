import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KITAP } from '../data/kitap.js';
import { englishWords, allStrings } from './english.js';

test('the book starts with the alphabet, then the grammar sections', () => {
  assert.deepEqual(KITAP.map((s) => s.id), ['harfler', 'sira']);
  assert.deepEqual(KITAP[0].blocks, [{ alphabet: true }]);
});

test('every section has an id, icon, title, sub and blocks; ids are unique', () => {
  for (const s of KITAP) {
    for (const k of ['id', 'icon', 'title', 'sub']) assert.ok(typeof s[k] === 'string' && s[k], `${s.id}.${k}`);
    assert.ok(Array.isArray(s.blocks) && s.blocks.length, s.id);
  }
  assert.equal(new Set(KITAP.map((s) => s.id)).size, KITAP.length);
});

test('a grammar section has 2-5 examples and a tip, in 100-300 words', () => {
  for (const s of KITAP.filter((x) => !x.blocks[0].alphabet)) {
    const examples = s.blocks.filter((b) => b.ex).flatMap((b) => b.ex);
    assert.ok(examples.length >= 2 && examples.length <= 5, `${s.id}: ${examples.length} examples`);
    assert.ok(s.blocks.some((b) => b.tip), `${s.id} has a tip`);
    const words = JSON.stringify(s.blocks).split(/\s+/).length;
    assert.ok(words >= 100 && words <= 300, `${s.id}: ${words} words`);
  }
});

// The Swedish example sentences (the first of each pair) are left out: they are the thing being taught.
test('the Turkish text of the book has no English', () => {
  const turkish = KITAP.map((s) => [s.title, s.sub, s.blocks.map((b) => (b.ex ? b.ex.map((e) => e[1]) : b))]);
  assert.deepEqual(allStrings(turkish).flatMap(englishWords), []);
});
