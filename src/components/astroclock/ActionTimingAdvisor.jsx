// ═══════════════════════════════════════════════════════════════
// ACTION TIMING ADVISOR — PDF KNOWLEDGE BASE ONLY
// Live timing recommendations from uploaded PDF books only
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Clock, CheckCircle, XCircle, Book } from "lucide-react";
import { calculateMoonPosition } from "@/lib/astroClockMoonPosition.js";
import { getCurrentPlanetaryHour } from "@/lib/astroClockLiveEngine.js";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";
import { ACTION_CATEGORIES, ACTION_TIMING_RULES, findActionCategory } from "@/lib/astroClockActionTimingRules.js";

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
  avoid: "rgba(239,68,68,0.15)",
  avoidBorder: "rgba(239,68,68,0.60)"
};

const EXAMPLE_ACTIONS = [
  { ml: "വിവാഹം", en: "marriage", key: "MARRIAGE" },
  { ml: "പ്രണയം", en: "love", key: "LOVE" },
  { ml: "വ്യാപാരം", en: "business", key: "BUSINESS" },
  { ml: "യാത്ര", en: "travel", key: "TRAVEL" },
  { ml: "പഠനം", en: "education", key: "EDUCATION" },
  { ml: "ജോലി", en: "job", key: "JOB" },
  { ml: "ചികിത്സ", en: "healing", key: "HEALING" },
  { ml: "വീട് നിർമ്മാണം", en: "construction", key: "CONSTRUCTION" }
];

