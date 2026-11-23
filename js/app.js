import { WORDS, CATEGORIES, TYPES } from '../data/words.js';
import { PATTERNS, GROUPS } from '../data/patterns.js';
import { RANKS } from '../data/ranks.js';
import { LETTERS, COMBOS } from '../data/alfabe.js';
import { fits } from './combine.js';
import { patternExamples, wordExamples, wordPatternPairs, slotOf } from './examples.js';
import { formsLine } from './svenska.js';
import { uttal, hintOf } from './uttal.js';
import { store } from './store.js';
import { PROVIDERS, AIError, generate, patternPrompt, wordPrompt, readPage, explainSentence } from './ai.js';
import { swipe } from './swipe.js';
import { reloadOnUpdate } from './update.js';
import { esc, fold, SPEAKER, BUBBLE, ABC } from './html.js';
import { shrinkPhoto } from './photo.js';
import { sentencesOf, scanDate, scansListHtml, scanHtml, sentenceHtml } from './scanview.js';
import { translate, TranslateError, FAILED, googleLink, swapState } from './translate.js';
import { translatorHtml, resultHtml } from './translateview.js';
import { alfabeHtml } from './alfabeview.js';
import { T } from './metin.js';

// Every visible string comes from T (js/metin.js) or the data; app.js has no text of its own.

// ---------- data ----------

const CAT = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
const CAT_ORDER = Object.fromEntries(CATEGORIES.map((c, i) => [c.id, i]));

WORDS.forEach((w, i) => {
  w.score = RANKS[w.id] ?? 0;
  w.order = i;
  w.label = w.gloss || w.tr;
});
const BY_COMMON = [...WORDS].sort((a, b) => b.score - a.score || a.order - b.order);
BY_COMMON.forEach((w, i) => (w.rank = i + 1));
PATTERNS.forEach((p, i) => {
  p.rank = i + 1;
  p.key = `p:${p.id}`;
  p.label = p.tr;
});

const ITEM = new Map([...WORDS.map((w) => [w.id, w]), ...PATTERNS.map((p) => [p.key, p])]);
const keyOf = (x) => x.key || x.id;
const isPattern = (x) => Boolean(x.variants);

// Pronunciation overrides for single words, used inside sentences too.
const UT = Object.fromEntries(WORDS.filter((w) => w.ut && !w.sv.includes(' ')).map((w) => [w.sv.toLowerCase(), w.ut]));
const sayIt = (s) => uttal(s, UT);
// The hint function the views take, or null while hints are switched off.
const hints = () => (ui.showHints ? sayIt : null);
const hintFor = (x) => (isPattern(x) ? sayIt(x.sv) : hintOf(x, UT));

// ---------- helpers ----------

const $ = (s) => document.querySelector(s);
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const learned = (x) => store.isLearned(keyOf(x));
const selected = (x) => store.isSelected(keyOf(x));

const INFO = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.6v.01"/></svg>';
const sayButton = (text) => `<button class="say" data-say="${esc(text)}" aria-label="${esc(T.aria.listen)}">${SPEAKER}</button>`;

// ---------- speech ----------

function swedishVoice() {
  if (!('speechSynthesis' in window)) return null;
  return speechSynthesis.getVoices().find((v) => (v.lang || '').toLowerCase().startsWith('sv')) || null;
}

// iPhone and iPad (iPadOS reports itself as a Mac with touch).
const isAppleTouch = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
// On iPhone the built-in voice follows the silent switch, and no web trick gets past it.
// Say so on the first tap of each launch.
let soundHintShown = false;

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'sv-SE';
  const v = swedishVoice();
  if (v) u.voice = v;
  u.rate = 0.9;
  if (isAppleTouch && !soundHintShown) {
    soundHintShown = true;
    toast(T.sound, 3000);
  }
  speechSynthesis.speak(u);
}

// ---------- list view ----------

const ui = store.ui;

function visibleItems(tab) {
  const isP = tab === 'patterns';
  let items = isP ? PATTERNS : WORDS;
  const q = fold($('#search').value.trim());
  if (q) {
    items = items.filter((x) => {
      const extra = isP ? x.variants.map((v) => `${v.sv} ${v.tr}`).join(' ') : '';
      return fold(`${x.label} ${x.sv} ${x.tr} ${extra}`).includes(q);
    });
  }
  if (!isP && ui.type !== 'all') items = items.filter((w) => w.type === ui.type);
  if (isP && ui.pgroup !== 'all') items = items.filter((p) => p.group === ui.pgroup);
  const st = ui.status[tab];
  if (st !== 'all') items = items.filter((x) => learned(x) === (st === 'learned'));

  const byRank = (a, b) => a.rank - b.rank;
  const sort = ui.sort[tab];
  const sorted = [...items];
  if (sort === 'sv') sorted.sort((a, b) => a.sv.localeCompare(b.sv, 'sv'));
  else if (sort === 'tr') sorted.sort((a, b) => a.label.localeCompare(b.label, 'tr'));
  else if (sort === 'todo') sorted.sort((a, b) => learned(a) - learned(b) || byRank(a, b));
  else if (sort === 'learned') sorted.sort((a, b) => learned(b) - learned(a) || byRank(a, b));
  else if (sort === 'topic') sorted.sort((a, b) => CAT_ORDER[a.cat] - CAT_ORDER[b.cat] || byRank(a, b));
  else sorted.sort(byRank);
  return sorted;
}

