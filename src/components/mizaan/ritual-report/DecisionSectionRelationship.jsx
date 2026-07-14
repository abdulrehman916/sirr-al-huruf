// ═══════════════════════════════════════════════════════════════
// SECTION 2 — RELATIONSHIP & STRENGTH
// Relationship: Friendly / Neutral / Enemy
// Strength: ★★★★★ Very Strong → ★ Very Weak
// Explanation from active rule database
// ═══════════════════════════════════════════════════════════════
import { Heart, Shield, Swords, Zap } from "lucide-react";
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

export default function DecisionSectionRelationship({ analysis, lang }) {
  const req = analysis?.req || {};
  const liveNow = analysis?.liveNow || {};
  const astroClockStatus = analysis?.astroClockStatus || {};
  const matchingRules = analysis?.matchingRules || [];
  const conflictingRules = analysis?.conflictingRules || [];

  const currentPlanet = liveNow.kawkab || liveNow.planetaryHour || "";
  const planetLC = String(currentPlanet).toLowerCase();
  const activeWeekday = astroClockStatus.activeWeekday;
  const dayKey = DAY_KEY_BY_INDEX[activeWeekday];

  // ── Relationship ──
  const isEnemy =
    (req.enemyPlanets || []).some((p) => p.toLowerCase() === planetLC) ||
    (req.worstHours || []).some((p) => p.toLowerCase() === planetLC);
  const isFriendly =
    (req.hours || []).some((p) => p.toLowerCase() === planetLC) &&
    (!req.days || req.days.includes(dayKey));
  const relationship = isEnemy ? "Enemy" : isFriendly ? "Friendly" : "Neutral";

  const relColor = relationship === "Friendly" ? "#4ADE80" : relationship === "Enemy" ? "#F87171" : "#FBBF24";
  const RelIcon = relationship === "Friendly" ? Heart : relationship === "Enemy" ? Swords : Shield;
  const relLabelMl = { Friendly: "സൗഹൃദം", Neutral: "നിഷ്പക്ഷം", Enemy: "ശത്രു" };

  // ── Strength Score ──
  let score = 50;
  const reasons = [];
  if (req.days?.includes(dayKey)) { score += 20; reasons.push({ en: `Selected day ${translateDay(MIZAN_DAY_NAMES[dayKey], lang)} is recommended for this purpose.`, pass: true }); }
  if (req.hours?.some((p) => p.toLowerCase() === planetLC)) { score += 20; reasons.push({ en: `Selected Saat ruled by ${translatePlanet(currentPlanet, lang)} is recommended for this purpose.`, pass: true }); }
  if (req.nightRequired === true && liveNow.laylNahar === "Layl") { score += 10; reasons.push({ en: "Night (Layl) requirement is satisfied.", pass: true }); }
  if (req.enemyPlanets?.some((p) => p.toLowerCase() === planetLC)) { score -= 25; reasons.push({ en: `Selected planet ${translatePlanet(currentPlanet, lang)} is an enemy planet for this purpose.`, pass: false }); }
  if (req.worstHours?.some((p) => p.toLowerCase() === planetLC)) { score -= 15; reasons.push({ en: `Selected Saat ${translatePlanet(currentPlanet, lang)} is a forbidden hour for this purpose.`, pass: false }); }
  if (req.worstDays?.includes(dayKey)) { score -= 15; reasons.push({ en: `Selected day ${translateDay(MIZAN_DAY_NAMES[dayKey], lang)} is a forbidden day for this purpose.`, pass: false }); }
  score = Math.max(0, Math.min(100, score));

  const stars = score >= 85 ? 5 : score >= 70 ? 4 : score >= 50 ? 3 : score >= 30 ? 2 : score >= 15 ? 1 : 0;
  const strengthLabels = {
    5: { en: "Very Strong", ml: "വളരെ ശക്തം" },
    4: { en: "Strong", ml: "ശക്തം" },
    3: { en: "Moderate", ml: "മിതമായത്" },
    2: { en: "Weak", ml: "ദുർബലം" },
    1: { en: "Very Weak", ml: "വളരെ ദുർബലം" },
    0: { en: "Very Weak", ml: "വളരെ ദുർബലം" },
  };
  const strengthLabel = strengthLabels[stars];

  // WHY from database
  const dbReasons = isEnemy
    ? conflictingRules.filter((r) => r.text_en || r.text_ml).slice(0, 2)
    : isFriendly
    ? matchingRules.filter((r) => r.text_en || r.text_ml).slice(0, 2)
    : [];
  const whyText = dbReasons
    .map((r) => cleanReason(lang === "ml" && r.text_ml ? r.text_ml : r.text_en))
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        border: `1px solid ${G.border}`,
        boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)",
      }}
    >
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
          <Zap className="w-5 h-5" style={{ color: G.text }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>2</span>
          <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {T("Relationship & Strength", "ബന്ധവും ശക്തിയും", lang)}
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {/* Relationship + Strength */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3" style={{ background: `${relColor}08`, border: `1px solid ${relColor}30` }}>
            <div className="flex items-center gap-2 mb-1">
              <RelIcon className="w-5 h-5" style={{ color: relColor }} />
              <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: relColor }}>
                {T("Relationship", "ബന്ധം", lang)}
              </span>
            </div>
            <p className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
              {lang === "ml" ? relLabelMl[relationship] : relationship}
            </p>
          </div>
          <div className="rounded-xl p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: G.dim }}>
                {T("Strength", "ശക്തി", lang)}
              </span>
            </div>
            <p className="font-inter text-base font-bold" style={{ color: stars >= 3 ? "#4ADE80" : stars >= 2 ? "#FBBF24" : "#F87171" }}>
              {"★".repeat(stars)}
              {"☆".repeat(5 - stars)}
            </p>
            <p className={lang === "ml" ? "font-malayalam text-[10px]" : "font-inter text-[10px]"} style={{ color: "rgba(255,255,255,0.60)" }}>
              {lang === "ml" ? strengthLabel.ml : strengthLabel.en}
            </p>
          </div>
        </div>

        {/* WHY */}
        <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color: G.dim }}>
            {T("Why", "കാരണം", lang)}
          </p>
          {whyText ? (
            <p className={lang === "ml" ? "font-malayalam text-xs leading-relaxed" : "font-inter text-xs leading-relaxed"} style={{ color: "rgba(255,255,255,0.75)" }}>
              {whyText}
            </p>
          ) : reasons.length > 0 ? (
            <p className={lang === "ml" ? "font-malayalam text-xs leading-relaxed" : "font-inter text-xs leading-relaxed"} style={{ color: "rgba(255,255,255,0.75)" }}>
              {reasons.map((r) => (r.pass ? "✓ " : "✗ ") + r.en).join(" ")}
            </p>
          ) : (
            <p className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"} style={{ color: "rgba(255,255,255,0.60)" }}>
              {T("No relationship data available for this purpose.", "ഈ ലക്ഷ്യത്തിനായി ബന്ധ ഡാറ്റായില്ല.", lang)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}