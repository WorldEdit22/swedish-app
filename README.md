# Svenska – Swedish for Turkish speakers

A small, fast web app that teaches the most common spoken Swedish words and sentence patterns, with everything explained in Turkish. It is made to be installed on an iPhone home screen. It is a converted copy of the Turkish app (`../turkish-app`).

Everything a person sees in the app is Turkish; there is no English. The code, comments and this README are in English.

- **Words** tab: about 1,000 words grouped by topic, sorted by how often they appear in spoken Swedish. Blocks show the Turkish meaning; the Swedish can be switched on in Settings (off by default, to test yourself). Each word's window shows the Swedish, its pronunciation in Turkish letters, its forms (*en bil · bilen · bilar · bilarna*, *talar · talade · har talat*), and examples.
- **Patterns** tab: 78 patterns in four groups — Günlük, Fiiller ve zamanlar, Bağlaçlar and Cümle düzeni (verb-second order, questions, where *inte* goes, en/ett and adjective agreement).
- Tap blocks to select them; an open pattern then shows examples with your selected words, and an open word shows examples with your selected patterns. Swipe right to mark learned (the block turns yellow), left to unmark.
- **Pronunciation hints** in Turkish letters under every Swedish word and sentence (*jag [ya:g]*, ":" = long vowel). Switch them off in Settings.
- **Alphabet** button (Aa) next to the translate button: all 29 letters with their sounds and an example word, and the tricky sounds (sj, tj, soft g and k, long and short vowels…), each with a speaker.
- **Translate**: Turkish ⇄ Swedish through Google Translate (no key, needs the internet).
- **More examples** and **photo scans** with a free AI (Gemini recommended), as in the Turkish app; answers and explanations come in Turkish.
- A speaker button reads Swedish aloud using the phone's built-in Swedish voice. iPhone silent mode mutes it.

No frameworks, no build step and no server code: plain HTML, CSS and JavaScript modules.

## Put it on the phone

The app has to be served over HTTPS to work offline from the home screen. GitHub Pages is free, and one account can host both apps:

1. First push the Turkish app's `share-origin` fix (see below), or push both at the same time.
2. Create a **public** GitHub repository named `swedish-app` and push this folder to it (`main` branch).
3. In the repository, open **Settings → Pages**. Set **Source** to "Deploy from a branch", choose `main` and `/ (root)`, and save.
4. After a minute the app is live at `https://worldedit22.github.io/swedish-app/`.
5. Open that address in **Safari** on the iPhone and tap **Share → Add to Home Screen**.

Progress is stored on each phone. Use **Ayarlar → Yedeği kopyala** now and then.

### Living next to the Turkish app

Both apps are on the same site (`worldedit22.github.io`), so they share the browser's storage. To keep them apart:

- This app's storage keys start with `sv.` (the Turkish app uses `tl.`).
- This app's offline cache is called `swedish-v…`, and it only deletes its own old caches.
- The Turkish app needs the matching fix (branch `share-origin` in `../turkish-app`): its service worker must only delete caches starting with `turkish-`. Without it, the next Turkish update would wipe this app's offline copy.
- A backup from one app is refused by the other.

Bump `CACHE` in `sw.js` on every release.

### Quick test without hosting

```sh
node tools/serve.mjs 8091
```

Then open the "On your phone" address it prints in Safari (same Wi-Fi). Everything works except offline mode.

## Free AI for more examples and scans

In the app: **Ayarlar → Yapay zekâ ile daha fazla örnek**. Choose a provider, follow the link, paste the key. Google Gemini (Flash-Lite, about 500 free requests a day) is recommended, and photo scans need it. Each phone needs a key; you can paste the same key on several phones, but they then share its daily limit.

## Proofreading

The content was written with the help of AI. Print every generated sentence and read it:

```sh
node tools/sample.mjs 4 > proofread.txt
```

Each line shows Swedish, Turkish and the pronunciation hint. A Swedish speaker should check the first column and a Turkish speaker the second. Fix words in `data/words.js` and patterns in `data/patterns.js`, then run the tests.

## Development

Needs Node.js (any recent version) for tests and tools. The app itself needs nothing.

```sh
node --test tests/                        # engines, content, views, a smoke test of the whole app
node tools/serve.mjs [port]               # local server (default 8080)
node tools/sample.mjs 4 [patternId,...]   # print generated sentences to proofread
node tools/rank-words.mjs sv_50k.txt      # recompute word frequency ranks (data/ranks.js)
node tools/make-icons.mjs                 # redraw the flag icons
```

| Path | What it is |
| --- | --- |
| `js/svenska.js` | Swedish forms: en/ett, definite and plural nouns, verb groups and irregular verbs, adjective agreement, comparison. |
| `js/grammar.js` | Turkish suffix engine (from the Turkish app), used for the Turkish meaning of every example. |
| `js/combine.js` | Fills a pattern's `[sv, tr]` template pair with a word. |
| `js/uttal.js` | Swedish text → pronunciation in Turkish letters. |
| `js/metin.js` | Every visible string, in Turkish. |
| `js/app.js` | The user interface. |
| `js/ai.js` | Optional free-AI examples, scans and explanations. |
| `data/words.js` | The words with topic, type, Swedish and Turkish grammar hints. |
| `data/patterns.js` | The patterns, their variants, examples and templates. |
| `data/alfabe.js` | The alphabet window's letters and tricky sounds. |
| `data/ranks.js` | Generated frequency scores. |

### Adding content

- **A word:** add a row `[swedish, turkish, options]` to the right group in `data/words.js`. Nouns need `g: 'en' | 'ett'`; verbs need `vg: 1 | 2 | 3` or `vf: [present, past, supine]`. Its `kind` decides which patterns it joins (see the list at the top of the file). Add `ut` if the pronunciation hint is wrong. The Turkish meaning (`tr`) must be one form the suffix engine can inflect; put alternatives in `gloss`.
- **A pattern:** add it to `data/patterns.js` and to `ORDER`. Templates are `[swedish, turkish]`: Swedish uses `{w}`, `{w:def}`, `{w:pres}`, `{w:pres+inte}`, `{art}`, `{min}`… (see `js/combine.js`), Turkish uses suffix codes such as `{w:(y)A}` and `{w:Iyorum}` (see `js/grammar.js`).
- **Text on screen:** add it to `js/metin.js`, in Turkish. A test fails if English slips in.
- Then run `node --test tests/`. The content tests render every template with every word that fits.

## Credits

Word frequencies come from [FrequencyWords](https://github.com/hermitdave/FrequencyWords) (OpenSubtitles 2018, CC BY-SA 4.0). The content was written with the help of AI, so have native speakers check anything important.
