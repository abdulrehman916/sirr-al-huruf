// ═══════════════════════════════════════════════════════════════
// SECTION 2 — DAILY MANTRAS: COMPLETE GUIDED RITUAL PAGE
// Source: Kashf al-Haqa'iq, pp.27–53
//
// Every recitation displayed as a 6-section guided ritual:
//   1. Introduction (Malayalam)
//   2. How to Perform (manuscript instructions)
//   3. Arabic Text (large, manuscript-style)
//   4. Malayalam Meaning (full translation)
//   5. References (book, page, weekday, planet, angel)
//   6. Related Recitations (linked, in order)
//
// RULES:
//   - Never invent information — only manuscript-derived data
//   - Preserve every Arabic character exactly
//   - Manuscript is the highest authority
// ═══════════════════════════════════════════════════════════════
import { useAstroData } from "./useAstroData";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext";
import { SubCollapse } from "./DashboardSection";
import GuidedRitualCard from "./GuidedRitualCard";
import {
  getDailyMantrasForDay,
  getTotalMantraCount,
  DAILY_MANTRA_SCAN_REPORT,
} from "@/lib/astroClockDailyMantrasData";
import { KASHF_FULL_MANTRAS } from "@/lib/manuscriptRitualGuideFullData";

const G = { text: "#F5D060", dim: "rgba(212,175,55,0.55)", border: "rgba(212,175,55,0.20)" };
const AR = "#818CF8";

function SourceGroup({ sourceGroup, txt, defaultExpandedId }) {
  const groupLabel = sourceGroup.group_label_ml;
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
        <GuidedRitualCard
          key={mantra.id || i}
          mantra={mantra}
          defaultExpanded={mantra.id === defaultExpandedId}
        />
      ))}
    </div>
  );
}

const CATEGORY_MAP = {
  dua: 'Dua', poetry: 'Notes', conditions: 'Conditions', protection: 'Protection',
  jinn_related: 'Jinn Related', incense: 'Incense', timing: 'Timing',
  warnings: 'Warnings', fasting: 'Fasting', materials: 'Powders',
  lunar_mansion: 'Lunar Mansion Related', lunar_day: 'Timing', nahs_days: 'Warnings',
  exorcism: 'Jinn Related',
};

const CATEGORY_ORDER = ['Dua', 'Conditions', 'Protection', 'Jinn Related', 'Incense', 'Timing',
  'Fasting', 'Powders', 'Lunar Mansion Related', 'Warnings', 'Notes', 'Other'];

function ManuscriptKnowledgeSection({ mantras, txt }) {
  const groups = {};
  for (const m of mantras) {
    const cat = CATEGORY_MAP[m.type] || 'Other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(m);
  }
  return (
    <SubCollapse title={txt("ഗ്രന്ഥ വിജ്ഞാനം", "Manuscript Knowledge", "El Yazması Bilgisi")}>
      <div className="space-y-1.5">
        <p className="font-malayalam text-[10px] pb-1" style={{ color: "rgba(255,255,255,0.40)" }}>
          {mantras.length} {txt("പ്രയോഗങ്ങൾ — എല്ലാ ഗ്രന്ഥങ്ങളിൽ നിന്നും", "entries — from all manuscripts", "kayıt — tüm el yazmalarından")}
        </p>
        {CATEGORY_ORDER.map(cat => {
          if (!groups[cat]) return null;
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 pt-1">
                <div className="h-px flex-1" style={{ background: "rgba(212,175,55,0.15)" }} />
                <span className="font-inter text-[9px] uppercase tracking-wider font-bold" style={{ color: G.dim }}>
                  {cat} ({groups[cat].length})
                </span>
                <div className="h-px flex-1" style={{ background: "rgba(212,175,55,0.15)" }} />
              </div>
              {groups[cat].map((mantra, i) => (
                <GuidedRitualCard key={mantra.id || i} mantra={mantra} />
              ))}
            </div>
          );
        })}
      </div>
    </SubCollapse>
  );
}

export default function DailyMantras() {
  const d = useAstroData();
  const { txt } = useAstroClockLanguage();

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

  // First recitation expanded by default
  const firstGroup = mantraGroups[0];
  const defaultExpandedId = firstGroup?.mantras?.[0]?.id;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: `${AR}08`, border: `1px solid ${AR}33` }}>
        <span className="text-lg">📿</span>
        <div className="flex-1">
          <span className="font-inter text-xs font-bold" style={{ color: AR }}>
            {txt("ഇന്ന്", "Today", "Bugün")}: {dayName}
          </span>
          <span className="font-inter text-[10px] ml-2" style={{ color: "rgba(255,255,255,0.40)" }}>
            {total} {txt("പ്രാർഥനകൾ", "recitations", "zikir")}
          </span>
        </div>
        <span className="font-inter text-[9px] px-2 py-0.5 rounded" style={{ background: "rgba(212,175,55,0.10)", color: G.dim }}>
          📖 {txt("കശ്ഫ് അൽ-ഹഖാഇഖ്", "Kashf al-Haqa'iq", "Kashf al-Haqa'iq")}
        </span>
      </div>

      {/* Manuscript Authority Notice */}
      <div className="rounded-lg p-2" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.10)" }}>
        <p className="font-malayalam text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          ⚖️ മൂല ഗ്രന്ഥം ആണ് പ്രാഥമിക അധികാരം. എല്ലാ അറബി പാഠവും ഗ്രന്ഥത്തിൽ നിന്ന് നേരിട്ട് പകർത്തിയതാണ്.
        </p>
      </div>

      {/* Guided ritual groups */}
      {mantraGroups.map((group, i) => (
        <SourceGroup key={i} sourceGroup={group} txt={txt} defaultExpandedId={defaultExpandedId} />
      ))}

      {/* Manuscript Knowledge — All extracted entries by category */}
      <ManuscriptKnowledgeSection mantras={KASHF_FULL_MANTRAS} txt={txt} />

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
                {txt("പേജുകൾ", "Pages", "Sayfalar")}: {ms.pages_scanned || ms.total_pages} · {ms.author}
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