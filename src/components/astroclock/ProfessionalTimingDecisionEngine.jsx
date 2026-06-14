// ═══════════════════════════════════════════════════════════════
// PROFESSIONAL TIMING DECISION ENGINE — PDF KNOWLEDGE BASE
// Every recommendation traceable to ingested PDF sources
// NO generic astrology — ONLY ingested rules from books
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Info, CheckCircle, ChevronDown, ChevronUp, Quote } from "lucide-react";
import { calculateMoonPosition } from "@/lib/astroClockMoonPosition.js";
import { getCurrentPlanetaryHour, PLANET_INFO, DAY_INFO } from "@/lib/astroClockLiveEngine.js";
import { ACTION_RULES } from "@/lib/astroClockActionTimingAdvisor.js";
import { LUNAR_MANSION_DATA } from "@/lib/astroClockData.js";
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

  useEffect(() => {
    const now = new Date();
    const dayIndex = now.getDay();
    const moonPos = calculateMoonPosition(now);
    const planetHour = getCurrentPlanetaryHour(now, 6.5, 18.25);
    const dayInfo = DAY_INFO[dayIndex];

    const actionTimings = Object.entries(ACTION_RULES).map(([key, rules]) => {
      const status = determineStatus(rules, moonPos, planetHour, dayInfo);
      return { key, category: isMalayalam ? rules.category_ml : rules.category, status, rules, icon: getCategoryIcon(key) };
    });

    setEngineData({ moonPos, planetHour, dayInfo, actionTimings, timestamp: now });
    setLoading(false);
  }, []);

  if (loading || !engineData) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border p-8 text-center" style={{ background: "linear-gradient(145deg, rgba(8,20,52,0.98) 0%, rgba(4,12,34,0.99) 100%)", borderColor: G.border }}>
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: G.text, borderTopColor: "transparent" }} />
        <p className="mt-4 font-inter text-sm" style={{ color: G.dim }}>{isMalayalam ? "കണക്കാക്കുന്നു..." : "Calculating..."}</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-6 relative overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(10,22,56,0.99) 0%, rgba(5,12,36,0.99) 100%)", borderColor: G.borderHi, boxShadow: `0 0 50px ${G.glow}, 0 4px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.10)` }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)` }} />

      <div className="flex items-center gap-3 mb-6">
        <Book className="w-7 h-7" style={{ color: G.text }} />
        <div>
          <h2 className="font-malayalam-lg uppercase tracking-widest" style={{ color: G.text }}>{isMalayalam ? "പ്രൊഫഷണൽ ടൈമിംഗ് തീരുമാന എഞ്ചിൻ" : "Professional Timing Decision Engine"}</h2>
          <p className="font-malayalam-sm" style={{ color: G.dim }}>{isMalayalam ? "PDF അറിവ് അടിസ്ഥാനമാക്കിയ സമയ നിയമങ്ങൾ" : "Timing rules from ingested PDF knowledge base"}</p>
        </div>
      </div>

      <CurrentFactors data={engineData} isMalayalam={isMalayalam} />
      <NextPeriods data={engineData} isMalayalam={isMalayalam} />
      <CategoryGrid categoryTimings={engineData.actionTimings} isMalayalam={isMalayalam} />
      <SourceLegend isMalayalam={isMalayalam} />
    </motion.div>
  );
}

function CurrentFactors({ data, isMalayalam }) {
  const { moonPos, planetHour, dayInfo } = data;
  return (
    <div className="mb-6 p-5 rounded-xl border" style={{ background: G.bg, borderColor: G.faint }}>
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5" style={{ color: G.dim }} />
        <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>{isMalayalam ? "നിലവിലെ ജ്യോതിശാസ്ത്ര ഘടകങ്ങൾ" : "Current Astrological Factors"}</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        <FactorCard label={isMalayalam ? "ഗ്രഹ മണിക്കൂർ" : "Planetary Hour"} value={isMalayalam ? planetHour.planetInfo?.name_ml_equivalent : planetHour.planetInfo?.name_en} symbol={planetHour.planetInfo?.symbol} />
        <FactorCard label={isMalayalam ? "ചന്ദ്ര രാശി" : "Moon Sign"} value={isMalayalam ? moonPos.zodiacSign?.name_ml : moonPos.zodiacSign?.name_en} symbol={moonPos.zodiacSign?.symbol} />
        <FactorCard label={isMalayalam ? "നക്ഷത്രം" : "Lunar Mansion"} value={isMalayalam ? moonPos.mansion?.name_ml : moonPos.mansion?.name_en} arabic={moonPos.mansion?.name_ar} />
        <FactorCard label={isMalayalam ? "മൂലകം" : "Element"} value={moonPos.zodiacSign?.element} />
        <FactorCard label={isMalayalam ? "ദിവസ ഭരണാധികാരി" : "Day Ruler"} value={isMalayalam ? PLANET_INFO[dayInfo.ruler]?.name_ml_equivalent : PLANET_INFO[dayInfo.ruler]?.name_en} symbol={PLANET_INFO[dayInfo.ruler]?.symbol} />
      </div>
    </div>
  );
}

