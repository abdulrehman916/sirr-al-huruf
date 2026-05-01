import { ABJAD_MAP } from "./abjadValues";
import { ELEMENTS } from "./anasirValues";

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

  const dominant = total > 0
    ? Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
    : null;

  return { counts, percentages, total, dominant, letterDetails };
}