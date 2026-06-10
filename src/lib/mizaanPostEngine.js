// ═══════════════════════════════════════════════════════════════
// MIZAN POST-PROCESSING ENGINE
// Source: Usûlül Bast fi Sirril Evfâk vel Havas — İdris Çelebi
//
// INPUT:  grandBast (sum of all 9 MIZAN First Bast values)
//         grandLetters (sum of all 9 MIZAN letter counts)
//         dominant (galip anasır from existing MIZAN analysis)
//
// PIPELINE:
//   grandBast + grandLetters
//   → Satır Vahid sum
//   → Istintak → seed letters
//   → Zevc/Ferd → 4th or 5th Bast each letter
//   → Istintak each → new Satır Vahid
//   → Group → Esma-i Kitabet
//   → Repeat → Esma-i A'van
//   → Repeat (always 5th Bast) → Esma-i Kasem
//   → Galip Anasır → Vefk
// ═══════════════════════════════════════════════════════════════

// ── First Bast lookup table (p.41–42) ──────────────────────────
// Keys are Arabic letters. Values are First Bast values from the book.
export const FIRST_BAST = {
  'ا': 16,   'ب': 616,  'ج': 1041, 'د': 283,  'هـ': 709,
  'و': 468,  'ز': 141,  'ح': 612,  'ط': 539,  'ى': 579,
  'ك': 635,  'ل': 1097, 'م': 339,  'ن': 765,  'س': 524,
  'ع': 197,  'ف': 657,  'ص': 595,  'ق': 60,   'ر': 517,
  'ش': 1095, 'ت': 337,  'ث': 763,  'خ': 522,  'ذ': 195,
  'ض': 655,  'ظ': 593,  'غ': 114,
  // Additional normalizations for variants
  'ه': 709,  'ي': 579,  'ء': 16,   'أ': 16,   'إ': 16,
  'آ': 16,   'ة': 709,  'ى': 579,  'ؤ': 468,  'ئ': 579,
};

// ── Full 5-level Bast table (p.42–43) ──────────────────────────
// [letter]: [bast1, bast2, bast3, bast4, bast5]
export const BAST_TABLE = {
  'ا': [16,    1047, 594,  1641, 991],
  'ب': [616,   1569, 1940, 1046, 921],
  'ج': [1041,  469,  1400, 451,  1118],
  'د': [283,   2215, 2535, 3299, 2806],
  'هـ':[709,   734,  1575, 1783, 2007],
  'ه': [709,   734,  1575, 1783, 2007],
  'و': [468,   1473, 1689, 1832, 2482],
  'ز': [141,   415,  1625, 1980, 1364],
  'ح': [612,   1717, 1029, 1288, 1900],
  'ط': [539,   2399, 2959, 2627, 2028],
  'ى': [579,   1499, 1585, 2243, 2627],
  'ي': [579,   1499, 1585, 2243, 2627],
  'ك': [635,   2328, 3072, 1968, 1843],
  'ل': [1097,  850,  1420, 1086, 1239],
  'م': [339,   2731, 2038, 2439, 2703],
  'ن': [765,   1428, 1698, 1843, 2149],
  'س': [524,   1681, 1309, 1748, 1260],
  'ع': [197,   796,  1258, 2008, 1342],
  'ف': [657,   1428, 1698, 1843, 2149],
  'ص': [595,   2067, 1395, 2513, 3113],
  'ق': [60,    524,  1681, 1309, 1748],
  'ر': [517,   1483, 2149, 1668, 1772],
  'ش': [1095,  1418, 1642, 1591, 1488],
  'ت': [337,   2333, 3963, 3313, 3870],
  'ث': [763,   1760, 883,  2793, 2561],
  'خ': [522,   2014, 1592, 2088, 1991],
  'ذ': [195,   1364, 2016, 1777, 647],
  'ض': [655,   1996, 1770, 506,  1231],
  'ظ': [593,   2399, 2959, 2627, 2028],
  'غ': [114,   822,  1906, 1175, 1080],
  // Variants
  'أ': [16,    1047, 594,  1941, 991],
  'إ': [16,    1047, 594,  1941, 991],
  'آ': [16,    1047, 594,  1941, 991],
  'ء': [16,    1047, 594,  1941, 991],
  'ة': [709,   734,  1575, 1783, 2007],
};

