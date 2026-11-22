import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fill, fits } from '../js/combine.js';

const n = (sv, tr, o = {}) => ({ sv, tr, type: 'noun', g: 'en', ...o });
const v = (sv, tr, o = {}) => ({ sv, tr, type: 'verb', ...o });
const both = (r) => [r.sv, r.tr];
const tpl = (sv, tr) => ({ sv, tr });

const bil = n('bil', 'araba');
const hus = n('hus', 'ev', { g: 'ett' });
const vatten = n('vatten', 'su', { g: 'ett', m: 1 });

test('a countable noun gets its article in Swedish and "bir" in Turkish', () => {
  assert.deepEqual(both(fill(tpl('Jag vill ha {w:en}.', '{bir}{w} istiyorum.'), bil)), ['Jag vill ha en bil.', 'Bir araba istiyorum.']);
});

test('a mass noun gets neither, and the Turkish sentence still starts with a capital', () => {
  assert.deepEqual(both(fill(tpl('Jag vill ha {w:en}.', '{bir}{w} istiyorum.'), vatten)), ['Jag vill ha vatten.', 'Su istiyorum.']);
});

test('places take their preposition in Swedish and suffixes in Turkish', () => {
  const strand = n('strand', 'plaj', { prep: 'på', pl: 'stränder' });
  const at = tpl('Jag är {w:at}.', '{w:DA(y)Im}.');
  assert.deepEqual(both(fill(at, strand)), ['Jag är på stranden.', 'Plajdayım.']);
  assert.deepEqual(both(fill(at, n('hem', 'ev', { g: 'ett', at: 'hemma' }))), ['Jag är hemma.', 'Evdeyim.']);
});

test('proper nouns keep their spelling and take Turkish suffixes after an apostrophe', () => {
  const turkiet = { sv: 'Turkiet', tr: 'Türkiye', type: 'noun', prop: 1 };
  assert.deepEqual(both(fill(tpl('Jag åker {w:to}.', '{w:(y)A} gidiyorum.'), turkiet)), ['Jag åker till Turkiet.', "Türkiye'ye gidiyorum."]);
  const istanbul = { sv: 'Istanbul', tr: 'İstanbul', type: 'noun', prop: 1 };
  assert.deepEqual(both(fill(tpl('Jag är {w:at}.', '{w:DA(y)Im}.'), istanbul)), ['Jag är i Istanbul.', "İstanbul'dayım."]);
});

test('verbs: the Swedish imperative and the bare Turkish stem, the infinitive and -mak', () => {
  const dricka = v('dricka', 'içmek', { vf: ['dricker', 'drack', 'druckit'] });
  assert.deepEqual(both(fill(tpl('{w:imp}!', '{w:}!'), dricka)), ['Drick!', 'İç!']);
  assert.deepEqual(both(fill(tpl('Jag vill {w}.', '{w:mAk} istiyorum.'), dricka)), ['Jag vill dricka.', 'İçmek istiyorum.']);
});

test('agreement words follow the gender and are not highlighted', () => {
  const r = fill(tpl('Det här är {min} {w}.', 'Bu benim {w:(I)m}.'), hus);
  assert.deepEqual(both(r), ['Det här är mitt hus.', 'Bu benim evim.']);
  assert.deepEqual(r.svParts, [{ text: 'Det här är mitt ', hl: false }, { text: 'hus', hl: true }, { text: '.', hl: false }]);
  assert.deepEqual(r.trParts.filter((p) => p.hl).map((p) => p.text), ['evim']);
});

test('a fixed adjective agrees with the noun', () => {
  const t = tpl('Det är {art} {adj:stor} {w}.', 'Bu büyük {bir}{w}.');
  assert.deepEqual(both(fill(t, hus)), ['Det är ett stort hus.', 'Bu büyük bir ev.']);
  assert.deepEqual(both(fill(t, bil)), ['Det är en stor bil.', 'Bu büyük bir araba.']);
});

test('a word used twice is filled twice', () => {
  const r = fill(tpl('{w:def} och {w:pl}', '{w} ve {w:lAr}'), bil);
  assert.deepEqual(both(r), ['Bilen och bilar', 'Araba ve arabalar']);
  assert.equal(r.svParts.filter((p) => p.hl).length, 2);
});

test('fits accepts a word with several kinds', () => {
  const jobb = n('jobb', 'iş', { g: 'ett', kind: 'room|event' });
  assert.equal(fits('noun:event', jobb), true);
  assert.equal(fits('noun:room', jobb), true);
  assert.equal(fits('noun:place', jobb), false);
});

test('fits matches word type and optional kinds', () => {
  assert.equal(fits('verb', v('komma', 'gelmek')), true);
  assert.equal(fits('verb', n('hem', 'ev')), false);
  assert.equal(fits('noun:place|food', n('hem', 'ev', { kind: 'place' })), true);
  assert.equal(fits('noun:place|food', n('bord', 'masa', { kind: 'thing' })), false);
  assert.equal(fits('*:time', { sv: 'imorgon', tr: 'yarın', type: 'adv', kind: 'time' }), true);
  assert.equal(fits('noun', n('hem', 'ev', { nc: 1 })), false);
});
