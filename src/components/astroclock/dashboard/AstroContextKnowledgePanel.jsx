// ═══════════════════════════════════════════════════════════════
// ASTRO CONTEXT KNOWLEDGE PANEL
// Displays full-context manuscript knowledge for an exact
// Day + Sa'at + Kawkab combination.
//
// Displays:
//   • Recommended actions
//   • Forbidden actions
//   • Enemy-related actions
//   • Friendship-related actions
//   • Ritual suitability
//   • Warnings
//   • Notes
//   • All supporting manuscript sources
//
// KNOWLEDGE IS NEVER DISPLAYED BY PLANET NAME ALONE.
// The same Day+Saat+Kawkab always shows the same manuscript knowledge.
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, XCircle, Swords, Heart, Sparkles,
  AlertTriangle, Info, BookOpen, ChevronDown
} from "lucide-react";
import { useAstroClockLanguage } from "@/lib/astroClockLanguageContext";
import { useAstroClockContextKnowledge } from "@/hooks/useAstroClockContextKnowledge";

const CATEGORY_CONFIG = {
  recommended: {
    icon: CheckCircle2,
    color: "rgba(74,222,128,0.60)",
    bg: "rgba(74,222,128,0.06)",
    label_ml: "ഉദ്ദേശിക്കുന്ന പ്രവൃത്തികൾ",
    label_en: "Recommended Actions",
    label_ar: "الأفعال الموصى بها",
  },
  forbidden: {
    icon: XCircle,
    color: "rgba(248,113,113,0.60)",
    bg: "rgba(248,113,113,0.06)",
    label_ml: "നിരോധിത പ്രവൃത്തികൾ",
    label_en: "Forbidden Actions",
    label_ar: "الأفعال المحظورة",
  },
  enemy: {
    icon: Swords,
    color: "rgba(239,68,68,0.55)",
    bg: "rgba(239,68,68,0.05)",
    label_ml: "ശത്രു പ്രവൃത്തികൾ",
    label_en: "Enemy-Related Actions",
    label_ar: "أفعال الأعداء",
  },
  friendship: {
    icon: Heart,
    color: "rgba(244,114,182,0.55)",
    bg: "rgba(244,114,182,0.05)",
    label_ml: "സൌഹൃദ പ്രവൃത്തികൾ",
    label_en: "Friendship-Related Actions",
    label_ar: "أفعال الصداقة",
  },
  warnings: {
    icon: AlertTriangle,
    color: "rgba(251,191,36,0.55)",
    bg: "rgba(251,191,36,0.05)",
    label_ml: "മുന്നറിയിപ്പുകൾ",
    label_en: "Warnings",
    label_ar: "تحذيرات",
  },
  notes: {
    icon: Info,
    color: "rgba(129,140,248,0.50)",
    bg: "rgba(129,140,248,0.04)",
    label_ml: "കുറിപ്പുകൾ",
    label_en: "Notes",
    label_ar: "ملاحظات",
  },
};

