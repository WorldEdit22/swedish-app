import { test } from 'node:test';
import assert from 'node:assert/strict';
import { translatorHtml, resultHtml } from '../js/translateview.js';
import { googleLink } from '../js/translate.js';
import { esc } from '../js/html.js';
import { T } from '../js/metin.js';

const state = (o = {}) => ({ text: '', from: 'tr', result: '', error: null, ...o });
const EVIL = '<img src=x onerror=alert(1)> & "q"';
const hint = (s) => `H:${s}`;

test("Google's text and yours are escaped", () => {
  const html = translatorHtml(state({ text: EVIL, result: EVIL })) + translatorHtml(state({ text: EVIL, result: EVIL, from: 'sv' }));
  assert.ok(!html.includes('<img'), 'no raw tag');
  assert.ok(!html.includes('onerror=alert(1)>'), 'no raw attribute');
  const escaped = esc(EVIL);
  assert.ok(html.includes(`>${escaped}</textarea>`), 'text box holds the escaped text');
  assert.ok(html.includes(`>${escaped}</p>`), 'result holds the escaped text');
  assert.ok(html.includes(`data-say="${escaped}"`), 'speaker value is escaped');
});

test('Turkish to Swedish: the Swedish result has the speaker', () => {
  const html = translatorHtml(state({ text: 'Gel', result: 'Kom' }));
  assert.match(html, /<h2>Çevir<\/h2>/);
  assert.match(html, /Türkçe<\/span>\s*<button class="tr-swap" data-act="swap" aria-label="Dilleri değiştir">⇄<\/button>\s*<span[^>]*>İsveççe/);
  assert.match(html, /placeholder="Türkçe yaz"/);
  assert.match(html, /<textarea[^>]*lang="tr"/);
  assert.ok(!html.includes('say-text'), 'no speaker on Turkish text');
  assert.match(html, /<p class="tr-text" lang="sv">Kom<\/p>/);
  assert.match(html, /data-say="Kom" aria-label="Dinle"/);
});

test('Swedish to Turkish: the Swedish text box has the speaker', () => {
  const html = translatorHtml(state({ from: 'sv', text: 'En kaffe, tack.', result: 'Bir kahve lütfen.' }));
  assert.match(html, /İsveççe<\/span>\s*<button class="tr-swap"[^>]*>⇄<\/button>\s*<span[^>]*>Türkçe/);
  assert.match(html, /placeholder="İsveççe yaz"/);
  assert.match(html, /data-act="say-text" aria-label="Dinle"/);
  assert.match(html, /<p class="tr-text" lang="tr">Bir kahve lütfen\.<\/p>/);
  assert.ok(!html.includes('data-say'), 'Turkish result has no speaker');
});

test('the text box does not autocorrect and holds at most 1000 characters', () => {
  const box = translatorHtml(state()).match(/<textarea[^>]*>/)[0];
  assert.match(box, /id="tr-input"/);
  assert.match(box, /autocorrect="off"/);
  assert.match(box, /spellcheck="false"/);
  assert.match(box, /maxlength="1000"/);
  assert.match(translatorHtml(state()), /data-act="clear" aria-label="Metni sil"/);
  assert.match(translatorHtml(state()), /<button class="close" data-act="close" aria-label="Kapat">✕<\/button>/);
});

test('the result area shows the placeholder, the error, or the translation', () => {
  assert.equal(resultHtml(state()), '<p class="tr-msg">Çeviri</p>');
  assert.equal(resultHtml(state({ result: 'old', error: 'Bağlantı yok.' })), '<p class="tr-msg err">Bağlantı yok.</p>');
  assert.equal(resultHtml(state({ from: 'sv', result: 'Gel' })), '<p class="tr-text" lang="tr">Gel</p>');
  assert.match(translatorHtml(state({ from: 'sv', result: 'Gel' })), /<div id="tr-result" class="tr-out" aria-live="polite"><p class="tr-text" lang="tr">Gel<\/p><\/div>/);
});

test('a Swedish result shows its hint, a Turkish one does not', () => {
  assert.match(resultHtml(state({ result: 'Kom' }), hint), /<p class="tr-text" lang="sv">Kom<\/p><p class="hint" lang="tr">H:Kom<\/p>/);
  assert.ok(!resultHtml(state({ result: 'Kom' })).includes('class="hint"'), 'no hint without the hint function');
  assert.ok(!resultHtml(state({ from: 'sv', result: 'Gel' }), hint).includes('class="hint"'), 'no hint on Turkish');
  assert.match(translatorHtml(state({ result: 'Kom' }), hint), /H:Kom/);
});

test('the Google link follows the text and direction', () => {
  const html = translatorHtml(state({ from: 'sv', text: 'Te & mjölk' }));
  const href = esc(googleLink('Te & mjölk', 'sv'));
  assert.ok(href.includes('&amp;'));
  assert.ok(html.includes(`<a id="tr-link" class="tr-link" href="${href}" target="_blank" rel="noopener">${esc(T.translator.link)}</a>`));
});
