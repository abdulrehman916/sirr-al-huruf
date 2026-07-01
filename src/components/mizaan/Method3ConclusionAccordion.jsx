// ═══════════════════════════════════════════════════════════════
// CONCLUSION — Method 3 only. Display-only accordion, no calculations.
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";

const STEPS = [
  "Prepare the Wafq exactly as generated.",
  "Write all three sections in their proper places: Esma-i Kitabet, Esma-i A'van, Esma-i Kasem.",
  "Around the Wafq, write every required letter exactly in its assigned position.",
  "Place every element in its correct elemental location — Fire letters → Fire position, Water letters → Water position, Air letters → Air position, Earth letters → Earth position.",
  "Do NOT recite the Kitabet, A'van or Kasem names.",
  "Recite ONLY the final Divine Names selected by Method 3.",
  "Recite them according to their own Abjad value each day.",
  "Continue this for seven (7) consecutive days.",
  "If the intention is more important or requires a longer practice, increase only the number of days (for example 11 days or more).",
  "Never increase the recitation count based on the number of days. The Abjad recitation count remains unchanged — only the duration (days) may increase according to the seriousness of the intention.",
];

export default function Method3ConclusionAccordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{
        background: "rgba(3,6,20,0.99)",
        borderColor: "rgba(212,175,55,0.60)",
        boxShadow: "0 0 80px rgba(212,175,55,0.14), 0 0 160px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.08)",
      }}>
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.60) 40%, rgba(245,208,96,0.53) 50%, rgba(212,175,55,0.60) 60%, transparent 95%)" }} />

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-6 py-5"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📖</span>
          <span className="font-inter text-[10px] uppercase tracking-[0.25em] font-bold" style={{ color: "#F5D060" }}>
            Conclusion — Practical Application
          </span>
        </div>
        {isOpen
          ? <ChevronDown className="w-4 h-4" style={{ color: "#F5D060" }} />
          : <ChevronRight className="w-4 h-4" style={{ color: "#F5D060" }} />}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-6 pb-5 space-y-3">
              {STEPS.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="font-inter text-[13px] font-bold flex-shrink-0" style={{ color: "#F5D060" }}>
                    {i + 1}.
                  </span>
                  <p className="font-inter text-[13px] leading-relaxed" style={{ color: "rgba(245,208,96,0.55)", lineHeight: 1.9 }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.60) 40%, rgba(245,208,96,0.53) 50%, rgba(212,175,55,0.60) 60%, transparent 95%)" }} />
    </div>
  );
}