// ═══════════════════════════════════════════════════════════════
// LIVE MOON POSITION — SECTION 4
// Real-time moon position calculation with browser geolocation
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, MapPin, Clock, Info } from "lucide-react";
import { calculateMoonPosition } from "@/lib/astroClockMoonPosition";
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

export default function LiveMoonPosition() {
  const { isMalayalam } = useAstroClockLanguage();
  const [moonData, setMoonData] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateMoonPosition = () => {
      // Get location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setLocation(loc);
            
            // Calculate moon position
            const moon = calculateMoonPosition(new Date());
            setMoonData(moon);
            setLoading(false);
          },
          () => {
            // Fallback
            setLocation({ lat: 25.2048, lng: 55.2708, name: "Default" });
            const moon = calculateMoonPosition(new Date());
            setMoonData(moon);
            setLoading(false);
          }
        );
      } else {
        const moon = calculateMoonPosition(new Date());
        setMoonData(moon);
        setLoading(false);
      }
    };

    updateMoonPosition();
    
    // Update every minute
    const interval = setInterval(updateMoonPosition, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border p-8 text-center"
        style={{
          background: "linear-gradient(145deg, rgba(8,18,44,0.98) 0%, rgba(4,10,28,0.99) 100%)",
          borderColor: G.border
        }}
      >
        <div className="w-8 h-8 border-4 border-t-gold border-r-transparent border-b-gold border-l-transparent rounded-full animate-spin mx-auto" />
        <p className="font-inter text-xs mt-4" style={{ color: G.dim }}>
          {isMalayalam ? "കണക്കാക്കുന്നു..." : "Calculating..."}
        </p>
      </motion.div>
    );
  }

  if (!moonData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(10,8,34,0.99) 0%, rgba(5,4,18,0.99) 100%)",
        borderColor: G.borderHi,
        boxShadow: `0 0 50px ${G.glow}, 0 4px 28px rgba(0,0,0,0.55)`
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Moon className="w-6 h-6" style={{ color: G.text }} />
          <div>
            <h2 className="font-inter text-lg font-bold uppercase tracking-widest" style={{ color: G.text }}>
              {isMalayalam ? "ചന്ദ്ര സ്ഥാനം" : "Live Moon Position"}
            </h2>
            <p className="font-inter text-[9px]" style={{ color: G.dim }}>
              {isMalayalam ? "തത്സമയ ചാന്ദ്ര നിലപാട്" : "Real-time lunar position"}
            </p>
          </div>
        </div>
        
        {location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" style={{ color: G.dim }} />
            <p className="font-inter text-[9px] text-white/60">
              {location.name || `${location.lat.toFixed(1)}°, ${location.lng.toFixed(1)}°`}
            </p>
          </div>
        )}
      </div>

      {/* Main Moon Data */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Longitude */}
        <div className="p-4 rounded-xl border text-center" style={{ background: G.bg, borderColor: G.faint }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
            {isMalayalam ? "രേഖാംശം" : "Longitude"}
          </p>
          <p className="font-inter text-2xl font-bold text-white mb-1">
            {moonData.longitude}°
          </p>
          <p className="font-inter text-[9px]" style={{ color: G.dim }}>
            {isMalayalam ? "വിഷുവരേഖ" : "Ecliptic"}
          </p>
        </div>

        {/* Latitude */}
        <div className="p-4 rounded-xl border text-center" style={{ background: G.bg, borderColor: G.faint }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
            {isMalayalam ? "അക്ഷാംശം" : "Latitude"}
          </p>
          <p className="font-inter text-2xl font-bold text-white mb-1">
            {moonData.latitude}°
          </p>
          <p className="font-inter text-[9px]" style={{ color: G.dim }}>
            {isMalayalam ? "ക്രാന്തിവൃത്തം" : "Orbital"}
          </p>
        </div>

        {/* Distance */}
        <div className="p-4 rounded-xl border text-center" style={{ background: G.bg, borderColor: G.faint }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
            {isMalayalam ? "ദൂരം" : "Distance"}
          </p>
          <p className="font-inter text-2xl font-bold text-white mb-1">
            {moonData.distance}
          </p>
          <p className="font-inter text-[9px]" style={{ color: G.dim }}>
            {isMalayalam ? "ഭൂമി ആരം" : "Earth Radii"}
          </p>
        </div>

        {/* Phase */}
        <div className="p-4 rounded-xl border text-center" style={{ background: G.bg, borderColor: G.faint }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
            {isMalayalam ? "കല" : "Phase"}
          </p>
          <p className="font-inter text-2xl font-bold text-white mb-1">
            {moonData.phase}%
          </p>
          <p className="font-inter text-[9px]" style={{ color: G.dim }}>
            {isMalayalam ? "പ്രകാശം" : "Illumination"}
          </p>
        </div>
      </div>

      {/* Zodiac & Mansion */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Zodiac Sign */}
        <div className="p-5 rounded-xl border" style={{ background: G.bgHi, borderColor: G.border }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{moonData.zodiacSign?.symbol}</span>
            <div>
              <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                {isMalayalam ? "രാശി" : "Zodiac Sign"}
              </p>
              <p className="font-inter text-lg font-bold text-white">
                {isMalayalam ? moonData.zodiacSign?.name_ml : moonData.zodiacSign?.name_en}
              </p>
            </div>
          </div>
          <p className="font-inter text-xs text-white/60">
            {isMalayalam 
              ? `ചന്ദ്രൻ ${isMalayalam ? moonData.zodiacSign?.name_ml : moonData.zodiacSign?.name_en} രാശിയിൽ`
              : `Moon in ${moonData.zodiacSign?.name_en}`}
          </p>
        </div>

        {/* Lunar Mansion */}
        <div className="p-5 rounded-xl border" style={{ background: G.bgHi, borderColor: G.border }}>
          <div className="mb-3">
            <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
              {isMalayalam ? "നക്ഷത്രം (മൻസിൽ)" : "Lunar Mansion (Manzil)"}
            </p>
            {moonData.mansion && (
              <>
                <p className="font-amiri text-4xl font-bold mb-2 leading-relaxed" style={{ color: G.text, textAlign: 'center' }}>
                  {moonData.mansion.name_ar}
                </p>
                <p className="font-inter text-lg font-bold text-white text-center">
                  {isMalayalam ? moonData.mansion.name_ml : moonData.mansion.name_en}
                </p>
              </>
            )}
          </div>
          {moonData.mansion && (
            <p className="font-inter text-xs text-white/60 text-center">
              {isMalayalam ? moonData.mansion.meaning_ml : moonData.mansion.meaning_en}
            </p>
          )}
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-5 p-3 rounded-xl" style={{ background: G.bg, border: `1px solid ${G.faint}` }}>
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5" style={{ color: G.dim }} />
          <div>
            <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
              {isMalayalam ? "കണക്കുകൂട്ടൽ" : "Calculation Method"}
            </p>
            <p className="font-inter text-xs text-white/60">
              {isMalayalam 
                ? "ചാന്ദ്ര സ്ഥാനം ജ്യോതിശാസ്ത്ര സമവാക്യങ്ങൾ ഉപയോഗിച്ച് കണക്കാക്കുന്നു. ഓരോ മിനിറ്റിലും അപ്ഡേറ്റ് ചെയ്യുന്നു."
                : "Moon position calculated using astronomical equations. Updates every minute."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}