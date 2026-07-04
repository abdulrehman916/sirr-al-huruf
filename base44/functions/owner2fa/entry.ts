import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * owner2fa — Owner-only Two-Factor Authentication (email OTP).
 *
 * Stateless design: no database storage, no schema changes.
 *   SEND_OTP   — requires an authenticated session (i.e. correct password
 *                 already entered). Generates a 6-digit code, HMAC-signs
 *                 (email|expiry|otp) with OWNER_2FA_SECRET, emails the code to
 *                 the caller, and returns a signed token. The caller is
 *                 expected to be the Owner (the Login page only triggers this
 *                 for the configured Owner email).
 *   VERIFY_OTP — no auth required (the session is intentionally cleared between
 *                 send and verify). Validates the signed token + expiry + the
 *                 user-entered code purely via the HMAC signature. Returns ok.
 *
 * Access to the app is granted by the Login page re-authenticating after a
 * successful VERIFY — not by this function — so a correct OTP alone never
 * issues a session.
 */

const OTP_TTL_MS = 5 * 60 * 1000;

async function hmacSig(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const buf = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const action = body.action;
    const secret = Deno.env.get('OWNER_2FA_SECRET');

    if (!secret) {
      return Response.json({ error: '2FA not configured' }, { status: 500 });
    }

    // ── SEND_OTP: requires an active session (password already verified) ──
    if (action === 'SEND_OTP') {
      const user = await base44.auth.me();
      if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
      const email = (user.email || '').toLowerCase();
      if (!email) return Response.json({ error: 'No email on account' }, { status: 400 });

      const otp = genOtp();
      const expiry = Date.now() + OTP_TTL_MS;
      const sig = await hmacSig(secret, `${email}|${expiry}|${otp}`);
      const token = btoa(JSON.stringify({ email, expiry, sig }));

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: email,
        subject: 'Sirr al-Huruf — Owner Login Verification Code',
        body:
          '<div style="font-family:Inter,Arial,sans-serif;max-width:440px;margin:auto;padding:24px">' +
          '<h2 style="color:#D4AF37;margin:0 0 12px">Owner Login Verification</h2>' +
          '<p style="color:#222;font-size:14px">Use this code to complete your Owner login:</p>' +
          '<div style="font-size:30px;font-weight:700;letter-spacing:10px;color:#0d1b2a;' +
          'background:rgba(212,175,55,0.10);border:1px solid rgba(212,175,55,0.30);' +
          'border-radius:12px;padding:18px;text-align:center;margin:16px 0">' + otp + '</div>' +
          '<p style="color:#777;font-size:12px">This code expires in 5 minutes. ' +
          'If you did not attempt to log in to your Owner account, you can safely ignore this email.</p>' +
          '</div>',
      });

      return Response.json({ ok: true, token });
    }

    // ── VERIFY_OTP: no auth (session cleared between send and verify) ──
    if (action === 'VERIFY_OTP') {
      const { otp, token } = body;
      if (!otp || !token) {
        return Response.json({ ok: false, error: 'Missing verification code' }, { status: 400 });
      }
      let payload;
      try {
        payload = JSON.parse(atob(token));
      } catch {
        return Response.json({ ok: false, error: 'Invalid verification token' }, { status: 400 });
      }
      const { email, expiry, sig } = payload || {};
      if (!email || !expiry || !sig) {
        return Response.json({ ok: false, error: 'Invalid verification token' }, { status: 400 });
      }
      if (Date.now() > Number(expiry)) {
        return Response.json({ ok: false, error: 'Code expired — please log in again' }, { status: 400 });
      }
      const expected = await hmacSig(secret, `${email}|${expiry}|${String(otp).trim()}`);
      if (expected !== sig) {
        return Response.json({ ok: false, error: 'Incorrect verification code' }, { status: 400 });
      }
      return Response.json({ ok: true });
    }

    return Response.json({ error: 'Unknown action: ' + action }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
});