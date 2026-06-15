import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { mobile, email, otp_code, purpose } = await req.json();

    if (!otp_code) {
      return Response.json({ 
        success: false, 
        message: "OTP code required" 
      }, { status: 400 });
    }

    const contactValue = mobile || email;
    const otpType = mobile ? "MOBILE" : "EMAIL";

    // Find OTP record
    const otpRecords = await base44.entities.OTPVerification.filter({
      otp_type: otpType,
      purpose: purpose || "LOGIN",
      status: "PENDING"
    });

    const otpRecord = otpRecords.find(otp => 
      ((mobile && otp.mobile === mobile) || (email && otp.email === email)) &&
      otp.otp_code === otp_code
    );

    if (!otpRecord) {
      return Response.json({ 
        success: false, 
        message: "Invalid or expired OTP" 
      }, { status: 400 });
    }

    // Check expiry
    const now = new Date();
    if (new Date(otpRecord.expires_at) < now) {
      await base44.entities.OTPVerification.update(otpRecord.id, {
        status: "EXPIRED"
      });
      return Response.json({ 
        success: false, 
        message: "OTP has expired" 
      }, { status: 400 });
    }

    // Check attempts
    if (otpRecord.attempts >= otpRecord.max_attempts) {
      await base44.entities.OTPVerification.update(otpRecord.id, {
        status: "FAILED"
      });
      return Response.json({ 
        success: false, 
        message: "Maximum attempts exceeded" 
      }, { status: 400 });
    }

    // Mark as verified
    await base44.entities.OTPVerification.update(otpRecord.id, {
      verified: true,
      verified_at: now.toISOString(),
      status: "VERIFIED"
    });

    // Find or create user access profile
    let userProfiles = await base44.entities.UserAccessProfile.filter({
      $or: [
        { email: email || "" },
        { mobile: mobile || "" }
      ]
    });

    let userProfile;
    if (userProfiles.length > 0) {
      userProfile = userProfiles[0];
    } else {
      // Create new profile
      const userId = `USER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      userProfile = await base44.entities.UserAccessProfile.create({
        user_id: userId,
        mobile: mobile || "",
        email: email || "",
        mobile_verified: mobile ? true : false,
        email_verified: email ? true : false,
        registration_date: now.toISOString(),
        last_login: now.toISOString(),
        account_status: "ACTIVE",
        total_permissions: 0,
        active_permissions: 0
      });
    }

    // Update last login
    await base44.entities.UserAccessProfile.update(userProfile.id, {
      last_login: now.toISOString()
    });

    // Generate a simple token (in production, use proper JWT)
    const accessToken = `token_${userProfile.user_id}_${Date.now()}`;

    return Response.json({
      success: true,
      message: "OTP verified successfully",
      user_id: userProfile.user_id,
      access_token: accessToken,
      email: userProfile.email,
      mobile: userProfile.mobile
    });

  } catch (error) {
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
});