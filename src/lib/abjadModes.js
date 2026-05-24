// ═══════════════════════════════════════════════
// ABJAD CALCULATION ENGINES
// ═══════════════════════════════════════════════

// ── Kabir map (classical Abjad) ──
export const KABIR_MAP = {
  'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,
  'ي':10,'ك':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,
  'ق':100,'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000,
};

// ── Normalization ──
const NORM = { 'أ':'ا','إ':'ا','آ':'ا','ٱ':'ا','ى':'ي','ئ':'ي','ؤ':'و','ة':'ه' };

export function normalize(ch) { return NORM[ch] || ch; }

function isArabic(ch) {
  const n = normalize(ch);
  if (n in KABIR_MAP) return true;
  // Also accept via Unicode range check (Arabic block U+0621–U+064A core letters)
  const code = n.charCodeAt(0);
  return code >= 0x0621 && code <= 0x064A;
}

// Strip all non-letter noise: tashkeel, diacritics, tatweel, zero-width chars,
// directional marks, invisible Unicode, and anything outside visible Arabic/letter ranges.
function stripDiacritics(text) {
  return text
    .replace(/[\u0610-\u065F]/g, '')   // tashkeel / Arabic extended marks
    .replace(/\u0640/g, '')             // tatweel (kashida)
    .replace(/\u0670/g, '')             // superscript alef
    .replace(/[\u064B-\u065F]/g, '')    // harakat (belt & safety)
    .replace(/[\u200B-\u200F]/g, '')    // zero-width / directional marks
    .replace(/[\u202A-\u202E]/g, '')    // LTR/RTL embedding marks
    .replace(/[\uFE70-\uFEFF]/g, '')    // Arabic presentation forms-B / BOM
    .replace(/[\u0600-\u0605]/g, '')    // Arabic number signs / special
    .replace(/[\u0606-\u060F]/g, '')    // Arabic poetic verse / signs
    .replace(/[\u0610-\u061F]/g, '');   // Arabic sign / punctuation range
}

function extractLetters(text) {
  const clean = stripDiacritics(text);
  const result = [];
  for (const ch of clean) {
    if (isArabic(ch)) {
      const norm = normalize(ch);
      result.push({ original: ch, normalized: norm });
    }
  }
  return result;
}

// ══════════════════════════════════════
// 1 — EBCED-İ KEBİR
// ══════════════════════════════════════
export function calcKebir(text) {
  const letters = extractLetters(text).map(l => ({
    ...l,
    value: KABIR_MAP[l.normalized],
  }));
  const total = letters.reduce((s, l) => s + l.value, 0);
  return { letters, total };
}

// ══════════════════════════════════════
// 2 — EBCED-İ SAĞİR
// Sağir: reduce each Kabir value to single digit
//   1-9   → same
//   10-90 → tens digit (e.g. 40 → 4)
//   100-900 → hundreds digit (e.g. 300 → 3)
//   1000  → 1
// Letters whose Sağir = 0 → SAKIT (silent / dropped)
// ══════════════════════════════════════
export function saghirValue(kabirVal) {
  if (kabirVal >= 1000) return 1;
  if (kabirVal >= 100) return Math.floor(kabirVal / 100);
  if (kabirVal >= 10)  return Math.floor(kabirVal / 10);
  return kabirVal;
}

export function calcSaghir(text) {
  const letters = extractLetters(text).map(l => {
    const kabir  = KABIR_MAP[l.normalized];
    const saghir = saghirValue(kabir);
    return { ...l, kabir, saghir, sakit: saghir === 0 };
  });
  const activeLetters = letters.filter(l => !l.sakit);
  const total = activeLetters.reduce((s, l) => s + l.saghir, 0);
  const sakitLetters = letters.filter(l => l.sakit);
  return { letters, activeLetters, sakitLetters, total };
}

// ══════════════════════════════════════
// 3 — EBCED-İ CÜMELİ KEBİR
// Expand each letter to its full Arabic name, then sum all letters of those names.
// ══════════════════════════════════════
export const LETTER_NAMES = {
  'ا': 'ألف',  'ب': 'باء',  'ج': 'جيم',  'د': 'دال',
  'ه': 'هاء',  'و': 'واو',  'ز': 'زاي',  'ح': 'حاء',
  'ط': 'طاء',  'ي': 'ياء',  'ك': 'كاف',  'ل': 'لام',
  'م': 'ميم',  'ن': 'نون',  'س': 'سين',  'ع': 'عين',
  'ف': 'فاء',  'ص': 'صاد',  'ق': 'قاف',  'ر': 'راء',
  'ش': 'شين',  'ت': 'تاء',  'ث': 'ثاء',  'خ': 'خاء',
  'ذ': 'ذال',  'ض': 'ضاد',  'ظ': 'ظاء',  'غ': 'غين',
};

export function calcCumeli(text) {
  const src = extractLetters(text);
  const entries = src.map(l => {
    const name = LETTER_NAMES[l.normalized] || l.normalized;
    const nameLetters = extractLetters(name).map(nl => ({
      ...nl,
      value: KABIR_MAP[nl.normalized],
    }));
    const nameTotal = nameLetters.reduce((s, x) => s + x.value, 0);
    return { original: l.original, normalized: l.normalized, name, nameLetters, nameTotal };
  });
  const total = entries.reduce((s, e) => s + e.nameTotal, 0);
  return { entries, total };
}

// ══════════════════════════════════════
// 4 — BAST-I HURUF
// Take the expanded name letters and expand THOSE letters once more,
// then sum the entire expanded corpus.
// ══════════════════════════════════════
export function calcBast(text) {
  const src = extractLetters(text);

  const entries = src.map(l => {
    // First expansion: letter → name
    const firstName = LETTER_NAMES[l.normalized] || l.normalized;
    const firstLetters = extractLetters(firstName);

    // Second expansion: each letter of the name → its name
    const bastGroups = firstLetters.map(fl => {
      const secondName = LETTER_NAMES[fl.normalized] || fl.normalized;
      const secondLetters = extractLetters(secondName).map(sl => ({
        ...sl,
        value: KABIR_MAP[sl.normalized],
      }));
      const groupTotal = secondLetters.reduce((s, x) => s + x.value, 0);
      return {
        letter: fl.original,
        normalized: fl.normalized,
        name: secondName,
        letters: secondLetters,
        total: groupTotal,
      };
    });

    const entryTotal = bastGroups.reduce((s, g) => s + g.total, 0);
    return {
      original: l.original,
      normalized: l.normalized,
      firstName,
      bastGroups,
      entryTotal,
    };
  });

  const total = entries.reduce((s, e) => s + e.entryTotal, 0);
  return { entries, total };
}