function FactorCard({ label, value, symbol, arabic }) {
  return (
    <div className="p-4 rounded-lg" style={{ background: "rgba(0,0,0,0.20)" }}>
      <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>{label}</p>
      {arabic ? (
        <>
          <p className="font-amiri text-2xl font-bold text-right mb-1" style={{ color: G.text }} dir="rtl">{arabic}</p>
          <p className="font-malayalam-sm font-bold text-white text-center">{value}</p>
        </>
      ) : (
        <div className="flex items-center gap-2">
          {symbol && <span className="text-xl">{symbol}</span>}
          <p className="font-malayalam-md font-bold text-white">{value}</p>
        </div>
      )}
    </div>
  );
}

function CategoryGrid({ categoryTimings, isMalayalam }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {categoryTimings.map((cat) => (
        <CategoryCard key={cat.key} category={cat} isMalayalam={isMalayalam} />
      ))}
    </div>
  );
}

function CategoryCard({ category, isMalayalam }) {
  const { status, rules, icon } = category;
  const [showWhy, setShowWhy] = useState(false);
  const statusConfig = {
    "Sa'd Akbar": { color: G.excellent, border: G.excellentBorder, icon: "🟢", label: isMalayalam ? "മികച്ചത്" : "Excellent" },
    "Sa'd Asghar": { color: G.acceptable, border: G.acceptableBorder, icon: "🟡", label: isMalayalam ? "സ്വീകാര്യം" : "Acceptable" },
    "Neutral": { color: G.acceptable, border: G.acceptableBorder, icon: "🟡", label: isMalayalam ? "സ്വീകാര്യം" : "Acceptable" },
    "Nahs Asghar": { color: G.avoid, border: G.avoidBorder, icon: "🔴", label: isMalayalam ? "ഒഴിവാക്കുക" : "Avoid" },
    "Nahs Akbar": { color: G.avoid, border: G.avoidBorder, icon: "🔴", label: isMalayalam ? "ഒഴിവാക്കുക" : "Avoid" }
  };
  const config = statusConfig[status.level];
  const source = rules.sources?.[0];

  return (
    <div className="p-5 rounded-xl border relative overflow-hidden" style={{ background: config.color, borderColor: config.border }}>
      <div className="absolute top-3 right-3 text-2xl">{config.icon}</div>
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{icon}</span>
          <p className="font-malayalam-md font-bold text-white">{category.category}</p>
        </div>
        <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: config.border }}>{status.level}</p>
      </div>
      <div className="space-y-1 mb-3 text-xs">
        <div className="flex items-center justify-between"><span className="text-white/60">{isMalayalam ? "ഗ്രഹ മണിക്കൂർ:" : "Planet Hour:"}</span><span className="font-bold text-white">{status.currentPlanetHour}</span></div>
        <div className="flex items-center justify-between"><span className="text-white/60">{isMalayalam ? "ചന്ദ്രൻ:" : "Moon Sign:"}</span><span className="font-bold text-white">{status.currentMoonSign}</span></div>
        <div className="flex items-center justify-between"><span className="text-white/60">{isMalayalam ? "നക്ഷത്രം:" : "Mansion:"}</span><span className="font-bold text-white">{status.currentMansion}</span></div>
        <div className="flex items-center justify-between"><span className="text-white/60">{isMalayalam ? "മൂലകം:" : "Element:"}</span><span className="font-bold text-white">{status.currentElement}</span></div>
        <div className="flex items-center justify-between"><span className="text-white/60">{isMalayalam ? "സ്കോർ:" : "Score:"}</span><span className="font-bold" style={{ color: config.border }}>{status.score > 0 ? '+' : ''}{status.score}</span></div>
      </div>
      
      {/* Why? Button */}
      <button
        onClick={() => setShowWhy(!showWhy)}
        className="w-full mt-3 py-2 px-3 rounded-lg border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
        style={{
          background: "rgba(212,175,55,0.10)",
          color: G.text,
          borderColor: G.border
        }}
      >
        {showWhy ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {isMalayalam ? "എന്തുകൊണ്ട്?" : "Why?"}
      </button>

      <AnimatePresence>
        {showWhy && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t space-y-3" style={{ borderColor: config.border }}>
              {/* Source PDF Info */}
              {source && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Book className="w-3 h-3" style={{ color: config.border }} />
                    <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: config.border }}>{isMalayalam ? "സ്രോതസ്സ് PDF" : "Source PDF"}</p>
                  </div>
                  <p className="font-malayalam-sm text-white/80 mb-1">{source.book}</p>
                  <p className="font-inter text-[8px]" style={{ color: G.dim }}>{isMalayalam ? "പേജ്:" : "Page"} {source.page} • {source.author}</p>
                  {source.chapter && (
                    <p className="font-inter text-[8px] mt-1" style={{ color: G.dim }}>{isMalayalam ? "അധ്യായം:" : "Chapter"} {source.chapter}</p>
                  )}
                </div>
              )}

              {/* Rule Text */}
              {rules.ruleText && (
                <div className="p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.25)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Quote className="w-3 h-3" style={{ color: G.text }} />
                    <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.text }}>{isMalayalam ? "നിയമം" : "Rule Text"}</p>
                  </div>
                  <p className="font-malayalam-sm text-white/90 italic">{rules.ruleText}</p>
                </div>
              )}

              {/* PDF-Based Reasoning */}
              <div>
                <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.dim }}>{isMalayalam ? "PDF അടിസ്ഥാനമാക്കിയ തീരുമാനം" : "PDF-Based Reasoning"}</p>
                <div className="space-y-1 text-xs">
                  {status.score >= 2 && (
                    <p className="text-white/70">
                      <span className="text-green-400 font-bold">✓</span> {isMalayalam ? "അനുയോജ്യമായ രാശി/നക്ഷത്രം/ഗ്രഹം" : "Favorable sign/mansion/planet from PDF rules"}
                    </p>
                  )}
                  {status.score <= -2 && (
                    <p className="text-white/70">
                      <span className="text-red-400 font-bold">✗</span> {isMalayalam ? "അനുയോജ്യമല്ലാത്ത രാശി/നക്ഷത്രം/ഗ്രഹം" : "Unfavorable sign/mansion/planet from PDF rules"}
                    </p>
                  )}
                  {status.suitableMansions?.includes(status.currentMansionNum) && (
                    <p className="text-white/70">
                      <span className="text-green-400 font-bold">✓</span> {isMalayalam ? `${status.currentMansion} ഉചിത നക്ഷത്രമാണ്` : `${status.currentMansion} is a suitable mansion per PDF`}
                    </p>
                  )}
                  {status.worstMansions?.includes(status.currentMansionNum) && (
                    <p className="text-white/70">
                      <span className="text-red-400 font-bold">✗</span> {isMalayalam ? `${status.currentMansion} ഒഴിവാക്കേണ്ട നക്ഷത്രമാണ്` : `${status.currentMansion} is a forbidden mansion per PDF`}
                    </p>
                  )}
                  {status.suitablePlanets?.includes(status.currentPlanetHour) && (
                    <p className="text-white/70">
                      <span className="text-green-400 font-bold">✓</span> {isMalayalam ? `${status.currentPlanetHour} ഉചിത ഗ്രഹ മണിക്കൂരാണ്` : `${status.currentPlanetHour} is a favorable planetary hour per PDF`}
                    </p>
                  )}
                  {status.enemyPlanets?.includes(status.currentPlanetHour) && (
                    <p className="text-white/70">
                      <span className="text-red-400 font-bold">✗</span> {isMalayalam ? `${status.currentPlanetHour} ഒഴിവാക്കേണ്ട ഗ്രഹ മണിക്കൂരാണ്` : `${status.currentPlanetHour} is an enemy planetary hour per PDF`}
                    </p>
                  )}
                </div>
              </div>

              {/* Suitable Mansions */}
              {rules.suitableMansions?.length > 0 && (
                <div>
                  <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>{isMalayalam ? "ഉചിത നക്ഷത്രങ്ങൾ:" : "Suitable Mansions (PDF):"}</p>
                  <div className="flex flex-wrap gap-1">
                    {rules.suitableMansions.map((num) => {
                      const m = LUNAR_MANSION_DATA.find(mans => mans.number === num);
                      const isCurrent = num === status.currentMansionNum;
                      return m ? (
                        <span key={num} className={`px-2 py-1 rounded text-[8px] ${isCurrent ? 'font-bold' : ''}`} style={{ 
                          background: isCurrent ? "rgba(34,197,94,0.30)" : "rgba(34,197,94,0.20)", 
                          color: isCurrent ? "#22c55e" : "#22c55e",
                          border: isCurrent ? `1px solid ${G.excellentBorder}` : 'none'
                        }}>
                          {m.number}. {isMalayalam ? m.name_ml : m.name_en}{isCurrent ? ' ✓' : ''}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NextPeriods({ data, isMalayalam }) {
  const { actionTimings } = data;
  
  // Calculate average status across all categories
  const avgScore = actionTimings.reduce((sum, a) => sum + a.status.score, 0) / actionTimings.length;
  const currentStatus = avgScore <= -2 ? 'Nahs Asghar' : avgScore >= 2 ? 'Sa\'d Asghar' : 'Neutral';
  
  // Find next favorable period (score >= 2)
  const nextFavorable = findNextPeriod(actionTimings, 2, isMalayalam);
  // Find next unfavorable period (score <= -2)
  const nextUnfavorable = findNextPeriod(actionTimings, -2, isMalayalam, true);
  
  return (
    <div className="mb-6 grid md:grid-cols-2 gap-4">
      {/* Next Favorable Period */}
      <div className="p-5 rounded-xl border" style={{ background: G.excellent, borderColor: G.excellentBorder }}>
        <div className="flex items-center justify-between mb-3">
          <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "#22c55e" }}>
            {isMalayalam ? "അടുത്ത ഉചിത സമയം" : "Next Favorable Period"}
          </p>
          <span className="text-xl">🟢</span>
        </div>
        {nextFavorable ? (
          <>
            <p className="font-malayalam-lg font-bold text-white mb-1">{nextFavorable.time}</p>
            <p className="font-malayalam-sm text-white/70 mb-2">{nextFavorable.remaining}</p>
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: "#22c55e" }}>{nextFavorable.level}</p>
          </>
        ) : (
          <p className="font-malayalam-sm text-white/60">{isMalayalam ? "ഇന്ന് ഉചിത സമയമില്ല" : "No favorable period today"}</p>
        )}
      </div>

      {/* Next Unfavorable Period */}
      <div className="p-5 rounded-xl border" style={{ background: G.avoid, borderColor: G.avoidBorder }}>
        <div className="flex items-center justify-between mb-3">
          <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: "#ef4444" }}>
            {isMalayalam ? "അടുത്ത അനുചിത സമയം" : "Next Unfavorable Period"}
          </p>
          <span className="text-xl">🔴</span>
        </div>
        {nextUnfavorable ? (
          <>
            <p className="font-malayalam-lg font-bold text-white mb-1">{nextUnfavorable.time}</p>
            <p className="font-malayalam-sm text-white/70 mb-2">{nextUnfavorable.remaining}</p>
            <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: "#ef4444" }}>{nextUnfavorable.level}</p>
          </>
        ) : (
          <p className="font-malayalam-sm text-white/60">{isMalayalam ? "ഇന്ന് അനുചിത സമയമില്ല" : "No unfavorable period today"}</p>
        )}
      </div>
    </div>
  );
}

