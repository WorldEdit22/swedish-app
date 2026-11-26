import { test } from 'node:test';
import assert from 'node:assert/strict';
import { YARDIM } from '../data/yardim.js';
import { englishWords, allStrings } from './english.js';

const IDS = ['practice', 'browse', 'windows', 'search', 'translate', 'book', 'ai', 'settings', 'routine'];

test('the help has an intro and the topics in order', () => {
  assert.ok(typeof YARDIM.intro === 'string' && YARDIM.intro.length > 10);
  assert.deepEqual(YARDIM.sections.map((s) => s.id), IDS);
});

test('every topic has an icon, title, sub and 2 to 6 short lines, and no examples', () => {
  for (const s of YARDIM.sections) {
    for (const k of ['id', 'icon', 'title', 'sub']) assert.ok(typeof s[k] === 'string' && s[k], `${s.id}: ${k}`);
    assert.ok(Array.isArray(s.blocks) && s.blocks.length > 0, `${s.id}: blocks`);
    assert.ok(!s.blocks.some((b) => b.ex), `${s.id}: no ex block`);
    const lines = s.blocks.reduce((n, b) => n + (b.list ? b.list.length : 1), 0);
    assert.ok(lines >= 2 && lines <= 6, `${s.id}: ${lines} lines`);
    for (const b of s.blocks) assert.ok(['p', 'list', 'tip'].some((k) => k in b), `${s.id}: block kind`);
  }
});

test('the book topic mentions the chapters and Next', () => {
  const book = YARDIM.sections.find((s) => s.id === 'book');
  const text = book.blocks.flatMap((b) => b.list || [b.p || b.tip]).join(' ');
  assert.match(text, /bölüm/);
  assert.match(text, /\*Sonraki\*/);
});

test('the practice topic says why a word learned one way waits before it comes up new the other way', () => {
  const practice = YARDIM.sections.find((s) => s.id === 'practice');
  const text = practice.blocks.flatMap((b) => b.list || [b.p || b.tip]).join(' ');
  assert.match(text, /diğer yönde ancak bir hafta sonra/);
});

test('the help has no English', () => {
  // The ids are internal names, never shown.
  const visible = [YARDIM.intro, YARDIM.sections.map(({ id, ...rest }) => rest)];
  assert.deepEqual(allStrings(visible).flatMap(englishWords), []);
});
