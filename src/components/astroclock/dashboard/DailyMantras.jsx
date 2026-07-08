// ═══════════════════════════════════════════════════════════════
// SECTION 2 — DAILY MANTRAS & SPIRITUAL RECITATIONS
// ═══════════════════════════════════════════════════════════════
//
// PURPOSE:
//   Display all daily mantras, adhkar, invocations, prayers, wazifas,
//   and spiritual recitations recommended for the current day,
//   sourced from ALL integrated manuscripts.
//
// LAW COMPLIANCE:
//   - Integration Law: grouped by source, all opinions preserved
//   - Preservation Law: never delete/overwrite — additive only
//   - Language Law: ML/EN/TR only, Arabic script preserved
//   - Location/Time Law: day from live useAstroData()
//   - Live Astronomy Law: no hardcoded day assumptions
//
// EMPTY STATE:
//   If no manuscripts contain daily recitations, display:
//   "No daily mantra or spiritual recitation exists in the
//    currently integrated manuscripts."
//
// ARCHITECTURE:
//   This is a permanent expandable knowledge base.
//   Future manuscript integrations auto-appear here without redesign.
//   The data module (astroClockDailyMantrasData.js) scans all
//   sources — when a future PDF adds mantras, they merge automatically.
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, Sparkles, AlertCircle } from "lucide-react";
import { useAstroData, DAY_TR } from "./useAstroData";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext";
import { SubCollapse } from "./DashboardSection";
import {
  getDailyMantrasForDay,
  hasAnyDailyMantras,
  getTotalMantraCount,
  DAILY_MANTRA_SCAN_REPORT,
} from "@/lib/astroClockDailyMantrasData";

const G = { text: "#F5D060", dim: "rgba(212,175,55,0.55)", border: "rgba(212,175,55,0.20)" };
const AR = "#818CF8";

