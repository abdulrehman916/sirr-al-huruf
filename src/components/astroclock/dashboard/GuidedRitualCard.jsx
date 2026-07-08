// ═══════════════════════════════════════════════════════════════
// GUIDED RITUAL CARD — 6-SECTION COMPLETE RITUAL DISPLAY
// For every Dua, Azimah, Qasam, Dhikr, Quran verse, Recitation:
//   1. INTRODUCTION (Malayalam) — what it is, purpose, related info
//   2. HOW TO PERFORM — manuscript instructions exactly
//   3. ARABIC TEXT — complete, large, manuscript-style
//   4. MALAYALAM MEANING — full translation below Arabic
//   5. REFERENCES — book, page, weekday, planet, angel, purpose
//   6. RELATED RECITATIONS — linked recitations in order
//
// RULES:
//   - Never invent information — only manuscript-derived data
//   - Never invent ritual steps
//   - Preserve every Arabic character exactly
//   - Manuscript is the highest authority
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, Compass, Moon, Clock, AlertTriangle, Link2 } from "lucide-react";
import QuranicArabicText from "@/components/astroclock/QuranicArabicText";
import MalayalamTranslation from "./MalayalamTranslation";
import {
  WEEKDAY_PLANET_META,
  MANUSCRIPT_PERFORMANCE_RULES,
  getRelatedRecitations,
  getQuranVerificationNote,
  MANUSCRIPT_AUTHORITY_RULE,
} from "@/lib/astroClockDailyMantrasData";

const G = { text: "#F5D060", dim: "rgba(212,175,55,0.55)", border: "rgba(212,175,55,0.20)" };

const TYPE_META = {
  azimah: { label_ml: "അസീം (ആഹ്വാനം)", color: "#F87171", bg: "rgba(248,113,113,0.06)" },
  qasam: { label_ml: "ഖസം (ശപഥം)", color: "#818CF8", bg: "rgba(129,140,248,0.06)" },
  universal_supplication: { label_ml: "സർവ ദു‌ആ", color: "#4ADE80", bg: "rgba(74,222,128,0.04)" },
  dua: { label_ml: "ദു‌ആ", color: "#4ADE80", bg: "rgba(74,222,128,0.04)" },
  prayer: { label_ml: "പ്രാർഥന", color: "#FBBF24", bg: "rgba(251,191,36,0.04)" },
  quran_recitation: { label_ml: "ഖുർആൻ വചനം", color: "#34D399", bg: "rgba(52,211,153,0.04)" },
  istighfar: { label_ml: "ഇസ്തിഗ്ഫാർ", color: "#60A5FA", bg: "rgba(96,165,250,0.04)" },
  tawkeel: { label_ml: "തവ്കീൽ (നിയോഗം)", color: "#A78BFA", bg: "rgba(167,139,250,0.04)" },
  ism: { label_ml: "ദൈവ നാമം", color: "#F472B6", bg: "rgba(244,114,182,0.04)" },
};

// ── Section label component ──
function SectionLabel({ icon, label, color }) {
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-[10px]">{icon}</span>
      <span className="font-inter text-[9px] uppercase tracking-wider font-bold" style={{ color }}>
        {label}
      </span>
      <div className="h-px flex-1" style={{ background: `${color}20` }} />
    </div>
  );
}

