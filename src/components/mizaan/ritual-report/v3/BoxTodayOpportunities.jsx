import { Calendar, Star, Clock } from "lucide-react";
import { G, T, Box, translatePlanet, saatDisplayNum, computeCompat, compatColor } from "./shared";

// BOX 4 — TODAY'S AVAILABLE OPPORTUNITIES
// All remaining suitable Saat TODAY, sorted chronologically.
// Marks the strongest one ★★★★★ Best Today.
// If none remain: "No suitable Saat remains today."
export default function BoxTodayOpportunities({ analysis, lang }) {
  const windows = (analysis?.bestWindowsToday || []).slice().sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));

  // Strongest = highest database-driven compat among remaining
  let strongestIdx = -1, strongestCompat = -1;
  windows.forEach((w, i) => {
    const c = computeCompat(analysis, { period: w.period, saatNumber: w.hourNumber, planetLC: String(w.planet || "").toLowerCase() }).final;
    if (c > strongestCompat) { strongestCompat = c; strongestIdx = i; }
  });

  const matchingRules = analysis?.matchingRules || [];

  if (windows.length === 0) {
    return (
      <Box number={4} titleEn="Today's Available Opportunities" titleMl="ഇന്നത്തെ ലഭ്യമായ അവസരങ്ങൾ" icon={Calendar} lang={lang}>
        <div className="flex items-center gap-2 rounded-lg p-3" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.30)" }}>
          <Clock className="w-4 h-4 flex-shrink-0" style={{ color: "#F87171" }} />
          <p className={lang === "ml" ? "font-malayalam text-xs font-bold" : "font-inter text-xs font-bold"} style={{ color: "#F87171" }}>
            {T("No suitable Saat remains today.", "ഇന്ന് അനുയോജ്യ സഅാത് ബാക്കിയില്ല.", lang)}
          </p>
        </div>
        <p className={lang === "ml" ? "font-malayalam text-[10px] mt-2" : "font-inter text-[10px] mt-2"} style={{ color: "rgba(255,255,255,0.45)" }}>
          {T("See the Next Available Opportunity below.", "താഴെ അടുത്ത ലഭ്യമായ അവസരം കാണുക.", lang)}
        </p>
      </Box>
    );
  }

  return (
    <Box number={4} titleEn="Today's Available Opportunities" titleMl="ഇന്നത്തെ ലഭ്യമായ അവസരങ്ങൾ" icon={Calendar} lang={lang}>
      <div className="space-y-2">
        {windows.map((w, i) => {
          const isBest = i === strongestIdx;
          const c = i === strongestIdx ? strongestCompat : computeCompat(analysis, { period: w.period, saatNumber: w.hourNumber, planetLC: String(w.planet || "").toLowerCase() }).final;
          const cColor = compatColor(c);
          const rule = matchingRules.find(r => r.saat_number === w.hourNumber && r.period === w.period);
          const reason = rule ? (lang === "ml" && rule.text_ml ? rule.text_ml : rule.text_en) : w.reason;
          return (
            <div key={i} className="rounded-lg p-3" style={{ background: isBest ? `${cColor}12` : G.bg, border: `1px solid ${isBest ? `${cColor}60` : G.border}` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-inter text-sm font-bold" style={{ color: "#fff" }}>
                  {T("Saat", "സഅാത്", lang)} #{saatDisplayNum(w.hourNumber, w.period)}
                </span>
                <span className="font-inter text-[10px]" style={{ color: G.dim }}>·</span>
                <span className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{translatePlanet(w.planet, lang)}</span>
                {isBest && (
                  <span className="ml-auto font-inter text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: cColor, border: `1px solid ${cColor}60`, background: `${cColor}12` }}>
                    ★★★★★ {T("Best Today", "ഇന്നത്തെ മികച്ചത്", lang)}
                  </span>
                )}
              </div>
              {w.startTime && w.endTime && (
                <p className="font-inter text-[10px] mb-1" style={{ color: "rgba(255,255,255,0.50)" }}>{w.startTime} – {w.endTime}</p>
              )}
              <div className="flex items-center gap-2">
                <span className="font-inter text-xs font-bold" style={{ color: cColor }}>{c}%</span>
                {reason && (
                  <span className={lang === "ml" ? "font-malayalam text-[11px]" : "font-inter text-[11px]"} style={{ color: "rgba(255,255,255,0.65)" }}>
                    {String(reason).split(/\n/)[0].slice(0, 80)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Box>
  );
}