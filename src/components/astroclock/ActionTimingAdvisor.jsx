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
    const matchingRules = [];
    
    // Check mansion - must match manuscript rule exactly
    if (rules.suitableMansions.includes(moonPos.mansion?.number)) {
      score += 3;
      matchingRules.push({
        type: "mansion_match",
        book_name: "Havâss'ın Derinlikleri",
        page_number: rules.pdf_pages,
        original_text: rules.original_text?.mansion || null,
        malayalam_translation: rules.malayalam_translation?.mansion || null,
        why_applies: `Current mansion ${moonPos.mansion.number} matches manuscript rule`
      });
      reasons.push({ type: "positive", text: `Mansion ${moonPos.mansion.number} matches manuscript rule` });
    } else if (rules.unsuitableMansions.includes(moonPos.mansion?.number)) {
      score -= 3;
      reasons.push({ type: "negative", text: `Mansion ${moonPos.mansion.number} forbidden by manuscript` });
    }
    
    // Check planet - must match manuscript rule exactly
    if (rules.suitablePlanets.includes(planetHour.planet)) {
      score += 2;
      matchingRules.push({
        type: "planet_match",
        book_name: "Havâss'ın Derinlikleri",
        page_number: rules.pdf_pages,
        original_text: rules.original_text?.planet || null,
        malayalam_translation: rules.malayalam_translation?.planet || null,
        why_applies: `Current ${planetHour.planetInfo?.name_en} hour matches manuscript rule`
      });
      reasons.push({ type: "positive", text: `${planetHour.planetInfo?.name_en} hour matches manuscript rule` });
    } else if (rules.unsuitablePlanets.includes(planetHour.planet)) {
      score -= 2;
      reasons.push({ type: "negative", text: `${planetHour.planetInfo?.name_en} hour forbidden by manuscript` });
    }
    
    // Check day - must match manuscript rule exactly
    if (rules.suitableDays.includes(dayKey)) {
      score += 2;
      matchingRules.push({
        type: "day_match",
        book_name: "Havâss'ın Derinlikleri",
        page_number: rules.pdf_pages,
        original_text: rules.original_text?.day || null,
        malayalam_translation: rules.malayalam_translation?.day || null,
        why_applies: `${dayKey} matches manuscript rule`
      });
      reasons.push({ type: "positive", text: `${dayKey} matches manuscript rule` });
    } else if (rules.unsuitableDays.includes(dayKey)) {
      score -= 2;
      reasons.push({ type: "negative", text: `${dayKey} forbidden by manuscript` });
    }
    
    // Check day/night
    if (rules.dayOrNight === "night" && !isDaytime) {
      score += 1;
      matchingRules.push({
        type: "time_match",
        book_name: "Havâss'ın Derinlikleri",
        page_number: rules.pdf_pages,
        original_text: rules.original_text?.time || null,
        malayalam_translation: rules.malayalam_translation?.time || null,
        why_applies: `Nighttime matches manuscript requirement`
      });
    } else if (rules.dayOrNight === "night" && isDaytime) {
      score -= 1;
      reasons.push({ type: "negative", text: `Manuscript requires nighttime` });
    } else if (rules.dayOrNight === "day" && isDaytime) {
      score += 1;
      matchingRules.push({
        type: "time_match",
        book_name: "Havâss'ın Derinlikleri",
        page_number: rules.pdf_pages,
        original_text: rules.original_text?.time || null,
        malayalam_translation: rules.malayalam_translation?.time || null,
        why_applies: `Daytime matches manuscript requirement`
      });
    } else if (rules.dayOrNight === "day" && !isDaytime) {
      score -= 1;
      reasons.push({ type: "negative", text: `Manuscript requires daytime` });
    }
    
    // FINAL MANUSCRIPT RULE: No recommendation without matching rules
    const isSuitable = score >= 2 && matchingRules.length > 0;
    
    setTimingResult({
      isSuitable,
      score,
      reasons,
      matchingRules,
      source: rules.source,
      pdf_pages: rules.pdf_pages,
      notes: rules.notes,
      no_manuscript_match: !isSuitable && matchingRules.length === 0
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
      
      {status.no_manuscript_match ? (
        <>
          <p className="font-malayalam-lg font-bold text-white mb-2">
            {isMalayalam ? "ഹസ്തലിഖിതത്തിൽ യോജിക്കുന്ന നിയമമില്ല" : "No matching manuscript rule found"}
          </p>
          <p className="font-malayalam-sm text-white/70">
            {isMalayalam 
              ? "നിലവിലെ സമയത്തിന് PDF നിയമങ്ങളിൽ യോജിക്കുന്ന വിധി കണ്ടെത്തിയില്ല" 
              : "No manuscript rule matches the current astrological configuration"}
          </p>
        </>
      ) : (
        <>
          <p className="font-malayalam-lg font-bold text-white">
            {status.isSuitable
              ? (isMalayalam ? "ഉചിത സമയം ✓" : "Suitable Time ✓")
              : (isMalayalam ? "ഉചിതമല്ല ✗" : "Not Suitable ✗")}
          </p>
          <p className="font-malayalam-sm text-white/70 mt-1">{status.reasons?.[0]?.text}</p>
        </>
      )}
      
      {status.source && !status.no_manuscript_match && (
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

  // If no manuscript match, show warning
  if (result.no_manuscript_match) {
    return (
      <div className="mt-6 p-6 rounded-xl border text-center" style={{ background: G.wait, borderColor: G.waitBorder }}>
        <Book className="w-8 h-8 mx-auto mb-3" style={{ color: G.text }} />
        <p className="font-malayalam-lg font-bold text-white mb-2">
          {isMalayalam ? "ഹസ്തലിഖിത നിയമങ്ങൾ പാലിക്കുന്നു" : "Manuscript Rules Enforcement"}
        </p>
        <p className="font-malayalam-sm text-white/70 mb-4">
          {isMalayalam 
            ? "നിലവിലെ ഗ്രഹനിലകൾക്ക് അനുയോജ്യമായ PDF നിയമങ്ങൾ കണ്ടെത്തിയില്ല" 
            : "No PDF manuscript rules match the current planetary configuration"}
        </p>
        <div className="text-left p-4 rounded-lg" style={{ background: G.bg, borderColor: G.faint, border: "1px solid" }}>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-3" style={{ color: G.text }}>
            {isMalayalam ? "ആവശ്യമായ ഉറവിട വിവരങ്ങൾ" : "Required Source Information"}
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">{isMalayalam ? "പുസ്തകം:" : "Book:"}</span>
              <span className="text-white font-bold">Havâss'ın Derinlikleri</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">{isMalayalam ? "പേജ്:" : "Page:"}</span>
              <span className="text-white font-bold">{rules.pdf_pages}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">{isMalayalam ? "മൂലകം:" : "Element:"}</span>
              <span className="text-white font-bold">{isMalayalam ? "ലഭ്യമല്ല" : "Not found"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show matching manuscript rules with full citation
  return (
    <div className="mt-6 space-y-4">
      {/* Matching Rules Display */}
      <div className="p-5 rounded-xl border" style={{ background: G.bg, borderColor: G.border }}>
        <div className="flex items-center gap-2 mb-4">
          <Book className="w-5 h-5" style={{ color: G.text }} />
          <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.text }}>
            {isMalayalam ? "യോജിക്കുന്ന ഹസ്തലിഖിത നിയമങ്ങൾ" : "Matching Manuscript Rules"}
          </p>
        </div>
        
        <div className="space-y-4">
          {(result.matchingRules || []).map((rule, idx) => (
            <div key={idx} className="p-4 rounded-lg border" style={{ background: G.bgHi, borderColor: G.borderHi }}>
              {/* 1. Book Name */}
              <div className="mb-2">
                <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>
                  {isMalayalam ? "പുസ്തകം" : "Book Name"}
                </p>
                <p className="font-malayalam-md font-bold text-white">{rule.book_name}</p>
              </div>
              
              {/* 2. Page Number */}
              <div className="mb-2">
                <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>
                  {isMalayalam ? "പേജ് നമ്പർ" : "Page Number"}
                </p>
                <p className="font-malayalam-sm font-bold text-white">p. {rule.page_number}</p>
              </div>
              
              {/* 3. Original Manuscript Text */}
              {rule.original_text && (
                <div className="mb-2 p-2 rounded" style={{ background: "rgba(212,175,55,0.05)" }}>
                  <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                    {isMalayalam ? "യഥാർത്ഥ ഹസ്തലിഖിത വാചകം" : "Original Manuscript Text"}
                  </p>
                  <p className="font-amiri text-xl font-bold text-right" style={{ color: G.text }}>{rule.original_text}</p>
                </div>
              )}
              
              {/* 4. Malayalam Translation */}
              {rule.malayalam_translation && (
                <div className="mb-2 p-2 rounded" style={{ background: "rgba(34,197,94,0.05)" }}>
                  <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: "#22c55e" }}>
                    {isMalayalam ? "മലയാളം തർജ്ജമ" : "Malayalam Translation"}
                  </p>
                  <p className="font-malayalam-sm text-white/80">{rule.malayalam_translation}</p>
                </div>
              )}
              
              {/* 5. Why This Rule Applies */}
              <div className="p-2 rounded" style={{ background: "rgba(34,197,94,0.10)", border: `1px solid rgba(34,197,94,0.30)` }}>
                <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: "#22c55e" }}>
                  {isMalayalam ? "ഈ നിയമം ബാധകമാകാൻ കാരണം" : "Why This Rule Applies Now"}
                </p>
                <p className="font-malayalam-sm text-white/90">{rule.why_applies}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}