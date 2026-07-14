// ═══════════════════════════════════════════════════════════════
// SECTION 4 — BETTER TIMING
// If suitable: show whether stronger timing exists.
// If unsuitable: best saat today, next saat, best day, best planet.
// ═══════════════════════════════════════════════════════════════
import { CalendarClock, TrendingUp, CheckCircle2 } from "lucide-react";
import { G, T, translatePlanet, translateDay, saatDisplayNum } from "./shared";

function cleanReason(text) {
  if (!text) return "";
  return String(text).replace(/Source\s*:.*?(\.|$)/gi, "").replace(/Astrology Clock\s*:/gi, "").split(/\n/)[0].trim();
}

export default function DecisionSectionBetterTiming({ analysis, lang }) {
  const verdict = analysis?.verdict || "Not Suitable";
  const canPerform = analysis?.canPerformToday || "No";
  const breakdown = analysis?.selectionAnalysis?.decisionBreakdown || [];
  const failedItems = breakdown.filter((b) => b.status === "fail");
  const isSuitable = (verdict === "Suitable" && failedItems.length === 0) || (verdict === "Suitable" && canPerform === "Yes");

  const bestWindows = analysis?.bestWindowsToday || [];
  const betterSaats = analysis?.betterAlternatives?.betterSaats || [];
  const nextLayl = analysis?.betterAlternatives?.nextLayl || null;
  const nextOpp = analysis?.nextOpportunity || null;
  const matchingRules = analysis?.matchingRules || [];

  // If suitable: check for stronger timing
  const strongerWindow = isSuitable && bestWindows.length > 0
    ? bestWindows.slice().sort((a, b) => (b.score || 0) - (a.score || 0))[0]
    : null;
  const currentSaatNum = analysis?.liveNow?.saat;
  const hasStronger = isSuitable && strongerWindow && saatDisplayNum(strongerWindow.hourNumber, strongerWindow.period) !== currentSaatNum;

  if (isSuitable && !hasStronger) {
    return (
      <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: `1px solid ${G.border}`, boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)" }}>
        <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
            <CalendarClock className="w-5 h-5" style={{ color: G.text }} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>4</span>
            <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
              {T("Better Timing", "മികച്ച സമയം", lang)}
            </h3>
          </div>
        </div>
        <div className="p-4">
          <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.25)" }}>
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" style={{ color: "#4ADE80" }} />
            <p className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#4ADE80" }}>
              {T("This is already the strongest available timing today.", "ഇത് ഇന്ന് ലഭ്യമായ ഏറ്റവും ശക്തമായ സമയമാണ്.", lang)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If suitable but stronger exists
  if (isSuitable && hasStronger) {
    const s = strongerWindow;
    const saatNum = saatDisplayNum(s.hourNumber, s.period);
    return (
      <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: `1px solid ${G.border}`, boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)" }}>
        <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
            <TrendingUp className="w-5 h-5" style={{ color: G.text }} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>4</span>
            <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
              {T("Better Timing", "മികച്ച സമയം", lang)}
            </h3>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <div className="rounded-xl p-3" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.25)" }}>
            <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: "#4ADE80" }}>
              {T("Stronger Timing Available", "ശക്തമായ സമയം ലഭ്യം", lang)}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Saat", "സഅാത്", lang)}</p>
                <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>#{saatNum} ({translatePlanet(s.planet, lang)})</p>
              </div>
              <div>
                <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Time", "സമയം", lang)}</p>
                <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{s.startTime} – {s.endTime}</p>
              </div>
            </div>
          </div>
          <p className={lang === "ml" ? "font-malayalam text-xs leading-relaxed" : "font-inter text-xs leading-relaxed"} style={{ color: "rgba(255,255,255,0.65)" }}>
            {T(`Saat #${saatNum} has higher compatibility for your purpose.`, `നിങ്ങളുടെ ലക്ഷ്യത്തിനായി സഅാത് #${saatNum} കൂടുതൽ പൊരുത്തമുള്ളതാണ്.`, lang)}
          </p>
        </div>
      </div>
    );
  }

  // If unsuitable: show best saat today, next saat, best day, best planet
  const sameDayAlt = betterSaats[0] || null;
  const nextSaatAlt = nextLayl || null;
  const betterDayAlt = nextOpp || null;
  const alt = sameDayAlt || nextSaatAlt || betterDayAlt || null;

  if (!alt) {
    return (
      <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: `1px solid ${G.border}`, boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)" }}>
        <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
            <CalendarClock className="w-5 h-5" style={{ color: G.text }} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>4</span>
            <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
              {T("Better Timing", "മികച്ച സമയം", lang)}
            </h3>
          </div>
        </div>
        <div className="p-4">
          <div className="rounded-xl p-4" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.25)" }}>
            <p className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#F87171" }}>
              {T("No better timing found within 14 days.", "14 ദിവസത്തിനുള്ളിൽ മികച്ച സമയമില്ല.", lang)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const priority = sameDayAlt ? 1 : nextSaatAlt ? 2 : 3;
  const priorityLabel = priority === 1
    ? T("Best Saat Today", "ഇന്നത്തെ മികച്ച സഅാത്", lang)
    : priority === 2
    ? T("Next Available Saat", "അടുത്ത ലഭ്യ സഅാത്", lang)
    : T("Best Day", "മികച്ച ദിവസം", lang);

  const isToday = sameDayAlt ? true : (nextSaatAlt?.isToday || nextOpp?.isToday);
  const dayName = alt.dayName || nextOpp?.dayName;
  const saatNum = alt.saatNum || saatDisplayNum(alt.hour || alt.hourNumber, alt.period);
  const planet = alt.planet;
  const startTime = alt.startTime;
  const endTime = alt.endTime;
  const daysAhead = alt.daysAhead;

  const whyText = (alt.whyBetter || []).map((r) => cleanReason(lang === "ml" && r.text_ml ? r.text_ml : r.text_en)).filter(Boolean).join(" ");
  const fallbackWhy = matchingRules.length > 0 ? cleanReason(lang === "ml" && matchingRules[0].text_ml ? matchingRules[0].text_ml : matchingRules[0].text_en) : "";

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: `1px solid ${G.border}`, boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)" }}>
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
          <CalendarClock className="w-5 h-5" style={{ color: G.text }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>4</span>
          <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {T("Better Timing", "മികച്ച സമയം", lang)}
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="rounded-xl p-3" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.25)" }}>
          <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: "#4ADE80" }}>{priorityLabel}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Day", "ദിവസം", lang)}</p>
              <p className={lang === "ml" ? "font-malayalam text-xs font-bold" : "font-inter text-xs font-bold"} style={{ color: "#fff" }}>
                {translateDay(dayName, lang)}{isToday ? ` (${T("Today", "ഇന്ന്", lang)})` : daysAhead > 0 ? ` (${daysAhead} ${T("d", "ദി", lang)})` : ""}
              </p>
            </div>
            <div>
              <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Saat", "സഅാത്", lang)}</p>
              <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>#{saatNum} ({translatePlanet(planet, lang)})</p>
            </div>
            <div>
              <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Best Planet", "മികച്ച ഗ്രഹം", lang)}</p>
              <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{translatePlanet(planet, lang)}</p>
            </div>
            {startTime && endTime && (
              <div>
                <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Time", "സമയം", lang)}</p>
                <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{startTime} – {endTime}</p>
              </div>
            )}
          </div>
        </div>
        <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color: G.dim }}>{T("Why", "കാരണം", lang)}</p>
          <p className={lang === "ml" ? "font-malayalam text-xs leading-relaxed" : "font-inter text-xs leading-relaxed"} style={{ color: "rgba(255,255,255,0.75)" }}>
            {whyText || fallbackWhy || T("This timing satisfies all required conditions for the selected purpose.", "ഈ സമയം തിരഞ്ഞെടുത്ത ലക്ഷ്യത്തിനായുള്ള എല്ലാ ആവശ്യകതകളും പാലിക്കുന്നു.", lang)}
          </p>
        </div>
      </div>
    </div>
  );
}