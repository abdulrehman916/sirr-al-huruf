import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  getBastLevel,
  istintak,
  buildVefk,
  expandAllSeedLetters,
  generateEsmaLevel,
  VEFK_TEMPLATES,
} from "../../lib/mizaanPostEngine";

// ── Design tokens ─────────────────────────────────────────────
const G = {
  gold:        "#F5D060",
  goldDim:     "rgba(245,208,96,0.55)",
  goldFaint:   "rgba(245,208,96,0.12)",
  goldBorder:  "rgba(212,175,55,0.40)",
  goldBorderHi:"rgba(212,175,55,0.65)",
  glow:        "rgba(212,175,55,0.18)",
  bg:          "rgba(3,6,20,0.99)",
  bgCard:      "rgba(8,16,40,0.98)",
  bgInner:     "rgba(212,175,55,0.06)",
  green:       "#4ADE80",
  blue:        "#93C5FD",
  dim:         "rgba(255,255,255,0.35)",
};

const ELEMENT_META = {
  fire:  { arabic: "النار",   english: "Fire",  color: "#F87171", icon: "🜂" },
  earth: { arabic: "التراب",  english: "Earth", color: "#86EFAC", icon: "🜃" },
  air:   { arabic: "الهواء",  english: "Air",   color: "#93C5FD", icon: "🜁" },
  water: { arabic: "الماء",   english: "Water", color: "#67E8F9", icon: "🜄" },
};

// ── Sub-components ─────────────────────────────────────────────

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${G.goldBorder})` }} />
      <span style={{ color: G.goldDim, fontSize: 10 }}>✦</span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${G.goldBorder})` }} />
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
        boxShadow: "0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,175,55,0.05)",
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ step, label, arabic, color = G.gold }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div
        className="flex items-center justify-center w-7 h-7 rounded-lg font-inter text-xs font-black flex-shrink-0"
        style={{ background: color + "22", border: `1px solid ${color}55`, color }}
      >
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

function StatRow({ label, value, valueColor = G.gold }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: G.goldBorder + "55" }}>
      <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{label}</span>
      <span className="font-inter text-sm font-bold tabular-nums" style={{ color: valueColor }}>{value}</span>
    </div>
  );
}

function LetterPill({ letter, color = G.gold }) {
  return (
    <span
      className="font-amiri font-bold rounded-lg border px-2.5 py-1.5 text-xl"
      style={{ color, borderColor: color + "55", background: color + "12", lineHeight: 1.2, display: "inline-block" }}
    >
      {letter}
    </span>
  );
}

function LetterRow({ letters, color = G.gold }) {
  if (!letters || letters.length === 0)
    return <span className="font-inter text-xs italic" style={{ color: G.dim }}>—</span>;
  return (
    <div className="flex flex-wrap gap-1.5 items-center" dir="rtl">
      {letters.map((l, i) => <LetterPill key={i} letter={l} color={color} />)}
    </div>
  );
}

