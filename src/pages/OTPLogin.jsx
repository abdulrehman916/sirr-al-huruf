import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Smartphone, Loader2, KeyRound, ArrowLeft, ShieldCheck } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { useToast } from "@/components/ui/use-toast";
import { derivePassword } from "@/lib/derivePassword";

export default function OTPLogin() {
  const [step, setStep] = useState("choose"); // choose | contact | verify
  const [contactType, setContactType] = useState(null); // "email" | "mobile"
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpId, setOtpId] = useState(null);
  const { toast } = useToast();

  // ── Step 1: Choose method ─────────────────────────────────────────
  if (step === "choose") {
    return (
      <AuthLayout
        icon={ShieldCheck}
        title="Login with OTP"
        subtitle="Choose your verification method"
        footer={
          <>
            New user?{" "}
            <Link to="/onboarding" className="text-primary font-medium hover:underline">
              Create account
            </Link>
          </>
        }
      >
        <div className="space-y-3">
          {/* Option 1: Email */}
          <button
            onClick={() => { setContactType("email"); setStep("contact"); }}
            className="w-full flex items-center gap-4 p-5 rounded-xl text-left transition-all
              bg-card hover:bg-accent/5 border border-border hover:border-primary/30"
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)" }}>
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-base">Login with Email</p>
              <p className="text-sm text-muted-foreground">Send OTP to your email</p>
            </div>
          </button>

          {/* Option 2: Phone */}
          <button
            onClick={() => { setContactType("mobile"); setStep("contact"); }}
            className="w-full flex items-center gap-4 p-5 rounded-xl text-left transition-all
              bg-card hover:bg-accent/5 border border-border hover:border-primary/30"
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}>
              <Smartphone className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-base">Login with Phone</p>
              <p className="text-sm text-muted-foreground">Send OTP by SMS</p>
            </div>
          </button>
        </div>
      </AuthLayout>
    );
  }

  // ── Step 2: Enter contact & send OTP ──────────────────────────────
  if (step === "contact") {
    const handleSendOTP = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        if (contactType === "email") {
          // ── EMAIL: Use platform's native OTP ───────────────────
          const pwd = derivePassword(email);

          try {
            // Try registering — platform sends OTP to email
            await base44.auth.register({ email, password: pwd });
          } catch (regErr) {
            // Email already registered — resend OTP instead
            try {
              await base44.auth.resendOtp(email);
            } catch (resendErr) {
              setError("Unable to send OTP. Please try again.");
              setLoading(false);
              return;
            }
          }

          setStep("verify");
          toast({ title: "OTP Sent", description: "Check your email for the 6-digit code" });
        } else {
          // ── MOBILE: Custom SMS OTP ────────────────────────────
          const response = await base44.functions.invoke("generateLoginOTP", {
            mobile,
            email: "",
            purpose: "LOGIN"
          });

          if (response.data?.success) {
            setOtpId(response.data.otp_id);
            setStep("verify");
            toast({ title: "OTP Sent", description: "Check your phone for the verification code" });
          } else {
            setError(response.data?.message || "Failed to send OTP");
          }
        }
      } catch (err) {
        setError(err?.message || "Failed to send OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <AuthLayout
        icon={contactType === "email" ? Mail : Smartphone}
        title={contactType === "email" ? "Login with Email" : "Login with Phone"}
        subtitle={contactType === "email" ? "Enter your email to receive a code" : "Enter your phone to receive an SMS code"}
        footer={
          <button onClick={() => { setStep("choose"); setError(""); }} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto">
            <ArrowLeft className="w-3.5 h-3.5" /> Choose another method
          </button>
        }
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
        )}

        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact">{contactType === "email" ? "Email Address" : "Mobile Number"}</Label>
            <div className="relative">
              {contactType === "email" ? (
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              ) : (
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              )}
              <Input
                id="contact"
                type={contactType === "email" ? "email" : "tel"}
                placeholder={contactType === "email" ? "you@example.com" : "+971 50 123 4567"}
                value={contactType === "email" ? email : mobile}
                onChange={(e) => contactType === "email" ? setEmail(e.target.value) : setMobile(e.target.value)}
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

  // ── Step 3: Verify OTP ────────────────────────────────────────────
  const contactValue = contactType === "email" ? email : mobile;

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (contactType === "email") {
        // ── EMAIL: Platform-native OTP verification ──────────────
        const result = await base44.auth.verifyOtp({ email, otpCode: otp });
        await base44.auth.setToken(result.access_token);

        await base44.functions.invoke("completeOnboarding", {
          email,
          mobile: ""
        });

        toast({ title: "Welcome back!", description: "Login successful." });
        window.location.href = "/";
      } else {
        // ── MOBILE: Custom OTP verification ─────────────────────
        const verifyRes = await base44.functions.invoke("verifyLoginOTP", {
          otp_id: otpId,
          otp_code: otp
        });

        if (!verifyRes.data?.success) {
          setError(verifyRes.data?.message || "Invalid OTP code");
          setLoading(false);
          return;
        }

        // Create platform account with synthetic email
        const synthEmail = `user${mobile.replace(/\D/g, "").slice(-10)}@sirralhuruf.internal`;
        const pwd = derivePassword(synthEmail);

        let authed = false;
        try {
          await base44.auth.loginViaEmailPassword(synthEmail, pwd);
          authed = true;
        } catch {
          try {
            await base44.auth.register({ email: synthEmail, password: pwd });
            await base44.auth.loginViaEmailPassword(synthEmail, pwd);
            authed = true;
          } catch {
            // Can't fully authenticate — still sync profile
          }
        }

        await base44.functions.invoke("completeOnboarding", {
          email: synthEmail,
          mobile,
        });

        if (authed) {
          toast({ title: "Welcome back!", description: "Login successful." });
          window.location.href = "/";
        } else {
          toast({
            title: "Limited Access",
            description: "Phone login works best after email registration. Some features may be limited.",
          });
          window.location.href = "/";
        }
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
        try {
          await base44.auth.resendOtp(email);
        } catch {
          // If resendOtp fails, try register again
          await base44.auth.register({ email, password: derivePassword(email) });
        }
        toast({ title: "OTP Resent", description: "Check your email" });
      } else {
        const response = await base44.functions.invoke("generateLoginOTP", {
          mobile,
          email: "",
          purpose: "LOGIN"
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

  return (
    <AuthLayout
      icon={KeyRound}
      title="Enter OTP Code"
      subtitle={`We sent a 6-digit code to your ${contactType === "email" ? "email" : "phone"}`}
      footer={
        <button onClick={() => { setStep("choose"); setError(""); }} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto">
          <ArrowLeft className="w-3.5 h-3.5" /> Choose another method
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
          <button type="button" onClick={() => { setStep("contact"); setError(""); setOtp(""); }}
            className="text-xs text-muted-foreground hover:text-foreground">
            Change {contactType === "email" ? "email" : "number"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}