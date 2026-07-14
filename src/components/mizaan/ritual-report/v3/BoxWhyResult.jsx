import { HelpCircle, Check, X, Minus } from "lucide-react";
import { G, T, Box } from "./shared";

// BOX 3 — WHY THIS RESULT?
// Explains ONLY why the current result exists. Every reason comes from
// uploaded database rules (AstroClockKnowledge / ManuscriptRule). No AI text.
export default function BoxWhyResult({ analysis, lang }) {
  const breakdown = analysis?.selectionAnalysis?.decisionBreakdown || [];

  if (breakdown.length === 0) {
    return (
      <Box number={3} titleEn="Why This Result?" titleMl="ഈ ഫലം എന്തുകൊണ്ട്?" icon={HelpCircle} lang={lang}>
        <p className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"} style={{ color: "rgba(255,255,255,0.60)" }}>
          {T("No detailed breakdown available for the current context.", "നിലവിലെ സന്ദർഭത്തിന് വിശദമായ വിശകലനമില്ല.", lang)}
        </p>
      </Box>
    );
  }

  const iconFor = (status) => {
    if (status === "pass") return <Check className="w-4 h-4" style={{ color: "#4ADE80" }} />;
    if (status === "fail") return <X className="w-4 h-4" style={{ color: "#F87171" }} />;
    return <Minus className="w-4 h-4" style={{ color: G.dim }} />;
  };
  const labelFor = (status) => status === "pass"
    ? T("Supports", "പിന്തുണയ്ക്കുന്നു", lang)
    : status === "fail"
      ? T("Opposes", "എതിരാണ്", lang)
      : T("Neutral", "നിഷ്പക്ഷം", lang);

  return (
    <Box number={3} titleEn="Why This Result?" titleMl="ഈ ഫലം എന്തുകൊണ്ട്?" icon={HelpCircle} lang={lang}>
      <div className="space-y-2">
        {breakdown.map((b, i) => {
          const reason = lang === "ml" && b.reasonMl ? b.reasonMl : (b.reason || "");
          const clean = String(reason).split(/\n---\n/)[0].split(/\n/)[0].trim();
          return (
            <div key={i} className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
              <div className="flex items-center gap-2 mb-1">
                {iconFor(b.status)}
                <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{b.label || b.dimension}</p>
                <span className="font-inter text-[9px] uppercase tracking-wider ml-auto" style={{ color: G.dim }}>{labelFor(b.status)}</span>
              </div>
              {clean && (
                <p className={lang === "ml" ? "font-malayalam text-xs leading-relaxed" : "font-inter text-xs leading-relaxed"}
                  style={{ color: "rgba(255,255,255,0.72)" }}>
                  {clean}
                </p>
              )}
              {b.source && (
                <p className="font-inter text-[9px] mt-1" style={{ color: G.dim }}>{T("Source", "ഉറവിടം", lang)}: {b.source}</p>
              )}
            </div>
          );
        })}
      </div>
      <p className={lang === "ml" ? "font-malayalam text-[10px] mt-3" : "font-inter text-[10px] mt-3"} style={{ color: "rgba(255,255,255,0.45)" }}>
        {T("All explanations come from uploaded book rules.", "എല്ലാ വിശദീകരണങ്ങളും അപ്‌ലോഡ് ചെയ്ത പുസ്തക നിയമങ്ങളിൽ നിന്നാണ്.", lang)}
      </p>
    </Box>
  );
}