// ═══════════════════════════════════════════════════════════════
// METHOD 2 ENGINE: "Adetlerin Bastı" Workflow
// ═══════════════════════════════════════════════════════════════
// SECTION-AGNOSTIC: This engine contains NO section-specific data.
// All Bast tables, Mizan values, and constants are passed as parameters.
// This engine ONLY controls the Method 2 workflow structure from the PDF.
// ═══════════════════════════════════════════════════════════════

import { istintak, getBastLevel } from './mizaanPostEngine.js';

// ── Helper: Count Arabic letters ───────────────────────────────
function countArabicLetters(str) {
  if (!str) return 0;
  return str.replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, '').replace(/[^\u0600-\u06FF]/g, '').length;
}

// ── Helper: Calculate Bast total for text using provided Bast table ──
function calcBastFromText(text, bastTableFn) {
  if (!text) return 0;
  const clean = text.replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, '').replace(/\u0640/g, '').replace(/[^\u0600-\u06FF]/g, '');
  let total = 0;
  for (const ch of clean) {
    total += bastTableFn(ch) || 0;
  }
  return total;
}

// ── STEP 1: ESMA-I KITABET (Method 2) ──────────────────────────
// Input: mizanulMevazin, dominant, getBastLevelFn (from active section)
// Output: { names, total, allExpandedLetters, remainder, seedLetters }
export function calculateEsmaKitabetMethod2({ mizanulMevazin, dominant, getBastLevelFn }) {
  // Step 1: Istintaq → Seed Letters
  const seedLetters = istintak(mizanulMevazin);
  
  // Step 2: Zevc/Ferd Check
  const isFerd = seedLetters.length % 2 !== 0;
  const bastLevel = isFerd ? 5 : 4;
  
  // Step 3: Individual Bast Derivations (reverse order: last → first)
  const derivations = [];
  let allExpandedLetters = [];
  
  for (let i = seedLetters.length - 1; i >= 0; i--) {
    const letter = seedLetters[i];
    const bastValue = getBastLevelFn(letter, bastLevel);
    const expanded = istintak(bastValue);
    allExpandedLetters = [...allExpandedLetters, ...expanded];
    derivations.push({
      stepNumber: derivations.length + 1,
      originalLetter: letter,
      bastValue,
      expandedLetters: expanded,
      seedIndex: i,
    });
  }
  
  // Step 4: Group Formation
  const totalExpanded = allExpandedLetters.length;
  const isExpandedFerd = totalExpanded % 2 !== 0;
  const groupSize = isExpandedFerd ? 5 : 4;
  const remainder = totalExpanded % groupSize;
  
  // Method 2: Keep remainder for next stage (DO NOT supplement)
  const groups = [];
  for (let i = 0; i < totalExpanded - remainder; i += groupSize) {
    const groupLetters = allExpandedLetters.slice(i, i + groupSize);
    groups.push({
      letters: groupLetters,
      name: groupLetters.join(''),
      groupNumber: Math.floor(i / groupSize) + 1,
    });
  }
  
  // Remainder letters (kept for next stage)
  const remainderLetters = remainder > 0 ? allExpandedLetters.slice(totalExpanded - remainder) : [];
  
  // Step 5: Calculate Esma-i Kitabet Total
  // Formula: Last Name B1 + Dominant B1 + Mizanül Mevazin
  const lastName = groups.length > 0 ? groups[groups.length - 1].name : '';
  const lastNameB1 = calcBastFromText(lastName, (ch) => getBastLevelFn(ch, 1));
  const dominantB1 = getBastLevelFn(dominant, 1) || 0;
  const kitabetTotal = lastNameB1 + dominantB1 + mizanulMevazin;
  
  return {
    names: groups.map(g => g.name),
    groups,
    total: kitabetTotal,
    allExpandedLetters,
    remainder: remainderLetters,
    seedLetters,
    bastLevel,
    isFerd,
    derivations,
  };
}

