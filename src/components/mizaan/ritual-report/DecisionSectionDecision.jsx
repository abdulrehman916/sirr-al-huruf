// ═══════════════════════════════════════════════════════════════
// SECTION 2 — DECISION
// ✅ Suitable / ⚠ Partially Suitable / ❌ Not Suitable
// ═══════════════════════════════════════════════════════════════
import { CheckCircle2, XCircle, AlertCircle, Scale } from "lucide-react";
import { G, T } from "./shared";

export default function DecisionSectionDecision({ analysis, lang }) {
  const verdict = analysis?.verdict || "Not Suitable";
  const canPerform = analysis?.canPerformToday || "No";
  const breakdown = analysis?.selectionAnalysis?.decisionBreakdown || [];
  const failedItems = breakdown.filter((b) => b.status === "fail");

  let displayVerdict, verdictColor, VerdictIcon, emoji;
  if (verdict === "Suitable" && failedItems.length === 0) {
    displayVerdict = "Suitable"; verdictColor = "#4ADE80"; VerdictIcon = CheckCircle2; emoji = "✅";
  } else if (verdict === "Suitable" && failedItems.length > 0) {
    displayVerdict = "Partially Suitable"; verdictColor = "#FBBF24"; VerdictIcon = AlertCircle; emoji = "⚠";
  } else if (canPerform === "Limited") {
    displayVerdict = "Partially Suitable"; verdictColor = "#FBBF24"; VerdictIcon = AlertCircle; emoji = "⚠";
  } else {
    displayVerdict = "Not Suitable"; verdictColor = "#F87171"; VerdictIcon = XCircle; emoji = "❌";
  }

  const labelMl = { Suitable: "അനുയോജ്യം", "Partially Suitable": "ഭാഗികമായി അനുയോജ്യം", "Not Suitable": "അനുയോജ്യമല്ല" };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: `1px solid ${G.border}`, boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)" }}>
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
          <Scale className="w-5 h-5" style={{ color: G.text }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>2</span>
          <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {T("Decision", "തീരുമാനം", lang)}
          </h3>
        </div>
      </div>
      <div className="p-4">
        <div className="rounded-xl p-5 flex items-center gap-4" style={{ background: `${verdictColor}08`, border: `1px solid ${verdictColor}30` }}>
          <VerdictIcon className="w-10 h-10 flex-shrink-0" style={{ color: verdictColor }} />
          <span className={lang === "ml" ? "font-malayalam text-xl font-bold" : "font-inter text-xl font-bold"} style={{ color: verdictColor }}>
            {emoji} {lang === "ml" ? labelMl[displayVerdict] : displayVerdict}
          </span>
        </div>
      </div>
    </div>
  );
}