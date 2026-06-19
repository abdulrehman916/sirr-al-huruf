import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Mail, CheckCircle, XCircle, Loader2, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DebugOTPEmail() {
  const { toast } = useToast();
  const [email, setEmail] = useState("abdulrehmanrehman916@gmail.com");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showOtp, setShowOtp] = useState(false);

  const addLog = (type, message, data = null) => {
    setLogs(prev => [...prev, { type, message, data, timestamp: new Date().toLocaleTimeString() }]);
  };

  const sendTestOTP = async () => {
    setLoading(true);
    setLogs([]);
    setResult(null);

    addLog('info', '🚀 Starting OTP generation test...');

    try {
      // Step 1: Generate OTP
      addLog('info', '📝 Step 1: Calling generateLoginOTP function...');
      
      const startTime = Date.now();
      const response = await base44.functions.invoke('generateLoginOTP', {
        email: email,
        purpose: 'LOGIN'
      });
      const duration = Date.now() - startTime;

      addLog('success', `✅ Function call completed in ${duration}ms`, {
        status: response.status,
        statusText: response.statusText
      });

      // Step 2: Parse response
      addLog('info', '📊 Step 2: Analyzing response...');
      const responseData = response.data;
      addLog('info', 'Response data:', responseData);

      if (responseData.success) {
        addLog('success', '✅ OTP generated successfully', {
          otp_id: responseData.otp_id,
          expires_in: responseData.expires_in,
          email_sent: responseData.email_sent
        });

        if (responseData.email_sent) {
          addLog('success', '✅ Email sent via Resend API');
        } else {
          addLog('warning', '⚠️ Email delivery failed or was skipped');
        }

        setResult({
          status: 'success',
          otp_id: responseData.otp_id,
          email_sent: responseData.email_sent,
          message: responseData.message,
          expires_in: responseData.expires_in
        });

        toast({
          title: "✅ OTP Generated",
          description: responseData.email_sent 
            ? "Check email inbox + spam folder" 
            : "Email delivery may have failed - check logs",
          duration: 8000
        });

      } else if (responseData.rate_limited) {
        addLog('error', '❌ Rate limited - too many requests', {
          message: responseData.message
        });
        setResult({
          status: 'rate_limited',
          message: responseData.message
        });
        toast({
          title: "⏰ Rate Limited",
          description: "Wait 1 hour before retrying",
          variant: "destructive",
          duration: 8000
        });

      } else if (responseData.blocked) {
        addLog('error', '❌ Account blocked', {
          message: responseData.message
        });
        setResult({
          status: 'blocked',
          message: responseData.message
        });
        toast({
          title: "🚫 Account Blocked",
          description: responseData.message,
          variant: "destructive",
          duration: 8000
        });

      } else {
        addLog('error', '❌ OTP generation failed', {
          message: responseData.message,
          error: responseData.error
        });
        setResult({
          status: 'failed',
          message: responseData.message,
          error: responseData.error
        });
        toast({
          title: "❌ Failed",
          description: responseData.message || "Check logs for details",
          variant: "destructive",
          duration: 8000
        });
      }

    } catch (error) {
      addLog('error', '❌ Function invocation error', {
        message: error.message,
        stack: error.stack
      });
      setResult({
        status: 'error',
        message: error.message,
        error: error.toString()
      });
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive",
        duration: 8000
      });
    } finally {
      setLoading(false);
      addLog('info', '🏁 Test completed');
    }
  };

  const checkDatabase = async () => {
    addLog('info', '🔍 Checking database for recent OTPs...');
    try {
      const otps = await base44.entities.OTPVerification.filter(
        { email: email },
        '-created_date',
        5
      );
      
      addLog('success', `Found ${otps.length} OTP records`, {
        count: otps.length,
        records: otps.map(o => ({
          otp_id: o.otp_id,
          created: o.created_date,
          status: o.status,
          verified: o.verified,
          expires: o.expires_at
        }))
      });

      setResult(prev => ({
        ...prev,
        database_records: otps
      }));
    } catch (error) {
      addLog('error', '❌ Database check failed', {
        message: error.message
      });
    }
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto pb-16 space-y-6 pt-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.35)", color: "#F5D060" }}>
            <Mail className="w-3.5 h-3.5" /> OTP Email Debug
          </div>
          <h1 className="font-amiri font-bold text-2xl text-white">Resend OTP Delivery Test</h1>
          <p className="text-xs text-white/35 font-inter">Diagnose exact failure point in OTP email delivery</p>
        </div>

        {/* Test Controls */}
        <div className="rounded-xl border p-6 space-y-4" style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.30)" }}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">Test Email Address</Label>
            <div className="flex gap-3">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12"
              />
              <Button
                onClick={sendTestOTP}
                disabled={loading}
                className="h-12 px-6"
                style={{ 
                  background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #f6d860 0%, #c9901d 100%)",
                  color: loading ? "rgba(255,255,255,0.3)" : "#0d1b2a"
                }}
              >
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Testing...</> : "Send OTP"}
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={checkDatabase}
              variant="outline"
              className="flex-1 h-10"
              disabled={loading}
            >
              🔍 Check Database
            </Button>
            <Button
              onClick={() => { setLogs([]); setResult(null); }}
              variant="outline"
              className="flex-1 h-10"
              disabled={loading}
            >
              🗑️ Clear Logs
            </Button>
          </div>
        </div>

        {/* Result Summary */}
        {result && (
          <div className={`rounded-xl border p-6 ${
            result.status === 'success' ? 'bg-green-500/10 border-green-500/30' :
            result.status === 'error' || result.status === 'failed' ? 'bg-red-500/10 border-red-500/30' :
            result.status === 'rate_limited' ? 'bg-yellow-500/10 border-yellow-500/30' :
            'bg-blue-500/10 border-blue-500/30'
          }`}>
            <div className="flex items-start gap-3 mb-4">
              {result.status === 'success' ? (
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              ) : result.status === 'error' || result.status === 'failed' ? (
                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">
                  {result.status === 'success' ? '✅ OTP Generated Successfully' :
                   result.status === 'rate_limited' ? '⏰ Rate Limited' :
                   result.status === 'blocked' ? '🚫 Account Blocked' :
                   result.status === 'error' || result.status === 'failed' ? '❌ Test Failed' : '📊 Result'}
                </h3>
                <p className="text-white/70 text-sm mt-1">{result.message}</p>
              </div>
            </div>

            {result.status === 'success' && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/50">OTP ID:</span>
                  <p className="text-white font-mono text-xs mt-1">{result.otp_id}</p>
                </div>
                <div>
                  <span className="text-white/50">Email Sent:</span>
                  <p className={`font-bold ${result.email_sent ? 'text-green-400' : 'text-red-400'}`}>
                    {result.email_sent ? '✓ Yes' : '✗ No'}
                  </p>
                </div>
                <div>
                  <span className="text-white/50">Expires In:</span>
                  <p className="text-white font-bold">{result.expires_in} seconds</p>
                </div>
                <div>
                  <span className="text-white/50">Check Email:</span>
                  <p className="text-white text-xs mt-1">
                    Inbox + Spam/Junk folders
                  </p>
                </div>
              </div>
            )}

            {result.database_records && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <h4 className="font-bold text-white text-sm mb-2">Database Records ({result.database_records.length})</h4>
                <div className="space-y-2">
                  {result.database_records.map((rec, idx) => (
                    <div key={idx} className="bg-black/20 rounded p-2 text-xs font-mono text-white/70">
                      <div>{rec.otp_id}</div>
                      <div>{rec.status} • Created: {new Date(rec.created).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Detailed Logs */}
        {logs.length > 0 && (
          <div className="rounded-xl border p-6" style={{ background: "rgba(0,0,0,0.4)", borderColor: "rgba(255,255,255,0.1)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Execution Logs</h3>
              <span className="text-xs text-white/50">{logs.length} entries</span>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className={`rounded p-3 text-xs font-mono ${
                  log.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-300' :
                  log.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-300' :
                  log.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-300' :
                  'bg-white/5 border border-white/10 text-white/70'
                }`}>
                  <div className="flex items-start gap-2">
                    <span className="text-white/30 flex-shrink-0">[{log.timestamp}]</span>
                    <span className="flex-1 break-all">{log.message}</span>
                  </div>
                  {log.data && (
                    <pre className="mt-2 text-[10px] opacity-70 whitespace-pre-wrap break-all">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="rounded-xl border p-6" style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.30)" }}>
          <h3 className="font-inter font-bold text-white text-sm mb-3">Diagnostic Steps</h3>
          <ol className="list-decimal list-inside text-xs text-white/60 space-y-2">
            <li>Enter email address (default: verified Resend email)</li>
            <li>Click "Send OTP" to trigger OTP generation</li>
            <li>Watch execution logs for step-by-step details</li>
            <li>Check result summary for OTP ID and delivery status</li>
            <li>Click "Check Database" to verify OTP record creation</li>
            <li>Check Gmail inbox AND spam/junk folder for OTP email</li>
            <li>If email not received, examine logs for Resend API errors</li>
          </ol>
          <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs">
            <p className="font-bold mb-1">⚠️ Common Issues:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Rate limited: Wait 1 hour after 5 OTPs</li>
              <li>Spam folder: Gmail may filter automated emails</li>
              <li>Resend testing mode: Only sends to verified emails</li>
              <li>API error: Check logs for Resend error message</li>
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}