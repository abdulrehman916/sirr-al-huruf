// ═══════════════════════════════════════════════════════════════
// GUIDED RITUAL CARD — 8-STEP COMPLETE RITUAL GUIDE
// PERMANENT MANUSCRIPT RULE: Every instruction is sourced from
// original manuscripts via cross-manuscript search. "Not specified"
// is shown ONLY after ALL imported manuscripts are searched.
// Every instruction includes its manuscript source + page number.
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import QuranicArabicText from "@/components/astroclock/QuranicArabicText";
import MalayalamTranslation from "./MalayalamTranslation";
import { getMergedRitualInstructions, getRegisteredSources } from "@/lib/manuscriptRitualGuideData";
import {
  WEEKDAY_PLANET_META,
  getAllRecitationsMap,
  getQuranVerificationNote,
  MANUSCRIPT_AUTHORITY_RULE,
} from "@/lib/astroClockDailyMantrasData";

const G = { text: "#F5D060", dim: "rgba(212,175,55,0.55)", border: "rgba(212,175,55,0.20)" };
const NOT_SPECIFIED_ANY = "ഇറക്കുമതി ചെയ്ത ഒരു ഗ്രന്ഥത്തിലും പറയാത്തത്";

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

// Step 1 field definitions
const STEP1_FIELDS = [
  { field: 'purpose', label: 'ഉദ്ദേശം' },
  { field: 'benefits', label: 'ഗുണങ്ങൾ' },
  { field: 'required_purification', label: 'വുദു/ഗുസ്ല്' },
  { field: 'required_intention', label: 'നിയ്യത്' },
  { field: 'suitable_weekday', label: 'ദിവസം' },
  { field: 'suitable_saat', label: 'സഅാത്' },
  { field: 'suitable_planet', label: 'ഗ്രഹം' },
  { field: 'suitable_lunar_mansion', label: 'ചാന്ദ്ര നക്ഷത്രം' },
  { field: 'suitable_moon_phase', label: 'ചന്ദ്ര ഘട്ടം' },
  { field: 'suitable_zodiac', label: 'രാശി' },
  { field: 'required_angel', label: 'മലക്' },
  { field: 'required_jinn', label: 'ജിൻ' },
  { field: 'required_divine_names', label: 'ദൈവ നാമം' },
  { field: 'required_incense', label: 'ധൂപം' },
  { field: 'required_clothing', label: 'വസ്ത്രം' },
  { field: 'required_direction', label: 'ദിശ' },
  { field: 'required_fasting', label: 'ഉപവാസം' },
  { field: 'warnings', label: 'മുന്നറിയിപ്പ്' },
];

// Step 2 checklist items
const CHECKLIST_ITEMS = [
  { label: 'ശരിയായ ദിവസം', field: 'suitable_weekday' },
  { label: 'ശരിയായ സഅാത്', field: 'suitable_saat' },
  { label: 'ശരിയായ ചന്ദ്ര സ്ഥാനം', field: 'suitable_moon_phase' },
  { label: 'ശരിയായ ഗ്രഹം', field: 'suitable_planet' },
  { label: 'ശുദ്ധി വരുത്തി', field: 'required_purification' },
  { label: 'ധൂപം തയ്യാർ', field: 'required_incense' },
  { label: 'ദിശ ഉറപ്പാക്കി', field: 'required_direction' },
  { label: 'നിയ്യത് നിശ്ചയിച്ചു', field: 'required_intention' },
];

// Step 6 field definitions
const STEP6_FIELDS = [
  { field: 'repetition_count', label: 'ആവർത്തനം' },
  { field: 'after_recitation_rules', label: 'ശേഷം ചെയ്യേണ്ടത്' },
  { field: 'conditions', label: 'വ്യവസ്ഥകൾ' },
  { field: 'exceptions', label: 'നിരോധനങ്ങൾ' },
  { field: 'purpose', label: 'പ്രതീക്ഷിത ഫലം' },
];

// ── Step label ──
function StepLabel({ num, label, color }) {
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <span className="font-inter text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
        style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
        STEP {num}
      </span>
      <span className="font-malayalam text-xs font-bold" style={{ color }}>{label}</span>
      <div className="h-px flex-1" style={{ background: `${color}20` }} />
    </div>
  );
}

