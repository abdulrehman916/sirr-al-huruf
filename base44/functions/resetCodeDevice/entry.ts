import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * Reset device binding for an access code.
 * Clears used_by_user_id, used_by_email, used_at, device_id.
 * Resets use_count to 0. Increments reset_count.
 * Appends RESET_DEVICE audit entry.
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

    const { code_id } = await req.json();
    if (!code_id) return Response.json({ error: 'code_id required' }, { status: 400 });

    const code = await base44.asServiceRole.entities.AccessCode.get(code_id);
    if (!code) return Response.json({ error: 'Code not found' }, { status: 404 });

    const now = new Date().toISOString();
    const auditEntry = {
      action: 'RESET_DEVICE',
      timestamp: now,
      admin_id: user.id,
      details: `Device binding reset. Previous device: ${code.device_id || 'none'}`,
    };

    await base44.asServiceRole.entities.AccessCode.update(code_id, {
      used_by_user_id: null,
      used_by_email: null,
      used_at: null,
      device_id: null,
      use_count: 0,
      reset_count: (code.reset_count || 0) + 1,
      audit_log: [...(code.audit_log || []), auditEntry],
    });

    return Response.json({
      success: true,
      message: 'Device binding reset. Code can now be redeemed on a new device.',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});