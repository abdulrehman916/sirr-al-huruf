// ═══════════════════════════════════════════════════════════════
// METHOD 4 — STEP 1 (Nine Mizan → Istintak → Bast Expansion)
// ─────────────────────────────────────────────────────────────
// Nine Mizan stage is shared/identical with Methods 1-3 (computed upstream).
// This component ONLY implements what was explicitly instructed:
//   1. Convert Nine Mizan total → Istintak seed letters
//   2. Display letters, count, FERD/ZEVC
//   3. FERD → 5th Bast, ZEVC → 4th Bast (section-specific Bast table via getBastLevelFn)
//   4. Apply Bast to every seed letter, display each expanded value
//   5. Sum expanded values → display total
//   6. Convert expanded total → new Istintak letters → display
// STOPS HERE — no Esma-i Kitabet/A'van/Kasem, no Vefk.
// ═══════════════════════════════════════════════════════════════

import { useMemo } from "react";
import { motion } from "framer-motion";
import { istintak, getBastLevel as getBastLevelDefault } from "../../lib/mizaanPostEngine";

const G = {
  gold:         "#F5D060",
  goldDim:      "rgba(245,208,96,0.55)",
  goldFaint:    "rgba(212,175,55,0.07)",
  goldBorder:   "rgba(212,175,55,0.40)",
  goldBorderHi: "rgba(212,175,55,0.65)",
  glow:         "rgba(212,175,55,0.18)",
  bg:           "rgba(3,6,20,0.99)",
  bgCard:       "rgba(8,16,40,0.98)",
  bgInner:      "rgba(212,175,55,0.06)",
  green:        "#4ADE80",
  red:          "#F87171",
  dim:          "rgba(255,255,255,0.35)",
};

