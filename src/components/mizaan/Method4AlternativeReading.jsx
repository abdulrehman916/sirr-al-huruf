// ═══════════════════════════════════════════════════════════════
// METHOD 4 — ALTERNATIVE READING METHOD (display-only)
// Reuses the Nine Mizan Total's original Istintak letters (Step 1
// of the shared pipeline) — no recalculation performed here.
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

export default function Method4AlternativeReading({ nineMizanTotal, seedLetters, totalSeed, seedAdad }) {
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
          <span className="font-inter text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: G.goldDim }}>Alternative Reading Method</span>
          <span className="font-amiri text-base" style={{ color: G.goldDim }}>✦</span>
        </div>
        <p className="font-malayalam text-base font-bold" style={{ color: G.gold }}>മറ്റൊരു പാരായണ രീതി</p>
      </div>

      <OrnamentalDivider />

      <div className="px-4 pb-6 space-y-4 pt-4">
        <div className="rounded-xl border p-4 space-y-3" style={{ background: G.goldFaint, borderColor: G.goldBorderHi }}>
          <p className="font-malayalam text-sm leading-relaxed text-center" style={{ color: G.gold }}>
            എസ്മാ-ഇ കിതാബത്ത്, എസ്മാ-ഇ അഅ്‌വാൻ, എസ്മാ-ഇ ഖസം എന്നിവയുടെ പേരുകൾ അവയുടെ അദദ് (സംഖ്യ) അനുസരിച്ച് പാരായണം ചെയ്യാം.
          </p>
          <div className="h-px w-full" style={{ background: G.goldBorder }} />
          <p className="font-malayalam text-sm leading-relaxed text-center" style={{ color: G.gold }}>
            അല്ലെങ്കിൽ,
          </p>
          <p className="font-malayalam text-sm leading-relaxed text-center" style={{ color: G.gold }}>
            ഒൻപത് മീസാനുകളുടെ മൊത്തം സംഖ്യയിൽ നിന്ന് ഇസ്തിന്താഖ് ചെയ്തപ്പോൾ ലഭിച്ച അക്ഷരങ്ങൾ മാത്രം അവയുടെ അദദ് അനുസരിച്ച് പാരായണം ചെയ്യാവുന്നതാണ്.
          </p>
        </div>

        <div className="rounded-xl border p-4" style={{ background: G.bgInner, borderColor: G.goldBorder + "55" }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="font-inter text-[11px] font-bold" style={{ color: G.gold }}>Nine Mizan Total Istintak Letters</span>
          </div>

          <div className="space-y-3 pl-1">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg border"
              style={{ background: G.goldFaint, borderColor: G.goldBorder + "55" }}>
              <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>Total Number</span>
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

            <div className="flex items-center gap-2">
              <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>Total Letter Count:</span>
              <span className="font-inter text-base font-black tabular-nums" style={{ color: G.gold }}>{totalSeed || 0}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>Adad (Count):</span>
              <span className="font-inter text-base font-black tabular-nums" style={{ color: G.gold }}>{(seedAdad || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${G.goldBorderHi} 40%, ${G.gold}88 50%, ${G.goldBorderHi} 60%, transparent 95%)` }} />
    </motion.div>
  );
}