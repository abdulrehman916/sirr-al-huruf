import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LogIn, Mail, Lock, Loader2, ShieldCheck, KeyRound } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { ADMIN_CONFIG } from "@/lib/adminConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(
    () => localStorage.getItem("sirr_remember_me") !== "false"
  );

  // Owner-only 2FA state
  const [twofaStep, setTwofaStep] = useState(false);
  const [twofaToken, setTwofaToken] = useState("");
  const [twofaOtp, setTwofaOtp] = useState("");
  const [twofaError, setTwofaError] = useState("");
  const [twofaLoading, setTwofaLoading] = useState(false);

  const isOwnerEmail = (em) =>
    !!em && ADMIN_CONFIG.OWNER_EMAIL &&
    em.toLowerCase() === String(ADMIN_CONFIG.OWNER_EMAIL).toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Step 1 — verify password (platform issues a session token).
      await base44.auth.loginViaEmailPassword(email, password);

      const me = await base44.auth.me();
      if (isOwnerEmail(me?.email)) {
        // Step 2 (Owner only) — send a 6-digit code, then "park" the session:
        // clear the in-memory + stored token WITHOUT a page reload so the app
        // is inaccessible until the code is verified. logout() is avoided here
        // because it forces a redirect/reload.
        const res = await base44.functions.invoke("owner2fa", { action: "SEND_OTP" });
        try { base44.auth.setToken(null); } catch { /* ignore */ }
        try { localStorage.removeItem("base44_access_token"); } catch { /* ignore */ }
        try { localStorage.removeItem("token"); } catch { /* ignore */ }
        setTwofaToken(res.data?.token || "");
        setTwofaStep(true);
        setLoading(false);
      } else {
        // Admin / Customer — no 2FA required.
        window.location.href = "/";
      }
    } catch (err) {
      // If a session was created but 2FA send failed, park/clear it to deny
      // access (without a reload so the error is visible).
      try { base44.auth.setToken(null); } catch { /* ignore */ }
      try { localStorage.removeItem("base44_access_token"); } catch { /* ignore */ }
      try { localStorage.removeItem("token"); } catch { /* ignore */ }
      setError(err?.response?.data?.error || err?.message || "Invalid email or password");
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setTwofaError("");
    setTwofaLoading(true);
    try {
      const res = await base44.functions.invoke("owner2fa", {
        action: "VERIFY_OTP",
        otp: twofaOtp.trim(),
        token: twofaToken,
      });
      if (res.data && res.data.ok) {
        // Step 3 — re-authenticate now that 2FA passed; issues a fresh token.
        await base44.auth.loginViaEmailPassword(email, password);
        window.location.href = "/";
      } else {
        setTwofaError((res.data && res.data.error) || "Incorrect verification code");
        setTwofaLoading(false);
      }
    } catch (err) {
      setTwofaError(err?.response?.data?.error || err?.message || "Verification failed");
      setTwofaLoading(false);
    }
  };

  const handleCancel2fa = () => {
    // Deny access: fully clear the parked session and return to the login form.
    setTwofaStep(false);
    setTwofaToken("");
    setTwofaOtp("");
    setTwofaError("");
    try { base44.auth.logout(); } catch { /* ignore */ }
  };

  // ── Owner 2FA verification screen ──
  if (twofaStep) {
    return (
      <AuthLayout
        icon={ShieldCheck}
        title="Two-factor verification"
        subtitle="A 6-digit code was sent to your Owner email"
      >
        {twofaError && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {twofaError}
          </div>
        )}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification code</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                placeholder="123456"
                value={twofaOtp}
                onChange={(e) => setTwofaOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="pl-10 h-12 tracking-[0.4em] text-center font-semibold"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-12 font-medium" disabled={twofaLoading}>
            {twofaLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & log in"
            )}
          </Button>
          <button
            type="button"
            onClick={handleCancel2fa}
            className="w-full text-xs text-muted-foreground hover:underline"
          >
            Cancel
          </button>
        </form>
      </AuthLayout>
    );
  }

  // ── Standard login screen ──
  return (
    <AuthLayout
      icon={LogIn}
      title="Welcome back"
      subtitle="Log in to your account"
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(v) => {
              setRemember(!!v);
              localStorage.setItem("sirr_remember_me", v ? "true" : "false");
            }}
          />
          <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
            Remember me
          </Label>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log in"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}