// Tapping a block selects it; the ⓘ button opens its card. Blocks show the Turkish;
// the Swedish (and its pronunciation) only when switched on in Settings.
function blockHtml(x, showIcon) {
  const on = learned(x);
  const sel = store.isSelected(keyOf(x));
  const dot = isPattern(x) ? '' : `<span class="dot t-${x.type}"></span>`;
  return (
    `<div class="block${on ? ' on' : ''}${sel ? ' sel' : ''}" data-key="${esc(keyOf(x))}" role="button" tabindex="0"` +
    ` aria-pressed="${sel}" aria-label="${esc(`${x.label}, ${x.sv}${on ? T.aria.learnedSuffix : ''}`)}">` +
    `<div class="b-label">${dot}<span>${esc(x.label)}</span></div>` +
    (ui.showSwedish
      ? `<div class="b-sv" lang="sv">${esc(x.sv)}${ui.showHints ? ` <span class="hint">[${esc(hintFor(x))}]</span>` : ''}</div>`
      : '') +
    `<button class="b-info" aria-label="${esc(T.aria.details)}">${INFO}</button>` +
    (showIcon ? `<span class="b-icon">${CAT[x.cat].icon}</span>` : '') +
    `</div>`
  );
}

function renderList() {
  const tab = ui.tab;
  const items = visibleItems(tab);
  const list = $('#list');
  if (!items.length) {
    list.innerHTML = `<p class="empty">${esc(T.empty)}</p>`;
  } else if (tab === 'words' && ui.sort.words === 'topic') {
    let html = '';
    for (const c of CATEGORIES) {
      const inCat = items.filter((w) => w.cat === c.id);
      if (!inCat.length) continue;
      const all = WORDS.filter((w) => w.cat === c.id);
      const done = all.filter(learned).length;
      html +=
        `<h2 class="sec">${c.icon} ${esc(c.label)} <span class="count">${done}/${all.length}</span></h2>` +
        `<div class="grid">${inCat.map((w) => blockHtml(w, false)).join('')}</div>`;
    }
    list.innerHTML = html;
  } else {
    list.innerHTML = `<div class="grid">${items.map((x) => blockHtml(x, tab === 'words')).join('')}</div>`;
  }
  renderProgress();
}

function renderProgress() {
  const all = ui.tab === 'patterns' ? PATTERNS : ui.tab === 'words' ? WORDS : null;
  $('#progress').textContent = all ? T.progress(all.filter(learned).length, all.length) : T.settingsTitle;
}

function renderControls() {
  const tab = ui.tab;
  const listTab = tab !== 'settings';
  $('#controls').hidden = !listTab;
  renderClear();
  $('#gear').setAttribute('aria-pressed', String(!listTab));
  document.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
  if (!listTab) {
    renderProgress();
    return;
  }

  document.querySelectorAll('#status button').forEach((b) => b.classList.toggle('on', b.dataset.status === ui.status[tab]));
  $('#sort').innerHTML = Object.entries(T.sorts[tab])
    .map(([v, label]) => `<option value="${v}"${ui.sort[tab] === v ? ' selected' : ''}>${esc(label)}</option>`)
    .join('');

  // Chip row: word types on the Words tab, pattern groups on the Patterns tab.
  const chips =
    tab === 'words'
      ? [['all', T.all, '']].concat(Object.entries(TYPES).map(([id, t]) => [id, t.label, `<span class="dot t-${id}"></span>`]))
      : [['all', T.all, '']].concat(Object.entries(GROUPS).map(([id, label]) => [id, label, '']));
  const current = tab === 'words' ? ui.type : ui.pgroup;
  const attr = tab === 'words' ? 'data-type' : 'data-group';
  $('#types').setAttribute('aria-label', tab === 'words' ? T.aria.wordType : T.aria.patternGroup);
  $('#types').innerHTML = chips
    .map(([id, label, dot]) => `<button class="chip${current === id ? ' on' : ''}" ${attr}="${id}">${dot}${esc(label)}</button>`)
    .join('');
}

