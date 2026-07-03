import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * Redeem an access code without requiring auth.
 * Uses a guest session_id (UUID from localStorage) as the user identifier.
 *
 * Supports per-feature plan durations via `feature_durations`:
 *   Each feature gets its own expiry based on its selected plan.
 *   The page-level expiry is set to the LATEST feature expiry (or null if any is lifetime).
 *
 * Input:  { code: string, session_id: string }
 * Output: { success, message, pages_granted, permissions }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { code, session_id } = await req.json();

    if (!code || typeof code !== "string") {
      return Response.json({ success: false, message: "Code is required" }, { status: 400 });
    }
    if (!session_id || typeof session_id !== "string") {
      return Response.json({ success: false, message: "Session ID is required" }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    // Look up code
    const codes = await base44.asServiceRole.entities.AccessCode.filter({ code: normalizedCode }, null, 1);
    if (!codes || codes.length === 0) {
      return Response.json({ success: false, message: "Invalid code. Please check and try again." });
    }

    const accessCode = codes[0];

    if (accessCode.is_disabled) {
      const nowISO = new Date().toISOString();
      await base44.asServiceRole.entities.AccessCode.update(accessCode.id, {
        audit_log: [...(accessCode.audit_log || []), {
          action: "REJECTED_DISABLED",
          timestamp: nowISO,
          admin_id: "system",
          details: `Attempt by User/Device: ${session_id.slice(0, 16)} — Result: Rejected — Code Disabled`,
        }],
      });
      return Response.json({ success: false, message: "This code has been disabled." });
    }

    // Expired code check — never unlock any page
    if (accessCode.expiry_date && new Date(accessCode.expiry_date) < new Date()) {
      const nowISOExp = new Date().toISOString();
      await base44.asServiceRole.entities.AccessCode.update(accessCode.id, {
        audit_log: [...(accessCode.audit_log || []), {
          action: "REJECTED_EXPIRED",
          timestamp: nowISOExp,
          admin_id: "system",
          details: `Attempt by User/Device: ${session_id.slice(0, 16)} — Result: Rejected — Code Expired`,
        }],
      });
      return Response.json({ success: false, message: "This code has expired." });
    }

    // Device binding: once redeemed, only the original device/session can use this code
    if (accessCode.device_id && accessCode.device_id !== session_id) {
      const nowISORej = new Date().toISOString();
      await base44.asServiceRole.entities.AccessCode.update(accessCode.id, {
        audit_log: [...(accessCode.audit_log || []), {
          action: "REJECTED_ALREADY_REDEEMED",
          timestamp: nowISORej,
          admin_id: "system",
          details: `Attempt by User ID: ${session_id.slice(0, 16)}, Device ID: ${session_id.slice(0, 16)} — Result: Rejected - Already Redeemed`,
        }],
      });
      return Response.json({ success: false, message: "This Access Code has already been redeemed and cannot be used again." });
    }

    const maxUses = accessCode.max_uses || 1;
    const useCount = accessCode.use_count || 0;

    // Build permissions from code data (shared by both first-redeem and re-download paths)
    const pagePaths = accessCode.page_paths || [];
    const pageNames = accessCode.page_names || [];
    const pageDurations = accessCode.page_durations || {};
    const featureDurations = accessCode.feature_durations || {};
    const subFeaturesMap = accessCode.sub_features || {};

    const buildPermissions = (baseTime: Date, grantedAt: string, isRedownload: boolean) => {
      return pagePaths.map((path: string, i: number) => {
        const pageDur = pageDurations[path];
        const pageSubFeats = subFeaturesMap[path] || [];

        // Per-page base time: on re-download, use added_at if present (pages added after initial redemption)
        const pageBaseTime = (isRedownload && pageDur?.added_at) ? new Date(pageDur.added_at) : baseTime;

        // Page-level expiry from page_durations
        let pageExpiry: string | null = null;
        if (pageDur) {
          if (pageDur.value === "LIFETIME") {
            pageExpiry = null;
          } else if (pageDur.value === "CUSTOM" && pageDur.custom_date) {
            pageExpiry = new Date(pageDur.custom_date).toISOString();
          } else if (pageDur.duration_ms) {
            pageExpiry = new Date(pageBaseTime.getTime() + pageDur.duration_ms).toISOString();
          } else if (pageDur.days) {
            pageExpiry = new Date(pageBaseTime.getTime() + pageDur.days * 86400000).toISOString();
          }
        }

        // Per-feature expiries from feature_durations
        const featureExpiries: Record<string, { expiry_date: string | null; plan_name: string }> = {};
        let latestFeatureExpiry: string | null = null;
        let hasLifetimeFeature = false;

        pageSubFeats.forEach((featId: string) => {
          const featKey = `${path}:${featId}`;
          const featDur = featureDurations[featKey];
          if (featDur) {
            // Per-feature base time: on re-download, use added_at if present (features added after initial redemption)
            const featBaseTime = (isRedownload && featDur.added_at) ? new Date(featDur.added_at) : baseTime;
            if (featDur.is_lifetime) {
              featureExpiries[featId] = { expiry_date: null, plan_name: featDur.plan_name || "Lifetime" };
              hasLifetimeFeature = true;
            } else if (featDur.duration_ms) {
              const featExpiry = new Date(featBaseTime.getTime() + featDur.duration_ms).toISOString();
              featureExpiries[featId] = { expiry_date: featExpiry, plan_name: featDur.plan_name || "Plan" };
              if (!latestFeatureExpiry || new Date(featExpiry) > new Date(latestFeatureExpiry)) {
                latestFeatureExpiry = featExpiry;
              }
            } else if (featDur.duration_days) {
              const featExpiry = new Date(featBaseTime.getTime() + featDur.duration_days * 86400000).toISOString();
              featureExpiries[featId] = { expiry_date: featExpiry, plan_name: featDur.plan_name || "Plan" };
              if (!latestFeatureExpiry || new Date(featExpiry) > new Date(latestFeatureExpiry)) {
                latestFeatureExpiry = featExpiry;
              }
            }
          }
        });

        // Determine final page-level expiry
        const hasFeatureDurations = Object.keys(featureExpiries).length > 0;
        let finalPageExpiry: string | null;
        if (hasFeatureDurations) {
          finalPageExpiry = hasLifetimeFeature ? null : latestFeatureExpiry;
        } else {
          finalPageExpiry = pageExpiry;
        }

        return {
          page_path: path,
          page_name: pageNames[i] || path,
          expiry_date: finalPageExpiry,
          granted_at: grantedAt,
          sub_features: pageSubFeats.length > 0 ? pageSubFeats : null,
          feature_expiries: hasFeatureDurations ? featureExpiries : null,
        };
      });
    };

    // Check if this session already used this code (re-download)
    if (accessCode.used_by_user_id === session_id) {
      // Even for the original device, reject if the code-level expiry has passed
      if (accessCode.expiry_date && new Date(accessCode.expiry_date) < new Date()) {
        return Response.json({ success: false, message: "This code has expired." });
      }
      const usedAt = accessCode.used_at ? new Date(accessCode.used_at) : new Date();
      const permissions = buildPermissions(usedAt, accessCode.used_at || new Date().toISOString(), true);
      return Response.json({
        success: true,
        message: `Access restored to ${pagePaths.length} page(s)!`,
        pages_granted: pagePaths.map((p: string, i: number) => ({ path: p, name: pageNames[i] || p })),
        permissions,
        already_used: true
      });
    }

    if (useCount >= maxUses) {
      const nowISORej2 = new Date().toISOString();
      await base44.asServiceRole.entities.AccessCode.update(accessCode.id, {
        audit_log: [...(accessCode.audit_log || []), {
          action: "REJECTED_ALREADY_REDEEMED",
          timestamp: nowISORej2,
          admin_id: "system",
          details: `Attempt by User ID: ${session_id.slice(0, 16)}, Device ID: ${session_id.slice(0, 16)} — Result: Rejected - Already Redeemed`,
        }],
      });
      return Response.json({ success: false, message: "This Access Code has already been redeemed and cannot be used again." });
    }

    const now = new Date();
    const nowISO = now.toISOString();
    const permissions = buildPermissions(now, nowISO, false);

    // Mark code as used + bind to device
    await base44.asServiceRole.entities.AccessCode.update(accessCode.id, {
      use_count: useCount + 1,
      used_by_user_id: session_id,
      used_by_email: "guest:" + session_id.slice(0, 16),
      used_at: nowISO,
      device_id: session_id,
      audit_log: [...(accessCode.audit_log || []), { action: "REDEEMED", timestamp: nowISO, admin_id: "system", details: `Redeemed by device: ${session_id.slice(0, 16)}` }],
    });

    return Response.json({
      success: true,
      message: `Access granted to ${pagePaths.length} page(s)!`,
      pages_granted: pagePaths.map((p: string, i: number) => ({ path: p, name: pageNames[i] || p })),
      permissions,
    });

  } catch (error) {
    return Response.json({ success: false, message: error.message || "Redemption failed" }, { status: 500 });
  }
});