// ═══════════════════════════════════════════════════════════════
// SECTION 4 — BETTER TIMING
// If suitable: show whether stronger timing exists.
// If unsuitable: explain WHY it failed, which Day/Saat/Planet
// to change, which exact rule rejected it, and which alternative
// produces the strongest compatibility.
// ═══════════════════════════════════════════════════════════════
import { CalendarClock, TrendingUp, CheckCircle2, AlertTriangle } from "lucide-react";
import { G, T, translatePlanet, translateDay, MIZAN_DAY_NAMES, DAY_KEY_BY_INDEX, saatDisplayNum } from "./shared";

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
  const req = analysis?.req || {};
  const liveNow = analysis?.liveNow || {};
  const astro = analysis?.astroClockStatus || {};

  // ── If suitable: check for stronger timing ──
  const strongerWindow = isSuitable && bestWindows.length > 0
    ? bestWindows.slice().sort((a, b) => (b.score || 0) - (a.score || 0))[0]
    : null;
  const currentSaatNum = liveNow.saat;
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

  if (isSuitable && hasStronger) {
    const s = strongerWindow;
    const sn = saatDisplayNum(s.hourNumber, s.period);
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
                <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>#{sn} ({translatePlanet(s.planet, lang)})</p>
              </div>
              <div>
                <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Time", "സമയം", lang)}</p>
                <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{s.startTime} – {s.endTime}</p>
              </div>
            </div>
          </div>
          <p className={lang === "ml" ? "font-malayalam text-xs leading-relaxed" : "font-inter text-xs leading-relaxed"} style={{ color: "rgba(255,255,255,0.65)" }}>
            {T(`Saat #${sn} has higher compatibility for your purpose.`, `നിങ്ങളുടെ ലക്ഷ്യത്തിനായി സഅാത് #${sn} കൂടുതൽ പൊരുത്തമുള്ളതാണ്.`, lang)}
          </p>
        </div>
      </div>
    );
  }

  // ── If unsuitable: explain WHY + which dimensions to change ──
  const currentDayKey = DAY_KEY_BY_INDEX[astro.activeWeekday];
  const currentPlanetLC = String(liveNow.kawkab || liveNow.planetaryHour || "").toLowerCase();
  const dayFailed = !!req.days && !req.days.includes(currentDayKey);
  const saatFailed = !!req.hours && !req.hours.some((p) => p.toLowerCase() === currentPlanetLC);
  const planetEnemy = (!!req.worstHours && req.worstHours.some((p) => p.toLowerCase() === currentPlanetLC)) ||
    (!!req.enemyPlanets && req.enemyPlanets.some((p) => p.toLowerCase() === currentPlanetLC));
  const dayForbidden = !!req.worstDays && req.worstDays.includes(currentDayKey);

  const rejectionReasons = analysis?.currentSaatAnalysis?.rejectionReasons || [];
  const rejectRule = rejectionReasons.map((r) => cleanReason(lang === "ml" && r.text_ml ? r.text_ml : r.text_en)).filter(Boolean).slice(0, 1).join(" ");

  // Best alternative
  const sameDayAlt = betterSaats[0] || null;
  const nextSaatAlt = nextLayl || null;
  const betterDayAlt = nextOpp || null;
  const alt = sameDayAlt || nextSaatAlt || betterDayAlt || null;

  const priority = sameDayAlt ? 1 : nextSaatAlt ? 2 : 3;
  const priorityLabel = priority === 1
    ? T("Best Saat Today", "ഇന്നത്തെ മികച്ച സഅാത്", lang)
    : priority === 2
    ? T("Next Available Saat", "അടുത്ത ലഭ്യ സഅാത്", lang)
    : T("Best Day", "മികച്ച ദിവസം", lang);

  const isToday = sameDayAlt ? true : (nextSaatAlt?.isToday || nextOpp?.isToday);
  const altDayName = alt?.dayName || nextOpp?.dayName;
  const altSaatNum = alt?.saatNum || (alt ? saatDisplayNum(alt.hour || alt.hourNumber, alt.period) : null);
  const altPlanet = alt?.planet;
  const altStartTime = alt?.startTime;
  const altEndTime = alt?.endTime;
  const altDaysAhead = alt?.daysAhead;

  const whyText = (alt?.whyBetter || []).map((r) => cleanReason(lang === "ml" && r.text_ml ? r.text_ml : r.text_en)).filter(Boolean).join(" ");
  const fallbackWhy = matchingRules.length > 0 ? cleanReason(lang === "ml" && matchingRules[0].text_ml ? matchingRules[0].text_ml : matchingRules[0].text_en) : "";

  function ChangeRow({ label, current, recommended, isFailed }) {
    if (!isFailed || !recommended) return null;
    return (
      <div className="flex items-center justify-between gap-2 py-1.5 border-b last:border-0" style={{ borderColor: G.border }}>
        <span className="font-inter text-[10px] uppercase tracking-wider" style={{ color: G.dim }}>{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.50)" }}>{current}</span>
          <span className="font-inter text-[10px]" style={{ color: G.dim }}>→</span>
          <span className={lang === "ml" ? "font-malayalam text-[11px] font-bold" : "font-inter text-[11px] font-bold"} style={{ color: "#4ADE80" }}>{recommended}</span>
        </div>
      </div>
    );
  }

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
        {/* WHY it failed + which exact rule rejected it */}
        {rejectRule && (
          <div className="rounded-lg p-3" style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.20)" }}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: "#F87171" }} />
              <p className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#F87171" }}>
                {T("Why it failed", "പരാജയപ്പെട്ടതിന്റെ കാരണം", lang)}
              </p>
            </div>
            <p className={lang === "ml" ? "font-malayalam text-[11px] leading-relaxed" : "font-inter text-[11px] leading-relaxed"} style={{ color: "rgba(255,255,255,0.70)" }}>{rejectRule}</p>
          </div>
        )}

        {/* Which dimensions to change */}
        {(dayFailed || saatFailed || planetEnemy || dayForbidden) && (
          <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color: G.dim }}>
              {T("What to change", "മാറ്റേണ്ടത്", lang)}
            </p>
            <ChangeRow
              label={T("Day", "ദിവസം", lang)}
              current={translateDay(liveNow.day, lang)}
              recommended={req.days?.length > 0 ? translateDay(MIZAN_DAY_NAMES[req.days[0]], lang) : null}
              isFailed={dayFailed || dayForbidden}
            />
            <ChangeRow
              label={T("Saat", "സഅാത്", lang)}
              current={`#${liveNow.saat || "—"}`}
              recommended={sameDayAlt ? `#${sameDayAlt.saatNum || saatDisplayNum(sameDayAlt.hourNumber, sameDayAlt.period)}` : (altSaatNum ? `#${altSaatNum}` : null)}
              isFailed={saatFailed}
            />
            <ChangeRow
              label={T("Planet", "ഗ്രഹം", lang)}
              current={translatePlanet(liveNow.kawkab || liveNow.planetaryHour, lang)}
              recommended={req.hours?.length > 0 ? translatePlanet(req.hours[0], lang) : (altPlanet ? translatePlanet(altPlanet, lang) : null)}
              isFailed={saatFailed || planetEnemy}
            />
          </div>
        )}

        {/* Strongest alternative */}
        {alt ? (
          <div className="rounded-xl p-3" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.25)" }}>
            <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: "#4ADE80" }}>
              {T("Strongest Alternative", "ഏറ്റവും ശക്തമായ ബദൽ", lang)}: {priorityLabel}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Day", "ദിവസം", lang)}</p>
                <p className={lang === "ml" ? "font-malayalam text-xs font-bold" : "font-inter text-xs font-bold"} style={{ color: "#fff" }}>
                  {translateDay(altDayName, lang)}{isToday ? ` (${T("Today", "ഇന്ന്", lang)})` : altDaysAhead > 0 ? ` (${altDaysAhead} ${T("d", "ദി", lang)})` : ""}
                </p>
              </div>
              <div>
                <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Saat", "സഅാത്", lang)}</p>
                <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>#{altSaatNum} ({translatePlanet(altPlanet, lang)})</p>
              </div>
              <div>
                <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Best Planet", "മികച്ച ഗ്രഹം", lang)}</p>
                <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{translatePlanet(altPlanet, lang)}</p>
              </div>
              {altStartTime && altEndTime && (
                <div>
                  <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Time", "സമയം", lang)}</p>
                  <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{altStartTime} – {altEndTime}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl p-4" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.25)" }}>
            <p className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#F87171" }}>
              {T("No better timing found within 14 days.", "14 ദിവസത്തിനുള്ളിൽ മികച്ച സമയമില്ല.", lang)}
            </p>
          </div>
        )}

        {/* Why this is better */}
        {alt && (whyText || fallbackWhy) && (
          <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color: G.dim }}>{T("Why", "കാരണം", lang)}</p>
            <p className={lang === "ml" ? "font-malayalam text-xs leading-relaxed" : "font-inter text-xs leading-relaxed"} style={{ color: "rgba(255,255,255,0.75)" }}>
              {whyText || fallbackWhy || T("This timing satisfies all required conditions for the selected purpose.", "ഈ സമയം തിരഞ്ഞെടുത്ത ലക്ഷ്യത്തിനായുള്ള എല്ലാ ആവശ്യകതകളും പാലിക്കുന്നു.", lang)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}