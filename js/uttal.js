// Pronunciation hints: Swedish text written the way a Turkish reader would say
// it, with ":" after a long vowel (jag → ya:g, sju → şü:). An approximation of
// standard central Swedish; the speaker buttons give the real sound.
//
// uttal(text, extra) converts any text word by word; punctuation and spaces stay.
// A word found in `extra` (the words' own `ut` hints) or in EXCEPTIONS is used as is.
//
// Rules:
//   word start  g, k, sk before e i y ä ö → y, ş, ş;  dj gj hj lj → y
//   anywhere    sch skj stj sj ch → ş;  tj kj → ş;  tion → şu:n;  rs → ş;  j → y;  ck → k;
//               x → ks;  z → s;  w → v;  qu → kv;  q → k;  ph → f;  th → t;  gn → ngn;
//               c → s before e i y, else k;  double consonants are written once
//   word end    -ig → i,  -igt → it   (in words of two or more syllables)
//   vowels      a e i → a e i;  å → o;  ä → e;  ö → ö;  y → ü
//               o: long → u, short → o, unstressed → u
//               u: long → ü, short → ö; unstressed: ü before one consonant, else ö
//   stress      on the first vowel, except: be- and för- before a consonant put it on the next
//               vowel (betala, förstå); -era verbs on that e (fotografera); -tion on itself
//   length      only the stressed vowel can be long. It is long before one consonant sound or
//               at the end of the word, and short before two or more consonant letters (ck, ng,
//               rs, x count as two), before j, and before a single final m or n.

export const EXCEPTIONS = {
  de: 'dom', dem: 'dom', mig: 'mey', dig: 'dey', sig: 'sey', och: 'ok', det: 'de:', är: 'e:r', hon: 'hun', ost: 'ust',
  sverige: 'sverye', gärna: 'ye:rna', människa: 'menişa', barn: 'ba:rn', bord: 'bu:rd', i: 'i', några: 'no:gra',
  bebis: 'be:bis', första: 'föşta',
};

const VOWELS = new Set('aeiouyåäö');
const FRONT = new Set('eiyäö');
const isVowel = (c) => VOWELS.has(c);

const START = [
  [/^(skj|stj|sj|sch)/, 'ş'],
  [/^sk(?=[eiyäö])/, 'ş'],
  [/^(dj|gj|hj|lj)/, 'y'],
  [/^g(?=[eiyäö])/, 'y'],
  [/^k(?=[eiyäö])/, 'ş'],
];

// [spelling, sound, how many consonants it counts as for vowel length]
const MULTI = [
  ['sch', 'ş', 1], ['skj', 'ş', 1], ['stj', 'ş', 1], ['sj', 'ş', 1], ['ch', 'ş', 1], ['tj', 'ş', 1], ['kj', 'ş', 1],
  ['rs', 'ş', 2], ['ck', 'k', 2], ['ng', 'ng', 2], ['gn', 'ngn', 2], ['qu', 'kv', 2], ['ph', 'f', 1], ['th', 't', 1],
];
const SINGLE = { x: ['ks', 2], z: ['s', 1], w: ['v', 1], q: ['k', 1], j: ['y', 1] };

function tokens(word) {
  const out = [];
  let i = 0;
  for (const [re, sound] of START) {
    const m = word.match(re);
    if (m) {
      out.push({ c: sound, n: 1 });
      i = m[0].length;
      break;
    }
  }
  while (i < word.length) {
    const ch = word[i];
    if (word.startsWith('tion', i)) {
      out.push({ tion: true });
      i += 4;
      continue;
    }
    if (isVowel(ch)) {
      out.push({ v: ch, pos: i });
      i++;
      continue;
    }
    const multi = MULTI.find(([sp]) => word.startsWith(sp, i));
    if (multi) {
      out.push({ c: multi[1], n: multi[2] });
      i += multi[0].length;
      continue;
    }
    if (SINGLE[ch]) {
      out.push({ c: SINGLE[ch][0], n: SINGLE[ch][1], j: ch === 'j' });
      i++;
      continue;
    }
    if (ch === 'c') {
      out.push({ c: FRONT.has(word[i + 1]) ? 's' : 'k', n: 1 });
      i++;
      continue;
    }
    if (word[i + 1] === ch) {
      out.push({ c: ch, n: 2 });
      i += 2;
      continue;
    }
    out.push({ c: ch, n: 1 });
    i++;
  }
  return out;
}

// Is the first vowel (at index fv) long?
function isLong(toks, fv) {
  let count = 0;
  let k = fv + 1;
  for (; k < toks.length && toks[k].c !== undefined; k++) {
    if (toks[k].j) return false;
    count += toks[k].n;
  }
  if (k < toks.length && toks[k].tion) return false;
  if (count >= 2) return false;
  if (count === 1 && k === toks.length && /^[mn]$/.test(toks[k - 1].c)) return false;
  return true;
}

const FIRST = { long: { o: 'u', u: 'ü' }, short: { o: 'o', u: 'ö' } };
const LATER = { o: 'u' };
const PLAIN = { a: 'a', e: 'e', i: 'i', å: 'o', ä: 'e', ö: 'ö', y: 'ü' };

// Where the stressed vowel starts in the word (a character index).
function stressAt(w, syllables) {
  const groups = [...w.matchAll(/[aeiouyåäö]+/g)];
  // be-/för- as an unstressed prefix (betala, förstå), but not förr- (förra).
  if (syllables >= 2 && /^(be[^aeiouyåäö]|för[^aeiouyåäör])/.test(w)) return groups[1].index;
  const era = w.match(/er(a|ar|ade|at|as)$/);
  if (syllables >= 3 && era) return era.index;
  return 0;
}

function convert(word) {
  let w = word.replace(/é/g, 'e');
  const syllables = (w.match(/[aeiouyåäö]+/g) || []).length;
  if (syllables >= 2) w = w.replace(/igt$/, 'it').replace(/ig$/, 'i');
  const toks = tokens(w);
  const hasTion = toks.some((t) => t.tion);
  const from = stressAt(w, syllables);
  const fv = toks.findIndex((t) => t.v && t.pos >= from);
  let out = '';
  toks.forEach((t, idx) => {
    if (t.tion) out += 'şu:n';
    else if (t.c !== undefined) out += t.c;
    else if (idx === fv) {
      const long = !hasTion && isLong(toks, fv);
      out += (FIRST[long ? 'long' : 'short'][t.v] || PLAIN[t.v]) + (long ? ':' : '');
    } else if (t.v === 'u') out += isLong(toks, idx) ? 'ü' : 'ö';
    else out += LATER[t.v] || PLAIN[t.v];
  });
  return out;
}

export function uttal(text, extra = {}) {
  return String(text)
    .toLocaleLowerCase('sv')
    .replace(/[a-zåäöé]+/g, (word) => extra[word] ?? EXCEPTIONS[word] ?? convert(word));
}

export const hintOf = (word, extra = {}) => word.ut || uttal(word.sv, extra);
