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
  
  // Step 5: Save the COMPLETED last Kitabet name and calculate its First Bast ONLY
  const lastCompletedName = groups.length > 0 ? groups[groups.length - 1].name : '';
  const lastNameB1 = calcBastFromText(lastCompletedName, (ch) => getBastLevelFn(ch, 1));
  
  // Step 6: Calculate Esma-i Kitabet Total for Divine Names stage
  // Formula: Last Name B1 + Dominant B1 + Mizanül Mevazin
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
    lastCompletedName,
    lastNameB1,
  };
}

// ── STEP 2: ESMA-I A'VAN (Method 2) ────────────────────────────
// PDF: Use ONLY three values:
// 1. First Bast of COMPLETED last Kitabet name
// 2. First Bast of selected Galip Anasir
// 3. Total of Nine Mizans
// Output: { names, total, allExpandedLetters, remainder, seedLetters, lastCompletedName, lastNameB1 }
export function calculateEsmaAvanMethod2({ lastKitabetNameB1, dominantB1, mizanulMevazin, dominant, getBastLevelFn }) {
  // Step 1: Grand Total = Last Kitabet Name B1 + Galip Anasir B1 + Nine Mizan Total
  const grandTotal = lastKitabetNameB1 + dominantB1 + mizanulMevazin;
  
  // Step 2: Istintaq → Seed Letters
  const seedLetters = istintak(grandTotal);
  
  // Step 3: Zevc/Ferd Check
  const isFerd = seedLetters.length % 2 !== 0;
  const bastLevel = isFerd ? 5 : 4;
  
  // Step 4: Individual Bast Derivations
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
  
  // Step 5: Group Formation
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
  
  // Step 6: Save COMPLETED last Avan name and calculate its First Bast ONLY
  const lastCompletedName = groups.length > 0 ? groups[groups.length - 1].name : '';
  const lastAvanNameB1 = calcBastFromText(lastCompletedName, (ch) => getBastLevelFn(ch, 1));
  
  // Step 7: Calculate Esma-i A'van Total for Divine Names stage
  // Formula: Remainder B1 + Dominant B1 + Kitabet Total
  const remainderB1 = remainderLetters.reduce((s, l) => s + (getBastLevelFn(l, 1) || 0), 0);
  const avanTotal = remainderB1 + dominantB1 + mizanulMevazin;
  
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
    lastCompletedName,
    lastAvanNameB1,
    grandTotal,
  };
}

// ── STEP 3: ESMA-I KASEM (Method 2) ────────────────────────────
// PDF: Use ONLY three values:
// 1. First Bast of COMPLETED last Avan name
// 2. First Bast of selected Galip Anasir
// 3. TOTAL OF ESMA-I KITABET (NOT Avan Total)
// Output: { names, groups, allExpandedLetters, remainder, seedLetters }
export function calculateEsmaKasemMethod2({ lastAvanNameB1, dominantB1, kitabetTotal, dominant, getBastLevelFn }) {
  // Step 1: Grand Total = Last Avan Name B1 + Galip Anasir B1 + Nine Mizan Total
  const grandTotal = lastAvanNameB1 + dominantB1 + kitabetTotal;
  
  // Step 2: Istintaq → Seed Letters
  const seedLetters = istintak(grandTotal);
  
  // Step 3: Zevc/Ferd Check
  const isFerd = seedLetters.length % 2 !== 0;
  const bastLevel = isFerd ? 5 : 4;
  
  // Step 4: Individual Bast Derivations
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
  
  // Step 5: Group Formation
  const totalExpanded = allExpandedLetters.length;
  const isExpandedFerd = totalExpanded % 2 !== 0;
  const groupSize = isExpandedFerd ? 5 : 4;
  const remainder = totalExpanded % groupSize;
  
  // Method 2: Keep remainder, complete with first 2 letters from FIRST Kasem name
  const groups = [];
  for (let i = 0; i < totalExpanded - remainder; i += groupSize) {
    const groupLetters = allExpandedLetters.slice(i, i + groupSize);
    groups.push({
      letters: groupLetters,
      name: groupLetters.join(''),
      groupNumber: Math.floor(i / groupSize) + 1,
    });
  }
  
  // Remainder handling: Complete with first 2 letters from FIRST Kasem name (PDF method)
  let remainderLetters = remainder > 0 ? allExpandedLetters.slice(totalExpanded - remainder) : [];
  let completedRemainderName = null;
  
  if (remainderLetters.length > 0 && groups.length > 0) {
    const firstKasemName = groups[0].name;
    const firstTwoLetters = firstKasemName.slice(0, 2);
    const completedLetters = [...remainderLetters, ...firstTwoLetters];
    completedRemainderName = completedLetters.join('');
    groups.push({
      letters: completedLetters,
      name: completedRemainderName,
      groupNumber: groups.length + 1,
      isCompletedRemainder: true,
    });
  }
  
  // Step 6: Calculate Esma-i Kasem Total for Divine Names stage
  const remainderB1 = remainderLetters.reduce((s, l) => s + (getBastLevelFn(l, 1) || 0), 0);
  const kasemTotal = remainderB1 + dominantB1 + grandTotal;
  
  return {
    names: groups.map(g => g.name),
    groups,
    total: kasemTotal,
    allExpandedLetters,
    remainder: remainderLetters,
    completedRemainderName,
    seedLetters,
    bastLevel,
    isFerd,
    derivations,
    grandTotal,
  };
}

