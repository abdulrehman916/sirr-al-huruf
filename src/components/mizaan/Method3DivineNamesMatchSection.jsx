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
    return METHOD3_ASMA_UL_HUSNA_ADAD.filter(n => n.adad === safeTotal).sort((a, b) => a.adad - b.adad);
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
      </div>

      <div className="px-4 pt-1 pb-3">
        <div className="rounded-lg border px-3 py-2.5 text-center" style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
          <div className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>Search Value (Abjad Kabir)</div>
          <div className="font-inter text-lg font-black tabular-nums" style={{ color: G.gold }}>{safeTotal.toLocaleString()}</div>
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
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="font-inter text-[8px] uppercase tracking-widest text-right pb-2 px-2" style={{ color: G.dim }}>Arabic Name</th>
                    <th className="font-inter text-[8px] uppercase tracking-widest text-left pb-2 px-2" style={{ color: G.dim }}>Transliteration</th>
                    <th className="font-inter text-[8px] uppercase tracking-widest text-right pb-2 px-2" style={{ color: G.dim }}>Abjad Kabir Value</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((m, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: G.goldBorder + "40" }}>
                      <td className="py-2.5 px-2 text-right">
                        <span className="font-amiri text-xl" dir="rtl" style={{ color: G.gold, lineHeight: 1.8 }}>{m.name}</span>
                      </td>
                      <td className="py-2.5 px-2 text-left">
                        <span className="font-inter text-[11px]" style={{ color: G.goldDim }}>{m.translit}</span>
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <span className="font-inter text-sm font-bold tabular-nums" style={{ color: G.green }}>{m.adad.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-3">
              {nearestLower && (
                <div className="rounded-lg border p-3" style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
                  <div className="font-inter text-[8px] uppercase tracking-widest mb-2 text-center" style={{ color: G.dim }}>Nearest Lower Match</div>
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px] font-inter">
                    <span style={{ color: G.dim }}>Arabic</span>
                    <span className="font-amiri text-lg text-right" dir="rtl" style={{ color: G.gold, lineHeight: 1.8 }}>{nearestLower.name}</span>
                    <span style={{ color: G.dim }}>Transliteration</span>
                    <span className="text-right" style={{ color: G.goldDim }}>{nearestLower.translit}</span>
                    <span style={{ color: G.dim }}>Abjad Value</span>
                    <span className="text-right font-bold tabular-nums" style={{ color: G.green }}>{nearestLower.adad.toLocaleString()}</span>
                    <span style={{ color: G.dim }}>Difference</span>
                    <span className="text-right tabular-nums" style={{ color: G.gold }}>{(safeTotal - nearestLower.adad).toLocaleString()}</span>
                  </div>
                </div>
              )}
              {nearestHigher && (
                <div className="rounded-lg border p-3" style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
                  <div className="font-inter text-[8px] uppercase tracking-widest mb-2 text-center" style={{ color: G.dim }}>Nearest Higher Match</div>
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px] font-inter">
                    <span style={{ color: G.dim }}>Arabic</span>
                    <span className="font-amiri text-lg text-right" dir="rtl" style={{ color: G.gold, lineHeight: 1.8 }}>{nearestHigher.name}</span>
                    <span style={{ color: G.dim }}>Transliteration</span>
                    <span className="text-right" style={{ color: G.goldDim }}>{nearestHigher.translit}</span>
                    <span style={{ color: G.dim }}>Abjad Value</span>
                    <span className="text-right font-bold tabular-nums" style={{ color: G.green }}>{nearestHigher.adad.toLocaleString()}</span>
                    <span style={{ color: G.dim }}>Difference</span>
                    <span className="text-right tabular-nums" style={{ color: G.gold }}>{(nearestHigher.adad - safeTotal).toLocaleString()}</span>
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