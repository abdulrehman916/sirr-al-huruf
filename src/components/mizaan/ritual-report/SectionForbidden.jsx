// ═══════════════════════════════════════════════════════════════
// SECTION 5 — FORBIDDEN CONDITIONS
// Displays ALL forbidden situations: Saat, Planet, Day, Zodiac,
// Enemy combinations, Bad contexts, Conflict rules
// ═══════════════════════════════════════════════════════════════
import { Ban } from "lucide-react";
import ReportSection from "./ReportSection";
import { G, T, translatePlanet, translateDay, MIZAN_DAY_NAMES } from "./shared";

function ForbiddenRow({ label, value, lang }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const display = Array.isArray(value) ? value.join(", ") : value;
  return (
    <div
      className="rounded-lg p-3"
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

  const worstDays = (req.worstDays || []).map((d) => translateDay(MIZAN_DAY_NAMES[d] || d, lang));
  const worstHours = (req.worstHours || []).map((p) => translatePlanet(p, lang));
  const enemyPlanets = (req.enemyPlanets || []).map((p) => translatePlanet(p, lang));
  const enemyDays = (enemyAnalysis.enemyDays || []).map((d) => translateDay(MIZAN_DAY_NAMES[d] || d, lang));
  const enemyHours = (enemyAnalysis.enemyHours || []).map((p) => translatePlanet(p, lang));

  const hasAny =
    worstDays.length > 0 ||
    worstHours.length > 0 ||
    enemyPlanets.length > 0 ||
    originalForbidden.length > 0 ||
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

          {/* Bad contexts / Forbidden actions from the database */}
          {originalForbidden.length > 0 && (
            <div
              className="rounded-lg p-3"
              style={{
                background: "rgba(248,113,113,0.05)",
                border: "1px solid rgba(248,113,113,0.20)",
              }}
            >
              <p
                className="font-inter text-[10px] uppercase tracking-wider font-bold mb-2"
                style={{ color: "#F87171" }}
              >
                {T("Bad Contexts / Forbidden Actions", "മോശം സന്ദർഭങ്ങൾ / നിരോധിത പ്രവൃത്തികൾ", lang)}
              </p>
              {originalForbidden.map((action, idx) => (
                <p
                  key={`forb-${idx}`}
                  className={
                    lang === "ml" && action.ml
                      ? "font-malayalam text-[11px] leading-relaxed mb-1"
                      : "font-inter text-[11px] leading-relaxed mb-1"
                  }
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  ✗ {lang === "ml" && action.ml ? action.ml : action.en}
                </p>
              ))}
            </div>
          )}

          {/* Enemy analysis note */}
          {enemyAnalysis.note && (
            <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
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