import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';

// Runs sw.js against a minimal stand-in for the browser's service worker globals.
function load(caches) {
  const handlers = {};
  const context = {
    self: { addEventListener: (type, fn) => (handlers[type] = fn), skipWaiting: () => {}, clients: { claim: () => {} } },
    caches,
    Request: class {
      constructor(url, init = {}) {
        this.url = url;
        this.cache = init.cache || 'default';
      }
    },
    location: { origin: 'https://example.test' },
  };
  vm.runInNewContext(readFileSync(new URL('../sw.js', import.meta.url), 'utf8'), context);
  return handlers;
}

// What the install step put in the cache.
async function runInstall() {
  let stored = null;
  const handlers = load({ open: async () => ({ addAll: async (reqs) => (stored = reqs) }) });
  let done;
  handlers.install({ waitUntil: (p) => (done = p) });
  await done;
  return stored;
}

test('install fetches every file fresh, never from the HTTP cache', async () => {
  const stored = await runInstall();
  assert.ok(stored.length > 10, 'caches the app files');
  for (const req of stored) {
    assert.equal(typeof req, 'object', `${req} should be a Request`);
    assert.equal(req.cache, 'reload', `${req.url} must bypass the HTTP cache`);
  }
});

test('every app module is in the offline cache', async () => {
  const urls = new Set((await runInstall()).map((req) => req.url));
  for (const dir of ['js', 'data']) {
    for (const file of readdirSync(new URL(`../${dir}/`, import.meta.url))) {
      assert.ok(urls.has(`${dir}/${file}`), `${dir}/${file} is missing from the offline cache`);
    }
  }
});

test("activate deletes only this app's old caches", async () => {
  // The Turkish app on the same github.io origin keeps its offline copy.
  const deleted = [];
  const handlers = load({ keys: async () => ['swedish-v4', 'turkish-v15', 'swedish-v5'], delete: async (k) => deleted.push(k) });
  let done;
  handlers.activate({ waitUntil: (p) => (done = p) });
  await done;
  assert.deepEqual(deleted, ['swedish-v4']);
});
