// ═══════════════════════════════════════════════════════════════
// LIVE PLANETARY HOURS — CURRENT HOUR WITH COUNTDOWN
// Real-time display with countdown timer
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Timer, Sun, Moon } from "lucide-react";
import { getCurrentPlanetaryHour, getAllPlanetaryHours, PLANET_INFO } from "@/lib/astroClockLiveEngine";
import { calculateSunriseSunset } from "@/lib/astroClockSunriseSunset";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  faint: "rgba(212,175,55,0.22)",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
  success: "rgba(34,197,94,0.60)"
};

export default function LivePlanetaryHours() {
  const { isMalayalam } = useAstroClockLanguage();
  const [currentHour, setCurrentHour] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [location, setLocation] = useState(null);
  const [sunData, setSunData] = useState(null);

  useEffect(() => {
    // Get location and calculate sun times
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timezone: -position.coords.longitude / 15,
          name: `Lat: ${position.coords.latitude.toFixed(2)}, Lng: ${position.coords.longitude.toFixed(2)}`
        };
        setLocation(loc);
        
        const today = new Date();
        const sunTimes = calculateSunriseSunset(today, loc.lat, loc.lng, loc.timezone);
        setSunData(sunTimes);
        
        if (sunTimes.sunrise && sunTimes.sunset) {
          updateCurrentHour(today, sunTimes);
        }
      },
      (error) => {
        // Fallback to Dubai
        const loc = { lat: 25.2048, lng: 55.2708, timezone: 4, name: "Dubai, UAE (Default)" };
        setLocation(loc);
        const today = new Date();
        const sunTimes = calculateSunriseSunset(today, loc.lat, loc.lng, loc.timezone);
        setSunData(sunTimes);
        if (sunTimes.sunrise && sunTimes.sunset) {
          updateCurrentHour(today, sunTimes);
        }
      }
    );

    // Update every second for countdown
    const interval = setInterval(() => {
      const today = new Date();
      if (sunData?.sunrise && sunData?.sunset) {
        updateCurrentHour(today, sunData);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateCurrentHour = (date, sunTimes) => {
    const hour = getCurrentPlanetaryHour(date, sunTimes.sunrise, sunTimes.sunset);
    setCurrentHour(hour);
    
    // Calculate countdown from remainingTime
    if (hour.remainingTime) {
      setCountdown(hour.remainingTime);
    }
  };

  if (!currentHour || !currentHour.planetInfo) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border p-8 text-center"
        style={{
          background: "linear-gradient(145deg, rgba(10,22,56,0.99) 0%, rgba(5,12,36,0.99) 100%)",
          borderColor: G.border
        }}
      >
        <div className="w-8 h-8 border-4 border-t-gold border-r-transparent border-b-gold border-l-transparent rounded-full animate-spin mx-auto" />
        <p className="font-inter text-sm mt-4" style={{ color: G.dim }}>
          {isMalayalam ? "കണക്കുകൂട്ടുന്നു..." : "Calculating..."}
        </p>
      </motion.div>
    );
  }

  const isDay = currentHour.isDay;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-5 relative overflow-hidden"
      style={{
        background: isDay 
          ? "linear-gradient(145deg, rgba(255,200,100,0.08) 0%, rgba(255,150,50,0.05) 100%)"
          : "linear-gradient(145deg, rgba(10,22,56,0.99) 0%, rgba(5,12,36,0.99) 100%)",
        borderColor: G.borderHi,
        boxShadow: `0 0 50px ${G.glow}`
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {isDay ? <Sun className="w-6 h-6" style={{ color: G.text }} /> : <Moon className="w-6 h-6" style={{ color: G.text }} />}
          <div>
            <h2 className="font-inter text-lg font-bold uppercase tracking-widest" style={{ color: G.text }}>
              {isMalayalam ? "നിലവിലെ ഗ്രഹ മണിക്കൂർ" : "Current Planetary Hour"}
            </h2>
            <p className="font-inter text-[9px]" style={{ color: G.dim }}>
              {isMalayalam ? "ലൈവ് കൗണ്ടൗൺ" : "Live Countdown"}
            </p>
          </div>
        </div>
        
        {location && (
          <div className="text-right">
            <p className="font-inter text-[9px]" style={{ color: G.dim }}>{location.name}</p>
            <p className="font-inter text-[10px] text-white/60">
              {isMalayalam ? "സൂര്യോദയം:" : "Sunrise:"} {formatTime(sunData.sunrise)} • 
              {isMalayalam ? " സൂര്യാസ്തമയം:" : " Sunset:"} {formatTime(sunData.sunset)}
            </p>
          </div>
        )}
      </div>

      {/* Current Hour Display */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Left: Planet & Countdown */}
        <div className="space-y-4">
          {/* Planet Card */}
          <div className="p-6 rounded-xl border text-center" style={{ background: G.bgHi, borderColor: G.border }}>
            <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>
              {isMalayalam ? "ഗ്രഹ നാഥൻ" : "Ruling Planet"}
            </p>
            <p className="text-6xl mb-2">{currentHour.planetInfo.symbol}</p>
            <p className="font-amiri text-4xl md:text-5xl font-bold mb-2" style={{ color: G.text }}>
              {currentHour.planetInfo.name_ar}
            </p>
            <p className="font-inter text-lg font-bold text-white">
              {isMalayalam ? currentHour.planetInfo.name_ml_equivalent : currentHour.planetInfo.name_en}
            </p>
            <p className="font-inter text-xs mt-1" style={{ color: G.dim }}>
              {isMalayalam ? currentHour.planetInfo.nature_ml : currentHour.planetInfo.nature_en}
            </p>
          </div>

          {/* Countdown */}
          <div className="p-4 rounded-xl border text-center" style={{ background: "rgba(34,197,94,0.08)", borderColor: G.success }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer className="w-4 h-4" style={{ color: G.success }} />
              <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.success }}>
                {isMalayalam ? "അടുത്ത മണിക്കൂറിലേക്ക്" : "Until Next Hour"}
              </p>
            </div>
            <p className="font-mono text-3xl font-bold text-white">{countdown}</p>
          </div>
        </div>

        {/* Right: Hour Details */}
        <div className="space-y-3">
          <InfoRow 
            label={isMalayalam ? "മണിക്കൂർ" : "Hour Number"} 
            value={`#${currentHour.hourNumber}`} 
            isMalayalam={isMalayalam} 
          />
          <InfoRow 
            label={isMalayalam ? "സമയം" : "Time Period"} 
            value={`${currentHour.hourStart} - ${currentHour.hourEnd}`} 
            isMalayalam={isMalayalam} 
          />
          <InfoRow 
            label={isMalayalam ? "ദിവസ നാഥൻ" : "Day Ruler"} 
            value={isMalayalam ? PLANET_INFO[currentHour.dayRuler]?.name_ml_equivalent : PLANET_INFO[currentHour.dayRuler]?.name_en}
            symbol={PLANET_INFO[currentHour.dayRuler]?.symbol}
            isMalayalam={isMalayalam} 
          />
          <InfoRow 
            label={isMalayalam ? "അടുത്ത ഗ്രഹം" : "Next Planet"} 
            value={isMalayalam ? PLANET_INFO[currentHour.nextPlanet]?.name_ml_equivalent : PLANET_INFO[currentHour.nextPlanet]?.name_en}
            symbol={PLANET_INFO[currentHour.nextPlanet]?.symbol}
            isMalayalam={isMalayalam} 
          />
          <InfoRow 
            label={isMalayalam ? "മണിക്കൂർ ദൈർഘ്യം" : "Hour Duration"} 
            value={currentHour.duration} 
            isMalayalam={isMalayalam} 
          />
          <InfoRow 
            label={isMalayalam ? "കാലം" : "Period"} 
            value={isDay ? (isMalayalam ? "പകൽ" : "Daytime") : (isMalayalam ? "രാത്രി" : "Nighttime")} 
            isMalayalam={isMalayalam} 
          />
        </div>
      </div>

      {/* Actions for Current Hour */}
      <div className="mt-5 grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border" style={{ background: "rgba(34,197,94,0.05)", borderColor: "rgba(34,197,94,0.30)" }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: "#22c55e" }}>
            {isMalayalam ? "ഉചിത പ്രവർത്തനങ്ങൾ" : "Suitable Actions"}
          </p>
          <ul className="space-y-1">
            {(currentHour.planetInfo.goodActions_ml || currentHour.planetInfo.goodActions_en || []).slice(0, 4).map((action, idx) => (
              <li key={idx} className="font-inter text-xs text-white/70 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-1" style={{ background: "#22c55e" }} />
                {action}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl border" style={{ background: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.30)" }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: "#ef4444" }}>
            {isMalayalam ? "അനുചിത പ്രവർത്തനങ്ങൾ" : "Avoid These"}
          </p>
          <ul className="space-y-1">
            {(currentHour.planetInfo.badActions_ml || currentHour.planetInfo.badActions_en || []).slice(0, 4).map((action, idx) => (
              <li key={idx} className="font-inter text-xs text-white/70 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-1" style={{ background: "#ef4444" }} />
                {action}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function InfoRow({ label, value, symbol, isMalayalam }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: G.bg }}>
      <span className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>{label}</span>
      <div className="flex items-center gap-2">
        {symbol && <span className="text-lg">{symbol}</span>}
        <span className="font-inter text-sm font-bold text-white">{value}</span>
      </div>
    </div>
  );
}

function formatTime(decimalHour) {
  const hours = Math.floor(decimalHour);
  const minutes = Math.round((decimalHour - hours) * 60);
  const h = hours >= 24 ? hours - 24 : hours < 0 ? hours + 24 : hours;
  const hDisplay = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = hours >= 0 && hours < 12 ? 'AM' : 'PM';
  return `${hDisplay}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}