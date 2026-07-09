// ═══════════════════════════════════════════════════════════════
// SECTION 3 — TODAY'S 12 SAAT
// Unified grid of all 24 planetary hours (12 day + 12 night)
// Compact cards: Saat #, Time, Planet, Status — expandable for details
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useAstroData, PLANET_TR } from "./useAstroData";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext";
import ManuscriptSourcePanel from "./ManuscriptSourcePanel";
import { getKashfHourAttributes } from "@/lib/astroClockManuscriptMerger";

const BENEFIC = ["sun", "jupiter", "venus", "moon"];
const MALEFIC = ["saturn", "mars"];

function hourStatus(planet, isCurrent, isPast) {
  if (isCurrent) return "current";
  if (isPast) return "past";
  return "upcoming";
}

const STATUS_META = {
  current: { color: "#4ADE80", bg: "rgba(74,222,128,0.10)", border: "rgba(74,222,128,0.40)" },
  upcoming: { color: "#F5D060", bg: "rgba(212,175,55,0.06)", border: "rgba(212,175,55,0.20)" },
  past: { color: "rgba(255,255,255,0.45)", bg: "rgba(255,255,255,0.02)", border: "rgba(255,255,255,0.10)" },
  excellent: { color: "#4ADE80", bg: "rgba(74,222,128,0.06)", border: "rgba(74,222,128,0.20)" },
  good: { color: "#86EFAC", bg: "rgba(134,239,172,0.04)", border: "rgba(134,239,172,0.15)" },
  neutral: { color: "#FBBF24", bg: "rgba(251,191,36,0.04)", border: "rgba(251,191,36,0.15)" },
  avoid: { color: "#F87171", bg: "rgba(248,113,113,0.04)", border: "rgba(248,113,113,0.15)" },
};

