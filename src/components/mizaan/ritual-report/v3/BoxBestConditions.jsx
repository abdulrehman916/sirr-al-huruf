import { Crown } from "lucide-react";
import { G, T, Box, translatePlanet, translateDay, saatDisplayNum, computeCompat, compatColor, MIZAN_DAY_NAMES } from "./shared";

// BOX 8 — BEST POSSIBLE CONDITIONS
// The absolute best combination according to uploaded books:
// best weekday, best saat, best planet, day/night, compat, supporting book.
export default function BoxBestConditions({ analysis, lang }) {
  const req = analysis?.req || {};
  const matchingRules = analysis?.matchingRules || [];
  const astro = analysis?.astroClockStatus || {};

  const bestDayKey = req.days?.[0] || null;
  const bestDayName = bestDayKey ? MIZAN_DAY_NAMES[bestDayKey] : (analysis?.liveNow?.day || null);
  const bestPlanet = req.hours?.[0] || null;
  const planetLC = bestPlanet ? String(bestPlanet).toLowerCase() : null;
  const bestPeriod = req.nightRequired === true ? "night" : "day";

  // Find the saat number ruled by the best planet (from matching rules or today's hours)
  const ruleWithPlanet = matchingRules.find(r => String(r.planet || "").toLowerCase() === planetLC);
  const bestSaatNum = ruleWithPlanet?.saat_number ? saatDisplayNum(ruleWithPlanet.saat_number, ruleWithPlanet.period) : null;
  const bestSaatPeriod = ruleWithPlanet?.period || bestPeriod;

  const c = computeCompat(analysis, {
    dayKey: bestDayKey || undefined,
    period: bestSaatPeriod,
    saatNumber: ruleWithPlanet?.saat_number || undefined,
    planetLC: planetLC || undefined,
  }).final;
  const cColor = compatColor(c);
  const book = matchingRules[0]?.source || "";

  if (!bestDayName && !bestPlanet) {
    return (
      <Box number={8} titleEn="Best Possible Conditions" titleMl="ഏറ്റവും മികച്ച വ്യവസ്ഥകൾ" icon={Crown} lang={lang}>
        <p className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"} style={{ color: "rgba(255,255,255,0.60)" }}>
          {T("The uploaded books do not prescribe a specific best combination for this purpose.",
            "അപ്‌ലോഡ് ചെയ്ത പുസ്തകങ്ങൾ ഈ ലക്ഷ്യത്തിന് പ്രത്യേക മികച്ച കൂട്ടായ്മ നിർദ്ദേശിക്കുന്നില്ല.", lang)}
        </p>
      </Box>
    );
  }

  const rows = [
    { labelEn: "Best Weekday", labelMl: "മികച്ച ദിവസം", value: bestDayName ? translateDay(bestDayName, lang) : "—" },
    { labelEn: "Best Saat", labelMl: "മികച്ച സഅാത്", value: bestSaatNum ? `#${bestSaatNum}${bestPlanet ? " · " + translatePlanet(bestPlanet, lang) : ""}` : (bestPlanet ? translatePlanet(bestPlanet, lang) : "—") },
    { labelEn: "Best Planet", labelMl: "മികച്ച ഗ്രഹം", value: bestPlanet ? translatePlanet(bestPlanet, lang) : "—" },
    { labelEn: "Day / Night", labelMl: "പകൽ / രാത്രി", value: bestPeriod === "night" ? T("Night (Layl)", "രാത്രി (ലൈൽ)", lang) : T("Day (Nahar)", "പകൽ (നഹർ)", lang) },
  ];

  return (
    <Box number={8} titleEn="Best Possible Conditions" titleMl="ഏറ്റവും മികച്ച വ്യവസ്ഥകൾ" icon={Crown} lang={lang}>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {rows.map((r, i) => (
          <div key={i} className="rounded-lg p-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <p className="font-inter text-[9px] uppercase tracking-wider mb-0.5" style={{ color: G.dim }}>{T(r.labelEn, r.labelMl, lang)}</p>
            <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{r.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-3 flex items-center justify-between mb-2" style={{ background: `${cColor}10`, border: `1px solid ${cColor}40` }}>
        <div>
          <p className="font-inter text-[9px] uppercase tracking-wider mb-0.5" style={{ color: G.dim }}>{T("Best Compatibility", "മികച്ച പൊരുത്തം", lang)}</p>
          <p className={lang === "ml" ? "font-malayalam text-[10px]" : "font-inter text-[10px]"} style={{ color: "rgba(255,255,255,0.65)" }}>
            {T("Highest possible combination per uploaded books", "അപ്‌ലോഡ് ചെയ്ത പുസ്തകങ്ങൾ പ്രകാരം ഏറ്റവും ഉയർന്ന കൂട്ടായ്മ", lang)}
          </p>
        </div>
        <p className="font-inter text-2xl font-bold" style={{ color: cColor }}>{c}%</p>
      </div>

      {book && (
        <p className="font-inter text-[9px]" style={{ color: G.dim }}>{T("Supporting Book", "പിന്തുണയ്ക്കുന്ന പുസ്തകം", lang)}: {book}</p>
      )}
    </Box>
  );
}