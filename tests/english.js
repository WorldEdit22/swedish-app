// Helper for the no-English tests (not a test file itself).
// Common English words, chosen to avoid Turkish and Swedish words that look the same
// (her, can, on, at, an, by, all, not, start, ask, say, and his = Turkish "feeling" are left
// out on purpose). Endings written with a hyphen (-are, -or, -me) are skipped.

const ENGLISH = new Set(
  `the you your are of with please learned settings search clear translate examples words patterns show try again
error listen close swap delete loading thinking saved offline connection backup restore scan photo sentence
structure provider minute this that yes what how where when why here there my me we they will would should could
have has had does did been got going come make see look want need know think tell give take use find work call
feel leave mean keep let begin seem help turn might from into about than then them these those their its our
or but if because until while`.split(/\s+/),
);

// The English words found in `text`.
export function englishWords(text) {
  return String(text)
    .replace(/-\p{L}+/gu, ' ')
    .split(/[^\p{L}]+/u)
    .map((t) => t.toLowerCase())
    .filter((t) => ENGLISH.has(t));
}

// Every string in a nested object or array; functions are called with sample arguments.
export function allStrings(value) {
  if (typeof value === 'string') return [value];
  if (typeof value === 'function') return allStrings(value(...Array.from({ length: value.length }, () => 3)));
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}
