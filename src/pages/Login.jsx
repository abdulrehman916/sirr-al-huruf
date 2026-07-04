import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

// Inline Google "G" mark — no external dependency.
const GoogleMark = ({ className = "w-5 h-5 mr-2" }) => (
  <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.6 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.6 4.5 24 4.5 16 4.5 9.1 9.1 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 43.5c5.5 0 10.5-2 14.3-5.3l-6.6-5.5C29.6 34.6 26.9 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9 38.9 16 43.5 24 43.5z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.6 5.5c-.5.4 6.6-4.8 6.6-14.5 0-1.2-.1-2.3-.4-3.5z"/>
  </svg>
);

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      // Mark this session as an explicit admin login so the session-gate in
      // AuthContext allows role elevation after Google redirects back to "/".
      try { sessionStorage.setItem("sirr_admin_session", "true"); } catch { /* ignore */ }
      // Redirects to Google consent, then back to "/". AuthContext resolves
      // Owner / Admin / Guest from the authenticated email:
      //   - Owner email == ADMIN_CONFIG.OWNER_EMAIL  → Owner
      //   - Email exists in AdminProfile (enabled)   → Admin (assigned perms)
      //   - Any other Google account                  → Guest
      await base44.auth.loginWithProvider("google", "/");
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Google sign-in failed");
      setLoading(false);
      try { sessionStorage.removeItem("sirr_admin_session"); } catch { /* ignore */ }
    }
  };

  return (
    <AuthLayout
      icon={ShieldCheck}
      title="Owner / Admin Login"
      subtitle="Sign in with your authorized Google account"
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <Button
        type="button"
        onClick={handleGoogle}
        className="w-full h-12 font-medium"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Redirecting to Google...
          </>
        ) : (
          <>
            <GoogleMark />
            Sign in with Google
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
        Only the registered Owner email and approved Admin emails are granted access.
        All other Google accounts remain guests with public features only.
      </p>
    </AuthLayout>
  );
}