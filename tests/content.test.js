import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WORDS, CATEGORIES, TYPES } from '../data/words.js';
import { PATTERNS, GROUPS, ORDER } from '../data/patterns.js';
import { svForm, formsLine } from '../js/svenska.js';
import { fill, fits } from '../js/combine.js';
import { hintOf } from '../js/uttal.js';
import { RANKS } from '../data/ranks.js';
import { englishWords, allStrings } from './english.js';

const catIds = new Set(CATEGORIES.map((c) => c.id));
const word = (id) => {
  const w = WORDS.find((x) => x.id === id);
  assert.ok(w, `missing word ${id}`);
  return w;
};

test('word ids are unique', () => {
  const seen = new Set();
  for (const w of WORDS) {
    assert.ok(!seen.has(w.id), `duplicate word id ${w.id}`);
    seen.add(w.id);
  }
});

test('every word has sv, tr, a known type and topic', () => {
  for (const w of WORDS) {
    assert.ok(w.sv && w.tr, `${w.id} needs sv and tr`);
    assert.ok(TYPES[w.type], `${w.id} has unknown type ${w.type}`);
    assert.ok(catIds.has(w.cat), `${w.id} has unknown topic ${w.cat}`);
  }
});

test('nouns have g (en/ett) unless they are proper nouns', () => {
  const bad = WORDS.filter((w) => w.type === 'noun' && !w.prop && !['en', 'ett'].includes(w.g)).map((w) => w.id);
  assert.deepEqual(bad, []);
});

test('verbs have vg 1/2/3 or a three-form vf', () => {
  const bad = WORDS.filter((w) => w.type === 'verb' && ![1, 2, 3].includes(w.vg) && !(Array.isArray(w.vf) && w.vf.length === 3)).map((w) => w.id);
  assert.deepEqual(bad, []);
});

