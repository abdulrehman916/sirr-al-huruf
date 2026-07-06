// ═══════════════════════════════════════════════════════════════
// RITUAL SEMANTIC PHRASE — Display-only purpose resolver
// ═══════════════════════════════════════════════════════════════
// Builds the complete ritual purpose phrase (ആചാര ലക്ഷ്യം) from:
//   1. Action   — fixed words: جلب / طرد / الصحة / السقم
//   2. Purpose  — middle word, resolved via Purpose Dictionary
//   3. Ending   — fixed: طرفة العين ("instantly / quickly")
//
// ISOLATED — display-only. Does NOT modify any Mizan calculation,
// Bast, Ebced, Method, engine, timing, Khayr/Sharr, or workflow.
// Reads Mizan state from PageStateContext and calls the existing
// lookupPurposeIntent (the only authorized PurposeDictionary reader).
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { usePageState } from "../context/PageStateContext";
import { lookupPurposeIntent } from "./purposeDictionaryLookup";

const MIZAAN_PAGE_KEY = "mizaan9";

// ── Fixed Action words → meanings (manuscript) ──
const ACTION_MEANINGS = {
  "جلب":   { en: "Bring",      ml: "കൊണ്ടുവാ" },
  "طرد":   { en: "Repel",      ml: "തുരത്തുക" },
  "الصحة": { en: "Improve",    ml: "മെച്ചപ്പെടുത്തുക" },
  "السقم": { en: "Cause harm", ml: "ദോഷം വരുത്തുക" },
};

// Purpose card key → Action Arabic word (the card IS the Action)
const CARD_TO_ACTION = {
  celb: "جلب",
  tard: "طرد",
  sihhat: "الصحة",
  sekam: "السقم",
};

// ── Common Ending (fixed, always appended) ──
const ENDING_MEANING = { en: "quickly", ml: "വേഗം" };

// Normalize Arabic: strip harakat + tatweel
function normalizeArabic(text) {
  return String(text || "")
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, "")
    .replace(/\u0640/g, "")
    .trim();
}

// Detect action word from raw text (first matching word)
function detectAction(text) {
  const norm = normalizeArabic(text);
  if (!norm) return null;
  const words = norm.split(/\s+/);
  if (ACTION_MEANINGS[words[0]]) return words[0];
  for (const w of words) {
    if (ACTION_MEANINGS[w]) return w;
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════
// PURE BUILDER — returns the complete semantic phrase
// ═══════════════════════════════════════════════════════════════
// en order: Action + Purpose + Ending   → "Bring love quickly"
// ml order: Purpose + Ending + Action   → "സ്നേഹം വേഗം കൊണ്ടുവാ"
export function buildRitualSemanticPhrase({ selections, customPurpose, purposeLookup, lang }) {
  const custom = (customPurpose || "").trim();
  if (!custom) return "";

  // 1. Action — from selected card, else detect from text
  let actionArabic = null;
  const cardKey = Array.isArray(selections?.purposes) && selections.purposes.length > 0
    ? selections.purposes[0] : null;
  if (cardKey && CARD_TO_ACTION[cardKey]) actionArabic = CARD_TO_ACTION[cardKey];
  if (!actionArabic) actionArabic = detectAction(custom);

  // 2. Purpose meaning — from dictionary lookup
  let purposeMeaning = "";
  if (purposeLookup?.matched) {
    purposeMeaning = lang === "ml"
      ? (purposeLookup.malayalam_meaning || purposeLookup.english_meaning || "")
      : (purposeLookup.english_meaning || purposeLookup.malayalam_meaning || "");
  }

  // 3. Ending (always)
  const endingMeaning = lang === "ml" ? ENDING_MEANING.ml : ENDING_MEANING.en;

  // Build complete phrase
  if (actionArabic && purposeMeaning) {
    const actionMeaning = lang === "ml"
      ? ACTION_MEANINGS[actionArabic].ml
      : ACTION_MEANINGS[actionArabic].en;
    return lang === "ml"
      ? `${purposeMeaning} ${endingMeaning} ${actionMeaning}`
      : `${actionMeaning} ${purposeMeaning} ${endingMeaning}`;
  }
  // Partial: purpose matched but no action detected
  if (purposeMeaning) {
    return `${purposeMeaning} ${endingMeaning}`;
  }
  // No dictionary match — no semantic phrase
  return "";
}

// ═══════════════════════════════════════════════════════════════
// REACT HOOK — reads Mizan state from PageStateContext + dictionary
// ═══════════════════════════════════════════════════════════════
export function useRitualSemanticPhrase(lang) {
  const { getPageState } = usePageState();
  const [phrase, setPhrase] = useState("");

  const state = getPageState(MIZAAN_PAGE_KEY, { selections: {}, customPurpose: "" });
  const selections = state.selections || {};
  const customPurpose = state.customPurpose || "";

  useEffect(() => {
    const custom = (customPurpose || "").trim();
    if (!custom) { setPhrase(""); return; }
    let cancelled = false;
    lookupPurposeIntent(customPurpose, selections?.purposes?.[0]).then((res) => {
      if (!cancelled) {
        setPhrase(buildRitualSemanticPhrase({ selections, customPurpose, purposeLookup: res, lang }));
      }
    });
    return () => { cancelled = true; };
  }, [customPurpose, selections, lang]);

  return phrase;
}