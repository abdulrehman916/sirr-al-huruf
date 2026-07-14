import { Ban } from "lucide-react";
import { G, T, Box, translatePlanet, translateDay, saatDisplayNum } from "../v3/shared";
import SourcesCollapse from "./SourcesCollapse";

// CARD 3 — FORBIDDEN TIMES (two-level: Day → Hour)
// LEVEL 1 — Day Analysis: is the ritual generally suitable/unsuitable on this
//   weekday? (based on how many of its 24 hours the book rules allow/forbid).
// LEVEL 2 — Hour-by-Hour: every planetary hour of the selected weekday judged
//   independently by its exact context record. Forbidden Hours and Allowed
//   Hours are listed separately, each with the book rule reason.
// The whole day is NEVER blanket-forbidden — only the hours the book rules
// explicitly forbid are forbidden; hours with no rule are marked "No rule".
export default function Card3ForbiddenTimes({ analysis, lang }) {
  const breakdown = (analysis?.dayHourBreakdown || []).filter(h => !h.past);
  const dayName = breakdown[0]?.dayName ? translateDay(breakdown[0].dayName, lang) : T("Selected Day", "തിരഞ്ഞെടുത്ത ദിവസം", lang);
  const allowed = breakdown.filter(h => h.status === "allowed");
  const forbidden = breakdown.filter(h => h.status === "forbidden");
  const neutral = breakdown.filter(h => h.status === "neutral");

  const verdict = allowed.length > 0 && forbidden.length === 0
    ? { en: "Generally suitable", ml: "പൊതുവെ അനുയോജ്യം", c: "#4ADE80" }
    : allowed.length === 0 && forbidden.length > 0
      ? { en: "Generally unsuitable", ml: "പൊതുവെ അനുയോജ്യമല്ല", c: "#F87171" }
      : { en: "Mixed — some hours allowed, some forbidden", ml: "മിശ്രിതം — ചില സമയങ്ങൾ അനുയോജ്യം, ചിലത് നിരോധിതം", c: "#FBBF24" };

  const HourRow = ({ h }) => (
    <div className="rounded-lg p-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
      <div className="flex items-center justify-between mb-0.5">
        <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>#{saatDisplayNum(h.hourNumber, h.period)} {translatePlanet(h.planet, lang)} · {h.startTime}–{h.endTime} · {h.period === "night" ? T("Night", "രാത്രി", lang) : T("Day", "പകൽ", lang)}</p>
        <span className="font-inter text-[10px] font-bold px-2 py-0.5 rounded-full" style={{
          color: h.status === "allowed" ? "#4ADE80" : h.status === "forbidden" ? "#F87171" : "#94A3B8",
          border: `1px solid ${h.status === "allowed" ? "rgba(74,222,128,0.40)" : h.status === "forbidden" ? "rgba(248,113,113,0.40)" : "rgba(148,163,184,0.40)"}`,
          background: h.status === "allowed" ? "rgba(74,222,128,0.10)" : h.status === "forbidden" ? "rgba(248,113,113,0.10)" : "rgba(148,163,184,0.10)",
        }}>{h.status === "allowed" ? T("Allowed", "അനുവദനീയം", lang) : h.status === "forbidden" ? T("Forbidden", "നിരോധിതം", lang) : T("No rule", "നിയമമില്ല", lang)}</span>
      </div>
      <p className={lang === "ml" ? "font-malayalam text-[10px]" : "font-inter text-[10px]"} style={{ color: "rgba(255,255,255,0.62)" }}>
        {lang === "ml" && h.reasonMl ? h.reasonMl : (h.reasonEn || T("No book rule for this exact hour.", "ഈ സമയത്തിന് പുസ്തക നിയമമില്ല.", lang))}
      </p>
      <SourcesCollapse sources={h.rules} lang={lang} />
    </div>
  );

  return (
    <Box number={3} titleEn="Forbidden Times" titleMl="നിരോധിത സമയങ്ങൾ" icon={Ban} lang={lang}>
      {/* LEVEL 1 — DAY ANALYSIS */}
      <div className="rounded-xl p-3 mb-3" style={{ background: `${verdict.c}12`, border: `1px solid ${verdict.c}50` }}>
        <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Level 1 — Day Analysis", "ലെവൽ 1 — ദിവസ വിശകലനം", lang)}: {dayName}</p>
        <p className="font-inter text-sm font-bold" style={{ color: verdict.c }}>{lang === "ml" ? verdict.ml : verdict.en}</p>
        <p className={lang === "ml" ? "font-malayalam text-[11px] mt-0.5" : "font-inter text-[11px] mt-0.5"} style={{ color: "rgba(255,255,255,0.65)" }}>
          {T("Allowed", "അനുവദനീയം", lang)}: {allowed.length} · {T("Forbidden", "നിരോധിതം", lang)}: {forbidden.length} · {T("No rule", "നിയമമില്ല", lang)}: {neutral.length} / 24
        </p>
      </div>

      {/* LEVEL 2 — HOUR-BY-HOUR */}
      <p className="font-inter text-[9px] uppercase tracking-wider mb-1.5" style={{ color: G.dim }}>{T("Level 2 — Hour-by-Hour", "ലെവൽ 2 — മണിക്കൂർ വാരി", lang)}</p>

      {forbidden.length > 0 && (
        <div className="mb-3">
          <p className="font-inter text-[10px] font-bold mb-1.5" style={{ color: "#F87171" }}>{T("Forbidden Hours", "നിരോധിത സമയങ്ങൾ", lang)}</p>
          <div className="space-y-1.5">{forbidden.map((h, i) => <HourRow key={i} h={h} />)}</div>
        </div>
      )}
      {allowed.length > 0 && (
        <div className="mb-3">
          <p className="font-inter text-[10px] font-bold mb-1.5" style={{ color: "#4ADE80" }}>{T("Allowed Hours", "അനുവദനീയ സമയങ്ങൾ", lang)}</p>
          <div className="space-y-1.5">{allowed.map((h, i) => <HourRow key={i} h={h} />)}</div>
        </div>
      )}
      {neutral.length > 0 && (
        <div className="mb-2">
          <p className="font-inter text-[10px] font-bold mb-1.5" style={{ color: "#94A3B8" }}>{T("Hours with no book rule", "നിയമമില്ലാത്ത സമയങ്ങൾ", lang)}</p>
          <div className="flex flex-wrap gap-1.5">
            {neutral.map((h, i) => <span key={i} className="font-inter text-[10px] px-2 py-0.5 rounded-full" style={{ color: "#94A3B8", border: "1px solid rgba(148,163,184,0.30)", background: "rgba(148,163,184,0.08)" }}>#{saatDisplayNum(h.hourNumber, h.period)}</span>)}
          </div>
        </div>
      )}
      {forbidden.length === 0 && allowed.length === 0 && (
        <p className={lang === "ml" ? "font-malayalam text-sm" : "font-inter text-sm"} style={{ color: "rgba(255,255,255,0.60)" }}>{T("No book rule matched any hour of this day.", "ഈ ദിവസത്തെ ഒരു സമയത്തും പുസ്തക നിയമം പൊരുത്തപ്പെട്ടില്ല.", lang)}</p>
      )}
      <p className={lang === "ml" ? "font-malayalam text-[10px]" : "font-inter text-[10px]"} style={{ color: "rgba(255,255,255,0.50)" }}>
        {T("The whole day is not forbidden — only the hours the book rules forbid. Each hour is judged independently.", "ദിവസം മുഴുവൻ നിരോധിതമല്ല — പുസ്തക നിയമങ്ങൾ നിരോധിക്കുന്ന സമയങ്ങൾ മാത്രം. ഓരോ സമയവും പ്രത്യേകം വിലയിരുത്തുന്നു.", lang)}
      </p>
    </Box>
  );
}