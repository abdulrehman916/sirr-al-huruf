// ═══════════════════════════════════════════════════════════════
// QURANIC ARABIC TEXT — PREMIUM DISPLAY COMPONENT
// ═══════════════════════════════════════════════════════════════
// Displays Arabic text in a clean, Quran-style layout with:
//   - Amiri font (best for Harakat & Qur'anic marks)
//   - Increased line height & word spacing for readability
//   - RTL with justification
//   - AI-powered Harakat enhancement (display layer only)
//   - localStorage caching (each text processed once per device)
//   - Original manuscript text NEVER modified — only display
//
// REUSABLE: Can be used by any page/component that displays Arabic.
//   Usage: <QuranicArabicText text={arabicString} size="md" />
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import {
  hasSufficientHarakat,
  getCachedHarakat,
  setCachedHarakat,
} from "@/lib/arabicHarakatUtils";
import { Loader2 } from "lucide-react";

const SIZE_MAP = {
  sm: { fontSize: "clamp(1.1rem, 3vw, 1.35rem)", lineHeight: "2.6" },
  md: { fontSize: "clamp(1.25rem, 3.5vw, 1.6rem)", lineHeight: "2.8" },
  lg: { fontSize: "clamp(1.6rem, 4.5vw, 2rem)", lineHeight: "3.0" },
};

export default function QuranicArabicText({
  text,
  size = "md",
  color = "#D4AF37",
}) {
  const [displayText, setDisplayText] = useState(text);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!text) return;

    // 1. If the text already has sufficient Harakat → display as-is
    if (hasSufficientHarakat(text)) {
      setDisplayText(text);
      return;
    }

    // 2. Check localStorage cache
    const cached = getCachedHarakat(text);
    if (cached) {
      setDisplayText(cached);
      return;
    }

    // 3. Generate Harakat via AI (display layer only)
    let cancelled = false;
    setLoading(true);

    const prompt = [
      "You are an expert in Arabic linguistics, Quranic tajweed, and tashkeel (Harakat).",
      "Add the correct Harakat (tashkeel/diacritics) to the following Arabic text.",
      "",
      "STRICT RULES:",
      "1. PRESERVE every single letter — do NOT add, remove, reorder, or change any word.",
      "2. Only add Harakat marks: fatha (َ), kasra (ِ), damma (ُ), sukun (ْ), shadda (ّ), tanwin (ً ٍ ٌ).",
      "3. If a letter already has Harakat, verify it is correct and keep it.",
      "4. Check for common Harakat mistakes (e.g., confusing fatha/kasra on hamza, wrong sukun placement).",
      "5. Apply correct i'rab (grammatical ending vowels) based on the sentence structure.",
      "6. Return ONLY the fully voweled Arabic text — no explanation, no transliteration, no English.",
      "",
      "Arabic text to vowel:",
      text,
    ].join("\n");

    base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          voweled_text: { type: "string" },
        },
        required: ["voweled_text"],
      },
    })
      .then((res) => {
        if (cancelled) return;
        const voweled = res?.voweled_text || res?.data?.voweled_text || text;
        // Strip surrounding quotes if the LLM added them
        const cleaned = voweled.replace(/^["'\u201c\u201d]+|["'\u201c\u201d]+$/g, "").trim();
        if (cleaned && cleaned !== text) {
          setCachedHarakat(text, cleaned);
          setDisplayText(cleaned);
        } else {
          setDisplayText(text);
        }
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        // Fallback: display original text without Harakat
        setDisplayText(text);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [text]);

  const sizeStyle = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div
      className="relative rounded-lg p-3"
      style={{
        background: "rgba(212,175,55,0.06)",
        border: "1px solid rgba(212,175,55,0.20)",
      }}
    >
      <p
        className="font-quranic-harakat"
        style={{
          fontSize: sizeStyle.fontSize,
          lineHeight: sizeStyle.lineHeight,
          color,
          direction: "rtl",
          textAlign: "justify",
          textAlignLast: "right",
          padding: 0,
          margin: 0,
          textShadow: `0 0 24px ${color}30`,
        }}
      >
        {displayText}
      </p>
      {loading && (
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <Loader2
            className="w-3 h-3 animate-spin"
            style={{ color: "rgba(212,175,55,0.50)" }}
          />
          <span
            className="font-inter text-[8px]"
            style={{ color: "rgba(212,175,55,0.50)" }}
          >
            Harakat…
          </span>
        </div>
      )}
    </div>
  );
}