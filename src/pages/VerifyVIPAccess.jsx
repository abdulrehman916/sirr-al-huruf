import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { CheckCircle, XCircle, AlertTriangle, Shield, Users, FileText, RefreshCw, ClipboardCheck } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const G = { border: "rgba(212,175,55,0.30)", text: "#F5D060", bg: "rgba(212,175,55,0.06)", bgHi: "rgba(212,175,55,0.14)" };

function StatusBadge({ status }) {
  const config = {
    PASS: { color: "#4ade80", bg: "rgba(74,222,128,0.15)", border: "rgba(74,222,128,0.35)", icon: CheckCircle },
    FAIL: { color: "#ef4444", bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.35)", icon: XCircle },
    WARN: { color: "#f59e0b", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.35)", icon: AlertTriangle }
  };
  const { color, bg, border, icon: Icon } = config[status] || config.WARN;
  return (
    <span className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5" style={{ background: bg, color, border }}>
      <Icon className="w-3 h-3" /> {status}
    </span>
  );
}

export default function VerifyVIPAccess() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState({ missing: false, beforeAfter: false, test: false });

  useEffect(() => {
    runVerification();
  }, []);

  const runVerification = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await base44.functions.invoke('verifyVIPAccess', {});
      setReport(result.report);
      toast({ 
        title: result.message, 
        description: `${result.report.summary.missing_pages_count} pages missing for VIP users` 
      });
    } catch (e) {
      setError(e.message);
      toast({ title: "Verification failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto" />
            <p className="text-white/60 text-sm">Running VIP access verification...</p>
            <p className="text-xs text-white/40">Testing all {report?.summary?.total_pages_in_system || 78} pages</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
          <XCircle className="w-16 h-16 mx-auto text-red-400" />
          <h2 className="text-xl font-bold text-white">Verification Failed</h2>
          <p className="text-white/60">{error}</p>
          <button onClick={runVerification} className="px-6 py-3 rounded-xl text-sm font-bold" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
            <RefreshCw className="w-4 h-4 inline mr-2" /> Retry Verification
          </button>
        </div>
      </PageLayout>
    );
  }

  if (!report) return null;

  const { summary, missing_pages, access_test_results, before_after } = report;

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto pb-16 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: summary.missing_pages_count > 0 ? "rgba(239,68,68,0.12)" : "rgba(74,222,128,0.12)", border: summary.missing_pages_count > 0 ? "1px solid rgba(239,68,68,0.35)" : "1px solid rgba(74,222,128,0.35)", color: summary.missing_pages_count > 0 ? "#ef4444" : "#4ade80" }}>
            {summary.missing_pages_count > 0 ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
            {summary.missing_pages_count > 0 ? `${summary.missing_pages_count} Pages Missing` : 'VIP Access Complete'}
          </div>
          <h1 className="font-amiri font-bold text-2xl text-white">VIP Access Verification Report</h1>
          <p className="text-xs text-white/35 font-inter">{report.timestamp}</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Pages", value: summary.total_pages_in_system, color: "#60a5fa" },
            { label: "VIP Plan Pages", value: summary.vip_plan_page_count, color: "#a855f7" },
            { label: "Missing for VIP", value: summary.missing_pages_count, color: summary.missing_pages_count > 0 ? "#ef4444" : "#4ade80" },
            { label: "Coverage", value: `${summary.coverage_percentage}%`, color: "#4ade80" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border p-4 text-center" style={{ background: G.bg, borderColor: G.border }}>
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs text-white/40 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Missing Pages */}
        {missing_pages.length > 0 && (
          <div className="rounded-xl border p-4" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.30)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-inter font-bold text-white text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" /> Pages Missing from VIP Plan ({missing_pages.length})
              </h3>
              <button onClick={() => setShowDetails(s => ({ ...s, missing: !s.missing }))} className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
                {showDetails.missing ? "Hide Details" : "Show Details"}
              </button>
            </div>
            <div className="space-y-2">
              {missing_pages.map((page, idx) => (
                <div key={idx} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-bold text-white">{page.name}</p>
                        <StatusBadge status="FAIL" />
                      </div>
                      <p className="text-xs font-mono text-white/40 mb-2">{page.path}</p>
                      {showDetails.missing && (
                        <>
                          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                            <div>
                              <p className="text-white/40">Type</p>
                              <p className="font-bold text-white capitalize">{page.type}</p>
                            </div>
                            <div>
                              <p className="text-white/40">Should Include</p>
                              <p className="font-bold text-white">{page.should_be_included ? 'Yes' : 'No'}</p>
                            </div>
                          </div>
                          <div className="p-2 rounded-lg" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)" }}>
                            <p className="text-[10px] text-green-400/80 font-semibold mb-1">✅ Fix:</p>
                            <p className="text-xs text-white/80">{page.fix}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Before/After Comparison */}
        {before_after && (
          <div className="rounded-xl border p-4" style={{ background: G.bg, borderColor: G.border }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-inter font-bold text-white text-sm flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-blue-400" /> Before/After Comparison
              </h3>
              <button onClick={() => setShowDetails(s => ({ ...s, beforeAfter: !s.beforeAfter }))} className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
                {showDetails.beforeAfter ? "Hide Details" : "Show Details"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg p-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
                <p className="text-xs text-red-400/80 font-bold mb-2">BEFORE UPDATE</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">VIP Pages:</span>
                    <span className="text-white font-bold">{before_after.before.vip_plan_pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Missing:</span>
                    <span className="text-red-400 font-bold">{before_after.before.missing_for_vip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Coverage:</span>
                    <span className="text-white font-bold">{before_after.before.coverage_percentage}%</span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg p-3" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)" }}>
                <p className="text-xs text-green-400/80 font-bold mb-2">AFTER UPDATE</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">VIP Pages:</span>
                    <span className="text-white font-bold">{before_after.after.vip_plan_pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Missing:</span>
                    <span className="text-green-400 font-bold">{before_after.after.missing_for_vip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Coverage:</span>
                    <span className="text-green-400 font-bold">{before_after.after.coverage_percentage}%</span>
                  </div>
                </div>
              </div>
            </div>
            {showDetails.beforeAfter && (
              <div className="mt-4 p-3 rounded-lg" style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)" }}>
                <p className="text-xs text-blue-400/80 font-bold mb-1">📊 Improvement:</p>
                <p className="text-sm text-white/80">
                  Added <span className="font-bold text-green-400">{before_after.improvement.pages_added}</span> pages to VIP plan
                </p>
                <p className="text-sm text-white/80">
                  Coverage increased by <span className="font-bold text-green-400">{before_after.improvement.coverage_increase}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Access Test Results */}
        <div className="rounded-xl border p-4" style={{ background: G.bg, borderColor: G.border }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-inter font-bold text-white text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" /> Page Access Test Matrix ({access_test_results?.length || 0})
            </h3>
            <button onClick={() => setShowDetails(s => ({ ...s, test: !s.test }))} className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
              {showDetails.test ? "Hide Details" : "Show Details"}
            </button>
          </div>
          <p className="text-xs text-white/60 mb-3">
            Expected access for VIP users based on page type and VIP plan inclusion
          </p>
          {showDetails.test && access_test_results && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {access_test_results.map((test, idx) => (
                <div key={idx} className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">{test.name}</p>
                        <span className="text-xs font-mono text-white/40">{test.path}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs mt-1">
                        <span className="text-white/40 capitalize">{test.type}</span>
                        <span className={test.in_vip_plan ? "text-green-400" : "text-red-400"}>
                          {test.in_vip_plan ? 'In VIP Plan' : 'Not in VIP Plan'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/40">Expected</p>
                      <p className={`text-xs font-bold ${test.expected_access ? 'text-green-400' : 'text-red-400'}`}>
                        {test.expected_access ? 'ACCESS ✓' : 'DENY ✗'}
                      </p>
                      <p className="text-[10px] text-white/40">{test.expected_reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button onClick={runVerification} className="flex-1 py-3 rounded-xl text-sm font-bold" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
            <RefreshCw className="w-4 h-4 inline mr-2" /> Re-run Verification
          </button>
          <button onClick={() => window.print()} className="flex-1 py-3 rounded-xl text-sm font-bold" style={{ background: "linear-gradient(135deg,#f6d860,#c98a14)", color: "#0d1b2a" }}>
            Print Report
          </button>
        </div>

      </div>
    </PageLayout>
  );
}