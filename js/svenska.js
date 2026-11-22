// Swedish form engine: the forms a template asks for, built from a word's
// dictionary form and a few hints. Pure functions.
//
// svForm(word, form) — form is one of:
//   ''      as written                     en      with article (en bil, ett hus; bare for m / prop)
//   def     definite singular (bilen)      pl      plural (bilar)        pld   definite plural (bilarna)
//   at      where: i/på + definite (på stranden), or the word's `at`
//   to      till + definite, or `to`       from    från + definite, or `from`
//   inf     infinitive                     pres    present (one form for every person)
//   past    preterite                      sup     supine (har talat)    imp   imperative
//   t       adjective for ett-words        a       adjective for plural / definite
//   komp    comparative                    superl  superlative
//
// Word fields:
//   all     sv, type
//   nouns   g ('en' | 'ett'), m (mass noun: no article, no plural), prop (proper noun:
//           every form is sv), prep ('i' | 'på', default 'i'); overrides def, pl, pld, at, to, from
//   verbs   vg (1 tala/talar, 2 stänga/stänger, 3 bo/bor) or vf [present, past, supine]
//           for irregular verbs; imp overrides the imperative. Particle verbs
//           ("tycka om") inflect their first word only.
//   adjs    overrides t, a, komp [comparative, superlative]
//
// Rules:
//   definite   en-words: +n after a vowel or an unstressed -el/-er/-en/-or, else +en
//              ett-words: +t after a vowel, else +et
//   plural     en: -a → -or, -are unchanged, -else → +r, -e → -ar, unstressed -el/-er/-en drop the e
//              and take -ar, -ion/-het/-tet/-ist/-ör/-ent/-ant/-ang and longer -or/-ur/-ik take +er,
//              another vowel +r, else +ar
//              ett: -eri +er, another vowel +n, else unchanged
//   def. pl.   unchanged ett plural +en, en plural in -are → -arna, -r +na, -n +a, else +na
//   verbs      1: +r +de +t, imperative = infinitive
//              2: stem = infinitive without -a; present stem+er (stem after r); past +de, +te after
//                 k p s t x, a consonant+d or consonant+t stem only +e; a double m or n is single
//                 before d/t; supine +t (…d → …t, …t unchanged); imperative = stem
//              3: +r +dde +tt, imperative = infinitive
//              vf: imperative = infinitive minus a final a when longer than 2 letters
//   adjectives t: vowel+d → tt, consonant+d → t, -t and -a unchanged, final vowel +tt, else +t
//              a: -a unchanged, unstressed -el/-er/-en drop the e, else +a
//              comparison: +are / +ast on the a-form's stem

const VOWELS = new Set('aeiouyåäö');
const VOICELESS = new Set('kpstx');

const isVowel = (c) => VOWELS.has(c);
const last = (s) => s[s.length - 1] || '';
const vowelGroups = (s) => (s.match(/[aeiouyåäö]+/g) || []).length;
const endsAny = (s, list) => list.some((e) => s.endsWith(e));

// An unstressed -el/-er/-en in a word of two or more syllables (nyckel, vinter, öken).
const unstressedE = (s) => vowelGroups(s) >= 2 && /[^aeiouyåäö]e[lrn]$/.test(s);
// An unstressed -or in a word of two or more syllables (dator, doktor, motor).
const unstressedOr = (s) => vowelGroups(s) >= 2 && /[^aeiouyåäö]or$/.test(s);
const dropE = (s) => s.slice(0, -2) + s.slice(-1);

// ---------- nouns ----------

function def(w) {
  if (w.def) return w.def;
  if (w.prop) return w.sv;
  const s = w.sv;
  if (w.g === 'ett') return isVowel(last(s)) ? s + 't' : s + 'et';
  return isVowel(last(s)) || unstressedE(s) || unstressedOr(s) ? s + 'n' : s + 'en';
}

const ER_ENDINGS = ['ion', 'het', 'tet', 'ist', 'ör', 'ent', 'ant', 'ang'];
const ER_LONG = ['or', 'ur', 'ik']; // only in words of two or more syllables

function pl(w) {
  if (w.pl) return w.pl;
  const s = w.sv;
  if (w.prop || w.m) return s;
  if (w.g === 'ett') {
    if (s.endsWith('eri')) return s + 'er';
    return isVowel(last(s)) ? s + 'n' : s;
  }
  if (s.endsWith('are')) return s;
  if (s.endsWith('a')) return s.slice(0, -1) + 'or';
  if (s.endsWith('else')) return s + 'r';
  if (s.endsWith('e')) return s.slice(0, -1) + 'ar';
  if (unstressedE(s)) return dropE(s) + 'ar';
  if (endsAny(s, ER_ENDINGS) || (vowelGroups(s) >= 2 && endsAny(s, ER_LONG))) return s + 'er';
  if (isVowel(last(s))) return s + 'r';
  return s + 'ar';
}

function pld(w) {
  if (w.pld) return w.pld;
  const p = pl(w);
  if (w.prop) return p;
  if (w.g === 'ett' && p === w.sv) return p + 'en';
  if (p.endsWith('are')) return p.slice(0, -1) + 'na';
  if (p.endsWith('r')) return p + 'na';
  if (p.endsWith('n')) return p + 'a';
  return p + 'na';
}

