import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// CRITICAL MANUSCRIPT VERIFICATION SYSTEM — STRICT RULES
// ═══════════════════════════════════════════════════════════════
// Never generate Arabic harakat using AI prediction. AI MUST NEVER GUESS.
//
// WORKFLOW (ALL steps must complete before saving):
//   STEP 1: Check local VerifiedArabic DB (return only verified/manual_review)
//   STEP 2: Check Holy Names database (HolyOneName)
//   STEP 3: Search original manuscript data (ManuscriptRule + frontend-passed)
//   STEP 4: Search the internet (authoritative sources only)
//   STEP 5: Cross-validate ALL sources (manuscript vs internet vs holy names)
//
// SAVE RULES:
//   - verified          → SAVE to database
//   - manual_review     → SAVE to database (flagged for admin review)
//   - unverified        → DO NOT SAVE ANYTHING. Return "Verification unavailable"
//
// CACHE RULES (frontend):
//   - Only cache verified records
//   - Never cache unverified records
//
// DISAGREEMENT RULE:
//   If verified manuscript version and verified online version disagree,
//   DO NOT automatically replace either one. Flag for manual review.
//
// REUSE RULE:
//   Once verified, return the DB record forever. Never regenerate.
//   Never ask AI again. Never search again unless explicitly requested.
// ═══════════════════════════════════════════════════════════════

