/**
 * Entity Audit Logger — Non-blocking audit trail for all entity CRUD operations.
 *
 * Logs to the existing AuditLog entity. Never throws — audit logging is
 * non-blocking and should never prevent a CRUD operation from completing.
 */
import { base44 } from '@/api/base44Client';

/**
 * Log an entity CRUD action to AuditLog.
 * @param {string} entityName — Target entity name
 * @param {string} actionType — ENTITY_CREATE | ENTITY_UPDATE | ENTITY_DELETE | ENTITY_EXPORT | ENTITY_IMPORT | ENTITY_ARCHIVE | ENTITY_RESTORE
 * @param {string|null} recordId — Affected record ID
 * @param {object} details — Additional context { old?, new?, count?, ... }
 */
export async function logEntityAction(entityName, actionType, recordId, details = {}) {
  try {
    const user = await base44.auth.me();
    await base44.entities.AuditLog.create({
      log_id: `ENT-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      action_type: actionType,
      performed_by: user?.id || 'system',
      performed_by_email: user?.email || 'system',
      target_entity: entityName,
      target_id: recordId || '',
      details: JSON.stringify(details).substring(0, 10000),
      timestamp: new Date().toISOString(),
    });
  } catch (_e) {
    // Non-blocking — never fail the operation
  }
}