// ── Field display: shows instructions with source+page, or "not specified" ──
function FieldDisplay({ label, fieldInstructions }) {
  const hasData = fieldInstructions && fieldInstructions.length > 0;
  return (
    <div className="flex items-start gap-2 py-0.5">
      <span className="font-malayalam text-[11px] flex-shrink-0" style={{ color: "rgba(255,255,255,0.40)", minWidth: "85px" }}>
        {label}:
      </span>
      <div className="flex-1">
        {hasData ? (
          fieldInstructions.map((instr, i) => (
            <div key={i}>
              <span className="font-malayalam text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
                {instr.text}
              </span>
              <span className="font-inter text-[8px] ml-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                📖 {instr.source} p.{instr.page}
              </span>
            </div>
          ))
        ) : (
          <span className="font-malayalam text-[11px] italic" style={{ color: "rgba(255,255,255,0.25)" }}>
            {NOT_SPECIFIED_ANY}
          </span>
        )}
      </div>
    </div>
  );
}

// ── STEP 1: Before You Begin ──
function StepBeforeBegin({ instructions, sources }) {
  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.12)" }}>
      <StepLabel num={1} label="ആരംഭത്തിന് മുമ്പ്" color={G.text} />
      <div className="space-y-0.5">
        {STEP1_FIELDS.map(({ field, label }) => (
          <FieldDisplay key={field} label={label} fieldInstructions={instructions[field]} />
        ))}
      </div>
      <p className="font-inter text-[8px] mt-2" style={{ color: "rgba(255,255,255,0.20)" }}>
        ✓ {sources.length} ഗ്രന്ഥങ്ങൾ പൂർണ്ണമായി തിരയപ്പെട്ടു
      </p>
    </div>
  );
}

