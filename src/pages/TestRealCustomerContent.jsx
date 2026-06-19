import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { CheckCircle, XCircle, AlertTriangle, User, Book, Image as ImageIcon, Smartphone, Maximize, Eye, RefreshCw, Copy, ExternalLink, Wrench } from "lucide-react";
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

export default function TestRealCustomerContent() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [expandedPages, setExpandedPages] = useState({});
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    runTest();
  }, []);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await base44.functions.invoke('testRealCustomerContent', {});
      setReport(result.report);
      toast({ 
        title: "Test Customer Created", 
        description: `Email: ${result.report.test_customer?.email}` 
      });
    } catch (e) {
      setError(e.message);
      toast({ title: "Test failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    if (report?.test_customer) {
      const text = `VIP Test Customer\nEmail: ${report.test_customer.email}\nPassword: CustomerTest123!`;
      navigator.clipboard.writeText(text);
      toast({ title: "Copied!", description: "Credentials copied to clipboard" });
    }
  };

  const markTestResult = (pagePath, checkIndex, passed) => {
    setTestResults(prev => ({
      ...prev,
      [pagePath]: {
        ...(prev[pagePath] || {}),
        [checkIndex]: passed
      }
    }));
  };

  const getPageStatus = (page) => {
    const results = testResults[page.path] || {};
    const totalChecks = page.checks.length;
    const passedChecks = Object.values(results).filter(v => v === true).length;
    const failedChecks = Object.values(results).filter(v => v === false).length;
    
    if (failedChecks > 0) return 'FAIL';
    if (passedChecks === totalChecks) return 'PASS';
    return 'IN_PROGRESS';
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto" />
            <p className="text-white/60 text-sm">Creating test customer account...</p>
            <p className="text-xs text-white/40">Granting VIP access to all pages</p>
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
          <h2 className="text-xl font-bold text-white">Test Failed</h2>
          <p className="text-white/60">{error}</p>
          <button onClick={runTest} className="px-6 py-3 rounded-xl text-sm font-bold" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
            <RefreshCw className="w-4 h-4 inline mr-2" /> Retry
          </button>
        </div>
      </PageLayout>
    );
  }

  if (!report) return null;

  const { test_customer, pages_to_test, critical_issues, testing_instructions } = report;

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto pb-16 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.35)", color: "#60a5fa" }}>
            <User className="w-3.5 h-3.5" /> Real Customer Testing
          </div>
          <h1 className="font-amiri font-bold text-2xl text-white">Content Rendering Test</h1>
          <p className="text-xs text-white/35 font-inter">{report.timestamp}</p>
        </div>

        {/* Test Customer Credentials */}
        {test_customer && !test_customer.error && (
          <div className="rounded-xl border p-4" style={{ background: "rgba(59,130,246,0.08)", borderColor: "rgba(59,130,246,0.30)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-inter font-bold text-white text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" /> Test Customer Account
              </h3>
              <button onClick={copyCredentials} className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <p className="text-white/40 text-xs">Email</p>
                <p className="font-mono text-white text-xs break-all">{test_customer.email}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs">Password</p>
                <p className="font-mono text-white text-xs">CustomerTest123!</p>
              </div>
              <div>
                <p className="text-white/40 text-xs">User ID</p>
                <p className="font-mono text-white text-xs">{test_customer.user_id}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs">Access Level</p>
                <p className="text-green-400 font-bold text-xs">VIP LIFETIME ✓</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => window.open('/onboarding', '_blank')}
                className="flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                style={{ background: "linear-gradient(135deg,#f6d860,#c98a14)", color: "#0d1b2a" }}
              >
                <ExternalLink className="w-3 h-3" /> Open Login
              </button>
              <button 
                onClick={runTest}
                className="flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}
              >
                <RefreshCw className="w-3 h-3" /> Regenerate
              </button>
            </div>
          </div>
        )}

        {/* Testing Instructions */}
        <div className="rounded-xl border p-4" style={{ background: G.bg, borderColor: G.border }}>
          <h3 className="font-inter font-bold text-white text-sm mb-3 flex items-center gap-2">
            <Book className="w-4 h-4 text-purple-400" /> Testing Instructions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(testing_instructions || {}).map(([step, data]) => (
              <div key={step} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-xs font-bold text-blue-400 mb-1">{data.title}</p>
                <p className="text-xs text-white/70">{data.action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Issues to Watch */}
        {critical_issues && critical_issues.length > 0 && (
          <div className="rounded-xl border p-4" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.30)" }}>
            <h3 className="font-inter font-bold text-white text-sm mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" /> Critical Issues to Detect
            </h3>
            <div className="space-y-2">
              {critical_issues.map((issue, idx) => (
                <div key={idx} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-start gap-3 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400">ISSUE</span>
                    <p className="text-sm font-bold text-white">{issue.issue}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-white/40 mb-1">Pages:</p>
                      <p className="text-white/70">{issue.pages_affected}</p>
                    </div>
                    <div>
                      <p className="text-white/40 mb-1">Detect:</p>
                      <p className="text-white/70">{issue.how_to_detect}</p>
                    </div>
                    <div>
                      <p className="text-white/40 mb-1">Fix:</p>
                      <p className="text-yellow-400/80">{issue.fix}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pages to Test */}
        <div className="rounded-xl border p-4" style={{ background: G.bg, borderColor: G.border }}>
          <h3 className="font-inter font-bold text-white text-sm mb-3 flex items-center gap-2">
            <Book className="w-4 h-4 text-green-400" /> Pages to Test ({pages_to_test?.length || 0})
          </h3>
          <div className="space-y-3">
            {pages_to_test && pages_to_test.map((page, pageIdx) => {
              const status = getPageStatus(page);
              return (
                <div key={pageIdx} className="rounded-lg border" style={{ background: "rgba(255,255,255,0.03)", borderColor: status === 'FAIL' ? "rgba(239,68,68,0.30)" : G.border }}>
                  <div className="p-3 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-white">{page.name}</p>
                        <StatusBadge status={status} />
                        {page.critical && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">CRITICAL</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-mono text-white/40">{page.path}</span>
                        {page.hasImages && (
                          <span className="flex items-center gap-1 text-white/60">
                            <ImageIcon className="w-3 h-3" /> Has Images
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => setExpandedPages(s => ({ ...s, [pageIdx]: !s[pageIdx] }))}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg" 
                      style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}
                    >
                      {expandedPages[pageIdx] ? "Hide Checks" : "Show Checks"}
                    </button>
                  </div>
                  
                  {expandedPages[pageIdx] && (
                    <div className="p-3 border-t" style={{ borderColor: G.border }}>
                      {/* Sections */}
                      <div className="mb-3">
                        <p className="text-xs font-bold text-white/80 mb-2 flex items-center gap-1">
                          <Book className="w-3 h-3" /> Expected Sections ({page.sections.length}):
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {page.sections.map((section, sIdx) => (
                            <span key={sIdx} className="px-2 py-0.5 rounded text-[10px]" style={{ background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.30)", color: "#60a5fa" }}>
                              {section}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Checks */}
                      <div>
                        <p className="text-xs font-bold text-white/80 mb-2 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Verification Checklist ({page.checks.length}):
                        </p>
                        <div className="space-y-1">
                          {page.checks.map((check, cIdx) => {
                            const result = testResults[page.path]?.[cIdx];
                            return (
                              <div key={cIdx} className="flex items-start gap-2 p-2 rounded" style={{ background: result === true ? "rgba(74,222,128,0.08)" : result === false ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.03)" }}>
                                <button
                                  onClick={() => markTestResult(page.path, cIdx, result === true ? false : true)}
                                  className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${
                                    result === true ? 'bg-green-500 border-green-500' : 
                                    result === false ? 'bg-red-500 border-red-500' : 
                                    'border-white/30'
                                  }`}
                                >
                                  {result === true && <CheckCircle className="w-3 h-3 text-white" />}
                                  {result === false && <XCircle className="w-3 h-3 text-white" />}
                                </button>
                                <p className={`text-xs ${result === true ? 'text-green-400' : result === false ? 'text-red-400' : 'text-white/70'}`}>
                                  {check}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Quick Links */}
                      <div className="mt-3 flex gap-2">
                        <button 
                          onClick={() => window.open(page.path, '_blank')}
                          className="px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1"
                          style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.30)", color: "#60a5fa" }}
                        >
                          <ExternalLink className="w-3 h-3" /> Open Page
                        </button>
                        <button 
                          onClick={() => window.open(page.path, '_blank', 'width=375,height=812')}
                          className="px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1"
                          style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.30)", color: "#818cf8" }}
                        >
                          <Smartphone className="w-3 h-3" /> Mobile View
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-xl border p-4" style={{ background: G.bg, borderColor: G.border }}>
          <h3 className="font-inter font-bold text-white text-sm mb-3 flex items-center gap-2">
            <Book className="w-4 h-4 text-yellow-400" /> Test Progress
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg p-3 text-center" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)" }}>
              <p className="text-2xl font-bold text-green-400">
                {Object.values(testResults).flat().filter(v => v === true).length}
              </p>
              <p className="text-xs text-white/60 mt-1">Checks Passed</p>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
              <p className="text-2xl font-bold text-red-400">
                {Object.values(testResults).flat().filter(v => v === false).length}
              </p>
              <p className="text-xs text-white/60 mt-1">Checks Failed</p>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}>
              <p className="text-2xl font-bold text-yellow-400">
                {pages_to_test?.filter(p => getPageStatus(p) === 'FAIL').length || 0}
              </p>
              <p className="text-xs text-white/60 mt-1">Pages with Issues</p>
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}