export default function ActionTimingAdvisor() {
  const { isMalayalam } = useAstroClockLanguage();
  const [searchInput, setSearchInput] = useState("");
  const [selectedAction, setSelectedAction] = useState(null);
  const [timingResult, setTimingResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedAction) {
      calculateTiming();
      const interval = setInterval(calculateTiming, 60000);
      return () => clearInterval(interval);
    }
  }, [selectedAction]);

  function calculateTiming() {
    setLoading(true);
    
    const now = new Date();
    const dayIndex = now.getDay();
    const dayKeys = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayKey = dayKeys[dayIndex];
    
    const moonPos = calculateMoonPosition(now);
    const planetHour = getCurrentPlanetaryHour(now, 6.5, 18.25);
    const isDaytime = now.getHours() >= 6 && now.getHours() < 18;
    
    const rules = ACTION_TIMING_RULES[selectedAction.key];
    if (!rules) {
      setLoading(false);
      return;
    }
    
    let score = 0;
    const reasons = [];
    
    // Check mansion
    if (rules.suitableMansions.includes(moonPos.mansion?.number)) {
      score += 3;
      reasons.push({ type: "positive", text: `Mansion ${moonPos.mansion.number} is suitable` });
    } else if (rules.unsuitableMansions.includes(moonPos.mansion?.number)) {
      score -= 3;
      reasons.push({ type: "negative", text: `Mansion ${moonPos.mansion.number} is unsuitable` });
    }
    
    // Check planet
    if (rules.suitablePlanets.includes(planetHour.planet)) {
      score += 2;
      reasons.push({ type: "positive", text: `${planetHour.planetInfo?.name_en} hour is suitable` });
    } else if (rules.unsuitablePlanets.includes(planetHour.planet)) {
      score -= 2;
      reasons.push({ type: "negative", text: `${planetHour.planetInfo?.name_en} hour is unsuitable` });
    }
    
    // Check day
    if (rules.suitableDays.includes(dayKey)) {
      score += 2;
      reasons.push({ type: "positive", text: `${dayKey} is suitable` });
    } else if (rules.unsuitableDays.includes(dayKey)) {
      score -= 2;
      reasons.push({ type: "negative", text: `${dayKey} is unsuitable` });
    }
    
    // Check day/night
    if (rules.dayOrNight === "night" && !isDaytime) {
      score += 1;
    } else if (rules.dayOrNight === "night" && isDaytime) {
      score -= 1;
    } else if (rules.dayOrNight === "day" && isDaytime) {
      score += 1;
    } else if (rules.dayOrNight === "day" && !isDaytime) {
      score -= 1;
    }
    
    const isSuitable = score >= 2;
    
    setTimingResult({
      isSuitable,
      score,
      reasons,
      source: rules.source,
      notes: rules.notes
    });
    setLoading(false);
  }

  function handleActionSelect(actionKey) {
    const actionData = ACTION_CATEGORIES[actionKey];
    setSelectedAction({ key: actionKey, ...actionData });
    setSearchInput("");
  }

  function handleSearch(input) {
    setSearchInput(input);
    const matchedKey = findActionCategory(input);
    if (matchedKey) {
      handleActionSelect(matchedKey);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(10,22,56,0.99) 0%, rgba(5,12,36,0.99) 100%)",
        borderColor: G.borderHi,
        boxShadow: `0 0 50px ${G.glow}, 0 4px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.10)`
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)` }} />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-7 h-7" style={{ color: G.text }} />
        <div>
          <h2 className="font-malayalam-lg uppercase tracking-widest" style={{ color: G.text }}>
            {isMalayalam ? "ആക്ഷൻ ടൈമിംഗ് അഡ്വൈസർ" : "Action Timing Advisor"}
          </h2>
          <p className="font-malayalam-sm" style={{ color: G.dim }}>
            {isMalayalam ? "PDF നോളജ് ബേസ് മാത്രം" : "PDF Knowledge Base Only"}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: G.dim }} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={isMalayalam ? "പ്രവർത്തനം ടൈപ്പ് ചെയ്യുക..." : "Type action..."}
            className="w-full pl-12 pr-4 py-4 rounded-xl border outline-none transition-all"
            style={{
              background: G.bg,
              borderColor: G.border,
              color: "#fff",
              fontSize: "16px"
            }}
          />
        </div>
      </div>

      {/* Example Actions */}
      <div className="mb-6">
        <p className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.dim }}>
          {isMalayalam ? "ഉദാഹരണങ്ങൾ" : "Examples"}
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_ACTIONS.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleActionSelect(action.key)}
              className="px-3 py-1.5 rounded-lg border text-xs font-bold transition-all hover:border-opacity-60"
              style={{
                background: selectedAction?.key === action.key ? G.bgHi : G.bg,
                borderColor: selectedAction?.key === action.key ? G.borderHi : G.faint,
                color: selectedAction?.key === action.key ? G.text : "#fff"
              }}
            >
              {isMalayalam ? action.ml : action.en}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Action */}
      {selectedAction && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl border"
          style={{ background: G.bg, borderColor: G.border }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-amiri text-3xl font-bold" style={{ color: G.text }}>{selectedAction.arabic}</p>
              <p className="font-malayalam-md font-bold text-white">
                {isMalayalam ? selectedAction.ml[0] : selectedAction.en[0]}
              </p>
            </div>
            <button
              onClick={() => setSelectedAction(null)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider"
              style={{
                background: "rgba(239,68,68,0.20)",
                color: "#ef4444"
              }}
            >
              {isMalayalam ? "മാറ്റുക" : "Change"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="py-8 text-center">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto"
            style={{ borderColor: G.text, borderTopColor: "transparent" }} />
          <p className="mt-4 font-inter text-sm" style={{ color: G.dim }}>
            {isMalayalam ? "കണക്കാക്കുന്നു..." : "Calculating..."}
          </p>
        </div>
      )}

      {/* Results */}
      {timingResult && !loading && (
        <>
          <CurrentStatus status={timingResult} isMalayalam={isMalayalam} />
          <TimingRules action={selectedAction} result={timingResult} isMalayalam={isMalayalam} />
        </>
      )}

      {!selectedAction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border p-5 text-center"
          style={{ background: G.bg, borderColor: G.faint }}
        >
          <Book className="w-6 h-6 mx-auto mb-3" style={{ color: G.dim }} />
          <p className="font-inter text-sm" style={{ color: G.dim }}>
            {isMalayalam
              ? "ഒരു പ്രവർത്തനം തിരഞ്ഞെടുക്കുക. PDF നിയമങ്ങൾ പ്രകാരം ഉചിത സമയം നിർദ്ദേശിക്കുന്നു."
              : "Select an action. Timing from PDF knowledge base rules only."}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

function CurrentStatus({ status, isMalayalam }) {
  const config = status.isSuitable
    ? { color: G.excellent, border: G.excellentBorder, text: "#22c55e", icon: "🟢" }
    : { color: G.avoid, border: G.avoidBorder, text: "#ef4444", icon: "🔴" };

  return (
    <div className="mb-6 p-5 rounded-xl border" style={{ background: config.color, borderColor: config.border }}>
      <div className="flex items-center justify-between mb-3">
        <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: config.text }}>
          {isMalayalam ? "നിലവിലെ സ്ഥിതി" : "Current Status"}
        </p>
        <span className="text-2xl">{config.icon}</span>
      </div>
      <p className="font-malayalam-lg font-bold text-white">
        {status.isSuitable
          ? (isMalayalam ? "ഉചിത സമയം ✓" : "Suitable Time ✓")
          : (isMalayalam ? "ഉചിതമല്ല ✗" : "Not Suitable ✗")}
      </p>
      <p className="font-malayalam-sm text-white/70 mt-1">{status.reason}</p>
      {status.source && (
        <div className="mt-3 flex items-center gap-2">
          <Book className="w-3 h-3" style={{ color: config.text }} />
          <p className="font-inter text-[8px]" style={{ color: config.text }}>Source: {status.source}</p>
        </div>
      )}
    </div>
  );
}

function TimingRules({ action, result, isMalayalam }) {
  const rules = ACTION_TIMING_RULES[action.key];
  if (!rules) return null;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Suitable */}
      <div className="p-5 rounded-xl border" style={{ background: G.excellent, borderColor: G.excellentBorder }}>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-5 h-5" style={{ color: "#22c55e" }} />
          <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "#22c55e" }}>
            {isMalayalam ? "ഉചിതം" : "Suitable"}
          </p>
        </div>
        <div className="space-y-2">
          <p className="font-malayalam-sm text-white/80">
            <span className="font-bold">Mansions:</span> {rules.suitableMansions.join(", ")}
          </p>
          <p className="font-malayalam-sm text-white/80">
            <span className="font-bold">Planets:</span> {rules.suitablePlanets.join(", ")}
          </p>
          <p className="font-malayalam-sm text-white/80">
            <span className="font-bold">Days:</span> {rules.suitableDays.join(", ")}
          </p>
          {rules.dayOrNight === "night" && (
            <p className="font-malayalam-sm font-bold" style={{ color: "#22c55e" }}>
              ✓ {isMalayalam ? "രാത്രി മാത്രം" : "Night only"}
            </p>
          )}
          {rules.saadRequired && (
            <p className="font-malayalam-sm font-bold" style={{ color: "#22c55e" }}>
              ✓ Sa'd mansion required
            </p>
          )}
          {result.notes && (
            <p className="font-malayalam-sm text-white/60 mt-2 italic">
              {isMalayalam ? result.notes.ml : result.notes.en}
            </p>
          )}
        </div>
      </div>

      {/* Unsuitable */}
      <div className="p-5 rounded-xl border" style={{ background: G.avoid, borderColor: G.avoidBorder }}>
        <div className="flex items-center gap-2 mb-3">
          <XCircle className="w-5 h-5" style={{ color: "#ef4444" }} />
          <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "#ef4444" }}>
            {isMalayalam ? "അനുചിതം" : "Unsuitable"}
          </p>
        </div>
        <div className="space-y-2">
          <p className="font-malayalam-sm text-white/80">
            <span className="font-bold">Mansions:</span> {rules.unsuitableMansions.join(", ")}
          </p>
          <p className="font-malayalam-sm text-white/80">
            <span className="font-bold">Planets:</span> {rules.unsuitablePlanets.join(", ")}
          </p>
          <p className="font-malayalam-sm text-white/80">
            <span className="font-bold">Days:</span> {rules.unsuitableDays.join(", ")}
          </p>
          {rules.nahsRequired && (
            <p className="font-malayalam-sm font-bold" style={{ color: "#ef4444" }}>
              ✓ Nahs mansion required
            </p>
          )}
        </div>
      </div>
    </div>
  );
}