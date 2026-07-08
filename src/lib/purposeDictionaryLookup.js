// ═══════════════════════════════════════════════════════════════
// PURPOSE DICTIONARY LOOKUP — Client-side helper
// ═══════════════════════════════════════════════════════════════
// Calls the backend autoLearnPurpose function: checks the dictionary first,
// and if no match exists, auto-generates + saves a new entry (self-learning).
// Returns { matched: boolean, ritualIntent?: string, auto_learned?: boolean }.
// Never exposes dictionary contents to the client.
//
// ── PERMANENT ISOLATION LAW ──
// This helper is the ONLY client-side reader of PurposeDictionary.
// It is READ ONLY, returns at most ONE normalized key or {matched:false},
// and must NEVER modify any workflow, trigger any calculation, or
// influence any Mizan other than injecting a purpose key into the
// existing 7th-Mizan selections. See purposeDictionaryIsolationLaw.js.
// ═══════════════════════════════════════════════════════════════
import { base44 } from "@/api/base44Client";
import "@/lib/purposeDictionaryIsolationLaw";

export async function lookupPurposeIntent(customPurpose, selectedAction) {
  if (!customPurpose || !customPurpose.trim()) {
    return { matched: false };
  }
  try {
    // Calls autoLearnPurpose: checks dictionary first (via lookupPurposeIntent),
    // auto-creates a new entry if no match, then returns the stored meaning.
    // This ensures the dictionary is the permanent source of truth and
    // grows automatically with every new purpose.
    const response = await base44.functions.invoke("autoLearnPurpose", {
      customPurpose,
      selectedAction,
    });
    return response.data || { matched: false };
  } catch {
    return { matched: false };
  }
}