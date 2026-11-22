// Free AI services: "More examples", and reading and explaining photographed
// Swedish text (Gemini only). Keys are stored only on this device.
//
// Gemini uses Google's own API; the others share the OpenAI-style chat API.
// Prompts are in English (models follow them best); every answer a person reads
// is Swedish with Turkish, and every message is Turkish (js/metin.js).

import { T } from './metin.js';

export const PROVIDERS = {
  gemini: {
    ...T.providers.gemini,
    // Flash-Lite: about 500 free requests a day (regular Flash: about 20, and often overloaded).
    model: 'gemini-flash-lite-latest',
    keyUrl: 'https://aistudio.google.com/apikey',
  },
  groq: {
    ...T.providers.groq,
    model: 'llama-3.3-70b-versatile',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    keyUrl: 'https://console.groq.com/keys',
    json: true,
  },
  mistral: {
    ...T.providers.mistral,
    model: 'mistral-small-latest',
    url: 'https://api.mistral.ai/v1/chat/completions',
    keyUrl: 'https://console.mistral.ai/api-keys',
    json: true,
  },
  openrouter: {
    ...T.providers.openrouter,
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    keyUrl: 'https://openrouter.ai/keys',
  },
};

export class AIError extends Error {}

// The first {...} in a reply, ignoring code fences and chatter; null if none parses.
function jsonObject(text) {
  const s = String(text || '');
  const start = s.indexOf('{');
  if (start < 0) return null;
  try {
    return JSON.parse(s.slice(start, s.lastIndexOf('}') + 1));
  } catch {
    return null;
  }
}

const str = (v) => (typeof v === 'string' ? v.trim() : '');

// Pulls [{sv, tr}] out of a model reply, ignoring code fences and chatter.
export function parseExamples(text) {
  const s = String(text || '');
  const arrStart = s.indexOf('[');
  const objStart = s.indexOf('{');
  let data = null;
  try {
    if (arrStart >= 0 && (objStart < 0 || arrStart < objStart)) {
      data = JSON.parse(s.slice(arrStart, s.lastIndexOf(']') + 1));
    } else if (objStart >= 0) {
      const obj = JSON.parse(s.slice(objStart, s.lastIndexOf('}') + 1));
      data = Array.isArray(obj.examples) ? obj.examples : [obj];
    }
  } catch {
    data = null;
  }
  const out = (Array.isArray(data) ? data : [])
    .filter((e) => e && typeof e.sv === 'string' && typeof e.tr === 'string')
    .map((e) => ({ sv: e.sv.trim(), tr: e.tr.trim() }))
    .filter((e) => e.sv && e.tr);
  if (!out.length) throw new AIError(T.ai.parseExamples);
  return out;
}

// Paragraphs of sentences read from a photo. [] means no Swedish text was found.
export function parsePage(text) {
  const obj = jsonObject(text);
  if (!obj || !Array.isArray(obj.paragraphs)) throw new AIError(T.ai.parsePage);
  return obj.paragraphs
    .map((p) => (Array.isArray(p) ? p : []).map(str).filter(Boolean))
    .filter((p) => p.length);
}

// { tr, structure, words: [{ w, base, tr, parts }] } for one sentence.
export function parseExplanation(text) {
  const obj = jsonObject(text);
  if (!obj || !str(obj.tr)) throw new AIError(T.ai.parseExplanation);
  const words = (Array.isArray(obj.words) ? obj.words : [])
    .filter((x) => x && str(x.w))
    .map((x) => ({ w: str(x.w), base: str(x.base), tr: str(x.tr), parts: str(x.parts) }));
  return { tr: str(obj.tr), structure: str(obj.structure), words };
}

const INTRO = 'You help a Turkish speaker learn everyday spoken Swedish.\n';
const RULES =
  'Rules: short sentences (at most 8 words), natural casual everyday spoken Swedish, common vocabulary, ' +
  'correct en/ett, word order and verb forms, and a natural Turkish translation. ' +
  'Reply with JSON only, in this shape: {"examples":[{"sv":"Swedish sentence","tr":"Turkish translation"}]}';

const KIND = { noun: 'noun', verb: 'verb', adj: 'adjective', adv: 'adverb', phrase: 'phrase', other: 'word' };

const avoid = (existing) =>
  existing.length ? `Do not repeat these: ${existing.slice(-12).map((e) => e.sv).join(' | ')}\n` : '';

export function patternPrompt({ variant, patternTr, words, existing = [], n = 4 }) {
  return (
    INTRO +
    `Write ${n} new example sentences that use this Swedish pattern: "${variant.sv}" (in Turkish "${variant.tr}", from "${patternTr}").\n` +
    (words.length
      ? `Build them with these words the learner knows, one per sentence where it fits naturally: ${words.map((w) => `${w.sv} (${w.tr})`).join(', ')}.\n`
      : '') +
    avoid(existing) +
    RULES
  );
}

export function wordPrompt({ word, meaning, type, patterns, existing = [], n = 4 }) {
  return (
    INTRO +
    `Write ${n} new example sentences that use the Swedish ${KIND[type] || 'word'} "${word}" (${meaning}).\n` +
    (patterns.length
      ? `Where natural, use these patterns the learner knows: ${patterns.map((v) => `"${v.sv}" (${v.tr})`).join(', ')}.\n`
      : '') +
    avoid(existing) +
    RULES
  );
}

