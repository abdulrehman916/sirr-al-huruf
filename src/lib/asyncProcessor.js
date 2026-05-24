import { ABJAD_MAP } from "./abjadValues";
import { ELEMENTS, RANK_NAMES } from "./anasirValues";

const CHUNK_SIZE = 500;

const NORMALIZE_MAP = {
  'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا',
  'ى': 'ي', 'ئ': 'ي',
  'ؤ': 'و',
  'ة': 'ه',
};

function norm(char) {
  return NORMALIZE_MAP[char] || char;
}

/**
 * Strip spaces, punctuation, diacritics (tashkeel), and non-Arabic characters,
 * then normalize letter variants before any processing.
 */
export function preprocessArabic(text) {
  return text
    // Remove tashkeel (Arabic diacritics U+0610–U+061A, U+064B–U+065F, U+0670)
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, '')
    // Remove tatweel (kashida)
    .replace(/\u0640/g, '')
    // Remove everything except Arabic letter codepoints and their variants
    .replace(/[^\u0600-\u06FF]/g, '');
}

// Yield to the browser between chunks so the UI stays responsive
function tick() {
  return new Promise((r) => setTimeout(r, 0));
}

/**
 * Async chunked version of processText().
 * Returns { total, count, letters } — same shape as processText().
 */
export async function processTextAsync(text, onProgress) {
  text = preprocessArabic(text);
  let abjadTotal = 0;
  let count = 0;
  const letters = [];

  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    const chunk = text.slice(i, i + CHUNK_SIZE);

    for (const char of chunk) {
      const normalized = norm(char);
      const val = ABJAD_MAP[normalized];
      if (val !== undefined) {
        abjadTotal += val;
        count++;
        letters.push({ original: char, normalized, value: val });
      }
    }

    onProgress?.(Math.min(99, Math.round(((i + CHUNK_SIZE) / text.length) * 100)));
    await tick();
  }

  onProgress?.(100);
  return { total: abjadTotal, count, letters };
}

// Build element lookup once at module load
const LETTER_TO_ELEMENT = {};
for (const [key, el] of Object.entries(ELEMENTS)) {
  for (const letter of el.letters) {
    LETTER_TO_ELEMENT[letter] = key;
  }
}

/**
 * Async chunked version of analyzeText().
 * Returns { counts, percentages, total, dominant, letterDetails }
 */
export async function analyzeTextAsync(text, onProgress) {
  text = preprocessArabic(text);
  const counts = { fire: 0, air: 0, water: 0, earth: 0 };
  // For very large texts we skip building full letterDetails array (performance)
  // but still count accurately. We cap letterDetails at 500 for rendering.
  const letterDetails = [];
  const DETAIL_LIMIT = 500;

  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    const chunk = text.slice(i, i + CHUNK_SIZE);

    for (const char of chunk) {
      const normalized = norm(char);
      const element = LETTER_TO_ELEMENT[normalized];
      if (element) {
        counts[element]++;
        if (letterDetails.length < DETAIL_LIMIT) {
          letterDetails.push({ original: char, element });
        }
      }
    }

    onProgress?.(Math.min(99, Math.round(((i + CHUNK_SIZE) / text.length) * 100)));
    await tick();
  }

  onProgress?.(100);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const percentages = {};
  for (const key of Object.keys(counts)) {
    percentages[key] = total > 0 ? Math.round((counts[key] / total) * 100) : 0;
  }

  if (total === 0) {
    return { counts, percentages, total, dominant: null, letterDetails, tiebreak: null };
  }

  // Build letter → rank lookup from ELEMENTS
  const LETTER_RANK_LOCAL = {};
  for (const [key, el] of Object.entries(ELEMENTS)) {
    el.letters.forEach((letter, idx) => { LETTER_RANK_LOCAL[letter] = { elementKey: key, rankIndex: idx }; });
  }

  const maxCount = Math.max(...Object.values(counts));
  const topKeys = Object.entries(counts).filter(([, v]) => v === maxCount).map(([k]) => k);

  let dominant;
  let tiebreak = null;

  if (topKeys.length === 1) {
    dominant = topKeys[0];
  } else {
    // Resolve tie by rank hierarchy
    const bestRank = {};
    for (const key of topKeys) bestRank[key] = Infinity;

    for (const { original, element } of letterDetails) {
      if (!topKeys.includes(element)) continue;
      const normalized = norm(original);
      const ri = LETTER_RANK_LOCAL[normalized];
      if (ri && ri.elementKey === element && ri.rankIndex < bestRank[element]) {
        bestRank[element] = ri.rankIndex;
      }
    }

    const sorted = [...topKeys].sort((a, b) => bestRank[a] - bestRank[b]);
    dominant = sorted[0];
    const resolvedByRank = bestRank[dominant];
    const rankName = resolvedByRank !== Infinity ? (RANK_NAMES[resolvedByRank] ?? null) : null;
    tiebreak = { tiedElements: topKeys, resolvedByRank: resolvedByRank !== Infinity ? resolvedByRank : null, rankName };
  }

  return { counts, percentages, total, dominant, letterDetails, tiebreak };
}