// ── Single Mantra Card ──
function MantraCard({ mantra, language, txt }) {
  const [expanded, setExpanded] = useState(false);

  // Language-specific fields
  const purpose = language === "ml" ? mantra.purpose_ml : language === "tr" ? mantra.purpose_tr : mantra.purpose_en;
  const benefits = language === "ml" ? mantra.benefits_ml : language === "tr" ? mantra.benefits_tr : mantra.benefits_en;
  const preparation = language === "ml" ? mantra.preparation_ml : language === "tr" ? mantra.preparation_tr : mantra.preparation_en;
  const warnings = language === "ml" ? mantra.warnings_ml : language === "tr" ? mantra.warnings_tr : mantra.warnings_en;
  const translation = language === "ml" ? mantra.malayalam_translation : language === "tr" ? mantra.turkish_translation : mantra.english_translation;

  const dayLabels = [
    txt("ഞായർ", "Sunday", "Pazar"),
    txt("തിങ്കൾ", "Monday", "Pazartesi"),
    txt("ചൊവ്വ", "Tuesday", "Salı"),
    txt("ബുധൻ", "Wednesday", "Çarşamba"),
    txt("വ്യാഴം", "Thursday", "Perşembe"),
    txt("വെള്ളി", "Friday", "Cuma"),
    txt("ശനി", "Saturday", "Cumartesi"),
  ];
  const dayLabel = mantra.recommended_day !== null && mantra.recommended_day !== undefined
    ? dayLabels[mantra.recommended_day]
    : txt("എല്ലാ ദിവസവും", "Any day", "Her gün");

  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: "rgba(129,140,248,0.04)", border: `1px solid ${AR}33`,
    }}>
      {/* Header — always visible */}
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 p-3 text-left">
        <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: AR }} />
        <div className="flex-1 min-w-0">
          {purpose && (
            <span className="font-inter text-xs font-bold block truncate" style={{ color: AR }}>{purpose}</span>
          )}
          {mantra.recommended_saat && (
            <span className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.40)" }}>
              {txt("സഅാത്", "Saat", "Saat")} #{mantra.recommended_saat}
              {mantra.recommended_saat_period === "day" ? ` ☀` : mantra.recommended_saat_period === "night" ? ` 🌙` : ""}
            </span>
          )}
        </div>
        <span className="font-inter text-[8px] px-1.5 py-0.5 rounded" style={{ background: `${AR}15`, color: AR }}>
          {dayLabel}
        </span>
        <ChevronDown className="w-3.5 h-3.5 transition-transform flex-shrink-0" style={{ color: AR, transform: expanded ? "rotate(180deg)" : "none" }} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
            <div className="px-3 pb-3 space-y-2.5">
              {/* Arabic original — NEVER translated, always Arabic script */}
              {mantra.arabic_text && (
                <div className="rounded-lg p-3 text-center" style={{ background: "rgba(212,175,55,0.06)", border: `1px solid ${G.border}` }}>
                  <p className="font-amiri text-lg leading-loose" style={{ color: G.text, direction: "rtl" }}>
                    {mantra.arabic_text}
                  </p>
                </div>
              )}

              {/* Translation — selected language only */}
              {translation && (
                <div>
                  <p className="font-inter text-[9px] uppercase tracking-wider font-bold mb-1" style={{ color: "rgba(212,175,55,0.50)" }}>
                    {txt("പരിഭാഷ", "Translation", "Çeviri")}
                  </p>
                  <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
                    {translation}
                  </p>
                </div>
              )}

              {/* Benefits */}
              {benefits && (
                <div>
                  <p className="font-inter text-[9px] uppercase tracking-wider font-bold mb-1" style={{ color: "rgba(74,222,128,0.50)" }}>
                    {txt("ഗുണങ്ങൾ", "Benefits", "Faydalar")}
                  </p>
                  <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {benefits}
                  </p>
                </div>
              )}

              {/* Recommended conditions */}
              <div className="grid grid-cols-2 gap-2">
                {mantra.recommended_time && (
                  <div className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <p className="font-inter text-[8px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>{txt("സമയം", "Time", "Zaman")}</p>
                    <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.60)" }}>{mantra.recommended_time}</p>
                  </div>
                )}
                {mantra.recommended_moon_condition && (
                  <div className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <p className="font-inter text-[8px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>{txt("ചന്ദ്ര അവസ്ഥ", "Moon Condition", "Ay Durumu")}</p>
                    <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.60)" }}>{mantra.recommended_moon_condition}</p>
                  </div>
                )}
                {mantra.repetition_count && (
                  <div className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <p className="font-inter text-[8px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>{txt("ആവർത്തനം", "Repetitions", "Tekrar")}</p>
                    <p className="font-inter text-[10px] font-bold" style={{ color: G.text }}>{mantra.repetition_count}×</p>
                  </div>
                )}
              </div>

              {/* Preparation */}
              {preparation && (
                <div>
                  <p className="font-inter text-[9px] uppercase tracking-wider font-bold mb-1" style={{ color: "rgba(129,140,248,0.50)" }}>
                    {txt("തയ്യാറാകൽ", "Preparation", "Hazırlık")}
                  </p>
                  <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>
                    {preparation}
                  </p>
                </div>
              )}

              {/* Warnings */}
              {warnings && (
                <div className="flex items-start gap-2 rounded-lg p-2" style={{ background: "rgba(248,113,113,0.04)" }}>
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "rgba(248,113,113,0.70)" }} />
                  <p className="font-inter text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>
                    {warnings}
                  </p>
                </div>
              )}

              {/* Source + Page Reference */}
              <div className="flex items-center gap-1.5 pt-1" style={{ borderTop: `1px solid ${G.border}` }}>
                <BookOpen className="w-3 h-3 flex-shrink-0" style={{ color: G.dim }} />
                <p className="font-inter text-[9px]" style={{ color: G.dim }}>
                  {mantra.source.book_en}, {txt("പേജ്", "p.", "s.")}{mantra.source.page}
                  {mantra.source.scholar && ` · ${mantra.source.scholar}`}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Source Group ──
function SourceGroup({ sourceGroup, language, txt }) {
  const sourceName = language === "ml" ? sourceGroup.source.book_ml : language === "tr" ? sourceGroup.source.book : sourceGroup.source.book_en;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <BookOpen className="w-3.5 h-3.5 flex-shrink-0" style={{ color: G.dim }} />
        <span className="font-inter text-[10px] uppercase tracking-wider font-bold" style={{ color: G.dim }}>
          {sourceName}
        </span>
        <span className="font-inter text-[9px] px-1.5 py-0.5 rounded" style={{ background: `${G.dim}15`, color: G.dim }}>
          {sourceGroup.mantras.length} {txt("മന്ത്രങ്ങൾ", "mantras", "mantra")}
        </span>
      </div>
      {sourceGroup.mantras.map((mantra, i) => (
        <MantraCard key={mantra.id || i} mantra={mantra} language={language} txt={txt} />
      ))}
    </div>
  );
}

