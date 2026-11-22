import { test } from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../js/metin.js';
import { englishWords, allStrings } from './english.js';

test('the check finds English words and leaves Turkish and Swedish alone', () => {
  assert.deepEqual(englishWords('Please try again'), ['please', 'try', 'again']);
  assert.deepEqual(englishWords('Her gün kahve içerim. Jag kan tala svenska.'), []);
});

test('every visible string in T is free of English', () => {
  const found = allStrings(T).flatMap((s) => englishWords(s).map((w) => `${w} ← ${s}`));
  assert.deepEqual(found, []);
});
