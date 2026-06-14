// ═══════════════════════════════════════════════════════════════
// KARMA TIMING ADVISOR — PDF KNOWLEDGE BASE RULES ONLY
// Evaluates current moment for specific action categories
// Astro Clock module only — completely isolated
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar, Book, ChevronDown, ChevronUp } from "lucide-react";
import { calculateMoonPosition } from "@/lib/astroClockMoonPosition.js";
import { getCurrentPlanetaryHour, PLANET_INFO, DAY_INFO } from "@/lib/astroClockLiveEngine.js";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext.jsx";

const ACTION_CATEGORIES = [
  { id: "marriage", name: "Marriage", arabic: "النكاح", icon: "💍" },
  { id: "love", name: "Love / Muhabbah", arabic: "المحبة", icon: "💕" },
  { id: "separation", name: "Separation / Tafriq", arabic: "التفريق", icon: "💔" },
  { id: "rizq", name: "Rizq", arabic: "الرزق", icon: "💰" },
  { id: "healing", name: "Healing", arabic: "الشفاء", icon: "🌿" },
  { id: "spiritual", name: "Spiritual Work", arabic: "العمل الروحي", icon: "📿" },
  { id: "vefk", name: "Vefk Creation", arabic: "وفق", icon: "📜" },
  { id: "talisman", name: "Talisman Creation", arabic: "طلسم", icon: "🔮" },
  { id: "hadim", name: "Hadim Work", arabic: "خادم", icon: "👁" },
  { id: "ism", name: "Ism Work", arabic: "اسم", icon: "✍" },
  { id: "travel", name: "Travel", arabic: "السفر", icon: "✈" },
  { id: "business", name: "Business", arabic: "التجارة", icon: "💼" },
  { id: "construction", name: "Construction", arabic: "البناء", icon: "🏗" },
  { id: "purchase", name: "Purchase", arabic: "الشراء", icon: "🛒" },
  { id: "conflict", name: "Conflict", arabic: "النزاع", icon: "⚔" }
];

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  faint: "rgba(212,175,55,0.22)",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
  suitable: "rgba(34,197,94,0.15)",
  suitableBorder: "rgba(34,197,94,0.60)",
  notSuitable: "rgba(239,68,68,0.15)",
  notSuitableBorder: "rgba(239,68,68,0.60)",
  wait: "rgba(251,191,36,0.15)",
  waitBorder: "rgba(251,191,36,0.60)"
};

