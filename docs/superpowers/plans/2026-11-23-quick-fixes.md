# Quick Fixes (Svenska) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the scroll line between the bars, make the letter buttons say "a" instead of "versal A", and give the alphabet window the same look as the other windows.

**Architecture:** The page becomes a fixed-height flex column (top bar, `main`, tab bar) and only `main` scrolls. The letter button speaks the lower-case letter. `dialog#alphabet` joins the existing window rules.

**Tech Stack:** Plain HTML/CSS/ES modules, `node --test` (node is at `"/c/Program Files/nodejs/node.exe"`, not on PATH).

**Spec:** `docs/superpowers/specs/2026-11-23-quick-fixes-design.md`

## Global Constraints

- No English anywhere a person sees it; visible strings live in `js/metin.js` (none are added here).
- Bump `CACHE` in `sw.js` to `swedish-v2`.
- Run tests with `"/c/Program Files/nodejs/node.exe" --test /c/dev/hobby/swedish-app/tests/` (one command, no `cd`).

## Review Focus

No automated test can render iOS layout, so these go to the user as phone checks after the push:

1. Open the translator after scrolling far down the word list: the text cursor sits on the text line. (iOS 26 bug WebKit 300690: a fixed window over a scrolled page draws its caret in the wrong place. The page no longer scrolls, so it should be gone.)
2. Scroll to the very end of the list and of Settings: the last block/card is fully visible above the tab bar.
3. Rubber-band at the top and bottom of the list moves only the list, never the bars.
4. Swiping a block sideways (learned / not learned) still works, and vertical scrolling still starts on a block.
5. Focusing the search field brings up the keyboard without the top bar jumping or the page shifting.

---

### Task 1: Only the list scrolls

**Files:**
- Modify: `css/app.css` (`body`, `.top`, `main`, `.tabs` rules)
- Modify: `js/app.js:224` (`setTab`)
- Create: `tests/layout.test.js`
- Modify: `tests/app.test.js`

**Interfaces:**
- Produces: `tests/layout.test.js` with a helper `rule(css, selector)` returning the declaration text of the rule whose selector list starts a line with exactly `selector` (Task 2 adds a test to this file).

- [ ] **Step 1: Write the failing tests**

`tests/layout.test.js` reads `css/app.css` and asserts:

```js
test('the page is a column that does not scroll; only main scrolls', () => {
  const body = rule(css, 'body');
  for (const d of ['display: flex', 'flex-direction: column', 'overflow: hidden', 'height: 100dvh']) assert.ok(body.includes(d), d);
  const main = rule(css, 'main');
  for (const d of ['flex: 1', 'min-height: 0', 'overflow-y: auto']) assert.ok(main.includes(d), d);
});

test('the bars sit outside the scrolling area', () => {
  assert.ok(!rule(css, '.tabs').includes('position: fixed'));
  assert.ok(!rule(css, '.top').includes('position: sticky'));
});
```

Add to `tests/app.test.js`:

```js
test('switching tabs scrolls the list, not the window, back to the top', () => {
  $('#list').scrollTop = 500;
  const tabs = document.querySelector('.tabs');
  tabs.fire('click', { target: { closest: () => ({ dataset: { tab: 'patterns' } }) } });
  assert.equal($('#list').scrollTop, 0);
  tabs.fire('click', { target: { closest: () => ({ dataset: { tab: 'words' } }) } });
});
```

- [ ] **Step 2: Run the tests and see them fail**

Run: `"/c/Program Files/nodejs/node.exe" --test /c/dev/hobby/swedish-app/tests/`
Expected: the three new tests FAIL (body has no flex, `.tabs` is fixed, scrollTop stays 500).

- [ ] **Step 3: Change the CSS**

- `body`: add `height: 100vh; height: 100dvh; display: flex; flex-direction: column; overflow: hidden;` (keep the rest).
- `.top`: replace `position: sticky; top: 0;` with `position: relative; flex: none;` (keeps `z-index: 10` so its shadow falls over the list).
- `main`: `flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 16px max(16px, calc((100% - 868px) / 2));` and drop `max-width: 900px; margin: 0 auto;` (the padding keeps content at 900 px centered while the scroll line stays at the screen edge; the old 88 px bottom padding is no longer needed).
- `.tabs`: replace `position: fixed; left: 0; right: 0; bottom: 0;` with `position: relative; flex: none;`.
- Leave `.toast` (fixed, 76 px above the bottom) and `body.noscroll` as they are.

- [ ] **Step 4: Change `setTab` in `js/app.js`**

Replace `window.scrollTo(0, 0);` with resetting `$('#list').scrollTop` and `$('#settings').scrollTop` to 0.

- [ ] **Step 5: Run the tests and see them pass**

Run: `"/c/Program Files/nodejs/node.exe" --test /c/dev/hobby/swedish-app/tests/`
Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git -C /c/dev/hobby/swedish-app add css/app.css js/app.js tests/layout.test.js tests/app.test.js
git -C /c/dev/hobby/swedish-app commit -m "fix: only the list scrolls, so the scroll line stays between the bars"
```

### Task 2: The letter voice and the alphabet window's look

**Files:**
- Modify: `js/alfabeview.js:23`
- Modify: `css/app.css` (the four `dialog#sheet, dialog#translator` rules)
- Modify: `sw.js:4`
- Modify: `tests/alfabe.test.js:38`, `tests/layout.test.js`, `tests/sw.test.js:55-59`

**Interfaces:**
- Consumes: `rule(css, selector)` from Task 1's `tests/layout.test.js`.

- [ ] **Step 1: Change the tests**

- `tests/alfabe.test.js`: replace the `data-say="A"` line with
  `assert.ok(html.includes('data-say="a"') && !html.includes('data-say="A"'), 'tapping a letter says the small letter, not "versal A"');`
  and add `assert.ok(html.includes('data-say="å"'));` after it.
- `tests/layout.test.js`:
  ```js
  test('the alphabet window has the same window styles as the others', () => {
    assert.match(css, /dialog#sheet, dialog#translator, dialog#alphabet \{/);
    assert.match(css, /dialog#alphabet::backdrop/);
  });
  ```
- `tests/sw.test.js`: the activate test lists `['swedish-v1', 'turkish-v12', 'swedish-v2']` and expects `['swedish-v1']` deleted.

- [ ] **Step 2: Run the tests and see them fail**

Run: `"/c/Program Files/nodejs/node.exe" --test /c/dev/hobby/swedish-app/tests/`
Expected: the three changed tests FAIL.

- [ ] **Step 3: Make the changes**

- `js/alfabeview.js`: the letter button's `data-say` is `l.ch.toLocaleLowerCase('sv')`; its text ("A a") and aria-label stay.
- `css/app.css`: add `dialog#alphabet` to the base, `[open]`, `:focus` and `::backdrop` window rules, after `dialog#translator`.
- `sw.js`: `const CACHE = 'swedish-v2';`

- [ ] **Step 4: Run the tests and see them pass**

Run: `"/c/Program Files/nodejs/node.exe" --test /c/dev/hobby/swedish-app/tests/`
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git -C /c/dev/hobby/swedish-app add js/alfabeview.js css/app.css sw.js tests/alfabe.test.js tests/layout.test.js tests/sw.test.js
git -C /c/dev/hobby/swedish-app commit -m "fix: letters say 'a' not 'versal A'; alphabet window looks like the others; cache v2"
```
