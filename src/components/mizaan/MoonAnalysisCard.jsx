// ═══════════════════════════════════════════════════════════════
// MOON ANALYSIS CARD — Optional, user-initiated Moon evaluation
// ═══════════════════════════════════════════════════════════════
// Self-contained collapsible card. Displays live Moon data by default.
// Moon compatibility analysis starts ONLY when the user presses the
// "Analyze Moon Compatibility" button.
//
// If no manuscript Moon rule exists for the ritual, displays:
//   "Moon conditions are NOT required for this ritual."
// and does NOT affect the main timing decision.
//
// Never inserts Moon commentary into the main ritual report.
// Never reduces the main compatibility score.
// Never generates Moon warnings in the main report.
// ═══════════════════════════════════════════════════════════════
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, ChevronDown, Sparkles, Check, X, Minus, CalendarClock, Search, AlertTriangle } from "lucide-react";
import { analyzeMoonCompatibility, findNextSuitableMoonTime } from "../../lib/ritualTimingEngineV3";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
  pass: "#4ADE80",
  fail: "#F87171",
  neutral: "rgba(255,255,255,0.40)",
};

// ── Bilingual labels ──
const L = (lang) => ({
  title: lang === "ml" ? "ചന്ദ്ര വിശകലനം (ഐച്ഛികം)" : "Moon Analysis (Optional)",
  subtitle: lang === "ml" ? "കൈയെഴുത്തുപ്രതി നിയമങ്ങൾ മാത്രം" : "Manuscript rules only",
  currentMoon: lang === "ml" ? "നിലവിലെ ചന്ദ്രൻ" : "Current Moon",
  phase: lang === "ml" ? "ചന്ദ്ര ദശ" : "Moon Phase",
  waxWane: lang === "ml" ? "വർദ്ധമാനം / ക്ഷയം" : "Waxing / Waning",
  zodiacSign: lang === "ml" ? "രാശി" : "Zodiac Sign",
  mansion: lang === "ml" ? "ചാന്ദ്ര മാളിക (മൻസിൽ)" : "Moon Mansion (Manzil)",
  illumination: lang === "ml" ? "പ്രകാശിതർത്ഥം" : "Illumination",
  moonAge: lang === "ml" ? "ചന്ദ്രന്റെ പ്രായം" : "Age of Moon",
  status: lang === "ml" ? "അവസ്ഥ" : "Status",
  statusInfo: lang === "ml" ? "നിലവിലെ ചന്ദ്ര വിവരം ലഭ്യമാണ്." : "Current Moon information is available.",
  analyzeBtn: lang === "ml" ? "ചന്ദ്ര അനുയോജ്യത വിശകലനം ചെയ്യുക" : "Analyze Moon Compatibility",
  analyzing: lang === "ml" ? "വിശകലനം ചെയ്യുന്നു..." : "Analyzing...",
  noRuleTitle: lang === "ml" ? "കൈയെഴുത്തുപ്രതി നിയമം ഇല്ല" : "No Moon Rule Required",
  noRuleMsg: lang === "ml"
    ? "കൈയെഴുത്തുപ്രതി പ്രകാരം, ഈ കർമ്മത്തിന് ചന്ദ്ര വ്യവസ്ഥകൾ ആവശ്യമില്ല. നിലവിലെ ചന്ദ്ര വിവരം കൂടുതൽ അറിവിനായി മാത്രം കാണിക്കുന്നു."
    : "According to the manuscript, Moon conditions are NOT required for this ritual. Current Moon information is shown only as additional reference.",
  reportTitle: lang === "ml" ? "ചന്ദ്ര അനുയോജ്യത റിപ്പോർട്ട്" : "Moon Compatibility Report",
  evaluation: lang === "ml" ? "വിലയിരുത്തൽ" : "Evaluation",
  finalResult: lang === "ml" ? "അന്തിമ ഫലം" : "Final Result",
  compatible: lang === "ml" ? "ചന്ദ്ര വ്യവസ്ഥകൾ ഈ കർമ്മത്തിന് അനുയോജ്യമാണ്." : "Moon conditions are compatible with this ritual.",
  notCompatible: lang === "ml" ? "ചന്ദ്ര വ്യവസ്ഥകൾ ഈ കർമ്മത്തിന് അനുയോജ്യമല്ല." : "Moon conditions are NOT compatible with this ritual.",
  waitRecommendation: lang === "ml" ? "ശുപാർശ" : "Recommendation",
  findNextToggle: lang === "ml" ? "അടുത്ത അനുയോജ്യ ചന്ദ്ര സമയം കണ്ടെത്തുക" : "Find Next Suitable Moon Time",
  nextOpportunity: lang === "ml" ? "അടുത്ത ശുപാർശ അവസരം" : "Next Recommended Opportunity",
  date: lang === "ml" ? "തീയതി" : "Date",
  bestDay: lang === "ml" ? "മികച്ച ദിവസം" : "Best Day",
  bestSaat: lang === "ml" ? "മികച്ച സഅാത്" : "Best Saat",
  confidence: lang === "ml" ? "ആത്മവിശ്വാസം" : "Confidence",
  noNextFound: lang === "ml" ? "30 ദിവസത്തിനുള്ളിൽ അനുയോജ്യ സമയമില്ല." : "No suitable Moon time found within 30 days.",
  filters: lang === "ml" ? "ചന്ദ്ര ഫിൽട്ടറുകൾ" : "Moon Filters",
  requireWaxing: lang === "ml" ? "വർദ്ധമാന ചന്ദ്രൻ ആവശ്യം" : "Require Waxing Moon",
  requireWaning: lang === "ml" ? "ക്ഷയ ചന്ദ്രൻ ആവശ്യം" : "Require Waning Moon",
  ignoreMoon: lang === "ml" ? "ചന്ദ്രനെ അവഗണിക്കുക (സ്ഥിരസ്ഥിതി)" : "Ignore Moon (Default)",
  msRules: lang === "ml" ? "ബാധകമായ കൈയെഴുത്തുപ്രതി നിയമങ്ങൾ" : "Applicable Manuscript Rules",
  noRulesFound: lang === "ml" ? "ഈ കർമ്മത്തിന് ചന്ദ്ര നിയമങ്ങളൊന്നുമില്ല." : "No Moon rules found for this ritual.",
  waxing: lang === "ml" ? "വർദ്ധമാനം" : "Waxing",
  waning: lang === "ml" ? "ക്ഷയം" : "Waning",
  day: lang === "ml" ? "ദിവസം" : "Day",
  source: lang === "ml" ? "ഉറവിടം" : "Source",
  excellent: lang === "ml" ? "അത്യുത്തം" : "Excellent",
  noData: lang === "ml" ? "ചന്ദ്ര വിവരം ലഭ്യമല്ല" : "Moon data unavailable",
});

