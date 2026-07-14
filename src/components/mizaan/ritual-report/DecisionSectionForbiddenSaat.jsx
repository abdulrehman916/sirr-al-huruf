// ═══════════════════════════════════════════════════════════════
// SECTION 8 — FORBIDDEN SAAT
// Only Saat forbidden for this purpose, each with one-line reason.
// ═══════════════════════════════════════════════════════════════
import { Ban } from "lucide-react";
import { G, T, translatePlanet, saatDisplayNum } from "./shared";

function cleanReason(text) {
  if (!text) return "";
  return String(text).replace(/Source\s*:.*?(\.|$)/gi, "").replace(/Astrology Clock\s*:/gi, "").split(/\n/)[0].trim();
}

export default function DecisionSectionForbiddenSaat({ analysis, lang }) {
  const avoidWindows = analysis?.avoidWindowsToday || [];
  const conflictingRules = analysis?.conflictingRules || [];

  const forbidden = avoidWindows.map((w) => {
    const rules = conflictingRules.filter((r) => r.saat_number === w.hourNumber && r.period === w.period);
    const reason = rules.map((r) => cleanReason(lang === "ml" && r.text_ml ? r.text_ml : r.text_en)).filter(Boolean).slice(0, 1).join(" ");
    return {
      saatNum: saatDisplayNum(w.hourNumber, w.period),
      planet: w.planet,
      startTime: w.startTime,
      endTime: w.endTime,
      reason: reason || T("Enemy influence.", "ശത്രു സ്വാധീനം.", lang),
    };
  });

  if (forbidden.length === 0) return null;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: `1px solid ${G.border}`, boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)" }}>
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
          <Ban className="w-5 h-5" style={{ color: "#F87171" }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>8</span>
          <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {T("Forbidden Saat", "നിരോധിത സഅാത്", lang)}
          </h3>
        </div>
      </div>
      <div className="p-4">
        {forbidden.map((f, idx) => (
          <div key={`forbidden-${idx}`} className="rounded-lg p-2.5 mb-2 last:mb-0" style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.20)" }}>
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="font-inter text-xs font-bold" style={{ color: "#fff" }}>
                {T("Saat", "സഅാത്", lang)} #{f.saatNum} ({translatePlanet(f.planet, lang)})
              </span>
              {f.startTime && <span className="font-inter text-[10px]" style={{ color: G.dim }}>{f.startTime}–{f.endTime}</span>}
            </div>
            <p className={lang === "ml" ? "font-malayalam text-[11px] leading-relaxed" : "font-inter text-[11px] leading-relaxed"} style={{ color: "rgba(255,255,255,0.65)" }}>{f.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}