function ActionList({ items, config, language }) {
  if (!items || items.length === 0) return null;
  const Icon = config.icon;

  return (
    <div className="rounded-lg p-2" style={{ background: config.bg, border: `1px solid ${config.color}20` }}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3 h-3 flex-shrink-0" style={{ color: config.color }} />
        <span className="font-inter text-[8px] uppercase tracking-wider font-bold" style={{ color: config.color }}>
          {language === "ml" ? config.label_ml : language === "ar" ? config.label_ar : config.label_en}
          {" "}
          <span className="opacity-50">({items.length})</span>
        </span>
      </div>
      {items.map((item, i) => (
        <div key={i} className="mb-1.5 last:mb-0">
          <p className="font-inter text-[10px] leading-snug" style={{ color: "rgba(255,255,255,0.65)" }}>
            • {language === "ml" ? (item.ml || item.en) : language === "ar" ? (item.ar || item.en) : item.en}
          </p>
          {item.ar && language !== "ar" && (
            <p className="font-amiri text-[11px] mt-0.5" style={{ color: "rgba(212,175,55,0.40)", direction: "rtl" }}>
              {item.ar}
            </p>
          )}
          {/* Source references — preserve every source */}
          {item.sources && item.sources.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {item.sources.map((src, si) => (
                <span key={si} className="font-inter text-[7px] px-1 py-0.5 rounded" style={{
                  background: "rgba(129,140,248,0.06)",
                  color: "rgba(129,140,248,0.40)",
                }}>
                  📖 {src.book_title}{src.page_number ? ` p.${src.page_number}` : ''}
                  {src.screenshot_url ? ' 📷' : ''}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SourceList({ sources, language, txt }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="rounded-lg p-2" style={{ background: "rgba(212,175,55,0.03)", border: "1px solid rgba(212,175,55,0.10)" }}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <BookOpen className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(212,175,55,0.50)" }} />
        <span className="font-inter text-[8px] uppercase tracking-wider font-bold" style={{ color: "rgba(212,175,55,0.55)" }}>
          {txt("സ്രോതസ്സുകൾ", "Supporting Sources", "المصادر")}
          {" "}
          <span className="opacity-50">({sources.length})</span>
        </span>
      </div>
      {sources.map((src, i) => (
        <div key={i} className="mb-1 last:mb-0">
          <p className="font-inter text-[9px]" style={{ color: "rgba(255,255,255,0.45)" }}>
            • {src.book_title}{src.page_number ? ` — p.${src.page_number}` : ''}
            {src.screenshot_url ? ' 📷 Screenshot' : ''}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * @param {object} context - { weekday, period, saat_number, planet, nakshatra }
 */
export default function AstroContextKnowledgePanel({ context }) {
  const { txt, language } = useAstroClockLanguage();
  const { knowledge, loading, error } = useAstroClockContextKnowledge(context);
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <div className="rounded-lg p-2.5" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.12)" }}>
        <p className="font-inter text-[10px]" style={{ color: "rgba(212,175,55,0.50)" }}>
          {txt("ഗ്രന്ഥ വിജ്ഞാനം ലഭ്യമാക്കുന്നു...", "Loading manuscript knowledge...", "تحميل المعرفة...")}
        </p>
      </div>
    );
  }

  if (error || !knowledge || knowledge.length === 0) {
    return (
      <div className="rounded-lg p-2 mt-1.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="font-inter text-[9px] text-center" style={{ color: "rgba(255,255,255,0.30)" }}>
          {txt("ഈ സഅാത്തിന് ഗ്രന്ഥ വിജ്ഞാനം ലഭ്യമല്ല", "No verified manuscript knowledge available.", "لا توجد معرفة مخطوطة متاحة.")}
        </p>
      </div>
    );
  }

  // Merge all knowledge records for this context (there should typically be one)
  const merged = knowledge.reduce((acc, rec) => {
    acc.recommended = [...(acc.recommended || []), ...(rec.recommended_actions || [])];
    acc.forbidden = [...(acc.forbidden || []), ...(rec.forbidden_actions || [])];
    acc.enemy = [...(acc.enemy || []), ...(rec.enemy_actions || [])];
    acc.friendship = [...(acc.friendship || []), ...(rec.friendship_actions || [])];
    acc.warnings = [...(acc.warnings || []), ...(rec.warnings_list || [])];
    acc.notes = [...(acc.notes || []), ...(rec.notes_list || [])];
    acc.ritual = acc.ritual || rec.ritual_suitability || '';
    acc.sources = [...(acc.sources || []), ...(rec.supporting_sources || [])];
    if (rec.source_screenshot_url) {
      acc.sources.push({
        book_title: rec.source_book_title || 'Screenshot',
        page_number: '',
        screenshot_url: rec.source_screenshot_url
      });
    }
    return acc;
  }, {});

  const hasContent = (merged.recommended?.length > 0) ||
    (merged.forbidden?.length > 0) ||
    (merged.enemy?.length > 0) ||
    (merged.friendship?.length > 0) ||
    (merged.warnings?.length > 0) ||
    (merged.notes?.length > 0) ||
    merged.ritual;

  if (!hasContent) return null;

  const totalItems = (merged.recommended?.length || 0) +
    (merged.forbidden?.length || 0) +
    (merged.enemy?.length || 0) +
    (merged.friendship?.length || 0) +
    (merged.warnings?.length || 0) +
    (merged.notes?.length || 0);

  return (
    <div className="rounded-lg overflow-hidden mt-1.5" style={{
      background: "rgba(212,175,55,0.04)",
      border: "1px solid rgba(212,175,55,0.15)",
    }}>
      {/* Header */}
      <button
        onClick={() => setShowAll(!showAll)}
        className="w-full flex items-center gap-2 p-2 text-left"
      >
        <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#F5D060" }} />
        <span className="font-inter text-[9px] uppercase tracking-wider font-bold flex-1" style={{ color: "rgba(212,175,55,0.65)" }}>
          {txt("ഗ്രന്ഥ വിജ്ഞാനം — ദിവസം + സഅാത് + കവ്കബ്", "Manuscript Knowledge — Day+Saat+Kawkab", "معرفة المخطوطة — اليوم+الساعة+الكوكب")}
          {" "}
          <span className="opacity-50">({totalItems})</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 transition-transform flex-shrink-0" style={{
          color: "rgba(212,175,55,0.50)",
          transform: showAll ? "rotate(180deg)" : "none"
        }} />
      </button>

      {showAll && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
          <div className="px-2 pb-2 space-y-1.5">
            {/* Ritual suitability */}
            {merged.ritual && (
              <div className="rounded-lg p-2" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)" }}>
                <p className="font-inter text-[8px] uppercase tracking-wider font-bold mb-1" style={{ color: "rgba(212,175,55,0.60)" }}>
                  {txt("ആചാര അനുയോജ്യത", "Ritual Suitability", "ملاءمة الطقوس")}
                </p>
                <p className="font-inter text-[10px] leading-snug" style={{ color: "rgba(255,255,255,0.60)" }}>
                  {merged.ritual}
                </p>
              </div>
            )}

            {/* Action categories */}
            <ActionList items={merged.recommended} config={CATEGORY_CONFIG.recommended} language={language} />
            <ActionList items={merged.forbidden} config={CATEGORY_CONFIG.forbidden} language={language} />
            <ActionList items={merged.enemy} config={CATEGORY_CONFIG.enemy} language={language} />
            <ActionList items={merged.friendship} config={CATEGORY_CONFIG.friendship} language={language} />
            <ActionList items={merged.warnings} config={CATEGORY_CONFIG.warnings} language={language} />
            <ActionList items={merged.notes} config={CATEGORY_CONFIG.notes} language={language} />

            {/* All supporting sources */}
            <SourceList sources={merged.sources} language={language} txt={txt} />
          </div>
        </motion.div>
      )}
    </div>
  );
}