import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Rate limiting and brute-force protection for OTP requests
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { mobile, email, purpose } = await req.json();

    if (!mobile && !email) {
      return Response.json({ success: false, message: "Mobile or email required" }, { status: 400 });
    }

    const otpType = mobile ? "MOBILE" : "EMAIL";

    // ── BLOCK CHECK: prevent blocked/archived users from receiving OTP ──────
    const contactEmail = email || null;
    if (contactEmail) {
      const profiles = await base44.asServiceRole.entities.UserAccessProfile.filter(
        { email: contactEmail }, null, 1
      );
      if (profiles.length > 0) {
        const status = profiles[0].account_status;
        if (status === 'BLOCKED') {
          return Response.json({ success: false, message: "Account is blocked. Contact support.", blocked: true }, { status: 403 });
        }
        if (status === 'ARCHIVED') {
          return Response.json({ success: false, message: "Account not found.", blocked: true }, { status: 403 });
        }
      }
    }

    // RATE LIMITING: Check for excessive requests from same contact
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const recentOTPs = await base44.entities.OTPVerification.filter({
      mobile: mobile || null,
      email: email || null,
      created_at: { $gte: oneHourAgo.toISOString() }
    });

    if (recentOTPs.length >= 5) {
      return Response.json({
        success: false,
        message: "Too many requests. Please try again in 1 hour.",
        rate_limited: true
      }, { status: 429 });
    }

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);
    const otpId = `OTP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await base44.entities.OTPVerification.create({
      otp_id: otpId,
      user_id: "pending",
      mobile: mobile || null,
      email: email || null,
      otp_code: otpCode,
      otp_type: otpType,
      purpose: purpose || "LOGIN",
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      verified: false,
      status: "PENDING",
      attempts: 0,
      max_attempts: 3
    });

    try {
      await base44.functions.invoke('createAuditLog', {
        action_type: 'OTP_GENERATED',
        target_user_id: null,
        target_entity: 'OTPVerification',
        target_id: otpId,
        details: JSON.stringify({ contact: email || mobile, otp_type: otpType, purpose }),
        ip_address: req.headers.get("x-forwarded-for")?.split(",")[0] || null
      });
    } catch {}

    return Response.json({
      success: true,
      message: "OTP sent successfully",
      otp_id: otpId,
      expires_in: 300
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});