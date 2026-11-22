# Svenska: a Swedish app for Turkish speakers (design)

Date: 2026-11-22
Status: waiting for approval

## Why

The user's wife and her family want to learn Swedish so they can talk with Swedish people. Their levels differ: some know almost no Swedish, and the wife knows a bit. The user already has a Turkish learning app (`c:\dev\hobby\turkish-app`) that works well on an iPhone home screen. They want the same app turned around: it teaches Swedish and explains everything in Turkish. **No English appears anywhere in the app.**

Success: a family member with no Swedish installs it from Safari and can use it from the first tap. They can hear and roughly say the most common Swedish words and sentence patterns, and read their Turkish meaning. The wife can go further with patterns, examples, scans and the AI.

## Goals

- The same app as the Turkish one: the Words and Patterns tabs, selecting, swiping to mark learned, generated examples, the speaker, the translator, photo scans, AI "more examples", Settings and backup.
- Swedish as the target language and Turkish as the only language people see.
- The most common spoken Swedish words (about 900–1,000) and the most useful patterns and grammar (about 80) for talking with Swedes.
- Pronunciation hints in Turkish letters on words and examples, such as *jag [ya:g]*.
- An alphabet button next to the translate button. It opens a window with A–Ö, how each letter sounds, an example word with a speaker button, and the tricky letter combinations.
- The app runs next to the Turkish app on the same GitHub account without either one breaking the other.

## Non-goals

- No shared codebase with the Turkish app. Fixes are copied by hand when wanted.
- No accounts, sync or server. Progress stays on each phone, as before.
- No English-to-Swedish mode and no language switch.
- No regional accents. Hints follow standard central Swedish.

## Anti-goals (a failure even if it works)

- Any English that someone sees: labels, notes, error messages, `aria-label`s, `confirm()` dialogs, toasts, dates or AI answers.
- The Turkish app breaking or losing its offline copy or progress because the Swedish app is installed.
- Example sentences that teach wrong Swedish, or wrong Turkish in the meaning line. A beginner trusts what they see.
- AI features hidden or reduced. The user wants them visible exactly as in the Turkish app.

## Constraints

- Plain HTML, CSS and JavaScript modules: no framework, no build step, no server code. This is the same as the Turkish app.
- Hosted on GitHub Pages from a public repo (free account), at `https://worldedit22.github.io/swedish-app/`. Installed with Safari → Share → Add to Home Screen on iOS 26 (iPhone, 390 pt wide).
- The user runs `git push` themselves. Claude commits locally on a feature branch and never on `main`.
- Node.js only for tests and tools (`node --test tests/`).
- iPhone silent mode mutes the speaker. That can't be fixed (see the Turkish app's history), so the app shows the same once-per-launch toast, in Turkish.
- Gemini Flash-Lite (`gemini-flash-lite-latest`) is the default AI model, with about 500 free requests a day per key.

## Approaches considered

1. **Copy the Turkish app into a new repo and convert it** (chosen). The new folder `c:\dev\hobby\swedish-app` gets its own git repo and GitHub repo. A new Swedish engine builds the Swedish side, and the existing Turkish suffix engine is reused for the Turkish side of every example. All content and on-screen text is rewritten. The Turkish app and its address stay untouched, apart from one small fix (below). The cost: later improvements to one app must be copied to the other by hand.
2. **One shared codebase with two language packs.** Fixes would reach both apps. But almost every layer differs (which language is built, which one explains, all the UI text), so little is really shared. It would also mean reworking the Turkish app, which is already on phones.
3. **One repo serving both apps under two folders.** This changes the Turkish app's address and breaks the installed home-screen app.

Approach 1 was chosen because it keeps the working Turkish app safe and lets each app grow in its own direction. The user handed the how to Claude.

## Decided with the user

- Audience: the wife and her family, at mixed levels from zero to "a bit".
- Use: talking with Swedish people, so the most common words and patterns come first.
- The same features as the Turkish app. The AI features ("✨ More examples" and the camera scan button) stay **visible exactly as in the Turkish app**.
- No English anywhere in the app.
- Pronunciation hints in Turkish letters, with ":" for a long vowel.
- An alphabet button next to the translate button, opening a window with every letter's sound, an example word and a speaker button, plus the tricky combinations.
- Home-screen name **Svenska**, blue and yellow colours, and **the Swedish flag as the app icon**.
- Code, comments and the README stay in English for the user. Only what people see in the app is Turkish.

