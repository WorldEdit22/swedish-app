import { test } from 'node:test';
import assert from 'node:assert/strict';
import { uttal, hintOf, EXCEPTIONS } from '../js/uttal.js';

const WORDS = `
hej hey | nej ney | tack tak | bil bi:l | hus hü:s | buss bös | hund hönd | sol su:l
komma koma | glas gla:s | glass glas | dag da:g | år o:r | äta e:ta | öl ö:l
sju şü: | kyrka şürka | göra yö:ra | gå go: | ge ye: | kök şö:k | tjej şey | tjugo şü:gu
sked şe:d | skola sku:la | station staşu:n | djur yü:r | hjälp yelp | ljus yü:s | jobb yob
kaffe kafe | mjölk myölk | fika fi:ka | rolig ru:li | roligt ru:lit | billig bili | svenska svenska
man man | han han | vem vem | rum röm | nu nü: | ja ya: | jag ya:g | du dü:
vatten vaten | äpple eple | pojke poyke | flicka flika | bröd brö:d | kille şile | kvinna kvina
taxi taksi | med me:d | vill vil | ha ha: | inte inte | mår mo:r | hur hü:r`;

const PAIRS = WORDS.split('|').map((p) => p.trim().split(/\s+/)).filter((p) => p.length === 2);

test('single words follow the spelling rules', () => {
  const wrong = PAIRS.filter(([sv, hint]) => uttal(sv) !== hint).map(([sv, hint]) => `${sv}: ${uttal(sv)} (want ${hint})`);
  assert.deepEqual(wrong, []);
});

test('common irregular words come from the exceptions', () => {
  const expected = {
    de: 'dom', dem: 'dom', mig: 'mey', dig: 'dey', sig: 'sey', och: 'ok', det: 'de:', är: 'e:r', hon: 'hun', ost: 'ust',
    sverige: 'sverye', gärna: 'ye:rna', människa: 'menişa', barn: 'ba:rn', bord: 'bu:rd', i: 'i', några: 'no:gra',
  };
  for (const [sv, hint] of Object.entries(expected)) {
    assert.equal(uttal(sv), hint, sv);
    assert.equal(EXCEPTIONS[sv], hint, `${sv} is in EXCEPTIONS`);
  }
});

test('be- and för- words are stressed after the prefix, -era verbs on the e', () => {
  const expected = {
    behöva: 'behö:va', betala: 'beta:la', betalar: 'beta:lar', berätta: 'bereta', besöka: 'besö:ka',
    förstå: 'föşto:', förklara: 'förkla:ra', förlora: 'förlu:ra', försöka: 'föşö:ka',
    fotografera: 'futugrafe:ra', fotograferade: 'futugrafe:rade', studera: 'stüde:ra',
    bebis: 'be:bis', första: 'föşta', förra: 'föra', före: 'fö:re',
  };
  for (const [sv, hint] of Object.entries(expected)) assert.equal(uttal(sv), hint, sv);
});

test('sentences keep spaces and punctuation, and ignore capitals', () => {
  assert.equal(uttal('Jag vill ha kaffe.'), 'ya:g vil ha: kafe.');
  assert.equal(uttal('Hej! Hur mår du?'), 'hey! hü:r mo:r dü:?');
  assert.equal(uttal('Det är min bil.'), 'de: e:r min bi:l.');
  assert.equal(uttal('Sverige'), 'sverye');
});

test('extra overrides win over the rules', () => {
  assert.equal(uttal('fin'), 'fin');
  assert.equal(uttal('fin', { fin: 'fi:n' }), 'fi:n');
  assert.equal(uttal('Det är fint.', { fint: 'fi:nt' }), 'de: e:r fi:nt.');
});

test("a word's own hint wins, else its spelling is converted", () => {
  assert.equal(hintOf({ sv: 'tycka om' }), 'tüka om');
  assert.equal(hintOf({ sv: 'cykel', ut: 'sükel' }), 'sükel');
  assert.equal(hintOf({ sv: 'fin' }, { fin: 'fi:n' }), 'fi:n');
});
