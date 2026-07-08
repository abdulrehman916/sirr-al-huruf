// ═══════════════════════════════════════════════════════════════
// GUIDED RITUAL CARD — 8-STEP COMPLETE RITUAL GUIDE
// For every Dua, Azimah, Qasam, Dhikr, Quran verse, Recitation:
//   STEP 1 — BEFORE YOU BEGIN (purpose, requirements, warnings)
//   STEP 2 — PREPARATION CHECKLIST
//   STEP 3 — RECITATION (Arabic, large manuscript style)
//   STEP 4 — MALAYALAM MEANING (paragraph translation)
//   STEP 5 — HOW TO PERFORM (numbered steps)
//   STEP 6 — AFTER COMPLETION (post-ritual instructions)
//   STEP 7 — REFERENCES (book, page, weekday, planet, angel, jinn)
//   STEP 8 — RELATED RITUALS (linked, in manuscript order)
//
// RULES:
//   - Never invent information — only manuscript-derived data
//   - If manuscript doesn't specify → show "ഗ്രന്ഥത്തിൽ വ്യക്തമാക്കാത്തത്"
//   - Preserve every Arabic character exactly
//   - Manuscript is the highest authority
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
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
const NOT_SPECIFIED = "ഗ്രന്ഥത്തിൽ വ്യക്തമാക്കാത്തത്";

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

// ── Section label ──
function StepLabel({ num, label, color }) {
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <span className="font-inter text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
        style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
        STEP {num}
      </span>
      <span className="font-malayalam text-xs font-bold" style={{ color }}>
        {label}
      </span>
      <div className="h-px flex-1" style={{ background: `${color}20` }} />
    </div>
  );
}

// ── Info row for Step 1 ──
function InfoRow({ label, value, isSpecified = true }) {
  return (
    <div className="flex items-start gap-2 py-0.5">
      <span className="font-malayalam text-[11px] flex-shrink-0" style={{ color: "rgba(255,255,255,0.40)", minWidth: "90px" }}>
        {label}:
      </span>
      <span className="font-malayalam text-[11px] leading-relaxed" style={{
        color: isSpecified ? "rgba(255,255,255,0.70)" : "rgba(255,255,255,0.25)",
        fontStyle: isSpecified ? "normal" : "italic",
      }}>
        {value}
      </span>
    </div>
  );
}

// ── STEP 1: Before You Begin ──
function StepBeforeBegin({ mantra, weekdayMeta }) {
  const rules = MANUSCRIPT_PERFORMANCE_RULES;
  const hasDay = weekdayMeta !== null;
  const hasRepetition = !!mantra.repetition;

  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.12)" }}>
      <StepLabel num={1} label="ആരംഭത്തിന് മുമ്പ്" color={G.text} />
      <div className="space-y-0.5">
        <InfoRow label="ഉദ്ദേശം" value={mantra.purpose_ml} />
        <InfoRow label="വുദു/ഗുസ്ല്" value={NOT_SPECIFIED} isSpecified={false} />
        <InfoRow label="നിയ്യത്" value={NOT_SPECIFIED} isSpecified={false} />
        <InfoRow label="ദിവസം" value={hasDay ? `${weekdayMeta.day_ml} (${weekdayMeta.day_en})` : NOT_SPECIFIED} isSpecified={hasDay} />
        <InfoRow label="സഅാത് (ഘടിക)" value={rules.timing.rule_ml} />
        <InfoRow label="ഗ്രഹം" value={hasDay ? `${weekdayMeta.planet_ml} (${weekdayMeta.planet_en})` : NOT_SPECIFIED} isSpecified={hasDay} />
        <InfoRow label="ചാന്ദ്ര നക്ഷത്രം" value={NOT_SPECIFIED} isSpecified={false} />
        <InfoRow label="ചന്ദ്ര ഘട്ടം" value={rules.moon.rule_ml} />
        <InfoRow label="ധൂപം" value={NOT_SPECIFIED} isSpecified={false} />
        <InfoRow label="വസ്ത്രം" value={NOT_SPECIFIED} isSpecified={false} />
        <InfoRow label="ദിശ" value={rules.direction.default_ml} />
        <InfoRow label="ഉപവാസം" value={NOT_SPECIFIED} isSpecified={false} />
        <InfoRow label="മുന്നറിയിപ്പ്" value={rules.night_preference.rule_ml} />
      </div>
    </div>
  );
}