function render() {
  renderControls();
  const settings = ui.tab === 'settings';
  $('#list').hidden = settings;
  $('#settings').hidden = !settings;
  if (settings) renderSettings();
  else renderList();
}

// Settings opens from the gear; the gear again goes back to the list it came from.
let lastListTab = 'words';

function setTab(tab) {
  if (tab !== 'settings') lastListTab = tab;
  ui.tab = tab;
  store.saveUi();
  $('#search').value = '';
  render();
  // Only the list and Settings scroll; the page itself never does.
  $('#list').scrollTop = 0;
  $('#settings').scrollTop = 0;
}

// ---------- sheet (detail card) ----------

const sheet = $('#sheet');
let openKey = null;

function partsHtml(parts) {
  return parts.map((p) => (p.hl ? `<b>${esc(p.text)}</b>` : esc(p.text))).join('');
}

// One example: the Swedish with a speaker, its pronunciation, then the Turkish.
function exHtml(sv, tr, opts = {}) {
  const svH = opts.svParts ? partsHtml(opts.svParts) : esc(sv);
  const trH = opts.trParts ? partsHtml(opts.trParts) : esc(tr);
  const h = hints();
  return (
    `<div class="ex">${sayButton(sv)}` +
    `<div><div class="ex-sv" lang="sv">${svH}</div>` +
    (h ? `<div class="hint">${esc(h(sv))}</div>` : '') +
    `<div class="ex-tr">${trH}</div>` +
    (opts.from ? `<div class="ex-from" lang="sv">${esc(opts.from)}</div>` : '') +
    `</div></div>`
  );
}

// Sections from examples.js: "Seçiminden" (with a "Burada kullanılmadı" line), then "Örnekler".
// `label` names a not-used item, as its block shows it.
function examplesHtml({ selected, notUsed, examples }, label) {
  const rows = (list) => list.map((r) => exHtml(r.sv, r.tr, { svParts: r.svParts, trParts: r.trParts, from: r.from })).join('');
  let h = '';
  if (selected.length || notUsed.length) {
    h += `<div class="sub"><span>${esc(T.sections.selected)}</span></div>${rows(selected)}`;
    if (notUsed.length) h += `<p class="not-used">${esc(T.sections.notUsed + notUsed.map(label).join(', '))}</p>`;
  }
  if (examples.length) h += `<div class="sub"><span>${esc(T.sections.examples)}</span></div>${rows(examples)}`;
  return h;
}

function aiHtml(cacheKey, vi = '') {
  const cached = store.ai[cacheKey] || [];
  const ready = store.settings.provider && store.settings.keys?.[store.settings.provider];
  return (
    `<div class="ai" data-ck="${esc(cacheKey)}">` +
    (cached.length ? `<div class="sub"><span>${esc(T.sections.ai)}</span></div>` : '') +
    `<div class="ai-list">${cached.map((e) => exHtml(e.sv, e.tr)).join('')}</div>` +
    (ready
      ? `<button class="ai-btn" data-act="ai" data-v="${vi}">${esc(T.ai.more)}</button>`
      : `<button class="ai-btn" data-act="setup">${esc(T.ai.setup)}</button>`) +
    `<div class="ai-msg" role="status"></div></div>`
  );
}

// The alphabet, the translate bubble and ✕, at the right end of every window's title row.
const headButtons = () =>
  `<button class="head-abc" data-act="alphabet" aria-label="${esc(T.aria.alphabet)}">${ABC}</button>` +
  `<button class="head-tr" data-act="translate" aria-label="${esc(T.aria.translate)}">${BUBBLE}</button>` +
  `<button class="close" data-act="close" aria-label="${esc(T.aria.close)}">✕</button>`;

// The title row with ✕ sits in .s-top, which stays at the top while the card scrolls.
// Then the Swedish with a speaker, its pronunciation, its forms, and the meta line.
function headHtml(title, x, { meta = '', forms = '' } = {}) {
  const on = learned(x);
  return (
    `<div class="s-top"><div class="grabber"></div>` +
    `<div class="s-head"><h2>${esc(title)}</h2>${headButtons()}</div></div>` +
    `<div class="s-tr"><span lang="sv">${esc(x.sv)}</span>${sayButton(x.sv.replace(/_+|…|\.\.\./g, ' '))}</div>` +
    (ui.showHints ? `<p class="hint">[${esc(hintFor(x))}]</p>` : '') +
    (forms ? `<div class="forms" lang="sv">${esc(forms)}</div>` : '') +
    (meta ? `<div class="s-meta">${meta}</div>` : '') +
    `<button class="learn-btn${on ? ' on' : ''}" data-act="toggle">${esc(on ? T.learn.on : T.learn.off)}</button>`
  );
}

const exampleOpts = () => ({ words: BY_COMMON, patterns: PATTERNS, isSelected: selected, isLearned: learned });

