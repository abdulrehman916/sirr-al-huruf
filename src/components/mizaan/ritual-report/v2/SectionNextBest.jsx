import { CalendarClock, Clock, TrendingUp } from "lucide-react";
import { G, T, translatePlanet, translateDay, saatDisplayNum } from "../shared";
import { computeCompat, compatColor } from "./compatibility";

function cleanReason(text) {
  if (!text) return "";
  return String(text).replace(/Source\s*:.*?(\.|$)/gi, "").replace(/Astrology Clock\s*:/gi, "").split(/\n/)[0].trim();
}

export default function SectionNextBest({ analysis, lang }) {
  const bestWindows = (analysis?.bestWindowsToday || []).filter(w => w.score > 0);
  const passedWindows = analysis?.passedWindowsToday || [];
  const nextOpp = analysis?.nextOpportunity || null;
  const matchingRules = analysis?.matchingRules || [];
  const liveNow = analysis?.liveNow || {};

  // Determine what to show: next best Saat today, or next suitable day
  const hasRemainingToday = bestWindows.length > 0;
  const hasPassed = passedWindows.length > 0;

  // The "next best" is the highest-scoring remaining window today
  const nextBestToday = hasRemainingToday
    ? bestWindows.slice().sort((a, b) => (b.score || 0) - (a.score || 0))[0]
    : null;

  // If nothing remains today, use nextOpportunity (next day)
  const nextDay = (!hasRemainingToday && nextOpp) ? nextOpp : null;

  // Compute compat for the next best
  let nextCompat = 0;
  let nextLabel = "";
  let nextReason = "";

  if (nextBestToday) {
    nextCompat = computeCompat(analysis, {
      planetLC: String(nextBestToday.planet || "").toLowerCase(),
    }).final;
    nextLabel = T("Next best Saat today", "ഇന്നത്തെ അടുത്ത മികച്ച സഅാത്", lang);
    const sn = saatDisplayNum(nextBestToday.hourNumber, nextBestToday.period);
    const rule = matchingRules.find(r => r.saat_number === nextBestToday.hourNumber && r.period === nextBestToday.period);
    nextReason = rule
      ? cleanReason(lang === "ml" && rule.text_ml ? rule.text_ml : rule.text_en)
      : T("Highest compatibility Saat remaining today.", "ഇന്ന് ബാക്കിയുള്ളതിൽ ഏറ്റവും അനുയോജ്യ സഅാത്.", lang);
  } else if (nextDay) {
    nextCompat = computeCompat(analysis, {
      dayKey: nextDay.dayKey,
      planetLC: String(nextDay.planet || "").toLowerCase(),
    }).final;
    nextLabel = T("Next suitable day", "അടുത്ത അനുയോജ്യ ദിവസം", lang);
    nextReason = T("No suitable Saat remains today — this is the next fully compatible opportunity.", "ഇന്ന് അനുയോജ്യ സഅാത് ബാക്കിയില്ല — ഇതാണ് അടുത്ത പൂർണ്ണ പൊരുത്തമുള്ള അവസരം.", lang);
  }

  if (!nextBestToday && !nextDay) {
    return (
      <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: `1px solid ${G.border}`, boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)" }}>
        <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
            <CalendarClock className="w-5 h-5" style={{ color: G.text }} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>3</span>
            <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
              {T("Next Best Opportunity", "അടുത്ത മികച്ച അവസരം", lang)}
            </h3>
          </div>
        </div>
        <div className="p-4">
          <p className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"} style={{ color: "rgba(255,255,255,0.60)" }}>
            {T("No suitable opportunity found within 14 days.", "14 ദിവസത്തിനുള്ളിൽ അനുയോജ്യ അവസരമൊന്നുമില്ല.", lang)}
          </p>
        </div>
      </div>
    );
  }

  const cColor = compatColor(nextCompat);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: `1px solid ${G.border}`, boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)" }}>
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
          <CalendarClock className="w-5 h-5" style={{ color: G.text }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>3</span>
          <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {T("Next Best Opportunity", "അടുത്ത മികച്ച അവസരം", lang)}
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {hasPassed && (
          <p className={lang === "ml" ? "font-malayalam text-[11px]" : "font-inter text-[11px]"} style={{ color: "#FBBF24" }}>
            {T("The strongest Saat today has already passed.", "ഇന്നത്തെ ഏറ്റവും ശക്ത സഅാത് കഴിഞ്ഞു.", lang)}
          </p>
        )}

        <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: G.dim }}>{nextLabel}</p>
          {nextBestToday && (
            <>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4" style={{ color: "#4ADE80" }} />
                <span className="font-inter text-sm font-bold" style={{ color: "#fff" }}>
                  {T("Saat", "സഅാത്", lang)} #{saatDisplayNum(nextBestToday.hourNumber, nextBestToday.period)}
                </span>
                <span className="font-inter text-xs" style={{ color: G.dim }}>·</span>
                <span className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{translatePlanet(nextBestToday.planet, lang)}</span>
              </div>
              {nextBestToday.startTime && nextBestToday.endTime && (
                <p className="font-inter text-[10px] mb-1" style={{ color: "rgba(255,255,255,0.50)" }}>
                  {nextBestToday.startTime} – {nextBestToday.endTime}
                </p>
              )}
            </>
          )}
          {nextDay && (
            <>
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4" style={{ color: "#FBBF24" }} />
                <span className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
                  {translateDay(nextDay.dayName, lang)} ({nextDay.daysAhead} {T("d", "ദി", lang)})
                </span>
              </div>
              <p className="font-inter text-xs" style={{ color: "#fff" }}>
                {T("Saat", "സഅാത്", lang)} #{saatDisplayNum(nextDay.hour, nextDay.period)} ({translatePlanet(nextDay.planet, lang)})
              </p>
              {nextDay.startTime && nextDay.endTime && (
                <p className="font-inter text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.50)" }}>{nextDay.startTime} – {nextDay.endTime}</p>
              )}
            </>
          )}
        </div>

        {/* Expected compat */}
        <div className="rounded-xl p-3 text-center" style={{ background: `${cColor}08`, border: `1px solid ${cColor}30` }}>
          <p className="font-inter text-xl font-bold" style={{ color: cColor }}>{nextCompat}%</p>
          <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Expected Compatibility", "പ്രതീക്ഷിത പൊരുത്തം", lang)}</p>
        </div>

        {/* Reason */}
        {nextReason && (
          <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <p className={lang === "ml" ? "font-malayalam text-xs leading-relaxed" : "font-inter text-xs leading-relaxed"} style={{ color: "rgba(255,255,255,0.75)" }}>
              {nextReason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}