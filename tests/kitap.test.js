import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KITAP } from '../data/kitap.js';
import { englishWords, allStrings } from './english.js';

const IDS = [
  'harfler', 'unlu', 'unsuz', 'sira', 'vara', 'soru', 'inte',
  'enett', 'belirli', 'cogul', 'sifat', 'cifte', 'karsilastirma', 'genitif', 'bilesik', 'turetme',
  'zamir', 'iyelik', 'sig', 'belirsiz', 'edat', 'yer', 'sayilar', 'saat', 'simdiki', 'gecmis', 'perfekt', 'gelecek', 'emir', 'modal', 'baglac',
];
const CHAPTERS = [
  'Sesler ve harfler', 'Cümle', 'İsimler ve sıfatlar', 'Küçük kelimeler', 'Fiiller ve zamanlar', 'Kipler ve edilgen',
  'Uzun cümleler',
];
const KINDS = ['p', 'list', 'table', 'ex', 'tip', 'alphabet'];
const grammar = KITAP.filter((s) => !s.blocks.some((b) => b.alphabet));
const examplesOf = (s) => s.blocks.filter((b) => b.ex).flatMap((b) => b.ex);

// Every string anywhere inside a value.
const strings = (v) =>
  typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : [];
const wordCount = (s) => strings(s.blocks).join(' ').split(/\s+/).filter(Boolean).length;

test("the book's sections in order, the alphabet first", () => {
  assert.deepEqual(KITAP.map((s) => s.id), IDS);
  assert.deepEqual(KITAP[0].blocks, [{ alphabet: true }]);
});

test('every section is in a chapter; the chapters come in order, each in one run', () => {
  const runs = KITAP.map((s) => s.chapter).filter((c, i, all) => i === 0 || c !== all[i - 1]);
  assert.deepEqual(runs, CHAPTERS);
});

test('every section has an icon, title, sub, chapter and blocks of the known kinds', () => {
  for (const s of KITAP) {
    for (const k of ['id', 'icon', 'title', 'sub', 'chapter']) assert.ok(typeof s[k] === 'string' && s[k].trim(), `${s.id}.${k}`);
    assert.ok(Array.isArray(s.blocks) && s.blocks.length, s.id);
    for (const b of s.blocks) {
      const keys = Object.keys(b);
      assert.equal(keys.length, 1, `${s.id}: one kind per block (${keys})`);
      assert.ok(KINDS.includes(keys[0]), `${s.id}: unknown block kind ${keys[0]}`);
      if (b.p !== undefined) assert.ok(typeof b.p === 'string' && b.p.trim(), `${s.id}: p`);
      if (b.tip !== undefined) assert.ok(typeof b.tip === 'string' && b.tip.trim(), `${s.id}: tip`);
      if (b.list) assert.ok(b.list.length && b.list.every((i) => typeof i === 'string' && i.trim()), `${s.id}: list`);
      if (b.table) {
        const { head, rows } = b.table;
        assert.ok(head === null || Array.isArray(head), `${s.id}: table head`);
        assert.ok(Array.isArray(rows) && rows.length, `${s.id}: table rows`);
        const width = head ? head.length : rows[0].length;
        assert.ok(width <= 4, `${s.id}: ${width} table columns`);
        for (const r of rows) assert.ok(r.length === width && r.every((c) => typeof c === 'string'), `${s.id}: table row ${r}`);
      }
      if (b.ex) assert.ok(Array.isArray(b.ex), `${s.id}: ex`);
      if (b.alphabet !== undefined) assert.ok(b.alphabet === true && s.id === 'harfler', `${s.id}: alphabet`);
    }
  }
  assert.equal(new Set(KITAP.map((s) => s.id)).size, KITAP.length);
});

test('every grammar section has 2–5 examples, each a Swedish sentence and its meaning', () => {
  assert.equal(grammar.length, IDS.length - 1);
  for (const s of grammar) {
    const examples = examplesOf(s);
    assert.ok(examples.length >= 2 && examples.length <= 5, `${s.id}: ${examples.length} examples`);
    for (const pair of examples) {
      assert.ok(Array.isArray(pair) && pair.length === 2, `${s.id}: ${pair}`);
      for (const text of pair) assert.ok(typeof text === 'string' && text.trim(), `${s.id}: ${pair}`);
    }
  }
});

test('every grammar section has a tip, in about 120–250 words', () => {
  for (const s of grammar) {
    assert.ok(s.blocks.some((b) => b.tip), `${s.id} has a tip`);
    const words = wordCount(s);
    assert.ok(words >= 120 && words <= 250, `${s.id}: ${words} words`);
  }
});

// Points the spec names for a section: each must appear in it (any case, without the * marks).
const COVERAGE = {
  unlu: ['tack', 'villa'],
  unsuz: ['sked', 'kille'],
  vara: ['finns', 'det är'],
  cogul: ['genelde'],
  belirli: ['vurgusuz'],
  sifat: ['stort'],
  cifte: ['den stora bilen', 'min stora bil'],
  genitif: ['annas'],
  bilesik: ['arbetsdag'],
  turetme: ['svenska', 'turkisk'],
  sig: ['själv', 'tvätta sig'],
  belirsiz: ['någon', 'ingen'],
  yer: ['hemma', 'dit'],
  sayilar: ['första'],
  saat: ['halv', 'sedan'],
};
test('every section covers the points the spec names', () => {
  for (const [id, terms] of Object.entries(COVERAGE)) {
    const s = KITAP.find((x) => x.id === id);
    assert.ok(s, `${id} exists`);
    const text = strings(s.blocks).join(' ').replaceAll('*', '').toLocaleLowerCase('tr');
    for (const t of terms) assert.ok(text.includes(t.toLocaleLowerCase('tr')), `${id}: ${t}`);
  }
});

test('every * mark is closed', () => {
  for (const text of strings(KITAP)) {
    assert.equal((text.match(/\*/g) || []).length % 2, 0, text);
    assert.ok(!text.includes('**'), `an empty mark: ${text}`);
  }
});

test('examples use only Swedish letters and punctuation on the Swedish side', () => {
  for (const s of grammar) {
    for (const [target] of examplesOf(s)) {
      assert.match(target, /^[A-Za-zÅÄÖåäöéÉ0-9 ,.!?'’:;\-–*()]+$/, `${s.id}: ${target}`);
    }
  }
});

// The Swedish example sentences (the first of each pair) are left out: they are the thing being taught.
test('the Turkish text of the book has no English', () => {
  const turkish = KITAP.map((s) => [s.title, s.sub, s.chapter, s.blocks.map((b) => (b.ex ? b.ex.map((e) => e[1]) : b))]);
  const found = allStrings(turkish).flatMap((t) => englishWords(t).map((w) => `${w} ← ${t}`));
  assert.deepEqual(found, []);
});
