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

    // Compute new expiry + duration values for ALL types
    const multipliers: Record<string, number> = {
      MINUTES: 60000, HOURS: 3600000, DAYS: 86400000,
      WEEKS: 604800000, MONTHS: 2592000000, YEARS: 31536000000,
    };

    let newExpiry: string | null = null;
    let durationMs: number | null = null;
    let durationDays: number | null = null;
    let isLifetime = false;
    let label = '';

    if (duration_type === 'LIFETIME') {
      isLifetime = true;
      newExpiry = null;
      label = 'Lifetime';
    } else if (duration_type === 'CUSTOM' && custom_date) {
      newExpiry = new Date(custom_date).toISOString();
      durationMs = new Date(custom_date).getTime() - Date.now();
      durationDays = Math.ceil(durationMs / 86400000);
      label = 'Custom';
    } else {
      const ms = multipliers[duration_type] || 86400000;
      durationMs = (parseInt(duration_count) || 0) * ms;
      durationDays = Math.ceil(durationMs / 86400000);
      newExpiry = new Date(Date.now() + durationMs).toISOString();
      const typeLabel = duration_type.charAt(0) + duration_type.slice(1).toLowerCase();
      label = `${duration_count} ${typeLabel}`;
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
      details: `Renewed: ${label} → ${newExpiry || 'Lifetime'}`,
    };

    // Update page_durations — all pages get the new duration
    const updatedPageDurations: Record<string, any> = {};
    for (const path of (code.page_paths || [])) {
      updatedPageDurations[path] = {
        value: "RENEWED",
        label: label,
        days: isLifetime ? null : durationDays,
        duration_ms: isLifetime ? null : durationMs,
        custom_date: duration_type === 'CUSTOM' ? custom_date : null,
      };
    }

    // Update feature_durations — all features get the new duration
    const updatedFeatureDurations: Record<string, any> = {};
    const subFeatures = code.sub_features || {};
    for (const [pagePath, featIds] of Object.entries(subFeatures)) {
      for (const featId of (featIds as string[] || [])) {
        updatedFeatureDurations[`${pagePath}:${featId}`] = {
          plan_name: label + ' (Renewed)',
          duration_days: isLifetime ? null : durationDays,
          duration_ms: isLifetime ? null : durationMs,
          is_lifetime: isLifetime,
        };
      }
    }

    await base44.asServiceRole.entities.AccessCode.update(code_id, {
      expiry_date: newExpiry,
      is_disabled: false, // Re-enable on renew
      page_durations: updatedPageDurations,
      feature_durations: updatedFeatureDurations,
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