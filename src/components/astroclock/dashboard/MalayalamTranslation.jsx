// ═══════════════════════════════════════════════════════════════
// MALAYALAM TRANSLATION — ON-DEMAND WITH CACHING
// Displays Malayalam translation of Arabic recitation text.
// If meaning_ml exists in data → display directly.
// If not → generate via InvokeLLM → cache in localStorage.
// Original Arabic text is NEVER modified — translation layer only.
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";

const CACHE_PREFIX = "sirr_ml_translation_";

function getCached(arabicText) {
  try {
    const key = CACHE_PREFIX + arabicText.slice(0, 50);
    return localStorage.getItem(key);
  } catch { return null; }
}

function setCached(arabicText, translation) {
  try {
    const key = CACHE_PREFIX + arabicText.slice(0, 50);
    localStorage.setItem(key, translation);
  } catch { /* ignore */ }
}

export default function MalayalamTranslation({ mantra }) {
  const [translation, setTranslation] = useState(mantra.meaning_ml || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If data already has meaning_ml → use it
    if (mantra.meaning_ml) {
      setTranslation(mantra.meaning_ml);
      return;
    }
    if (!mantra.arabic_text) return;

    // Check localStorage cache
    const cached = getCached(mantra.arabic_text);
    if (cached) {
      setTranslation(cached);
      return;
    }

    // Generate via LLM
    let cancelled = false;
    setLoading(true);

    const prompt = [
      "Translate the following Arabic recitation text into natural Malayalam (Malayalam script).",
      "STRICT RULES:",
      "1. For magical names, divine names, angelic names, and non-Arabic vocabulary (e.g. اهياتاه, خنوخ, طهش, سمسميائيل), keep them in Arabic script within the Malayalam text.",
      "2. For Arabic sentences and Quran verses, provide accurate Malayalam translations preserving the exact meaning.",
      "3. Do NOT paraphrase or simplify.",
      "4. Return ONLY the Malayalam translation text — no explanations, no transliterations.",
      "",
      "Arabic text to translate:",
      mantra.arabic_text,
    ].join("\n");

    base44.integrations.Core.InvokeLLM({ prompt })
      .then((res) => {
        if (cancelled) return;
        const text = typeof res === "string" ? res : (res?.data || res || "");
        const cleaned = String(text).replace(/^["'\u201c\u201d]+|["'\u201c\u201d]+$/g, "").trim();
        if (cleaned) {
          setCached(mantra.arabic_text, cleaned);
          setTranslation(cleaned);
        }
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [mantra.id, mantra.arabic_text, mantra.meaning_ml]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-2">
        <Loader2 className="w-3 h-3 animate-spin" style={{ color: "rgba(74,222,128,0.60)" }} />
        <span className="font-inter text-[9px]" style={{ color: "rgba(74,222,128,0.50)" }}>
          മലയാള പരിഭാഷ തയ്യാറാക്കുന്നു…
        </span>
      </div>
    );
  }

  if (!translation) return null;

  return (
    <div className="rounded-lg p-3" style={{
      background: "rgba(74,222,128,0.04)",
      border: "1px solid rgba(74,222,128,0.15)",
    }}>
      <p className="font-malayalam text-sm leading-relaxed" style={{
        color: "rgba(255,255,255,0.80)",
        direction: "ltr",
        textAlign: "left",
        lineHeight: "1.8",
      }}>
        {translation}
      </p>
    </div>
  );
}