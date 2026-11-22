import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// store.js reads localStorage when it loads.
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: { getItem: () => null, setItem: () => {} },
});

test('every name app.js imports exists in its module', async () => {
  const src = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
  const imports = [...src.matchAll(/import\s*\{([^}]+)\}\s*from\s*'([^']+)'/g)];
  assert.ok(imports.length > 10, 'app.js imports its modules');
  const missing = [];
  for (const [, names, path] of imports) {
    const mod = await import(new URL(path, new URL('../js/app.js', import.meta.url)));
    for (const name of names.split(',').map((n) => n.trim()).filter(Boolean)) {
      if (!(name in mod)) missing.push(`${name} from ${path}`);
    }
  }
  assert.deepEqual(missing, []);
});

test('app.js has no visible text of its own: every string comes from metin.js or the data', () => {
  const src = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
  // Text between tags inside template strings, e.g. `<h2>Settings</h2>`, would be visible.
  const texts = [...src.matchAll(/>([A-Za-zÇĞİÖŞÜçğıöşüÅÄÖåäö][^<>${}`]*)</g)].map((m) => m[1].trim()).filter(Boolean);
  assert.deepEqual(texts, []);
});
