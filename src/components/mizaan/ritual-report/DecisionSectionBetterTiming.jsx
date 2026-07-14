// ═══════════════════════════════════════════════════════════════
// SECTION 4 — BEST TIMING
// Always shows: Day vs Night analysis + Strongest Saat today.
// If unsuitable: also explains WHY + which dimensions to change.
// All data from uploaded database only.
// ═══════════════════════════════════════════════════════════════
import { CalendarClock, TrendingUp, CheckCircle2, AlertTriangle, Sun, Moon } from "lucide-react";
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

  // ── Day vs Night analysis (from database rules) ──
  const dayRules = matchingRules.filter((r) => r.period === "day");
  const nightRules = matchingRules.filter((r) => r.period === "night");
  let dayNightRec;
  if (req.nightRequired === true) {
    dayNightRec = { period: "night", label: T("Night", "രാത്രി", lang), reason: T("Night is required for this purpose per the database.", "ഡാറ്റാബേസ് പ്രകാരം ഈ ലക്ഷ്യത്തിന് രാത്രി ആവശ്യമാണ്.", lang) };
  } else if (dayRules.length > nightRules.length && nightRules.length === 0) {
    dayNightRec = { period: "day", label: T("Day", "പകല്", lang), reason: T("Day is stronger — all database rules recommend day.", "പകല് കൂടുതൽ അനുയോജ്യം — ഡാറ്റാബേസ് പകല് ശുപാർശ ചെയ്യുന്നു.", lang) };
  } else if (nightRules.length > dayRules.length && dayRules.length === 0) {
    dayNightRec = { period: "night", label: T("Night", "രാത്രി", lang), reason: T("Night is stronger — all database rules recommend night.", "രാത്രി കൂടുതൽ അനുയോജ്യം — ഡാറ്റാബേസ് രാത്രി ശുപാർശ ചെയ്യുന്നു.", lang) };
  } else if (dayRules.length > nightRules.length) {
    dayNightRec = { period: "day", label: T("Day", "പകല്", lang), reason: T("Day has more suitable Saats in the database.", "ഡാറ്റാബേസിൽ പകലിൽ കൂടുതൽ അനുയോജ്യ സഅാത്തുകളുണ്ട്.", lang) };
  } else if (nightRules.length > dayRules.length) {
    dayNightRec = { period: "night", label: T("Night", "രാത്രി", lang), reason: T("Night has more suitable Saats in the database.", "ഡാറ്റാബേസിൽ രാത്രിയിൽ കൂടുതൽ അനുയോജ്യ സഅാത്തുകളുണ്ട്.", lang) };
  } else {
    dayNightRec = { period: "both", label: T("Both", "രണ്ടും", lang), reason: T("Both Day and Night are suitable per the database.", "ഡാറ്റാബേസ് പ്രകാരം പകലും രാത്രിയും അനുയോജ്യമാണ്.", lang) };
  }

  // ── Strongest Saat today (from bestWindowsToday — already filtered to non-past) ──
  const strongestToday = bestWindows.length > 0
    ? bestWindows.slice().sort((a, b) => (b.score || 0) - (a.score || 0))[0]
    : null;
  const strongestSaatNum = strongestToday ? saatDisplayNum(strongestToday.hourNumber, strongestToday.period) : null;
  const strongestCompat = strongestToday?.score || 0;
  const strongestBookRef = matchingRules.length > 0 ? matchingRules[0]?.source : "";
  const strongestReason = matchingRules.length > 0
    ? cleanReason(lang === "ml" && matchingRules[0].text_ml ? matchingRules[0].text_ml : matchingRules[0].text_en)
    : "";

  // ── If no suitable Saat today, next available day ──
  const nextDay = (!strongestToday && nextOpp) ? nextOpp : null;

  // ── If suitable: check for stronger timing ──
  const currentSaatNum = liveNow.saat;
  const hasStronger = isSuitable && strongestToday && strongestSaatNum !== currentSaatNum && strongestCompat > (analysis?.compatPct || 50);

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

  // ── Unsuitable: which dimensions to change ──
  const currentDayKey = DAY_KEY_BY_INDEX[astro.activeWeekday];
  const currentPlanetLC = String(liveNow.kawkab || liveNow.planetaryHour || "").toLowerCase();
  const dayFailed = !!req.days && !req.days.includes(currentDayKey);
  const saatFailed = !!req.hours && !req.hours.some((p) => p.toLowerCase() === currentPlanetLC);
  const planetEnemy = (!!req.worstHours && req.worstHours.some((p) => p.toLowerCase() === currentPlanetLC)) ||
    (!!req.enemyPlanets && req.enemyPlanets.some((p) => p.toLowerCase() === currentPlanetLC));
  const dayForbidden = !!req.worstDays && req.worstDays.includes(currentDayKey);
  const rejectionReasons = analysis?.currentSaatAnalysis?.rejectionReasons || [];
  const rejectRule = rejectionReasons.map((r) => cleanReason(lang === "ml" && r.text_ml ? r.text_ml : r.text_en)).filter(Boolean).slice(0, 1).join(" ");

  const sameDayAlt = betterSaats[0] || null;
  const alt = sameDayAlt || nextLayl || nextOpp || null;
  const altDayName = alt?.dayName || nextOpp?.dayName;
  const altSaatNum = alt?.saatNum || (alt ? saatDisplayNum(alt.hour || alt.hourNumber, alt.period) : null);
  const altPlanet = alt?.planet;
  const altStartTime = alt?.startTime;
  const altEndTime = alt?.endTime;
  const altDaysAhead = alt?.daysAhead;
  const isToday = sameDayAlt ? true : (nextLayl?.isToday || nextOpp?.isToday);
  const whyText = (alt?.whyBetter || []).map((r) => cleanReason(lang === "ml" && r.text_ml ? r.text_ml : r.text_en)).filter(Boolean).join(" ");
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
            {T("Best Timing", "മികച്ച സമയം", lang)}
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {/* ── Day vs Night Analysis ── */}
        <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: G.dim }}>
            {T("Day or Night", "പകല് അതോ രാത്രി", lang)}
          </p>
          <div className="flex items-center gap-2 mb-1.5">
            {dayNightRec.period === "day" && <Sun className="w-5 h-5" style={{ color: "#FBBF24" }} />}
            {dayNightRec.period === "night" && <Moon className="w-5 h-5" style={{ color: "#60A5FA" }} />}
            {dayNightRec.period === "both" && <Sun className="w-5 h-5" style={{ color: "#FBBF24" }} />}
            <span className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
              {dayNightRec.label}
            </span>
          </div>
          <p className={lang === "ml" ? "font-malayalam text-[11px] leading-relaxed" : "font-inter text-[11px] leading-relaxed"} style={{ color: "rgba(255,255,255,0.65)" }}>
            {dayNightRec.reason}
          </p>
        </div>

        {/* ── Strongest Saat Today ── */}
        {strongestToday ? (
          <div className="rounded-xl p-3" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.25)" }}>
            <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: "#4ADE80" }}>
              {T("Strongest Saat Today", "ഇന്നത്തെ ഏറ്റവും ശക്ത സഅാത്", lang)}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Day/Night", "പകല്/രാത്രി", lang)}</p>
                <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{strongestToday.period === "night" ? T("Night", "രാത്രി", lang) : T("Day", "പകല്", lang)}</p>
              </div>
              <div>
                <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Saat", "സഅാത്", lang)}</p>
                <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>#{strongestSaatNum} ({translatePlanet(strongestToday.planet, lang)})</p>
              </div>
              <div>
                <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Planet", "ഗ്രഹം", lang)}</p>
                <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{translatePlanet(strongestToday.planet, lang)}</p>
              </div>
              <div>
                <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Compat", "പൊരുത്തം", lang)}</p>
                <p className="font-inter text-xs font-bold" style={{ color: strongestCompat >= 70 ? "#4ADE80" : strongestCompat >= 50 ? "#FBBF24" : "#F87171" }}>{strongestCompat}%</p>
              </div>
              {strongestToday.startTime && strongestToday.endTime && (
                <div>
                  <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Time", "സമയം", lang)}</p>
                  <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{strongestToday.startTime} – {strongestToday.endTime}</p>
                </div>
              )}
              {strongestBookRef && (
                <div>
                  <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Book", "പുസ്തകം", lang)}</p>
                  <p className={lang === "ml" ? "font-malayalam text-xs font-bold truncate" : "font-inter text-xs font-bold truncate"} style={{ color: "#fff" }}>{strongestBookRef}</p>
                </div>
              )}
            </div>
            {strongestReason && (
              <p className={lang === "ml" ? "font-malayalam text-[11px] leading-relaxed" : "font-inter text-[11px] leading-relaxed"} style={{ color: "rgba(255,255,255,0.65)" }}>
                {strongestReason}
              </p>
            )}
          </div>
        ) : nextDay ? (
          <div className="rounded-xl p-3" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.25)" }}>
            <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: "#FBBF24" }}>
              {T("No suitable Saat remaining today", "ഇന്ന് അനുയോജ്യ സഅാത് ബാക്കിയില്ല", lang)}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Next Day", "അടുത്ത ദിവസം", lang)}</p>
                <p className={lang === "ml" ? "font-malayalam text-xs font-bold" : "font-inter text-xs font-bold"} style={{ color: "#fff" }}>
                  {translateDay(nextDay.dayName, lang)} ({nextDay.daysAhead} {T("d", "ദി", lang)})
                </p>
              </div>
              <div>
                <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Saat", "സഅാത്", lang)}</p>
                <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>#{saatDisplayNum(nextDay.hour, nextDay.period)} ({translatePlanet(nextDay.planet, lang)})</p>
              </div>
              {nextDay.startTime && nextDay.endTime && (
                <div>
                  <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Time", "സമയം", lang)}</p>
                  <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{nextDay.startTime} – {nextDay.endTime}</p>
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

        {/* ── If suitable + stronger exists ── */}
        {isSuitable && hasStronger && (
          <div className="rounded-lg p-3" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.20)" }}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" style={{ color: "#4ADE80" }} />
              <p className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#4ADE80" }}>
                {T("Stronger than current selection", "നിലവിലെ തിരഞ്ഞെടുപ്പിനേക്കാൾ ശക്തം", lang)}
              </p>
            </div>
            <p className={lang === "ml" ? "font-malayalam text-[11px] leading-relaxed" : "font-inter text-[11px] leading-relaxed"} style={{ color: "rgba(255,255,255,0.70)" }}>
              {T(`Saat #${strongestSaatNum} (${translatePlanet(strongestToday.planet, lang)}) at ${strongestCompat}% is stronger than your current Saat #${currentSaatNum}.`, `സഅാത് #${strongestSaatNum} (${translatePlanet(strongestToday.planet, lang)}) ${strongestCompat}% നിലവിലെ സഅാത് #${currentSaatNum} നേക്കാൾ ശക്തമാണ്.`, lang)}
            </p>
          </div>
        )}

        {/* ── If unsuitable: why + what to change ── */}
        {!isSuitable && rejectRule && (
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

        {!isSuitable && (dayFailed || saatFailed || planetEnemy || dayForbidden) && (
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

        {/* ── Strongest alternative (unsuitable only) ── */}
        {!isSuitable && alt && (
          <div className="rounded-xl p-3" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.25)" }}>
            <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: "#4ADE80" }}>
              {T("Strongest Alternative", "ഏറ്റവും ശക്തമായ ബദൽ", lang)}
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
              {altStartTime && altEndTime && (
                <div>
                  <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Time", "സമയം", lang)}</p>
                  <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{altStartTime} – {altEndTime}</p>
                </div>
              )}
            </div>
            {(whyText || fallbackWhy) && (
              <p className={lang === "ml" ? "font-malayalam text-[11px] leading-relaxed mt-2" : "font-inter text-[11px] leading-relaxed mt-2"} style={{ color: "rgba(255,255,255,0.65)" }}>
                {whyText || fallbackWhy || T("This timing satisfies all required conditions.", "ഈ സമയം എല്ലാ ആവശ്യകതകളും പാലിക്കുന്നു.", lang)}
              </p>
            )}
          </div>
        )}

        {/* ── Already strongest ── */}
        {isSuitable && !hasStronger && (
          <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.25)" }}>
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" style={{ color: "#4ADE80" }} />
            <p className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#4ADE80" }}>
              {T("This is already the strongest available timing today.", "ഇത് ഇന്ന് ലഭ്യമായ ഏറ്റവും ശക്തമായ സമയമാണ്.", lang)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}