const withArticle = (w) => (w.m || w.prop ? w.sv : `${w.g === 'ett' ? 'ett' : 'en'} ${w.sv}`);

// ---------- verbs ----------

// Particle verbs ("tycka om", "gå ut") inflect their first word and keep the rest.
function splitVerb(sv) {
  const i = sv.indexOf(' ');
  return i < 0 ? [sv, ''] : [sv.slice(0, i), sv.slice(i)];
}

// A double m or n turns single before d / t (känna → kände, glömma → glömt); ll, ss… stay (kysste, fyllde).
const single = (stem) => (/(mm|nn)$/.test(stem) ? stem.slice(0, -1) : stem);
const consonantD = (stem) => stem.endsWith('d') && stem.length > 1 && !isVowel(stem[stem.length - 2]);
const consonantT = (stem) => stem.endsWith('t') && stem.length > 1 && !isVowel(stem[stem.length - 2]);

function verbForms(first, w) {
  if (w.vf) {
    const [pres, past, sup] = w.vf;
    return { pres, past, sup, imp: first.endsWith('a') && first.length > 2 ? first.slice(0, -1) : first };
  }
  if (w.vg === 3) return { pres: first + 'r', past: first + 'dde', sup: first + 'tt', imp: first };
  if (w.vg === 2) {
    const stem = first.endsWith('a') ? first.slice(0, -1) : first;
    const pres = stem.endsWith('r') ? stem : stem + 'er';
    if (consonantD(stem)) return { pres, past: stem + 'e', sup: stem.slice(0, -1) + 't', imp: stem };
    if (consonantT(stem)) return { pres, past: stem + 'e', sup: stem, imp: stem };
    const s = single(stem);
    return { pres, past: s + (VOICELESS.has(last(s)) ? 'te' : 'de'), sup: s + 't', imp: stem };
  }
  return { pres: first + 'r', past: first + 'de', sup: first + 't', imp: first };
}

function verbForm(w, form) {
  if (form === 'inf') return w.sv;
  if (form === 'imp' && w.imp) return w.imp;
  const [first, rest] = splitVerb(w.sv);
  return verbForms(first, w)[form] + rest;
}

// ---------- adjectives ----------

function tForm(w) {
  if (w.t) return w.t;
  const s = w.sv;
  if (s.endsWith('a') || s.endsWith('t')) return s;
  if (isVowel(last(s))) return s + 'tt';
  if (s.endsWith('d')) return isVowel(s[s.length - 2]) ? s.slice(0, -1) + 'tt' : s.slice(0, -1) + 't';
  return s + 't';
}

// The stem the a-form and comparison build on (vacker → vackr).
const adjStem = (s) => (unstressedE(s) ? dropE(s) : s);

function aForm(w) {
  if (w.a) return w.a;
  const s = w.sv;
  if (s.endsWith('a') || s.endsWith('e')) return s;
  return adjStem(s) + 'a';
}

const komp = (w) => (w.komp ? w.komp[0] : adjStem(w.sv) + 'are');
const superl = (w) => (w.komp ? w.komp[1] : adjStem(w.sv) + 'ast');

// ---------- public ----------

const FORMS = {
  '': (w) => w.sv,
  en: withArticle,
  def,
  pl,
  pld,
  at: (w) => w.at || `${w.prep || 'i'} ${def(w)}`,
  to: (w) => w.to || `till ${def(w)}`,
  from: (w) => w.from || `från ${def(w)}`,
  t: tForm,
  a: aForm,
  komp,
  superl,
};

const VERB_FORMS = new Set(['inf', 'pres', 'past', 'sup', 'imp']);

export function svForm(word, form = '') {
  if (VERB_FORMS.has(form)) return verbForm(word, form);
  const f = FORMS[form];
  if (!f) throw new Error(`Unknown Swedish form "${form}"`);
  return f(word);
}

// Words that agree with the inserted noun's gender; never highlighted.
const AGREE = {
  art: ['en', 'ett'],
  ingen: ['ingen', 'inget'],
  min: ['min', 'mitt'],
  din: ['din', 'ditt'],
  den: ['den', 'det'],
  denhar: ['den här', 'det här'],
};

export function svAgree(word, helper) {
  const ett = word.g === 'ett';
  if (helper.startsWith('adj:')) {
    const base = helper.slice(4);
    return ett ? tForm({ sv: base, type: 'adj' }) : base;
  }
  const pair = AGREE[helper];
  if (!pair) throw new Error(`Unknown agreement helper "${helper}"`);
  return pair[ett ? 1 : 0];
}

// The forms shown on a word's window.
export function formsLine(w) {
  if (w.type === 'noun') {
    if (w.prop) return '';
    if (w.m) return `${w.sv} · ${def(w)}`;
    return [withArticle(w), def(w), pl(w), pld(w)].join(' · ');
  }
  if (w.type === 'verb') return `${svForm(w, 'pres')} · ${svForm(w, 'past')} · har ${svForm(w, 'sup')}`;
  if (w.type === 'adj') return `${w.sv} · ${tForm(w)} · ${aForm(w)}`;
  return '';
}

export const capSv = (s) => (s ? s[0].toLocaleUpperCase('sv') + s.slice(1) : s);