const PAGE_PROMPT =
  'This photo shows Swedish text, for example a page of a book, a letter or a sign. Write out the Swedish text exactly as printed: ' +
  'keep every letter (å ä ö é), the punctuation and the paragraphs, and correct nothing. ' +
  'Join words that are hyphenated across line ends. Split each paragraph into its sentences. ' +
  'Leave out page numbers, running headers and any text that is not Swedish. ' +
  'If there is no Swedish text, reply with an empty list. ' +
  'Reply with JSON only, in this shape: {"paragraphs":[["First sentence.","Second sentence."],["A sentence of the next paragraph."]]}';

const explainPrompt = (sentence) =>
  'You help a Turkish speaker understand Swedish grammar. Write every explanation in Turkish.\n' +
  `Explain this Swedish sentence: ${JSON.stringify(sentence)}\n` +
  'Give "tr": a natural Turkish translation. ' +
  'Give "structure": how the sentence is built, in 2 to 5 short plain sentences in Turkish (subject, verb and tense, ' +
  'word order and the verb in second place, where "inte" goes, and any clause or connector). ' +
  'Give "words": every word in order, each with "w" (as written), "base" (dictionary form: verbs as the infinitive, ' +
  'nouns as the indefinite singular with en/ett, for example "en bil"), "tr" (its Turkish meaning here) and "parts" ' +
  '(in Turkish: the stem and each ending with its meaning, for example "bil + -en (belirli hâli)"; just the word when it has no ending). ' +
  'Reply with JSON only, in this shape: {"tr":"...","structure":"...","words":[{"w":"...","base":"...","tr":"...","parts":"..."}]}';

// An error for a failed reply. The service's own explanation is English, so the Turkish
// message names only the status. A 429 names the quota that ran out: a per-minute one only
// needs a short wait.
async function httpError(res, limitMsg = T.ai.limit) {
  let error = null;
  try {
    error = (await res.json())?.error || null;
  } catch {
    /* no JSON body */
  }
  if (res.status === 429) {
    const quotas = (error?.details || []).flatMap((d) => d?.violations || []).map((v) => String(v?.quotaId || ''));
    const perMinute = quotas.some((q) => /PerMinute/i.test(q)) && !quotas.some((q) => /PerDay/i.test(q));
    return new AIError(perMinute ? T.ai.minute : limitMsg);
  }
  const code = T.ai.code(res.status);
  if ([400, 401, 403, 404].includes(res.status)) return new AIError(T.ai.badKey(code));
  return new AIError(T.ai.service(code));
}

function networkError(e) {
  if (e instanceof AIError) return e;
  if (e.name === 'AbortError') return new AIError(T.ai.timeout);
  return new AIError(globalThis.navigator?.onLine === false ? T.ai.offline : T.ai.unreachable);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// One Gemini request; a 503 (overloaded) is retried once after `retryMs`. Returns the reply text.
async function callGemini({ key, model, parts, temperature, timeout = 25000, retryMs = 2000, limitMsg }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  for (let attempt = 0; ; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);
    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          contents: [{ role: 'user', parts }],
          generationConfig: { responseMimeType: 'application/json', temperature },
        }),
        signal: ctrl.signal,
      });
    } catch (e) {
      throw networkError(e);
    } finally {
      clearTimeout(timer);
    }
    if (res.status === 503 && attempt === 0) {
      await sleep(retryMs);
      continue;
    }
    if (!res.ok) throw await httpError(res, limitMsg);
    let data;
    try {
      data = await res.json();
    } catch {
      throw new AIError(T.ai.failed); // the parser's own message is English
    }
    return (data?.candidates?.[0]?.content?.parts || []).map((x) => x.text || '').join('');
  }
}

// Scans always use Gemini, whichever provider is chosen for "More examples".
function geminiFor(settings) {
  const key = settings.keys?.gemini;
  if (!key) throw new AIError(T.ai.needGemini);
  return { key, model: settings.models?.gemini || PROVIDERS.gemini.model };
}

// image: { data: base64 without the data: prefix, mimeType }. Returns paragraphs of sentences.
export async function readPage(settings, image, { retryMs = 2000 } = {}) {
  const parts = [{ inline_data: { mime_type: image.mimeType, data: image.data } }, { text: PAGE_PROMPT }];
  const text = await callGemini({ ...geminiFor(settings), parts, temperature: 0.2, timeout: 60000, retryMs, limitMsg: T.ai.scanLimit });
  return parsePage(text);
}

export async function explainSentence(settings, sentence, { retryMs = 2000 } = {}) {
  const parts = [{ text: explainPrompt(sentence) }];
  const text = await callGemini({ ...geminiFor(settings), parts, temperature: 0.2, timeout: 60000, retryMs, limitMsg: T.ai.scanLimit });
  return parseExplanation(text);
}

export async function generate(settings, prompt) {
  const id = settings.provider;
  const p = PROVIDERS[id];
  const key = settings.keys?.[id];
  if (!p || !key) throw new AIError(T.ai.needKey);
  const model = settings.models?.[id] || p.model;

  if (id === 'gemini') {
    return parseExamples(await callGemini({ key, model, parts: [{ text: prompt }], temperature: 0.9 }));
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 25000);
  try {
    const res = await fetch(p.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        temperature: 0.9,
        messages: [{ role: 'user', content: prompt }],
        ...(p.json ? { response_format: { type: 'json_object' } } : {}),
      }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw await httpError(res);
    const data = await res.json();
    return parseExamples(data.choices?.[0]?.message?.content || '');
  } catch (e) {
    throw networkError(e);
  } finally {
    clearTimeout(timer);
  }
}