function patternSheet(p) {
  let h = headHtml(p.tr, p);
  const hint = hints();
  p.variants.forEach((v, vi) => {
    h +=
      `<section class="variant">` +
      `<div class="v-sv" lang="sv">${esc(v.sv)}</div>` +
      (hint ? `<div class="hint">${esc(hint(v.sv))}</div>` : '') +
      `<div class="v-tr">${esc(v.tr)}</div>` +
      (v.note ? `<p class="note">${esc(v.note)}</p>` : '') +
      examplesHtml(patternExamples(p, vi, exampleOpts()), (w) => w.label) +
      aiHtml(`${p.key}#${vi}`, vi) +
      `</section>`;
  });
  return h;
}

function wordSheet(w) {
  const c = CAT[w.cat];
  const meta = `${esc(TYPES[w.type].one)} · ${c.icon} ${esc(c.label)}`;
  let h = headHtml(w.label, w, { meta, forms: formsLine(w) });
  if (w.note) h += `<p class="note">${esc(w.note)}</p>`;
  h += examplesHtml(wordExamples(w, exampleOpts()), (p) => p.label);
  if (w.type !== 'phrase') h += aiHtml(w.id);
  return h;
}

// ---------- photo scans (shown in the same window) ----------
//
// scanView: null while the window shows a word or pattern (openKey), else
//   { kind: 'scans' } | { kind: 'scan', id } | { kind: 'sentence', id, si }.
// An answer that arrives after the user moved on is saved, but only drawn if
// its view is still showing.

let scanView = null;
let readStatus = null; // the list's status: null | 'reading' | 'empty' | { error }
let pendingPhoto = null; // the shrunk photo, kept for "Tekrar dene"
const explainStatus = new Map(); // sentence → 'loading' | { error }

const errorText = (e) => (e instanceof AIError ? e.message : T.ai.failed);
const findScan = (id) => store.scans.find((s) => s.id === id);
const sentenceOf = (v) => sentencesOf(findScan(v.id))[v.si];

function scanTop(title, back) {
  return (
    `<div class="s-top"><div class="grabber"></div><div class="s-head">` +
    (back ? `<button class="back" data-act="back" aria-label="${esc(T.aria.back)}">‹</button>` : '') +
    `<h2>${esc(title)}</h2>${headButtons()}</div></div>`
  );
}

function scanSheet(v) {
  if (v.kind !== 'scans' && !findScan(v.id)) scanView = v = { kind: 'scans' }; // deleted meanwhile
  if (v.kind === 'scans') {
    return scanTop(T.scans.title, false) + scansListHtml(store.scans, { hasKey: Boolean(store.settings.keys?.gemini), status: readStatus });
  }
  const scan = findScan(v.id);
  if (v.kind === 'scan') return scanTop(scanDate(scan.date), true) + scanHtml(scan, (s) => Boolean(store.explanation(s)));
  const sentence = sentenceOf(v);
  return scanTop(T.scans.sentence, true) + sentenceHtml(sentence, store.explanation(sentence), explainStatus.get(sentence) || null, hints());
}

// Redraw only if the window still shows a view that `matches`.
function refreshIf(matches) {
  if (sheet.open && scanView && matches(scanView)) renderSheet();
}

// Where the reader was on each scan page, so ‹ back from a sentence returns to the same place.
const scanScroll = new Map();

function openScanView(v) {
  if (sheet.open && scanView?.kind === 'scan') scanScroll.set(scanView.id, sheet.scrollTop);
  openKey = null;
  scanView = v;
  showSheet(v.kind === 'scan' ? scanScroll.get(v.id) || 0 : 0);
}

async function readPhoto(file) {
  if (readStatus === 'reading') return;
  if (!file && !pendingPhoto) {
    readStatus = null; // nothing to retry (the photo could not be used): pick a new one
    refreshIf((v) => v.kind === 'scans');
    return;
  }
  readStatus = 'reading';
  refreshIf((v) => v.kind === 'scans');
  try {
    if (file) {
      try {
        pendingPhoto = await shrinkPhoto(file);
      } catch {
        throw new AIError(T.scans.badPhoto);
      }
    }
    const paragraphs = await readPage(store.settings, pendingPhoto);
    if (!paragraphs.length) readStatus = 'empty';
    else {
      const scan = store.addScan(paragraphs);
      readStatus = null;
      pendingPhoto = null;
      if (sheet.open && scanView?.kind === 'scans') return openScanView({ kind: 'scan', id: scan.id });
    }
  } catch (e) {
    readStatus = { error: errorText(e) };
  }
  refreshIf((v) => v.kind === 'scans');
}

