import { Sparkles, Check } from "lucide-react";
import { G, T, Box, translatePlanet, translateDay, saatDisplayNum, computeCompat, compatColor, DAY_KEY_BY_INDEX } from "../v3/shared";

// CARD 5 — BEST RECOMMENDATION
// Finds the highest-strength configuration across the timeline and recommends
// best weekday / planetary hour / day-night / moon mansion with expected
// strength %. "Apply Recommendation" pushes the config into the engine override
// so EVERY card recalculates live immediately.
export default function Card5BestRecommendation({ analysis, liveTimeline, onApply, lang }) {
  const req = analysis?.req || {};
  const moonReq = analysis?.moonReq || {};

  let best = null, bestPct = -1;
  for (const o of (liveTimeline || [])) {
    const pct = computeCompat(analysis, { dayKey: o.dayKey, period: o.period, saatNumber: o.hour, planetLC: String(o.planet || "").toLowerCase() }).final;
    if (pct > bestPct) { bestPct = pct; best = o; }
  }
  if (!best) {
    const w = (analysis?.bestWindowsToday || [])[0];
    const dk = DAY_KEY_BY_INDEX[analysis?.astroClockStatus?.activeWeekday];
    if (w) {
      best = { dayKey: dk, dayName: analysis?.liveNow?.day, period: w.period, hour: w.hourNumber, planet: w.planet, startTime: w.startTime, endTime: w.endTime };
      bestPct = computeCompat(analysis, { dayKey: dk, period: w.period, saatNumber: w.hourNumber, planetLC: String(w.planet || "").toLowerCase() }).final;
    }
  }

  const cColor = compatColor(bestPct > 0 ? bestPct : 0);
  const bestMansion = moonReq.suitableMansions?.length ? moonReq.suitableMansions.join(", ") : T("No Moon restriction", "ചന്ദ്ര നിയന്ത്രണമില്ല", lang);

  const rows = best ? [
    { k: T("Weekday", "ദിവസം", lang), v: translateDay(best.dayName, lang) },
    { k: T("Planetary Hour", "ഗ്രഹ സമയം", lang), v: `#${saatDisplayNum(best.hour, best.period)} · ${translatePlanet(best.planet, lang)}` },
    { k: T("Day / Night", "പകൽ / രാത്രി", lang), v: best.period === "night" ? T("Night", "രാത്രി", lang) : T("Day", "പകൽ", lang) },
    { k: T("Time", "സമയം", lang), v: `${best.startTime}–${best.endTime}` },
    { k: T("Moon Mansion", "ചന്ദ്ര നക്ഷത്രം", lang), v: bestMansion },
    { k: T("Expected Strength", "പ്രതീക്ഷിത ശക്തി", lang), v: `${bestPct}%` },
  ] : [];

  const apply = () => {
    if (!best || !onApply) return;
    onApply({ days: best.dayKey, hour: saatDisplayNum(best.hour, best.period), dayNight: best.period === "night" ? "gece" : "gunduz", planet: "" });
  };

  return (
    <Box number={5} titleEn="Best Recommendation" titleMl="മികച്ച ശുപാർശ" icon={Sparkles} lang={lang}>
      {!best ? (
        <p className={lang === "ml" ? "font-malayalam text-sm" : "font-inter text-sm"} style={{ color: "rgba(255,255,255,0.60)" }}>{T("No recommendation found in the uploaded books.", "അപ്‌ലോഡ് ചെയ്ത പുസ്തകങ്ങളിൽ ശുപാർശ കണ്ടെത്തിയില്ല.", lang)}</p>
      ) : (
        <>
          <div className="rounded-xl p-3 mb-3" style={{ background: `${cColor}12`, border: `1px solid ${cColor}50` }}>
            <p className="font-inter text-sm font-bold" style={{ color: cColor }}>{T("Best possible configuration", "മികച്ച ക്രമീകരണം", lang)}: {bestPct}%</p>
            <p className={lang === "ml" ? "font-malayalam text-[11px] mt-0.5" : "font-inter text-[11px] mt-0.5"} style={{ color: "rgba(255,255,255,0.65)" }}>{T("All book rules fully align at this time.", "ഈ സമയത്ത് എല്ലാ പുസ്തക നിയമങ്ങളും പൂർണ്ണമായി പൊരുത്തപ്പെടുന്നു.", lang)}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {rows.map((r, i) => (
              <div key={i} className="rounded-lg p-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                <p className="font-inter text-[9px] uppercase tracking-wider mb-0.5" style={{ color: G.dim }}>{r.k}</p>
                <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{r.v}</p>
              </div>
            ))}
          </div>
          <button onClick={apply} className="w-full rounded-xl p-3 font-inter text-sm font-bold" style={{ background: "linear-gradient(135deg,#f6d860,#c98a14)", color: "#0d1b2a", border: "none", boxShadow: "0 0 24px rgba(212,175,55,0.40)" }}>
            <Check className="w-4 h-4 inline mr-1.5" />{T("Apply Recommendation", "ശുപാർശ പ്രയോഗിക്കുക", lang)}
          </button>
        </>
      )}
    </Box>
  );
}