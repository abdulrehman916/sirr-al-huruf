import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, User, Mail, Phone, Calendar, Shield, Clock, CheckCircle,
  XCircle, Lock, Globe, CreditCard, History, Key, Crown, Zap,
  ChevronDown, ChevronUp, Trash2, Plus, CalendarPlus2, RefreshCw,
  Loader2, Ban, Check, X, Star, AlertCircle
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageLayout from "@/components/PageLayout";
import PageTitle from "@/components/PageTitle";
import { ROUTE_PERMISSION_MAP } from "@/lib/permissionCodes";
import { useToast } from "@/components/ui/use-toast";

const G = {
  border: "rgba(212,175,55,0.35)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
  card: "linear-gradient(145deg,rgba(12,22,48,0.98),rgba(6,12,28,0.99))",
};

const DURATION_OPTIONS = [
  { value: "1_MONTH", label: "1 Month", days: 30 },
  { value: "3_MONTHS", label: "3 Months", days: 90 },
  { value: "6_MONTHS", label: "6 Months", days: 180 },
  { value: "12_MONTHS", label: "12 Months", days: 365 },
  { value: "LIFETIME", label: "Lifetime", days: 36500 },
];

const CONTENT_PAGES = Object.entries(ROUTE_PERMISSION_MAP)
  .filter(([path, c]) => !c.adminOnly && c.code && path !== "/" && !path.startsWith("/admin"))
  .map(([path, c]) => ({ path, name: c.name, code: c.code }))
  .sort((a, b) => a.name.localeCompare(b.name));

