// Everything is saved on this device only (localStorage). Every access is
// wrapped in try/catch so the app still works if storage is unavailable.
// Keys start with "sv." so the Turkish app on the same github.io origin keeps its own.

const KEYS = {
  learned: 'sv.learned',
  selected: 'sv.selected',
  ui: 'sv.ui',
  settings: 'sv.settings',
  ai: 'sv.ai',
  scans: 'sv.scans',
  explain: 'sv.explain',
};

const APP = 'swedish'; // marks backups from this app
const MAX_SCANS = 50;
const all = () => true;

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: keep working in memory */
  }
}

const isMap = (x) => Boolean(x) && typeof x === 'object' && !Array.isArray(x);

export const store = {
  learned: load(KEYS.learned, {}),
  selected: load(KEYS.selected, {}),
  ui: load(KEYS.ui, {
    tab: 'words',
    status: { patterns: 'all', words: 'all' },
    sort: { patterns: 'common', words: 'topic' },
    type: 'all',
    pgroup: 'all',
    showSwedish: false, // blocks show the Turkish; Swedish is for checking yourself
    showHints: true, // pronunciation in Turkish letters under Swedish text
  }),
  settings: load(KEYS.settings, { provider: '', keys: {}, models: {} }),
  ai: load(KEYS.ai, {}),
  // Photographed pages as text, newest first ({ id, date, paragraphs }), and sentence explanations by sentence text.
  scans: [load(KEYS.scans, { list: [] }).list].map((l) => (Array.isArray(l) ? l : []))[0],
  explanations: load(KEYS.explain, {}),

  isLearned(key) {
    return Boolean(this.learned[key]);
  },
  toggleLearned(key) {
    if (this.learned[key]) delete this.learned[key];
    else this.learned[key] = Date.now();
    save(KEYS.learned, this.learned);
  },
  replaceLearned(obj) {
    this.learned = { ...obj };
    save(KEYS.learned, this.learned);
  },
  // Progress as text to keep somewhere safe; parseBackup reads it back.
  backupText() {
    return JSON.stringify({ app: APP, learned: this.learned });
  },
  // The learned map from a backup of this app, or null for anything else (a Turkish-app backup too).
  parseBackup(text) {
    try {
      const data = JSON.parse(text);
      return data && data.app === APP && isMap(data.learned) ? data.learned : null;
    } catch {
      return null;
    }
  },
  // Selected words and patterns (same keys as learned) feed the card's examples.
  isSelected(key) {
    return Boolean(this.selected[key]);
  },
  toggleSelected(key) {
    if (this.selected[key]) delete this.selected[key];
    else this.selected[key] = 1;
    save(KEYS.selected, this.selected);
  },
  // `filter(key)` limits these to some keys, e.g. only patterns (keys starting with "p:").
  clearSelected(filter = all) {
    for (const key of Object.keys(this.selected)) if (filter(key)) delete this.selected[key];
    save(KEYS.selected, this.selected);
  },
  selectedCount(filter = all) {
    return Object.keys(this.selected).filter(filter).length;
  },
  addScan(paragraphs) {
    const scan = { id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`, date: new Date().toISOString(), paragraphs };
    this.setScans([scan, ...this.scans].slice(0, MAX_SCANS));
    return scan;
  },
  deleteScan(id) {
    this.setScans(this.scans.filter((s) => s.id !== id));
  },
  // Saves the scans and drops explanations that no remaining scan contains, so storage stays bounded.
  setScans(list) {
    this.scans = list;
    save(KEYS.scans, { list });
    const kept = new Set(list.flatMap((s) => s.paragraphs.flat()));
    const unused = Object.keys(this.explanations).filter((sentence) => !kept.has(sentence));
    if (!unused.length) return;
    for (const sentence of unused) delete this.explanations[sentence];
    save(KEYS.explain, this.explanations);
  },
  explanation(sentence) {
    return this.explanations[sentence];
  },
  saveExplanation(sentence, data) {
    this.explanations[sentence] = data;
    save(KEYS.explain, this.explanations);
  },
  saveUi() {
    save(KEYS.ui, this.ui);
  },
  saveSettings() {
    save(KEYS.settings, this.settings);
  },
  addAi(key, examples) {
    this.ai[key] = [...(this.ai[key] || []), ...examples];
    save(KEYS.ai, this.ai);
  },
};
