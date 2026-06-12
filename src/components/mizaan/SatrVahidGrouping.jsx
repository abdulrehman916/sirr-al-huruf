import { useMemo } from "react";
import { motion } from "framer-motion";
import { getBastLevel, istintak, GALIB_ANASIR_VALUES } from "../../lib/mizaanPostEngine";
import EsmaVefkiSection from "./EsmaVefkiSection";

// ── Design tokens ─────────────────────────────────────────────
const G = {
  gold:     "#F5D060",
  goldDim:  "rgba(245,208,96,0.55)",
  goldFaint:"rgba(245,208,96,0.12)",
  goldBorder:"rgba(212,175,55,0.40)",
  goldBorderHi:"rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.18)",
  bg:       "rgba(3,6,20,0.99)",
  bgCard:   "rgba(8,16,40,0.98)",
  bgInner:  "rgba(212,175,55,0.06)",
  green:    "#4ADE80",
  greenDim: "rgba(74,222,128,0.15)",
  red:      "#F87171",
  redDim:   "rgba(248,113,113,0.15)",
  purple:   "#C4B5FD",
  purpleDim:"rgba(196,181,253,0.15)",
  blue:     "#93C5FD",
  blueDim:  "rgba(147,197,253,0.15)",
  white:    "rgba(255,255,255,0.85)",
  dim:      "rgba(255,255,255,0.35)",
};

// ── Shared sub-components ──────────────────────────────────────

