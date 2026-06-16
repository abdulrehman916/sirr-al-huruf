import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ is_vip: false }, { status: 200 });

    const { page_path } = await req.json();

    // Get user profile to find their phone/email
    const profiles = await base44.asServiceRole.entities.UserAccessProfile.filter({ user_id: user.id });
    const profile = profiles[0];

    // Collect user's email identifiers (normalised to lowercase)
    const emailIdentifiers = [];
    if (user.email) emailIdentifiers.push(user.email.toLowerCase().trim());
    if (profile?.email) emailIdentifiers.push(profile.email.toLowerCase().trim());

    // Collect user's phone identifiers (preserve original formatting for phone matching)
    const phoneIdentifiers = [];
    if (profile?.mobile) phoneIdentifiers.push(profile.mobile.trim());

    if (emailIdentifiers.length === 0 && phoneIdentifiers.length === 0) {
      return Response.json({ is_vip: false });
    }

    // Load all active VIP entries
    const vipEntries = await base44.asServiceRole.entities.VIPAccess.filter({ is_active: true });

    for (const vip of vipEntries) {
      const vipId = vip.identifier?.trim();
      if (!vipId) continue;

      // Match based on identifier_type: EMAIL → compare against email identifiers,
      // PHONE → compare against phone identifiers.
      // Falls back to checking all identifiers for legacy entries without a type.
      let matches = false;
      if (vip.identifier_type === 'EMAIL') {
        matches = emailIdentifiers.some(id => id === vipId.toLowerCase());
      } else if (vip.identifier_type === 'PHONE') {
        matches = phoneIdentifiers.some(id => id === vipId);
      } else {
        // Legacy / unknown type — try both sets (original behaviour)
        const all = [...emailIdentifiers, ...phoneIdentifiers];
        matches = all.some(id => id === vipId.toLowerCase() || id === vipId);
      }
      if (!matches) continue;

      // VIP entry matches this user
      if (vip.grant_all) return Response.json({ is_vip: true, label: vip.label });

      // Check if this page is in the VIP's allowed pages
      if (Array.isArray(vip.page_paths) && vip.page_paths.includes(page_path)) {
        return Response.json({ is_vip: true, label: vip.label });
      }
    }

    return Response.json({ is_vip: false });
  } catch (error) {
    return Response.json({ is_vip: false, error: error.message });
  }
});