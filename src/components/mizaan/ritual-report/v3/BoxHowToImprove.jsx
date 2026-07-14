import { TrendingUp, ArrowDown } from "lucide-react";
import { G, T, Box, translatePlanet, translateDay, saatDisplayNum, computeCompat, compatColor, DAY_KEY_BY_INDEX } from "./shared";

// BOX 7 — HOW TO IMPROVE (conclusion-first vertical path)
// Conclusion banner: Result % (+increase). Then the exact vertical path:
// Current → Change weekday → Change Saat → Night instead of Day → Result.
export default function BoxHowToImprove({ analysis, lang }) {
  const req = analysis?.req || {};
  const current = computeCompat(analysis).final;
  const bestWindows = analysis?.bestWindowsToday || [];
  const nextOpp = analysis?.nextOpportunity || null;

  const target = bestWindows.length > 0
    ? { dayKey: DAY_KEY_BY_INDEX[analysis?.astroClockStatus?.activeWeekday] || null, period: bestWindows[0].period, saatNumber: bestWindows[0].hourNumber, planetLC: String(bestWindows[0].planet || "").toLowerCase(), dayName: analysis?.liveNow?.day, saatNum: saatDisplayNum(bestWindows[0].hourNumber, bestWindows[0].period), planet: bestWindows[0].planet, startTime: bestWindows[0].startTime, endTime: bestWindows[0].endTime }
    : nextOpp
      ? { dayKey: nextOpp.dayKey, period: nextOpp.period, saatNumber: nextOpp.hour, planetLC: String(nextOpp.planet || "").toLowerCase(), dayName: nextOpp.dayName, saatNum: saatDisplayNum(nextOpp.hour, nextOpp.period), planet: nextOpp.planet, startTime: nextOpp.startTime, endTime: nextOpp.endTime }
      : null;

  if (!target) {
    return (
      <Box number={7} titleEn="How to Improve" titleMl="എങ്ങനെ മെച്ചപ്പെടുത്താം" icon={TrendingUp} lang={lang}>
        <p className={lang === "ml" ? "font-malayalam text-sm" : "font-inter text-sm"} style={{ color: "rgba(255,255,255,0.60)" }}>
          {T("No improvement opportunity found in the uploaded books.", "അപ്‌ലോഡ് ചെയ്ത പുസ്തകങ്ങളിൽ മെച്ചപ്പെടൽ അവസരമൊന്നുമില്ല.", lang)}
        </p>
      </Box>
    );
  }

  const improved = computeCompat(analysis, { dayKey: target.dayKey, period: target.period, saatNumber: target.saatNumber, planetLC: target.planetLC }).final;
  const cColor = compatColor(improved);
  const increase = improved - current;

  const steps = [];
  const curDay = analysis?.liveNow?.day;
  if (target.dayName && target.dayName !== curDay) steps.push({ labelEn: "Change weekday", labelMl: "ദിവസം മാറ്റുക", value: translateDay(target.dayName, lang) });
  if (target.saatNum) steps.push({ labelEn: "Change Saat", labelMl: "സഅാത് മാറ്റുക", value: `#${target.saatNum} · ${translatePlanet(target.planet, lang)}` });
  if (req.nightRequired === true && target.period === "night") steps.push({ labelEn: "Night instead of Day", labelMl: "പകലിന് പകരം രാത്രി", value: "" });

  return (
    <Box number={7} titleEn="How to Improve" titleMl="എങ്ങനെ മെച്ചപ്പെടുത്താം" icon={TrendingUp} lang={lang}>
      {/* CONCLUSION FIRST */}
      <div className="rounded-xl p-3 mb-3 flex items-center justify-between" style={{ background: `${cColor}12`, border: `1px solid ${cColor}50` }}>
        <div>
          <p className="font-inter text-sm font-bold" style={{ color: cColor }}>{T("Result", "ഫലം", lang)}: {improved}%</p>
          {increase > 0 && <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.65)" }}>+{increase}% {T("increase", "വർദ്ധനവ്", lang)}</p>}
        </div>
        <div className="text-center">
          <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Current", "നിലവിൽ", lang)}</p>
          <p className="font-inter text-xl font-bold" style={{ color: compatColor(current) }}>{current}%</p>
        </div>
      </div>

      {/* VERTICAL PATH */}
      <div>
        <div className="rounded-lg p-2.5 text-center" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Start", "തുടക്കം", lang)}</p>
          <p className="font-inter text-sm font-bold" style={{ color: compatColor(current) }}>{current}%</p>
        </div>
        {steps.map((s, i) => (
          <div key={i}>
            <div className="flex justify-center py-1"><ArrowDown className="w-4 h-4" style={{ color: G.dim }} /></div>
            <div className="rounded-lg p-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
              <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T(s.labelEn, s.labelMl, lang)}</p>
              {s.value && <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{s.value}</p>}
            </div>
          </div>
        ))}
        <div className="flex justify-center py-1"><ArrowDown className="w-4 h-4" style={{ color: cColor }} /></div>
        <div className="rounded-lg p-2.5 text-center" style={{ background: `${cColor}12`, border: `1px solid ${cColor}50` }}>
          <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Result", "ഫലം", lang)}</p>
          <p className="font-inter text-lg font-bold" style={{ color: cColor }}>{improved}% {increase > 0 ? `(+${increase}%)` : ""}</p>
        </div>
      </div>
    </Box>
  );
}