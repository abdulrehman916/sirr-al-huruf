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

    console.log(`[VIPAccess] User: ${user.email}, emailIdentifiers: [${emailIdentifiers.join(', ')}], phoneIdentifiers: [${phoneIdentifiers.join(', ')}]`);

    if (emailIdentifiers.length === 0 && phoneIdentifiers.length === 0) {
      console.log(`[VIPAccess] FAIL: No identifiers found for user`);
      return Response.json({ is_vip: false, reason: 'No identifiers found' });
    }

    // Load all active VIP entries
    const vipEntries = await base44.asServiceRole.entities.VIPAccess.filter({ is_active: true });
    console.log(`[VIPAccess] Found ${vipEntries.length} active VIP entries`);

    for (const vip of vipEntries) {
      const vipId = vip.identifier?.trim();
      if (!vipId) {
        console.log(`[VIPAccess] SKIP: VIP entry has empty identifier`);
        continue;
      }

      console.log(`[VIPAccess] Checking VIP: identifier=${vipId}, type=${vip.identifier_type}, grant_all=${vip.grant_all}`);

      // Match based on identifier_type: EMAIL → compare against email identifiers,
      // PHONE → compare against phone identifiers.
      // Falls back to checking all identifiers for legacy entries without a type.
      let matches = false;
      let matchReason = '';
      if (vip.identifier_type === 'EMAIL') {
        matches = emailIdentifiers.some(id => {
          const match = id === vipId.toLowerCase();
          console.log(`[VIPAccess] EMAIL match attempt: ${id} === ${vipId.toLowerCase()} ? ${match}`);
          return match;
        });
        matchReason = 'EMAIL';
      } else if (vip.identifier_type === 'PHONE') {
        matches = phoneIdentifiers.some(id => {
          const match = id === vipId;
          console.log(`[VIPAccess] PHONE match attempt: ${id} === ${vipId} ? ${match}`);
          return match;
        });
        matchReason = 'PHONE';
      } else {
        // Legacy / unknown type — try both sets (original behaviour)
        const all = [...emailIdentifiers, ...phoneIdentifiers];
        matches = all.some(id => {
          const match = id === vipId.toLowerCase() || id === vipId;
          console.log(`[VIPAccess] LEGACY match attempt: ${id} === ${vipId.toLowerCase()} or ${vipId} ? ${match}`);
          return match;
        });
        matchReason = 'LEGACY';
      }
      
      if (!matches) {
        console.log(`[VIPAccess] NO MATCH for VIP ${vipId} (${matchReason})`);
        continue;
      }

      console.log(`[VIPAccess] MATCH FOUND for VIP ${vipId} (${matchReason})`);

      // VIP entry matches this user
      if (vip.grant_all) {
        console.log(`[VIPAccess] GRANT ALL - access granted`);
        return Response.json({ is_vip: true, label: vip.label });
      }

      // Check if this page is in the VIP's allowed pages
      if (Array.isArray(vip.page_paths) && vip.page_paths.includes(page_path)) {
        console.log(`[VIPAccess] PAGE MATCH - ${page_path} in allowed pages`);
        return Response.json({ is_vip: true, label: vip.label });
      } else {
        console.log(`[VIPAccess] PAGE NOT IN LIST - ${page_path} not in [${vip.page_paths?.join(', ') || ''}]`);
      }
    }

    console.log(`[VIPAccess] FINAL: No VIP match found`);
    return Response.json({ is_vip: false, reason: 'No VIP match' });
  } catch (error) {
    console.error(`[VIPAccess] ERROR: ${error.message}`);
    return Response.json({ is_vip: false, error: error.message });
  }
});