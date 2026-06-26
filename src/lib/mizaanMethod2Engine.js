// ═══════════════════════════════════════════════════════════════
// METHOD 2 ENGINE: "Adetlerin Bastı" Workflow (PDF-EXACT)
// ═══════════════════════════════════════════════════════════════
// NO INVENTED FORMULAS. NO SIMPLIFICATIONS. NO SKIPPED STEPS.
// Follows the original manuscript page-by-page.
// ═══════════════════════════════════════════════════════════════

import { istintak, getBastLevel, GALIB_ANASIR_VALUES } from './mizaanPostEngine.js';

// ── Helper: Calculate Bast total for text ───────────────────────
function calcBastFromText(text, bastTableFn) {
  if (!text) return 0;
  const clean = text.replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, '').replace(/\u0640/g, '').replace(/[^\u0600-\u06FF]/g, '');
  let total = 0;
  for (const ch of clean) {
    total += bastTableFn(ch) || 0;
  }
  return total;
}

// ═══════════════════════════════════════════════════════════════
// STEP 1: ESMA-I KITABET
// ═══════════════════════════════════════════════════════════════
export function calculateEsmaKitabetMethod2({ mizanulMevazin, dominant, getBastLevelFn }) {
  // 1. Istintaq of Nine Mizan Total → Seed Letters
  const seedLetters = istintak(mizanulMevazin);
  
  // 2. Count letters → Zevc/Ferd
  const isFerd = seedLetters.length % 2 !== 0;
  const bastLevel = isFerd ? 5 : 4;
  
  // 3. Individual Bast Derivations (reverse order: last → first)
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
  
  // 4. Group Formation
  const totalExpanded = allExpandedLetters.length;
  const isExpandedFerd = totalExpanded % 2 !== 0;
  const groupSize = isExpandedFerd ? 5 : 4;
  const remainder = totalExpanded % groupSize;
  
  // 5. Create complete groups
  const groups = [];
  for (let i = 0; i < totalExpanded - remainder; i += groupSize) {
    const groupLetters = allExpandedLetters.slice(i, i + groupSize);
    groups.push({
      letters: groupLetters,
      name: groupLetters.join(''),
      groupNumber: Math.floor(i / groupSize) + 1,
    });
  }
  
  // 6. Remainder letters (kept for next stage)
  const remainderLetters = remainder > 0 ? allExpandedLetters.slice(totalExpanded - remainder) : [];
  
  // 7. Last completed name and its First Bast
  const lastCompletedName = groups.length > 0 ? groups[groups.length - 1].name : '';
  const lastNameB1 = calcBastFromText(lastCompletedName, (ch) => getBastLevelFn(ch, 1));
  
  // 8. Esma-i Kitabet Total (for Divine Names)
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

// ═══════════════════════════════════════════════════════════════
// STEP 2: ESMA-I A'VAN
// ═══════════════════════════════════════════════════════════════
// PDF: Last Kitabet Name B1 + Galip Anasir B1 + Nine Mizan
export function calculateEsmaAvanMethod2({ lastCompletedKitabetName, dominantB1, mizanulMevazin, dominant, getBastLevelFn }) {
  // 1. First Bast of COMPLETED last Kitabet name
  const lastKitabetNameB1 = calcBastFromText(lastCompletedKitabetName, (ch) => getBastLevelFn(ch, 1));
  
  // 2. Grand Total = Last Kitabet Name B1 + Galip Anasir B1 + Nine Mizan
  const grandTotal = lastKitabetNameB1 + dominantB1 + mizanulMevazin;
  
  // 3. Istintaq → Seed Letters
  const seedLetters = istintak(grandTotal);
  
  // 4. Count → Zevc/Ferd
  const isFerd = seedLetters.length % 2 !== 0;
  const bastLevel = isFerd ? 5 : 4;
  
  // 5. Individual Bast Derivations (reverse order)
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
  
  // 6. Group Formation
  const totalExpanded = allExpandedLetters.length;
  const isExpandedFerd = totalExpanded % 2 !== 0;
  const groupSize = isExpandedFerd ? 5 : 4;
  const remainder = totalExpanded % groupSize;
  
  const groups = [];
  for (let i = 0; i < totalExpanded - remainder; i += groupSize) {
    const groupLetters = allExpandedLetters.slice(i, i + groupSize);
    groups.push({
      letters: groupLetters,
      name: groupLetters.join(''),
      groupNumber: Math.floor(i / groupSize) + 1,
    });
  }
  
  // 7. Remainder letters (kept for next stage)
  const remainderLetters = remainder > 0 ? allExpandedLetters.slice(totalExpanded - remainder) : [];
  
  // 8. Last completed Avan name and its First Bast
  const lastCompletedName = groups.length > 0 ? groups[groups.length - 1].name : '';
  const lastAvanNameB1 = calcBastFromText(lastCompletedName, (ch) => getBastLevelFn(ch, 1));
  
  // 9. Esma-i A'van Total (for Divine Names)
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

// ═══════════════════════════════════════════════════════════════
// STEP 3: ESMA-I KASEM
// ═══════════════════════════════════════════════════════════════
// PDF: Last A'van Name B1 + Galip Anasir B1 + (Nine Mizan + Kitabet)
export function calculateEsmaKasemMethod2({ lastCompletedAvanName, dominantB1, kitabetTotal, mizanulMevazin, dominant, getBastLevelFn }) {
  // 1. First Bast of COMPLETED last A'van name
  const lastAvanNameB1 = calcBastFromText(lastCompletedAvanName, (ch) => getBastLevelFn(ch, 1));
  
  // 2. Combined: Nine Mizan + Kitabet Total
  const combinedMizanKitabet = mizanulMevazin + kitabetTotal;
  
  // 3. Grand Total = Last A'van Name B1 + Galip Anasir B1 + (Nine Mizan + Kitabet)
  const grandTotal = lastAvanNameB1 + dominantB1 + combinedMizanKitabet;
  
  // 4. Istintaq → Seed Letters
  const seedLetters = istintak(grandTotal);
  
  // 5. Count → Zevc/Ferd
  const isFerd = seedLetters.length % 2 !== 0;
  const bastLevel = isFerd ? 5 : 4;
  
  // 6. Individual Bast Derivations (reverse order)
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
  
  // 7. Group Formation
  const totalExpanded = allExpandedLetters.length;
  const isExpandedFerd = totalExpanded % 2 !== 0;
  const groupSize = isExpandedFerd ? 5 : 4;
  const remainder = totalExpanded % groupSize;
  
  const groups = [];
  for (let i = 0; i < totalExpanded - remainder; i += groupSize) {
    const groupLetters = allExpandedLetters.slice(i, i + groupSize);
    groups.push({
      letters: groupLetters,
      name: groupLetters.join(''),
      groupNumber: Math.floor(i / groupSize) + 1,
    });
  }
  
  // 8. PDF STEP 4: Remainder Completion (1-4 letters)
  // Take first 2 letters from FIRST Kasem name
  const remainderLetters = remainder > 0 ? allExpandedLetters.slice(totalExpanded - remainder) : [];
  let completedRemainderName = null;
  
  if (remainderLetters.length > 0 && groups.length > 0) {
    const firstKasemName = groups[0].name;
    const lettersNeeded = 2; // PDF: always take 2 letters
    const firstTwoLetters = firstKasemName.slice(0, lettersNeeded).split('');
    const completedLetters = [...remainderLetters, ...firstTwoLetters];
    completedRemainderName = completedLetters.join('');
    groups.push({
      letters: completedLetters,
      name: completedRemainderName,
      groupNumber: groups.length + 1,
      isCompletedRemainder: true,
    });
  }
  
  // 9. Esma-i Kasem Total (for Divine Names)
  const remainderB1 = remainderLetters.reduce((s, l) => s + (getBastLevelFn(l, 1) || 0), 0);
  const kasemTotal = remainderB1 + dominantB1 + combinedMizanKitabet;
  
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
    lastAvanNameB1,
    combinedMizanKitabet,
  };
}

// ═══════════════════════════════════════════════════════════════
// STEP 4: DIVINE NAMES (Method 2)
// ═══════════════════════════════════════════════════════════════
// PDF: Nine Mizan + Kitabet + A'van + Kasem
export function calculateDivineNamesMethod2({ mizanulMevazin, kitabetTotal, avanTotal, kasemTotal, getBastLevelFn }) {
  // Sum: Nine Mizan + Kitabet + A'van + Kasem
  const finalSum = mizanulMevazin + kitabetTotal + avanTotal + kasemTotal;
  
  // Istintaq → Letters
  const istintaqLetters = istintak(finalSum);
  
  // Convert each letter to Ebced-i Kebir (First Bast)
  const ebcedValues = istintaqLetters.map(letter => ({
    letter,
    value: getBastLevelFn(letter, 1) || 0,
  }));
  
  // Total of Ebced-i Kebir values
  const ebcedTotal = ebcedValues.reduce((s, v) => s + v.value, 0);
  
  return {
    finalSum,
    istintaqLetters,
    ebcedValues,
    ebcedTotal,
    matchedNames: [],
  };
}

// ═══════════════════════════════════════════════════════════════
// MAIN PIPELINE: Complete Method 2 Workflow (PDF-Exact)
// ═══════════════════════════════════════════════════════════════
export function runMethod2Pipeline({ mizanulMevazin, dominant, getBastLevelFn }) {
  // Stage 1: Esma-i Kitabet
  const kitabet = calculateEsmaKitabetMethod2({ mizanulMevazin, dominant, getBastLevelFn });
  
  // Stage 2: Esma-i A'van
  const dominantB1 = getBastLevelFn(dominant, 1) || 0;
  const avan = calculateEsmaAvanMethod2({
    lastCompletedKitabetName: kitabet.lastCompletedName,
    dominantB1,
    mizanulMevazin,
    dominant,
    getBastLevelFn,
  });
  
  // Stage 3: Esma-i Kasem
  const kasem = calculateEsmaKasemMethod2({
    lastCompletedAvanName: avan.lastCompletedName,
    dominantB1,
    kitabetTotal: kitabet.total,
    mizanulMevazin,
    dominant,
    getBastLevelFn,
  });
  
  // Stage 4: Divine Names
  const divineNames = calculateDivineNamesMethod2({
    mizanulMevazin,
    kitabetTotal: kitabet.total,
    avanTotal: avan.total,
    kasemTotal: kasem.total,
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