// ═══════════════════════════════════════════════════════════════
// SECTION 3 — BETTER TIMING
// If current is already best: "This is already one of the strongest available timings."
// Otherwise: recommend Better Day, Saat, Planet, Kawkab, Time
// Explanation from active rule database
// ═══════════════════════════════════════════════════════════════
import { CalendarClock, CheckCircle2, Sparkles } from "lucide-react";
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

export default function DecisionSectionBetterTiming({ analysis, lang }) {
  const verdict = analysis?.verdict || "Not Suitable";
  const canPerformToday = analysis?.canPerformToday || "No";
  const breakdown = analysis?.selectionAnalysis?.decisionBreakdown || [];
  const failedItems = breakdown.filter((b) => b.status === "fail");

  const betterSaats = analysis?.betterAlternatives?.betterSaats || [];
  const nextLayl = analysis?.betterAlternatives?.nextLayl || null;
  const nextOpp = analysis?.nextOpportunity || null;
  const bestWindows = analysis?.bestWindowsToday || [];
  const matchingRules = analysis?.matchingRules || [];

  // Is current already best?
  const isAlreadyBest =
    (verdict === "Suitable" && failedItems.length === 0) ||
    (verdict === "Suitable" && bestWindows.length > 0 && canPerformToday === "Yes");

  if (isAlreadyBest) {
    return (
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
          border: `1px solid ${G.border}`,
          boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)",
        }}
      >
        <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
            <CalendarClock className="w-5 h-5" style={{ color: G.text }} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>3</span>
            <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
              {T("Better Timing", "മികച്ച സമയം", lang)}
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

  // Find the best alternative
  const todayAlt = betterSaats[0] || null;
  const alt = todayAlt || nextLayl || nextOpp || null;

  if (!alt) {
    return (
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
          border: `1px solid ${G.border}`,
          boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)",
        }}
      >
        <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
            <CalendarClock className="w-5 h-5" style={{ color: G.text }} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>3</span>
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

  const isToday = todayAlt ? true : (nextLayl?.isToday || nextOpp?.isToday);
  const dayName = alt.dayName || nextOpp?.dayName;
  const saatNum = alt.saatNum || saatDisplayNum(alt.hour || alt.hourNumber, alt.period);
  const planet = alt.planet;
  const startTime = alt.startTime;
  const endTime = alt.endTime;
  const daysAhead = alt.daysAhead;

  // WHY from database
  const whyText = (alt.whyBetter || [])
    .map((r) => cleanReason(lang === "ml" && r.text_ml ? r.text_ml : r.text_en))
    .filter(Boolean)
    .join(" ");
  const fallbackWhy = matchingRules.length > 0
    ? cleanReason(lang === "ml" && matchingRules[0].text_ml ? matchingRules[0].text_ml : matchingRules[0].text_en)
    : "";

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        border: `1px solid ${G.border}`,
        boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)",
      }}
    >
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
          <CalendarClock className="w-5 h-5" style={{ color: G.text }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>3</span>
          <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {T("Better Timing", "മികച്ച സമയം", lang)}
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="rounded-xl p-3" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.25)" }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Better Day", "മികച്ച ദിവസം", lang)}</p>
              <p className={lang === "ml" ? "font-malayalam text-xs font-bold" : "font-inter text-xs font-bold"} style={{ color: "#fff" }}>
                {translateDay(dayName, lang)}
                {!isToday && daysAhead > 0 ? ` (${daysAhead} ${T("days away", "ദിവസം അകലെ", lang)})` : isToday ? ` (${T("Today", "ഇന്ന്", lang)})` : ""}
              </p>
            </div>
            <div>
              <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Better Saat", "മികച്ച സഅാത്", lang)}</p>
              <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>#{saatNum} ({translatePlanet(planet, lang)})</p>
            </div>
            {startTime && endTime && (
              <div className="col-span-2">
                <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Exact Time", "കൃത്യമായ സമയം", lang)}</p>
                <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{startTime} – {endTime}</p>
              </div>
            )}
          </div>
        </div>

        {/* WHY */}
        <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color: G.dim }}>
            {T("Why This Is Better", "ഇത് എന്തുകൊണ്ട് മികച്ചത്", lang)}
          </p>
          <p className={lang === "ml" ? "font-malayalam text-xs leading-relaxed" : "font-inter text-xs leading-relaxed"} style={{ color: "rgba(255,255,255,0.75)" }}>
            {whyText || fallbackWhy || T("This timing satisfies all required conditions for the selected purpose.", "ഈ സമയം തിരഞ്ഞെടുത്ത ലക്ഷ്യത്തിനായുള്ള എല്ലാ ആവശ്യകതകളും പാലിക്കുന്നു.", lang)}
          </p>
        </div>
      </div>
    </div>
  );
}