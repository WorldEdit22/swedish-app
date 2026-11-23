// The alphabet window's HTML: every letter with its name, its sound in Turkish
// terms and an example word, then the tricky sounds. `hint` turns Swedish text into
// its pronunciation (always shown here: this window is about sounds).

import { esc, SPEAKER } from './html.js';
import { T } from './metin.js';

const A = T.alphabet;
const say = (text) => `<button class="say" data-say="${esc(text)}" aria-label="${esc(T.aria.listen)}">${SPEAKER}</button>`;

function exampleHtml(sv, tr, h) {
  return (
    `<div class="abc-ex"><span class="abc-ex-sv" lang="sv">${esc(sv)}</span> <span class="hint">[${esc(h)}]</span>` +
    `<div class="abc-ex-tr">${esc(tr)}</div></div>${say(sv)}`
  );
}

export function alfabeHtml(letters, combos, hint) {
  const rows = letters
    .map(
      (l) =>
        `<div class="abc-row">` +
        // The small letter: for a capital, the iPhone's Swedish voice says "versal A".
        `<button class="abc-letter" data-say="${esc(l.ch.toLocaleLowerCase('sv'))}" lang="sv" aria-label="${esc(`${T.aria.listen}: ${l.ch}`)}">${esc(l.ch)} ${esc(l.ch.toLocaleLowerCase('sv'))}</button>` +
        `<div class="abc-info"><div class="abc-name">[${esc(l.name)}]</div><div class="abc-sound">${esc(l.sound)}</div></div>` +
        exampleHtml(l.ex[0], l.ex[1], l.ut || hint(l.ex[0])) +
        `</div>`,
    )
    .join('');
  const tricky = combos
    .map(
      (c) =>
        `<div class="abc-combo"><div class="abc-combo-title">${esc(c.title)}</div><p class="abc-sound">${esc(c.sound)}</p>` +
        c.ex.map(([sv, tr]) => `<div class="abc-combo-ex">${exampleHtml(sv, tr, hint(sv))}</div>`).join('') +
        `</div>`,
    )
    .join('');
  return (
    `<div class="s-top"><div class="grabber"></div>` +
    `<div class="s-head"><h2>${esc(A.title)}</h2><button class="close" data-act="close" aria-label="${esc(T.aria.close)}">✕</button></div></div>` +
    `<p class="note">${esc(A.long)}</p>` +
    `<div class="abc-list">${rows}</div>` +
    `<h3 class="abc-head">${esc(A.combos)}</h3>${tricky}`
  );
}