// ── Arabic normalization ──
const ARABIC_LETTER_RANGES = [
  [0x0621, 0x064a],
  [0x066e, 0x066f],
  [0x0671, 0x06d3],
  [0x06d5, 0x06d5],
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

    let user = null;
    try {
      user = await base44.auth.me();
    } catch {
      user = null;
    }

    const body = await req.json();
    const {
      arabic_text,
      source_type,
      book_name,
      page_number,
      section,
      manuscript_arabic_text,
      manuscript_source,
    } = body;

    if (!arabic_text || typeof arabic_text !== 'string') {
      return Response.json({ error: 'arabic_text is required' }, { status: 400 });
    }

    const normalized = normalizeArabic(arabic_text);
    const textHash = await sha256Hex(normalized);

    // ══ STEP 1: Check local VERIFIED_ARABIC_DATABASE ══
    // Only return if verified or manual_review_required (unverified are never saved)
    const existing = await base44.asServiceRole.entities.VerifiedArabic.filter(
      { text_hash: textHash },
      '-date_verified',
      1
    );
    if (existing && existing.length > 0) {
      const entry = existing[0];
      if (
        entry.verification_status === 'verified' ||
        entry.verification_status === 'manual_review_required'
      ) {
        // Found — reuse forever, never search again
        return Response.json({
          ...entry,
          source: 'local_verified_database',
          reused: true,
        });
      }
    }

    // ══ STEP 2: Check Holy Names database ══
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

    // ══ STEP 3: Search original manuscript data inside this app ══
    let manuscriptMatch = null;
    // 3a: Search ManuscriptRule entity (database)
    try {
      const rules = await base44.asServiceRole.entities.ManuscriptRule.list(
        '-created_date',
        200
      );
      if (rules && Array.isArray(rules)) {
        manuscriptMatch =
          rules.find((r) => {
            const rNorm = normalizeArabic(r.original_text || '');
            return rNorm.length > 0 && rNorm === normalized;
          }) || null;
      }
    } catch {
      manuscriptMatch = null;
    }
    // 3b: Check manuscript text passed from frontend (data files)
    let frontendManuscriptMatch = false;
    if (manuscript_arabic_text) {
      const fNorm = normalizeArabic(manuscript_arabic_text);
      if (fNorm.length > 0 && fNorm === normalized) {
        frontendManuscriptMatch = true;
      }
    }

    const hasManuscriptMatch = !!manuscriptMatch || frontendManuscriptMatch;
    const manuscriptSourceDetail = manuscriptMatch
      ? `${manuscriptMatch.book_name || 'ManuscriptRule'} p.${manuscriptMatch.page_number || '?'}${manuscriptMatch.chapter ? ' · ' + manuscriptMatch.chapter : ''}`
      : frontendManuscriptMatch
        ? manuscript_source || 'Frontend manuscript data'
        : '';
    const manuscriptArabicText =
      manuscriptMatch?.original_text ||
      (frontendManuscriptMatch ? manuscript_arabic_text : '');

    // ══ STEP 4: Search the internet (authoritative sources) ══
    const prompt = `You are an expert Arabic manuscript verifier specializing in Islamic texts, Quran, Hadith, divine names (Asma al-Husna), adhkar, and occult manuscript traditions.

TASK: Verify this Arabic text by searching authoritative sources on the internet.

ARABIC TEXT TO VERIFY:
"${arabic_text}"

SOURCE TYPE: ${source_type || 'unknown'}
BOOK: ${book_name || 'not specified'}
PAGE: ${page_number || 'not specified'}
SECTION: ${section || 'not specified'}

SEARCH INSTRUCTIONS (follow EXACTLY):
1. Search these sources IN ORDER of priority:
   - Priority 1: Quran.com, Tanzil.net, King Fahd Quran Complex
   - Priority 2: Sunnah.com, Shamela, Al-Waraq, Dorar, Altafsir, classical Arabic books
   - Priority 3: Authentic scanned manuscripts, library archives, university collections
   - Priority 4: Verified scholarly websites only
2. Search in Arabic. Search exact phrases AND partial phrases.
3. NEVER use random blogs, AI-generated pages, or unverified websites.
4. Compare ALL sources you find. Only accept if wording AGREES across trusted references.
5. NEVER GUESS harakat. Copy harakat EXACTLY from the verified source. Never add your own.
6. Never modify spelling. Never modernize. Never simplify. Keep original manuscript spelling.
7. If sources DISAGREE → verification_status = "manual_review_required", explain in notes.
8. If NO trusted source exists → verification_status = "unverified". DO NOT create harakat. Leave arabic_text_verified as original input without added harakat.
9. Generate Malayalam and English meanings ONLY from verified Arabic. Never translate guessed text.
10. If unverified, leave malayalam_meaning and english_meaning EMPTY.

AUTHENTICITY IS MORE IMPORTANT THAN COMPLETENESS.
It is acceptable to leave a text unverified.
It is NEVER acceptable to invent Arabic or harakat.
Never create placeholder translations.
Never auto-fill unknown Arabic.`;

    const llmResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
      response_json_schema: {
        type: 'object',
        properties: {
          arabic_text_verified: {
            type: 'string',
            description: 'Full Arabic with harakat from authoritative source. If unverified, original input without added harakat.',
          },
          malayalam_meaning: {
            type: 'string',
            description: 'Malayalam translation from verified Arabic only. EMPTY if unverified.',
          },
          english_meaning: {
            type: 'string',
            description: 'English translation from verified Arabic only. EMPTY if unverified.',
          },
          source_url: { type: 'string', description: 'Primary authoritative source URL' },
          cross_verification_sources: {
            type: 'array',
            items: { type: 'string' },
            description: 'All source URLs compared',
          },
          source_priority: {
            type: 'string',
            enum: ['priority_1', 'priority_2', 'priority_3', 'priority_4'],
          },
          verification_status: {
            type: 'string',
            enum: ['verified', 'manual_review_required', 'unverified'],
          },
          notes: { type: 'string', description: 'Discrepancies or verification notes' },
        },
      },
    });

    // ══ STEP 5: Cross-validate ALL sources ══
    let finalStatus = llmResult.verification_status || 'unverified';
    let finalNotes = llmResult.notes || '';
    let finalArabic = llmResult.arabic_text_verified || arabic_text;
    let finalMl = llmResult.malayalam_meaning || '';
    let finalEn = llmResult.english_meaning || '';
    let holyNameUsed = false;
    let manuscriptUsed = false;

    // ── Holy Names cross-check ──
    if (holyNameMatch) {
      if (finalStatus === 'verified') {
        const localNorm = normalizeArabic(holyNameMatch.arabic_name || '');
        const internetNorm = normalizeArabic(finalArabic);
        if (localNorm === internetNorm) {
          finalArabic = holyNameMatch.arabic_name;
          finalMl = holyNameMatch.meaning_malayalam || finalMl;
          finalNotes = (finalNotes ? finalNotes + ' | ' : '') + 'Holy Names DB match confirmed. Local version retained.';
          holyNameUsed = true;
        } else {
          // DISAGREEMENT — flag for manual review, never overwrite
          finalStatus = 'manual_review_required';
          finalNotes = (finalNotes ? finalNotes + ' | ' : '') + 'DISCREPANCY: Holy Names DB differs from internet source. Manual review required — do not overwrite.';
        }
      } else if (finalStatus === 'unverified') {
        // No internet source, but Holy Names has it — local authority
        finalArabic = holyNameMatch.arabic_name;
        finalMl = holyNameMatch.meaning_malayalam || '';
        finalStatus = 'verified';
        finalNotes = 'Verified from Holy Names DB (local authority). No internet source found.';
        holyNameUsed = true;
      }
    }

    // ── Manuscript data cross-check ──
    if (hasManuscriptMatch) {
      if (finalStatus === 'verified') {
        // Compare manuscript version with internet-verified version
        const manuscriptNorm = normalizeArabic(manuscriptArabicText);
        const internetNorm = normalizeArabic(finalArabic);
        if (manuscriptNorm === internetNorm) {
          // Match — keep manuscript version (primary authority)
          finalArabic = manuscriptArabicText;
          finalNotes = (finalNotes ? finalNotes + ' | ' : '') + 'Manuscript data match confirmed. Manuscript version retained.';
          manuscriptUsed = true;
        } else {
          // DISAGREEMENT — flag for manual review, never overwrite either
          finalStatus = 'manual_review_required';
          finalNotes = (finalNotes ? finalNotes + ' | ' : '') + 'DISCREPANCY: Manuscript data differs from verified online version. Manual review required — do not overwrite automatically.';
        }
      } else if (finalStatus === 'unverified' && !holyNameUsed) {
        // No internet source, but manuscript has it — manuscript is primary authority
        finalArabic = manuscriptArabicText;
        finalStatus = 'verified';
        finalNotes = 'Verified from manuscript data (local primary authority). No internet source found.';
        manuscriptUsed = true;
        // Try to get translations from manuscript data
        if (manuscriptMatch) {
          finalMl = manuscriptMatch.rule_summary_ml || '';
          finalEn = manuscriptMatch.rule_summary || '';
        }
      }
    }

    // ══ UNVERIFIED — DO NOT SAVE ANYTHING ══
    if (finalStatus === 'unverified') {
      return Response.json({
        verification_status: 'unverified',
        arabic_text: arabic_text,
        malayalam_meaning: '',
        english_meaning: '',
        source: 'verification_unavailable',
        notes: 'Verification unavailable. No trusted source found. Nothing stored.',
        text_hash: textHash,
      });
    }

    // ══ STEP 6: Save ONLY verified or manual_review_required ══
    const entry = await base44.asServiceRole.entities.VerifiedArabic.create({
      text_hash: textHash,
      arabic_text: finalArabic,
      arabic_text_normalized: normalized,
      malayalam_meaning: finalMl,
      english_meaning: finalEn,
      source_type: source_type || 'unknown_arabic',
      book_name: book_name || '',
      page_number: String(page_number || ''),
      section: section || '',
      source_url: llmResult.source_url || '',
      source_priority: llmResult.source_priority || 'priority_4',
      verification_status: finalStatus,
      cross_verification_sources: llmResult.cross_verification_sources || [],
      holy_name_match: holyNameUsed,
      manuscript_match: manuscriptUsed,
      manuscript_source_detail: manuscriptSourceDetail,
      manuscript_arabic_text: manuscriptArabicText,
      date_verified: new Date().toISOString(),
      reviewer: user ? user.email || 'AI-verified with internet cross-check' : 'AI-verified with internet cross-check',
      notes: finalNotes,
    });

    return Response.json({
      ...entry,
      source: finalStatus === 'verified' ? 'verified_and_saved' : 'manual_review_saved',
      reused: false,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});