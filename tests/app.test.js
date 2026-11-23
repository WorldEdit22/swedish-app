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
  assert.match($('#progress').textContent, /^0 \/ \d+ öğrenildi$/);
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
