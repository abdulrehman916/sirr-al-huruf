import { TrendingUp } from "lucide-react";
import { G, T, Box, translatePlanet, translateDay, saatDisplayNum, computeCompat, compatColor, DAY_KEY_BY_INDEX, MIZAN_DAY_NAMES } from "./shared";

// BOX 7 — HOW TO IMPROVE
// Shows how to increase compatibility: current → change weekday/saat/planet → result → increase.
// Every recommendation comes from database rules (req.days / req.hours).
export default function BoxHowToImprove({ analysis, lang }) {
  const req = analysis?.req || {};
  const current = computeCompat(analysis).final;
  const bestWindows = analysis?.bestWindowsToday || [];
  const nextOpp = analysis?.nextOpportunity || null;

  // Best improvement target: the strongest remaining today, else next opportunity.
  const target = bestWindows.length > 0
    ? { dayKey: DAY_KEY_BY_INDEX[analysis?.astroClockStatus?.activeWeekday] || null, period: bestWindows[0].period, saatNumber: bestWindows[0].hourNumber, planetLC: String(bestWindows[0].planet || "").toLowerCase(), dayName: analysis?.liveNow?.day, saatNum: saatDisplayNum(bestWindows[0].hourNumber, bestWindows[0].period), planet: bestWindows[0].planet, startTime: bestWindows[0].startTime, endTime: bestWindows[0].endTime }
    : nextOpp
      ? { dayKey: nextOpp.dayKey, period: nextOpp.period, saatNumber: nextOpp.hour, planetLC: String(nextOpp.planet || "").toLowerCase(), dayName: nextOpp.dayName, saatNum: saatDisplayNum(nextOpp.hour, nextOpp.period), planet: nextOpp.planet, startTime: nextOpp.startTime, endTime: nextOpp.endTime }
      : null;

  if (!target) {
    return (
      <Box number={7} titleEn="How to Improve" titleMl="എങ്ങനെ മെച്ചപ്പെടുത്താം" icon={TrendingUp} lang={lang}>
        <p className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"} style={{ color: "rgba(255,255,255,0.60)" }}>
          {T("No improvement opportunity found in the uploaded books.",
            "അപ്‌ലോഡ് ചെയ്ത പുസ്തകങ്ങളിൽ മെച്ചപ്പെടുത്തൽ അവസരമൊന്നുമില്ല.", lang)}
        </p>
      </Box>
    );
  }

  const improved = computeCompat(analysis, { dayKey: target.dayKey, period: target.period, saatNumber: target.saatNumber, planetLC: target.planetLC }).final;
  const cColor = compatColor(improved);
  const increase = improved - current;

  const changes = [];
  if (target.dayName) changes.push({ labelEn: "Weekday", labelMl: "ആഴ്ച", value: translateDay(target.dayName, lang) });
  if (target.saatNum) changes.push({ labelEn: "Saat", labelMl: "സഅാത്", value: `#${target.saatNum} · ${translatePlanet(target.planet, lang)}` });
  if (target.planet) changes.push({ labelEn: "Planet", labelMl: "ഗ്രഹം", value: translatePlanet(target.planet, lang) });

  const recReason = req.hours?.length
    ? T("Database recommends this planet for this purpose.", "ഈ ലക്ഷ്യത്തിന് ഡാറ്റാബേസ് ഈ ഗ്രഹത്തെ ശുപാർശ ചെയ്യുന്നു.", lang)
    : req.days?.length
      ? T("Database recommends this weekday for this purpose.", "ഈ ലക്ഷ്യത്തിന് ഡാറ്റാബേസ് ഈ ദിവസത്തെ ശുപാർശ ചെയ്യുന്നു.", lang)
      : "";

  return (
    <Box number={7} titleEn="How to Improve" titleMl="എങ്ങനെ മെച്ചപ്പെടുത്താം" icon={TrendingUp} lang={lang}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-center">
          <p className="font-inter text-[9px] uppercase tracking-wider mb-0.5" style={{ color: G.dim }}>{T("Current", "നിലവിൽ", lang)}</p>
          <p className="font-inter text-xl font-bold" style={{ color: compatColor(current) }}>{current}%</p>
        </div>
        <div className="flex-1 mx-3 text-center">
          <TrendingUp className="w-5 h-5 mx-auto" style={{ color: cColor }} />
          {target.startTime && target.endTime && (
            <p className="font-inter text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.50)" }}>{target.startTime}–{target.endTime}</p>
          )}
        </div>
        <div className="text-center">
          <p className="font-inter text-[9px] uppercase tracking-wider mb-0.5" style={{ color: G.dim }}>{T("Result", "ഫലം", lang)}</p>
          <p className="font-inter text-xl font-bold" style={{ color: cColor }}>{improved}%</p>
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        {changes.map((c, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg p-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <span className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T(c.labelEn, c.labelMl, lang)}</span>
            <span className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.40)" }}>→</span>
            <span className="font-inter text-xs font-bold ml-auto" style={{ color: "#fff" }}>{c.value}</span>
          </div>
        ))}
      </div>

      {increase > 0 && (
        <div className="rounded-lg p-2.5 text-center" style={{ background: `${cColor}10`, border: `1px solid ${cColor}40` }}>
          <p className="font-inter text-sm font-bold" style={{ color: cColor }}>+{increase}%</p>
          <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Compatibility Increase", "പൊരുത്ത വർദ്ധനവ്", lang)}</p>
        </div>
      )}
      {recReason && (
        <p className={lang === "ml" ? "font-malayalam text-[10px] mt-2" : "font-inter text-[10px] mt-2"} style={{ color: "rgba(255,255,255,0.50)" }}>{recReason}</p>
      )}
    </Box>
  );
}