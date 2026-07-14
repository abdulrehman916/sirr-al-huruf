import { Ban } from "lucide-react";
import { G, T, Box, translatePlanet, translateDay, MIZAN_DAY_NAMES } from "../v3/shared";
import SourcesCollapse from "./SourcesCollapse";

// CARD 3 — FORBIDDEN TIMES
// Weekdays to avoid, planetary hours to avoid, enemy planet conflicts. Every
// warning's reason comes ONLY from book rules (conflicting rules). Sources
// collapse — never raw paragraphs in the main UI.
export default function Card3ForbiddenTimes({ analysis, lang }) {
  const req = analysis?.req || {};
  const conflicting = analysis?.conflictingRules || [];
  const worstDays = (req.worstDays || []).map(d => MIZAN_DAY_NAMES[d] || d);
  const worstHours = req.worstHours || [];
  const enemyPlanets = req.enemyPlanets || [];
  const hasAny = worstDays.length || worstHours.length || enemyPlanets.length;

  const chips = (items, kind) => items.map((it, i) => (
    <span key={i} className="font-inter text-[10px] px-2 py-0.5 rounded-full" style={{ color: "#F87171", border: "1px solid rgba(248,113,113,0.40)", background: "rgba(248,113,113,0.10)" }}>
      {kind === "day" ? translateDay(it, lang) : translatePlanet(it, lang)}
    </span>
  ));

  return (
    <Box number={3} titleEn="Forbidden Times" titleMl="നിരോധിത സമയങ്ങൾ" icon={Ban} lang={lang}>
      {!hasAny ? (
        <div className="rounded-xl p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <p className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#4ADE80" }}>{T("No forbidden conditions for this ritual.", "ഈ കർമ്മത്തിന് നിരോധിത വ്യവസ്ഥകളൊന്നുമില്ല.", lang)}</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="rounded-xl p-3" style={{ background: "rgba(248,113,113,0.10)", border: "1px solid rgba(248,113,113,0.45)" }}>
            <p className={lang === "ml" ? "font-malayalam text-sm font-bold leading-snug" : "font-inter text-sm font-bold leading-snug"} style={{ color: "#F87171" }}>{T("Do NOT perform this ritual during these conditions.", "ഈ വ്യവസ്ഥകളിൽ ഈ കർമ്മം ചെയ്യരുത്.", lang)}</p>
          </div>
          {worstDays.length > 0 && (
            <div className="rounded-xl p-3" style={{ background: "rgba(153,27,27,0.12)", border: "1px solid rgba(248,113,113,0.45)" }}>
              <p className="font-inter text-[9px] uppercase tracking-wider mb-1.5" style={{ color: "#F87171" }}>{T("Weekdays to avoid", "ഒഴിവാക്കേണ്ട ദിവസങ്ങൾ", lang)}</p>
              <div className="flex flex-wrap gap-1.5">{chips(worstDays, "day")}</div>
            </div>
          )}
          {(worstHours.length > 0 || enemyPlanets.length > 0) && (
            <div className="rounded-xl p-3" style={{ background: "rgba(153,27,27,0.12)", border: "1px solid rgba(248,113,113,0.45)" }}>
              <p className="font-inter text-[9px] uppercase tracking-wider mb-1.5" style={{ color: "#F87171" }}>{T("Planetary Hours / Enemy Planets to avoid", "ഒഴിവാക്കേണ്ട സഅാത് / ശത്രു ഗ്രഹങ്ങൾ", lang)}</p>
              <div className="flex flex-wrap gap-1.5">{chips([...new Set([...worstHours, ...enemyPlanets])], "planet")}</div>
            </div>
          )}
          <p className={lang === "ml" ? "font-malayalam text-[10px]" : "font-inter text-[10px]"} style={{ color: "rgba(255,255,255,0.55)" }}>{T("Warnings come only from book rules.", "മുന്നറിയിപ്പുകൾ പുസ്തക നിയമങ്ങളിൽ നിന്ന് മാത്രം.", lang)}</p>
          <SourcesCollapse sources={conflicting} lang={lang} />
        </div>
      )}
    </Box>
  );
}