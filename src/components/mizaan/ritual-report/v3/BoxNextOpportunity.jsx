import { CalendarClock } from "lucide-react";
import { G, T, Box, translatePlanet, translateDay, saatDisplayNum, computeCompat, compatColor } from "./shared";

// BOX 5 — NEXT AVAILABLE OPPORTUNITY (LIVE NAVIGATION)
// Always shows THE next suitable opportunity, searched forward automatically:
//   Today ↓ Tomorrow ↓ Next Day ↓ … until the first suitable is found.
// This is the auto-advancing recommendation. When today still has a remaining
// suitable Saat, it is today's next; when today's are gone, it is tomorrow's
// (or the next future day with a suitable Saat).
export default function BoxNextOpportunity({ analysis, liveRecommendation, lang }) {
  const matchingRules = analysis?.matchingRules || [];

  if (!liveRecommendation) {
    return (
      <Box number={5} titleEn="Next Available Opportunity" titleMl="അടുത്ത ലഭ്യമായ അവസരം" icon={CalendarClock} lang={lang}>
        <p className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"} style={{ color: "rgba(255,255,255,0.60)" }}>
          {T("No suitable opportunity found within 14 days.", "14 ദിവസത്തിനുള്ളിൽ അനുയോജ്യ അവസരമൊന്നുമില്ല.", lang)}
        </p>
      </Box>
    );
  }

  const r = liveRecommendation;
  const planetLC = String(r.planet || "").toLowerCase();
  const c = computeCompat(analysis, { dayKey: r.dayKey, period: r.period, saatNumber: r.hour, planetLC }).final;
  const cColor = compatColor(c);
  const rule = matchingRules.find(rr => rr.saat_number === r.hour && rr.period === r.period);
  const reason = rule ? (lang === "ml" && rule.text_ml ? rule.text_ml : rule.text_en) : "";
  const book = rule?.source || "";

  const whenLabel = r.isToday ? T("Today", "ഇന്ന്", lang)
    : r.daysAhead === 1 ? T("Tomorrow", "നാളെ", lang)
    : translateDay(r.dayName, lang);

  return (
    <Box number={5} titleEn="Next Available Opportunity" titleMl="അടുത്ത ലഭ്യമായ അവസരം" icon={CalendarClock} lang={lang}>
      <div className="rounded-lg p-3 mb-3" style={{ background: `${cColor}10`, border: `1px solid ${cColor}40` }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-inter text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ color: cColor, border: `1px solid ${cColor}60`, background: `${cColor}12` }}>{whenLabel}</span>
          <span className="font-inter text-sm font-bold" style={{ color: "#fff" }}>{r.date}</span>
          <span className="font-inter text-[10px]" style={{ color: G.dim }}>·</span>
          <span className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{translateDay(r.dayName, lang)}</span>
          <span className="ml-auto font-inter text-base font-bold" style={{ color: cColor }}>{c}%</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>
            {T("Saat", "സഅാത്", lang)} #{saatDisplayNum(r.hour, r.period)} · {translatePlanet(r.planet, lang)}
          </span>
        </div>
        {r.startTime && r.endTime && (
          <p className="font-inter text-[10px] mb-1" style={{ color: "rgba(255,255,255,0.50)" }}>{r.startTime} – {r.endTime}</p>
        )}
        {reason && (
          <p className={lang === "ml" ? "font-malayalam text-[11px] mt-1 leading-relaxed" : "font-inter text-[11px] mt-1 leading-relaxed"}
            style={{ color: "rgba(255,255,255,0.72)" }}>{String(reason).split(/\n/)[0]}</p>
        )}
        {book && <p className="font-inter text-[9px] mt-1" style={{ color: G.dim }}>{T("Supporting Book", "പിന്തുണയ്ക്കുന്ന പുസ്തകം", lang)}: {book}</p>}
      </div>
      <p className={lang === "ml" ? "font-malayalam text-[10px]" : "font-inter text-[10px]"} style={{ color: "rgba(255,255,255,0.45)" }}>
        {T("Searched forward automatically: today → tomorrow → next days, until the first suitable opportunity.",
           "സ്വയമേവ മുന്നോട്ട് തിരഞ്ഞു: ഇന്ന് → നാളെ → അടുത്ത ദിവസങ്ങൾ, ആദ്യത്തെ അനുയോജ്യ അവസരം കണ്ടെത്തുന്നതുവരെ.", lang)}
      </p>
    </Box>
  );
}