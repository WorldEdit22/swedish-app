import { test } from 'node:test';
import assert from 'node:assert/strict';

// A small stand-in for the page, enough to run app.js: every element is a stub that
// keeps its innerHTML and listeners, so the test can draw screens and "click".
const elements = new Map();
function element(name) {
  return {
    name,
    innerHTML: '',
    textContent: '',
    value: '',
    hidden: false,
    open: false,
    scrollTop: 0,
    dataset: {},
    style: {},
    listeners: {},
    parentElement: null,
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    addEventListener(type, fn) {
      (this.listeners[type] ||= []).push(fn);
    },
    fire(type, event = {}) {
      for (const fn of this.listeners[type] || []) fn({ target: this, preventDefault() {}, ...event });
    },
    setAttribute() {},
    focus() {},
    select() {},
    setSelectionRange() {},
    append() {},
    insertAdjacentHTML() {},
    querySelector: () => null,
    showModal() {
      this.open = true;
    },
    close() {
      this.open = false;
      this.fire('close');
    },
  };
}
const $ = (sel) => {
  if (!elements.has(sel)) elements.set(sel, element(sel));
  return elements.get(sel);
};
const saved = new Map();
Object.assign(globalThis, {
  window: globalThis,
  document: { querySelector: $, querySelectorAll: () => [], body: element('body') },
  location: { protocol: 'http:' },
  scrollTo() {},
  confirm: () => true,
});
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: { getItem: (k) => saved.get(k) ?? null, setItem: (k, v) => saved.set(k, String(v)) },
});

// Seed before app.js loads: one real word mastered both ways, and a card for a word that no longer exists.
const { dayOf } = await import('../js/srs.js');
const { WORDS } = await import('../data/words.js');
const mastered = () => ({ ivl: 30, due: dayOf(Date.now()) + 30, last: 'easy', prev: null });
saved.set(
  'sv.practice',
  JSON.stringify({
    migrated: true,
    cards: {
      'food:bröd': { say: mastered(), understand: mastered() },
      'food:gone': { say: mastered(), understand: mastered() },
    },
    daily: null,
  }),
);

await import('../js/app.js');

// A click on something inside a block, the way the list's click handler sees it.
const clickBlock = (key, onInfo) => {
  const block = { dataset: { key }, classList: { toggle() {} }, setAttribute() {} };
  $('#list').fire('click', { target: { closest: (s) => (s === '.block' ? block : s === '.b-info' && onInfo ? {} : null) } });
};
const clean = (html) => !/undefined|NaN|\[object Object\]/.test(html);

