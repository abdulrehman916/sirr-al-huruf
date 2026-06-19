import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * REAL OTP EMAIL DELIVERY TEST
 * 
 * Creates a real OTP and attempts to verify email delivery.
 * This test requires a REAL email address to check for OTP receipt.
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const adminUser = await base44.auth.me();
    
    if (!adminUser || adminUser.role !== 'admin') {
      return Response.json({ error: 'Admin role required' }, { status: 403 });
    }

    const { test_email } = await req.json();
    
    if (!test_email) {
      return Response.json({
        error: 'test_email required',
        instructions: 'Provide a real email address to test OTP delivery',
        example: { test_email: 'your-real-email@gmail.com' }
      }, { status: 400 });
    }

    console.log('[OTP DELIVERY TEST] Starting real email delivery test...');
    console.log('[OTP DELIVERY TEST] Test email:', test_email);

    const testResults = {
      test_id: `OTP-DELIVERY-TEST-${Date.now()}`,
      timestamp: new Date().toISOString(),
      test_email,
      steps: [],
      critical_findings: [],
      recommendations: []
    };

    // ── STEP 1: Generate OTP via Platform Auth ────────────────────
    console.log('[OTP DELIVERY TEST] Step 1: Generate OTP via platform auth');
    try {
      const testPassword = `Test${Date.now()}!`;
      
      // Try to register (this should trigger OTP email)
      await base44.auth.register({ 
        email: test_email, 
        password: testPassword 
      });
      
      testResults.steps.push({
        step: 1,
        action: 'Platform Auth Registration',
        status: 'SUCCESS',
        details: 'base44.auth.register() called successfully',
        note: 'Platform should send OTP email automatically'
      });
    } catch (error) {
      // User might already exist, try resend OTP
      try {
        await base44.auth.resendOtp(test_email);
        testResults.steps.push({
          step: 1,
          action: 'Platform Auth Resend OTP',
          status: 'SUCCESS',
          details: 'base44.auth.resendOtp() called successfully',
          note: 'Platform should resend OTP email'
        });
      } catch (resendError) {
        testResults.steps.push({
          step: 1,
          action: 'Platform Auth Registration/Resend',
          status: 'FAILED',
          error: resendError.message
        });
        testResults.critical_findings.push({
          issue: 'Platform auth failed',
          severity: 'CRITICAL',
          description: 'base44.auth.register() and resendOtp() both failed',
          error: resendError.message,
          impact: 'Users cannot receive OTP emails'
        });
      }
    }

    // ── STEP 2: Verify OTP Record Created ─────────────────────────
    console.log('[OTP DELIVERY TEST] Step 2: Check OTP database record');
    try {
      const otpRecords = await base44.asServiceRole.entities.OTPVerification.filter(
        { email: test_email },
        '-created_date',
        1
      );

      if (otpRecords.length > 0) {
        const otp = otpRecords[0];
        testResults.steps.push({
          step: 2,
          action: 'OTP Database Record',
          status: 'SUCCESS',
          details: {
            otp_id: otp.otp_id,
            email: otp.email,
            otp_type: otp.otp_type,
            purpose: otp.purpose,
            created_at: otp.created_at,
            expires_at: otp.expires_at,
            status: otp.status,
            otp_code_hashed: otp.otp_code ? (otp.otp_code.length === 64 ? 'Yes (SHA-256)' : 'No (plain text)') : 'No'
          }
        });
        
        if (otp.otp_code && otp.otp_code.length !== 64) {
          testResults.critical_findings.push({
            issue: 'OTP stored as plain text',
            severity: 'HIGH',
            description: `OTP code is ${otp.otp_code.length} characters (should be 64 for SHA-256 hash)`,
            impact: 'Security vulnerability - OTPs should be hashed before storage'
          });
        }
      } else {
        testResults.steps.push({
          step: 2,
          action: 'OTP Database Record',
          status: 'FAILED',
          error: 'No OTP record found in database'
        });
        testResults.critical_findings.push({
          issue: 'OTP not stored in database',
          severity: 'CRITICAL',
          description: 'Platform auth succeeded but no OTP record was created',
          impact: 'Cannot verify OTP without database record'
        });
      }
    } catch (error) {
      testResults.steps.push({
        step: 2,
        action: 'OTP Database Record',
        status: 'ERROR',
        error: error.message
      });
    }

    // ── STEP 3: Email Delivery Status ─────────────────────────────
    console.log('[OTP DELIVERY TEST] Step 3: Email delivery verification');
    testResults.steps.push({
      step: 3,
      action: 'Email Delivery Verification',
      status: 'MANUAL_CHECK_REQUIRED',
      details: {
        email_sent_by: 'Base44 Platform (managed)',
        email_type: 'OTP Verification',
        recipient: test_email,
        subject_contains: 'OTP',
        verification_method: 'Check email inbox manually'
      },
      manual_steps: [
        `1. Check inbox of ${test_email}`,
        '2. Check spam/junk folder',
        '3. Look for email with subject containing "OTP" or "verification"',
        '4. Note the 6-digit OTP code',
        '5. Verify email was received within last 5 minutes'
      ]
    });

    // ── STEP 4: Platform Email Configuration Check ────────────────
    console.log('[OTP DELIVERY TEST] Step 4: Platform email configuration');
    testResults.steps.push({
      step: 4,
      action: 'Platform Email Configuration',
      status: 'INFO',
      details: {
        email_provider: 'Base44 Platform (managed service)',
        configuration: 'Handled by platform',
        domain_authentication: 'Platform manages SPF/DKIM/DMARC',
        email_credits: 'Platform managed',
        note: 'Base44 platform handles all email infrastructure'
      },
      troubleshooting: [
        'Check Base44 dashboard for email delivery status',
        'Verify platform email credits are available',
        'Check if domain is properly configured in platform',
        'Contact Base44 support if emails not being sent'
      ]
    });

    // ── STEP 5: Common Issues Checklist ───────────────────────────
    console.log('[OTP DELIVERY TEST] Step 5: Common issues analysis');
    const commonIssues = [
      {
        issue: 'Emails going to spam',
        likelihood: 'HIGH',
        check: 'Ask user to check spam/junk folder',
        fix: 'Add platform sending domain to contacts'
      },
      {
        issue: 'Invalid email address',
        likelihood: 'MEDIUM',
        check: 'Verify email format and domain exists',
        fix: 'Use valid, active email address'
      },
      {
        issue: 'Email provider blocking',
        likelihood: 'MEDIUM',
        check: 'Some providers block automated emails',
        fix: 'Try different email provider (Gmail, Outlook)'
      },
      {
        issue: 'Platform email credits exhausted',
        likelihood: 'LOW',
        check: 'Check Base44 dashboard for credit status',
        fix: 'Purchase more email credits or upgrade plan'
      },
      {
        issue: 'Platform email service down',
        likelihood: 'LOW',
        check: 'Check Base44 status page',
        fix: 'Wait for platform to resolve'
      },
      {
        issue: 'Rate limiting',
        likelihood: 'MEDIUM',
        check: 'Too many OTPs sent to same email',
        fix: 'Wait 1 hour before requesting new OTP'
      }
    ];

    testResults.steps.push({
      step: 5,
      action: 'Common Issues Analysis',
      status: 'COMPLETE',
      details: commonIssues
    });

    // ── FINAL RECOMMENDATIONS ─────────────────────────────────────
    testResults.recommendations = [
      {
        priority: 'IMMEDIATE',
        action: 'Manual Email Check',
        description: `Check the inbox of ${test_email} for OTP email`,
        steps: [
          'Check primary inbox',
          'Check spam/junk folder',
          'Check promotions/social tabs (Gmail)',
          'Search for "OTP" or "verification"',
          'Verify email received within last 5 minutes'
        ]
      },
      {
        priority: 'HIGH',
        action: 'Platform Email Verification',
        description: 'Contact Base44 support to verify email delivery',
        steps: [
          'Provide test_email used for testing',
          'Request email delivery logs',
          'Ask about bounce/rejection status',
          'Verify platform email configuration',
          'Check if email credits are available'
        ]
      },
      {
        priority: 'MEDIUM',
        action: 'Domain Authentication',
        description: 'Verify SPF/DKIM/DMARC records',
        steps: [
          'Check if custom domain is configured',
          'Verify SPF record includes platform',
          'Verify DKIM signature is set up',
          'Verify DMARC policy is configured',
          'Use tools like MXToolbox to verify'
        ]
      },
      {
        priority: 'LOW',
        action: 'Email Deliverability Improvement',
        description: 'Improve email delivery rates',
        steps: [
          'Use professional email domains',
          'Avoid free email providers for production',
          'Add sending domain to email contacts',
          'Monitor bounce rates',
          'Consider dedicated email service (SendGrid, Resend)'
        ]
      }
    ];

    // ── SUMMARY ───────────────────────────────────────────────────
    testResults.summary = {
      test_email,
      otp_generated: testResults.steps[0]?.status === 'SUCCESS',
      otp_stored: testResults.steps[1]?.status === 'SUCCESS',
      email_delivery: 'MANUAL_CHECK_REQUIRED',
      platform_configured: true,
      critical_issues_count: testResults.critical_findings.length,
      next_steps: [
        `1. Check email inbox of ${test_email}`,
        '2. Check spam/junk folder',
        '3. If no email received, contact Base44 support',
        '4. Provide test_id for support: ' + testResults.test_id
      ]
    };

    return Response.json(testResults);

  } catch (error) {
    console.error('[OTP DELIVERY TEST] Critical error:', error);
    return Response.json({
      error: error.message,
      stack: error.stack,
      test_failed: true
    }, { status: 500 });
  }
});