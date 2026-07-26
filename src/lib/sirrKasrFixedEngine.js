// ═══════════════════════════════════════════════════════════════
// KASR FIXED ENGINE (1420 → 20)
// ═══════════════════════════════════════════════════════════════
// COMPLETELY INDEPENDENT. Isolated from Kar, Dafr, Ghutm, Mizan,
// the Kasr Rules Engine, and every other Method/Section.
//
// INPUTS: the already-calculated outputs of the Kar (220) and
// Dafr (284) engines, exactly as defined by the source book:
//   Kar:  CorrectSum = 620, FirstJafr = 9, SecondJafr = 9
//   Dafr: CorrectSum = 800, FirstJafr = 5, SecondJafr = 5
// These inputs are NOT recalculated here — they are consumed as-is.
//
// STEPS (verbatim from the source book):
//   Step 1  FixedCorrectNumber = KarCorrect + DafrCorrect
//                                = 620 + 800 = 1420
//   Step 2  KasrPartA:
//           KarFirstJafr(9) + DafrSecondJafr(5) = 14  → Jafr(14)=5
//           Repeat second side: 9 + 5 = 14             → 5
//           5 + 5 = 10                                   → KasrPartA = 10
//   Step 3  KasrPartB:
//           KarSecondJafr(9) + DafrFirstJafr(5) = 14     → Jafr(14)=5
//           Repeat second side: 14                       → 5
//           5 + 5 = 10                                   → KasrPartB = 10
//   Step 4  FixedKasr = KasrPartA + KasrPartB = 10 + 10 = 20
//
// RULES: never invent, never estimate, never hard-code the OUTPUTS.
// Every value below is computed from the source-defined inputs.
// ═══════════════════════════════════════════════════════════════

// Source-defined inputs (from the Kar 220 and Dafr 284 engines).
export const KASR_FIXED_SOURCE_INPUTS = Object.freeze({
  karCorrectSum: 620,
  karFirstJafr: 9,
  karSecondJafr: 9,
  dafrCorrectSum: 800,
  dafrFirstJafr: 5,
  dafrSecondJafr: 5,
});

// ── Jafr reduction: digit-sum to a single digit. 14 → 5, 9 → 9, 5 → 5 ──
function reduceToJafr(n) {
  let v = Math.abs(Math.trunc(n));
  while (v >= 10) {
    v = String(v).split("").reduce((s, d) => s + Number(d), 0);
  }
  return v;
}

// ── One side of a Kasr part: (a + b) reduced to Jafr ──
function jafrSide(a, b) {
  const raw = a + b;
  return { raw, jafr: reduceToJafr(raw) };
}

// ── Main engine ──
export function calculateKasrFixed(inputs = KASR_FIXED_SOURCE_INPUTS) {
  const {
    karCorrectSum, karFirstJafr, karSecondJafr,
    dafrCorrectSum, dafrFirstJafr, dafrSecondJafr,
  } = inputs;

  // Step 1 — Fixed Correct Number
  const fixedCorrectNumber = karCorrectSum + dafrCorrectSum;

  // Step 2 — Kasr Part A: KarFirst + DafrSecond (two sides), then sum
  const aSide1 = jafrSide(karFirstJafr, dafrSecondJafr); // 9 + 5 = 14 → 5
  const aSide2 = jafrSide(karFirstJafr, dafrSecondJafr); // 9 + 5 = 14 → 5
  const kasrPartA = aSide1.jafr + aSide2.jafr;            // 5 + 5 = 10

  // Step 3 — Kasr Part B: KarSecond + DafrFirst (two sides), then sum
  const bSide1 = jafrSide(karSecondJafr, dafrFirstJafr); // 9 + 5 = 14 → 5
  const bSide2 = jafrSide(karSecondJafr, dafrFirstJafr); // 9 + 5 = 14 → 5
  const kasrPartB = bSide1.jafr + bSide2.jafr;            // 5 + 5 = 10

  // Step 4 — Fixed Kasr
  const fixedKasr = kasrPartA + kasrPartB;                // 10 + 10 = 20

  return {
    inputs: {
      karCorrectSum, karFirstJafr, karSecondJafr,
      dafrCorrectSum, dafrFirstJafr, dafrSecondJafr,
    },
    fixedCorrectNumber,
    kasrPartA,
    kasrPartB,
    fixedKasr,
    steps: {
      partA: { side1: aSide1, side2: aSide2, sum: kasrPartA },
      partB: { side1: bSide1, side2: bSide2, sum: kasrPartB },
    },
  };
}

// ── Permanent fixed values (computed once from the source inputs) ──
export const KASR_FIXED_RESULT = Object.freeze(calculateKasrFixed());