// ═══════════════════════════════════════════════════════════════
// METHOD 4 — NEXT OPTION (display-only)
// Reuses the same combined Nine Mizan total and its original
// Istintak letters already generated earlier in Method 4.
// No recalculation, no grouping, no Bast applied here.
// ═══════════════════════════════════════════════════════════════

import { motion } from "framer-motion";

const G = {
  gold:         "#F5D060",
  goldDim:      "rgba(245,208,96,0.55)",
  goldFaint:    "rgba(212,175,55,0.07)",
  goldBorder:   "rgba(212,175,55,0.40)",
  goldBorderHi: "rgba(212,175,55,0.65)",
  glow:         "rgba(212,175,55,0.18)",
  bg:           "rgba(3,6,20,0.99)",
  bgInner:      "rgba(212,175,55,0.06)",
  dim:          "rgba(255,255,255,0.35)",
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

export default function Method4NextOption({ nineMizanTotal, seedLetters }) {
  const safeLetters = Array.isArray(seedLetters) ? seedLetters : [];

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
          <span className="font-inter text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>Next Option</span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <p className="font-malayalam text-base font-bold" style={{ color: G.gold }}>അല്ലെങ്കിൽ (Next Option)</p>
      </div>

      <OrnamentalDivider />

      <div className="px-4 pb-6 space-y-4 pt-4">
        <div className="rounded-xl border p-4" style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
          <div className="space-y-3 pl-1">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg border"
              style={{ background: G.goldFaint, borderColor: G.goldBorder + "55" }}>
              <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>Combined Total Number</span>
              <span className="font-inter text-base font-bold tabular-nums" style={{ color: G.gold }}>{(nineMizanTotal || 0).toLocaleString()}</span>
            </div>

            <div>
              <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>Original Istintak Letters:</span>
              <div className="flex flex-wrap gap-2 mt-2" dir="rtl">
                {(safeLetters.length > 0 ? safeLetters : ["—"]).map((l, i) => (
                  <span key={i} className="font-amiri text-lg font-bold px-3 py-1 rounded-lg border"
                    style={{ color: G.gold, borderColor: G.goldBorder + "55", background: G.goldFaint, lineHeight: 1.7 }}>
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}