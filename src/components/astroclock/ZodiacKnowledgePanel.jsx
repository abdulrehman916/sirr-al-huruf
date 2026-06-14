// ═══════════════════════════════════════════════════════════════
// ZODIAC KNOWLEDGE PANEL — SECTION 7
// 12 Zodiac signs with properties, from Havâss'ın Derinlikleri
// Astro Clock module only — completely isolated
// Arabic Terminology Preservation Rule: Implemented
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZODIAC_SIGNS } from "@/lib/astroClockZodiacData.js";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";
import { Star, ChevronDown } from "lucide-react";

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
  const [selectedSignKey, setSelectedSignKey] = useState(null);

  const signs = Object.values(ZODIAC_SIGNS);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(12,22,48,0.98) 0%, rgba(6,12,28,0.99) 100%)",
        borderColor: G.border,
        boxShadow: `0 0 45px ${G.glow}, 0 4px 20px rgba(0,0,0,0.5)`
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <Star className="w-6 h-6" style={{ color: G.text }} />
        <div>
          <h2 className="font-inter text-lg font-bold uppercase tracking-widest" style={{ color: G.text }}>
            {isMalayalam ? "12 രാശികൾ" : "The 12 Zodiac Signs"}
          </h2>
          <p className="font-inter text-[9px]" style={{ color: G.dim }}>
            {isMalayalam ? "ഹവാസ്സിൻ്റെ രഹസ്യങ്ങളിൽ നിന്നുള്ള സ്വഭാവങ്ങൾ" : "Properties from Havâss'ın Derinlikleri"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {(signs || []).map((sign) => (
          <button
            key={sign.key}
            onClick={() => setSelectedSignKey(selectedSignKey === sign.key ? null : sign.key)}
            className="p-3 rounded-lg text-center border transition-all duration-300"
            style={{
              background: selectedSignKey === sign.key ? G.bgHi : "rgba(255,255,255,0.02)",
              borderColor: selectedSignKey === sign.key ? G.border : "rgba(255,255,255,0.08)",
              boxShadow: selectedSignKey === sign.key ? `0 0 15px ${G.glow}` : 'none',
            }}
          >
            <p className="text-3xl mb-1">{sign.symbol}</p>
            <p className="font-inter text-xs font-bold text-white/80">
              {isMalayalam ? sign.name_ml_equivalent : sign.name_en}
            </p>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selectedSignKey && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: "20px" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <SignDetails sign={ZODIAC_SIGNS[selectedSignKey]} isMalayalam={isMalayalam} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SignDetails({ sign, isMalayalam }) {
  if (!sign) return null;

  return (
    <div className="rounded-xl border p-4 space-y-4" style={{ background: G.bg, borderColor: G.faint }}>
      {/* Main Identity */}
      <div className="text-center p-4 rounded-lg" style={{ background: "rgba(0,0,0,0.2)"}}>
        <p className="font-amiri text-3xl font-bold" style={{ color: G.text }}>{sign.name_ar}</p>
        <p className="font-inter text-base mt-1" style={{ color: G.dim }}>
          {isMalayalam ? sign.name_ml_reading : sign.name_en_transliteration}
        </p>
        <p className="font-inter text-sm text-white/80">
          {isMalayalam ? sign.name_ml_equivalent : sign.name_en}
        </p>
      </div>

      {/* Explanation */}
      <div className="p-3 rounded-lg bg-black/20">
          <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
            {isMalayalam ? "വിശദീകരണം" : "Explanation"}
          </p>
          <p className="font-inter text-sm text-white/80">
            {isMalayalam ? sign.explanation_ml : sign.explanation_en}
          </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <InfoBox label={isMalayalam ? "മൂലകം" : "Element"} value={isMalayalam ? sign.element_ml : sign.element} />
        <InfoBox label={isMalayalam ? "ഗ്രഹം" : "Ruling Planet"} value={isMalayalam ? sign.ruling_planet_ml : sign.ruling_planet} />
        <InfoBox label={isMalayalam ? "ലിംഗം" : "Gender"} value={isMalayalam ? sign.gender_ml : sign.gender} />
        <InfoBox label={isMalayalam ? "ലോഹം" : "Metal"} value={isMalayalam ? sign.metal_ml : sign.metal} />
      </div>
      
      {/* Incense */}
      <div className="p-3 rounded-lg bg-black/20">
        <p className="font-inter text-[9px] uppercase tracking-widest mb-1 text-center" style={{ color: G.dim }}>
            {isMalayalam ? "സുഗന്ധം (Buhur)" : "Incense (Buhur)"}
        </p>
        <p className="font-amiri text-lg text-center font-bold" style={{color: G.text}}>{sign.incense_ar}</p>
        <p className="text-center font-inter text-sm text-white/80">{isMalayalam ? sign.incense_ml : sign.incense}</p>
      </div>

    </div>
  );
}

function InfoBox({label, value}){
    return (
        <div className="p-3 rounded-lg bg-black/20">
            <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>{label}</p>
            <p className="font-inter text-sm font-bold text-white/90">{value}</p>
        </div>
    )
}