import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * Delete a Reading Access Code securely.
 * Appends a DELETED audit entry before deletion, then deletes the record.
 * Client-side validateAndCleanPermissions removes localStorage permissions for
 * deleted codes on the user's next page load.
 *
 * Stabilization:
 *  - P3.7: Validates code_id.
 *  - P4.9: Writes a centralized AuditLog entry (revocation is logged centrally).
 *
 * Input:  { code_id }
 * Output: { success, message }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { code_id } = body;

    // ── P3.7: Input validation ──
    if (!code_id || typeof code_id !== 'string') {
      return Response.json({ error: 'code_id required' }, { status: 400 });
    }

    const code = await base44.asServiceRole.entities.AccessCode.get(code_id);
    if (!code) return Response.json({ error: 'Code not found' }, { status: 404 });

    const now = new Date().toISOString();

    // Append DELETED audit entry before deletion
    const auditEntry = {
      action: 'DELETED',
      timestamp: now,
      admin_id: user.id,
      details: `Code deleted by admin. All permissions revoked.`,
    };

    await base44.asServiceRole.entities.AccessCode.update(code_id, {
      audit_log: [...(code.audit_log || []), auditEntry],
    });

    // ── P4.9: Centralized audit log (revocation) ──
    try {
      await base44.asServiceRole.entities.AuditLog.create({
        log_id: 'AUDIT-' + crypto.randomUUID().toUpperCase(),
        action_type: 'ACCESS_CODE_DELETED',
        performed_by: user.id,
        performed_by_email: user.email || '',
        target_entity: 'AccessCode',
        target_id: code.code || code_id,
        details: JSON.stringify({ code_id, customer: code.customer_name || null, revoked_permissions: (code.page_paths || []).length }),
        timestamp: now,
      });
    } catch { /* best-effort */ }

    // Now delete the code
    await base44.asServiceRole.entities.AccessCode.delete(code_id);

    return Response.json({
      success: true,
      message: `Code "${code.code}" deleted. All permissions revoked.`,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});