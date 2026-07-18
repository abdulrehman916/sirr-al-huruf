import { createClientFromRequest } from "npm:@base44/sdk@0.8.38";

// ═══════════════════════════════════════════════════════════════
// enrichHolyNameAuthoritative — authoritative per-name harakat +
// linguistic + Islamic-knowledge enrichment for HolyNameKnowledge.
//
// Honest per-name origin policy (owner-approved):
//   • Each name's REAL linguistic origin is determined first
//     (Hebrew / Syriac / Aramaic / Arabic / mixed / unknown).
//   • Harakat + spelling are verified against authoritative sources
//     FOR THAT ORIGIN (classical Arabic dictionaries, Quranic Corpus,
//     Lisan al-Arab, Taj al-Arus, Lane's Lexicon for Arabic names;
//     Hebrew/Syriac lexicons + the occult source manuscript for
//     foreign-origin transliterations).
//   • NEVER invent harakat. If no authoritative source attests a
//     reading, canonical_arabic stays empty and verification_status
//     becomes "not_in_classical_sources" or "needs_review".
//   • When sources DISAGREE, every variant is recorded in
//     alternative_readings with its source(s); the preferred scholarly
//     reading is flagged. verification_status = "conflicting_sources".
//   • Islamic-knowledge fields (tafsir/hadith/quran_verses/etc.) are
//     filled ONLY when the name genuinely appears in Islamic sources;
//     left EMPTY (never fabricated) for foreign names absent from them.
//   • Traditional practices (wafq/amal/dua/hizb/dhikr) are stored with
//     authenticated=false + note "Traditional Manuscript Reference
//     (Not authenticated)" unless a verified manuscript confirms them.
//   • Every source is stored with full attribution + reliability_score.
//
// Mode A — single name:  { name_id }
// Mode B — batch:        { record_class:"occult_section_a", limit:5,
//                          only_status:"unverified" }
//
// Uses InvokeLLM with add_context_from_internet=true (Gemini, the only
// model supporting web search) so the model pulls REAL sources.
// Admin-only. Touches ONLY HolyNameKnowledge (update only — never
// deletes, never overwrites arabic_name / existing user fields; only
// fills the new authoritative fields).
// ═══════════════════════════════════════════════════════════════

