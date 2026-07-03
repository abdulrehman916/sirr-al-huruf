import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * Renew an access code — updates expiry, appends to renewal_history + audit_log.
 * Re-enables the code if it was disabled.
 *
 * Input:  { code_id, duration_type, duration_count, custom_date, notes }
 * Output: { success, message, new_expiry }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { code_id, duration_type, duration_count, custom_date, notes } = await req.json();
    if (!code_id) return Response.json({ error: 'code_id required' }, { status: 400 });

    const code = await base44.asServiceRole.entities.AccessCode.get(code_id);
    if (!code) return Response.json({ error: 'Code not found' }, { status: 404 });

    // Compute new expiry
    let newExpiry: string | null = null;
    if (duration_type === 'LIFETIME') {
      newExpiry = null;
    } else if (duration_type === 'CUSTOM' && custom_date) {
      newExpiry = new Date(custom_date).toISOString();
    } else {
      const multipliers: Record<string, number> = {
        MINUTES: 60000, HOURS: 3600000, DAYS: 86400000,
        WEEKS: 604800000, MONTHS: 2592000000, YEARS: 31536000000,
      };
      const ms = multipliers[duration_type] || 86400000;
      newExpiry = new Date(Date.now() + (parseInt(duration_count) || 0) * ms).toISOString();
    }

    const oldExpiry = code.expiry_date;
    const now = new Date().toISOString();

    const renewalEntry = {
      renewed_at: now,
      renewed_by: user.id,
      old_expiry: oldExpiry || null,
      new_expiry: newExpiry,
      duration_type: duration_type || 'DAYS',
      duration_count: duration_count ? parseInt(duration_count) : null,
      notes: notes || null,
    };

    const auditEntry = {
      action: 'RENEWED',
      timestamp: now,
      admin_id: user.id,
      details: `Renewed: ${duration_type}${duration_count ? ' ' + duration_count : ''} → ${newExpiry || 'Lifetime'}`,
    };

    await base44.asServiceRole.entities.AccessCode.update(code_id, {
      expiry_date: newExpiry,
      is_disabled: false, // Re-enable on renew
      renewal_history: [...(code.renewal_history || []), renewalEntry],
      audit_log: [...(code.audit_log || []), auditEntry],
    });

    return Response.json({
      success: true,
      message: 'Code renewed successfully',
      new_expiry: newExpiry,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});