---

## Design

### 1. Repo, hosting and living next to the Turkish app

- New folder `c:\dev\hobby\swedish-app`, started by copying the Turkish app's files except `.git`, `.superpowers` and its `docs/superpowers` history. A fresh `git init`, with the work on a feature branch (`initial-app`, as the Turkish app did). This design doc is the first committed file.
- The user creates a public GitHub repo `swedish-app`, pushes, and turns on Pages (`main`, `/ (root)`). The README explains this in English.
- **Both apps share one origin** (`worldedit22.github.io`), so in Safari they share `localStorage` and Cache Storage:
  - Swedish app storage keys start with `sv.` instead of `tl.`.
  - The Swedish service worker's cache is named `swedish-v1`, and on activate it deletes only caches whose names start with `swedish-`.
  - **Change in the Turkish app**, on its own branch there: `sw.js` activate deletes only caches starting with `turkish-`, and `CACHE` is bumped to `turkish-v11`. A test in `tests/sw.test.js` checks that it leaves another app's cache alone. Without this, the Turkish app's next update would wipe the Swedish app's offline copy. The user pushes this fix before, or together with, the Swedish app's first push.
  - The backup JSON is `{ app: 'swedish', learned }`. Restore refuses a backup whose `app` is not `swedish`, so a Turkish backup can't be pasted in by mistake.

### 2. What is Turkish and what is not

- Everything shown, spoken to a screen reader or popped up is Turkish: labels, buttons, placeholders, notes, empty states, errors, toasts, `confirm()` texts, `aria-label`s, the manifest's `name` and `description`, `<title>`, and dates (`toLocaleDateString('tr-TR')`).
- `<html lang="tr">`. Swedish text gets `lang="sv"`.
- Brand names stay as they are (Google Gemini, Groq, Mistral, OpenRouter, Google Translate).
- AI prompts may be written in English (the model follows them best), but they must ask for Swedish sentences and **Turkish** meanings and explanations. The user never sees a prompt.
- A test guards this (see §12).

Example strings, as a style guide for the builder: tabs **Kelimeler** / **Kalıplar**; status **Tümü** / **Öğrenilecek** / **Öğrenilen**; **Temizle (3)**; **12 / 950 öğrenildi**; **Öğrendim** / **✓ Öğrenildi**; sections **Seçiminden**, **Burada kullanılmadı:**, **Örnekler**, **Yapay zekâdan**; **✨ Daha fazla örnek**; **Çevir**; **Alfabe**; **Ayarlar**; search placeholder **Türkçe veya İsveççe ara**; toast **Ses yok mu? Sessiz modu kapat**. Use plain everyday Turkish and simple grammar words ("en-kelime / ett-kelime", "belirli hâli").

### 3. Data

Swedish is the target language and Turkish explains, so the fields are renamed: `sv` (Swedish) and `tr` (Turkish) replace the Turkish app's `tr` and `en`. Examples are `[sv, tr]`. AI caches store `{ sv, tr }`.

**Words** (`data/words.js`), with rows `[swedish, turkish, options]` and id `${cat}:${sv}`:
- `type` and `kind`: the same scheme as the Turkish app, so slots work the same way.
- Swedish options:
  - nouns: `g: 'en' | 'ett'` (required), `m` (mass noun, no article), `def`, `pl` and `pld` overrides for irregular forms
  - verbs: the infinitive plus a conjugation group, or the explicit present, past and supine for irregular verbs
  - adjectives: `t` and `a` overrides for irregular forms (`liten`, `gammal`, `ny`, `god`…)
  - `ut`: a pronunciation override (§6)
