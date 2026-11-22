# Svenska (Swedish app for Turkish speakers) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `c:\dev\hobby\swedish-app`, a home-screen web app that teaches the most common spoken Swedish words and patterns to Turkish speakers. Everything people see is in Turkish. It also gets the Turkish app ready to share the same GitHub Pages origin.

**Architecture:** This is a converted copy of `c:\dev\hobby\turkish-app`, with plain ES modules and no build step:
- A new Swedish form engine (`js/svenska.js`) builds the Swedish side of every example.
- The unchanged Turkish suffix engine (`js/grammar.js`) builds the Turkish meaning line.
- A rule-based converter (`js/uttal.js`) writes pronunciation hints in Turkish letters.
- Every visible string lives in `js/metin.js`, so a test can prove no English slipped in.

**Tech Stack:** Plain HTML, CSS and JavaScript modules. Node.js only for `node --test` and the tools in `tools/`. GitHub Pages for hosting.

**Spec:** `docs/superpowers/specs/2026-11-22-swedish-app-design.md` (read it first; this plan argues from it).

## Global Constraints

- No English anywhere a person can see it. That covers labels, notes, errors, toasts, `confirm()`, `aria-label`, `placeholder`, `title`, the manifest, dates and AI answers. Brand names are allowed (Google Gemini, Groq, Mistral, OpenRouter, Google Translate). Code, comments, README and AI prompts stay in English.
- Field names: `sv` = Swedish, `tr` = Turkish. Examples and templates are `[sv, tr]` pairs. AI caches hold `{ sv, tr }`.
- Storage keys start with `sv.`. The service worker cache is `swedish-v1` and deletes only caches whose names start with `swedish-`.
- Backup JSON: `{ app: 'swedish', learned }`. Restore refuses anything else.
- `<html lang="tr">`. Elements holding Swedish text get `lang="sv"`. Dates use `toLocaleDateString('tr-TR', …)`.
- Name **Svenska**. Manifest name *Svenska – kalıplar ve kelimeler*. Swedish blue `#006AA7` and yellow `#FECC02`. The icon is the Swedish flag.
- Hints use Turkish letters, with ":" marking a long vowel. Both the sj and tj sounds are written "ş".
- Plain JS modules, no dependencies, no build step. Tests: `node --test tests/` must pass at the end of every task.
- Commit only on the feature branch `initial-app` (swedish-app) or `share-origin` (turkish-app). Never commit on `main`, and never `git push`: the user pushes.
- One logical shell operation per Bash call: no `&&`, `;`, pipes or `$(…)`. Use `git -C <dir>` instead of `cd`.

## Review Focus

1. **Irregular nouns, verbs and adjectives inside generated examples** (*man → män*, *vatten → vattnet*, *liten → små*, *gå → gick*). A learner trusts the sentence, so a wrong form teaches wrong Swedish. Task 3 pins a table of irregular forms. Task 10 adds a test that every word's forms are non-empty strings without `undefined`.
2. **Mass nouns in countable templates** (*Jag har två vatten*, *ett kaffe* where it should be bare). Task 11 adds a test that no template using `{w:pl}`, `{w:pld}` or `{art}` can be filled with a word marked `m`.
3. **A Turkish meaning the suffix engine can't inflect** (*araba / otomobil*, *konuşmak, söylemek*) produces garbage Turkish. Task 10 adds a test that every `tr` has no `/`, `,` or `(`, and every verb's `tr` ends in `-mak`/`-mek`.
4. **Search typed on a Turkish keyboard without å, ä, ö** ("har" for *här*, "ol" for *öl*) should still find the word. Task 7 tests `fold`.
5. **A Turkish-app backup pasted into the Swedish app's Restore** must be refused, not wipe progress. Task 7 tests `store.parseBackup`.

---

## File structure (swedish-app)

| File | Responsibility | Task |
| --- | --- | --- |
| `js/grammar.js`, `tests/grammar.test.js` | Turkish suffix engine, copied unchanged | 1 |
| `js/photo.js`, `js/swipe.js`, `js/update.js`, `tools/serve.mjs` (+ tests) | Copied unchanged | 1 |
| `js/svenska.js`, `tests/svenska.test.js` | Swedish forms, agreement helpers, forms line | 3 |
| `js/uttal.js`, `tests/uttal.test.js` | Swedish text → Turkish-letter hint | 4 |
| `js/combine.js`, `js/examples.js` (+ tests) | Fill `[sv, tr]` templates; build card examples | 5 |
| `js/metin.js`, `tests/english.js`, `tests/turkce.test.js` | Every visible string, plus the no-English check | 6 |
| `js/html.js`, `js/store.js`, `js/translate.js`, `js/translateview.js` (+ tests) | Helpers, storage, translator | 7 |
| `js/ai.js`, `js/scanview.js` (+ tests) | AI prompts and parsing; scan screens | 8 |
| `data/alfabe.js`, `js/alfabeview.js`, `tests/alfabe.test.js` | Alphabet content and window HTML | 9 |
| `data/words.js`, `tests/content.test.js` | Topics, types and words (Tasks 10, 14, 15) | 10, 14, 15 |
| `data/patterns.js` | Patterns, groups and ORDER (Tasks 11, 16, 17) | 11, 16, 17 |
| `index.html`, `manifest.webmanifest`, `css/app.css`, `sw.js`, `tools/make-icons.mjs`, `icons/*`, `tests/sw.test.js` | App shell, look, offline, icon | 12 |
| `js/app.js`, `tests/imports.test.js` | The UI | 13 |
| `tools/rank-words.mjs`, `data/ranks.js` | Swedish frequency ranks | 18 |
| `tools/sample.mjs` | Proofreading printout | 11 |
| `README.md` | Docs | 19 |

---

### Task 1: New repo with the unchanged modules

**Files:**
- Create: `c:\dev\hobby\swedish-app\` as a git repo on branch `initial-app`
- Copy unchanged from turkish-app: `js/grammar.js`, `js/photo.js`, `js/swipe.js`, `js/update.js`, `tools/serve.mjs`, `tests/grammar.test.js`, `tests/photo.test.js`, `tests/swipe.test.js`, `tests/update.test.js`
- Create: `package.json`, `.gitignore`
- Commit: `docs/superpowers/specs/2026-11-22-swedish-app-design.md`, `docs/superpowers/plans/2026-11-22-swedish-app.md`

**Interfaces:**
- Produces: `attach(word, suffix) -> string`, `capTr(s) -> string`, `stemOf(word) -> string` from `js/grammar.js` (unchanged, documented in its header).

- [ ] **Step 1:** `git init -b main c:/dev/hobby/swedish-app`, then `git -C c:/dev/hobby/swedish-app checkout -b initial-app` (two calls).
- [ ] **Step 2:** Create `js/`, `tests/` and `tools/` with `mkdir -p`, then copy the nine files listed above with `cp` (one `cp` per target folder, several sources each).
- [ ] **Step 3:** Write `package.json`: name `swedish-app`, `"private": true`, `"type": "module"`, description "Learn everyday Swedish patterns and words, explained in Turkish. Home-screen web app for iPhone.", and scripts `test: node --test tests/`, `rank: node tools/rank-words.mjs`, `serve: node tools/serve.mjs`, `sample: node tools/sample.mjs`. Write `.gitignore` with `node_modules/` and `*.txt` (the frequency list is downloaded, not committed).
- [ ] **Step 4:** Run `node --test c:/dev/hobby/swedish-app/tests/`. Expected: all copied tests pass.
- [ ] **Step 5:** Commit everything: `chore: start the Swedish app from the Turkish app's engine and helpers`.

---

### Task 2: Turkish app cleans up only its own caches (turkish-app repo)

**Files:**
- Modify: `c:\dev\hobby\turkish-app\sw.js:4` (`CACHE`) and `:39-46` (activate)
- Test: `c:\dev\hobby\turkish-app\tests\sw.test.js`

- [ ] **Step 1:** `git -C c:/dev/hobby/turkish-app checkout -b share-origin`.
- [ ] **Step 2: Write the failing test** `activate deletes only this app's old caches` in `tests/sw.test.js`. Extend the existing harness so `caches.keys()` resolves to `['turkish-v10', 'swedish-v1', 'turkish-v11', 'other']`, `caches.delete(k)` records `k`, and `self.clients.claim` exists. Run the `activate` handler and await `waitUntil`.

```js
assert.deepEqual(deleted.sort(), ['turkish-v10']);
```

- [ ] **Step 3:** Run `node --test c:/dev/hobby/turkish-app/tests/sw.test.js`. Expected: FAIL (it also deletes `swedish-v1` and `other`).
- [ ] **Step 4:** In `sw.js`, set `CACHE = 'turkish-v11'` and filter with `k.startsWith('turkish-') && k !== CACHE`. Add a one-line comment: other apps on the same github.io origin keep their caches.
- [ ] **Step 5:** Run `node --test c:/dev/hobby/turkish-app/tests/`. Expected: all pass.
- [ ] **Step 6:** Commit in turkish-app: `fix: clean up only the Turkish app's own caches, so apps can share the origin`.

---

### Task 3: Swedish form engine

**Files:**
- Create: `js/svenska.js`
- Test: `tests/svenska.test.js`

