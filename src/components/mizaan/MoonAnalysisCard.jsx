// ═══════════════════════════════════════════════════════════════
// MOON ANALYSIS CARD — User-controlled, 100% optional
// ═══════════════════════════════════════════════════════════════
// By default, the Ritual Timing Engine IGNORES Moon entirely.
// Moon analysis starts ONLY if the user explicitly selects one of:
//
//   ○ Show Current Moon Status  — display live Moon data + check
//                                  against manuscript rules (if any)
//
//   ○ Plan Ritual by Moon       — user picks desired Mansion/Zodiac/
//                                  Phase → engine finds when Moon
//                                  enters that condition → evaluates
//                                  ALL manuscript conditions at that
//                                  future moment
//
// Moon alone NEVER approves a ritual. A future time is valid ONLY
// when ALL required manuscript conditions are simultaneously satisfied.
// ═══════════════════════════════════════════════════════════════
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, ChevronDown, Check, X, Minus, CalendarClock, Search, AlertTriangle, Sparkles, BookOpen } from "lucide-react";
import {
  analyzeMoonCompatibility,
  planRitualByMoon,
  MOON_MANSIONS,
  ZODIAC_SIGNS,
} from "../../lib/ritualTimingEngineV3";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
  pass: "#4ADE80",
  fail: "#F87171",
  neutral: "rgba(255,255,255,0.40)",
  blue: "rgba(96,165,250,0.90)",
  blueBorder: "rgba(96,165,250,0.35)",
};