function SectionHeader({ step, label, arabic, color = G.gold }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg font-inter text-xs font-black flex-shrink-0"
        style={{ background: color + "22", border: `1px solid ${color}55`, color }}>
        {step}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-inter text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color }}>{label}</span>
          {arabic && <span className="font-amiri text-base" style={{ color: G.goldDim, lineHeight: 1.8 }}>{arabic}</span>}
        </div>
      </div>
      <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(to right, ${color}40, transparent)` }} />
    </div>
  );
}

function Card({ children, accent }) {
  return (
    <div className="rounded-xl border p-4"
      style={{
        background: G.bgCard,
        borderColor: accent ? accent + "55" : G.goldBorder,
        borderLeft: accent ? `3px solid ${accent}` : undefined,
        boxShadow: `0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,175,55,0.05)`,
      }}>
      {children}
    </div>
  );
}

function LetterCell({ letter, color = G.gold }) {
  return (
    <span className="font-amiri font-bold rounded-lg border px-4 py-2.5 text-3xl leading-relaxed"
      style={{
        color,
        borderColor: color + "55",
        background: color + "12",
        lineHeight: 1.8,
        textRendering: "optimizeLegibility",
        WebkitFontSmoothing: "antialiased",
      }}>
      {letter}
    </span>
  );
}

function LetterRow({ letters, color = G.gold }) {
  if (!letters || letters.length === 0) return <span className="font-inter text-xs italic" style={{ color: G.dim }}>—</span>;
  return (
    <div className="flex flex-wrap gap-2.5" style={{ direction: "rtl" }}>
      {letters.map((l, i) => <LetterCell key={i} letter={l} color={color} />)}
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

export default function Method4Step1Section({ nineMizanTotal, getBastLevelFn = getBastLevelDefault }) {
  const pipeline = useMemo(() => {
    if (!nineMizanTotal || nineMizanTotal <= 0) return null;

    // Step 1: Nine Mizan total → Istintak seed letters
    const seedLetters = istintak(nineMizanTotal);
    const letterCount = seedLetters.length;
    const isFerd = letterCount % 2 !== 0;
    const bastLevel = isFerd ? 5 : 4;

    // Step 2: Apply selected Bast to every seed letter
    const expandedValues = seedLetters.map(l => getBastLevelFn(l, bastLevel) || 0);
    const expandedTotal = expandedValues.reduce((s, v) => s + v, 0);

    // Step 3: Convert expanded total → new Istintak letters
    const newSeedLetters = istintak(expandedTotal);

    return { seedLetters, letterCount, isFerd, bastLevel, expandedValues, expandedTotal, newSeedLetters };
  }, [nineMizanTotal, getBastLevelFn]);

  if (!pipeline) return null;

  const { seedLetters, letterCount, isFerd, bastLevel, expandedValues, expandedTotal, newSeedLetters } = pipeline;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background:  G.bg,
        borderColor: G.goldBorderHi,
        boxShadow:   `0 0 80px ${G.glow}, 0 0 160px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.08)`,
      }}
    >
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />

      <div className="text-center px-6 pt-6 pb-4">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl border mb-3"
          style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
          <span className="font-inter text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>Method 4 — Step 1</span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: G.goldDim }}>Nine Mizan → Istintak → Bast Expansion</p>
      </div>

      <OrnamentalDivider />

      <div className="px-4 pb-6 space-y-5 pt-4">

        {/* Step 1: Seed Letters from Nine Mizan Total */}
        <Card accent={G.gold}>
          <SectionHeader step="1" label="Istintak of Nine Mizan Total" arabic="الحروف البذرية" color={G.gold} />
          <div className="flex items-center justify-between px-3 py-2 rounded-lg border mb-3"
            style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
            <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Nine Mizan Total</span>
            <span className="font-inter text-base font-bold tabular-nums" style={{ color: G.gold }}>{nineMizanTotal.toLocaleString()}</span>
          </div>
          <LetterRow letters={seedLetters} color={G.gold} />
          <div className="text-sm font-inter mt-3" style={{ color: G.dim }}>
            Count: <span style={{ color: G.gold, fontWeight: "bold", fontSize: "1rem" }}>{letterCount}</span>
            <span style={{ margin: "0 0.5rem" }}>•</span>
            <span style={{ color: isFerd ? G.red : G.green, fontWeight: "bold" }}>{isFerd ? "FERD (فرد)" : "ZEVC (زوج)"}</span>
            <span style={{ margin: "0 0.5rem" }}>•</span>
            <span style={{ color: G.goldDim }}>Bast Level: <span style={{ color: G.gold }}>{bastLevel === 5 ? "البسط الخامس" : "البسط الرابع"}</span></span>
          </div>
        </Card>

        {/* Step 2: Individual Expanded Bast Values */}
        <Card accent={G.green}>
          <SectionHeader step="2" label={`Expanded Bast Values (B${bastLevel})`} arabic="قيم البسط" color={G.green} />
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            {seedLetters.map((l, i) => (
              <div key={i} className="contents">
                <LetterCell letter={l} color={G.green} />
                <div className="flex items-center font-inter text-sm font-bold tabular-nums" style={{ color: G.green }}>
                  {expandedValues[i].toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Step 3: Expanded Total */}
        <Card accent={G.gold}>
          <SectionHeader step="3" label="Expanded Total" arabic="المجموع الموسع" color={G.gold} />
          <div className="text-center px-3 py-3 rounded-lg border"
            style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
            <span className="font-inter text-2xl font-black tabular-nums" style={{ color: G.gold }}>{expandedTotal.toLocaleString()}</span>
          </div>
        </Card>

        {/* Step 4: New Istintak Letters from Expanded Total */}
        <Card accent={G.gold}>
          <SectionHeader step="4" label="Istintak of Expanded Total" arabic="الحروف الجديدة" color={G.gold} />
          <LetterRow letters={newSeedLetters} color={G.gold} />
          <div className="text-sm font-inter mt-3" style={{ color: G.dim }}>
            Count: <span style={{ color: G.gold, fontWeight: "bold", fontSize: "1rem" }}>{newSeedLetters.length}</span>
          </div>
        </Card>

      </div>

      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}