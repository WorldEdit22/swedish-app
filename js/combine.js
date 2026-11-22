// Fills a pattern's sentence template with a word: Swedish and its Turkish meaning.
//
// A template is { sv, tr }, two separate strings.
//
// Swedish:  {w} the word as written, {w:FORM} a form from svenska.js (en, def, pl, pld, gen,
//           at, to, from, inf, pres, past, sup, imp, t, a, komp, superl) — highlighted.
//           {art} {ingen} {min} {din} {den} {denhar} {adj:<base>} agree with the word's
//           gender — not highlighted.
// Turkish:  {w} the Turkish meaning, {w:} its bare verb stem, {w:SUFFIX} with a suffix
//           (see grammar.js) — highlighted. {bir} is "bir " before a countable noun and
//           nothing for a mass noun or a name — not highlighted.
//           Names (prop) take their suffix after an apostrophe: Türkiye'ye.

import { attach, capTr } from './grammar.js';
import { svForm, svAgree, capSv } from './svenska.js';

const SV_RE = /\{w(?::([a-z]*))?\}|\{(art|ingen|min|din|den|denhar|adj:[a-zåäö]+)\}/g;
const TR_RE = /\{w(?::([^}]*))?\}|\{(bir)\}/g;

function render(str, re, replace, cap) {
  const parts = [];
  const push = (text, hl) => {
    if (!text) return; // an empty helper (no "bir") must not take the capital letter
    const prev = parts[parts.length - 1];
    if (prev && !prev.hl && !hl) prev.text += text;
    else parts.push({ text, hl });
  };
  let last = 0;
  for (const m of str.matchAll(re)) {
    if (m.index > last) push(str.slice(last, m.index), false);
    push(...replace(m));
    last = m.index + m[0].length;
  }
  if (last < str.length) push(str.slice(last), false);
  if (parts.length) parts[0].text = cap(parts[0].text);
  return parts;
}

const join = (parts) => parts.map((p) => p.text).join('');

function trWord(word, suffix) {
  if (suffix === undefined) return word.tr;
  const s = attach(word, suffix);
  return word.prop && suffix && s.startsWith(word.tr) && s.length > word.tr.length ? `${word.tr}'${s.slice(word.tr.length)}` : s;
}

export function fill(tpl, word) {
  const svParts = render(tpl.sv, SV_RE, (m) => (m[2] ? [svAgree(word, m[2]), false] : [svForm(word, m[1] || ''), true]), capSv);
  const trParts = render(tpl.tr, TR_RE, (m) => (m[2] ? [word.m || word.prop ? '' : 'bir ', false] : [trWord(word, m[1]), true]), capTr);
  return { sv: join(svParts), tr: join(trParts), svParts, trParts };
}

// slot: "type" or "type:kind|kind"; type "*" matches any word type.
// A word may have several kinds ("room|event"); any one of them can match.
// A slot ending in "!count" takes only countable words (for plurals and en/ett).
export function fits(slot, word) {
  if (!slot || word.nc) return false;
  const countable = slot.endsWith('!count');
  if (countable && word.m) return false;
  const [type, kinds] = slot.replace(/!count$/, '').split(':');
  if (type !== '*' && word.type !== type) return false;
  if (!kinds) return true;
  const wanted = kinds.split('|');
  return String(word.kind || '').split('|').some((k) => wanted.includes(k));
}
