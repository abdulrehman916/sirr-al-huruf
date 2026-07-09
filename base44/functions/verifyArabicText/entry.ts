import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// CRITICAL MANUSCRIPT VERIFICATION SYSTEM
// ═══════════════════════════════════════════════════════════════
// Never generate Arabic harakat using AI prediction. AI MUST NEVER GUESS.
//
// WORKFLOW:
//   STEP 1: Check local VERIFIED_ARABIC_DATABASE (by text_hash)
//   STEP 2: Check Holy Names database (HolyOneName) for divine names
//   STEP 3: Search the internet (authoritative sources only)
//   STEP 4: Cross-verification across trusted sources
//   STEP 5: Harakat — copy exactly, never add your own
//   STEP 6: Translation — only from verified Arabic
//   STEP 7: Save permanently to VerifiedArabic
//   STEP 8: Future reuse — never search again for same text
//   STEP 9: If no trusted source — "Verification unavailable"
//
// SOURCE PRIORITY:
//   1: Quran.com, Tanzil.net, King Fahd Quran Complex
//   2: Sunnah.com, Shamela, Al-Waraq, Dorar, Altafsir, classical books
//   3: Authentic scanned manuscripts, library archives, universities
//   4: Verified scholarly websites only
// ═══════════════════════════════════════════════════════════════

// ── Arabic normalization (strip harakat, normalize alef variants) ──
const ARABIC_LETTER_RANGES = [
  [0x0621, 0x064A],
  [0x066E, 0x066F],
  [0x0671, 0x06D3],
  [0x06D5, 0x06D5],
];
const ALEF_VARIANTS = new Set([0x0623, 0x0625, 0x0622, 0x0671]);
const PLAIN_ALEF = '\u0627';

function isInRange(code, ranges) {
  return ranges.some(([s, e]) => code >= s && code <= e);
}

