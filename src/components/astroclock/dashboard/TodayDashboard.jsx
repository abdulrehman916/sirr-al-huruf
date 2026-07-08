// ═══════════════════════════════════════════════════════════════
// SECTION 1 — TODAY'S DASHBOARD
// Complete today summary: Day, Layl/Nahar, Saat, Kawkab, Verdict,
// Best/Avoid activities, Moon summary, Warnings — all in one compact view
// ═══════════════════════════════════════════════════════════════
import { useAstroData, PLANET_TR, DAY_TR } from "./useAstroData";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext";
import { MiniCard } from "./DashboardSection";
import { Sunrise, Sunset, Clock, Sparkles, AlertTriangle, CheckCircle2, Ban, Moon } from "lucide-react";

const BENEFIC = ["sun", "jupiter", "venus", "moon"];
const MALEFIC = ["saturn", "mars"];

export default function TodayDashboard() {
  const d = useAstroData();
  const { txt, language } = useAstroClockLanguage();
  if (!d.currentHour) return null;

  const dayName = language === "ml" ? d.dayInfo?.name_ml : language === "tr" ? DAY_TR[d.activeDayIndex] : d.dayInfo?.name_en;
  const planetName = language === "ml" ? d.planetInfo[d.currentHour.planet]?.name_ml_equivalent : language === "tr" ? PLANET_TR[d.currentHour.planet] : d.planetInfo[d.currentHour.planet]?.name_en;
  const dayRulerName = language === "ml" ? d.planetInfo[d.dayRuler.planet]?.name_ml_equivalent : language === "tr" ? PLANET_TR[d.dayRuler.planet] : d.planetInfo[d.dayRuler.planet]?.name_en;
  const dayRulerSymbol = d.planetInfo[d.dayRuler.planet]?.symbol || "☉";

  // Verdict
  const isBenefic = BENEFIC.includes(d.dayRuler.planet);
  const isMalefic = MALEFIC.includes(d.dayRuler.planet);
  const verdict = isBenefic ? "excellent" : isMalefic ? "neutral" : "good";
  const verdictColor = isBenefic ? "#4ADE80" : isMalefic ? "#FBBF24" : "#86EFAC";
  const verdictText = txt("അനുകൂലം", "Favorable", "Elverişli");
  const verdictSub = txt(
    `${dayRulerName} ${txt("ഭരിക്കുന്ന ദിവസം", "ruled day", "yönetilen gün")}`,
    `Ruled by ${dayRulerName}`,
    `${dayRulerName} yönetiminde`
  );

  // Best / Avoid activities
  const goodActions = language === "ml" ? d.weekdayAnalysis?.goodWorks_ml || d.weekdayAnalysis?.goodWorks : d.weekdayAnalysis?.goodWorks;
  const badActions = language === "ml" ? d.weekdayAnalysis?.badWorks_ml || d.weekdayAnalysis?.badWorks : d.weekdayAnalysis?.badWorks;

  // Moon summary
  const moonSign = d.moonPosition?.zodiacSign;
  const moonSignName = language === "ml" ? moonSign?.name_ml : language === "tr" ? d.moonZodiacFull?.name_tr : moonSign?.name_en;
  const moonPhasePct = d.moonPosition ? parseFloat(d.moonPosition.phase) : 0;
  const moonPhaseLabel = language === "ml" ? d.moonPhaseDesc?.ml : d.moonPhaseDesc?.en;
  const waxing = d.lunarDay ? d.lunarDay <= 14 : true;
  const moonMansionName = d.currentMansion?.name || d.currentMansion?.name_en || "—";

  // Warnings
  const warnings = [];
  if (d.weekdayAnalysis?.enemyDays?.length) {
    warnings.push(txt(
      `${txt("ശത്രു ദിവസങ്ങൾ", "Enemy days", "Düşman günler")}: ${d.weekdayAnalysis.enemyDays.join(", ")}`,
      `Enemy days: ${d.weekdayAnalysis.enemyDays.join(", ")}`,
      `Düşman günler: ${d.weekdayAnalysis.enemyDays.join(", ")}`
    ));
  }
  if (d.moonDignity?.strength === "weakest") {
    warnings.push(txt("ചന്ദ്രൻ നീചം (വൃശ്ചികം)", "Moon debilitated (Scorpio)", "Ay düşük (Akrep)"));
  }
  if (d.planetInfo[d.currentHour.planet]?.warnings_en?.length && language !== "ml") {
    warnings.push(d.planetInfo[d.currentHour.planet].warnings_en[0]);
  }

  const G = { text: "#F5D060", dim: "rgba(212,175,55,0.55)", border: "rgba(212,175,55,0.20)" };

  return (
    <div className="space-y-3">
      {/* ── State Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <MiniCard icon="📅" label={txt("ദിവസം", "Day", "Gün")} value={dayName} color={G.text} />
        <MiniCard icon={d.isNight ? "🌙" : "☀"} label={txt("ലൈൽ / നഹർ", "Layl / Nahar", "Gece / Gündüz")} value={d.laylNahar} color={d.isNight ? "#818CF8" : "#FBBF24"} />
        <MiniCard icon="⏰" label={txt("സഅാത്", "Saat", "Saat")} value={`#${d.currentHour.hourNumber}`} color={G.text} />
        <MiniCard icon={dayRulerSymbol} label={txt("കവ്കബ്", "Kawkab", "Kavkeb")} value={planetName} color={G.text} />
      </div>

      {/* ── Verdict ── */}
      <div className="rounded-xl p-3 flex items-center gap-3" style={{
        background: `${verdictColor}10`, border: `1px solid ${verdictColor}40`,
      }}>
        <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: verdictColor }} />
        <div className="flex-1">
          <span className="font-inter text-sm font-bold" style={{ color: verdictColor }}>{verdictText}</span>
          <span className="font-inter text-[10px] ml-2" style={{ color: "rgba(255,255,255,0.50)" }}>{verdictSub}</span>
        </div>
        <span className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.40)" }}>
          {txt("സൂര്യോദയം", "Sunrise", "Doğuş")}: {d.sunrise.toFixed(1)}h · {txt("അസ്തമയം", "Sunset", "Batış")}: {d.sunset.toFixed(1)}h
        </span>
      </div>

      {/* ── Best & Avoid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="rounded-xl p-3" style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.15)" }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#4ADE80" }} />
            <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#4ADE80" }}>
              {txt("അനുയോജ്യം", "Best Activities", "En İyi Eylemler")}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {(goodActions || []).slice(0, 5).map((a, i) => (
              <span key={i} className="font-inter text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(74,222,128,0.08)", color: "rgba(74,222,128,0.80)" }}>{a}</span>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-3" style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)" }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Ban className="w-3.5 h-3.5" style={{ color: "#F87171" }} />
            <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#F87171" }}>
              {txt("ഒഴിവാക്കുക", "Avoid", "Kaçınılacak")}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {(badActions || []).slice(0, 5).map((a, i) => (
              <span key={i} className="font-inter text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(248,113,113,0.08)", color: "rgba(248,113,113,0.80)" }}>{a}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Moon Summary ── */}
      <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: "rgba(129,140,248,0.04)", border: "1px solid rgba(129,140,248,0.15)" }}>
        <Moon className="w-4 h-4 flex-shrink-0" style={{ color: "#818CF8" }} />
        <div className="flex-1 grid grid-cols-3 gap-2">
          <div>
            <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.30)" }}>{txt("രാശി", "Zodiac", "Burç")}</span>
            <p className="font-inter text-xs font-bold" style={{ color: "#818CF8" }}>{moonSign?.symbol} {moonSignName}</p>
          </div>
          <div>
            <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.30)" }}>{txt("ഘട്ടം", "Phase", "Evre")}</span>
            <p className="font-inter text-xs font-bold" style={{ color: "#818CF8" }}>{moonPhaseLabel} ({moonPhasePct.toFixed(0)}%)</p>
          </div>
          <div>
            <span className="font-inter text-[8px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.30)" }}>{txt("നക്ഷത്രം", "Mansion", "Menzil")}</span>
            <p className="font-inter text-xs font-bold" style={{ color: "#818CF8" }}>#{d.currentMansion?.no} {moonMansionName}</p>
          </div>
        </div>
      </div>

      {/* ── Warnings ── */}
      {warnings.length > 0 && (
        <div className="rounded-xl p-3" style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#F87171" }} />
            <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: "#F87171" }}>
              {txt("മുന്നറിയിപ്പുകൾ", "Warnings", "Uyarılar")}
            </span>
          </div>
          {warnings.map((w, i) => (
            <p key={i} className="font-inter text-[11px] mb-0.5" style={{ color: "rgba(248,113,113,0.75)" }}>• {w}</p>
          ))}
        </div>
      )}
    </div>
  );
}