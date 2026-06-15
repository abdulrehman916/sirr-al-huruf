import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Verify OTP with brute-force protection and account lockout
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { otp_id, otp_code } = await req.json();

    if (!otp_id || !otp_code) {
      return Response.json({ 
        success: false, 
        message: "OTP ID and code required" 
      }, { status: 400 });
    }

    // Find OTP record
    const otps = await base44.entities.OTPVerification.filter({ otp_id });
    if (otps.length === 0) {
      return Response.json({ 
        success: false, 
        message: "Invalid OTP" 
      }, { status: 400 });
    }

    const otp = otps[0];
    const now = new Date();

    // Check if expired
    if (new Date(otp.expires_at) < now) {
      await base44.entities.OTPVerification.update(otp.id, { status: "EXPIRED" });
      return Response.json({ 
        success: false, 
        message: "OTP has expired" 
      }, { status: 400 });
    }

    // Check if already verified
    if (otp.verified) {
      return Response.json({ 
        success: false, 
        message: "OTP already used" 
      }, { status: 400 });
    }

    // BRUTE-FORCE PROTECTION: Check attempt limit
    const attempts = otp.attempts || 0;
    const maxAttempts = otp.max_attempts || 3;

    if (attempts >= maxAttempts) {
      await base44.entities.OTPVerification.update(otp.id, {
        status: "FAILED",
        attempts: attempts + 1
      });

      return Response.json({ 
        success: false, 
        message: "Too many failed attempts. Please request a new OTP.",
        locked: true
      }, { status: 403 });
    }

    // Verify OTP code
    if (otp.otp_code !== otp_code) {
      const newAttempts = attempts + 1;
      await base44.entities.OTPVerification.update(otp.id, {
        attempts: newAttempts,
        status: "PENDING"
      });

      const remainingAttempts = maxAttempts - newAttempts;
      
      return Response.json({ 
        success: false, 
        message: "Invalid OTP code",
        remaining_attempts: remainingAttempts
      }, { status: 400 });
    }

    // OTP verified successfully
    const newAttempts = attempts + 1;
    await base44.entities.OTPVerification.update(otp.id, {
      verified: true,
      verified_at: now.toISOString(),
      status: "VERIFIED",
      attempts: newAttempts
    });

    // Create audit log for successful verification
    try {
      await base44.functions.invoke('createAuditLog', {
        action_type: 'OTP_VERIFIED',
        target_user_id: otp.user_id !== "pending" ? otp.user_id : null,
        target_entity: 'OTPVerification',
        target_id: otp_id,
        details: JSON.stringify({ contact: otp.email || otp.mobile, otp_type: otp.otp_type }),
        ip_address: req.headers.get("x-forwarded-for")?.split(",")[0] || null
      });
    } catch {}

    return Response.json({
      success: true,
      message: "OTP verified successfully",
      verified: true
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});