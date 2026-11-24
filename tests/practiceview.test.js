import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cardHtml, doneHtml, recallHtml, intervalText, statusText, countsText } from '../js/practiceview.js';
import { T } from '../js/metin.js';

const face = (o = {}) => ({
  native: 'su',
  target: 'vatten',
  say: 'vatten',
  dot: 'noun',
  icon: '💧',
  hint: null,
  forms: null,
  note: null,
  variant: null,
  example: null,
  ...o,
});
const previews = { forgot: 0, hard: 1, easy: 3 };
const opts = (o = {}) => ({ dir: 'say', revealed: false, previews, canUndo: false, ...o });

test('the say side shows the native text and hides the answer until revealed', () => {
  const html = cardHtml(face(), opts());
  assert.match(html, /data-act="reveal"/);
  assert.ok(html.includes('su'));
  assert.ok(!html.includes('data-grade'));
  assert.ok(!html.includes('vatten'));
  assert.ok(html.includes('Cevabı göster'));
});

test('revealed: the other side, a speaker, the example and three answers with their intervals', () => {
  const html = cardHtml(
    face({ example: { native: 'Su içerim', target: 'Jag dricker vatten', hint: 'yag driker vatın' } }),
    opts({ revealed: true }),
  );
  assert.ok(!html.includes('data-act="reveal"'));
  assert.match(html, /class="pc-target"[^>]*>vatten</);
  assert.match(html, /<button class="say" data-say="vatten" aria-label="Dinle">/);
  assert.match(html, /<button class="say" data-say="Jag dricker vatten" aria-label="Dinle">/);
  assert.ok(html.includes('Su içerim') && html.includes('yag driker vatın'));
  for (const g of ['forgot', 'hard', 'easy']) assert.match(html, new RegExp(`<button class="grade ${g}" data-grade="${g}">`));
  assert.ok(html.includes('Bilemedim') && html.includes('Zor') && html.includes('Kolay'));
  assert.ok(html.includes('bugün') && html.includes('1 gün') && html.includes('~3 gün'));
});

test('the understand side starts from the target text with a speaker and its hint', () => {
  const html = cardHtml(face({ say: 'vatten!', hint: 'vatın' }), opts({ dir: 'understand' }));
  assert.match(html, /data-act="reveal"/);
  assert.match(html, /data-say="vatten!"/);
  assert.match(html, /class="pc-hint"[^>]*>vatın</);
  assert.ok(!html.includes('>su<'));
  const back = cardHtml(face(), opts({ dir: 'understand', revealed: true }));
  assert.ok(back.includes('>su<'));
});

test('hint and forms render only when present', () => {
  assert.ok(!cardHtml(face(), opts({ revealed: true })).includes('pc-hint'));
  assert.ok(!cardHtml(face(), opts({ revealed: true })).includes('pc-forms'));
  const html = cardHtml(face({ hint: 'vatın', forms: 'vattnet' }), opts({ revealed: true }));
  assert.match(html, /class="pc-hint"/);
  assert.match(html, /class="pc-forms"/);
});

test("a pattern card's back shows the chosen variant's form", () => {
  const html = cardHtml(face({ variant: { native: 'suya', target: 'till vattnet' }, note: 'yönelme' }), opts({ revealed: true }));
  assert.match(html, /class="pc-variant"/);
  assert.ok(html.includes('suya') && html.includes('till vattnet'));
  assert.match(html, /class="pc-note"[^>]*>yönelme</);
  assert.ok(!cardHtml(face(), opts({ revealed: true })).includes('pc-variant'));
});

test("a pattern card's front adds an example sentence in the front's language; a word card's front does not", () => {
  const example = { native: 'Su istiyorum.', target: 'Jag vill ha vatten.', hint: 'yag vill ha vatın' };
  const pattern = face({ native: '___ istiyorum', target: 'Jag vill ha ___', say: 'Jag vill ha  ', dot: null, icon: null, variant: { native: '___ istiyorum', target: 'Jag vill ha ___' }, example });
  const say = cardHtml(pattern, opts());
  assert.match(say, /class="pc-front-ex"><div class="pc-native">Su istiyorum\.<\/div>/);
  assert.ok(!say.includes('Jag vill') && !say.includes('data-grade'), 'the Swedish waits for the answer');

  const understand = cardHtml(pattern, opts({ dir: 'understand' }));
  assert.match(understand, /class="pc-front-ex"><div class="pc-line"><span class="pc-target">Jag vill ha vatten\.<\/span><button class="say" data-say="Jag vill ha vatten\."/);
  assert.match(understand, /class="pc-hint">yag vill ha vatın</, 'with its pronunciation');
  assert.ok(!understand.includes('istiyorum'), 'the Turkish waits for the answer');

  const back = cardHtml(pattern, opts({ revealed: true }));
  assert.match(back, /class="pc-ex"><div class="pc-line"><span class="pc-target">Jag vill ha vatten\.<\/span><button class="say" data-say="Jag vill ha vatten\."/, 'the back keeps the example in Swedish');
  assert.ok(!cardHtml(face({ example }), opts()).includes('pc-front-ex'), "a word card's front has no example");
});

