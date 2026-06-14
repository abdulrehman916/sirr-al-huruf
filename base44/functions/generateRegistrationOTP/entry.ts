import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { mobile, email } = await req.json();

    if (!mobile && !email) {
      return Response.json({ error: 'Mobile or email required' }, { status: 400 });
    }

    // Get current user
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP
    const hashedOTP = createHash('sha256').update(otpCode).digest('hex');

    const otpId = `OTP-${now.getTime()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Determine OTP type
    const otpType = mobile ? 'MOBILE' : 'EMAIL';
    const purpose = 'REGISTRATION';

    // Create OTP record
    const otp = await base44.entities.OTPVerification.create({
      otp_id: otpId,
      user_id: user.id,
      mobile: mobile || '',
      email: email || '',
      otp_code: hashedOTP,
      otp_type: otpType,
      purpose: purpose,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      verified: false,
      attempts: 0,
      max_attempts: 3,
      status: 'PENDING'
    });

    // TODO: Send OTP via SMS/Email integration
    // For now, return OTP in response for testing
    // In production, this would be sent via external service

    return Response.json({
      success: true,
      otp_id: otpId,
      message: `OTP sent to ${mobile || email}`,
      // Remove in production - for testing only
      test_otp: otpCode,
      expires_in_seconds: 300
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});