import { createClientFromRequest } from "npm:@base44/sdk@0.8.38";

// ═══════════════════════════════════════════════════════════════
// seedHolyNameEsoteric — admin-only, idempotent seed for Section C
// (Barhatiyya / Esoteric Invocation Names).
//
// Creates EMPTY scholarly cards (HNK-MHC-001, HNK-MHC-002, ...)
// with ALL fields prepared (mirroring Section A) but EMPTY.
// Nothing is fabricated, guessed, or AI-generated.
//
// Input:
//   { names: [ { arabic_name, transliteration?, abjad_value?,
//               letter_count?, esoteric_source_ref? }, ... ] }
//
// Behavior:
//   - Assigns sequential HNK-MHC-001.. IDs in the order supplied.
//   - Skips a name if a card with the same arabic_normalized already
//     exists (idempotent — never duplicates, never overwrites).
//   - Never modifies existing records.
//   - All scholarly fields start empty / unverified.
//
// ISOLATED — touches ONLY HolyNameEsotericKnowledge.
// ═══════════════════════════════════════════════════════════════

function normalizeArabic(s: string): string {
  if (!s) return "";
  return String(s)
    .replace(/[\u064B-\u065F\u0670]/g, "")   // harakat
    .replace(/\u0640/g, "")                   // tatweel
    .replace(/\u0622/g, "\u0627")             // alef madda → alef
    .replace(/\u0623/g, "\u0627")             // alef hamza above → alef
    .replace(/\u0625/g, "\u0627")             // alef hamza below → alef
    .replace(/\u0624/g, "\u0648")             // waw hamza → waw
    .replace(/\u0626/g, "\u064A")             // yaa hamza → yaa
    .replace(/\u0649/g, "\u064A")             // alef maqsura → yaa
    .replace(/\u0629/g, "\u0647")             // taa marbuta → haa
    .trim();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden — admin only" }, { status: 403 });

    const body = await req.json();
    const names = Array.isArray(body?.names) ? body.names : [];
    if (names.length === 0) {
      return Response.json({ status: "ok", message: "no names supplied", created: 0 });
    }

    // Load existing normalized keys to skip duplicates (idempotent).
    const existing = await base44.asServiceRole.entities.HolyNameEsotericKnowledge.list("-created_date", 2000);
    const existingNorm = new Set((existing || []).map((r: any) => r.arabic_normalized || "").filter(Boolean));

    const now = new Date().toISOString();
    const created: any[] = [];
    let skipped = 0;

    // Sequential numbering: continue from the highest existing number.
    let nextSeq = 1;
    for (const r of (existing || [])) {
      const m = /^HNK-MHC-(\d+)$/.exec(String(r.name_id || ""));
      if (m) nextSeq = Math.max(nextSeq, parseInt(m[1], 10) + 1);
    }

    const toCreate: any[] = [];
    for (let i = 0; i < names.length; i++) {
      const n = names[i] || {};
      const arabic = String(n.arabic_name || "").trim();
      if (!arabic) { skipped++; continue; }
      const norm = normalizeArabic(arabic);
      if (existingNorm.has(norm)) { skipped++; continue; }
      existingNorm.add(norm);

      const id = `HNK-MHC-${String(nextSeq).padStart(3, "0")}`;
      nextSeq++;

      toCreate.push({
        name_id: id,
        arabic_name: arabic,
        arabic_normalized: norm,
        transliteration: String(n.transliteration || ""),
        malayalam_name: "",
        meaning_en: "",
        order_index: i + 1,
        section_count: 0,
        last_imported_at: "",
        is_active: true,
        seeded: true,
        original_static_id: i + 1,
        abjad_value: Number(n.abjad_value || 0),
        letter_count: Number(n.letter_count || 0),
        esoteric_source_ref: String(n.esoteric_source_ref || ""),
        canonical_arabic: "",
        fully_vowelized_name: "",
        spelling_corrected: false,
        spelling_correction: {},
        alternative_readings: [],
        alternative_spellings: [],
        original_source_word: "",
        harakat_verified: false,
        verification_status: "unverified",
        verification_confidence: 0,
        verification_sources: [],
        last_verified_date: "",
        name_origin: "unknown",
        etymology: "",
        linguistic: {},
        islamic_knowledge: {},
        traditional_practices: [],
        research_profile: {},
        meanings: {},
        benefits: {},
        relationship_to_99_names: {},
        relationship_to_99_names_type: "unknown",
        invocations: [],
        review_notes: "",
        review_notes_ml: "",
      });
    }

    if (toCreate.length > 0) {
      const res = await base44.asServiceRole.entities.HolyNameEsotericKnowledge.bulkCreate(toCreate);
      created.push(...(res || []));
    }

    return Response.json({
      status: "ok",
      supplied: names.length,
      created: created.length,
      skipped_duplicate: skipped,
      created_ids: created.map((r: any) => r.name_id),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});