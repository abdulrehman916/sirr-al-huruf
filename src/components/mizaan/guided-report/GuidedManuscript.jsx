// ═══ SECTION 7 — MANUSCRIPT EXPLANATION ═══
// Displays only the translated explanation from the manuscript.
// Never Turkish. Never raw database records. Never citations. Never source codes.
import { BookOpen } from "lucide-react";
import GuidedCard from "./GuidedCard";
import { G, T } from "../ritual-report/shared";

export default function GuidedManuscript({ analysis, lang }) {
  const explanationEn = analysis?.selectionAnalysis?.originalExplanation || "";
  const explanationMl =
    analysis?.selectionAnalysis?.originalExplanationMl || "";
  const explanation =
    lang === "ml" ? explanationMl || explanationEn : explanationEn;

  if (!explanation) return null;

  return (
    <GuidedCard>
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4" style={{ color: G.text }} />
        <h3
          className={
            lang === "ml"
              ? "font-malayalam text-sm font-bold"
              : "font-inter text-sm font-bold"
          }
          style={{ color: "#fff" }}
        >
          {T("Manuscript Explanation", "കൈയെഴുത്ത് വിശദീകരണം", lang)}
        </h3>
      </div>
      <p
        className={
          lang === "ml" && explanationMl
            ? "font-malayalam text-sm leading-relaxed"
            : "font-inter text-sm leading-relaxed"
        }
        style={{ color: "rgba(255,255,255,0.75)" }}
      >
        {explanation}
      </p>
    </GuidedCard>
  );
}