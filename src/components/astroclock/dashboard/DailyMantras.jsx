// ═══════════════════════════════════════════════════════════════
// SECTION 2 — DAILY MANTRAS & SPIRITUAL RECITATIONS
// Source: Kashf al-Haqa'iq, pp.27–31, 36, 42, 50
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, Sparkles } from "lucide-react";
import { useAstroData, DAY_TR } from "./useAstroData";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext";
import { SubCollapse } from "./DashboardSection";
import QuranicArabicText from "@/components/astroclock/QuranicArabicText";
import {
  getDailyMantrasForDay,
  getTotalMantraCount,
  DAILY_MANTRA_SCAN_REPORT,
} from "@/lib/astroClockDailyMantrasData";

const G = { text: "#F5D060", dim: "rgba(212,175,55,0.55)", border: "rgba(212,175,55,0.20)" };
const AR = "#818CF8";

const TYPE_META = {
  azimah: { label_en: "Azimah", label_ml: "അസീമ", label_tr: "Azimah", color: "#F87171", bg: "rgba(248,113,113,0.08)" },
  qasam: { label_en: "Qasam", label_ml: "ഖസം", label_tr: "Kasem", color: AR, bg: "rgba(129,140,248,0.08)" },
  universal_supplication: { label_en: "Supplication", label_ml: "ദു‌ആ", label_tr: "Dua", color: "#4ADE80", bg: "rgba(74,222,128,0.06)" },
  dhikr: { label_en: "Dhikr", label_ml: "ദിക്ർ", label_tr: "Zikir", color: G.text, bg: "rgba(212,175,55,0.06)" },
  prayer_sequence: { label_en: "Prayer", label_ml: "നമസ്കാരം", label_tr: "Namaz", color: "#FBBF24", bg: "rgba(251,191,36,0.06)" },
  prayer: { label_en: "Prayer", label_ml: "പ്രാർഥന", label_tr: "Dua", color: "#FBBF24", bg: "rgba(251,191,36,0.06)" },
  dua: { label_en: "Dua", label_ml: "ദു‌ആ", label_tr: "Dua", color: "#4ADE80", bg: "rgba(74,222,128,0.06)" },
  quran_recitation: { label_en: "Quran", label_ml: "ഖുർആൻ", label_tr: "Kur'an", color: "#34D399", bg: "rgba(52,211,153,0.06)" },
  istighfar: { label_en: "Istighfar", label_ml: "ഇസ്തിഗ്ഫാർ", label_tr: "İstiğfar", color: "#60A5FA", bg: "rgba(96,165,250,0.06)" },
  tawkeel: { label_en: "Tawkeel", label_ml: "തവ്കീൽ", label_tr: "Tawkeel", color: "#A78BFA", bg: "rgba(167,139,250,0.06)" },
  ism: { label_en: "Ism", label_ml: "നാമം", label_tr: "İsim", color: "#F472B6", bg: "rgba(244,114,182,0.06)" },
};

