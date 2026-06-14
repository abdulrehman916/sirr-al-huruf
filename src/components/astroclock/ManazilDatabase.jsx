// ═══════════════════════════════════════════════════════════════
// MANAZIL DATABASE — SECTION 5
// 28 Lunar Mansions with properties, from Havâss'ın Derinlikleri
// Astro Clock module only — completely isolated
// Arabic Terminology Preservation Rule: Implemented
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, ChevronDown } from "lucide-react";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";
import { AY_MANAZILLERI } from "@/lib/astroClockData.js";

const G = {
  border: "rgba(212,175,55,0.40)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  faint: "rgba(212,175,55,0.22)",
  bg: "rgba(212,175,55,0.07)",
  saad: "rgba(34,197,94,0.70)",
  nahs: "rgba(239,68,68,0.70)",
  mixed: "rgba(255,193,7,0.70)"
};

const ZODIAC_ML = {
    "Koç": "മേഷം",
    "Boğa": "ഇടവം",
    "İkizler": "മിഥുനം",
    "Yengeç": "കർക്കിടകം",
    "Arslan": "ചിങ്ങം",
    "Başak": "കന്നി",
    "Terazi": "തുലാം",
    "Akrep": "വൃശ്ചികം",
    "Yay": "ധനു",
    "Oğlak": "മകരം",
    "Kova": "കുംഭം",
    "Balık": "മീനം"
};

export default function ManazilDatabase() {
  const { isMalayalam } = useAstroClockLanguage();
  const [expandedManzil, setExpandedManzil] = useState(null);

  const getClassificationColor = (classification) => {
    if (classification.includes("Saad")) return G.saad;
    if (classification.includes("Nahs")) return G.nahs;
    return G.mixed;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-5 relative"
      style={{ background: "linear-gradient(145deg, rgba(10,20,50,0.98) 0%, rgba(5,10,30,0.99) 100%)", borderColor: G.border }}
    >
        <div className="flex items-center gap-3 mb-5">
            <Moon className="w-6 h-6" style={{ color: G.text }} />
            <div>
                <h2 className="font-inter text-lg font-bold uppercase tracking-widest" style={{ color: G.text }}>
                    {isMalayalam ? "28 ചാന്ദ്ര നക്ഷത്രങ്ങൾ" : "The 28 Lunar Mansions"}
                </h2>
                <p className="font-inter text-[9px]" style={{ color: G.dim }}>
                    {isMalayalam ? "അൽ-മനാസിൽ അൽ-ഖമർ" : "Al-Manāzil al-Qamar"}
                </p>
            </div>
        </div>

        <div className="space-y-2">
            {(AY_MANAZILLERI || []).map((manzil) => (
                <div key={manzil.no} className="rounded-lg border" style={{borderColor: G.faint, background: G.bg}}>
                    <button 
                        onClick={() => setExpandedManzil(expandedManzil === manzil.no ? null : manzil.no)}
                        className="w-full p-3 flex items-center justify-between text-left"
                    >
                        <div className="flex items-center gap-3">
                            <span className="font-inter font-bold text-sm text-white/80">{manzil.no}</span>
                            <div style={{width: '3px', height: '20px', background: getClassificationColor(manzil.genel_hukum)}}></div>
                            <div>
                                <p className="font-amiri font-bold text-base" style={{color: G.text}}>{manzil.name}</p>
                                <p className="font-inter text-xs text-white/60">{isMalayalam ? ZODIAC_ML[manzil.zodiac_sign] : manzil.zodiac_sign}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="font-amiri text-2xl text-white/90">{manzil.harf_arabic}</p>
                            <ChevronDown 
                                className="w-5 h-5 text-white/50 transition-transform"
                                style={{transform: expandedManzil === manzil.no ? 'rotate(180deg)' : 'rotate(0deg)'}}
                            />
                        </div>
                    </button>

                    <AnimatePresence>
                    {expandedManzil === manzil.no && (
                        <motion.div
                            initial={{height: 0, opacity: 0}}
                            animate={{height: 'auto', opacity: 1}}
                            exit={{height: 0, opacity: 0}}
                            className="overflow-hidden"
                        >
                            <div className="p-4 border-t space-y-3" style={{borderColor: G.faint}}>
                                <p className="font-inter text-xs font-bold uppercase tracking-wider" style={{color: getClassificationColor(manzil.genel_hukum)}}>
                                    {isMalayalam ? (manzil.genel_hukum.includes("Saad") ? "ശുഭകരം" : manzil.genel_hukum.includes("Nahs") ? "അശുഭകരം" : "മിശ്രിതം") : manzil.genel_hukum}
                                </p>
                                <p className="font-inter text-sm text-white/80">
                                    {isMalayalam ? manzil.operations.map(op => `• ${op}`).join('\n').replace(/,/g, ', ') : manzil.operations.map(op => `• ${op}`).join('\n')}
                                </p>
                                {manzil.note && <p className="text-xs text-white/50 pt-2 border-t border-white/10"><i>{isMalayalam ? manzil.note.replace("için", "-നു വേണ്ടി") : manzil.note}</i></p>}
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    </motion.div>
  );
}