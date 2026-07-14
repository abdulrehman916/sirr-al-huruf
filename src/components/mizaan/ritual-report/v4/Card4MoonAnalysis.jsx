import { Moon } from "lucide-react";
import { G, T, Box } from "../v3/shared";
import SourcesCollapse from "./SourcesCollapse";
import { analyzeMoonCompatibility, findNextSuitableMoonTime } from "@/lib/ritualTimingEngineV3";

// CARD 4 — MOON ANALYSIS (optional collapsible)
// Current moon, current lunar mansion, relationship with the selected purpose
// (Compatible / Not Compatible / No Moon Rule), per-dimension checks, and the
// next future moon recommendation. All reasons come from book rules only.
export default function Card4MoonAnalysis({ analysis, open, onToggle, lang }) {
  const moon = analysis?.moonPhase || {};
  const moonReq = analysis?.moonReq || {};
  const req = analysis?.req || {};
  const citations = analysis?.moonCitations || [];
  const mc = analyzeMoonCompatibility({ moonReq, moonPhase: moon, moonCitations: citations });
  const future = mc.hasMoonRules ? findNextSuitableMoonTime({ req, moonReq, fromDate: new Date() }) : null;
  const moonTxt = [moon.moonSign, moon.phaseName, moon.moonIllumination != null ? `${Math.round(moon.moonIllumination)}%` : ""].filter(Boolean).join(" · ");

  return (
    <Box number={4} titleEn="Moon Analysis" titleMl="ചന്ദ്ര വിശകലനം" icon={Moon} lang={lang}>
      {!open ? (
        <button onClick={onToggle} className="w-full rounded-xl p-3 text-left" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <p className="font-inter text-xs font-bold" style={{ color: G.text }}>{T("Open Moon Module", "ചന്ദ്ര മൊഡ്യൂൾ തുറക്കുക", lang)}</p>
        </button>
      ) : (
        <div className="space-y-2.5">
          <div className="rounded-xl p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Current Moon / Mansion", "നിലവിലെ ചന്ദ്രൻ / നക്ഷത്രം", lang)}</p>
            <p className="font-amiri text-base font-bold" style={{ color: "#fff" }} dir="rtl">{moon.moonMansionArabic ? `${moon.moonMansionArabic} (${moon.moonMansion || "—"})` : (moon.moonMansion || "—")}</p>
            <p className="font-inter text-[10px]" style={{ color: G.dim }}>{moonTxt || "—"}</p>
          </div>

          <div className="rounded-xl p-3" style={{ background: mc.hasMoonRules ? (mc.compatible ? "rgba(74,222,128,0.10)" : "rgba(248,113,113,0.10)") : G.bg, border: `1px solid ${mc.hasMoonRules ? (mc.compatible ? "rgba(74,222,128,0.45)" : "rgba(248,113,113,0.45)") : G.border}` }}>
            <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Relationship with Purpose", "ലക്ഷ്യവുമായുള്ള ബന്ധം", lang)}</p>
            <p className="font-inter text-sm font-bold" style={{ color: mc.hasMoonRules ? (mc.compatible ? "#4ADE80" : "#F87171") : "rgba(255,255,255,0.70)" }}>
              {!mc.hasMoonRules ? T("No Moon Rule", "ചന്ദ്ര നിയമമില്ല", lang) : mc.compatible ? T("Compatible", "അനുയോജ്യം", lang) : T("Not Compatible", "അനുയോജ്യമല്ല", lang)}
            </p>
            {mc.hasMoonRules && mc.checks && mc.checks.length > 0 && (
              <div className="mt-1 space-y-0.5">
                {mc.checks.map((c, i) => (
                  <p key={i} className={lang === "ml" ? "font-malayalam text-[11px]" : "font-inter text-[11px]"} style={{ color: c.status === "pass" ? "rgba(74,222,128,0.85)" : "rgba(248,113,113,0.85)" }}>
                    {c.status === "pass" ? "✓ " : "✗ "}{c.label}: {c.current} ({T("required", "ആവശ്യം", lang)} {c.required})
                  </p>
                ))}
              </div>
            )}
            {future && (
              <p className={lang === "ml" ? "font-malayalam text-[11px] mt-1.5" : "font-inter text-[11px] mt-1.5"} style={{ color: "rgba(255,255,255,0.72)" }}>
                {T("Next suitable moon", "അടുത്ത അനുയോജ്യ ചന്ദ്രൻ", lang)}: {future.date} · {future.moonMansionArabic || future.moonMansion || "—"}
              </p>
            )}
            <SourcesCollapse sources={citations} lang={lang} />
          </div>

          <button onClick={onToggle} className="font-inter text-[10px]" style={{ color: G.dim }}>{T("Close", "അടയ്ക്കുക", lang)}</button>
        </div>
      )}
    </Box>
  );
}