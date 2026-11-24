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
// Target-language text with its speaker (`say` is what the speaker reads).
const targetLine = (text, say) => `<div class="pc-line"><span class="pc-target">${esc(text)}</span>${speaker(say)}</div>`;
const UNDO = `<button class="pc-undo" data-act="undo">${P.undo}</button>`;

// face: { native, target, say, icon, hint, forms, note, variant, example }
//   icon is the word's topic icon (none on a pattern), shown in the card's corner.
//   variant is set only for a pattern; its front also shows the example, in the front's language.
// state: { dir: 'say'|'understand', revealed, previews: { forgot, hard, easy }, canUndo }
export function cardHtml(face, { dir, revealed, previews, canUndo }) {
  const icon = face.icon ? `<span class="pc-icon" aria-hidden="true">${esc(face.icon)}</span>` : '';
  const ex = face.example;
  const nativeLine = (text) => `<div class="pc-native">${esc(text)}</div>`;

  const frontEx =
    face.variant && ex
      ? `<div class="pc-front-ex">${dir === 'say' ? nativeLine(ex.native) : targetLine(ex.target, ex.target) + optional('pc-hint', ex.hint)}</div>`
      : '';
  const front = (dir === 'say' ? nativeLine(face.native) : targetLine(face.target, face.say) + optional('pc-hint', face.hint)) + frontEx;

  let back = '';
  if (revealed) {
    back =
      '<div class="pc-back">' +
      (dir === 'say' ? targetLine(face.target, face.say) + optional('pc-hint', face.hint) : nativeLine(face.native)) +
      optional('pc-forms', face.forms) +
      optional('pc-note', face.note) +
      (face.variant
        ? `<div class="pc-variant"><span class="pc-native">${esc(face.variant.native)}</span> <span class="pc-target">${esc(face.variant.target)}</span></div>`
        : '') +
      (ex ? `<div class="pc-ex">${targetLine(ex.target, ex.target)}${nativeLine(ex.native)}${optional('pc-hint', ex.hint)}</div>` : '') +
      '</div>';
  }

  // Only the button reveals, so a tap beside the speaker never does.
  const top = `<div class="pc-front">${front}${revealed ? '' : `<button class="pc-show" data-act="reveal">${P.show}</button>`}</div>`;

  // Unrevealed, the row stays in the layout (hidden, inert) so Undo below doesn't move between cards.
  const grades =
    `<div class="grades${revealed ? '' : ' grades-hold'}"${revealed ? '' : ' aria-hidden="true"'}>` +
    GRADES.map(
      (g) =>
        `<button class="grade ${g}"${revealed ? ` data-grade="${g}"` : ' disabled tabindex="-1"'}><span class="grade-label">${P.grades[g]}</span><span class="grade-ivl">${esc(intervalText(previews[g]))}</span></button>`,
    ).join('') +
    '</div>';

  return `<div class="pc">${icon}${top}${back}</div>${grades}${canUndo ? UNDO : ''}`;
}

// canUndo: the last answer can still be undone, also after the last card of the queue.
export function doneHtml({ newToday, canMore, nextIn, canUndo = false }) {
  return (
    `<div class="pc-done"><h2>${P.done}</h2>` +
    `<p>${P.newToday(newToday)}</p>` +
    (canMore
      ? `<button class="btn primary pc-more" data-act="more">${P.more}</button>`
      : nextIn != null
        ? `<p>${P.caughtUp(nextIn)}</p>`
        : '') +
    '</div>' +
    (canUndo ? UNDO : '')
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