// ── Bilingual labels ──
const L = (lang) => ({
  title: lang === "ml" ? "ചന്ദ്ര പ്ലാനിംഗ് (ഐച്ഛികം)" : "Moon Planning (Optional)",
  subtitle: lang === "ml" ? "സ്ഥിരസ്ഥിതി: ചന്ദ്രനെ അവഗണിക്കുക" : "Default: Moon is ignored",
  defaultMsg: lang === "ml"
    ? "സ്ഥിരസ്ഥിതിയായി ആചാര സമയ യന്ത്രം ചന്ദ്രനെ അവഗണിക്കുന്നു. താഴെയുള്ള ഓപ്ഷനുകളിൽ ഒന്ന് തിരഞ്ഞെടുക്കുക."
    : "By default, the Ritual Timing Engine ignores Moon. Select an option below to begin.",
  opt1: lang === "ml" ? "നിലവിലെ ചന്ദ്ര നില കാണിക്കുക" : "Show Current Moon Status",
  opt2: lang === "ml" ? "ചന്ദ്രനെ അടിസ്ഥാനമാക്കി കർമ്മം ആസൂത്രണം ചെയ്യുക" : "Plan Ritual by Moon",
  // Option 1 labels
  currentMoon: lang === "ml" ? "നിലവിലെ ചന്ദ്രൻ" : "Current Moon",
  phase: lang === "ml" ? "ചന്ദ്ര ദശ" : "Moon Phase",
  waxWane: lang === "ml" ? "വർദ്ധമാനം / ക്ഷയം" : "Waxing / Waning",
  zodiacSign: lang === "ml" ? "രാശി" : "Zodiac Sign",
  mansion: lang === "ml" ? "ചാന്ദ്ര മാളിക (മൻസിൽ)" : "Moon Mansion (Manzil)",
  illumination: lang === "ml" ? "പ്രകാശിതർത്ഥം" : "Illumination",
  moonAge: lang === "ml" ? "ചന്ദ്രന്റെ പ്രായം" : "Age of Moon",
  waxing: lang === "ml" ? "വർദ്ധമാനം" : "Waxing",
  waning: lang === "ml" ? "ക്ഷയം" : "Waning",
  day: lang === "ml" ? "ദിവസം" : "Day",
  noRuleTitle: lang === "ml" ? "കൈയെഴുത്തുപ്രതി നിയമം ഇല്ല" : "No Moon Rule Required",
  noRuleMsg: lang === "ml"
    ? "നിലവിലെ ചന്ദ്ര വിവരം കൂടുതൽ അറിവിനായി മാത്രം കാണിക്കുന്നു. കൈയെഴുത്തുപ്രതി പ്രകാരം ഈ കർമ്മത്തിന് ചന്ദ്ര വ്യവസ്ഥകൾ ആവശ്യമില്ല."
    : "Current Moon information is shown for reference only. This ritual does not require Moon conditions according to the manuscript.",
  msRulesTitle: lang === "ml" ? "കൈയെഴുത്തുപ്രതി ചന്ദ്ര നിയമങ്ങൾ" : "Manuscript Moon Rules",
  evaluation: lang === "ml" ? "വിലയിരുത്തൽ" : "Evaluation",
  compatible: lang === "ml" ? "നിലവിലെ ചന്ദ്രൻ കൈയെഴുത്തുപ്രതി നിയമങ്ങളെ പാലിക്കുന്നു." : "Current Moon satisfies the manuscript rules.",
  notCompatible: lang === "ml" ? "നിലവിലെ ചന്ദ്രൻ കൈയെഴുത്തുപ്രതി നിയമങ്ങളെ പാലിക്കുന്നില്ല." : "Current Moon does NOT satisfy the manuscript rules.",
  // Option 2 labels
  desiredMansion: lang === "ml" ? "ആഗ്രഹിക്കുന്ന മാളിക" : "Desired Moon Mansion",
  desiredZodiac: lang === "ml" ? "ആഗ്രഹിക്കുന്ന രാശി" : "Desired Moon Zodiac",
  desiredPhase: lang === "ml" ? "വർദ്ധമാനം / ക്ഷയം (ഐച്ഛികം)" : "Waxing / Waning (Optional)",
  anyMansion: lang === "ml" ? "ഏതെങ്കിലും" : "Any",
  anyZodiac: lang === "ml" ? "ഏതെങ്കിലും" : "Any",
  anyPhase: lang === "ml" ? "എതും" : "Any",
  planBtn: lang === "ml" ? "കർമ്മം ആസൂത്രണം ചെയ്യുക" : "Plan Ritual",
  planning: lang === "ml" ? "ആസൂത്രണം ചെയ്യുന്നു..." : "Planning...",
  moonEnters: lang === "ml" ? "ചന്ദ്രൻ പ്രവേശിക്കുന്നു" : "Moon enters",
  fullEvaluation: lang === "ml" ? "പൂർണ്ണ വിലയിരുത്തൽ" : "Full Evaluation",
  recommended: lang === "ml" ? "✅ ശുപാർശ ചെയ്ത ആചാര സമയം" : "✅ Recommended Ritual Time",
  notRecommended: lang === "ml" ? "അനുയോജ്യമല്ലാത്ത സമയം" : "Not Fully Compatible",
  allPassMsg: lang === "ml"
    ? "ഈ ഭാവി സമയം തിരഞ്ഞെടുത്ത ആചാരം അനുഷ്ഠിക്കാൻ അനുയോജ്യമാണ്."
    : "This future time is compatible for performing the selected ritual.",
  notAllPassMsg: lang === "ml"
    ? "എല്ലാ കൈയെഴുത്തുപ്രതി വ്യവസ്ഥകളും ഒരേസമയം പാലിക്കപ്പെടുന്ന അടുത്ത ചന്ദ്ര അവസരത്തിനായി കാത്തിരിക്കുക."
    : "Wait for the next Moon occurrence where ALL manuscript conditions are satisfied.",
  searching: lang === "ml" ? "തിരയുന്നു..." : "Searching...",
  noResult: lang === "ml"
    ? "ഒരു വർഷത്തിനുള്ളിൽ എല്ലാ വ്യവസ്ഥകളും ഒരേസമയം പാലിക്കുന്ന സമയമില്ല."
    : "No fully compatible time found within one year of searching.",
  noMoonMatch: lang === "ml"
    ? "തിരഞ്ഞെടുത്ത ചന്ദ്ര അവസ്ഥ പാലിക്കുന്ന ദിവസമില്ല."
    : "No matching Moon condition found. Select at least one condition.",
  date: lang === "ml" ? "തീയതി" : "Date",
  time: lang === "ml" ? "സമയം" : "Time",
  month: lang === "ml" ? "മാസം" : "Month",
  dayName: lang === "ml" ? "ദിവസം" : "Day",
  saat: lang === "ml" ? "സഅാത്" : "Saat",
  kawkab: lang === "ml" ? "കവ്കബ്" : "Kawkab",
  moonStatus: lang === "ml" ? "ചന്ദ്രൻ" : "Moon",
  noData: lang === "ml" ? "ചന്ദ്ര വിവരം ലഭ്യമല്ല" : "Moon data unavailable",
  selectCondition: lang === "ml"
    ? "കുറഞ്ഞത് ഒരു ചന്ദ്ര അവസ്ഥയെങ്കിലും തിരഞ്ഞെടുക്കുക."
    : "Select at least one Moon condition to plan.",
  mandatorySection: lang === "ml" ? "നിർബന്ധ കൈയെഴുത്തുപ്രതി നിയമങ്ങൾ" : "Mandatory Manuscript Rules",
  moonPrefSection: lang === "ml" ? "ചന്ദ്ര മുൻഗണനകൾ" : "Moon Preferences",
  enhancementSection: lang === "ml" ? "പൊതു വർദ്ധധനകൾ" : "General Enhancements",
  manuscriptValid: lang === "ml" ? "കർമ്മം കൈയെഴുത്തുപ്രതി പ്രകാരം സാധുവാണ്." : "The ritual is manuscript-valid.",
  moonPrefNotSatisfied: lang === "ml"
    ? "എന്നാൽ, നിങ്ങളുടെ ഐച്ഛിക ചന്ദ്ര മുൻഗണന പൂർണ്ണമായി പാലിക്കപ്പെട്ടില്ല."
    : "However, your optional Moon preference was not fully satisfied.",
  findNextMatch: lang === "ml" ? "അടുത്ത പൊരുത്തമുള്ള സമയം കണ്ടെത്തുക" : "Find Next Matching Time",
  fullyRecommended: lang === "ml"
    ? "പൂർണ്ണമായി ശുപാർശ ചെയ്തു — എല്ലാ വ്യവസ്ഥകളും പാലിക്കപ്പെട്ടു"
    : "Fully Recommended — all conditions satisfied",
  moonPerfectFound: lang === "ml"
    ? "നിങ്ങളുടെ ചന്ദ്ര മുൻഗണനകളും പാലിക്കുന്ന പിന്നീടുള്ള സമയം:"
    : "A later time satisfies all your Moon preferences too:",
  noMoonPerfect: lang === "ml"
    ? "തിരയൽ കാലയളവിൽ നിങ്ങളുടെ ചന്ദ്ര മുൻഗണനകളും പാലിക്കുന്ന സമയമൊന്നും കണ്ടെത്തിയില്ല."
    : "No time found within the search period that also satisfies your Moon preference.",
  noMandatoryMatch: lang === "ml"
    ? "തിരയൽ കാലയളവിൽ കൈയെഴുത്തുപ്രതി പ്രകാരം സാധുവായ സമയമില്ല."
    : "No manuscript-valid time found within the search period.",
  manuscriptValidTime: lang === "ml" ? "കൈയെഴുത്തുപ്രതി പ്രകാരം സാധുവായ സമയം" : "Manuscript-Valid Time",
  invalidTime: lang === "ml" ? "സാധുവല്ലാത്ത സമയം" : "Invalid Time",
  timelineTitle: lang === "ml" ? "ശുപാർശ കാലരേഖ" : "Recommended Timeline",
  bestManuscriptTitle: lang === "ml" ? "✅ മികച്ച കൈയെഴുത്തുപ്രതി സമയം" : "✅ Best Manuscript Time",
  bestManuscriptDesc: lang === "ml"
    ? "എല്ലാ നിർബന്ധ കൈയെഴുത്തുപ്രതി നിയമങ്ങളും പാലിക്കുന്ന ഏറ്റവും പഴയ തീയതി. കൈയെഴുത്തുപ്രതി ആവശ്യമില്ലെങ്കിൽ ചന്ദ്രനെ അവഗണിക്കുന്നു."
    : "The earliest date where ALL mandatory manuscript rules pass. This recommendation ignores Moon unless Moon is a manuscript requirement.",
  bestMoonTitle: lang === "ml" ? "🌙 മികച്ച ചന്ദ്ര മുൻഗണന പൊരുത്തം" : "🌙 Best Moon Preference Match",
  bestMoonDesc: lang === "ml"
    ? "എല്ലാ നിർബന്ധ കൈയെഴുത്തുപ്രതി നിയമങ്ങളും തിരഞ്ഞെടുത്ത ചന്ദ്ര മുൻഗണനകളും പാലിക്കുന്ന ഏറ്റവും പഴയ തീയതി."
    : "The earliest date where all mandatory manuscript rules pass AND all selected Moon preferences pass.",
  bestAvailableTitle: lang === "ml" ? "⭐ മികച്ച ലഭ്യമായ സമയം" : "⭐ Best Available Time",
  bestAvailableBadge: "★★★★★ BEST AVAILABLE TIME",
  bestAvailableDesc: lang === "ml"
    ? "എല്ലാ നിർബന്ധ കൈയെഴുത്തുപ്രതി വ്യവസ്ഥകളും പാലിച്ചു. തിരഞ്ഞെടുത്ത ചന്ദ്ര മുൻഗണനകളും പാലിച്ചു. നഹാസ് നിരോധനമില്ല. കൈയെഴുത്തുപ്രതി നിരോധനമില്ല. എല്ലാ വ്യവസ്ഥകളും പാലിക്കുന്ന ഏറ്റവും പഴയ നിമിഷം."
    : "Every mandatory manuscript condition passed. Every selected Moon preference passed. No Nahas restriction. No manuscript prohibition. This is the earliest moment satisfying every enabled condition.",
  mergedNote: lang === "ml"
    ? "മികച്ച കൈയെഴുത്തുപ്രതി സമയവും മികച്ച ചന്ദ്ര മുൻഗണന പൊരുത്തവും ഒരേ സമയത്താണ് — ഒന്നായി ലയിപ്പിച്ചു."
    : "Best Manuscript Time and Best Moon Preference Match occur at the same moment — merged into one card.",
  explainWhy: lang === "ml" ? "കാരണം വിശദീകരിക്കുക" : "Explain Why",
  generalInfo: lang === "ml" ? "പൊതു വിവരം" : "General Information",
  currentMoonLabel: lang === "ml" ? "നിലവിലെ ചന്ദ്രൻ" : "Current Moon",
  nahasLabel: lang === "ml" ? "നഹാസ് നില" : "Nahas Status",
  nahasWarning: lang === "ml" ? "⚠ ഇന്ന് ഒരു നഹാസ് ദിവസമാണ്." : "⚠ Today is a Nahas day.",
  nahasWhyTitle: lang === "ml" ? "എന്തുകൊണ്ട് നഹാസ്?" : "Why it is Nahas",
  nahasScopeTitle: lang === "ml" ? "ബാധകമായ പരിധി" : "Scope of Nahas",
  nahasDestructiveTitle: lang === "ml" ? "നാശകരമായ കർമ്മങ്ങൾക്കുള്ള അനുമതി" : "Destructive Rituals Permitted",
  nahasAllRituals: lang === "ml" ? "എല്ലാ ആചാരങ്ങൾക്കും" : "All rituals",
  nahasSpecificOnly: lang === "ml" ? "പ്രത്യേക ആചാര വിഭാഗങ്ങൾക്ക് മാത്രം" : "Specific ritual categories only",
  nahasNotBlocked: lang === "ml" ? "ഈ നഹാസ് ഈ കർമ്മത്തിന് തടസ്സമല്ല." : "This Nahas does not block this ritual.",
  nahasBlocked: lang === "ml" ? "ഈ നഹാസ് ഈ കർമ്മം തടയുന്നു." : "This Nahas blocks this ritual.",
  nahasDestructiveYes: lang === "ml"
    ? "കൈയെഴുത്തുപ്രതി പ്രകാരം, ഈ നഹാസ് സമയത്ത് നാശകരമായതും വേർപിരിക്കൽ കർമ്മങ്ങളും അനുവദനീയമാണ്."
    : "Per the manuscript, destructive, separation, or harmful rituals are permitted during this Nahas.",
  nahasDestructiveNo: lang === "ml"
    ? "കൈയെഴുത്തുപ്രതി ഈ നഹാസ് സമയത്ത് നാശകരമായ കർമ്മങ്ങൾ പ്രത്യേകിച്ച് അനുവദിക്കുന്നില്ല."
    : "The manuscript does not specifically permit destructive rituals during this Nahas.",
  nahasCitationLabel: lang === "ml" ? "കൈയെഴുത്തുപ്രതി റഫറൻസ്" : "Manuscript Citation",
  nahasClean: lang === "ml" ? "നഹാസ് നിരോധനമില്ല — ഈ സമയം സുരക്ഷിതമാണ്." : "No Nahas restriction — this time is safe.",
});

