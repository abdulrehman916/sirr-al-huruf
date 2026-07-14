// ═══════════════════════════════════════════════════════════════
// SECTION 2 — WHY?
// Compact: Purpose, Selected Saat, Relationship, Strength, Reason
// One short reason from database. No long paragraphs.
// ═══════════════════════════════════════════════════════════════
import { HelpCircle } from "lucide-react";
import { G, T, translatePlanet, translateDay, MIZAN_DAY_NAMES, DAY_KEY_BY_INDEX } from "./shared";

function cleanReason(text) {
  if (!text) return "";
  return String(text)
    .replace(/Source\s*:.*?(\.|$)/gi, "")
    .replace(/Havâss[^\s]*\s*Derinlikleri[^\n]*/gi, "")
    .replace(/Astrology Clock\s*:/gi, "")
    .split(/\n/)[0]
    .trim();
}

export default function DecisionSectionWhy({ analysis, resolvedPurpose, lang }) {
  const req = analysis?.req || {};
  const liveNow = analysis?.liveNow || {};
  const astro = analysis?.astroClockStatus || {};
  const matchingRules = analysis?.matchingRules || [];
  const conflictingRules = analysis?.conflictingRules || [];

  const planetLC = String(liveNow.kawkab || liveNow.planetaryHour || "").toLowerCase();
  const dayKey = DAY_KEY_BY_INDEX[astro.activeWeekday];

  // Relationship
  const isEnemy = (req.enemyPlanets || []).some((p) => p.toLowerCase() === planetLC) || (req.worstHours || []).some((p) => p.toLowerCase() === planetLC);
  const isFriendly = (req.hours || []).some((p) => p.toLowerCase() === planetLC) && (!req.days || req.days.includes(dayKey));
  const relationship = isEnemy ? "Enemy" : isFriendly ? "Friendly" : "Neutral";
  const relColor = relationship === "Friendly" ? "#4ADE80" : relationship === "Enemy" ? "#F87171" : "#FBBF24";
  const relMl = { Friendly: "സൗഹൃദം", Neutral: "നിഷ്പക്ഷം", Enemy: "ശത്രു" };

  // Strength
  let score = 50;
  if (req.days?.includes(dayKey)) score += 20;
  if (req.hours?.some((p) => p.toLowerCase() === planetLC)) score += 20;
  if (req.nightRequired === true && liveNow.laylNahar === "Layl") score += 10;
  if (req.enemyPlanets?.some((p) => p.toLowerCase() === planetLC)) score -= 25;
  if (req.worstHours?.some((p) => p.toLowerCase() === planetLC)) score -= 15;
  if (req.worstDays?.includes(dayKey)) score -= 15;
  score = Math.max(0, Math.min(100, score));
  const stars = score >= 85 ? 5 : score >= 70 ? 4 : score >= 50 ? 3 : score >= 30 ? 2 : score >= 15 ? 1 : 0;
  const strengthMl = { 5: "വളരെ ശക്തം", 4: "ശക്തം", 3: "മിതമായത്", 2: "ദുർബലം", 1: "വളരെ ദുർബലം", 0: "വളരെ ദുർബലം" };
  const strengthEn = { 5: "Very Strong", 4: "Strong", 3: "Moderate", 2: "Weak", 1: "Very Weak", 0: "Very Weak" };

  // Reason from database
  const reasonRules = isEnemy ? conflictingRules : matchingRules;
  const reasonText = reasonRules
    .map((r) => cleanReason(lang === "ml" && r.text_ml ? r.text_ml : r.text_en))
    .filter(Boolean)
    .slice(0, 1)
    .join(" ");

  const purposeText = (lang === "ml" ? resolvedPurpose?.interpretation_ml : resolvedPurpose?.interpretation_en) || analysis?.ritualType || "";

  function FieldRow({ label, value, color }) {
    return (
      <div className="flex items-center justify-between gap-2 py-1.5">
        <span className="font-inter text-[10px] uppercase tracking-wider" style={{ color: G.dim }}>{label}</span>
        <span className={lang === "ml" ? "font-malayalam text-xs font-bold" : "font-inter text-xs font-bold"} style={{ color: color || "#fff" }}>{value}</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: `1px solid ${G.border}`, boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)" }}>
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
          <HelpCircle className="w-5 h-5" style={{ color: G.text }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>2</span>
          <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {T("Why?", "എന്തുകൊണ്ട്?", lang)}
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <FieldRow label={T("Purpose", "ലക്ഷ്യം", lang)} value={purposeText} />
          <FieldRow label={T("Selected Saat", "തിരഞ്ഞെടുത്ത സഅാത്", lang)} value={`${translatePlanet(liveNow.kawkab || liveNow.planetaryHour, lang)} ${T("Saat", "സഅാത്", lang)}`} />
          <FieldRow label={T("Relationship", "ബന്ധം", lang)} value={lang === "ml" ? relMl[relationship] : relationship} color={relColor} />
          <FieldRow label={T("Strength", "ശക്തി", lang)} value={`{"★".repeat(stars)}{"☆".repeat(5 - stars)} ${lang === "ml" ? strengthMl[stars] : strengthEn[stars]}`} color={stars >= 3 ? "#4ADE80" : stars >= 2 ? "#FBBF24" : "#F87171"} />
        </div>
        <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color: G.dim }}>{T("Reason", "കാരണം", lang)}</p>
          {reasonText ? (
            <p className={lang === "ml" ? "font-malayalam text-xs leading-relaxed" : "font-inter text-xs leading-relaxed"} style={{ color: "rgba(255,255,255,0.75)" }}>{reasonText}</p>
          ) : (
            <p className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"} style={{ color: "rgba(255,255,255,0.60)" }}>
              {T("No matching rule found in the uploaded database.", "അപ്ലോഡ് ചെയ്ത ഡാറ്റാബേസിൽ പൊരുത്തമുള്ള നിയമമില്ല.", lang)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}