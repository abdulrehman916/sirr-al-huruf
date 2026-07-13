// ═══════════════════════════════════════════════════════════════
// SECTION 8 — RECOMMENDED ACTIONS
// Displays ONLY actions recommended by the database
// (from the Astro Clock context record's recommended_actions)
// ═══════════════════════════════════════════════════════════════
import { Sparkles } from "lucide-react";
import ReportSection from "./ReportSection";
import { G, T } from "./shared";

export default function SectionRecommendedActions({ analysis, lang }) {
  const recommended = analysis?.selectionAnalysis?.originalRecommended || [];

  return (
    <ReportSection
      number={8}
      title="Recommended Actions"
      titleMl="ശുപാര്ശ പ്രവൃത്തികൾ"
      icon={Sparkles}
      lang={lang}
      accent="#4ADE80"
    >
      {recommended.length === 0 ? (
        <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <p
            className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"}
            style={{ color: "rgba(255,255,255,0.60)" }}
          >
            {T(
              "No recommended actions found in the database for the current context.",
              "നിലവിലെ സന്ദർഭത്തിന് ഡാറ്റാബേസിൽ ശുപാര്ശ പ്രവൃത്തികളൊന്നുമില്ല.",
              lang
            )}
          </p>
        </div>
      ) : (
        recommended.map((action, idx) => (
          <div
            key={`rec-${idx}`}
            className="rounded-lg p-3"
            style={{
              background: "rgba(74,222,128,0.06)",
              border: "1px solid rgba(74,222,128,0.25)",
            }}
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#4ADE80" }} />
              <p
                className={
                  lang === "ml" && action.ml
                    ? "font-malayalam text-xs leading-relaxed"
                    : "font-inter text-xs leading-relaxed"
                }
                style={{ color: "rgba(255,255,255,0.80)" }}
              >
                {lang === "ml" && action.ml ? action.ml : action.en}
              </p>
            </div>
          </div>
        ))
      )}
    </ReportSection>
  );
}