// ── STEP 2: ESMA-I A'VAN (Method 2) ────────────────────────────
// Input: kitabetTotal, dominant, getBastLevelFn (from active section)
// Output: { names, total, allExpandedLetters, remainder, seedLetters }
export function calculateEsmaAvanMethod2({ kitabetTotal, dominant, getBastLevelFn }) {
  // Step 1: Istintaq → Seed Letters
  const seedLetters = istintak(kitabetTotal);
  
  // Step 2: Zevc/Ferd Check
  const isFerd = seedLetters.length % 2 !== 0;
  const bastLevel = isFerd ? 5 : 4;
  
  // Step 3: Individual Bast Derivations
  const derivations = [];
  let allExpandedLetters = [];
  
  for (let i = seedLetters.length - 1; i >= 0; i--) {
    const letter = seedLetters[i];
    const bastValue = getBastLevelFn(letter, bastLevel);
    const expanded = istintak(bastValue);
    allExpandedLetters = [...allExpandedLetters, ...expanded];
    derivations.push({
      stepNumber: derivations.length + 1,
      originalLetter: letter,
      bastValue,
      expandedLetters: expanded,
      seedIndex: i,
    });
  }
  
  // Step 4: Group Formation
  const totalExpanded = allExpandedLetters.length;
  const isExpandedFerd = totalExpanded % 2 !== 0;
  const groupSize = isExpandedFerd ? 5 : 4;
  const remainder = totalExpanded % groupSize;
  
  // Method 2: Keep remainder for next stage (DO NOT supplement)
  const groups = [];
  for (let i = 0; i < totalExpanded - remainder; i += groupSize) {
    const groupLetters = allExpandedLetters.slice(i, i + groupSize);
    groups.push({
      letters: groupLetters,
      name: groupLetters.join(''),
      groupNumber: Math.floor(i / groupSize) + 1,
    });
  }
  
  // Remainder letters (kept for next stage)
  const remainderLetters = remainder > 0 ? allExpandedLetters.slice(totalExpanded - remainder) : [];
  
  // Step 5: Calculate Esma-i A'van Total
  // Formula: Remainder B1 + Dominant B1 + Kitabet Total
  const remainderB1 = remainderLetters.reduce((s, l) => s + (getBastLevelFn(l, 1) || 0), 0);
  const dominantB1 = getBastLevelFn(dominant, 1) || 0;
  const avanTotal = remainderB1 + dominantB1 + kitabetTotal;
  
  return {
    names: groups.map(g => g.name),
    groups,
    total: avanTotal,
    allExpandedLetters,
    remainder: remainderLetters,
    seedLetters,
    bastLevel,
    isFerd,
    derivations,
  };
}

// ── STEP 3: ESMA-I KASEM (Method 2) ────────────────────────────
// Input: avanTotal, dominant, firstAvanName, getBastLevelFn (from active section)
// Output: { names, groups, allExpandedLetters, remainder, seedLetters }
export function calculateEsmaKasemMethod2({ avanTotal, dominant, firstAvanName, getBastLevelFn }) {
  // Step 1: Istintaq → Seed Letters
  const seedLetters = istintak(avanTotal);
  
  // Step 2: Zevc/Ferd Check
  const isFerd = seedLetters.length % 2 !== 0;
  const bastLevel = isFerd ? 5 : 4;
  
  // Step 3: Individual Bast Derivations
  const derivations = [];
  let allExpandedLetters = [];
  
  for (let i = seedLetters.length - 1; i >= 0; i--) {
    const letter = seedLetters[i];
    const bastValue = getBastLevelFn(letter, bastLevel);
    const expanded = istintak(bastValue);
    allExpandedLetters = [...allExpandedLetters, ...expanded];
    derivations.push({
      stepNumber: derivations.length + 1,
      originalLetter: letter,
      bastValue,
      expandedLetters: expanded,
      seedIndex: i,
    });
  }
  
  // Step 4: Group Formation
  const totalExpanded = allExpandedLetters.length;
  const isExpandedFerd = totalExpanded % 2 !== 0;
  const groupSize = isExpandedFerd ? 5 : 4;
  const remainder = totalExpanded % groupSize;
  
  // Method 2: Take first 2 letters from FIRST name, append to remainder
  const groups = [];
  for (let i = 0; i < totalExpanded - remainder; i += groupSize) {
    const groupLetters = allExpandedLetters.slice(i, i + groupSize);
    groups.push({
      letters: groupLetters,
      name: groupLetters.join(''),
      groupNumber: Math.floor(i / groupSize) + 1,
    });
  }
  
  // Remainder handling: First 2 letters from FIRST Avan name
  let remainderLetters = remainder > 0 ? allExpandedLetters.slice(totalExpanded - remainder) : [];
  let completedRemainderName = null;
  
  if (remainderLetters.length > 0 && firstAvanName && firstAvanName.length >= 2) {
    const firstTwoLetters = firstAvanName.slice(0, 2);
    const completedLetters = [...remainderLetters, ...firstTwoLetters];
    completedRemainderName = completedLetters.join('');
    groups.push({
      letters: completedLetters,
      name: completedRemainderName,
      groupNumber: groups.length + 1,
      isCompletedRemainder: true,
    });
  }
  
  return {
    names: groups.map(g => g.name),
    groups,
    allExpandedLetters,
    remainder: remainderLetters,
    completedRemainderName,
    seedLetters,
    bastLevel,
    isFerd,
    derivations,
  };
}

