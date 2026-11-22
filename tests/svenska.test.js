import { test } from 'node:test';
import assert from 'node:assert/strict';
import { svForm, svAgree, formsLine, capSv } from '../js/svenska.js';

const noun = (sv, g, o = {}) => ({ sv, type: 'noun', g, ...o });
const verb = (sv, o) => ({ sv, type: 'verb', ...o });
const adj = (sv, o = {}) => ({ sv, type: 'adj', ...o });

// Each row: a word and the forms it must produce.
function check(word, forms) {
  for (const [form, expected] of Object.entries(forms)) {
    assert.equal(svForm(word, form), expected, `${word.sv} ${form}`);
  }
}

test('en-words: article, definite, plural and definite plural', () => {
  check(noun('bil', 'en'), { '': 'bil', en: 'en bil', def: 'bilen', pl: 'bilar', pld: 'bilarna' });
  check(noun('flicka', 'en'), { en: 'en flicka', def: 'flickan', pl: 'flickor', pld: 'flickorna' });
  check(noun('pojke', 'en'), { def: 'pojken', pl: 'pojkar', pld: 'pojkarna' });
  check(noun('nyckel', 'en'), { def: 'nyckeln', pl: 'nycklar', pld: 'nycklarna' });
  check(noun('lärare', 'en'), { def: 'läraren', pl: 'lärare', pld: 'lärarna' });
  check(noun('station', 'en'), { def: 'stationen', pl: 'stationer', pld: 'stationerna' });
  check(noun('tidning', 'en'), { def: 'tidningen', pl: 'tidningar', pld: 'tidningarna' });
  check(noun('sko', 'en'), { def: 'skon', pl: 'skor', pld: 'skorna' });
  check(noun('dator', 'en'), { def: 'datorn', pl: 'datorer', pld: 'datorerna' });
  check(noun('doktor', 'en'), { def: 'doktorn' });
});

test('ett-words: article, definite, plural and definite plural', () => {
  check(noun('hus', 'ett'), { en: 'ett hus', def: 'huset', pl: 'hus', pld: 'husen' });
  check(noun('äpple', 'ett'), { def: 'äpplet', pl: 'äpplen', pld: 'äpplena' });
  check(noun('barn', 'ett'), { def: 'barnet', pl: 'barn', pld: 'barnen' });
  check(noun('bageri', 'ett'), { def: 'bageriet', pl: 'bagerier', pld: 'bagerierna' });
  check(noun('paraply', 'ett', { pl: 'paraplyer' }), { def: 'paraplyet' });
});

test('fixed words (months) keep their spelling but are not names', () => {
  const januari = { sv: 'januari', type: 'noun', g: 'en', m: 1, fixed: 1, at: 'i januari' };
  check(januari, { en: 'januari', def: 'januari', pl: 'januari', at: 'i januari' });
  assert.equal(formsLine(januari), '');
});

test('mass nouns take no article, and overrides win', () => {
  check(noun('kaffe', 'ett', { m: 1 }), { en: 'kaffe', def: 'kaffet' });
  check(noun('vatten', 'ett', { m: 1, def: 'vattnet' }), { en: 'vatten', def: 'vattnet' });
  check(noun('man', 'en', { def: 'mannen', pl: 'män', pld: 'männen' }), { def: 'mannen', pl: 'män', pld: 'männen' });
  check(noun('stad', 'en', { pl: 'städer' }), { pld: 'städerna' });
});

test('the general form is the plural, or the bare word for mass nouns', () => {
  check(noun('hund', 'en'), { gen: 'hundar' });
  check(noun('äpple', 'ett'), { gen: 'äpplen' });
  check(noun('kaffe', 'ett', { m: 1 }), { gen: 'kaffe' });
  check({ sv: 'Turkiet', type: 'noun', prop: 1 }, { gen: 'Turkiet' });
});

test('at, to and from use the preposition and the definite form', () => {
  check(noun('strand', 'en', { pl: 'stränder', prep: 'på' }), { at: 'på stranden', to: 'till stranden', from: 'från stranden' });
  check(noun('kök', 'ett'), { at: 'i köket' });
  check(noun('hem', 'ett', { at: 'hemma', to: 'hem', from: 'hemifrån' }), { at: 'hemma', to: 'hem', from: 'hemifrån' });
});

test('proper nouns keep their spelling in every form', () => {
  check({ sv: 'Turkiet', type: 'noun', prop: 1 }, { en: 'Turkiet', def: 'Turkiet', at: 'i Turkiet', to: 'till Turkiet' });
});

test('group 1 verbs', () => {
  check(verb('tala', { vg: 1 }), { inf: 'tala', pres: 'talar', past: 'talade', sup: 'talat', imp: 'tala' });
});

