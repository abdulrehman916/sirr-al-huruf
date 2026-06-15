import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import {
  Users, CreditCard, Globe, Shield, Search, Plus, Trash2,
  CheckCircle, X, Clock, Lock, ChevronDown, ChevronUp,
  Phone, Mail, Calendar, Crown, RefreshCw
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageLayout from "@/components/PageLayout";
import PageTitle from "@/components/PageTitle";
import { useToast } from "@/components/ui/use-toast";
import { ROUTE_PERMISSION_MAP } from "@/lib/permissionCodes";

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
  { value: "1_MONTH",   label: "1 Month",    days: 30 },
  { value: "3_MONTHS",  label: "3 Months",   days: 90 },
  { value: "6_MONTHS",  label: "6 Months",   days: 180 },
  { value: "1_YEAR",    label: "1 Year",      days: 365 },
  { value: "PERMANENT", label: "Permanent",   days: 36500 },
];

// Only content pages (non-admin, non-audit) for the owner UI
const CONTENT_PAGES = Object.entries(ROUTE_PERMISSION_MAP)
  .filter(([path, c]) => !c.adminOnly && c.code && path !== "/" && !path.startsWith("/admin"))
  .map(([path, c]) => ({ path, name: c.name, code: c.code }))
  .sort((a, b) => a.name.localeCompare(b.name));

