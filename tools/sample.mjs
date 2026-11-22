// Prints generated example sentences for proofreading: Swedish | Turkish | pronunciation.
// Usage: node tools/sample.mjs [wordsPerTemplate] [patternId,patternId,...]
import { WORDS } from '../data/words.js';
import { PATTERNS } from '../data/patterns.js';
import { fill, fits } from '../js/combine.js';
import { uttal } from '../js/uttal.js';

const per = Number(process.argv[2] || 4);
const only = process.argv[3]?.split(',');
const UT = Object.fromEntries(WORDS.filter((w) => w.ut && !w.sv.includes(' ')).map((w) => [w.sv.toLowerCase(), w.ut]));

for (const p of PATTERNS) {
  if (only && !only.includes(p.id)) continue;
  for (const v of p.variants) {
    const slot = v.slot || p.slot;
    const words = WORDS.filter((w) => fits(slot, w));
    if (!v.t.length || !words.length) continue;
    const step = Math.max(1, Math.floor(words.length / per));
    const picked = words.filter((_, i) => i % step === 0).slice(0, per);
    console.log(`\n## ${p.id} — ${v.sv}`);
    for (const [sv, tr] of v.t) {
      for (const w of picked) {
        const r = fill({ sv, tr }, w);
        console.log(`  ${r.sv.padEnd(40)} ${r.tr.padEnd(36)} [${uttal(r.sv, UT)}]`);
      }
    }
  }
}