function fmt(d) { if (!d) return "—"; return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }
function fmtDT(d) { if (!d) return "—"; return new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
function isExp(d) { return d && new Date(d) < new Date(); }
function daysLeft(d) { if (!d) return null; const diff = new Date(d) - new Date(); return Math.ceil(diff / 86400000); }

export default function UserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState(null);
  const [platformUser, setPlatformUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Modals
  const [grantModal, setGrantModal] = useState(false);
  const [lifetimeModal, setLifetimeModal] = useState(false);
  const [lifetimeMode, setLifetimeMode] = useState(null); // "all" | "select"
  const [extendModal, setExtendModal] = useState(null);
  const [roleModal, setRoleModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [selectedPages, setSelectedPages] = useState([]);
  const [duration, setDuration] = useState("1_MONTH");
  const [granting, setGranting] = useState(false);

  // Expanded sections
  const [expandedPerms, setExpandedPerms] = useState(true);
  const [expandedSubs, setExpandedSubs] = useState(true);
  const [expandedHistory, setExpandedHistory] = useState(false);

  useEffect(() => { loadAll(); }, [userId]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const me = await base44.auth.me();
      setIsAdmin(me?.role === "admin" || me?.role === "owner");

      // Load profile
      const profiles = await base44.entities.UserAccessProfile.filter({ user_id: userId });
      const prof = profiles.length > 0 ? profiles[0] : null;
      setProfile(prof);

      // Load platform user
      const users = await base44.entities.User.list(null, 200);
      const pu = users.find(u => u.id === userId) || null;
      setPlatformUser(pu);

      // Load permissions
      const perms = await base44.entities.PagePermission.filter({ user_id: userId }, "-granted_at", 200);
      setPermissions(perms);

      // Load subscriptions
      const subs = await base44.entities.Subscription.filter({ user_id: userId }, "-start_date", 50);
      setSubscriptions(subs);

      // Load login history from audit logs
      const logs = await base44.entities.AuditLog.filter(
        { action_type: "USER_ONBOARDED", target_user_id: userId },
        "-timestamp", 50
      );
      const allLogs = await base44.entities.AuditLog.filter(
        { target_user_id: userId },
        "-timestamp", 50
      );
      setLoginHistory(allLogs);
    } catch (e) {
      toast({ title: "Load error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ── Grant Access ──
  const handleGrant = async () => {
    if (selectedPages.length === 0) { toast({ title: "Select at least one page", variant: "destructive" }); return; }
    setGranting(true);
    const dur = DURATION_OPTIONS.find(d => d.value === duration);
    const now = new Date();
    const expiry = new Date(now.getTime() + dur.days * 86400000).toISOString();
    let granted = 0;
    for (const path of selectedPages) {
      const page = CONTENT_PAGES.find(p => p.path === path);
      if (!page) continue;
      try {
        await base44.functions.invoke("grantPagePermission", {
          user_id: userId,
          page_path: page.path,
          page_name: page.name,
          permission_code: page.code,
          start_date: now.toISOString(),
          expiry_date: expiry,
        });
        granted++;
      } catch {}
    }
    setGranting(false);
    if (granted > 0) toast({ title: `✓ Granted ${granted} page(s)` });
    setGrantModal(false);
    setSelectedPages([]);
    loadAll();
  };

  // ── Revoke ──
  const handleRevoke = async (perm) => {
    if (!confirm(`Revoke access to "${perm.page_name}"?`)) return;
    try {
      const me = await base44.auth.me();
      await base44.functions.invoke("revokePagePermission", {
        permission_id: perm.permission_id,
        revoked_by: me.id,
        reason: "Revoked by admin",
      });
      toast({ title: `✓ Revoked "${perm.page_name}"` });
      loadAll();
    } catch (e) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  // ── Extend Expiry ──
  const handleExtend = async () => {
    const perm = extendModal;
    const dur = DURATION_OPTIONS.find(d => d.value === duration);
    const newExpiry = new Date(Date.now() + dur.days * 86400000).toISOString();
    try {
      await base44.functions.invoke("extendPermissionExpiry", {
        permission_id: perm.permission_id,
        new_expiry_date: newExpiry,
        extended_by: (await base44.auth.me()).id,
      });
      toast({ title: `✓ Extended "${perm.page_name}" by ${dur.label}` });
      setExtendModal(null);
      loadAll();
    } catch (e) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  // ── Grant Lifetime ──
  const handleGrantLifetime = async () => {
    setGranting(true);
    try {
      const now = new Date();
      const farFuture = new Date(now.getFullYear() + 100, 0, 1).toISOString();

      const pagesToGrant = lifetimeMode === "all"
        ? CONTENT_PAGES
        : CONTENT_PAGES.filter(p => selectedPages.includes(p.path));

      let granted = 0;
      for (const page of pagesToGrant) {
        const existing = permissions.filter(p => p.page_path === page.path && p.is_active && !p.is_revoked);
        if (existing.length > 0) continue;
        try {
          await base44.functions.invoke("grantPagePermission", {
            user_id: userId, page_path: page.path, page_name: page.name,
            permission_code: page.code, start_date: now.toISOString(), expiry_date: farFuture,
          });
          granted++;
        } catch {}
      }

      // Set lifetime_access flag for Option A only
      if (lifetimeMode === "all" && profile) {
        await base44.entities.UserAccessProfile.update(profile.id, { lifetime_access: true });
      }

      toast({
        title: lifetimeMode === "all"
          ? "✓ Lifetime access granted to ALL pages"
          : `✓ Lifetime access granted to ${granted} page(s)`
      });
      setLifetimeModal(false);
      setLifetimeMode(null);
      setSelectedPages([]);
      loadAll();
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setGranting(false);
    }
  };

  // ── Change Role ──
  const handleChangeRole = async (newRole) => {
    try {
      if (profile) {
        await base44.entities.UserAccessProfile.update(profile.id, { role: newRole });
      }
      toast({ title: `✓ Role changed to ${newRole}` });
      setRoleModal(false);
      loadAll();
    } catch (e) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  // ── Change Status ──
  const handleChangeStatus = async (newStatus) => {
    try {
      if (profile) {
        await base44.entities.UserAccessProfile.update(profile.id, { account_status: newStatus });
      }
      toast({ title: `✓ Status changed to ${newStatus}` });
      setStatusModal(false);
      loadAll();
    } catch (e) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  const activePerms = permissions.filter(p => p.is_active && !p.is_revoked && !isExp(p.expiry_date));
  const expiredPerms = permissions.filter(p => isExp(p.expiry_date) && !p.is_revoked);
  const revokedPerms = permissions.filter(p => p.is_revoked);
  const blockedPages = CONTENT_PAGES.filter(
    p => !activePerms.some(ap => ap.page_path === p.path)
  );

  return (
    <PageLayout>
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4 text-sm font-semibold"
        style={{ background: G.bg, border: `1px solid ${G.border}`, color: G.text }}>
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <PageTitle arabic="تفاصيل المستخدم" latin="User Details" icon="👤" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-10">

        {/* ── Profile Card ── */}
        <div className="rounded-xl border p-5 space-y-4" style={{ background: G.card, borderColor: G.borderHi }}>
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
              style={{ background: G.bgHi, color: G.text, border: `2px solid ${G.border}` }}>
              {(profile?.full_name || platformUser?.full_name || "?")[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-inter text-xl font-bold text-white">
                {profile?.full_name || platformUser?.full_name || "Unnamed User"}
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                <span className="text-sm text-white/45 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {profile?.email || platformUser?.email || "—"}
                </span>
                {profile?.mobile && (
                  <span className="text-sm text-white/45 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> {profile.mobile}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2.5">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold"
                  style={{ background: profile?.role === "admin" ? "rgba(212,175,55,0.18)" : "rgba(255,255,255,0.06)", color: profile?.role === "admin" ? G.text : "rgba(255,255,255,0.55)", border: `1px solid ${profile?.role === "admin" ? G.border : "rgba(255,255,255,0.12)"}` }}>
                  <Shield className="w-3 h-3 inline mr-1" /> {profile?.role || platformUser?.role || "user"}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold"
                  style={{ background: profile?.account_status === "ACTIVE" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", color: profile?.account_status === "ACTIVE" ? "#4ade80" : "#ef4444", border: `1px solid ${profile?.account_status === "ACTIVE" ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}` }}>
                  {profile?.account_status || "ACTIVE"}
                </span>
                {profile?.lifetime_access && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
                    style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.30)" }}>
                    <Crown className="w-3 h-3" /> Lifetime Access
                  </span>
                )}
                {profile?.subscription_plan && profile?.subscription_plan !== "NONE" && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={{ background: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)" }}>
                    <CreditCard className="w-3 h-3 inline mr-1" /> {profile.subscription_plan.replace(/_/g, " ")}
                  </span>
                )}
              </div>
            </div>

            {/* Owner Actions */}
            {isAdmin && (
              <div className="flex flex-wrap gap-2 flex-shrink-0">
                <button onClick={() => setGrantModal(true)}
                  className="px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
                  style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
                  <Plus className="w-3.5 h-3.5" /> Grant Access
                </button>
                <button onClick={() => setLifetimeModal(true)}
                  className="px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
                  style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.30)", color: "#a855f7" }}>
                  <Crown className="w-3.5 h-3.5" /> Lifetime
                </button>
                <button onClick={() => setRoleModal(true)}
                  className="px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.55)" }}>
                  <Shield className="w-3.5 h-3.5" /> Role
                </button>
                <button onClick={() => setStatusModal(true)}
                  className="px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.55)" }}>
                  <Ban className="w-3.5 h-3.5" /> Status
                </button>
              </div>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t" style={{ borderColor: "rgba(212,175,55,0.10)" }}>
            {[
              { label: "Registered", value: fmt(profile?.registration_date), icon: Calendar },
              { label: "Last Login", value: fmtDT(profile?.last_login), icon: Clock },
              { label: "Active Permissions", value: activePerms.length, icon: Key },
              { label: "Total Subscriptions", value: subscriptions.length, icon: CreditCard },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="p-3 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: G.dim }} />
                <p className="text-sm font-bold text-white">{value}</p>
                <p className="text-xs text-white/35">{label}</p>
              </div>
            ))}
          </div>

          {/* Lifetime Access row — separate for prominence */}
          <div className="pt-0">
            <div className="rounded-xl border p-4 flex items-center gap-4 flex-wrap"
              style={{
                background: profile?.lifetime_access ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.015)",
                borderColor: profile?.lifetime_access ? "rgba(168,85,247,0.35)" : "rgba(255,255,255,0.06)"
              }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: profile?.lifetime_access ? "rgba(168,85,247,0.18)" : "rgba(255,255,255,0.04)", border: `1px solid ${profile?.lifetime_access ? "rgba(168,85,247,0.35)" : "rgba(255,255,255,0.08)"}` }}>
                <Crown className="w-5 h-5" style={{ color: profile?.lifetime_access ? "#a855f7" : "rgba(255,255,255,0.20)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-inter font-bold text-sm" style={{ color: profile?.lifetime_access ? "#c084fc" : "rgba(255,255,255,0.30)" }}>
                  Lifetime Access: {profile?.lifetime_access ? "YES ✓" : "NO"}
                </p>
                {profile?.lifetime_access ? (
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> All {CONTENT_PAGES.length} pages + future pages
                    </span>
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Expiry: Never
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-white/25 mt-0.5">No lifetime access granted</p>
                )}
              </div>
              {isAdmin && profile?.lifetime_access && (
                <button
                  onClick={async () => {
                    if (!confirm("Remove lifetime access? Existing page permissions will remain.")) return;
                    try {
                      await base44.entities.UserAccessProfile.update(profile.id, { lifetime_access: false });
                      toast({ title: "✓ Lifetime access removed" });
                      loadAll();
                    } catch (e) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0"
                  style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }}>
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Accessible Pages ── */}
        <SectionHeader title="Accessible Pages" count={activePerms.length} icon={Globe}
          expanded={expandedPerms} toggle={() => setExpandedPerms(e => !e)} />
        <AnimatePresence>
          {expandedPerms && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
              <div className="space-y-2 pt-2">
                {activePerms.length === 0 ? (
                  <p className="text-center py-8 text-white/25 text-sm">No pages currently accessible</p>
                ) : (
                  activePerms.map(perm => {
                    const days = daysLeft(perm.expiry_date);
                    const urgent = days !== null && days <= 7;
                    return (
                      <div key={perm.id} className="rounded-lg border p-3 flex items-center justify-between gap-3"
                        style={{ background: G.bg, borderColor: urgent ? "rgba(245,158,11,0.40)" : G.border }}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#4ade80" }} />
                          <div>
                            <p className="text-sm font-semibold text-white truncate">{perm.page_name}</p>
                            <p className="text-xs text-white/30">{days !== null && days < 36000 ? `${days}d left` : "Permanent"} · {fmt(perm.expiry_date)}</p>
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => setExtendModal(perm)}
                              className="w-7 h-7 rounded flex items-center justify-center hover:bg-blue-500/20"
                              style={{ color: "#60a5fa", border: "1px solid rgba(96,165,250,0.25)" }} title="Extend">
                              <CalendarPlus2 className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleRevoke(perm)}
                              className="w-7 h-7 rounded flex items-center justify-center hover:bg-red-500/20"
                              style={{ color: "#ef4444", border: "1px solid rgba(239,68,68,0.20)" }} title="Revoke">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Blocked Pages ── */}
        <SectionHeader title="Blocked Pages" count={blockedPages.length} icon={Lock}
          expanded={expandedPerms} toggle={() => setExpandedPerms(e => !e)} />
        <AnimatePresence>
          {expandedPerms && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                {blockedPages.map(page => (
                  <div key={page.path} className="rounded-lg border p-2.5 text-center"
                    style={{ background: "rgba(239,68,68,0.03)", borderColor: "rgba(239,68,68,0.15)" }}>
                    <XCircle className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: "rgba(239,68,68,0.40)" }} />
                    <p className="text-xs text-white/35 truncate">{page.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Subscription History ── */}
        <SectionHeader title="Subscription History" count={subscriptions.length} icon={CreditCard}
          expanded={expandedSubs} toggle={() => setExpandedSubs(e => !e)} />
        <AnimatePresence>
          {expandedSubs && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
              <div className="space-y-2 pt-2">
                {subscriptions.length === 0 ? (
                  <p className="text-center py-8 text-white/25 text-sm">No subscription history</p>
                ) : (
                  subscriptions.map(sub => {
                    const statusColor = { ACTIVE: "#22c55e", EXPIRED: "#ef4444", PENDING: "#f59e0b", CANCELLED: "#6b7280" };
                    return (
                      <div key={sub.id} className="rounded-lg border p-3 flex items-center justify-between gap-3"
                        style={{ background: G.bg, borderColor: G.border }}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CreditCard className="w-4 h-4 flex-shrink-0" style={{ color: statusColor[sub.status] || "#888" }} />
                          <div>
                            <p className="text-sm font-semibold text-white">{sub.page_name || sub.page_path}</p>
                            <p className="text-xs text-white/30">
                              {(sub.plan_name || "").replace(/_/g, " ")} · {fmt(sub.start_date)} — {fmt(sub.expiry_date)}
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs font-bold flex-shrink-0"
                          style={{ background: `${statusColor[sub.status] || "#666"}18`, color: statusColor[sub.status] || "#888", border: `1px solid ${statusColor[sub.status] || "#666"}40` }}>
                          {sub.status}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Login History ── */}
        <SectionHeader title="Login / Activity History" count={loginHistory.length} icon={History}
          expanded={expandedHistory} toggle={() => setExpandedHistory(e => !e)} />
        <AnimatePresence>
          {expandedHistory && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
              <div className="space-y-1.5 pt-2">
                {loginHistory.length === 0 ? (
                  <p className="text-center py-8 text-white/25 text-sm">No activity records</p>
                ) : (
                  loginHistory.slice(0, 20).map(log => (
                    <div key={log.id} className="rounded-lg border p-2.5 flex items-center gap-2.5"
                      style={{ background: "rgba(255,255,255,0.01)", borderColor: "rgba(255,255,255,0.05)" }}>
                      <History className="w-3.5 h-3.5 flex-shrink-0" style={{ color: G.dim }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/50 truncate">{log.action_type?.replace(/_/g, " ")}</p>
                        {log.details && (
                          <p className="text-xs text-white/25 truncate">{log.details.substring(0, 80)}</p>
                        )}
                      </div>
                      <span className="text-xs text-white/25 flex-shrink-0">{fmtDT(log.timestamp)}</span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* ── Grant Access Modal ── */}
      <AnimatePresence>
        {grantModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)" }} onClick={() => setGrantModal(false)}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-lg rounded-2xl p-6 space-y-5"
              style={{ background: "linear-gradient(145deg,#0c1630,#060c1c)", border: `1px solid ${G.borderHi}` }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="font-inter font-bold text-white text-base">Grant Page Access</h3>
                <button onClick={() => setGrantModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10"
                  style={{ color: "rgba(255,255,255,0.40)" }}><X className="w-4 h-4" /></button>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: G.dim }}>Duration</p>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setDuration(opt.value)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ background: duration === opt.value ? G.bgHi : "rgba(255,255,255,0.04)", border: `1px solid ${duration === opt.value ? G.borderHi : "rgba(255,255,255,0.08)"}`, color: duration === opt.value ? G.text : "rgba(255,255,255,0.55)" }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: G.dim }}>
                  Pages ({selectedPages.length} selected)
                </p>
                <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
                  {CONTENT_PAGES.map(page => {
                    const sel = selectedPages.includes(page.path);
                    const already = activePerms.some(p => p.page_path === page.path);
                    return (
                      <button key={page.path} onClick={() => !already && setSelectedPages(p => sel ? p.filter(x => x !== page.path) : [...p, page.path])}
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left"
                        style={{ background: sel ? G.bgHi : "rgba(255,255,255,0.02)", border: `1px solid ${sel ? G.borderHi : "rgba(255,255,255,0.05)"}`, opacity: already ? 0.4 : 1, cursor: already ? "not-allowed" : "pointer" }}>
                        <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                          style={{ background: sel ? G.text : "transparent", border: `1px solid ${sel ? G.text : "rgba(255,255,255,0.25)"}` }}>
                          {sel && <Check className="w-3 h-3 text-black" />}
                        </div>
                        <span className="text-sm flex-1" style={{ color: sel ? "white" : "rgba(255,255,255,0.65)" }}>{page.name}</span>
                        {already && <span className="text-xs text-green-400 flex-shrink-0">Active</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setGrantModal(false)} className="flex-1 py-3 rounded-xl font-semibold text-sm"
                  style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.text }}>Cancel</button>
                <button onClick={handleGrant} disabled={granting || selectedPages.length === 0}
                  className="flex-1 py-3 rounded-xl font-bold text-sm disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#f6d860,#c98a14)", color: "#0d1b2a" }}>
                  {granting ? "Granting…" : `Grant ${selectedPages.length} Page(s)`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Lifetime Access Modal ── */}
      <AnimatePresence>
        {lifetimeModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={() => { setLifetimeModal(false); setLifetimeMode(null); setSelectedPages([]); }}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-lg rounded-2xl p-6 space-y-5"
              style={{ background: "linear-gradient(145deg,#0c1630,#060c1c)", border: `1px solid ${G.borderHi}` }}
              onClick={e => e.stopPropagation()}>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-inter font-bold text-white text-base flex items-center gap-2">
                    <Crown className="w-5 h-5" style={{ color: "#a855f7" }} />
                    Grant Lifetime Access
                  </h3>
                  <p className="text-xs text-white/45 mt-0.5">
                    {profile?.lifetime_access
                      ? "⚠️ User already has lifetime access. Granting again will add missing pages."
                      : "Choose how to grant permanent access"}
                  </p>
                </div>
                <button onClick={() => { setLifetimeModal(false); setLifetimeMode(null); setSelectedPages([]); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10"
                  style={{ color: "rgba(255,255,255,0.40)" }}><X className="w-4 h-4" /></button>
              </div>

              {!lifetimeMode ? (
                <div className="space-y-3">
                  {/* Option A: All Pages */}
                  <button onClick={() => { setLifetimeMode("all"); setSelectedPages([]); }}
                    className="w-full flex items-center gap-4 p-5 rounded-xl text-left transition-all"
                    style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.30)" }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(168,85,247,0.18)", border: "1px solid rgba(168,85,247,0.35)" }}>
                      <Crown className="w-5 h-5" style={{ color: "#a855f7" }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">All Current & Future Pages</p>
                      <p className="text-xs text-white/40 mt-0.5">Grant lifetime access to ALL pages. New pages added later are automatically included.</p>
                    </div>
                    <ChevronDown className="w-5 h-5" style={{ color: "#a855f7", transform: "rotate(-90deg)" }} />
                  </button>

                  {/* Option B: Select Pages */}
                  <button onClick={() => setLifetimeMode("select")}
                    className="w-full flex items-center gap-4 p-5 rounded-xl text-left transition-all"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.20)" }}>
                      <Star className="w-5 h-5" style={{ color: G.text }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">Choose Specific Pages</p>
                      <p className="text-xs text-white/40 mt-0.5">Select individual pages for lifetime access. New pages are NOT included.</p>
                    </div>
                    <ChevronDown className="w-5 h-5" style={{ color: G.dim, transform: "rotate(-90deg)" }} />
                  </button>
                </div>
              ) : (
                <>
                  {/* ── Option A confirmation ── */}
                  {lifetimeMode === "all" && (
                    <div className="p-4 rounded-xl space-y-2" style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.20)" }}>
                      <p className="text-sm text-white font-semibold flex items-center gap-2">
                        <Crown className="w-4 h-4" style={{ color: "#a855f7" }} /> Lifetime to ALL Pages
                      </p>
                      <ul className="text-xs text-white/45 space-y-0.5">
                        <li>• All {CONTENT_PAGES.length} current pages</li>
                        <li>• All future pages automatically included</li>
                        <li>• Lifetime Access flag: <span className="text-green-400 font-bold">YES</span></li>
                        <li>• Expiry: <span className="text-purple-400 font-bold">Never</span></li>
                      </ul>
                    </div>
                  )}

                  {/* ── Option B page selector ── */}
                  {lifetimeMode === "select" && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: G.dim }}>
                        Select Pages ({selectedPages.length})
                      </p>
                      <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                        {CONTENT_PAGES.map(page => {
                          const sel = selectedPages.includes(page.path);
                          const already = activePerms.some(p => p.page_path === page.path);
                          return (
                            <button key={page.path}
                              onClick={() => !already && setSelectedPages(p => sel ? p.filter(x => x !== page.path) : [...p, page.path])}
                              className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left"
                              style={{
                                background: sel ? G.bgHi : "rgba(255,255,255,0.02)",
                                border: `1px solid ${sel ? G.borderHi : "rgba(255,255,255,0.05)"}`,
                                opacity: already ? 0.4 : 1, cursor: already ? "not-allowed" : "pointer"
                              }}>
                              <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                                style={{ background: sel ? G.text : "transparent", border: `1px solid ${sel ? G.text : "rgba(255,255,255,0.25)"}` }}>
                                {sel && <Check className="w-3 h-3 text-black" />}
                              </div>
                              <span className="text-sm flex-1" style={{ color: sel ? "white" : "rgba(255,255,255,0.65)" }}>
                                {page.name}
                              </span>
                              {already && <span className="text-xs text-green-400 flex-shrink-0">Active</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-1">
                    <button onClick={() => { setLifetimeMode(null); setSelectedPages([]); }}
                      className="flex-1 py-3 rounded-xl font-semibold text-sm"
                      style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.text }}>
                      Back
                    </button>
                    <button onClick={handleGrantLifetime}
                      disabled={granting || (lifetimeMode === "select" && selectedPages.length === 0)}
                      className="flex-1 py-3 rounded-xl font-bold text-sm disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", color: "white" }}>
                      {granting ? "Granting…" : lifetimeMode === "all"
                        ? "Grant Lifetime to All Pages"
                        : `Grant Lifetime to ${selectedPages.length} Page(s)`}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Extend Modal ── */}
      <AnimatePresence>
        {extendModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)" }} onClick={() => setExtendModal(null)}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-sm rounded-2xl p-6 space-y-5"
              style={{ background: "linear-gradient(145deg,#0c1630,#060c1c)", border: `1px solid ${G.borderHi}` }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="font-inter font-bold text-white text-base">Extend Access</h3>
                <button onClick={() => setExtendModal(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10"
                  style={{ color: "rgba(255,255,255,0.40)" }}><X className="w-4 h-4" /></button>
              </div>
              <p className="text-xs text-white/45">{extendModal.page_name} · Expires {fmt(extendModal.expiry_date)}</p>
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setDuration(opt.value)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{ background: duration === opt.value ? G.bgHi : "rgba(255,255,255,0.04)", border: `1px solid ${duration === opt.value ? G.borderHi : "rgba(255,255,255,0.08)"}`, color: duration === opt.value ? G.text : "rgba(255,255,255,0.55)" }}>
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setExtendModal(null)} className="flex-1 py-3 rounded-xl font-semibold text-sm"
                  style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.text }}>Cancel</button>
                <button onClick={handleExtend}
                  className="flex-1 py-3 rounded-xl font-bold text-sm"
                  style={{ background: "linear-gradient(135deg,#f6d860,#c98a14)", color: "#0d1b2a" }}>Extend</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Role Modal ── */}
      <AnimatePresence>
        {roleModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)" }} onClick={() => setRoleModal(false)}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-xs rounded-2xl p-6 space-y-5"
              style={{ background: "linear-gradient(145deg,#0c1630,#060c1c)", border: `1px solid ${G.borderHi}` }}
              onClick={e => e.stopPropagation()}>
              <h3 className="font-inter font-bold text-white text-base">Change Role</h3>
              <p className="text-xs text-white/45">Current: {profile?.role || "user"}</p>
              <div className="space-y-2">
                {["user", "admin"].map(role => (
                  <button key={role} onClick={() => handleChangeRole(role)}
                    className="w-full p-3 rounded-xl text-left text-sm font-semibold flex items-center gap-3"
                    style={{ background: profile?.role === role ? G.bgHi : "rgba(255,255,255,0.03)", border: `1px solid ${profile?.role === role ? G.borderHi : "rgba(255,255,255,0.08)"}`, color: profile?.role === role ? G.text : "rgba(255,255,255,0.55)" }}>
                    <Shield className="w-4 h-4" />
                    <span className="capitalize">{role}</span>
                    {profile?.role === role && <Check className="w-4 h-4 ml-auto" />}
                  </button>
                ))}
              </div>
              <button onClick={() => setRoleModal(false)} className="w-full py-3 rounded-xl font-semibold text-sm"
                style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.text }}>Cancel</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Status Modal ── */}
      <AnimatePresence>
        {statusModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)" }} onClick={() => setStatusModal(false)}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-xs rounded-2xl p-6 space-y-5"
              style={{ background: "linear-gradient(145deg,#0c1630,#060c1c)", border: `1px solid ${G.borderHi}` }}
              onClick={e => e.stopPropagation()}>
              <h3 className="font-inter font-bold text-white text-base">Change Status</h3>
              <p className="text-xs text-white/45">Current: {profile?.account_status || "ACTIVE"}</p>
              <div className="space-y-2">
                {["ACTIVE", "SUSPENDED", "DEACTIVATED"].map(status => (
                  <button key={status} onClick={() => handleChangeStatus(status)}
                    className="w-full p-3 rounded-xl text-left text-sm font-semibold flex items-center gap-3"
                    style={{ background: profile?.account_status === status ? G.bgHi : "rgba(255,255,255,0.03)", border: `1px solid ${profile?.account_status === status ? G.borderHi : "rgba(255,255,255,0.08)"}`, color: status === "ACTIVE" ? "#4ade80" : status === "SUSPENDED" ? "#f59e0b" : "#ef4444" }}>
                    {status === "ACTIVE" ? <CheckCircle className="w-4 h-4" /> : status === "SUSPENDED" ? <AlertCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span className="capitalize">{status}</span>
                    {profile?.account_status === status && <Check className="w-4 h-4 ml-auto" />}
                  </button>
                ))}
              </div>
              <button onClick={() => setStatusModal(false)} className="w-full py-3 rounded-xl font-semibold text-sm"
                style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.text }}>Cancel</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}

function SectionHeader({ title, count, icon: Icon, expanded, toggle }) {
  return (
    <button onClick={toggle}
      className="w-full flex items-center justify-between p-3 rounded-xl"
      style={{ background: G.bg, border: `1px solid ${G.border}` }}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" style={{ color: G.text }} />
        <span className="font-inter font-bold text-white text-sm">{title}</span>
        <span className="px-2 py-0.5 rounded text-xs font-bold"
          style={{ background: G.bgHi, color: G.text }}>{count}</span>
      </div>
      {expanded ? <ChevronUp className="w-4 h-4" style={{ color: G.dim }} /> : <ChevronDown className="w-4 h-4" style={{ color: G.dim }} />}
    </button>
  );
}