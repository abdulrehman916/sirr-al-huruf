// ═══════════════════════════════════════════════════════════════
// LIVE DAY ANALYSIS COMPONENT — SECTION 1
// Today's planetary ruler with detailed chart
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════

import { motion } from "framer-motion";
import { Sun, Moon, Info } from "lucide-react";
import { DAY_INFO, PLANET_INFO } from "@/lib/astroClockLiveEngine";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";

const G = {
  border:   "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  faint:    "rgba(212,175,55,0.22)",
  bg:       "rgba(212,175,55,0.07)",
  bgHi:     "rgba(212,175,55,0.14)",
  success:  "rgba(34,197,94,0.60)",
  danger:   "rgba(239,68,68,0.60)"
};

export default function LiveDayAnalysis() {
  const { isMalayalam } = useAstroClockLanguage();
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayData = DAY_INFO[dayOfWeek];
  const planetData = dayData ? PLANET_INFO[dayData.ruler] : null;

  if (!dayData || !planetData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(10,22,56,0.99) 0%, rgba(5,12,36,0.99) 100%)",
        borderColor: G.borderHi,
        boxShadow: `0 0 50px ${G.glow}, 0 4px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.10)`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)` }} />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Sun className="w-6 h-6" style={{ color: G.text }} />
        <h2 className="font-inter text-lg font-bold uppercase tracking-widest" style={{ color: G.text }}>
          {isMalayalam ? "ജീവനുള്ള ദിന വിശകലനം" : "Live Day Analysis"}
        </h2>
      </div>

      {/* Day Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Day Name */}
        <div className="p-4 rounded-xl border" style={{ background: G.bg, borderColor: G.faint }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
            {isMalayalam ? "ദിവസം" : "Day"}
          </p>
          <p className="font-inter text-xl font-bold text-white">
            {isMalayalam ? dayData.name_ml : dayData.name_en}
          </p>
        </div>

        {/* Planet Ruler */}
        <div className="p-4 rounded-xl border" style={{ background: G.bg, borderColor: G.faint }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
            {isMalayalam ? "ഗ്രഹ നാഥൻ" : "Planet Ruler"}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{planetData.symbol}</span>
            <div>
              <p className="font-inter text-lg font-bold text-white">
                {isMalayalam ? planetData.name_ml : planetData.name_en}
              </p>
              <p className="font-inter text-[10px]" style={{ color: G.dim }}>
                {isMalayalam ? planetData.nature_ml : planetData.nature_en}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits & Warnings */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Benefits */}
        <div className="p-4 rounded-xl border" style={{ background: "rgba(34,197,94,0.05)", borderColor: G.success }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.success }}>
            {isMalayalam ? "ഗുണങ്ങൾ" : "Benefits"}
          </p>
          <ul className="space-y-2">
            {(isMalayalam ? dayData.benefits_ml : dayData.benefits_en || []).map((benefit, idx) => (
              <li key={idx} className="font-inter text-xs text-white/80 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-1" style={{ background: G.success }} />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Warnings */}
        <div className="p-4 rounded-xl border" style={{ background: "rgba(239,68,68,0.05)", borderColor: G.danger }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.danger }}>
            {isMalayalam ? "മുന്നറിയിപ്പുകൾ" : "Warnings"}
          </p>
          <ul className="space-y-2">
            {(isMalayalam ? dayData.warnings_ml : dayData.warnings_en || []).map((warning, idx) => (
              <li key={idx} className="font-inter text-xs text-white/80 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-1" style={{ background: G.danger }} />
                {warning}
              </li>
            ))}
            {(isMalayalam ? dayData.warnings_ml : dayData.warnings_en || []).length === 0 && (
              <li className="font-inter text-xs text-white/60 italic">
                {isMalayalam ? "പ്രത്യേക മുന്നറിയിപ്പുകളൊന്നുമില്ല" : "No specific warnings"}
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Suitable Operations */}
      <div className="p-4 rounded-xl border mb-4" style={{ background: G.bg, borderColor: G.faint }}>
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4" style={{ color: G.text }} />
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.text }}>
            {isMalayalam ? "ഉചിത പ്രവൃത്തികൾ" : "Suitable Operations"}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {(isMalayalam ? dayData.benefits_ml : dayData.benefits_en || []).map((op, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: G.text }} />
              <span className="font-inter text-xs text-white/80">{op}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Source Reference */}
      <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
        <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
          {isMalayalam ? "ഗ്രന്ഥം" : "Source"}
        </p>
        <p className="font-inter text-xs text-white/60">
          Havâss'ın Derinlikleri — p.50-51
        </p>
      </div>
    </motion.div>
  );
}