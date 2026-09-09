import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, KeyRound, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { persistSet } from "@/lib/devModePersistence";
import { ADMIN_CONFIG } from "@/lib/adminConfig";

export default function Login() {
  const [searchParams] = useSearchParams();
  const requested = searchParams.get("redirect") || "/";
  const returnTo = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [ownerMode, setOwnerMode] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const googleEnabled = import.meta.env.VITE_GOOGLE_AUTH_ENABLED === "true";

  async function continueWithGoogle() {
    setError("");
    setLoading(true);
    try {
      persistSet("sirr_admin_session", "true");
      await base44.auth.loginWithProvider("google", returnTo);
    } catch (err) {
      setError(err?.message || "Google login failed.");
      setLoading(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const isOwnerEmail = cleanEmail === ADMIN_CONFIG.OWNER_EMAIL.toLowerCase();
      if (isOwnerEmail) {
        if (!ownerMode) {
          setOwnerMode(true);
          return;
        }
        await base44.auth.login({ email: cleanEmail, password });
        const account = await base44.auth.me();
        if (account?.email?.toLowerCase() !== ADMIN_CONFIG.OWNER_EMAIL.toLowerCase()) {
          await base44.auth.logout();
          throw new Error("Owner verification failed.");
        }
        persistSet("sirr_admin_session", "true");
        window.location.assign("/admin/access-dashboard");
        return;
      }
      if (!otpSent) {
        const callback = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(returnTo)}`;
        await base44.auth.requestLoginOtp({ email: cleanEmail, redirectTo: callback });
        setOtpSent(true);
      } else {
        await base44.auth.verifyLoginOtp({ email: cleanEmail, token: otp.trim() });
        persistSet("sirr_admin_session", "true");
        window.location.assign(returnTo);
      }
    } catch (err) {
      setError(err?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout icon={ShieldCheck} title="Sirr al-Huruf"
      subtitle="നിങ്ങളുടെ email ഉപയോഗിച്ച് സുരക്ഷിതമായി തുടരുക"
      footer="പുതിയ email ആണെങ്കിൽ account സ്വയം സൃഷ്ടിക്കപ്പെടും. Password ഓർക്കേണ്ടതില്ല.">
      {error && <div role="alert" className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      {googleEnabled && <>
        <Button type="button" variant="outline" onClick={continueWithGoogle}
          className="mb-5 h-12 w-full border-white/20 bg-white text-sm font-semibold text-slate-900 hover:bg-white/90"
          disabled={loading}>
          <GoogleIcon className="mr-2 h-5 w-5" />Continue with Google
        </Button>
        <div className="relative mb-5"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"/></div><div className="relative flex justify-center text-[10px] uppercase"><span className="bg-[#07101f] px-3 text-white/45">or use email</span></div></div>
      </>}
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email" className="text-white/80">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input id="login-email" type="email" autoComplete="email" autoFocus value={email}
              onChange={(event) => setEmail(event.target.value)} className="h-12 border-white/25 bg-white/[0.04] pl-10 text-base text-white caret-yellow-300 placeholder:text-white/30"
              placeholder="name@example.com" disabled={otpSent || ownerMode || loading} required />
          </div>
        </div>
        {ownerMode && <div className="space-y-2">
          <Label htmlFor="owner-password" className="text-white/80">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input id="owner-password" type="password" autoComplete="current-password" value={password}
              onChange={(event) => setPassword(event.target.value)} className="h-12 border-white/25 bg-white/[0.04] pl-10 text-base text-white caret-yellow-300 placeholder:text-white/30" required autoFocus />
          </div>
        </div>}
        {otpSent && <div className="space-y-2">
          <Label htmlFor="login-otp" className="text-white/80">Email verification code</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input id="login-otp" inputMode="numeric" autoComplete="one-time-code" value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 8))}
              className="h-12 border-white/25 bg-white/[0.04] pl-10 text-base text-white caret-yellow-300 placeholder:text-white/30 tracking-[0.25em]" placeholder="000000" required />
          </div>
          <p className="text-xs leading-5 text-muted-foreground">Email-ൽ വന്ന code നൽകുക. Magic Link ലഭിച്ചെങ്കിൽ അതിൽ touch ചെയ്യാം.</p>
        </div>}
        <Button type="submit" className="h-12 w-full font-medium" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait…</> : ownerMode ? "Open Owner Dashboard" : otpSent ? "Verify and continue" : "Continue with Email"}
        </Button>
        {ownerMode && <button type="button" onClick={() => { setOwnerMode(false); setPassword(""); setEmail(""); setError(""); }}
          className="flex w-full items-center justify-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />Change email
        </button>}
        {otpSent && <button type="button" onClick={() => { setOtpSent(false); setOtp(""); setError(""); }}
          className="flex w-full items-center justify-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />Change email
        </button>}
      </form>
    </AuthLayout>
  );
}
