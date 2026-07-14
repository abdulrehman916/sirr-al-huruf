import { CheckCircle2, XCircle, Sun, Moon, Calendar, Clock, Globe } from "lucide-react";
import { G, T, translatePlanet, translateDay } from "../shared";
import { computeCompat, compatColor } from "./compatibility";

function cleanReason(text) {
  if (!text) return "";
  return String(text).replace(/Source\s*:.*?(\.|$)/gi, "").replace(/Astrology Clock\s*:/gi, "").split(/\n/)[0].trim();
}

export default function SectionBestOpportunity({ analysis, lang }) {
  const canPerform = analysis?.canPerformToday || "No";
  const currentSuitable = analysis?.currentMomentSuitable || false;
  const liveNow = analysis?.liveNow || {};
  const req = analysis?.req || {};
  const compat = computeCompat(analysis);
  const cColor = compatColor(compat.final);

  const acceptanceReasons = analysis?.currentSaatAnalysis?.acceptanceReasons || [];
  const reason = acceptanceReasons.length > 0
    ? cleanReason(lang === "ml" && acceptanceReasons[0].text_ml ? acceptanceReasons[0].text_ml : acceptanceReasons[0].text_en)
    : "";

  const isYes = canPerform === "Yes";
  const isLimited = canPerform === "Limited";

  const verdictColor = isYes ? "#4ADE80" : isLimited ? "#FBBF24" : "#F87171";
  const VerdictIcon = isYes ? CheckCircle2 : XCircle;

  function InfoRow({ icon: Icon, label, value }) {
    if (!value && value !== 0) return null;
    return (
      <div className="flex items-center gap-2 py-1.5 border-b last:border-0" style={{ borderColor: G.border }}>
        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: G.dim }} />
        <span className="font-inter text-[10px] uppercase tracking-wider flex-shrink-0" style={{ color: G.dim }}>{label}</span>
        <span className={lang === "ml" ? "font-malayalam text-xs font-bold ml-auto text-right" : "font-inter text-xs font-bold ml-auto text-right"} style={{ color: "#fff" }}>{value}</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)", border: `1px solid ${G.border}`, boxShadow: "0 4px 40px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)" }}>
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${G.border}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}>
          <CheckCircle2 className="w-5 h-5" style={{ color: G.text }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-inter text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>2</span>
          <h3 className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: "#fff" }}>
            {T("Best Current Opportunity", "നിലവിലെ മികച്ച അവസരം", lang)}
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {/* Can perform today? */}
        <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: `${verdictColor}08`, border: `1px solid ${verdictColor}30` }}>
          <VerdictIcon className="w-6 h-6 flex-shrink-0" style={{ color: verdictColor }} />
          <p className={lang === "ml" ? "font-malayalam text-sm font-bold" : "font-inter text-sm font-bold"} style={{ color: verdictColor }}>
            {isYes
              ? T("Yes — this ritual can be performed today.", "അതെ — ഈ ആചാരം ഇന്ന് അനുഷ്ഠിക്കാം.", lang)
              : isLimited
                ? T("Partially — some valid hours remain today.", "ഭാഗികമായി — ഇന്ന് കുറച്ച് അനുയോജ്യ സമയങ്ങൾ ബാക്കിയുണ്ട്.", lang)
                : T("No — not recommended today.", "അല്ല — ഇന്ന് ശുപാർശ ചെയ്യുന്നില്ല.", lang)}
          </p>
        </div>

        {/* Condition details */}
        <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <InfoRow icon={Calendar} label={T("Day", "ദിവസം", lang)} value={translateDay(liveNow.day, lang)} />
          <InfoRow icon={Clock} label={T("Saat", "സഅാത്", lang)} value={`#${liveNow.saat || "—"}`} />
          <InfoRow icon={Globe} label={T("Planet", "ഗ്രഹം", lang)} value={translatePlanet(liveNow.kawkab || liveNow.planetaryHour, lang)} />
          <InfoRow
            icon={liveNow.laylNahar === "Layl" ? Moon : Sun}
            label={T("Period", "സമയം", lang)}
            value={liveNow.laylNahar === "Layl" ? T("Night", "രാത്രി", lang) : T("Day", "പകല്", lang)}
          />
        </div>

        {/* Compatibility */}
        <div className="rounded-xl p-3 text-center" style={{ background: `${cColor}08`, border: `1px solid ${cColor}30` }}>
          <p className="font-inter text-2xl font-bold" style={{ color: cColor }}>{compat.final}%</p>
          <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{T("Compatibility", "പൊരുത്തം", lang)}</p>
        </div>

        {/* Reason */}
        {reason && (
          <div className="rounded-lg p-3" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
            <p className={lang === "ml" ? "font-malayalam text-xs leading-relaxed" : "font-inter text-xs leading-relaxed"} style={{ color: "rgba(255,255,255,0.75)" }}>
              {reason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}