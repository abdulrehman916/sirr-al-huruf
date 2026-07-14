// ═══════════════════════════════════════════════════════════════
// SECTION 4 — ALTERNATIVE SAAT
// All valid alternative Saats for the selected Purpose
// Sorted from strongest to weakest
// Each with WHY explanation from the rule database
// ═══════════════════════════════════════════════════════════════
import { Clock, Star } from "lucide-react";
import { G, T, translatePlanet, saatDisplayNum } from "./shared";

function cleanReason(text) {
  if (!text) return "";
  return String(text)
    .replace(/Source\s*:.*?(\.|$)/gi, "")
    .replace(/Havâss[^\s]*\s*Derinlikleri[^\n]*/gi, "")
    .replace(/Astrology Clock\s*:/gi, "")
    .split(/\n/)[0]
    .trim();
}

function AltRow({ saatNum, planet, startTime, endTime, stars, reason, lang, isBest }) {
  const starColor = stars >= 4 ? "#4ADE80" : stars >= 3 ? "#FBBF24" : "#F87171";
  return (
    <div
      className="rounded-lg p-3"
      style={{
        background: isBest ? "rgba(74,222,128,0.06)" : G.bg,
        border: `1px solid ${isBest ? "rgba(74,222,128,0.25)" : G.border}`,
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <span className="font-inter text-xs font-bold" style={{ color: "#fff" }}>
            {T("Saat", "സഅാത്", lang)} #{saatNum}
          </span>
          <span className="font-inter text-[10px]" style={{ color: G.dim }}>
            ({translatePlanet(planet, lang)})
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-inter text-xs" style={{ color: starColor }}>
            {"★".repeat(stars)}
            {"☆".repeat(5 - stars)}
          </span>
        </div>
      </div>
      {startTime && endTime && (
        <p className="font-inter text-[10px] mb-1" style={{ color: "rgba(255,255,255,0.60)" }}>
          {startTime} – {endTime}
        </p>
      )}
      {reason && (
        <p className={lang === "ml" ? "font-malayalam text-[11px] leading-relaxed" : "font-inter text-[11px] leading-relaxed"} style={{ color: "rgba(255,255,255,0.65)" }}>
          {reason}
        </p>
      )}
    </div>
  );
}

export default function DecisionSectionAlternativeSaats({ analysis, lang }) {
  const bestWindows = analysis?.bestWindowsToday || [];
  const matchingRules = analysis?.matchingRules || [];
  const req = analysis?.req || {};

  // Sort by score descending (strongest to weakest)
  const sorted = [...bestWindows].sort((a, b) => (b.score || 0) - (a.score || 0));

  if (sorted.length === 0) return null;

  // Build WHY for each from database
  const buildReason = (w) => {
    const rules = matchingRules.filter(
      (r) => r.saat_number === w.hourNumber && r.period === w.period
    );
    const dbText = rules
      .map((r) => cleanReason(lang === "ml" && r.text_ml ? r.text_ml : r.text_en))
      .filter(Boolean)
      .join(" ");
    if (dbText) return dbText;
    // Fallback: construct from req data
    const parts = [];
    if (req.hours?.some((p) => p.toLowerCase() === w.planet?.toLowerCase()))
      parts.push(T(`${translatePlanet(w.planet, lang)} Saat is recommended for this purpose.`, `${translatePlanet(w.planet, lang)} സഅാത് ഈ ലക്ഷ്യത്തിനായി ശുപാർശ ചെയ്യുന്നു.`, lang));
    if (w.period === "night" && req.nightRequired === true)
      parts.push(T("Night (Layl) requirement satisfied.", "രാത്രി (ലൈൽ) ആവശ്യകത പാലിച്ചു.", lang));
    return parts.join(" ") || w.reason || "";
  };

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
          <Clock className="w-5 h-5" style={{ color: G.text }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>4</span>
          <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {T("Alternative Saat", "ബദൽ സഅാത്", lang)}
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-2">
        {sorted.map((w, idx) => (
          <AltRow
            key={`alt-${idx}`}
            saatNum={saatDisplayNum(w.hourNumber, w.period)}
            planet={w.planet}
            startTime={w.startTime}
            endTime={w.endTime}
            stars={w.stars || 3}
            reason={buildReason(w)}
            lang={lang}
            isBest={idx === 0}
          />
        ))}
      </div>
    </div>
  );
}