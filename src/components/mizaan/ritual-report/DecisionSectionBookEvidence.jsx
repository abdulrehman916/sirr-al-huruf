// ═══════════════════════════════════════════════════════════════
// SECTION 3 — BOOK EVIDENCE
// Each book with matching rules: Book Name + Rule Summary
// Only books with matching rules. No Turkish. No long quotations.
// ═══════════════════════════════════════════════════════════════
import { BookOpen } from "lucide-react";
import { G, T } from "./shared";

function cleanReason(text) {
  if (!text) return "";
  return String(text)
    .replace(/Source\s*:.*?(\.|$)/gi, "")
    .replace(/Havâss[^\s]*\s*Derinlikleri[^\n]*/gi, "")
    .replace(/Astrology Clock\s*:/gi, "")
    .split(/\n/)[0]
    .trim();
}

export default function DecisionSectionBookEvidence({ analysis, lang }) {
  const matchingRules = analysis?.matchingRules || [];
  const conflictingRules = analysis?.conflictingRules || [];
  const allRules = [...matchingRules, ...conflictingRules];

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
            <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>3</span>
            <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
              {T("Book Evidence", "പുസ്തക തെളിവ്", lang)}
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

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: `1px solid ${G.border}`, boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)" }}>
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
          <BookOpen className="w-5 h-5" style={{ color: G.text }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>3</span>
          <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {T("Book Evidence", "പുസ്തക തെളിവ്", lang)}
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-2">
        {books.map((book, idx) => {
          const rules = byBook[book];
          const ruleText = rules
            .map((r) => cleanReason(lang === "ml" && r.text_ml ? r.text_ml : r.text_en))
            .filter(Boolean)
            .slice(0, 1)
            .join(" ");
          const isForbidden = rules.some((r) => r.field === "forbidden_actions" || r.field === "enemy_actions" || r.field === "warnings_list");
          const accentColor = isForbidden ? "#F87171" : "#4ADE80";

          return (
            <div key={`book-${idx}`} className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: G.dim }}>
                  {T("Book", "പുസ്തകം", lang)}
                </span>
                <span className="font-inter text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}>
                  {isForbidden ? T("Forbidden", "നിരോധിതം", lang) : T("Recommended", "ശുപാർശ ചെയ്തു", lang)}
                </span>
              </div>
              <p className={lang === "ml" ? "font-malayalam text-xs font-bold mb-1" : "font-inter text-xs font-bold mb-1"} style={{ color: "#fff" }}>
                {book}
              </p>
              {ruleText && (
                <div>
                  <span className="font-inter text-[10px] uppercase tracking-wider" style={{ color: G.dim }}>
                    {T("Rule", "നിയമം", lang)}:{" "}
                  </span>
                  <span className={lang === "ml" ? "font-malayalam text-[11px] leading-relaxed" : "font-inter text-[11px] leading-relaxed"} style={{ color: "rgba(255,255,255,0.70)" }}>
                    {ruleText}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}