async function explain(sentence) {
  if (explainStatus.get(sentence) === 'loading') return;
  const showing = (v) => v.kind === 'sentence' && sentenceOf(v) === sentence;
  explainStatus.set(sentence, 'loading');
  refreshIf(showing);
  try {
    store.saveExplanation(sentence, await explainSentence(store.settings, sentence));
    explainStatus.delete(sentence);
  } catch (e) {
    explainStatus.set(sentence, { error: errorText(e) });
  }
  refreshIf(showing);
}

function openSentence(id, si) {
  openScanView({ kind: 'sentence', id, si });
  const sentence = sentenceOf(scanView);
  if (!store.explanation(sentence)) explain(sentence);
}

$('#scan-btn').addEventListener('click', () => openScanView({ kind: 'scans' }));

$('#sheet-body').addEventListener('change', (e) => {
  if (!e.target.matches('input[type="file"]')) return;
  const file = e.target.files?.[0];
  e.target.value = '';
  if (file) readPhoto(file);
});

$('#sheet-body').addEventListener('keydown', (e) => {
  const s = e.target.closest?.('.sent');
  if (s && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    openSentence(scanView.id, Number(s.dataset.si));
  }
});

// ---------- the window ----------

function renderSheet() {
  if (scanView) {
    $('#sheet-body').innerHTML = scanSheet(scanView);
    return;
  }
  const x = ITEM.get(openKey);
  if (!x) return;
  $('#sheet-body').innerHTML = isPattern(x) ? patternSheet(x) : wordSheet(x);
}

function showSheet(scrollTop = 0) {
  renderSheet();
  if (!sheet.open) {
    document.body.classList.add('noscroll');
    sheet.showModal();
  }
  sheet.focus({ preventScroll: true }); // keep focus off the close button so no focus ring shows
  sheet.scrollTop = scrollTop;
}

function openSheet(key) {
  scanView = null;
  openKey = key;
  showSheet();
}

sheet.addEventListener('close', () => {
  document.body.classList.remove('noscroll');
  window.speechSynthesis?.cancel();
  openKey = null;
  scanView = null;
  renderList();
});

// Tap on the dimmed backdrop closes the sheet.
sheet.addEventListener('click', (e) => {
  if (e.target === sheet) sheet.close();
});

// ---------- translator (Google Translate, Turkish ⇄ Swedish) ----------
//
// A second window that opens on top of anything, the sheet included; closing it
// returns to what was below. Text and direction last while the app is open.

const translator = $('#translator');
const trState = { text: '', from: 'tr', result: '', resultFor: '', error: null }; // resultFor: the text `result` translates
let trSeq = 0; // bumped on every change, so a late answer to older text is dropped
let trTimer = null;

const renderTranslator = () => ($('#translator-body').innerHTML = translatorHtml(trState, hints()));
const renderTrResult = () => ($('#tr-result').innerHTML = resultHtml(trState, hints()));

function focusTrInput() {
  const box = $('#tr-input');
  box.focus({ preventScroll: true });
  box.setSelectionRange(box.value.length, box.value.length);
}

function openTranslator() {
  renderTranslator();
  if (!translator.open) {
    document.body.classList.add('noscroll');
    translator.showModal();
  }
  translator.scrollTop = 0;
  focusTrInput();
  // The last try failed (say, while offline): opening again is trying again.
  if (trState.error) restartTranslation(true);
}

async function runTranslate(seq) {
  const text = trState.text;
  try {
    const result = await translate(text, trState.from);
    if (seq !== trSeq) return;
    trState.result = result;
    trState.resultFor = text;
    trState.error = null;
  } catch (e) {
    if (seq !== trSeq) return;
    trState.error = e instanceof TranslateError ? e.message : FAILED;
  }
  renderTrResult();
}

// Something changed: forget pending answers; translate again now (or not at all when blank).
function restartTranslation(now) {
  const seq = ++trSeq;
  clearTimeout(trTimer);
  if (!trState.text.trim()) {
    trState.result = '';
    trState.error = null;
    renderTrResult();
  } else if (now) runTranslate(seq);
  else trTimer = setTimeout(() => runTranslate(seq), 500);
}

translator.addEventListener('input', (e) => {
  if (e.target.id !== 'tr-input') return;
  trState.text = e.target.value;
  $('#tr-link').href = googleLink(trState.text, trState.from);
  restartTranslation(false);
});

translator.addEventListener('click', (e) => {
  if (e.target === translator) return translator.close(); // the dimmed backdrop
  const say = e.target.closest('[data-say]');
  if (say) return speak(say.dataset.say);
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const act = btn.dataset.act;
  if (act === 'close') translator.close();
  else if (act === 'say-text') {
    const text = $('#tr-input').value.trim();
    if (text) speak(text);
  } else if (act === 'swap' || act === 'clear') {
    Object.assign(trState, act === 'swap' ? swapState(trState) : { text: '', result: '', resultFor: '', error: null });
    renderTranslator();
    focusTrInput();
    restartTranslation(true);
  }
});

