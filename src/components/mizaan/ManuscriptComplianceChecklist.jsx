// ═══════════════════════════════════════════════════════════════
// MANUSCRIPT COMPLIANCE CHECKLIST — ✓/✗ per-condition report
// ═══════════════════════════════════════════════════════════════
// Renders the user's current Mizan selections against manuscript rules
// in a strict ✓/✗ checklist format. Every item cites the manuscript
// source. "No manuscript rule exists for this condition." is shown
// when no rule covers a dimension — never invented.
//
// Read-only. Never modifies any Mizan, calculation, or engine.
// ═══════════════════════════════════════════════════════════════
import { motion } from "framer-motion";
import { Check, X, Minus, Target, AlertTriangle, TrendingUp, ArrowUpCircle, Ban } from "lucide-react";
import { tStr } from "../../lib/ritualTimingI18n";

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

// Dimension labels for the recommendation lines (component-internal, not from engine)
const REC_LABELS = {
  weekday: { en: "Weekday", ml: "ദിവസം" },
  hour: { en: "Planetary Hour", ml: "ഗ്രഹ മണിക്കൂർ" },
  dayNight: { en: "Day / Night", ml: "പകൽ / രാത്രി" },
  time: { en: "Time", ml: "സമയം" },
};

export default function ManuscriptComplianceChecklist({ analysis, lang, onApplyRecommendation }) {
  const sa = analysis?.selectionAnalysis;
  if (!sa || sa.purposeRequired) return null;

  const breakdown = sa.decisionBreakdown || [];
  const failed = breakdown.filter((b) => b.status === "fail");
  const passed = breakdown.filter((b) => b.status === "pass");
  const neutral = breakdown.filter((b) => b.status === "neutral");

  const compatibility = analysis.confidenceScore || 0;
  const successPotential = analysis.confidenceScore || 0;
  const estimated = analysis.estimatedCompatibilityAfterChanges || compatibility;
  const hasImprovements = estimated > compatibility;

  // Weakness — summarize the first failed condition
  // item.label is already localized by localizeSelectionAnalysis
  const weaknessText = failed.length > 0
    ? (lang === "ml"
      ? `${failed[0].label || failed[0].dimension} പൊരുത്തപ്പെടുന്നില്ല.`
      : `${failed[0].label || failed[0].dimension} does not match.`)
    : (lang === "ml" ? "ദുർബലത കണ്ടെത്തിയില്ല." : "No weakness detected.");

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        border: `1px solid ${G.border}`,
        boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)",
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
          background: "linear-gradient(135deg, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.06) 100%)",
          border: `1px solid ${G.borderHi}`,
        }}>
          <Target className="w-5 h-5" style={{ color: G.text }} />
        </div>
        <div>
          <h3 className="font-inter text-sm font-bold tracking-wide" style={{ color: "#fff" }}>
            {tStr("complianceChecklist", lang)}
          </h3>
          <p className="font-inter text-[10px]" style={{ color: G.dim }}>
            {lang === "ml" ? "കൈയെഴുത്തുപ്രതി നിയമങ്ങൾ മാത്രം — കണ്ടുപിടിക്കപ്പെട്ട നിയമങ്ങളൊന്നുമില്ല" : "Manuscript rules only — no invented rules"}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* ── Ritual Category Identification ── */}
        <div className="rounded-lg p-3" style={{
          background: "linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.03) 100%)",
          border: `1px solid ${G.borderHi}`,
        }}>
          <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
            <span style={{ color: G.dim }}>{tStr("ritualBelongs", lang)}: </span>
            <span className="font-bold" style={{ color: G.text }}>
              {lang === "ml" ? (analysis.ritualSemanticMl || analysis.ritualType) : analysis.ritualType}
            </span>
          </p>
        </div>

        {/* ── ✓/✗ Checklist ── */}
        <div className="space-y-1.5">
          {breakdown.map((item, idx) => (
            <ChecklistRow key={idx} item={item} lang={lang} />
          ))}
        </div>

        {/* ── Summary Metrics ── */}
        <div className="grid grid-cols-2 gap-2">
          <MetricBox
            label={tStr("overallCompatibility", lang)}
            value={`${compatibility}%`}
            color={compatibility >= 70 ? G.pass : compatibility >= 50 ? "#FBBF24" : G.fail}
          />
          <MetricBox
            label={tStr("successPotential", lang)}
            value={`${successPotential}%`}
            color={successPotential >= 70 ? G.pass : successPotential >= 50 ? "#FBBF24" : G.fail}
          />
        </div>

        {/* ── Weakness ── */}
        <div className="rounded-lg p-3" style={{
          background: failed.length > 0 ? "rgba(248,113,113,0.06)" : "rgba(74,222,128,0.06)",
          border: `1px solid ${failed.length > 0 ? "rgba(248,113,113,0.25)" : "rgba(74,222,128,0.25)"}`,
        }}>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: failed.length > 0 ? G.fail : G.pass }} />
            <div>
              <p className="font-inter text-[9px] uppercase tracking-wider font-bold" style={{ color: failed.length > 0 ? G.fail : G.pass }}>
                {tStr("weakness", lang)}
              </p>
              <p className="font-inter text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.70)" }}>
                {weaknessText}
              </p>
            </div>
          </div>
        </div>

        {/* ── FORBIDDEN WARNING — STEP 7 ── */}
        {sa.forbidden && (
          <div className="rounded-lg p-3" style={{
            background: "rgba(248,113,113,0.10)",
            border: "1px solid rgba(248,113,113,0.35)",
          }}>
            <div className="flex items-center gap-2 mb-2">
              <Ban className="w-4 h-4" style={{ color: G.fail }} />
              <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: G.fail }}>
                {lang === "ml" ? "ഈ സമയം ഈ ലക്ഷ്യത്തിന് വിലക്കപ്പെട്ടതാണ്" : "FORBIDDEN FOR THIS PURPOSE"}
              </span>
            </div>
            <p className={`text-xs mb-2 ${lang === "ml" ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.70)" }}>
              {lang === "ml"
                ? "കൈയെഴുത്തുപ്രതി പ്രകാരം ഈ സമയത്തിൽ ഈ ആചാരം അനുഷ്ഠിക്കരുത്. താഴെ കാണിക്കുന്ന ശുപാർശ പ്രയോഗിക്കുക."
                : "The manuscript forbids this timing for this Purpose. Apply the recommendation below."}
            </p>
          </div>
        )}

        {/* ── Recommendation + Estimated After Changes ── */}
        {hasImprovements && sa.bestAlternative && (
          <div className="rounded-lg p-3" style={{
            background: "rgba(74,222,128,0.06)",
            border: "1px solid rgba(74,222,128,0.25)",
          }}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4" style={{ color: G.pass }} />
              <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: G.pass }}>
                {tStr("recommendation", lang)}
              </span>
            </div>
            <p className="font-inter text-[9px] uppercase tracking-wider mb-1" style={{ color: G.dim }}>
              {tStr("changeTo", lang)}:
            </p>
            <div className="space-y-1 mb-2">
              {sa.bestAlternative.day && (
                <RecLine label={REC_LABELS.weekday[lang]} value={sa.bestAlternative.day}
                  onClick={sa.bestAlternative.dayValue && onApplyRecommendation ? () => onApplyRecommendation("days", sa.bestAlternative.dayValue) : null} />
              )}
              {sa.bestAlternative.hour && (
                <RecLine label={REC_LABELS.hour[lang]} value={sa.bestAlternative.hour}
                  onClick={sa.bestAlternative.hourValue && onApplyRecommendation ? () => onApplyRecommendation("hour", sa.bestAlternative.hourValue) : null} />
              )}
              {sa.bestAlternative.dayNight && (
                <RecLine label={REC_LABELS.dayNight[lang]} value={sa.bestAlternative.dayNight}
                  onClick={sa.bestAlternative.dayNightValue && onApplyRecommendation ? () => onApplyRecommendation("dayNight", sa.bestAlternative.dayNightValue) : null} />
              )}
              {sa.bestAlternative.timeWindow && <RecLine label={REC_LABELS.time[lang]} value={`${sa.bestAlternative.timeWindow}${sa.bestAlternative.dayName ? ` (${sa.bestAlternative.dayName})` : ""}`} />}
            </div>
            <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid rgba(74,222,128,0.15)" }}>
              <div className="flex items-center gap-1.5">
                <ArrowUpCircle className="w-3.5 h-3.5" style={{ color: G.pass }} />
                <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: G.dim }}>
                  {tStr("estimatedAfter", lang)}
                </span>
              </div>
              <span className="font-inter text-base font-bold" style={{ color: G.pass }}>
                {estimated}%
              </span>
            </div>
          </div>
        )}

        {/* ── All optimal banner ── */}
        {failed.length === 0 && (
          <div className="rounded-lg p-3 text-center" style={{
            background: "rgba(74,222,128,0.08)",
            border: "1px solid rgba(74,222,128,0.30)",
          }}>
            <p className="font-inter text-sm font-bold" style={{ color: G.pass }}>
              {lang === "ml" ? "എല്ലാ കൈയെഴുത്തുപ്രതി നിയമങ്ങളും പാലിക്കപ്പെട്ടു." : "All manuscript rules are satisfied."}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Single ✓/✗ Row ──
// item.label, item.reason, item.currentValue, item.recommended are already
// localized by localizeSelectionAnalysis (ritualTimingI18n.js). Use directly.
function ChecklistRow({ item, lang }) {
  const isPass = item.status === "pass";
  const isFail = item.status === "fail";
  const isNeutral = item.status === "neutral";

  const icon = isPass ? <Check className="w-4 h-4" /> : isFail ? <X className="w-4 h-4" /> : <Minus className="w-3.5 h-3.5" />;
  const color = isPass ? G.pass : isFail ? G.fail : G.neutral;
  // item.label is already localized by localizeSelectionAnalysis
  const label = item.label || item.dimension;

  return (
    <div className="rounded-lg p-2.5" style={{
      background: isPass ? "rgba(74,222,128,0.04)" : isFail ? "rgba(248,113,113,0.04)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${isPass ? "rgba(74,222,128,0.20)" : isFail ? "rgba(248,113,113,0.20)" : "rgba(255,255,255,0.06)"}`,
    }}>
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-0.5" style={{ color }}>{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-bold ${lang === "ml" ? "font-malayalam" : "font-inter"}`} style={{ color: "#fff" }}>{label}</span>
            <span className={`text-[10px] ${lang === "ml" ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.45)" }}>
              {item.currentValue}
            </span>
          </div>
          <p className={`text-[11px] leading-snug ${lang === "ml" ? "font-malayalam" : "font-inter"}`} style={{ color: "rgba(255,255,255,0.65)" }}>
            {item.reason}
          </p>
          {item.source && item.source !== "null" && (
            <p className="font-inter text-[9px] mt-0.5" style={{ color: G.dim }}>
              {lang === "ml" ? "ഉറവിടം" : "Source"}: {item.source}
            </p>
          )}
          {isFail && item.recommended && (
            <p className={`text-[10px] mt-0.5 font-bold ${lang === "ml" ? "font-malayalam" : "font-inter"}`} style={{ color: G.pass }}>
              {lang === "ml" ? "ശുപാർശ" : "Recommended"}: {item.recommended}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Metric Box ──
function MetricBox({ label, value, color }) {
  return (
    <div className="rounded-lg p-2.5" style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid rgba(212,175,55,0.20)`,
    }}>
      <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{label}</p>
      <p className="font-inter text-lg font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

// ── Recommendation Line ──
function RecLine({ label, value, onClick }) {
  if (onClick) {
    return (
      <button onClick={onClick} className="w-full flex items-center gap-2 text-left rounded-lg p-1.5 transition-opacity hover:opacity-80" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)" }}>
        <span className="font-inter text-[10px] uppercase tracking-wider flex-shrink-0" style={{ color: G.dim, minWidth: 70 }}>{label}:</span>
        <span className="font-inter text-xs font-bold flex-1" style={{ color: G.pass }}>{value}</span>
        <span className="font-inter text-[9px] uppercase tracking-wider flex-shrink-0" style={{ color: G.dim }}>Apply →</span>
      </button>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="font-inter text-[10px] uppercase tracking-wider flex-shrink-0" style={{ color: G.dim, minWidth: 70 }}>{label}:</span>
      <span className="font-inter text-xs font-bold" style={{ color: G.pass }}>{value}</span>
    </div>
  );
}