// ── Empty State ──
function EmptyState({ txt }) {
  return (
    <div className="rounded-xl p-6 text-center" style={{
      background: "rgba(255,255,255,0.02)", border: `1px solid ${G.border}`,
    }}>
      <BookOpen className="w-8 h-8 mx-auto mb-3" style={{ color: G.dim }} />
      <p className="font-inter text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>
        {txt(
          "നിലവിൽ സംയോജിപ്പിച്ചിരിക്കുന്ന ഗ്രന്ഥങ്ങളിൽ ദൈനംദിന മന്ത്രമോ ആത്മിക പാരായണമോ ഇല്ല.",
          "No daily mantra or spiritual recitation exists in the currently integrated manuscripts.",
          "Şu anda entegre edilmiş el yazmalarında günlük mantra veya ruani zikir bulunmamaktadır."
        )}
      </p>
      <p className="font-inter text-[10px] mt-3" style={{ color: "rgba(255,255,255,0.30)" }}>
        {txt(
          `സ്കാൻ ചെയ്ത ഗ്രന്ഥങ്ങൾ: ${DAILY_MANTRA_SCAN_REPORT.manuscripts_scanned.length} · കണ്ടെത്തിയവ: ${getTotalMantraCount()}`,
          `Sources scanned: ${DAILY_MANTRA_SCAN_REPORT.manuscripts_scanned.length} · Found: ${getTotalMantraCount()}`,
          `Taranan kaynaklar: ${DAILY_MANTRA_SCAN_REPORT.manuscripts_scanned.length} · Bulunan: ${getTotalMantraCount()}`
        )}
      </p>
    </div>
  );
}

// ── Main Section 2 Component ──
export default function DailyMantras() {
  const d = useAstroData();
  const { txt, language } = useAstroClockLanguage();
  const [showScanReport, setShowScanReport] = useState(false);

  if (!d.currentHour) return null;

  // Get mantras for today's live day index
  const mantrasBySource = getDailyMantrasForDay(d.activeDayIndex);
  const hasMantras = mantrasBySource.length > 0;
  const dayName = language === "tr" ? DAY_TR[d.activeDayIndex] : d.dayInfo?.name_en;

  return (
    <div className="space-y-3">
      {/* ── Today's Day Header ── */}
      <div className="rounded-xl p-3 flex items-center gap-3" style={{
        background: "rgba(129,140,248,0.06)", border: `1px solid ${AR}33`,
      }}>
        <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: AR }} />
        <div className="flex-1">
          <span className="font-inter text-xs font-bold" style={{ color: AR }}>
            {txt("ഇന്നത്തെ ദിവസം", "Today", "Bugün")}: {dayName}
          </span>
          <span className="font-inter text-[10px] ml-2" style={{ color: "rgba(255,255,255,0.40)" }}>
            {hasMantras
              ? `${mantrasBySource.reduce((s, g) => s + g.mantras.length, 0)} ${txt("മന്ത്രങ്ങൾ", "mantras", "mantra")}`
              : txt("മന്ത്രങ്ങളൊന്നുമില്ല", "no mantras", "mantra yok")}
          </span>
        </div>
      </div>

      {/* ── Mantras grouped by source, or empty state ── */}
      {hasMantras ? (
        mantrasBySource.map((sourceGroup, i) => (
          <SourceGroup key={i} sourceGroup={sourceGroup} language={language} txt={txt} />
        ))
      ) : (
        <EmptyState txt={txt} />
      )}

      {/* ── Scan Report (collapsed, for transparency) ── */}
      <SubCollapse title={txt("ഗ്രന്ഥ സ്കാൻ റിപ്പോർട്ട്", "Manuscript Scan Report", "El Yazması Tarama Raporu")}>
        <div className="space-y-2">
          {DAILY_MANTRA_SCAN_REPORT.manuscripts_scanned.map((ms, i) => (
            <div key={i} className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-inter text-[10px] font-bold" style={{ color: ms.daily_mantras_found ? "#4ADE80" : G.dim }}>
                  {ms.daily_mantras_found ? "✓" : "○"} {ms.book_name}
                </span>
              </div>
              <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                {txt("പേജുകൾ", "Pages", "Sayfalar")}: {ms.pages_scanned} · {ms.author}
              </p>
              <p className="font-inter text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                {ms.note}
              </p>
            </div>
          ))}
          <p className="font-inter text-[9px] pt-1" style={{ color: G.dim, borderTop: `1px solid ${G.border}` }}>
            {DAILY_MANTRA_SCAN_REPORT.conclusion}
          </p>
        </div>
      </SubCollapse>
    </div>
  );
}