// ═══════════════════════════════════════════════════════════════
// SIRR TURKISH GUARD — GLOBAL LANGUAGE RULE ENFORCEMENT
// ═══════════════════════════════════════════════════════════════
// Enforces the SIRR page language rule:
//   - Book titles/references: remain in original language (TR/AR/EN)
//   - All user-visible content: follows selected UI language (ML/EN/AR)
//   - Turkish NEVER appears in content fields
//   - Arabic manuscripts, talismans, harakat, Quranic text: untouched
// ═══════════════════════════════════════════════════════════════

// Turkish-specific characters (not found in English, Malayalam, or Arabic)
const TURKISH_CHARS = /[çşğğıİöüÇŞĞĞ]/;

// Common Turkish words — 2+ matches indicates Turkish text
const TURKISH_WORDS = [
  've', 'ile', 'bir', 'bu', 'şu', 'için', 'gibi', 'kadar', 'ancak',
  'veya', 'sonra', 'önce', 'değil', 'vardır', 'yoktur', 'olarak',
  'üzere', 'rağmen', 'dolayı', 'nedeniyle', 'tarafından', 'maksadıyla',
  'gayesiyle', 'amacıyla', 'cihetle', 'itibaren', 'bahisle', 'dair',
  'edilir', 'yapılır', 'alınır', 'yazılır', 'okunur', 'söylenir',
  'denenmiştir', 'bildirilmiştir', 'belirtilmiştir', 'anlatılmıştır',
  'açıklanmıştır', 'nakledilmiştir', 'rivayet', 'methal', 'beyan'
];

// Check if text contains Turkish
// RULE: Turkish chars alone (ç,ş,ğ,ı,İ,ö,ü) do NOT trigger detection —
// they may come from proper names (Bülent Kısa, Kitabül Cilve, Mücerrebat, hüddam).
// Only actual Turkish FUNCTION WORDS trigger detection.
export function hasTurkish(text) {
  if (!text || typeof text !== 'string') return false;
  const t = text.trim();
  if (t.length === 0) return false;

  const lowerT = t.toLowerCase();

  // Count Turkish function word matches
  let turkishWordCount = 0;
  for (const word of TURKISH_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(lowerT)) {
      turkishWordCount++;
      if (turkishWordCount >= 2) return true; // 2+ Turkish function words = definitely Turkish
    }
  }

  // 1 Turkish function word = likely Turkish (even if mixed with English)
  if (turkishWordCount >= 1) return true;

  // 0 Turkish function words = NOT Turkish
  // (Turkish chars from proper names, spiritual terms, manuscript references are OK)
  return false;
}

// Book reference fields — NEVER filtered, always shown in original language
const BOOK_REFERENCE_FIELDS = new Set([
  'book_title', 'book_title_ar', 'book_name', 'book_name_ar',
  'source_scholar', 'author', 'edition', 'publication_year'
]);

export function isBookReferenceField(fieldName) {
  return BOOK_REFERENCE_FIELDS.has(fieldName);
}

// Arabic text fields — NEVER filtered, always shown as-is
const ARABIC_TEXT_FIELDS = new Set([
  'arabic_text', 'verified_arabic', 'topic_ar', 'book_title_ar', 'book_name_ar'
]);

// Malayalam Unicode range checker
const MALAYALAM_RANGE = /[\u0D00-\u0D7F]/;

// ═══════════════════════════════════════════════════════════════
// getLanguageContent — returns the correct language value for a field
// ═══════════════════════════════════════════════════════════════
// Returns: string (the value) or null (show "Not specified")
//
// Priority for Malayalam (ml):
//   1. method[field_ml]           — dedicated _ml field (topic_ml, purpose_ml)
//   2. method.content_translations_ml[field]  — JSON translations for fields without _ml
//   3. method[field]              — if already Malayalam (not Turkish)
//
// Priority for English (en):
//   1. method[field]              — if not Turkish
//   2. method[field_en]           — fallback _en variant
//
// Priority for Arabic (ar):
//   1. method[field_ar]           — dedicated _ar field
//   2. method.arabic_text         — for the arabic_text field
// ═══════════════════════════════════════════════════════════════
export function getLanguageContent(method, field, language) {
  if (!method) return null;

  // Book reference fields: always return as-is (original language preserved)
  if (isBookReferenceField(field)) {
    return method[field] || null;
  }

  // Arabic text fields: always return as-is (never filtered)
  if (ARABIC_TEXT_FIELDS.has(field)) {
    return method[field] || null;
  }

  const isMl = language === 'ml';
  const isAr = language === 'ar';

  // ── Malayalam mode: 100% Malayalam, no English, no Turkish ──
  if (isMl) {
    // 1. Dedicated _ml field (topic_ml, purpose_ml)
    const mlField = method[`${field}_ml`];
    if (mlField && !hasTurkish(mlField) && MALAYALAM_RANGE.test(mlField)) {
      return mlField;
    }

    // 2. content_translations_ml JSON (for fields without _ml variants)
    const translationsMl = method.content_translations_ml;
    if (translationsMl && typeof translationsMl === 'object') {
      const mlTranslation = translationsMl[field];
      if (mlTranslation && !hasTurkish(mlTranslation) && MALAYALAM_RANGE.test(mlTranslation)) {
        return mlTranslation;
      }
    }

    // 3. malayalam_meaning special case
    if (field === 'malayalam_meaning' || field === 'meaning') {
      const mm = method.malayalam_meaning;
      if (mm && !hasTurkish(mm) && MALAYALAM_RANGE.test(mm)) return mm;
    }

    // 4. Original field if already Malayalam (not Turkish)
    const original = method[field];
    if (original && !hasTurkish(original) && MALAYALAM_RANGE.test(original)) {
      return original;
    }

    // No Malayalam version — do NOT show English or Turkish
    return null;
  }

  // ── Arabic mode: 100% Arabic where available ──
  if (isAr) {
    const arField = method[`${field}_ar`];
    if (arField && !hasTurkish(arField)) return arField;

    if (field === 'arabic_text') return method[field] || null;

    // For content fields, check if original is Arabic script
    const original = method[field];
    if (original && /[\u0600-\u06FF]/.test(original) && !hasTurkish(original)) {
      return original;
    }

    return null;
  }

  // ── English mode (default): show English, never Turkish ──
  const original = method[field];
  if (original && !hasTurkish(original)) {
    return original;
  }

  // Fallback to _en variant
  const enField = method[`${field}_en`];
  if (enField && !hasTurkish(enField)) {
    return enField;
  }

  return null;
}

// Count Turkish fields in a method (for audit)
export function getTurkishFieldCount(method) {
  if (!method) return 0;
  const contentFields = [
    'topic', 'topic_ml', 'purpose', 'purpose_ml',
    'introduction', 'conditions', 'materials', 'preparation',
    'procedure', 'timing', 'planet', 'day', 'incense',
    'repetition', 'warnings', 'benefits', 'notes',
    'malayalam_meaning', 'english_meaning'
  ];
  let count = 0;
  for (const field of contentFields) {
    if (hasTurkish(method[field])) count++;
  }
  return count;
}