// ═══════════════════════════════════════════════════════════════
// NIGHTTIME PLANETARY HOURS — SECTION 3
// 12 hours from sunset to sunrise with real calculations
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Clock, Info } from "lucide-react";
import { getAllPlanetaryHours } from "@/lib/astroClockLiveEngine";
import { calculateSunriseSunset, getUserLocation, formatDecimalTime } from "@/lib/astroClockSunriseSunset";
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

export default function NighttimePlanetaryHours() {
  const { isMalayalam } = useAstroClockLanguage();
  const [hours, setHours] = useState([]);
  const [sunData, setSunData] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const today = new Date();
    const userLoc = getUserLocation();
    setLocation(userLoc);
    
    const sunTimes = calculateSunriseSunset(today, userLoc.lat, userLoc.lng, userLoc.timezone);
    setSunData(sunTimes);
    
    if (sunTimes.sunrise && sunTimes.sunset) {
      const allHours = getAllPlanetaryHours(today, sunTimes.sunrise, sunTimes.sunset);
      const nightHours = allHours.filter(h => h.period === "night");
      setHours(nightHours);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(2,8,24,0.99) 0%, rgba(1,4,16,0.99) 100%)",
        borderColor: G.borderHi,
        boxShadow: `0 0 50px ${G.glow}, 0 4px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.10)`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)` }} />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Moon className="w-6 h-6" style={{ color: G.text }} />
          <div>
            <h2 className="font-inter text-lg font-bold uppercase tracking-widest" style={{ color: G.text }}>
              {isMalayalam ? "രാത്രി 12 ഗ്രഹ മണിക്കൂറുകൾ" : "Nighttime 12 Planetary Hours"}
            </h2>
            <p className="font-inter text-[9px]" style={{ color: G.dim }}>
              {isMalayalam ? "സൂര്യാസ്തമയം മുതൽ സൂര്യോദയം വരെ" : "From Sunset to Sunrise"}
            </p>
          </div>
        </div>
        
        {/* Location & Sun Times */}
        {location && sunData && (
          <div className="text-right">
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
              {location.name}
            </p>
            <p className="font-inter text-xs text-white/70">
              {isMalayalam ? "സൂര്യാസ്തമയം:" : "Sunset:"} {formatDecimalTime(sunData.sunset)} • 
              {isMalayalam ? " സൂര്യോദയം:" : " Sunrise:"} {formatDecimalTime(sunData.sunrise)}
            </p>
          </div>
        )}
      </div>

      {/* Hours Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: G.faint }}>
              <th className="text-left py-2 px-3 font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                {isMalayalam ? "മണിക്കൂർ" : "Hour"}
              </th>
              <th className="text-left py-2 px-3 font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                {isMalayalam ? "സമയം" : "Time"}
              </th>
              <th className="text-left py-2 px-3 font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                {isMalayalam ? "ഗ്രഹം" : "Planet"}
              </th>
              <th className="text-left py-2 px-3 font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                {isMalayalam ? "ദൈർഘ്യം" : "Duration"}
              </th>
              <th className="text-left py-2 px-3 font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>
                {isMalayalam ? "ഉചിത പ്രവർത്തനങ്ങൾ" : "Good Actions"}
              </th>
            </tr>
          </thead>
          <tbody>
            {(hours || []).map((hour) => (
              <tr key={hour.hourNumber} className="border-b" style={{ borderColor: G.faint }}>
                <td className="py-3 px-3">
                  <span className="font-inter text-sm font-bold text-white">#{hour.hourNumber}</span>
                </td>
                <td className="py-3 px-3">
                  <div className="font-inter text-xs text-white/80">
                    <div>{hour.startTime}</div>
                    <div className="text-[10px]" style={{ color: G.dim }}>→ {hour.endTime}</div>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{hour.planetInfo?.symbol}</span>
                    <div>
                      <p className="font-inter text-xs font-bold text-white">
                        {isMalayalam ? hour.planetInfo?.name_ml : hour.planetInfo?.name_en}
                      </p>
                      <p className="font-inter text-[9px]" style={{ color: G.dim }}>
                        {isMalayalam ? hour.planetInfo?.nature_ml : hour.planetInfo?.nature_en}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="font-inter text-xs">
                    <div className="text-white/80">{hour.duration}</div>
                    <div className="text-[9px]" style={{ color: G.dim }}>
                      {hour.durationMinutes}m {hour.durationSeconds}s
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="max-w-[180px]">
                    {(hour.goodActions || []).slice(0, 2).map((action, idx) => (
                      <div key={idx} className="font-inter text-[10px] text-white/70">• {action}</div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      <div className="mt-4 p-3 rounded-xl" style={{ background: G.bg, border: `1px solid ${G.faint}` }}>
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5" style={{ color: G.dim }} />
          <div>
            <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
              {isMalayalam ? "കുറിപ്പ്" : "Note"}
            </p>
            <p className="font-inter text-xs text-white/60">
              {isMalayalam 
                ? "രാത്രി മണിക്കൂറുകൾ സൂര്യാസ്തമയം മുതൽ സൂര്യോദയം വരെ 12 തുല്യ ഭാഗങ്ങളായി വിഭജിക്കുന്നു. ശീതകാലത്ത് രാത്രി മണിക്കൂറുകൾ ദൈർഘ്യമേറിയതായിരിക്കും."
                : "Night hours divide sunset to sunrise into 12 equal parts. Winter nights have longer hours."}
            </p>
            <p className="font-inter text-[10px] text-white/40 mt-1">
              {isMalayalam ? "സ്രോതസ്സ്:" : "Source:"} Havâss'ın Derinlikleri, Taha
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}