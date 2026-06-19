import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * SEND OTP EMAIL VIA RESEND
 * 
 * Sends OTP email using Resend integration.
 * Requires RESEND_API_KEY secret to be set.
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // No auth required - called by generateLoginOTP for OTP flow
    // Rate limiting and block checks handled by generateLoginOTP

    const { email, otp_code, otp_id } = await req.json();

    if (!email || !otp_code) {
      return Response.json({ 
        error: 'email and otp_code required',
        received: { email, otp_code: otp_code ? '***' : undefined, otp_id }
      }, { status: 400 });
    }

    console.log('[SEND OTP EMAIL] Sending OTP to:', email);

    // Send email via Resend
    const emailResult = await base44.integrations.Core.SendEmail({
      to: email,
      subject: 'Your OTP Code - Sirr al-Huruf',
      body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #1a1a1a; margin-bottom: 8px; }
    .subtitle { color: #666; font-size: 14px; }
    .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0; }
    .otp-code { font-size: 36px; font-weight: bold; color: white; letter-spacing: 8px; font-family: 'Courier New', monospace; }
    .otp-label { color: rgba(255,255,255,0.9); font-size: 14px; margin-bottom: 8px; }
    .otp-sublabel { color: rgba(255,255,255,0.7); font-size: 12px; }
    .info { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .info-item { margin-bottom: 12px; font-size: 14px; color: #555; }
    .info-item strong { color: #333; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .warning-text { color: #856404; font-size: 13px; line-height: 1.6; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">✨ Sirr al-Huruf</div>
      <div class="subtitle">Secret of Letters</div>
    </div>

    <div class="otp-box">
      <div class="otp-label">Your One-Time Password</div>
      <div class="otp-code">${otp_code}</div>
      <div class="otp-sublabel">Valid for 5 minutes</div>
    </div>

    <div class="info">
      <div class="info-item"><strong>📧 Email:</strong> ${email}</div>
      <div class="info-item"><strong>⏰ Expires:</strong> 5 minutes from now</div>
      <div class="info-item"><strong>🔐 Purpose:</strong> Login Verification</div>
      <div class="info-item"><strong>📱 Device:</strong> ${req.headers.get('user-agent')?.includes('Mobile') ? 'Mobile' : 'Desktop'}</div>
    </div>

    <div class="warning">
      <div class="warning-text">
        <strong>⚠️ Important Security Notice:</strong><br>
        This OTP code is for your account login only. Never share this code with anyone.
        If you didn't request this code, please ignore this email or contact support.
      </div>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Sirr al-Huruf. All rights reserved.<br>
      This is an automated message, please do not reply.
    </div>
  </div>
</body>
</html>
      `
    });

    console.log('[SEND OTP EMAIL] Email sent successfully');

    // Skip audit log - createAuditLog requires admin auth
    // Email sending is logged in Resend dashboard automatically

    return Response.json({
      success: true,
      message: 'OTP email sent successfully',
      email_sent_to: email,
      sent_at: new Date().toISOString(),
      provider: 'Resend'
    });

  } catch (error) {
    console.error('[SEND OTP EMAIL] Error:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack,
      hint: 'Make sure RESEND_API_KEY secret is set in dashboard'
    }, { status: 500 });
  }
});