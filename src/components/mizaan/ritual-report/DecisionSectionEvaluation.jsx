// ═══════════════════════════════════════════════════════════════
// SECTION 1 — CURRENT RITUAL EVALUATION
// Verdict: Suitable / Partially Suitable / Not Suitable
// Explanation from active rule database (acceptanceReasons / rejectionReasons)
// ═══════════════════════════════════════════════════════════════
import { CheckCircle2, XCircle, AlertCircle, Scale, Target } from "lucide-react";
import { G, T } from "./shared";

function cleanReason(text) {
  if (!text) return "";
  return String(text)
    .replace(/Source\s*:.*?(\.|$)/gi, "")
    .replace(/Havâss[^\s]*\s*Derinlikleri[^\n]*/gi, "")
    .replace(/Astrology Clock\s*:/gi, "")
    .replace(/\n---\n/g, "\n")
    .split(/\n/)[0]
    .trim();
}

export default function DecisionSectionEvaluation({ analysis, resolvedPurpose, lang }) {
  const verdict = analysis?.verdict || "Not Suitable";
  const canPerformToday = analysis?.canPerformToday || "No";
  const breakdown = analysis?.selectionAnalysis?.decisionBreakdown || [];
  const failedItems = breakdown.filter((b) => b.status === "fail");
  const acceptanceReasons = analysis?.currentSaatAnalysis?.acceptanceReasons || [];
  const rejectionReasons = analysis?.currentSaatAnalysis?.rejectionReasons || [];

  // Derive three-state verdict
  let displayVerdict, verdictColor, VerdictIcon;
  if (verdict === "Suitable" && failedItems.length === 0) {
    displayVerdict = "Suitable";
    verdictColor = "#4ADE80";
    VerdictIcon = CheckCircle2;
  } else if (verdict === "Suitable" && failedItems.length > 0) {
    displayVerdict = "Partially Suitable";
    verdictColor = "#FBBF24";
    VerdictIcon = AlertCircle;
  } else if (canPerformToday === "Limited") {
    displayVerdict = "Partially Suitable";
    verdictColor = "#FBBF24";
    VerdictIcon = AlertCircle;
  } else {
    displayVerdict = "Not Suitable";
    verdictColor = "#F87171";
    VerdictIcon = XCircle;
  }

  const purposeText =
    (lang === "ml"
      ? resolvedPurpose?.interpretation_ml
      : resolvedPurpose?.interpretation_en) ||
    analysis?.ritualSemanticMl ||
    analysis?.ritualType ||
    "";

  // Build WHY from database reasons
  const reasons =
    displayVerdict === "Suitable"
      ? acceptanceReasons
      : displayVerdict === "Partially Suitable"
      ? [...acceptanceReasons, ...rejectionReasons]
      : rejectionReasons;

  const whyText = reasons
    .map((r) => cleanReason(lang === "ml" && r.text_ml ? r.text_ml : r.text_en))
    .filter(Boolean)
    .slice(0, 2)
    .join(" ");

  const verdictLabelMl = {
    Suitable: "അനുയോജ്യം",
    "Partially Suitable": "ഭാഗികമായി അനുയോജ്യം",
    "Not Suitable": "അനുയോജ്യമല്ല",
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        border: `1px solid ${G.border}`,
        boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)",
      }}
    >
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}
        >
          <Scale className="w-5 h-5" style={{ color: G.text }} />
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}
          >
            1
          </span>
          <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {T("Current Ritual Evaluation", "നിലവിലെ ആചാര വിലയിരുത്തൽ", lang)}
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {/* Purpose */}
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 flex-shrink-0" style={{ color: G.dim }} />
          <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: G.dim }}>
            {T("Purpose", "ലക്ഷ്യം", lang)}
          </span>
          <span className={lang === "ml" ? "font-malayalam text-xs font-bold truncate" : "font-inter text-xs font-bold truncate"} style={{ color: "#fff" }}>
            {purposeText}
          </span>
        </div>

        {/* Verdict Badge */}
        <div
          className="rounded-xl p-4"
          style={{ background: `${verdictColor}08`, border: `1px solid ${verdictColor}30` }}
        >
          <div className="flex items-center gap-3">
            <VerdictIcon className="w-7 h-7 flex-shrink-0" style={{ color: verdictColor }} />
            <span
              className="font-inter text-lg font-bold px-4 py-1.5 rounded-lg"
              style={{ background: `${verdictColor}20`, border: `1px solid ${verdictColor}50`, color: verdictColor }}
            >
              {lang === "ml" ? verdictLabelMl[displayVerdict] : displayVerdict}
            </span>
          </div>
        </div>

        {/* WHY */}
        {whyText ? (
          <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color: G.dim }}>
              {T("Why", "കാരണം", lang)}
            </p>
            <p
              className={lang === "ml" ? "font-malayalam text-xs leading-relaxed" : "font-inter text-xs leading-relaxed"}
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              {whyText}
            </p>
          </div>
        ) : (
          <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <p className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"} style={{ color: "rgba(255,255,255,0.60)" }}>
              {T(
                "No timing data found for this purpose in the active rule book.",
                "സജീവമായ നിയമ പുസ്തകത്തിൽ ഈ ലക്ഷ്യത്തിനായി സമയ ഡാറ്റായില്ല.",
                lang
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}