function VefkGrid({ grid, element, guardianName }) {
  const elMeta = ELEMENT_META[element] || ELEMENT_META.fire;
  const mc = grid[0].reduce((s, v) => s + v, 0);
  const rowSums = grid.map(r => r.reduce((a, b) => a + b, 0));
  const colSums = grid[0].map((_, j) => grid.reduce((s, r) => s + r[j], 0));
  const d1 = grid.reduce((s, r, i) => s + r[i], 0);
  const d2 = grid.reduce((s, r, i) => s + r[3 - i], 0);
  const allOk = rowSums.every(x => x === mc) && colSums.every(x => x === mc) && d1 === mc && d2 === mc;
  const guardianLetters = guardianName ? [...guardianName] : [];

  return (
    <div className="space-y-3">
      <div
        className="flex items-center justify-between px-3 py-2 rounded-lg"
        style={{ background: G.bgInner, border: `1px solid ${G.goldBorder}` }}
      >
        <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Magic Constant (MC)</span>
        <span className="font-inter text-lg font-bold tabular-nums" style={{ color: G.gold }}>{mc.toLocaleString()}</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <div className="font-amiri text-xl font-bold tracking-widest text-center" dir="rtl"
          style={{ color: elMeta.color, textShadow: `0 0 12px ${elMeta.color}55` }}>
          {guardianName}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-0.5">
            {guardianLetters.map((l, i) => (
              <span key={i} className="font-amiri font-bold leading-tight"
                style={{ color: elMeta.color, fontSize: "1rem", textShadow: `0 0 8px ${elMeta.color}55` }}>
                {l}
              </span>
            ))}
          </div>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: elMeta.color + "44" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2, padding: 6, background: "rgba(4,8,24,0.98)" }}>
              {grid.flat().map((num, idx) => (
                <div key={idx}
                  className="flex items-center justify-center font-amiri font-bold rounded"
                  style={{
                    aspectRatio: "1/1", minWidth: "2.5rem",
                    background: `linear-gradient(145deg, ${elMeta.color}18 0%, ${elMeta.color}08 100%)`,
                    border: `1px solid ${elMeta.color}35`,
                    color: G.gold, fontSize: "1rem",
                  }}>
                  {num}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-0.5">
            {guardianLetters.map((l, i) => (
              <span key={i} className="font-amiri font-bold leading-tight"
                style={{ color: elMeta.color, fontSize: "1rem", textShadow: `0 0 8px ${elMeta.color}55` }}>
                {l}
              </span>
            ))}
          </div>
        </div>
        <div className="font-amiri text-xl font-bold tracking-widest text-center" dir="rtl"
          style={{ color: elMeta.color, textShadow: `0 0 12px ${elMeta.color}55` }}>
          {guardianName}
        </div>
      </div>

      {/* Validation */}
      <div className="grid grid-cols-2 gap-1 text-[6px]">
        {[...rowSums.map((s, i) => ({ label: `Row ${i + 1}`, sum: s })),
          ...colSums.map((s, i) => ({ label: `Col ${i + 1}`, sum: s })),
          { label: "Diag ↘", sum: d1 }, { label: "Diag ↙", sum: d2 }
        ].map(({ label, sum }) => (
          <div key={label} className="flex justify-between px-2 py-1 rounded"
            style={{ background: sum === mc ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${sum === mc ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}` }}>
            <span style={{ color: G.dim }}>{label}</span>
            <span style={{ color: sum === mc ? G.green : "#F87171", fontWeight: "bold" }}>{sum.toLocaleString()} {sum === mc ? "✓" : "✗"}</span>
          </div>
        ))}
      </div>
      <div className="text-[6px] font-bold text-center px-2 py-1 rounded"
        style={{ background: allOk ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)", color: allOk ? G.green : "#F87171" }}>
        {allOk ? "✓ Valid Magic Square — all 10 lines equal MC" : "✗ Invalid Magic Square"}
      </div>
    </div>
  );
}

// ── Section 2 Pipeline ─────────────────────────────────────────
// Input: allExpandedLetters from Section 1 (read-only)
// Rule:
//   avanSourceTotal = sum(FirstBast of each letter) + letterCount
//   → istintak(avanSourceTotal) → seed letters
//   → same Option 1 pipeline from that point
function runAvanPipeline(allExpandedLetters, dominant) {
  if (!allExpandedLetters || allExpandedLetters.length === 0) return null;

  const element = dominant || "fire";

  // Step 1: Sum First Bast values of Section 1 expanded letters
  const expandedBastTotal = allExpandedLetters.reduce(
    (sum, l) => sum + (getBastLevel(l, 1) || 0), 0
  );
  const letterCount = allExpandedLetters.length;

  // Step 2: A'van source total = Bast total + letter count
  const avanSourceTotal = expandedBastTotal + letterCount;

  // Step 3: Istintak → seed letters
  const seedLetters = istintak(avanSourceTotal);

  // Step 4: Bast level based on seed count (odd → 5th, even → 4th)
  const bastLevel = seedLetters.length % 2 !== 0 ? 5 : 4;

  // Step 5: Expand all seed letters (last → first, same as Option 1)
  const avanExpandedLetters = expandAllSeedLetters(seedLetters, bastLevel);

  // Step 6: Group formation (Esma-i A'van names)
  const kitabet = generateEsmaLevel(seedLetters, false, element);

  // Step 7: Vefk source = sum of expanded letters' First Bast values
  const vefkSourceNumber = avanExpandedLetters.reduce(
    (sum, l) => sum + (getBastLevel(l, 1) || 0), 0
  );
  const vefk = buildVefk(vefkSourceNumber, element);

  return {
    // Inputs from Section 1
    allExpandedLetters,
    expandedBastTotal,
    letterCount,
    // A'van pipeline
    avanSourceTotal,
    seedLetters,
    bastLevel,
    avanExpandedLetters,
    avanExpandedTotal: vefkSourceNumber,
    kitabet,
    element,
    vefk,
    vefkSourceNumber,
  };
}

// ── Main exported component ────────────────────────────────────
// Props:
//   allExpandedLetters — Section 1 output (read-only, never modified)
//   dominant           — Galib Anasir from Section 1
export default function EsmaAvanSection({ allExpandedLetters, dominant }) {
  const pipeline = useMemo(
    () => runAvanPipeline(allExpandedLetters, dominant),
    [allExpandedLetters, dominant]
  );

  if (!pipeline) return null;

  const {
    expandedBastTotal, letterCount, avanSourceTotal,
    seedLetters, bastLevel,
    avanExpandedLetters, avanExpandedTotal,
    kitabet, element, vefk, vefkSourceNumber,
  } = pipeline;

  const elMeta = ELEMENT_META[element] || ELEMENT_META.fire;

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
      {/* Top accent */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />

      {/* Title */}
      <div className="text-center px-6 pt-6 pb-4">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl border mb-3"
          style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
          <span className="font-inter text-[9px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>Section 2 — Esma-i A'van</span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <h2 className="font-amiri text-2xl font-bold" style={{ color: G.gold }}>أسماء الأعوان</h2>
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: G.goldDim }}>A'van Source Total Pipeline</p>
      </div>

      <OrnamentalDivider />

      <div className="px-4 pb-6 space-y-5 pt-4">

        {/* ── STEP 1: Section 1 Expanded Letters Input ── */}
        <Card accent={G.blue}>
          <SectionHeader step="1" label="Section 1 Expanded Letters (Input)" arabic="الحروف الموسعة" color={G.blue} />
          <div className="mb-3">
            <LetterRow letters={allExpandedLetters} color={G.blue} />
          </div>
          <div className="space-y-0">
            <StatRow label="Expanded Letter Count" value={letterCount} valueColor={G.blue} />
            <StatRow label="Sum of First Bast Values" value={expandedBastTotal.toLocaleString()} valueColor={G.blue} />
          </div>
        </Card>

        {/* ── STEP 2: A'van Source Total ── */}
        <Card accent={G.gold}>
          <SectionHeader step="2" label="A'van Source Total" arabic="مجموع مصدر الأعوان" color={G.gold} />
          <div className="space-y-0">
            <StatRow label="Expanded Bast Total" value={expandedBastTotal.toLocaleString()} valueColor={G.goldDim} />
            <StatRow label="+ Letter Count" value={letterCount} valueColor={G.goldDim} />
            <StatRow label="= A'van Source Total" value={avanSourceTotal.toLocaleString()} valueColor={G.gold} />
          </div>
          <div className="mt-3 px-3 py-2 rounded-lg text-center font-inter text-[8px] uppercase tracking-widest"
            style={{ background: G.goldFaint, color: G.goldDim }}>
            {expandedBastTotal.toLocaleString()} + {letterCount} = {avanSourceTotal.toLocaleString()}
          </div>
        </Card>

        {/* ── STEP 3: Istintak → Seed Letters ── */}
        <Card accent={G.gold}>
          <SectionHeader step="3" label="Istintak → Seed Letters" arabic="الاستنطاق" color={G.gold} />
          <div className="mb-3">
            <LetterRow letters={seedLetters} color={G.gold} />
          </div>
          <div className="space-y-0">
            <StatRow label="Seed Letter Count" value={seedLetters.length} valueColor={G.gold} />
            <StatRow label="Bast Level" value={`${bastLevel === 5 ? "5th — البسط الخامس" : "4th — البسط الرابع"}`} valueColor={G.goldDim} />
          </div>
        </Card>

        {/* ── STEP 4: Bast Derivations → Expanded Letters ── */}
        <Card accent={G.green}>
          <SectionHeader step="4" label="Expanded Letters (Bast → Istintak)" arabic="الحروف الموسعة" color={G.green} />
          <div className="mb-3">
            <LetterRow letters={avanExpandedLetters} color={G.green} />
          </div>
          <div className="space-y-0">
            <StatRow label="Expanded Count" value={avanExpandedLetters.length} valueColor={G.green} />
            <StatRow label="Sum First Bast (Vefk Source)" value={avanExpandedTotal.toLocaleString()} valueColor={G.green} />
          </div>
        </Card>

        {/* ── STEP 5: Group Formation (Esma-i A'van Names) ── */}
        <Card accent={G.gold}>
          <SectionHeader step="5" label="Group Formation — Esma-i A'van" arabic="أسماء الأعوان" color={G.gold} />
          <div className="space-y-2 mb-3">
            {kitabet.names.map((name, idx) => (
              <motion.div key={idx}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border"
                style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
                <div className="flex items-center justify-center w-7 h-7 rounded-lg font-inter text-sm font-black flex-shrink-0"
                  style={{ background: G.bgInner, color: G.gold, border: `1px solid ${G.goldBorder}` }}>
                  {idx + 1}
                </div>
                <span className="font-amiri text-2xl font-bold flex-1" style={{ color: G.gold }} dir="rtl">
                  {name}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="space-y-0">
            <StatRow label="Group Size" value={`${kitabet.groupSize} (${kitabet.isZevc ? "Zevc / زوج" : "Ferd / فرد"})`} valueColor={G.goldDim} />
            <StatRow label="Total Names" value={kitabet.names.length} valueColor={G.gold} />
            {kitabet.supplementLetters.length > 0 && (
              <div className="pt-2">
                <div className="font-inter text-[8px] uppercase tracking-widest mb-1.5" style={{ color: G.dim }}>
                  Remainder Supplement ({kitabet.supplementLetters.length} letter{kitabet.supplementLetters.length > 1 ? "s" : ""})
                </div>
                <LetterRow letters={kitabet.supplementLetters} color={G.goldDim} />
              </div>
            )}
          </div>
        </Card>

        {/* ── STEP 6: Dominant Element ── */}
        <Card accent={elMeta.color}>
          <SectionHeader step="6" label="Dominant Element" arabic="الغالب العنصر" color={elMeta.color} />
          <div className="flex items-center gap-3">
            <span className="text-2xl">{elMeta.icon}</span>
            <div>
              <span className="font-amiri text-xl font-bold" style={{ color: elMeta.color }}>{elMeta.arabic}</span>
              <span className="font-inter text-[8px] uppercase tracking-wider ml-2" style={{ color: G.dim }}>({element})</span>
            </div>
          </div>
          <div className="mt-3 space-y-0">
            <StatRow label="Vefk Source Number" value={vefkSourceNumber.toLocaleString()} valueColor={elMeta.color} />
          </div>
        </Card>

        {/* ── STEP 7: Vefk ── */}
        <Card accent={elMeta.color}>
          <SectionHeader step="7" label="A'van Vefk Magic Square" arabic="وفق الأعوان" color={elMeta.color} />
          <VefkGrid
            grid={vefk.grid}
            element={element}
            guardianName={vefk.guardianName}
          />
        </Card>

      </div>

      {/* Bottom accent */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}