// ── STEP 2: Preparation Checklist ──
function StepChecklist({ mantra, weekdayMeta }) {
  const hasDay = weekdayMeta !== null;
  const items = [
    { label: "ശരിയായ ദിവസം", specified: hasDay },
    { label: "ശരിയായ സഅാത് (ഗ്രഹ ഘടിക)", specified: true },
    { label: "ശരിയായ ചന്ദ്ര സ്ഥാനം", specified: true },
    { label: "ശരിയായ ഗ്രഹം", specified: hasDay },
    { label: "ശുദ്ധി വരുത്തി", specified: false },
    { label: "സാധനങ്ങൾ തയ്യാർ", specified: false },
    { label: "ധൂപം തയ്യാർ", specified: false },
    { label: "ദിശ ഉറപ്പാക്കി", specified: true },
    { label: "നിയ്യത് നിശ്ചയിച്ചു", specified: false },
  ];
  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.12)" }}>
      <StepLabel num={2} label="തയ്യാറാകൽ ചെക്ലിസ്റ്റ്" color="#4ADE80" />
      <div className="grid grid-cols-1 gap-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[14px] flex-shrink-0" style={{ color: item.specified ? "rgba(74,222,128,0.60)" : "rgba(255,255,255,0.20)" }}>□</span>
            <span className="font-malayalam text-[11px]" style={{
              color: item.specified ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.30)",
            }}>
              {item.label}
            </span>
            {!item.specified && (
              <span className="font-inter text-[8px] italic" style={{ color: "rgba(255,255,255,0.15)" }}>
                (ഗ്രന്ഥത്തിൽ ഇല്ല)
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── STEP 5: How to Perform (numbered steps) ──
function StepHowToPerform({ mantra, weekdayMeta }) {
  const rules = MANUSCRIPT_PERFORMANCE_RULES;
  const steps = [];

  // Step 1: Start in the correct planetary hour (p.11)
  steps.push({ text: rules.timing.rule_ml, page: "11" });

  // Step 2: Night is preferred (p.39)
  steps.push({ text: rules.night_preference.rule_ml, page: "39" });

  // Step 3: Face the correct direction (p.42)
  steps.push({ text: rules.direction.default_ml, page: "42" });

  // Step 4: Waxing moon for good deeds (p.20)
  steps.push({ text: rules.moon.rule_ml, page: "20" });

  // Step 5: Day begins with preceding night (p.65)
  steps.push({ text: rules.day_boundary.rule_ml, page: "65" });

  // Step 6: Recite the specified number of times
  if (mantra.repetition) {
    steps.push({ text: `ഈ പാഠം ${mantra.repetition} തവണ ആവർത്തിക്കുക`, page: String(mantra.source?.page || "") });
  }

  // Step 7: For Azimah — recite after Qasam; for Qasam — recite after Azimah
  if (mantra.type === "azimah") {
    steps.push({ text: "ആഹ്വാനം (അസീം) ചൊല്ലുക, ശേഷം ഖസം ചൊല്ലുക", page: "27-31" });
  } else if (mantra.type === "qasam") {
    steps.push({ text: "ഖസം ചൊല്ലുക, ശേഷം സർവ ദു‌ആ ചൊല്ലുക", page: "31" });
  }

  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.12)" }}>
      <StepLabel num={5} label="അനുഷ്ഠാന ക്രമം" color="#FBBF24" />
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="font-inter text-[10px] font-bold flex-shrink-0 mt-0.5"
              style={{ color: "#FBBF24", minWidth: "18px" }}>
              {i + 1}.
            </span>
            <div className="flex-1">
              <p className="font-malayalam text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
                {step.text}
              </p>
              {step.page && (
                <span className="font-inter text-[8px]" style={{ color: "rgba(255,255,255,0.20)" }}>
                  📖 പേജ് {step.page}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── STEP 6: After Completion ──
function StepAfterCompletion({ mantra }) {
  const hasRepetition = !!mantra.repetition;
  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(96,165,250,0.04)", border: "1px solid rgba(96,165,250,0.12)" }}>
      <StepLabel num={6} label="പൂർത്തിയായ ശേഷം" color="#60A5FA" />
      <div className="space-y-0.5">
        <InfoRow label="ആവർത്തനം" value={hasRepetition ? `${mantra.repetition} തവണ ചൊല്ലിക്കഴിഞ്ഞു` : NOT_SPECIFIED}
          isSpecified={hasRepetition} />
        <InfoRow label="കാത്തിരിപ്പ്" value={NOT_SPECIFIED} isSpecified={false} />
        <InfoRow label="നിരോധനങ്ങൾ" value={NOT_SPECIFIED} isSpecified={false} />
        <InfoRow label="പ്രതീക്ഷിത ഫലം" value={mantra.purpose_ml || NOT_SPECIFIED} isSpecified={!!mantra.purpose_ml} />
      </div>
    </div>
  );
}

// ── STEP 7: References ──
function StepReferences({ mantra, weekdayMeta }) {
  const quranNote = getQuranVerificationNote(mantra.id);
  const hasDay = weekdayMeta !== null;
  const items = [
    { label: "ഗ്രന്ഥം", value: mantra.source?.book_en, specified: !!mantra.source?.book_en },
    { label: "പേജ്", value: mantra.source?.page, specified: !!mantra.source?.page },
    { label: "മൂലഗ്രന്ഥം", value: mantra.source?.book, specified: !!mantra.source?.book, isArabic: true },
    { label: "ദിവസം", value: hasDay ? `${weekdayMeta.day_ml} (${weekdayMeta.day_en})` : null, specified: hasDay },
    { label: "സഅാത്", value: "ഗ്രഹ ഘടിക (p.11)", specified: true },
    { label: "ഗ്രഹം", value: hasDay ? `${weekdayMeta.planet_ml} (${weekdayMeta.planet_en})` : null, specified: hasDay },
    { label: "ചാന്ദ്ര നക്ഷത്രം", value: null, specified: false },
    { label: "മലക്", value: hasDay ? `${weekdayMeta.angel_en} (${weekdayMeta.angel_ml})` : null, specified: hasDay },
    { label: "ജിൻ", value: mantra.king_en ? `${mantra.king_en} (${mantra.king})` : (mantra.servant_en ? `${mantra.servant_en} (${mantra.servant})` : null), specified: !!(mantra.king_en || mantra.servant_en) },
    { label: "ഉദ്ദേശം", value: mantra.purpose_en, specified: !!mantra.purpose_en },
  ];

  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(129,140,248,0.04)", border: "1px solid rgba(129,140,248,0.12)" }}>
      <StepLabel num={7} label="റഫറൻസുകൾ" color="#818CF8" />
      <div className="grid grid-cols-1 gap-0.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 py-0.5">
            <span className="font-malayalam text-[10px] flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)", minWidth: "80px" }}>
              {item.label}
            </span>
            {item.specified ? (
              <span className={item.isArabic ? "font-amiri" : "font-inter"} style={{
                fontSize: item.isArabic ? "12px" : "10px",
                color: "rgba(255,255,255,0.65)",
                direction: item.isArabic ? "rtl" : "ltr",
              }}>
                {item.value}
              </span>
            ) : (
              <span className="font-malayalam text-[10px] italic" style={{ color: "rgba(255,255,255,0.20)" }}>
                {NOT_SPECIFIED}
              </span>
            )}
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

// ── STEP 8: Related Rituals ──
function StepRelatedRituals({ mantra }) {
  const related = getRelatedRecitations(mantra.id);
  if (related.length === 0) return (
    <div className="rounded-lg p-3" style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.12)" }}>
      <StepLabel num={8} label="ബന്ധപ്പെട്ട ആചാരങ്ങൾ" color="#A78BFA" />
      <p className="font-malayalam text-[10px] italic" style={{ color: "rgba(255,255,255,0.25)" }}>
        {NOT_SPECIFIED}
      </p>
    </div>
  );

  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.12)" }}>
      <StepLabel num={8} label="ബന്ധപ്പെട്ട ആചാരങ്ങൾ" color="#A78BFA" />
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
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-2.5 p-3 text-left">
        <span className="font-inter text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 font-bold"
          style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}30` }}>
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
        <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 transition-transform"
          style={{ color: meta.color, transform: expanded ? "rotate(180deg)" : "none" }} />
      </button>

      {/* Expanded content — 8 steps */}
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
              {/* STEP 1 — Before You Begin */}
              <StepBeforeBegin mantra={mantra} weekdayMeta={weekdayMeta} />

              {/* STEP 2 — Preparation Checklist */}
              <StepChecklist mantra={mantra} weekdayMeta={weekdayMeta} />

              {/* STEP 3 — Recitation (Arabic) */}
              <div className="rounded-lg p-3" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.20)" }}>
                <StepLabel num={3} label="പാരായണം" color={G.text} />
                <QuranicArabicText text={mantra.arabic_text} size="lg" color={G.text} />
              </div>

              {/* STEP 4 — Malayalam Meaning */}
              <div className="rounded-lg p-3" style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.12)" }}>
                <StepLabel num={4} label="മലയാള പരിഭാഷ" color="#4ADE80" />
                <MalayalamTranslation mantra={mantra} />
              </div>

              {/* STEP 5 — How to Perform */}
              <StepHowToPerform mantra={mantra} weekdayMeta={weekdayMeta} />

              {/* STEP 6 — After Completion */}
              <StepAfterCompletion mantra={mantra} />

              {/* STEP 7 — References */}
              <StepReferences mantra={mantra} weekdayMeta={weekdayMeta} />

              {/* STEP 8 — Related Rituals */}
              <StepRelatedRituals mantra={mantra} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}