- Turkish options: `gloss` (what the block shows, if different from `tr`). `tr` is the one Turkish form the suffix engine inflects. The Turkish engine's hints (`soft`, `h`, `cmp`, `noSoft`) can be copied from the Turkish app's `words.js` wherever the same Turkish word appears there.
- Other options as before: `ex [sv, tr]`, `note` (Turkish), `nc`.
- The 20 topics stay, with Turkish labels: İfadeler, Küçük kelimeler, Günlük eylemler, İnsanlar, Yiyecek, İçecek, Ev, Şehirde, Alışveriş ve para, Seyahat ve ulaşım, İş ve okul, Vücut ve sağlık, Zaman, Sayılar, Tanımlama, Duygular, Hava ve doğa, Hayvanlar, Giyim, Hobiler ve spor. Sweden-specific everyday words (*fika*, *vårdcentral*, *Systembolaget*, *personnummer*…) go into the matching topics, not a new one.
- Word types, with Turkish labels: İsim, Fiil, Sıfat, Zarf, İfade, Küçük kelime. The dot colours stay the same.

**Patterns** (`data/patterns.js`): the same structure (`variants`, `ex`, templates `t`, `slot`, `note`, `group`, and an `ORDER` by usefulness), with `sv` and `tr` fields and notes in Turkish. About 80 Swedish patterns chosen for talking with Swedes. The set is the builder's to write, and must cover:
- everyday: *Jag vill ha ___*, *Kan jag få ___?*, *Jag skulle vilja ___*, *Finns det ___?*, *Var är / ligger ___?*, *Hur mycket kostar ___?*, *Jag är ___*, *Det är ___*, *Jag har ___*, *Jag behöver ___*, *Jag har ont i ___*, *Jag letar efter ___*, *Jag kommer från ___*, *Tack för ___*, *Vi ses ___*, *Klockan ___*, *Vad heter ___ på svenska?*, *Hur säger man ___?*
- verbs and tenses: present (*Jag talar*), past (*Jag talade*), perfect (*Jag har talat*), future (*Jag ska ___* / *Jag kommer att ___*), *Jag vill / kan / måste / får / brukar / borde ___*, *Ska vi ___?*, imperative and *___ inte!*, *Jag håller på att ___*, *Jag försöker ___*, *Jag gillar att ___*, *Har du någonsin ___?*
- connectors: *när*, *om*, *eftersom*, *för att*, *innan*, *efter att*, *medan*, *tills*, *så fort*, *men*, *fast*
- **A fourth group, Cümle düzeni (sentence order)**, for what Turkish works differently:
  - the verb in second place (*Idag äter jag*, *Imorgon ska vi…*)
  - questions by swapping the order (*Talar du svenska?*)
  - where *inte* goes
  - en/ett agreement (*en stor bil / ett stort hus / stora bilar*)
  - the double definite (*den stora bilen*)
  - possessives that agree (*min / mitt / mina*)

  This is Claude's call (see "Calls Claude made").
- Group labels: Günlük, Fiiller ve zamanlar, Bağlaçlar, Cümle düzeni.

### 4. Swedish engine (`js/svenska.js`)

This replaces the Turkish app's `grammar.js` as the target-language engine. It is a set of pure functions with a header comment that lists the rules.

- Nouns: the indefinite form with its article (*en bil*, *ett hus*, or bare for `m`), the definite singular (*bilen*, *huset*, *flickan*, *äpplet*, *nyckeln*), the plural (*bilar*, *flickor*, *pojkar*, *äpplen*, *hus*, plus overrides), and the definite plural (*bilarna*, *husen*, *äpplena*).
- Verbs: the infinitive, present, past, supine and imperative for groups 1 (*tala*), 2a (*stänga*), 2b (*köpa*), 3 (*bo*) and stored irregular verbs (*skriva, skrev, skrivit*). Particle verbs (*tycka om*, *gå ut*) inflect the first word only.
- Adjectives: the base form, the t-form and the a-form (*stor, stort, stora*; *röd, rött, röda*; *ny, nytt, nya*), plus overrides for irregular ones.
- Template codes (`{w}`, `{w:def}`, `{w:pl}`, `{w:pres}`, `{w:sup}`, `{w:t}` and so on) are the builder's to name. The header comment must document them, as `grammar.js` does now.
- Agreement helpers that follow the word's gender and number but are not highlighted, like the Turkish app's `EN_AGREE`: *en/ett*, *min/mitt/mina*, *din/ditt/dina*, *den/det/de*, *den här / det här / de här*.
- Word order is not computed. It is written into each template by hand (for example `Idag {w:pres} jag.`), so the verb-second rule is always right.

