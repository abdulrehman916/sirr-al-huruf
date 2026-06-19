// ═══════════════════════════════════════════════════════════════
// TODAY OVERVIEW — FULL ASTROLOGICAL ANALYSIS
// Book-based knowledge ONLY — no AI generation
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";
import { 
  PLANETARY_DAY_RULERS, 
  AY_MANAZILLERI,
} from "@/lib/astroClockData.js";
import { calculateMoonPosition } from "@/lib/astroClockMoonPosition.js";
import { getCurrentPlanetaryHour } from "@/lib/astroClockLiveEngine.js";
import { Sun, Moon, Star, Clock, AlertCircle, CheckCircle, Book } from "lucide-react";
import CurrentInfluencesGrid from "./TodayOverview/CurrentInfluencesGrid";
import TodayGoodBadLists from "./TodayOverview/TodayGoodBadLists";
import CurrentHourAnalysis from "./TodayOverview/CurrentHourAnalysis";
import NextGoodHour from "./TodayOverview/NextGoodHour";
import NextGoodDay from "./TodayOverview/NextGoodDay";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  faint: "rgba(212,175,55,0.22)",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
};

export default function TodayOverviewFull() {
  const { isMalayalam } = useAstroClockLanguage();
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateTodayAnalysis();
    const interval = setInterval(calculateTodayAnalysis, 60000);
    return () => clearInterval(interval);
  }, []);

  function calculateTodayAnalysis() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const dayKeys = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayKey = dayKeys[dayOfWeek];

    const dayRuler = PLANETARY_DAY_RULERS?.find(d => d?.day_name_en === dayKey) || null;
    const currentHour = now.getHours();
    const currentPlanetaryHour = getCurrentPlanetaryHour(now, 6.5, 18.25);
    const moonPos = calculateMoonPosition(now);
    const currentMansion = moonPos?.mansion?.number ? (AY_MANAZILLERI?.find(m => m?.no === moonPos.mansion.number) || null) : null;
    const zodiacSign = moonPos?.mansion?.zodiac_sign || "Unknown";
    const element = getElementForMansion(currentMansion);
    const goodFor = buildGoodForList(dayRuler, currentMansion);
    const badFor = buildBadForList(dayRuler, currentMansion);
    const hourAnalysis = analyzeCurrentHour(currentPlanetaryHour, dayRuler);
    const nextGoodHour = findNextGoodHour(now, dayRuler, currentPlanetaryHour);
    const nextGoodDay = findNextGoodDay(dayOfWeek, dayRuler);

    const sunrise = 6.5;
    const sunset = 18.25;
    const isDaytime = currentHour >= sunrise && currentHour < sunset;
    
    setTodayData({
      date: now,
      dayKey,
      dayRuler: dayRuler || null,
      currentHour,
      currentPlanetaryHour,
      currentMansion: currentMansion || null,
      zodiacSign,
      element,
      goodFor,
      badFor,
      hourAnalysis,
      nextGoodHour,
      nextGoodDay,
      isDaytime,
    });
    setLoading(false);
  }

  function getElementForMansion(mansion) {
    if (!mansion) return null;
    const zodiac = mansion?.zodiac_sign;
    if (!zodiac) return null;
    const fireSigns = ["Koç", "Arslan", "Yay"];
    const earthSigns = ["Boğa", "Başak", "Oğlak"];
    const airSigns = ["İkizler", "Terazi", "Kova"];
    if (fireSigns.includes(zodiac)) return { name: "Fire", name_ml: "അഗ്നി" };
    if (earthSigns.includes(zodiac)) return { name: "Earth", name_ml: "ഭൂമി" };
    if (airSigns.includes(zodiac)) return { name: "Air", name_ml: "വായു" };
    return { name: "Water", name_ml: "ജലം" };
  }

  function buildGoodForList(dayRuler, mansion) {
    const items = [];
    if (dayRuler?.suitable_operations) {
      (dayRuler.suitable_operations || []).slice(0, 5).forEach(op => {
        items.push({ text: op, source: "Havâss'ın Derinlikleri", page: "p.49-50" });
      });
    }
    if (mansion?.operations) {
      (mansion.operations || []).filter(op => op && !op.includes("uğursuz")).slice(0, 3).forEach(op => {
        items.push({ text: op, source: "Havâss'ın Derinlikleri", page: `p.64-${64+(mansion.no || 0)}` });
      });
    }
    return items;
  }

  function buildBadForList(dayRuler, mansion) {
    const items = [];
    if (mansion?.operations) {
      (mansion.operations || []).filter(op => op && (op.includes("uğursuz") || op.includes("kötü"))).slice(0, 4).forEach(op => {
        items.push({ text: op, source: "Havâss'ın Derinlikleri", page: `p.64-${64+(mansion.no || 0)}` });
      });
    }
    if (!dayRuler) {
      items.push({ text: "Unknown day ruler", source: "System", page: "N/A" });
    }
    return items;
  }

  function analyzeCurrentHour(planetaryHour, dayRuler) {
    const canDo = [];
    const avoid = [];
    
    if (planetaryHour?.planetInfo?.suitable_operations) {
      (planetaryHour.planetInfo.suitable_operations || []).slice(0, 3).forEach(op => {
        canDo.push({ text: op, source: "Havâss'ın Derinlikleri", page: "p.51-52" });
      });
    }
    
    if (planetaryHour?.planet === "Mars" || planetaryHour?.planet === "Satürn") {
      avoid.push({ text: "New beginnings", source: "Havâss'ın Derinlikleri", page: "p.53" });
      avoid.push({ text: "Important meetings", source: "Havâss'ın Derinlikleri", page: "p.53" });
    }
    
    return { canDo: canDo.length > 0 ? canDo : [{ text: "Routine work", source: "General", page: "p.50" }], avoid };
  }

  function findNextGoodHour(now, dayRuler, currentPlanetaryHour) {
    const currentHour = now.getHours();
    const planetarySequence = ["Güneş", "Venüs", "Merkür", "Ay", "Satürn", "Jüpiter", "Mars"];
    const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(dayRuler?.day_name_en || "Sunday");
    
    for (let i = currentHour + 1; i < currentHour + 24; i++) {
      const hourIndex = (dayIndex + i) % 7;
      const planet = planetarySequence[hourIndex];
      if (planet === "Jüpiter" || planet === "Venüs" || planet === "Güneş") {
        return {
          hour: i % 24,
          planet,
          reason: `${planet} hour brings positive influence`,
          source: "Havâss'ın Derinlikleri",
          page: "p.51-52"
        };
      }
    }
    return { hour: (currentHour + 1) % 24, planet: "Unknown", reason: "Next hour", source: "System", page: "N/A" };
  }

  function findNextGoodDay(currentDayIndex, currentDayRuler) {
    const goodDays = ["Thursday", "Friday", "Sunday"];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayRulers = ["Güneş", "Ay", "Mars", "Merkür", "Jüpiter", "Venüs", "Satürn"];
    
    for (let i = currentDayIndex + 1; i < currentDayIndex + 7; i++) {
      const nextIndex = i % 7;
      if (goodDays.includes(dayNames[nextIndex])) {
        return {
          day: dayNames[nextIndex],
          ruler: dayRulers[nextIndex],
          reason: `${dayRulers[nextIndex]} day is favorable`,
          source: "Havâss'ın Derinlikleri",
          page: "p.49-50"
        };
      }
    }
    return { day: "Thursday", ruler: "Jüpiter", reason: "Jupiter day", source: "Havâss'ın Derinlikleri", page: "p.49" };
  }

  if (loading) {
    return (
      <div className="rounded-xl border p-6" style={{ background: "rgba(8,18,44,0.95)", borderColor: "rgba(212,175,55,0.20)" }}>
        <div className="animate-pulse h-6 bg-white/10 rounded w-32 mb-4"></div>
        <div className="space-y-2">
          <div className="animate-pulse h-4 bg-white/10 rounded w-full"></div>
          <div className="animate-pulse h-4 bg-white/10 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!todayData) {
    return (
      <div className="rounded-xl border p-6 text-center" style={{ background: "rgba(8,18,44,0.95)", borderColor: "rgba(212,175,55,0.20)" }}>
        <AlertCircle className="w-8 h-8 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.40)" }} />
        <p className="font-inter text-sm mb-1" style={{ color: "rgba(255,255,255,0.70)" }}>
          {isMalayalam ? "ഇന്നത്തെ വിശകലനം ലഭ്യമല്ല" : "Today's Analysis Not Available"}
        </p>
        <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
          {isMalayalam ? "ഇന്നത്തെ ഉറവിട ഡാറ്റ ലഭ്യമല്ല" : "Today's reference data not available"}
        </p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <CurrentInfluencesGrid data={todayData} isMalayalam={isMalayalam} />
      <TodayGoodBadLists goodFor={todayData.goodFor} badFor={todayData.badFor} isMalayalam={isMalayalam} />
      <CurrentHourAnalysis hourAnalysis={todayData.hourAnalysis} isMalayalam={isMalayalam} />
      <div className="grid md:grid-cols-2 gap-4">
        <NextGoodHour nextGoodHour={todayData.nextGoodHour} isMalayalam={isMalayalam} />
        <NextGoodDay nextGoodDay={todayData.nextGoodDay} isMalayalam={isMalayalam} />
      </div>
    </motion.div>
  );
}