// ── STEP 4: DIVINE NAMES CALCULATION (Method 2 Only) ───────────
// Input: mizanulMevazin, kitabetTotal, avanTotal, getBastLevelFn
// Output: { sum, istintaqLetters, ebcedValues, total, matchedNames }
export function calculateDivineNamesMethod2({ mizanulMevazin, kitabetTotal, avanTotal, getBastLevelFn }) {
  // Sum of all three totals
  const sum = mizanulMevazin + kitabetTotal + avanTotal;
  
  // Istintaq → Letters
  const istintaqLetters = istintak(sum);
  
  // Convert each letter to Ebcedi Kebir (First Bast) value
  const ebcedValues = istintaqLetters.map(letter => ({
    letter,
    value: getBastLevelFn(letter, 1) || 0,
  }));
  
  // Total of Ebcedi Kebir values
  const ebcedTotal = ebcedValues.reduce((s, v) => s + v.value, 0);
  
  // Note: Matching Esma-ullah names would require a database lookup
  // This returns the target number for matching
  return {
    sum,
    istintaqLetters,
    ebcedValues,
    ebcedTotal,
    matchedNames: [], // To be populated from divine names database
  };
}

// ── STEP 5: KEYWORD SUBTRACTION METHOD (Alternative Path) ──────
// For Esma-i A'van: Base Total - Ayil (51)
// For Esma-i Kasem: Base Total - Yushin (316)
export function calculateKeywordSubtraction({ baseTotal, keyword, keywordValue, prefix, suffix, getBastLevelFn }) {
  // Subtract keyword value
  const adjustedTotal = baseTotal - keywordValue;
  
  // Istintaq → Letters
  const letters = istintak(adjustedTotal);
  
  // Combine into name
  const name = letters.join('');
  
  // Add prefix and suffix
  const finalName = `${prefix} ${name} ${suffix}`;
  
  return {
    baseTotal,
    keyword,
    keywordValue,
    adjustedTotal,
    letters,
    name,
    prefix,
    suffix,
    finalName,
  };
}

// ── MAIN PIPELINE: Complete Method 2 Workflow ──────────────────
// Input: { mizanulMevazin, dominant, getBastLevelFn }
// Output: Complete Method 2 results for all three Esma stages
export function runMethod2Pipeline({ mizanulMevazin, dominant, getBastLevelFn }) {
  // Stage 1: Esma-i Kitabet
  const kitabet = calculateEsmaKitabetMethod2({ mizanulMevazin, dominant, getBastLevelFn });
  
  // Stage 2: Esma-i A'van
  const avan = calculateEsmaAvanMethod2({ 
    kitabetTotal: kitabet.total, 
    dominant, 
    getBastLevelFn 
  });
  
  // Stage 3: Esma-i Kasem (needs first Avan name for remainder completion)
  const firstAvanName = avan.names.length > 0 ? avan.names[0] : '';
  const kasem = calculateEsmaKasemMethod2({
    avanTotal: avan.total,
    dominant,
    firstAvanName,
    getBastLevelFn,
  });
  
  // Stage 4: Divine Names
  const divineNames = calculateDivineNamesMethod2({
    mizanulMevazin,
    kitabetTotal: kitabet.total,
    avanTotal: avan.total,
    getBastLevelFn,
  });
  
  return {
    kitabet,
    avan,
    kasem,
    divineNames,
    workflow: 'method2',
  };
}