// ── STEP 2: Preparation Checklist ──
function StepChecklist({ instructions }) {
  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.12)" }}>
      <StepLabel num={2} label="തയ്യാറാകൽ ചെക്ലിസ്റ്റ്" color="#4ADE80" />
      <div className="grid grid-cols-1 gap-1">
        {CHECKLIST_ITEMS.map((item, i) => {
          const specified = instructions[item.field] && instructions[item.field].length > 0;
          return (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[14px] flex-shrink-0" style={{ color: specified ? "rgba(74,222,128,0.60)" : "rgba(255,255,255,0.20)" }}>□</span>
              <span className="font-malayalam text-[11px]" style={{ color: specified ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.30)" }}>
                {item.label}
              </span>
              {!specified && (
                <span className="font-inter text-[8px] italic" style={{ color: "rgba(255,255,255,0.15)" }}>
                  ({NOT_SPECIFIED_ANY})
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── STEP 5: How to Perform (numbered steps, each instruction separate) ──
function StepHowToPerform({ instructions }) {
  const steps = [
    ...instructions.before_recitation_steps.map(s => ({ ...s, phase: "മുമ്പ്" })),
    ...instructions.during_recitation_rules.map(s => ({ ...s, phase: "സമയം" })),
    ...instructions.after_recitation_rules.map(s => ({ ...s, phase: "ശേഷം" })),
  ];

  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.12)" }}>
      <StepLabel num={5} label="അനുഷ്ഠാന ക്രമം" color="#FBBF24" />
      {steps.length === 0 ? (
        <p className="font-malayalam text-[11px] italic" style={{ color: "rgba(255,255,255,0.25)" }}>
          {NOT_SPECIFIED_ANY}
        </p>
      ) : (
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="font-inter text-[10px] font-bold flex-shrink-0 mt-0.5" style={{ color: "#FBBF24", minWidth: "18px" }}>
                {i + 1}.
              </span>
              <div className="flex-1">
                <span className="font-inter text-[8px] px-1 rounded mr-1" style={{ background: "rgba(251,191,36,0.10)", color: "rgba(251,191,36,0.60)" }}>
                  {step.phase}
                </span>
                <span className="font-malayalam text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
                  {step.text}
                </span>
                <span className="font-inter text-[8px] block" style={{ color: "rgba(255,255,255,0.25)" }}>
                  📖 {step.source} p.{step.page}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── STEP 6: After Completion ──
function StepAfterCompletion({ instructions }) {
  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(96,165,250,0.04)", border: "1px solid rgba(96,165,250,0.12)" }}>
      <StepLabel num={6} label="പൂർത്തിയായ ശേഷം" color="#60A5FA" />
      <div className="space-y-0.5">
        {STEP6_FIELDS.map(({ field, label }) => (
          <FieldDisplay key={field} label={label} fieldInstructions={instructions[field]} />
        ))}
      </div>
    </div>
  );
}

// ── STEP 7: References ──
function StepReferences({ mantra, instructions }) {
  const quranNote = getQuranVerificationNote(mantra.id);
  const refFields = [
    { label: 'ഗ്രന്ഥം', direct: mantra.source?.book_en, isArabic: false },
    { label: 'പേജ്', direct: mantra.source?.page, isArabic: false },
    { label: 'മൂലഗ്രന്ഥം', direct: mantra.source?.book, isArabic: true },
    { label: 'ദിവസം', instr: instructions.suitable_weekday },
    { label: 'സഅാത്', instr: instructions.suitable_saat },
    { label: 'ഗ്രഹം', instr: instructions.suitable_planet },
    { label: 'ചാന്ദ്ര നക്ഷത്രം', instr: instructions.suitable_lunar_mansion },
    { label: 'മലക്', instr: instructions.required_angel },
    { label: 'ജിൻ', instr: instructions.required_jinn },
  ];

  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(129,140,248,0.04)", border: "1px solid rgba(129,140,248,0.12)" }}>
      <StepLabel num={7} label="റഫറൻസുകൾ" color="#818CF8" />
      <div className="grid grid-cols-1 gap-0.5">
        {refFields.map((item, i) => (
          <div key={i} className="flex items-start gap-2 py-0.5">
            <span className="font-malayalam text-[10px] flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)", minWidth: "80px" }}>
              {item.label}
            </span>
            <div className="flex-1">
              {item.direct !== undefined ? (
                item.direct ? (
                  <span className={item.isArabic ? "font-amiri" : "font-inter"} style={{
                    fontSize: item.isArabic ? "12px" : "10px",
                    color: "rgba(255,255,255,0.65)",
                    direction: item.isArabic ? "rtl" : "ltr",
                  }}>
                    {item.direct}
                  </span>
                ) : (
                  <span className="font-malayalam text-[10px] italic" style={{ color: "rgba(255,255,255,0.20)" }}>
                    {NOT_SPECIFIED_ANY}
                  </span>
                )
              ) : item.instr && item.instr.length > 0 ? (
                item.instr.map((instr, j) => (
                  <div key={j}>
                    <span className="font-malayalam text-[10px]" style={{ color: "rgba(255,255,255,0.65)" }}>
                      {instr.text}
                    </span>
                    <span className="font-inter text-[8px] ml-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                      📖 {instr.source} p.{instr.page}
                    </span>
                  </div>
                ))
              ) : (
                <span className="font-malayalam text-[10px] italic" style={{ color: "rgba(255,255,255,0.20)" }}>
                  {NOT_SPECIFIED_ANY}
                </span>
              )}
            </div>
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
function StepRelatedRituals({ instructions }) {
  const relatedInstrs = instructions.related_rituals || [];

  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.12)" }}>
      <StepLabel num={8} label="ബന്ധപ്പെട്ട ആചാരങ്ങൾ" color="#A78BFA" />
      {relatedInstrs.length === 0 ? (
        <p className="font-malayalam text-[10px] italic" style={{ color: "rgba(255,255,255,0.25)" }}>
          {NOT_SPECIFIED_ANY}
        </p>
      ) : (
        <div className="space-y-1.5">
          {relatedInstrs.map((instr, i) => {
            const map = getAllRecitationsMap();
            const r = map[instr.text];
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="font-inter text-[9px] font-bold flex-shrink-0" style={{ color: "#A78BFA" }}>
                  {i + 1}.
                </span>
                <span className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.60)" }}>
                  {r ? `${TYPE_META[r.type]?.label_ml || r.type} — ${r.king_en || r.servant_en || r.purpose_en?.slice(0, 50)}` : instr.text}
                </span>
                <span className="font-inter text-[8px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                  📖 {instr.source} p.{instr.page}
                </span>
              </div>
            );
          })}
          <p className="font-malayalam text-[10px] mt-1" style={{ color: "rgba(167,139,250,0.50)" }}>
            മുകളിൽ പറഞ്ഞ ക്രമത്തിൽ ചൊല്ലേണ്ടതാണ്.
          </p>
        </div>
      )}
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

  // Cross-manuscript search: searches ALL registered manuscripts
  const instructions = getMergedRitualInstructions(mantra.id);
  const sources = getRegisteredSources();

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
              <StepBeforeBegin instructions={instructions} sources={sources} />

              {/* STEP 2 — Preparation Checklist */}
              <StepChecklist instructions={instructions} />

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
              <StepHowToPerform instructions={instructions} />

              {/* STEP 6 — After Completion */}
              <StepAfterCompletion instructions={instructions} />

              {/* STEP 7 — References */}
              <StepReferences mantra={mantra} instructions={instructions} />

              {/* STEP 8 — Related Rituals */}
              <StepRelatedRituals instructions={instructions} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}