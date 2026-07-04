/**
 * QasamPanel — Read-only Recommended Qasam / Recitation panel
 * Source: Sirr al-Huruf PDF (pages 27–31)
 * Placed below the Timing / RitualDecisionEngine section on the Mizan page.
 * This component ONLY displays content. It never modifies calculations.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, Scroll } from "lucide-react";
import { getQasamForDay, GENERAL_POST_QASAM_DUA } from "@/lib/qasamData";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

export default function QasamPanel({ selections }) {
  const [expanded, setExpanded] = useState(false);
  const [showDua, setShowDua] = useState(false);

  const dayValue = selections?.days ?? selections?.day ?? null;
  const entry = getQasamForDay(dayValue);

  return (
    <div className="mt-4">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
          border: `1px solid ${G.border}`,
          boxShadow: "0 4px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.07)",
        }}
      >
        {/* ── Header ── */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4"
          style={{ borderBottom: expanded ? `1px solid ${G.border}` : "none" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.06) 100%)",
                border: `1px solid ${G.borderHi}`,
                boxShadow: "0 0 18px rgba(212,175,55,0.15)",
              }}
            >
              <Scroll className="w-5 h-5" style={{ color: G.text }} />
            </div>
            <div className="text-left">
              <h3 className="font-inter text-base font-bold tracking-wide text-white">
                Recommended Qasam / Recitation
              </h3>
              <p className="font-amiri text-sm" style={{ color: G.dim }}>
                القسم والعزيمة الموصى به
              </p>
            </div>
          </div>
          <ChevronDown
            className="w-4 h-4 transition-transform flex-shrink-0"
            style={{ color: G.dim, transform: expanded ? "rotate(180deg)" : "none" }}
          />
        </button>

        {/* ── Body ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">

                {/* Source notice */}
                <div
                  className="flex items-start gap-2 rounded-xl p-3"
                  style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.18)" }}
                >
                  <BookOpen className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "rgba(74,222,128,0.65)" }} />
                  <p className="font-inter text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                    Source: Sirr al-Huruf PDF, pp. 27–31. Displayed verbatim — no translation, summarizing, or alteration. Read-only reference panel.
                  </p>
                </div>

                {!entry ? (
                  <div
                    className="rounded-xl p-5 text-center"
                    style={{ background: G.bg, border: `1px solid ${G.border}` }}
                  >
                    <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                      No specific Qasam or Recitation is provided in the source book for this selection.
                    </p>
                    <p className="font-inter text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                      Select a Day in the Mizan inputs above to display the corresponding Qasam.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">

                    {/* Day badge */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className="font-amiri text-base font-bold px-4 py-1.5 rounded-full"
                        style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}
                      >
                        {entry.dayName}
                      </span>
                      <span className="font-inter text-xs" style={{ color: G.dim }}>
                        خادم اليوم: <span className="font-amiri font-bold" style={{ color: G.text }}>{entry.king}</span>
                      </span>
                    </div>

                    {/* Rule note from PDF p.26 */}
                    <div
                      className="rounded-xl p-3"
                      style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.20)" }}
                    >
                      <p className="font-inter text-[11px]" style={{ color: "rgba(251,191,36,0.80)" }}>
                        📖 PDF Rule (p. 26): Each king must be called only on his own designated day and during his planet's hour.
                      </p>
                    </div>

                    {/* ── Form 1: Da'wa ── */}
                    <Section
                      label="الدعوة (Form 1 — Longer Invocation)"
                      labelMl="ദഅ്‌വ — ദൈർഘ്യമേറിയ ആഹ്വാന രൂപം"
                      arabic={entry.da3wa.arabic}
                      malayalam={entry.da3wa.malayalam}
                      sourcePage="pp. 27–29"
                    />

                    {/* ── Form 2: Qasam (Omani scholar refined form) ── */}
                    <Section
                      label="القسم (Form 2 — Omani Scholar Refined Form)"
                      labelMl="ഖസം — ഒമാനി പണ്ഡിത-ശൈലി ശുദ്ധ രൂപം"
                      arabic={entry.qasam.arabic}
                      malayalam={entry.qasam.malayalam}
                      sourcePage="pp. 29–31"
                      highlight
                    />

                    {/* PDF note from p.29: The refined form unites the verse, king, servants, letters and names */}
                    <div
                      className="rounded-xl p-3"
                      style={{ background: G.bg, border: `1px solid ${G.border}` }}
                    >
                      <p className="font-amiri text-sm text-right leading-loose" style={{ color: "rgba(255,255,255,0.65)" }}>
                        وَذَكَرَ هَذِهِ الأَقسَامَ أَحَدُ المَشَايِخِ العُمَانِيِّينَ رَحِمَهُ اللهُ تَعَالَى بِصِيغَةٍ أُخرَى وَهِيَ أَدَقُّ وَأَفضَلُ لِأَنَّهَا تَجمَعُ (الآيَةَ وَالمَلِكَ وَالخُدَّامَ المُوَكَّلِينَ وَالأَحرُفَ وَالأَسمَاءَ)
                      </p>
                      <p className="font-inter text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                        Source: PDF p. 29 — The Omani scholars' refined form is more precise and preferred as it unites the verse, the king, the assigned servants, letters, and names.
                      </p>
                    </div>

                    {/* ── General Post-Qasam Du'a ── */}
                    <div>
                      <button
                        onClick={() => setShowDua(!showDua)}
                        className="w-full flex items-center justify-between rounded-xl px-4 py-3 mb-2"
                        style={{ background: G.bg, border: `1px solid ${G.border}` }}
                      >
                        <span className="font-inter text-xs font-bold uppercase tracking-widest" style={{ color: G.text }}>
                          الدعاء العام بعد القسم — General Post-Qasam Du'a (p. 31)
                        </span>
                        <ChevronDown
                          className="w-4 h-4 transition-transform flex-shrink-0"
                          style={{ color: G.dim, transform: showDua ? "rotate(180deg)" : "none" }}
                        />
                      </button>
                      <AnimatePresence>
                        {showDua && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <Section
                              label=""
                              labelMl=""
                              arabic={GENERAL_POST_QASAM_DUA.arabic}
                              malayalam={GENERAL_POST_QASAM_DUA.malayalam}
                              sourcePage="p. 31"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Incense instruction from PDF p.31 */}
                    <div
                      className="rounded-xl p-3"
                      style={{ background: "rgba(212,175,55,0.04)", border: `1px solid ${G.border}` }}
                    >
                      <p className="font-inter text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
                        📌 <span className="font-bold" style={{ color: G.text }}>PDF Instruction (p. 31):</span> After the required Qasam for the requested day, use the incense of that day while reading or writing the Azima. Read the Azima upon all works after the Qasam.
                      </p>
                    </div>

                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Section({ label, labelMl, arabic, malayalam, sourcePage, highlight }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: highlight
          ? "linear-gradient(145deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.03) 100%)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${highlight ? G.borderHi : G.border}`,
        boxShadow: highlight ? "0 0 20px rgba(212,175,55,0.10)" : "none",
      }}
    >
      {label && (
        <div
          className="px-4 py-2.5 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${G.border}` }}
        >
          <div>
            <p className="font-inter text-[11px] font-bold uppercase tracking-wider" style={{ color: G.text }}>
              {label}
            </p>
            {labelMl && (
              <p className="font-inter text-[10px] mt-0.5" style={{ color: G.dim }}>
                {labelMl}
              </p>
            )}
          </div>
          {sourcePage && (
            <span
              className="font-inter text-[9px] px-2 py-0.5 rounded"
              style={{ background: G.bgHi, color: G.dim, border: `1px solid ${G.border}` }}
            >
              {sourcePage}
            </span>
          )}
        </div>
      )}
      <div className="p-4 space-y-3">
        {/* Arabic — verbatim from PDF, right-to-left, Amiri font */}
        <div
          className="rounded-lg p-4"
          style={{ background: "rgba(8,16,38,0.80)", border: `1px solid ${G.border}` }}
          dir="rtl"
        >
          <p
            className="font-amiri leading-loose text-right"
            style={{
              color: "#F5E6B0",
              fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)",
              lineHeight: "2.4",
              letterSpacing: "0.04em",
              wordSpacing: "0.12em",
              fontWeight: 600,
              fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1, "ss01" 1, "mkmk" 1, "mark" 1',
            }}
          >
            {arabic}
          </p>
        </div>
        {/* Malayalam explanation */}
        {malayalam && (
          <div
            className="rounded-lg p-3"
            style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.15)" }}
          >
            <p
              className="font-inter text-xs leading-relaxed"
              style={{ color: "rgba(255,255,255,0.60)" }}
            >
              {malayalam}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}