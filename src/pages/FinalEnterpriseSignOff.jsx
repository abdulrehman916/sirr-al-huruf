import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { CheckCircle, XCircle, AlertTriangle, Shield, Lock, CreditCard, Users, Smartphone, Database, Activity, TrendingUp, Clock, Zap, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const G = { border: "rgba(212,175,55,0.30)", text: "#F5D060", bg: "rgba(212,175,55,0.06)", bgHi: "rgba(212,175,55,0.14)" };

function StatusBadge({ status }) {
  const config = {
    PASS: { color: "#4ade80", bg: "rgba(74,222,128,0.15)", border: "rgba(74,222,128,0.35)", icon: CheckCircle },
    WARN: { color: "#f59e0b", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.35)", icon: AlertTriangle },
    FAIL: { color: "#ef4444", bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.35)", icon: XCircle },
    VERIFIED: { color: "#4ade80", bg: "rgba(74,222,128,0.15)", border: "rgba(74,222,128,0.35)", icon: CheckCircle },
    OPERATIONAL: { color: "#4ade80", bg: "rgba(74,222,128,0.15)", border: "rgba(74,222,128,0.35)", icon: CheckCircle },
    DEGRADED: { color: "#f59e0b", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.35)", icon: AlertTriangle }
  };
  const { color, bg, border, icon: Icon } = config[status] || config.WARN;
  return (
    <span className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5" style={{ background: bg, color, border }}>
      <Icon className="w-3 h-3" /> {status}
    </span>
  );
}

function CategoryCard({ name, data, icon: Icon }) {
  const [expanded, setExpanded] = useState(false);
  const passed = Object.values(data).filter(v => v === 'PASS' || v === 'VERIFIED').length;
  const total = Object.values(data).filter(v => typeof v === 'string').length;
  const allPass = passed === total;
  
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: G.bg, borderColor: G.border }}>
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${allPass ? 'bg-green-500/15 border border-green-500/35' : 'bg-yellow-500/15 border border-yellow-500/35'}`}>
            <Icon className={`w-5 h-5 ${allPass ? 'text-green-400' : 'text-yellow-400'}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{name}</p>
            <p className="text-xs text-white/40">{passed}/{total} tests passed</p>
          </div>
        </div>
        <StatusBadge status={data.status} />
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {Object.entries(data).filter(([k]) => k !== 'status').map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="text-xs text-white/60 capitalize">{key.replace(/_/g, ' ')}</span>
                <StatusBadge status={value} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FinalEnterpriseSignOff() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [audit, setAudit] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    runAudit();
  }, []);

  const runAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await base44.functions.invoke('finalEnterpriseAudit', {});
      setAudit(result.audit);
      toast({ title: result.message, description: `Pass rate: ${result.audit.summary.pass_rate}%` });
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
            <p className="text-white/60 text-sm">Running comprehensive enterprise audit...</p>
            <p className="text-xs text-white/40">Testing 12 critical systems + 4 additional verifications</p>
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

  const { summary, categories } = audit;
  const allPass = summary.overall_status === 'PASS';
  const categoryIcons = {
    login: Lock,
    otp: Shield,
    subscription_purchase: CreditCard,
    subscription_expiry: TrendingUp,
    payment_handling: CreditCard,
    access_code: Lock,
    user_status: Users,
    admin_permissions: Shield,
    mobile_responsiveness: Smartphone,
    navigation: Activity,
    query_optimization: Database,
    cache_optimization: Zap,
    blank_screen_prevention: CheckCircle,
    infinite_loading_prevention: Clock,
    database_performance: Database
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto pb-16 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${allPass ? 'bg-green-500/20 border border-green-500/40 text-green-400' : 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-400'}`}>
            <CheckCircle className="w-3.5 h-3.5" /> {allPass ? 'Launch Approved' : 'Review Required'}
          </div>
          <h1 className="font-amiri font-bold text-2xl text-white">Final Enterprise Sign-Off</h1>
          <p className="text-xs text-white/35 font-inter">2026-06-19 · Production Launch Certification</p>
        </div>

        {/* Overall Status */}
        <div className={`rounded-2xl border p-6 ${allPass ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
          <div className="flex items-center gap-4 flex-wrap">
            {allPass ? <CheckCircle className="w-16 h-16 text-green-400" /> : <AlertTriangle className="w-16 h-16 text-yellow-400" />}
            <div className="flex-1">
              <p className={`font-inter font-bold text-2xl ${allPass ? 'text-green-400' : 'text-yellow-400'}`}>
                {allPass ? '✅ PRODUCTION READY' : '⚠️ REVIEW REQUIRED'}
              </p>
              <p className="text-sm text-white/55 mt-1">
                {summary.total_tests} tests · {summary.passed_tests} passed · {summary.failed_tests} failed
              </p>
              <p className="text-xs text-white/40 mt-2">
                Launch Decision: <span className={`font-bold ${allPass ? 'text-green-400' : 'text-yellow-400'}`}>{summary.launch_decision}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40">Pass Rate</p>
              <p className={`text-3xl font-bold ${allPass ? 'text-green-400' : 'text-yellow-400'}`}>{summary.pass_rate}%</p>
              <p className="text-xs text-white/40 mt-1">Confidence Level</p>
              <p className={`text-3xl font-bold ${allPass ? 'text-green-400' : 'text-yellow-400'}`}>{summary.confidence_level}</p>
            </div>
          </div>
        </div>

        {/* Critical Systems Status */}
        <div className="rounded-xl border p-4" style={{ background: G.bg, borderColor: G.border }}>
          <h3 className="font-inter font-bold text-white text-sm mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" /> Critical Systems Status
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(summary.critical_systems).map(([system, status]) => {
              const Icon = system === 'payments' ? CreditCard : system === 'otp' ? Shield : system === 'login' ? Lock : system === 'subscriptions' ? TrendingUp : system === 'access_control' ? Lock : system === 'user_management' ? Users : system === 'admin' ? Shield : system === 'mobile' ? Smartphone : Activity;
              return (
                <div key={system} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4" style={{ color: status.includes('OPERATIONAL') ? "#4ade80" : "#f59e0b" }} />
                    <p className="text-xs font-bold text-white capitalize">{system.replace(/_/g, ' ')}</p>
                  </div>
                  <StatusBadge status={status.includes('OPERATIONAL') ? 'OPERATIONAL' : 'DEGRADED'} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(categories).map(([name, data]) => {
            const Icon = categoryIcons[name] || Activity;
            return (
              <CategoryCard key={name} name={name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} data={data} icon={Icon} />
            );
          })}
        </div>

        {/* Final Decision */}
        <div className={`rounded-xl border p-6 text-center ${allPass ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
          <p className="font-inter text-xs text-white/40 mb-2">Final Launch Decision</p>
          <p className={`font-inter text-xl font-bold ${allPass ? 'text-green-400' : 'text-yellow-400'}`}>
            {allPass ? '✅ APPROVED FOR PRODUCTION LAUNCH' : '⚠️ REQUIRES ATTENTION BEFORE LAUNCH'}
          </p>
          <p className="text-xs text-white/60 mt-2">
            {allPass ? 'Ready for 10K concurrent · 1M total · 10M total users (with monitoring)' : 'Address failing tests before proceeding to launch'}
          </p>
          <button onClick={runAudit} className="mt-4 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 mx-auto" style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
            <RefreshCw className="w-4 h-4" /> Re-run Audit
          </button>
        </div>

      </div>
    </PageLayout>
  );
}