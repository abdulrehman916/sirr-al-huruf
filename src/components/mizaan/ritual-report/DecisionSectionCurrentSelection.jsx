// ═══════════════════════════════════════════════════════════════
// SECTION 1 — CURRENT SELECTION
// Purpose, Day, Saat, Planet, Compatibility %
// ═══════════════════════════════════════════════════════════════
import { Target } from "lucide-react";
import { G, T, translatePlanet, translateDay, DAY_KEY_BY_INDEX } from "./shared";

function computeCompatibility(analysis) {
  const req = analysis?.req || {};
  const liveNow = analysis?.liveNow || {};
  const astro = analysis?.astroClockStatus || {};
  const planetLC = String(liveNow.kawkab || liveNow.planetaryHour || "").toLowerCase();
  const dayKey = DAY_KEY_BY_INDEX[astro.activeWeekday];
  let s = 50;
  if (req.days?.includes(dayKey)) s += 20;
  if (req.hours?.some((p) => p.toLowerCase() === planetLC)) s += 20;
  if (req.nightRequired === true && liveNow.laylNahar === "Layl") s += 10;
  if (req.enemyPlanets?.some((p) => p.toLowerCase() === planetLC)) s -= 25;
  if (req.worstHours?.some((p) => p.toLowerCase() === planetLC)) s -= 15;
  if (req.worstDays?.includes(dayKey)) s -= 15;
  return Math.max(0, Math.min(100, s));
}

function SelRow({ label, value, lang }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b last:border-0" style={{ borderColor: G.border }}>
      <span className="font-inter text-[10px] uppercase tracking-wider" style={{ color: G.dim }}>{label}</span>
      <span className={lang === "ml" ? "font-malayalam text-xs font-bold" : "font-inter text-xs font-bold"} style={{ color: "#fff" }}>{value}</span>
    </div>
  );
}

export default function DecisionSectionCurrentSelection({ analysis, resolvedPurpose, lang }) {
  const liveNow = analysis?.liveNow || {};
  const moonPhase = analysis?.moonPhase || {};
  const purposeText = (lang === "ml" ? resolvedPurpose?.interpretation_ml : resolvedPurpose?.interpretation_en) || analysis?.ritualType || "";
  const compatPct = computeCompatibility(analysis);
  const compatColor = compatPct >= 70 ? "#4ADE80" : compatPct >= 50 ? "#FBBF24" : "#F87171";

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: `1px solid ${G.border}`, boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)" }}>
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
          <Target className="w-5 h-5" style={{ color: G.text }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>1</span>
          <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {T("Current Selection", "നിലവിലെ തിരഞ്ഞെടുപ്പ്", lang)}
          </h3>
        </div>
      </div>
      <div className="p-4">
        <div className="rounded-lg p-3 mb-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <SelRow label={T("Purpose", "ലക്ഷ്യം", lang)} value={purposeText} lang={lang} />
          <SelRow label={T("Day", "ദിവസം", lang)} value={translateDay(liveNow.day, lang)} lang={lang} />
          <SelRow label={T("Saat", "സഅാത്", lang)} value={`#${liveNow.saat || "—"}`} lang={lang} />
          <SelRow label={T("Planet", "ഗ്രഹം", lang)} value={translatePlanet(liveNow.kawkab || liveNow.planetaryHour, lang)} lang={lang} />
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: `${compatColor}08`, border: `1px solid ${compatColor}30` }}>
          <p className="font-inter text-3xl font-bold" style={{ color: compatColor }}>{compatPct}%</p>
          <p className="font-inter text-[10px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Compatibility", "പൊരുത്തം", lang)}</p>
        </div>
      </div>
    </div>
  );
}