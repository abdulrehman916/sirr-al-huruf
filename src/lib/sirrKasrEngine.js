// ═══════════════════════════════════════════════════════════════
// SIRR — Kasr Rules Engine (independent module)
// ═══════════════════════════════════════════════════════════════
// Processes ONLY the decimal (Kasr / الكسر) part of a division result.
//
// DOES NOT compute: Jafr, Ghutm, 1420 Constant, Kasr Pairing,
// ثابت الكسر, Shatm, or Final Result.
//
// The three Kasr rules below are implemented EXACTLY as specified by
// the SIRR source material. No simplification, optimization, or
// alternative algorithm is used.
//
// ── JAFR DEPENDENCY NOTICE ─────────────────────────────────────
// The spec requires First Jafr / Second Jafr to be computed via
// "the existing Jafr function already implemented in the project".
// No Jafr engine exists in this project at the time of writing.
// Rather than invent a Jafr algorithm (forbidden by project rules),
// this engine returns firstJafr / secondJafr as `null` with
// jafrStatus = "pending_engine_missing". Once a real SIRR Jafr engine
// is implemented, wire it into computeJafr() below — do NOT invent.
// ═══════════════════════════════════════════════════════════════

// ── Rule 1: one repeated digit until termination ──────────────
// All fractional digits are the SAME digit d.
// Kasr = d × 6  (use only the first six repetitions).
//   73.333333...  ->  digit 3  ->  3 × 6 = 18
//   24.444444...  ->  digit 4  ->  4 × 6 = 24
function applyRule1(frac) {
  if (frac.length === 0) return null;
  const d = frac[0];
  if (d < "0" || d > "9") return null;
  for (let i = 1; i < frac.length; i++) {
    if (frac[i] !== d) return null;
  }
  const digit = parseInt(d, 10);
  return {
    rule: "rule1",
    digit: d,
    repetitionCount: 6,
    kasr: digit * 6,
    detail: `${d} × 6`,
  };
}

// ── Rule 2: one repeated digit followed by another digit ───────
// A leading run of identical digit d (length L >= 2), then at least
// one different digit. Kasr = (d × L) + sum of every remaining digit.
//   36.666666666667  ->  6 repeated 12 times, then 7
//      ->  6 × 12 = 72  +  7  =  79
function applyRule2(frac) {
  if (frac.length < 3) return null;
  const d = frac[0];
  if (d < "0" || d > "9") return null;
  let L = 0;
  while (L < frac.length && frac[L] === d) L++;
  if (L < 2) return null;            // not a "repeated" digit
  if (L >= frac.length) return null; // no following digit -> Rule 1 territory
  const remaining = frac.slice(L);
  let remSum = 0;
  for (const ch of remaining) {
    if (ch >= "0" && ch <= "9") remSum += parseInt(ch, 10);
  }
  const remDetail = remaining.split("").join(" + ");
  return {
    rule: "rule2",
    digit: d,
    repetitionCount: L,
    kasr: parseInt(d, 10) * L + remSum,
    detail: `${d} × ${L} + ${remDetail}`,
  };
}

// ── Rule 3: a group of digits repeats ──────────────────────────
// Ignore all repeated cycles except one. Add the digits of ONE
// complete repeated group.
//   31.428571428571...  ->  group "428571"
//      ->  4 + 2 + 8 + 5 + 7 + 1 = 27
function applyRule3(frac) {
  const n = frac.length;
  for (let len = 2; len <= Math.floor(n / 2); len++) {
    const g = frac.slice(0, len);
    // require at least two full repetitions to confirm a repeating group
    if (frac.slice(len, len * 2) === g) {
      let sum = 0;
      for (const ch of g) sum += parseInt(ch, 10);
      return {
        rule: "rule3",
        group: g,
        kasr: sum,
        detail: g.split("").join(" + "),
      };
    }
  }
  return null;
}

// ── Jafr hook (NOT implemented — do not invent) ────────────────
// Returns a pending sentinel. Replace the body ONLY when a real
// SIRR Jafr engine exists in the project. Never fabricate values.
function computeJafr(/* value */) {
  return {
    value: null,
    pending: true,
    reason:
      "Jafr engine not yet implemented in project — First/Second Jafr cannot be computed without inventing (forbidden by project rules).",
  };
}

/**
 * calculateKasr — the single public API of the Kasr Rules Engine.
 *
 * @param {string|number} quotient  The full division result, e.g.
 *                                  "73.333333333333" or 36.666666666667.
 *                                  A string is preferred so every decimal
 *                                  digit is preserved exactly (float
 *                                  rounding can change the repeated-digit
 *                                  count and alter the Kasr value).
 *
 * @returns {Object} {
 *   integer,      // string — الصحيح (integer part)
 *   kasrValue,    // number|null — الكسر
 *   rule,         // "rule1" | "rule2" | "rule3" | "no_fraction" | "unrecognized"
 *   detail,       // human-readable breakdown of the applied rule
 *   firstJafr,    // null (pending Jafr engine)
 *   secondJafr,   // null (pending Jafr engine)
 *   jafrStatus,   // "pending_engine_missing"
 *   jafrReason,   // string
 * }
 */
export function calculateKasr(quotient) {
  let qStr = typeof quotient === "string" ? quotient : String(quotient);
  qStr = qStr.trim();

  // split integer / fractional parts
  let integerPart = "0";
  let fracPart = "";
  if (qStr.includes(".")) {
    const [i, f] = qStr.split(".");
    integerPart = i || "0";
    fracPart = f || "";
  } else {
    integerPart = qStr || "0";
    fracPart = "";
  }
  // keep only digits in the fractional part (strip "..." etc.)
  fracPart = fracPart.replace(/[^0-9]/g, "");

  let kasrValue = null;
  let rule = "none";
  let detail = "";

  if (fracPart.length === 0) {
    kasrValue = 0;
    rule = "no_fraction";
    detail = "No fractional part";
  } else {
    const r1 = applyRule1(fracPart);
    if (r1) {
      kasrValue = r1.kasr;
      rule = r1.rule;
      detail = r1.detail;
    } else {
      const r2 = applyRule2(fracPart);
      if (r2) {
        kasrValue = r2.kasr;
        rule = r2.rule;
        detail = r2.detail;
      } else {
        const r3 = applyRule3(fracPart);
        if (r3) {
          kasrValue = r3.kasr;
          rule = r3.rule;
          detail = r3.detail;
        } else {
          kasrValue = null;
          rule = "unrecognized";
          detail = "No matching Kasr rule (reference rule not found)";
        }
      }
    }
  }

  // First / Second Jafr — delegate to the Jafr hook (currently pending).
  const first = computeJafr(kasrValue);
  const second = computeJafr(first.value);

  return {
    integer: integerPart,
    kasrValue,
    rule,
    detail,
    firstJafr: first.value,
    secondJafr: second.value,
    jafrStatus: first.pending ? "pending_engine_missing" : "computed",
    jafrReason: first.reason || "",
  };
}