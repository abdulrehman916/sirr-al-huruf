// ═══════════════════════════════════════════════════════════════
// DAYTIME PLANETARY HOURS — ENHANCED WITH PDF RULES
// Real sunrise/sunset based calculations with PDF-sourced rules
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Clock, MapPin, Book, CheckCircle, XCircle } from "lucide-react";
import { getAllPlanetaryHours } from "@/lib/astroClockLiveEngine";
import { calculateSunriseSunset, formatDecimalTime } from "@/lib/astroClockSunriseSunset";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";
import { getPlanetHourRules } from "@/lib/astroClockPlanetaryHourRules.js";

const G = {
  border:   "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
  faint:    "rgba(212,175,55,0.22)",
  bg:       "rgba(212,175,55,0.07)",
  bgHi:     "rgba(212,175,55,0.14)",
  excellent: "rgba(34,197,94,0.15)",
  excellentBorder: "rgba(34,197,94,0.60)",
  avoid: "rgba(239,68,68,0.15)",
  avoidBorder: "rgba(239,68,68,0.60)"
};

export default function DaytimePlanetaryHours() {
  const { isMalayalam } = useAstroClockLanguage();
  const [hours, setHours] = useState([]);
  const [location, setLocation] = useState(null);
  const [sunData, setSunData] = useState(null);

  useEffect(() => {
    const today = new Date();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timezone: -position.coords.longitude / 15,
            name: `Lat: ${position.coords.latitude.toFixed(2)}, Lng: ${position.coords.longitude.toFixed(2)}`
          };
          setLocation(loc);
          
          const sunTimes = calculateSunriseSunset(today, loc.lat, loc.lng, loc.timezone);
          setSunData(sunTimes);
          
          if (sunTimes.sunrise && sunTimes.sunset) {
            const allHours = getAllPlanetaryHours(today, sunTimes.sunrise, sunTimes.sunset);
            const dayHours = allHours.filter(h => h.period === "day");
            setHours(dayHours);
          }
        },
        (error) => {
          const loc = { lat: 25.2048, lng: 55.2708, timezone: 4, name: "Dubai, UAE (Default)" };
          setLocation(loc);
          const sunTimes = calculateSunriseSunset(today, loc.lat, loc.lng, loc.timezone);
          setSunData(sunTimes);
          if (sunTimes.sunrise && sunTimes.sunset) {
            const allHours = getAllPlanetaryHours(today, sunTimes.sunrise, sunTimes.sunset);
            const dayHours = allHours.filter(h => h.period === "day");
            setHours(dayHours);
          }
        }
      );
    } else {
      const loc = { lat: 25.2048, lng: 55.2708, timezone: 4, name: "Dubai, UAE (Default)" };
      setLocation(loc);
      const sunTimes = calculateSunriseSunset(today, loc.lat, loc.lng, loc.timezone);
      setSunData(sunTimes);
      if (sunTimes.sunrise && sunTimes.sunset) {
        const allHours = getAllPlanetaryHours(today, sunTimes.sunrise, sunTimes.sunset);
        const dayHours = allHours.filter(h => h.period === "day");
        setHours(dayHours);
      }
    }
  }, []);

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sun className="w-7 h-7" style={{ color: G.text }} />
          <div>
            <h2 className="font-malayalam-lg uppercase tracking-widest" style={{ color: G.text }}>
              {isMalayalam ? "പകൽ 12 ഗ്രഹ മണിക്കൂറുകൾ" : "Daytime 12 Planetary Hours"}
            </h2>
            <p className="font-malayalam-sm" style={{ color: G.dim }}>
              {isMalayalam ? "സൂര്യോദയം മുതൽ സൂര്യാസ്തമയം വരെ" : "From Sunrise to Sunset"}
            </p>
          </div>
        </div>
        
        {location && sunData && (
          <div className="text-right hidden md:block">
            <div className="flex items-center gap-2 justify-end mb-1">
              <MapPin className="w-4 h-4" style={{ color: G.dim }} />
              <p className="font-malayalam-sm text-white/70">{location.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-malayalam-sm" style={{ color: G.dim }}>
                {isMalayalam ? "സൂര്യോദയം:" : "Sunrise:"} <span className="text-white font-bold">{formatDecimalTime(sunData.sunrise)}</span>
              </span>
              <span className="font-malayalam-sm" style={{ color: G.dim }}>
                {isMalayalam ? "സൂര്യാസ്തമയം:" : "Sunset:"} <span className="text-white font-bold">{formatDecimalTime(sunData.sunset)}</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {(hours || []).map((hour) => (
          <EnhancedHourCard key={hour.hourNumber} hour={hour} isMalayalam={isMalayalam} />
        ))}
      </div>

      {/* Notes */}
      <div className="mt-6 p-4 rounded-xl" style={{ background: G.bg, border: `1px solid ${G.faint}` }}>
        <div className="flex items-start gap-3">
          <Book className="w-5 h-5 mt-0.5" style={{ color: G.text }} />
          <div>
            <p className="font-malayalam-sm uppercase tracking-widest mb-2" style={{ color: G.dim }}>
              {isMalayalam ? "സ്രോതസ്സ്" : "Source"}
            </p>
            <p className="font-malayalam-md text-white/70">
              {isMalayalam 
                ? "ഗ്രഹ മണിക്കൂറുകളുടെ സവിശേഷതകൾ ഹവാസ്സിൻ്റെ ഡെപ്ത്ലിക്ലറിൽ നിന്നും മറ്റ് അപ്‌ലോഡ് ചെയ്ത PDF പുസ്തകങ്ങളിൽ നിന്നും മാത്രം."
                : "Planetary hour properties from Havâss'ın Derinlikleri and other uploaded PDF books only."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EnhancedHourCard({ hour, isMalayalam }) {
  const planetRules = getPlanetHourRules(hour.planet);
  const isSaad = planetRules?.nature.includes("Sa'd");
  
  return (
    <div className="rounded-xl border p-5"
      style={{
        background: G.bg,
        borderColor: G.border,
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)"
      }}>
      {/* Header: Planet & Time */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: G.faint }}>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{hour.planetInfo?.symbol}</span>
          <div>
            <p className="font-amiri text-3xl font-bold" style={{ color: G.text }}>
              {hour.planetInfo?.name_ar}
            </p>
            <p className="font-malayalam-md font-bold text-white">
              {isMalayalam ? hour.planetInfo?.name_ml_equivalent : hour.planetInfo?.name_en}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-malayalam-sm text-white/90 font-bold">
            {hour.startTime} → {hour.endTime}
          </p>
          <p className="font-malayalam-sm" style={{ color: G.dim }}>
            {hour.duration}
          </p>
        </div>
      </div>

      {/* Status & Element */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="p-3 rounded-lg" style={{ 
          background: isSaad ? G.excellent : G.avoid,
          borderColor: isSaad ? G.excellentBorder : G.avoidBorder,
          border: "1px solid"
        }}>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: isSaad ? "#22c55e" : "#ef4444" }}>
            {isMalayalam ? "സ്ഥിതി" : "Status"}
          </p>
          <p className="font-malayalam-md font-bold text-white">
            {isMalayalam ? planetRules?.nature_ml : planetRules?.nature}
          </p>
        </div>
        
        <div className="p-3 rounded-lg" style={{ background: G.bgHi, border: `1px solid ${G.border}` }}>
          <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
            {isMalayalam ? "മൂലകം" : "Element"}
          </p>
          <p className="font-malayalam-md font-bold text-white">
            {isMalayalam ? planetRules?.element_ml : planetRules?.element}
          </p>
        </div>
      </div>

      {/* Suitable Actions */}
      <div className="mb-4 p-4 rounded-lg" style={{ background: "rgba(34,197,94,0.05)", border: `1px solid rgba(34,197,94,0.30)` }}>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-4 h-4" style={{ color: "#22c55e" }} />
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: "#22c55e" }}>
            {isMalayalam ? "ഉചിത പ്രവർത്തനങ്ങൾ" : "Suitable Actions"}
          </p>
        </div>
        <div className="space-y-1">
          {(isMalayalam ? planetRules?.suitableActions?.ml : planetRules?.suitableActions?.en || []).slice(0, 4).map((action, idx) => (
            <p key={idx} className="font-malayalam-sm text-white/80 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#22c55e" }} />
              {action}
            </p>
          ))}
        </div>
      </div>

      {/* Unsuitable Actions */}
      <div className="mb-4 p-4 rounded-lg" style={{ background: "rgba(239,68,68,0.05)", border: `1px solid rgba(239,68,68,0.30)` }}>
        <div className="flex items-center gap-2 mb-3">
          <XCircle className="w-4 h-4" style={{ color: "#ef4444" }} />
          <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: "#ef4444" }}>
            {isMalayalam ? "അനുചിത പ്രവർത്തനങ്ങൾ" : "Avoid These"}
          </p>
        </div>
        <div className="space-y-1">
          {(isMalayalam ? planetRules?.unsuitableActions?.ml : planetRules?.unsuitableActions?.en || []).slice(0, 4).map((action, idx) => (
            <p key={idx} className="font-malayalam-sm text-white/80 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#ef4444" }} />
              {action}
            </p>
          ))}
        </div>
      </div>

      {/* Source */}
      <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: G.faint }}>
        <Book className="w-3 h-3" style={{ color: G.text }} />
        <p className="font-inter text-[8px]" style={{ color: G.dim }}>
          {isMalayalam ? "സ്രോതസ്സ്:" : "Source:"} {planetRules?.source}
        </p>
      </div>
    </div>
  );
}