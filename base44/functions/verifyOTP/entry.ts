import { createClientFromRequest } from 'npm:@base44/sdk@0.8.32';
import { createHash } from 'node:crypto';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { otp_id, otp_code, otp_type, purpose } = await req.json();

    if (!otp_id || !otp_code) {
      return Response.json({ error: 'OTP ID and code required' }, { status: 400 });
    }

    // Find OTP record - support both otp_id lookup and code-based lookup
    let otpRecords = await base44.entities.OTPVerification.filter({ otp_id: otp_id });
    
    // Fallback: search by code if otp_id not found (for verifyLoginOTP compatibility)
    if (otpRecords.length === 0) {
      otpRecords = await base44.entities.OTPVerification.filter({ 
        otp_code: otp_code,
        status: 'PENDING'
      });
    }
    if (otpRecords.length === 0) {
      return Response.json({ error: 'Invalid OTP ID' }, { status: 404 });
    }

    const otpRecord = otpRecords[0];

    // Check if already verified
    if (otpRecord.verified) {
      return Response.json({ error: 'OTP already verified' }, { status: 400 });
    }

    // Check if expired
    const now = new Date();
    if (new Date(otpRecord.expires_at) < now) {
      await base44.entities.OTPVerification.update(otpRecord.id, { status: 'EXPIRED' });
      return Response.json({ error: 'OTP has expired' }, { status: 400 });
    }

    // Check attempts
    if (otpRecord.attempts >= otpRecord.max_attempts) {
      await base44.entities.OTPVerification.update(otpRecord.id, { status: 'FAILED' });
      return Response.json({ error: 'Maximum attempts exceeded' }, { status: 400 });
    }

    // Hash the provided code and compare (support both hashed and plain storage)
    let codeMatches = false;
    if (otpRecord.otp_code && otpRecord.otp_code.length === 64) {
      // Hashed OTP
      const providedHash = createHash('sha256').update(otp_code).digest('hex');
      codeMatches = providedHash === otpRecord.otp_code;
    } else {
      // Plain OTP (for backward compatibility)
      codeMatches = otp_code === otpRecord.otp_code;
    }
    
    if (!codeMatches) {
      // Increment attempts
      await base44.entities.OTPVerification.update(otpRecord.id, { 
        attempts: otpRecord.attempts + 1 
      });
      return Response.json({ error: 'Invalid OTP code' }, { status: 400 });
    }

    // OTP is valid - mark as verified
    await base44.entities.OTPVerification.update(otpRecord.id, {
      verified: true,
      verified_at: now.toISOString(),
      status: 'VERIFIED'
    });

    // Update user access profile (use service role for unauthenticated onboarding)
    let userProfiles = [];
    try {
      userProfiles = await base44.asServiceRole.entities.UserAccessProfile.filter({ user_id: otpRecord.user_id });
    } catch {}
    if (userProfiles.length > 0) {
      const profile = userProfiles[0];
      const updateData = {
        last_login: now.toISOString()
      };
      
      if (otpRecord.otp_type === 'MOBILE') {
        updateData.mobile_verified = true;
      } else if (otpRecord.otp_type === 'EMAIL') {
        updateData.email_verified = true;
      }
      
      await base44.entities.UserAccessProfile.update(profile.id, updateData);
    }

    // Get user details from User entity (skip for pending users)
    let user = null;
    if (otpRecord.user_id && otpRecord.user_id !== 'pending') {
      try {
        const users = await base44.asServiceRole.entities.User.filter({ id: otpRecord.user_id });
        user = users.length > 0 ? users[0] : null;
      } catch {}
    }
    
    // Generate simple access token (Base44 session token format)
    const access_token = `b44_${otpRecord.user_id || 'pending'}_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;

    // Update user access profile last_login
    if (otpRecord.user_id && otpRecord.user_id !== 'pending') {
      const profiles = await base44.asServiceRole.entities.UserAccessProfile.filter({ user_id: otpRecord.user_id });
      if (profiles.length > 0) {
        await base44.entities.UserAccessProfile.update(profiles[0].id, {
          last_login: new Date().toISOString(),
          mobile_verified: otpRecord.otp_type === 'MOBILE' ? true : profiles[0].mobile_verified,
          email_verified: otpRecord.otp_type === 'EMAIL' ? true : profiles[0].email_verified
        });
      }
    }

    return Response.json({ 
      success: true,
      user_id: otpRecord.user_id,
      access_token: access_token,
      email: user?.email || otpRecord.email || '',
      role: user?.role || 'user',
      full_name: user?.full_name || '',
      message: 'OTP verified successfully'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});