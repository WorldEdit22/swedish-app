// HTML for the practice screen: one card (front, then the answer and the three
// grades), the "done for today" screen and the window's Practice section.
// Pure functions; everything is escaped. The caller wires the data-act buttons.
// Every visible string comes from metin.js.

import { esc, SPEAKER } from './html.js';
import { T } from './metin.js';

const P = T.practice;
const GRADES = ['forgot', 'hard', 'easy'];

export function intervalText(days) {
  if (days <= 0) return P.today;
  if (days >= 60) return P.months(Math.round(days / 30));
  return P.days(days);
}

// st: { kind: 'new'|'due'|'later'|'mastered', days }
export function statusText(st) {
  const s = P.status[st.kind];
  return typeof s === 'function' ? s(st.days) : s;
}

export const countsText = (due, fresh) => P.counts(due, fresh);

export const PRACTICE_TITLE = P.title;

const speaker = (text) => `<button class="say" data-say="${esc(text)}" aria-label="${T.aria.listen}">${SPEAKER}</button>`;
const optional = (cls, text) => (text ? `<div class="${cls}">${esc(text)}</div>` : '');

// face: { native, target, say, dot, icon, hint, forms, note, variant, example }
// state: { dir: 'say'|'understand', revealed, previews: { forgot, hard, easy }, canUndo }
export function cardHtml(face, { dir, revealed, previews, canUndo }) {
  const meta =
    face.dot || face.icon
      ? `<div class="pc-meta">${face.dot ? `<span class="dot t-${esc(face.dot)}"></span>` : ''}${face.icon ? `<span class="pc-icon">${esc(face.icon)}</span>` : ''}</div>`
      : '';
  const targetLine = (text) => `<div class="pc-line"><span class="pc-target">${esc(text)}</span>${speaker(face.say)}</div>`;

  const front =
    dir === 'say'
      ? `<div class="pc-native">${esc(face.native)}</div>`
      : targetLine(face.target) + optional('pc-hint', face.hint);

  let back = '';
  if (revealed) {
    back =
      '<div class="pc-back">' +
      (dir === 'say'
        ? targetLine(face.target) + optional('pc-hint', face.hint)
        : `<div class="pc-native">${esc(face.native)}</div>`) +
      optional('pc-forms', face.forms) +
      optional('pc-note', face.note) +
      (face.variant
        ? `<div class="pc-variant"><span class="pc-native">${esc(face.variant.native)}</span> <span class="pc-target">${esc(face.variant.target)}</span></div>`
        : '') +
      (face.example
        ? `<div class="pc-ex"><div class="pc-line"><span class="pc-target">${esc(face.example.target)}</span>${speaker(face.example.target)}</div>` +
          `<div class="pc-native">${esc(face.example.native)}</div>${optional('pc-hint', face.example.hint)}</div>`
        : '') +
      '</div>';
  }

  const top = `<div class="pc-front"${revealed ? '' : ' data-act="reveal"'}>${meta}${front}${revealed ? '' : `<div class="pc-show">${P.show}</div>`}</div>`;

  const grades = revealed
    ? '<div class="grades">' +
      GRADES.map(
        (g) =>
          `<button class="grade ${g}" data-grade="${g}"><span class="grade-label">${P.grades[g]}</span><span class="grade-ivl">${esc(intervalText(previews[g]))}</span></button>`,
      ).join('') +
      '</div>'
    : '';

  const undo = canUndo ? `<button class="pc-undo" data-act="undo">${P.undo}</button>` : '';
  return `<div class="pc">${top}${back}</div>${grades}${undo}`;
}

export function doneHtml({ newToday, canMore, nextIn }) {
  return (
    `<div class="pc-done"><h2>${P.done}</h2>` +
    `<p>${P.newToday(newToday)}</p>` +
    (canMore
      ? `<button class="btn primary pc-more" data-act="more">${P.more}</button>`
      : nextIn != null
        ? `<p>${P.caughtUp(nextIn)}</p>`
        : '') +
    '</div>'
  );
}

// rows: [{ dir, label, st, last }]; last: 'forgot'|'hard'|'easy'|'new'|undefined (undefined = New).
export function recallHtml(rows) {
  const buttons = (dir, last) =>
    ['new', ...GRADES]
      .map((g) => {
        const on = g === (last || 'new');
        return `<button${on ? ' class="on"' : ''} data-act="recall" data-dir="${esc(dir)}" data-grade="${g}">${g === 'new' ? P.status.new : P.grades[g]}</button>`;
      })
      .join('');
  return (
    `<div class="recall"><div class="sub"><span>${PRACTICE_TITLE}</span></div>` +
    rows
      .map(
        (r) =>
          `<div class="recall-row"><div class="recall-head"><span>${esc(r.label)}</span><span class="recall-st">${esc(statusText(r.st))}</span></div>` +
          `<div class="recall-btns">${buttons(r.dir, r.last)}</div></div>`,
      )
      .join('') +
    '</div>'
  );
}
