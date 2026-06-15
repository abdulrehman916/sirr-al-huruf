import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { createHash } from 'node:crypto';

// Production OTP verifier — validates against stored OTPVerification records.
// For email OTP, the platform handles verification via base44.auth.verifyOtp().
// This handles SMS OTP verification.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { otp_id, otp_code } = await req.json();

    if (!otp_id || !otp_code) {
      return Response.json({ success: false, message: 'OTP ID and code required' }, { status: 400 });
    }

    // Find OTP record
    const records = await base44.entities.OTPVerification.filter({ otp_id });
    if (records.length === 0) {
      return Response.json({ success: false, message: 'Invalid OTP' }, { status: 404 });
    }

    const otp = records[0];
    const now = new Date();

    // Already verified
    if (otp.verified || otp.status === 'VERIFIED') {
      return Response.json({ success: false, message: 'OTP already used' }, { status: 400 });
    }

    // Expired
    if (new Date(otp.expires_at) < now) {
      await base44.entities.OTPVerification.update(otp.id, { status: 'EXPIRED' });
      return Response.json({ success: false, message: 'OTP expired. Request a new one.' }, { status: 400 });
    }

    // Brute force — max attempts
    const attempts = otp.attempts || 0;
    const maxAttempts = otp.max_attempts || 3;
    if (attempts >= maxAttempts) {
      await base44.entities.OTPVerification.update(otp.id, { status: 'FAILED' });
      return Response.json({ success: false, message: 'Too many attempts. Request a new OTP.', locked: true }, { status: 403 });
    }

    // Verify code (hashed comparison)
    const providedHash = createHash('sha256').update(otp_code).digest('hex');
    const storedCode = otp.otp_code || '';
    // Support both hashed (64-char hex) and plain storage
    const codeMatches = storedCode.length === 64
      ? providedHash === storedCode
      : otp_code === storedCode;

    if (!codeMatches) {
      await base44.entities.OTPVerification.update(otp.id, { attempts: attempts + 1 });
      const remaining = maxAttempts - (attempts + 1);
      return Response.json({
        success: false,
        message: `Invalid code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
        remaining_attempts: remaining
      }, { status: 400 });
    }

    // Success — mark verified
    await base44.entities.OTPVerification.update(otp.id, {
      verified: true,
      verified_at: now.toISOString(),
      status: 'VERIFIED',
      attempts: attempts + 1
    });

    // Audit log
    try {
      await base44.functions.invoke('createAuditLog', {
        action_type: 'OTP_VERIFIED',
        target_entity: 'OTPVerification',
        target_id: otp_id,
        details: JSON.stringify({ mobile: otp.mobile, otp_type: otp.otp_type }),
        ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || null
      });
    } catch {}

    return Response.json({
      success: true,
      message: 'OTP verified',
      mobile: otp.mobile || '',
      otp_type: otp.otp_type,
      verified: true
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});