export default function SaatGrid() {
  const d = useAstroData();
  const { txt, language } = useAstroClockLanguage();
  const [expanded, setExpanded] = useState(null);
  if (!d.allHours) return null;

  // Split into day (1-12) and night (13-24 → display as 1-12 night)
  const dayHours = d.allHours.filter(h => h.period === "day");
  const nightHours = d.allHours.filter(h => h.period === "night");

  const renderHour = (h) => {
    const status = hourStatus(h.planet, h.status === "current", h.status === "past");
    const meta = STATUS_META[status];
    const planetName = language === "ml" ? d.planetInfo[h.planet]?.name_ml_equivalent : language === "tr" ? PLANET_TR[h.planet] : d.planetInfo[h.planet]?.name_en;
    const symbol = d.planetInfo[h.planet]?.symbol || "";
    const displayNum = h.period === "night" ? h.hourNumber - 12 : h.hourNumber;
    const isOpen = expanded === `${h.period}-${h.hourNumber}`;

    const goodActions = language === "ml" ? d.planetInfo[h.planet]?.goodActions_ml : d.planetInfo[h.planet]?.goodActions_en;
    const badActions = language === "ml" ? d.planetInfo[h.planet]?.badActions_ml : d.planetInfo[h.planet]?.badActions_en;
    const spiritual = language === "ml" ? d.planetInfo[h.planet]?.spiritualOperations_ml : d.planetInfo[h.planet]?.spiritualOperations_en;
    const source = d.planetInfo[h.planet]?.source;
    const kashfAttrs = getKashfHourAttributes(d.activeDayIndex, displayNum, h.period);

    const statusLabels = {
      current: txt("സജീവം", "Active Now", "Mevcut"),
      upcoming: txt("വരാനിരിക്കുന്ന", "Upcoming", "Gelecek"),
      past: txt("പൂർത്തിയായി", "Completed", "Geçti"),
      excellent: txt("മികച്ചത്", "Excellent", "Mükemmel"),
      good: txt("നല്ലത്", "Good", "İyi"),
      neutral: txt("സാധാരണം", "Neutral", "Nötr"),
      avoid: txt("ഒഴിവാക്കുക", "Avoid", "Kaçınılacak"),
    };

    return (
      <div key={`${h.period}-${h.hourNumber}`} className="rounded-xl overflow-hidden" style={{
        background: meta.bg, border: `1px solid ${meta.border}`,
        opacity: status === "past" ? 0.55 : 1,
        boxShadow: status === "current" ? "0 0 16px rgba(74,222,128,0.20)" : "none",
        transition: "opacity 0.3s ease, box-shadow 0.3s ease",
      }}>
        <button onClick={() => setExpanded(isOpen ? null : `${h.period}-${h.hourNumber}`)}
          className="w-full flex items-center gap-2 p-2.5 text-left">
          <span className="font-inter text-xs font-bold tabular-nums w-7 text-center" style={{ color: meta.color }}>#{displayNum}</span>
          <span className="text-base leading-none">{symbol}</span>
          <div className="flex-1 min-w-0">
            <span className="font-inter text-xs font-bold block truncate" style={{ color: meta.color }}>{planetName}</span>
            <span className="font-inter text-[9px] tabular-nums" style={{ color: "rgba(255,255,255,0.40)" }}>{h.startTime} – {h.endTime}</span>
          </div>
          <span className="font-inter text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
            {statusLabels[status]}
          </span>
          <ChevronDown className="w-3.5 h-3.5 transition-transform flex-shrink-0" style={{ color: meta.color, transform: isOpen ? "rotate(180deg)" : "none" }} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
              <div className="px-2.5 pb-2.5 space-y-1.5">
                {h.timeRemaining && (
                  <p className="font-inter text-[10px]" style={{ color: "#F5D060" }}>⏳ {txt("ബാക്കി", "Remaining", "Kalan")}: {h.timeRemaining}</p>
                )}
                {goodActions?.length > 0 && (
                  <div>
                    <p className="font-inter text-[8px] uppercase tracking-wider font-bold mb-0.5" style={{ color: "rgba(74,222,128,0.60)" }}>{txt("അനുയോജ്യം", "Recommended", "Önerilen")}</p>
                    {goodActions.slice(0, 3).map((a, i) => <p key={i} className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>• {a}</p>)}
                  </div>
                )}
                {badActions?.length > 0 && (
                  <div>
                    <p className="font-inter text-[8px] uppercase tracking-wider font-bold mb-0.5" style={{ color: "rgba(248,113,113,0.60)" }}>{txt("ഒഴിവാക്കുക", "Avoid", "Kaçınılacak")}</p>
                    {badActions.slice(0, 2).map((a, i) => <p key={i} className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>• {a}</p>)}
                  </div>
                )}
                {spiritual?.length > 0 && (
                  <div>
                    <p className="font-inter text-[8px] uppercase tracking-wider font-bold mb-0.5" style={{ color: "rgba(129,140,248,0.60)" }}>{txt("ആത്മികം", "Spiritual", "Manevi")}</p>
                    {spiritual.slice(0, 2).map((a, i) => <p key={i} className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.50)" }}>• {a}</p>)}
                  </div>
                )}
                {source && (
                  <p className="font-inter text-[8px]" style={{ color: "rgba(74,222,128,0.40)" }}>📖 {source}</p>
                )}
                {kashfAttrs.length > 0 && (
                  <ManuscriptSourcePanel
                    sources={[{
                      id: "kashf",
                      label: txt("കശ്ഫ് അൽ-ഹഖാഇഖ് (ഒമാൻ)", "Kashf al-Haqa'iq (Omani)", "Kashf al-Haqa'iq (Omani)"),
                      items: kashfAttrs.map(a => ({
                        ar: a.ar, en: a.en, ml: a.ml, tr: a.tr,
                        type: a.type === "answer" ? "answer" : a.type === "dominance" ? "dominance" : "jaad",
                        source: a.source,
                      }))
                    }]}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Day Hours */}
      <div>
        <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: "rgba(212,175,55,0.55)" }}>
          ☀ {txt("പകൽ 12 സഅാത്", "Daytime 12 Saat", "Gündüz 12 Saat")} — {txt("സൂര്യോദയം", "Sunrise", "Doğuş")} {d.sunrise.toFixed(1)}h → {txt("അസ്തമയം", "Sunset", "Batış")} {d.sunset.toFixed(1)}h
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {dayHours.map(renderHour)}
        </div>
      </div>

      {/* Night Hours */}
      <div>
        <p className="font-inter text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: "rgba(129,140,248,0.55)" }}>
          🌙 {txt("രാത്രി 12 സഅാത്", "Nighttime 12 Saat", "Gece 12 Saat")} — {txt("അസ്തമയം", "Sunset", "Batış")} {d.sunset.toFixed(1)}h → {txt("സൂര്യോദയം", "Sunrise", "Doğuş")} {d.sunrise.toFixed(1)}h
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {nightHours.map(renderHour)}
        </div>
      </div>
    </div>
  );
}