### 5. Combining (`js/combine.js`)

A template is a pair `[sv, tr]` of two separate strings, as the Turkish app's `[tr, en]` pairs are now. `fill(tpl, word)` renders both and returns `{ sv, tr, svParts, trParts }`, with the inserted word highlighted on both sides as now:
- **Swedish string:** the Swedish engine's codes on `word.sv`.
- **Turkish string:** the **existing Turkish suffix engine** (`grammar.js`, kept and its tests kept) on `word.tr`, with the same `{w}` / `{w:SUFFIX}` notation as today (`{w:(y)A}`, `{w:DA}`, `{w:Iyorum}`, `{w:mAk}`). So *Jag är på stranden* → *Plajdayım* and *Jag vill dricka kaffe* → *Kahve içmek istiyorum* come out with correct suffixes.
- **Turkish helper `{bir}`:** gives "bir " before a countable noun and nothing for a mass noun (`m`). This keeps *Jag vill ha en kaffe* → *Bir kahve istiyorum* and *Jag vill ha vatten* → *Su istiyorum* in step with the Swedish article.
- **Fixed adjectives** in Cümle düzeni templates agree with the inserted noun through a Swedish helper (for example `{adj:stor}` → *stor / stort / stora*).
- `fits(slot, word)` stays as it is.
- `examples.js` keeps the same logic, with renamed fields.

### 6. Pronunciation hints (`js/uttal.js`)

- A rule-based Swedish → Turkish-letter converter that works on any Swedish text, so hand-written examples, generated examples, scans and translations all get hints. Overrides come from an exceptions table in the module (common irregular words such as *jag, de, dem, mig, dig, sig, och, är, det, med, någon, sjuk*) and from a word's `ut` field.
- Letter mapping:
  - vowels: å → o, ä → e, ö → ö, y → ü, u → ü; o is usually u (*sol [su:l]*) and sometimes o (exceptions)
  - soft g and j sounds → y: g before e/i/y/ä/ö, and initial j, dj, gj, hj, lj (*göra [yö:ra]*, *jag [ya:g]*)
  - the sj sound → ş: sj, skj, stj, sk before a soft vowel, -tion → *-şu:n*
  - the tj sound → ş: tj, kj, k before a soft vowel (*kyrka [şürka]*)
  - other consonants: rs → ş; c → s/k; ck → k; x → ks; z → s; w → v; qu → kv
- Vowel length: the stressed vowel (usually the first syllable) is long before one consonant or at the end of a word, and short before two consonants. Long is marked with ":". The `ut` overrides handle words stressed later (*restaurang*, *station*, *polis*).
- The sj and tj sounds are both written "ş" in hints. They are different sounds, and the alphabet window explains the difference with audio. This is Claude's call (no Turkish letter fits either sound exactly).
- Where hints are shown:
  - a word's card, under the Swedish headline
  - a faint line under every Swedish example (hand-written, generated and AI)
  - a pattern variant's headline
  - a scanned sentence
  - a Swedish translation result
- Blocks show a hint only next to the Swedish, when Swedish is switched on for blocks.
- Settings gets a switch **Okunuşu göster** (show pronunciation), on by default.

### 7. Alphabet window

- A new button (an "Aa"-style icon, drawn as SVG like the bubble) sits **next to the translate bubble everywhere the bubble appears**: the top row and the title row of every window. It opens a dialog that, like the translator, opens on top of anything and returns to what was below when closed.
- Content (`data/alfabe.js`):
  - **All 29 letters, A to Ö**: the capital and small letter, the letter's name in hint form, a one-line Turkish description of the sound, and an example word with its hint and Turkish meaning. Tapping the letter says it, and 🔊 says the example word.
  - **Zor sesler** (tricky sounds), each with a short Turkish explanation and one or two words with 🔊:
    - the sj sound
    - the tj sound
    - soft g and j (→ y)
    - soft k (→ tj sound)
    - sk before a soft vowel
    - rs, rt, rd, rn
    - ng and gn
    - long and short vowels (*glas / glass*, and what ":" means in the hints)
    - o often sounding like u
    - stress usually on the first syllable
