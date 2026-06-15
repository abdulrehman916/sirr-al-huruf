import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, Mail, Loader2, KeyRound, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AtmosphericBackground from "@/components/AtmosphericBackground";

const STEPS = { WELCOME: 0, CONTACT: 1, OTP: 2, COMPLETE: 3 };

export default function Onboarding() {
  const [step, setStep] = useState(STEPS.WELCOME);
  const [contactType, setContactType] = useState("mobile");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpId, setOtpId] = useState(null);
  const [verifyToken, setVerifyToken] = useState(null);
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
      const contactValue = contactType === "mobile" ? mobile : email;
      const response = await base44.functions.invoke("generateLoginOTP", {
        mobile: contactType === "mobile" ? contactValue : "",
        email: contactType === "email" ? contactValue : "",
        purpose: "REGISTRATION"
      });
      if (response.data.success) {
        setOtpId(response.data.otp_id);
        setStep(STEPS.OTP);
        toast({ title: "OTP Sent", description: `Check your ${contactType}` });
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Unable to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const contactValue = contactType === "mobile" ? mobile : email;
      const verifyRes = await base44.functions.invoke("verifyOTP", {
        otp_id: otpId,
        otp_code: otp
      });
      if (!verifyRes.data.success) {
        setError(verifyRes.data.message || verifyRes.data.error || "Invalid OTP");
        setLoading(false);
        return;
      }

      // Store the token for later use
      setVerifyToken(verifyRes.data.access_token);

      // Complete onboarding — create profile
      const onboardRes = await base44.functions.invoke("completeOnboarding", {
        email: contactType === "email" ? contactValue : "",
        mobile: contactType === "mobile" ? contactValue : "",
        otp_id: otpId
      });

      if (onboardRes.data.success) {
        // Try to auto-register on the platform if email provided
        if (contactType === "email") {
          try {
            const randomPwd = "b44_" + Math.random().toString(36).substring(2, 15);
            await base44.auth.register({ email: contactValue, password: randomPwd });
            // Registration succeeded — now verify with the platform's OTP flow
            // The platform may send its own OTP; use our verified token meanwhile
          } catch (regErr) {
            // Registration might fail if user already exists — that's fine
          }
        }

        // Set token and enter the app
        await base44.auth.setToken(verifyRes.data.access_token);
        toast({ title: "Welcome!", description: "Your account is ready." });
        window.location.href = "/";
      } else {
        setError(onboardRes.data.message || "Failed to complete setup");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const contactValue = contactType === "mobile" ? mobile : email;
      const response = await base44.functions.invoke("generateLoginOTP", {
        mobile: contactType === "mobile" ? contactValue : "",
        email: contactType === "email" ? contactValue : "",
        purpose: "REGISTRATION"
      });
      if (response.data.success) {
        setOtpId(response.data.otp_id);
        toast({ title: "OTP Resent", description: "Check your messages" });
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
            {step === STEPS.CONTACT ? "Enter your details" : "Enter OTP"}
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
                <button type="button" onClick={() => setContactType("mobile")}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: contactType === "mobile" ? "rgba(212,175,55,0.18)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${contactType === "mobile" ? "rgba(212,175,55,0.45)" : "rgba(255,255,255,0.08)"}`,
                    color: contactType === "mobile" ? "#E8C84A" : "rgba(255,255,255,0.50)"
                  }}>
                  <Smartphone className="w-4 h-4" /> Mobile
                </button>
                <button type="button" onClick={() => setContactType("email")}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: contactType === "email" ? "rgba(212,175,55,0.18)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${contactType === "email" ? "rgba(212,175,55,0.45)" : "rgba(255,255,255,0.08)"}`,
                    color: contactType === "email" ? "#E8C84A" : "rgba(255,255,255,0.50)"
                  }}>
                  <Mail className="w-4 h-4" /> Email
                </button>
              </div>

              <div className="space-y-1.5">
                <Label style={{ color: "rgba(255,255,255,0.60)", fontSize: "0.8rem" }}>
                  {contactType === "mobile" ? "Mobile Number" : "Email Address"}
                </Label>
                <div className="relative">
                  {contactType === "mobile"
                    ? <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.30)" }} />
                    : <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.30)" }} />
                  }
                  <Input
                    type={contactType === "mobile" ? "tel" : "email"}
                    placeholder={contactType === "mobile" ? "+971 50 123 4567" : "you@example.com"}
                    value={contactType === "mobile" ? mobile : email}
                    onChange={(e) => contactType === "mobile" ? setMobile(e.target.value) : setEmail(e.target.value)}
                    className="pl-10 h-12"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", color: "#e0e0e0", fontSize: "16px" }}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 font-medium btn-gold" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <p className="text-sm text-center" style={{ color: "rgba(255,255,255,0.45)" }}>
                Code sent to{" "}
                <span style={{ color: "rgba(255,255,255,0.75)" }}>
                  {contactType === "mobile" ? mobile : email}
                </span>
              </p>

              <div className="space-y-1.5">
                <Label htmlFor="otp" style={{ color: "rgba(255,255,255,0.60)", fontSize: "0.8rem" }}>OTP Code</Label>
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
                  Resend OTP
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