function SectionHeader({ label, arabic, step, color = G.gold }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg font-inter text-xs font-black flex-shrink-0"
        style={{ background: color + "22", border: `1px solid ${color}55`, color }}>
        {step}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-inter text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color }}>{label}</span>
          {arabic && <span className="font-amiri text-sm" style={{ color: G.goldDim }}>{arabic}</span>}
        </div>
      </div>
      <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(to right, ${color}40, transparent)` }} />
    </div>
  );
}

function LetterCell({ letter, index, color = G.gold, size = "lg", showIndex = false, bgColor }) {
  const sizes = { sm: "text-lg px-2 py-1", lg: "text-2xl px-3 py-2", xl: "text-3xl px-4 py-2.5" };
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className={`font-amiri font-bold rounded-lg border ${sizes[size]}`}
        style={{
          color,
          borderColor: color + "55",
          background: bgColor || color + "12",
          lineHeight: 1.2,
          display: "inline-block",
        }}
      >
        {letter}
      </span>
      {showIndex && (
        <span className="font-inter text-[8px] tabular-nums" style={{ color: G.dim }}>{index + 1}</span>
      )}
    </div>
  );
}

function LetterRow({ letters, color = G.gold, size = "lg", showIndex = false, rtl = false }) {
  if (!letters || letters.length === 0) return (
    <span className="font-inter text-xs italic" style={{ color: G.dim }}>—</span>
  );
  return (
    <div className="flex flex-wrap gap-1.5 items-center" style={{ direction: rtl ? "rtl" : "ltr", unicodeBidi: rtl ? "normal" : "isolate" }}>
      {letters.map((l, i) => (
        <LetterCell key={i} letter={l} index={i} color={color} size={size} showIndex={showIndex} />
      ))}
    </div>
  );
}

function Arrow({ label }) {
  return (
    <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
      <span className="font-inter text-base" style={{ color: G.goldDim }}>→</span>
      {label && <span className="font-inter text-[7px] uppercase tracking-wider" style={{ color: G.dim }}>{label}</span>}
    </div>
  );
}

function Card({ children, accent, className = "" }) {
  return (
    <div
      className={`rounded-xl border p-4 ${className}`}
      style={{
        background: G.bgCard,
        borderColor: accent ? accent + "55" : G.goldBorder,
        borderLeft: accent ? `3px solid ${accent}` : undefined,
        boxShadow: `0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,175,55,0.05)`,
      }}
    >
      {children}
    </div>
  );
}

function StatRow({ label, value, valueColor = G.gold }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: G.goldBorder + "55" }}>
      <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{label}</span>
      <span className="font-inter text-sm font-bold tabular-nums" style={{ color: valueColor }}>{value}</span>
    </div>
  );
}

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${G.goldBorder})` }} />
      <span style={{ color: G.goldDim, fontSize: 10 }}>✦</span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${G.goldBorder})` }} />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
export default function SatrVahidGrouping({
  satrVahidLetters = [],
  dominant = "fire",
}) {
  const safeSeed = Array.isArray(satrVahidLetters) ? satrVahidLetters : [];
  const totalSeed = safeSeed.length;
  const isSeedFerd = totalSeed % 2 !== 0;
  const bastLevel = isSeedFerd ? 5 : 4;
  const bastLabelAr = bastLevel === 5 ? "البسط الخامس" : "البسط الرابع";

  // ── B: Bast Summation (running totals) ──
  const { totalBastSum, letterBastDetails } = useMemo(() => {
    let runningSum = 0;
    const details = [];
    for (let i = safeSeed.length - 1; i >= 0; i--) {
      const letter = safeSeed[i];
      const bastValue = getBastLevel(letter, bastLevel);
      runningSum += bastValue;
      details.push({
        letter,
        bastValue,
        runningTotal: runningSum,
        originalIndex: i,
      });
    }
    return { totalBastSum: runningSum, letterBastDetails: details };
  }, [safeSeed, bastLevel]);

  // ── C: Individual derivations (LAST → FIRST processing order) ──
  const { derivations, concatenated } = useMemo(() => {
    const d = [];
    for (let i = safeSeed.length - 1; i >= 0; i--) {
      const letter = safeSeed[i];
      const bastValue = getBastLevel(letter, bastLevel);
      const extracted = istintak(bastValue);
      d.push({ letter, bastValue, extracted, originalIndex: i });
    }
    return { derivations: d, concatenated: d.flatMap(x => x.extracted) };
  }, [safeSeed, bastLevel]);

  // ── E: Combined Total (Bast Sum + Letter Count) ──
  const combinedTotal = totalBastSum + totalSeed;

  // ── F: Converted Letters (Istintak of Combined Total) ──
  const convertedLetters = useMemo(() => {
    return istintak(combinedTotal);
  }, [combinedTotal]);

  // ── G: Group Formation Process ──
  const groupFormation = useMemo(() => {
    const isFerd = convertedLetters.length % 2 !== 0;
    const gSize = isFerd ? 5 : 4;
    const rem = convertedLetters.length % gSize;
    let seq = [...convertedLetters];
    let supp = [];
    if (rem > 0) {
      const needed = gSize - rem;
      const galibVal = GALIB_ANASIR_VALUES[dominant] || GALIB_ANASIR_VALUES.fire;
      supp = istintak(galibVal).slice(0, needed);
      seq = [...convertedLetters, ...supp];
    }
    const grps = [];
    for (let i = 0; i < seq.length; i += gSize) {
      const g = seq.slice(i, i + gSize);
      grps.push({
        letters: g,
        name: g.join(""),
        groupNumber: Math.floor(i / gSize) + 1,
        stepNumber: i + 1,
      });
    }
    return {
      finalSequence: seq,
      supplement: supp,
      remainder: rem,
      groups: grps,
      groupSize: gSize,
      isFerd,
    };
  }, [convertedLetters, dominant]);

  // ── D parity (for display only) ──
  const isSatrFerd = concatenated.length % 2 !== 0;

  const dominantLabel = { fire: "النار", earth: "التراب", air: "الهواء", water: "الماء" }[dominant] || dominant;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background: G.bg,
        borderColor: G.goldBorderHi,
        boxShadow: `0 0 80px ${G.glow}, 0 0 160px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.08)`,
      }}
    >
      {/* ══ Top accent line ══ */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />

      {/* ══ Title Banner ══ */}
      <div className="text-center px-6 pt-6 pb-4">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl border mb-3"
          style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
          <span className="font-inter text-[9px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>Manuscript Pipeline Analysis</span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <h2 className="font-amiri text-3xl font-bold" style={{ color: G.gold }}>سَطْر وَاحِد</h2>
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: G.goldDim }}>Satr-i Vahid — Complete Derivation Chain</p>
      </div>

      <OrnamentalDivider />

      <div className="px-4 pb-6 space-y-5 pt-4">

        {/* ══ A: ORIGINAL LETTERS ══ */}
        <Card accent={G.gold}>
          <SectionHeader step="A" label="Original Seed Letters" arabic="الحروف الأصلية" color={G.gold} />
          <div className="flex flex-wrap gap-2 justify-center mb-3">
            <LetterRow letters={safeSeed} color={G.gold} size="xl" showIndex rtl />
          </div>
          <div className="text-sm font-inter" style={{ color: G.dim }}>
            Count: <span style={{ color: G.gold, fontWeight: "bold", fontSize: "1rem" }}>{totalSeed}</span>
            <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
            <span style={{
              color: isSeedFerd ? G.red : G.green,
              fontWeight: "bold",
              fontSize: "0.95rem"
            }}>
              {isSeedFerd ? "FERD (فرد)" : "ZEVC (زوج)"}
            </span>
            <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
            <span style={{ color: G.goldDim }}>
              Bast Level: <span style={{ color: G.gold }}>{bastLabelAr}</span>
            </span>
          </div>
        </Card>

        {/* ══ B: BAST SUMMATION (Running Totals) ══ */}
        <Card accent={G.green}>
          <SectionHeader step="B" label="Bast Summation — Running Totals" arabic="مجموع البسط" color={G.green} />
          <div className="space-y-2 mb-3">
            {letterBastDetails.map((detail, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg border"
                style={{
                  background: idx === 0 ? G.green + "08" : G.bgInner,
                  borderColor: idx === 0 ? G.green + "40" : G.goldBorder + "60",
                }}
              >
                <div className="flex items-center justify-center w-6 h-6 rounded font-inter text-[9px] font-black flex-shrink-0"
                  style={{
                    background: idx === 0 ? G.green : G.goldFaint,
                    color: idx === 0 ? "#000" : G.goldDim,
                    border: `1px solid ${idx === 0 ? G.green : G.goldBorder}`,
                  }}>
                  {idx + 1}
                </div>
                <LetterCell letter={detail.letter} color={G.gold} size="sm" />
                <Arrow label="Bast" />
                <div className="px-3 py-1.5 rounded-lg border flex-shrink-0"
                  style={{ background: G.greenDim, borderColor: G.green + "40" }}>
                  <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.green }}>
                    {detail.bastValue.toLocaleString()}
                  </span>
                </div>
                <Arrow label="Σ" />
                <div className="px-3 py-1.5 rounded-lg border flex-shrink-0"
                  style={{ background: G.goldFaint, borderColor: G.goldBorder }}>
                  <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.gold }}>
                    {detail.runningTotal.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 py-3 rounded-xl border"
            style={{ background: G.greenDim, borderColor: G.green + "55" }}>
            <span className="font-inter text-[8px] uppercase tracking-widest font-bold" style={{ color: G.green }}>
              Total Bast Sum (Σ)
            </span>
            <span className="font-inter text-lg font-bold tabular-nums" style={{ color: G.green }}>
              {totalBastSum.toLocaleString()}
            </span>
          </div>
        </Card>

        {/* ══ C: INDIVIDUAL BAST DERIVATIONS ══ */}
        <Card>
          <SectionHeader step="C" label="Individual Bast Derivations" arabic="اشتقاق البسط" color={G.green} />
          <div className="space-y-3">
            {derivations.map((d, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl border p-3"
                style={{
                  background: idx === 0 ? G.green + "08" : G.bgInner,
                  borderColor: idx === 0 ? G.green + "40" : G.goldBorder + "60",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center justify-center w-5 h-5 rounded font-inter text-[9px] font-black flex-shrink-0"
                    style={{
                      background: idx === 0 ? G.green : G.goldFaint,
                      color: idx === 0 ? "#000" : G.goldDim,
                      border: `1px solid ${idx === 0 ? G.green : G.goldBorder}`,
                    }}>
                    {idx + 1}
                  </div>
                  <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>
                    {idx === 0 ? "LAST letter (start)" : idx === derivations.length - 1 ? "FIRST letter (end)" : `Step ${idx + 1}`}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <LetterCell letter={d.letter} color={G.gold} size="lg" />
                  <Arrow label={`Bast ${bastLevel}`} />
                  <div className="px-3 py-1.5 rounded-lg border flex-shrink-0"
                    style={{ background: G.greenDim, borderColor: G.green + "40" }}>
                    <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.green }}>
                      {d.bastValue.toLocaleString()}
                    </span>
                  </div>
                  <Arrow label="Istintak" />
                  <div className="flex items-center gap-1 flex-wrap" style={{ direction: "rtl" }}>
                    {d.extracted.map((l, i) => (
                      <LetterCell key={i} letter={l} color={G.green} size="sm" />
                    ))}
                    <span className="font-inter text-[8px] ml-1" style={{ color: G.dim }}>
                      ({d.extracted.length})
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* ══ D: COMBINED SEQUENCE (Satr-i Vahid) ══ */}
        <Card accent={G.gold}>
          <SectionHeader step="D" label="Combined Sequence — Satr-i Vahid" arabic="السطر الواحد" color={G.gold} />
          <div className="mb-3">
            <LetterRow letters={concatenated} color={G.gold} size="lg" showIndex rtl />
          </div>
          <div className="text-sm font-inter" style={{ color: G.dim }}>
            Count: <span style={{ color: G.gold, fontWeight: "bold", fontSize: "1rem" }}>{concatenated.length}</span>
            <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
            <span style={{
              color: isSatrFerd ? G.red : G.green,
              fontWeight: "bold",
              fontSize: "0.95rem"
            }}>
              {isSatrFerd ? "FERD (فرد)" : "ZEVC (زوج)"}
            </span>
            <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
            <span style={{ color: G.goldDim }}>
              Group Size: <span style={{ color: G.gold }}>{groupFormation.groupSize}</span>
            </span>
          </div>
        </Card>

        {/* ══ E: COMBINED TOTAL CALCULATION ══ */}
        <Card accent={G.gold}>
          <SectionHeader step="E" label="Combined Total Calculation" arabic="الحساب المجمع" color={G.gold} />
          <div className="space-y-2">
            <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border"
              style={{ background: G.bgInner, borderColor: G.goldBorder }}>
              <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>Total Bast Sum (from Step B)</span>
              <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.gold }}>{totalBastSum.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border"
              style={{ background: G.bgInner, borderColor: G.goldBorder }}>
              <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>Total Letter Count (from Step A)</span>
              <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.gold }}>{totalSeed}</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border"
              style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
              <span className="font-inter text-[8px] uppercase tracking-wider font-bold" style={{ color: G.goldDim }}>Combined Total</span>
              <span className="font-inter text-lg font-bold" style={{ color: G.gold }}>+</span>
              <span className="font-inter text-lg font-bold tabular-nums" style={{ color: G.gold }}>{combinedTotal.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* ══ F: CONVERTED LETTERS (Istintak of Combined Total) ══ */}
        <Card accent={G.green}>
          <SectionHeader step="F" label="Converted Letters — Istintak" arabic="الحروف المحولة" color={G.green} />
          <div className="mb-3">
            <LetterRow letters={convertedLetters} color={G.green} size="lg" showIndex rtl />
          </div>
          <div className="text-sm font-inter" style={{ color: G.dim }}>
            Source: <span style={{ color: G.gold, fontWeight: "bold" }}>Istintak({combinedTotal.toLocaleString()})</span>
            <span style={{ color: G.dim, margin: "0 0.5rem" }}>•</span>
            <span style={{ color: G.goldDim }}>
              Count: <span style={{ color: G.green, fontWeight: "bold" }}>{convertedLetters.length}</span>
            </span>
          </div>
        </Card>

        {/* ══ G: GROUP FORMATION PROCESS ══ */}
        <Card accent={G.gold}>
          <SectionHeader step="G" label="Group Formation Process" arabic="تكوين المجموعات" color={G.gold} />
          
          {/* Remainder correction notice */}
          {groupFormation.remainder > 0 && (
            <div className="mb-3 rounded-lg border p-3"
              style={{ background: G.greenDim, borderColor: G.green + "40" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-inter text-[8px] uppercase tracking-wider font-bold" style={{ color: G.green }}>
                  Remainder Correction Applied
                </span>
                <span className="font-inter text-xs font-bold tabular-nums" style={{ color: G.green }}>+{groupFormation.supplement.length} letters</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[8px] mb-2">
                <div className="flex justify-between">
                  <span style={{ color: G.dim }}>Dominant Element</span>
                  <span style={{ color: G.gold }}>{dominantLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: G.dim }}>Galib Anasir Value</span>
                  <span style={{ color: G.gold }}>{(GALIB_ANASIR_VALUES[dominant] || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: G.dim }}>Group Size</span>
                  <span style={{ color: G.gold }}>{groupFormation.groupSize}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: G.dim }}>Remainder</span>
                  <span style={{ color: G.red }}>{groupFormation.remainder} → need {groupFormation.supplement.length}</span>
                </div>
              </div>
              <div className="font-inter text-[7px] uppercase tracking-wider mb-1" style={{ color: G.dim }}>Appended letters:</div>
              <LetterRow letters={groupFormation.supplement} color={G.green} size="sm" rtl />
            </div>
          )}

          <div className="space-y-3">
            {groupFormation.groups.map((group, gi) => (
              <motion.div key={gi}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.06 }}
                className="rounded-xl border p-3"
                style={{ background: G.bgInner, borderColor: G.goldBorder + "60" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center font-inter text-[9px] font-black"
                      style={{ background: G.goldFaint, color: G.gold, border: `1px solid ${G.goldBorder}` }}>
                      {group.groupNumber}
                    </div>
                    <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>
                      Group {group.groupNumber} — {group.letters.length} letters (positions {group.stepNumber}-{group.stepNumber + group.letters.length - 1})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <LetterRow letters={group.letters} color={G.gold} size="lg" showIndex rtl />
                  <Arrow label="name" />
                  <span className="font-amiri text-2xl font-bold px-4 py-2 rounded-xl border"
                    style={{ color: G.green, borderColor: G.green + "55", background: G.greenDim }}
                    dir="rtl">
                    {group.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <OrnamentalDivider />

        {/* ══ H: ESMA-I KITABET NAMES (Final) ══ */}
        <Card accent={G.gold}>
          <SectionHeader step="H" label="Esma-i Kitabet Names — Final" arabic="أسماء الكتابة النهائية" color={G.gold} />
          <div className="flex flex-col gap-2 py-2">
            {groupFormation.groups.map((group, gi) => (
              <motion.div key={gi}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.05 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
                <div className="flex items-center justify-center w-6 h-6 rounded-lg font-inter text-[9px] font-black flex-shrink-0"
                  style={{ background: G.bgInner, color: G.goldDim, border: `1px solid ${G.goldBorder}` }}>
                  {gi + 1}
                </div>
                <span className="font-amiri text-2xl font-bold flex-1" style={{ color: G.gold }} dir="rtl">
                  {group.name}
                </span>
                <span className="font-inter text-[7px] tabular-nums" style={{ color: G.dim }}>
                  {group.letters.length} letters
                </span>
              </motion.div>
            ))}
          </div>
          {groupFormation.groups.length > 0 && (
            <div className="text-center mt-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border"
                style={{ background: G.bgInner, borderColor: G.goldBorder }}>
                <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>Total Esma-i Kitabet Names</span>
                <span className="font-inter text-lg font-bold tabular-nums" style={{ color: G.gold }}>{groupFormation.groups.length}</span>
              </div>
            </div>
          )}
        </Card>

        {/* ══ I: ESMA-I KITABET VEFKI — MC derived from Section D (Satr-i Vahid) letters ══ */}
        {groupFormation.groups.length > 0 && (
          <EsmaVefkiSection satrVahidLetters={concatenated} groups={groupFormation.groups} dominant={dominant} />
        )}

      </div>

      {/* ══ Bottom accent line ══ */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}