// ═══════════════════════════════════════════════════════════════
// METHOD 3 — DIVINE NAMES LOOKUP (Asma-ul Husna, Abjad Kabir match)
// ─────────────────────────────────────────────────────────────
// Pure lookup only — no derivation, no Bast, no new pipeline.
// Uses the Final Abjad Kabir Total as a key and searches the
// complete 99-name database (Allah → As-Sabur) via the same
// calculateAbjad() engine used to produce that total.
// ═══════════════════════════════════════════════════════════════

import { useMemo } from "react";
import { motion } from "framer-motion";
import { calculateAbjad } from "../../lib/abjadValues";
import { ASMA_UL_HUSNA_NAMES } from "../../lib/asmaUlHusnaNames";

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
  green:        "#4ADE80",
};

export default function Method3DivineNamesMatchSection({ abjadTotal, elementColor = G.gold }) {
  const safeTotal = abjadTotal || 0;

  const matches = useMemo(() => {
    if (!safeTotal) return [];
    return ASMA_UL_HUSNA_NAMES
      .map(name => ({ name, value: calculateAbjad(name) }))
      .filter(n => n.value === safeTotal);
  }, [safeTotal]);

  if (!safeTotal) return null;

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
          <span className="font-inter text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>Asma-ul Husna — Divine Name Match</span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: G.goldDim }}>
          Lookup by Abjad Kabir Value = {safeTotal.toLocaleString()}
        </p>
      </div>

      <div className="px-4 pb-6 pt-2">
        <div className="rounded-xl border p-4"
          style={{
            background: "rgba(6,14,36,0.98)",
            borderColor: elementColor + "55",
            borderLeft: `3px solid ${elementColor}`,
          }}>
          {matches.length > 0 ? (
            <div className="space-y-2.5">
              {matches.map((m, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-lg border"
                  style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
                  <span className="font-amiri text-2xl" dir="rtl" style={{ color: G.gold, lineHeight: 1.8 }}>{m.name}</span>
                  <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.green }}>{m.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <span className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
                No exact match found in the 99 Names
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}