**Interfaces:**
- Produces:
  - `svForm(word, form = '') -> string`, where `form` is one of `''` (as written), `en` (with article, bare for `m` or `prop`), `def`, `pl`, `pld`, `at`, `to`, `from`, `inf`, `pres`, `past`, `sup`, `imp`, `t`, `a`, `komp`, `superl`
  - `svAgree(word, helper) -> string`, where `helper` is one of `art` (en/ett), `ingen` (ingen/inget), `min` (min/mitt), `din` (din/ditt), `den` (den/det), `denhar` (den här / det här), or `adj:<base>` (the base or t-form of a fixed adjective, by the word's gender)
  - `formsLine(word) -> string`
  - `capSv(s) -> string`
- Word fields read, as documented in the header comment:
  - all words: `sv`, `type`
  - nouns: `g` (`'en' | 'ett'`), `m` (mass noun), `prop` (proper noun: every form is `sv`, no article), `prep` (`'i' | 'på'`, default `'i'`); overrides `def`, `pl`, `pld`, `at`, `to`, `from`
  - verbs: `vg` (`1 | 2 | 3`) or `vf: [present, past, supine]`, plus an `imp` override
  - adjectives: overrides `t`, `a`, `komp: [comparative, superlative]`
  - Particle verbs (`tycka om`) inflect the first word only.

Rules (the header comment lists them):
- **Nouns:**
  - definite singular: en-words add `n` after a vowel or an unstressed `-el/-er/-en`, else `en`; ett-words add `t` after a vowel, else `et`
  - plural: en-words ending in `-a` → `-or`, `-e` → `-ar`, `-el` → `-lar`, `-are` → unchanged, `-ion/-het/-tet/-ist/-ör` → `+er`, other vowels → `+r`, else `+ar`; ett-words ending in a vowel → `+n`, else unchanged
  - definite plural: from the plural, `-r` → `+na`; an en-word plural in `-are` → `-arna`; `-n` → `+a`; an unchanged ett plural → `+en`
- **Verbs:**
  - group 1: `+r`, `+de`, `+t`, imperative = infinitive
  - group 2: the stem drops the final `-a`. Present is stem + `er` (only stem after `r`). Past is `+de`, or `+te` after k, p, s, t, x; a stem ending in consonant + `d` takes only `e`, and a double consonant becomes single before `d`/`t`. Supine is `+t`; stem `…d` → `…t`. Imperative = stem.
  - group 3: `+r`, `+dde`, `+tt`, imperative = infinitive
  - `vf` verbs: imperative = infinitive minus a final `a` when it is longer than 2 letters
- **Adjectives:** t-form: vowel + `d` → `tt`; consonant + `d` → `t`; already ending in `t` → unchanged; a final stressed vowel → `+tt`; else `+t`. a-form: a final `a` → unchanged; unstressed `-el/-er/-en` drop the `e`; else `+a`. Comparative and superlative: `+are` / `+ast`.

- [ ] **Step 1: Write the failing tests** in `tests/svenska.test.js` as a table, one `test()` per row group:

| word | form → expected |
| --- | --- |
| `{sv:'bil',type:'noun',g:'en'}` | en `en bil`, def `bilen`, pl `bilar`, pld `bilarna` |
| `{sv:'flicka',…g:'en'}` | `en flicka`, `flickan`, `flickor`, `flickorna` |
| `{sv:'pojke',…g:'en'}` | `pojken`, `pojkar`, `pojkarna` |
| `{sv:'nyckel',…g:'en'}` | `nyckeln`, `nycklar`, `nycklarna` |
| `{sv:'lärare',…g:'en'}` | `läraren`, `lärare`, `lärarna` |
| `{sv:'station',…g:'en'}` | `stationen`, `stationer`, `stationerna` |
| `{sv:'tidning',…g:'en'}` | `tidningen`, `tidningar`, `tidningarna` |
| `{sv:'sko',…g:'en'}` | `skon`, `skor`, `skorna` |
| `{sv:'hus',…g:'ett'}` | `ett hus`, `huset`, `hus`, `husen` |
| `{sv:'äpple',…g:'ett'}` | `äpplet`, `äpplen`, `äpplena` |
| `{sv:'barn',…g:'ett'}` | `barnet`, `barn`, `barnen` |
| `{sv:'kaffe',…g:'ett',m:1}` | en `kaffe`, def `kaffet` |
| `{sv:'vatten',…g:'ett',m:1,def:'vattnet'}` | en `vatten`, def `vattnet` |
| `{sv:'man',…g:'en',def:'mannen',pl:'män',pld:'männen'}` | `mannen`, `män`, `männen` |
| `{sv:'stad',…g:'en',pl:'städer'}` | pld `städerna` |
| `{sv:'strand',…g:'en',pl:'stränder',prep:'på'}` | at `på stranden`, to `till stranden`, from `från stranden` |
| `{sv:'kök',…g:'ett'}` | at `i köket` |
| `{sv:'hem',…g:'ett',at:'hemma',to:'hem',from:'hemifrån'}` | at `hemma`, to `hem`, from `hemifrån` |
| `{sv:'Turkiet',…prop:1}` | en `Turkiet`, def `Turkiet`, at `i Turkiet`, to `till Turkiet` |
| `{sv:'tala',type:'verb',vg:1}` | pres `talar`, past `talade`, sup `talat`, imp `tala`, inf `tala` |
| `{sv:'stänga',…vg:2}` | `stänger`, `stängde`, `stängt`, `stäng` |
| `{sv:'köpa',…vg:2}` | `köper`, `köpte`, `köpt`, `köp` |
| `{sv:'läsa',…vg:2}` | `läser`, `läste`, `läst`, `läs` |
| `{sv:'höra',…vg:2}` | `hör`, `hörde`, `hört`, `hör` |
| `{sv:'använda',…vg:2}` | `använder`, `använde`, `använt`, `använd` |
| `{sv:'känna',…vg:2}` | `känner`, `kände`, `känt`, `känn` |
| `{sv:'möta',…vg:2}` | `möter`, `mötte`, `mött`, `möt` |
| `{sv:'bo',…vg:3}` | `bor`, `bodde`, `bott`, `bo` |
| `{sv:'skriva',…vf:['skriver','skrev','skrivit']}` | `skriver`, `skrev`, `skrivit`, imp `skriv` |
| `{sv:'vara',…vf:['är','var','varit']}` | imp `var` |
| `{sv:'gå',…vf:['går','gick','gått']}` | imp `gå` |
| `{sv:'tycka om',…vg:2}` | `tycker om`, `tyckte om`, `tyckt om`, `tyck om` |
| `{sv:'stor',type:'adj',komp:['större','störst']}` | t `stort`, a `stora`, komp `större`, superl `störst` |
| `{sv:'röd',…}` | `rött`, `röda` |
| `{sv:'glad',…}` | `glatt`, `glada` |
| `{sv:'ny',…}` | `nytt`, `nya` |
| `{sv:'blå',…,a:'blå'}` | `blått`, `blå` |
| `{sv:'billig',…}` | `billigt`, `billiga`, komp `billigare`, superl `billigast` |
| `{sv:'vacker',…}` | `vackert`, `vackra` |
| `{sv:'svart',…}` / `{sv:'trött',…}` | `svart`/`svarta`, `trött`/`trötta` |
| `{sv:'bra',…}` | `bra`, `bra` |
| `{sv:'liten',…,t:'litet',a:'små'}` | `litet`, `små` |

Plus:
- `svAgree`: bil → art `en`, ingen `ingen`, min `min`, din `din`, den `den`, denhar `den här`, `adj:stor` → `stor`; hus → `ett`, `inget`, `mitt`, `ditt`, `det`, `det här`, `stort`.
- `formsLine`: bil → `en bil · bilen · bilar · bilarna`; vatten (m) → `vatten · vattnet`; tala → `talar · talade · har talat`; stor → `stor · stort · stora`; `{sv:'hej',type:'phrase'}` → `''`.
- `capSv('åka')` → `Åka`.

- [ ] **Step 2:** Run `node --test tests/svenska.test.js`. Expected: FAIL (module not found).
- [ ] **Step 3:** Implement `js/svenska.js` with the four exports and the rules above.
- [ ] **Step 4:** Run `node --test tests/`. Expected: all pass.
- [ ] **Step 5:** Commit: `feat: Swedish form engine for nouns, verbs and adjectives`.

---

### Task 4: Pronunciation hints in Turkish letters

**Files:**
- Create: `js/uttal.js`
- Test: `tests/uttal.test.js`

**Interfaces:**
- Produces:
  - `uttal(text: string, extra: Record<string,string> = {}) -> string`: lower-case hint for any Swedish text. Punctuation and spaces are kept. A single-word lookup in `extra`, then in the module's `EXCEPTIONS`, wins over the rules.
  - `hintOf(word, extra = {}) -> string`: `word.ut || uttal(word.sv, extra)`

Rules (in the header comment):
- **Word start:** `g`, `k` or `sk` before e/i/y/ä/ö → `y`, `ş`, `ş`; `dj`/`gj`/`hj`/`lj` → `y`.
- **Anywhere:** `sch`/`skj`/`stj`/`sj`/`ch` → `ş`; `tj`/`kj` → `ş`; `tion` → `şu:n` (and the first vowel is not lengthened); `rs` → `ş`; `j` → `y`; `ck` → `k`; `x` → `ks`; `z` → `s`; `w` → `v`; `qu` → `kv`; `q` → `k`; `ph` → `f`; `th` → `t`; `c` → `s` before e/i/y, else `k`.
- **Word end:** `ig` → `i`, `igt` → `it`.
- **Vowels:** a→a, e→e, i→i, å→o, ä→e, ö→ö, y→ü. Long `o` → `u`, short `o` → `o`. Long `u` → `ü`, short `u` → `ö`.
- **Length (first vowel only):**
  - long, written `:`, before one consonant sound or at the word end
  - short before two or more consonant letters (`ck`, `ng`, `x` count as two)
  - short before `j`
  - short before a single final `m` or `n`
- Double consonants are written once.
- `EXCEPTIONS`: `de→dom, dem→dom, mig→mey, dig→dey, sig→sey, och→ok, det→de:, är→e:r, hon→hun, ost→ust, sverige→sverye, gärna→ye:rna, människa→menişa, barn→ba:rn, bord→bu:rd, i→i, några→no:gra`. Later tasks add more when content shows a wrong hint.

- [ ] **Step 1: Write the failing tests.**
  - A table test, where each word → `uttal(word)`:
    - `hej hey`, `nej ney`, `tack tak`, `bil bi:l`, `hus hü:s`, `buss bös`, `hund hönd`, `sol su:l`
    - `komma koma`, `glas gla:s`, `glass glas`, `dag da:g`, `år o:r`, `äta e:ta`, `öl ö:l`
    - `sju şü:`, `kyrka şürka`, `göra yö:ra`, `gå go:`, `ge ye:`, `kök şö:k`, `tjej şey`, `tjugo şü:gu`
    - `sked şe:d`, `skola sku:la`, `station staşu:n`, `djur yü:r`, `hjälp yelp`, `ljus yü:s`, `jobb yob`
    - `kaffe kafe`, `mjölk myölk`, `fika fi:ka`, `rolig ru:li`, `roligt ru:lit`, `billig bili`, `svenska svenska`
    - `man man`, `han han`, `vem vem`, `rum röm`, `nu nü:`, `ja ya:`, `jag ya:g`, `du dü:`
    - `vatten vaten`, `äpple eple`, `pojke poyke`, `flicka flika`, `bröd brö:d`, `kille şile`, `kvinna kvina`
    - `taxi taksi`, `med me:d`, `vill vil`, `ha ha:`, `inte inte`, `mår mo:r`, `hur hü:r`
    - and every `EXCEPTIONS` entry
  - Sentences:
    - `uttal('Jag vill ha kaffe.') === 'ya:g vil ha: kafe.'`
    - `uttal('Hej! Hur mår du?') === 'hey! hü:r mo:r dü:?'`
    - `uttal('Det är min bil.') === 'de: e:r min bi:l.'`
  - Overrides and case:
    - `uttal('fin', { fin: 'fi:n' }) === 'fi:n'`
    - `uttal('Sverige') === 'sverye'`
    - `hintOf({ sv: 'tycka om' }) === 'tüka om'`
    - `hintOf({ sv: 'cykel', ut: 'sükel' }) === 'sükel'`
- [ ] **Step 2:** Run `node --test tests/uttal.test.js`. Expected: FAIL (module not found).
- [ ] **Step 3:** Implement `js/uttal.js`.
- [ ] **Step 4:** Run `node --test tests/`. Expected: all pass.
- [ ] **Step 5:** Commit: `feat: Swedish pronunciation hints in Turkish letters`.

---

### Task 5: Filling `[sv, tr]` templates and building card examples

**Files:**
- Create: `js/combine.js`, `js/examples.js` (ported from turkish-app)
- Test: `tests/combine.test.js`, `tests/examples.test.js` (ported)

**Interfaces:**
- Consumes: `svForm`, `svAgree`, `capSv` (Task 3); `attach`, `capTr` (Task 1).
- Produces:
  - `fill(tpl: { sv, tr }, word) -> { sv, tr, svParts, trParts }`, where parts are `[{ text, hl }]`
  - `fits(slot, word) -> boolean` (unchanged)
  - `slotOf`, `wordPatternPairs`, `patternExamples`, `wordExamples` with the Turkish app's signatures. Rows are `{ sv, tr }`, or `fill()` results. Word-card rows carry `from: \`${v.sv} · ${p.tr}\``.

Template notation (in `combine.js`'s header):
- **Swedish string:** `{w}` / `{w:FORM}` (Task 3 forms, highlighted) and `{art} {ingen} {min} {din} {den} {denhar} {adj:<base>}` (agreement, not highlighted).
- **Turkish string:** `{w}` (`word.tr`), `{w:}` (bare stem), `{w:SUFFIX}` (`attach`), and `{bir}` ("bir " unless `word.m` or `word.prop`; not highlighted).
- Capitalise the first non-empty part (`capSv` and `capTr`). An empty helper must not leave the next word lower-case.
- For `word.prop`, a Turkish suffix is joined with an apostrophe (*Türkiye'ye*, *İstanbul'dayım*).

- [ ] **Step 1: Write the failing tests** in `tests/combine.test.js`, each `fill` result asserted as `[r.sv, r.tr]`:
  - bil `{sv:'bil',tr:'araba',type:'noun',g:'en'}` with `['Jag vill ha {w:en}.', '{bir}{w} istiyorum.']` → `['Jag vill ha en bil.', 'Bir araba istiyorum.']`
  - vatten `{sv:'vatten',tr:'su',type:'noun',g:'ett',m:1}`, same template → `['Jag vill ha vatten.', 'Su istiyorum.']`
  - strand `{sv:'strand',tr:'plaj',type:'noun',g:'en',prep:'på',pl:'stränder'}` with `['Jag är {w:at}.', '{w:DA(y)Im}.']` → `['Jag är på stranden.', 'Plajdayım.']`
  - hem `{sv:'hem',tr:'ev',type:'noun',g:'ett',at:'hemma'}`, same → `['Jag är hemma.', 'Evdeyim.']`
  - Turkiet `{sv:'Turkiet',tr:'Türkiye',type:'noun',prop:1}` with `['Jag åker {w:to}.', '{w:(y)A} gidiyorum.']` → `['Jag åker till Turkiet.', "Türkiye'ye gidiyorum."]`
  - dricka `{sv:'dricka',tr:'içmek',type:'verb',vf:['dricker','drack','druckit']}` with `['{w:imp}!', '{w:}!']` → `['Drick!', 'İç!']`, and with `['Jag vill {w}.', '{w:mAk} istiyorum.']` → `['Jag vill dricka.', 'İçmek istiyorum.']`
  - hus `{sv:'hus',tr:'ev',type:'noun',g:'ett'}` with `['Det här är {min} {w}.', 'Bu benim {w:(I)m}.']` → `['Det här är mitt hus.', 'Bu benim evim.']`. `svParts` highlights only `hus` (`mitt` has `hl: false`).
  - `['Det är {art} {adj:stor} {w}.', 'Bu büyük {bir}{w}.']` → hus: `['Det är ett stort hus.', 'Bu büyük bir ev.']`; bil: `['Det är en stor bil.', 'Bu büyük bir araba.']`
  - A word used twice is filled twice. The `fits` tests from turkish-app are ported unchanged.
- [ ] **Step 2:** Port `tests/examples.test.js` with `tr`→`sv` and `en`→`tr` in fixtures and expectations, and `from` = `"${v.sv} · ${p.tr}"`. Keep every test name and behaviour.
- [ ] **Step 3:** Run `node --test tests/combine.test.js tests/examples.test.js`. Expected: FAIL (modules not found).
- [ ] **Step 4:** Implement `js/combine.js`. Port `js/examples.js` with the field renames only.
- [ ] **Step 5:** Run `node --test tests/`. Expected: all pass.
- [ ] **Step 6:** Commit: `feat: fill Swedish and Turkish sides of each example`.

---

### Task 6: All visible text in Turkish (`js/metin.js`) and the no-English check

**Files:**
- Create: `js/metin.js`, `tests/english.js` (helper, not a test file), `tests/turkce.test.js`

**Interfaces:**
- Produces: `export const T` (the object below), which every view and `app.js` imports.
- Produces: `englishWords(text) -> string[]` in `tests/english.js`. It splits on `/[^\p{L}]+/u`, lower-cases, and returns the tokens found in `ENGLISH`.

`ENGLISH` (chosen to avoid Turkish and Swedish look-alikes such as *her, can, on, at, an, by, all, not, start, ask, say*):

```
the you your are of with please learned settings search clear translate examples words patterns show try again
error listen close swap delete loading thinking saved offline connection backup restore scan photo sentence
structure provider minute this that yes what how where when why here there my me we they will would should could
have has had does did been got going come make see look want need know think tell give take use find work call
feel leave mean keep let begin seem help turn might from into about than then them these those their his its our
or but if because until while
```

`T` copy is exact. Structure and strings:

```js
export const T = {
  tabs: { words: 'Kelimeler', patterns: 'Kalıplar' },
  status: { all: 'Tümü', todo: 'Öğrenilecek', learned: 'Öğrenilen' },
  sorts: {
    patterns: [['common', 'En faydalı'], ['sv', 'A–Ö İsveççe'], ['todo', 'Önce öğrenilecekler'], ['learned', 'Önce öğrenilenler']],
    words: [['topic', 'Konuya göre'], ['common', 'En yaygın'], ['tr', 'A–Z Türkçe'], ['sv', 'A–Ö İsveççe'], ['todo', 'Önce öğrenilecekler'], ['learned', 'Önce öğrenilenler']],
  },
  all: 'Tümü',
  aria: { wordType: 'Kelime türü', patternGroup: 'Kalıp grubu', details: 'Ayrıntılar', listen: 'Dinle', close: 'Kapat', back: 'Geri',
    translate: 'Çevir', alphabet: 'Alfabe', swap: 'Dilleri değiştir', clearText: 'Metni sil', deleteScan: 'Taramayı sil', learnedSuffix: ', öğrenildi' },
  clear: (n) => `Temizle (${n})`,
  progress: (n, total) => `${n} / ${total} öğrenildi`,
  settingsTitle: 'Ayarlar',
  empty: 'Burada bir şey yok. Başka bir filtre veya arama dene.',
  learn: { off: 'Öğrendim', on: '✓ Öğrenildi', toastOn: '✓ Öğrenildi', toastOff: 'Öğrenilmedi' },
  sections: { selected: 'Seçiminden', notUsed: 'Burada kullanılmadı: ', examples: 'Örnekler', ai: 'Yapay zekâdan' },
  ai: {
    more: '✨ Daha fazla örnek', setup: "✨ Ücretsiz bir yapay zekâ ile daha fazla örnek (Ayarlar'dan kur)", thinking: 'Düşünüyor…',
    saved: 'Bu telefona kaydedildi, internetsiz de çalışır.', failed: 'Bir şeyler ters gitti. Tekrar dene.',
    parseExamples: 'Yapay zekânın cevabından örnekler okunamadı. Tekrar dene.',
    parsePage: 'Yapay zekânın cevabından metin okunamadı. Tekrar dene.',
    parseExplanation: 'Yapay zekânın cevabından açıklama okunamadı. Tekrar dene.',
    limit: "Günlük ücretsiz sınır doldu. Daha sonra tekrar dene veya Ayarlar'dan başka bir sağlayıcı seç.",
    scanLimit: 'Günlük ücretsiz sınır doldu. Yarın tekrar dene.',
    minute: 'Kısa sürede çok fazla istek gönderildi. Bir dakika bekleyip tekrar dene.',
    code: (status, detail) => `hata ${status}${detail ? `: ${detail}` : ''}`,
    badKey: (code) => `Yapay zekâ servisi anahtarı veya modeli kabul etmedi (${code}). Ayarlar'ı kontrol et.`,
    service: (code) => `Yapay zekâ servisinde bir sorun var (${code}). Daha sonra tekrar dene.`,
    timeout: 'Yapay zekâ cevap vermekte çok gecikti. Tekrar dene.',
    offline: 'İnternet bağlantın yok. Hazır örnekler yine de çalışır.',
    unreachable: 'Yapay zekâ servisine ulaşılamadı.',
    needGemini: "Fotoğraf taramak için Ayarlar'dan ücretsiz bir Gemini anahtarı ekle.",
    needKey: "Daha fazla örnek almak için Ayarlar'dan ücretsiz bir yapay zekâ anahtarı ekle.",
  },
  providers: {
    gemini: { label: 'Google Gemini (önerilen)', howTo: "Google AI Studio'da bir Google hesabıyla giriş yap ve bir API anahtarı oluştur. Kredi kartı gerekmez." },
    groq: { label: 'Groq', howTo: "console.groq.com'da ücretsiz bir hesap aç ve bir API anahtarı oluştur. Kredi kartı gerekmez." },
    mistral: { label: 'Mistral', howTo: "console.mistral.ai'de ücretsiz bir hesap aç (ücretsiz plan) ve bir API anahtarı oluştur." },
    openrouter: { label: 'OpenRouter (ücretsiz modeller)', howTo: 'openrouter.ai\'de ücretsiz bir hesap aç ve bir anahtar oluştur. ":free" ile biten modeller ücretsizdir.' },
  },
  sound: 'Ses yok mu? Sessiz modu kapat',
  scans: {
    title: 'Taramalar', sentence: 'Cümle', sent: "Fotoğraflar metni okumak için Google Gemini'ye gönderilir.", take: 'Fotoğraf çek veya seç',
    noKey: "Fotoğraf taramak için Ayarlar'dan ücretsiz bir Gemini anahtarı ekle.", openSettings: 'Ayarları aç', reading: 'Sayfa okunuyor…',
    none: 'Bu fotoğrafta İsveççe metin bulunamadı.', retry: 'Tekrar dene', tap: 'Dil bilgisini ve kelimelerini görmek için bir cümleye dokun.',
    structure: 'Yapı', words: 'Kelimeler', explaining: 'Açıklanıyor…', confirmDelete: 'Bu tarama silinsin mi?',
    badPhoto: 'Bu fotoğraf kullanılamadı. Başka bir tane dene.',
  },
  translator: {
    title: 'Çevir', names: { sv: 'İsveççe', tr: 'Türkçe' }, placeholder: (name) => `${name} yaz`, result: 'Çeviri',
    link: "Google Çeviri'de aç", offline: 'İnternet bağlantısı yok. Çeviri için internet gerekir.',
    failed: "Şu an çevrilemedi. Tekrar dene veya aşağıdan Google Çeviri'yi aç.",
  },
  alphabet: { title: 'İsveç alfabesi', combos: 'Zor sesler', long: '":" uzun sesi gösterir: a: = uzun a.' },
  settings: {
    blocks: 'Bloklar', showSv: 'Bloklarda İsveççeyi göster',
    showSvHelp: "Kendini sınamak için kapalı tut: Türkçeyi oku, İsveççesini söyle, sonra kontrol etmek için ⓘ'ye dokun.",
    aiTitle: 'Yapay zekâ ile daha fazla örnek',
    aiHelp: 'Hazır örnekler her zaman, internetsiz de çalışır. Öğrendiğin kelimelerle yeni cümleler almak için ücretsiz bir yapay zekâ anahtarı ekle. Anahtar yalnızca bu telefonda saklanır.',
    aiScans: 'Fotoğraf taramaları (arama kutusunun yanındaki kamera düğmesi) her zaman Gemini anahtarını kullanır.',
    provider: 'Sağlayıcı', off: 'Kapalı', getKey: 'Anahtar al ↗', key: 'API anahtarı', model: 'Model',
    modelHelp: 'Varsayılanı kullanmak için modeli boş bırak. Varsayılan çalışmazsa sağlayıcının ücretsiz model listesine bak.',
    test: 'Dene', testing: 'Deneniyor…', works: (sv, tr) => `Çalışıyor: ${sv} = ${tr}`,
    pron: 'Okunuş', showHints: 'Okunuşu göster',
    hintsHelp: 'Her kelimenin ve cümlenin altında Türkçe harflerle nasıl okunduğunu gösterir. ":" uzun sesi gösterir.',
    voice: (name) => `İsveççe ses bulundu: ${name}. Dinlemek için hoparlör simgelerine dokun.`,
    noVoice: "Henüz İsveççe ses bulunamadı. iPhone'da Ayarlar → Erişilebilirlik → Seslendirilen İçerik → Sesler → İsveççe yolundan bir ses ekle.",
    silent: "Ses yok mu? iPhone'da sessiz mod sesi kapatır.", tryIt: 'Dene: Hej! Hur mår du?', trySay: 'Hej! Hur mår du?',
    progress: 'İlerleme',
    progressText: (nP, tP, nW, tW) => `${tP} kalıptan ${nP} tanesi ve ${tW} kelimeden ${nW} tanesi öğrenildi.`,
    backupHelp: "İlerleme bu telefonda saklanır. Arada bir yedek kopyala, örneğin Notlar'a.",
    copy: 'Yedeği kopyala', restore: 'Geri yükle…', reset: 'İlerlemeyi sıfırla',
    pastePlaceholder: "Yedeği buraya yapıştır, sonra tekrar Geri yükle'ye bas",
    copied: 'Yedek kopyalandı. Notlar gibi güvenli bir yere yapıştır.', copyByHand: 'Yukarıdaki metni kopyala ve güvenli bir yerde sakla.',
    pastePrompt: "Yedeği yukarıya yapıştır, sonra tekrar Geri yükle'ye bas.", restored: 'İlerleme geri yüklendi.',
    notBackup: 'Bu, bu uygulamanın yedeğine benzemiyor.', confirmReset: 'Her şey öğrenilmedi olarak işaretlensin mi? Bu geri alınamaz.',
    about: 'Hakkında',
    aboutRanks: 'Kelimeler, büyük bir İsveççe film ve dizi altyazısı koleksiyonunda ne kadar sık geçtiklerine göre sıralanmıştır (FrequencyWords, CC BY-SA 4.0). Kalıplar günlük hayattaki faydasına göre sıralanmıştır.',
    aboutAi: 'İçerik yapay zekâ yardımıyla yazıldı. Hatalar olabilir; önemli bir şeyi anadili İsveççe olan birine sor.',
  },
};
```

- [ ] **Step 1: Write the failing test** `tests/turkce.test.js` → `every visible string in T is free of English`. It walks `T` recursively and checks every string. Each function is called as `fn(...Array.from({ length: fn.length }, () => 3))` and its result checked. Assert `englishWords(all).length === 0`, with the offending words in the message.
- [ ] **Step 2:** Run `node --test tests/turkce.test.js`. Expected: FAIL (module not found).
- [ ] **Step 3:** Write `js/metin.js` and `tests/english.js`.
- [ ] **Step 4:** Run `node --test tests/`. Expected: all pass.
- [ ] **Step 5:** Commit: `feat: Turkish UI text in one place, with a no-English test`.

---

### Task 7: Helpers, storage and the translator

**Files:**
- Create (port from turkish-app): `js/html.js`, `js/store.js`, `js/translate.js`, `js/translateview.js`
- Test (port): `tests/html.test.js` (new), `tests/store.test.js`, `tests/translate.test.js`, `tests/translateview.test.js`

**Interfaces:**
- Consumes: `T` (Task 6), `uttal` (Task 4, passed in by the caller as a function).
- Produces:
  - `html.js`: `esc`, `SPEAKER`, `BUBBLE`, `TRASH` (unchanged); `ABC` (a new SVG icon: an "Aa" glyph drawn with strokes in the bubble's style); `fold(s) -> string`, which lower-cases with `'tr'` and maps `ç ğ ı ö ş ü â î û å ä é` to `c g i o s u a i u a a e`
  - `store.js`: keys `sv.*`; `ui` defaults `{ tab:'words', status:{patterns:'all',words:'all'}, sort:{patterns:'common',words:'topic'}, type:'all', pgroup:'all', showSwedish:false, showHints:true }`; methods `store.backupText() -> string` and `store.parseBackup(text) -> object | null` (the `learned` map only when the JSON has `app === 'swedish'` and an object `learned`)
  - `translate.js`: `other(lang)` swaps `'sv'` ⇄ `'tr'`; `OFFLINE = T.translator.offline`; `FAILED = T.translator.failed`; the rest is unchanged
  - `translateview.js`: `translatorHtml(state, hint = null)` and `resultHtml(state, hint = null)`, where `hint` is `(text) => string` or `null`. Labels come from `T.translator`. The speaker shows on whichever side is Swedish. When the result is Swedish and `hint` is given, a `<p class="hint" lang="tr">` follows the result.

- [ ] **Step 1: Write the failing tests:**
  - `html.test.js`: `fold('Här') === fold('har')`, `fold('ÖL') === 'ol'`, `fold('Işık') === 'isik'`, `fold('İstanbul') === 'istanbul'`, `fold('Åka') === 'aka'`
  - `store.test.js`: port every test with `tl.`→`sv.`, and replace the old showTr test with `Swedish on blocks starts off and hints start on` (with a saved `sv.ui` lacking both keys). Add:
    - `store.parseBackup(store.backupText())` deep-equals `store.learned`
    - `store.parseBackup('{"app":"turkish","learned":{"a":1}}') === null`
    - `store.parseBackup('not json') === null`
    - `store.parseBackup('{"app":"swedish"}') === null`
  - `translate.test.js`: port with Swedish/Turkish: the URL has `sl=sv&tl=tr` or `sl=tr&tl=sv`; the Google link likewise; the messages test asserts `OFFLINE === T.translator.offline` and `FAILED === T.translator.failed`
  - `translateview.test.js`: port the tests (Turkish→Swedish, Swedish→Turkish, escaping, 1000 characters, placeholder/error/result, link). Add `a Swedish result shows its hint, a Turkish one does not`, using `hint = (s) => 'H:' + s`.
- [ ] **Step 2:** Run the four test files. Expected: FAIL (modules not found).
- [ ] **Step 3:** Port the four modules as described.
- [ ] **Step 4:** Run `node --test tests/`. Expected: all pass.
- [ ] **Step 5:** Commit: `feat: Swedish storage, search folding and Swedish ⇄ Turkish translator`.

---

### Task 8: AI prompts and scan screens

**Files:**
- Create (port): `js/ai.js`, `js/scanview.js`
- Test (port): `tests/ai.test.js`, `tests/scanview.test.js`

**Interfaces:**
- Consumes: `T` (Task 6), `esc`, `SPEAKER`, `TRASH` (Task 7).
- Produces:
  - `ai.js`:
    - `PROVIDERS` with the same ids, models, urls and keyUrls; `label` and `howTo` come from `T.providers`
    - `AIError`, `generate`, `readPage`, `explainSentence`
    - `parseExamples(text) -> [{ sv, tr }]`, `parsePage`
    - `parseExplanation(text) -> { tr, structure, words: [{ w, base, tr, parts }] }`
    - `patternPrompt({ variant, patternTr, words, existing = [], n = 4 })`
    - `wordPrompt({ word, meaning, type, patterns, existing = [], n = 4 })`, where `type` is the word's type id, mapped inside to an English word for the prompt
  - `scanview.js`: the same exports. `scanDate` uses `'tr-TR'`. `sentenceHtml(sentence, data, status, hint = null)` adds `<p class="hint">` under the sentence when `hint` is given, and reads `data.tr` and `w.tr`. All text comes from `T.scans`.

Prompts (English, sent to the model only):
- Examples: "You help a Turkish speaker learn everyday spoken Swedish." The `RULES` line asks for at most 8 words, natural casual spoken Swedish, common vocabulary, correct en/ett, word order and verb forms, and a natural Turkish translation. Reply with JSON only: `{"examples":[{"sv":"Swedish sentence","tr":"Turkish translation"}]}`.
- Page: as in the Turkish app, but for Swedish text (keep å ä ö é). "If there is no Swedish text, reply with an empty list."
- Explain: "You help a Turkish speaker understand Swedish grammar. Write every explanation in Turkish."
  - `tr`: a natural Turkish translation
  - `structure`: 2–5 short plain sentences **in Turkish** (subject, verb and tense, word order, verb-second, where *inte* goes, any clause or connector)
  - `words`: every word with `w`, `base` (verbs as the infinitive; nouns as the indefinite singular with en/ett, for example "en bil"), `tr` (its Turkish meaning here) and `parts` (in Turkish, for example "bil + -en (belirli hâli)")
  - JSON only, in that shape

- [ ] **Step 1: Port the tests with these changes:**
  - `parseExamples` fixtures use `sv` and `tr`
  - `parseExplanation` reads `tr` and `words[].tr`
  - error-message assertions compare with `T.ai.*` (`badKey(T.ai.code(400, msg))`, `scanLimit`, `minute`)
  - `readPage` and `explainSentence` request assertions are unchanged (model `gemini-flash-lite-latest`, key header)
  - `scanview.test.js`: Turkish copy from `T.scans`. Add `a sentence shows its hint when hint is given`.
- [ ] **Step 2:** Run both test files. Expected: FAIL (modules not found).
- [ ] **Step 3:** Port `js/ai.js` and `js/scanview.js`.
- [ ] **Step 4:** Run `node --test tests/`. Expected: all pass.
- [ ] **Step 5:** Commit: `feat: AI examples and scans for Swedish, answered in Turkish`.

---

### Task 9: Alphabet content and window

**Files:**
- Create: `data/alfabe.js`, `js/alfabeview.js`
- Test: `tests/alfabe.test.js`

**Interfaces:**
- Consumes: `esc`, `SPEAKER` (Task 7), `T.alphabet` (Task 6).
- Produces:
  - `LETTERS: [{ ch, name, sound, ex: [sv, tr], ut? }]` in order A–Ö (29 items). `name` is the letter name in hint form; `sound` is one Turkish sentence; `ut` is an optional hint override for the example.
  - `COMBOS: [{ title, sound, ex: [[sv, tr], …] }]`
  - `alfabeHtml(letters, combos, hint) -> string`. It contains:
    - an `.s-top` header with the title and a ✕ (`data-act="close"`)
    - a `.note` with `T.alphabet.long`
    - one `.abc-row` per letter: a letter button with `data-say="<ch>"`, the name, the sound, and the example with `[hint]`, its Turkish meaning and a speaker with `data-say="<example>"`
    - an `h3` with `T.alphabet.combos`
    - one `.abc-combo` per combo, each example with its hint and a speaker
- Letter names: `A a:, B be:, C se:, D de:, E e:, F ef, G ge:, H ho:, I i:, J yi:, K ko:, L el, M em, N en, O u:, P pe:, Q kü:, R er, S es, T te:, U ü:, V ve:, W dubbelve:, X eks, Y ü:, Z se:ta, Å o:, Ä e:, Ö ö:`.
- `COMBOS`, at least these ten (the builder writes the Turkish explanations and picks common example words):
  - the sj sound (sj, skj, stj, sk + e/i/y/ä/ö, -tion)
  - the tj sound (tj, kj, k + e/i/y/ä/ö)
  - soft g (g + e/i/y/ä/ö → y)
  - j, dj, gj, hj, lj → y
  - rs → ş, and rt, rd, rn
  - ng and gn
  - long and short vowels (*glas / glass*)
  - o often sounds like u
  - u is ü when long and ö when short
  - stress usually on the first syllable

- [ ] **Step 1: Write the failing tests:**
  - `LETTERS.map((l) => l.ch).join('') === 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ'`
  - every letter has a non-empty `name`, `sound` and a two-string `ex`
  - names: J is `yi:`, Å is `o:`, Ä is `e:`, Ö is `ö:`
  - `COMBOS.length >= 10`, each with a title, sound and at least one example
  - `alfabeHtml(LETTERS, COMBOS, (s) => 'H:' + s)` contains 29 `.abc-row`, contains `T.alphabet.combos`, shows `[H:dag]` when the A example is *dag*, and escapes `<`
  - `englishWords` finds nothing in the sounds, titles and Turkish meanings
