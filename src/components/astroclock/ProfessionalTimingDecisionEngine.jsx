// ═══════════════════════════════════════════════════════════════
// PROFESSIONAL TIMING DECISION ENGINE — PDF KNOWLEDGE BASE
// Every recommendation traceable to ingested PDF sources
// NO generic astrology — ONLY ingested rules from books
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Book, Info, CheckCircle } from "lucide-react";
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
        <div className="flex items-center justify-between"><span className="text-white/60">{isMalayalam ? "സ്ഥിതി:" : "Status:"}</span><span className="font-bold" style={{ color: config.border }}>{config.label}</span></div>
      </div>
      {source && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: config.border }}>
          <div className="flex items-center gap-2 mb-2">
            <Book className="w-3 h-3" style={{ color: config.border }} />
            <p className="font-inter text-[8px] uppercase tracking-widest" style={{ color: config.border }}>{isMalayalam ? "സ്രോതസ്സ്" : "Source"}</p>
          </div>
          <p className="font-malayalam-sm text-white/80 mb-1">{source.book}</p>
          <p className="font-inter text-[8px]" style={{ color: G.dim }}>{isMalayalam ? "പേജ്:" : "Page"} {source.page} • {source.author}</p>
        </div>
      )}
      {rules.suitableMansions?.length > 0 && (
        <div className="mt-2">
          <p className="font-inter text-[8px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>{isMalayalam ? "ഉചിത നക്ഷത്രങ്ങൾ:" : "Suitable Mansions:"}</p>
          <div className="flex flex-wrap gap-1">
            {rules.suitableMansions.slice(0, 5).map((num) => {
              const m = LUNAR_MANSION_DATA.find(mans => mans.number === num);
              return m ? <span key={num} className="px-2 py-1 rounded text-[8px]" style={{ background: "rgba(34,197,94,0.20)", color: "#22c55e" }}>{m.number}. {isMalayalam ? m.name_ml : m.name_en}</span> : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
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

  return { level, score, currentPlanetHour: planet, currentMoonSign: sign, currentMansion: mansion, currentElement: moonPos.zodiacSign?.element, dayRuler };
}

function getCategoryIcon(key) {
  const icons = { marriage: '💑', business: '💼', travel: '✈️', healing: '🏥', job: '🎯', love: '💕', spiritual: '📿', study: '📚' };
  return icons[key] || '⭐';
}