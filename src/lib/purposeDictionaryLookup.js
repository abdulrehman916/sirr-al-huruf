// ═══════════════════════════════════════════════════════════════
// PURPOSE DICTIONARY LOOKUP — Client-side helper
// ═══════════════════════════════════════════════════════════════
// Calls the backend lookupPurposeIntent function silently.
// Returns { matched: boolean, ritualIntent?: string }.
// Never exposes dictionary contents to the client.
// ═══════════════════════════════════════════════════════════════
import { base44 } from "@/api/base44Client";

export async function lookupPurposeIntent(customPurpose, selectedAction) {
  if (!customPurpose || !customPurpose.trim()) {
    return { matched: false };
  }
  try {
    const response = await base44.functions.invoke("lookupPurposeIntent", {
      customPurpose,
      selectedAction,
    });
    return response.data || { matched: false };
  } catch {
    return { matched: false };
  }
}