translator.addEventListener('close', () => {
  window.speechSynthesis?.cancel();
  if (!sheet.open && !alphabet.open) document.body.classList.remove('noscroll');
});

// ---------- alphabet ----------
//
// Like the translator: opens on top of anything and returns to what was below.
// Its hints always show, because this window is about sounds.

const alphabet = $('#alphabet');

function openAlphabet() {
  $('#alphabet-body').innerHTML = alfabeHtml(LETTERS, COMBOS, sayIt);
  if (!alphabet.open) {
    document.body.classList.add('noscroll');
    alphabet.showModal();
  }
  alphabet.scrollTop = 0;
  alphabet.focus({ preventScroll: true });
}

alphabet.addEventListener('click', (e) => {
  if (e.target === alphabet) return alphabet.close(); // the dimmed backdrop
  const say = e.target.closest('[data-say]');
  if (say) return speak(say.dataset.say);
  if (e.target.closest('[data-act="close"]')) alphabet.close();
});

alphabet.addEventListener('close', () => {
  window.speechSynthesis?.cancel();
  if (!sheet.open && !translator.open) document.body.classList.remove('noscroll');
});

async function askAi(button) {
  const x = ITEM.get(openKey);
  const box = button.closest('.ai');
  const msg = box.querySelector('.ai-msg');
  const ck = box.dataset.ck;
  const existing = store.ai[ck] || [];
  let prompt;
  if (isPattern(x)) {
    const v = x.variants[Number(button.dataset.v)];
    const fitting = BY_COMMON.filter((w) => fits(slotOf(x, v), w));
    const mine = fitting.filter(learned);
    const words = shuffle(mine.length ? mine : fitting.slice(0, 20)).slice(0, 6);
    prompt = patternPrompt({ variant: v, patternTr: x.tr, words, existing });
  } else {
    const pairs = wordPatternPairs(x, PATTERNS).filter(({ p }) => learned(p));
    const patterns = shuffle(pairs.map(({ v }) => v)).slice(0, 4);
    prompt = wordPrompt({ word: x.sv, meaning: x.label, type: x.type, patterns, existing });
  }
  button.disabled = true;
  button.textContent = T.ai.thinking;
  msg.textContent = '';
  msg.classList.remove('err');
  try {
    const examples = await generate(store.settings, prompt);
    store.addAi(ck, examples);
    if (!box.querySelector('.sub')) box.insertAdjacentHTML('afterbegin', `<div class="sub"><span>${esc(T.sections.ai)}</span></div>`);
    box.querySelector('.ai-list').insertAdjacentHTML('beforeend', examples.map((e) => exHtml(e.sv, e.tr)).join(''));
    msg.textContent = T.ai.saved;
  } catch (e) {
    msg.textContent = e instanceof AIError ? e.message : T.ai.failed;
    msg.classList.add('err');
  } finally {
    button.disabled = false;
    button.textContent = T.ai.more;
  }
}

$('#sheet-body').addEventListener('click', (e) => {
  const say = e.target.closest('[data-say]');
  if (say) return speak(say.dataset.say);
  const sent = e.target.closest('.sent');
  if (sent && scanView?.kind === 'scan') return openSentence(scanView.id, Number(sent.dataset.si));
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const act = btn.dataset.act;
  if (act === 'close') sheet.close();
  else if (act === 'translate') openTranslator();
  else if (act === 'alphabet') openAlphabet();
  else if (act === 'back') openScanView(scanView.kind === 'sentence' ? { kind: 'scan', id: scanView.id } : { kind: 'scans' });
  else if (act === 'open-scan') openScanView({ kind: 'scan', id: btn.dataset.id });
  else if (act === 'delete-scan') {
    if (confirm(T.scans.confirmDelete)) {
      store.deleteScan(btn.dataset.id);
      renderSheet();
    }
  } else if (act === 'retry-read') readPhoto(null);
  else if (act === 'retry-explain') explain(sentenceOf(scanView));
  else if (act === 'toggle') {
    store.toggleLearned(openKey);
    const on = store.isLearned(openKey);
    btn.classList.toggle('on', on);
    btn.textContent = on ? T.learn.on : T.learn.off;
  } else if (act === 'ai') askAi(btn);
  else if (act === 'setup') {
    sheet.close();
    setTab('settings');
  }
});

// ---------- settings ----------

