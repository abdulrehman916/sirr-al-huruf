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
import { METHOD3_ASMA_UL_HUSNA_ADAD } from "../../lib/method3AsmaUlHusnaAdad";

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
    return METHOD3_ASMA_UL_HUSNA_ADAD.filter(n => n.adad === safeTotal);
  }, [safeTotal]);

  const { nearestLower, nearestHigher } = useMemo(() => {
    if (!safeTotal || matches.length > 0) return { nearestLower: null, nearestHigher: null };
    let lower = null, higher = null;
    for (const n of METHOD3_ASMA_UL_HUSNA_ADAD) {
      if (n.adad < safeTotal && (!lower || n.adad > lower.adad)) lower = n;
      if (n.adad > safeTotal && (!higher || n.adad < higher.adad)) higher = n;
    }
    return { nearestLower: lower, nearestHigher: higher };
  }, [safeTotal, matches]);

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

      <div className="px-4 pt-1 pb-3">
        <div className="rounded-lg border px-3 py-2 text-center" style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
          <div className="font-inter text-[7px] uppercase tracking-widest mb-0.5" style={{ color: G.dim }}>Exact Value Sent Into Lookup</div>
          <div className="font-inter text-sm font-bold tabular-nums" style={{ color: G.gold }}>{safeTotal.toLocaleString()}</div>
          <div className="font-inter text-[7px] uppercase tracking-widest mt-1.5 mb-0.5" style={{ color: G.dim }}>Filter Applied to Method 3 Database</div>
          <div className="font-inter text-[9px] tabular-nums" style={{ color: G.goldDim }}>n.adad === {safeTotal.toLocaleString()}</div>
        </div>
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
                  <div className="flex flex-col">
                    <span className="font-amiri text-2xl" dir="rtl" style={{ color: G.gold, lineHeight: 1.8 }}>{m.name}</span>
                    <span className="font-inter text-[10px]" style={{ color: G.goldDim }}>{m.translit}</span>
                  </div>
                  <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.green }}>{m.adad.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {nearestLower && (
                <div>
                  <div className="font-inter text-[8px] uppercase tracking-widest mb-1.5 text-center" style={{ color: G.dim }}>Nearest Lower</div>
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border"
                    style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
                    <div className="flex flex-col">
                      <span className="font-amiri text-2xl" dir="rtl" style={{ color: G.gold, lineHeight: 1.8 }}>{nearestLower.name}</span>
                      <span className="font-inter text-[10px]" style={{ color: G.goldDim }}>{nearestLower.translit}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-inter text-sm font-bold tabular-nums" style={{ color: G.green }}>{nearestLower.adad.toLocaleString()}</div>
                      <div className="font-inter text-[9px] tabular-nums" style={{ color: G.dim }}>Difference: {(safeTotal - nearestLower.adad).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}
              {nearestHigher && (
                <div>
                  <div className="font-inter text-[8px] uppercase tracking-widest mb-1.5 text-center" style={{ color: G.dim }}>Nearest Higher</div>
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border"
                    style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
                    <div className="flex flex-col">
                      <span className="font-amiri text-2xl" dir="rtl" style={{ color: G.gold, lineHeight: 1.8 }}>{nearestHigher.name}</span>
                      <span className="font-inter text-[10px]" style={{ color: G.goldDim }}>{nearestHigher.translit}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-inter text-sm font-bold tabular-nums" style={{ color: G.green }}>{nearestHigher.adad.toLocaleString()}</div>
                      <div className="font-inter text-[9px] tabular-nums" style={{ color: G.dim }}>Difference: {(nearestHigher.adad - safeTotal).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}