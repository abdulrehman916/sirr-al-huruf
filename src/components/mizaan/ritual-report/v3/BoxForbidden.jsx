import { Ban } from "lucide-react";
import { G, T, Box, translatePlanet, translateDay, MIZAN_DAY_NAMES } from "./shared";

// BOX 6 — FORBIDDEN CONDITIONS
// ONLY forbidden conditions for the CURRENT purpose.
// Every explanation comes ONLY from uploaded book rules (conflictingRules / req).
export default function BoxForbidden({ analysis, lang }) {
  const req = analysis?.req || {};
  const conflictingRules = analysis?.conflictingRules || [];

  const forbiddenDays = (req.worstDays || []).map(d => MIZAN_DAY_NAMES[d] || d);
  const forbiddenHours = req.worstHours || [];
  const enemyPlanets = req.enemyPlanets || [];

  // Reasons from conflicting rules (database text) — deduped by source
  const reasons = conflictingRules
    .filter(r => r.text_en || r.text_ml)
    .slice(0, 4)
    .map(r => ({ text: lang === "ml" && r.text_ml ? r.text_ml : r.text_en, source: r.source }));

  const hasAny = forbiddenDays.length || forbiddenHours.length || enemyPlanets.length || reasons.length;

  if (!hasAny) {
    return (
      <Box number={6} titleEn="Forbidden Conditions" titleMl="നിരോധിത വ്യവസ്ഥകൾ" icon={Ban} lang={lang}>
        <p className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"} style={{ color: "rgba(255,255,255,0.60)" }}>
          {T("No forbidden conditions found for this purpose in the uploaded books.",
            "അപ്‌ലോഡ് ചെയ്ത പുസ്തകങ്ങളിൽ ഈ ലക്ഷ്യത്തിന് നിരോധിത വ്യവസ്ഥകളൊന്നുമില്ല.", lang)}
        </p>
      </Box>
    );
  }

  const chips = (items, kind) => items.map((it, i) => (
    <span key={i} className="font-inter text-[10px] px-2 py-0.5 rounded-full"
      style={{ color: "#F87171", border: "1px solid rgba(248,113,113,0.40)", background: "rgba(248,113,113,0.10)" }}>
      {kind === "day" ? translateDay(it, lang) : translatePlanet(it, lang)}
    </span>
  ));

  return (
    <Box number={6} titleEn="Forbidden Conditions" titleMl="നിരോധിത വ്യവസ്ഥകൾ" icon={Ban} lang={lang}>
      <div className="space-y-2.5">
        {forbiddenDays.length > 0 && (
          <div>
            <p className="font-inter text-[9px] uppercase tracking-wider mb-1" style={{ color: G.dim }}>{T("Forbidden Weekdays", "നിരോധിത ദിവസങ്ങൾ", lang)}</p>
            <div className="flex flex-wrap gap-1.5">{chips(forbiddenDays, "day")}</div>
          </div>
        )}
        {(forbiddenHours.length > 0 || enemyPlanets.length > 0) && (
          <div>
            <p className="font-inter text-[9px] uppercase tracking-wider mb-1" style={{ color: G.dim }}>{T("Forbidden Saat / Planet", "നിരോധിത സഅാത് / ഗ്രഹം", lang)}</p>
            <div className="flex flex-wrap gap-1.5">{chips([...new Set([...forbiddenHours, ...enemyPlanets])], "planet")}</div>
          </div>
        )}

        {reasons.length > 0 && (
          <div className="pt-1">
            <p className="font-inter text-[9px] uppercase tracking-wider mb-1.5" style={{ color: G.dim }}>{T("Why (Book Rules)", "കാരണം (പുസ്തക നിയമങ്ങൾ)", lang)}</p>
            <div className="space-y-1.5">
              {reasons.map((r, i) => (
                <div key={i} className="rounded-lg p-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
                  <p className={lang === "ml" ? "font-malayalam text-xs leading-relaxed" : "font-inter text-xs leading-relaxed"}
                    style={{ color: "rgba(255,255,255,0.72)" }}>{String(r.text).split(/\n/)[0]}</p>
                  {r.source && <p className="font-inter text-[9px] mt-1" style={{ color: G.dim }}>{r.source}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Box>
  );
}