export default function MoonAnalysisCard({ moonPhase, moonReq, moonCitations, req, lang = "ml" }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // null | "status" | "plan"
  const [desiredMansion, setDesiredMansion] = useState("");
  const [desiredZodiac, setDesiredZodiac] = useState("");
  const [desiredPhase, setDesiredPhase] = useState("");
  const [planResult, setPlanResult] = useState(null);
  const [planning, setPlanning] = useState(false);
  const t = L(lang);

  // ── Option 1: Current Moon compatibility (computed on demand) ──
  const moonCompat = useMemo(() => {
    if (selectedOption !== "status" || !moonPhase) return null;
    return analyzeMoonCompatibility({ moonReq, moonPhase, moonCitations });
  }, [selectedOption, moonReq, moonPhase, moonCitations]);

  // ── Option 2: Plan by Moon ──
  const handlePlan = () => {
    if (!desiredMansion && !desiredZodiac && !desiredPhase) return;
    setPlanning(true);
    setPlanResult(null);
    // Defer to next tick so UI can show "planning" state
    setTimeout(() => {
      const result = planRitualByMoon({
        req,
        moonReq,
        desiredMansion: desiredMansion || null,
        desiredZodiac: desiredZodiac || null,
        desiredPhase: desiredPhase || null,
        fromDate: new Date(),
      });
      setPlanResult(result);
      setPlanning(false);
    }, 100);
  };

  if (!moonPhase) return null;

  const illumination = moonPhase.moonIllumination != null ? `${Math.round(moonPhase.moonIllumination)}%` : "—";
  const ageDisplay = `${moonPhase.lunarDay} ${t.day}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        border: `1px solid ${G.border}`,
        boxShadow: "0 4px 40px rgba(0,0,0,0.50), inset 0 1px 0 rgba(96,165,250,0.08)",
      }}
    >
      {/* ── Header ── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4"
        style={{ borderBottom: expanded ? `1px solid ${G.border}` : "none" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
            background: "linear-gradient(135deg, rgba(96,165,250,0.18) 0%, rgba(96,165,250,0.05) 100%)",
            border: `1px solid ${G.blueBorder}`,
          }}>
            <Moon className="w-5 h-5" style={{ color: G.blue }} />
          </div>
          <div className="text-left">
            <h3 className="font-inter text-sm font-bold tracking-wide" style={{ color: "#fff" }}>
              {t.title}
            </h3>
            <p className="font-inter text-[10px]" style={{ color: G.dim }}>
              {t.subtitle}
            </p>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 transition-transform" style={{ color: G.dim, transform: expanded ? "rotate(180deg)" : "none" }} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">

              {/* ── Default message (no option selected) ── */}
              {!selectedOption && (
                <div className="rounded-xl p-4 text-center" style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <Moon className="w-6 h-6 mx-auto mb-2" style={{ color: G.dim }} />
                  <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {t.defaultMsg}
                  </p>
                </div>
              )}

              {/* ── Option Selector (radio-style) ── */}
              <div className="space-y-2">
                <OptionRadio
                  label={t.opt1}
                  icon={<Moon className="w-4 h-4" />}
                  selected={selectedOption === "status"}
                  onSelect={() => setSelectedOption(selectedOption === "status" ? null : "status")}
                  lang={lang}
                />
                <OptionRadio
                  label={t.opt2}
                  icon={<CalendarClock className="w-4 h-4" />}
                  selected={selectedOption === "plan"}
                  onSelect={() => setSelectedOption(selectedOption === "plan" ? null : "plan")}
                  lang={lang}
                />
              </div>

              {/* ── OPTION 1: Show Current Moon Status ── */}
              {selectedOption === "status" && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {/* Live Moon Data */}
                  <div className="rounded-xl p-3" style={{
                    background: "rgba(96,165,250,0.05)",
                    border: `1px solid ${G.blueBorder}`,
                  }}>
                    <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: "rgba(96,165,250,0.70)" }}>
                      {t.currentMoon}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <MoonDataRow label={t.phase} value={`Day ${moonPhase.lunarDay} (${moonPhase.isWaxing ? t.waxing : t.waning})`} />
                      <MoonDataRow label={t.waxWane} value={moonPhase.isWaxing ? t.waxing : t.waning} />
                      <MoonDataRow label={t.zodiacSign} value={moonPhase.moonSign ? `${moonPhase.moonSignSymbol || ""} ${moonPhase.moonSign}` : "—"} />
                      <MoonDataRow label={t.mansion} value={moonPhase.moonMansion ? (moonPhase.moonMansionArabic ? `${moonPhase.moonMansionArabic} (${moonPhase.moonMansion})` : moonPhase.moonMansion) : "—"} />
                      <MoonDataRow label={t.illumination} value={illumination} />
                      <MoonDataRow label={t.moonAge} value={ageDisplay} />
                    </div>
                  </div>

                  {/* Manuscript Moon Rule Evaluation */}
                  {moonCompat && (
                    <div className="rounded-xl p-3 space-y-2" style={{
                      background: moonCompat.hasMoonRules
                        ? (moonCompat.compatible ? "rgba(74,222,128,0.05)" : "rgba(248,113,113,0.05)")
                        : "rgba(255,255,255,0.02)",
                      border: moonCompat.hasMoonRules
                        ? `1px solid ${moonCompat.compatible ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`
                        : "1px solid rgba(255,255,255,0.08)",
                    }}>
                      {/* No Moon Rule */}
                      {!moonCompat.hasMoonRules && (
                        <div className="flex items-start gap-2">
                          <Minus className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: G.neutral }} />
                          <div>
                            <p className="font-inter text-sm font-bold mb-1" style={{ color: "#fff" }}>
                              {t.noRuleTitle}
                            </p>
                            <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                              {t.noRuleMsg}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Moon Rules Exist — show ✓/✗ */}
                      {moonCompat.hasMoonRules && (
                        <>
                          <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                            {t.msRulesTitle}
                          </p>
                          {moonCompat.checks.map((check, idx) => (
                            <MoonCheckRow key={idx} check={check} lang={lang} />
                          ))}
                          <div className="rounded-lg p-2.5 mt-1" style={{
                            background: moonCompat.compatible ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
                            border: `1px solid ${moonCompat.compatible ? "rgba(74,222,128,0.30)" : "rgba(248,113,113,0.30)"}`,
                          }}>
                            <div className="flex items-center gap-2">
                              {moonCompat.compatible
                                ? <Check className="w-4 h-4" style={{ color: G.pass }} />
                                : <AlertTriangle className="w-4 h-4" style={{ color: G.fail }} />}
                              <p className={`text-xs font-bold ${lang === "ml" ? "font-malayalam" : "font-inter"}`} style={{
                                color: moonCompat.compatible ? G.pass : G.fail,
                              }}>
                                {moonCompat.compatible ? t.compatible : t.notCompatible}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── OPTION 2: Plan Ritual by Moon ── */}
              {selectedOption === "plan" && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {/* Desired Condition Selectors */}
                  <div className="rounded-xl p-3 space-y-3" style={{
                    background: "rgba(96,165,250,0.05)",
                    border: `1px solid ${G.blueBorder}`,
                  }}>
                    {/* Desired Mansion */}
                    <div>
                      <label className="font-inter text-[9px] uppercase tracking-widest block mb-1" style={{ color: "rgba(96,165,250,0.70)" }}>
                        {t.desiredMansion}
                      </label>
                      <select
                        value={desiredMansion}
                        onChange={(e) => setDesiredMansion(e.target.value)}
                        className="w-full rounded-lg px-3 py-2 font-inter text-xs"
                        style={{
                          background: "rgba(8,16,38,0.80)",
                          border: `1px solid ${G.blueBorder}`,
                          color: "#fff",
                        }}
                      >
                        <option value="">{t.anyMansion}</option>
                        {MOON_MANSIONS.map(m => (
                          <option key={m.no} value={m.no}>
                            #{m.no} — {m.name} ({m.harfi})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Desired Zodiac */}
                    <div>
                      <label className="font-inter text-[9px] uppercase tracking-widest block mb-1" style={{ color: "rgba(96,165,250,0.70)" }}>
                        {t.desiredZodiac}
                      </label>
                      <select
                        value={desiredZodiac}
                        onChange={(e) => setDesiredZodiac(e.target.value)}
                        className="w-full rounded-lg px-3 py-2 font-inter text-xs"
                        style={{
                          background: "rgba(8,16,38,0.80)",
                          border: `1px solid ${G.blueBorder}`,
                          color: "#fff",
                        }}
                      >
                        <option value="">{t.anyZodiac}</option>
                        {ZODIAC_SIGNS.map(z => (
                          <option key={z.name_en} value={z.name_en}>
                            {z.symbol} {z.name_en} {lang === "ml" ? `(${z.name_ml})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Desired Phase */}
                    <div>
                      <label className="font-inter text-[9px] uppercase tracking-widest block mb-1" style={{ color: "rgba(96,165,250,0.70)" }}>
                        {t.desiredPhase}
                      </label>
                      <select
                        value={desiredPhase}
                        onChange={(e) => setDesiredPhase(e.target.value)}
                        className="w-full rounded-lg px-3 py-2 font-inter text-xs"
                        style={{
                          background: "rgba(8,16,38,0.80)",
                          border: `1px solid ${G.blueBorder}`,
                          color: "#fff",
                        }}
                      >
                        <option value="">{t.anyPhase}</option>
                        <option value="waxing">{t.waxing}</option>
                        <option value="waning">{t.waning}</option>
                      </select>
                    </div>
                  </div>

                  {/* Plan Button */}
                  <button
                    onClick={handlePlan}
                    disabled={planning || (!desiredMansion && !desiredZodiac && !desiredPhase)}
                    className="w-full rounded-xl py-3 font-inter text-sm font-bold transition flex items-center justify-center gap-2 disabled:opacity-40"
                    style={{
                      background: "linear-gradient(135deg, rgba(96,165,250,0.20) 0%, rgba(96,165,250,0.08) 100%)",
                      border: `1px solid ${G.blueBorder}`,
                      color: G.blue,
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    {planning ? t.planning : t.planBtn}
                  </button>

                  {(!desiredMansion && !desiredZodiac && !desiredPhase) && (
                    <p className="font-inter text-[10px] text-center" style={{ color: G.dim }}>
                      {t.selectCondition}
                    </p>
                  )}

                  {/* Plan Result */}
                  {planResult && (
                    <PlanResultView
                      result={planResult}
                      t={t}
                      lang={lang}
                      moonCitations={moonCitations}
                      req={req}
                    />
                  )}
                </motion.div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PLAN RESULT VIEW — Shows the Moon entry moment + full evaluation
// ═══════════════════════════════════════════════════════════════
function PlanResultView({ result, t, lang, moonCitations, req }) {
  const { found, recommendedTime, firstMoonPerfect, hasMoonPrefs } = result;

  // No manuscript-valid time found at all
  if (!found || !recommendedTime) {
    return (
      <div className="rounded-xl p-4 text-center" style={{
        background: "rgba(248,113,113,0.05)",
        border: "1px solid rgba(248,113,113,0.20)",
      }}>
        <AlertTriangle className="w-5 h-5 mx-auto mb-2" style={{ color: G.fail }} />
        <p className="font-inter text-xs" style={{ color: "rgba(248,113,113,0.80)" }}>
          {t.noMandatoryMatch}
        </p>
      </div>
    );
  }

  // ═══ Build cards: Best Manuscript Time + Best Moon Preference Match ═══
  const rv = recommendedTime;
  const mp = hasMoonPrefs ? firstMoonPerfect : null;

  // Merge: if Best Manuscript Time and Best Moon Preference Match are identical,
  // display a single "Best Available Time" card.
  const isMerged = hasMoonPrefs && mp && rv === mp;

  const cards = [];
  if (isMerged) {
    cards.push({ type: "bestAvailable", data: rv });
  } else {
    cards.push({ type: "manuscript", data: rv });
    if (hasMoonPrefs && mp && mp !== rv) {
      cards.push({ type: "moon", data: mp });
    }
  }

  return (
    <div className="space-y-3">
      {/* Timeline header */}
      <div className="flex items-center gap-2">
        <CalendarClock className="w-4 h-4" style={{ color: G.text }} />
        <span className="font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: G.text }}>
          {t.timelineTitle}
        </span>
      </div>

      {/* Nahas Warning — if today is a Nahas day per manuscript */}
      <NahasWarning req={req} t={t} lang={lang} moonCitations={moonCitations} />

      {/* Timeline cards */}
      {cards.map((card, idx) => (
        <TimelineCard
          key={idx}
          card={card}
          num={idx + 1}
          t={t}
          lang={lang}
          moonCitations={moonCitations}
          hasMoonPrefs={hasMoonPrefs}
          isMerged={isMerged}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TIMELINE CARD — One entry in the chronological timeline
// ═══════════════════════════════════════════════════════════════
function TimelineCard({ card, num, t, lang, moonCitations, hasMoonPrefs, isMerged }) {
  const [showExplain, setShowExplain] = useState(false);
  const { type, data: m } = card;

  const isBestAvailable = type === "bestAvailable";
  const isManuscript = type === "manuscript";
  const isMoonOnly = type === "moon";
  const showMoonDetails = isBestAvailable || isMoonOnly;

  const title = isBestAvailable ? t.bestAvailableTitle
    : isMoonOnly ? t.bestMoonTitle
    : t.bestManuscriptTitle;

  const desc = isBestAvailable ? t.bestAvailableDesc
    : isMoonOnly ? t.bestMoonDesc
    : t.bestManuscriptDesc;

  const iconEmoji = isBestAvailable ? "⭐" : isMoonOnly ? "🌙" : "✅";

  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: isBestAvailable
        ? "linear-gradient(135deg, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.04) 100%)"
        : "rgba(255,255,255,0.02)",
      border: `1px solid ${isBestAvailable ? "rgba(212,175,55,0.45)" : "rgba(255,255,255,0.08)"}`,
      boxShadow: isBestAvailable ? "0 0 24px rgba(212,175,55,0.18)" : "none",
    }}>
      {/* Header */}
      <div className="p-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-base leading-none">{iconEmoji}</span>
          <span className={`text-sm font-bold ${lang === "ml" ? "font-malayalam" : "font-inter"}`} style={{ color: isBestAvailable ? G.text : "#fff" }}>
            {title}
          </span>
          {isBestAvailable && (
            <span className="font-inter text-[8px] px-2 py-0.5 rounded-full font-bold" style={{
              background: "rgba(212,175,55,0.15)",
              color: G.text,
              border: "1px solid rgba(212,175,55,0.30)",
              letterSpacing: "0.05em",
            }}>{t.bestAvailableBadge}</span>
          )}
        </div>
        <p className={`text-[11px] leading-snug ${lang === "ml" ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.60)" }}>
          {desc}
        </p>
        {isBestAvailable && (
          <p className={`text-[10px] leading-snug mt-1 ${lang === "ml" ? "font-malayalam" : "font-inter"}`} style={{ color: G.dim }}>
            {t.mergedNote}
          </p>
        )}
      </div>

      {/* Details */}
      <div className="p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <MoonDataRow label={t.date} value={`${m.dayNumber} ${m.monthName} ${m.year}`} />
          <MoonDataRow label={t.time} value={m.timeStr} />
          <MoonDataRow label={t.dayName} value={m.dayName} />
          <MoonDataRow label={t.saat} value={m.hourNumber ? `#${m.hourNumber} (${m.hourPlanet})` : "—"} />
          <MoonDataRow label={t.kawkab} value={m.hourPlanet || "—"} />
          {showMoonDetails && m.moon?.moonMansion && (
            <MoonDataRow label={t.mansion} value={m.moon.moonMansionArabic ? `${m.moon.moonMansionArabic} (${m.moon.moonMansion})` : m.moon.moonMansion} />
          )}
          {showMoonDetails && m.moon?.moonSign && (
            <MoonDataRow label={t.zodiacSign} value={`${m.moon.moonSignSymbol || ""} ${m.moon.moonSign}`} />
          )}
          {showMoonDetails && (
            <MoonDataRow label={t.phase} value={`Day ${m.moon?.lunarDay || "?"} (${m.moon?.phaseName || "—"})`} />
          )}
        </div>

        {/* Nahas Status */}
        <div className="flex items-center gap-2 p-2 rounded-lg" style={{
          background: "rgba(74,222,128,0.04)",
          border: "1px solid rgba(74,222,128,0.12)",
        }}>
          <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: G.pass }} />
          <span className={`text-xs ${lang === "ml" ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.75)" }}>
            {t.nahasLabel}: {t.nahasClean}
          </span>
        </div>

        {/* Manuscript Citations */}
        {moonCitations && moonCitations.length > 0 && !isMoonOnly && (
          <div className="rounded-lg p-2" style={{
            background: "rgba(74,222,128,0.04)",
            border: "1px solid rgba(74,222,128,0.12)",
          }}>
            <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(74,222,128,0.60)" }}>
              {lang === "ml" ? "കൈയെഴുത്തുപ്രതി റഫറൻസുകൾ" : "Manuscript Citations"}
            </p>
            <div className="space-y-0.5">
              {moonCitations.map((c, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="font-inter text-[9px] px-1 rounded flex-shrink-0" style={{
                    background: "rgba(74,222,128,0.10)",
                    color: "rgba(74,222,128,0.60)",
                  }}>{c.source}</span>
                  <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>{c.summary || c.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explain Why button */}
        <button
          onClick={() => setShowExplain(!showExplain)}
          className="w-full rounded-lg py-2 font-inter text-xs font-bold transition flex items-center justify-center gap-2"
          style={{
            background: showExplain ? "rgba(212,175,55,0.10)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${showExplain ? G.border : "rgba(255,255,255,0.08)"}`,
            color: showExplain ? G.text : "rgba(255,255,255,0.60)",
          }}
        >
          <BookOpen className="w-3.5 h-3.5" />
          {t.explainWhy}
          <ChevronDown className="w-3 h-3 transition-transform" style={{ transform: showExplain ? "rotate(180deg)" : "none" }} />
        </button>

        {/* Explain Why content */}
        {showExplain && (
          <ExplainWhy data={m} t={t} lang={lang} hasMoonPrefs={hasMoonPrefs} />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NAHAS WARNING — Shows if today is a manuscript Nahas day
// ═══════════════════════════════════════════════════════════════
function NahasWarning({ req, t, lang, moonCitations }) {
  if (!req?.worstDays?.length) return null;

  const todayKey = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][new Date().getDay()];
  const isNahasDay = req.worstDays.includes(todayKey);
  if (!isNahasDay) return null;

  const dayNames = {
    sun: lang === "ml" ? "ഞായർ" : "Sunday",
    mon: lang === "ml" ? "തിങ്കൾ" : "Monday",
    tue: lang === "ml" ? "ചൊവ്വ" : "Tuesday",
    wed: lang === "ml" ? "ബുധൻ" : "Wednesday",
    thu: lang === "ml" ? "വ്യാഴം" : "Thursday",
    fri: lang === "ml" ? "വെള്ളി" : "Friday",
    sat: lang === "ml" ? "ശനി" : "Saturday",
  };

  // Find citation for worstDays if available
  const nahasCitation = moonCitations?.find(c => c.field === "day") || null;

  return (
    <div className="rounded-xl p-3 space-y-2" style={{
      background: "rgba(248,113,113,0.06)",
      border: "1px solid rgba(248,113,113,0.25)",
    }}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: G.fail }} />
        <p className={`text-sm font-bold ${lang === "ml" ? "font-malayalam" : "font-inter"}`} style={{ color: G.fail }}>
          {t.nahasWarning}
        </p>
      </div>

      {/* Why it is Nahas */}
      <div>
        <p className="font-inter text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(248,113,113,0.60)" }}>
          {t.nahasWhyTitle}
        </p>
        <p className={`text-xs leading-snug ${lang === "ml" ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.70)" }}>
          {lang === "ml"
            ? `${dayNames[todayKey]} കൈയെഴുത്തുപ്രതി പ്രകാരം ഒരു നഹാസ് ദിവസമാണ്. ഈ ദിവസം ചില കർമ്മങ്ങൾക്ക് തടസ്സമാണ്.`
            : `${dayNames[todayKey]} is identified as a Nahas (inauspicious) day per the manuscript. This day obstructs certain rituals.`}
        </p>
      </div>

      {/* Manuscript Citation */}
      {nahasCitation && (
        <div>
          <p className="font-inter text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(248,113,113,0.60)" }}>
            {t.nahasCitationLabel}
          </p>
          <div className="flex items-start gap-1.5">
            <span className="font-inter text-[9px] px-1 rounded flex-shrink-0" style={{
              background: "rgba(248,113,113,0.10)",
              color: "rgba(248,113,113,0.60)",
            }}>{nahasCitation.source}</span>
            <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>{nahasCitation.summary || nahasCitation.category}</p>
          </div>
        </div>
      )}

      {/* Scope */}
      <div>
        <p className="font-inter text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(248,113,113,0.60)" }}>
          {t.nahasScopeTitle}
        </p>
        <p className={`text-xs leading-snug ${lang === "ml" ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.70)" }}>
          {lang === "ml"
            ? "ഈ നഹാസ് എല്ലാ ആചാരങ്ങൾക്കും ബാധകമാണോ അതോ പ്രത്യേക ആചാര വിഭാഗങ്ങൾക്ക് മാത്രമോ എന്ന് കൈയെഴുത്തുപ്രതി വ്യക്തമാക്കുന്നു. നാശകരമായതും വേർപിരിക്കൽ കർമ്മങ്ങളും ഈ നഹാസ് സമയത്ത് അനുവദനീയമാണെന്ന് കൈയെഴുത്തുപ്രതി പറയുന്നെങ്കിൽ, അത് റഫറൻസ് സഹിതം സൂചിപ്പിക്കപ്പെടുന്നു."
            : "The manuscript clarifies whether this Nahas applies to all rituals or only specific ritual categories. If the manuscript permits destructive, separation, or harmful rituals during this Nahas, it is stated with citation."}
        </p>
      </div>

      {/* Destructive Rituals Permitted? */}
      <div>
        <p className="font-inter text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(248,113,113,0.60)" }}>
          {t.nahasDestructiveTitle}
        </p>
        <p className={`text-xs leading-snug ${lang === "ml" ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.70)" }}>
          {t.nahasDestructiveNo}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPLAIN WHY — Expandable rule breakdown for a timeline card
// ═══════════════════════════════════════════════════════════════
function ExplainWhy({ data, t, lang, hasMoonPrefs }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="space-y-3 overflow-hidden"
    >
      {/* Mandatory Manuscript Rules */}
      <div className="space-y-1.5">
        <p className="font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: G.text }}>
          {t.mandatorySection}
        </p>
        {data.mandatoryChecks.map((check, idx) => (
          <MoonCheckRow key={idx} check={check} lang={lang} />
        ))}
      </div>

      {/* Moon Preferences */}
      {hasMoonPrefs && data.moonPrefChecks.length > 0 && (
        <div className="space-y-1.5">
          <p className="font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: G.blue }}>
            {t.moonPrefSection}
          </p>
          {data.moonPrefChecks.map((check, idx) => (
            <MoonCheckRow key={idx} check={check} lang={lang} />
          ))}
        </div>
      )}

      {/* General Information */}
      <div className="rounded-xl p-3 space-y-1" style={{
        background: "rgba(96,165,250,0.04)",
        border: `1px solid ${G.blueBorder}`,
      }}>
        <p className="font-inter text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: G.blue }}>
          {t.generalInfo}
        </p>
        <MoonDataRow label={t.currentMoonLabel} value={data.moon ? `Day ${data.moon.lunarDay} (${data.moon.phaseName})` : "—"} />
        <MoonDataRow label={t.mansion} value={data.moon?.moonMansion ? (data.moon.moonMansionArabic ? `${data.moon.moonMansionArabic} (${data.moon.moonMansion})` : data.moon.moonMansion) : "—"} />
        <MoonDataRow label={t.zodiacSign} value={data.moon?.moonSign ? `${data.moon.moonSignSymbol || ""} ${data.moon.moonSign}` : "—"} />
        <MoonDataRow label={t.phase} value={data.moon ? data.moon.phaseName : "—"} />
        <MoonDataRow label={t.illumination} value={data.moon?.moonIllumination != null ? `${Math.round(data.moon.moonIllumination)}%` : "—"} />
      </div>
    </motion.div>
  );
}

// ── Option Radio Button ──
function OptionRadio({ label, icon, selected, onSelect, lang }) {
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-3 p-3 rounded-xl transition text-left"
      style={{
        background: selected ? "rgba(96,165,250,0.08)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${selected ? G.blueBorder : "rgba(255,255,255,0.06)"}`,
      }}
    >
      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{
        border: `2px solid ${selected ? G.blue : G.dim}`,
        background: selected ? G.blue : "transparent",
      }}>
        {selected && <div className="w-2 h-2 rounded-full" style={{ background: "#fff" }} />}
      </div>
      <div style={{ color: selected ? G.blue : "rgba(255,255,255,0.70)" }}>
        {icon}
      </div>
      <span className={`text-sm font-bold ${lang === "ml" ? "font-malayalam" : "font-inter"}`} style={{
        color: selected ? G.blue : "rgba(255,255,255,0.80)",
      }}>
        {label}
      </span>
    </button>
  );
}