// ── Section 1: Introduction (Malayalam) ──
function RitualIntroduction({ mantra, weekdayMeta }) {
  const purpose = mantra.purpose_ml;
  const typeLabel = TYPE_META[mantra.type]?.label_ml || "പ്രാർഥന";

  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.12)" }}>
      <SectionLabel icon="✦" label="1. ആമുഖം" color={G.text} />

      <p className="font-malayalam text-sm leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.80)" }}>
        {typeLabel}. {purpose}
      </p>

      {weekdayMeta && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="font-inter text-[9px] px-2 py-0.5 rounded" style={{ background: "rgba(212,175,55,0.08)", color: G.dim }}>
            📅 {weekdayMeta.day_ml} ({weekdayMeta.day_en})
          </span>
          <span className="font-inter text-[9px] px-2 py-0.5 rounded" style={{ background: "rgba(212,175,55,0.08)", color: G.dim }}>
            🪐 {weekdayMeta.planet_ml} ({weekdayMeta.planet_en})
          </span>
          {mantra.king_en && (
            <span className="font-inter text-[9px] px-2 py-0.5 rounded" style={{ background: "rgba(248,113,113,0.08)", color: "rgba(248,113,113,0.70)" }}>
              👑 {mantra.king_en} ({mantra.king})
            </span>
          )}
          {mantra.servant_en && (
            <span className="font-inter text-[9px] px-2 py-0.5 rounded" style={{ background: "rgba(129,140,248,0.08)", color: "rgba(129,140,248,0.70)" }}>
              🤝 {mantra.servant_en} ({mantra.servant})
            </span>
          )}
          {weekdayMeta.angel_en && (
            <span className="font-inter text-[9px] px-2 py-0.5 rounded" style={{ background: "rgba(74,222,128,0.08)", color: "rgba(74,222,128,0.70)" }}>
              😇 {weekdayMeta.angel_en} ({weekdayMeta.angel_ml})
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ── Section 2: How to Perform ──
function RitualInstructions({ mantra }) {
  const rules = MANUSCRIPT_PERFORMANCE_RULES;
  const hasRepetition = mantra.repetition;

  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.12)" }}>
      <SectionLabel icon="📋" label="2. അനുഷ്ഠാന ക്രമം" color="#FBBF24" />

      <div className="space-y-1.5">
        {hasRepetition && (
          <p className="font-malayalam text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
            <strong style={{ color: "#FBBF24" }}>ആവർത്തനം:</strong> {mantra.repetition} തവണ
          </p>
        )}
        <p className="font-malayalam text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
          <Clock className="inline w-3 h-3 mr-1" style={{ color: "rgba(251,191,36,0.60)" }} />
          {rules.timing.rule_ml}
        </p>
        <p className="font-malayalam text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
          <Moon className="inline w-3 h-3 mr-1" style={{ color: "rgba(129,140,248,0.60)" }} />
          {rules.night_preference.rule_ml}
        </p>
        <p className="font-malayalam text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
          <Compass className="inline w-3 h-3 mr-1" style={{ color: "rgba(212,175,55,0.60)" }} />
          {rules.direction.default_ml}
        </p>
        <p className="font-malayalam text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
          🌙 {rules.moon.rule_ml}
        </p>
        <p className="font-malayalam text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
          📅 {rules.day_boundary.rule_ml}
        </p>
      </div>
      <p className="font-inter text-[8px] mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>
        📖 {rules.source}
      </p>
    </div>
  );
}

// ── Section 5: References ──
function RitualReferences({ mantra, weekdayMeta }) {
  const quranNote = getQuranVerificationNote(mantra.id);
  const items = [
    { label: "ഗ്രന്ഥം", value: mantra.source?.book_en },
    { label: "പേജ്", value: mantra.source?.page },
    { label: "മൂലഗ്രന്ഥം", value: mantra.source?.book, isArabic: true },
    { label: "ദിവസം", value: weekdayMeta ? `${weekdayMeta.day_ml} (${weekdayMeta.day_en})` : null },
    { label: "ഗ്രഹം", value: weekdayMeta ? `${weekdayMeta.planet_ml} (${weekdayMeta.planet_en})` : null },
    { label: "മലക്", value: weekdayMeta ? `${weekdayMeta.angel_en} (${weekdayMeta.angel_ml})` : null },
    { label: "ഉദ്ദേശം", value: mantra.purpose_en },
  ].filter(i => i.value);

  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(129,140,248,0.04)", border: "1px solid rgba(129,140,248,0.12)" }}>
      <SectionLabel icon="📚" label="5. റഫറൻസുകൾ" color="#818CF8" />
      <div className="grid grid-cols-1 gap-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="font-inter text-[9px] uppercase tracking-wider flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)", minWidth: "60px" }}>
              {item.label}
            </span>
            <span
              className={item.isArabic ? "font-amiri" : "font-inter"}
              style={{
                fontSize: item.isArabic ? "12px" : "10px",
                color: "rgba(255,255,255,0.65)",
                direction: item.isArabic ? "rtl" : "ltr",
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
      {quranNote && (
        <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(129,140,248,0.15)" }}>
          <p className="font-inter text-[9px]" style={{ color: "rgba(129,140,248,0.60)" }}>
            ✓ {quranNote.quran_ref} — {quranNote.note}
          </p>
        </div>
      )}
      <p className="font-inter text-[8px] mt-2" style={{ color: "rgba(255,255,255,0.20)" }}>
        ⚖️ {MANUSCRIPT_AUTHORITY_RULE.rule_ml}
      </p>
    </div>
  );
}

// ── Section 6: Related Recitations ──
function RitualRelated({ mantra }) {
  const related = getRelatedRecitations(mantra.id);
  if (related.length === 0) return null;

  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.12)" }}>
      <SectionLabel icon="🔗" label="6. ബന്ധപ്പെട്ട പ്രാർഥനകൾ" color="#A78BFA" />
      <div className="space-y-1.5">
        {related.map((r, i) => (
          <div key={r.id} className="flex items-center gap-2">
            <span className="font-inter text-[9px] font-bold flex-shrink-0" style={{ color: "#A78BFA" }}>
              {i + 1}.
            </span>
            <span className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.60)" }}>
              {TYPE_META[r.type]?.label_ml || r.type} — {r.king_en || r.servant_en || r.purpose_en?.slice(0, 50)}
            </span>
            <span className="font-inter text-[8px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              p.{r.source?.page}
            </span>
          </div>
        ))}
        <p className="font-malayalam text-[10px] mt-1" style={{ color: "rgba(167,139,250,0.50)" }}>
          മുകളിൽ പറഞ്ഞ ക്രമത്തിൽ ചൊല്ലേണ്ടതാണ്.
        </p>
      </div>
    </div>
  );
}

