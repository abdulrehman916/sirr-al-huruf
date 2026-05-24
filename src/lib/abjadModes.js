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
// Each letter expands to its name, then each letter of that name
// is valued according to the Bast level multiplier.
// Bast 1: base Kabir values
// Bast 2: ×2 multiplier
// Bast 3: ×3 multiplier
// Bast 4: ×4 multiplier
// Bast 5: ×5 multiplier
// ══════════════════════════════════════
export const BAST_MULTIPLIERS = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };

export function calcBast(text, bastLevel = 1) {
  console.log('═══════════════════════════════════════');
  console.log('[calcBast] Original Input:', text, '| bastLevel:', bastLevel);
  const src = extractLetters(text);
  console.log('[calcBast] Parsed Letters:', src.map(l => l.original));
  const multiplier = BAST_MULTIPLIERS[bastLevel] || 1;

  const entries = src.map(l => {
    // First expansion: letter → name
    const firstName = LETTER_NAMES[l.normalized] || l.normalized;
    const firstLetters = extractLetters(firstName);

    // Second expansion with Bast level multiplier
    const bastGroups = firstLetters.map(fl => {
      const secondName = LETTER_NAMES[fl.normalized] || fl.normalized;
      const secondLetters = extractLetters(secondName).map(sl => ({
        ...sl,
        value: (KABIR_MAP[sl.normalized] ?? 0) * multiplier,
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
  console.log('[calcBast] Mapped Values:', entries.map(e => ({ letter: e.original, firstName: e.firstName, total: e.entryTotal })));
  console.log('[calcBast] Total:', total);
  console.log('═══════════════════════════════════════');
  return { entries, total, bastLevel };
}