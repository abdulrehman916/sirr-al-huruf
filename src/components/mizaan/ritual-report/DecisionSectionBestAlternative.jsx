// ═══════════════════════════════════════════════════════════════
// SECTION 4 — BEST ALTERNATIVE
// Priority 1: Same Day, Better Saat
// Priority 2: Next Suitable Saat (if current passed)
// Priority 3: Better Day (if today unsuitable)
// ═══════════════════════════════════════════════════════════════
import { CalendarClock, CheckCircle2 } from "lucide-react";
import { G, T, translatePlanet, translateDay, saatDisplayNum } from "./shared";

function cleanReason(text) {
  if (!text) return "";
  return String(text)
    .replace(/Source\s*:.*?(\.|$)/gi, "")
    .replace(/Havâss[^\s]*\s*Derinlikleri[^\n]*/gi, "")
    .replace(/Astrology Clock\s*:/gi, "")
    .split(/\n/)[0]
    .trim();
}

export default function DecisionSectionBestAlternative({ analysis, lang }) {
  const verdict = analysis?.verdict || "Not Suitable";
  const canPerform = analysis?.canPerformToday || "No";
  const breakdown = analysis?.selectionAnalysis?.decisionBreakdown || [];
  const failedItems = breakdown.filter((b) => b.status === "fail");

  const betterSaats = analysis?.betterAlternatives?.betterSaats || [];
  const nextLayl = analysis?.betterAlternatives?.nextLayl || null;
  const nextOpp = analysis?.nextOpportunity || null;
  const matchingRules = analysis?.matchingRules || [];

  // Is current already best?
  const isAlreadyBest = (verdict === "Suitable" && failedItems.length === 0) || (verdict === "Suitable" && canPerform === "Yes");

  if (isAlreadyBest) {
    return (
      <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: `1px solid ${G.border}`, boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)" }}>
        <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
            <CalendarClock className="w-5 h-5" style={{ color: G.text }} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>4</span>
            <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
              {T("Best Alternative", "മികച്ച ബദൽ", lang)}
            </h3>
          </div>
        </div>
        <div className="p-4">
          <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.25)" }}>
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" style={{ color: "#4ADE80" }} />
            <p className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#4ADE80" }}>
              {T("This is already one of the strongest available timings.", "ഇത് ഇതുവരെ ലഭ്യമായ ഏറ്റവും ശക്തമായ സമയങ്ങളിൽ ഒന്നാണ്.", lang)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Priority: 1. Same day better saat → 2. Next suitable saat → 3. Better day
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
              {T("Best Alternative", "മികച്ച ബദൽ", lang)}
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

  // Determine priority label
  const priority = sameDayAlt ? 1 : nextSaatAlt ? 2 : 3;
  const priorityLabel = priority === 1
    ? T("Same Day — Better Saat", "അതേ ദിവസം — മികച്ച സഅാത്", lang)
    : priority === 2
    ? T("Next Suitable Saat", "അടുത്ത അനുയോജ്യ സഅാത്", lang)
    : T("Better Day", "മികച്ച ദിവസം", lang);

  const isToday = sameDayAlt ? true : (nextSaatAlt?.isToday || nextOpp?.isToday);
  const dayName = alt.dayName || nextOpp?.dayName;
  const saatNum = alt.saatNum || saatDisplayNum(alt.hour || alt.hourNumber, alt.period);
  const planet = alt.planet;
  const startTime = alt.startTime;
  const endTime = alt.endTime;
  const daysAhead = alt.daysAhead;

  // WHY
  const whyText = (alt.whyBetter || [])
    .map((r) => cleanReason(lang === "ml" && r.text_ml ? r.text_ml : r.text_en))
    .filter(Boolean)
    .join(" ");
  const fallbackWhy = matchingRules.length > 0
    ? cleanReason(lang === "ml" && matchingRules[0].text_ml ? matchingRules[0].text_ml : matchingRules[0].text_en)
    : "";

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: `1px solid ${G.border}`, boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)" }}>
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
          <CalendarClock className="w-5 h-5" style={{ color: G.text }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>4</span>
          <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {T("Best Alternative", "മികച്ച ബദൽ", lang)}
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="rounded-xl p-3" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.25)" }}>
          <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: "#4ADE80" }}>
            {T(`Priority ${priority}`, `മുൻഗണന ${priority}`, lang)}: {priorityLabel}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Recommended Day", "ശുപാർശ ദിവസം", lang)}</p>
              <p className={lang === "ml" ? "font-malayalam text-xs font-bold" : "font-inter text-xs font-bold"} style={{ color: "#fff" }}>
                {translateDay(dayName, lang)}
                {!isToday && daysAhead > 0 ? ` (${daysAhead} ${T("days away", "ദിവസം അകലെ", lang)})` : isToday ? ` (${T("Today", "ഇന്ന്", lang)})` : ""}
              </p>
            </div>
            <div>
              <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Recommended Saat", "ശുപാർശ സഅാത്", lang)}</p>
              <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>#{saatNum} ({translatePlanet(planet, lang)})</p>
            </div>
            {startTime && endTime && (
              <div className="col-span-2">
                <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Recommended Time", "ശുപാർശ സമയം", lang)}</p>
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