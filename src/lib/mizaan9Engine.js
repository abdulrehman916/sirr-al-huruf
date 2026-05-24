// ═══════════════════════════════════════════════════════════════
// MIZAAN 9 ENGINE — COMPLETELY ISOLATED
// ═══════════════════════════════════════════════════════════════
// This module is ONLY used by Mizaan9Page.
// It shares NO logic, NO variables, NO imports with:
//   - Abjad / Kebir / Saghir / Cumeli / Bast
//   - Hadim / Kasem / Vefk / Anasir
//   - Ulvi / Sufli / Sherli
// ═══════════════════════════════════════════════════════════════

// ── Mizaan 9 Abjad map (own copy, independent) ──
const MIZAAN_ABJAD_MAP = {
  'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,
  'ي':10,'ك':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,
  'ق':100,'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000,
};

// ── Normalization (own copy, independent) ──
const MIZAAN_NORM = {
  'أ':'ا','إ':'ا','آ':'ا','ٱ':'ا',
  'ى':'ي','ئ':'ي',
  'ؤ':'و',
  'ة':'ه',
};

function mizaanNormalize(ch) {
  return MIZAAN_NORM[ch] || ch;
}

// ── Strip diacritics and noise ──
function mizaanClean(text) {
  return text
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/\u0640/g, '')
    .replace(/\u0670/g, '')
    .replace(/[\u0600-\u061F]/g, '')
    .replace(/[\u200B-\u200F]/g, '')
    .replace(/[\u202A-\u202E]/g, '')
    .replace(/[\uFE70-\uFEFF]/g, '')
    .replace(/\s+/g, '');
}

// ── Extract Arabic letters ──
function mizaanExtractLetters(text) {
  const clean = mizaanClean(text);
  const matches = clean.match(/[\u0621-\u063A\u0641-\u064A]/g);
  if (!matches) return [];
  return matches
    .map(ch => ({ original: ch, normalized: mizaanNormalize(ch) }))
    .filter(item => item.normalized in MIZAAN_ABJAD_MAP);
}

// ── Digital root (Mizan 9 reduction) ──
// Reduces a number to a single digit 1–9 (9 stays as 9, not 0)
export function mizaanDigitalRoot(n) {
  if (n <= 0) return 0;
  const r = n % 9;
  return r === 0 ? 9 : r;
}

// ── Parse text → letter objects with values ──
export function mizaanParseText(text) {
  const letters = mizaanExtractLetters(text);
  return letters.map(l => ({
    original: l.original,
    normalized: l.normalized,
    abjadValue: MIZAAN_ABJAD_MAP[l.normalized],
    root: mizaanDigitalRoot(MIZAAN_ABJAD_MAP[l.normalized]),
  }));
}

// ── Calculate totals for a parsed letter array ──
export function mizaanCalcTotals(parsedLetters) {
  const abjadTotal = parsedLetters.reduce((s, l) => s + l.abjadValue, 0);
  const rootTotal  = parsedLetters.reduce((s, l) => s + l.root, 0);
  const grandRoot  = mizaanDigitalRoot(abjadTotal);
  return { abjadTotal, rootTotal, grandRoot, letterCount: parsedLetters.length };
}

// ── Full synchronous analysis of one text entry ──
export function mizaanAnalyze(text) {
  const letters = mizaanParseText(text);
  const totals  = mizaanCalcTotals(letters);
  return { text, letters, ...totals };
}

// ── Async chunked analysis (non-blocking for large texts) ──
function yield_() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

export async function mizaanAnalyzeAsync(text, onProgress) {
  const raw = mizaanExtractLetters(text);
  const letters = [];
  const CHUNK = 50;

  for (let i = 0; i < raw.length; i++) {
    const l = raw[i];
    const abjadValue = MIZAAN_ABJAD_MAP[l.normalized];
    letters.push({
      original:   l.original,
      normalized: l.normalized,
      abjadValue,
      root: mizaanDigitalRoot(abjadValue),
    });
    if (i % CHUNK === 0) {
      onProgress && onProgress(Math.round((i / raw.length) * 100));
      await yield_();
    }
  }

  onProgress && onProgress(100);
  const totals = mizaanCalcTotals(letters);
  return { text, letters, ...totals };
}

// ── Comparison engine: compare two analyzed entries ──
export function mizaanCompare(entryA, entryB) {
  return {
    abjadDiff:   Math.abs(entryA.abjadTotal - entryB.abjadTotal),
    rootDiff:    Math.abs(entryA.grandRoot  - entryB.grandRoot),
    sameRoot:    entryA.grandRoot === entryB.grandRoot,
    higherAbjad: entryA.abjadTotal >= entryB.abjadTotal ? 'A' : 'B',
    higherRoot:  entryA.grandRoot  >= entryB.grandRoot  ? 'A' : 'B',
    compatible:  entryA.grandRoot  === entryB.grandRoot,
  };
}