function renderSettings() {
  const s = store.settings;
  const S = T.settings;
  const p = PROVIDERS[s.provider];
  const voice = swedishVoice();
  const nP = PATTERNS.filter(learned).length;
  const nW = WORDS.filter(learned).length;
  const switchRow = (id, label, on) =>
    `<label class="toggle-row"><span>${esc(label)}</span><input type="checkbox" class="switch" id="${id}"${on ? ' checked' : ''}></label>`;
  $('#settings').innerHTML =
    `<section class="card"><h2>${esc(S.blocks)}</h2>` +
    switchRow('set-showsv', S.showSv, ui.showSwedish) +
    `<p>${esc(S.showSvHelp)}</p></section>` +
    `<section class="card"><h2>${esc(S.aiTitle)}</h2>` +
    `<p>${esc(S.aiHelp)}</p>` +
    `<p>${esc(S.aiScans)}</p>` +
    `<label class="field">${esc(S.provider)}<select id="set-provider"><option value="">${esc(S.off)}</option>` +
    Object.entries(PROVIDERS)
      .map(([id, x]) => `<option value="${id}"${s.provider === id ? ' selected' : ''}>${esc(x.label)}</option>`)
      .join('') +
    `</select></label>` +
    (p
      ? `<p>${esc(p.howTo)} <a href="${p.keyUrl}" target="_blank" rel="noopener">${esc(S.getKey)}</a></p>` +
        `<label class="field">${esc(S.key)}<input id="set-key" type="password" autocomplete="off" value="${esc(s.keys?.[s.provider] || '')}"></label>` +
        `<label class="field">${esc(S.model)}<input id="set-model" type="text" autocomplete="off" autocapitalize="off" placeholder="${esc(p.model)}" value="${esc(s.models?.[s.provider] || '')}"></label>` +
        `<p>${esc(S.modelHelp)}</p>` +
        `<div class="btns"><button class="btn primary" id="set-test">${esc(S.test)}</button></div><p class="status-msg" id="set-status"></p>`
      : '') +
    `</section>` +
    `<section class="card"><h2>${esc(S.pron)}</h2>` +
    switchRow('set-hints', S.showHints, ui.showHints) +
    `<p>${esc(S.hintsHelp)}</p>` +
    `<p>${esc(voice ? S.voice(voice.name) : S.noVoice)}</p>` +
    `<p>${esc(S.silent)}</p>` +
    `<div class="btns"><button class="btn" data-say="${esc(S.trySay)}">${esc(S.tryIt)}</button></div></section>` +
    `<section class="card"><h2>${esc(S.progress)}</h2><p>${esc(S.progressText(nP, PATTERNS.length, nW, WORDS.length))}</p>` +
    `<p>${esc(S.backupHelp)}</p>` +
    `<div class="btns"><button class="btn" id="set-backup">${esc(S.copy)}</button><button class="btn" id="set-restore">${esc(S.restore)}</button><button class="btn danger" id="set-reset">${esc(S.reset)}</button></div>` +
    `<textarea id="set-backup-text" hidden placeholder="${esc(S.pastePlaceholder)}"></textarea><p class="status-msg" id="set-progress-msg"></p></section>` +
    `<section class="card"><h2>${esc(S.about)}</h2><p>${esc(S.aboutRanks)}</p>` +
    `<p>${esc(S.aboutAi)}</p></section>`;
}

$('#settings').addEventListener('click', async (e) => {
  const say = e.target.closest('[data-say]');
  if (say) return speak(say.dataset.say);
  const S = T.settings;
  const id = e.target.id;
  if (id === 'set-test') {
    const out = $('#set-status');
    out.textContent = S.testing;
    try {
      const ex = await generate(store.settings, wordPrompt({ word: 'hej', meaning: 'merhaba', type: 'phrase', patterns: [], n: 1 }));
      out.textContent = S.works(ex[0].sv, ex[0].tr);
    } catch (err) {
      out.textContent = errorText(err);
    }
  } else if (id === 'set-backup') {
    const text = store.backupText();
    const msg = $('#set-progress-msg');
    try {
      await navigator.clipboard.writeText(text);
      msg.textContent = S.copied;
    } catch {
      const ta = $('#set-backup-text');
      ta.hidden = false;
      ta.value = text;
      ta.select();
      msg.textContent = S.copyByHand;
    }
  } else if (id === 'set-restore') {
    const ta = $('#set-backup-text');
    const msg = $('#set-progress-msg');
    if (ta.hidden || !ta.value.trim()) {
      ta.hidden = false;
      ta.value = '';
      ta.focus();
      msg.textContent = S.pastePrompt;
      return;
    }
    const restored = store.parseBackup(ta.value);
    if (!restored) {
      msg.textContent = S.notBackup;
      return;
    }
    store.replaceLearned(restored);
    renderSettings();
    $('#set-progress-msg').textContent = S.restored;
  } else if (id === 'set-reset') {
    if (confirm(S.confirmReset)) {
      store.replaceLearned({});
      renderSettings();
    }
  }
});