function fmt(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function isExp(d) { return d && new Date(d) < new Date(); }
function daysLeft(d) {
  if (!d) return null;
  const diff = new Date(d) - new Date();
  return Math.ceil(diff / 86400000);
}

const TABS = [
  { id: "users",       label: "Users",            icon: Users },
  { id: "subs",        label: "Subscriptions",    icon: CreditCard },
  { id: "visibility",  label: "Page Visibility",  icon: Globe },
  { id: "access",      label: "User Access",      icon: Shield },
];

// ── Grant Access Modal ────────────────────────────────────────────────────────
function GrantAccessModal({ user, existingPaths, onClose, onGranted }) {
  const { toast } = useToast();
  const [selectedPages, setSelectedPages] = useState([]);
  const [duration, setDuration] = useState("1_MONTH");
  const [processing, setProcessing] = useState(false);

  const toggle = (path) =>
    setSelectedPages(p => p.includes(path) ? p.filter(x => x !== path) : [...p, path]);

  const handleGrant = async () => {
    if (selectedPages.length === 0) {
      toast({ title: "Select at least one page", variant: "destructive" }); return;
    }
    setProcessing(true);
    const dur = DURATION_OPTIONS.find(d => d.value === duration);
    const now = new Date();
    const expiry = new Date(now.getTime() + dur.days * 86400000).toISOString();
    let granted = 0;
    for (const path of selectedPages) {
      const page = CONTENT_PAGES.find(p => p.path === path);
      if (!page) continue;
      try {
        await base44.functions.invoke("grantPagePermission", {
          user_id: user.id,
          page_path: page.path,
          page_name: page.name,
          permission_code: page.code,
          start_date: now.toISOString(),
          expiry_date: expiry,
        });
        granted++;
      } catch {}
    }
    setProcessing(false);
    toast({ title: `✓ Granted ${granted} page(s) to ${user.full_name || user.email}` });
    onGranted(); onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="w-full max-w-lg rounded-2xl p-6 space-y-5"
        style={{ background: "linear-gradient(145deg,#0c1630,#060c1c)", border: `1px solid ${G.borderHi}` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-inter font-bold text-white text-base">Grant Page Access</h3>
            <p className="text-xs text-white/45 mt-0.5">{user.full_name || "User"} · {user.email}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10" style={{ color: "rgba(255,255,255,0.40)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Duration picker */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: G.dim }}>Access Duration</p>
          <div className="flex flex-wrap gap-2">
            {DURATION_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setDuration(opt.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: duration === opt.value ? G.bgHi : "rgba(255,255,255,0.04)",
                  border: `1px solid ${duration === opt.value ? G.borderHi : "rgba(255,255,255,0.08)"}`,
                  color: duration === opt.value ? G.text : "rgba(255,255,255,0.55)",
                }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Page picker */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: G.dim }}>
            Select Pages ({selectedPages.length} selected)
          </p>
          <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
            {CONTENT_PAGES.map(page => {
              const sel = selectedPages.includes(page.path);
              const has = existingPaths.includes(page.path);
              return (
                <button key={page.path} onClick={() => !has && toggle(page.path)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all"
                  style={{
                    background: sel ? G.bgHi : "rgba(255,255,255,0.02)",
                    border: `1px solid ${sel ? G.borderHi : "rgba(255,255,255,0.05)"}`,
                    opacity: has ? 0.4 : 1,
                    cursor: has ? "not-allowed" : "pointer",
                  }}>
                  <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: sel ? G.text : "transparent", border: `1px solid ${sel ? G.text : "rgba(255,255,255,0.25)"}` }}>
                    {sel && <CheckCircle className="w-3 h-3 text-black" />}
                  </div>
                  <span className="font-inter text-sm flex-1" style={{ color: sel ? "white" : "rgba(255,255,255,0.65)" }}>{page.name}</span>
                  {has && <span className="text-xs text-green-400 flex-shrink-0">Already active</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-inter font-semibold text-sm"
            style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.text }}>
            Cancel
          </button>
          <button onClick={handleGrant} disabled={processing || selectedPages.length === 0}
            className="flex-1 py-3 rounded-xl font-inter font-bold text-sm disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#f6d860,#c98a14)", color: "#0d1b2a" }}>
            {processing ? "Granting…" : `Grant ${selectedPages.length > 0 ? selectedPages.length + " Page(s)" : "Access"}`}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Users Tab ─────────────────────────────────────────────────────────────────
function UsersTab({ users }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter(u =>
      (u.email || "").toLowerCase().includes(q) ||
      (u.full_name || "").toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: G.dim }} />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${G.border}` }}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: "rgba(255,255,255,0.25)" }}>
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No users found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(u => (
            <div key={u.id} className="rounded-xl border p-4 flex items-center gap-4"
              style={{ background: G.bg, borderColor: G.border }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>
                {(u.full_name || u.email || "?")[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-inter font-bold text-white text-sm truncate">{u.full_name || "Unnamed"}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                  <span className="text-xs text-white/40 flex items-center gap-1">
                    <Mail className="w-3 h-3" />{u.email || "—"}
                  </span>
                  {u.mobile && (
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <Phone className="w-3 h-3" />{u.mobile}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-white/30 flex items-center gap-1 justify-end">
                  <Calendar className="w-3 h-3" />
                  {fmt(u.created_date)}
                </p>
                <p className="text-xs mt-0.5 font-semibold capitalize"
                  style={{ color: u.role === "admin" ? G.text : "rgba(255,255,255,0.35)" }}>
                  {u.role || "user"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Subscriptions Tab ─────────────────────────────────────────────────────────
function SubscriptionsTab({ subscriptions, users }) {
  const [filter, setFilter] = useState("ACTIVE");

  const enriched = useMemo(() => subscriptions.map(sub => {
    const user = users.find(u => u.id === sub.user_id);
    return { ...sub, userName: user?.full_name || sub.user_name || "Unknown", userEmail: user?.email || sub.user_email || "—" };
  }), [subscriptions, users]);

  const filtered = filter === "all" ? enriched : enriched.filter(s => s.status === filter);
  const counts = {
    ACTIVE: enriched.filter(s => s.status === "ACTIVE").length,
    EXPIRED: enriched.filter(s => s.status === "EXPIRED").length,
    PENDING: enriched.filter(s => s.status === "PENDING").length,
  };

  const statusColor = { ACTIVE: "#22c55e", EXPIRED: "#ef4444", PENDING: "#f59e0b", CANCELLED: "#6b7280" };

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Active", value: counts.ACTIVE, color: "#22c55e" },
          { label: "Expired", value: counts.EXPIRED, color: "#ef4444" },
          { label: "Pending", value: counts.PENDING, color: "#f59e0b" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border p-3 text-center"
            style={{ background: G.bg, borderColor: G.border }}>
            <p className="text-xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs text-white/40 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["ACTIVE", "EXPIRED", "PENDING", "all"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{
              background: filter === f ? G.bgHi : "rgba(255,255,255,0.04)",
              border: `1px solid ${filter === f ? G.borderHi : "rgba(255,255,255,0.08)"}`,
              color: filter === f ? G.text : "rgba(255,255,255,0.45)",
            }}>
            {f === "all" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: "rgba(255,255,255,0.25)" }}>
          <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No subscriptions found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(sub => {
            const days = daysLeft(sub.expiry_date);
            return (
              <div key={sub.id} className="rounded-xl border p-4"
                style={{ background: G.bg, borderColor: G.border }}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="font-inter font-bold text-white text-sm">{sub.userName}</p>
                    <p className="text-xs text-white/40">{sub.userEmail}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold"
                        style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>
                        {sub.page_name || sub.page_path}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold"
                        style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.50)" }}>
                        {(sub.plan_name || "").replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{
                        background: `${statusColor[sub.status] || "#666"}18`,
                        color: statusColor[sub.status] || "#888",
                        border: `1px solid ${statusColor[sub.status] || "#666"}40`,
                      }}>
                      {sub.status}
                    </span>
                    <p className="text-xs text-white/35 mt-1.5 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" />
                      {sub.expiry_date
                        ? sub.status === "ACTIVE"
                          ? days > 0 ? `${days}d left` : "Expiring today"
                          : fmt(sub.expiry_date)
                        : "Lifetime"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Page Visibility Tab ───────────────────────────────────────────────────────
function VisibilityTab({ pageConfigs, onRefresh }) {
  const { toast } = useToast();
  const [toggling, setToggling] = useState(null);

  const pages = CONTENT_PAGES.map(p => {
    const db = pageConfigs.find(c => c.page_path === p.path);
    const isPrivate = db ? db.requires_permission : (ROUTE_PERMISSION_MAP[p.path]?.requiresPermission ?? true);
    return { ...p, isPrivate };
  });

  const publicCount = pages.filter(p => !p.isPrivate).length;
  const privateCount = pages.filter(p => p.isPrivate).length;

  const handleToggle = async (page) => {
    setToggling(page.path);
    try {
      await base44.functions.invoke("updatePageVisibility", {
        page_path: page.path,
        page_name: page.name,
        requires_permission: !page.isPrivate,
      });
      toast({ title: `"${page.name}" is now ${page.isPrivate ? "🌍 Public" : "🔒 Private"}` });
      onRefresh();
    } catch (e) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border p-3 text-center" style={{ background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.25)" }}>
          <p className="text-xl font-bold text-green-400">{publicCount}</p>
          <p className="text-xs text-white/40 mt-0.5">Public Pages</p>
        </div>
        <div className="rounded-xl border p-3 text-center" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.20)" }}>
          <p className="text-xl font-bold text-red-400">{privateCount}</p>
          <p className="text-xs text-white/40 mt-0.5">Private Pages</p>
        </div>
      </div>

      <p className="text-xs text-white/40 px-1">
        <Globe className="w-3 h-3 inline mr-1" />Public — anyone can view.
        <Lock className="w-3 h-3 inline mx-1 ml-3" />Private — requires subscription or manual access.
      </p>

      <div className="space-y-2">
        {pages.map(page => (
          <div key={page.path} className="rounded-xl border p-3.5 flex items-center gap-3"
            style={{ background: G.bg, borderColor: G.border }}>
            <div className="flex-1 min-w-0">
              <p className="font-inter font-semibold text-white text-sm">{page.name}</p>
              <p className="text-xs font-mono text-white/30 mt-0.5">{page.path}</p>
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold flex-shrink-0"
              style={{
                background: page.isPrivate ? "rgba(239,68,68,0.10)" : "rgba(34,197,94,0.10)",
                color: page.isPrivate ? "#ef4444" : "#22c55e",
                border: `1px solid ${page.isPrivate ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)"}`,
              }}>
              {page.isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
              {page.isPrivate ? "Private" : "Public"}
            </span>
            <button onClick={() => handleToggle(page)} disabled={toggling === page.path}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0 transition-all disabled:opacity-50"
              style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
              {toggling === page.path ? "…" : page.isPrivate ? "Make Public" : "Make Private"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── User Access Tab ───────────────────────────────────────────────────────────
function UserAccessTab({ users, permissions, onRefresh }) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [grantUser, setGrantUser] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter(u =>
      (u.email || "").toLowerCase().includes(q) ||
      (u.full_name || "").toLowerCase().includes(q)
    );
  }, [users, search]);

  const handleRevoke = async (perm) => {
    if (!confirm(`Revoke access to "${perm.page_name}"?`)) return;
    try {
      const me = await base44.auth.me();
      await base44.functions.invoke("revokePagePermission", {
        permission_id: perm.permission_id,
        revoked_by: me.id,
        reason: "Revoked by owner",
      });
      toast({ title: `✓ Revoked "${perm.page_name}"` });
      onRefresh();
    } catch (e) {
      toast({ title: "Revoke failed", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: G.dim }} />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search user by name or email…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${G.border}` }}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: "rgba(255,255,255,0.25)" }}>
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No users found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(u => {
            const userPerms = permissions.filter(p => p.user_id === u.id);
            const activePerms = userPerms.filter(p => p.is_active && !p.is_revoked && !isExp(p.expiry_date));
            const existingPaths = activePerms.map(p => p.page_path);
            return (
              <UserAccessRow key={u.id} user={u} userPerms={userPerms} activeCount={activePerms.length}
                existingPaths={existingPaths} onRevoke={handleRevoke}
                onGrant={() => setGrantUser(u)} />
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {grantUser && (
          <GrantAccessModal
            user={grantUser}
            existingPaths={permissions.filter(p => p.user_id === grantUser.id && p.is_active && !p.is_revoked).map(p => p.page_path)}
            onClose={() => setGrantUser(null)}
            onGranted={onRefresh}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function UserAccessRow({ user, userPerms, activeCount, existingPaths, onRevoke, onGrant }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: G.bg, borderColor: G.border }}>
      <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
          style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>
          {(user.full_name || user.email || "?")[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-inter font-bold text-white text-sm truncate">{user.full_name || "Unnamed"}</p>
          <p className="text-xs text-white/35 truncate">{user.email}</p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0"
          style={{
            background: activeCount > 0 ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)",
            color: activeCount > 0 ? "#4ade80" : "rgba(255,255,255,0.25)",
          }}>
          {activeCount} active
        </span>
        <button
          onClick={e => { e.stopPropagation(); onGrant(); }}
          className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 flex-shrink-0"
          style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
          <Plus className="w-3 h-3" /> Grant
        </button>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-white/25 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-white/25 flex-shrink-0" />}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
            <div className="px-4 pb-4 border-t space-y-2" style={{ borderColor: "rgba(212,175,55,0.10)" }}>
              {userPerms.length === 0 ? (
                <p className="text-white/25 text-xs pt-3">No page access granted yet.</p>
              ) : (
                <div className="pt-3 space-y-1.5">
                  {userPerms.map(perm => {
                    const expired = isExp(perm.expiry_date);
                    const revoked = perm.is_revoked;
                    const color = revoked ? "#ef4444" : expired ? "#f59e0b" : "#4ade80";
                    const days = !revoked && !expired ? daysLeft(perm.expiry_date) : null;
                    return (
                      <div key={perm.id} className="flex items-center gap-3 p-2.5 rounded-lg"
                        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                        <div className="flex-1 min-w-0">
                          <p className="font-inter text-sm font-semibold text-white truncate">{perm.page_name}</p>
                          <p className="text-xs text-white/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {revoked ? "Revoked" : expired ? `Expired ${fmt(perm.expiry_date)}` : days !== null && days < 36000 ? `${days}d left · ${fmt(perm.expiry_date)}` : "Permanent"}
                          </p>
                        </div>
                        {!revoked && !expired && (
                          <button onClick={() => onRevoke(perm)}
                            className="w-7 h-7 rounded flex items-center justify-center hover:bg-red-500/20 flex-shrink-0"
                            style={{ color: "#ef4444", border: "1px solid rgba(239,68,68,0.20)" }}>
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function OwnerAccessDashboard() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(null);
  const [tab, setTab] = useState("users");
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [pageConfigs, setPageConfigs] = useState([]);

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      const me = await base44.auth.me();
      if (!me || (me.role !== "admin" && me.role !== "owner")) {
        setIsAdmin(false); return;
      }
      setIsAdmin(true);
      await loadAll();
    } catch { setIsAdmin(false); }
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [allUsers, perms, subs, configs] = await Promise.all([
        base44.entities.User.list(),
        base44.entities.PagePermission.list("-granted_at", 500),
        base44.entities.Subscription.list("-start_date", 500),
        base44.entities.PageVisibilityConfig.list(),
      ]);
      setUsers(allUsers);
      setPermissions(perms);
      setSubscriptions(subs);
      setPageConfigs(configs);
    } catch (e) {
      toast({ title: "Load error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin === false) return <Navigate to="/" replace />;

  if (isAdmin === null || loading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  const activeSubs = subscriptions.filter(s => s.status === "ACTIVE").length;
  const activePerms = permissions.filter(p => p.is_active && !p.is_revoked && !isExp(p.expiry_date)).length;
  const publicPages = CONTENT_PAGES.filter(p => {
    const db = pageConfigs.find(c => c.page_path === p.path);
    return db ? !db.requires_permission : !(ROUTE_PERMISSION_MAP[p.path]?.requiresPermission ?? true);
  }).length;

  return (
    <PageLayout>
      <PageTitle arabic="لوحة تحكم الوصول" latin="Owner Access Dashboard" subtitle="Manage Users · Pages · Subscriptions" icon="👑" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 pb-10">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Registered Users",    value: users.length,  color: G.text },
            { label: "Active Subscriptions", value: activeSubs,    color: "#22c55e" },
            { label: "Active Permissions",   value: activePerms,   color: "#60a5fa" },
            { label: "Public Pages",         value: `${publicPages}/${CONTENT_PAGES.length}`, color: "#a78bfa" },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-4 rounded-xl border text-center" style={{ background: G.bg, borderColor: G.border }}>
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs text-white/40 mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: tab === id ? G.bgHi : "rgba(255,255,255,0.03)",
                border: `1px solid ${tab === id ? G.borderHi : "rgba(255,255,255,0.07)"}`,
                color: tab === id ? G.text : "rgba(255,255,255,0.45)",
              }}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
          <button onClick={loadAll}
            className="ml-auto px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Tab content */}
        <div>
          {tab === "users"      && <UsersTab users={users} />}
          {tab === "subs"       && <SubscriptionsTab subscriptions={subscriptions} users={users} />}
          {tab === "visibility" && <VisibilityTab pageConfigs={pageConfigs} onRefresh={loadAll} />}
          {tab === "access"     && <UserAccessTab users={users} permissions={permissions} onRefresh={loadAll} />}
        </div>

      </motion.div>
    </PageLayout>
  );
}