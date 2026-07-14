// ═══════════════════════════════════════════════════════════════
// SECTION 5 — BOOK DIFFERENCES
// Only shows when multiple enabled books contain DIFFERENT timing rules
// Each book preserves its own recommendation independently
// Never merges different books into a single rule
// ═══════════════════════════════════════════════════════════════
import { BookOpen, Sparkles } from "lucide-react";
import { G, T, translatePlanet, translateDay, MIZAN_DAY_NAMES, saatDisplayNum } from "./shared";

function cleanReason(text) {
  if (!text) return "";
  return String(text)
    .replace(/Source\s*:.*?(\.|$)/gi, "")
    .replace(/Havâss[^\s]*\s*Derinlikleri[^\n]*/gi, "")
    .replace(/Astrology Clock\s*:/gi, "")
    .split(/\n/)[0]
    .trim();
}

export default function DecisionSectionBookDifferences({ analysis, lang }) {
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

  // Only show if 2+ books with different recommendations
  if (books.length < 2) return null;

  // Check if books actually have different timing recommendations
  const bookTimings = books.map((book) => {
    const rules = byBook[book];
    const days = new Set();
    const saats = new Set();
    const planets = new Set();
    for (const r of rules) {
      if (r.weekday != null) days.add(r.weekday);
      if (r.saat_number != null) saats.add(r.saat_number);
      if (r.planet) planets.add(r.planet);
    }
    return { book, days: Array.from(days).sort(), saats: Array.from(saats).sort(), planets: Array.from(planets).sort() };
  });

  // Check if any two books have different day/saat recommendations
  let hasDifference = false;
  for (let i = 0; i < bookTimings.length; i++) {
    for (let j = i + 1; j < bookTimings.length; j++) {
      const a = bookTimings[i];
      const b = bookTimings[j];
      if (JSON.stringify(a.days) !== JSON.stringify(b.days) ||
          JSON.stringify(a.saats) !== JSON.stringify(b.saats)) {
        hasDifference = true;
      }
    }
  }
  if (!hasDifference) return null;

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
          <BookOpen className="w-5 h-5" style={{ color: G.text }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>5</span>
          <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {T("Book Differences", "പുസ്തക വ്യത്യാസങ്ങൾ", lang)}
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {bookTimings.map((bt, idx) => {
          const rules = byBook[bt.book];
          const reasonText = rules
            .map((r) => cleanReason(lang === "ml" && r.text_ml ? r.text_ml : r.text_en))
            .filter(Boolean)
            .slice(0, 1)
            .join(" ");

          // Build recommended timing display
          const dayStr = bt.days.length > 0
            ? bt.days.map((d) => translateDay(MIZAN_DAY_NAMES[d] || `Day ${d}`, lang)).join(", ")
            : T("Any day", "ഏത് ദിവസവും", lang);
          const saatStr = bt.saats.length > 0
            ? bt.saats.map((s) => `#${saatDisplayNum(s, rules.find((r) => r.saat_number === s)?.period || "day")}`).join(", ")
            : T("Any Saat", "ഏത് സഅാതും", lang);
          const planetStr = bt.planets.length > 0
            ? bt.planets.map((p) => translatePlanet(p, lang)).join(", ")
            : "";

          return (
            <div key={`book-${idx}`} className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
              <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: G.dim }}>
                {T("Book", "പുസ്തകം", lang)}
              </p>
              <p className={lang === "ml" ? "font-malayalam text-xs font-bold mb-2" : "font-inter text-xs font-bold mb-2"} style={{ color: "#fff" }}>
                {bt.book}
              </p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>
                    {T("Recommended Day", "ശുപാർശ ദിവസം", lang)}
                  </p>
                  <p className={lang === "ml" ? "font-malayalam text-[11px] font-bold" : "font-inter text-[11px] font-bold"} style={{ color: "#fff" }}>
                    {dayStr}
                  </p>
                </div>
                <div>
                  <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>
                    {T("Recommended Saat", "ശുപാർശ സഅാത്", lang)}
                  </p>
                  <p className="font-inter text-[11px] font-bold" style={{ color: "#fff" }}>
                    {saatStr}{planetStr ? ` (${planetStr})` : ""}
                  </p>
                </div>
              </div>
              {reasonText && (
                <div>
                  <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>
                    {T("Reason", "കാരണം", lang)}
                  </p>
                  <p className={lang === "ml" ? "font-malayalam text-[11px] leading-relaxed" : "font-inter text-[11px] leading-relaxed"} style={{ color: "rgba(255,255,255,0.65)" }}>
                    {reasonText}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Special Notes — only if a unique instruction exists in one book */}
        {books.length > 1 && (() => {
          const uniqueRules = allRules.filter((r) => {
            const text = (r.text_en || "").toLowerCase();
            return /special|unique|particular|specific|only this/.test(text);
          });
          if (uniqueRules.length === 0) return null;
          return (
            <div className="rounded-lg p-3" style={{ background: "rgba(212,175,55,0.06)", border: `1px solid ${G.border}` }}>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" style={{ color: G.text }} />
                <p className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: G.text }}>
                  {T("Special Notes", "പ്രത്യേക കുറിപ്പുകൾ", lang)}
                </p>
              </div>
              {uniqueRules.map((r, idx) => (
                <p key={`sn-${idx}`} className={lang === "ml" ? "font-malayalam text-[11px] leading-relaxed mb-1" : "font-inter text-[11px] leading-relaxed mb-1"} style={{ color: "rgba(255,255,255,0.70)" }}>
                  <span className="font-inter text-[10px] font-bold" style={{ color: G.dim }}>[{r.source}] </span>
                  {cleanReason(lang === "ml" && r.text_ml ? r.text_ml : r.text_en)}
                </p>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}