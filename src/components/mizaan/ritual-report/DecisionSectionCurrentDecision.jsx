// ═══════════════════════════════════════════════════════════════
// SECTION 1 — CURRENT RITUAL DECISION
// Shows: current selections + verdict + compatibility % + WHY
// ═══════════════════════════════════════════════════════════════
import { CheckCircle2, XCircle, AlertCircle, Scale } from "lucide-react";
import { G, T, translatePlanet, translateDay, MIZAN_DAY_NAMES, DAY_KEY_BY_INDEX } from "./shared";

function cleanReason(text) {
  if (!text) return "";
  return String(text)
    .replace(/Source\s*:.*?(\.|$)/gi, "")
    .replace(/Havâss[^\s]*\s*Derinlikleri[^\n]*/gi, "")
    .replace(/Astrology Clock\s*:/gi, "")
    .split(/\n/)[0]
    .trim();
}

function computeCompatibility(analysis) {
  const req = analysis?.req || {};
  const liveNow = analysis?.liveNow || {};
  const astro = analysis?.astroClockStatus || {};
  const planetLC = String(liveNow.kawkab || liveNow.planetaryHour || "").toLowerCase();
  const dayKey = DAY_KEY_BY_INDEX[astro.activeWeekday];
  let s = 50;
  if (req.days?.includes(dayKey)) s += 20;
  if (req.hours?.some((p) => p.toLowerCase() === planetLC)) s += 20;
  if (req.nightRequired === true && liveNow.laylNahar === "Layl") s += 10;
  if (req.enemyPlanets?.some((p) => p.toLowerCase() === planetLC)) s -= 25;
  if (req.worstHours?.some((p) => p.toLowerCase() === planetLC)) s -= 15;
  if (req.worstDays?.includes(dayKey)) s -= 15;
  return Math.max(0, Math.min(100, s));
}

function SelectionRow({ label, value, lang }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <span className="font-inter text-[10px] uppercase tracking-wider" style={{ color: G.dim }}>
        {label}
      </span>
      <span className={lang === "ml" ? "font-malayalam text-xs font-bold" : "font-inter text-xs font-bold"} style={{ color: "#fff" }}>
        {value}
      </span>
    </div>
  );
}

