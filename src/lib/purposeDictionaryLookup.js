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

// In-memory lookup cache — prevents rate-limiting from rapid re-renders.
// Key: "customPurpose::selectedAction". Cleared on page reload.
const lookupCache = new Map();

export async function lookupPurposeIntent(customPurpose, selectedAction) {
  if (!customPurpose || !customPurpose.trim()) {
    return { matched: false };
  }
  const cacheKey = `${customPurpose}::${selectedAction || ""}`;
  if (lookupCache.has(cacheKey)) {
    return lookupCache.get(cacheKey);
  }
  try {
    const response = await base44.functions.invoke("autoLearnPurpose", {
      customPurpose,
      selectedAction,
    });
    const result = response.data || { matched: false };
    lookupCache.set(cacheKey, result);
    return result;
  } catch (err) {
    return { matched: false, _debug: { error: err?.message || "Request failed", lookupPath: "frontend_error" } };
  }
}