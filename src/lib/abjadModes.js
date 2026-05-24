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

// Strip ONLY diacritics and noise - preserve actual Arabic letters
// Arabic letter ranges: \u0621-\u063A (Hamza to Ghain) and \u0641-\u064A (Fa to Ya)
function stripDiacritics(text) {
  return text
    .replace(/[\u064B-\u065F]/g, '')    // tashkeel/harakat ONLY (not letters)
    .replace(/\u0640/g, '')             // tatweel (kashida)
    .replace(/\u0670/g, '')             // superscript alef
    .replace(/[\u0600-\u0605]/g, '')    // Arabic number signs
    .replace(/[\u0606-\u060F]/g, '')    // Arabic poetic signs
    .replace(/[\u0610-\u061A]/g, '')    // Arabic sign marks (NOT letters)
    .replace(/[\u200B-\u200F]/g, '')    // zero-width chars
    .replace(/[\u202A-\u202E]/g, '')    // LTR/RTL embedding
    .replace(/[\uFE70-\uFEFF]/g, '')    // presentation forms-B noise
    .replace(/\s+/g, '');               // spaces
}

function extractLetters(text) {
  const clean = stripDiacritics(text);
  // Match ALL Arabic letters at once using global regex - safest for Unicode
  const arabicLetterRegex = /[\u0621-\u063A\u0641-\u064A]/g;
  const matches = clean.match(arabicLetterRegex);
  
  if (!matches) {
    return [];
  }
  
  // Convert matches to result objects with normalization
  return matches.map(ch => {
    const norm = normalize(ch);
    return { original: ch, normalized: norm };
  }).filter(item => item.normalized in KABIR_MAP);
}

// ══════════════════════════════════════
// 1 — EBCED-İ KEBİR
// ══════════════════════════════════════
export function calcKebir(text) {
  console.log('═══════════════════════════════════════');
  console.log('[calcKebir] Original Input:', text);
  const rawLetters = extractLetters(text);
  console.log('[calcKebir] Parsed Letters:', rawLetters.map(l => l.original));
  const letters = rawLetters
    .filter(l => l.normalized in KABIR_MAP)
    .map(l => ({ ...l, value: KABIR_MAP[l.normalized] }));
  console.log('[calcKebir] Mapped Values:', letters.map(l => ({ letter: l.original, value: l.value })));
  const total = letters.reduce((s, l) => s + l.value, 0);
  console.log('[calcKebir] Total:', total);
  console.log('═══════════════════════════════════════');
  return { letters, total };
}

// ══════════════════════════════════════
// 2 — EBCED-İ SAĞİR
// True Sağir lookup table (cyclic reduction)
// Letters with value 0 are SAKIT (silent)
// ══════════════════════════════════════
export const SAGHIR_MAP = {
  'ا':1, 'ب':2, 'ج':3, 'د':4, 'ه':5, 'و':6, 'ز':7, 'ح':8, 'ط':9,
  'ي':10,'ك':8, 'ل':6, 'م':4, 'ن':2, 'س':0, 'ع':10,'ف':8, 'ص':6,
  'ق':4, 'ر':8, 'ش':0, 'ت':4, 'ث':8, 'خ':0, 'ذ':4, 'ض':8, 'ظ':0, 'غ':4,
};

export function calcSaghir(text) {
  console.log('═══════════════════════════════════════');
  console.log('[calcSaghir] Original Input:', text);
  const rawLetters = extractLetters(text);
  console.log('[calcSaghir] Parsed Letters:', rawLetters.map(l => l.original));
  const letters = rawLetters
    .filter(l => l.normalized in SAGHIR_MAP)
    .map(l => {
      const kabir  = KABIR_MAP[l.normalized];
      const saghir = SAGHIR_MAP[l.normalized];
      return { ...l, kabir, saghir, sakit: saghir === 0 };
    });
  const activeLetters = letters.filter(l => !l.sakit);
  const total = activeLetters.reduce((s, l) => s + l.saghir, 0);
  const sakitLetters = letters.filter(l => l.sakit);
  console.log('[calcSaghir] Mapped Values:', activeLetters.map(l => ({ letter: l.original, saghir: l.saghir })));
  console.log('[calcSaghir] Total:', total);
  console.log('═══════════════════════════════════════');
  return { letters, activeLetters, sakitLetters, total };
}

// ══════════════════════════════════════
// 3 — EBCED-İ CÜMELİ KEBİR
// Expand each letter to its full Arabic name, then sum all letters of those names.
// ══════════════════════════════════════
// Names chosen to match exact Cümeli Kebir totals:
// ا=الف(111) ب=با(3) ج=جيم(53) د=دال(35) ه=ها(6) و=واو(13) ز=زاي(18)
// ح=حا(9) ط=طا(10) ي=يا(11) ك=كاف(101) ل=لام(71) م=ميم(90) ن=نون(106)
// س=سين(120) ع=عين(130) ف=فا(81) ص=صاد(95) ق=قاف(181) ر=را(201) ش=شين(360)
// ت=تا(401) ث=ثا(501) خ=خا(601) ذ=ذال(701) ض=ضاد(805) ظ=ظا(901) غ=غين(1060)
export const LETTER_NAMES = {
  'ا': 'الف',  'ب': 'با',   'ج': 'جيم',  'د': 'دال',
  'ه': 'ها',   'و': 'واو',  'ز': 'زاي',  'ح': 'حا',
  'ط': 'طا',   'ي': 'يا',   'ك': 'كاف',  'ل': 'لام',
  'م': 'ميم',  'ن': 'نون',  'س': 'سين',  'ع': 'عين',
  'ف': 'فا',   'ص': 'صاد',  'ق': 'قاف',  'ر': 'را',
  'ش': 'شين',  'ت': 'تا',   'ث': 'ثا',   'خ': 'خا',
  'ذ': 'ذال',  'ض': 'ضاد',  'ظ': 'ظا',   'غ': 'غين',
};

