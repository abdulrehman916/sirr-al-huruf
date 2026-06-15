import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, KeyRound, ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AtmosphericBackground from "@/components/AtmosphericBackground";
import { derivePassword } from "@/lib/derivePassword";

const STEPS = { WELCOME: 0, EMAIL: 1, OTP: 2 };

function detectDevice() {
  const ua = (navigator.userAgent || "").toLowerCase();
  if (/mobi|android/.test(ua)) return "mobile";
  if (/tablet|ipad/.test(ua)) return "tablet";
  return "desktop";
}

export default function Onboarding() {
  const [step, setStep] = useState(STEPS.WELCOME);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.isAuthenticated().then((authed) => {
      if (authed) navigate("/", { replace: true });
    });
  }, [navigate]);

  const deviceType = detectDevice();

  const getCountry = () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz.startsWith("Asia/Dubai") || tz.startsWith("Asia/Muscat")) return "AE";
      if (tz.startsWith("Asia/Kolkata") || tz.startsWith("Asia/Calcutta")) return "IN";
      if (tz.startsWith("America/")) return "US";
      if (tz.startsWith("Europe/London")) return "GB";
      return tz.split("/")[0] === "Asia" ? "AE" : (tz.split("/")[1] || "").substring(0, 2).toUpperCase() || "";
    } catch { return ""; }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const pwd = derivePassword(email);
      setPassword(pwd);

      try {
        await base44.auth.register({ email, password: pwd });
      } catch (regErr) {
        if (regErr?.message?.includes?.("already exists")) {
          try { await base44.auth.resendOtp(email); } catch {}
        } else {
          throw regErr;
        }
      }

      setStep(STEPS.OTP);
      toast({ title: "Verification Code Sent", description: "Check your email for the 6-digit code" });
    } catch (err) {
      setError(err?.message || "Unable to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const verifyResult = await base44.auth.verifyOtp({ email, otpCode: otp });
      await base44.auth.setToken(verifyResult.access_token);

      await base44.functions.invoke("completeOnboarding", {
        email,
        mobile: "",
        device_type: deviceType,
        country: getCountry()
      });

      toast({ title: "Welcome!", description: "Your account is ready." });
      window.location.href = "/";
    } catch (err) {
      setError(err?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      try { await base44.auth.resendOtp(email); } catch {
        const pwd = derivePassword(email);
        setPassword(pwd);
        await base44.auth.register({ email, password: pwd });
      }
      toast({ title: "Code Resent", description: "Check your email" });
    } catch {
      toast({ title: "Error", description: "Failed to resend OTP", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => navigate("/otp-login");

  // ── WELCOME ──────────────────────────────────────────────────────
  if (step === STEPS.WELCOME) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[100dvh] px-5 text-center overflow-hidden"
        style={{ background: "linear-gradient(180deg, #020710 0%, #050d1a 45%, #08101f 100%)" }}>
        <AtmosphericBackground />
        <div className="relative z-10 w-full max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ background: "linear-gradient(145deg, rgba(212,175,55,0.22), rgba(212,175,55,0.06))", border: "1px solid rgba(212,175,55,0.25)" }}>
            <Sparkles className="w-8 h-8" style={{ color: "#D4AF37" }} />
          </div>
          <h1 className="font-amiri font-bold leading-tight mb-2"
            style={{ fontSize: "2rem", color: "#f5ead4", textShadow: "0 0 20px rgba(212,175,55,0.25)" }}>
            سرّ الحروف
          </h1>
          <p className="font-inter text-xs tracking-[0.25em] uppercase mb-6"
            style={{ color: "rgba(212,175,55,0.70)" }}>
            Sirr al-Huruf
          </p>
          <p className="font-inter text-sm mb-8 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.55)" }}>
            Welcome to the occult encyclopedia of magick squares, planetary hours, and sacred letter sciences.
          </p>
          <Button onClick={() => setStep(STEPS.EMAIL)}
            className="w-full h-12 font-medium btn-gold" style={{ fontSize: "0.95rem" }}>
            Get Started <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <p className="font-inter text-xs mt-6" style={{ color: "rgba(255,255,255,0.25)" }}>
            Already have an account?{" "}
            <button onClick={goToLogin} className="underline" style={{ color: "rgba(212,175,55,0.70)" }}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100dvh] px-5 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #020710 0%, #050d1a 45%, #08101f 100%)" }}>
      <AtmosphericBackground />
      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <h2 className="font-amiri font-bold text-xl mb-1" style={{ color: "#f5ead4" }}>
            {step === STEPS.EMAIL ? "تسجيل الدخول" : "أدخل الرمز"}
          </h2>
          <p className="font-inter text-[10px] tracking-[0.2em] uppercase"
            style={{ color: "rgba(212,175,55,0.60)" }}>
            {step === STEPS.EMAIL ? "Enter your email" : "Enter verification code"}
          </p>
        </div>

        <div className="card-dark p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5" }}>
              {error}
            </div>
          )}

          {step === STEPS.EMAIL ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-1.5">
                <Label style={{ color: "rgba(255,255,255,0.60)", fontSize: "0.8rem" }}>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.30)" }} />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", color: "#e0e0e0", fontSize: "16px" }}
                    autoFocus
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 font-medium btn-gold" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : "Send Verification Code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <p className="text-sm text-center" style={{ color: "rgba(255,255,255,0.45)" }}>
                Code sent to{" "}
                <span style={{ color: "rgba(255,255,255,0.75)" }}>{email}</span>
              </p>

              <div className="space-y-1.5">
                <Label htmlFor="otp" style={{ color: "rgba(255,255,255,0.60)", fontSize: "0.8rem" }}>Verification Code</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.30)" }} />
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-10 h-12 text-center text-lg tracking-[0.3em]"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", color: "#e0e0e0", fontSize: "20px" }}
                    maxLength={6}
                    autoFocus
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 font-medium btn-gold" disabled={loading || otp.length < 6}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</> : "Verify & Enter"}
              </Button>

              <div className="text-center space-y-2">
                <button type="button" onClick={handleResendOTP} disabled={loading}
                  className="text-sm underline" style={{ color: "rgba(212,175,55,0.70)" }}>
                  Resend Code
                </button>
                <br />
                <button type="button" onClick={() => { setStep(STEPS.EMAIL); setError(""); }}
                  className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Change email
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}