// ── Istintak: number → letters ─────────────────────────────────
// Converts a number to Arabic letters via positional digit extraction.
// These letters are the "spoken" components of the number.
// Based on the worked examples across p.38–40 of the source.
// The digit-positional cycle: Units → Tens → Hundreds → Thousands
const UNITS_MAP    = {1:'ا',2:'ب',3:'ج',4:'د',5:'ه',6:'و',7:'ز',8:'ح',9:'ط'};
const TENS_MAP     = {10:'ي',20:'ك',30:'ل',40:'م',50:'ن',60:'س',70:'ع',80:'ف',90:'ص'};
const HUNDREDS_MAP = {100:'ق',200:'ر',300:'ش',400:'ت',500:'ث',600:'خ',700:'ذ',800:'ض',900:'ظ'};
const THOUSAND_MARK = 'غ';

/**
 * Extract letters from a number using the positional digit-cycle method.
 * LSD-first, cycling Units → Tens → Hundreds → Thousands marker.
 * After thousands marker, cycle restarts from Tens.
 * Source: book worked examples p.38–40 (identical to msEngine akramPositional).
 *
 * BOOK RULE (verified against worked example 41487 → م,ا,غ,ت,ف,ز):
 * When d=1 appears in the thousands slot AND it is NOT the last (highest) digit,
 * emit γ + ا (include ا for 1×1000).
 * When d=1 is the highest digit in the thousands slot, emit γ only.
 * Implementation: check if there are remaining digits after current index.
 */
function extractLettersFromNumber(n) {
  if (!n || n <= 0) return [];
  n = Math.floor(n);
  const digits = [];
  let tmp = n;
  while (tmp > 0) { digits.push(tmp % 10); tmp = Math.floor(tmp / 10); }

  const letters = [];
  let slot = 0;
  for (let i = 0; i < digits.length; i++) {
    const d = digits[i];
    const isLast = (i === digits.length - 1);
    if (slot === 0) {
      if (d !== 0 && UNITS_MAP[d]) letters.push(UNITS_MAP[d]);
      slot = 1;
    } else if (slot === 1) {
      const v = d * 10;
      if (d !== 0 && TENS_MAP[v]) letters.push(TENS_MAP[v]);
      slot = 2;
    } else if (slot === 2) {
      const v = d * 100;
      if (d !== 0 && HUNDREDS_MAP[v]) letters.push(HUNDREDS_MAP[v]);
      slot = 3;
    } else {
      letters.push(THOUSAND_MARK);
      // Include units letter for this digit UNLESS d=1 AND this is the last (highest) digit
      // Book rule: d=1 as sole thousands digit → γ only; d=1 with higher digits remaining → γ+ا
      if (d !== 0 && (d !== 1 || !isLast) && UNITS_MAP[d]) letters.push(UNITS_MAP[d]);
      slot = 1;
    }
  }
  return letters;
}

/**
 * istintak(n) — convert number to letter string
 * Returns an array of Arabic letter characters.
 */
export function istintak(n) {
  return extractLettersFromNumber(n);
}

/**
 * getBastLevel(letter, level) — get the Nth Bast value for a letter
 * level: 1..5
 */
export function getBastLevel(letter, level) {
  const row = BAST_TABLE[letter];
  if (!row) return FIRST_BAST[letter] || 0;
  return row[level - 1] || 0;
}

/**
 * sumFirstBastOfLetters(letters) — sum First Bast values + letter count
 * This is the "Satır Vahid" operation described on p.54–55.
 * Source: "birinci bast adedine göre toplayıp" + "harf adedinide ilave edip"
 */
export function satirVahidSum(letters) {
  const bastSum = letters.reduce((s, l) => s + (getBastLevel(l, 1) || 0), 0);
  const count = letters.length;
  return { bastSum, count, total: bastSum + count };
}

// ── Elemental data (p.15–16, p.44) ──────────────────────────────
export const ELEMENT_LETTERS = {
  fire:  ['ا','ه','ط','م','ف','ش','ذ'],
  earth: ['ب','و','ي','ن','ص','ت','ض'],
  air:   ['ج','ز','ك','س','ق','ث','ظ'],
  water: ['د','ح','ل','ع','ر','خ','غ'],
};