// ── Main Card ──
export default function GuidedRitualCard({ mantra, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const meta = TYPE_META[mantra.type] || TYPE_META.dua;
  const weekdayMeta = mantra.day_index !== null && mantra.day_index !== undefined
    ? WEEKDAY_PLANET_META.find(d => d.day_index === mantra.day_index)
    : null;

  const title = mantra.king_en || mantra.servant_en || mantra.purpose_en?.slice(0, 60) || mantra.id;

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: meta.bg, border: `1px solid ${meta.color}33` }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2.5 p-3 text-left"
      >
        <span
          className="font-inter text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 font-bold"
          style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}30` }}
        >
          {meta.label_ml}
        </span>
        <div className="flex-1 min-w-0">
          <span className="font-inter text-xs font-bold block truncate" style={{ color: meta.color }}>
            {title}
          </span>
          <span className="font-inter text-[9px] block truncate" style={{ color: "rgba(255,255,255,0.40)" }}>
            {mantra.purpose_ml?.slice(0, 70)}
          </span>
        </div>
        <ChevronDown
          className="w-3.5 h-3.5 flex-shrink-0 transition-transform"
          style={{ color: meta.color, transform: expanded ? "rotate(180deg)" : "none" }}
        />
      </button>

      {/* Expanded content — 6 sections */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2.5">
              {/* 1. Introduction */}
              <RitualIntroduction mantra={mantra} weekdayMeta={weekdayMeta} />

              {/* 2. How to Perform */}
              <RitualInstructions mantra={mantra} />

              {/* 3. Arabic Text */}
              <div>
                <SectionLabel icon="ع" label="3. അറബി പാഠം" color={G.text} />
                <QuranicArabicText text={mantra.arabic_text} size="lg" color={G.text} />
              </div>

              {/* 4. Malayalam Meaning */}
              <div>
                <SectionLabel icon="📝" label="4. മലയാള പരിഭാഷ" color="#4ADE80" />
                <MalayalamTranslation mantra={mantra} />
              </div>

              {/* 5. References */}
              <RitualReferences mantra={mantra} weekdayMeta={weekdayMeta} />

              {/* 6. Related Recitations */}
              <RitualRelated mantra={mantra} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}