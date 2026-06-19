import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { CheckCircle, XCircle, AlertTriangle, Table } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const G = { border: "rgba(212,175,55,0.30)", text: "#F5D060", bg: "rgba(212,175,55,0.06)", bgHi: "rgba(212,175,55,0.14)" };

export default function AuditTableRendering() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    runAudit();
  }, []);

  const runAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await base44.functions.invoke('auditTableRendering', {});
      setReport(result.report);
      toast({ 
        title: "Table Audit Complete", 
        description: `${result.report.summary.failed} pages with table issues` 
      });
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
            <p className="text-white/60 text-sm">Auditing table rendering...</p>
            <p className="text-xs text-white/40">Checking CSS, mobile, scroll</p>
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
          <button onClick={runAudit} className="px-6 py-3 rounded-xl text-sm font-bold" style={{ background: G.bgHi, border: `1px solid ${G.border}`, color: G.text }}>
            Retry
          </button>
        </div>
      </PageLayout>
    );
  }

  if (!report) return null;

  const { failed_pages, fixes_applied, summary } = report;

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto pb-16 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.35)", color: G.text }}>
            <Table className="w-3.5 h-3.5" /> Table Rendering Audit
          </div>
          <h1 className="font-amiri font-bold text-2xl text-white">Table Visibility Report</h1>
          <p className="text-xs text-white/35 font-inter">{report.timestamp}</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Pages Audited", value: summary.total_pages, color: "#60a5fa" },
            { label: "Passed", value: summary.passed, color: "#4ade80" },
            { label: "Failed", value: summary.failed, color: "#ef4444" },
            { label: "CSS Issues", value: summary.css_issues, color: "#f59e0b" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border p-4 text-center" style={{ background: G.bg, borderColor: G.border }}>
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs text-white/40 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Failed Pages */}
        {failed_pages && failed_pages.length > 0 && (
          <div className="rounded-xl border p-4" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.30)" }}>
            <h3 className="font-inter font-bold text-white text-sm mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" /> Pages with Table Issues ({failed_pages.length})
            </h3>
            <div className="space-y-2">
              {failed_pages.map((page, idx) => (
                <div key={idx} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-white">{page.name}</p>
                        {page.critical && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">CRITICAL</span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-white/40 mb-2">{page.path}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-red-400">{page.issue_count} issues</span>
                        <span className="text-white/60">Top issue: {page.top_issue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Pages Detail */}
        <div className="rounded-xl border p-4" style={{ background: G.bg, borderColor: G.border }}>
          <h3 className="font-inter font-bold text-white text-sm mb-3 flex items-center gap-2">
            <Table className="w-4 h-4 text-blue-400" /> All Pages Audited
          </h3>
          <div className="space-y-3">
            {report.pages_audited.map((page, idx) => (
              <div key={idx} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-white">{page.name}</p>
                      {page.status === 'PASS' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <p className="text-xs font-mono text-white/40">{page.path}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    page.status === 'PASS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {page.status}
                  </span>
                </div>
                
                {page.table_components && page.table_components.length > 0 && (
                  <div className="mb-2">
                    <p className="text-[9px] uppercase tracking-wider text-white/40 mb-1">Table Components:</p>
                    <div className="flex flex-wrap gap-1">
                      {page.table_components.map((comp, ci) => (
                        <span key={ci} className="px-2 py-0.5 rounded text-[9px] font-mono" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.20)", color: G.text }}>
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {page.issues && page.issues.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {page.issues.map((issue, ii) => (
                      <div key={ii} className="flex items-start gap-2 text-xs">
                        <AlertTriangle className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                          issue.severity === 'HIGH' ? 'text-red-400' :
                          issue.severity === 'MEDIUM' ? 'text-yellow-400' : 'text-blue-400'
                        }`} />
                        <div>
                          <p className="text-white/80">{issue.description}</p>
                          <p className="text-white/40 text-[10px] mt-0.5">Fix: {issue.fix}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Fixes Applied */}
        {fixes_applied && fixes_applied.length > 0 && (
          <div className="rounded-xl border p-4" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.30)" }}>
            <h3 className="font-inter font-bold text-white text-sm mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" /> Fixes Verified ({fixes_applied.length})
            </h3>
            <div className="space-y-2">
              {fixes_applied.map((fix, idx) => (
                <div key={idx} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-start gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      fix.status === 'OK' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {fix.status}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{fix.component}</p>
                      <p className="text-xs text-white/70">{fix.fix}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </PageLayout>
  );
}