import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scanTitle, scanDate, sentencesOf, scansListHtml, scanHtml, sentenceHtml } from '../js/scanview.js';
import { T } from '../js/metin.js';

const scan = (paragraphs, o = {}) => ({ id: 's1', date: '2026-11-21T10:00:00.000Z', paragraphs, ...o });
const EVIL = '<img src=x onerror=alert(1)> & "q"';
const S = T.scans;

test('AI text is escaped everywhere', () => {
  const s = scan([[EVIL]]);
  const data = { tr: '<i>tr</i>', structure: '<script>x</script>', words: [{ w: '<w>', base: '<base>', tr: '<b>', parts: '<u>' }] };
  const html = scanHtml(s, () => false) + sentenceHtml(EVIL, data, null, (x) => x) + scansListHtml([s], { hasKey: true, status: { error: '<e>' } });
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt; &amp; &quot;q&quot;'));
  for (const tag of ['<img', '<i>', '<script>', '<w>', '<base>', '<b>', '<u>', '<e>']) assert.ok(!html.includes(tag), `${tag} must be escaped`);
  assert.ok(html.includes('&lt;b&gt;'));
});

test('explained sentences are marked', () => {
  const html = scanHtml(scan([['Ett.', 'Två.']]), (s) => s === 'Ett.');
  assert.match(html, /class="sent done"[^>]*>Ett\./);
  assert.match(html, /class="sent"[^>]*>Två\./);
  assert.ok(html.includes(S.tap));
});

test('sentence numbers run across paragraphs', () => {
  const s = scan([['A.', 'B.'], ['C.']]);
  const html = scanHtml(s, () => false);
  assert.deepEqual([...html.matchAll(/data-si="(\d+)"[^>]*>([^<]*)</g)].map((m) => [m[1], m[2]]), [['0', 'A.'], ['1', 'B.'], ['2', 'C.']]);
  assert.equal((html.match(/<p>/g) || []).length, 2, 'one paragraph each');
  assert.deepEqual(sentencesOf(s), ['A.', 'B.', 'C.']);
});

test('without a Gemini key the list offers Settings instead of the photo button', () => {
  const none = scansListHtml([], { hasKey: false, status: null });
  assert.ok(none.includes('data-act="setup"') && none.includes(S.openSettings));
  assert.ok(!none.includes('type="file"'));
  const withKey = scansListHtml([], { hasKey: true, status: null });
  assert.ok(withKey.includes('type="file"') && withKey.includes('accept="image/*"') && !withKey.includes('capture'));
  assert.ok(withKey.includes(S.take));
});

test('the list shows reading, empty and error states, and every saved scan', () => {
  assert.ok(scansListHtml([], { hasKey: true, status: 'reading' }).includes(S.reading));
  assert.ok(scansListHtml([], { hasKey: true, status: 'empty' }).includes(S.none));
  const err = scansListHtml([], { hasKey: true, status: { error: 'Hata.' } });
  assert.ok(err.includes('Hata.') && err.includes('data-act="retry-read"') && err.includes(S.retry));
  const list = scansListHtml([scan([['Ett.']], { id: 'a' }), scan([['Två.']], { id: 'b' })], { hasKey: true, status: null });
  assert.equal((list.match(/data-act="open-scan"/g) || []).length, 2);
  assert.ok(list.includes('data-act="delete-scan" data-id="b"'));
  assert.ok(list.includes(`aria-label="${T.aria.deleteScan}"`));
});

test('a sentence shows translation, structure and every word, or its loading and error states', () => {
  const data = { tr: 'Gitmek istiyoruz.', structure: 'Özne vi.', words: [{ w: 'gå', base: 'gå', tr: 'gitmek', parts: 'gå (mastar)' }] };
  const html = sentenceHtml('Vi vill gå.', data, null);
  for (const text of ['Gitmek istiyoruz.', S.structure, 'Özne vi.', S.words, 'gitmek', 'gå (mastar)']) assert.ok(html.includes(text), text);
  assert.ok(html.includes('data-say="Vi vill gå."'));
  assert.ok(html.includes('lang="sv"'));
  assert.ok(sentenceHtml('Kom.', undefined, 'loading').includes(S.explaining));
  const err = sentenceHtml('Kom.', undefined, { error: 'Olmadı.' });
  assert.ok(err.includes('Olmadı.') && err.includes('data-act="retry-explain"'));
});

test('a sentence shows its hint when hint is given', () => {
  const html = sentenceHtml('Kom.', undefined, null, (s) => `H:${s}`);
  assert.ok(html.includes('<p class="hint" lang="tr">H:Kom.</p>'));
  assert.ok(!sentenceHtml('Kom.', undefined, null).includes('class="hint"'));
});

test('scanTitle shortens a long first sentence; dates are Turkish', () => {
  assert.equal(scanTitle(scan([['Idag är det mycket fint väder och vi går till parken.']])), 'Idag är det mycket fint väder…');
  assert.equal(scanTitle(scan([['Hej!']])), 'Hej!');
  assert.equal(scanDate('2026-11-21T10:00:00.000Z'), '21 Kas');
});
