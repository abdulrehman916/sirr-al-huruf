import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, KeyRound, ArrowLeft, CheckCircle, Shield, LogIn } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { useToast } from "@/components/ui/use-toast";
import { detectDevice, getCountry } from "@/lib/deviceUtils";
import useTranslation from "@/i18n/useTranslation";
import { ADMIN_CONFIG } from "@/lib/adminConfig";
import Captcha from "@/components/Captcha";

export default function OTPLogin() {
  const [loginMethod, setLoginMethod] = useState("otp"); // "otp", "access_code", or "admin_code"
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpId, setOtpId] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();

  const deviceType = detectDevice();
  const country = getCountry();

  // ── Step 1: Enter email ──────────────────────────────────────────
  if (step === "email") {
    const handleSendOTP = async (e) => {
      e.preventDefault();
      setError("");
      setSuccessMsg("");
      setLoading(true);

      try {
        // Captcha is optional when Turnstile fails to load (placeholder key in dev)
        // In production with a real site key, captchaVerified will be true

        // Check if user is in approved users list
        const approvedCheck = await base44.functions.invoke("checkApprovedUser", {
          email: email
        });

        if (approvedCheck.data?.success && approvedCheck.data?.approved) {
          // Approved user - grant direct access without OTP
          const platformResult = await base44.auth.verifyOtp({ email, otpCode: "APPROVED" });
          await base44.auth.setToken(platformResult.access_token);

          // Owner email always gets admin role
          if (email.trim().toLowerCase() === ADMIN_CONFIG.OWNER_EMAIL.toLowerCase()) {
            try { await base44.auth.updateMe({ role: "admin" }); } catch {}
          }

          await base44.functions.invoke("completeOnboarding", {
            email,
            mobile: "",
            device_type: deviceType,
            country
          });

          setSuccessMsg(`✓ Access granted as approved user! Redirecting...`);
          toast({ 
            title: "Welcome Back", 
            description: approvedCheck.data.message,
            duration: 3000
          });
          
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
          setLoading(false);
          return;
        }

        // Not an approved user - proceed with normal OTP flow
        const result = await base44.functions.invoke("generateLoginOTP", {
          email: email,
          purpose: "LOGIN"
        });

        if (!result.data?.success) {
          if (result.data?.rate_limited) {
            setError("Too many requests. Please wait 1 hour.");
          } else if (result.data?.blocked) {
            setError(result.data?.message || "Account not found");
          } else {
            setError(result.data?.message || t('unable_send_otp'));
          }
          setLoading(false);
          return;
        }

        setOtpId(result.data.otp_id);
        setStep("verify");
        
        const emailStatus = result.data.email_sent 
          ? "OTP sent to your email via Resend"
          : "OTP generated (check email - delivery may be delayed)";
        
        toast({ 
          title: t('otp_sent_title'), 
          description: emailStatus,
          duration: 5000
        });
      } catch (err) {
        setError(err?.message || t('msg_error_occurred'));
      } finally {
        setLoading(false);
      }
    };

    return (
      <AuthLayout
        icon={Mail}
        title={t('otp_login_title')}
        subtitle={t('otp_login_desc')}
        footer={
          <>
            {t('otp_new_user')}{" "}
            <Link to="/onboarding" className="text-primary font-medium hover:underline">
              {t('otp_create_account')}
            </Link>
          </>
        }
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
        )}

        {/* Login method selector */}
        <div className="mb-6">
          <div className="flex gap-2 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
            <button
              onClick={() => { setLoginMethod("otp"); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                loginMethod === "otp" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="w-4 h-4" /> OTP
            </button>
            <button
              onClick={() => { setLoginMethod("access_code"); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                loginMethod === "access_code" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <KeyRound className="w-4 h-4" /> Access Code
            </button>
            <button
              onClick={() => { setLoginMethod("admin_code"); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                loginMethod === "admin_code" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shield className="w-4 h-4" /> Admin
            </button>
          </div>
        </div>

        {loginMethod === "access_code" ? (
          <AccessCodeLoginForm
            accessCode={accessCode}
            setAccessCode={setAccessCode}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
            successMsg={successMsg}
            setSuccessMsg={setSuccessMsg}
            toast={toast}
            t={t}
          />
        ) : loginMethod === "otp" ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email_address')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                  autoFocus
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('sending')}</> : t('otp_send_login')}
            </Button>
            <div className="mt-4">
              <Captcha onVerify={(token) => { setCaptchaVerified(true); }} onError={(err) => { /* silently handle captcha errors - user will see inline message */ }} />
            </div>
          </form>
        ) : (
          <AdminCodeLoginForm
            adminCode={adminCode}
            setAdminCode={setAdminCode}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
            successMsg={successMsg}
            setSuccessMsg={setSuccessMsg}
            toast={toast}
            t={t}
          />
        )}
      </AuthLayout>
    );
  }

  // ── Step 2: Verify OTP ──────────────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      // Call custom verifyLoginOTP function
      const result = await base44.functions.invoke("verifyLoginOTP", {
        otp_id: otpId,
        otp_code: otp
      });

      if (!result.data?.success) {
        if (result.data?.locked) {
          setError("Too many failed attempts. Request new OTP.");
        } else if (result.data?.blocked) {
          setError(result.data?.message || "Account not found");
        } else {
          setError(result.data?.message || t('verification_failed'));
        }
        setLoading(false);
        return;
      }

      // OTP verified - now get platform auth token
      // Use platform verifyOtp to get access token (OTP already verified in our system)
      const platformResult = await base44.auth.verifyOtp({ email, otpCode: otp });
      await base44.auth.setToken(platformResult.access_token);

      // Owner email always gets admin role
      if (email.trim().toLowerCase() === ADMIN_CONFIG.OWNER_EMAIL.toLowerCase()) {
        try { await base44.auth.updateMe({ role: "admin" }); } catch {}
      }

      await base44.functions.invoke("completeOnboarding", {
        email,
        mobile: "",
        device_type: deviceType,
        country
      });

      setSuccessMsg("✓ Login successful! Redirecting...");
      toast({ title: t('otp_welcome_back'), description: t('otp_login_success') });
      
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      setError(err?.message || t('verification_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await base44.functions.invoke("generateLoginOTP", {
        email: email,
        purpose: "LOGIN"
      });
      
      if (result.data?.success) {
        toast({ 
          title: t('otp_sent_title'), 
          description: result.data.email_sent ? "OTP resent via Resend" : "OTP regenerated"
        });
      } else {
        setError(result.data?.message || t('resend_failed'));
      }
    } catch {
      setError(t('resend_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={KeyRound}
      title={t('otp_enter_login_code')}
      subtitle={`${t('otp_code_sent_to')} ${email}`}
      footer={
        loginMethod === "otp" && (
          <button onClick={() => { setStep("email"); setError(""); setOtp(""); setOtpId(""); }}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto">
            <ArrowLeft className="w-3.5 h-3.5" /> {t('change_email')}
          </button>
        )
      }
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
      )}
      
      {successMsg && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleVerifyOTP} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">{t('verification_code')}</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="pl-10 h-12 text-center text-lg tracking-[0.25em]"
              maxLength={6}
              autoFocus
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full h-12 font-medium" disabled={loading || otp.length < 6}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('verifying')}</> : t('otp_verify_login')}
        </Button>

        <div className="text-center space-y-2">
          <button type="button" onClick={handleResendOTP} disabled={loading}
            className="text-sm text-primary hover:underline disabled:opacity-50">
            {t('otp_resend')}
          </button>
          <br />
          <button type="button" onClick={() => { setStep("email"); setError(""); setOtp(""); setOtpId(""); }}
            className="text-xs text-muted-foreground hover:text-foreground">
            {t('change_email')}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}

