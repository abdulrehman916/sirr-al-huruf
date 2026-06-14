// ═══════════════════════════════════════════════════════════════
// PROFESSIONAL TIMING DECISION ENGINE — REAL-TIME
// Live astronomical calculations + PDF knowledge base rules
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Book, AlertCircle, CheckCircle, XCircle, Info, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { calculateMoonPosition } from "@/lib/astroClockMoonPosition.js";
import { getCurrentPlanetaryHour, PLANET_INFO, DAY_INFO, getDayRuler } from "@/lib/astroClockLiveEngine.js";
import { calculateSunriseSunset } from "@/lib/astroClockSunriseSunset.js";
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
  excellent: "rgba(34,197,94,0.15)",
  excellentBorder: "rgba(34,197,94,0.60)",
  acceptable: "rgba(251,191,36,0.15)",
  acceptableBorder: "rgba(251,191,36,0.60)",
  avoid: "rgba(239,68,68,0.15)",
  avoidBorder: "rgba(239,68,68,0.60)"
};

export default function ProfessionalTimingDecisionEngine() {
  const { isMalayalam } = useAstroClockLanguage();
  const [engineData, setEngineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedWhy, setExpandedWhy] = useState(false);

  useEffect(() => {
    calculateEngineData();
    const interval = setInterval(calculateEngineData, 30000);
    return () => clearInterval(interval);
  }, []);

  function calculateEngineData() {
    const now = new Date();
    const dayIndex = now.getDay();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          const sunTimes = calculateSunriseSunset(now, loc.lat, loc.lng, -loc.lng / 15);
          processCalculations(now, dayIndex, sunTimes);
        },
        () => {
          const sunTimes = calculateSunriseSunset(now, 25.2048, 55.2708, 4);
          processCalculations(now, dayIndex, sunTimes);
        }
      );
    } else {
      const sunTimes = calculateSunriseSunset(now, 25.2048, 55.2708, 4);
      processCalculations(now, dayIndex, sunTimes);
    }
  }

  function processCalculations(now, dayIndex, sunTimes) {
    const moonPos = calculateMoonPosition(now);
    const planetHour = getCurrentPlanetaryHour(now, sunTimes.sunrise, sunTimes.sunset);
    const dayInfo = DAY_INFO[dayIndex];
    const dayRuler = getDayRuler(dayIndex);
    
    const status = calculateStatus(moonPos, planetHour, dayInfo);
    const nextTransitions = calculateNextTransitions(now, moonPos, planetHour, sunTimes);
    
    setEngineData({
      timestamp: now,
      status,
      planetHour,
      dayInfo,
      moonPos,
      nextTransitions,
      sunTimes
    });
    setLoading(false);
  }

  if (loading || !engineData) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border p-8 text-center" style={{ background: "linear-gradient(145deg, rgba(8,20,52,0.98) 0%, rgba(4,12,34,0.99) 100%)", borderColor: G.border }}>
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: G.text, borderTopColor: "transparent" }} />
        <p className="mt-4 font-inter text-sm" style={{ color: G.dim }}>{isMalayalam ? "കണക്കാക്കുന്നു..." : "Calculating..."}</p>
      </motion.div>
    );
  }

  const { status, planetHour, dayInfo, moonPos, nextTransitions } = engineData;
  const statusConfig = getStatusConfig(status.level);

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-6 relative overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(10,22,56,0.99) 0%, rgba(5,12,36,0.99) 100%)", borderColor: G.borderHi, boxShadow: `0 0 50px ${G.glow}, 0 4px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.10)` }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)` }} />

      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-7 h-7" style={{ color: G.text }} />
        <div>
          <h2 className="font-malayalam-lg uppercase tracking-widest" style={{ color: G.text }}>{isMalayalam ? "പ്രൊഫഷണൽ ടൈമിംഗ് തീരുമാന എഞ്ചിൻ" : "Professional Timing Decision Engine"}</h2>
          <p className="font-malayalam-sm" style={{ color: G.dim }}>{isMalayalam ? "തത്സമയ ജ്യോതിശാസ്ത്രം + PDF നിയമങ്ങൾ" : "Live astronomy + PDF knowledge base rules"}</p>
        </div>
      </div>

      <CurrentStatusCard status={status} statusConfig={statusConfig} planetHour={planetHour} moonPos={moonPos} dayInfo={dayInfo} isMalayalam={isMalayalam} />
      
      <RecommendationsCard status={status} isMalayalam={isMalayalam} />
      
      <NextTransitionsCard nextTransitions={nextTransitions} isMalayalam={isMalayalam} />

      <WhyButton expanded={expandedWhy} onToggle={() => setExpandedWhy(!expandedWhy)} isMalayalam={isMalayalam} />
      
      <AnimatePresence>
        {expandedWhy && (
          <WhyPanel status={status} planetHour={planetHour} moonPos={moonPos} dayInfo={dayInfo} isMalayalam={isMalayalam} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CurrentStatusCard({ status, statusConfig, planetHour, moonPos, dayInfo, isMalayalam }) {
  return (
    <div className="mb-6 p-5 rounded-xl border" style={{ background: statusConfig.bg, borderColor: statusConfig.border }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: statusConfig.border }}>{isMalayalam ? "നിലവിലെ സ്ഥിതി" : "Current Status"}</p>
          <p className="font-malayalam-lg font-bold mt-1" style={{ color: statusConfig.text }}>{status.level}</p>
        </div>
        <div className="text-5xl">{statusConfig.icon}</div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DataItem label={isMalayalam ? "ഗ്രഹ മണിക്കൂർ" : "Planetary Hour"} value={isMalayalam ? planetHour.planetInfo?.name_ml_equivalent : planetHour.planetInfo?.name_en} icon={planetHour.planetInfo?.symbol} />
        <DataItem label={isMalayalam ? "മൂലകം" : "Element"} value={moonPos.zodiacSign?.element} icon="🔥" />
        <DataItem label={isMalayalam ? "ചന്ദ്ര രാശി" : "Moon Sign"} value={isMalayalam ? moonPos.zodiacSign?.name_ml : moonPos.zodiacSign?.name_en} icon={moonPos.zodiacSign?.symbol} />
        <DataItem label={isMalayalam ? "നക്ഷത്രം" : "Lunar Mansion"} value={isMalayalam ? moonPos.mansion?.name_ml : moonPos.mansion?.name_en} arabic={moonPos.mansion?.name_ar} />
      </div>
    </div>
  );
}

function DataItem({ label, value, icon, arabic }) {
  return (
    <div className="p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.20)" }}>
      <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: "rgba(212,175,55,0.55)" }}>{label}</p>
      {arabic ? (
        <>
          <p className="font-amiri text-2xl font-bold text-right" style={{ color: G.text }}>{arabic}</p>
          <p className="font-malayalam-sm font-bold text-white text-center">{value}</p>
        </>
      ) : (
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl">{icon}</span>}
          <p className="font-malayalam-md font-bold text-white">{value}</p>
        </div>
      )}
    </div>
  );
}

