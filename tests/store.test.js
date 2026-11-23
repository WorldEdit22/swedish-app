import { test } from 'node:test';
import assert from 'node:assert/strict';

// An in-memory stand-in for the phone's localStorage, set before store.js loads.
const saved = new Map();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: { getItem: (k) => saved.get(k) ?? null, setItem: (k, v) => saved.set(k, String(v)) },
});
// Saved settings from before the two switches existed.
saved.set('sv.ui', JSON.stringify({ tab: 'words', sort: { words: 'todo', patterns: 'learned' }, status: { words: 'learned' } }));
// Marks from before practice mode, migrated once on first load.
saved.set('sv.learned', JSON.stringify({ 'food:bröd': 1 }));
// The Turkish app's data on the same origin must not be read.
saved.set('tl.learned', JSON.stringify({ 'food:ekmek': 1 }));
const { store } = await import('../js/store.js');

test('Swedish on blocks starts off and hints start on', () => {
  assert.equal(store.ui.showSwedish, false);
  assert.equal(store.ui.showHints, true);
});

test('the selection is saved on the device under sv.selected', () => {
  store.toggleSelected('kaffe');
  assert.ok(JSON.parse(saved.get('sv.selected')).kaffe);
  store.toggleSelected('kaffe');
  assert.equal(JSON.parse(saved.get('sv.selected')).kaffe, undefined);
});

test('toggleSelected selects and unselects a key', () => {
  assert.equal(store.isSelected('hus'), false);
  store.toggleSelected('hus');
  assert.equal(store.isSelected('hus'), true);
  store.toggleSelected('hus');
  assert.equal(store.isSelected('hus'), false);
});

test('clearSelected empties the selection and selectedCount follows', () => {
  store.clearSelected();
  store.toggleSelected('vatten');
  store.toggleSelected('p:want');
  assert.equal(store.selectedCount(), 2);
  store.clearSelected();
  assert.equal(store.selectedCount(), 0);
  assert.equal(store.isSelected('vatten'), false);
  assert.equal(store.isSelected('p:want'), false);
});

test("clearing one tab leaves the other tab's selection", () => {
  const isPattern = (k) => k.startsWith('p:');
  store.clearSelected();
  store.toggleSelected('vatten');
  store.toggleSelected('p:want');
  store.clearSelected(isPattern);
  assert.equal(store.isSelected('vatten'), true);
  assert.equal(store.isSelected('p:want'), false);
  assert.equal(store.selectedCount((k) => !isPattern(k)), 1);
  assert.equal(store.selectedCount(isPattern), 0);
  assert.deepEqual(JSON.parse(saved.get('sv.selected')), { vatten: 1 });
});

test('a new scan is saved first on the device', () => {
  store.addScan([['Gammal.']]);
  const scan = store.addScan([['Idag är det fint väder.', 'Vi går till parken.']]);
  assert.equal(store.scans[0], scan);
  assert.deepEqual(JSON.parse(saved.get('sv.scans')).list[0].paragraphs, [['Idag är det fint väder.', 'Vi går till parken.']]);
  assert.equal(typeof scan.id, 'string');
  assert.ok(!Number.isNaN(Date.parse(scan.date)));
});

test('only the 50 newest scans are kept', () => {
  for (let i = 0; i < 52; i++) store.addScan([[`Mening ${i}.`]]);
  assert.equal(store.scans.length, 50);
  assert.deepEqual(store.scans[0].paragraphs, [['Mening 51.']]);
  assert.deepEqual(store.scans[49].paragraphs, [['Mening 2.']]);
  assert.equal(new Set(store.scans.map((s) => s.id)).size, 50, 'ids are unique');
});

test('explanations are saved by sentence text', () => {
  store.saveExplanation('Kom.', { tr: 'Gel.', structure: '', words: [] });
  assert.deepEqual(store.explanation('Kom.'), { tr: 'Gel.', structure: '', words: [] });
  assert.equal(store.explanation('Gå.'), undefined);
  assert.equal(JSON.parse(saved.get('sv.explain'))['Kom.'].tr, 'Gel.');
});

test('deleting a scan keeps only the explanations another scan still uses', () => {
  const a = store.addScan([['Sitt.', 'Delad mening.']]);
  store.addScan([['Delad mening.']]);
  store.saveExplanation('Sitt.', { tr: 'Otur.', structure: '', words: [] });
  store.saveExplanation('Delad mening.', { tr: 'Ortak cümle.', structure: '', words: [] });
  store.deleteScan(a.id);
  assert.ok(!store.scans.some((s) => s.id === a.id));
  assert.ok(!JSON.parse(saved.get('sv.scans')).list.some((s) => s.id === a.id));
  assert.equal(store.explanation('Sitt.'), undefined);
  assert.equal(store.explanation('Delad mening.').tr, 'Ortak cümle.');
  assert.ok(!('Sitt.' in JSON.parse(saved.get('sv.explain'))));
});