// First Bast totals for each element (p.44, exact values)
export const ELEMENT_BAST_TOTALS = {
  fire:  3550,
  earth: 4015,
  air:   3757,
  water: 3342,
};

// ═══════════════════════════════════════════════════════════════
// GALIB ANASIR VALUES FOR REMAINDER COMPLETION
// ═══════════════════════════════════════════════════════════════
export const GALIB_ANASIR_VALUES = {
  fire: 3550,   // Ateş / Nar (النار)
  earth: 4015,  // Toprak / Turab (التراب)
  air: 3757,    // Hava (الهواء)
  water: 3342,  // Su / Ma (الماء)
};

// Get Galib Anasir value and its Istintak letters with full breakdown
export function getGalibAnasirData(element) {
  const value = GALIB_ANASIR_VALUES[element] || GALIB_ANASIR_VALUES.fire;
  const letters = istintak(value);
  return {
    value,
    letters,
    element,
    istintakBreakdown: extractLettersFromNumber(value),
  };
}

// Guardian name letters from element istintak (p.62)
// fire: 3550 → نثغج = Nesğac
// earth: 4015 → هيغد = Heyğad
// air: 3757 → نذغج = Nez̀ğac
// water: 3342 → ب م غج = Bemğac
function getGuardianName(element) {
  const total = ELEMENT_BAST_TOTALS[element];
  const letters = istintak(total);
  return letters.join('');
}

// ── Vefk elemental position templates (p.68, exact) ──────────────
// Each template is a 4×4 array of positions 1–16.
// The VALUE placed in each cell = startValue + (positionValue - 1)
// where startValue = floor((S - 30) / 4)
export const VEFK_TEMPLATES = {
  fire: [
    [ 8, 11, 14,  1],
    [13,  2,  7, 12],
    [ 3, 16,  9,  6],
    [10,  5,  4, 15],
  ],
  earth: [
    [15,  4,  5, 10],
    [ 6,  9, 16,  3],
    [12,  7,  2, 13],
    [ 1, 14, 11,  8],
  ],
  air: [
    [ 1, 14, 11,  8],
    [12,  7,  2, 13],
    [ 6,  9, 16,  3],
    [15,  4,  5, 10],
  ],
  water: [
    [10,  5,  4, 15],
    [ 3, 16,  9,  6],
    [13,  2,  7, 12],
    [ 8, 11, 14,  1],
  ],
};

/**
 * buildVefk(S, element)
 * Source p.68: "Vefk olunacak adetten otuz (30) çıkarılıp, kalan adet
 * dörde (4) bölünür. Harici kısmet vefkin birinci hanesine yazılır ve
 * birer zamla vefkin son hanesine kadar gidilerek vefk tamamlanır.
 * Şayet kesirde üç (3) kalırsa beşinci haneye bir (1) kesirde iki (2)
 * kalırsa dokuzuncu (9) haneye bir (1) ve kesirde bir (1) kalırsa
 * onüçüncü (13) haneye bir (1) fazla ilave etmek sureti ile vefki tamamlarız."
 *
 * Returns a 4×4 grid of numbers and the magic constant.
 */
export function buildVefk(S, element = 'fire') {
  const V = S - 30;
  const Q = Math.floor(V / 4);
  const R = V % 4;

  const template = VEFK_TEMPLATES[element] || VEFK_TEMPLATES.fire;

  // BOOK-CORRECT REMAINDER RULE (verified against p.68 worked example):
  // When R > 0, ALL template positions > 4*(4-R) receive +1.
  // R=0: no correction (threshold=16, nothing >16)
  // R=1: positions 13,14,15,16 get +1
  // R=2: positions 9,10,...,16 get +1
  // R=3: positions 5,6,...,16 get +1
  // This ensures MC = S exactly (not S±something).
  // Bug in previous version: only 1 cell was corrected → non-magic square, MC ≠ S.
  const threshold = 4 * (4 - R); // positions > threshold get +1

  const grid = template.map(row =>
    row.map(pos => Q + (pos - 1) + (pos > threshold ? 1 : 0))
  );

  // Magic constant = S exactly
  const mc = grid[0].reduce((s, v) => s + v, 0);

  return { grid, mc, Q, R, S, element, guardianName: getGuardianName(element) };
}

