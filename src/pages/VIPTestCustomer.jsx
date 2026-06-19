import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { CheckCircle, XCircle, User, Key, Tablet, Smartphone, Copy, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const G = { border: "rgba(212,175,55,0.30)", text: "#F5D060", bg: "rgba(212,175,55,0.06)", bgHi: "rgba(212,175,55,0.14)" };

export default function VIPTestCustomer() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testCustomer, setTestCustomer] = useState(null);
  const [error, setError] = useState(null);

  const createTestCustomer = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await base44.functions.invoke('createVIPTestCustomer', {});
      setTestCustomer(result.test_customer);
      toast({ 
        title: "VIP Test Customer Created", 
        description: `Email: ${result.test_customer.email}` 
      });
    } catch (e) {
      setError(e.message);
      toast({ title: "Failed to create test customer", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Credentials copied to clipboard" });
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto pb-16 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.35)", color: G.text }}>
            <User className="w-3.5 h-3.5" /> VIP Test Customer
          </div>
          <h1 className="font-amiri font-bold text-2xl text-white">Manual Table Testing</h1>
          <p className="text-xs text-white/35 font-inter">Create test account for customer view verification</p>
        </div>

        {/* Create Button */}
        {!testCustomer && (
          <div className="rounded-xl border p-8 text-center" style={{ background: G.bg, borderColor: G.border }}>
            <User className="w-16 h-16 mx-auto text-white/20 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Test Customer Yet</h2>
            <p className="text-white/60 text-sm mb-6">Create a VIP test customer account with lifetime access to all pages</p>
            <button
              onClick={createTestCustomer}
              disabled={loading}
              className="px-8 py-4 rounded-xl font-bold text-sm"
              style={{ 
                background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #f6d860 0%, #c9901d 100%)",
                color: loading ? "rgba(255,255,255,0.3)" : "#0d1b2a",
                boxShadow: loading ? "none" : "0 0 24px rgba(212,175,55,0.45)"
              }}
            >
              {loading ? "Creating..." : "Create VIP Test Customer"}
            </button>
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Test Customer Credentials */}
        {testCustomer && (
          <>
            <div className="rounded-xl border p-6 space-y-4" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.30)" }}>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h2 className="text-lg font-bold text-white">VIP Test Customer Created</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-white/40" />
                    <p className="text-xs uppercase tracking-wider text-white/40">Email</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-mono text-white">{testCustomer.email}</p>
                    <button onClick={() => copyToClipboard(testCustomer.email)} className="p-2 rounded hover:bg-white/10">
                      <Copy className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                </div>

                <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="w-4 h-4 text-white/40" />
                    <p className="text-xs uppercase tracking-wider text-white/40">Password</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-mono text-white">{testCustomer.password}</p>
                    <button onClick={() => copyToClipboard(testCustomer.password)} className="p-2 rounded hover:bg-white/10">
                      <Copy className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                </div>

                <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Tablet className="w-4 h-4 text-white/40" />
                    <p className="text-xs uppercase tracking-wider text-white/40">User ID</p>
                  </div>
                  <p className="text-xs font-mono text-white/60">{testCustomer.user_id}</p>
                </div>

                <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="w-4 h-4 text-white/40" />
                    <p className="text-xs uppercase tracking-wider text-white/40">Mobile</p>
                  </div>
                  <p className="text-sm font-mono text-white">{testCustomer.mobile}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                  ✓ LIFETIME ACCESS
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  ✓ ALL PAGES
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  ✓ ACTIVE
                </span>
              </div>
            </div>

            {/* Testing Instructions */}
            <div className="rounded-xl border p-6 space-y-4" style={{ background: G.bg, borderColor: G.border }}>
              <h3 className="font-inter font-bold text-white text-sm">Manual Testing Steps</h3>
              <ol className="space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-white/60 flex items-center justify-center text-xs font-bold">1</span>
                  <div>
                    <p className="text-white/90">Open app in <strong>incognito/private browsing mode</strong></p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-white/60 flex items-center justify-center text-xs font-bold">2</span>
                  <div>
                    <p className="text-white/90">Go to <Link to="/otp-login" className="text-yellow-400 hover:underline">/otp-login</Link></p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-white/60 flex items-center justify-center text-xs font-bold">3</span>
                  <div>
                    <p className="text-white/90">Enter email: <code className="text-yellow-400">{testCustomer.email}</code></p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-white/60 flex items-center justify-center text-xs font-bold">4</span>
                  <div>
                    <p className="text-white/90">Check <strong>OTPVerification</strong> entity for the 6-digit OTP code</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-white/60 flex items-center justify-center text-xs font-bold">5</span>
                  <div>
                    <p className="text-white/90">Enter OTP and login as VIP customer</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-white/60 flex items-center justify-center text-xs font-bold">6</span>
                  <div>
                    <p className="text-white/90">Navigate to each table page below and verify all tables are visible</p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Pages to Test */}
            <div className="rounded-xl border p-6" style={{ background: G.bg, borderColor: G.border }}>
              <h3 className="font-inter font-bold text-white text-sm mb-4">Table Pages to Test</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { path: '/mizaan9', name: 'Mizan 9', critical: true },
                  { path: '/magic-sqayer', name: 'Magic Sqayer', critical: true },
                  { path: '/astro-clock', name: 'Astro Clock', critical: true },
                  { path: '/hadim', name: 'Hadim', critical: true },
                  { path: '/abjad', name: 'Abjad Kabir', critical: true },
                  { path: '/basthul-huroof-2', name: 'Basthul Huroof 2', critical: true },
                  { path: '/vefkin-yapilisi', name: 'Vefkin Yapilisi', critical: true },
                  { path: '/faal-hasrath', name: 'Faal Hasrath', critical: false },
                ].map(({ path, name, critical }) => (
                  <Link
                    key={path}
                    to={path}
                    target="_blank"
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-white/5 transition-all"
                    style={{ background: "rgba(255,255,255,0.03)", borderColor: G.border }}
                  >
                    <div className="flex items-center gap-3">
                      <ExternalLink className="w-4 h-4 text-white/40" />
                      <div>
                        <p className="text-sm font-bold text-white">{name}</p>
                        <p className="text-xs font-mono text-white/40">{path}</p>
                      </div>
                    </div>
                    {critical && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                        CRITICAL
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* What to Check */}
            <div className="rounded-xl border p-6" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.30)" }}>
              <h3 className="font-inter font-bold text-white text-sm mb-4 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" /> What to Check For
              </h3>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-start gap-3">
                  <span className="text-red-400">•</span>
                  <p>Tables not rendering at all (blank space where table should be)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-400">•</span>
                  <p>Missing rows (table shows but some rows are cut off)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-400">•</span>
                  <p>Missing columns (table shows but some columns hidden)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-400">•</span>
                  <p>Hidden content (CSS overflow hiding table data)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-400">•</span>
                  <p>Mobile rendering issues (tables broken on small screens)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-400">•</span>
                  <p>Horizontal scroll not working (wide tables cut off)</p>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </PageLayout>
  );
}