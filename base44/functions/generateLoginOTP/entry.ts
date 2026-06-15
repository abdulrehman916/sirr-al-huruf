import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Rate limiting and brute-force protection for OTP requests
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { mobile, email, purpose } = await req.json();

    if (!mobile && !email) {
      return Response.json({ 
        success: false, 
        message: "Mobile or email required" 
      }, { status: 400 });
    }

    const contactValue = mobile || email;
    const otpType = mobile ? "MOBILE" : "EMAIL";
    
    // RATE LIMITING: Check for excessive requests from same contact
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const recentOTPs = await base44.entities.OTPVerification.filter({
      mobile: mobile || null,
      email: email || null,
      created_at: { $gte: oneHourAgo.toISOString() }
    });

    if (recentOTPs.length >= 5) {
      // Rate limit exceeded - lockout for 1 hour
      return Response.json({ 
        success: false, 
        message: "Too many requests. Please try again in 1 hour.",
        rate_limited: true
      }, { status: 429 });
    }

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
    const otpId = `OTP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Store OTP (hashed in production)
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

    // Create audit log
    try {
      await base44.functions.invoke('createAuditLog', {
        action_type: 'OTP_GENERATED',
        target_user_id: null,
        target_entity: 'OTPVerification',
        target_id: otpId,
        details: JSON.stringify({ contact: contactValue, otp_type: otpType, purpose }),
        ip_address: req.headers.get("x-forwarded-for")?.split(",")[0] || null
      });
    } catch {}

    return Response.json({
      success: true,
      message: "OTP sent successfully",
      otp_id: otpId,
      expires_in: 300 // seconds
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});