function findNextPeriod(actionTimings, targetScore, isMalayalam, isUnfavorable = false) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Check remaining hours today
  for (let h = currentHour + 1; h < 24; h++) {
    const futureDate = new Date(now);
    futureDate.setHours(h, 0, 0, 0);
    
    // Recalculate status for this future time
    const moonPos = calculateMoonPosition(futureDate);
    const planetHour = getCurrentPlanetaryHour(futureDate, 6.5, 18.25);
    const dayInfo = DAY_INFO[futureDate.getDay()];
    
    // Check first category as representative
    const firstCategory = actionTimings[0]?.rules;
    if (firstCategory) {
      const futureStatus = determineStatus(firstCategory, moonPos, planetHour, dayInfo);
      
      if (isUnfavorable ? futureStatus.score <= targetScore : futureStatus.score >= targetScore) {
        const minutesUntil = (h - currentHour) * 60 - currentMinute;
        const hoursUntil = Math.floor(minutesUntil / 60);
        const minsUntil = minutesUntil % 60;
        
        return {
          time: formatTime(h, 0),
          remaining: isMalayalam 
            ? `${hoursUntil}മണിക്കൂർ ${minsUntil}മിനിറ്റ് കഴിഞ്ഞ്`
            : `${hoursUntil}h ${minsUntil}m remaining`,
          level: futureStatus.level
        };
      }
    }
  }
  
  // Check tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  for (let h = 0; h < 24; h++) {
    const futureDate = new Date(tomorrow);
    futureDate.setHours(h, 0, 0, 0);
    
    const moonPos = calculateMoonPosition(futureDate);
    const planetHour = getCurrentPlanetaryHour(futureDate, 6.5, 18.25);
    const dayInfo = DAY_INFO[futureDate.getDay()];
    
    const firstCategory = actionTimings[0]?.rules;
    if (firstCategory) {
      const futureStatus = determineStatus(firstCategory, moonPos, planetHour, dayInfo);
      
      if (isUnfavorable ? futureStatus.score <= targetScore : futureStatus.score >= targetScore) {
        const isTomorrow = true;
        return {
          time: formatTime(h, 0),
          remaining: isMalayalam 
            ? `${isTomorrow ? 'നാളെ' : 'ഇന്ന്'} ${formatTime(h, 0)}`
            : `${isTomorrow ? 'Tomorrow' : 'Today'} ${formatTime(h, 0)}`,
          level: futureStatus.level
        };
      }
    }
  }
  
  return null;
}

