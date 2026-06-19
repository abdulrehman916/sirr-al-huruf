import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Mail, CheckCircle, XCircle, Loader2, AlertTriangle, Eye, EyeOff, Database, Send } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TestOTPEndToEnd() {
  const { toast } = useToast();
  const [testEmail, setTestEmail] = useState("vaava786143222@gmail.com");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showOtp, setShowOtp] = useState(false);
  const [testStep, setTestStep] = useState(0);

  const addLog = (step, message, data = null) => {
    setLogs(prev => [...prev, { step, message, data, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runCompleteTest = async () => {
    setLoading(true);
    setLogs([]);
    setResult(null);
    setTestStep(1);

    addLog('START', '🚀 Starting comprehensive OTP test...');

    try {
      // Call comprehensive test function
      addLog('API', 'Calling testOTPDeliveryComplete function...');
      
      const startTime = Date.now();
      const response = await base44.functions.invoke('testOTPDeliveryComplete', {
        test_email: testEmail
      });
      const duration = Date.now() - startTime;

      addLog('API', `Function call completed in ${duration}ms`, {
        status: response.status,
        statusText: response.statusText
      });

      const responseData = response.data;
      setTestStep(2);

      if (responseData.success) {
        // Test succeeded
        addLog('SUCCESS', '✅ OTP test completed successfully', responseData);
        
        setResult({
          status: 'success',
          otp_id: responseData.otp_id,
          otp_code: responseData.otp_code,
          expires_at: responseData.expires_at,
          resend_message_id: responseData.resend_message_id,
          delivery_status: responseData.delivery_status,
          next_steps: responseData.next_steps
        });

        setTestStep(3);
        addLog('EMAIL', '📧 Email sent via Resend', {
          message_id: responseData.resend_message_id,
          to: testEmail
        });

        toast({
          title: "✅ OTP Test Successful",
          description: `Check email at ${testEmail}. OTP: ${responseData.otp_code}`,
          duration: 10000
        });

      } else {
        // Test failed at Resend API
        addLog('ERROR', '❌ Resend API failed', {
          error: responseData.resend_error,
          status: responseData.resend_status
        });

        setResult({
          status: 'failed',
          error: responseData.resend_error,
          resend_status: responseData.resend_status,
          message: "Email delivery failed at Resend API"
        });

        toast({
          title: "❌ Email Delivery Failed",
          description: "Resend API returned error - check logs",
          variant: "destructive",
          duration: 10000
        });
      }

    } catch (error) {
      addLog('ERROR', '❌ Test function error', {
        message: error.message,
        stack: error.stack
      });

      setResult({
        status: 'error',
        message: error.message,
        error: error.toString()
      });

      toast({
        title: "❌ Test Failed",
        description: error.message,
        variant: "destructive",
        duration: 10000
      });
    } finally {
      setLoading(false);
      setTestStep(4);
      addLog('COMPLETE', '🏁 Test completed');
    }
  };

  const verifyDatabase = async () => {
    addLog('DB', '🔍 Checking database for OTP records...');
    try {
      const otps = await base44.entities.OTPVerification.filter(
        { email: testEmail },
        '-created_date',
        5
      );
      
      addLog('DB', `Found ${otps.length} OTP records`, {
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
      addLog('DB', '❌ Database check failed', { message: error.message });
    }
  };

  const testStepStatus = {
    0: { label: 'Ready', color: 'text-white/50' },
    1: { label: 'Generating OTP...', color: 'text-yellow-400' },
    2: { label: 'Sending Email...', color: 'text-blue-400' },
    3: { label: 'Verifying Delivery...', color: 'text-green-400' },
    4: { label: 'Complete', color: 'text-white' }
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto pb-16 space-y-6 pt-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.35)", color: "#F5D060" }}>
            <Mail className="w-3.5 h-3.5" /> Critical OTP Test
          </div>
          <h1 className="font-amiri font-bold text-2xl text-white">End-to-End OTP Delivery Test</h1>
          <p className="text-xs text-white/35 font-inter">Verify complete OTP flow with actual delivery</p>
        </div>

        {/* Test Progress */}
        <div className="rounded-xl border p-6" style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.30)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-inter font-bold text-white text-sm">Test Progress</h3>
            <span className={`text-xs font-bold ${testStepStatus[testStep].color}`}>
              {testStepStatus[testStep].label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4].map(step => (
              <div key={step} className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className={`h-full transition-all duration-500 ${
                  step <= testStep ? 'bg-gradient-to-r from-yellow-500 to-yellow-300' : 'bg-transparent'
                }`} style={{ width: step <= testStep ? '100%' : '0%' }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-white/40">
            <span>Start</span>
            <span>Generate</span>
            <span>Send</span>
            <span>Verify</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Test Controls */}
        <div className="rounded-xl border p-6 space-y-4" style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.30)" }}>
          <div className="space-y-2">
            <Label htmlFor="testEmail" className="text-white/80">Test Email Address</Label>
            <div className="flex gap-3">
              <Input
                id="testEmail"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="flex-1 h-12"
              />
              <Button
                onClick={runCompleteTest}
                disabled={loading}
                className="h-12 px-6"
                style={{ 
                  background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #f6d860 0%, #c9901d 100%)",
                  color: loading ? "rgba(255,255,255,0.3)" : "#0d1b2a"
                }}
              >
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Testing...</> : "Run Test"}
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={verifyDatabase}
              variant="outline"
              className="flex-1 h-10"
              disabled={loading}
            >
              <Database className="w-4 h-4 mr-2" /> Check Database
            </Button>
            <Button
              onClick={() => { setLogs([]); setResult(null); setTestStep(0); }}
              variant="outline"
              className="flex-1 h-10"
              disabled={loading}
            >
              🗑️ Clear
            </Button>
          </div>
        </div>

        {/* Test Result */}
        {result && (
          <div className={`rounded-xl border p-6 ${
            result.status === 'success' ? 'bg-green-500/10 border-green-500/30' :
            result.status === 'error' || result.status === 'failed' ? 'bg-red-500/10 border-red-500/30' :
            'bg-blue-500/10 border-blue-500/30'
          }`}>
            <div className="flex items-start gap-3 mb-4">
              {result.status === 'success' ? (
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">
                  {result.status === 'success' ? '✅ OTP Test Successful' : '❌ Test Failed'}
                </h3>
                <p className="text-white/70 text-sm mt-1">
                  {result.status === 'success' ? 'All steps completed' : result.message}
                </p>
              </div>
            </div>

            {result.status === 'success' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/50">OTP ID:</span>
                    <p className="text-white font-mono text-xs mt-1">{result.otp_id}</p>
                  </div>
                  <div>
                    <span className="text-white/50">OTP Code:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-white font-bold font-mono text-lg tracking-wider">
                        {showOtp ? result.otp_code : '••••••'}
                      </p>
                      <button onClick={() => setShowOtp(!showOtp)} className="text-white/50 hover:text-white">
                        {showOtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-white/50">Resend Message ID:</span>
                    <p className="text-white font-mono text-xs mt-1">{result.resend_message_id}</p>
                  </div>
                  <div>
                    <span className="text-white/50">Expires At:</span>
                    <p className="text-white text-xs mt-1">{new Date(result.expires_at).toLocaleString()}</p>
                  </div>
                </div>

                {result.delivery_status && (
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="font-bold text-white text-sm mb-2">Delivery Status</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(result.delivery_status).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 text-xs">
                          {value ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className="text-white/70 capitalize">{key.replace(/_/g, ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.next_steps && (
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="font-bold text-white text-sm mb-2">Next Steps</h4>
                    <ol className="list-decimal list-inside text-xs text-white/60 space-y-1">
                      {Object.values(result.next_steps).map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}

            {result.status === 'failed' && result.resend_error && (
              <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <h4 className="font-bold text-red-400 text-sm mb-2">Resend API Error</h4>
                <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap">
                  {JSON.stringify(result.resend_error, null, 2)}
                </pre>
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
                  log.step === 'SUCCESS' ? 'bg-green-500/10 border border-green-500/20 text-green-300' :
                  log.step === 'ERROR' ? 'bg-red-500/10 border border-red-500/20 text-red-300' :
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

        {/* Warning Box */}
        <div className="rounded-xl border p-6 bg-yellow-500/10 border-yellow-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-yellow-400 text-sm mb-2">⚠️ Resend Testing Mode Limitation</h3>
              <p className="text-xs text-yellow-200/80 mb-2">
                Current setup uses Resend TESTING MODE which ONLY sends to verified email addresses.
              </p>
              <p className="text-xs text-yellow-200/80">
                <strong>Expected Result:</strong> Email delivery will FAIL for unverified emails.<br/>
                <strong>Solution:</strong> Verify custom domain in Resend to send to ANY email address.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}