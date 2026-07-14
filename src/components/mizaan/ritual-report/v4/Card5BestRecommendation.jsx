import { Sparkles, Check } from "lucide-react";
import { G, T, Box, translatePlanet, translateDay, saatDisplayNum, computeCompat, compatColor } from "../v3/shared";
import SourcesCollapse from "./SourcesCollapse";

// CARD 5 — BEST RECOMMENDATION
// Finds the strongest combination from the per-hour allowed timeline (each hour
// evaluated independently by its exact imported-book-rule context). Recommends
// best weekday, day/night, planetary hour, moon condition and lunar mansion,
// shows WHY it is the strongest, and "Apply Recommendation" updates the top
// selectors so every card recalculates live. No invented rules — every reason
// cites only imported sources.
export default function Card5BestRecommendation({ analysis, onApply, lang }) {
  const timeline = analysis?.allowedTimeline || [];
  const moonReq = analysis?.moonReq || {};

  // Today only — do NOT search future days here (Card 6 owns the future).
  const todayAllowed = timeline.filter(o => o.isToday);
  const scored = todayAllowed.map(o => ({
    o,
    pct: computeCompat(analysis, { weekday: o.weekday, dayKey: o.dayKey, period: o.period, saatNumber: o.hour, planetLC: String(o.planet || "").toLowerCase() }).final,
  })).sort((a, b) => b.pct - a.pct);

  const best = scored.length > 0 ? scored[0].o : null;
  const bestPct = scored.length > 0 ? scored[0].pct : -1;
  const others = scored.slice(1); // ranked strongest → weakest
  const cColor = compatColor(bestPct > 0 ? bestPct : 0);
  const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const bestMansion = moonReq.suitableMansions?.length ? moonReq.suitableMansions.join(", ") : T("No Moon restriction", "ചന്ദ്ര നിയന്ത്രണമില്ല", lang);
  const bestMoonCondition = moonReq.moon ? cap(moonReq.moon) : T("No Moon restriction", "ചന്ദ്ര നിയന്ത്രണമില്ല", lang);
  const bestMoonPosition = moonReq.zodiac?.length ? moonReq.zodiac.map(cap).join(", ") : (moonReq.moon ? cap(moonReq.moon) : T("No Moon restriction", "ചന്ദ്ര നിയന്ത്രണമില്ല", lang));

  const rows = best ? [
    { k: T("Weekday", "ദിവസം", lang), v: translateDay(best.dayName, lang) },
    { k: T("Planetary Hour", "ഗ്രഹ സമയം", lang), v: `#${saatDisplayNum(best.hour, best.period)} · ${translatePlanet(best.planet, lang)}` },
    { k: T("Day / Night", "പകൽ / രാത്രി", lang), v: best.period === "night" ? T("Night", "രാത്രി", lang) : T("Day", "പകൽ", lang) },
    { k: T("Time", "സമയം", lang), v: `${best.startTime}–${best.endTime}` },
    { k: T("Moon Condition", "ചന്ദ്ര അവസ്ഥ", lang), v: bestMoonCondition },
    { k: T("Best Moon Position", "മികച്ച ചന്ദ്ര സ്ഥാനം", lang), v: bestMoonPosition },
    { k: T("Lunar Mansion", "ചന്ദ്ര നക്ഷത്രം", lang), v: bestMansion },
    { k: T("Expected Strength", "പ്രതീക്ഷിത ശക്തി", lang), v: `${bestPct}%` },
  ] : [];

  const apply = () => {
    if (!best || !onApply) return;
    onApply({ days: best.dayKey, hour: saatDisplayNum(best.hour, best.period), dayNight: best.period === "night" ? "gece" : "gunduz", planet: "" });
  };

  return (
    <Box number={5} titleEn="Best Recommendation" titleMl="മികച്ച ശുപാർശ" icon={Sparkles} lang={lang}>
      {!best ? (
        <p className={lang === "ml" ? "font-malayalam text-sm" : "font-inter text-sm"} style={{ color: "rgba(255,255,255,0.60)" }}>{T("No suitable opportunity remains today.", "ഇന്ന് ഉചിതമായ അവസരമൊന്നുമില്ല.", lang)}</p>
      ) : (
        <>
          <div className="rounded-xl p-3 mb-3" style={{ background: `${cColor}12`, border: `1px solid ${cColor}50` }}>
            <p className="font-inter text-sm font-bold" style={{ color: cColor }}>{T("Best Opportunity", "മികച്ച അവസരം", lang)}: {bestPct}%</p>
            <p className={lang === "ml" ? "font-malayalam text-[11px] mt-0.5" : "font-inter text-[11px] mt-0.5"} style={{ color: "rgba(255,255,255,0.65)" }}>
              {lang === "ml" && best.reasonMl ? best.reasonMl : (best.reasonEn || T("Imported book rules fully align at this hour — highest strength today.", "ഈ സമയത്ത് ഇറക്കുമതി ചെയ്ത പുസ്തക നിയമങ്ങൾ പൂർണ്ണമായി പൊരുത്തപ്പെടുന്നു — ഇന്നത്തെ ഏറ്റവും ശക്തം.", lang))}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {rows.map((r, i) => (
              <div key={i} className="rounded-lg p-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                <p className="font-inter text-[9px] uppercase tracking-wider mb-0.5" style={{ color: G.dim }}>{r.k}</p>
                <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{r.v}</p>
              </div>
            ))}
          </div>
          <SourcesCollapse sources={best.rules} lang={lang} />
          <button onClick={apply} className="w-full rounded-xl p-3 font-inter text-sm font-bold mt-1" style={{ background: "linear-gradient(135deg,#f6d860,#c98a14)", color: "#0d1b2a", border: "none", boxShadow: "0 0 24px rgba(212,175,55,0.40)" }}>
            <Check className="w-4 h-4 inline mr-1.5" />{T("Apply Recommendation", "ശുപാർശ പ്രയോഗിക്കുക", lang)}
          </button>

          {/* Other suitable opportunities today (ranked strongest → weakest) */}
          <div className="mt-3">
            <p className="font-inter text-[9px] uppercase tracking-wider mb-1.5" style={{ color: G.dim }}>{T("Other Suitable Opportunities Today", "ഇന്നത്തെ മറ്റ് ഉചിത അവസരങ്ങൾ", lang)}</p>
            {others.length === 0 ? (
              <p className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"} style={{ color: "rgba(255,255,255,0.60)" }}>{T("No other suitable opportunity remains today.", "ഇന്ന് മറ്റ് ഉചിതമായ അവസരമൊന്നുമില്ല.", lang)}</p>
            ) : (
              <div className="space-y-1.5">
                {others.map((s, i) => {
                  const o = s.o; const c = compatColor(s.pct);
                  return (
                    <div key={i} className="rounded-lg p-2.5 flex items-center justify-between" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                      <div>
                        <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>#{saatDisplayNum(o.hour, o.period)} {translatePlanet(o.planet, lang)} · {o.startTime}–{o.endTime}</p>
                        <p className="font-inter text-[10px]" style={{ color: G.dim }}>{o.period === "night" ? T("Night", "രാത്രി", lang) : T("Day", "പകൽ", lang)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-inter text-sm font-bold" style={{ color: c }}>{s.pct}%</span>
                        {onApply && <button onClick={() => onApply({ days: o.dayKey, hour: saatDisplayNum(o.hour, o.period), dayNight: o.period === "night" ? "gece" : "gunduz", planet: "" })} className="font-inter text-[10px] font-bold px-2 py-1 rounded-lg" style={{ background: "rgba(212,175,55,0.15)", color: G.text, border: `1px solid ${G.border}` }}>{T("Apply", "പ്രയോഗിക്കുക", lang)}</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </Box>
  );
}