function formatTime(hour, minute) {
  const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour >= 12 && hour < 24 ? 'PM' : 'AM';
  return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

function SourceLegend({ isMalayalam }) {
  return (
    <div className="p-4 rounded-xl border" style={{ background: G.bg, borderColor: G.faint }}>
      <div className="flex items-center gap-2 mb-3">
        <Book className="w-4 h-4" style={{ color: G.dim }} />
        <p className="font-inter text-[9px] uppercase tracking-widest" style={{ color: G.dim }}>{isMalayalam ? "സ്രോതസ്സുകൾ" : "Knowledge Sources"}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-3 text-xs">
        <div className="flex items-start gap-2">
          <CheckCircle className="w-3 h-3 mt-0.5" style={{ color: "#22c55e" }} />
          <div>
            <p className="font-malayalam-sm text-white/80">Havâss'ın Derinlikleri — Bülent Kısa (Pages 1-100)</p>
            <p className="font-inter text-[8px]" style={{ color: G.dim }}>350 rules • Days, Hours, Mansions, Planets</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle className="w-3 h-3 mt-0.5" style={{ color: "#22c55e" }} />
          <div>
            <p className="font-malayalam-sm text-white/80">تدریس نجوم احکامی — Ustad Taha (Pages 1-80)</p>
            <p className="font-inter text-[8px]" style={{ color: G.dim }}>59 rules • Islamic Judicial Astrology</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function determineStatus(rules, moonPos, planetHour, dayInfo) {
  const sign = moonPos.zodiacSign?.name_en;
  const mansion = moonPos.mansion?.name_en;
  const planet = planetHour.planet;
  const dayRuler = dayInfo.ruler;
  const mansionNum = LUNAR_MANSION_DATA.find(m => m.name_en === mansion)?.number;
  const suitableMansions = rules.suitableMansions || [];
  const worstMansions = rules.worstMansions || [];
  const suitablePlanets = rules.suitablePlanets || [];
  const enemyPlanets = rules.enemyPlanets || [];

  let score = 0;
  if (['Taurus', 'Cancer', 'Sagittarius', 'Pisces', 'Leo'].includes(sign)) score += 2;
  if (['Scorpio', 'Capricorn', 'Aquarius'].includes(sign)) score -= 2;
  if (suitableMansions.includes(mansionNum)) score += 2;
  if (worstMansions.includes(mansionNum)) score -= 2;
  if (suitablePlanets.includes(planet)) score += 1;
  if (enemyPlanets.includes(planet)) score -= 1;
  if (suitablePlanets.includes(dayRuler.toUpperCase())) score += 1;
  if (enemyPlanets.includes(dayRuler.toUpperCase())) score -= 1;

  let level = 'Neutral';
  if (score >= 4) level = 'Sa\'d Akbar';
  else if (score >= 2) level = 'Sa\'d Asghar';
  else if (score <= -4) level = 'Nahs Akbar';
  else if (score <= -2) level = 'Nahs Asghar';

  return { 
    level, 
    score, 
    currentPlanetHour: planet, 
    currentMoonSign: sign, 
    currentMansion: mansion, 
    currentMansionNum: mansionNum,
    currentElement: moonPos.zodiacSign?.element, 
    dayRuler,
    suitableMansions,
    worstMansions,
    suitablePlanets,
    enemyPlanets
  };
}

function getCategoryIcon(key) {
  const icons = { marriage: '💑', business: '💼', travel: '✈️', healing: '🏥', job: '🎯', love: '💕', spiritual: '📿', study: '📚' };
  return icons[key] || '⭐';
}