// ═══════════════════════════════════════════════════════════════
// LIVE MOON STATUS — SECTION 4
// Current lunar mansion, degree, zodiac sign
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Star, Info, BookOpen } from "lucide-react";
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

// Simplified moon position calculation
function getCurrentMoonPosition() {
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (24 * 60 * 60 * 1000));
  
  // Moon completes cycle in ~27.32 days through 28 mansions
  const mansionIndex = Math.floor((dayOfYear % 27.32) / 27.32 * 28);
  const mansion = AY_MANAZILLERI[mansionIndex] || AY_MANAZILLERI[0];
  
  // Approximate zodiac position
  const zodiacIndex = Math.floor((dayOfYear % 27.32) / 27.32 * 12);
  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  const zodiacSignsML = [
    "മേഷം", "ഇടവം", "മിഥുനം", "കർക്കിടകം", "ചിങ്ങം", "കന്നി",
    "തുലാം", "വൃശ്ചികം", "ധനു", "മകരം", "കുംഭം", "മീനം"
  ];
  
  return {
    mansion,
    mansionIndex: mansionIndex + 1,
    zodiacSign: zodiacSigns[zodiacIndex],
    zodiacSignML: zodiacSignsML[zodiacIndex],
    degree: Math.floor((dayOfYear % 27.32) / 27.32 * 30)
  };
}

export default function LiveMoonStatus() {
  const { isMalayalam } = useAstroClockLanguage();
  const [moonData, setMoonData] = useState(null);

  useEffect(() => {
    setMoonData(getCurrentMoonPosition());
    const interval = setInterval(() => {
      setMoonData(getCurrentMoonPosition());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (!moonData) return null;

  const { mansion, mansionIndex, zodiacSign, zodiacSignML, degree } = moonData;

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
            {isMalayalam ? "ചന്ദ്ര നിലപാട്" : "Current Moon Status"}
          </h2>
          <p className="font-inter text-[9px]" style={{ color: G.dim }}>
            {isMalayalam ? "നിലവിലെ ചാന്ദ്ര നക്ഷത്രം" : "Current Lunar Mansion"}
          </p>
        </div>
      </div>

      {/* Moon Mansion Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Mansion Name */}
        <div className="p-4 rounded-xl border" style={{ background: G.bg, borderColor: G.faint }}>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4" style={{ color: G.text }} />
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              {isMalayalam ? "നക്ഷത്രം" : "Lunar Mansion"}
            </p>
          </div>
          <p className="font-amiri text-2xl font-bold mb-1" style={{ color: G.text }} dir="rtl">
            {mansion?.harf_arabic}
          </p>
          <p className="font-inter text-sm font-bold text-white">
            {mansion?.name || "Unknown"}
          </p>
          <p className="font-inter text-[10px]" style={{ color: G.dim }}>
            #{mansionIndex} / 28
          </p>
        </div>

        {/* Zodiac Sign */}
        <div className="p-4 rounded-xl border" style={{ background: G.bg, borderColor: G.faint }}>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4" style={{ color: G.text }} />
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              {isMalayalam ? "രാശി" : "Zodiac Sign"}
            </p>
          </div>
          <p className="font-inter text-lg font-bold text-white mb-1">
            {isMalayalam ? zodiacSignML : zodiacSign}
          </p>
          <p className="font-inter text-xs text-white/70">
            {degree}° {isMalayalam ? zodiacSignML : zodiacSign}
          </p>
        </div>
      </div>

      {/* Operations */}
      <div className="p-4 rounded-xl border mb-4" style={{ background: G.bg, borderColor: G.faint }}>
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4" style={{ color: G.text }} />
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.text }}>
            {isMalayalam ? "ഉചിത പ്രവൃത്തികൾ" : "Suitable Operations"}
          </p>
        </div>
        <div className="space-y-2">
          {(mansion?.operations || []).slice(0, 4).map((op, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: G.text }} />
              <p className="font-inter text-xs text-white/80">{op}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Classification */}
      <div className="p-3 rounded-xl border mb-4" style={{ 
        background: mansion?.genel_hukum?.includes("Uğursuz") || mansion?.genel_hukum?.includes("Nahs") 
          ? "rgba(239,68,68,0.05)" 
          : "rgba(34,197,94,0.05)",
        borderColor: mansion?.genel_hukum?.includes("Uğursuz") || mansion?.genel_hukum?.includes("Nahs")
          ? "rgba(239,68,68,0.30)"
          : "rgba(34,197,94,0.30)"
      }}>
        <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ 
          color: mansion?.genel_hukum?.includes("Uğursuz") || mansion?.genel_hukum?.includes("Nahs")
            ? "#ef4444"
            : "#22c55e"
        }}>
          {isMalayalam ? "വർഗ്ഗീകരണം" : "Classification"}
        </p>
        <p className="font-inter text-sm font-bold" style={{ 
          color: mansion?.genel_hukum?.includes("Uğursuz") || mansion?.genel_hukum?.includes("Nahs")
            ? "#ef4444"
            : "#22c55e"
        }}>
          {mansion?.genel_hukum || "Unknown"}
        </p>
      </div>

      {/* Source */}
      <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-3 h-3" style={{ color: G.dim }} />
          <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>
            {isMalayalam ? "ഗ്രന്ഥം" : "Source"}
          </p>
        </div>
        <p className="font-inter text-xs text-white/60">
          Havâss'ın Derinlikleri — p.64-74
        </p>
      </div>
    </motion.div>
  );
}