test('a scan dropped by the 50-scan limit takes its own explanations with it', () => {
  const oldest = store.addScan([['Den äldsta meningen.']]);
  store.saveExplanation('Den äldsta meningen.', { tr: 'En eski cümle.', structure: '', words: [] });
  for (let i = 0; i < 50; i++) store.addScan([[`Ny ${i}.`]]);
  assert.ok(!store.scans.some((s) => s.id === oldest.id));
  assert.equal(store.explanation('Den äldsta meningen.'), undefined);
});

const KEY = 'food:bröd';

test('old learned marks become known in both directions', () => {
  assert.equal(store.card(KEY, 'say').ivl, 7);
  assert.equal(store.card(KEY, 'understand').ivl, 7);
  assert.equal(store.card('food:ekmek', 'say'), undefined, "the Turkish app's marks are not migrated");
});

test('saved learned sorts and the status filter are dropped', () => {
  assert.equal(store.ui.sort.words, 'topic');
  assert.equal(store.ui.sort.patterns, 'common');
  assert.equal(store.ui.status, undefined);
  assert.equal(store.ui.mode, 'browse');
  assert.equal(store.ui.dir, 'say');
  assert.equal(store.ui.topic, 'all');
});

test('setCard saves under sv.practice', () => {
  store.setCard('te', 'say', { ivl: 1, due: 5, last: 'hard', prev: null });
  assert.equal(JSON.parse(saved.get('sv.practice')).cards.te.say.last, 'hard');
  assert.equal(store.card('te', 'understand'), undefined);
});

test('the daily dose is saved and starts over on a new day', () => {
  assert.equal(store.doseLeft('say', 100), 15);
  store.useDose('say', 100);
  store.useDose('say', 100);
  assert.equal(store.doseLeft('say', 100), 13);
  assert.equal(store.doseLeft('understand', 100), 15);
  assert.equal(JSON.parse(saved.get('sv.practice')).daily.say.used, 2);
  store.giveBackDose('say', 100);
  assert.equal(store.doseLeft('say', 100), 14);
  store.addDose('say', 100);
  assert.equal(store.doseLeft('say', 100), 29);
  assert.equal(store.doseLeft('say', 101), 15);
});

test("a v2 backup round-trips; an old learned backup is migrated; another app's, broken or empty backups are refused", () => {
  const text = store.backupText();
  const parsed = JSON.parse(text);
  assert.equal(parsed.app, 'swedish');
  assert.equal(parsed.v, 2);
  assert.deepEqual(store.parseBackup(text, 100), store.cards);
  const old = store.parseBackup('{"app":"swedish","learned":{"a":1}}', 100);
  assert.equal(old.a.say.ivl, 7);
  assert.equal(old.a.understand.ivl, 7);
  assert.ok(old.a.say.due >= 101 && old.a.say.due <= 121);
  assert.equal(store.parseBackup('{"app":"turkish","learned":{"a":1}}', 100), null);
  assert.equal(store.parseBackup('{"app":"turkish","v":2,"cards":{}}', 100), null);
  assert.equal(store.parseBackup('{"learned":{"a":1}}', 100), null);
  assert.equal(store.parseBackup('not json', 100), null);
  assert.equal(store.parseBackup('{"app":"swedish"}', 100), null);
  assert.equal(store.parseBackup('{"app":"swedish","learned":[1]}', 100), null);
});

test('replaceCards swaps all cards and saves', () => {
  store.replaceCards({ x: { say: { ivl: 2, due: 9, last: 'easy', prev: null } } });
  assert.equal(store.card('te', 'say'), undefined);
  assert.equal(store.card('x', 'say').ivl, 2);
  assert.equal(JSON.parse(saved.get('sv.practice')).cards.x.say.due, 9);
});

test('migration runs once: Reset progress does not bring old marks back', async () => {
  store.resetProgress();
  assert.equal(store.card(KEY, 'say'), undefined);
  assert.equal(store.doseLeft('say', 100), 15);
  const again = (await import('../js/store.js?again')).store;
  assert.equal(again.card(KEY, 'say'), undefined);
});