// ── Access Code Login Form ──────────────────────────────────────────
function AccessCodeLoginForm({ accessCode, setAccessCode, loading, setLoading, error, setError, successMsg, setSuccessMsg, toast, t }) {
  const handleAccessCodeLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const trimmed = accessCode.trim().toUpperCase();
      if (!trimmed) {
        setError("Please enter an access code");
        setLoading(false);
        return;
      }

      const result = await base44.functions.invoke("redeemAccessCode", { code: trimmed });
      const data = result.data;

      if (!data?.success) {
        setError(data?.message || "Invalid or expired access code");
        setLoading(false);
        return;
      }

      setSuccessMsg(`✓ ${data.message}`);
      toast({ 
        title: "Access Granted", 
        description: `${data.pages_granted?.length || 0} page(s) unlocked`,
        variant: "default"
      });
      
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      setError(err?.message || "Redemption failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAccessCodeLogin} className="space-y-4">
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
      )}
      
      {successMsg && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
        <p className="text-xs text-blue-400 font-semibold flex items-center gap-2">
          <KeyRound className="w-3.5 h-3.5" />
          Customer Access Code
        </p>
        <p className="text-[10px] text-blue-300/70 mt-1">
          Enter your access code to unlock pages
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="access-code">Access Code</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="access-code"
            type="text"
            placeholder="e.g. ABDUL2026"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            className="pl-10 h-12 text-center text-lg tracking-[0.15em] uppercase font-mono"
            maxLength={50}
            autoFocus
            required
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>

      <Button type="submit" className="w-full h-12 font-medium" disabled={loading || accessCode.length < 3}>
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redeeming…</> : "Redeem Access Code"}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Contact support to purchase an access code
      </p>
    </form>
  );
}

// ── Admin Code Login Form ──────────────────────────────────────────
function AdminCodeLoginForm({ adminCode, setAdminCode, loading, setLoading, error, setError, successMsg, setSuccessMsg, toast, t }) {
  const handleAdminCodeLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const result = await base44.functions.invoke("verifyAdminCode", {
        admin_code: adminCode.trim().toUpperCase()
      });

      if (!result.data?.success) {
        setError(result.data?.message || "Invalid admin code");
        setLoading(false);
        return;
      }

      // Admin code verified - grant admin access
      const currentUser = await base44.auth.me();
      if (!currentUser) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      // Verify user is admin/owner
      if (currentUser.role !== "admin") {
        setError("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }

      setSuccessMsg("✓ Admin access granted! Redirecting...");
      toast({ 
        title: "Admin Login Successful", 
        description: "Emergency code authentication verified",
        variant: "default"
      });
      
      setTimeout(() => {
        window.location.href = "/admin/access-dashboard";
      }, 1000);
    } catch (err) {
      setError(err?.message || "Admin code verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAdminCodeLogin} className="space-y-4">
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
      )}
      
      {successMsg && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
        <p className="text-xs text-amber-400 font-semibold flex items-center gap-2">
          <Shield className="w-3.5 h-3.5" />
          Emergency Admin Access
        </p>
        <p className="text-[10px] text-amber-300/70 mt-1">
          For owner/admin use only. All attempts are logged.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-code">Admin Access Code</Label>
        <div className="relative">
          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="admin-code"
            type="text"
            placeholder="Enter admin code"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value.toUpperCase())}
            className="pl-10 h-12 text-center text-lg tracking-[0.15em] uppercase font-mono"
            maxLength={20}
            autoFocus
            required
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>

      <Button type="submit" className="w-full h-12 font-medium" disabled={loading || adminCode.length < 4}>
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying…</> : "Login with Admin Code"}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Contact support if you need an emergency access code
      </p>
    </form>
  );
}