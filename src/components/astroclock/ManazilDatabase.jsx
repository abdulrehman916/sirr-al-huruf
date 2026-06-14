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
import { LUNAR_MANSION_DATA } from "@/lib/astroClockLunarMansionML.js";

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



export default function ManazilDatabase() {
  const { isMalayalam } = useAstroClockLanguage();
  const [expandedManzil, setExpandedManzil] = useState(null);

  const getClassificationColor = (nature) => {
    if (nature === "Saad") return G.saad;
    if (nature === "Nahs") return G.nahs;
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
            {(LUNAR_MANSION_DATA || []).map((manzil) => (
                <div key={manzil.number} className="rounded-lg border" style={{borderColor: G.faint, background: G.bg}}>
                    <button 
                        onClick={() => setExpandedManzil(expandedManzil === manzil.number ? null : manzil.number)}
                        className="w-full p-4 flex items-center justify-between text-left"
                    >
                        <div className="flex items-center gap-4">
                            <span className="font-inter font-bold text-base text-white/90 w-8 h-8 flex items-center justify-center rounded-full" style={{ background: G.bg, border: `1px solid ${G.faint}` }}>
                              {manzil.number}
                            </span>
                            <div style={{width: '4px', height: '32px', borderRadius: '2px', background: getClassificationColor(manzil.nature)}}></div>
                            <div>
                                <p className="font-amiri font-bold text-3xl md:text-4xl leading-relaxed" style={{color: G.text, textShadow: "0 0 25px rgba(212,175,55,0.25)"}}>{manzil.name_en}</p>
                                <p className="font-malayalam-sm font-semibold text-white/80 mt-0.5">{isMalayalam ? manzil.zodiac_sign_ml : manzil.zodiac_sign}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="font-amiri text-4xl md:text-5xl text-white/95 leading-relaxed" style={{ textShadow: "0 0 20px rgba(212,175,55,0.2)" }}>{manzil.letter_malayalam}</p>
                                <p className="font-inter text-[8px] text-white/50 mt-0.5">Arabic: {manzil.name_arabic}</p>
                            </div>
                            <ChevronDown 
                                className="w-6 h-6 text-gold transition-transform"
                                style={{transform: expandedManzil === manzil.number ? 'rotate(180deg)' : 'rotate(0deg)'}}
                            />
                        </div>
                    </button>

                    <AnimatePresence>
                    {expandedManzil === manzil.number && (
                        <motion.div
                            initial={{height: 0, opacity: 0}}
                            animate={{height: 'auto', opacity: 1}}
                            exit={{height: 0, opacity: 0}}
                            className="overflow-hidden"
                        >
                            <div className="p-4 border-t space-y-3" style={{borderColor: G.faint}}>
                                <p className="font-inter text-xs font-bold uppercase tracking-wider" style={{color: getClassificationColor(manzil.nature)}}>
                                    {isMalayalam ? manzil.nature_ml : manzil.nature}
                                </p>
                                
                                {/* Letter Info with Malayalam Name */}
                                <div className="mt-3 p-3 rounded-lg" style={{background: G.bg, border: `1px solid ${G.border}`}}>
                                    <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{color: G.dim}}>
                                        {isMalayalam ? "അക്ഷരം" : "Letter"}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="text-center">
                                            <p className="font-amiri text-5xl font-bold mb-1" style={{color: G.text}}>{manzil.name_arabic}</p>
                                            <p className="font-inter text-[8px] uppercase tracking-wider" style={{color: G.dim}}>Arabic Letter</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-malayalam-md font-bold text-white text-lg">{manzil.letter_malayalam}</p>
                                            <p className="font-inter text-[8px] uppercase tracking-wider" style={{color: G.dim}}>Malayalam Name</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    {(isMalayalam ? manzil.operations_ml : manzil.operations).map((op, idx) => (
                                        <p key={idx} className="font-inter text-sm text-white/80">• {op}</p>
                                    ))}
                                </div>
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