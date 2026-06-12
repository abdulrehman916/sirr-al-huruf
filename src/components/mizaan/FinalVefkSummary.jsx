// ═══════════════════════════════════════════════════════════════
// FINAL VEFK SUMMARY — DISPLAY ONLY
// Shows the three Vefk grids (Section 1, 2, 3) side-by-side
// at the bottom of the page. NO calculations happen here.
// All data is received as props from Mizaan9Page.
// ═══════════════════════════════════════════════════════════════

import { motion } from "framer-motion";

const G = {
  gold:         "#F5D060",
  goldDim:      "rgba(245,208,96,0.55)",
  goldFaint:    "rgba(245,208,96,0.10)",
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

const ELEMENT_COLORS = {
  fire:  "#FF6B35",
  earth: "#A5C880",
  air:   "#B2EBF2",
  water: "#4FC3F7",
};

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${G.goldBorder})` }} />
      <span style={{ color: G.goldDim, fontSize: 10 }}>✦</span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${G.goldBorder})` }} />
    </div>
  );
}

// Single Vefk panel — read-only grid display
function VefkPanel({ label, arabic, vefk, sourceNumber, borderLetters, elementColor }) {
  if (!vefk || !vefk.grid) return null;

  const g       = vefk.grid;
  const mc      = g[0].reduce((s, v) => s + v, 0);
  const rowSums = g.map(r => r.reduce((a, b) => a + b, 0));
  const colSums = g[0].map((_, j) => g.reduce((s, r) => s + r[j], 0));
  const d1      = g.reduce((s, r, i) => s + r[i], 0);
  const d2      = g.reduce((s, r, i) => s + r[3 - i], 0);
  const allOk   = rowSums.every(x => x === mc) && colSums.every(x => x === mc) && d1 === mc && d2 === mc;

  const color        = elementColor || G.gold;
  const borderChars  = borderLetters ? [...borderLetters] : (vefk.guardianName ? [...vefk.guardianName] : []);
  const borderStr    = borderChars.join("");

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{
        background:  G.bgCard,
        borderColor: color + "55",
        borderTop:   `3px solid ${color}`,
        boxShadow:   `0 0 40px ${color}18, 0 4px 24px rgba(0,0,0,0.5)`,
      }}>

      {/* Section label */}
      <div className="text-center px-4 pt-5 pb-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border mb-2"
          style={{ background: G.bgInner, borderColor: color + "55" }}>
          <span className="font-inter text-[8px] uppercase tracking-[0.25em] font-bold" style={{ color }}>{label}</span>
        </div>
        <div className="font-amiri text-xl font-bold" style={{ color: G.gold }} dir="rtl">{arabic}</div>
      </div>

      <OrnamentalDivider />

      <div className="px-4 pb-5 pt-2 space-y-3">

        {/* Source number */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg border"
          style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
          <span className="font-inter text-[7px] uppercase tracking-widest" style={{ color: G.dim }}>Vefk Source</span>
          <span className="font-inter text-sm font-bold tabular-nums" style={{ color }}>{sourceNumber?.toLocaleString() || "—"}</span>
        </div>

        {/* Framed grid */}
        <div className="flex flex-col items-center gap-1">
          {/* TOP border letters */}
          <div className="font-amiri text-base font-bold tracking-widest text-center" dir="rtl"
            style={{ color, textShadow: `0 0 10px ${color}44` }}>
            {borderStr}
          </div>
          <div className="flex items-center gap-1.5">
            {/* LEFT */}
            <div className="flex flex-col items-center justify-center gap-0.5">
              {borderChars.map((l, i) => (
                <span key={i} className="font-amiri font-bold leading-tight"
                  style={{ color, fontSize: "0.85rem", textShadow: `0 0 6px ${color}44` }}>
                  {l}
                </span>
              ))}
            </div>
            {/* GRID */}
            <div className="grid grid-cols-4 gap-1">
              {g.flat().map((val, idx) => (
                <div key={idx}
                  className="aspect-square flex items-center justify-center rounded-md border font-inter text-xs font-bold tabular-nums"
                  style={{
                    background:  idx % 2 === 0 ? G.goldFaint : G.bgInner,
                    borderColor: color + "44",
                    color,
                    minWidth:    "2.2rem",
                  }}>
                  {val.toLocaleString()}
                </div>
              ))}
            </div>
            {/* RIGHT */}
            <div className="flex flex-col items-center justify-center gap-0.5">
              {borderChars.map((l, i) => (
                <span key={i} className="font-amiri font-bold leading-tight"
                  style={{ color, fontSize: "0.85rem", textShadow: `0 0 6px ${color}44` }}>
                  {l}
                </span>
              ))}
            </div>
          </div>
          {/* BOTTOM */}
          <div className="font-amiri text-base font-bold tracking-widest text-center" dir="rtl"
            style={{ color, textShadow: `0 0 10px ${color}44` }}>
            {borderStr}
          </div>
        </div>

        {/* MC + validity */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border"
            style={{ background: G.goldFaint, borderColor: color + "40" }}>
            <span className="font-inter text-[6px] uppercase tracking-wider" style={{ color: G.dim }}>MC</span>
            <span className="font-inter text-xs font-bold tabular-nums" style={{ color }}>{mc.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-2 gap-0.5 text-[5px]">
            {rowSums.map((s, i) => (
              <div key={i} className="flex justify-between px-1.5 py-0.5 rounded"
                style={{ background: s === mc ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)" }}>
                <span style={{ color: G.dim }}>R{i + 1}</span>
                <span style={{ color: s === mc ? G.green : G.red, fontWeight: "bold" }}>{s === mc ? "✓" : "✗"}</span>
              </div>
            ))}
            {colSums.map((s, i) => (
              <div key={i} className="flex justify-between px-1.5 py-0.5 rounded"
                style={{ background: s === mc ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)" }}>
                <span style={{ color: G.dim }}>C{i + 1}</span>
                <span style={{ color: s === mc ? G.green : G.red, fontWeight: "bold" }}>{s === mc ? "✓" : "✗"}</span>
              </div>
            ))}
            {[["D↘", d1], ["D↙", d2]].map(([lbl, s]) => (
              <div key={lbl} className="flex justify-between px-1.5 py-0.5 rounded"
                style={{ background: s === mc ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)" }}>
                <span style={{ color: G.dim }}>{lbl}</span>
                <span style={{ color: s === mc ? G.green : G.red, fontWeight: "bold" }}>{s === mc ? "✓" : "✗"}</span>
              </div>
            ))}
          </div>
          <div className="text-[5px] font-bold px-2 py-0.5 rounded inline-block"
            style={{ background: allOk ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)", color: allOk ? G.green : G.red }}>
            {allOk ? "✓ Valid" : "✗ Invalid"}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────
// Props:
//   s1Vefk         — Section 1 vefk object  { grid, guardianName }
//   s1Source       — Section 1 vefk source number
//   s2Vefk         — Section 2 vefk object
//   s2Source       — Section 2 vefk source number
//   s3Vefk         — Section 3 vefk object
//   s3Source       — Section 3 vefk source number
//   s3BorderLetters— Section 3 border letters string (derived from B5 expanded total)
//   dominant       — element key
export default function FinalVefkSummary({ s1Vefk, s1Source, s2Vefk, s2Source, s3Vefk, s3Source, s3BorderLetters, dominant }) {
  if (!s1Vefk && !s2Vefk && !s3Vefk) return null;

  const elementColor = ELEMENT_COLORS[dominant] || ELEMENT_COLORS.fire;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background:  G.bg,
        borderColor: G.goldBorderHi,
        boxShadow:   `0 0 80px ${G.glow}, 0 0 160px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.08)`,
      }}
    >
      {/* Top accent */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />

      {/* Title */}
      <div className="text-center px-6 pt-6 pb-4">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl border mb-3"
          style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
          <span className="font-inter text-[9px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>Final Summary — Three Vefks</span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <h2 className="font-amiri text-2xl font-bold" style={{ color: G.gold }}>ملخص الأوفاق الثلاثة</h2>
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: G.goldDim }}>Read-only display • No recalculation</p>
      </div>

      <OrnamentalDivider />

      <div className="px-4 pb-6 pt-4 space-y-4">

        {/* Section 1 */}
        <VefkPanel
          label="Section 1 — Esma-i Vefk"
          arabic="أسماء الكتابة"
          vefk={s1Vefk}
          sourceNumber={s1Source}
          borderLetters={s1Vefk?.guardianName || ""}
          elementColor={elementColor}
        />

        {/* Section 2 */}
        <VefkPanel
          label="Section 2 — Esma-i A'van"
          arabic="أسماء الأعوان"
          vefk={s2Vefk}
          sourceNumber={s2Source}
          borderLetters={s2Vefk?.guardianName || ""}
          elementColor={elementColor}
        />

        {/* Section 3 */}
        <VefkPanel
          label="Section 3 — Esma-i Kasem"
          arabic="أسماء القسم"
          vefk={s3Vefk}
          sourceNumber={s3Source}
          borderLetters={s3BorderLetters || ""}
          elementColor={elementColor}
        />

      </div>

      {/* Bottom accent */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}