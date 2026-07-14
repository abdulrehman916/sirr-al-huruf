import { Trophy } from "lucide-react";
import { G, T, Box, translatePlanet, translateDay, saatDisplayNum, computeCompat, compatColor } from "../v3/shared";

// Per-hour grade — see Card2NextTimes.
function gradeOf(status, pct) {
  if (status === "forbidden") return { en: "Forbidden", ml: "നിരോധിതം", c: "#F87171" };
  if (status === "neutral") return { en: "No rule", ml: "നിയമമില്ല", c: "#94A3B8" };
  if (pct >= 70) return { en: "Strong", ml: "ശക്തം", c: "#4ADE80" };
  if (pct >= 40) return { en: "Allowed", ml: "അനുവദനീയം", c: "#A3E635" };
  return { en: "Weak", ml: "ദുർബലം", c: "#FBBF24" };
}

// CARD 6 — STRONGEST OPPORTUNITIES
// Ranks the per-hour allowed timeline by strength % (each hour evaluated
// independently by its exact imported-book-rule context) so the user sees which
// hour is strongest across the full 30-day window — distinct from the
// chronological Card 2.
export default function Card6FutureOpportunities({ analysis, lang }) {
  const ranked = (analysis?.allowedTimeline || []).map(o => {
    const pct = computeCompat(analysis, { weekday: o.weekday, dayKey: o.dayKey, period: o.period, saatNumber: o.hour, planetLC: String(o.planet || "").toLowerCase() }).final;
    return { ...o, pct };
  }).sort((a, b) => b.pct - a.pct).slice(0, 6);

  return (
    <Box number={6} titleEn="Strongest Opportunities" titleMl="ഏറ്റവും ശക്തമായ അവസരങ്ങൾ" icon={Trophy} lang={lang}>
      {ranked.length === 0 ? (
        <p className={lang === "ml" ? "font-malayalam text-sm" : "font-inter text-sm"} style={{ color: "rgba(255,255,255,0.60)" }}>{T("No matching rule found in the imported sources within 30 days.", "30 ദിവസത്തിനുള്ളിൽ ഇറക്കുമതി ചെയ്ത സ്രോതസ്സുകളിൽ പൊരുത്തപ്പെടുന്ന നിയമമൊന്നുമില്ല.", lang)}</p>
      ) : (
        <div className="space-y-2">
          {ranked.map((o, i) => {
            const c = compatColor(o.pct);
            const gr = gradeOf(o.status, o.pct);
            return (
              <div key={i} className="rounded-lg p-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>#{i + 1} · {o.date} · {translateDay(o.dayName, lang)}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="font-inter text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: gr.c, border: `1px solid ${gr.c}55`, background: `${gr.c}12` }}>{lang === "ml" ? gr.ml : gr.en}</span>
                    <span className="font-inter text-xs font-bold" style={{ color: c }}>{o.pct}%</span>
                  </div>
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