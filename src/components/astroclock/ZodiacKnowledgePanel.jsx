// ═══════════════════════════════════════════════════════════════
// ZODIAC KNOWLEDGE PANEL — Complete 12 Zodiac Signs
// From Havâss'ın Derinlikleri (Pages 20-31)
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Star, Zap, Heart, Shield } from "lucide-react";
import { ZODIAC_SIGNS } from "@/lib/astroClockZodiacData.js";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  faint: "rgba(212,175,55,0.22)",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)"
};

export default function ZodiacKnowledgePanel() {
  const { isMalayalam } = useAstroClockLanguage();
  const [expandedSign, setExpandedSign] = useState(null);
  const zodiacArray = Object.entries(ZODIAC_SIGNS).map(([key, val]) => ({ key, ...val }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(8,20,52,0.98) 0%, rgba(4,12,34,0.99) 100%)",
        borderColor: G.borderHi,
        boxShadow: `0 0 50px ${G.glow}, 0 4px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.10)`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)` }} />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Star className="w-6 h-6" style={{ color: G.text }} />
        <div>
          <h2 className="font-inter text-lg font-bold uppercase tracking-widest" style={{ color: G.text }}>
            {isMalayalam ? "ബുർച് / രാശി ജ്ഞാനം" : "Zodiac Knowledge"}
          </h2>
          <p className="font-inter text-[9px]" style={{ color: G.dim }}>
            {isMalayalam ? "12 ബുർച് സമ്പൂർണ വിവരണം" : "Complete 12 Zodiac Signs"}
          </p>
        </div>
      </div>

      {/* Zodiac Grid */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {(zodiacArray || []).map((zodiac) => (
          <button
            key={zodiac.key}
            onClick={() => setExpandedSign(expandedSign === zodiac.key ? null : zodiac.key)}
            className="p-3 rounded-lg border transition-all text-center"
            style={{
              background: expandedSign === zodiac.key ? G.bgHi : "rgba(255,255,255,0.02)",
              borderColor: expandedSign === zodiac.key ? G.border : "rgba(255,255,255,0.08)",
              opacity: expandedSign && expandedSign !== zodiac.key ? 0.5 : 1
            }}
          >
            <p className="font-amiri text-lg font-bold mb-1" style={{ color: G.text }}>
              {zodiac[isMalayalam ? "name_ml" : "name_en"]}
            </p>
            <p className="font-inter text-[8px] uppercase tracking-wider text-white/60">
              {zodiac[isMalayalam ? "name_tr" : "name_en"]}
            </p>
            <p className="font-inter text-[9px] mt-1" style={{ color: G.dim }}>
              {zodiac.ruling_planet_symbol}
            </p>
          </button>
        ))}
      </div>

      {/* Expanded Sign Detail */}
      <AnimatePresence>
        {expandedSign && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl border p-4 mb-4"
            style={{ background: G.bg, borderColor: G.faint }}
          >
            {zodiacArray.map((zodiac) => {
              if (zodiac.key !== expandedSign) return null;
              
              return (
                <div key={zodiac.key} className="space-y-4">
                  {/* Title */}
                  <div className="flex items-end justify-between border-b pb-3" style={{ borderColor: G.faint }}>
                    <div>
                      <p className="font-amiri text-3xl font-bold mb-1" style={{ color: G.text }}>
                        {zodiac[isMalayalam ? "name_ml" : "name_en"]}
                      </p>
                      <p className="font-inter text-xs text-white/60">
                        {isMalayalam ? "തി." : "Dates:"} {zodiac.date_range_start} — {zodiac.date_range_end}
                      </p>
                    </div>
                    <p className="text-5xl">{zodiac.ruling_planet_symbol}</p>
                  </div>

                  {/* Core Properties Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Element */}
                    <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                        {isMalayalam ? "അപരം" : "Element"}
                      </p>
                      <p className="font-inter text-sm font-bold text-white">
                        {zodiac[isMalayalam ? "element_ml" : "element"]}
                      </p>
                    </div>

                    {/* Gender */}
                    <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                        {isMalayalam ? "ലിംഗം" : "Gender"}
                      </p>
                      <p className="font-inter text-sm font-bold text-white">
                        {zodiac[isMalayalam ? "gender_ml" : "gender"]}
                      </p>
                    </div>

                    {/* Ruling Planet */}
                    <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                        {isMalayalam ? "ഭരണ ഗ്രഹം" : "Ruling Planet"}
                      </p>
                      <p className="font-inter text-sm font-bold text-white">
                        {zodiac[isMalayalam ? "ruling_planet_tr" : "ruling_planet"]}
                      </p>
                    </div>

                    {/* Metal */}
                    <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                        {isMalayalam ? "ലോഹം" : "Metal"}
                      </p>
                      <p className="font-inter text-sm font-bold text-white">
                        {zodiac[isMalayalam ? "metal_tr" : "metal"]}
                      </p>
                    </div>
                  </div>

                  {/* Incense */}
                  <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
                      {isMalayalam ? "സുഗന്ധം (ബുഹുരു)" : "Incense (Buhuru)"}
                    </p>
                    <p className="font-inter text-sm text-white/80">{zodiac.incense}</p>
                    <p className="font-amiri text-xs mt-1" style={{ color: G.dim }}>{zodiac.incense_ar}</p>
                  </div>

                  {/* Friendly Signs */}
                  <div className="p-3 rounded-lg" style={{ background: "rgba(34,197,94,0.05)", border: `1px solid rgba(34,197,94,0.25)` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4" style={{ color: "rgba(34,197,94,0.80)" }} />
                      <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: "rgba(34,197,94,0.80)" }}>
                        {isMalayalam ? "സൌഹൃദ ബുർച്ചുകൾ" : "Friendly Zodiac Signs"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(zodiac.friendly_signs || []).map((sign, idx) => (
                        <span key={idx} className="px-2 py-1 rounded text-[10px] text-white/70" style={{ background: "rgba(34,197,94,0.15)" }}>
                          {sign}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Enemy Signs */}
                  <div className="p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.05)", border: `1px solid rgba(239,68,68,0.25)` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4" style={{ color: "rgba(239,68,68,0.80)" }} />
                      <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: "rgba(239,68,68,0.80)" }}>
                        {isMalayalam ? "ശത്രു ബുർച്ചുകൾ" : "Enemy Zodiac Signs"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(zodiac.enemy_signs || []).map((sign, idx) => (
                        <span key={idx} className="px-2 py-1 rounded text-[10px] text-white/70" style={{ background: "rgba(239,68,68,0.15)" }}>
                          {sign}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Day Associations */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                        {isMalayalam ? "പകൽ ദിനം" : "Day Association"}
                      </p>
                      <p className="font-inter text-sm font-bold text-white">
                        {zodiac[isMalayalam ? "day_association_tr" : "day_association"]}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                        {isMalayalam ? "രാത്രി ദിനം" : "Night Association"}
                      </p>
                      <p className="font-inter text-sm font-bold text-white">
                        {zodiac[isMalayalam ? "night_association_tr" : "night_association"]}
                      </p>
                    </div>
                  </div>

                  {/* Arabic Letters */}
                  <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
                      {isMalayalam ? "അറബി ചിഹ്നങ്ങൾ" : "Arabic Letters"}
                    </p>
                    <div className="flex gap-3">
                      {(zodiac.letters || []).map((letter, idx) => (
                        <div key={idx} className="text-center">
                          <p className="font-amiri text-2xl font-bold mb-1" style={{ color: G.text }}>
                            {letter}
                          </p>
                          <p className="font-inter text-[9px] text-white/60">
                            {zodiac.letter_names[idx]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Spiritual Meaning */}
                  <div className="p-4 rounded-xl" style={{ background: "rgba(212,175,55,0.04)", border: `1px solid ${G.faint}` }}>
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 mt-0.5" style={{ color: G.dim }} />
                      <div className="flex-1">
                        <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
                          {isMalayalam ? "ആത്മിക അർത്ഥം" : "Spiritual Meaning"}
                        </p>
                        <p className="font-inter text-sm text-white/80">
                          {zodiac.spiritual_meaning_ml}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Source */}
                  <p className="font-inter text-[10px] text-white/40 text-center">
                    {isMalayalam ? "സ്രോതസ്സ്:" : "Source:"} Havâss'ın Derinlikleri, Pages 20-31
                  </p>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Note */}
      <div className="p-3 rounded-xl" style={{ background: G.bg, border: `1px solid ${G.faint}` }}>
        <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
          💡 {isMalayalam ? "സമ്മതി" : "Info"}
        </p>
        <p className="font-inter text-xs text-white/60">
          {isMalayalam 
            ? "ബുർച്ചിനെ അതിന്റെ മേൽ ക്ലിക്ക് ചെയ്ത് സമ്പൂർണ വിവരണം കാണുക."
            : "Click a zodiac sign above to view complete properties and associations."}
        </p>
      </div>
    </motion.div>
  );
}