export default function MoonAnalysisCard({ moonPhase, moonReq, moonCitations, req, lang = "ml" }) {
  const [expanded, setExpanded] = useState(false);
  const [analysisEnabled, setAnalysisEnabled] = useState(false);
  const [findNextEnabled, setFindNextEnabled] = useState(false);
  const [filters, setFilters] = useState({});
  const t = L(lang);

  // ── Moon compatibility (computed on demand only) ──
  const moonCompat = useMemo(() => {
    if (!analysisEnabled || !moonPhase) return null;
    return analyzeMoonCompatibility({ moonReq, moonPhase, moonCitations });
  }, [analysisEnabled, moonReq, moonPhase, moonCitations]);

  // ── Next suitable moon time (computed on demand only) ──
  const nextTime = useMemo(() => {
    if (!findNextEnabled || !moonPhase) return null;
    return findNextSuitableMoonTime({
      req,
      moonReq,
      fromDate: new Date(),
      filters,
    });
  }, [findNextEnabled, moonReq, moonPhase, req, filters]);

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
            border: "1px solid rgba(96,165,250,0.35)",
          }}>
            <Moon className="w-5 h-5" style={{ color: "rgba(96,165,250,0.90)" }} />
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

              {/* ── Current Moon Data (always shown) ── */}
              <div className="rounded-xl p-3" style={{
                background: "rgba(96,165,250,0.05)",
                border: "1px solid rgba(96,165,250,0.20)",
              }}>
                <p className="font-inter text-[9px] uppercase tracking-widest mb-2" style={{ color: "rgba(96,165,250,0.70)" }}>
                  {t.currentMoon}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <MoonDataRow label={t.phase} value={`${t.day} ${moonPhase.lunarDay} (${lang === "ml" ? (moonPhase.isWaxing ? t.waxing : t.waning) : moonPhase.phaseName})`} />
                  <MoonDataRow label={t.waxWane} value={moonPhase.isWaxing ? t.waxing : t.waning} />
                  <MoonDataRow label={t.zodiacSign} value={moonPhase.moonSign ? `${moonPhase.moonSignSymbol || ""} ${moonPhase.moonSign}` : "—"} />
                  <MoonDataRow label={t.mansion} value={moonPhase.moonMansion ? (moonPhase.moonMansionArabic ? `${moonPhase.moonMansionArabic} (${moonPhase.moonMansion})` : moonPhase.moonMansion) : "—"} />
                  <MoonDataRow label={t.illumination} value={illumination} />
                  <MoonDataRow label={t.moonAge} value={ageDisplay} />
                </div>
                <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(96,165,250,0.15)" }}>
                  <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                    {t.status}: {t.statusInfo}
                  </p>
                </div>
              </div>

              {/* ── Analyze Button (only if not yet analyzed) ── */}
              {!analysisEnabled && (
                <button
                  onClick={() => setAnalysisEnabled(true)}
                  className="w-full rounded-xl py-3 font-inter text-sm font-bold transition flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, rgba(96,165,250,0.20) 0%, rgba(96,165,250,0.08) 100%)",
                    border: "1px solid rgba(96,165,250,0.40)",
                    color: "rgba(96,165,250,0.95)",
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  {t.analyzeBtn}
                </button>
              )}

              {/* ── Moon Compatibility Report (after button press) ── */}
              {moonCompat && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-3 space-y-3"
                  style={{
                    background: moonCompat.hasMoonRules
                      ? (moonCompat.compatible ? "rgba(74,222,128,0.05)" : "rgba(248,113,113,0.05)")
                      : "rgba(255,255,255,0.02)",
                    border: moonCompat.hasMoonRules
                      ? `1px solid ${moonCompat.compatible ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`
                      : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {/* Report Title */}
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4" style={{ color: G.text }} />
                    <span className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: G.text }}>
                      {t.reportTitle}
                    </span>
                  </div>

                  {/* No Moon Rule Case */}
                  {!moonCompat.hasMoonRules && (
                    <div className="rounded-lg p-3" style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Minus className="w-4 h-4" style={{ color: G.neutral }} />
                        <span className="font-inter text-sm font-bold" style={{ color: "#fff" }}>
                          {t.noRuleTitle}
                        </span>
                      </div>
                      <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                        {t.noRuleMsg}
                      </p>
                    </div>
                  )}

                  {/* Moon Rules Exist — Evaluation */}
                  {moonCompat.hasMoonRules && (
                    <>
                      {/* Evaluation Checks */}
                      <div className="space-y-1.5">
                        <p className="font-inter text-[9px] uppercase tracking-widest mb-1" style={{ color: G.dim }}>
                          {t.evaluation}
                        </p>
                        {moonCompat.checks.map((check, idx) => (
                          <MoonCheckRow key={idx} check={check} lang={lang} t={t} />
                        ))}
                      </div>

                      {/* Applicable Manuscript Rules */}
                      {moonCompat.citations?.length > 0 && (
                        <div className="rounded-lg p-2.5" style={{
                          background: "rgba(74,222,128,0.04)",
                          border: "1px solid rgba(74,222,128,0.15)",
                        }}>
                          <p className="font-inter text-[9px] uppercase tracking-widest mb-1.5" style={{ color: "rgba(74,222,128,0.60)" }}>
                            {t.msRules}
                          </p>
                          <div className="space-y-1">
                            {moonCompat.citations.map((c, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="font-inter text-[9px] px-1.5 py-0.5 rounded flex-shrink-0" style={{
                                  background: "rgba(74,222,128,0.10)",
                                  color: "rgba(74,222,128,0.60)",
                                  border: "1px solid rgba(74,222,128,0.20)",
                                }}>{c.source}</span>
                                <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.50)" }}>{c.summary || c.category}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Final Result */}
                      <div className="rounded-lg p-3" style={{
                        background: moonCompat.compatible ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
                        border: `1px solid ${moonCompat.compatible ? "rgba(74,222,128,0.30)" : "rgba(248,113,113,0.30)"}`,
                      }}>
                        <div className="flex items-center gap-2 mb-1">
                          {moonCompat.compatible
                            ? <Check className="w-4 h-4" style={{ color: G.pass }} />
                            : <AlertTriangle className="w-4 h-4" style={{ color: G.fail }} />}
                          <span className="font-inter text-[9px] uppercase tracking-widest font-bold" style={{
                            color: moonCompat.compatible ? G.pass : G.fail,
                          }}>
                            {t.finalResult}
                          </span>
                        </div>
                        <p className="font-inter text-sm font-bold" style={{
                          color: moonCompat.compatible ? G.pass : G.fail,
                        }}>
                          {moonCompat.compatible ? t.compatible : t.notCompatible}
                        </p>
                        {!moonCompat.compatible && (
                          <p className="font-inter text-xs mt-1" style={{ color: "rgba(255,255,255,0.60)" }}>
                            {t.waitRecommendation}: {lang === "ml" ? "ചന്ദ്രൻ മാറുന്നതുവരെ കാത്തിരിക്കുക." : "Wait until the Moon conditions change."}
                          </p>
                        )}
                      </div>

                      {/* Find Next Suitable Moon Time — Toggle */}
                      <button
                        onClick={() => setFindNextEnabled(!findNextEnabled)}
                        className="w-full rounded-lg py-2.5 font-inter text-xs font-bold transition flex items-center justify-center gap-2"
                        style={{
                          background: findNextEnabled ? "rgba(96,165,250,0.15)" : "transparent",
                          border: `1px solid ${findNextEnabled ? "rgba(96,165,250,0.40)" : G.border}`,
                          color: findNextEnabled ? "rgba(96,165,250,0.95)" : G.dim,
                        }}
                      >
                        <Search className="w-3.5 h-3.5" />
                        {t.findNextToggle}
                      </button>

                      {/* Next Suitable Time Result */}
                      {findNextEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-2"
                        >
                          {nextTime ? (
                            <div className="rounded-lg p-3" style={{
                              background: "rgba(74,222,128,0.06)",
                              border: "1px solid rgba(74,222,128,0.25)",
                            }}>
                              <div className="flex items-center gap-2 mb-2">
                                <CalendarClock className="w-4 h-4" style={{ color: G.pass }} />
                                <span className="font-inter text-[9px] uppercase tracking-widest font-bold" style={{ color: G.pass }}>
                                  {t.nextOpportunity}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <MoonDataRow label={t.date} value={nextTime.date} />
                                <MoonDataRow label={t.bestDay} value={lang === "ml" ? nextTime.dayName : nextTime.dayName} />
                                <MoonDataRow label={t.bestSaat} value={`#${nextTime.bestHour} (${nextTime.bestHourPlanet})`} />
                                <MoonDataRow label={t.phase} value={`${t.day} ${nextTime.lunarDay} (${nextTime.moonPhaseName})`} />
                                <MoonDataRow label={t.zodiacSign} value={nextTime.moonSign ? `${nextTime.moonSignSymbol || ""} ${nextTime.moonSign}` : "—"} />
                                <MoonDataRow label={t.mansion} value={nextTime.moonMansion ? (nextTime.moonMansionArabic ? `${nextTime.moonMansionArabic} (${nextTime.moonMansion})` : nextTime.moonMansion) : "—"} />
                              </div>
                              <div className="mt-2 pt-2 flex items-center justify-between" style={{ borderTop: "1px solid rgba(74,222,128,0.15)" }}>
                                <span className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
                                  {t.confidence}
                                </span>
                                <span className="font-inter text-sm font-bold" style={{ color: G.pass }}>
                                  {t.excellent} ({nextTime.confidence}%)
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="rounded-lg p-3 text-center" style={{
                              background: "rgba(248,113,113,0.05)",
                              border: "1px solid rgba(248,113,113,0.20)",
                            }}>
                              <p className="font-inter text-xs" style={{ color: "rgba(248,113,113,0.70)" }}>
                                {t.noNextFound}
                              </p>
                            </div>
                          )}

                          {/* Optional Moon Filters */}
                          <div className="rounded-lg p-2.5" style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}>
                            <p className="font-inter text-[9px] uppercase tracking-widest mb-1.5" style={{ color: G.dim }}>
                              {t.filters}
                            </p>
                            <div className="space-y-1">
                              <FilterCheckbox
                                label={t.requireWaxing}
                                checked={filters.moon === "waxing"}
                                onChange={(checked) => setFilters(prev => ({ ...prev, moon: checked ? "waxing" : undefined }))}
                              />
                              <FilterCheckbox
                                label={t.requireWaning}
                                checked={filters.moon === "waning"}
                                onChange={(checked) => setFilters(prev => ({ ...prev, moon: checked ? "waning" : undefined }))}
                              />
                              <FilterCheckbox
                                label={t.ignoreMoon}
                                checked={!filters.moon}
                                onChange={() => setFilters({})}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </>
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
function MoonCheckRow({ check, lang, t }) {
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
              {check.currentValue}
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

// ── Filter Checkbox ──
function FilterCheckbox({ label, checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-center gap-2 p-1.5 rounded transition text-left"
      style={{
        background: checked ? "rgba(96,165,250,0.08)" : "transparent",
      }}
    >
      <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{
        border: `1px solid ${checked ? "rgba(96,165,250,0.50)" : G.border}`,
        background: checked ? "rgba(96,165,250,0.20)" : "transparent",
      }}>
        {checked && <Check className="w-3 h-3" style={{ color: "rgba(96,165,250,0.95)" }} />}
      </div>
      <span className="font-inter text-[11px]" style={{ color: checked ? "rgba(96,165,250,0.90)" : "rgba(255,255,255,0.55)" }}>
        {label}
      </span>
    </button>
  );
}