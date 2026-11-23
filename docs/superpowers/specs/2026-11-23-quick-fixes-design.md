# Quick fixes: scroll line and the letter voice — design

Date: 2026-11-23. Approved in conversation. The Turkish app gets the same scroll fix and a new
alphabet window (see its own spec of the same date).

## Why

- On the iPhone the page's scroll line runs over the top and bottom bars. It should stay between them.
- Tapping a letter in the alphabet window makes the Swedish voice say "versal A" ("capital A")
  instead of just "a".
- The text cursor in the translator's box is drawn away from the text line (reported 2026-11-23,
  both apps). This looks like iOS 26 bug WebKit 300690: a text box in a fixed window over a page that
  has been scrolled down gets its caret drawn in the wrong place. Change 1 stops the page itself from
  scrolling, which removes that trigger; the user confirms on the phone.

## Changes

1. **Only the list scrolls.** The page becomes a column that fills the screen: top bar, list, tab bar.
   `#list` and `#settings` are the scrolling areas, so iOS draws the scroll line between the bars.
   The tab bar is no longer laid over the list, so the list's large bottom padding goes. Switching tabs
   scrolls the list, not the window, back to the top. Content stays centered at 900 px wide by padding
   inside the full-width scroll area, so the scroll line stays at the screen's right edge.
2. **The letter button says the small letter** (`a`, not `A`). The button still shows "A a".
3. **The alphabet window looks like the other windows.** Found while reading: `dialog#alphabet` has
   none of the bottom-sheet styles that `#sheet` and `#translator` have, so it shows as a plain
   browser dialog. It gets the same styles. (My call, not asked for.)
4. Cache version bump in `sw.js` (`swedish-v2`).

## Approaches

- **Only the list scrolls** (picked): the scroll line can only be kept off the bars if the bars are
  outside the scrolling area.
- Hide the scroll line: removes the only sign of where you are in a 1,000-word list.
- Pad the page: iOS draws the page's scroll line over the whole screen whatever the padding;
  CSS cannot inset it.

## Not in scope

- Inside a window (a word's card, the translator, the alphabet) the window's own scroll line still
  runs past its sticky title row. Changing that means restructuring every window's HTML; left unless
  the user asks.

## Left to the builder

- Exact CSS. The page must not scroll at all (no rubber band on the whole page), the bars keep their
  shadows over the list, and the toast still sits above the tab bar.
- Can't be checked here on a real iPhone: the user checks the scroll line and the letter voice.