function RecommendationsCard({ status, isMalayalam }) {
  return (
    <div className="mb-6 grid md:grid-cols-2 gap-4">
      <div className="p-5 rounded-xl border" style={{ background: G.excellent, borderColor: G.excellentBorder }}>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-5 h-5" style={{ color: "#22c55e" }} />
          <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "#22c55e" }}>{isMalayalam ? "ഉചിത പ്രവർത്തനങ്ങൾ" : "Recommended Actions"}</p>
        </div>
        <div className="space-y-1">
          {(status.recommendedActions || []).map((action, idx) => (
            <p key={idx} className="font-malayalam-sm text-white/80">• {action}</p>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-xl border" style={{ background: G.avoid, borderColor: G.avoidBorder }}>
        <div className="flex items-center gap-2 mb-3">
          <XCircle className="w-5 h-5" style={{ color: "#ef4444" }} />
          <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "#ef4444" }}>{isMalayalam ? "ഒഴിവാക്കേണ്ടവ" : "Actions to Avoid"}</p>
        </div>
        <div className="space-y-1">
          {(status.actionsToAvoid || []).map((action, idx) => (
            <p key={idx} className="font-malayalam-sm text-white/80">• {action}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function NextTransitionsCard({ nextTransitions, isMalayalam }) {
  return (
    <div className="mb-6 grid md:grid-cols-2 lg:grid-cols-4 gap-3">
      <TransitionItem title={isMalayalam ? "അടുത്ത Sa'd Akbar" : "Next Sa'd Akbar"} time={nextTransitions.nextSaadAkbar?.time} countdown={nextTransitions.nextSaadAkbar?.countdown} type="excellent" isMalayalam={isMalayalam} />
      <TransitionItem title={isMalayalam ? "അടുത്ത Nahs Akbar" : "Next Nahs Akbar"} time={nextTransitions.nextNahsAkbar?.time} countdown={nextTransitions.nextNahsAkbar?.countdown} type="avoid" isMalayalam={isMalayalam} />
      <TransitionItem title={isMalayalam ? "നക്ഷത്ര മാറ്റം" : "Mansion Change"} time={nextTransitions.nextMansionChange?.time} countdown={nextTransitions.nextMansionChange?.countdown} type="neutral" isMalayalam={isMalayalam} />
      <TransitionItem title={isMalayalam ? "രാശി മാറ്റം" : "Zodiac Change"} time={nextTransitions.nextZodiacChange?.time} countdown={nextTransitions.nextZodiacChange?.countdown} type="neutral" isMalayalam={isMalayalam} />
    </div>
  );
}

function TransitionItem({ title, time, countdown, type, isMalayalam }) {
  const colors = {
    excellent: { bg: G.excellent, border: G.excellentBorder, text: "#22c55e" },
    avoid: { bg: G.avoid, border: G.avoidBorder, text: "#ef4444" },
    neutral: { bg: G.bg, border: G.faint, text: G.text }
  };
  const color = colors[type];

  return (
    <div className="p-4 rounded-xl border" style={{ background: color.bg, borderColor: color.border }}>
      <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: color.text }}>{title}</p>
      {time ? (
        <>
          <p className="font-malayalam-md font-bold text-white mb-1">{time}</p>
          <p className="font-inter text-[8px]" style={{ color: G.dim }}>{countdown}</p>
        </>
      ) : (
        <p className="font-inter text-[8px]" style={{ color: G.dim }}>{isMalayalam ? "കണക്കാക്കിയിട്ടില്ല" : "Not calculated"}</p>
      )}
    </div>
  );
}

function WhyButton({ expanded, onToggle, isMalayalam }) {
  return (
    <button onClick={onToggle} className="w-full py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all" style={{ background: G.bg, color: G.text, borderColor: G.border }}>
      {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      {isMalayalam ? "എന്തുകൊണ്ട് ഈ ഫലം?" : "Why This Result?"}
    </button>
  );
}

function WhyPanel({ status, planetHour, moonPos, dayInfo, isMalayalam }) {
  return (
    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-4 pt-4 border-t" style={{ borderColor: G.faint }}>
      <div className="space-y-4">
        <WhyItem icon={Book} title={isMalayalam ? "PDF നിയമം" : "PDF Rule Used"} text={status.pdfRule} isMalayalam={isMalayalam} />
        <WhyItem icon={Calendar} title={isMalayalam ? "നക്ഷത്ര നിയമം" : "Mansion Rule"} text={status.mansionRule} isMalayalam={isMalayalam} />
        <WhyItem icon={Clock} title={isMalayalam ? "ഗ്രഹ മണിക്കൂർ നിയമം" : "Planetary Hour Rule"} text={status.planetHourRule} isMalayalam={isMalayalam} />
        <WhyItem icon={Info} title={isMalayalam ? "മൂലക നിയമം" : "Element Rule"} text={status.elementRule} isMalayalam={isMalayalam} />
      </div>
    </motion.div>
  );
}

function WhyItem({ icon: Icon, title, text, isMalayalam }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 mt-0.5" style={{ color: G.dim }} />
      <div>
        <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>{title}</p>
        <p className="font-malayalam-sm text-white/80">{text}</p>
      </div>
    </div>
  );
}

function getStatusConfig(level) {
  const configs = {
    "Sa'd Akbar": { icon: "🟢", text: "#22c55e", bg: G.excellent, border: G.excellentBorder },
    "Sa'd Asghar": { icon: "🟡", text: "#fbbf24", bg: G.acceptable, border: G.acceptableBorder },
    "Neutral": { icon: "⚪", text: G.text, bg: G.bg, border: G.faint },
    "Nahs Asghar": { icon: "🟠", text: "#f97316", bg: G.avoid, border: G.avoidBorder },
    "Nahs Akbar": { icon: "🔴", text: "#ef4444", bg: G.avoid, border: G.avoidBorder }
  };
  return configs[level] || configs.Neutral;
}

function calculateStatus(moonPos, planetHour, dayInfo) {
  const sign = moonPos.zodiacSign?.name_en;
  const mansion = moonPos.mansion?.name_en;
  const planet = planetHour.planet;
  const dayRuler = dayInfo.ruler;
  
  let score = 0;
  let recommendedActions = [];
  let actionsToAvoid = [];
  let pdfRule = "";
  let mansionRule = "";
  let planetHourRule = "";
  let elementRule = "";

  if (['Taurus', 'Cancer', 'Sagittarius', 'Pisces', 'Leo'].includes(sign)) {
    score += 2;
    elementRule = "Moon in beneficial sign (Earth/Water/Fire) — PDF2 p.76";
  }
  if (['Scorpio', 'Capricorn', 'Aquarius'].includes(sign)) {
    score -= 2;
    elementRule = "Moon in challenging sign — PDF2 p.76";
  }

  const suitableMansions = [2, 3, 6, 7, 11, 15, 16, 20, 24, 26, 28];
  const worstMansions = [1, 4, 5, 8, 9, 12, 13, 14, 21, 22, 25, 27];
  const mansionNum = moonPos.mansion?.number;

  if (suitableMansions.includes(mansionNum)) {
    score += 2;
    mansionRule = `Mansion ${mansionNum} is Sa'd (auspicious) — PDF2 p.64`;
    recommendedActions.push("Spiritual work", "Important decisions", "New beginnings");
  }
  if (worstMansions.includes(mansionNum)) {
    score -= 2;
    mansionRule = `Mansion ${mansionNum} is Nahs (inauspicious) — PDF2 p.64`;
    actionsToAvoid.push("Major decisions", "Travel", "Signing contracts");
  }

  const suitablePlanets = ['jupiter', 'venus', 'moon', 'sun'];
  const enemyPlanets = ['saturn', 'mars'];

  if (suitablePlanets.includes(planet)) {
    score += 1;
    planetHourRule = `Planetary hour of ${planetHour.planetInfo?.name_en} is favorable — PDF2 p.53`;
    recommendedActions.push(...(planetHour.planetInfo?.goodActions_en || []).slice(0, 2));
  }
  if (enemyPlanets.includes(planet)) {
    score -= 1;
    planetHourRule = `Planetary hour of ${planetHour.planetInfo?.name_en} is challenging — PDF2 p.54`;
    actionsToAvoid.push(...(planetHour.planetInfo?.badActions_en || []).slice(0, 2));
  }

  if (suitablePlanets.includes(dayRuler)) {
    score += 1;
    pdfRule = `Day ruler ${DAY_INFO[new Date().getDay()].ruler} is beneficial — PDF2 p.49`;
  }
  if (enemyPlanets.includes(dayRuler)) {
    score -= 1;
    pdfRule = `Day ruler ${DAY_INFO[new Date().getDay()].ruler} is malefic — PDF2 p.49`;
  }

  let level = 'Neutral';
  if (score >= 4) level = 'Sa\'d Akbar';
  else if (score >= 2) level = 'Sa\'d Asghar';
  else if (score <= -4) level = 'Nahs Akbar';
  else if (score <= -2) level = 'Nahs Asghar';

  if (recommendedActions.length === 0) {
    recommendedActions = ["Routine work", "Planning", "Study"];
  }
  if (actionsToAvoid.length === 0) {
    actionsToAvoid = ["Risk-taking", "Conflicts"];
  }

  return {
    level,
    score,
    recommendedActions,
    actionsToAvoid,
    pdfRule: pdfRule || "General timing rules applied — PDF2 p.63",
    mansionRule: mansionRule || "Mansion influence neutral",
    planetHourRule: planetHourRule || "Planetary hour neutral",
    elementRule: elementRule || "Element balance neutral"
  };
}

function calculateNextTransitions(now, moonPos, planetHour, sunTimes) {
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  const nextSaadAkbar = findNextPeriod(now, 4, isMalayalam => isMalayalam ? "നാളെ" : "Tomorrow");
  const nextNahsAkbar = findNextPeriod(now, -4, isMalayalam => isMalayalam ? "നാളെ" : "Tomorrow", true);
  
  const mansionDuration = 24 * 60 / 28;
  const nextMansionMinutes = mansionDuration - ((currentHour * 60 + currentMinute) % mansionDuration);
  const nextMansionTime = new Date(now.getTime() + nextMansionMinutes * 60000);
  
  const zodiacDuration = 2.5 * 24 * 60;
  const nextZodiacMinutes = zodiacDuration - ((currentHour * 60 + currentMinute) % zodiacDuration);
  const nextZodiacTime = new Date(now.getTime() + nextZodiacMinutes * 60000);

  return {
    nextSaadAkbar: formatTransition(nextSaadAkbar),
    nextNahsAkbar: formatTransition(nextNahsAkbar),
    nextMansionChange: {
      time: formatTime(nextMansionTime),
      countdown: formatCountdown(nextMansionMinutes)
    },
    nextZodiacChange: {
      time: formatTime(nextZodiacTime),
      countdown: formatCountdown(nextZodiacMinutes)
    }
  };
}

function findNextPeriod(now, targetScore, tomorrowLabel, isUnfavorable = false) {
  const currentHour = now.getHours();
  
  for (let h = currentHour + 1; h < 24; h++) {
    const futureDate = new Date(now);
    futureDate.setHours(h, 0, 0, 0);
    
    const moonPos = calculateMoonPosition(futureDate);
    const sign = moonPos.zodiacSign?.name_en;
    const mansionNum = moonPos.mansion?.number;
    
    let score = 0;
    if (['Taurus', 'Cancer', 'Sagittarius', 'Pisces', 'Leo'].includes(sign)) score += 2;
    if (['Scorpio', 'Capricorn', 'Aquarius'].includes(sign)) score -= 2;
    
    const suitableMansions = [2, 3, 6, 7, 11, 15, 16, 20, 24, 26, 28];
    const worstMansions = [1, 4, 5, 8, 9, 12, 13, 14, 21, 22, 25, 27];
    
    if (suitableMansions.includes(mansionNum)) score += 2;
    if (worstMansions.includes(mansionNum)) score -= 2;
    
    if (isUnfavorable ? score <= targetScore : score >= targetScore) {
      return { time: formatTime(futureDate), date: futureDate };
    }
  }
  
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  for (let h = 0; h < 24; h++) {
    const futureDate = new Date(tomorrow);
    futureDate.setHours(h, 0, 0, 0);
    
    const moonPos = calculateMoonPosition(futureDate);
    const sign = moonPos.zodiacSign?.name_en;
    const mansionNum = moonPos.mansion?.number;
    
    let score = 0;
    if (['Taurus', 'Cancer', 'Sagittarius', 'Pisces', 'Leo'].includes(sign)) score += 2;
    if (['Scorpio', 'Capricorn', 'Aquarius'].includes(sign)) score -= 2;
    
    const suitableMansions = [2, 3, 6, 7, 11, 15, 16, 20, 24, 26, 28];
    if (suitableMansions.includes(mansionNum)) score += 2;
    if ([1, 4, 5, 8, 9, 12, 13, 14, 21, 22, 25, 27].includes(mansionNum)) score -= 2;
    
    if (isUnfavorable ? score <= targetScore : score >= targetScore) {
      return { time: formatTime(futureDate), date: futureDate, isTomorrow: true };
    }
  }
  
  return null;
}

function formatTransition(transition) {
  if (!transition) return null;
  return {
    time: formatTime(transition.date),
    countdown: formatCountdown(Math.floor((transition.date.getTime() - new Date().getTime()) / 60000))
  };
}

function formatTime(date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const hours = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h >= 12 && h < 24 ? 'PM' : 'AM';
  return `${hours}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function formatCountdown(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}