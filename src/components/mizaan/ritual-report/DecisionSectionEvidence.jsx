// ═══════════════════════════════════════════════════════════════
// SECTION 2 — EVIDENCE
// Books with rules for this purpose: Book Name, Rule Summary,
// How rule applies to current selection.
// ═══════════════════════════════════════════════════════════════
import { BookOpen } from "lucide-react";
import { G, T, translatePlanet, translateDay, MIZAN_DAY_NAMES, DAY_KEY_BY_INDEX, saatDisplayNum } from "./shared";

function cleanReason(text) {
  if (!text) return "";
  return String(text).replace(/Source\s*:.*?(\.|$)/gi, "").replace(/Astrology Clock\s*:/gi, "").split(/\n/)[0].trim();
}

export default function DecisionSectionEvidence({ analysis, lang }) {
  const matchingRules = analysis?.matchingRules || [];
  const conflictingRules = analysis?.conflictingRules || [];
  const allRules = [...matchingRules, ...conflictingRules];
  const liveNow = analysis?.liveNow || {};
  const astro = analysis?.astroClockStatus || {};
  const currentWeekday = astro.activeWeekday;
  const currentSaat = liveNow.saat;

  // Group by source (book name)
  const byBook = {};
  for (const rule of allRules) {
    const book = rule.source || "Unknown";
    if (!byBook[book]) byBook[book] = [];
    byBook[book].push(rule);
  }
  const books = Object.keys(byBook);

  if (books.length === 0) {
    return (
      <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: `1px solid ${G.border}`, boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)" }}>
        <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
            <BookOpen className="w-5 h-5" style={{ color: G.text }} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>2</span>
            <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
              {T("Evidence", "തെളിവ്", lang)}
            </h3>
          </div>
        </div>
        <div className="p-4">
          <p className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"} style={{ color: "rgba(255,255,255,0.60)" }}>
            {T("No matching rules found in the uploaded database for this purpose.", "ഈ ലക്ഷ്യത്തിനായി അപ്ലോഡ് ചെയ്ത ഡാറ്റാബേസിൽ പൊരുത്തമുള്ള നിയമങ്ങളൊന്നുമില്ല.", lang)}
          </p>
        </div>
      </div>
    );
  }

  // How rule applies to current selection
  function appliesText(rule) {
    const ruleDay = rule.weekday;
    const ruleSaat = rule.saat_number;
    const rulePeriod = rule.period;
    const saatDisplay = ruleSaat ? saatDisplayNum(ruleSaat, rulePeriod) : null;
    const dayName = ruleDay != null ? MIZAN_DAY_NAMES[DAY_KEY_BY_INDEX[ruleDay]] : null;

    if (ruleDay === currentWeekday && saatDisplay === currentSaat) {
      return T("This matches your current selection.", "ഇത് നിങ്ങളുടെ നിലവിലെ തിരഞ്ഞെടുപ്പുമായി പൊരുത്തപ്പെടുന്നു.", lang);
    }
    if (ruleDay === currentWeekday && saatDisplay !== currentSaat && saatDisplay) {
      return T(`This recommends Saat #${saatDisplay} for your selected Day.`, `നിങ്ങളുടെ തിരഞ്ഞെടുത്ത ദിവസത്തിനായി സഅാത് #${saatDisplay} ശുപാർശ ചെയ്യുന്നു.`, lang);
    }
    if (ruleDay !== currentWeekday && dayName && saatDisplay) {
      return T(`This recommends ${dayName} Saat #${saatDisplay}.`, `ഇത് ${translateDay(dayName, lang)} സഅാത് #${saatDisplay} ശുപാർശ ചെയ്യുന്നു.`, lang);
    }
    return T("This rule applies to your purpose.", "ഈ നിയമം നിങ്ങളുടെ ലക്ഷ്യത്തിന് ബാധകമാണ്.", lang);
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: `1px solid ${G.border}`, boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)" }}>
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
          <BookOpen className="w-5 h-5" style={{ color: G.text }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>2</span>
          <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {T("Evidence", "തെളിവ്", lang)}
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-2">
        {books.map((book, idx) => {
          const rules = byBook[book];
          const ruleText = rules.map((r) => cleanReason(lang === "ml" && r.text_ml ? r.text_ml : r.text_en)).filter(Boolean).slice(0, 1).join(" ");
          const isForbidden = rules.some((r) => r.field === "forbidden_actions" || r.field === "enemy_actions" || r.field === "warnings_list");
          const accent = isForbidden ? "#F87171" : "#4ADE80";
          const firstRule = rules[0];

          return (
            <div key={`evidence-${idx}`} className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: G.dim }}>{T("Book", "പുസ്തകം", lang)}</span>
                <span className="font-inter text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}>
                  {isForbidden ? T("Forbidden", "നിരോധിതം", lang) : T("Recommended", "ശുപാർശ", lang)}
                </span>
              </div>
              <p className={lang === "ml" ? "font-malayalam text-xs font-bold mb-1" : "font-inter text-xs font-bold mb-1"} style={{ color: "#fff" }}>{book}</p>
              {ruleText && (
                <div className="mb-1.5">
                  <span className="font-inter text-[10px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Rule", "നിയമം", lang)}: </span>
                  <span className={lang === "ml" ? "font-malayalam text-[11px] leading-relaxed" : "font-inter text-[11px] leading-relaxed"} style={{ color: "rgba(255,255,255,0.70)" }}>{ruleText}</span>
                </div>
              )}
              <div>
                <span className="font-inter text-[10px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Applies", "ബാധകം", lang)}: </span>
                <span className={lang === "ml" ? "font-malayalam text-[11px]" : "font-inter text-[11px]"} style={{ color: "rgba(255,255,255,0.65)" }}>
                  {appliesText(firstRule)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}