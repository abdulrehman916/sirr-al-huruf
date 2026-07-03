import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * Redeem an access code without requiring auth.
 * Uses a guest session_id (UUID from localStorage) as the user identifier.
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
      return Response.json({ success: false, message: "This code has been disabled." });
    }

    const maxUses = accessCode.max_uses || 1;
    const useCount = accessCode.use_count || 0;

    // Check if this session already used this code
    if (accessCode.used_by_user_id === session_id) {
      // Already redeemed by this session — return existing permissions (re-download)
      const pagePaths = accessCode.page_paths || [];
      const pageNames = accessCode.page_names || [];
      const pageDurations = accessCode.page_durations || {};
      const permissions = pagePaths.map((path, i) => {
        const dur = pageDurations[path];
        let expiry_date = null;
        if (dur && dur.value !== "LIFETIME" && dur.days) {
          // Recalculate from original used_at
          const usedAt = accessCode.used_at ? new Date(accessCode.used_at) : new Date();
          expiry_date = new Date(usedAt.getTime() + dur.days * 86400000).toISOString();
        } else if (dur && dur.value === "CUSTOM" && dur.custom_date) {
          expiry_date = new Date(dur.custom_date).toISOString();
        }
        const subFeatures = accessCode.sub_features || {};
      return { page_path: path, page_name: pageNames[i] || path, expiry_date, sub_features: subFeatures[path] || null };
      });
      return Response.json({
        success: true,
        message: `Access restored to ${pagePaths.length} page(s)!`,
        pages_granted: pagePaths.map((p, i) => ({ path: p, name: pageNames[i] || p })),
        permissions,
        already_used: true
      });
    }

    if (useCount >= maxUses) {
      return Response.json({ success: false, message: "This code has already been used." });
    }

    const now = new Date();
    const nowISO = now.toISOString();
    const pagePaths = accessCode.page_paths || [];
    const pageNames = accessCode.page_names || [];
    const pageDurations = accessCode.page_durations || {};

    // Build permissions array with per-page expiry
    const permissions = pagePaths.map((path, i) => {
      const dur = pageDurations[path];
      let expiry_date = null;
      if (dur && dur.value !== "LIFETIME" && dur.days) {
        expiry_date = new Date(now.getTime() + dur.days * 86400000).toISOString();
      } else if (dur && dur.value === "CUSTOM" && dur.custom_date) {
        expiry_date = new Date(dur.custom_date).toISOString();
      }
      const subFeatures = accessCode.sub_features || {};
      return { page_path: path, page_name: pageNames[i] || path, expiry_date, granted_at: nowISO, sub_features: subFeatures[path] || null };
    });

    // Mark code as used
    await base44.asServiceRole.entities.AccessCode.update(accessCode.id, {
      use_count: useCount + 1,
      used_by_user_id: session_id,
      used_by_email: "guest:" + session_id.slice(0, 16),
      used_at: nowISO,
    });

    return Response.json({
      success: true,
      message: `Access granted to ${pagePaths.length} page(s)!`,
      pages_granted: pagePaths.map((p, i) => ({ path: p, name: pageNames[i] || p })),
      permissions,
    });

  } catch (error) {
    return Response.json({ success: false, message: error.message || "Redemption failed" }, { status: 500 });
  }
});