test('group 2 verbs: voiced and voiceless stems, -r stems, -d stems and double consonants', () => {
  check(verb('stänga', { vg: 2 }), { pres: 'stänger', past: 'stängde', sup: 'stängt', imp: 'stäng' });
  check(verb('köpa', { vg: 2 }), { pres: 'köper', past: 'köpte', sup: 'köpt', imp: 'köp' });
  check(verb('läsa', { vg: 2 }), { pres: 'läser', past: 'läste', sup: 'läst', imp: 'läs' });
  check(verb('höra', { vg: 2 }), { pres: 'hör', past: 'hörde', sup: 'hört', imp: 'hör' });
  check(verb('använda', { vg: 2 }), { pres: 'använder', past: 'använde', sup: 'använt', imp: 'använd' });
  check(verb('känna', { vg: 2 }), { pres: 'känner', past: 'kände', sup: 'känt', imp: 'känn' });
  check(verb('möta', { vg: 2 }), { pres: 'möter', past: 'mötte', sup: 'mött', imp: 'möt' });
  check(verb('glömma', { vg: 2 }), { past: 'glömde', sup: 'glömt' });
});

test('group 2: a stem ending in consonant + t takes only -e and keeps its supine', () => {
  check(verb('gifta', { vg: 2 }), { pres: 'gifter', past: 'gifte', sup: 'gift', imp: 'gift' });
  check(verb('lyfta', { vg: 2 }), { past: 'lyfte', sup: 'lyft' });
});

test('group 2: only a double m or n turns single; ll and ss stay', () => {
  check(verb('kyssa', { vg: 2 }), { pres: 'kysser', past: 'kysste', sup: 'kysst', imp: 'kyss' });
  check(verb('fylla', { vg: 2 }), { pres: 'fyller', past: 'fyllde', sup: 'fyllt', imp: 'fyll' });
});

test('group 3 verbs', () => {
  check(verb('bo', { vg: 3 }), { pres: 'bor', past: 'bodde', sup: 'bott', imp: 'bo' });
});

test('irregular verbs use their stored forms; the imperative drops a final a', () => {
  check(verb('skriva', { vf: ['skriver', 'skrev', 'skrivit'] }), { pres: 'skriver', past: 'skrev', sup: 'skrivit', imp: 'skriv' });
  check(verb('vara', { vf: ['är', 'var', 'varit'] }), { imp: 'var' });
  check(verb('gå', { vf: ['går', 'gick', 'gått'] }), { imp: 'gå' });
  check(verb('ha', { vf: ['har', 'hade', 'haft'] }), { imp: 'ha' });
  check(verb('se', { vf: ['ser', 'såg', 'sett'], imp: 'se' }), { imp: 'se' });
});

test('particle verbs inflect the first word only', () => {
  check(verb('tycka om', { vg: 2 }), { pres: 'tycker om', past: 'tyckte om', sup: 'tyckt om', imp: 'tyck om', inf: 'tycka om' });
});

test('adjectives: t-form, a-form, comparison', () => {
  check(adj('stor', { komp: ['större', 'störst'] }), { t: 'stort', a: 'stora', komp: 'större', superl: 'störst' });
  check(adj('röd'), { t: 'rött', a: 'röda' });
  check(adj('glad'), { t: 'glatt', a: 'glada' });
  check(adj('ny'), { t: 'nytt', a: 'nya' });
  check(adj('blå', { a: 'blå' }), { t: 'blått', a: 'blå' });
  check(adj('billig'), { t: 'billigt', a: 'billiga', komp: 'billigare', superl: 'billigast' });
  check(adj('vacker'), { t: 'vackert', a: 'vackra' });
  check(adj('svart'), { t: 'svart', a: 'svarta' });
  check(adj('trött'), { t: 'trött', a: 'trötta' });
  check(adj('bra'), { t: 'bra', a: 'bra' });
  check(adj('liten', { t: 'litet', a: 'små' }), { t: 'litet', a: 'små' });
});

test('participles in -ad take -at and -ade; one-syllable -ad words do not', () => {
  check(adj('stressad'), { t: 'stressat', a: 'stressade' });
  check(adj('intresserad'), { t: 'intresserat', a: 'intresserade' });
  check(adj('glad'), { t: 'glatt', a: 'glada' });
});

test('agreement helpers follow the noun gender', () => {
  const bil = noun('bil', 'en');
  const hus = noun('hus', 'ett');
  const helpers = ['art', 'ingen', 'min', 'din', 'den', 'denhar', 'adj:stor'];
  assert.deepEqual(helpers.map((h) => svAgree(bil, h)), ['en', 'ingen', 'min', 'din', 'den', 'den här', 'stor']);
  assert.deepEqual(helpers.map((h) => svAgree(hus, h)), ['ett', 'inget', 'mitt', 'ditt', 'det', 'det här', 'stort']);
});

test('the forms line shows the forms a learner needs', () => {
  assert.equal(formsLine(noun('bil', 'en')), 'en bil · bilen · bilar · bilarna');
  assert.equal(formsLine(noun('vatten', 'ett', { m: 1, def: 'vattnet' })), 'vatten · vattnet');
  assert.equal(formsLine(verb('tala', { vg: 1 })), 'talar · talade · har talat');
  assert.equal(formsLine(adj('stor')), 'stor · stort · stora');
  assert.equal(formsLine({ sv: 'hej', type: 'phrase' }), '');
});

test('capSv capitalises Swedish letters', () => {
  assert.equal(capSv('åka'), 'Åka');
  assert.equal(capSv('ä'), 'Ä');
  assert.equal(capSv(''), '');
});
