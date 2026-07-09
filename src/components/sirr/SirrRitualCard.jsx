// ═══════════════════════════════════════════════════════════════
// SIRR RITUAL CARD — LEVEL 2 INDIVIDUAL RITUAL DISPLAY
// 16-field display in the user's exact specified order.
// Each ritual is independently expandable.
// Manuscript is the only authority — never invent or omit.
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import QuranicArabicText from "@/components/astroclock/QuranicArabicText";
import MalayalamTranslation from "@/components/astroclock/dashboard/MalayalamTranslation";
import { getMergedRitualInstructions } from "@/lib/manuscriptRitualGuideData";
import { WEEKDAY_PLANET_META } from "@/lib/astroClockDailyMantrasData";

const NS = "ഗ്രന്ഥത്തിൽ വ്യക്തമാക്കാത്തത്";

// ── Detect Arabic text for RTL rendering ──
function isArabic(text) {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text || "");
}

// ── Derive concise heading title from heterogeneous data ──
function deriveTitle(item) {
  if (item.title_en) return item.title_en;
  if (item.king_en && item.day_index != null) {
    const d = WEEKDAY_PLANET_META.find((w) => w.day_index === item.day_index);
    if (d) return `${d.day_en} Azimah — ${item.king_en}`;
  }
  if (item.servant_en && item.day_index != null) {
    const d = WEEKDAY_PLANET_META.find((w) => w.day_index === item.day_index);
    if (d) return `${d.day_en} Qasam — ${item.servant_en}`;
  }
  if (item.purpose_en) {
    const first = item.purpose_en.split(".")[0].trim();
    return first.length > 70 ? first.slice(0, 67) + "…" : first;
  }
  return item.id || "—";
}

// ── Extract joined text from merged instruction arrays ──
function instrText(arr) {
  if (!arr || arr.length === 0) return null;
  return arr.map((a) => a.text).join(" ");
}

// ── Normalized text display (Arabic RTL / Malayalam LTR) ──
function T({ text, className = "" }) {
  if (!text) return null;
  const ar = isArabic(text);
  return (
    <span
      className={`${ar ? "font-amiri" : "font-malayalam"} ${className}`}
      style={ar ? { direction: "rtl", textAlign: "right", display: "block" } : {}}
    >
      {text}
    </span>
  );
}

