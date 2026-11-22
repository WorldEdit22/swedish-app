import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PROVIDERS, parseExamples, parsePage, parseExplanation, readPage, explainSentence, generate, patternPrompt, wordPrompt } from '../js/ai.js';
import { T } from '../js/metin.js';

// Replaces fetch with canned replies, one per call; returns the recorded calls.
function stubFetch(...replies) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    const r = replies[Math.min(calls.length, replies.length) - 1];
    return { ok: r.status === 200, status: r.status, json: async () => r.body };
  };
  return calls;
}
const gemini = (text) => ({ status: 200, body: { candidates: [{ content: { parts: [{ text }] } }] } });
const KEYS = { provider: 'groq', keys: { groq: 'g', gemini: 'k' }, models: {} };
const IMAGE = { data: 'QUJD', mimeType: 'image/jpeg' };
const PAGE = '{"paragraphs":[["Idag är det fint väder."]]}';
const promptOf = (call) => call.body.contents[0].parts.map((p) => p.text || '').join(' ');

test('provider names and instructions are the Turkish copy', () => {
  for (const id of ['gemini', 'groq', 'mistral', 'openrouter']) {
    assert.equal(PROVIDERS[id].label, T.providers[id].label);
    assert.equal(PROVIDERS[id].howTo, T.providers[id].howTo);
  }
  assert.equal(PROVIDERS.gemini.model, 'gemini-flash-lite-latest');
});

test('parseExamples reads the examples array', () => {
  const text = '{"examples":[{"sv":"Jag vill ha vatten.","tr":"Su istiyorum."}]}';
  assert.deepEqual(parseExamples(text), [{ sv: 'Jag vill ha vatten.', tr: 'Su istiyorum.' }]);
});

test('parseExamples tolerates code fences and chatter around the JSON', () => {
  const text = 'Sure!\n```json\n{"examples":[{"sv":"Jag går hem.","tr":"Eve gidiyorum."}]}\n```\nEnjoy.';
  assert.deepEqual(parseExamples(text), [{ sv: 'Jag går hem.', tr: 'Eve gidiyorum.' }]);
});

test('parseExamples accepts a bare array', () => {
  assert.deepEqual(parseExamples('[{"sv":"Kom!","tr":"Gel!"}]'), [{ sv: 'Kom!', tr: 'Gel!' }]);
});

test('parseExamples drops malformed entries and trims text', () => {
  const text = '{"examples":[{"sv":"  Kom! ","tr":" Gel! "},{"sv":""},{"tr":"x"},"nope",{"sv":5,"tr":"y"}]}';
  assert.deepEqual(parseExamples(text), [{ sv: 'Kom!', tr: 'Gel!' }]);
});

test('parseExamples throws the Turkish message when there is nothing usable', () => {
  assert.throws(() => parseExamples('I cannot help with that.'), { message: T.ai.parseExamples });
  assert.throws(() => parseExamples('{"examples":[]}'), { message: T.ai.parseExamples });
});

test('the example prompts ask for Swedish with Turkish translations', () => {
  const words = [{ sv: 'kaffe', tr: 'kahve' }];
  const p = patternPrompt({ variant: { sv: 'Jag vill ha ___', tr: '___ istiyorum' }, patternTr: '___ istiyorum', words, existing: [{ sv: 'Jag vill ha te.' }] });
  for (const part of ['Turkish speaker', 'Swedish', '"Jag vill ha ___"', 'kaffe (kahve)', 'Jag vill ha te.', '"sv"', '"tr"']) assert.ok(p.includes(part), part);
  const w = wordPrompt({ word: 'springa', meaning: 'koşmak', type: 'verb', patterns: [{ sv: 'Jag vill ___', tr: '___ istiyorum' }] });
  for (const part of ['Swedish verb "springa" (koşmak)', '"Jag vill ___"']) assert.ok(w.includes(part), part);
  assert.ok(wordPrompt({ word: 'hej', meaning: 'merhaba', type: 'phrase', patterns: [] }).includes('Swedish phrase "hej"'));
});

test('generate with Gemini parses the examples', async () => {
  stubFetch(gemini('{"examples":[{"sv":"Hej!","tr":"Merhaba!"}]}'));
  assert.deepEqual(await generate({ provider: 'gemini', keys: { gemini: 'k' }, models: {} }, 'x'), [{ sv: 'Hej!', tr: 'Merhaba!' }]);
  await assert.rejects(generate({ provider: '', keys: {} }, 'x'), { message: T.ai.needKey });
});

// ---------- reading a page ----------

test('parsePage keeps paragraphs and sentences, trimming blanks', () => {
  const text = '```json\n{"paragraphs":[["Idag är det fint väder."," Vi går till parken. ",""],[]]}\n```';
  assert.deepEqual(parsePage(text), [['Idag är det fint väder.', 'Vi går till parken.']]);
});

test('parsePage returns no paragraphs when the photo has no Swedish text', () => {
  assert.deepEqual(parsePage('{"paragraphs":[]}'), []);
});

test('parsePage throws on a reply without paragraphs', () => {
  assert.throws(() => parsePage('Sorry, I cannot read that.'), { message: T.ai.parsePage });
  assert.throws(() => parsePage('{"text":"Idag"}'), { message: T.ai.parsePage });
});

