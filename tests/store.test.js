import { test } from 'node:test';
import assert from 'node:assert/strict';

// An in-memory stand-in for the phone's localStorage, set before store.js loads.
const saved = new Map();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: { getItem: (k) => saved.get(k) ?? null, setItem: (k, v) => saved.set(k, String(v)) },
});
// Saved settings from before the two switches existed.
saved.set('sv.ui', JSON.stringify({ tab: 'words' }));
// The Turkish app's data on the same origin must not be read.
saved.set('tl.learned', JSON.stringify({ 'food:ekmek': 1 }));
const { store } = await import('../js/store.js');

test('Swedish on blocks starts off and hints start on', () => {
  assert.equal(store.ui.showSwedish, false);
  assert.equal(store.ui.showHints, true);
});

test("the Turkish app's progress is not read", () => {
  assert.deepEqual(store.learned, {});
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

test('selecting does not mark learned', () => {
  store.toggleSelected('kaffe');
  assert.equal(store.isLearned('kaffe'), false);
  store.toggleLearned('te');
  assert.equal(store.isSelected('te'), false);
});

test('a backup round-trips through parseBackup', () => {
  store.toggleLearned('food:bröd');
  const text = store.backupText();
  assert.equal(JSON.parse(text).app, 'swedish');
  assert.deepEqual(store.parseBackup(text), store.learned);
});

test("a Turkish-app backup, broken text or a backup without progress is refused", () => {
  assert.equal(store.parseBackup('{"app":"turkish","learned":{"a":1}}'), null);
  assert.equal(store.parseBackup('{"learned":{"a":1}}'), null);
  assert.equal(store.parseBackup('not json'), null);
  assert.equal(store.parseBackup('{"app":"swedish"}'), null);
  assert.equal(store.parseBackup('{"app":"swedish","learned":[1]}'), null);
});