function normalizeArabic(text) {
  if (!text || typeof text !== 'string') return '';
  let result = '';
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (isInRange(code, ARABIC_LETTER_RANGES)) {
      result += ALEF_VARIANTS.has(code) ? PLAIN_ALEF : ch;
    }
  }
  return result;
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Auth is optional — verification works for guests (public pages)
    let user = null;
    try {
      user = await base44.auth.me();
    } catch {
      user = null;
    }

    const body = await req.json();
    const { arabic_text, source_type, book_name, page_number } = body;

    if (!arabic_text || typeof arabic_text !== 'string') {
      return Response.json({ error: 'arabic_text is required' }, { status: 400 });
    }

    const normalized = normalizeArabic(arabic_text);
    const textHash = await sha256Hex(normalized);

    // ══ STEP 1: Check local VERIFIED_ARABIC_DATABASE ══
    const existing = await base44.asServiceRole.entities.VerifiedArabic.filter(
      { text_hash: textHash },
      '-date_verified',
      1
    );
    if (existing && existing.length > 0) {
      // Found — reuse forever, never search again
      return Response.json({
        ...existing[0],
        source: 'local_verified_database',
        reused: true,
      });
    }

    // ══ STEP 2: Check Holy Names database (for divine names) ══
    let holyNameMatch = null;
    if (source_type === 'divine_name' || source_type === 'ism') {
      try {
        const holyNames = await base44.asServiceRole.entities.HolyOneName.list(
          '-created_date',
          200
        );
        if (holyNames && Array.isArray(holyNames)) {
          holyNameMatch =
            holyNames.find((h) => {
              const hNorm = normalizeArabic(h.arabic_name || '');
              return hNorm.length > 0 && hNorm === normalized;
            }) || null;
        }
      } catch {
        holyNameMatch = null;
      }
    }

    // ══ STEP 3-6: Search internet, cross-verify, harakat, translate ══
    const prompt = `You are an expert Arabic manuscript verifier specializing in Islamic texts, Quran, Hadith, divine names (Asma al-Husna), adhkar, and occult manuscript traditions.

TASK: Verify this Arabic text by searching authoritative sources on the internet.

ARABIC TEXT TO VERIFY:
"${arabic_text}"

SOURCE TYPE: ${source_type || 'unknown'}
BOOK: ${book_name || 'not specified'}
PAGE: ${page_number || 'not specified'}

SEARCH INSTRUCTIONS (follow EXACTLY):
1. Search these sources IN ORDER of priority:
   - Priority 1: Quran.com, Tanzil.net, King Fahd Quran Complex
   - Priority 2: Sunnah.com, Shamela, Al-Waraq, Dorar, Altafsir, classical Arabic books
   - Priority 3: Authentic scanned manuscripts, library archives, university collections
   - Priority 4: Verified scholarly websites only
2. Search in Arabic. Search exact phrases AND partial phrases.
3. NEVER use random blogs, AI-generated pages, or unverified websites.
4. Compare ALL sources you find. Only accept if wording AGREES across trusted references.
5. NEVER GUESS harakat (diacritical marks). Copy harakat EXACTLY from the verified source. Never add your own.
6. Never modify spelling. Never modernize. Never simplify. Keep original manuscript spelling whenever verified.
7. If sources DISAGREE → set verification_status to "manual_review_required" and explain the discrepancy in notes.
8. If NO trusted source exists → set verification_status to "unverified". DO NOT create or guess harakat. Leave arabic_text_verified as the original input without added harakat.
9. Generate Malayalam meaning and English meaning ONLY from the verified Arabic. Never translate guessed text.
10. If unverified, leave malayalam_meaning and english_meaning empty.

AUTHENTICITY IS MORE IMPORTANT THAN COMPLETENESS.
It is acceptable to leave a text unverified.
It is NEVER acceptable to invent Arabic or harakat.`;

    const llmResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
      response_json_schema: {
        type: 'object',
        properties: {
          arabic_text_verified: {
            type: 'string',
            description:
              'Full Arabic text with harakat copied exactly from authoritative source. If unverified, return the original input without added harakat.',
          },
          malayalam_meaning: {
            type: 'string',
            description: 'Malayalam translation from verified Arabic only. Empty if unverified.',
          },
          english_meaning: {
            type: 'string',
            description: 'English translation from verified Arabic only. Empty if unverified.',
          },
          source_url: {
            type: 'string',
            description: 'Primary authoritative source URL',
          },
          cross_verification_sources: {
            type: 'array',
            items: { type: 'string' },
            description: 'All source URLs compared during cross-verification',
          },
          source_priority: {
            type: 'string',
            enum: ['priority_1', 'priority_2', 'priority_3', 'priority_4'],
          },
          verification_status: {
            type: 'string',
            enum: ['verified', 'manual_review_required', 'unverified'],
          },
          notes: {
            type: 'string',
            description: 'Discrepancies, manual review details, or verification notes',
          },
        },
      },
    });

    // ══ Cross-check with Holy Names (Step 2 comparison) ══
    let finalStatus = llmResult.verification_status || 'unverified';
    let finalNotes = llmResult.notes || '';
    let finalArabic = llmResult.arabic_text_verified || arabic_text;
    let finalMl = llmResult.malayalam_meaning || '';
    let finalEn = llmResult.english_meaning || '';
    let holyNameUsed = false;

    if (holyNameMatch) {
      if (finalStatus === 'verified') {
        // Compare local Holy Name with internet-verified version
        const localNorm = normalizeArabic(holyNameMatch.arabic_name || '');
        const internetNorm = normalizeArabic(finalArabic);
        if (localNorm === internetNorm) {
          // Both match — keep local version (primary local reference)
          finalArabic = holyNameMatch.arabic_name;
          finalMl = holyNameMatch.meaning_malayalam || finalMl;
          finalNotes =
            (finalNotes ? finalNotes + ' | ' : '') +
            'Holy Names DB match confirmed. Local version retained.';
          holyNameUsed = true;
        } else {
          // They differ — flag for manual review, do not overwrite
          finalStatus = 'manual_review_required';
          finalNotes =
            (finalNotes ? finalNotes + ' | ' : '') +
            'DISCREPANCY: Holy Names DB differs from internet source. Manual review required — do not overwrite automatically.';
        }
      } else if (finalStatus === 'unverified') {
        // No internet source, but Holy Names has it — use local as primary reference
        finalArabic = holyNameMatch.arabic_name;
        finalMl = holyNameMatch.meaning_malayalam || '';
        finalStatus = 'verified';
        finalNotes =
          'Verified from Holy Names DB (local primary reference). No internet source found.';
        holyNameUsed = true;
      }
    }

    // If still unverified, use original input without added harakat
    if (finalStatus === 'unverified' && (!finalArabic || finalArabic === llmResult.arabic_text_verified)) {
      finalArabic = arabic_text; // original input, no AI-added harakat
    }

    // ══ STEP 7: Save to database permanently ══
    const entry = await base44.asServiceRole.entities.VerifiedArabic.create({
      text_hash: textHash,
      arabic_text: finalArabic,
      arabic_text_normalized: normalized,
      malayalam_meaning: finalMl,
      english_meaning: finalEn,
      source_type: source_type || 'unknown_arabic',
      book_name: book_name || '',
      page_number: String(page_number || ''),
      source_url: llmResult.source_url || '',
      source_priority: llmResult.source_priority || 'priority_4',
      verification_status: finalStatus,
      cross_verification_sources: llmResult.cross_verification_sources || [],
      holy_name_match: holyNameUsed,
      date_verified: new Date().toISOString(),
      reviewer: user ? user.email || 'AI-verified with internet cross-check' : 'AI-verified with internet cross-check',
      notes: finalNotes,
    });

    // ══ STEP 8: Return (future reuse handled by Step 1) ══
    return Response.json({
      ...entry,
      source: 'internet_search_verified',
      reused: false,
      holy_name_match_detail: holyNameMatch
        ? {
            arabic_name: holyNameMatch.arabic_name,
            meaning_malayalam: holyNameMatch.meaning_malayalam,
          }
        : null,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});