import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, KeyRound, ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { useToast } from "@/components/ui/use-toast";
import { derivePassword } from "@/lib/derivePassword";
import { detectDevice, getCountry } from "@/lib/deviceUtils";
import useTranslation from "@/i18n/useTranslation";
import { ADMIN_CONFIG } from "@/lib/adminConfig";
import Captcha from "@/components/Captcha";

export default function OTPLogin() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const deviceType = detectDevice();
  const country = getCountry();

  // ── Step 1: Enter email ──────────────────────────────────────────
  if (step === "email") {
    const handleSendOTP = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        if (!captchaVerified) {
          setError("Please complete the security check");
          setLoading(false);
          return;
        }
        try {
          await base44.auth.register({ email, password: derivePassword(email) });
        } catch {
          try { await base44.auth.resendOtp(email); } catch {
            setError(t('unable_send_otp'));
            setLoading(false);
            return;
          }
        }
        setStep("verify");
        toast({ title: t('otp_sent_title'), description: t('otp_sent_desc') });
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
            <Captcha onVerify={(token) => { setCaptchaToken(token); setCaptchaVerified(true); }} onError={(err) => setError(`CAPTCHA: ${err}`)} />
          </div>
        </form>
      </AuthLayout>
    );
  }

  // ── Step 2: Verify OTP ──────────────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await base44.auth.verifyOtp({ email, otpCode: otp });
      await base44.auth.setToken(result.access_token);

      // Owner email always gets admin role on every device
      if (email.trim().toLowerCase() === ADMIN_CONFIG.OWNER_EMAIL.toLowerCase()) {
        try { await base44.auth.updateMe({ role: "admin" }); } catch {}
      }

      await base44.functions.invoke("completeOnboarding", {
        email,
        mobile: "",
        device_type: deviceType,
        country
      });

      toast({ title: t('otp_welcome_back'), description: t('otp_login_success') });
      window.location.href = "/";
    } catch (err) {
      setError(err?.message || t('verification_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      try { await base44.auth.resendOtp(email); } catch {
        await base44.auth.register({ email, password: derivePassword(email) });
      }
      toast({ title: t('otp_sent_title'), description: t('otp_sent_desc') });
    } catch {
      toast({ title: t('error_title'), description: t('resend_failed'), variant: "destructive" });
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
        <button onClick={() => { setStep("email"); setError(""); }}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto">
          <ArrowLeft className="w-3.5 h-3.5" /> {t('change_email')}
        </button>
      }
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
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
          <button type="button" onClick={() => { setStep("email"); setError(""); setOtp(""); }}
            className="text-xs text-muted-foreground hover:text-foreground">
            {t('change_email')}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}