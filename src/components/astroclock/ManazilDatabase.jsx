// ═══════════════════════════════════════════════════════════════
// MANAZIL DATABASE — SECTION 5
// All 28 lunar mansions with detailed information
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Moon, Info, ChevronDown, ChevronUp } from "lucide-react";
import { AY_MANAZILLERI } from "@/lib/astroClockData";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";

const G = {
  border:   "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  faint:    "rgba(212,175,55,0.22)",
  bg:       "rgba(212,175,55,0.07)",
  bgHi:     "rgba(212,175,55,0.14)"
};

const ZODIAC_ML = {
  "Koç": "മേഷം", "Boğa": "ഇടവം", "İkizler": "മിഥുനം", "Yengeç": "കർക്കിടകം",
  "Arslan": "ചിങ്ങം", "Başak": "കന്നി", "Terazi": "തുലാം", "Akrep": "വൃശ്ചികം",
  "Yay": "ധനു", "Oğlak": "മകരം", "Kova": "കുംഭം", "Balık": "മീനം"
};

export default function ManazilDatabase() {
  const { isMalayalam } = useAstroClockLanguage();
  const [expandedMansion, setExpandedMansion] = useState(null);

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
        <Moon className="w-6 h-6" style={{ color: G.text }} />
        <div>
          <h2 className="font-inter text-lg font-bold uppercase tracking-widest" style={{ color: G.text }}>
            {isMalayalam ? "28 ചാന്ദ്ര നക്ഷത്രങ്ങൾ" : "28 Lunar Mansions (Manazil)"}
          </h2>
          <p className="font-inter text-[9px]" style={{ color: G.dim }}>
            {isMalayalam ? "പൂർണ്ണ മൻസിൽ ഡാറ്റാബേസ്" : "Complete Manzil Database"}
          </p>
        </div>
      </div>

      {/* Mansions Grid */}
      <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto pr-2">
        {AY_MANAZILLERI.map((mansion) => {
          const isExpanded = expandedMansion === mansion.no;
          const isUnlucky = mansion.genel_hukum?.includes("Uğursuz") || mansion.genel_hukum?.includes("Nahs");
          const isLucky = mansion.genel_hukum?.includes("Uygun") || mansion.genel_hukum?.includes("Saad");
          
          return (
            <motion.div
              key={mansion.no}
              initial={false}
              animate={{ 
                background: isExpanded ? G.bgHi : G.bg,
                borderColor: isExpanded ? G.border : G.faint
              }}
              className="rounded-xl border p-4 cursor-pointer transition-all"
              onClick={() => setExpandedMansion(isExpanded ? null : mansion.no)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-inter text-[10px] font-bold text-white/60 w-8">
                    #{mansion.no.toString().padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-amiri text-lg font-bold" style={{ color: G.text }} dir="rtl">
                      {mansion.harfi}
                    </p>
                    <p className="font-inter text-sm font-bold text-white">
                      {mansion.name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-inter text-[10px] text-white/50 mb-0.5">
                      {isMalayalam ? "രാശി" : "Sign"}
                    </p>
                    <p className="font-inter text-xs font-bold text-white">
                      {isMalayalam ? ZODIAC_ML[mansion.zodiac_sign] : mansion.zodiac_sign}
                    </p>
                    <p className="font-inter text-[9px]" style={{ color: G.dim }}>
                      {mansion.zodiac_degree}°
                    </p>
                  </div>
                  
                  <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${
                    isUnlucky ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                    isLucky ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                    "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  }`}>
                    {isMalayalam 
                      ? (isUnlucky ? "ഉഗ്രസ" : isLucky ? "ശുഭ" : "മിശ്രം")
                      : (isUnlucky ? "Nahs" : isLucky ? "Saad" : "Mixed")
                    }
                  </div>
                  
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" style={{ color: G.dim }} />
                  ) : (
                    <ChevronDown className="w-4 h-4" style={{ color: G.dim }} />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: G.faint }}>
                      {/* Operations */}
                      <div className="mb-4">
                        <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.text }}>
                          {isMalayalam ? "ഉചിത പ്രവൃത്തികൾ" : "Suitable Operations"}
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {mansion.operations.map((op, idx) => (
                            <div key={idx} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                              <Star className="w-3 h-3 mt-0.5" style={{ color: G.text }} />
                              <p className="font-inter text-xs text-white/80">{op}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Letter */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 rounded-lg" style={{ background: G.bg }}>
                          <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                            {isMalayalam ? "അക്ഷരം" : "Letter"}
                          </p>
                          <p className="font-amiri text-xl font-bold" style={{ color: G.text }} dir="rtl">
                            {mansion.harfi}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg" style={{ background: G.bg }}>
                          <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                            {isMalayalam ? "രാശി" : "Zodiac"}
                          </p>
                          <p className="font-inter text-sm font-bold text-white">
                            {isMalayalam ? ZODIAC_ML[mansion.zodiac_sign] : mansion.zodiac_sign}
                          </p>
                          <p className="font-inter text-[10px]" style={{ color: G.dim }}>
                            {mansion.zodiac_degree}°
                          </p>
                        </div>
                      </div>

                      {/* Note */}
                      {mansion.note && (
                        <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                          <div className="flex items-start gap-2">
                            <Info className="w-3 h-3 mt-0.5" style={{ color: G.dim }} />
                            <p className="font-inter text-xs text-white/60">{mansion.note}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}