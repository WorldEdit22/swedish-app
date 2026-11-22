import { test } from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../js/metin.js';
import { englishWords, allStrings } from './english.js';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

// The text a person can see or hear in an HTML file: text between tags, the aria-label,
// placeholder and title attributes, and the description and app-title meta tags.
// Scripts, SVG, comments and settings such as content="yes" are skipped.
function visibleText(html) {
  const clean = html.replace(/<script[\s\S]*?<\/script>|<svg[\s\S]*?<\/svg>|<!--[\s\S]*?-->/g, ' ');
  const attrs = [
    ...clean.matchAll(/(?:aria-label|placeholder|title)="([^"]*)"/g),
    ...clean.matchAll(/name="(?:description|apple-mobile-web-app-title)" content="([^"]*)"/g),
  ].map((m) => m[1]);
  const text = clean.replace(/<[^>]+>/g, ' ');
  return [text, ...attrs].join(' ');
}

test('index.html and the manifest have no English', () => {
  const html = read('index.html');
  assert.match(html, /<html lang="tr">/);
  assert.deepEqual(englishWords(visibleText(html)), []);
  const manifest = JSON.parse(read('manifest.webmanifest'));
  assert.deepEqual(englishWords([manifest.name, manifest.short_name, manifest.description].join(' ')), []);
  assert.equal(manifest.short_name, 'Svenska');
});

test('the check finds English words and leaves Turkish and Swedish alone', () => {
  assert.deepEqual(englishWords('Please try again'), ['please', 'try', 'again']);
  assert.deepEqual(englishWords('Her gün kahve içerim. Jag kan tala svenska.'), []);
});

test('every visible string in T is free of English', () => {
  const found = allStrings(T).flatMap((s) => englishWords(s).map((w) => `${w} ← ${s}`));
  assert.deepEqual(found, []);
});