// ── Galip Anasır determination (p.43–44) ─────────────────────────
/**
 * Determine dominant element from existing MIZAN result.
 * The app already computes dominant in mizaan9Engine.
 * This just maps it to the element key used here.
 */
export function resolveGalipAnasir(dominant) {
  // The existing engine returns 'fire'|'earth'|'air'|'water'
  return dominant || 'fire';
}

// ── Name generation pipeline ──────────────────────────────────────

/**
 * generateEsmaLevel(inputLetters, alwaysFifth, supplementElement)
 *
 * MANUSCRIPT RULE (pp.60–69):
 * EVERY stage follows the SAME logic:
 * 1. Satır Vahid sum (First Bast of input letters + letter count)
 * 2. Istintak that sum → seed letters
 * 3. Zevc/Ferd of seed count → Bast level (4th if zevc, 5th if ferd)
 * 4. Apply Bast to each seed → istintak each → expansion letters
 * 5. Concatenate all expansion letters
 * 6. Zevc/Ferd of expanded count → group size (4 if zevc, 5 if ferd)
 * 7. Group into names
 *
 * Parameters:
 * - inputLetters: array of Arabic letters from previous stage
 * - alwaysFifth: true for Kasem (always 5th Bast), false for others
 * - supplementElement: element for remainder supplementation
 *
 * Returns:
 * {
 *   inputLetters, bastSum, letterCount, satirTotal,
 *   seedLetters, seedCount, isZevc, bastLevelUsed,
 *   seedBastValues,      // [{letter, bastValue, expansionLetters}]
 *   expandedLetters,     // all concatenated expansion letters
 *   expandedCount,
 *   isExpandedZevc,
 *   groupSize,
 *   names,               // array of name strings
 *   remainder,
 *   supplementLetters,
 * }
 */
export function generateEsmaLevel(inputLetters, alwaysFifth = false, supplementElement = 'fire') {
  let expandedLetters = [];
  let seedBastValues = [];
  let bastLevelUsed = alwaysFifth ? 5 : 4;
  let isExpandedZevc = false;
  let expandedCount = 0;
  let bastSum = 0;
  let letterCount = 0;
  let satirTotal = 0;
  let seedLetters = [];
  let seedCount = 0;
  let isZevc = false;

  // ═══════════════════════════════════════════════════════════════
  // ALL STAGES: Same manuscript logic
  // ═══════════════════════════════════════════════════════════════
  // Step 1: Satır Vahid sum (First Bast of input letters + letter count)
  bastSum = inputLetters.reduce((s, l) => s + (getBastLevel(l, 1) || 0), 0);
  letterCount = inputLetters.length;
  satirTotal = bastSum + letterCount;

  // Step 2: Istintak the Satır Vahid total → seed letters
  seedLetters = istintak(satirTotal);
  seedCount = seedLetters.length;

  // Step 3: Zevc/Ferd of seed count
  isZevc = seedCount % 2 === 0;

  // Step 4: Bast level selection (Kasem always 5th, otherwise zevc=4th, ferd=5th)
  bastLevelUsed = alwaysFifth ? 5 : (isZevc ? 4 : 5);

  // Step 5: Apply Bast to each seed letter and istintak each result
  // MANUSCRIPT RULE: Process letters in REVERSE order (last-to-first)
  seedBastValues = seedLetters.reverse().map(letter => {
    const bastValue = getBastLevel(letter, bastLevelUsed);
    const expansionLetters = istintak(bastValue);
    return { letter, bastValue, expansionLetters };
  });

  // Step 6: Concatenate all expansion letters (preserves reverse processing order)
  expandedLetters = seedBastValues.flatMap(s => s.expansionLetters);
  expandedCount = expandedLetters.length;

  // Step 7: Zevc/Ferd of expanded count → group size
  isExpandedZevc = expandedCount % 2 === 0;
  const groupSize = isExpandedZevc ? 4 : 5;

  // Step 8: Group into names - NO remainder handling here
  // Remainder is handled AFTER all stages in the main pipeline
  const names = [];
  for (let i = 0; i < expandedCount; i += groupSize) {
    names.push(expandedLetters.slice(i, i + groupSize).join(''));
  }

  return {
    inputLetters,
    bastSum,
    letterCount,
    satirTotal,
    seedLetters,
    seedCount,
    isZevc,
    bastLevelUsed,
    seedBastValues,
    expandedLetters,
    expandedCount,
    isExpandedZevc,
    groupSize,
    names,
  };
}

