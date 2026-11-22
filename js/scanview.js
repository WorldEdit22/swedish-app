// HTML for the photo-scan screens: the list of scans, one scan read like a
// book page, and one sentence explained. Pure functions; every string that
// came from the AI is escaped. Window headers are added by the caller.

import { esc, SPEAKER, TRASH } from './html.js';
import { T } from './metin.js';

const S = T.scans;

export const sentencesOf = (scan) => scan.paragraphs.flat();

// The first words of the first sentence.
export function scanTitle(scan, max = 6) {
  const words = (sentencesOf(scan)[0] || '').split(/\s+/).filter(Boolean);
  return words.length > max ? `${words.slice(0, max).join(' ')}…` : words.join(' ');
}

export const scanDate = (iso) => new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

// status: null | 'reading' | 'empty' | { error }
function readStatusHtml(status) {
  if (status === 'reading') return `<p class="scan-status" role="status">${esc(S.reading)}</p>`;
  if (status === 'empty') return `<p class="scan-status" role="status">${esc(S.none)}</p>`;
  if (status?.error)
    return `<p class="scan-status err" role="status">${esc(status.error)}</p><button class="btn" data-act="retry-read">${esc(S.retry)}</button>`;
  return '';
}

export function scansListHtml(scans, { hasKey, status }) {
  const top = hasKey
    ? `<p class="note">${esc(S.sent)}</p>` +
      `<label class="btn primary scan-take${status === 'reading' ? ' busy' : ''}">${esc(S.take)}` +
      '<input type="file" accept="image/*" hidden></label>' +
      readStatusHtml(status)
    : `<p class="note">${esc(S.noKey)}</p>` + `<button class="btn primary" data-act="setup">${esc(S.openSettings)}</button>`;
  const rows = scans
    .map(
      (s) =>
        `<div class="scan-row"><button class="scan-open" data-act="open-scan" data-id="${esc(s.id)}">` +
        `<span class="scan-title" lang="sv">${esc(scanTitle(s))}</span><span class="scan-date">${esc(scanDate(s.date))}</span></button>` +
        `<button class="scan-del" data-act="delete-scan" data-id="${esc(s.id)}" aria-label="${esc(T.aria.deleteScan)}">${TRASH}</button></div>`,
    )
    .join('');
  return top + (rows ? `<div class="scan-list">${rows}</div>` : '');
}

// The page as running text; each sentence can be tapped. isExplained(sentence) marks the ones already explained.
export function scanHtml(scan, isExplained) {
  let i = 0;
  const paragraphs = scan.paragraphs
    .map(
      (p) =>
        '<p>' +
        p
          .map((s) => `<span class="sent${isExplained(s) ? ' done' : ''}" data-si="${i++}" role="button" tabindex="0">${esc(s)}</span>`)
          .join(' ') +
        '</p>',
    )
    .join('');
  return `<p class="note">${esc(S.tap)}</p><div class="page" lang="sv">${paragraphs}</div>`;
}

// data: { tr, structure, words } or undefined; status: null | 'loading' | { error };
// hint: sentence → pronunciation, or null when hints are off.
export function sentenceHtml(sentence, data, status, hint = null) {
  let h =
    `<div class="s-tr sent-text"><span lang="sv">${esc(sentence)}</span>` +
    `<button class="say" data-say="${esc(sentence)}" aria-label="${esc(T.aria.listen)}">${SPEAKER}</button></div>` +
    (hint ? `<p class="hint" lang="tr">${esc(hint(sentence))}</p>` : '');
  if (data) {
    h +=
      `<p class="sent-en">${esc(data.tr)}</p>` +
      (data.structure ? `<div class="sub"><span>${esc(S.structure)}</span></div><p class="sent-structure">${esc(data.structure)}</p>` : '') +
      (data.words.length
        ? `<div class="sub"><span>${esc(S.words)}</span></div><div class="words">` +
          data.words
            .map(
              (w) =>
                `<div class="word"><div class="w-tr" lang="sv">${esc(w.w)}</div><div class="w-base" lang="sv">${esc(w.base)}</div>` +
                `<div class="w-en">${esc(w.tr)}</div><div class="w-parts">${esc(w.parts)}</div></div>`,
            )
            .join('') +
          '</div>'
        : '');
  } else if (status === 'loading') {
    h += `<p class="scan-status" role="status">${esc(S.explaining)}</p>`;
  } else if (status?.error) {
    h += `<p class="scan-status err" role="status">${esc(status.error)}</p><button class="btn" data-act="retry-explain">${esc(S.retry)}</button>`;
  }
  return h;
}