// ── Single field row ──
function Field({ icon, label, children, accent }) {
  return (
    <div className="flex items-start gap-2 py-1">
      <span className="text-[10px] flex-shrink-0 mt-0.5" style={{ color: `${accent}88` }}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-malayalam text-[10px] font-bold mb-0.5" style={{ color: `${accent}aa` }}>
          {label}
        </div>
        <div className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function NSpan() {
  return (
    <span className="font-malayalam italic" style={{ color: "rgba(255,255,255,0.25)" }}>
      {NS}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function SirrRitualCard({ item, accent = "#D4AF37", defaultExpanded = false }) {
  const [open, setOpen] = useState(defaultExpanded);

  const instr = getMergedRitualInstructions(item.id) || {};
  const dayMeta =
    item.day_index != null
      ? WEEKDAY_PLANET_META.find((w) => w.day_index === item.day_index)
      : null;

  // ── Normalize all 16 fields ──
  const purpose = item.purpose_ml || item.purpose_en || instrText(instr.purpose);
  const introduction = instrText(instr.introduction);
  const conditions =
    item.prerequisites ||
    [instrText(instr.conditions), instrText(instr.required_purification)]
      .filter(Boolean)
      .join(" ") ||
    null;
  const materials =
    item.materials ||
    (item.ingredients ? item.ingredients.join("\n") : null) ||
    instrText(instr.required_materials);
  const preparation = item.preparation;
  const timing = item.timing || instrText(instr.when_to_perform);
  const weekday = dayMeta ? dayMeta.day_ml : instrText(instr.suitable_weekday);
  const planet = dayMeta ? dayMeta.planet_ml : instrText(instr.suitable_planet);
  const angel = dayMeta ? dayMeta.angel_ml : null;
  const jinn = item.king_en || item.servant_en || (dayMeta ? dayMeta.king_en : null);
  const arabicText = item.arabic_text;

  // Procedure: raw array → merged steps
  let procedureSteps = item.procedure_steps || item.usage || item.how_to_use;
  if (!procedureSteps) {
    const merged = [
      ...(instr.before_recitation_steps || []),
      ...(instr.during_recitation_rules || []),
      ...(instr.after_recitation_rules || []),
    ];
    procedureSteps = merged.length > 0 ? merged.map((m) => m.text) : null;
  }
  const procedureArr = procedureSteps
    ? (Array.isArray(procedureSteps) ? procedureSteps : [procedureSteps])
    : null;

  const repetition = item.repetition || instrText(instr.repetition_count);
  const warnings = item.warnings || item.warning || instrText(instr.warnings);
  const source = item.source;

  const title = deriveTitle(item);
  const titleAr = item.title_ar || (dayMeta ? dayMeta.king_ar : null);

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: "rgba(8,16,38,0.60)", border: `1px solid ${accent}22` }}
    >
      {/* ── Level 2 Heading ── */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 p-2.5 text-left"
        style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
      >
        {titleAr && (
          <span
            className="font-amiri text-sm flex-shrink-0 truncate"
            style={{ color: accent, direction: "rtl", maxWidth: "90px" }}
          >
            {titleAr.length > 15 ? titleAr.slice(0, 13) + "…" : titleAr}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <span
            className="font-inter text-[11px] font-bold block truncate"
            style={{ color: accent }}
          >
            {title}
          </span>
        </div>
        <ChevronDown
          className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200"
          style={{ color: accent, transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>

      {/* ── Expanded: 16 fields in user's exact order ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 space-y-0.5">
              {/* 1. Purpose */}
              <Field icon="◎" label="ഉദ്ദേശം" accent={accent}>
                <T text={purpose} /> {!purpose && <NSpan />}
              </Field>

              {/* 2. Introduction */}
              <Field icon="✦" label="ആമുഖം" accent={accent}>
                {introduction ? <T text={introduction} /> : <NSpan />}
              </Field>

              {/* 3. Conditions */}
              <Field icon="⚖" label="വ്യവസ്ഥകൾ" accent={accent}>
                {conditions ? (
                  <T text={conditions} className="whitespace-pre-line" />
                ) : (
                  <NSpan />
                )}
              </Field>

              {/* 4. Required materials */}
              <Field icon="🌿" label="ആവശ്യ സാധനങ്ങൾ" accent={accent}>
                {materials ? (
                  <T text={materials} className="whitespace-pre-line" />
                ) : (
                  <NSpan />
                )}
              </Field>

              {/* 5. Preparation */}
              <Field icon="🔧" label="തയ്യാറാകൽ" accent={accent}>
                {preparation ? <T text={preparation} /> : <NSpan />}
              </Field>

              {/* 6. Timing */}
              <Field icon="⏰" label="സമയം" accent={accent}>
                {timing ? <T text={timing} /> : <NSpan />}
              </Field>

              {/* 7. Related weekday */}
              <Field icon="📅" label="ദിവസം" accent={accent}>
                {weekday ? <T text={weekday} /> : <NSpan />}
              </Field>

              {/* 8. Related planet */}
              <Field icon="🪐" label="ഗ്രഹം" accent={accent}>
                {planet ? <T text={planet} /> : <NSpan />}
              </Field>

              {/* 9. Related angel */}
              <Field icon="😇" label="മലക്" accent={accent}>
                {angel ? <T text={angel} /> : <NSpan />}
              </Field>

              {/* 10. Related jinn — ONLY if explicitly stated */}
              {jinn && (
                <Field icon="👻" label="ജ്ഞം" accent={accent}>
                  <T text={jinn} />
                </Field>
              )}

              {/* 11. Arabic text — beautiful traditional script with Harakat */}
              <Field icon="ع" label="അറബി പാഠം" accent={accent}>
                {arabicText ? (
                  <QuranicArabicText text={arabicText} size="md" color={accent} />
                ) : (
                  <NSpan />
                )}
              </Field>

              {/* 12. Malayalam meaning */}
              <Field icon="📝" label="മലയാള പരിഭാഷ" accent={accent}>
                {arabicText ? <MalayalamTranslation mantra={item} /> : <NSpan />}
              </Field>

              {/* 13. Step-by-step procedure */}
              <Field icon="📋" label="അനുഷ്ഠാന ക്രമം" accent={accent}>
                {procedureArr ? (
                  <div className="space-y-1.5 pt-1">
                    {procedureArr.map((step, i) => (
                      <div key={i} className="flex gap-2">
                        <span
                          className="font-inter text-[9px] font-bold flex-shrink-0 mt-0.5"
                          style={{ color: accent, minWidth: "16px" }}
                        >
                          {i + 1}.
                        </span>
                        <T text={typeof step === "string" ? step : step.text} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <NSpan />
                )}
              </Field>

              {/* 14. Repetition count */}
              <Field icon="🔢" label="ആവർത്തനം" accent={accent}>
                {repetition ? <T text={repetition} /> : <NSpan />}
              </Field>

              {/* 15. Warnings */}
              <Field icon="⚠" label="മുന്നറിയിപ്പുകൾ" accent={accent}>
                {warnings ? <T text={warnings} className="whitespace-pre-line" /> : <NSpan />}
              </Field>

              {/* 16. Manuscript reference */}
              <Field icon="📖" label="മൂലഗ്രന്ഥം" accent={accent}>
                {source ? (
                  <div className="space-y-0.5">
                    <div className="flex gap-2">
                      <span
                        className="font-inter text-[9px] flex-shrink-0"
                        style={{ color: "rgba(255,255,255,0.35)", minWidth: "45px" }}
                      >
                        Book:
                      </span>
                      <span
                        className="font-inter text-[10px]"
                        style={{ color: "rgba(255,255,255,0.65)" }}
                      >
                        {source.book_en || source.book}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className="font-inter text-[9px] flex-shrink-0"
                        style={{ color: "rgba(255,255,255,0.35)", minWidth: "45px" }}
                      >
                        Page:
                      </span>
                      <span
                        className="font-inter text-[10px]"
                        style={{ color: "rgba(255,255,255,0.65)" }}
                      >
                        {source.page}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className="font-inter text-[9px] flex-shrink-0"
                        style={{ color: "rgba(255,255,255,0.35)", minWidth: "45px" }}
                      >
                        Source:
                      </span>
                      <span
                        className="font-amiri text-[12px]"
                        style={{ color: "rgba(255,255,255,0.65)", direction: "rtl" }}
                      >
                        {source.book}
                      </span>
                    </div>
                  </div>
                ) : (
                  <NSpan />
                )}
              </Field>

              {/* Scholar attribution (if available) */}
              {item.scholar && (
                <div className="pt-1.5 mt-1" style={{ borderTop: `1px solid ${accent}15` }}>
                  <span className="font-inter text-[9px]" style={{ color: `${accent}66` }}>
                    ✦ Scholar:{" "}
                    <span className="font-amiri text-[11px]" style={{ direction: "rtl" }}>
                      {item.scholar}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}