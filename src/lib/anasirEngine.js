// ═══════════════════════════════════════════════════════
// ANASIR ENGINE — Fully isolated. No shared state with
// Abjad, Hadim, Bast, Kasem, or any other module.
// ═══════════════════════════════════════════════════════

// ── Element definitions (letters in Mertebe rank order) ──
// Index 0 = Mertebe (highest), Index 6 = Hamise (lowest)
const ANASIR_ELEMENTS = {
  fire:  { key: 'fire',  name: 'Fire',  arabic: 'النار',  icon: '🔥', letters: ['ا','ه','ط','م','ف','ش','ذ'] },
  water: { key: 'water', name: 'Water', arabic: 'الماء',  icon: '💧', letters: ['د','ح','ل','ع','ر','خ','ض'] },
  air:   { key: 'air',   name: 'Air',   arabic: 'الهواء', icon: '💨', letters: ['ج','ز','ك','س','ق','ت','ظ'] },
  earth: { key: 'earth', name: 'Earth', arabic: 'الأرض',  icon: '🌍', letters: ['ب','و','ي','ن','ص','ث','غ'] },
};

// Rank names in order (index = rank level)
const RANK_NAMES = ['Mertebe', 'Derece', 'Dakika', 'Saniye', 'Salise', 'Rabia', 'Hamise'];

// ── Internal normalization (Anasir-only) ──
const NORM_MAP = {
  'أ':'ا', 'إ':'ا', 'آ':'ا', 'ٱ':'ا',
  'ى':'ي', 'ئ':'ي',
  'ؤ':'و',
  'ة':'ه',
};

function normalizeChar(ch) {
  return NORM_MAP[ch] || ch;
}

// ── Internal preprocess: strip diacritics, keep Arabic letters only ──
function preprocessText(text) {
  return text
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, '') // tashkeel
    .replace(/\u0640/g, '')                               // tatweel
    .replace(/[^\u0600-\u06FF]/g, '');                    // non-Arabic
}

// ── Build internal lookup tables ──
const LETTER_TO_ELEMENT = {};   // normalized letter → element key
const LETTER_TO_RANK = {};      // normalized letter → { elementKey, rankIndex }

for (const [key, el] of Object.entries(ANASIR_ELEMENTS)) {
  el.letters.forEach((letter, idx) => {
    LETTER_TO_ELEMENT[letter] = key;
    LETTER_TO_RANK[letter] = { elementKey: key, rankIndex: idx };
  });
}

// ── Rank tiebreak engine ──
// Finds the highest-ranked letter each tied element contributed.
// The element with the smallest rankIndex (= highest rank) wins.
function resolveTieByRank(tiedKeys, letterDetails) {
  const bestRank = {};
  for (const key of tiedKeys) bestRank[key] = Infinity;

  for (const { original, element } of letterDetails) {
    if (!tiedKeys.includes(element)) continue;
    const norm = normalizeChar(original);
    const ri = LETTER_TO_RANK[norm];
    if (ri && ri.elementKey === element && ri.rankIndex < bestRank[element]) {
      bestRank[element] = ri.rankIndex;
    }
  }

  const sorted = [...tiedKeys].sort((a, b) => bestRank[a] - bestRank[b]);
  const winner = sorted[0];
  const resolvedByRank = bestRank[winner];

  if (resolvedByRank === Infinity) return null;

  return {
    winner,
    resolvedByRank,
    rankName: RANK_NAMES[resolvedByRank] ?? `Rank ${resolvedByRank + 1}`,
  };
}

// ── Core analysis (synchronous, used for small inputs) ──
export function analyzeAnasir(text) {
  const clean = preprocessText(text);
  const counts = { fire: 0, water: 0, air: 0, earth: 0 };
  const letterDetails = [];

  for (const char of clean) {
    const norm = normalizeChar(char);
    const element = LETTER_TO_ELEMENT[norm];
    if (element) {
      counts[element]++;
      letterDetails.push({ original: char, element });
    }
  }

  return buildResult(counts, letterDetails);
}

// ── Async chunked analysis (used by AnasirPage for large texts) ──
const CHUNK_SIZE = 500;
const DETAIL_LIMIT = 500;

function tick() { return new Promise(r => setTimeout(r, 0)); }

export async function analyzeAnasirAsync(text, onProgress) {
  const clean = preprocessText(text);
  const counts = { fire: 0, water: 0, air: 0, earth: 0 };
  const letterDetails = [];

  for (let i = 0; i < clean.length; i += CHUNK_SIZE) {
    const chunk = clean.slice(i, i + CHUNK_SIZE);
    for (const char of chunk) {
      const norm = normalizeChar(char);
      const element = LETTER_TO_ELEMENT[norm];
      if (element) {
        counts[element]++;
        if (letterDetails.length < DETAIL_LIMIT) {
          letterDetails.push({ original: char, element });
        }
      }
    }
    onProgress?.(Math.min(99, Math.round(((i + CHUNK_SIZE) / clean.length) * 100)));
    await tick();
  }

  onProgress?.(100);
  return buildResult(counts, letterDetails);
}

// ── Shared result builder ──
function buildResult(counts, letterDetails) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const percentages = {};
  for (const key of Object.keys(counts)) {
    percentages[key] = total > 0 ? Math.round((counts[key] / total) * 100) : 0;
  }

  if (total === 0) {
    return { counts, percentages, total, dominant: null, letterDetails, tiebreak: null };
  }

  const maxCount = Math.max(...Object.values(counts));
  const topKeys = Object.entries(counts).filter(([, v]) => v === maxCount).map(([k]) => k);

  let dominant;
  let tiebreak = null;

  if (topKeys.length === 1) {
    dominant = topKeys[0];
  } else {
    const resolution = resolveTieByRank(topKeys, letterDetails);
    if (resolution) {
      dominant = resolution.winner;
      tiebreak = {
        tiedElements: topKeys,
        resolvedByRank: resolution.resolvedByRank,
        rankName: resolution.rankName,
      };
    } else {
      dominant = topKeys[0];
      tiebreak = { tiedElements: topKeys, resolvedByRank: null, rankName: null };
    }
  }

  return { counts, percentages, total, dominant, letterDetails, tiebreak };
}

// Export element metadata for UI rendering
export { ANASIR_ELEMENTS, RANK_NAMES };