$('#settings').addEventListener('change', (e) => {
  const s = store.settings;
  if (e.target.id === 'set-showsv') {
    ui.showSwedish = e.target.checked;
    store.saveUi();
  } else if (e.target.id === 'set-hints') {
    ui.showHints = e.target.checked;
    store.saveUi();
  } else if (e.target.id === 'set-provider') {
    s.provider = e.target.value;
    store.saveSettings();
    renderSettings();
  }
});

$('#settings').addEventListener('input', (e) => {
  const s = store.settings;
  if (e.target.id === 'set-key') {
    s.keys = { ...s.keys, [s.provider]: e.target.value.trim() };
    store.saveSettings();
  } else if (e.target.id === 'set-model') {
    s.models = { ...s.models, [s.provider]: e.target.value.trim() };
    store.saveSettings();
  }
});

// ---------- events ----------

let toastTimer = null;
function toast(message, ms = 1500) {
  const el = $('#toast');
  // An open window sits above the whole page, so the toast goes inside the top one while it is open.
  const host = translator.open ? translator : alphabet.open ? alphabet : sheet.open ? sheet : document.body;
  if (el.parentElement !== host) host.append(el);
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

function setLearned(key, on) {
  if (store.isLearned(key) !== on) store.toggleLearned(key);
  toast(on ? T.learn.toastOn : T.learn.toastOff);
  renderList();
}

// Swipe a block right to mark it learned, left to unmark; the block follows the finger.
const swiper = swipe($('#list'), {
  find: (e) => e.target.closest?.('.block') || null,
  onDrag: (block, dx) => {
    const x = Math.max(-90, Math.min(90, dx * 0.6));
    block.classList.add('dragging');
    block.classList.toggle('to-on', dx >= 60);
    block.classList.toggle('to-off', dx <= -60);
    block.style.transform = `translateX(${x}px)`;
  },
  onEnd: (block) => {
    block.classList.remove('dragging', 'to-on', 'to-off');
    block.style.transform = '';
  },
  onSwipe: (block, dir) => setLearned(block.dataset.key, dir === 'right'),
});

// Selection: shown in place, so the list keeps its scroll position and focus.
// The clear button counts and clears only the tab you are on: pattern keys start with "p:".
const inThisTab = (key) => key.startsWith('p:') === (ui.tab === 'patterns');

function renderClear() {
  const n = store.selectedCount(inThisTab);
  const btn = $('#clear-sel');
  btn.hidden = n === 0 || ui.tab === 'settings';
  btn.textContent = T.clear(n);
}

function toggleSelect(block) {
  const key = block.dataset.key;
  store.toggleSelected(key);
  const on = store.isSelected(key);
  block.classList.toggle('sel', on);
  block.setAttribute('aria-pressed', String(on));
  renderClear();
}

$('#clear-sel').addEventListener('click', () => {
  store.clearSelected(inThisTab);
  renderClear();
  renderList();
});

$('#list').addEventListener('click', (e) => {
  const block = e.target.closest('.block');
  if (!block || swiper.consumeClick()) return;
  if (e.target.closest('.b-info')) openSheet(block.dataset.key);
  else toggleSelect(block);
});

$('#list').addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('block')) {
    e.preventDefault();
    toggleSelect(e.target);
  }
});

document.querySelector('.tabs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-tab]');
  if (b) setTab(b.dataset.tab);
});

$('#gear').addEventListener('click', () => setTab(ui.tab === 'settings' ? lastListTab : 'settings'));

$('#tr-btn').innerHTML = BUBBLE;
$('#tr-btn').addEventListener('click', () => openTranslator());
$('#abc-btn').innerHTML = ABC;
$('#abc-btn').addEventListener('click', () => openAlphabet());

$('#status').addEventListener('click', (e) => {
  const b = e.target.closest('[data-status]');
  if (!b) return;
  ui.status[ui.tab] = b.dataset.status;
  store.saveUi();
  renderControls();
  renderList();
});

$('#sort').addEventListener('change', (e) => {
  ui.sort[ui.tab] = e.target.value;
  store.saveUi();
  renderList();
});

$('#types').addEventListener('click', (e) => {
  const b = e.target.closest('[data-type], [data-group]');
  if (!b) return;
  if (b.dataset.group) ui.pgroup = b.dataset.group;
  else ui.type = b.dataset.type;
  store.saveUi();
  renderControls();
  renderList();
});

$('#search').addEventListener('input', () => renderList());

// Voices load asynchronously in some browsers.
if ('speechSynthesis' in window) {
  speechSynthesis.addEventListener?.('voiceschanged', () => {
    if (ui.tab === 'settings') renderSettings();
  });
}

ui.tab = 'words'; // the app always opens on Words
render();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  reloadOnUpdate(navigator.serviceWorker, () => location.reload());
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
