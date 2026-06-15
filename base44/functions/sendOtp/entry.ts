import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { createHash } from 'node:crypto';

// Production OTP system — generates, stores (hashed), and delivers OTP codes.
// Email: platform auth handles delivery natively.
// SMS: Twilio delivery when TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER are set.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { mobile, email, purpose } = await req.json();
    const contactType = mobile ? 'MOBILE' : email ? 'EMAIL' : null;
    const contact = mobile || email;

    if (!contactType) {
      return Response.json({ success: false, message: 'Mobile or email required' }, { status: 400 });
    }

    const now = new Date();

    // ── EMAIL: Platform handles delivery natively ──────────────────
    if (contactType === 'EMAIL') {
      return Response.json({
        success: true,
        message: 'Email OTP handled by platform auth',
        use_platform_auth: true,
        contact_type: 'EMAIL',
        contact
      });
    }

    // ── SMS: Generate + store OTP + deliver ────────────────────────
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const hashedOTP = createHash('sha256').update(otpCode).digest('hex');
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);
    const otpId = `OTP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Rate limiting — max 5 OTPs per hour per mobile
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const recent = await base44.entities.OTPVerification.filter({
      mobile,
      created_at: { $gte: oneHourAgo.toISOString() }
    });
    if (recent.length >= 5) {
      return Response.json({ success: false, message: 'Too many requests. Try again in 1 hour.', rate_limited: true }, { status: 429 });
    }

    // Store OTP (hashed)
    await base44.entities.OTPVerification.create({
      otp_id: otpId,
      user_id: 'pending',
      mobile,
      email: '',
      otp_code: hashedOTP,
      otp_type: 'MOBILE',
      purpose: purpose || 'LOGIN',
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      verified: false,
      attempts: 0,
      max_attempts: 3,
      status: 'PENDING'
    });

    // Attempt SMS delivery via Twilio
    let smsSent = false;
    try {
      const env = Deno.env.toObject();
      const sid = env['TWILIO_ACCOUNT_SID'];
      const token = env['TWILIO_AUTH_TOKEN'];
      const from = env['TWILIO_PHONE_NUMBER'];
      if (sid && token && from) {
        const body = new URLSearchParams({
          To: mobile,
          From: from,
          Body: `Sirr al-Huruf verification code: ${otpCode}. Valid for 5 minutes.`
        });
        const twilioRes = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Authorization': 'Basic ' + btoa(sid + ':' + token),
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body
          }
        );
        smsSent = twilioRes.ok;
      }
    } catch { /* SMS send failed or env vars not set */ }

    // Audit log
    try {
      await base44.functions.invoke('createAuditLog', {
        action_type: 'OTP_GENERATED',
        target_entity: 'OTPVerification',
        target_id: otpId,
        details: JSON.stringify({ mobile, purpose, sms_sent: smsSent }),
        ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || null
      });
    } catch {}

    return Response.json({
      success: true,
      message: smsSent ? 'OTP sent via SMS' : 'OTP stored (set TWILIO env vars for SMS delivery)',
      otp_id: otpId,
      sms_sent: smsSent,
      expires_in_seconds: 300
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});