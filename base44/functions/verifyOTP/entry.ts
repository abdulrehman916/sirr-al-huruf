import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { createHash } from 'node:crypto';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { otp_id, otp_code } = await req.json();

    if (!otp_id || !otp_code) {
      return Response.json({ error: 'OTP ID and code required' }, { status: 400 });
    }

    // Find OTP record
    const otpRecords = await base44.entities.OTPVerification.filter({ otp_id: otp_id });
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

    // Hash the provided code and compare
    const providedHash = createHash('sha256').update(otp_code).digest('hex');
    if (providedHash !== otpRecord.otp_code) {
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

    // Update user access profile
    const userProfiles = await base44.entities.UserAccessProfile.filter({ user_id: otpRecord.user_id });
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

    return Response.json({ 
      success: true,
      user_id: otpRecord.user_id,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});