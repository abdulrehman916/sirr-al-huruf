import { CalendarClock } from "lucide-react";
import { G, T, Box, translatePlanet, translateDay, saatDisplayNum, computeCompat, compatColor } from "./shared";

// BOX 5 — NEXT AVAILABLE OPPORTUNITY
// Only meaningful when today has no remaining suitable Saat.
// Searches forward: tomorrow, then next day, until the first suitable opportunity.
// Shows date, weekday, saat, planet, compat, reason, book rule.
export default function BoxNextOpportunity({ analysis, upcoming, lang }) {
  // upcoming = collectAllValidTimes(req, now, 14) — includes today remaining.
  // Forward search = entries with daysAhead > 0 (tomorrow onward).
  const forward = (upcoming || []).filter(o => o.daysAhead > 0);
  const matchingRules = analysis?.matchingRules || [];

  if (forward.length === 0) {
    // Today still has opportunities (Box 4 handles them) — Box 5 stays advisory.
    return (
      <Box number={5} titleEn="Next Available Opportunity" titleMl="അടുത്ത ലഭ്യമായ അവസരം" icon={CalendarClock} lang={lang}>
        <p className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"} style={{ color: "rgba(255,255,255,0.60)" }}>
          {T("Today still has suitable opportunities — see Box 4.", "ഇന്ന് അനുയോജ്യ അവസരങ്ങളുണ്ട് — ബോക്സ് 4 കാണുക.", lang)}
        </p>
      </Box>
    );
  }

  const first = forward[0];
  const planetLC = String(first.planet || "").toLowerCase();
  const c = computeCompat(analysis, { dayKey: first.dayKey, period: first.period, saatNumber: first.hour, planetLC }).final;
  const cColor = compatColor(c);
  const rule = matchingRules.find(r => r.saat_number === first.hour && r.period === first.period);
  const reason = rule ? (lang === "ml" && rule.text_ml ? rule.text_ml : rule.text_en) : "";
  const book = rule?.source || "";

  return (
    <Box number={5} titleEn="Next Available Opportunity" titleMl="അടുത്ത ലഭ്യമായ അവസരം" icon={CalendarClock} lang={lang}>
      <div className="rounded-lg p-3 mb-3" style={{ background: `${cColor}10`, border: `1px solid ${cColor}40` }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-inter text-sm font-bold" style={{ color: "#fff" }}>{first.date}</span>
          <span className="font-inter text-[10px]" style={{ color: G.dim }}>·</span>
          <span className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{translateDay(first.dayName, lang)}</span>
          <span className="ml-auto font-inter text-base font-bold" style={{ color: cColor }}>{c}%</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>
            {T("Saat", "സഅാത്", lang)} #{saatDisplayNum(first.hour, first.period)} · {translatePlanet(first.planet, lang)}
          </span>
        </div>
        {first.startTime && first.endTime && (
          <p className="font-inter text-[10px] mb-1" style={{ color: "rgba(255,255,255,0.50)" }}>{first.startTime} – {first.endTime}</p>
        )}
        {reason && (
          <p className={lang === "ml" ? "font-malayalam text-[11px] mt-1 leading-relaxed" : "font-inter text-[11px] mt-1 leading-relaxed"}
            style={{ color: "rgba(255,255,255,0.72)" }}>{String(reason).split(/\n/)[0]}</p>
        )}
        {book && <p className="font-inter text-[9px] mt-1" style={{ color: G.dim }}>{T("Book Rule", "പുസ്തക നിയമം", lang)}: {book}</p>}
      </div>

      {forward.length > 1 && (
        <>
          <p className="font-inter text-[9px] uppercase tracking-wider mb-2" style={{ color: G.dim }}>{T("More upcoming days", "കൂടുതൽ വരാനുള്ള ദിവസങ്ങൾ", lang)}</p>
          <div className="space-y-1.5">
            {forward.slice(1, 4).map((o, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg p-2" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                <span className="font-inter text-[11px] font-bold" style={{ color: "#fff" }}>{o.date}</span>
                <span className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>{translateDay(o.dayName, lang)}</span>
                <span className="ml-auto font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.75)" }}>#{saatDisplayNum(o.hour, o.period)} · {translatePlanet(o.planet, lang)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Box>
  );
}