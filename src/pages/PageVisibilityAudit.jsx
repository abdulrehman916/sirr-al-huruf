import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { CheckCircle, XCircle, AlertTriangle, Shield, Lock, Users, Eye, EyeOff, FileText, RefreshCw, Icon } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const G = { border: "rgba(212,175,55,0.30)", text: "#F5D060", bg: "rgba(212,175,55,0.06)", bgHi: "rgba(212,175,55,0.14)" };

function StatusBadge({ status }) {
  const config = {
    OK: { color: "#4ade80", bg: "rgba(74,222,128,0.15)", border: "rgba(74,222,128,0.35)", icon: CheckCircle },
    MISSING: { color: "#ef4444", bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.35)", icon: XCircle },
    WARN: { color: "#f59e0b", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.35)", icon: AlertTriangle }
  };
  const { color, bg, border, icon: Icon } = config[status] || config.WARN;
  return (
    <span className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5" style={{ background: bg, color, border }}>
      <Icon className="w-3 h-3" /> {status}
    </span>
  );
}

export default function PageVisibilityAudit() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [audit, setAudit] = useState(null);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState({ admin: false, missing: false, plans: false });

  useEffect(() => {
    runAudit();
  }, []);

  const runAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await base44.functions.invoke('auditPageVisibility', {});
      setAudit(result.audit);
      toast({ title: result.message, description: `${result.audit.summary.full_access_missing_count} pages missing for Full Access users` });
    } catch (e) {
      setError(e.message);
      toast({ title: "Audit failed", description: e.message, variant: "destructive" });
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
            <p className="text-white/60 text-sm">Running page visibility audit...</p>
            <p className="text-xs text-white/40">Comparing Admin vs Full Access user visibility</p>
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
          <h2 className="text-xl font-bold text-white">Audit Failed</h2>
          <p className="text-white/60">{error}</p>
          <button onClick={runAudit} className="px-6 py-3 rounded-xl text-sm font-bold" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
            <RefreshCw className="w-4 h-4 inline mr-2" /> Retry Audit
          </button>
        </div>
      </PageLayout>
    );
  }

  if (!audit) return null;

  const { summary, admin_accessible, full_access_missing, subscription_plans, root_causes } = audit;

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto pb-16 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: summary.full_access_missing_count > 0 ? "rgba(239,68,68,0.12)" : "rgba(74,222,128,0.12)", border: summary.full_access_missing_count > 0 ? "1px solid rgba(239,68,68,0.35)" : "1px solid rgba(74,222,128,0.35)", color: summary.full_access_missing_count > 0 ? "#ef4444" : "#4ade80" }}>
            {summary.full_access_missing_count > 0 ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
            {summary.full_access_missing_count > 0 ? `${summary.full_access_missing_count} Pages Missing` : 'All Pages Visible'}
          </div>
          <h1 className="font-amiri font-bold text-2xl text-white">Page Visibility Audit Report</h1>
          <p className="text-xs text-white/35 font-inter">{audit.timestamp}</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Pages", value: summary.total_pages, color: "#60a5fa" },
            { label: "Content Pages", value: summary.content_pages, color: "#4ade80" },
            { label: "Admin Pages", value: summary.admin_pages, color: "#a855f7" },
            { label: "Missing for Full Access", value: summary.full_access_missing_count, color: summary.full_access_missing_count > 0 ? "#ef4444" : "#4ade80" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border p-4 text-center" style={{ background: G.bg, borderColor: G.border }}>
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs text-white/40 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Missing Pages (CRITICAL) */}
        {full_access_missing.length > 0 && (
          <div className="rounded-xl border p-4" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.30)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-inter font-bold text-white text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" /> Pages Missing for Full Access Users ({full_access_missing.length})
              </h3>
              <button onClick={() => setShowDetails(s => ({ ...s, missing: !s.missing }))} className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
                {showDetails.missing ? "Hide Details" : "Show Details"}
              </button>
            </div>
            <div className="space-y-2">
              {full_access_missing.map((page, idx) => (
                <div key={idx} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-bold text-white">{page.name}</p>
                        <StatusBadge status="MISSING" />
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
                              <p className="text-white/40">Requires Permission</p>
                              <p className="font-bold text-white">{page.required_permission ? 'Yes' : 'No'}</p>
                            </div>
                          </div>
                          <div className="p-2 rounded-lg mb-2" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
                            <p className="text-[10px] text-red-400/80 font-semibold mb-1">❌ Root Cause:</p>
                            <p className="text-xs text-white/80">{page.root_cause}</p>
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

        {/* Root Causes */}
        {root_causes.length > 0 && (
          <div className="rounded-xl border p-4" style={{ background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.25)" }}>
            <h3 className="font-inter font-bold text-white text-sm mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" /> Root Causes ({root_causes.length})
            </h3>
            <div className="space-y-2">
              {root_causes.map((cause, idx) => (
                <div key={idx} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-bold text-white">{cause.page_name}</p>
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: cause.severity === 'HIGH' ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)", color: cause.severity === 'HIGH' ? "#ef4444" : "#f59e0b", border: cause.severity === 'HIGH' ? "1px solid rgba(239,68,68,0.35)" : "1px solid rgba(245,158,11,0.35)" }}>
                      {cause.severity}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mb-2">{cause.issue}</p>
                  <p className="text-xs text-white/40 mb-1"><span className="font-semibold">Impact:</span> {cause.impact}</p>
                  <p className="text-xs text-green-400/80"><span className="font-semibold">Fix:</span> {cause.fix}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="rounded-xl border p-4" style={{ background: G.bg, borderColor: G.border }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-inter font-bold text-white text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" /> Subscription Plans Coverage
            </h3>
            <button onClick={() => setShowDetails(s => ({ ...s, plans: !s.plans }))} className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
              {showDetails.plans ? "Hide Details" : "Show Details"}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {subscription_plans.map((plan, idx) => (
              <div key={idx} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-sm font-bold text-white mb-1">{plan.plan_name}</p>
                <p className="text-xs text-white/40 mb-2">{plan.plan_id}</p>
                <p className="text-lg font-bold" style={{ color: "#4ade80" }}>{plan.page_count} pages</p>
                {showDetails.plans && (
                  <div className="mt-2 text-xs text-white/40">
                    <p className="font-semibold mb-1">Included Pages:</p>
                    <div className="max-h-32 overflow-y-auto space-y-0.5">
                      {plan.page_paths.map((path, i) => (
                        <p key={i} className="font-mono text-[10px]">{path}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button onClick={runAudit} className="flex-1 py-3 rounded-xl text-sm font-bold" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
            <RefreshCw className="w-4 h-4 inline mr-2" /> Re-run Audit
          </button>
          <button onClick={() => window.print()} className="flex-1 py-3 rounded-xl text-sm font-bold" style={{ background: "linear-gradient(135deg,#f6d860,#c98a14)", color: "#0d1b2a" }}>
            Print Report
          </button>
        </div>

      </div>
    </PageLayout>
  );
}