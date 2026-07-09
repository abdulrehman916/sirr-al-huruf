// ═══════════════════════════════════════════════════════════════
// MANUSCRIPT LIBRARY SYNC — DATABASE ↔ SIRR KNOWLEDGE STRUCTURE
// ═══════════════════════════════════════════════════════════════
// Fetches ManuscriptBook and ManuscriptEntry records from the
// database and merges them into the existing static Sirr knowledge
// structure. Database entries appear alongside static manuscript
// data, grouped by section → topic → method (by book).
// ═══════════════════════════════════════════════════════════════
import { base44 } from "@/api/base44Client";

// ── Fetch all ManuscriptBook records ──
export async function fetchManuscriptBooks() {
  try {
    const books = await base44.entities.ManuscriptBook.list("-created_date", 500);
    return books || [];
  } catch {
    return [];
  }
}

// ── Fetch all ManuscriptEntry records ──
export async function fetchManuscriptEntries() {
  try {
    const entries = await base44.entities.ManuscriptEntry.list("-created_date", 500);
    return entries || [];
  } catch {
    return [];
  }
}

// ── Merge database entries into the static Sirr knowledge structure ──
export function mergeEntriesIntoStructure(structure, entries) {
  if (!entries || entries.length === 0) return structure;

  // Deep copy the structure
  const merged = JSON.parse(JSON.stringify(structure));

  // For each database entry, add it to the appropriate section/topic
  entries.forEach((entry) => {
    const section = merged.sections.find((s) => s.id === entry.sirr_section);
    if (!section) return;

    // Find or create the topic
    const topicKey = entry.topic || "General";
    let topic = section.topics.find((t) => t.topic_key === topicKey);
    if (!topic) {
      topic = {
        id: `sirr${section.id}_db_${topicKey.replace(/\s+/g, "_").toLowerCase()}`,
        topic_key: topicKey,
        topic_en: entry.topic || entry.purpose || "Unknown",
        topic_ml: entry.topic_ml || entry.topic || "",
        topic_ar: entry.topic_ar || "",
        methods: [],
      };
      section.topics.push(topic);
    }

    // Add the method (from database)
    topic.methods.push({
      id: entry.entry_id,
      type: entry.entry_type,
      book_name: entry.book_title,
      book_name_ar: entry.book_title_ar || "",
      page_number: entry.page_number,
      purpose: entry.purpose || "",
      purpose_ml: entry.purpose_ml || entry.malayalam_meaning || "",
      purpose_en: entry.english_meaning || entry.purpose || "",
      arabic_text: entry.arabic_text || "",
      introduction: entry.introduction || "",
      conditions: entry.conditions || "",
      materials: entry.materials || "",
      preparation: entry.preparation || "",
      procedure: entry.procedure || "",
      timing: entry.timing || "",
      planet: entry.planet || "",
      day: entry.day || "",
      incense: entry.incense || "",
      repetition: entry.repetition || "",
      warnings: entry.warnings || "",
      benefits: entry.benefits || "",
      notes: entry.notes || "",
      malayalam_meaning: entry.malayalam_meaning || "",
      english_meaning: entry.english_meaning || "",
      images: entry.images || [],
      verified_arabic_hash: entry.verified_arabic_hash || "",
      source: "database",
    });

    // Update section counts
    section.topic_count = section.topics.length;
    section.method_count = section.topics.reduce((s, t) => s + t.methods.length, 0);
  });

  // Re-sort topics in each section
  merged.sections.forEach((s) => {
    s.topics.sort((a, b) => a.topic_en.localeCompare(b.topic_en));
  });

  return merged;
}