test('readPage sends the photo inline to Flash-Lite with the Gemini key and asks for Swedish', async () => {
  const calls = stubFetch(gemini(PAGE));
  const paragraphs = await readPage(KEYS, IMAGE, { retryMs: 0 });
  assert.deepEqual(paragraphs, [['Idag är det fint väder.']]);
  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /models\/gemini-flash-lite-latest:generateContent$/);
  assert.equal(calls[0].init.headers['x-goog-api-key'], 'k');
  assert.deepEqual(calls[0].body.contents[0].parts[0], { inline_data: { mime_type: 'image/jpeg', data: 'QUJD' } });
  assert.match(promptOf(calls[0]), /Swedish text/);
});

test('scans need a Gemini key', async () => {
  const calls = stubFetch(gemini(PAGE));
  await assert.rejects(readPage({ provider: 'groq', keys: { groq: 'g' } }, IMAGE), { message: T.ai.needGemini });
  assert.equal(calls.length, 0);
});

test('a 503 is retried once', async () => {
  let calls = stubFetch({ status: 503, body: {} }, gemini(PAGE));
  assert.deepEqual(await readPage(KEYS, IMAGE, { retryMs: 0 }), [['Idag är det fint väder.']]);
  assert.equal(calls.length, 2);
  calls = stubFetch({ status: 503, body: {} }, { status: 503, body: {} }, { status: 503, body: {} });
  await assert.rejects(readPage(KEYS, IMAGE, { retryMs: 0 }), { message: T.ai.service(T.ai.code(503, '')) });
  assert.equal(calls.length, 2);
});

// The service's own explanation is English, so the Turkish message names only the status.
test('a 400 is not retried, and its message is Turkish without the service\'s English text', async () => {
  const calls = stubFetch({ status: 400, body: { error: { message: 'API key not valid.' } } });
  await assert.rejects(explainSentence(KEYS, 'Kom.', { retryMs: 0 }), { message: T.ai.badKey(T.ai.code(400)) });
  assert.equal(calls.length, 1);
  assert.ok(!T.ai.badKey(T.ai.code(400)).includes('API key'));
});

test('a Gemini reply that is not JSON gives a Turkish message, not the parser\'s English one', async () => {
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => {
      throw new SyntaxError('Unexpected token < in JSON at position 0');
    },
  });
  await assert.rejects(generate({ provider: 'gemini', keys: { gemini: 'k' }, models: {} }, 'x'), { message: T.ai.failed });
});

// Gemini's 429 body names the quota that ran out.
const quota429 = (quotaId) => ({
  status: 429,
  body: {
    error: {
      code: 429,
      message: 'You exceeded your current quota.',
      details: [
        { '@type': 'type.googleapis.com/google.rpc.QuotaFailure', violations: [{ quotaId }] },
        { '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay: '39s' },
      ],
    },
  },
});

test('a used-up daily limit says try again tomorrow', async () => {
  let calls = stubFetch(quota429('GenerateRequestsPerDayPerProjectPerModel-FreeTier'));
  await assert.rejects(readPage(KEYS, IMAGE, { retryMs: 0 }), { message: T.ai.scanLimit });
  assert.equal(calls.length, 1);
  calls = stubFetch({ status: 429, body: { error: { message: 'Quota exceeded' } } });
  await assert.rejects(readPage(KEYS, IMAGE, { retryMs: 0 }), { message: T.ai.scanLimit });
});

test('a per-minute limit says wait a minute, not tomorrow', async () => {
  const calls = stubFetch(quota429('GenerateRequestsPerMinutePerProjectPerModel-FreeTier'));
  await assert.rejects(explainSentence(KEYS, 'Kom.', { retryMs: 0 }), { message: T.ai.minute });
  assert.equal(calls.length, 1);
});

// ---------- explaining a sentence ----------

test('parseExplanation reads translation, structure and words', () => {
  const text =
    'Here:\n{"tr":" Parka gitmek istiyoruz. ","structure":"Özne vi (biz).",' +
    '"words":[{"w":"parken","base":"en park","tr":"park","parts":"park + -en (belirli hâli)"},{"w":"gå"},{"base":"x"}]}';
  assert.deepEqual(parseExplanation(text), {
    tr: 'Parka gitmek istiyoruz.',
    structure: 'Özne vi (biz).',
    words: [
      { w: 'parken', base: 'en park', tr: 'park', parts: 'park + -en (belirli hâli)' },
      { w: 'gå', base: '', tr: '', parts: '' },
    ],
  });
});

test('parseExplanation throws without a translation', () => {
  assert.throws(() => parseExplanation('{"structure":"x","words":[]}'), { message: T.ai.parseExplanation });
});

test('explainSentence asks Gemini to explain the sentence in Turkish', async () => {
  const calls = stubFetch(gemini('{"tr":"Gel.","structure":"Emir.","words":[{"w":"Kom","base":"komma","tr":"gel","parts":"kom (emir)"}]}'));
  const res = await explainSentence(KEYS, 'Kom.', { retryMs: 0 });
  assert.equal(res.tr, 'Gel.');
  assert.equal(res.words[0].base, 'komma');
  const prompt = promptOf(calls[0]);
  assert.match(prompt, /Kom\./);
  assert.match(prompt, /in Turkish/);
});