test('the unrevealed card keeps the answer row\'s place: hidden, inert, no data-grade', () => {
  const html = cardHtml(face(), opts({ canUndo: true }));
  assert.match(html, /<div class="grades grades-hold" aria-hidden="true">/);
  assert.equal((html.match(/<button class="grade [a-z]+" disabled tabindex="-1">/g) || []).length, 3);
  assert.ok(!html.includes('data-grade'));
  assert.ok(html.indexOf('grades-hold') < html.indexOf('data-act="undo"'), 'the row sits above Undo');
  assert.ok(!cardHtml(face(), opts({ revealed: true })).includes('grades-hold'));
});

test('Undoshows only when there is something to undo', () => {
  assert.ok(!cardHtml(face(), opts()).includes('data-act="undo"'));
  const html = cardHtml(face(), opts({ canUndo: true }));
  assert.match(html, /data-act="undo"/);
  assert.ok(html.includes('↶ Geri al'));
});

test('done: More while unseen cards remain; otherwise when the next review is', () => {
  const more = doneHtml({ newToday: 15, canMore: true, nextIn: 2 });
  assert.ok(more.includes('Bugünlük bu kadar'));
  assert.ok(more.includes('Bugün 15 yeni kart'));
  assert.match(more, /data-act="more"/);
  assert.ok(more.includes('Daha fazla yeni kart'));
  assert.ok(!more.includes('Burada her şey tamam'));
  const caught = doneHtml({ newToday: 0, canMore: false, nextIn: 4 });
  assert.ok(!caught.includes('data-act="more"'));
  assert.ok(caught.includes('Burada her şey tamam. Sonraki tekrar 4 gün sonra.'));
  const none = doneHtml({ newToday: 0, canMore: false, nextIn: null });
  assert.ok(!none.includes('Burada her şey tamam'));
});

test('done: Undo shows while the last answer can be undone', () => {
  assert.ok(!doneHtml({ newToday: 1, canMore: true, nextIn: null }).includes('data-act="undo"'));
  const html = doneHtml({ newToday: 1, canMore: true, nextIn: null, canUndo: true });
  assert.ok(html.includes('<button class="pc-undo" data-act="undo">↶ Geri al</button>'));
});

test("the window's practice section highlights each direction's last answer", () => {
  const html = recallHtml([
    { dir: 'say', label: 'TR → SV', st: { kind: 'due', days: 0 }, last: 'hard' },
    { dir: 'understand', label: 'SV → TR', st: { kind: 'new', days: 0 }, last: undefined },
  ]);
  assert.ok(html.includes('Çalışma'));
  assert.equal(html.match(/data-act="recall"/g).length, 8);
  assert.equal(html.match(/class="on"/g).length, 2);
  assert.match(html, /<button class="on" data-act="recall" data-dir="say" data-grade="hard">/);
  assert.match(html, /<button class="on" data-act="recall" data-dir="understand" data-grade="new">/);
  assert.ok(html.includes('Bugün tekrar') && html.includes('TR → SV'));
});

test('long intervals read in months', () => {
  assert.equal(intervalText(90), '~3 ay');
  assert.equal(intervalText(59), '~59 gün');
  assert.equal(intervalText(0), 'bugün');
  assert.equal(intervalText(1), '1 gün');
});

test('status and counts text', () => {
  assert.equal(statusText({ kind: 'new', days: 0 }), 'Yeni');
  assert.equal(statusText({ kind: 'due', days: 0 }), 'Bugün tekrar');
  assert.equal(statusText({ kind: 'later', days: 5 }), '5 gün sonra');
  assert.equal(statusText({ kind: 'mastered', days: 30 }), 'Ezberlendi · 30 gün sonra');
  assert.equal(countsText(3, 12), '3 tekrar · 12 yeni');
});

test('the practice strings exist in T', () => {
  assert.equal(T.practice.modes.practice, 'Çalış');
  assert.equal(T.practice.dirs.understand, 'SV → TR');
});

test('text is escaped', () => {
  const E = '<img src=x onerror=alert(1)>';
  const f = face({
    native: E, target: E, say: E, icon: E, hint: E, forms: E, note: E,
    variant: { native: E, target: E }, example: { native: E, target: E, hint: E },
  });
  const html =
    cardHtml(f, opts({ revealed: true })) +
    cardHtml(f, opts({ dir: 'understand' })) +
    recallHtml([{ dir: 'say', label: E, st: { kind: 'new', days: 0 }, last: 'new' }]);
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
});
