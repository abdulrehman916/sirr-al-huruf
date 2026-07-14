// ═══════════════════════════════════════════════════════════════
// SECTION 5 — FORBIDDEN CONDITIONS
// Displays ALL forbidden situations from the ENTIRE database:
//   - Forbidden Saat, Planet, Day (from req.worstHours/worstDays/enemyPlanets)
//   - ALL forbidden actions (from conflictingRules across ALL contexts)
//   - ALL enemy actions (from conflictingRules)
//   - ALL warnings (from conflictingRules)
// ═══════════════════════════════════════════════════════════════
import { Ban, AlertTriangle, Swords, Skull } from "lucide-react";
import ReportSection from "./ReportSection";
import { G, T, translatePlanet, translateDay, MIZAN_DAY_NAMES } from "./shared";

function ForbiddenRow({ label, value, lang }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const display = Array.isArray(value) ? value.join(", ") : value;
  return (
    <div
      className="rounded-lg p-3 mb-2"
      style={{
        background: "rgba(248,113,113,0.05)",
        border: "1px solid rgba(248,113,113,0.20)",
      }}
    >
      <p
        className="font-inter text-[10px] uppercase tracking-wider font-bold mb-1"
        style={{ color: "#F87171" }}
      >
        {label}
      </p>
      <p
        className={lang === "ml" ? "font-malayalam text-xs font-bold" : "font-inter text-xs font-bold"}
        style={{ color: "#fff" }}
      >
        {display}
      </p>
    </div>
  );
}