export default function KarmaTimingAdvisor() {
  const { isMalayalam } = useAstroClockLanguage();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedRule, setExpandedRule] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      evaluateCategory(selectedCategory);
      const interval = setInterval(() => evaluateCategory(selectedCategory), 60000);
      return () => clearInterval(interval);
    }
  }, [selectedCategory]);

  function evaluateCategory(categoryId) {
    setLoading(true);
    const now = new Date();
    const moonPos = calculateMoonPosition(now);
    const planetHour = getCurrentPlanetaryHour(now, 6.5, 18.25);
    const dayIndex = now.getDay();
    const dayInfo = DAY_INFO[dayIndex];

    const rules = getPDFRulesForCategory(categoryId);
    const result = evaluateRules(rules, moonPos, planetHour, dayInfo);

    setEvaluation({
      category: categoryId,
      timestamp: now,
      result,
      moonPos,
      planetHour,
      dayInfo,
      rules
    });
    setLoading(false);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-6 relative overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(10,22,56,0.99) 0%, rgba(5,12,36,0.99) 100%)", borderColor: G.borderHi, boxShadow: `0 0 50px ${G.glow}, 0 4px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.10)` }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)` }} />

      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-7 h-7" style={{ color: G.text }} />
        <div>
          <h2 className="font-malayalam-lg uppercase tracking-widest" style={{ color: G.text }}>{isMalayalam ? "കർമ്മ ടൈമിംഗ് അഡ്വൈസർ" : "Karma Timing Advisor"}</h2>
          <p className="font-malayalam-sm" style={{ color: G.dim }}>{isMalayalam ? "PDF നിയമങ്ങൾ മാത്രം" : "PDF Knowledge Base Rules Only"}</p>
        </div>
      </div>

      {/* Category Selection */}
      <div className="mb-6">
        <p className="font-inter text-[10px] uppercase tracking-widest mb-3" style={{ color: G.dim }}>{isMalayalam ? "പ്രവർത്തന വിഭാഗം തിരഞ്ഞെടുക്കുക" : "Select Action Category"}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {ACTION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-3 rounded-lg border transition-all text-left ${selectedCategory === cat.id ? 'selected' : ''}`}
              style={{
                background: selectedCategory === cat.id ? G.bgHi : G.bg,
                borderColor: selectedCategory === cat.id ? G.text : G.faint
              }}
            >
              <span className="text-xl mb-1 block">{cat.icon}</span>
              <p className="font-amiri text-sm font-bold" style={{ color: G.text }}>{cat.arabic}</p>
              <p className="font-malayalam-sm text-white/70 truncate">{isMalayalam ? cat.name : cat.name}</p>
            </button>
          ))}
        </div>
      </div>

      {loading && !evaluation && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: G.text, borderTopColor: "transparent" }} />
          <p className="mt-4 font-inter text-sm" style={{ color: G.dim }}>{isMalayalam ? "വിലയിരുത്തുന്നു..." : "Evaluating..."}</p>
        </div>
      )}

      {evaluation && !loading && (
        <>
          <StatusDisplay evaluation={evaluation} isMalayalam={isMalayalam} />
          <CurrentFactors evaluation={evaluation} isMalayalam={isMalayalam} />
          <PDFRuleDisplay evaluation={evaluation} expanded={expandedRule} onToggle={() => setExpandedRule(!expandedRule)} isMalayalam={isMalayalam} />
          <NextSuitableTime evaluation={evaluation} isMalayalam={isMalayalam} />
        </>
      )}
    </motion.div>
  );
}

function StatusDisplay({ evaluation, isMalayalam }) {
  const { result } = evaluation;
  
  let statusConfig;
  if (result.suitable) {
    statusConfig = { bg: G.suitable, border: G.suitableBorder, icon: CheckCircle, text: "#22c55e", label: isMalayalam ? "ഇപ്പോൾ അനുയോജ്യം" : "Suitable Now" };
  } else if (result.wait) {
    statusConfig = { bg: G.wait, border: G.waitBorder, icon: AlertCircle, text: "#fbbf24", label: isMalayalam ? "കാത്തിരിക്കുക" : "Wait" };
  } else {
    statusConfig = { bg: G.notSuitable, border: G.notSuitableBorder, icon: XCircle, text: "#ef4444", label: isMalayalam ? "ഇപ്പോൾ അനുയോജ്യമല്ല" : "Not Suitable Now" };
  }

  const StatusIcon = statusConfig.icon;

  return (
    <div className="mb-6 p-6 rounded-xl border text-center" style={{ background: statusConfig.bg, borderColor: statusConfig.border }}>
      <StatusIcon className="w-12 h-12 mx-auto mb-3" style={{ color: statusConfig.text }} />
      <p className="font-inter text-[10px] uppercase tracking-widest mb-2" style={{ color: statusConfig.text }}>{statusConfig.label}</p>
      <p className="font-malayalam-lg font-bold text-white">{evaluation.rules.action}</p>
    </div>
  );
}

function CurrentFactors({ evaluation, isMalayalam }) {
  const { moonPos, planetHour, dayInfo } = evaluation;

  return (
    <div className="mb-6 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      <FactorCard label={isMalayalam ? "നക്ഷത്രം" : "Lunar Mansion"} value={isMalayalam ? moonPos.mansion?.name_ml : moonPos.mansion?.name_en} arabic={moonPos.mansion?.name_ar} icon="🌙" />
      <FactorCard label={isMalayalam ? "രാശി" : "Zodiac Sign"} value={isMalayalam ? moonPos.zodiacSign?.name_ml : moonPos.zodiacSign?.name_en} symbol={moonPos.zodiacSign?.symbol} icon="⭐" />
      <FactorCard label={isMalayalam ? "മൂലകം" : "Element"} value={moonPos.zodiacSign?.element} icon="🔥" />
      <FactorCard label={isMalayalam ? "ഗ്രഹ മണിക്കൂർ" : "Planetary Hour"} value={isMalayalam ? planetHour.planetInfo?.name_ml_equivalent : planetHour.planetInfo?.name_en} symbol={planetHour.planetInfo?.symbol} icon="🪐" />
      <FactorCard label={isMalayalam ? "ആഴ്ച" : "Day Ruler"} value={isMalayalam ? dayInfo.ruler_ml : dayInfo.ruler_en} symbol={dayInfo.symbol} icon="📅" />
      <FactorCard label={isMalayalam ? "മാനസികാവസ്ഥ" : "Moon Phase"} value={moonPos.phaseDescription} icon="🌓" />
    </div>
  );
}

function FactorCard({ label, value, arabic, symbol, icon }) {
  return (
    <div className="p-4 rounded-lg border" style={{ background: G.bg, borderColor: G.faint }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: G.dim }}>{label}</p>
      </div>
      {arabic ? (
        <>
          <p className="font-amiri text-2xl font-bold text-right mb-1" style={{ color: G.text }}>{arabic}</p>
          <p className="font-malayalam-sm font-bold text-white text-center">{value}</p>
        </>
      ) : (
        <div className="flex items-center gap-2">
          {symbol && <span className="text-lg">{symbol}</span>}
          <p className="font-malayalam-md font-bold text-white">{value}</p>
        </div>
      )}
    </div>
  );
}

function PDFRuleDisplay({ evaluation, expanded, onToggle, isMalayalam }) {
  const { rules, result } = evaluation;

  return (
    <div className="mb-6 border rounded-xl" style={{ borderColor: G.faint }}>
      <button onClick={onToggle} className="w-full p-4 flex items-center justify-between gap-3" style={{ color: G.dim }}>
        <div className="flex items-center gap-3">
          <Book className="w-5 h-5" />
          <span className="font-inter text-[9px] uppercase tracking-widest">{isMalayalam ? "PDF നിയമം" : "PDF Rule Applied"}</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-4 border-t space-y-3" style={{ borderColor: G.faint }}>
              <RuleItem label={isMalayalam ? "ഉചിത ദിവസങ്ങൾ" : "Suitable Days"} value={rules.bestDays?.join(", ") || isMalayalam ? "ഒന്നുമില്ല" : "None"} />
              <RuleItem label={isMalayalam ? "ഉചിത ഗ്രഹങ്ങൾ" : "Suitable Planets"} value={rules.suitablePlanets?.join(", ") || isMalayalam ? "ഒന്നുമില്ല" : "None"} />
              <RuleItem label={isMalayalam ? "ഉചിത നക്ഷത്രങ്ങൾ" : "Suitable Mansions"} value={rules.suitableMansions?.join(", ") || isMalayalam ? "ഒന്നുമില്ല" : "None"} />
              <RuleItem label={isMalayalam ? "ഉചിത രാശികൾ" : "Suitable Signs"} value={rules.suitableSigns?.join(", ") || isMalayalam ? "ഒന്നുമില്ല" : "None"} />
              <RuleItem label={isMalayalam ? "ഉചിത മൂലകം" : "Suitable Element"} value={rules.suitableElement || isMalayalam ? "ഒന്നുമില്ല" : "None"} />
              <RuleItem label={isMalayalam ? "ഒഴിവാക്കേണ്ടവ" : "Avoid"} value={rules.avoid?.join(", ") || isMalayalam ? "ഒന്നുമില്ല" : "None"} />
              <div className="p-3 rounded-lg mt-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                <p className="font-inter text-[8px] uppercase tracking-widest mb-2" style={{ color: G.text }}>{isMalayalam ? "സ്രോതസ്സ്" : "Source"}</p>
                <p className="font-malayalam-sm text-white/70">{rules.source}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RuleItem({ label, value }) {
  return (
    <div className="flex items-start gap-3">
      <p className="font-inter text-[8px] uppercase tracking-widest w-32 flex-shrink-0" style={{ color: G.dim }}>{label}</p>
      <p className="font-malayalam-sm text-white/80 flex-1">{value}</p>
    </div>
  );
}

function NextSuitableTime({ evaluation, isMalayalam }) {
  const { result } = evaluation;

  if (result.suitable) {
    return (
      <div className="p-4 rounded-xl border text-center" style={{ background: G.suitable, borderColor: G.suitableBorder }}>
        <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: "#22c55e" }} />
        <p className="font-malayalam-md font-bold text-white">{isMalayalam ? "ഈ സമയം അനുയോജ്യമാണ്" : "This moment is suitable"}</p>
        <p className="font-inter text-[9px] mt-1" style={{ color: "#22c55e" }}>{isMalayalam ? "ഇപ്പോൾ ആരംഭിക്കാം" : "You may proceed now"}</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border" style={{ background: result.wait ? G.wait : G.notSuitable, borderColor: result.wait ? G.waitBorder : G.notSuitableBorder }}>
      <div className="flex items-center gap-3 mb-3">
        {result.wait ? <AlertCircle className="w-6 h-6" style={{ color: "#fbbf24" }} /> : <XCircle className="w-6 h-6" style={{ color: "#ef4444" }} />}
        <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: result.wait ? "#fbbf24" : "#ef4444" }}>{isMalayalam ? "അടുത്ത ഉചിത സമയം" : "Next Suitable Time"}</p>
      </div>
      {result.nextSuitable ? (
        <>
          <p className="font-malayalam-lg font-bold text-white mb-1">{result.nextSuitable.time}</p>
          <p className="font-inter text-sm" style={{ color: result.wait ? "#fbbf24" : "#ef4444" }}>{isMalayalam ? "കൗണ്ട്ഡൗൺ:" : "Countdown:"} {result.nextSuitable.countdown}</p>
        </>
      ) : (
        <p className="font-malayalam-sm text-white/60">{isMalayalam ? "ഇന്ന് ഉചിത സമയമില്ല" : "No suitable time today"}</p>
      )}
    </div>
  );
}

function getPDFRulesForCategory(categoryId) {
  const rules = {
    marriage: {
      action: "Marriage / Wedding",
      bestDays: ["Monday", "Wednesday", "Thursday", "Friday"],
      suitablePlanets: ["venus", "jupiter", "moon"],
      suitableMansions: [2, 3, 6, 7, 11, 15, 16, 20, 24, 26],
      suitableSigns: ["Taurus", "Cancer", "Pisces", "Sagittarius"],
      suitableElement: "Water",
      avoid: ["Saturday", "Tuesday", "Mansions 1, 4, 5, 8, 9, 12, 13, 14, 21, 22, 25, 27"],
      source: "PDF2 p.64-74, Havâss'ın Derinlikleri p.50-51"
    },
    love: {
      action: "Love / Muhabbah",
      bestDays: ["Friday", "Monday"],
      suitablePlanets: ["venus", "moon"],
      suitableMansions: [2, 6, 7, 11, 15, 20, 24],
      suitableSigns: ["Taurus", "Cancer", "Pisces", "Libra"],
      suitableElement: "Water",
      avoid: ["Saturday", "Mars hours", "Mansions 4, 5, 8, 9, 12, 13"],
      source: "PDF2 p.64-74, Taha Manuscript"
    },
    separation: {
      action: "Separation / Tafriq",
      bestDays: ["Tuesday", "Saturday"],
      suitablePlanets: ["mars", "saturn"],
      suitableMansions: [4, 5, 8, 9, 12, 13, 21, 22, 25, 27],
      suitableSigns: ["Scorpio", "Capricorn", "Aquarius"],
      suitableElement: "Earth",
      avoid: ["Friday", "Venus hours", "Mansions 2, 3, 6, 7, 11"],
      source: "PDF2 p.64-74, Havâss'ın Derinlikleri"
    },
    rizq: {
      action: "Rizq / Provision",
      bestDays: ["Thursday", "Wednesday"],
      suitablePlanets: ["jupiter", "mercury"],
      suitableMansions: [3, 6, 10, 11, 15, 16, 20, 24],
      suitableSigns: ["Sagittarius", "Pisces", "Gemini", "Virgo"],
      suitableElement: "Fire",
      avoid: ["Saturday", "Saturn hours"],
      source: "PDF2 p.64-74, Taha p.120-125"
    },
    healing: {
      action: "Healing / Cure",
      bestDays: ["Wednesday", "Thursday", "Sunday"],
      suitablePlanets: ["mercury", "jupiter", "sun"],
      suitableMansions: [3, 6, 7, 11, 15, 16, 20],
      suitableSigns: ["Gemini", "Virgo", "Sagittarius", "Pisces"],
      suitableElement: "Air",
      avoid: ["Tuesday", "Mars hours", "Mansions 4, 5, 8, 9"],
      source: "PDF2 p.64-74, Havâss'ın Derinlikleri p.88-92"
    },
    spiritual: {
      action: "Spiritual Work",
      bestDays: ["Friday", "Monday", "Thursday"],
      suitablePlanets: ["jupiter", "moon", "venus"],
      suitableMansions: [2, 3, 6, 7, 11, 15, 16, 20, 24, 26, 28],
      suitableSigns: ["Cancer", "Pisces", "Sagittarius", "Taurus"],
      suitableElement: "Water",
      avoid: ["Saturday", "Tuesday", "Mansions 1, 4, 5, 8, 9, 12, 13, 14"],
      source: "PDF2 p.64-74, Taha Manuscript p.200-210"
    },
    vefk: {
      action: "Vefk Creation",
      bestDays: ["Sunday", "Thursday", "Wednesday"],
      suitablePlanets: ["sun", "jupiter", "mercury"],
      suitableMansions: [1, 3, 6, 10, 11, 15, 16, 20, 24, 28],
      suitableSigns: ["Leo", "Sagittarius", "Pisces", "Gemini", "Virgo"],
      suitableElement: "Fire",
      avoid: ["Saturday", "Tuesday", "Mansions 4, 5, 8, 9, 12, 13, 14, 21, 22"],
      source: "PDF2 p.64-74, Havâss'ın Derinlikleri p.150-160"
    },
    talisman: {
      action: "Talisman Creation",
      bestDays: ["Saturday", "Tuesday", "Thursday"],
      suitablePlanets: ["saturn", "mars", "jupiter"],
      suitableMansions: [4, 5, 8, 9, 12, 13, 21, 22, 25, 27],
      suitableSigns: ["Capricorn", "Aquarius", "Scorpio"],
      suitableElement: "Earth",
      avoid: ["Friday", "Venus hours", "Mansions 2, 3, 6, 7, 11"],
      source: "PDF2 p.64-74, Taha p.180-190"
    },
    hadim: {
      action: "Hadim Work",
      bestDays: ["Tuesday", "Saturday", "Thursday"],
      suitablePlanets: ["mars", "saturn", "jupiter"],
      suitableMansions: [4, 5, 8, 9, 12, 13, 21, 22, 25, 27],
      suitableSigns: ["Scorpio", "Capricorn", "Aquarius"],
      suitableElement: "Earth",
      avoid: ["Friday", "Monday", "Venus/Moon hours"],
      source: "PDF2 p.64-74, Havâss'ın Derinlikleri p.200-210"
    },
    ism: {
      action: "Ism Work (Divine Names)",
      bestDays: ["Friday", "Thursday", "Sunday"],
      suitablePlanets: ["jupiter", "sun", "venus"],
      suitableMansions: [2, 3, 6, 7, 11, 15, 16, 20, 24, 26, 28],
      suitableSigns: ["Sagittarius", "Pisces", "Leo", "Taurus"],
      suitableElement: "Fire",
      avoid: ["Saturday", "Tuesday", "Mansions 1, 4, 5, 8, 9, 12, 13, 14"],
      source: "PDF2 p.64-74, Taha p.220-230"
    },
    travel: {
      action: "Travel",
      bestDays: ["Wednesday", "Thursday", "Monday"],
      suitablePlanets: ["mercury", "jupiter", "moon"],
      suitableMansions: [3, 6, 11, 15, 16, 20, 24],
      suitableSigns: ["Gemini", "Virgo", "Sagittarius", "Pisces"],
      suitableElement: "Air",
      avoid: ["Saturday", "Tuesday", "Mansions 4, 5, 8, 9, 12, 13"],
      source: "PDF2 p.64-74, Havâss'ın Derinlikleri p.100-105"
    },
    business: {
      action: "Business / Trade",
      bestDays: ["Wednesday", "Thursday", "Friday"],
      suitablePlanets: ["mercury", "jupiter", "venus"],
      suitableMansions: [3, 6, 10, 11, 15, 16, 20, 24],
      suitableSigns: ["Gemini", "Virgo", "Sagittarius", "Pisces", "Taurus"],
      suitableElement: "Air",
      avoid: ["Saturday", "Tuesday", "Mansions 4, 5, 8, 9, 12, 13"],
      source: "PDF2 p.64-74, Taha p.140-150"
    },
    construction: {
      action: "Construction / Building",
      bestDays: ["Thursday", "Tuesday", "Sunday"],
      suitablePlanets: ["jupiter", "mars", "sun"],
      suitableMansions: [3, 6, 10, 11, 15, 16, 20],
      suitableSigns: ["Sagittarius", "Pisces", "Leo", "Aries"],
      suitableElement: "Fire",
      avoid: ["Saturday", "Mansions 4, 5, 8, 9, 12, 13, 14"],
      source: "PDF2 p.64-74, Havâss'ın Derinlikleri p.170-180"
    },
    purchase: {
      action: "Purchase / Buying",
      bestDays: ["Wednesday", "Thursday", "Friday"],
      suitablePlanets: ["mercury", "jupiter", "venus"],
      suitableMansions: [3, 6, 11, 15, 16, 20, 24],
      suitableSigns: ["Gemini", "Virgo", "Sagittarius", "Pisces", "Taurus"],
      suitableElement: "Air",
      avoid: ["Saturday", "Tuesday", "Mansions 4, 5, 8, 9, 12, 13"],
      source: "PDF2 p.64-74, Taha p.140-150"
    },
    conflict: {
      action: "Conflict / Confrontation",
      bestDays: ["Tuesday", "Saturday"],
      suitablePlanets: ["mars", "saturn"],
      suitableMansions: [4, 5, 8, 9, 12, 13, 21, 22, 25, 27],
      suitableSigns: ["Scorpio", "Capricorn", "Aquarius", "Aries"],
      suitableElement: "Earth",
      avoid: ["Friday", "Monday", "Venus/Moon hours"],
      source: "PDF2 p.64-74, Havâss'ın Derinlikleri p.190-200"
    }
  };

  return rules[categoryId] || rules.spiritual;
}

function evaluateRules(rules, moonPos, planetHour, dayInfo) {
  let score = 0;
  let totalChecks = 0;

  // Check day ruler
  totalChecks++;
  if (rules.bestDays?.includes(dayInfo.ruler_en)) score++;

  // Check planetary hour
  totalChecks++;
  if (rules.suitablePlanets?.includes(planetHour.planet)) score++;

  // Check lunar mansion
  totalChecks++;
  if (rules.suitableMansions?.includes(moonPos.mansion?.number)) score++;

  // Check zodiac sign
  totalChecks++;
  if (rules.suitableSigns?.includes(moonPos.zodiacSign?.name_en)) score++;

  // Check element
  totalChecks++;
  if (rules.suitableElement === moonPos.zodiacSign?.element) score++;

  // Check avoid rules
  let shouldAvoid = false;
  if (rules.avoid) {
    if (rules.avoid.some(a => a.includes(dayInfo.ruler_en))) shouldAvoid = true;
    if (rules.avoid.some(a => a.includes(planetHour.planetInfo?.name_en))) shouldAvoid = true;
    if (rules.avoid.some(a => a.includes(moonPos.mansion?.number.toString()))) shouldAvoid = true;
  }

  const ratio = score / totalChecks;
  let suitable = false;
  let wait = false;

  if (shouldAvoid) {
    suitable = false;
    wait = false;
  } else if (ratio >= 0.6) {
    suitable = true;
  } else if (ratio >= 0.4) {
    wait = true;
  }

  return {
    suitable,
    wait,
    score,
    totalChecks,
    ratio,
    nextSuitable: calculateNextSuitable(rules)
  };
}

function calculateNextSuitable(rules) {
  const now = new Date();
  for (let h = now.getHours() + 1; h < 24; h++) {
    const future = new Date(now);
    future.setHours(h, 0, 0, 0);
    
    const moonPos = calculateMoonPosition(future);
    const planetHour = getCurrentPlanetaryHour(future, 6.5, 18.25);
    const dayIndex = future.getDay();
    const dayInfo = DAY_INFO[dayIndex];
    
    const result = evaluateRules(rules, moonPos, planetHour, dayInfo);
    if (result.suitable) {
      return {
        time: formatTime(future),
        countdown: formatCountdown(future, now)
      };
    }
  }
  return null;
}

function formatTime(date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const hours = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h >= 12 && h < 24 ? 'PM' : 'AM';
  return `${hours}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function formatCountdown(future, now) {
  const minutes = Math.floor((future.getTime() - now.getTime()) / 60000);
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}