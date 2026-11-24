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

test('the help has no English', () => {
  // The ids are internal names, never shown.
  const visible = [YARDIM.intro, YARDIM.sections.map(({ id, ...rest }) => rest)];
  assert.deepEqual(allStrings(visible).flatMap(englishWords), []);
});
