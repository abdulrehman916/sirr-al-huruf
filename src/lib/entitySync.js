/**
 * Entity Sync — Automatic Entity Registry Registration
 *
 * Synchronizes entities from entityManifest (source of truth) to EntityRegistry
 * database records. Ensures every entity automatically appears in:
 *   - Admin Entity Manager
 *   - Analytics entity selectors
 *   - Audit log entity selectors
 *   - Permission management
 *
 * Safe operations only — never overwrites admin-customized fields, never deletes
 * records (archives instead). See syncEntityRegistry backend function for details.
 */
import { base44 } from '@/api/base44Client';
import { buildEntitySyncList } from '@/lib/entityRegistry';

let syncInProgress = false;
let lastSyncResult = null;
let lastSyncAt = null;

/**
 * Sync entities to EntityRegistry database.
 * Fire-and-forget safe: never throws, returns result object.
 * @param {boolean} force
 * @returns {Promise<object>}
 */
export async function syncEntities(force = false) {
  if (syncInProgress && !force) {
    return { success: false, skipped: true, reason: 'sync_in_progress' };
  }

  try {
    syncInProgress = true;
    const entities = buildEntitySyncList();

    if (entities.length === 0) {
      lastSyncResult = { success: true, created: 0, updated: 0, archived: 0, reactivated: 0, unchanged: 0, total: 0 };
      lastSyncAt = new Date().toISOString();
      return lastSyncResult;
    }

    const response = await base44.functions.invoke('syncEntityRegistry', { entities });
    const data = response?.data || response;

    lastSyncResult = {
      success: data?.success !== false,
      created: data?.created || 0,
      updated: data?.updated || 0,
      archived: data?.archived || 0,
      reactivated: data?.reactivated || 0,
      unchanged: data?.unchanged || 0,
      total: data?.total_entities || entities.length,
    };
    lastSyncAt = new Date().toISOString();
    return lastSyncResult;
  } catch (error) {
    lastSyncResult = { success: false, error: error.message };
    lastSyncAt = new Date().toISOString();
    return lastSyncResult;
  } finally {
    syncInProgress = false;
  }
}

export function getLastEntitySyncResult() {
  return { result: lastSyncResult, timestamp: lastSyncAt };
}

export function isEntitySyncInProgress() {
  return syncInProgress;
}