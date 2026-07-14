import { Sparkles } from "lucide-react";
import { G, T, saatDisplayNum, translatePlanet, translateDay, computeCompat, compatColor } from "./shared";

// FINAL DECISION — one clear verdict + actionable sentence.
// Derives the action from the analysis: perform now / wait / avoid.
export default function FinalDecision({ analysis, lang }) {
  const verdict = analysis?.verdict || "";
  const suitable = analysis?.selectionAnalysis?.suitable || false;
  const canPerformToday = analysis?.canPerformToday;
  const bestWindow = (analysis?.bestWindowsToday || [])[0];
  const nextOpp = analysis?.nextOpportunity || null;
  const compat = computeCompat(analysis).final;
  const cColor = compatColor(compat);

  let actionEn, actionMl;
  if (suitable && canPerformToday === "Yes") {
    actionEn = "Perform now.";
    actionMl = "ഇപ്പോൾ ചെയ്യുക.";
  } else if (bestWindow) {
    actionEn = `Wait until today's best Saat (#${saatDisplayNum(bestWindow.hourNumber, bestWindow.period)} · ${bestWindow.planet}).`;
    actionMl = `ഇന്നത്തെ മികച്ച സഅാത്തിനായി കാത്തിരിക്കുക (#${saatDisplayNum(bestWindow.hourNumber, bestWindow.period)} · ${translatePlanet(bestWindow.planet, lang)}).`;
  } else if (nextOpp) {
    const when = nextOpp.isToday ? T("later today", "ഇന്ന് പിന്നീട്", lang)
      : nextOpp.daysAhead === 1 ? T("tomorrow", "നാളെ", lang)
      : translateDay(nextOpp.dayName, lang);
    actionEn = `Wait until ${when} — Saat #${saatDisplayNum(nextOpp.hour, nextOpp.period)} (${nextOpp.planet}).`;
    actionMl = `${when} വരെ കാത്തിരിക്കുക — സഅാത് #${saatDisplayNum(nextOpp.hour, nextOpp.period)} (${translatePlanet(nextOpp.planet, lang)}).`;
  } else if (analysis?.selectionAnalysis?.forbidden) {
    actionEn = "Avoid this planetary hour.";
    actionMl = "ഈ ഗ്രഹ മണിക്കൂർ ഒഴിവാക്കുക.";
  } else {
    actionEn = "Avoid today.";
    actionMl = "ഇന്ന് ഒഴിവാക്കുക.";
  }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        border: `1px solid ${cColor}`,
        boxShadow: `0 0 32px ${cColor}22, inset 0 1px 0 rgba(212,175,55,0.08)`,
      }}>
      <div className="flex items-center gap-3 p-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${cColor}14`, border: `1px solid ${cColor}40` }}>
          <Sparkles className="w-6 h-6" style={{ color: cColor }} />
        </div>
        <div className="flex-1">
          <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Final Decision", "അന്തിമ തീരുമാനം", lang)}</p>
          <p className={lang === "ml" ? "font-malayalam text-sm font-bold leading-snug" : "font-inter text-sm font-bold leading-snug"} style={{ color: "#fff" }}>
            {lang === "ml" ? actionMl : actionEn}
          </p>
        </div>
        <div className="text-center flex-shrink-0">
          <p className="font-inter text-2xl font-bold" style={{ color: cColor }}>{compat}%</p>
        </div>
      </div>
    </div>
  );
}