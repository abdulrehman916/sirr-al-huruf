import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email, mobile, otp_id } = await req.json();

    if (!email && !mobile) {
      return Response.json({ success: false, message: 'Email or mobile required' }, { status: 400 });
    }
    if (!otp_id) {
      return Response.json({ success: false, message: 'OTP ID required' }, { status: 400 });
    }

    // Verify the OTP was completed
    const otps = await base44.entities.OTPVerification.filter({ otp_id });
    if (otps.length === 0 || otps[0].status !== 'VERIFIED') {
      return Response.json({ success: false, message: 'OTP not verified' }, { status: 400 });
    }

    const otp = otps[0];
    const contact = email || mobile;
    const now = new Date().toISOString();

    // Check if profile already exists for this contact
    let profileId = null;
    const existingProfiles = email
      ? await base44.entities.UserAccessProfile.filter({ email })
      : await base44.entities.UserAccessProfile.filter({ mobile });

    if (existingProfiles.length > 0) {
      // Update existing profile
      const prof = existingProfiles[0];
      await base44.entities.UserAccessProfile.update(prof.id, {
        last_login: now,
        mobile_verified: mobile ? true : prof.mobile_verified,
        email_verified: email ? true : prof.email_verified,
        account_status: 'ACTIVE'
      });
      profileId = prof.id;
    } else {
      // Create new profile
      const newProfile = await base44.entities.UserAccessProfile.create({
        user_id: 'pending',
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
      profileId = newProfile.id;
    }

    // Audit log
    try {
      await base44.functions.invoke('createAuditLog', {
        action_type: 'USER_ONBOARDED',
        target_entity: 'UserAccessProfile',
        target_id: contact,
        details: JSON.stringify({ email, mobile, contact, profile_id: profileId }),
        ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || null
      });
    } catch {}

    return Response.json({
      success: true,
      profile_id: profileId,
      message: 'Onboarding complete'
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});