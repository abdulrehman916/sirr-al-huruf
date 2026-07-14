import { Ban } from "lucide-react";
import { G, T, Box, translatePlanet, translateDay, saatDisplayNum, computeCompat } from "../v3/shared";
import SourcesCollapse from "./SourcesCollapse";

// Per-hour grade — see Card2NextTimes. Forbidden = book forbids; Strong/Allowed/
// Weak = the hour is recommended, graded by strength; No rule = no imported rule.
function gradeOf(status, pct) {
  if (status === "forbidden") return { en: "Forbidden", ml: "നിരോധിതം", c: "#F87171" };
  if (status === "neutral") return { en: "No rule", ml: "നിയമമില്ല", c: "#94A3B8" };
  if (pct >= 70) return { en: "Strong", ml: "ശക്തം", c: "#4ADE80" };
  if (pct >= 40) return { en: "Allowed", ml: "അനുവദനീയം", c: "#A3E635" };
  return { en: "Weak", ml: "ദുർബലം", c: "#FBBF24" };
}

// CARD 3 — FORBIDDEN TIMES (two-level: Day → Hour, imported book rules only)
// LEVEL 1 — Day Analysis: is the ritual generally suitable/unsuitable on this
//   weekday? If EVERY planetary hour is forbidden, states so explicitly.
// LEVEL 2 — Hour-by-Hour: every planetary hour judged independently by its
//   exact context record. Forbidden Hours and Allowed Hours are listed
//   separately, each with the imported book-rule reason. The whole day is
//   never blanket-forbidden unless every hour is forbidden by the book.
export default function Card3ForbiddenTimes({ analysis, lang }) {
  const breakdown = (analysis?.dayHourBreakdown || []).filter(h => !h.past);
  const dayName = breakdown[0]?.dayName ? translateDay(breakdown[0].dayName, lang) : T("Selected Day", "തിരഞ്ഞെടുത്ത ദിവസം", lang);
  const allowed = breakdown.filter(h => h.status === "allowed");
  const forbidden = breakdown.filter(h => h.status === "forbidden");
  const neutral = breakdown.filter(h => h.status === "neutral");
  const total = breakdown.length || 1;

  const allForbidden = forbidden.length > 0 && allowed.length === 0 && neutral.length === 0;
  const noRulesAtAll = forbidden.length === 0 && allowed.length === 0;

  const verdict = allForbidden
    ? { en: `All planetary hours on ${breakdown[0]?.dayName || "this day"} are forbidden for this purpose.`, ml: `${breakdown[0]?.dayName || "ഈ ദിവസത്തിലെ"} എല്ലാ ഗ്രഹ സമയങ്ങളും ഈ ലക്ഷ്യത്തിന് നിരോധിതമാണ്.`, c: "#F87171" }
    : allowed.length > 0 && forbidden.length === 0
      ? { en: "Generally suitable", ml: "പൊതുവെ അനുയോജ്യം", c: "#4ADE80" }
      : allowed.length === 0 && forbidden.length === 0
        ? { en: "No matching rule found in the imported sources.", ml: "ഇറക്കുമതി ചെയ്ത സ്രോതസ്സുകളിൽ പൊരുത്തപ്പെടുന്ന നിയമമൊന്നുമില്ല.", c: "#94A3B8" }
        : { en: "Mixed — some hours allowed, some forbidden", ml: "മിശ്രിതം — ചില സമയങ്ങൾ അനുയോജ്യം, ചിലത് നിരോധിതം", c: "#FBBF24" };

  const HourRow = ({ h }) => {
    const pct = h.status === "allowed"
      ? computeCompat(analysis, { weekday: h.weekday, dayKey: h.dayKey, period: h.period, saatNumber: h.hourNumber, planetLC: String(h.planet || "").toLowerCase() }).final
      : 0;
    const gr = gradeOf(h.status, pct);
    return (
      <div className="rounded-lg p-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
        <div className="flex items-center justify-between mb-0.5">
          <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>#{saatDisplayNum(h.hourNumber, h.period)} {translatePlanet(h.planet, lang)} · {h.startTime}–{h.endTime} · {h.period === "night" ? T("Night", "രാത്രി", lang) : T("Day", "പകൽ", lang)}</p>
          <span className="font-inter text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: gr.c, border: `1px solid ${gr.c}55`, background: `${gr.c}12` }}>{lang === "ml" ? gr.ml : gr.en}</span>
        </div>
        <p className={lang === "ml" ? "font-malayalam text-[10px]" : "font-inter text-[10px]"} style={{ color: "rgba(255,255,255,0.62)" }}>
          {lang === "ml" && h.reasonMl ? h.reasonMl : (h.reasonEn || T("No matching rule found in the imported sources.", "ഇറക്കുമതി ചെയ്ത സ്രോതസ്സുകളിൽ പൊരുത്തപ്പെടുന്ന നിയമമൊന്നുമില്ല.", lang))}
        </p>
        <SourcesCollapse sources={h.rules} lang={lang} />
      </div>
    );
  };

  return (
    <Box number={3} titleEn="Forbidden Times" titleMl="നിരോധിത സമയങ്ങൾ" icon={Ban} lang={lang}>
      {/* LEVEL 1 — DAY ANALYSIS */}
      <div className="rounded-xl p-3 mb-3" style={{ background: `${verdict.c}12`, border: `1px solid ${verdict.c}50` }}>
        <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Level 1 — Day Analysis", "ലെവൽ 1 — ദിവസ വിശകലനം", lang)}: {dayName}</p>
        <p className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: verdict.c }}>{lang === "ml" ? verdict.ml : verdict.en}</p>
        {!noRulesAtAll && (
          <p className={lang === "ml" ? "font-malayalam text-[11px] mt-0.5" : "font-inter text-[11px] mt-0.5"} style={{ color: "rgba(255,255,255,0.65)" }}>
            {T("Allowed", "അനുവദനീയം", lang)}: {allowed.length} · {T("Forbidden", "നിരോധിതം", lang)}: {forbidden.length} · {T("No rule", "നിയമമില്ല", lang)}: {neutral.length} / {total}
          </p>
        )}
      </div>

      {/* LEVEL 2 — HOUR-BY-HOUR */}
      {!allForbidden && !noRulesAtAll && (
        <p className="font-inter text-[9px] uppercase tracking-wider mb-1.5" style={{ color: G.dim }}>{T("Level 2 — Hour-by-Hour", "ലെവൽ 2 — മണിക്കൂർ വാരി", lang)}</p>
      )}

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
          <p className="font-inter text-[10px] font-bold mb-1.5" style={{ color: "#94A3B8" }}>{T("Hours with no imported rule", "നിയമമില്ലാത്ത സമയങ്ങൾ", lang)}</p>
          <div className="flex flex-wrap gap-1.5">
            {neutral.map((h, i) => <span key={i} className="font-inter text-[10px] px-2 py-0.5 rounded-full" style={{ color: "#94A3B8", border: "1px solid rgba(148,163,184,0.30)", background: "rgba(148,163,184,0.08)" }}>#{saatDisplayNum(h.hourNumber, h.period)}</span>)}
          </div>
        </div>
      )}
      <p className={lang === "ml" ? "font-malayalam text-[10px]" : "font-inter text-[10px]"} style={{ color: "rgba(255,255,255,0.50)" }}>
        {T("Each hour is judged independently by the imported book rules — the whole day is forbidden only when every hour is forbidden.", "ഓരോ സമയവും ഇറക്കുമതി ചെയ്ത പുസ്തക നിയമങ്ങൾ കൊണ്ട് പ്രത്യേകം വിലയിരുത്തുന്നു — എല്ലാ സമയവും നിരോധിതമാകുമ്പോൾ മാത്രമേ ദിവസം മുഴുവൻ നിരോധിതമാവൂ.", lang)}
      </p>
    </Box>
  );
}