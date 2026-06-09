// ═══════════════════════════════════════════════════════════════
//  ARABIC TASHKEEL (HARAKAT) FOR ABJAD-GENERATED NAMES
//  Pure display layer — does NOT modify any calculation logic.
//
//  Rules applied (based on classical Abjad name vocalization):
//  - Each body consonant receives Fatha (َ) + Sukun (ْ) except
//    the last body letter which gets Kasra (ِ) before إيل suffix
//    (to facilitate the natural glide into إيل).
//  - For Jinn names (طيش suffix): last body consonant gets Fatha.
//  - Long-vowel carriers (ا و ي) are treated as vowel letters and
//    NOT given an additional haraka — they carry their own sound.
//  - غ (thousands marker) follows the same consonant rules.
//  - The fixed suffixes are fully vocalized:
//      إيل  →  إِيلُ
//      طيش  →  طَيْشُ
//      אל / תקש remain unchanged (Hebrew, no tashkeel system here)
// ═══════════════════════════════════════════════════════════════

// Unicode combining marks
const FATHA  = '\u064E'; // َ
const KASRA  = '\u0650'; // ِ
const DAMMA  = '\u064F'; // ُ
const SUKUN  = '\u0652'; // ْ
const SHADDA = '\u0651'; // ّ

// Long-vowel carrier letters — do not add haraka to these
const LONG_VOWEL = new Set(['ا', 'و', 'ي', 'ى', 'آ']);

// The two fixed Arabic suffixes (bare, no tashkeel)
const SUFFIX_ANGEL = 'إيل';
const SUFFIX_JINN  = 'طيش';

// Fully vocalized fixed suffixes
const SUFFIX_ANGEL_VOCALIZED = `إِيلُ`;
const SUFFIX_JINN_VOCALIZED  = `طَيْشُ`;

/**
 * addTashkeelToArabicName(name, suffixType)
 *
 * Takes a generated Arabic name string and the suffix type,
 * returns a fully vocalized version for display.
 *
 * suffixType: "angel" | "jinn"
 *
 * This function is DISPLAY-ONLY. The underlying `name` value
 * is never modified — only the rendered string differs.
 */
export function addTashkeelToArabicName(name, suffixType) {
  if (!name || typeof name !== 'string') return name;

  const isAngel = suffixType === 'angel';
  const suffix  = isAngel ? SUFFIX_ANGEL : SUFFIX_JINN;

  // Verify the name ends with the expected suffix
  if (!name.endsWith(suffix)) return name; // safety: return unchanged if unexpected

  // Extract body (everything before the suffix)
  const body = name.slice(0, name.length - suffix.length);

  if (!body) {
    // Name is suffix-only — just return vocalized suffix
    return isAngel ? SUFFIX_ANGEL_VOCALIZED : SUFFIX_JINN_VOCALIZED;
  }

  // Split body into individual Unicode grapheme-safe characters
  // (Arabic letters are single codepoints — no surrogates needed)
  const bodyChars = [...body];

  // Build vocalized body
  // Rule: apply Fatha+Sukun to each consonant except:
  //   - long-vowel carriers (ا و ي) → untouched
  //   - last consonant before إيل suffix → Kasra instead (smooth glide)
  //   - last consonant before طيش suffix → Fatha (open syllable into ط)
  const result = [];

  // Find index of last true consonant (non-long-vowel)
  let lastConsonantIdx = -1;
  for (let i = bodyChars.length - 1; i >= 0; i--) {
    if (!LONG_VOWEL.has(bodyChars[i])) { lastConsonantIdx = i; break; }
  }

  for (let i = 0; i < bodyChars.length; i++) {
    const ch = bodyChars[i];
    if (LONG_VOWEL.has(ch)) {
      // Long-vowel letters carry their own sound — no haraka added
      result.push(ch);
    } else if (i === lastConsonantIdx) {
      // Last consonant before suffix
      if (isAngel) {
        // Kasra to glide into إيل
        result.push(ch + KASRA);
      } else {
        // Fatha before طيش
        result.push(ch + FATHA);
      }
    } else {
      // Middle consonant: Fatha + Sukun (closed syllable)
      result.push(ch + FATHA + SUKUN);
    }
  }

  const vocalizedBody = result.join('');
  const vocalizedSuffix = isAngel ? SUFFIX_ANGEL_VOCALIZED : SUFFIX_JINN_VOCALIZED;

  return vocalizedBody + vocalizedSuffix;
}