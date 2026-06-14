// ═══════════════════════════════════════════════════════════════
// DAYTIME PLANETARY HOURS — MOBILE-OPTIMIZED CARDS
// Real sunrise/sunset based calculations with card layout
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Clock, Info, MapPin } from "lucide-react";
import { getAllPlanetaryHours } from "@/lib/astroClockLiveEngine";
import { calculateSunriseSunset, formatDecimalTime } from "@/lib/astroClockSunriseSunset";
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

      {/* Cards Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(hours || []).map((hour) => (
          <HourCard key={hour.hourNumber} hour={hour} isMalayalam={isMalayalam} />
        ))}
      </div>

      {/* Notes */}
      <div className="mt-6 p-4 rounded-xl" style={{ background: G.bg, border: `1px solid ${G.faint}` }}>
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 mt-0.5" style={{ color: G.dim }} />
          <div>
            <p className="font-malayalam-sm uppercase tracking-widest mb-2" style={{ color: G.dim }}>
              {isMalayalam ? "കുറിപ്പ്" : "Note"}
            </p>
            <p className="font-malayalam-md text-white/70">
              {isMalayalam 
                ? "ഗ്രഹ മണിക്കൂറുകൾ സൂര്യോദയം മുതൽ സൂര്യാസ്തമയം വരെ 12 തുല്യ ഭാഗങ്ങളായി വിഭജിക്കുന്നു. കാലഘട്ടം അനുസരിച്ച് ദൈർഘ്യം മാറുന്നു."
                : "Planetary hours divide sunrise to sunset into 12 equal parts. Duration varies by season."}
            </p>
            <p className="font-malayalam-sm text-white/50 mt-2">
              {isMalayalam ? "സ്രോതസ്സ്:" : "Source:"} Havâss'ın Derinlikleri, Taha
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HourCard({ hour, isMalayalam }) {
  return (
    <div className="p-5 rounded-xl border hover:border-opacity-60 transition-all duration-200"
      style={{
        background: G.bg,
        borderColor: G.border,
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)"
      }}>
      {/* Hour Number & Time */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-malayalam-lg font-bold text-white">#{hour.hourNumber}</span>
        <Clock className="w-4 h-4" style={{ color: G.dim }} />
      </div>
      
      <div className="mb-4 pb-3 border-b" style={{ borderColor: G.faint }}>
        <div className="font-malayalam-md text-white/90">
          <div className="font-bold">{hour.startTime}</div>
          <div className="font-malayalam-sm" style={{ color: G.dim }}>→ {hour.endTime}</div>
        </div>
      </div>

      {/* Planet Info */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{hour.planetInfo?.symbol}</span>
        <div className="flex-1">
          <p className="font-malayalam-md font-bold text-white">
            {isMalayalam ? hour.planetInfo?.name_ml_equivalent : hour.planetInfo?.name_en}
          </p>
          <p className="font-malayalam-sm" style={{ color: G.dim }}>
            {isMalayalam ? hour.planetInfo?.nature_ml : hour.planetInfo?.nature_en}
          </p>
        </div>
      </div>

      {/* Duration */}
      <div className="mb-3">
        <p className="font-malayalam-sm uppercase tracking-widest mb-1" style={{ color: G.dim }}>
          {isMalayalam ? "ദൈർഘ്യം" : "Duration"}
        </p>
        <p className="font-malayalam-md text-white/80 font-bold">
          {hour.duration}
          <span className="font-malayalam-sm text-white/50 ml-2">
            ({hour.durationMinutes}m {hour.durationSeconds}s)
          </span>
        </p>
      </div>

      {/* Good Actions */}
      <div>
        <p className="font-malayalam-sm uppercase tracking-widest mb-2" style={{ color: "#22c55e" }}>
          {isMalayalam ? "ഉചിത പ്രവർത്തനങ്ങൾ" : "Good Actions"}
        </p>
        <div className="space-y-1">
          {(hour.goodActions || []).slice(0, 3).map((action, idx) => (
            <div key={idx} className="font-malayalam-sm text-white/70 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#22c55e" }} />
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}