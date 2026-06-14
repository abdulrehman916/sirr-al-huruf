// ═══════════════════════════════════════════════════════════════
// PLANET KNOWLEDGE PANELS — SECTION 6
// 7 Classical planets with properties, relationships, and actions
// Astro Clock module only — completely isolated
// Arabic Terminology Preservation Rule: Implemented
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, ChevronDown } from "lucide-react";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";
import { PLANET_INFO, WEEKDAY_ANALYSIS } from "@/lib/astroClockLiveEngine.js";

const G = {
  border: "rgba(212,175,55,0.40)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  faint: "rgba(212,175,55,0.22)",
  bg: "rgba(212,175,55,0.07)",
  success: "rgba(34,197,94,0.60)",
  danger: "rgba(239,68,68,0.60)"
};

export default function PlanetKnowledgePanels() {
  const { isMalayalam } = useAstroClockLanguage();
  const planets = Object.values(PLANET_INFO);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(18,8,44,0.98) 0%, rgba(10,4,28,0.99) 100%)",
        borderColor: G.border,
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <Sun className="w-6 h-6" style={{ color: G.text }} />
        <div>
          <h2 className="font-inter text-lg font-bold uppercase tracking-widest" style={{ color: G.text }}>
            {isMalayalam ? "7 ഗ്രഹങ്ങൾ" : "The 7 Planets"}
          </h2>
          <p className="font-inter text-[9px]" style={{ color: G.dim }}>
            {isMalayalam ? "സ്വഭാവങ്ങളും പ്രവർത്തനങ്ങളും" : "Properties and Actions"}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(planets || []).map((planet) => (
          <PlanetCard key={planet.name_en} planet={planet} isMalayalam={isMalayalam} />
        ))}
      </div>
    </motion.div>
  );
}

function PlanetCard({ planet, isMalayalam }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border" style={{ background: G.bg, borderColor: G.faint }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between"
      >
        <div className="flex items-center gap-4 text-left">
          <span className="text-4xl">{planet.symbol}</span>
          <div className="flex-1">
            <p className="font-amiri text-5xl font-bold leading-relaxed mb-1" style={{ color: G.text, textShadow: "0 0 25px rgba(212,175,55,0.25)" }}>
              {planet.name_ar}
            </p>
            <p className="font-inter text-xl font-bold text-white/95">
              {isMalayalam ? planet.name_ml_equivalent : planet.name_en}
            </p>
            {isMalayalam && planet.name_en && (
              <p className="font-inter text-xs text-white/50 mt-0.5">{planet.name_en}</p>
            )}
          </div>
        </div>
        <ChevronDown
          className="w-6 h-6 transition-transform duration-300 flex-shrink-0"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", color: G.text }}
        />
      </button>

      {isOpen && (
        <div className="p-5 border-t space-y-4" style={{ borderColor: G.faint }}>
          <div className="p-4 rounded-lg bg-black/30">
            <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
              {isMalayalam ? "സ്വഭാവം" : "Nature"}
            </p>
            <p className="font-inter text-base text-white/90 leading-relaxed">
              {isMalayalam ? planet.nature_ml : planet.nature_en}
            </p>
          </div>
          
          {/* Pronunciation (Optional Details Section) */}
          <div className="p-4 rounded-lg bg-black/20 border" style={{ borderColor: G.faint }}>
            <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
                {isMalayalam ? "ഉച്ചാരണം" : "Pronunciation"}
            </p>
            <p className="font-inter text-sm text-white/70">
                {isMalayalam ? planet.name_ml_reading : planet.name_en_transliteration}
            </p>
          </div>

          <div className="p-4 rounded-lg" style={{ background: "rgba(34,197,94,0.08)", border: `1px solid ${G.success}` }}>
              <p className="font-inter text-[9px] uppercase tracking-widest mb-3 font-bold" style={{ color: G.success }}>
                  {isMalayalam ? "നല്ല പ്രവർത്തനങ്ങൾ" : "Good Actions"}
              </p>
              <div className="flex flex-wrap gap-2">
                  {(isMalayalam ? planet.goodActions_ml : planet.goodActions_en || []).map((action, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: "rgba(34,197,94,0.15)", color: "#86efac" }}>
                      {action}
                    </span>
                  ))}
              </div>
          </div>

          <div className="p-4 rounded-lg" style={{ background: "rgba(239,68,68,0.08)", border: `1px solid ${G.danger}` }}>
              <p className="font-inter text-[9px] uppercase tracking-widest mb-3 font-bold" style={{ color: G.danger }}>
                  {isMalayalam ? "ചീത്ത പ്രവർത്തനങ്ങൾ" : "Bad Actions"}
              </p>
              <div className="flex flex-wrap gap-2">
                  {(isMalayalam ? planet.badActions_ml : planet.badActions_en || []).map((action, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5" }}>
                      {action}
                    </span>
                  ))}
              </div>
          </div>

          <div className="p-4 rounded-lg bg-black/30 border" style={{ borderColor: G.faint }}>
            <p className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.text }}>
                {isMalayalam ? "ആത്മിക പ്രവർത്തനങ്ങൾ" : "Spiritual Operations"}
            </p>
            <div className="space-y-2">
                {(isMalayalam ? planet.spiritualOperations_ml : planet.spiritualOperations_en).map((op, idx) => (
                  <p key={idx} className="font-inter text-sm text-white/85 leading-relaxed">
                    <span className="text-gold mr-2">✦</span>{op}
                  </p>
                ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}