import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LETTERS, COMBOS } from '../data/alfabe.js';
import { alfabeHtml } from '../js/alfabeview.js';
import { T } from '../js/metin.js';
import { esc } from '../js/html.js';
import { englishWords, allStrings } from './english.js';

const hint = (s) => `H:${s}`;

test('all 29 letters, A to Ö, in order', () => {
  assert.equal(LETTERS.map((l) => l.ch).join(''), 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ');
});

test('every letter has a name, a sound and an example with its meaning', () => {
  for (const l of LETTERS) {
    assert.ok(l.name && l.sound, l.ch);
    assert.equal(l.ex.length, 2, l.ch);
    assert.ok(l.ex.every((s) => typeof s === 'string' && s), l.ch);
  }
  const name = (ch) => LETTERS.find((l) => l.ch === ch).name;
  assert.deepEqual(['J', 'Å', 'Ä', 'Ö'].map(name), ['yi:', 'o:', 'e:', 'ö:']);
});

test('at least ten tricky sounds, each explained with an example', () => {
  assert.ok(COMBOS.length >= 10);
  for (const c of COMBOS) {
    assert.ok(c.title && c.sound, c.title);
    assert.ok(c.ex.length >= 1 && c.ex.every((e) => e.length === 2 && e[0] && e[1]), c.title);
  }
});

test('the window lists every letter with its example and hint, then the tricky sounds', () => {
  const html = alfabeHtml(LETTERS, COMBOS, hint);
  assert.equal((html.match(/class="abc-row"/g) || []).length, 29);
  assert.equal((html.match(/class="abc-combo"/g) || []).length, COMBOS.length);
  assert.ok(html.includes(T.alphabet.title) && html.includes(T.alphabet.combos) && html.includes(esc(T.alphabet.long)));
  assert.ok(html.includes('data-say="a"') && !html.includes('data-say="A"'), 'tapping a letter says the small letter, not "versal A"');
  assert.ok(html.includes('data-say="å"'));
  const a = LETTERS[0];
  assert.ok(html.includes(`[H:${a.ex[0]}]`), 'the example shows its hint');
  assert.ok(html.includes(`data-say="${a.ex[0]}"`), 'the example has a speaker');
  assert.ok(html.includes('data-act="close"'));
});

test("a letter's own hint override wins", () => {
  const html = alfabeHtml([{ ch: 'C', name: 'se:', sound: 'x', ex: ['cykel', 'bisiklet'], ut: 'sükel' }], [], hint);
  assert.ok(html.includes('[sükel]'));
});

test('text is escaped', () => {
  const html = alfabeHtml([{ ch: '<', name: '<n>', sound: '<s>', ex: ['<e>', '<t>'] }], [{ title: '<c>', sound: '<d>', ex: [['<x>', '<y>']] }], hint);
  for (const tag of ['<n>', '<s>', '<e>', '<t>', '<c>', '<d>', '<x>', '<y>']) assert.ok(!html.includes(tag), tag);
});

test('the Turkish explanations have no English', () => {
  const text = [...LETTERS.map((l) => [l.sound, l.ex[1]]), ...COMBOS.map((c) => [c.title, c.sound, c.ex.map((e) => e[1])])];
  assert.deepEqual(allStrings(text).flatMap(englishWords), []);
});
