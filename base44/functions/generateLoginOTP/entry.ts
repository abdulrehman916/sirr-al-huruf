import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // No auth required for login OTP
    const { mobile, email, purpose } = await req.json();

    if (!mobile && !email) {
      return Response.json({ 
        success: false, 
        message: "Mobile or email required" 
      }, { status: 400 });
    }

    const contactValue = mobile || email;
    const otpType = mobile ? "MOBILE" : "EMAIL";
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

    // Find or create user
    let users = await base44.entities.User.list();
    let user = users.find(u => u.email === email || (mobile && u.full_name?.includes(mobile)));
    
    // For new users, we'll create a minimal profile
    // Note: We can't create User records directly, so we use a workaround
    // The actual user creation happens on first successful OTP verification
    
    // Store OTP
    const otpId = `OTP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await base44.entities.OTPVerification.create({
      otp_id: otpId,
      user_id: "pending", // Will be updated on verification
      mobile: mobile || null,
      email: email || null,
      otp_code: otpCode, // In production, hash this
      otp_type: otpType,
      purpose: purpose || "LOGIN",
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      verified: false,
      status: "PENDING",
      attempts: 0,
      max_attempts: 3
    });

    // In production, send OTP via SMS/Email service
    // For now, we'll return it in the response for testing
    console.log(`OTP for ${contactValue}: ${otpCode}`);

    return Response.json({
      success: true,
      message: "OTP sent successfully",
      otp_code: otpCode, // Remove in production
      contact: contactValue
    });

  } catch (error) {
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
});