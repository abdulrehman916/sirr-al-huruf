import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { istintak, expandAllSeedLetters } from "../../lib/mizaanPostEngine";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  glowHi: "rgba(212,175,55,0.55)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  border: "rgba(212,175,55,0.40)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

// Calculate mahrac (number of digits)
function calculateMahrac(total) {
  return total.toString().length;
}

// Group letters into names (4 for zevc, 5 for ferd)
function groupLettersIntoNames(letters, lettersPerName) {
  const names = [];
  for (let i = 0; i < letters.length; i += lettersPerName) {
    const group = letters.slice(i, i + lettersPerName);
    if (group.length === lettersPerName) {
      names.push(group);
    }
  }
  const remaining = letters.length % lettersPerName;
  return { names, remaining: remaining > 0 ? letters.slice(-remaining) : [] };
}

// Calculate bast value of Arabic text
function calcBastValue(text, bastLevel, getBastLevelFn) {
  const clean = text.replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, '').replace(/\s+/g, '');
  let total = 0;
  for (const char of clean) {
    total += getBastLevelFn(char, bastLevel) || 0;
  }
  return total;
}

export default function Method2Pipeline({ grandBast, grandLetters, dominant, onVefkReady, getBastLevelFn }) {
  const [pipeline, setPipeline] = useState(null);
  const [loading, setLoading] = useState(false);

  const runPipeline = useCallback(() => {
    if (!grandBast || grandBast <= 0) return;

    setLoading(true);

    // STEP 1: Grand Total (from 9 Mizan - same as Method 1)
    const step1Total = grandBast;
    const step1Letters = grandLetters;

    // STEP 2: Mahrac calculation
    const mahrac = calculateMahrac(step1Total);

    // STEP 3: Mizanül Mevazin
    const mizanulMevazin = step1Total + mahrac;

    // STEP 4: Istintak of Mizanül Mevazin
    const step4Letters = istintak(mizanulMevazin);

    // STEP 5: Check Zevc/Ferd
    const isZevc5 = step4Letters.length % 2 === 0;
    const bastLevel5 = isZevc5 ? 4 : 5;

    // STEP 6: Derive each letter with 4th/5th bast
    const step6Derived = step4Letters.map(letter => {
      const value = getBastLevelFn(letter, bastLevel5);
      return {
        letter,
        value,
        derived: istintak(value),
      };
    });

    // STEP 7: Flatten all derived letters
    const step7AllLetters = step6Derived.flatMap(d => d.derived);

    // STEP 8: Group into Esma-i Kitabet names
    const lettersPerNameKitabet = isZevc5 ? 4 : 5;
    const kitabetGrouping = groupLettersIntoNames(step7AllLetters, lettersPerNameKitabet);

    // STEP 9: Calculate Esma-i Kitabet total
    let kitabetTotal = 0;
    if (kitabetGrouping.names.length > 0) {
      // Last name's first bast
      const lastName = kitabetGrouping.names[kitabetGrouping.names.length - 1];
      const lastNameBast = calcBastValue(lastName.join(''), 1, getBastLevelFn);
      
      // Dominant element bast
      const ELEMENT_BAST = { fire: 4015, earth: 4015, air: 4015, water: 4015 };
      const dominantBast = ELEMENT_BAST[dominant] || 4015;

      // Mizanül Mevazin
      kitabetTotal = lastNameBast + dominantBast + mizanulMevazin;
    }

    // STEP 10: Istintak of Esma-i Kitabet total
    const step10Letters = istintak(kitabetTotal);

    // STEP 11: Check Zevc/Ferd for Esma-i A'van
    const isZevc11 = step10Letters.length % 2 === 0;
    const bastLevel11 = isZevc11 ? 4 : 5;

    // STEP 12: Derive each letter for Esma-i A'van
    const step12Derived = step10Letters.map(letter => {
      const value = getBastLevelFn(letter, bastLevel11);
      return {
        letter,
        value,
        derived: istintak(value),
      };
    });

    // STEP 13: Flatten all derived letters for A'van
    const step13AllLetters = step12Derived.flatMap(d => d.derived);

    // STEP 14: Group into Esma-i A'van names
    const lettersPerNameAvan = isZevc11 ? 4 : 5;
    const avanGrouping = groupLettersIntoNames(step13AllLetters, lettersPerNameAvan);

    // STEP 15: Calculate Esma-i Kasem total
    let kasemTotal = 0;
    if (avanGrouping.names.length > 0) {
      // Similar logic as kitabet
      const lastAvanName = avanGrouping.names[avanGrouping.names.length - 1];
      const lastAvanBast = calcBastValue(lastAvanName.join(''), 1, getBastLevelFn);
      const dominantBast = 4015;
      const avanTotal = lastAvanBast + dominantBast + kitabetTotal;
      
      kasemTotal = avanTotal;
    }

    // STEP 16: Istintak of Esma-i Kasem total
    const step16Letters = istintak(kasemTotal);

    // STEP 17: Check Zevc/Ferd for Esma-i Kasem
    const isZevc17 = step16Letters.length % 2 === 0;
    const bastLevel17 = isZevc17 ? 4 : 5;

    // STEP 18: Derive each letter for Esma-i Kasem
    const step18Derived = step16Letters.map(letter => {
      const value = getBastLevelFn(letter, bastLevel17);
      return {
        letter,
        value,
        derived: istintak(value),
      };
    });

    // STEP 19: Flatten all derived letters for Kasem
    const step19AllLetters = step18Derived.flatMap(d => d.derived);

    // STEP 20: Group into Esma-i Kasem names
    const lettersPerNameKasem = isZevc17 ? 4 : 5;
    const kasemGrouping = groupLettersIntoNames(step19AllLetters, lettersPerNameKasem);

    const result = {
      step1: { total: step1Total, letters: step1Letters },
      step2: { mahrac },
      step3: { mizanulMevazin },
      step4: { letters: step4Letters, isZevc: isZevc5, bastLevel: bastLevel5 },
      step6: { derived: step6Derived },
      step7: { allLetters: step7AllLetters },
      step8: { names: kitabetGrouping.names, remaining: kitabetGrouping.remaining, lettersPerName: lettersPerNameKitabet },
      step9: { kitabetTotal },
      step10: { letters: step10Letters },
      step11: { isZevc: isZevc11, bastLevel: bastLevel11 },
      step12: { derived: step12Derived },
      step13: { allLetters: step13AllLetters },
      step14: { names: avanGrouping.names, remaining: avanGrouping.remaining, lettersPerName: lettersPerNameAvan },
      step15: { kasemTotal },
      step16: { letters: step16Letters },
      step17: { isZevc: isZevc17, bastLevel: bastLevel17 },
      step18: { derived: step18Derived },
      step19: { allLetters: step19AllLetters },
      step20: { names: kasemGrouping.names, remaining: kasemGrouping.remaining, lettersPerName: lettersPerNameKasem },
    };

    setPipeline(result);

    if (onVefkReady) {
      onVefkReady({
        kitabetNames: kitabetGrouping.names,
        avanNames: avanGrouping.names,
        kasemNames: kasemGrouping.names,
      });
    }

    setLoading(false);
  }, [grandBast, grandLetters, dominant, onVefkReady, getBastLevelFn]);

  useEffect(() => {
    runPipeline();
  }, [runPipeline]);

  if (loading || !pipeline) {
    return (
      <div className="rounded-2xl border p-8 text-center" style={{
        background: "rgba(212,175,55,0.06)",
        borderColor: "rgba(212,175,55,0.30)",
      }}>
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl border overflow-hidden" style={{
        background: "rgba(3,6,20,0.99)",
        borderColor: G.borderHi,
        boxShadow: `0 0 80px ${G.glow}, inset 0 1px 0 rgba(212,175,55,0.08)`,
      }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: G.border }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-inter text-lg font-black" style={{
              background: "rgba(245,208,96,0.12)",
              border: `1px solid ${G.border}`,
              color: G.text,
            }}>
              ۲
            </div>
            <div>
              <h3 className="font-inter text-sm font-bold uppercase tracking-widest" style={{ color: G.text }}>
                Method 2 — Adetlerin Bastı
              </h3>
              <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                Complete Pipeline
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1-3: Initial Calculation */}
      <div className="rounded-2xl border overflow-hidden" style={{
        background: "rgba(3,6,20,0.99)",
        borderColor: G.border,
      }}>
        <div className="px-6 py-4 space-y-4">
          {/* Step 1 */}
          <div className="rounded-xl p-4" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
              Step 1 — Grand Total (9 Mizan)
            </p>
            <div className="flex items-baseline gap-3">
              <span className="font-amiri text-3xl font-bold" style={{ color: G.text }}>{pipeline.step1.total.toLocaleString()}</span>
              <span className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>
                ({pipeline.step1.letters} letters)
              </span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl p-4" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
              Step 2 — Mahrac (مخرج)
            </p>
            <span className="font-amiri text-2xl font-bold" style={{ color: G.text }}>{pipeline.step2.mahrac}</span>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl p-4" style={{
            background: "linear-gradient(145deg, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.05) 100%)",
            border: `1px solid ${G.borderHi}`,
            boxShadow: `0 0 20px ${G.glow}`,
          }}>
            <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
              Step 3 — Mizanül Mevazin (ميزان الموازين)
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.70)" }}>
                {pipeline.step1.total.toLocaleString()} + {pipeline.step2.mahrac} =
              </span>
              <span className="font-amiri text-4xl font-bold" style={{
                color: G.text,
                textShadow: `0 0 24px ${G.glow}`,
              }}>
                {pipeline.step3.mizanulMevazin.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4-8: Esma-i Kitabet */}
      <div className="rounded-2xl border overflow-hidden" style={{
        background: "rgba(3,6,20,0.99)",
        borderColor: G.border,
      }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: G.border }}>
          <h4 className="font-inter text-sm font-bold uppercase tracking-widest" style={{ color: G.text }}>
            Esma-i Kitabet (أسماء الكتابة)
          </h4>
        </div>
        <div className="px-6 py-4 space-y-4">
          {/* Step 4 */}
          <div className="rounded-xl p-4" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <p className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.dim }}>
              Step 4 — Istintak of Mizanül Mevazin
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {pipeline.step4.letters.map((letter, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="font-amiri text-2xl font-bold" style={{ color: G.text }}>{letter}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              <span className="font-inter text-[10px] px-2 py-1 rounded-full" style={{
                background: pipeline.step4.isZevc ? "rgba(34,197,94,0.15)" : "rgba(59,130,246,0.15)",
                border: `1px solid ${pipeline.step4.isZevc ? "rgba(34,197,94,0.40)" : "rgba(59,130,246,0.40)"}`,
                color: pipeline.step4.isZevc ? "#4ade80" : "#60a5fa",
              }}>
                {pipeline.step4.isZevc ? "Zevc (Even)" : "Ferd (Odd)"} — {pipeline.step4.letters.length} letters → {pipeline.step4.bastLevel}th Bast
              </span>
            </div>
          </div>

          {/* Step 6-7 */}
          <div className="rounded-xl p-4" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <p className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.dim }}>
              Step 6-7 — Derivation & Expansion
            </p>
            <div className="grid grid-cols-2 gap-2">
              {pipeline.step6.derived.map((item, i) => (
                <div key={i} className="rounded-lg p-2 text-center" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${G.border}` }}>
                  <div className="font-amiri text-lg font-bold mb-1" style={{ color: G.text }}>{item.letter}</div>
                  <div className="font-inter text-[9px]" style={{ color: G.dim }}>{item.value.toLocaleString()}</div>
                  <div className="flex flex-wrap gap-1 justify-center mt-2">
                    {item.derived.map((d, j) => (
                      <span key={j} className="font-amiri text-sm" style={{ color: "rgba(255,255,255,0.70)" }}>{d}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 8: Esma-i Kitabet Names */}
          <div className="rounded-xl p-4" style={{
            background: "linear-gradient(145deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.04) 100%)",
            border: `1px solid ${G.borderHi}`,
          }}>
            <p className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.dim }}>
              Step 8 — Esma-i Kitabet Names
            </p>
            <div className="space-y-2">
              {pipeline.step8.names.map((name, i) => (
                <div key={i} className="rounded-lg p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${G.border}` }}>
                  <div className="font-amiri text-2xl font-bold mb-2" style={{ color: G.text, textShadow: `0 0 16px ${G.glow}` }}>
                    {name.join(' ')}
                  </div>
                  <div className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                    Name {i + 1}
                  </div>
                </div>
              ))}
              {pipeline.step8.remaining.length > 0 && (
                <div className="rounded-lg p-3 text-center" style={{ background: "rgba(59,130,246,0.10)", border: `1px solid rgba(59,130,246,0.40)` }}>
                  <div className="font-amiri text-xl font-bold mb-2" style={{ color: "#60a5fa" }}>
                    {pipeline.step8.remaining.join(' ')}
                  </div>
                  <div className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                    Remaining ({pipeline.step8.remaining.length} letters)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step 10-14: Esma-i A'van */}
      <div className="rounded-2xl border overflow-hidden" style={{
        background: "rgba(3,6,20,0.99)",
        borderColor: G.border,
      }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: G.border }}>
          <h4 className="font-inter text-sm font-bold uppercase tracking-widest" style={{ color: G.text }}>
            Esma-i A'van (أسماء الأعوان)
          </h4>
        </div>
        <div className="px-6 py-4 space-y-4">
          {/* Step 10 */}
          <div className="rounded-xl p-4" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <p className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.dim }}>
              Step 10 — Istintak (Total: {pipeline.step9.kitabetTotal.toLocaleString()})
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {pipeline.step10.letters.map((letter, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="font-amiri text-2xl font-bold" style={{ color: G.text }}>{letter}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              <span className="font-inter text-[10px] px-2 py-1 rounded-full" style={{
                background: pipeline.step11.isZevc ? "rgba(34,197,94,0.15)" : "rgba(59,130,246,0.15)",
                border: `1px solid ${pipeline.step11.isZevc ? "rgba(34,197,94,0.40)" : "rgba(59,130,246,0.40)"}`,
                color: pipeline.step11.isZevc ? "#4ade80" : "#60a5fa",
              }}>
                {pipeline.step11.isZevc ? "Zevc (Even)" : "Ferd (Odd)"} — {pipeline.step10.letters.length} letters → {pipeline.step11.bastLevel}th Bast
              </span>
            </div>
          </div>

          {/* Step 14: Esma-i A'van Names */}
          <div className="rounded-xl p-4" style={{
            background: "linear-gradient(145deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.04) 100%)",
            border: `1px solid ${G.borderHi}`,
          }}>
            <p className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.dim }}>
              Step 14 — Esma-i A'van Names
            </p>
            <div className="space-y-2">
              {pipeline.step14.names.map((name, i) => (
                <div key={i} className="rounded-lg p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${G.border}` }}>
                  <div className="font-amiri text-2xl font-bold mb-2" style={{ color: G.text, textShadow: `0 0 16px ${G.glow}` }}>
                    {name.join(' ')}
                  </div>
                  <div className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                    Name {i + 1}
                  </div>
                </div>
              ))}
              {pipeline.step14.remaining.length > 0 && (
                <div className="rounded-lg p-3 text-center" style={{ background: "rgba(59,130,246,0.10)", border: `1px solid rgba(59,130,246,0.40)` }}>
                  <div className="font-amiri text-xl font-bold mb-2" style={{ color: "#60a5fa" }}>
                    {pipeline.step14.remaining.join(' ')}
                  </div>
                  <div className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                    Remaining ({pipeline.step14.remaining.length} letters)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step 16-20: Esma-i Kasem */}
      <div className="rounded-2xl border overflow-hidden" style={{
        background: "rgba(3,6,20,0.99)",
        borderColor: G.border,
      }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: G.border }}>
          <h4 className="font-inter text-sm font-bold uppercase tracking-widest" style={{ color: G.text }}>
            Esma-i Kasem (أسماء القسم)
          </h4>
        </div>
        <div className="px-6 py-4 space-y-4">
          {/* Step 16 */}
          <div className="rounded-xl p-4" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <p className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.dim }}>
              Step 16 — Istintak (Total: {pipeline.step15.kasemTotal.toLocaleString()})
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {pipeline.step16.letters.map((letter, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="font-amiri text-2xl font-bold" style={{ color: G.text }}>{letter}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              <span className="font-inter text-[10px] px-2 py-1 rounded-full" style={{
                background: pipeline.step17.isZevc ? "rgba(34,197,94,0.15)" : "rgba(59,130,246,0.15)",
                border: `1px solid ${pipeline.step17.isZevc ? "rgba(34,197,94,0.40)" : "rgba(59,130,246,0.40)"}`,
                color: pipeline.step17.isZevc ? "#4ade80" : "#60a5fa",
              }}>
                {pipeline.step17.isZevc ? "Zevc (Even)" : "Ferd (Odd)"} — {pipeline.step16.letters.length} letters → {pipeline.step17.bastLevel}th Bast
              </span>
            </div>
          </div>

          {/* Step 20: Esma-i Kasem Names */}
          <div className="rounded-xl p-4" style={{
            background: "linear-gradient(145deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.04) 100%)",
            border: `1px solid ${G.borderHi}`,
          }}>
            <p className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.dim }}>
              Step 20 — Esma-i Kasem Names
            </p>
            <div className="space-y-2">
              {pipeline.step20.names.map((name, i) => (
                <div key={i} className="rounded-lg p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${G.border}` }}>
                  <div className="font-amiri text-2xl font-bold mb-2" style={{ color: G.text, textShadow: `0 0 16px ${G.glow}` }}>
                    {name.join(' ')}
                  </div>
                  <div className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                    Name {i + 1}
                  </div>
                </div>
              ))}
              {pipeline.step20.remaining.length > 0 && (
                <div className="rounded-lg p-3 text-center" style={{ background: "rgba(59,130,246,0.10)", border: `1px solid rgba(59,130,246,0.40)` }}>
                  <div className="font-amiri text-xl font-bold mb-2" style={{ color: "#60a5fa" }}>
                    {pipeline.step20.remaining.join(' ')}
                  </div>
                  <div className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                    Remaining ({pipeline.step20.remaining.length} letters)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}