- Look: the same sheet style as the other windows. It fits a 390 pt wide phone without sideways scrolling.

### 8. Screens (changes from the Turkish app)

- **Blocks** show the Turkish meaning (`gloss`, or else `tr`; verbs as the Turkish infinitive, *konuşmak*). The Swedish is hidden by default, with the switch **Bloklarda İsveççeyi göster** in Settings (stored as `ui.showSwedish`). This matches the Turkish app's "read it, say it, check it" design.
- **Word card:**
  - headline: the Swedish word with 🔊, then the hint
  - forms line: *en bil · bilen · bilar · bilarna*, *talar · talade · har talat*, or *stor · stort · stora*
  - meta: word type · topic
  - then the note and examples as before
- **Pattern card:** as before, with Swedish variant headlines, a hint line, and Turkish meaning and notes.
- **Sorts:**
  - Words: Konuya göre, En yaygın, A–Z Türkçe, A–Ö İsveççe (`localeCompare(…, 'sv')`), Önce öğrenilecekler, Önce öğrenilenler
  - Patterns: En faydalı, A–Ö İsveççe, and the two learned sorts
- **Search** folds Swedish and Turkish letters (å/ä → a, ö → o, plus the Turkish folding already there), and searches Swedish, Turkish and pattern variants.
- **Speech:** an `sv-SE` voice (on iPhone, the built-in Swedish voice), the same rate, and the same silent-mode toast in Turkish. In Settings, the **Okunuş** card says whether a Swedish voice was found, how to add one on iPhone (in Turkish), and has a try-it button (*Hej! Hur mår du?*).
- **Translator:** İsveççe ⇄ Türkçe through the same Google endpoint. It opens on Turkish → Swedish (Claude's call: people mostly want to say something). 🔊 and the hint appear on whichever side is Swedish. The link reads **Google Çeviri'de aç**.
- **Photo scans:** unchanged flow and look, with Swedish text in and Turkish explanation out.
- **Settings sections:** Bloklar, Yapay zekâ ile daha fazla örnek, Okunuş, İlerleme, Hakkında. The Hakkında section credits FrequencyWords (CC BY-SA 4.0) and warns that the content was written with AI help and should be checked with a native speaker. All in Turkish.

### 9. AI (`js/ai.js`)

- The same providers, keys, models, retry and error handling, with every message in Turkish, including each provider's `howTo` text.
- `patternPrompt` and `wordPrompt` ask for natural, casual spoken Swedish sentences of at most 8 words, with natural Turkish translations, as JSON `{"examples":[{"sv":"…","tr":"…"}]}`. `parseExamples` reads `sv` and `tr`.
- The scan reading prompt asks for Swedish text exactly as printed (å, ä, ö), with the same paragraph and sentence JSON.
- The explain prompt asks for `{"tr": Turkish translation, "structure": 2–5 short sentences in Turkish, "words": [{"w","base","tr","parts"}]}`. Here `base` is the dictionary form (verbs as the infinitive, nouns as the indefinite singular with en/ett), and `parts` is in Turkish (for example `"bil + -en (belirli hâli)"`).
- Settings test button: asks for one example with *hej* and shows **Çalışıyor: …**.

### 10. Look, name and icon

- Name and title **Svenska**. The manifest name is *Svenska – kalıplar ve kelimeler*, with a Turkish description. `apple-mobile-web-app-title`: Svenska.
- Colours: the Turkish app's turquoise tokens are swapped for Swedish blue (#006AA7) and yellow (#FECC02), in light and dark mode. Learned blocks use the yellow, and the gradient bars use the blue. The builder picks exact shades for contrast. Word-type dot colours stay.
- Icon: **the Swedish flag**, a blue square with a yellow Nordic cross whose upright sits left of centre, drawn by `tools/make-icons.mjs` as PNGs at 180, 192 and 512 plus the SVG, with the same rounded-square SVG and maskable entry as now.
- The `theme-color` meta tags and the manifest colours follow the new palette.

### 11. Frequency ranks (`tools/rank-words.mjs`)

- Source: FrequencyWords `content/2018/sv/sv_50k.txt` (OpenSubtitles, CC BY-SA 4.0).
- Scoring:
  - nouns: the sum of indefinite, definite, plural and definite-plural forms
  - verbs: the sum of infinitive, present, past, supine and imperative
  - adjectives: the base, t and a forms
  - multi-word items: as before
- A `DAMPEN` table for words that share their spelling with something more common (for example *får* = sheep / may, *vara* = be / product, *tre*…).
- An `UNRANKED_OK` list for real words that subtitles miss.
- The user has to supply the downloaded list, or Claude fetches it from GitHub. That is the builder's step.

### 12. Tests and tools

`node --test tests/` must pass. The Turkish app's tests are ported, plus new ones:
- **Swedish engine:** a table of nouns, verbs and adjectives, including irregular ones, with expected forms.
- **Turkish engine:** the existing `grammar.js` tests are kept.
- **Content:**
  - ids are unique
  - every word has `sv`, `tr`, a known type and topic, and nouns have `g`
  - every variant has examples
  - every slot fits at least 3 words
  - **every template renders cleanly with every fitting word on both sides**: no leftover `{…}`, no leftover Turkish archiphonemes, and no leftover Swedish codes
  - every word is ranked
- **Pronunciation:** a table of about 60 hand-checked words and short sentences with expected hints. The exceptions table and `ut` overrides take priority.
- **Alphabet:** exactly 29 letters in order A–Ö, each with a name, a description and an example.
- **No English:**
  - data notes, Turkish meanings and pattern `tr` fields are checked against a small list of common English words (*the, and, you, is, to, of, with, please, learned, settings…*)
  - the same check runs on `index.html` (text and `aria-label`, `placeholder` and `title` attributes), the manifest, and the visible text from the pure view functions (`translateview.js`, `scanview.js`, the alphabet view)
  - the visible strings in `app.js` (sort names, toasts, button texts, Settings texts, `confirm()` texts) move into one module, `js/metin.js`, which the same check covers. Scanning `app.js` itself would trip over internal names such as `'settings'` and `'learned'`.
- **Storage and service worker:** `sv.` keys, and that activate only deletes `swedish-` caches.
- Tools: `tools/sample.mjs` prints Swedish | Turkish | hint for proofreading. `tools/serve.mjs` and `tools/make-icons.mjs` are adapted.

### 13. Content and proofreading

- Claude writes the words, patterns, notes, alphabet texts and Turkish meanings.
- The user (Swedish) reads a `tools/sample.mjs` printout for Swedish mistakes, and the wife reads it for Turkish mistakes, ideally before the first push. Fixes can also come later, on the phone.

---

## Calls Claude made (for the user to check)

- A fourth pattern group **Cümle düzeni**, for verb-second order, questions, *inte*, en/ett agreement, the double definite and possessives.
- sj and tj sounds both written "ş" in hints. The alphabet window explains the difference with audio.
- A **Okunuşu göster** switch, on by default.
- A forms line on word cards (*en bil · bilen · bilar · bilarna*).
- Blocks show Turkish and hide Swedish by default, as in the Turkish app.
- The translator opens on Turkish → Swedish.
- Sweden-specific words go into the existing topics rather than a new topic.
- Restore refuses backups from the Turkish app.
- Learned blocks are yellow and the bars are blue.

## Left to the builder

- Swedish template code names and the verb-group data format.
- The exact word list and pattern list within the scope above, and their order.
- The exact hint rules and exception list, within §6.
- The exact Turkish wording of the UI, within the style guide in §2.
- How to phase the work (for example, engine and app first with a starter word list, then the full content), as long as the first push to `main` is the complete app.

## To check on the iPhone after the first push

- Both apps installed on the home screen: each opens offline, and updating one doesn't break the other.
- The Swedish voice speaks (and silent mode shows the Turkish toast).
- The alphabet window: letters, sounds, and fitting on a 390 pt screen.
- Hints are readable and not crowded under examples.
- Photo scan of Swedish text (a letter or a sign), and the Turkish explanation.
- The translator in both directions, from the home-screen app.
- The flag icon and the "Svenska" name on the home screen.
