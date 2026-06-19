import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Mail, CheckCircle, XCircle, Loader2, AlertTriangle, Clock, Shield } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const G = { border: "rgba(212,175,55,0.30)", text: "#F5D060", bg: "rgba(212,175,55,0.06)" };

export default function OTPEmailTest() {
  const { toast } = useToast();
  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const runTest = async () => {
    if (!testEmail) {
      toast({ title: "Email required", description: "Enter a real email address", variant: "destructive" });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await base44.functions.invoke('testOTPDelivery', { test_email: testEmail });
      setResults(result);
      toast({ title: "Test Complete", description: "Check results below" });
    } catch (e) {
      setError(e.message);
      toast({ title: "Test Failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto pb-16 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.35)", color: G.text }}>
            <Mail className="w-3.5 h-3.5" /> OTP Email Audit
          </div>
          <h1 className="font-amiri font-bold text-2xl text-white">Real Email Delivery Test</h1>
          <p className="text-xs text-white/35 font-inter">Test actual OTP email delivery to verify system is working</p>
        </div>

        {/* Email Input */}
        {!results && (
          <div className="rounded-xl border p-8 space-y-6" style={{ background: G.bg, borderColor: G.border }}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Test Email Address</Label>
              <div className="flex gap-3">
                <Input
                  id="email"
                  type="email"
                  placeholder="your-real-email@gmail.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="flex-1 h-12"
                  autoFocus
                />
                <Button
                  onClick={runTest}
                  disabled={loading || !testEmail}
                  className="h-12 px-8"
                  style={{ 
                    background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #f6d860 0%, #c9901d 100%)",
                    color: loading ? "rgba(255,255,255,0.3)" : "#0d1b2a"
                  }}
                >
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Testing...</> : "Run Test"}
                </Button>
              </div>
              <p className="text-xs text-white/50">
                ⚠️ Use a REAL email address you can access. You will receive an OTP email.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
                <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-1">Test Failed</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm">
              <p className="font-bold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> What This Test Does:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-white/70">
                <li>Generates a real OTP via platform auth</li>
                <li>Stores OTP in database (hashed)</li>
                <li>Sends OTP email to your address</li>
                <li>Verifies database record</li>
                <li>Provides delivery troubleshooting</li>
              </ol>
              <p className="mt-3 text-white/60 text-xs">
                ⏱️ Test takes ~10-15 seconds. Check your email inbox (and spam folder) after test completes.
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <>
            {/* Summary */}
            <div className={`rounded-xl border p-6 ${results.critical_findings?.length > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
              <div className="flex items-center gap-3 mb-4">
                {results.critical_findings?.length > 0 ? (
                  <XCircle className="w-8 h-8 text-red-400" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                )}
                <div>
                  <h2 className="text-lg font-bold text-white">Test Results</h2>
                  <p className="text-xs text-white/60">{results.test_id}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-lg p-4 bg-black/20">
                  <p className="text-xs text-white/40 mb-1">OTP Generated</p>
                  <p className={`text-lg font-bold ${results.steps?.[0]?.status === 'SUCCESS' ? 'text-green-400' : 'text-red-400'}`}>
                    {results.steps?.[0]?.status === 'SUCCESS' ? '✓ YES' : '✗ NO'}
                  </p>
                </div>
                <div className="rounded-lg p-4 bg-black/20">
                  <p className="text-xs text-white/40 mb-1">OTP Stored</p>
                  <p className={`text-lg font-bold ${results.steps?.[1]?.status === 'SUCCESS' ? 'text-green-400' : 'text-red-400'}`}>
                    {results.steps?.[1]?.status === 'SUCCESS' ? '✓ YES' : '✗ NO'}
                  </p>
                </div>
                <div className="rounded-lg p-4 bg-black/20">
                  <p className="text-xs text-white/40 mb-1">Email Delivery</p>
                  <p className="text-lg font-bold text-yellow-400">
                    ⏳ CHECK INBOX
                  </p>
                </div>
              </div>
            </div>

            {/* Test Steps */}
            <div className="rounded-xl border p-6 space-y-4" style={{ background: G.bg, borderColor: G.border }}>
              <h3 className="font-inter font-bold text-white text-sm">Test Steps</h3>
              {results.steps?.map((step, idx) => (
                <div key={idx} className="rounded-lg p-4 bg-black/20 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-white">Step {step.step}: {step.action}</p>
                    {step.status === 'SUCCESS' && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {step.status === 'FAILED' && <XCircle className="w-4 h-4 text-red-400" />}
                    {step.status === 'MANUAL_CHECK_REQUIRED' && <Clock className="w-4 h-4 text-yellow-400" />}
                  </div>
                  {step.details && typeof step.details === 'object' && (
                    <div className="text-xs text-white/60 space-y-1 mt-2">
                      {Object.entries(step.details).filter(([_, v]) => v !== null && v !== undefined).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="text-white/40 capitalize">{key.replace(/_/g, ' ')}:</span>
                          <span className="text-white/80 font-mono">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {step.manual_steps && (
                    <div className="mt-3 p-3 rounded bg-yellow-500/10 border border-yellow-500/30">
                      <p className="text-xs font-bold text-yellow-400 mb-2">Manual Steps Required:</p>
                      <ol className="list-decimal list-inside text-xs text-white/70 space-y-1">
                        {step.manual_steps.map((s, i) => <li key={i}>{s}</li>)}
                      </ol>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Critical Findings */}
            {results.critical_findings?.length > 0 && (
              <div className="rounded-xl border p-6 bg-red-500/10 border-red-500/30">
                <h3 className="font-inter font-bold text-red-400 text-sm mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Critical Issues Found
                </h3>
                <div className="space-y-4">
                  {results.critical_findings.map((issue, idx) => (
                    <div key={idx} className="rounded-lg p-4 bg-black/20 border border-red-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-white">{issue.issue}</p>
                        <span className={`px-2 py-1 rounded text-[9px] font-bold ${issue.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 mb-2">{issue.description}</p>
                      {issue.impact && <p className="text-xs text-red-400">Impact: {issue.impact}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="rounded-xl border p-6" style={{ background: G.bg, borderColor: G.border }}>
              <h3 className="font-inter font-bold text-white text-sm mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Next Steps
              </h3>
              <div className="space-y-4">
                {results.recommendations?.map((rec, idx) => (
                  <div key={idx} className="rounded-lg p-4 bg-black/20 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-white">{rec.action}</p>
                      <span className={`px-2 py-1 rounded text-[9px] font-bold ${rec.priority === 'IMMEDIATE' ? 'bg-red-500/20 text-red-400' : rec.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 mb-2">{rec.description}</p>
                    {rec.steps && (
                      <ol className="list-decimal list-inside text-xs text-white/60 space-y-1">
                        {rec.steps.map((s, i) => <li key={i}>{s}</li>)}
                      </ol>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Retest */}
            <div className="flex gap-3">
              <Button
                onClick={() => { setResults(null); setTestEmail(""); }}
                variant="outline"
                className="flex-1 h-12"
              >
                Test Different Email
              </Button>
            </div>
          </>
        )}

      </div>
    </PageLayout>
  );
}