// ── STEP 4: DIVINE NAMES CALCULATION (Method 2 Only) ───────────
// PDF: Nine Mizan Total + Kitabet Total + Avan Total
// Output: { sum, istintaqLetters, ebcedValues, total, matchedNames }
export function calculateDivineNamesMethod2({ mizanulMevazin, kitabetTotal, avanTotal, getBastLevelFn }) {
  // Sum: Nine Mizan + Kitabet + Avan
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
  
  return {
    sum,
    istintaqLetters,
    ebcedValues,
    ebcedTotal,
    matchedNames: [],
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

// ── STEP 6: FINAL AVAN NAME (Keyword Subtraction + Remainder) ──
// PDF: After Esma-i A'van, use keyword subtraction (Ayil = 51) to get final A'van name
export function calculateFinalAvanName({ avanTotal, remainder: avanRemainder, firstAvanName, getBastLevelFn }) {
  // Keyword subtraction: Ayil (51)
  const ayilValue = 51;
  const adjustedTotal = avanTotal - ayilValue;
  const letters = istintak(adjustedTotal);
  const name = letters.join('');
  
  // Combine with remainder from A'van stage
  const safeRemainder = Array.isArray(avanRemainder) ? avanRemainder : [];
  const finalLetters = safeRemainder.length > 0 ? [...letters, ...safeRemainder] : letters;
  const finalName = finalLetters.join('');
  
  return {
    avanTotal,
    keyword: 'Ayil',
    keywordValue: ayilValue,
    adjustedTotal,
    istintaqLetters: letters,
    baseName: name,
    remainder: safeRemainder,
    finalName,
    finalNameWithRemainder: finalName,
  };
}

// ── STEP 7: FINAL KASEM NAME (Keyword Subtraction + Remainder) ─
// PDF: After Esma-i Kasem, use keyword subtraction (Yushin = 316) to get final Kasem name
export function calculateFinalKasemName({ kasemTotal, remainder: kasemRemainder, firstKasemName, getBastLevelFn }) {
  // Keyword subtraction: Yushin (316)
  const yushinValue = 316;
  const adjustedTotal = kasemTotal - yushinValue;
  const letters = istintak(adjustedTotal);
  const name = letters.join('');
  
  // Combine with remainder from Kasem stage
  const safeRemainder = Array.isArray(kasemRemainder) ? kasemRemainder : [];
  const finalLetters = safeRemainder.length > 0 ? [...letters, ...safeRemainder] : letters;
  const finalName = finalLetters.join('');
  
  return {
    kasemTotal,
    keyword: 'Yushin',
    keywordValue: yushinValue,
    adjustedTotal,
    istintaqLetters: letters,
    baseName: name,
    remainder: safeRemainder,
    finalName,
    finalNameWithRemainder: finalName,
  };
}

// ── STEP 8: FINAL COMBINED TOTAL & DIVINE NAMES ────────────────
// PDF: Sum of Mizanül Mevazin + Kitabet Total + A'van Total + Kasem Total
export function calculateFinalDivineNames({ mizanulMevazin, kitabetTotal, avanTotal, kasemTotal, getBastLevelFn }) {
  const finalSum = mizanulMevazin + kitabetTotal + avanTotal + kasemTotal;
  const istintaqLetters = istintak(finalSum);
  const ebcedValues = istintaqLetters.map(letter => ({
    letter,
    value: getBastLevelFn(letter, 1) || 0,
  }));
  const ebcedTotal = ebcedValues.reduce((s, v) => s + v.value, 0);
  
  return {
    mizanulMevazin,
    kitabetTotal,
    avanTotal,
    kasemTotal,
    finalSum,
    istintaqLetters,
    ebcedValues,
    ebcedTotal,
    matchedNames: [],
  };
}

// ── MAIN PIPELINE: Complete Method 2 Workflow ──────────────────
// Input: { mizanulMevazin, dominant, getBastLevelFn }
// Output: Complete Method 2 results for all stages per PDF
export function runMethod2Pipeline({ mizanulMevazin, dominant, getBastLevelFn }) {
  // Stage 1: Esma-i Kitabet
  const kitabet = calculateEsmaKitabetMethod2({ mizanulMevazin, dominant, getBastLevelFn });
  
  // Stage 2: Esma-i A'van
  // PDF: Use Last Kitabet Name B1 + Galip Anasir B1 + Nine Mizan Total
  const dominantB1 = getBastLevelFn(dominant, 1) || 0;
  const avan = calculateEsmaAvanMethod2({ 
    lastKitabetNameB1: kitabet.lastNameB1,
    dominantB1,
    mizanulMevazin,
    dominant,
    getBastLevelFn,
  });
  
  // Stage 3: Esma-i Kasem
  // PDF: Use Last Avan Name B1 + Galip Anasir B1 + Kitabet Total (NOT Avan Total)
  const kasem = calculateEsmaKasemMethod2({
    lastAvanNameB1: avan.lastAvanNameB1,
    dominantB1,
    kitabetTotal: kitabet.total,
    dominant,
    getBastLevelFn,
  });
  
  // Stage 4: Divine Names (Nine Mizan + Kitabet + Avan)
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