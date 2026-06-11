import { useMemo } from "react";
import { motion } from "framer-motion";
import { getBastLevel, buildVefk } from "../../lib/mizaanPostEngine";

// ── Design tokens (matching SatrVahidGrouping) ──────────────────
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
  greenDim:    "rgba(74,222,128,0.15)",
  blue:        "#93C5FD",
  blueDim:     "rgba(147,197,253,0.15)",
  dim:         "rgba(255,255,255,0.35)",
};

// Element display data
const ELEMENT_META = {
  fire:  { arabic: "النار",    english: "Fire",  color: "#F87171", icon: "🜂" },
  earth: { arabic: "التراب",   english: "Earth", color: "#86EFAC", icon: "🜃" },
  air:   { arabic: "الهواء",   english: "Air",   color: "#93C5FD", icon: "🜁" },
  water: { arabic: "الماء",    english: "Water", color: "#67E8F9", icon: "🜄" },
};

function calcEsmaLettersBast(letters) {
  return letters.reduce((sum, l) => sum + (getBastLevel(l, 1) || 0), 0);
}

// ── Sub-components ───────────────────────────────────────────────

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

// ── Vefk Grid display ────────────────────────────────────────────
function VefkGrid({ vefkResult }) {
  if (!vefkResult) return null;
  const { grid, mc, element } = vefkResult;
  const elMeta = ELEMENT_META[element] || ELEMENT_META.fire;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-3 py-2 rounded-lg"
        style={{ background: G.bgInner, border: `1px solid ${G.goldBorder}` }}>
        <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Magic Constant (MC)</span>
        <span className="font-inter text-lg font-bold tabular-nums" style={{ color: G.gold }}>{mc.toLocaleString()}</span>
      </div>

      <div className="rounded-xl border overflow-hidden"
        style={{ borderColor: elMeta.color + "44" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2, padding: 6, background: "rgba(4,8,24,0.98)" }}>
          {grid.flat().map((num, idx) => (
            <div key={idx}
              className="flex items-center justify-center font-amiri font-bold rounded"
              style={{
                aspectRatio: "1/1",
                background: `linear-gradient(145deg, ${elMeta.color}18 0%, ${elMeta.color}08 100%)`,
                border: `1px solid ${elMeta.color}35`,
                color: G.gold,
                fontSize: "1rem",
              }}>
              {num}
            </div>
          ))}
        </div>
      </div>

      {/* Row/Col verification */}
      <div className="grid grid-cols-2 gap-1.5 text-[7px]">
        {grid.map((row, ri) => {
          const rowSum = row.reduce((s, v) => s + v, 0);
          const ok = rowSum === mc;
          return (
            <div key={ri} className="flex justify-between px-2 py-1 rounded"
              style={{ background: ok ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${ok ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}` }}>
              <span style={{ color: G.dim }}>Row {ri + 1}</span>
              <span style={{ color: ok ? G.green : "#F87171", fontWeight: "bold" }}>{rowSum} {ok ? "✓" : "✗"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main exported component ──────────────────────────────────────
// dominant: passed from SatrVahidGrouping — the same Galib Anasir already
// used for the Esma-i Kitabet Grouping section. Never recalculated here.
export default function EsmaVefkiSection({ groups, dominant = "fire" }) {
  const safeGroups = groups || [];

  // Concatenate all letters from all generated names (Section J source)
  const allLetters = useMemo(() => safeGroups.flatMap(g => g.letters), [safeGroups]);
  const totalLetters = allLetters.length;

  // Total Bast-1 value of the complete Esma-i Kitabet letter sequence
  const totalBast = useMemo(() => calcEsmaLettersBast(allLetters), [allLetters]);

  // Use the dominant passed from the grouping section — same Galib Anasir
  const elMeta = ELEMENT_META[dominant] || ELEMENT_META.fire;

  // Build Vefk using totalBast + the passed dominant
  const vefkResult = useMemo(() => {
    if (!totalBast || totalBast < 30) return null;
    return buildVefk(totalBast, dominant);
  }, [totalBast, dominant]);

  if (safeGroups.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background: G.bg,
        borderColor: G.goldBorderHi,
        boxShadow: `0 0 80px ${G.glow}, 0 0 160px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.08)`,
      }}
    >
      {/* Top accent line */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />

      {/* Title Banner */}
      <div className="text-center px-6 pt-6 pb-4">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl border mb-3"
          style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
          <span className="font-inter text-[9px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>Section K</span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <h2 className="font-amiri text-3xl font-bold" style={{ color: G.gold }}>وفق أسماء الكتابة</h2>
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: G.goldDim }}>Esma-i Kitabet Vefki</p>
      </div>

      <OrnamentalDivider />

      <div className="px-4 pb-6 space-y-5 pt-4">

        {/* K1 — Stats */}
        <Card>
          <SectionHeader step="K1–K3" label="Calculations" arabic="الحسابات" color={G.blue} />
          <div className="space-y-0">
            <StatRow label="Total Bast Value" value={totalBast.toLocaleString()} valueColor={G.gold} />
            <StatRow label="Total Letter Count" value={totalLetters} valueColor={G.gold} />
            <div className="flex items-center justify-between py-2">
              <span className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>Dominant Anasir</span>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: "1rem" }}>{elMeta.icon}</span>
                <span className="font-amiri text-base font-bold" style={{ color: elMeta.color }}>{elMeta.arabic}</span>
                <span className="font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: elMeta.color + "99" }}>{elMeta.english}</span>
              </div>
            </div>
          </div>
        </Card>

        <OrnamentalDivider />

        {/* K5 — Vefk */}
        <Card accent={elMeta.color}>
          <SectionHeader step="K5" label="Esma-i Kitabet Vefk" arabic="الوفق" color={elMeta.color} />
          {vefkResult ? (
            <VefkGrid vefkResult={vefkResult} />
          ) : (
            <p className="font-inter text-xs text-center py-4" style={{ color: G.dim }}>
              Total Bast value too small to construct a Vefk (minimum 30 required).
            </p>
          )}
        </Card>

      </div>

      {/* Bottom accent line */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}