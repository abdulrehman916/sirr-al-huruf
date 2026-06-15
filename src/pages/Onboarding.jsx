import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, Mail, Loader2, KeyRound, ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AtmosphericBackground from "@/components/AtmosphericBackground";

const STEPS = { WELCOME: 0, CONTACT: 1, OTP: 2 };

function generatePassword() {
  return "sah_" + Math.random().toString(36).substring(2, 18) + "!A1";
}

function generateEmailFromPhone(phone) {
  const digits = (phone || "").replace(/\D/g, "").slice(-10);
  return `user${digits}@sirralhuruf.internal`;
}

export default function Onboarding() {
  const [step, setStep] = useState(STEPS.WELCOME);
  const [contactType, setContactType] = useState("email");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpId, setOtpId] = useState(null);
  const [password, setPassword] = useState("");
  const [platformEmail, setPlatformEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Skip if already authenticated
  useEffect(() => {
    base44.auth.isAuthenticated().then((authed) => {
      if (authed) navigate("/", { replace: true });
    });
  }, [navigate]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (contactType === "email") {
        // ── Email: Full platform auth ────────────────────────────
        const pwd = generatePassword();
        setPassword(pwd);
        setPlatformEmail(email);

        await base44.auth.register({ email, password: pwd });
        // Platform sends OTP to email — show OTP input
        setStep(STEPS.OTP);
        toast({ title: "Verification Code Sent", description: "Check your email for the 6-digit code" });
      } else {
        // ── Mobile: Custom OTP via SMS ───────────────────────────
        const response = await base44.functions.invoke("generateLoginOTP", {
          mobile,
          email: "",
          purpose: "REGISTRATION"
        });
        if (response.data?.success) {
          setOtpId(response.data.otp_id);
          // Also generate platform credentials for later use
          const genEmail = generateEmailFromPhone(mobile);
          const pwd = generatePassword();
          setPassword(pwd);
          setPlatformEmail(genEmail);
          setStep(STEPS.OTP);
          toast({ title: "OTP Sent", description: "Check your phone for the verification code" });
        } else {
          setError(response.data?.message || "Failed to send OTP");
        }
      }
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
      if (contactType === "email") {
        // ── Email: Verify platform OTP ───────────────────────────
        const verifyResult = await base44.auth.verifyOtp({ email: platformEmail, otpCode: otp });
        await base44.auth.setToken(verifyResult.access_token);

        // Complete onboarding profile
        await base44.functions.invoke("completeOnboarding", {
          email: platformEmail,
          mobile: ""
        });

        toast({ title: "Welcome!", description: "Your account is ready." });
        window.location.href = "/";
      } else {
        // ── Mobile: Verify custom OTP, then register on platform ─
        const verifyRes = await base44.functions.invoke("verifyOTP", {
          otp_id: otpId,
          otp_code: otp
        });
        if (!verifyRes.data?.success) {
          setError(verifyRes.data?.message || verifyRes.data?.error || "Invalid OTP");
          setLoading(false);
          return;
        }

        // Create platform account with generated email
        try {
          await base44.auth.register({ email: platformEmail, password });
        } catch (regErr) {
          // User may already exist — try logging in directly
        }

        // Attempt platform login
        try {
          await base44.auth.loginViaEmailPassword(platformEmail, password);
          // Success — real platform session
        } catch (loginErr) {
          // If login fails (unverified), show error and suggest email
          setError("Mobile login unavailable. Please use Email option instead.");
          setLoading(false);
          return;
        }

        await base44.functions.invoke("completeOnboarding", {
          email: platformEmail,
          mobile: mobile,
          otp_id: otpId
        });

        toast({ title: "Welcome!", description: "Your account is ready." });
        window.location.href = "/";
      }
    } catch (err) {
      setError(err?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      if (contactType === "email") {
        // Re-register to trigger new platform OTP
        const pwd = generatePassword();
        setPassword(pwd);
        await base44.auth.register({ email: platformEmail, password: pwd });
        toast({ title: "Code Resent", description: "Check your email" });
      } else {
        const response = await base44.functions.invoke("generateLoginOTP", {
          mobile,
          email: "",
          purpose: "REGISTRATION"
        });
        if (response.data?.success) {
          setOtpId(response.data.otp_id);
          toast({ title: "OTP Resent", description: "Check your phone" });
        }
      }
    } catch {
      toast({ title: "Error", description: "Failed to resend OTP", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => navigate("/otp-login");

  // ── Step 0: Welcome ──
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

          <Button
            onClick={() => setStep(STEPS.CONTACT)}
            className="w-full h-12 font-medium btn-gold"
            style={{ fontSize: "0.95rem" }}
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-1" />
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

  // ── Steps 1 & 2: Contact + OTP ──
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100dvh] px-5 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #020710 0%, #050d1a 45%, #08101f 100%)" }}>
      <AtmosphericBackground />
      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <h2 className="font-amiri font-bold text-xl mb-1" style={{ color: "#f5ead4" }}>
            {step === STEPS.CONTACT ? "تسجيل الدخول" : "أدخل الرمز"}
          </h2>
          <p className="font-inter text-[10px] tracking-[0.2em] uppercase"
            style={{ color: "rgba(212,175,55,0.60)" }}>
            {step === STEPS.CONTACT ? "Enter your details" : "Enter verification code"}
          </p>
        </div>

        <div className="card-dark p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5" }}>
              {error}
            </div>
          )}

          {step === STEPS.CONTACT ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setContactType("email")}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: contactType === "email" ? "rgba(212,175,55,0.18)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${contactType === "email" ? "rgba(212,175,55,0.45)" : "rgba(255,255,255,0.08)"}`,
                    color: contactType === "email" ? "#E8C84A" : "rgba(255,255,255,0.50)"
                  }}>
                  <Mail className="w-4 h-4" /> Email
                </button>
                <button type="button" onClick={() => setContactType("mobile")}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: contactType === "mobile" ? "rgba(212,175,55,0.18)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${contactType === "mobile" ? "rgba(212,175,55,0.45)" : "rgba(255,255,255,0.08)"}`,
                    color: contactType === "mobile" ? "#E8C84A" : "rgba(255,255,255,0.50)"
                  }}>
                  <Smartphone className="w-4 h-4" /> Mobile
                </button>
              </div>

              <div className="space-y-1.5">
                <Label style={{ color: "rgba(255,255,255,0.60)", fontSize: "0.8rem" }}>
                  {contactType === "email" ? "Email Address" : "Mobile Number"}
                </Label>
                <div className="relative">
                  {contactType === "email"
                    ? <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.30)" }} />
                    : <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.30)" }} />
                  }
                  <Input
                    type={contactType === "email" ? "email" : "tel"}
                    placeholder={contactType === "email" ? "you@example.com" : "+971 50 123 4567"}
                    value={contactType === "email" ? email : mobile}
                    onChange={(e) => contactType === "email" ? setEmail(e.target.value) : setMobile(e.target.value)}
                    className="pl-10 h-12"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", color: "#e0e0e0", fontSize: "16px" }}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 font-medium btn-gold" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : `Send ${contactType === "email" ? "Verification" : "OTP"}`}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <p className="text-sm text-center" style={{ color: "rgba(255,255,255,0.45)" }}>
                Code sent to{" "}
                <span style={{ color: "rgba(255,255,255,0.75)" }}>
                  {contactType === "email" ? email : mobile}
                </span>
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
                <button type="button" onClick={() => { setStep(STEPS.CONTACT); setError(""); }}
                  className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Change {contactType}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}