// ── Main entry point ──────────────────────────────────────────────
/**
 * runMizaanPostPipeline({ grandBast, grandLetters, dominant })
 *
 * grandBast: sum of all 9 MIZAN First Bast values (from MizaanFinalSummary)
 * grandLetters: sum of all 9 MIZAN letter counts
 * dominant: galip anasır key ('fire'|'earth'|'air'|'water')
 *
 * Returns the complete pipeline result.
 */
export function runMizaanPostPipeline({ grandBast, grandLetters, dominant }) {
  if (!grandBast || grandBast <= 0) return null;

  const element = resolveGalipAnasir(dominant);

  // The starting Satır Vahid total is grandBast + grandLetters
  // (this IS the combined sacred value already shown in MizaanFinalSummary)
  const satirVahidTotal = grandBast + grandLetters;

  // Step 1: Istintak the combined total to get seed letters
  const initialSeedLetters = istintak(satirVahidTotal);

  // The initial seed letters are then used as the "inputLetters" for Kitabet generation
  // But per the pipeline: the 9 MIZAN letters themselves form the Satır Vahid.
  // Since we only have totals (not the individual letters), we use the standard approach:
  // The satirVahidTotal is already (bastSum + letterCount), so we istintak it directly
  // and treat the result as the first seed — matching the book's worked examples on p.60.

  // Generate Esma-i Kitabet (first stage)
  const kitabet = generateEsmaLevel(initialSeedLetters, false, element);

  // ═══════════════════════════════════════════════════════════════
  // MANUSCRIPT REMAINDER RULE (pp.60-69):
  // After bast expansion, check if expandedCount is divisible by groupSize
  // If remainder exists, append Galib Anasir Istintak letters to END
  // Then group the FINAL corrected sequence
  // ═══════════════════════════════════════════════════════════════
  const kitabetGroupSize = kitabet.isExpandedZevc ? 4 : 5;
  const kitabetRemainder = kitabet.expandedCount % kitabetGroupSize;
  
  let kitabetFinalExpandedLetters = [...kitabet.expandedLetters];
  let kitabetSupplementLetters = [];
  let kitabetGalibAnasirData = null;
  
  if (kitabetRemainder > 0) {
    // Get Galib Anasir value and its Istintak letters
    kitabetGalibAnasirData = getGalibAnasirData(element);
    // Take only the number of letters needed
    const needed = kitabetGroupSize - kitabetRemainder;
    kitabetSupplementLetters = kitabetGalibAnasirData.letters.slice(0, needed);
    // APPEND to END of expanded letters (manuscript rule)
    kitabetFinalExpandedLetters = [...kitabet.expandedLetters, ...kitabetSupplementLetters];
  }

  // Now group the FINAL corrected sequence
  const kitabetNames = [];
  for (let i = 0; i < kitabetFinalExpandedLetters.length; i += kitabetGroupSize) {
    kitabetNames.push(kitabetFinalExpandedLetters.slice(i, i + kitabetGroupSize).join(''));
  }

  // Generate Esma-i A'van (second stage) - using kitabet expanded letters
  const avan = generateEsmaLevel(kitabet.expandedLetters, false, element);

  // Generate Esma-i Kasem (third stage, always 5th Bast) - using avan expanded letters
  const kasem = generateEsmaLevel(avan.expandedLetters, true, element);

  // Build Vefk from grandBast (the total of 9 MIZAN First Bast values)
  const vefk = buildVefk(grandBast, element);

  return {
    input: { grandBast, grandLetters, satirVahidTotal },
    initialSeedLetters,
    kitabet: {
      ...kitabet,
      finalExpandedLetters: kitabetFinalExpandedLetters,
      supplementLetters: kitabetSupplementLetters,
      galibAnasirData: kitabetGalibAnasirData,
      names: kitabetNames,
    },
    avan,
    kasem,
    element,
    vefk,
  };
}