export default function SectionForbidden({ analysis, lang }) {
  const req = analysis?.req || {};
  const enemyAnalysis = analysis?.enemyAnalysis || {};
  const originalForbidden = analysis?.selectionAnalysis?.originalForbidden || [];

  // ALL conflicting rules from the full database
  const allConflicting = analysis?.conflictingRules || [];
  const forbiddenActions = allConflicting.filter((r) => r.field === "forbidden_actions");
  const enemyActions = allConflicting.filter((r) => r.field === "enemy_actions");
  const warningActions = allConflicting.filter((r) => r.field === "warnings_list");

  const worstDays = (req.worstDays || []).map((d) => translateDay(MIZAN_DAY_NAMES[d] || d, lang));
  const worstHours = (req.worstHours || []).map((p) => translatePlanet(p, lang));
  const enemyPlanets = (req.enemyPlanets || []).map((p) => translatePlanet(p, lang));
  const enemyDays = (enemyAnalysis.enemyDays || []).map((d) => translateDay(MIZAN_DAY_NAMES[d] || d, lang));
  const enemyHours = (enemyAnalysis.enemyHours || []).map((p) => translatePlanet(p, lang));

  // Combine ALL forbidden action texts (dedup by text)
  const seen = new Set();
  const allForbiddenTexts = [];

  // Exact-context forbidden actions first
  for (const a of originalForbidden) {
    const key = (a.en || a.ml || "").trim();
    if (key && !seen.has(key)) {
      seen.add(key);
      allForbiddenTexts.push({
        en: a.en,
        ml: a.ml,
        source: a.source || "Astrology Clock (current context)",
        type: "forbidden",
      });
    }
  }

  // Then ALL forbidden actions from the full database
  for (const r of forbiddenActions) {
    const key = (r.text_en || r.text_ml || "").trim();
    if (key && !seen.has(key)) {
      seen.add(key);
      allForbiddenTexts.push({ en: r.text_en, ml: r.text_ml, source: r.source, type: "forbidden" });
    }
  }

  // ALL enemy actions
  for (const r of enemyActions) {
    const key = (r.text_en || r.text_ml || "").trim();
    if (key && !seen.has(key)) {
      seen.add(key);
      allForbiddenTexts.push({ en: r.text_en, ml: r.text_ml, source: r.source, type: "enemy" });
    }
  }

  // ALL warnings
  for (const r of warningActions) {
    const key = (r.text_en || r.text_ml || "").trim();
    if (key && !seen.has(key)) {
      seen.add(key);
      allForbiddenTexts.push({ en: r.text_en, ml: r.text_ml, source: r.source, type: "warning" });
    }
  }

  const hasAny =
    worstDays.length > 0 ||
    worstHours.length > 0 ||
    enemyPlanets.length > 0 ||
    allForbiddenTexts.length > 0 ||
    enemyAnalysis.note;

  return (
    <ReportSection
      number={5}
      title="Forbidden Conditions"
      titleMl="നിരോധിത വ്യവസ്ഥകൾ"
      icon={Ban}
      lang={lang}
      accent="#F87171"
    >
      {!hasAny ? (
        <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <p
            className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"}
            style={{ color: "rgba(255,255,255,0.60)" }}
          >
            {T(
              "No forbidden conditions found for this purpose.",
              "ഈ ലക്ഷ്യത്തിന് നിരോധിത വ്യവസ്ഥകളൊന്നുമില്ല.",
              lang
            )}
          </p>
        </div>
      ) : (
        <>
          {/* Count badge */}
          <div className="rounded-lg p-2 mb-2" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <p className="font-inter text-[10px] uppercase tracking-wider" style={{ color: G.dim }}>
              {T(
                `${allForbiddenTexts.length} forbidden condition(s) from the database`,
                `ഡാറ്റാബേസിൽ നിന്ന് ${allForbiddenTexts.length} നിരോധിത വ്യവസ്ഥ(കൾ)`,
                lang
              )}
            </p>
          </div>

          {/* Summary rows */}
          <ForbiddenRow
            label={T("Forbidden Saat (Hours)", "നിരോധിത സഅാത്", lang)}
            value={worstHours}
            lang={lang}
          />
          <ForbiddenRow
            label={T("Forbidden Planets", "നിരോധിത ഗ്രഹങ്ങൾ", lang)}
            value={enemyPlanets}
            lang={lang}
          />
          <ForbiddenRow
            label={T("Forbidden Days", "നിരോധിത ദിവസങ്ങൾ", lang)}
            value={worstDays}
            lang={lang}
          />
          <ForbiddenRow
            label={T("Enemy Days", "ശത്രു ദിവസങ്ങൾ", lang)}
            value={enemyDays}
            lang={lang}
          />
          <ForbiddenRow
            label={T("Enemy Hours", "ശത്രു മണിക്കൂറുകൾ", lang)}
            value={enemyHours}
            lang={lang}
          />

          {/* ALL forbidden actions, enemy actions, and warnings from the database */}
          {allForbiddenTexts.length > 0 && (
            <div className="mt-2 space-y-2">
              <p
                className="font-inter text-[10px] uppercase tracking-wider font-bold"
                style={{ color: "#F87171" }}
              >
                {T(
                  "All Forbidden Actions, Enemy Conditions & Warnings",
                  "എല്ലാ നിരോധിത പ്രവൃത്തികൾ, ശത്രു വ്യവസ്ഥകൾ, മുന്നറിയിപ്പുകൾ",
                  lang
                )}
              </p>
              {allForbiddenTexts.map((item, idx) => {
                const Icon =
                  item.type === "enemy" ? Swords : item.type === "warning" ? AlertTriangle : Skull;
                const accentColor = item.type === "warning" ? "#FBBF24" : "#F87171";
                return (
                  <div
                    key={`forb-${idx}`}
                    className="rounded-lg p-3"
                    style={{
                      background: `${accentColor}0D`,
                      border: `1px solid ${accentColor}33`,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                      <div className="flex-1">
                        <p
                          className={
                            lang === "ml" && item.ml
                              ? "font-malayalam text-[11px] leading-relaxed"
                              : "font-inter text-[11px] leading-relaxed"
                          }
                          style={{ color: "rgba(255,255,255,0.80)" }}
                        >
                          {lang === "ml" && item.ml ? item.ml : item.en}
                        </p>
                        {item.source && (
                          <p className="font-inter text-[9px] mt-1" style={{ color: G.dim }}>
                            {T("Source", "ഉറവിടം", lang)}: {item.source}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Enemy analysis note */}
          {enemyAnalysis.note && (
            <div className="rounded-lg p-3 mt-2" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
              <p
                className={lang === "ml" ? "font-malayalam text-[11px] leading-relaxed" : "font-inter text-[11px] leading-relaxed"}
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {enemyAnalysis.note}
              </p>
            </div>
          )}
        </>
      )}
    </ReportSection>
  );
}