function MantraCard({ mantra, language, txt }) {
  const [expanded, setExpanded] = useState(false);
  const meta = TYPE_META[mantra.type] || TYPE_META.universal_supplication;

  const purpose = language === "ml" ? mantra.purpose_ml : language === "tr" ? mantra.purpose_tr : mantra.purpose_en;
  const instructions = language === "ml" ? mantra.instructions_ml : language === "tr" ? mantra.instructions_tr : mantra.instructions_en;
  const repetition = language === "ml" ? (mantra.repetition_ml || mantra.repetition) : language === "tr" ? (mantra.repetition_tr || mantra.repetition) : mantra.repetition;
  const prayerDesc = language === "ml" ? mantra.prayer_description_ml : language === "tr" ? mantra.prayer_description_tr : mantra.prayer_description_en;
  const typeLabel = language === "ml" ? meta.label_ml : language === "tr" ? meta.label_tr : meta.label_en;
  const kingOrServant = language === "ml"
    ? (mantra.king_ml || mantra.servant_ml)
    : (mantra.king_en || mantra.servant_en);

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: meta.bg, border: `1px solid ${meta.color}33` }}>
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-2.5 p-3 text-left">
        <span className="font-inter text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 font-bold"
          style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}30` }}>
          {typeLabel}
        </span>
        <div className="flex-1 min-w-0">
          <span className="font-inter text-xs font-bold block truncate" style={{ color: meta.color }}>
            {kingOrServant || purpose?.slice(0, 60)}
          </span>
          {kingOrServant && (
            <span className="font-inter text-[9px] block truncate" style={{ color: "rgba(255,255,255,0.40)" }}>
              {purpose?.slice(0, 70)}
            </span>
          )}
        </div>
        <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 transition-transform" style={{ color: meta.color, transform: expanded ? "rotate(180deg)" : "none" }} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
            <div className="px-3 pb-3 space-y-2.5">
              {/* Arabic text — Quranic display layer with AI Harakat enhancement */}
              <QuranicArabicText text={mantra.arabic_text} size="md" color={G.text} />

              {/* Purpose explanation */}
              {purpose && (
                <p className="font-inter text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
                  {purpose}
                </p>
              )}

              {/* Prayer-specific instructions */}
              {prayerDesc && (
                <div className="rounded-lg p-2" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}>
                  <p className="font-inter text-[9px] uppercase tracking-wider font-bold mb-1" style={{ color: "#FBBF24" }}>
                    {txt("നമസ്കാര ക്രമം", "Prayer sequence", "Namaz sırası")}
                  </p>
                  <p className="font-inter text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{prayerDesc}</p>
                </div>
              )}

              {/* Repetition count */}
              {repetition && (
                <div className="flex items-center gap-2">
                  <span className="font-inter text-[9px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {txt("ആവർത്തനം", "Repetition", "Tekrar")}:
                  </span>
                  <span className="font-inter text-[10px] font-bold" style={{ color: G.text }}>{repetition}</span>
                </div>
              )}

              {/* Instructions */}
              {instructions && (
                <p className="font-inter text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
                  📋 {instructions}
                </p>
              )}

              {/* Source reference */}
              <div className="flex items-center gap-1.5 pt-1" style={{ borderTop: `1px solid ${G.border}` }}>
                <BookOpen className="w-3 h-3 flex-shrink-0" style={{ color: G.dim }} />
                <p className="font-inter text-[9px]" style={{ color: G.dim }}>
                  {mantra.source.book_en}, {txt("പേജ്", "p.", "s.")}{mantra.source.page}
                  {mantra.source.scholar ? ` · ${mantra.source.scholar}` : ""}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SourceGroup({ sourceGroup, language, txt }) {
  const groupLabel = language === "ml" ? sourceGroup.group_label_ml : language === "tr" ? sourceGroup.group_label_tr : sourceGroup.group_label_en;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 pt-1">
        <div className="h-px flex-1" style={{ background: "rgba(212,175,55,0.15)" }} />
        <span className="font-inter text-[9px] uppercase tracking-wider font-bold" style={{ color: G.dim }}>
          {groupLabel}
        </span>
        <div className="h-px flex-1" style={{ background: "rgba(212,175,55,0.15)" }} />
      </div>
      {sourceGroup.mantras.map((mantra, i) => (
        <MantraCard key={mantra.id || i} mantra={mantra} language={language} txt={txt} />
      ))}
    </div>
  );
}

export default function DailyMantras() {
  const d = useAstroData();
  const { txt, language } = useAstroClockLanguage();

  if (!d.currentHour) return null;

  const mantraGroups = getDailyMantrasForDay(d.activeDayIndex);
  const total = getTotalMantraCount();

  const dayLabels = [
    txt("ഞായർ", "Sunday", "Pazar"),
    txt("തിങ്കൾ", "Monday", "Pazartesi"),
    txt("ചൊവ്വ", "Tuesday", "Salı"),
    txt("ബുധൻ", "Wednesday", "Çarşamba"),
    txt("വ്യാഴം", "Thursday", "Perşembe"),
    txt("വെള്ളി", "Friday", "Cuma"),
    txt("ശനി", "Saturday", "Cumartesi"),
  ];
  const dayName = dayLabels[d.activeDayIndex];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: `${AR}08`, border: `1px solid ${AR}33` }}>
        <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: AR }} />
        <div className="flex-1">
          <span className="font-inter text-xs font-bold" style={{ color: AR }}>
            {txt("ഇന്ന്", "Today", "Bugün")}: {dayName}
          </span>
          <span className="font-inter text-[10px] ml-2" style={{ color: "rgba(255,255,255,0.40)" }}>
            {total} {txt("പ്രാർഥനകൾ ലഭ്യം", "recitations available", "zikir mevcut")}
          </span>
        </div>
        <span className="font-inter text-[9px] px-2 py-0.5 rounded" style={{ background: "rgba(212,175,55,0.10)", color: G.dim }}>
          📖 {txt("കശ്ഫ് അൽ-ഹഖാഇഖ്", "Kashf al-Haqa'iq", "Kashf al-Haqa'iq")}
        </span>
      </div>

      {/* Recitation groups */}
      {mantraGroups.map((group, i) => (
        <SourceGroup key={i} sourceGroup={group} language={language} txt={txt} />
      ))}

      {/* Scan report (collapsed) */}
      <SubCollapse title={txt("ഗ്രന്ഥ ഓഡിറ്റ് റിപ്പോർട്ട്", "Manuscript Audit Report", "El Yazması Denetim Raporu")}>
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