// The translator window's HTML. state = { text, from: 'tr' | 'sv', result, error }.
// The text box and the result are drawn separately, so typing never redraws the box.
// The speaker sits on whichever side is Swedish. `hint` (text → pronunciation, or null
// when hints are off) adds the pronunciation under a Swedish result.

import { esc, SPEAKER } from './html.js';
import { MAX_CHARS, other, googleLink } from './translate.js';
import { T } from './metin.js';

const L = T.translator;
const speaker = (attrs) => `<button class="say" ${attrs} aria-label="${esc(T.aria.listen)}">${SPEAKER}</button>`;

export function resultHtml({ from, result, error }, hint = null) {
  if (error) return `<p class="tr-msg err">${esc(error)}</p>`;
  if (!result) return `<p class="tr-msg">${esc(L.result)}</p>`;
  if (other(from) === 'tr') return `<p class="tr-text" lang="tr">${esc(result)}</p>`;
  return (
    `<div class="tr-res"><p class="tr-text" lang="sv">${esc(result)}</p>` +
    (hint ? `<p class="hint" lang="tr">${esc(hint(result))}</p>` : '') +
    `</div>${speaker(`data-say="${esc(result)}"`)}`
  );
}

export function translatorHtml(state, hint = null) {
  const { text, from } = state;
  return (
    `<div class="s-top"><div class="grabber"></div>` +
    `<div class="s-head"><h2>${esc(L.title)}</h2><button class="close" data-act="close" aria-label="${esc(T.aria.close)}">✕</button></div></div>` +
    `<div class="tr-langs"><span class="tr-lang">${esc(L.names[from])}</span>` +
    `<button class="tr-swap" data-act="swap" aria-label="${esc(T.aria.swap)}">⇄</button>` +
    `<span class="tr-lang">${esc(L.names[other(from)])}</span></div>` +
    `<div class="tr-box">` +
    `<textarea id="tr-input" maxlength="${MAX_CHARS}" autocorrect="off" autocapitalize="sentences" spellcheck="false" lang="${from}" placeholder="${esc(L.placeholder(L.names[from]))}">${esc(text)}</textarea>` +
    `<div class="tr-tools"><button class="tr-clear" data-act="clear" aria-label="${esc(T.aria.clearText)}">✕</button>` +
    (from === 'sv' ? speaker('data-act="say-text"') : '') +
    `</div></div>` +
    `<div id="tr-result" class="tr-out" aria-live="polite">${resultHtml(state, hint)}</div>` +
    `<a id="tr-link" class="tr-link" href="${esc(googleLink(text, from))}" target="_blank" rel="noopener">${esc(L.link)}</a>`
  );
}