// Nouns, verbs and adjectives are put into sentences, so their Turkish meaning takes suffixes.
test('every Turkish meaning that goes into sentences can take suffixes', () => {
  const content = WORDS.filter((w) => ['noun', 'verb', 'adj'].includes(w.type));
  const bad = content.filter((w) => /[/,(]/.test(w.tr) || (w.type === 'verb' && !/m[ae]k$/.test(w.tr))).map((w) => `${w.id}: ${w.tr}`);
  assert.deepEqual(bad, []);
});

const FORMS = { noun: ['en', 'def', 'pl', 'pld'], verb: ['pres', 'past', 'sup', 'imp'], adj: ['t', 'a'] };

test('every form of every word is a real string', () => {
  const bad = [];
  for (const w of WORDS) {
    for (const f of FORMS[w.type] || []) {
      const s = svForm(w, f);
      if (!s || /undefined/.test(s)) bad.push(`${w.id} ${f}: ${s}`);
    }
    if (FORMS[w.type] && !w.prop && !w.fixed && !formsLine(w)) bad.push(`${w.id}: empty forms line`);
  }
  assert.deepEqual(bad, []);
});

// Same spelling, different words: each pair is shown as two blocks with their own meanings.
const ALLOWED_DUPES = new Set(['vår', 'fråga', 'kort', 'salt']);

test('Swedish spellings are unique, except known pairs', () => {
  const by = new Map();
  for (const w of WORDS) by.set(w.sv, [...(by.get(w.sv) || []), w.id]);
  const dupes = [...by].filter(([sv, ids]) => ids.length > 1 && !ALLOWED_DUPES.has(sv));
  assert.deepEqual(dupes, []);
});

test('Turkish text has no English', () => {
  const text = [
    ...WORDS.map((w) => [w.tr, w.gloss, w.note, w.ex?.[1]]),
    CATEGORIES.map((c) => c.label),
    Object.values(TYPES).map((t) => [t.label, t.one]),
  ];
  const found = allStrings(text).flatMap((s) => englishWords(s).map((e) => `${e} ← ${s}`));
  assert.deepEqual(found, []);
});

// Spoken-Swedish ranks come from tools/rank-words.mjs. A rank of 0 means the subtitle list
// doesn't have the word; that is accepted only for these (Swedish life words subtitles rarely use).
const UNRANKED_OK = new Set([
  'food:kanelbulle', 'food:halal', 'town:simhall', 'shopping:swish', 'shopping:nummerlapp', 'shopping:Systembolaget',
  'shopping:öppettider', 'travel:Ankara', 'travel:Izmir', 'work:SFI', 'work:kurdiska', 'time:ramadan', 'time:eid',
  'clothes:regnjacka',
]);

test('every word is ranked', () => {
  const missing = WORDS.filter((w) => typeof RANKS[w.id] !== 'number').map((w) => w.id);
  assert.deepEqual(missing, [], 'run tools/rank-words.mjs');
  const zero = WORDS.filter((w) => RANKS[w.id] === 0 && !UNRANKED_OK.has(w.id)).map((w) => w.id);
  assert.deepEqual(zero, []);
});

test('every hint is plain text', () => {
  const bad = WORDS.filter((w) => !hintOf(w) || /undefined/.test(hintOf(w))).map((w) => w.id);
  assert.deepEqual(bad, []);
});

// ---------- patterns ----------

const pattern = (id) => {
  const p = PATTERNS.find((x) => x.id === id);
  assert.ok(p, `missing pattern ${id}`);
  return p;
};
const slotOf = (p, v) => v.slot || p.slot;
const allTemplates = () => PATTERNS.flatMap((p) => p.variants.flatMap((v) => v.t.map((t) => ({ p, v, t }))));
const render = (id, vi, ti, wordId) => {
  const [sv, tr] = pattern(id).variants[vi].t[ti];
  const r = fill({ sv, tr }, word(wordId));
  return [r.sv, r.tr];
};

test('pattern ids are unique', () => {
  const ids = PATTERNS.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('ORDER lists every pattern exactly once and PATTERNS follows it', () => {
  assert.deepEqual([...ORDER].sort(), PATTERNS.map((p) => p.id).sort());
  assert.deepEqual(PATTERNS.map((p) => p.id), ORDER);
});

test('every pattern has a known group', () => {
  for (const p of PATTERNS) assert.ok(GROUPS[p.group], `${p.id} has unknown group ${p.group}`);
});

test('every variant has examples, and a slot when it has templates', () => {
  for (const p of PATTERNS) {
    assert.ok(p.sv && p.tr && p.variants.length, p.id);
    for (const v of p.variants) {
      assert.ok(v.sv && v.tr, `${p.id}: a variant needs sv and tr`);
      assert.ok(v.ex.length > 0, `${p.id}: ${v.sv} needs examples`);
      if (v.t.length) assert.ok(slotOf(p, v), `${p.id}: ${v.sv} has templates but no slot`);
    }
  }
});

test('every slot fits at least three words', () => {
  for (const { p, v } of allTemplates()) {
    const n = WORDS.filter((w) => fits(slotOf(p, v), w)).length;
    assert.ok(n >= 3, `${p.id}: slot ${slotOf(p, v)} fits only ${n} words`);
  }
});

test('every template renders cleanly on both sides with every word that fits', () => {
  const problems = [];
  for (const { p, v, t } of allTemplates()) {
    for (const w of WORDS.filter((x) => fits(slotOf(p, v), x))) {
      const r = fill({ sv: t[0], tr: t[1] }, w);
      if (/[{}]|undefined/.test(r.sv + r.tr)) problems.push(`${p.id} ${w.id}: ${r.sv} | ${r.tr}`);
      // Leftover Turkish archiphonemes are upper-case letters after the first character.
      for (const part of r.trParts.filter((x) => x.hl)) if (/[ADCRI]/.test(part.text.slice(1)) && !w.prop) problems.push(`${p.id} ${w.id}: ${part.text}`);
    }
  }
  assert.deepEqual(problems, []);
});

test('mass nouns never fill countable templates', () => {
  const bad = [];
  for (const { p, v, t } of allTemplates()) {
    if (!/\{w:(pl|pld)\}|\{art\}/.test(t[0])) continue;
    for (const w of WORDS.filter((x) => fits(slotOf(p, v), x) && x.m)) bad.push(`${p.id}: ${w.id}`);
  }
  assert.deepEqual(bad, []);
});

test('pattern Turkish has no English', () => {
  const text = [
    Object.values(GROUPS),
    ...PATTERNS.map((p) => [p.tr, ...p.variants.map((v) => [v.tr, v.note, v.ex.map((e) => e[1]), v.t.map((t) => t[1].replace(/\{[^}]*\}/g, ' '))])]),
  ];
  const found = allStrings(text).flatMap((s) => englishWords(s).map((e) => `${e} ← ${s}`));
  assert.deepEqual(found, []);
});

test('every noun, verb and adjective left out of patterns has its own example or a note', () => {
  const inSomePattern = (w) => allTemplates().some(({ p, v }) => fits(slotOf(p, v), w));
  const content = WORDS.filter((w) => ['noun', 'verb', 'adj'].includes(w.type));
  const empty = content.filter((w) => !inSomePattern(w) && !w.ex && !w.note).map((w) => w.id);
  assert.deepEqual(empty, []);
});

test('everyday spot checks', () => {
  assert.deepEqual(render('at', 0, 0, 'nature:strand'), ['Jag är på stranden.', 'Plajdayım.']);
  assert.deepEqual(render('at', 0, 0, 'home:hem'), ['Jag är hemma.', 'Evdeyim.']);
  assert.deepEqual(render('hurts', 0, 0, 'body:mage'), ['Jag har ont i magen.', 'Midem ağrıyor.']);
  assert.deepEqual(render('want', 0, 0, 'drinks:kaffe'), ['Jag vill ha kaffe.', 'Kahve istiyorum.']);
  assert.deepEqual(render('goingto', 0, 0, 'travel:Turkiet'), ['Jag ska till Turkiet.', "Türkiye'ye gidiyorum."]);
  assert.deepEqual(render('like', 0, 0, 'animals:hund'), ['Jag gillar hundar.', 'Köpek severim.']);
  assert.deepEqual(render('itis', 0, 0, 'describe:dyr'), ['Det är dyrt.', 'Pahalı.']);
  assert.deepEqual(render('seeyou', 1, 0, 'time:måndag'), ['Vi ses på måndag!', 'Pazartesi görüşürüz!']);
  assert.deepEqual(render('seeyou', 2, 0, 'time:januari'), ['Vi ses i januari!', 'Ocakta görüşürüz!']);
  assert.deepEqual(render('clock', 1, 0, 'numbers:fyra'), ['Vi ses klockan fyra.', 'Saat dörtte görüşürüz.']);
  assert.deepEqual(render('iam', 1, 0, 'people:läkare'), ['Jag är läkare.', 'Doktorum.']);
});

test('all four groups are in, 78 patterns in the final order', () => {
  assert.equal(ORDER.length, 78);
  for (const g of Object.keys(GROUPS)) assert.ok(PATTERNS.some((p) => p.group === g), `group ${g} has patterns`);
});

test('sentence-order and connector spot checks', () => {
  assert.deepEqual(render('adjagree', 0, 0, 'home:hus'), ['Det är ett stort hus.', 'Bu büyük bir ev.']);
  assert.deepEqual(render('adjagree', 0, 0, 'travel:bil'), ['Det är en stor bil.', 'Bu büyük bir araba.']);
  assert.deepEqual(render('doubledef', 0, 0, 'home:hus'), ['Jag vill ha det stora huset.', 'Büyük olan evi istiyorum.']);
  assert.deepEqual(render('v2', 0, 0, 'actions:äta'), ['Idag äter jag.', 'Bugün yiyorum.']);
  assert.deepEqual(render('v2', 0, 0, 'actions:tycka om'), ['Idag tycker jag om.', 'Bugün hoşlanıyorum.']);
  assert.deepEqual(render('inte', 2, 0, 'actions:simma'), ['Hon säger att hon inte simmar.', 'Yüzmediğini söylüyor.']);
  assert.deepEqual(render('if', 0, 0, 'actions:komma'), ['Om du kommer, blir jag glad.', 'Gelirsen sevinirim.']);
  assert.deepEqual(render('assoon', 0, 0, 'actions:komma'), ['Jag ringer så fort jag kommer.', 'Gelir gelmez ararım.']);
});

test('verb spot checks', () => {
  assert.deepEqual(render('now', 0, 0, 'actions:tala'), ['Jag talar.', 'Konuşuyorum.']);
  assert.deepEqual(render('now', 2, 0, 'actions:tycka om'), ['Jag tycker inte om.', 'Hoşlanmıyorum.']);
  assert.deepEqual(render('now', 1, 0, 'actions:tycka om'), ['Tycker du om?', 'Hoşlanıyor musun?']);
  assert.deepEqual(render('perfect', 0, 0, 'actions:äta'), ['Jag har ätit.', 'Yedim.']);
  assert.deepEqual(render('please', 0, 0, 'actions:komma'), ['Kom!', 'Gel!']);
  assert.deepEqual(render('dont', 0, 0, 'actions:springa'), ['Spring inte!', 'Koşma!']);
  assert.deepEqual(render('wantto', 0, 0, 'actions:dricka'), ['Jag vill dricka.', 'İçmek istiyorum.']);
  assert.deepEqual(render('can', 1, 0, 'actions:sitta'), ['Kan jag sitta här?', 'Burada oturabilir miyim?']);
});
