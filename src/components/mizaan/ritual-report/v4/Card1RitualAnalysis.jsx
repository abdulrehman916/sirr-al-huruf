import { Target } from "lucide-react";
import { G, T, Box, translatePlanet, translateDay, computeCompat, compatColor } from "../v3/shared";
import SourcesCollapse from "./SourcesCollapse";

function stars(pct) {
  const n = pct >= 85 ? 5 : pct >= 70 ? 4 : pct >= 50 ? 3 : pct >= 30 ? 2 : pct >= 15 ? 1 : 0;
  return "★".repeat(n) + "☆".repeat(5 - n);
}

// CARD 1 — SELECTED RITUAL ANALYSIS
// Shows the full live context + a YES/NO verdict, then a concise human-readable
// WHY (supporting/opposing planets, matched/conflicting rule counts) generated
// from structured analysis — never raw book paragraphs. Book refs collapse.
export default function Card1RitualAnalysis({ analysis, lang }) {
  const purposeEn = analysis?.ritualType || T("General Work", "പൊതു കർമ്മം", lang);
  const purposeMl = analysis?.ritualSemanticMl || "";
  const showMl = lang === "ml" && purposeMl;
  const live = analysis?.liveNow || {};
  const moon = analysis?.moonPhase || {};
  const req = analysis?.req || {};
  const suitable = !!analysis?.selectionAnalysis?.suitable;
  const compat = computeCompat(analysis).final;
  const cColor = compatColor(compat);
  const matching = analysis?.matchingRules || [];
  const conflicting = analysis?.conflictingRules || [];
  const supportPlanets = (req.hours || []).map(p => translatePlanet(p, lang)).filter(Boolean).join(", ");
  const opposePlanets = (req.enemyPlanets || []).map(p => translatePlanet(p, lang)).filter(Boolean).join(", ");
  const moonTxt = [moon.moonSign, moon.phaseName, moon.moonIllumination != null ? `${Math.round(moon.moonIllumination)}%` : ""].filter(Boolean).join(" · ");
  const mansionTxt = moon.moonMansionArabic ? `${moon.moonMansionArabic} (${moon.moonMansion || "—"})` : (moon.moonMansion || "—");

  const rows = [
    { k: T("Purpose", "ലക്ഷ്യം", lang), v: showMl ? purposeMl : purposeEn },
    { k: T("Weekday", "ദിവസം", lang), v: translateDay(live.day, lang) },
    { k: T("Planetary Hour", "ഗ്രഹ സമയം", lang), v: `#${live.saat} · ${translatePlanet(live.kawkab, lang)}` },
    { k: T("Day / Night", "പകൽ / രാത്രി", lang), v: live.laylNahar === "Layl" ? T("Night", "രാത്രി", lang) : T("Day", "പകൽ", lang) },
    { k: T("Current Moon", "നിലവിലെ ചന്ദ്രൻ", lang), v: moonTxt || "—" },
    { k: T("Lunar Mansion", "ചന്ദ്ര നക്ഷത്രം", lang), v: mansionTxt },
    { k: T("Current Planet", "നിലവിലെ ഗ്രഹം", lang), v: translatePlanet(live.kawkab, lang) },
    { k: T("Situation", "അവസ്ഥ", lang), v: suitable ? T("Suitable", "അനുയോജ്യം", lang) : T("Not Suitable", "അനുയോജ്യമല്ല", lang) },
  ];

  return (
    <Box number={1} titleEn="Selected Ritual Analysis" titleMl="തിരഞ്ഞെടുത്ത കർമ്മ വിശകലനം" icon={Target} lang={lang}>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {rows.map((r, i) => (
          <div key={i} className="rounded-lg p-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <p className="font-inter text-[9px] uppercase tracking-wider mb-0.5" style={{ color: G.dim }}>{r.k}</p>
            <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{r.v}</p>
          </div>
        ))}
      </div>

      <div className="flex items-stretch gap-2 mb-3">
        <div className="flex-1 rounded-xl p-3" style={{ background: suitable ? "rgba(74,222,128,0.10)" : "rgba(248,113,113,0.10)", border: `1px solid ${suitable ? "rgba(74,222,128,0.50)" : "rgba(248,113,113,0.50)"}` }}>
          <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Suitable right now?", "ഇപ്പോൾ അനുയോജ്യമോ?", lang)}</p>
          <p className="font-inter text-lg font-bold" style={{ color: suitable ? "#4ADE80" : "#F87171" }}>{suitable ? "✅ " + T("YES", "അതെ", lang) : "❌ " + T("NO", "അല്ല", lang)}</p>
        </div>
        <div className="rounded-xl p-3 text-center flex-shrink-0" style={{ background: `${cColor}12`, border: `1px solid ${cColor}50` }}>
          <p className="font-inter text-2xl font-bold" style={{ color: cColor }}>{compat}%</p>
          <p className="font-inter text-[8px]" style={{ color: G.dim }}>{stars(compat)}</p>
          <p className="font-inter text-[8px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Compatibility", "പൊരുത്തം", lang)}</p>
        </div>
      </div>

      <p className="font-inter text-[9px] uppercase tracking-wider mb-1.5" style={{ color: G.dim }}>{T("Why", "കാരണം", lang)}</p>
      <div className="space-y-1 mb-2">
        {supportPlanets && <p className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"} style={{ color: "rgba(255,255,255,0.78)" }}>{T("Supporting planets", "പിന്തുണയ്ക്കുന്ന ഗ്രഹങ്ങൾ", lang)}: {supportPlanets}</p>}
        {opposePlanets && <p className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"} style={{ color: "rgba(255,255,255,0.78)" }}>{T("Opposing planets", "എതിരായ ഗ്രഹങ്ങൾ", lang)}: {opposePlanets}</p>}
        <p className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"} style={{ color: "rgba(255,255,255,0.78)" }}>{T("Matched rules", "പൊരുത്തപ്പെടുന്ന നിയമങ്ങൾ", lang)}: {matching.length} · {T("Conflicting", "വിരുദ്ധമായ", lang)}: {conflicting.length}</p>
      </div>
      <SourcesCollapse sources={[...matching, ...conflicting]} lang={lang} />
    </Box>
  );
}