// ── Moon Data Row ──
function MoonDataRow({ label, value }) {
  return (
    <div>
      <p className="font-inter text-[8px] uppercase tracking-wider" style={{ color: "rgba(96,165,250,0.50)" }}>
        {label}
      </p>
      <p className="font-inter text-xs font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>
        {value}
      </p>
    </div>
  );
}

// ── Moon Check Row (✓/✗/neutral) ──
function MoonCheckRow({ check, lang }) {
  const isPass = check.status === "pass";
  const isFail = check.status === "fail";
  const isNeutral = check.status === "neutral";

  const icon = isPass ? <Check className="w-3.5 h-3.5" /> : isFail ? <X className="w-3.5 h-3.5" /> : <Minus className="w-3 h-3" />;
  const color = isPass ? G.pass : isFail ? G.fail : G.neutral;

  return (
    <div className="rounded-lg p-2" style={{
      background: isPass ? "rgba(74,222,128,0.04)" : isFail ? "rgba(248,113,113,0.04)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${isPass ? "rgba(74,222,128,0.15)" : isFail ? "rgba(248,113,113,0.15)" : "rgba(255,255,255,0.05)"}`,
    }}>
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-0.5" style={{ color }}>{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-bold ${lang === "ml" ? "font-malayalam" : "font-inter"}`} style={{ color: "#fff" }}>
              {check.label}
            </span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>
              {check.currentValue || check.current}
            </span>
          </div>
          <p className={`text-[11px] leading-snug ${lang === "ml" ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.65)" }}>
            {check.reason}
          </p>
        </div>
      </div>
    </div>
  );
}