const SCHEMA = {
  type: "object",
  properties: {
    name_origin: { type: "string", enum: ["hebrew","syriac","aramaic","arabic","mixed","unknown"] },
    etymology: { type: "string" },
    canonical_arabic: { type: "string" },
    fully_vowelized_name: { type: "string" },
    alternative_readings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          arabic: { type: "string" },
          reading_note: { type: "string" },
          sources: { type: "array", items: {
            type: "object",
            properties: { title:{type:"string"}, page:{type:"string"}, url:{type:"string"}, language:{type:"string"}, reliability_score:{type:"integer"} }
          } },
          preferred: { type: "boolean" }
        },
        required: ["arabic"]
      }
    },
    harakat_verified: { type: "boolean" },
    verification_status: { type: "string", enum: ["verified","needs_review","conflicting_sources","not_in_classical_sources"] },
    verification_confidence: { type: "integer" },
    verification_sources: { type: "array", items: {
      type: "object",
      properties: {
        title:{type:"string"}, author:{type:"string"}, publisher:{type:"string"}, edition:{type:"string"},
        page:{type:"string"}, volume:{type:"string"}, url:{type:"string"}, access_date:{type:"string"},
        language:{type:"string"}, reliability_score:{type:"integer"}, field_verified:{type:"string"}
      },
      required: ["title"]
    }},
    linguistic: {
      type: "object",
      properties: {
        root_letters:{type:"string"}, arabic_root:{type:"string"}, morphological_pattern:{type:"string"},
        literal_meaning:{type:"string"}, lexical_meaning:{type:"string"}, classical_explanation:{type:"string"},
        quranic_usage:{type:"string"}, hadith_usage:{type:"string"}, difference_from_similar:{type:"string"},
        related_names:{type:"string"}, grammar_notes:{type:"string"}, origin_language:{type:"string"}
      }
    },
    islamic_knowledge: {
      type: "object",
      properties: {
        meaning:{type:"string"}, detailed_explanation:{type:"string"},
        tafsir_refs:{type:"array",items:{type:"string"}},
        hadith_refs:{type:"array",items:{type:"string"}},
        scholarly_explanation:{type:"string"}, spiritual_significance:{type:"string"},
        conditions_of_usage:{type:"string"},
        authentic_duas:{type:"array",items:{type:"string"}},
        authentic_adhkar:{type:"array",items:{type:"string"}},
        quran_verses:{type:"array",items:{type:"string"}},
        classical_explanations:{type:"string"}
      }
    },
    traditional_practices: { type: "array", items: {
      type: "object",
      properties: {
        type:{type:"string"}, text_ar:{type:"string"}, translation_en:{type:"string"}, translation_ml:{type:"string"},
        source:{type:"string"}, authenticated:{type:"boolean"}, note:{type:"string"}
      }
    }},
    alternative_spellings: { type: "array", items: { type: "object", properties: { arabic:{type:"string"}, note:{type:"string"}, sources:{type:"array",items:{type:"object",properties:{title:{type:"string"},page:{type:"string"},url:{type:"string"}}}} }, required:["arabic"] } },
    original_source_word: { type: "string" },
    research_profile: { type: "object", additionalProperties: true, properties: {
      historical_background:{type:"string"}, pronunciation_guide:{type:"string"},
      classical_dict_refs:{type:"array",items:{type:"string"}}, academic_refs:{type:"array",items:{type:"string"}},
      manuscript_refs:{type:"array",items:{type:"string"}}, earliest_occurrence:{type:"string"},
      related_historical_usage:{type:"string"}, linguistic_explanation:{type:"string"},
      root_meaning:{type:"string"}, literal_meaning:{type:"string"},
      root_letters:{type:"string"}, arabic_root:{type:"string"}, morphological_pattern:{type:"string"}
    } },
    meanings: { type: "object", additionalProperties: true, properties: {
      arabic:{type:"string"}, malayalam:{type:"string"}, english:{type:"string"},
      original:{type:"string"}, symbolic:{type:"string"}, historical:{type:"string"}, traditional:{type:"string"}
    } },
    benefits: { type: "object", additionalProperties: true, properties: {
      authentic_islamic:{type:"array",items:{type:"object",properties:{text:{type:"string"},sources:{type:"array",items:{type:"object",properties:{title:{type:"string"},page:{type:"string"},url:{type:"string"}}}},authenticated:{type:"boolean"}}}},
      linguistic:{type:"array",items:{type:"object",properties:{text:{type:"string"},sources:{type:"array",items:{type:"object",properties:{title:{type:"string"},url:{type:"string"}}}}}}},
      historical:{type:"array",items:{type:"object",properties:{text:{type:"string"},sources:{type:"array",items:{type:"object",properties:{title:{type:"string"},url:{type:"string"}}}}}}},
      traditional:{type:"array",items:{type:"object",properties:{text:{type:"string"},sources:{type:"array",items:{type:"object",properties:{title:{type:"string"},url:{type:"string"}}}},authenticated:{type:"boolean"}}}},
      wafq:{type:"array",items:{type:"object",properties:{text:{type:"string"},sources:{type:"array",items:{type:"object",properties:{title:{type:"string"},url:{type:"string"}}}}}}},
      amal:{type:"array",items:{type:"object",properties:{text:{type:"string"},sources:{type:"array",items:{type:"object",properties:{title:{type:"string"},url:{type:"string"}}}}}}},
      esoteric:{type:"array",items:{type:"object",properties:{text:{type:"string"},sources:{type:"array",items:{type:"object",properties:{title:{type:"string"},url:{type:"string"}}}}}}}
    } },
    relationship_to_99_names: { type: "object", additionalProperties: true, properties: {
      relationship_type:{type:"string",enum:["identical","alternate_reading","same_root","same_meaning","closely_related","synonymous","scholarly_relation","none","foreign_equivalent","traditional_only"]},
      related_name_id:{type:"string"}, related_name_arabic:{type:"string"},
      evidence:{type:"string"},
      sources:{type:"array",items:{type:"object",properties:{title:{type:"string"},url:{type:"string"}}}}
    } },
    relationship_to_99_names_type: { type: "string", enum:["identical","alternate_reading","same_root","same_meaning","closely_related","synonymous","scholarly_relation","none","foreign_equivalent","traditional_only","unknown"] },
    review_notes: { type: "string" }
  },
  required: ["name_origin","verification_status","verification_confidence","verification_sources","relationship_to_99_names_type"]
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden — admin only" }, { status: 403 });

    const body = await req.json();
    const now = new Date().toISOString();
    const startedAt = Date.now();
    const TIME_BUDGET_MS = Number(body?.time_budget_ms || 100000);

    // Resolve target names
    let targets: any[] = [];
    if (body?.name_id) {
      const r = await base44.asServiceRole.entities.HolyNameKnowledge.filter({ name_id: String(body.name_id) }, null, 1);
      targets = (r || []).filter((x:any)=>x.record_class==="occult_section_a");
    } else {
      const rc = String(body?.record_class || "occult_section_a");
      const limit = Math.max(1, Math.min(Number(body?.limit || 5), 20));
      const flt: any = { record_class: rc };
      if (body?.only_status) flt.verification_status = String(body.only_status);
      const r = await base44.asServiceRole.entities.HolyNameKnowledge.filter(flt, "order_index", limit);
      targets = r || [];
    }
    if (targets.length === 0) return Response.json({ status: "ok", message: "no targets", processed: 0 });

    const CONCURRENCY = 8;
    const processOne = async (rec: any) => {
      try {
        const llm: any = await base44.asServiceRole.integrations.Core.InvokeLLM({
          model: "gemini_3_1_pro",
          add_context_from_internet: true,
          prompt: `You are an expert in classical Arabic linguistics, Semitic philology (Hebrew/Syriac/Aramaic), Islamic theology, and the occult manuscript tradition. You are auditing ONE name from the "Book of Deadly Names - Appendix of Magical Names" (a classical occult manuscript that transliterates many Divine/angelic names of Hebrew/Syriac origin into Arabic).

NAME UNDER AUDIT:
- Arabic (as printed, with harakat): ${rec.arabic_name}
- Arabic plain: ${rec.arabic_normalized}
- Transliteration: ${rec.transliteration}
- Occult source: ${rec.occult_source_ref}

STRICT RULES — violating any rule makes the output worthless:
1. Determine the name's REAL linguistic origin FIRST (hebrew/syriac/aramaic/arabic/mixed/unknown). Many names here are Hebrew/Syriac Divine Names transliterated into Arabic (e.g. أَهْيَا=Eheyeh, أَدُونِي=Adonai, صَبَاوُت=Sabaoth, أَلْ شَدَاي=El Shaddai, أَلُوهِيم=Elohim). State the original-language form in etymology.
2. Verify the Arabic spelling AND every harakah/hamza/madd/shaddah/sukoon/tanween/wasl-qat' against AUTHORITATIVE sources FOR THAT ORIGIN. For Arabic names use Lisan al-Arab, Taj al-Arus, Al-Mu'jam al-Waseet, Lane's Lexicon, Quranic Arabic Corpus, Tanzil, King Fahd Quran Complex. For Hebrew/Syriac names use Hebrew/Syriac lexicons AND the occult manuscript itself.
3. NEVER guess or invent any harakah. If no authoritative source attests a vowelized reading, leave canonical_arabic and fully_vowelized_name EMPTY and set verification_status to "not_in_classical_sources" (foreign name, no classical Arabic source) or "needs_review" (uncertain).
4. If authoritative sources AGREE (>=2 independent reliable sources), set verification_status="verified", harakat_verified=true, verification_confidence 80-100 based on source strength.
5. If sources DISAGREE on spelling or harakat, put EVERY variant in alternative_readings (each with its source), flag the preferred scholarly reading, set verification_status="conflicting_sources", harakat_verified=false.
6. NEVER fabricate Islamic knowledge. Fill islamic_knowledge (tafsir_refs, hadith_refs, quran_verses, authentic_duas, authentic_adhkar, scholarly_explanation) ONLY when the name genuinely appears in the Qur'an, Hadith, or classical tafsir. For Hebrew/Syriac names absent from Islamic sources, leave ALL islamic_knowledge fields EMPTY — do NOT invent tafsir/hadith/duas.
7. For traditional practices (wafq/amal/dua/hizb/dhikr) found in occult manuscripts, store them in traditional_practices with authenticated=false and note="Traditional Manuscript Reference (Not authenticated)" UNLESS a verified manuscript confirms them. Never present traditional occult material as established Islamic fact.
8. Every verification_source MUST have a real title (and author/page/url where available) and a reliability_score (1-100: 90+ for Lisan al-Arab/Taj al-Arus/Quranic Corpus/King Fahd; 70-89 for established academic lexicons; 40-69 for the occult manuscript; <40 for blogs/forums which you must NOT use). Do not cite sources you cannot actually identify.
9. linguistic fields: fill root_letters/arabic_root/morphological_pattern/literal_meaning/lexical_meaning/classical_explanation/grammar_notes ONLY for names with a real Arabic root; leave empty for foreign transliterations. quranic_usage/hadith_usage empty unless the name is actually in the Qur'an/Hadith.
10. review_notes: briefly explain any uncertainty or why review is needed.

DEEP RESEARCH PROFILE (perform the widest possible reliable search across classical Arabic lexicons, Islamic references, academic publications, manuscript catalogues, historical sources, linguistic resources, and trusted scholarly websites):
11. alternative_spellings: every alternative SPELLING attested (distinct from vocalizations), each with source.
12. original_source_word: the original word in its source language (Hebrew/Syriac/Aramaic/Persian) when this is a transliteration; empty for native Arabic.
13. research_profile: { historical_background, pronunciation_guide, classical_dict_refs[], academic_refs[], manuscript_refs[], earliest_occurrence, related_historical_usage, linguistic_explanation, root_meaning, literal_meaning }. Fill each ONLY from reliable sources; empty/"Not Verified" when unsupported.
14. meanings: separated meanings { arabic, malayalam, english, original, symbolic, historical, traditional }. symbolic ONLY when sourced. malayalam = detailed Malayalam meaning.
15. benefits: source-supported benefits by category { authentic_islamic[], linguistic[], historical[], traditional[], wafq[], amal[], esoteric[] }. Each entry { text, sources[], authenticated }. authentic_islamic ONLY from Qur'an/Hadith/classical scholars (authenticated=true). traditional/wafq/amal/esoteric = traditional/occult material with authenticated=false and text noting "Traditional/Historical/Not Authenticated as Islamic Teaching". NEVER mix traditional occult material with authenticated Islamic teachings.

RELATIONSHIP TO THE 99 NAMES OF ALLAH:
16. relationship_to_99_names: determine with evidence whether this name relates to the canonical 99 Names of Allah. relationship_type is ONE of: identical | alternate_reading | same_root | same_meaning | closely_related | synonymous | scholarly_relation | none | foreign_equivalent | traditional_only. If a relationship exists, set related_name_id (e.g. "HNK-001"), related_name_arabic, and explain evidence. If NO authentic relationship exists, set relationship_type="none" and state that clearly with evidence. relationship_to_99_names_type must equal relationship_type (use "unknown" only if you cannot determine it — never guess).

SOURCE REQUIREMENTS (mandatory): every statement must carry source attribution (title, author/book, page, url when available) inside the relevant sources array or verification_sources. reliability_score 1-100 (90+ Lisan al-Arab/Taj al-Arus/Quranic Corpus/King Fahd; 70-89 established academic lexicons; 40-69 occult manuscript; <40 blogs/forums which you MUST NOT use). If multiple scholars disagree, store every opinion separately with attribution — never force a single conclusion.

UNKNOWN INFORMATION: if no reliable source exists for a field, leave it empty or set "Not Verified". NEVER generate speculative explanations.

Return ONLY the JSON object matching the schema. Empty strings/arrays where a field does not apply — never fabricated.`,
          response_json_schema: SCHEMA,
        });

        // Defensive: InvokeLLM returns a dict when schema is set.
        const out: any = llm && (llm as any).name_origin !== undefined ? llm : (llm?.output || llm);
        if (!out || !out.verification_status) throw new Error("LLM returned no verification");

        const update: any = {
          name_origin: out.name_origin || "unknown",
          etymology: out.etymology || "",
          canonical_arabic: out.canonical_arabic || "",
          fully_vowelized_name: out.fully_vowelized_name || "",
          alternative_readings: Array.isArray(out.alternative_readings) ? out.alternative_readings : [],
          harakat_verified: !!out.harakat_verified,
          verification_status: out.verification_status,
          verification_confidence: Number(out.verification_confidence || 0),
          verification_sources: Array.isArray(out.verification_sources) ? out.verification_sources : [],
          last_verified_date: now,
          linguistic: out.linguistic || {},
          islamic_knowledge: out.islamic_knowledge || {},
          traditional_practices: Array.isArray(out.traditional_practices) ? out.traditional_practices : [],
          alternative_spellings: Array.isArray(out.alternative_spellings) ? out.alternative_spellings : [],
          original_source_word: out.original_source_word || "",
          research_profile: out.research_profile || {},
          meanings: out.meanings || {},
          benefits: out.benefits || {},
          relationship_to_99_names: out.relationship_to_99_names || {},
          relationship_to_99_names_type: out.relationship_to_99_names_type || (out.relationship_to_99_names && out.relationship_to_99_names.relationship_type) || "unknown",
          review_notes: out.review_notes || "",
        };
        await base44.asServiceRole.entities.HolyNameKnowledge.update(rec.id, update);

        return {
          name_id: rec.name_id, arabic: rec.arabic_name, transliteration: rec.transliteration,
          origin: update.name_origin, status: update.verification_status,
          confidence: update.verification_confidence, sources: update.verification_sources.length,
          has_canonical: !!update.canonical_arabic, alternatives: update.alternative_readings.length,
          islamic_info: Object.keys(update.islamic_knowledge||{}).filter(k=>update.islamic_knowledge[k] && (Array.isArray(update.islamic_knowledge[k])?update.islamic_knowledge[k].length:update.islamic_knowledge[k])).length,
          traditional: update.traditional_practices.length,
        };
      } catch (e: any) {
        return { name_id: rec.name_id, arabic: rec.arabic_name, error: String(e?.message||e) };
      }
    };

    const results: any[] = [];
    for (let i = 0; i < targets.length; i += CONCURRENCY) {
      if ((Date.now() - startedAt) >= TIME_BUDGET_MS) break;
      const chunk = targets.slice(i, i + CONCURRENCY);
      const chunkRes = await Promise.all(chunk.map(processOne));
      results.push(...chunkRes);
    }

    return Response.json({
      status: "ok",
      processed: results.length,
      requested: targets.length,
      time_elapsed_ms: Date.now() - startedAt,
      results,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});