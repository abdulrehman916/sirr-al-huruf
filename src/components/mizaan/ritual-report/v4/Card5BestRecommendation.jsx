import { Sparkles, Check } from "lucide-react";
import { G, T, Box, translatePlanet, translateDay, saatDisplayNum, computeCompat, compatColor } from "../v3/shared";

// CARD 5 — BEST RECOMMENDATION
// Picks the strongest hour from the per-hour allowed timeline (each hour
// evaluated independently by its exact context record). "Apply Recommendation"
// updates the top Mizan selectors so EVERY card recalculates live.
export default function Card5BestRecommendation({ analysis, onApply, lang }) {
  const timeline = analysis?.allowedTimeline || [];
  const moonReq = analysis?.moonReq || {};

  let best = null, bestPct = -1;
  for (const o of timeline) {
    const pct = computeCompat(analysis, { weekday: o.weekday, dayKey: o.dayKey, period: o.period, saatNumber: o.hour, planetLC: String(o.planet || "").toLowerCase() }).final;
    if (pct > bestPct) { bestPct = pct; best = o; }
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
        <p className={lang === "ml" ? "font-malayalam text-sm" : "font-inter text-sm"} style={{ color: "rgba(255,255,255,0.60)" }}>{T("No recommendation found in the book rules within 14 days.", "14 ദിവസത്തിനുള്ളിൽ പുസ്തക നിയമങ്ങളിൽ ശുപാർശ കണ്ടെത്തിയില്ല.", lang)}</p>
      ) : (
        <>
          <div className="rounded-xl p-3 mb-3" style={{ background: `${cColor}12`, border: `1px solid ${cColor}50` }}>
            <p className="font-inter text-sm font-bold" style={{ color: cColor }}>{T("Strongest hour", "ഏറ്റവും ശക്തമായ സമയം", lang)}: {bestPct}%</p>
            <p className={lang === "ml" ? "font-malayalam text-[11px] mt-0.5" : "font-inter text-[11px] mt-0.5"} style={{ color: "rgba(255,255,255,0.65)" }}>{lang === "ml" && best.reasonMl ? best.reasonMl : (best.reasonEn || T("Book rules fully align at this hour.", "ഈ സമയത്ത് പുസ്തക നിയമങ്ങൾ പൂർണ്ണമായി പൊരുത്തപ്പെടുന്നു.", lang))}</p>
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