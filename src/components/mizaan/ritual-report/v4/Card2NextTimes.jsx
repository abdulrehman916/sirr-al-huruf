import { CalendarClock } from "lucide-react";
import { G, T, Box, translatePlanet, translateDay, saatDisplayNum, computeCompat, compatColor } from "../v3/shared";
import SourcesCollapse from "./SourcesCollapse";

// CARD 2 — NEXT AVAILABLE TIMES (full chronological timeline)
// Does NOT stop after today's next opportunity. Lists EVERY suitable planetary
// hour across days in chronological order (Today → Tomorrow → Next Day …),
// each evaluated independently by its exact context record (book rules only).
// Every entry: date, weekday, day/night, planetary hour, ruling planet,
// strength %, why suitable, and the matched book rules.
export default function Card2NextTimes({ analysis, lang }) {
  const timeline = analysis?.allowedTimeline || [];

  // Group entries by date, preserving chronological order.
  const groups = [];
  const seen = new Set();
  for (const o of timeline) {
    if (!seen.has(o.date)) { seen.add(o.date); groups.push({ date: o.date, dayName: o.dayName, isToday: o.isToday, daysAhead: o.daysAhead, items: [] }); }
    groups[groups.length - 1].items.push(o);
  }
  const dayLabel = (g) => g.isToday ? T("Today", "ഇന്ന്", lang) : g.daysAhead === 1 ? T("Tomorrow", "നാളെ", lang) : `${T("Day +", "ദിവസം +", lang)}${g.daysAhead}`;

  return (
    <Box number={2} titleEn="Next Available Times" titleMl="അടുത്ത ലഭ്യമായ സമയങ്ങൾ" icon={CalendarClock} lang={lang}>
      {timeline.length === 0 ? (
        <p className={lang === "ml" ? "font-malayalam text-sm" : "font-inter text-sm"} style={{ color: "rgba(255,255,255,0.60)" }}>
          {T("No suitable opportunity found in the book rules within 14 days.", "14 ദിവസത്തിനുള്ളിൽ പുസ്തക നിയമങ്ങളിൽ അനുയോജ്യ സമയമൊന്നുമില്ല.", lang)}
        </p>
      ) : (
        <div className="space-y-3">
          {groups.map((g, gi) => (
            <div key={gi}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-inter text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>{dayLabel(g)}</span>
                <span className="font-inter text-[10px]" style={{ color: G.dim }}>{g.date} · {translateDay(g.dayName, lang)}</span>
              </div>
              <div className="space-y-1.5">
                {g.items.map((o, i) => {
                  const pct = computeCompat(analysis, { weekday: o.weekday, dayKey: o.dayKey, period: o.period, saatNumber: o.hour, planetLC: String(o.planet || "").toLowerCase() }).final;
                  const c = compatColor(pct);
                  return (
                    <div key={i} className="rounded-lg p-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{o.startTime}–{o.endTime} · #{saatDisplayNum(o.hour, o.period)} {translatePlanet(o.planet, lang)} · {o.period === "night" ? T("Night", "രാത്രി", lang) : T("Day", "പകൽ", lang)}</p>
                        <span className="font-inter text-xs font-bold" style={{ color: c }}>{pct}%</span>
                      </div>
                      <p className={lang === "ml" ? "font-malayalam text-[10px]" : "font-inter text-[10px]"} style={{ color: "rgba(255,255,255,0.62)" }}>
                        {lang === "ml" && o.reasonMl ? o.reasonMl : (o.reasonEn || T("Book rules recommend this hour.", "പുസ്തക നിയമങ്ങൾ ഈ സമയം ശുപാർശ ചെയ്യുന്നു.", lang))}
                      </p>
                      <SourcesCollapse sources={o.rules} lang={lang} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
}