import { Trophy } from "lucide-react";
import { G, T, Box, translatePlanet, translateDay, saatDisplayNum, computeCompat, compatColor } from "../v3/shared";

// CARD 6 — STRONGEST OPPORTUNITIES
// Ranks the per-hour allowed timeline by strength % (each hour evaluated
// independently by its exact context record) so the user can see which hour is
// strongest across the whole 14-day window — distinct from the chronological
// Card 2.
export default function Card6FutureOpportunities({ analysis, lang }) {
  const ranked = (analysis?.allowedTimeline || []).map(o => {
    const pct = computeCompat(analysis, { weekday: o.weekday, dayKey: o.dayKey, period: o.period, saatNumber: o.hour, planetLC: String(o.planet || "").toLowerCase() }).final;
    return { ...o, pct };
  }).sort((a, b) => b.pct - a.pct).slice(0, 6);

  return (
    <Box number={6} titleEn="Strongest Opportunities" titleMl="ഏറ്റവും ശക്തമായ അവസരങ്ങൾ" icon={Trophy} lang={lang}>
      {ranked.length === 0 ? (
        <p className={lang === "ml" ? "font-malayalam text-sm" : "font-inter text-sm"} style={{ color: "rgba(255,255,255,0.60)" }}>{T("No suitable opportunity found within 14 days.", "14 ദിവസത്തിനുള്ളിൽ അനുയോജ്യ അവസരമൊന്നുമില്ല.", lang)}</p>
      ) : (
        <div className="space-y-2">
          {ranked.map((o, i) => {
            const c = compatColor(o.pct);
            return (
              <div key={i} className="rounded-lg p-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>#{i + 1} · {o.date} · {translateDay(o.dayName, lang)}</p>
                  <span className="font-inter text-xs font-bold" style={{ color: c }}>{o.pct}%</span>
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