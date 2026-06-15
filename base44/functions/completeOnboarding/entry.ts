import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email, mobile, otp_id } = await req.json();

    if (!email && !mobile) {
      return Response.json({ success: false, message: 'Email or mobile required' }, { status: 400 });
    }

    // Get the real authenticated user — this is the platform user ID
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const contact = email || mobile;
    const now = new Date().toISOString();

    // Check if profile already exists for this platform user
    const existingByUserId = await base44.entities.UserAccessProfile.filter({ user_id: user.id });
    if (existingByUserId.length > 0) {
      const prof = existingByUserId[0];
      await base44.entities.UserAccessProfile.update(prof.id, {
        last_login: now,
        mobile_verified: mobile ? true : prof.mobile_verified,
        email_verified: email ? true : prof.email_verified,
        account_status: 'ACTIVE'
      });
      return Response.json({
        success: true,
        profile_id: prof.id,
        message: 'Profile updated'
      });
    }

    // Check by contact info (email/mobile) in case profile exists but user_id was 'pending'
    let existingByContact = [];
    if (email) {
      existingByContact = await base44.entities.UserAccessProfile.filter({ email });
    }
    if (existingByContact.length === 0 && mobile) {
      existingByContact = await base44.entities.UserAccessProfile.filter({ mobile });
    }

    if (existingByContact.length > 0) {
      // Fix the dangling profile — link it to the real user
      const prof = existingByContact[0];
      await base44.entities.UserAccessProfile.update(prof.id, {
        user_id: user.id,
        last_login: now,
        mobile_verified: mobile ? true : prof.mobile_verified,
        email_verified: email ? true : prof.email_verified,
        account_status: 'ACTIVE'
      });
      return Response.json({
        success: true,
        profile_id: prof.id,
        message: 'Profile linked to user'
      });
    }

    // Create fresh profile with real user ID
    const newProfile = await base44.entities.UserAccessProfile.create({
      user_id: user.id,
      mobile: mobile || '',
      email: email || contact || '',
      mobile_verified: !!mobile,
      email_verified: !!email,
      registration_date: now,
      last_login: now,
      account_status: 'ACTIVE',
      total_permissions: 0,
      active_permissions: 0
    });

    // Audit log
    try {
      await base44.functions.invoke('createAuditLog', {
        action_type: 'USER_ONBOARDED',
        target_entity: 'UserAccessProfile',
        target_id: user.id,
        details: JSON.stringify({ email, mobile, contact, profile_id: newProfile.id }),
        ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || null
      });
    } catch {}

    return Response.json({
      success: true,
      profile_id: newProfile.id,
      message: 'Onboarding complete'
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});