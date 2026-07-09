import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// INTERNAL KNOWLEDGE BASE SEARCH — SELF-LEARNING ENGINE
// ═══════════════════════════════════════════════════════════════
// PERMANENT BACKEND ARCHITECTURE.
//
// Before creating or verifying any new record, search the entire
// internal knowledge base first. If a verified record already exists,
// reuse it instead of creating a duplicate. Never perform external
// verification when verified information already exists internally.
//
// SEARCH TIERS (highest confidence first):
//   Tier 1 (100%): Exact text_hash match in VerifiedArabic
//   Tier 2 (95%):  Normalized Arabic match in VerifiedArabic
//                  (catches harakat variations, OCR differences, alef normalization)
//   Tier 3 (90%):  Exact normalized match in verified ManuscriptEntry library
//                  (same text found in a different book — reuse)
//   Tier 3b (85%): Partial/substring match in verified ManuscriptEntry
//                  (Quran verse within a longer dua, partial text overlap)
//
// Each verified record becomes permanent reusable knowledge.
// As the database grows, more entries are found internally,
// continuously reducing external searches, AI usage, and cost.
//
// ADMIN ONLY.
// ═══════════════════════════════════════════════════════════════

// ── Arabic normalization — MUST match verifyArabicText exactly ──
const ARABIC_LETTER_RANGES = [[0x0621, 0x064a], [0x066e, 0x066f], [0x0671, 0x06d3], [0x06d5, 0x06d5]];
const ALEF_VARIANTS = new Set([0x0623, 0x0625, 0x0622, 0x0671]);
const PLAIN_ALEF = '\u0627';

function isInRange(code: number, ranges: number[][]): boolean {
  return ranges.some(([s, e]) => code >= s && code <= e);
}

function normalizeArabic(text: string): string {
  if (!text || typeof text !== 'string') return '';
  let result = '';
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if (isInRange(code, ARABIC_LETTER_RANGES)) {
      result += ALEF_VARIANTS.has(code) ? PLAIN_ALEF : ch;
    }
  }
  return result;
}

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    const body = await req.json();
    const { arabic_text, purpose, topic, entry_type, book_name, page_number } = body;

    if (!arabic_text || arabic_text.trim().length === 0) {
      return Response.json({
        match_found: false,
        reason: 'no_arabic_text',
        skip_external_verification: false,
      });
    }

    const normalized = normalizeArabic(arabic_text);
    if (normalized.length === 0) {
      return Response.json({
        match_found: false,
        reason: 'normalization_failed',
        skip_external_verification: false,
      });
    }

    const textHash = await sha256Hex(normalized);

    // ══ TIER 1: Exact text_hash match in VerifiedArabic (confidence: 100) ══
    // The strongest match — same Arabic text already verified and stored.
    try {
      const exactMatches = await base44.asServiceRole.entities.VerifiedArabic.filter(
        { text_hash: textHash, verification_status: 'verified' },
        '-revision_number',
        5
      );
      if (exactMatches && exactMatches.length > 0) {
        const best = exactMatches[0];
        return Response.json({
          match_found: true,
          match_type: 'exact_hash',
          confidence: 100,
          verified_arabic: best.arabic_text,
          text_hash: best.text_hash,
          malayalam_meaning: best.malayalam_meaning || '',
          english_meaning: best.english_meaning || '',
          primary_source: best.primary_source || '',
          verification_confidence: best.verification_confidence || 'HIGH',
          verification_method: 'internal_reuse',
          skip_external_verification: true,
          message: 'Exact match found in verified database. Reusing record — zero credits.',
        });
      }
    } catch { /* continue to next tier */ }

    // ══ TIER 2: Normalized Arabic match in VerifiedArabic (confidence: 95) ══
    // Catches harakat variations, OCR differences, alef variant normalization.
    // Same Arabic text with different harakat or OCR artifacts normalizes to the same string.
    try {
      const normalizedMatches = await base44.asServiceRole.entities.VerifiedArabic.filter(
        { arabic_text_normalized: normalized, verification_status: 'verified' },
        '-revision_number',
        5
      );
      if (normalizedMatches && normalizedMatches.length > 0) {
        const best = normalizedMatches[0];
        return Response.json({
          match_found: true,
          match_type: 'normalized_match',
          confidence: 95,
          verified_arabic: best.arabic_text,
          text_hash: best.text_hash,
          malayalam_meaning: best.malayalam_meaning || '',
          english_meaning: best.english_meaning || '',
          primary_source: best.primary_source || '',
          verification_confidence: best.verification_confidence || 'HIGH',
          verification_method: 'internal_reuse',
          skip_external_verification: true,
          message: 'Normalized Arabic match (harakat/OCR variation). Reusing record — zero credits.',
        });
      }
    } catch { /* continue to next tier */ }

    // ══ TIER 3: Verified ManuscriptEntry library search (confidence: 90) ══
    // Search every verified manuscript already imported into our library.
    // Compare normalized Arabic text in memory.
    // This catches the same text appearing in different books.
    try {
      const verifiedEntries = await base44.asServiceRole.entities.ManuscriptEntry.filter(
        { verification_status: 'verified', is_primary_method_entry: true },
        '-created_date',
        300
      );

      if (verifiedEntries && verifiedEntries.length > 0) {
        for (const entry of verifiedEntries) {
          if (!entry.arabic_text) continue;
          const entryNorm = normalizeArabic(entry.arabic_text);
          if (entryNorm.length === 0) continue;

          // Tier 3: Exact normalized match
          if (entryNorm === normalized) {
            return Response.json({
              match_found: true,
              match_type: 'verified_entry_exact',
              confidence: 90,
              verified_arabic: entry.arabic_text,
              text_hash: entry.verified_arabic_hash || textHash,
              malayalam_meaning: entry.malayalam_meaning || '',
              english_meaning: entry.english_meaning || '',
              primary_source: entry.verification_source || (entry.book_title + ' p.' + (entry.page_number || '?')),
              verification_confidence: 'HIGH',
              verification_method: 'internal_reuse',
              skip_external_verification: true,
              message: 'Exact match in verified manuscript library. Reusing record — zero credits.',
            });
          }

          // Tier 3b: Partial/substring match (confidence: 85)
          // One text contains the other — catches Quran verses within longer duas,
          // partial text overlap, and embedded references.
          // Minimum 20 normalized characters to avoid false positives on short texts.
          if (normalized.length >= 20 && entryNorm.length >= 20) {
            if (normalized.includes(entryNorm) || entryNorm.includes(normalized)) {
              return Response.json({
                match_found: true,
                match_type: 'partial_match',
                confidence: 85,
                verified_arabic: entry.arabic_text,
                text_hash: entry.verified_arabic_hash || textHash,
                malayalam_meaning: entry.malayalam_meaning || '',
                english_meaning: entry.english_meaning || '',
                primary_source: entry.verification_source || (entry.book_title + ' p.' + (entry.page_number || '?')),
                verification_confidence: 'MEDIUM',
                verification_method: 'internal_reuse',
                skip_external_verification: true,
                message: 'Partial match in verified manuscript library (substring overlap). Reusing record — zero credits.',
              });
            }
          }
        }
      }
    } catch { /* continue to next tier */ }

    // ══ NO MATCH FOUND — External verification required ══
    return Response.json({
      match_found: false,
      match_type: 'no_match',
      confidence: 0,
      text_hash: textHash,
      normalized_text: normalized,
      skip_external_verification: false,
      message: 'No internal match found. External verification required.',
    });
  } catch (error) {
    return Response.json({
      error: error.message,
      match_found: false,
      skip_external_verification: false,
    }, { status: 500 });
  }
});