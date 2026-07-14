import { CalendarClock } from "lucide-react";
import { G, T, Box, translatePlanet, saatDisplayNum, computeCompat, compatColor } from "../v3/shared";

// CARD 2 — NEXT AVAILABLE TIMES (today's remaining hours)
// If current time is unsuitable, shows the next suitable daytime hour and next
// suitable nighttime hour remaining today, each with time, strength %, reason.
// If today has nothing, points to Card 6 (future opportunities).
export default function Card2NextTimes({ analysis, liveTimeline, lang }) {
  const today = (liveTimeline || []).filter(o => o.isToday);
  const nextDay = today.find(o => o.period === "day");
  const nextNight = today.find(o => o.period === "night");

  const Row = ({ o, label }) => {
    if (!o) {
      return (
        <div className="rounded-lg p-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{label}</p>
          <p className={lang === "ml" ? "font-malayalam text-xs" : "font-inter text-xs"} style={{ color: "rgba(255,255,255,0.55)" }}>{T("None remaining today", "ഇന്ന് ശേഷിക്കുന്നില്ല", lang)}</p>
        </div>
      );
    }
    const pct = computeCompat(analysis, { dayKey: o.dayKey, period: o.period, saatNumber: o.hour, planetLC: String(o.planet || "").toLowerCase() }).final;
    const c = compatColor(pct);
    return (
      <div className="rounded-lg p-2.5" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
        <div className="flex items-center justify-between mb-0.5">
          <p className="font-inter text-[9px] uppercase tracking-wider" style={{ color: G.dim }}>{label}</p>
          <span className="font-inter text-xs font-bold" style={{ color: c }}>{pct}%</span>
        </div>
        <p className="font-inter text-xs font-bold" style={{ color: "#fff" }}>{o.startTime}–{o.endTime} · #{saatDisplayNum(o.hour, o.period)} {translatePlanet(o.planet, lang)}</p>
        <p className={lang === "ml" ? "font-malayalam text-[10px]" : "font-inter text-[10px]"} style={{ color: "rgba(255,255,255,0.60)" }}>{T("Ruled by", "ഭരിക്കുന്നത്", lang)} {translatePlanet(o.planet, lang)} · {T("book rules align", "പുസ്തക നിയമങ്ങൾ പൊരുത്തപ്പെടുന്നു", lang)}</p>
      </div>
    );
  };

  return (
    <Box number={2} titleEn="Next Available Times" titleMl="അടുത്ത ലഭ്യമായ സമയങ്ങൾ" icon={CalendarClock} lang={lang}>
      {today.length === 0 ? (
        <p className={lang === "ml" ? "font-malayalam text-sm" : "font-inter text-sm"} style={{ color: "rgba(255,255,255,0.60)" }}>{T("No suitable time remains today — see Future Opportunities.", "ഇന്ന് അനുയോജ്യ സമയമില്ല — ഭാവി അവസരങ്ങൾ കാണുക.", lang)}</p>
      ) : (
        <div className="space-y-2">
          <Row o={nextDay} label={T("Next Daytime Hour", "അടുത്ത പകൽ സഅാത്ത്", lang)} />
          <Row o={nextNight} label={T("Next Nighttime Hour", "അടുത്ത രാത്രി സഅാത്ത്", lang)} />
        </div>
      )}
    </Box>
  );
}