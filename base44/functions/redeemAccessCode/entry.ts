import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Auth required
    const user = await base44.auth.me();
    if (!user) return Response.json({ success: false, message: "Authentication required" }, { status: 401 });

    const { code } = await req.json();
    if (!code || typeof code !== "string") {
      return Response.json({ success: false, message: "Code is required" }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    // Find the code (admin-level read needed — service role)
    const codes = await base44.asServiceRole.entities.AccessCode.filter({ code: normalizedCode }, null, 1);
    if (!codes || codes.length === 0) {
      return Response.json({ success: false, message: "Invalid code. Please check and try again." });
    }

    const accessCode = codes[0];

    // Check disabled
    if (accessCode.is_disabled) {
      return Response.json({ success: false, message: "This code has been disabled." });
    }

    // Check expiry
    if (accessCode.expiry_date && new Date(accessCode.expiry_date) < new Date()) {
      return Response.json({ success: false, message: "This code has expired." });
    }

    // Single-use binding: if already used, only the original user can re-redeem (e.g. on a new device)
    // Other users are blocked
    const maxUses = accessCode.max_uses || 1;
    const useCount = accessCode.use_count || 0;

    if (useCount >= maxUses) {
      // Single-use: check if it's the same user
      if (accessCode.used_by_user_id && accessCode.used_by_user_id !== user.id) {
        return Response.json({ success: false, message: "This code has already been used by another account." });
      }
      if (accessCode.used_by_user_id && accessCode.used_by_user_id === user.id) {
        return Response.json({ success: false, message: "You have already redeemed this code." });
      }
      return Response.json({ success: false, message: "This code has already been used." });
    }

    // Multi-use: if already bound to a different user, block
    if (maxUses === 1 && accessCode.used_by_user_id && accessCode.used_by_user_id !== user.id) {
      return Response.json({ success: false, message: "This code has already been used by another account." });
    }

    // Grant PagePermission for each page
    const now = new Date().toISOString();
    const pagePaths = accessCode.page_paths || [];
    const pageNames = accessCode.page_names || [];
    const grantedPages = [];

    for (let i = 0; i < pagePaths.length; i++) {
      const pagePath = pagePaths[i];
      const pageName = pageNames[i] || pagePath;

      // Derive permission code from path
      const permCode = pagePath.replace(/^\//, "").replace(/-/g, "_").toUpperCase() + "_ACCESS";

      // Check if user already has active permission for this page
      const existing = await base44.asServiceRole.entities.PagePermission.filter({
        user_id: user.id,
        page_path: pagePath,
        is_active: true,
        is_revoked: false
      }, null, 1);

      if (existing && existing.length > 0) {
        const perm = existing[0];
        const isExpired = perm.expiry_date && new Date(perm.expiry_date) < new Date();
        if (!isExpired) {
          // Already has valid access — skip but include in granted list
          grantedPages.push({ path: pagePath, name: pageName });
          continue;
        }
      }

      // Generate permission_id
      const permId = "PERM-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();

      await base44.asServiceRole.entities.PagePermission.create({
        permission_id: permId,
        user_id: user.id,
        page_path: pagePath,
        page_name: pageName,
        permission_code: permCode,
        granted_by: "ACCESS_CODE",
        granted_at: now,
        start_date: now,
        expiry_date: accessCode.expiry_date || null,
        is_active: true,
        is_revoked: false,
        notes: `Granted via access code: ${normalizedCode}`
      });

      grantedPages.push({ path: pagePath, name: pageName });
    }

    // Update code usage
    const updateData = {
      use_count: useCount + 1,
    };
    // Bind to first user on first use
    if (useCount === 0) {
      updateData.used_by_user_id = user.id;
      updateData.used_by_email = user.email;
      updateData.used_at = now;
    }

    await base44.asServiceRole.entities.AccessCode.update(accessCode.id, updateData);

    return Response.json({
      success: true,
      message: `Access granted to ${grantedPages.length} page(s)!`,
      pages_granted: grantedPages,
      expiry_date: accessCode.expiry_date || null,
      is_lifetime: !accessCode.expiry_date
    });

  } catch (error) {
    return Response.json({ success: false, message: error.message || "Redemption failed" }, { status: 500 });
  }
});