test('the word list draws with Turkish labels and no broken values', () => {
  const html = $('#list').innerHTML;
  assert.ok((html.match(/class="block/g) || []).length > 900, 'every word has a block');
  assert.ok(html.includes('data-key="drinks:vatten"'));
  assert.ok(clean(html));
});

test('the word list has no learned look and counts mastered words; cards for words that no longer exist count nowhere', () => {
  assert.ok(!$('#list').innerHTML.includes('class="block on'));
  assert.equal($('#progress').textContent, `1 / ${WORDS.length} ezberlendi`);
});

test('the status filter and the learned sorts are gone', () => {
  const html = $('#sort').innerHTML;
  assert.ok(html.includes('value="topic"'), 'the sort list is drawn');
  assert.ok(!/value="(todo|learned)"/.test(html));
});

test('a word window shows the Swedish, its hint, forms and examples', () => {
  clickBlock('drinks:vatten', true);
  const html = $('#sheet-body').innerHTML;
  assert.ok(html.includes('<h2>su</h2>'), 'Turkish title');
  assert.ok(html.includes('lang="sv">vatten</span>'), 'Swedish headline');
  assert.ok(html.includes('[vaten]'), 'pronunciation hint');
  assert.ok(html.includes('vatten · vattnet'), 'forms line');
  assert.ok(html.includes('class="ex-sv"'), 'examples');
  assert.ok(html.includes('data-act="alphabet"') && html.includes('data-act="translate"'));
  assert.ok(clean(html));
  $('#sheet').close();
});

test('a pattern window shows its variants with examples', () => {
  clickBlock('p:want', true);
  const html = $('#sheet-body').innerHTML;
  assert.ok(html.includes('Jag vill ha ___'));
  assert.ok(html.includes('istiyorum'));
  assert.ok(clean(html));
  $('#sheet').close();
});

test('the alphabet and the translator open', () => {
  $('#abc-btn').fire('click');
  assert.equal((($('#alphabet-body').innerHTML.match(/class="abc-row"/g)) || []).length, 29);
  $('#alphabet').close();
  $('#tr-btn').fire('click');
  assert.ok($('#translator-body').innerHTML.includes('placeholder="Türkçe yaz"'));
  $('#translator').close();
});

test('Settings draws in Turkish', () => {
  $('#gear').fire('click');
  const html = $('#settings').innerHTML;
  for (const text of ['Bloklar', 'Okunuş', 'İlerleme', 'Hakkında', 'id="set-showsv"', 'id="set-hints"']) assert.ok(html.includes(text), text);
  assert.ok(clean(html));
  $('#gear').fire('click');
});

const { store } = await import('../js/store.js');
const clickSheet = (dataset) => $('#sheet-body').fire('click', { target: { closest: (s) => (s === '[data-act]' ? { dataset } : null) } });
const onButton = (html, dir, grade) => html.includes(`class="on" data-act="recall" data-dir="${dir}" data-grade="${grade}"`);
const clickSettings = (id) => $('#settings').fire('click', { target: { id, closest: () => null } });
const withSettings = async (fn) => {
  $('#gear').fire('click');
  try {
    await fn();
  } finally {
    $('#gear').fire('click');
  }
};

test("a word window shows both directions' recall state with New highlighted", () => {
  clickBlock('drinks:vatten', true);
  try {
    const html = $('#sheet-body').innerHTML;
    assert.equal((html.match(/data-dir="/g) || []).length, 8, 'two rows of four buttons');
    assert.ok(html.includes('TR → SV') && html.includes('SV → TR') && html.includes('Çalışma'));
    assert.ok(onButton(html, 'say', 'new') && onButton(html, 'understand', 'new'));
    assert.ok(!html.includes('learn-btn') && clean(html));
  } finally {
    $('#sheet').close();
  }
});

test('tapping Easy in the window answers that direction now; tapping New puts it back, and Easy again restores it', () => {
  const today = dayOf(Date.now());
  const dose = store.doseLeft('say', today);
  clickBlock('drinks:vatten', true);
  try {
    $('#sheet').scrollTop = 120;
    clickSheet({ act: 'recall', dir: 'say', grade: 'easy' });
    assert.equal(store.card('drinks:vatten', 'say').last, 'easy');
    assert.ok(onButton($('#sheet-body').innerHTML, 'say', 'easy'), 'the window is redrawn');
    assert.ok(onButton($('#sheet-body').innerHTML, 'understand', 'new'), 'the other direction is untouched');
    assert.equal($('#sheet').scrollTop, 120, 'the scroll position is kept');
    assert.equal(store.doseLeft('say', today), dose, 'the daily dose is untouched');

    clickSheet({ act: 'recall', dir: 'say', grade: 'new' });
    assert.ok(onButton($('#sheet-body').innerHTML, 'say', 'new'));
    assert.equal(store.card('drinks:vatten', 'say')?.last ?? 'new', 'new');

    clickSheet({ act: 'recall', dir: 'say', grade: 'easy' });
    assert.equal(store.card('drinks:vatten', 'say').last, 'easy');
    assert.equal(store.doseLeft('say', today), dose);
  } finally {
    $('#sheet').close();
    const cards = { ...store.cards };
    delete cards['drinks:vatten'];
    store.replaceCards(cards);
  }
});

test('Settings shows mastered counts, in Turkish', () =>
  withSettings(() => {
    const html = $('#settings').innerHTML;
    assert.ok(html.includes(`${WORDS.length} kelimeden 1 tanesi ezberlendi.`), html);
    assert.ok(!/öğrenildi/.test(html));
  }));

test('Restore asks first: declined leaves the cards as they were', () =>
  withSettings(() => {
    const before = structuredClone(store.cards);
    const backup = JSON.parse(store.backupText());
    backup.cards = {};
    const ask = globalThis.confirm;
    let asked = 0;
    globalThis.confirm = () => (asked++, false);
    try {
      clickSettings('set-restore'); // opens the paste box
      $('#set-backup-text').value = JSON.stringify(backup);
      clickSettings('set-restore');
      assert.equal(asked, 1);
      assert.deepEqual(store.cards, before);
    } finally {
      globalThis.confirm = ask;
    }
  }));

test('Reset clears practice data', () =>
  withSettings(() => {
    const before = structuredClone(store.cards);
    try {
      clickSettings('set-reset');
      assert.deepEqual(store.cards, {});
      assert.ok($('#settings').innerHTML.includes(`${WORDS.length} kelimeden 0 tanesi ezberlendi.`));
    } finally {
      store.replaceCards(before);
    }
  }));

test('switching tabs scrolls the list, not the window, back to the top', () => {
  $('#list').scrollTop = 500;
  const tabs = document.querySelector('.tabs');
  try {
    tabs.fire('click', { target: { closest: () => ({ dataset: { tab: 'patterns' } }) } });
    assert.equal($('#list').scrollTop, 0);
  } finally {
    tabs.fire('click', { target: { closest: () => ({ dataset: { tab: 'words' } }) } });
  }
});

test('searching without å, ä, ö finds the word', () => {
  $('#search').value = 'har';
  $('#search').fire('input');
  assert.ok($('#list').innerHTML.includes('data-key="basics:här"'));
  $('#search').value = '';
  $('#search').fire('input');
});