export function calcCumeli(text) {
  console.log('═══════════════════════════════════════');
  console.log('[calcCumeli] Original Input:', text);
  const src = extractLetters(text);
  console.log('[calcCumeli] Parsed Letters:', src.map(l => l.original));
  const entries = src.map(l => {
    const name = LETTER_NAMES[l.normalized] || l.normalized;
    const nameLetters = extractLetters(name).map(nl => ({
      ...nl,
      value: KABIR_MAP[nl.normalized] ?? 0,
    }));
    const nameTotal = nameLetters.reduce((s, x) => s + x.value, 0);
    return { original: l.original, normalized: l.normalized, name, nameLetters, nameTotal };
  });
  const total = entries.reduce((s, e) => s + e.nameTotal, 0);
  console.log('[calcCumeli] Mapped Values:', entries.map(e => ({ letter: e.original, name: e.name, total: e.nameTotal })));
  console.log('[calcCumeli] Total:', total);
  console.log('═══════════════════════════════════════');
  return { entries, total };
}

// ══════════════════════════════════════
// 4 — BAST-I HURUF (5 Levels)
// Authentic numerical Bast table from the book
// Direct lookup values for each letter at each Bast level
// ══════════════════════════════════════
export const BAST_TABLE = {
  'ا': { 1: 16,   2: 1047, 3: 594,  4: 1941, 5: 991 },
  'ب': { 1: 616,  2: 1569, 3: 1940, 4: 1046, 5: 921 },
  'ج': { 1: 1041, 2: 469,  3: 1400, 4: 451,  5: 1118 },
  'د': { 1: 283,  2: 2215, 3: 2535, 4: 3299, 5: 2806 },
  'ه': { 1: 709,  2: 734,  3: 1575, 4: 1783, 5: 2007 },
  'و': { 1: 141,  2: 415,  3: 1625, 4: 1980, 5: 1364 },
  'ز': { 1: 612,  2: 1717, 3: 1029, 4: 1288, 5: 1900 },
  'ح': { 1: 539,  2: 2399, 3: 2959, 4: 2627, 5: 2028 },
  'ط': { 1: 579,  2: 1499, 3: 1585, 4: 2243, 5: 2627 },
  'ي': { 1: 579,  2: 1499, 3: 1585, 4: 2243, 5: 2627 },
  'ك': { 1: 1097, 2: 850,  3: 1420, 4: 1086, 5: 1239 },
  'ل': { 1: 339,  2: 2731, 3: 2038, 4: 2439, 5: 2703 },
  'م': { 1: 765,  2: 1428, 3: 1698, 4: 1843, 5: 2149 },
  'ن': { 1: 524,  2: 1681, 3: 1309, 4: 1748, 5: 1260 },
  'س': { 1: 197,  2: 796,  3: 1258, 4: 2008, 5: 1342 },
  'ع': { 1: 657,  2: 1428, 3: 1698, 4: 1843, 5: 2149 },
  'ف': { 1: 595,  2: 2067, 3: 1395, 4: 2513, 5: 3113 },
  'ص': { 1: 60,   2: 524,  3: 1681, 4: 1309, 5: 1748 },
  'ق': { 1: 517,  2: 1483, 3: 2149, 4: 1668, 5: 1772 },
  'ر': { 1: 1095, 2: 1418, 3: 1642, 4: 1591, 5: 1488 },
  'ش': { 1: 337,  2: 2333, 3: 3963, 4: 3313, 5: 3870 },
  'ت': { 1: 763,  2: 1760, 3: 883,  4: 2793, 5: 2561 },
  'ث': { 1: 522,  2: 2014, 3: 1592, 4: 2088, 5: 1991 },
  'خ': { 1: 195,  2: 1364, 3: 2016, 4: 1777, 5: 647 },
  'ذ': { 1: 655,  2: 1996, 3: 1770, 4: 506,  5: 1231 },
  'ض': { 1: 593,  2: 2399, 3: 2959, 4: 2627, 5: 2028 },
  'ظ': { 1: 114,  2: 822,  3: 1906, 4: 1175, 5: 1080 },
  'غ': { 1: 991,  2: 1941, 3: 594,  4: 1047, 5: 16 },
};

export function calcBast(text, bastLevel = 1) {
  console.log('═══════════════════════════════════════');
  console.log('[calcBast] Original Input:', text, '| bastLevel:', bastLevel);
  const src = extractLetters(text);
  console.log('[calcBast] Parsed Letters:', src.map(l => l.original));

  const entries = src.map(l => {
    const bastValue = BAST_TABLE[l.normalized]?.[bastLevel] ?? 0;
    return {
      original: l.original,
      normalized: l.normalized,
      value: bastValue,
    };
  });

  const total = entries.reduce((s, e) => s + e.value, 0);
  console.log('[calcBast] Mapped Values:', entries.map(e => ({ letter: e.original, bastLevel, value: e.value })));
  console.log('[calcBast] Total:', total);
  console.log('═══════════════════════════════════════');
  return { entries, total, bastLevel };
}