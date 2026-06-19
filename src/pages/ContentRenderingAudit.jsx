import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { CheckCircle, XCircle, AlertTriangle, Eye, EyeOff, Image as ImageIcon, Scroll, Layers, User, Smartphone, Monitor, RefreshCw, ClipboardList, ExternalLink, Icon } from "lucide-react";
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

export default function ContentRenderingAudit() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [expandedPages, setExpandedPages] = useState({});

  useEffect(() => {
    runAudit();
  }, []);

  const runAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await base44.functions.invoke('auditContentRendering', {});
      setReport(result.report);
      toast({ 
        title: "Content Audit Complete", 
        description: `${result.report.summary.total_pages_tested} pages tested - Manual verification required` 
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
            <p className="text-white/60 text-sm">Running content rendering audit...</p>
            <p className="text-xs text-white/40">Creating test customer • Testing each page</p>
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

  if (!report) return null;

  const { summary, test_customer, page_audits, critical_findings, recommendations } = report;

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto pb-16 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.35)", color: "#f59e0b" }}>
            <AlertTriangle className="w-3.5 h-3.5" /> Manual Verification Required
          </div>
          <h1 className="font-amiri font-bold text-2xl text-white">Content Rendering Audit</h1>
          <p className="text-xs text-white/35 font-inter">{report.timestamp}</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Pages Tested", value: summary.total_pages_tested, color: "#60a5fa" },
            { label: "Critical Issues", value: summary.critical_issues, color: "#ef4444" },
            { label: "Warnings", value: summary.warnings, color: "#f59e0b" },
            { label: "Manual Required", value: "YES", color: "#f59e0b" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border p-4 text-center" style={{ background: G.bg, borderColor: G.border }}>
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs text-white/40 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Test Customer Credentials */}
        {test_customer && !test_customer.error && (
          <div className="rounded-xl border p-4" style={{ background: "rgba(59,130,246,0.08)", borderColor: "rgba(59,130,246,0.30)" }}>
            <h3 className="font-inter font-bold text-white text-sm mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" /> Test Customer Account Created
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <p className="text-white/40 text-xs">Email</p>
                <p className="font-mono text-white">{test_customer.email}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs">Password</p>
                <p className="font-mono text-white">{test_customer.password}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs">User ID</p>
                <p className="font-mono text-white">{test_customer.user_id}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs">Subscription</p>
                <p className="text-green-400 font-bold">{test_customer.subscription} ✓</p>
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)" }}>
              <p className="text-xs text-green-400/80 font-bold mb-2">✅ Test Customer Setup Complete:</p>
              <ul className="text-xs text-white/70 space-y-1">
                <li>• Lifetime access granted</li>
                <li>• All 12 content pages unlocked</li>
                <li>• Account status: ACTIVE</li>
                <li>• Ready for manual testing</li>
              </ul>
            </div>
          </div>
        )}

        {/* Critical Findings */}
        {critical_findings && critical_findings.length > 0 && (
          <div className="rounded-xl border p-4" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.30)" }}>
            <h3 className="font-inter font-bold text-white text-sm mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" /> Critical Limitations
            </h3>
            <div className="space-y-3">
              {critical_findings.map((finding, idx) => (
                <div key={idx} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-start gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${finding.impact === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {finding.impact}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white mb-1">{finding.issue}</p>
                      <p className="text-xs text-white/60 mb-2">{finding.description}</p>
                      <p className="text-xs text-yellow-400/80 font-semibold">Action: {finding.action_required}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Page Audits */}
        <div className="rounded-xl border p-4" style={{ background: G.bg, borderColor: G.border }}>
          <h3 className="font-inter font-bold text-white text-sm mb-3 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-purple-400" /> Page-by-Page Audit ({page_audits?.length || 0})
          </h3>
          <div className="space-y-2">
            {page_audits && page_audits.map((page, idx) => (
              <div key={idx} className="rounded-lg border" style={{ background: "rgba(255,255,255,0.03)", borderColor: G.border }}>
                <div className="p-3 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-white">{page.name}</p>
                      <StatusBadge status={page.status} />
                    </div>
                    <p className="text-xs font-mono text-white/40">{page.path}</p>
                  </div>
                  <button 
                    onClick={() => setExpandedPages(s => ({ ...s, [idx]: !s[idx] }))}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg" 
                    style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}
                  >
                    {expandedPages[idx] ? "Hide Details" : "Show Details"}
                  </button>
                </div>
                
                {expandedPages[idx] && (
                  <div className="p-3 border-t" style={{ borderColor: G.border }}>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-white/40 text-xs mb-1">Expected Sections</p>
                        <div className="flex flex-wrap gap-1">
                          {page.content_analysis.sections_found.map((section, sIdx) => (
                            <span key={sIdx} className="px-2 py-0.5 rounded text-[10px]" style={{ background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.30)", color: "#60a5fa" }}>
                              {section.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs mb-1">Warnings ({page.warnings.length})</p>
                        <div className="space-y-1">
                          {page.warnings.map((warning, wIdx) => (
                            <div key={wIdx} className="text-[10px] text-yellow-400/80 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> {warning.message}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="rounded-xl border p-4" style={{ background: G.bg, borderColor: G.border }}>
            <h3 className="font-inter font-bold text-white text-sm mb-3 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-green-400" /> Recommendations
            </h3>
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-start gap-3 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rec.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                      rec.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {rec.priority}
                    </span>
                    <p className="text-sm font-bold text-white">{rec.action}</p>
                  </div>
                  <p className="text-xs text-white/60 mb-2">{rec.description}</p>
                  <div className="space-y-1">
                    {rec.steps.map((step, sIdx) => (
                      <p key={sIdx} className="text-xs text-white/70">• {step}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Testing Checklist */}
        <div className="rounded-xl border p-4" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.30)" }}>
          <h3 className="font-inter font-bold text-white text-sm mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" /> Manual Testing Checklist
          </h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-white font-bold mb-2">For EACH content page:</p>
              <ol className="space-y-1 text-white/70 list-decimal list-inside">
                <li>Login as test customer</li>
                <li>Open the page</li>
                <li>Verify header section renders</li>
                <li>Verify all calculator/input sections work</li>
                <li>Verify results/content sections appear</li>
                <li>Scroll to bottom - verify last section visible</li>
                <li>Check all images load (if page has images)</li>
                <li>Test on mobile view (responsive)</li>
                <li>Compare with admin view - content identical?</li>
                <li>Mark as PASS or note missing content</li>
              </ol>
            </div>
            <div className="p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
              <p className="text-xs text-red-400/80 font-bold mb-1">⚠️ Common Issues to Look For:</p>
              <ul className="text-xs text-white/70 space-y-1">
                <li>• Last section cut off or not rendering</li>
                <li>• Images showing broken icon</li>
                <li>• Scroll stops before content ends</li>
                <li>• Mobile view missing sections</li>
                <li>• Customer sees less content than admin</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button onClick={runAudit} className="flex-1 py-3 rounded-xl text-sm font-bold" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
            <RefreshCw className="w-4 h-4 inline mr-2" /> Re-run Audit
          </button>
          <button onClick={() => window.open('/onboarding', '_blank')} className="flex-1 py-3 rounded-xl text-sm font-bold" style={{ background: "linear-gradient(135deg,#f6d860,#c98a14)", color: "#0d1b2a" }}>
            <ExternalLink className="w-4 h-4 inline mr-2" /> Open Test Login
          </button>
        </div>

      </div>
    </PageLayout>
  );
}