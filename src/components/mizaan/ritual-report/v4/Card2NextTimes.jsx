import { CalendarClock, Check } from "lucide-react";
import { G, T, Box, translatePlanet, translateDay, saatDisplayNum, computeCompat, compatColor } from "../v3/shared";

function gradeOf(status, pct) {
  if (status === "forbidden") return { en: "Forbidden", ml: "നിരോധിതം", c: "#F87171" };
  if (status === "neutral") return { en: "No rule", ml: "നിയമമില്ല", c: "#94A3B8" };
  if (pct >= 70) return { en: "Strong", ml: "ശക്തം", c: "#4ADE80" };
  if (pct >= 40) return { en: "Allowed", ml: "അനുവദനീയം", c: "#A3E635" };
  return { en: "Weak", ml: "ദുർബലം", c: "#FBBF24" };
}

// CARD 2 — NEXT AVAILABLE OPPORTUNITIES
// Upcoming suitable opportunities only (no current analysis). Each hour judged
// independently by its exact imported-book-rule context: date, weekday, day/
// night, hour, ruling planet, grade, strength %, a one-line reason, and Apply.
export default function Card2NextTimes({ analysis, onApply, lang }) {
  const timeline = analysis?.allowedTimeline || [];

  const groups = [];
  const seen = new Set();
  for (const o of timeline) {
    if (!seen.has(o.date)) { seen.add(o.date); groups.push({ date: o.date, dayName: o.dayName, isToday: o.isToday, daysAhead: o.daysAhead, items: [] }); }
    groups[groups.length - 1].items.push(o);
  }
  const dayLabel = (g) => g.isToday ? T("Today", "ഇന്ന്", lang) : g.daysAhead === 1 ? T("Tomorrow", "നാളെ", lang) : `${T("Day +", "ദിവസം +", lang)}${g.daysAhead}`;
  const applyItem = (o) => onApply && onApply({ days: o.dayKey, hour: saatDisplayNum(o.hour, o.period), dayNight: o.period === "night" ? "gece" : "gunduz", planet: "" });

  return (
    <Box number={2} titleEn="Next Available Opportunities" titleMl="അടുത്ത ലഭ്യമായ അവസരങ്ങൾ" icon={CalendarClock} lang={lang}>
      {timeline.length === 0 ? (
        <p className={lang === "ml" ? "font-malayalam text-sm" : "font-inter text-sm"} style={{ color: "rgba(255,255,255,0.60)" }}>
          {T("No matching rule found in the imported sources within 29 days.", "29 ദിവസത്തിനുള്ളിൽ ഇറക്കുമതി ചെയ്ത സ്രോതസ്സുകളിൽ പൊരുത്തപ്പെടുന്ന നിയമമൊന്നുമില്ല.", lang)}
        </p>
      ) : (
        <div className="space-y-3">
          {groups.map((g, gi) => (
            <div key={gi}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-inter text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>{dayLabel(g)}</span>
                <span className="font-inter text-[10px]" style={{ color: G.dim }}>{g.date} · {translateDay(g.dayName, lang)}</span>
              </div>
              <div className="space-y-1.5">
                {g.items.map((o, i) => {
                  const pct = computeCompat(analysis, { weekday: o.weekday, dayKey: o.dayKey, period: o.period, saatNumber: o.hour, planetLC: String(o.planet || "").toLowerCase() }).final;
                  const c = compatColor(pct);
                  const gr = gradeOf(o.status, pct);
                  return (
                    <div key={i} className="rounded-lg p-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{o.startTime}–{o.endTime} · #{saatDisplayNum(o.hour, o.period)} {translatePlanet(o.planet, lang)} · {o.period === "night" ? T("Night", "രാത്രി", lang) : T("Day", "പകൽ", lang)}</p>
                        <div className="flex items-center gap-1.5">
                          <span className="font-inter text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: gr.c, border: `1px solid ${gr.c}55`, background: `${gr.c}12` }}>{lang === "ml" ? gr.ml : gr.en}</span>
                          <span className="font-inter text-xs font-bold" style={{ color: c }}>{pct}%</span>
                        </div>
                      </div>
                      <p className={lang === "ml" ? "font-malayalam text-[10px]" : "font-inter text-[10px]"} style={{ color: "rgba(255,255,255,0.62)" }}>
                        {lang === "ml" && o.reasonMl ? o.reasonMl : (o.reasonEn || T("Book rules recommend this hour.", "പുസ്തക നിയമങ്ങൾ ഈ സമയം ശുപാർശ ചെയ്യുന്നു.", lang))}
                      </p>
                      {onApply && (
                        <button onClick={() => applyItem(o)} className="mt-1.5 w-full rounded-lg py-1.5 font-inter text-[11px] font-bold flex items-center justify-center gap-1" style={{ background: "rgba(212,175,55,0.15)", color: G.text, border: `1px solid ${G.border}` }}>
                          <Check className="w-3 h-3" />{T("Apply", "പ്രയോഗിക്കുക", lang)}
                        </button>
                      )}
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