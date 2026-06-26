import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { istintak, getBastLevel } from "../../lib/mizaanPostEngine";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  border: "rgba(212,175,55,0.40)",
  bg: "rgba(212,175,55,0.06)",
};

// Method 2: Calculate mahrac (number of digits in the total)
function calculateMahrac(total) {
  return total.toString().length;
}

// Method 2: Derivation uses 4th bast for zevc (even), 5th bast for ferd (odd)
function deriveWithMethod2Bast(letters, bastLevelFn) {
  return letters.map(letter => {
    const bastValue = bastLevelFn(letter, 4); // 4th bast for initial derivation
    const derived = istintak(bastValue);
    return {
      original: letter,
      bastValue,
      derived,
    };
  });
}

export default function Method2Pipeline({ grandBast, grandLetters, dominant, onVefkReady, getBastLevelFn }) {
  const [method2Result, setMethod2Result] = useState(null);

  useEffect(() => {
    if (!grandBast || grandBast <= 0) return;

    // Method 2: Add mahrac to grand total
    const mahrac = calculateMahrac(grandBast);
    const mizanulMevazin = grandBast + mahrac;

    // Istintak of Mizanül mevazin
    const seedLetters = istintak(mizanulMevazin);

    // Method 2: Check if zevc (even) or ferd (odd)
    const isZevc = seedLetters.length % 2 === 0;

    // Derive using 4th bast (for zevc) or 5th bast (for ferd)
    const bastLevel = isZevc ? 4 : 5;
    const derivedLetters = seedLetters.map(letter => {
      const value = getBastLevelFn(letter, bastLevel);
      return { letter, value, derived: istintak(value) };
    });

    setMethod2Result({
      mahrac,
      mizanulMevazin,
      seedLetters,
      isZevc,
      bastLevel,
      derivedLetters,
    });

    if (onVefkReady) {
      onVefkReady({
        mizanulMevazin,
        seedLetters,
        derivedLetters,
      });
    }
  }, [grandBast, grandLetters, dominant, onVefkReady, getBastLevelFn]);

  if (!method2Result) return null;

  return (
    <div className="rounded-2xl border overflow-hidden" style={{
      background: "rgba(3,6,20,0.99)",
      borderColor: G.borderHi,
      boxShadow: `0 0 80px ${G.glow}, inset 0 1px 0 rgba(212,175,55,0.08)`,
    }}>
      {/* Header */}
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
              Mahrac Addition Pipeline
            </p>
          </div>
        </div>
      </div>

      {/* Calculation Steps */}
      <div className="px-6 py-5 space-y-4">
        {/* Step 1: Grand Total */}
        <div className="rounded-xl p-4" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
            Step 1 — Grand Total from 9 Mizan
          </p>
          <div className="flex items-baseline gap-3">
            <span className="font-amiri text-3xl font-bold" style={{ color: G.text }}>{grandBast.toLocaleString()}</span>
            <span className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>
              ({grandLetters} letters)
            </span>
          </div>
        </div>

        {/* Step 2: Mahrac Calculation */}
        <div className="rounded-xl p-4" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
            Step 2 — Mahrac (مخرج)
          </p>
          <div className="space-y-2">
            <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.70)" }}>
              Number of digits in {grandBast.toLocaleString()}:
            </p>
            <span className="font-amiri text-2xl font-bold" style={{ color: G.text }}>{method2Result.mahrac}</span>
          </div>
        </div>

        {/* Step 3: Mizanül Mevazin */}
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
              {grandBast.toLocaleString()} + {method2Result.mahrac} =
            </span>
            <span className="font-amiri text-4xl font-bold" style={{
              color: G.text,
              textShadow: `0 0 24px ${G.glow}`,
            }}>
              {method2Result.mizanulMevazin.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Step 4: Istintak */}
        <div className="rounded-xl p-4" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.dim }}>
            Step 4 — Istintak of Mizanül Mevazin
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {method2Result.seedLetters.map((letter, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="font-amiri text-2xl font-bold" style={{ color: G.text }}>{letter}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center">
            <span className="font-inter text-[10px] px-2 py-1 rounded-full" style={{
              background: method2Result.isZevc ? "rgba(34,197,94,0.15)" : "rgba(59,130,246,0.15)",
              border: `1px solid ${method2Result.isZevc ? "rgba(34,197,94,0.40)" : "rgba(59,130,246,0.40)"}`,
              color: method2Result.isZevc ? "#4ade80" : "#60a5fa",
            }}>
              {method2Result.isZevc ? "Zevc (Even)" : "Ferd (Odd)"} — {method2Result.seedLetters.length} letters
            </span>
          </div>
        </div>

        {/* Step 5: Derivation Bast Level */}
        <div className="rounded-xl p-4" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
            Step 5 — Derivation Bast Level
          </p>
          <p className="font-inter text-xs mb-3" style={{ color: "rgba(255,255,255,0.70)" }}>
            {method2Result.isZevc ? "Zevc (even) → Use 4th Bast" : "Ferd (odd) → Use 5th Bast"}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {method2Result.derivedLetters.map((item, i) => (
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
      </div>
    </div>
  );
}