export default function DecisionSectionCurrentDecision({ analysis, resolvedPurpose, lang }) {
  const verdict = analysis?.verdict || "Not Suitable";
  const canPerform = analysis?.canPerformToday || "No";
  const breakdown = analysis?.selectionAnalysis?.decisionBreakdown || [];
  const failedItems = breakdown.filter((b) => b.status === "fail");
  const acceptanceReasons = analysis?.currentSaatAnalysis?.acceptanceReasons || [];
  const rejectionReasons = analysis?.currentSaatAnalysis?.rejectionReasons || [];

  // Three-state verdict
  let displayVerdict, verdictColor, VerdictIcon, verdictEmoji;
  if (verdict === "Suitable" && failedItems.length === 0) {
    displayVerdict = "Suitable"; verdictColor = "#4ADE80"; VerdictIcon = CheckCircle2; verdictEmoji = "✅";
  } else if (verdict === "Suitable" && failedItems.length > 0) {
    displayVerdict = "Partially Suitable"; verdictColor = "#FBBF24"; VerdictIcon = AlertCircle; verdictEmoji = "⚠";
  } else if (canPerform === "Limited") {
    displayVerdict = "Partially Suitable"; verdictColor = "#FBBF24"; VerdictIcon = AlertCircle; verdictEmoji = "⚠";
  } else {
    displayVerdict = "Not Suitable"; verdictColor = "#F87171"; VerdictIcon = XCircle; verdictEmoji = "❌";
  }

  const verdictLabelMl = {
    Suitable: "അനുയോജ്യം", "Partially Suitable": "ഭാഗികമായി അനുയോജ്യം", "Not Suitable": "അനുയോജ്യമല്ല",
  };

  const compatPct = computeCompatibility(analysis);
  const liveNow = analysis?.liveNow || {};
  const moonPhase = analysis?.moonPhase || {};
  const purposeText = (lang === "ml" ? resolvedPurpose?.interpretation_ml : resolvedPurpose?.interpretation_en) || analysis?.ritualSemanticMl || analysis?.ritualType || "";

  // WHY from database
  const reasons = displayVerdict === "Suitable" ? acceptanceReasons : displayVerdict === "Partially Suitable" ? [...acceptanceReasons, ...rejectionReasons] : rejectionReasons;
  const whyText = reasons.map((r) => cleanReason(lang === "ml" && r.text_ml ? r.text_ml : r.text_en)).filter(Boolean).slice(0, 2).join(" ");

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: `1px solid ${G.border}`, boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)" }}>
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
          <Scale className="w-5 h-5" style={{ color: G.text }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>1</span>
          <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {T("Current Ritual Decision", "നിലവിലെ ആചാര തീരുമാനം", lang)}
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {/* Selections */}
        <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <SelectionRow label={T("Purpose", "ലക്ഷ്യം", lang)} value={purposeText} lang={lang} />
          <SelectionRow label={T("Selected Day", "തിരഞ്ഞെടുത്ത ദിവസം", lang)} value={translateDay(liveNow.day, lang)} lang={lang} />
          <SelectionRow label={T("Selected Saat", "തിരഞ്ഞെടുത്ത സഅാത്", lang)} value={`#${liveNow.saat || "—"}`} lang={lang} />
          <SelectionRow label={T("Selected Planet", "തിരഞ്ഞെടുത്ത ഗ്രഹം", lang)} value={translatePlanet(liveNow.kawkab || liveNow.planetaryHour, lang)} lang={lang} />
          <SelectionRow label={T("Selected Kawkab", "തിരഞ്ഞെടുത്ത കവ്കബ്", lang)} value={translatePlanet(liveNow.kawkab, lang)} lang={lang} />
          {moonPhase.moonSign && (
            <SelectionRow label={T("Selected Zodiac", "തിരഞ്ഞെടുത്ത രാശി", lang)} value={`${moonPhase.moonSignSymbol || ""} ${lang === "ml" ? (moonPhase.moonSignMl || moonPhase.moonSign) : moonPhase.moonSign}`} lang={lang} />
          )}
        </div>

        {/* Verdict + Compatibility */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 rounded-xl p-4" style={{ background: `${verdictColor}08`, border: `1px solid ${verdictColor}30` }}>
            <div className="flex items-center gap-3">
              <VerdictIcon className="w-7 h-7 flex-shrink-0" style={{ color: verdictColor }} />
              <span className="font-inter text-lg font-bold" style={{ color: verdictColor }}>
                {verdictEmoji} {lang === "ml" ? verdictLabelMl[displayVerdict] : displayVerdict}
              </span>
            </div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <p className="font-inter text-2xl font-bold" style={{ color: compatPct >= 70 ? "#4ADE80" : compatPct >= 50 ? "#FBBF24" : "#F87171" }}>
              {compatPct}%
            </p>
            <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>
              {T("Compatibility", "പൊരുത്തം", lang)}
            </p>
          </div>
        </div>

        {/* WHY */}
        <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color: G.dim }}>
            {T("Why", "കാരണം", lang)}
          </p>
          {whyText ? (
            <p className={lang === "ml" ? "font-malayalam text-xs leading-relaxed" : "font-inter text-xs leading-relaxed"} style={{ color: "rgba(255,255,255,0.75)" }}>
              {whyText}
            </p>
          ) : (
            <p className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"} style={{ color: "rgba(255,255,255,0.60)" }}>
              {T("No timing data found for this purpose in the uploaded database.", "അപ്ലോഡ് ചെയ്ത ഡാറ്റാബേസിൽ ഈ ലക്ഷ്യത്തിനായി സമയ ഡാറ്റായില്ല.", lang)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}