- [ ] **Step 2:** Run `node --test tests/alfabe.test.js`. Expected: FAIL.
- [ ] **Step 3:** Write `data/alfabe.js` and `js/alfabeview.js`.
- [ ] **Step 4:** Run `node --test tests/`. Expected: all pass.
- [ ] **Step 5:** Commit: `feat: Swedish alphabet window content`.

---

### Task 10: Word data structure, content tests and the first seven topics

**Files:**
- Create: `data/words.js`, `tests/content.test.js`
- Create: `data/ranks.js` as a placeholder, `export const RANKS = {};`, with a comment saying that `tools/rank-words.mjs` (Task 18) generates it. `app.js` already treats a missing rank as 0.

**Interfaces:**
- Consumes: `svForm`, `formsLine` (Task 3), `fill`, `fits` (Task 5), `uttal`, `hintOf` (Task 4), `englishWords` (Task 6), `attach` (Task 1).
- Produces:
  - `CATEGORIES` (20, in order): `phrases İfadeler 💬, basics Küçük kelimeler 🔤, actions Günlük eylemler 🏃, people İnsanlar 👪, food Yiyecek 🍞, drinks İçecek ☕, home Ev 🏠, town Şehirde 🏙️, shopping Alışveriş ve para 🛒, travel Seyahat ve ulaşım 🚌, work İş ve okul 💼, body Vücut ve sağlık 🩺, time Zaman 🕐, numbers Sayılar 🔢, describe Tanımlama 🎨, feelings Duygular 🙂, nature Hava ve doğa 🌤️, animals Hayvanlar 🐾, clothes Giyim 👕, hobbies Hobiler ve spor ⚽`
  - `TYPES`: `noun {label:'İsimler', one:'isim'}`, `verb {'Fiiller','fiil'}`, `adj {'Sıfatlar','sıfat'}`, `adv {'Zarflar','zarf'}`, `phrase {'İfadeler','ifade'}`, `other {'Küçük kelimeler','küçük kelime'}`
  - `WORDS`, built with `G(cat, type, kind, rows)` from rows `[sv, tr, options]`, id `${cat}:${sv}`
  - The header comment documents every field (Task 3's Swedish fields; Turkish `gloss`, `soft`, `h`, `cmp`, `noSoft`; `ut`, `ex: [sv, tr]`, `note` in Turkish, `nc`) and the `kind` list. That list is the Turkish app's list plus `country`. Place-like nouns (`place|room|area`) carry `prep: 'på'` where Swedish uses *på* (default *i*).

**Content rules:**
- `tr` is the single Turkish form the suffix engine inflects; alternatives go in `gloss`.
- Copy the Turkish engine hints (`soft`, `h`, `cmp`, `noSoft`) from turkish-app's `data/words.js` whenever the same Turkish word appears there.
- Reflexive verbs (*känna sig*) and verbs that make odd sentences in every verb pattern get `nc: 1` and an `ex`.
- Add a `ut` override when `hintOf` gives a wrong hint, or an `EXCEPTIONS` entry in `js/uttal.js` for common short words.
- Target counts for this task: phrases 45, basics 90, actions 120, people 45, food 70, drinks 20, home 50 (about 440 words). Favour what comes up when talking with Swedes; include Sweden-specific words where they fit (*fika*, *mellanmål*, *lagom*, *Systembolaget*…).

- [ ] **Step 1: Write the failing tests** in `tests/content.test.js`. These cover all words, so they keep guarding Tasks 14–15:
  - `word ids are unique`
  - `every word has sv, tr, a known type and topic`
  - `nouns have g (en/ett) unless they are proper nouns`
  - `verbs have vg 1/2/3 or a three-form vf`
  - `every Turkish meaning can take suffixes`: no `/`, `,` or `(` in `tr`, and a verb's `tr` matches `/m[ae]k$/`
  - `every form of every word is a real string`: for nouns `en def pl pld`, verbs `pres past sup imp`, adjectives `t a`; no `undefined`, no empty string, and `formsLine` non-empty for nouns, verbs and adjectives
  - `Swedish spellings are unique per topic list, except known pairs` (an `ALLOWED_DUPES` set)
  - `Turkish text has no English`: `englishWords` on `tr`, `gloss`, `note`, `ex[1]` and the `CATEGORIES`/`TYPES` labels is empty
  - `every hint is plain text`: `hintOf(w)` is non-empty and has no `undefined` for every word
- [ ] **Step 2:** Run `node --test tests/content.test.js`. Expected: FAIL (module not found).
- [ ] **Step 3:** Write `data/words.js` with the header, `CATEGORIES`, `TYPES`, `G`, and the seven topics above.
- [ ] **Step 4:** Run `node --test tests/`. Fix the data (or the engines, when a rule is wrong) until it passes.
- [ ] **Step 5:** Commit: `feat: word list structure and the first seven topics`.

---

### Task 11: Patterns, structure and the Everyday group

**Files:**
- Create: `data/patterns.js`
- Create (port): `tools/sample.mjs`, printing `sv | tr | hint` for each generated sentence (`fill` and `uttal`), with the Turkish app's arguments (`[wordsPerTemplate] [patternId,…]`)
- Modify: `tests/content.test.js`

**Interfaces:**
- Produces:
  - `GROUPS = { everyday: 'Günlük', verbs: 'Fiiller ve zamanlar', connectors: 'Bağlaçlar', order: 'Cümle düzeni' }`
  - `PATTERNS: [{ id, group, sv, tr, slot?, variants: [{ sv, tr, note?, ex: [[sv, tr]], t: [[sv, tr]], slot? }] }]`
  - `ORDER: string[]`, with `PATTERNS` sorted by it at the end of the file (as in turkish-app)
  - The `FOOD`, `NOUN_THINGS` and `PLACES` slot constants as in turkish-app. Slots that use `{w:pl}`, `{w:pld}` or `{art}` must exclude mass nouns, using kinds that hold only countable nouns, or an `nc` on words that would be wrong.

Everyday ids, in this order:
`want, finns, where, price, iam, itis, understand, name, have, need, this, my, goingto, at, isit, thanks, seeyou, clock, howto, looking, from, hurts, by, withwithout, like, think, more, nextlast, howmany, whatcalled` (30)

What each covers (the variants and examples are the builder's; notes in Turkish):
- `want`: *Jag vill ha ___ / Kan jag få ___? / ___, tack / Jag skulle vilja ha ___*
- `finns`: *Finns det ___? / Det finns ___ / Det finns {ingen} ___*
- `where`: *Var är ___? / Var ligger ___? / Var är närmaste ___?*
- `price`: *Hur mycket kostar ___? / Vad kostar ___?*
- `iam`: *Jag är ___ / Är du ___? / Jag är inte ___* (adj base form)
- `itis`: *Det är ___* (t-form) */ Det är väldigt ___ / Det är lite ___ / Så ___!*
- `understand`: *Jag förstår inte / Kan du prata långsammare? / Jag pratar lite svenska* (no templates)
- `name`: *Jag heter ___ / Vad heter du?* (no templates)
- `have`: *Jag har {art} ___ / Har du ___? / Jag har {ingen} ___*
- `need`: *Jag behöver ___ / Behöver du ___?*
- `this`: *den här ___ / det här ___* (`{denhar} {w:def}`)*, den där ___*
- `my`: *{min} ___ / {din} ___ / hans ___ / hennes ___*, with a note on min/mitt/mina
- `goingto`: *Jag ska {w:to} / Jag åker {w:to} / Vi går {w:to}*
- `at`: *Jag är {w:at} / Är du {w:at}? / Vi ses {w:at}*
- `isit`: *Är det ___?* (t-form)
- `thanks`: *Tack för {w:def}* (*maten, hjälpen*)
- `seeyou`: *Vi ses ___* (time words)
- `clock`: *Klockan är ___ / Klockan ___ / halv ___*. The note explains that *halv fyra* = 3:30.
- `howto`: *Hur kommer jag {w:to}? / Är det långt {w:to}?*
- `looking`: *Jag letar efter {art} ___ / Jag hittar inte {min} ___*
- `from`: *Jag kommer {w:from}* (countries, places)
- `hurts`: *Jag har ont i {w:def} / Det gör ont i {w:def}* (body)
- `by`: *Jag åker ___* (*buss*) */ med ___* (vehicles, bare form)
- `withwithout`: *med ___ / utan ___* (ingredients)
- `like`: *Jag gillar ___ / Jag tycker om ___ / Jag älskar ___*
- `think`: *Jag tycker att det är ___ / Det ser ___ ut*
- `more`: *___are* (`{w:komp}`) */ mest ___ / ___ än*
- `nextlast`: *förra ___ / nästa ___ / i ___* (periods)
- `howmany`: *Hur många {w:pl} har du?*
- `whatcalled`: *Vad heter det på svenska? / Hur säger man ___ på svenska? / Vad betyder ___?* (no templates)

- [ ] **Step 1: Add the failing tests** to `tests/content.test.js`:
  - `pattern ids are unique`
  - `ORDER lists every pattern exactly once and PATTERNS follows it`
  - `every pattern has a known group`
  - `every variant has examples, and a slot when it has templates`
  - `every slot fits at least three words`
  - `every template renders cleanly on both sides with every word that fits`: no `{`, `}` or `undefined` in `sv`/`tr`, and no leftover archiphoneme (`/[ADCRI]/` after the first character) in highlighted Turkish parts
  - `mass nouns never fill countable templates`: for every template whose Swedish contains `{w:pl`, `{w:pld}` or `{art}`, no fitting word has `m`
  - `pattern Turkish has no English`: `englishWords` on `tr`, notes, `ex[][1]`, and `t[][1]` after removing `{…}` is empty
  - `every noun, verb and adjective left out of patterns has its own example or a note`
  - Spot checks:
    - the `at` template `['Jag är {w:at}.', '{w:DA(y)Im}.']` with the word for *strand* gives `['Jag är på stranden.', 'Plajdayım.']`
    - `hurts` with *mage* gives `Jag har ont i magen.`
- [ ] **Step 2:** Run `node --test tests/content.test.js`. Expected: FAIL.
- [ ] **Step 3:** Write `data/patterns.js` with `GROUPS`, the slot constants, the 30 Everyday patterns and `ORDER` (those 30 ids for now). Add the words these slots need if Task 10's topics lack them (for example kinds `country`, `vehicle`, `body` and `place`), in their right topics.
- [ ] **Step 4:** Run `node --test tests/`. Expected: all pass.
- [ ] **Step 5:** Port `tools/sample.mjs`. Run `node tools/sample.mjs 3`, read the output, and fix any sentence that reads wrong in either language.
- [ ] **Step 6:** Commit: `feat: pattern structure, the Everyday patterns and the sample printout`.

---

### Task 12: App shell, look, offline and the flag icon

**Files:**
- Create (port): `index.html`, `manifest.webmanifest`, `css/app.css`, `sw.js`, `tools/make-icons.mjs`, `icons/icon.svg`, `icons/icon-180.png`, `icons/icon-192.png`, `icons/icon-512.png`
- Test (port): `tests/sw.test.js`; add `index.html` and manifest checks to `tests/turkce.test.js`

**Interfaces:**
- Produces, for Task 13, these element ids in `index.html`:
  - `#progress`, `#clear-sel`, `#abc-btn` (new, before `#tr-btn`), `#tr-btn`, `#gear`, `#controls`, `#search`, `#scan-btn`, `#status`, `#sort`, `#types`, `#list`, `#settings`, `#toast`
  - dialogs `#sheet` (`#sheet-body`), `#translator` (`#translator-body`) and `#alphabet` (new, class `sheet`, body `#alphabet-body`)
- Produces CSS classes for Task 13:
  - `.b-label` (replaces `.b-en`) and `.b-sv` (replaces `.b-tr`)
  - `.hint` (faint 13 px line under Swedish text)
  - `.forms` (muted 13 px forms line)
  - `.ex-sv` / `.ex-tr` (replacing `.ex-tr` / `.ex-en`), `.v-sv` / `.v-tr`
  - `.head-abc` (styled like `.head-tr`)
  - alphabet: `.abc-row` (grid: letter button · name/sound · example · speaker; fits 390 pt with no sideways scroll), `.abc-letter`, `.abc-combo`

Content and look:
- `index.html`:
  - `lang="tr"`, `<title>Svenska</title>`, `apple-mobile-web-app-title` Svenska
  - meta description *En yaygın İsveççe kalıpları ve kelimeleri hızlıca öğren.*
  - search placeholder `Türkçe veya İsveççe ara`
  - status buttons Tümü / Öğrenilecek / Öğrenilen
  - tab labels Kelimeler / Kalıplar
  - every `aria-label` in Turkish (`Ayarlar`, `Çevir`, `Alfabe`, `Fotoğraf tara`, `Göster`, `Sırala`, `Filtre`, `Bölümler`, `Ayrıntılar`)
  - `theme-color` `#006aa7` (light) and `#06456e` (dark)
- `manifest.webmanifest`: name *Svenska – kalıplar ve kelimeler*, short_name *Svenska*, description as above, `background_color` `#f2f6fb`, `theme_color` `#006aa7`, and the same icon entries.
- `css/app.css`: port the Turkish app's CSS and split its single `--grad`:
  - `--bar` / `--on-bar` / `--on-bar-soft` for the top and bottom bars: blue, light `linear-gradient(135deg, #1a8fd6 0%, #006aa7 100%)` with white text; dark `linear-gradient(135deg, #0b5f94 0%, #06456e 100%)`
  - `--grad` / `--on-grad` / `--on-grad-soft` for learned blocks, the learn button and `.btn.primary`: yellow, light `linear-gradient(135deg, #ffe066 0%, #fecc02 100%)` with `--on-grad: #2b2300`; dark `linear-gradient(135deg, #e6b800 0%, #c99a00 100%)` with `#1f1a00`
  - turquoise accent, selection, page and glow tokens become blue equivalents (accent `#006aa7` light / `#5cb8f0` dark); the builder checks contrast
  - word-type dot colours stay
- `sw.js`: `CACHE = 'swedish-v1'`; `ASSETS` lists every file in `js/` and `data/`, plus `index.html`, the CSS, manifest and icons; activate deletes only `k.startsWith('swedish-') && k !== CACHE`.
- `tools/make-icons.mjs`: the Swedish flag. The background is `#006AA7`, with a yellow `#FECC02` cross: the vertical bar spans x ∈ [0.30, 0.50] and the horizontal bar y ∈ [0.40, 0.60], edge to edge. It writes PNGs at 180, 192 and 512, and an SVG with `rx="22"`.

- [ ] **Step 1: Write the failing tests:**
  - `tests/sw.test.js`: port both tests, and add `activate deletes only this app's old caches`. With keys `['swedish-v0','turkish-v11','swedish-v1']`, only `swedish-v0` is deleted.
  - `tests/turkce.test.js`: add `index.html and the manifest have no English`. Strip `<script>` and `<svg>`, collect text nodes plus the `aria-label`, `placeholder`, `title` and `content` attribute values, and the manifest's `name`, `short_name` and `description`; `englishWords` must be empty. Also assert that `<html lang="tr">` is present.
- [ ] **Step 2:** Run `node --test tests/sw.test.js tests/turkce.test.js`. Expected: FAIL.
- [ ] **Step 3:** Write the files above. Run `node tools/make-icons.mjs`, then open `icons/icon-512.png` with Read to check it looks like the flag.
- [ ] **Step 4:** Run `node --test tests/`. Expected: all pass.
- [ ] **Step 5:** Commit: `feat: Svenska app shell, blue and yellow look, flag icon, offline cache`.

---

### Task 13: The app's UI (`js/app.js`)

**Files:**
- Create (port): `js/app.js`
- Test: `tests/imports.test.js`

**Interfaces:**
- Consumes: everything above. `T` for every visible string; `fold`, `esc`, `SPEAKER`, `BUBBLE`, `ABC` (`html.js`); `formsLine` (`svenska.js`); `uttal`, `hintOf` (`uttal.js`); `LETTERS`, `COMBOS`, `alfabeHtml`; `store.parseBackup` and `store.backupText`; and Tasks 7–8's view functions with their new `hint` argument.

Changes from turkish-app's `app.js` (the structure and behaviour otherwise stay as they are):
- **Data preparation:**
  - `w.label = w.gloss || w.tr`, `p.label = p.tr`
  - `UT = Object.fromEntries(WORDS.filter((w) => w.ut && !w.sv.includes(' ')).map((w) => [w.sv.toLowerCase(), w.ut]))`
  - `hint = (s) => (ui.showHints ? uttal(s, UT) : null)`, and a word's hint = `hintOf(w, UT)`
- **Search:** `fold` over `label`, `sv`, `tr`, plus the variants' `sv` and `tr`.
- **Sorts:** from `T.sorts`; `'sv'` sorts by `a.sv.localeCompare(b.sv, 'sv')`, `'tr'` by `label` with `'tr'`.
- **Blocks:** `.b-label` shows the Turkish label. When `ui.showSwedish` is on, `.b-sv` (`lang="sv"`) shows `sv`, plus ` [hint]` when `ui.showHints` is on. The `aria-label` is `${label}, ${sv}` plus `T.aria.learnedSuffix` when learned.
- **Speech:** the voice whose `lang` starts with `sv`, `u.lang = 'sv-SE'`, the toast `T.sound`.
- **Examples:** `exHtml(sv, tr, opts)` writes `.ex-sv` (`lang="sv"`, highlighted parts), then a `.hint` line when hints are on, then `.ex-tr`. `data-say` is the Swedish.
- **Window head:** the headline is Swedish with 🔊, then a `.hint`, then for words a `.forms` line (`formsLine(w)`) and meta `TYPES[type].one · icon topic`. The title row holds `.head-abc` (`data-act="alphabet"`, `aria-label` `T.aria.alphabet`, the `ABC` icon) before `.head-tr`, then ✕.
- **Pattern window:** the title is `p.tr`; variants show `.v-sv`, hint, `.v-tr` and note.
- **Alphabet window:** `#alphabet` opens with `openAlphabet()` from `#abc-btn` and from `data-act="alphabet"` in the sheet. Like the translator, it opens on top of anything and returns to what was below; it closes on the backdrop and ✕, and `data-say` speaks. The toast host also checks `#alphabet`.
- **Translator:** `trState.from` starts at `'tr'` (Turkish → Swedish). `translatorHtml` and `resultHtml` get `hint` when hints are on.
- **Scans:** `sentenceHtml(…, hint)`; the confirm text `T.scans.confirmDelete`; the bad-photo error `T.scans.badPhoto`.
- **AI:**
  - `patternPrompt({ variant: v, patternTr: x.tr, words, existing })`
  - `wordPrompt({ word: x.sv, meaning: x.label, type: x.type, patterns, existing })`
  - the Settings test calls `wordPrompt({ word: 'hej', meaning: 'merhaba', type: 'phrase', patterns: [], n: 1 })` and shows `T.settings.works(ex[0].sv, ex[0].tr)`
- **Settings:** all text from `T.settings`. The switches are `#set-showsv` (`ui.showSwedish`) and `#set-hints` (`ui.showHints`); both re-render the list. Backup uses `store.backupText()`; Restore uses `store.parseBackup()` and shows `T.settings.notBackup` on `null`.

- [ ] **Step 1: Write the failing test** `tests/imports.test.js` → `every name app.js imports exists in its module`. Read `js/app.js`, match each `import { … } from '…'` with a regex, dynamically import the target module (all except `app.js` load in Node; `store.js` needs the `localStorage` stand-in from `store.test.js`), and assert each name is an export.
- [ ] **Step 2:** Run `node --test tests/imports.test.js`. Expected: FAIL (`js/app.js` missing).
- [ ] **Step 3:** Port `js/app.js` with the changes above. No visible string literal may stay in `app.js`: each comes from `T` or the data.
- [ ] **Step 4:** Run `node --test tests/`. Expected: all pass. Then run `node --check js/app.js`. Expected: no output.
- [ ] **Step 5:** Run `node tools/serve.mjs` in the background and fetch `http://localhost:8080/` and `/js/app.js` with `curl`. Both should return 200. If a browser tool is available, open the page and check the Words tab, a word window, the alphabet window and the translator. Stop the server.
- [ ] **Step 6:** Commit: `feat: the Svenska app's screens, all in Turkish`.

---

### Task 14: Words, topics 8–14

**Files:**
- Modify: `data/words.js`

Target counts: town 40, shopping 35, travel 40 (including `country`: *Sverige, Turkiet, Tyskland, Norge, Danmark, Finland, England, Stockholm, Göteborg, Malmö, İstanbul as Istanbul…*), work 40, body 50 (including *vårdcentral*, *recept*, *apotek* where they fit), time 45, numbers 40 (0–20, the tens, hundra, tusen; `hour` kind on 1–12). Follow Task 10's content rules.

- [ ] **Step 1:** Add the topics.
- [ ] **Step 2:** Run `node --test tests/`. Fix the data until it passes (the generic content tests cover the new words).
- [ ] **Step 3:** Commit: `feat: words for town, shopping, travel, work, body, time and numbers`.

---

### Task 15: Words, topics 15–20

**Files:**
- Modify: `data/words.js`

Target counts: describe 70 (with `komp` overrides for irregular comparisons: *bra, dålig, stor, liten, gammal, ung, lång, hög, många*), feelings 35, nature 40, animals 35 (`animal` pets and farm animals; `wild` wild animals), clothes 30, hobbies 35. Follow Task 10's content rules. The total across all topics should be about 950–1,000.

- [ ] **Step 1:** Add the topics.
- [ ] **Step 2:** Run `node --test tests/`. Fix until it passes.
- [ ] **Step 3:** Commit: `feat: words for describing, feelings, nature, animals, clothes and hobbies`.

---

### Task 16: Patterns, Verbs & tenses group

**Files:**
- Modify: `data/patterns.js`, `tests/content.test.js`

Ids, in this order, appended to `ORDER` for now:
`wantto, can, now, past, must, perfect, future, may, wouldlike, lets, please, dont, habit, should, knowhow, likedoing, try, start, progressive, ever, forgot, timeto, plan, just` (24)

What each covers:
- `wantto`: *Jag vill {w} / Vill du {w}? / Jag vill inte {w}*
- `can`: *Kan du {w}? / Kan jag {w}? / Jag kan {w} / Jag kan inte {w}*
- `now`: *Jag {w:pres} / {w:pres} du? / Jag {w:pres} inte / Han {w:pres}*. The note says the present has one form for every person.
- `past`: *Jag {w:past} / {w:past} du? / Jag {w:past} inte*
- `must`: *Jag måste {w} / Du behöver inte {w}*. The note says *du måste inte* means "you don't have to".
- `perfect`: *Jag har {w:sup} / Har du {w:sup}? / Jag har inte {w:sup}*
- `future`: *Jag ska {w} / Ska du {w}? / Jag kommer att {w}*
- `may`: *Får jag {w}? / Du får inte {w}*
- `wouldlike`: *Jag skulle vilja {w}*
- `lets`: *Ska vi {w}? / Vi kan {w} / Låt oss {w}*
- `please`: *{w:imp}! / {w:imp}, tack! / Kan du {w}, tack?*
- `dont`: *{w:imp} inte! / Du ska inte {w}*
- `habit`: *Jag brukar {w} / Brukar du {w}?*
- `should`: *Du borde {w}*
- `knowhow`: *Jag kan {w} / Vet du hur man {w:pres}?*
- `likedoing`: *Jag gillar att {w} / Jag tycker om att {w} / Jag älskar att {w}*
- `try`: *Jag försöker {w} / Jag ska försöka {w}*
- `start`: *Jag började {w} / Jag slutade {w}*
- `progressive`: *Jag håller på att {w}*
- `ever`: *Har du någonsin {w:sup}? / Jag har aldrig {w:sup}*
- `forgot`: *Jag glömde att {w} / Glöm inte att {w}!*
- `timeto`: *Det är dags att {w}*
- `plan`: *Jag tänker {w} / Jag planerar att {w}*
- `just`: *Jag har just {w:sup} / Jag {w:past} nyss*

The Turkish side uses the existing suffix codes (`{w:mAk} istiyorum`, `{w:Iyorum}`, `{w:DIm}`, `{w:(y)AcAğIm}`, `{w:(y)AbilIr_mIsIn}`…), as in turkish-app.

- [ ] **Step 1: Add spot-check tests:**
  - `now` with *tala* → `Jag talar.` / `Konuşuyorum.`
  - `perfect` with *äta* → `Jag har ätit.`
  - `please` with *komma* → `Kom!`
  - `dont` with *springa* → `Spring inte!`
- [ ] **Step 2:** Run `node --test tests/content.test.js`. Expected: FAIL (patterns missing).
- [ ] **Step 3:** Add the 24 patterns.
- [ ] **Step 4:** Run `node --test tests/`. Expected: all pass.
- [ ] **Step 5:** Commit: `feat: verb and tense patterns`.

---

### Task 17: Patterns, Connectors and Sentence order, and the final ORDER

**Files:**
- Modify: `data/patterns.js`, `tests/content.test.js`

Connectors: `when, if, because, but, also, that, before, after, inorder, while, until, assoon, or, sothat, although` (15)
- `when`: *När jag {w:pres}… / När jag {w:past}…*
- `if`: *Om du {w:pres}… / Om jag {w:pres}…*
- `because`: *eftersom… / för att…* The note covers *inte* before the verb in a subordinate clause.
- `but`: *men* (no templates)
- `also`: *också / inte heller* (no templates)
- `that`: *Jag tror att… / Jag vet att…*
- `before`: *innan jag {w:pres} / före {w:def}*
- `after`: *efter att jag har {w:sup} / efter {w:def}*
- `inorder`: *för att {w}*
- `while`: *medan jag {w:pres}*
- `until`: *tills jag {w:pres} / till ___* (time)
- `assoon`: *så fort jag {w:pres}*
- `or`: *eller / både… och* (no templates)
- `sothat`: *så att…*
- `although`: *fast / även om…*

Sentence order (`group: 'order'`): `v2, question, inte, enett, adjagree, definite, doubledef, plural, questionword` (9)
- `v2`: *Idag {w:pres} jag. / Imorgon ska jag {w}.* The note explains that the verb always comes second.
- `question`: *{w:pres} du? / Ska vi {w}?*
- `inte`: *Jag {w:pres} inte / Jag kan inte {w} / …att jag inte {w:pres}*
- `enett`: *{art} {w} / Det är {art} {w}.*
- `adjagree`: *{art} {adj:stor} {w} / {den} är {adj:ny}.*
- `definite`: *Jag har {art} {w}, och {den} är {adj:ny}.*
- `doubledef`: *{den} stora {w:def}*
- `plural`: *två {w:pl} / alla {w:pld}*
- `questionword`: *Vad / Var / När / Hur {w:pres} du?*

Final `ORDER` (79 ids):

```
want finns where price iam itis understand name wantto can now past have need must v2 question inte perfect future
may wouldlike lets please this my goingto at enett adjagree isit dont habit thanks seeyou clock howto looking from
hurts by withwithout like when if because but also that definite doubledef plural questionword before after should
think more nextlast inorder howmany whatcalled knowhow likedoing try start while until assoon progressive ever forgot
timeto plan just or sothat although
```

- [ ] **Step 1: Add the tests:**
  - `ORDER has 79 ids` (the generic ORDER test covers the rest)
  - `adjagree` gives `Det är ett stort hus.` / `en stor bil` when filled with *hus* / *bil*
  - `doubledef` with *hus* → `det stora huset`
  - `v2` with *äta* → `Idag äter jag.`
- [ ] **Step 2:** Run `node --test tests/content.test.js`. Expected: FAIL.
- [ ] **Step 3:** Add the 24 patterns and set the final `ORDER`.
- [ ] **Step 4:** Run `node --test tests/`. Expected: all pass.
- [ ] **Step 5:** Commit: `feat: connector and sentence-order patterns, final pattern order`.

---

### Task 18: Swedish frequency ranks

**Files:**
- Create (port): `tools/rank-words.mjs`, `data/ranks.js`
- Modify: `tests/content.test.js`

**Interfaces:**
- Consumes: `WORDS`, `svForm`.
- Produces: `RANKS: Record<wordId, number>` in `data/ranks.js` (generated).

Scoring:
- nouns: the sum of counts for `sv`, `def`, `pl` and `pld` (`m` and `prop`: only `sv` and `def`)
- verbs: `inf`, `pres`, `past`, `sup`, `imp`; leave out a form that equals another common word, listed in a `SKIP_FORMS` table
- adjectives: `sv`, `t`, `a`
- everything else: `sv`
- multi-word items as in turkish-app; particle verbs score as their verb
- lower-case with `'sv'`
- `DAMPEN` for shared spellings (at least `får` sheep / may, `vara` be / product, `tre`, `land`, `bra` if needed, `fem`); the builder extends it after looking at the top 40

- [ ] **Step 1:** Download the list into its own new folder in the scratchpad: `curl -sSfL -o <scratchpad>/freq/sv_50k.txt https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/sv/sv_50k.txt`. Create the folder with `mkdir -p` first.
- [ ] **Step 2: Add the failing test** `every word is ranked`, ported with an `UNRANKED_OK` set (real words that subtitles miss).
- [ ] **Step 3:** Run `node --test tests/content.test.js`. Expected: FAIL.
- [ ] **Step 4:** Write `tools/rank-words.mjs`, run it with the downloaded file, and read its "Top 40" and "Zero-scored" output. Adjust `DAMPEN` and `UNRANKED_OK`.
- [ ] **Step 5:** Run `node --test tests/`. Expected: all pass.
- [ ] **Step 6:** Commit: `feat: rank words by how often Swedes say them`.

---

### Task 19: README and final check

**Files:**
- Create (port): `README.md`

- [ ] **Step 1:** Run `node tools/sample.mjs 4` once over the whole content and fix what reads wrong.
- [ ] **Step 2:** Write `README.md` in English. Port the Turkish app's sections, and add:
  - the swedish-app repo and Pages steps (`https://worldedit22.github.io/swedish-app/`)
  - the note that the Turkish app's `share-origin` fix must be pushed first or together
  - how the two engines and `uttal.js` fit together
  - the `sv`/`tr` field names
  - the `T` rule (every visible string in `js/metin.js`)
  - the proofreading step with `node tools/sample.mjs 4`
  - credits (FrequencyWords sv, CC BY-SA 4.0)
- [ ] **Step 3:** Run `node --test tests/`. Expected: all pass. Run `node tools/sample.mjs 3`. Read the output and fix any Swedish or Turkish that reads wrong, re-running the tests after each fix.
- [ ] **Step 4:** Save `node tools/sample.mjs 4` to `<scratchpad>/sample.txt` for the user and their wife to proofread.
- [ ] **Step 5:** Commit: `docs: README and proofreading printout tool`.
- [ ] **Step 6:** Tell the user:
  - the branches to merge and push (`turkish-app` `share-origin` first, then `swedish-app` `initial-app` to `main` in a new public GitHub repo)
  - where the proofreading file is
  - the iPhone checklist from the spec's last section
