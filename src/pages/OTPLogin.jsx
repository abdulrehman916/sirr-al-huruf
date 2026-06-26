import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Shield, Loader2, CheckCircle } from "lucide-react";
import { ADMIN_CONFIG } from "@/lib/adminConfig";
import AtmosphericBackground from "@/components/AtmosphericBackground";

/**
 * Admin Login — only for the app owner/admin.
 * Users access content via reading codes; no user login required.
 */
export default function OTPLogin() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // "email" | "otp"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const pwd = email.split("").reverse().join("") + "_sirr2026";
      try {
        await base44.auth.register({ email, password: pwd });
      } catch (regErr) {
        if (regErr?.message?.includes?.("already exists")) {
          try { await base44.auth.resendOtp(email); } catch {}
        } else {
          throw regErr;
        }
      }
      setStep("otp");
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
      const result = await base44.auth.verifyOtp({ email, otpCode: otp });
      await base44.auth.setToken(result.access_token);

      if (email.trim().toLowerCase() === ADMIN_CONFIG.OWNER_EMAIL.toLowerCase()) {
        try { await base44.auth.updateMe({ role: "admin" }); } catch {}
      }

      setSuccess("Login successful! Redirecting…");
      setTimeout(() => { window.location.href = "/admin/access-dashboard"; }, 1000);
    } catch (err) {
      setError(err?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100dvh] px-5 text-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #020710 0%, #050d1a 45%, #08101f 100%)" }}>
      <AtmosphericBackground />
      <div className="relative z-10 w-full max-w-sm">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
          style={{ background: "linear-gradient(145deg, rgba(212,175,55,0.22), rgba(212,175,55,0.06))", border: "1px solid rgba(212,175,55,0.25)" }}>
          <Shield className="w-7 h-7" style={{ color: "#D4AF37" }} />
        </div>
        <h1 className="font-inter font-bold text-white text-xl mb-1">Admin Login</h1>
        <p className="font-inter text-xs text-white/40 mb-8">Owner access only</p>

        <div className="card-dark p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5" }}>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg text-sm flex items-center gap-2" style={{ background: "rgba(34,197,94,0.10)", color: "#4ade80" }}>
              <CheckCircle className="w-4 h-4" /> {success}
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-white/50 block text-left">Email</label>
                <input
                  type="email"
                  placeholder="owner@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", fontSize: "16px" }}
                  autoFocus
                  required
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-inter font-bold text-sm disabled:opacity-50 btn-gold">
                {loading ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
                {loading ? "Sending…" : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <p className="text-xs text-white/50">Code sent to <span className="text-white/75">{email}</span></p>
              <div className="space-y-1.5">
                <label className="text-xs text-white/50 block text-left">Verification Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white text-center text-xl tracking-[0.3em] outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", fontSize: "22px" }}
                  maxLength={6}
                  autoFocus
                  required
                />
              </div>
              <button type="submit" disabled={loading || otp.length < 6}
                className="w-full py-3 rounded-xl font-inter font-bold text-sm disabled:opacity-50 btn-gold">
                {loading ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
                {loading ? "Verifying…" : "Verify & Login"}
              </button>
              <button type="button" onClick={() => { setStep("email"); setError(""); setOtp(""); }}
                className="w-full py-2 text-xs text-white/30">
                ← Change email
              </button>
            </form>
          )}
        </div>

        <button onClick={() => navigate("/")} className="mt-6 text-xs text-white/25 hover:text-white/50">
          ← Back to Home
        </button>
      </div>
    </div>
  );
}