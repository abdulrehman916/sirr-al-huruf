import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, KeyRound, ArrowLeft, ShieldCheck } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { useToast } from "@/components/ui/use-toast";
import { derivePassword } from "@/lib/derivePassword";

function detectDevice() {
  const ua = (navigator.userAgent || "").toLowerCase();
  if (/mobi|android/.test(ua)) return "mobile";
  if (/tablet|ipad/.test(ua)) return "tablet";
  return "desktop";
}

function getCountry() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.startsWith("Asia/Dubai") || tz.startsWith("Asia/Muscat")) return "AE";
    if (tz.startsWith("Asia/Kolkata") || tz.startsWith("Asia/Calcutta")) return "IN";
    if (tz.startsWith("America/")) return "US";
    if (tz.startsWith("Europe/London")) return "GB";
    return tz.split("/")[0] === "Asia" ? "AE" : (tz.split("/")[1] || "").substring(0, 2).toUpperCase() || "";
  } catch { return ""; }
}

export default function OTPLogin() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const deviceType = detectDevice();
  const country = getCountry();

  // ── Step 1: Enter email ──────────────────────────────────────────
  if (step === "email") {
    const handleSendOTP = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        try {
          await base44.auth.register({ email, password: derivePassword(email) });
        } catch {
          try { await base44.auth.resendOtp(email); } catch {
            setError("Unable to send OTP. Please check your email.");
            setLoading(false);
            return;
          }
        }
        setStep("verify");
        toast({ title: "OTP Sent", description: "Check your email for the 6-digit code" });
      } catch (err) {
        setError(err?.message || "Failed to send OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <AuthLayout
        icon={Mail}
        title="Login with Email"
        subtitle="Enter your email to receive a verification code"
        footer={
          <>
            New user?{" "}
            <Link to="/onboarding" className="text-primary font-medium hover:underline">
              Create account
            </Link>
          </>
        }
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
        )}

        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
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
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : "Send OTP"}
          </Button>
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

      await base44.functions.invoke("completeOnboarding", {
        email,
        mobile: "",
        device_type: deviceType,
        country
      });

      toast({ title: "Welcome back!", description: "Login successful." });
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
        await base44.auth.register({ email, password: derivePassword(email) });
      }
      toast({ title: "OTP Resent", description: "Check your email" });
    } catch {
      toast({ title: "Error", description: "Failed to resend OTP", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={KeyRound}
      title="Enter OTP Code"
      subtitle={`We sent a 6-digit code to ${email}`}
      footer={
        <button onClick={() => { setStep("email"); setError(""); }}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto">
          <ArrowLeft className="w-3.5 h-3.5" /> Change email
        </button>
      }
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
      )}

      <form onSubmit={handleVerifyOTP} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">OTP Code</Label>
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
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</> : "Verify & Login"}
        </Button>

        <div className="text-center space-y-2">
          <button type="button" onClick={handleResendOTP} disabled={loading}
            className="text-sm text-primary hover:underline disabled:opacity-50">
            Resend OTP
          </button>
          <br />
          <button type="button" onClick={() => { setStep("email"); setError(""); setOtp(""); }}
            className="text-xs text-muted-foreground hover:text-foreground">
            Change email
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}