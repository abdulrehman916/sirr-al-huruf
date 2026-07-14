import { CalendarClock } from "lucide-react";
import { G, T, Box, translatePlanet, translateDay, saatDisplayNum, computeCompat, compatColor } from "../v3/shared";

// CARD 6 — FUTURE OPPORTUNITIES
// When today is unsuitable, lists every suitable opportunity from tomorrow
// onward (up to 10). For each: date, weekday, planetary hour, day/night, strength.
export default function Card6FutureOpportunities({ analysis, liveTimeline, lang }) {
  const future = (liveTimeline || []).filter(o => !o.isToday).slice(0, 10);

  return (
    <Box number={6} titleEn="Future Opportunities" titleMl="ഭാവി അവസരങ്ങൾ" icon={CalendarClock} lang={lang}>
      {future.length === 0 ? (
        <p className={lang === "ml" ? "font-malayalam text-sm" : "font-inter text-sm"} style={{ color: "rgba(255,255,255,0.60)" }}>{T("No future opportunity found within 14 days.", "14 ദിവസത്തിനുള്ളിൽ ഭാവി അവസരമൊന്നുമില്ല.", lang)}</p>
      ) : (
        <div className="space-y-2">
          {future.map((o, i) => {
            const pct = computeCompat(analysis, { dayKey: o.dayKey, period: o.period, saatNumber: o.hour, planetLC: String(o.planet || "").toLowerCase() }).final;
            const c = compatColor(pct);
            return (
              <div key={i} className="rounded-lg p-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{o.date} · {translateDay(o.dayName, lang)}</p>
                  <span className="font-inter text-xs font-bold" style={{ color: c }}>{pct}%</span>
                </div>
                <p className="font-inter text-[11px]" style={{ color: "rgba(255,255,255,0.75)" }}>#{saatDisplayNum(o.hour, o.period)} {translatePlanet(o.planet, lang)} · {o.startTime}–{o.endTime} · {o.period === "night" ? T("Night", "രാത്രി", lang) : T("Day", "പകൽ", lang)}</p>
              </div>
            );
          })}
        </div>
      )}
    </Box>
  );
}