import { Lightbulb, ArrowRight } from "lucide-react";
import { G, T, translatePlanet, translateDay, MIZAN_DAY_NAMES, DAY_KEY_BY_INDEX, saatDisplayNum } from "../shared";
import { computeCompat, compatColor } from "./compatibility";

export default function SectionHowToImprove({ analysis, lang }) {
  const req = analysis?.req || {};
  const liveNow = analysis?.liveNow || {};
  const astro = analysis?.astroClockStatus || {};
  const bestWindows = (analysis?.bestWindowsToday || []).filter(w => w.score > 0);

  const currentCompat = computeCompat(analysis).final;

  // 1. Change Day — use first recommended day
  const bestDayKey = req.days?.[0] || null;
  const changeDayCompat = bestDayKey ? computeCompat(analysis, { dayKey: bestDayKey }).final : null;
  const changeDayLabel = bestDayKey ? translateDay(MIZAN_DAY_NAMES[bestDayKey], lang) : null;

  // 2. Change Saat — use best remaining window's planet
  const bestWindow = bestWindows.length > 0
    ? bestWindows.slice().sort((a, b) => (b.score || 0) - (a.score || 0))[0]
    : null;
  const changeSaatCompat = bestWindow ? computeCompat(analysis, { planetLC: String(bestWindow.planet || "").toLowerCase() }).final : null;
  const changeSaatLabel = bestWindow ? `#${saatDisplayNum(bestWindow.hourNumber, bestWindow.period)} (${translatePlanet(bestWindow.planet, lang)})` : null;

  // 3. Wait for Night — find best night window
  const bestNightWindow = bestWindows.find(w => w.period === "night");
  const waitNightCompat = bestNightWindow ? computeCompat(analysis, { planetLC: String(bestNightWindow.planet || "").toLowerCase() }).final : null;
  const waitNightLabel = bestNightWindow ? `#${saatDisplayNum(bestNightWindow.hourNumber, "night")} (${translatePlanet(bestNightWindow.planet, lang)})` : null;

  // 4. Wait for Day — find best day window
  const bestDayWindow = bestWindows.find(w => w.period === "day");
  const waitDayCompat = bestDayWindow ? computeCompat(analysis, { planetLC: String(bestDayWindow.planet || "").toLowerCase() }).final : null;
  const waitDayLabel = bestDayWindow ? `#${saatDisplayNum(bestDayWindow.hourNumber, "day")} (${translatePlanet(bestDayWindow.planet, lang)})` : null;

  // Build improvement options, sorted by improvement amount
  const improvements = [];
  if (changeDayCompat !== null && changeDayCompat > currentCompat) {
    improvements.push({ key: "day", label: T("Change Day", "ദിവസം മാറ്റുക", lang), detail: changeDayLabel, newPct: changeDayCompat, delta: changeDayCompat - currentCompat });
  }
  if (changeSaatCompat !== null && changeSaatCompat > currentCompat) {
    improvements.push({ key: "saat", label: T("Change Saat", "സഅാത് മാറ്റുക", lang), detail: changeSaatLabel, newPct: changeSaatCompat, delta: changeSaatCompat - currentCompat });
  }
  if (waitNightCompat !== null && waitNightCompat > currentCompat) {
    improvements.push({ key: "night", label: T("Wait until Night", "രാത്രി വരെ കാത്തിരിക്കുക", lang), detail: waitNightLabel, newPct: waitNightCompat, delta: waitNightCompat - currentCompat });
  }
  if (waitDayCompat !== null && waitDayCompat > currentCompat) {
    improvements.push({ key: "day", label: T("Wait until Day", "പകൽ വരെ കാത്തിരിക്കുക", lang), detail: waitDayLabel, newPct: waitDayCompat, delta: waitDayCompat - currentCompat });
  }
  improvements.sort((a, b) => b.delta - a.delta);

  if (improvements.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: `1px solid ${G.border}`, boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)" }}>
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
          <Lightbulb className="w-5 h-5" style={{ color: G.text }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>5</span>
          <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {T("How to Improve", "എങ്ങനെ മെച്ചപ്പെടുത്താം", lang)}
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-2">
        {/* Current compat */}
        <div className="flex items-center justify-between rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <span className="font-inter text-[10px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Current", "നിലവിൽ", lang)}</span>
          <span className="font-inter text-lg font-bold" style={{ color: compatColor(currentCompat) }}>{currentCompat}%</span>
        </div>

        {/* Improvement options */}
        {improvements.map((imp, idx) => {
          const c = compatColor(imp.newPct);
          const isBest = idx === 0;
          return (
            <div key={imp.key + idx} className="rounded-lg p-3 flex items-center gap-3" style={{
              background: isBest ? "rgba(74,222,128,0.06)" : G.bg,
              border: `1px solid ${isBest ? "rgba(74,222,128,0.20)" : G.border}`,
            }}>
              {isBest && <span className="font-inter text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: "rgba(74,222,128,0.15)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.20)" }}>{T("BEST", "മികച്ചത്", lang)}</span>}
              <div className="flex-1 min-w-0">
                <p className={lang === "ml" ? "font-malayalam text-xs font-bold" : "font-inter text-xs font-bold"} style={{ color: "#fff" }}>{imp.label}</p>
                {imp.detail && (
                  <p className="font-inter text-[10px]" style={{ color: G.dim }}>
                    <ArrowRight className="w-2.5 h-2.5 inline" /> {imp.detail}
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <span className="font-inter text-sm font-bold" style={{ color: c }}>{imp.newPct}%</span>
                <span className="font-inter text-[10px] ml-1" style={{ color: "#4ADE80" }}>+{imp.delta}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}