import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Mail, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TestOTPLogin() {
  const { toast } = useToast();
  const [email, setEmail] = useState("abdulrehmanrehman916@gmail.com");
  const [otpId, setOtpId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const sendOTP = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke('generateLoginOTP', {
        email: email,
        purpose: 'LOGIN'
      });
      
      if (res.data?.success) {
        setOtpId(res.data.otp_id);
        toast({
          title: "✅ OTP Sent",
          description: `Check email: ${email}`,
        });
        setResult({
          step: 'sent',
          otp_id: res.data.otp_id,
          email_sent: res.data.email_sent,
          message: res.data.message
        });
      } else {
        toast({ title: "❌ Failed", description: res.data?.message, variant: "destructive" });
        setResult({ step: 'failed', error: res.data?.message });
      }
    } catch (e) {
      toast({ title: "❌ Error", description: e.message, variant: "destructive" });
      setResult({ step: 'error', error: e.message });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast({ title: "Invalid OTP", description: "Enter 6-digit code", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await base44.functions.invoke('verifyLoginOTP', {
        otp_id: otpId,
        otp_code: otpCode
      });

      if (res.data?.success) {
        toast({ title: "✅ Verified", description: "OTP verified successfully!" });
        setResult(prev => ({ ...prev, step: 'verified', verified: true }));
      } else {
        toast({ title: "❌ Invalid", description: res.data?.message, variant: "destructive" });
        setResult(prev => ({ ...prev, step: 'invalid', error: res.data?.message }));
      }
    } catch (e) {
      toast({ title: "❌ Error", description: e.message, variant: "destructive" });
      setResult(prev => ({ ...prev, step: 'error', error: e.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto pb-16 space-y-6 pt-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.35)", color: "#F5D060" }}>
            <Mail className="w-3.5 h-3.5" /> Resend OTP Test
          </div>
          <h1 className="font-amiri font-bold text-2xl text-white">Complete OTP Flow Test</h1>
          <p className="text-xs text-white/35 font-inter">Test OTP generation, email delivery, and verification</p>
        </div>

        {/* Send OTP */}
        <div className="rounded-xl border p-6 space-y-4" style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.30)" }}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">Test Email</Label>
            <div className="flex gap-3">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12"
                autoFocus
              />
              <Button
                onClick={sendOTP}
                disabled={loading || !email}
                className="h-12 px-6"
                style={{ 
                  background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #f6d860 0%, #c9901d 100%)",
                  color: loading ? "rgba(255,255,255,0.3)" : "#0d1b2a"
                }}
              >
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : "Send OTP"}
              </Button>
            </div>
          </div>

          {result?.step === 'sent' && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
              <p className="font-bold mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> OTP Sent Successfully
              </p>
              <div className="text-white/70 space-y-1 text-xs">
                <p>OTP ID: {result.otp_id}</p>
                <p>Email Sent: {result.email_sent ? '✓ Yes' : '✗ No'}</p>
                <p>Message: {result.message}</p>
                <p className="text-yellow-400 mt-2">⚠️ Check email inbox for 6-digit code</p>
              </div>
            </div>
          )}
        </div>

        {/* Verify OTP */}
        {result?.step === 'sent' && (
          <div className="rounded-xl border p-6 space-y-4" style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.30)" }}>
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-white/80">Enter OTP Code</Label>
              <div className="flex gap-3">
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="flex-1 h-12 text-center text-lg tracking-[0.25em]"
                  maxLength={6}
                />
                <Button
                  onClick={verifyOTP}
                  disabled={loading || otpCode.length !== 6}
                  className="h-12 px-6"
                  style={{ 
                    background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #f6d860 0%, #c9901d 100%)",
                    color: loading ? "rgba(255,255,255,0.3)" : "#0d1b2a"
                  }}
                >
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</> : "Verify"}
                </Button>
              </div>
            </div>

            {result?.step === 'verified' && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                <p className="font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> ✅ OTP Verified Successfully!
                </p>
                <p className="text-white/70 text-xs mt-2">Login flow complete. Check database for verified record.</p>
              </div>
            )}

            {result?.step === 'invalid' && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                <p className="font-bold">❌ Verification Failed</p>
                <p className="text-white/70 text-xs mt-1">{result.error}</p>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="rounded-xl border p-6" style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.30)" }}>
          <h3 className="font-inter font-bold text-white text-sm mb-3">Test Instructions</h3>
          <ol className="list-decimal list-inside text-xs text-white/60 space-y-2">
            <li>Enter email address (default: verified Resend email)</li>
            <li>Click "Send OTP" to generate and send OTP via Resend</li>
            <li>Check email inbox for 6-digit code (subject: "Your OTP Code - Sirr al-Huruf")</li>
            <li>Enter the 6-digit OTP code</li>
            <li>Click "Verify" to complete login flow</li>
            <li>Check database for verified OTP record</li>
          </ol>
          <p className="text-xs text-yellow-400 mt-4">⚠️ Note: Resend testing mode only sends to verified email addresses</p>
        </div>

        {/* Reset */}
        <Button
          onClick={() => { setResult(null); setOtpCode(""); setOtpId(""); }}
          variant="outline"
          className="w-full h-12"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Reset Test
        </Button>
      </div>
    </PageLayout>
  );
}