import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fold, esc, ABC } from '../js/html.js';

test('search folding: Swedish letters match what a Turkish keyboard can type', () => {
  assert.equal(fold('Här'), fold('har'));
  assert.equal(fold('ÖL'), 'ol');
  assert.equal(fold('Åka'), 'aka');
  assert.equal(fold('idé'), 'ide');
});

test('search folding: Turkish letters fold too, and the dotted capital İ', () => {
  assert.equal(fold('Işık'), 'isik');
  assert.equal(fold('İstanbul'), 'istanbul');
  assert.equal(fold('çğşü'), 'cgsu');
});

test('esc escapes HTML, and the alphabet icon is an SVG', () => {
  assert.equal(esc(`<a href="x">'&'</a>`), '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
  assert.match(ABC, /^<svg[^>]*aria-hidden="true"/);
});
