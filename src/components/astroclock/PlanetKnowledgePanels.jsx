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
        className="w-full p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3 text-left">
          <span className="text-3xl">{planet.symbol}</span>
          <div>
            <p className="font-amiri text-lg font-bold" style={{ color: G.text }}>{planet.name_ar}</p>
            <p className="font-inter text-sm font-bold text-white/90 -mt-1">
              {isMalayalam ? planet.name_ml_equivalent : planet.name_en}
            </p>
          </div>
        </div>
        <ChevronDown
          className="w-5 h-5 transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", color: G.dim }}
        />
      </button>

      {isOpen && (
        <div className="p-4 border-t space-y-3" style={{ borderColor: G.faint }}>
          <p className="font-inter text-sm text-white/80 italic">
            {isMalayalam ? planet.nature_ml : planet.nature_en}
          </p>
          
          {/* Pronunciation (Optional Details) */}
          <div className="p-3 rounded-lg bg-black/20">
            <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                {isMalayalam ? "ഉച്ചാരണം" : "Pronunciation"}
            </p>
            <p className="font-inter text-xs text-white/70">
                {isMalayalam ? planet.name_ml_reading : planet.name_en_transliteration}
            </p>
          </div>

          <div className="p-3 rounded-lg" style={{ background: "rgba(34,197,94,0.05)" }}>
              <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.success }}>
                  {isMalayalam ? "നല്ല പ്രവർത്തനങ്ങൾ" : "Good Actions"}
              </p>
              <p className="font-inter text-xs text-white/70">
                  {(isMalayalam ? planet.goodActions_ml : planet.goodActions_en || []).join(', ')}
              </p>
          </div>

          <div className="p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.05)" }}>
              <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.danger }}>
                  {isMalayalam ? "ചീത്ത പ്രവർത്തനങ്ങൾ" : "Bad Actions"}
              </p>
              <p className="font-inter text-xs text-white/70">
                  {(isMalayalam ? planet.badActions_ml : planet.badActions_en || []).join(', ')}
              </p>
          </div>

          <div className="p-3 rounded-lg bg-black/20">
            <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                {isMalayalam ? "ആത്മിക പ്രവർത്തനങ്ങൾ" : "Spiritual Operations"}
            </p>
            <p className="font-inter text-xs text-white/70">
                {isMalayalam ? planet.spiritualOperations_ml.join(', ') : planet.spiritualOperations_en.join(', ')}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}