import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import {
  Users, Shield, Star, Bell, Search, Plus, Trash2, CheckCircle, XCircle,
  Clock, Crown, Phone, Mail, Globe, Lock, ChevronDown, ChevronUp, Gift, X
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageLayout from "@/components/PageLayout";
import PageTitle from "@/components/PageTitle";
import { useToast } from "@/components/ui/use-toast";
import { ROUTE_PERMISSION_MAP } from "@/lib/permissionCodes";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
};

const DURATION_OPTIONS = [
  { value: "1_MONTH",   label: "1 Month",   days: 30 },
  { value: "3_MONTHS",  label: "3 Months",  days: 90 },
  { value: "6_MONTHS",  label: "6 Months",  days: 180 },
  { value: "PERMANENT", label: "Permanent", days: 36500 },
];

const GRANTABLE_PAGES = Object.entries(ROUTE_PERMISSION_MAP)
  .filter(([_, c]) => !c.adminOnly && c.code)
  .map(([path, c]) => ({ path, name: c.name, code: c.code }))
  .sort((a, b) => a.name.localeCompare(b.name));

function fmt(d) {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function isExp(d) { return new Date(d) < new Date(); }

// ── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "requests",    label: "Access Requests", icon: Bell },
  { id: "users",       label: "User Permissions", icon: Users },
  { id: "vip",         label: "VIP List",         icon: Star },
  { id: "pages",       label: "Page Visibility",  icon: Globe },
];

// ── Grant Modal ───────────────────────────────────────────────────────────────
function GrantModal({ user, existingPaths, onClose, onGranted }) {
  const { toast } = useToast();
  const [selectedPages, setSelectedPages] = useState([]);
  const [duration, setDuration] = useState("1_MONTH");
  const [grantAll, setGrantAll] = useState(false);
  const [processing, setProcessing] = useState(false);

  const available = GRANTABLE_PAGES.filter(p => !existingPaths.includes(p.path));
  const pagesToGrant = grantAll ? GRANTABLE_PAGES : GRANTABLE_PAGES.filter(p => selectedPages.includes(p.path));

  const toggle = (path) => setSelectedPages(prev => prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]);

  const handleGrant = async () => {
    if (!grantAll && selectedPages.length === 0) {
      toast({ title: "Select at least one page", variant: "destructive" }); return;
    }
    setProcessing(true);
    const dur = DURATION_OPTIONS.find(d => d.value === duration);
    const now = new Date();
    const expiry = new Date(now.getTime() + dur.days * 86400000).toISOString();
    let granted = 0;
    for (const page of pagesToGrant) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.80)" }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-lg rounded-2xl p-6 space-y-5"
        style={{ background: "linear-gradient(145deg,#0c1630,#060c1c)", border: `1px solid ${G.borderHi}` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-inter font-bold text-white text-lg">Grant Page Access</h2>
            <p className="text-xs text-white/50 mt-0.5">{user.full_name || "User"} · {user.email}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10" style={{ color: "rgba(255,255,255,0.40)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Duration */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: G.dim }}>Duration</p>
          <div className="flex flex-wrap gap-2">
            {DURATION_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setDuration(opt.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  background: duration === opt.value ? G.bgHi : "rgba(255,255,255,0.04)",
                  border: `1px solid ${duration === opt.value ? G.borderHi : "rgba(255,255,255,0.08)"}`,
                  color: duration === opt.value ? G.text : "rgba(255,255,255,0.60)",
                }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grant all toggle */}
        <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
          style={{ background: grantAll ? G.bgHi : "rgba(255,255,255,0.03)", border: `1px solid ${grantAll ? G.borderHi : "rgba(255,255,255,0.06)"}` }}>
          <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: grantAll ? G.text : "transparent", border: `1px solid ${grantAll ? G.text : "rgba(255,255,255,0.30)"}` }}>
            {grantAll && <CheckCircle className="w-3.5 h-3.5 text-black" />}
          </div>
          <input type="checkbox" className="hidden" checked={grantAll} onChange={e => setGrantAll(e.target.checked)} />
          <span className="font-inter text-sm font-bold" style={{ color: grantAll ? G.text : "rgba(255,255,255,0.70)" }}>
            Grant ALL Pages Access
          </span>
        </label>

        {/* Page selection (only when not granting all) */}
        {!grantAll && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: G.dim }}>
              Select Pages ({selectedPages.length} selected)
            </p>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {GRANTABLE_PAGES.map(page => {
                const sel = selectedPages.includes(page.path);
                const already = existingPaths.includes(page.path);
                return (
                  <button key={page.path} onClick={() => !already && toggle(page.path)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left"
                    style={{
                      background: sel ? G.bgHi : "rgba(255,255,255,0.02)",
                      border: `1px solid ${sel ? G.borderHi : "rgba(255,255,255,0.05)"}`,
                      opacity: already ? 0.4 : 1,
                      cursor: already ? "default" : "pointer",
                    }}>
                    <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                      style={{ background: sel ? G.text : "transparent", border: `1px solid ${sel ? G.text : "rgba(255,255,255,0.25)"}` }}>
                      {sel && <CheckCircle className="w-3 h-3 text-black" />}
                    </div>
                    <span className="font-inter text-sm" style={{ color: sel ? "white" : "rgba(255,255,255,0.65)" }}>{page.name}</span>
                    {already && <span className="ml-auto text-xs text-green-400">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-inter font-semibold text-sm"
            style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.text }}>
            Cancel
          </button>
          <button onClick={handleGrant} disabled={processing}
            className="flex-1 py-3 rounded-xl font-inter font-bold text-sm flex items-center justify-center gap-2"
            style={{ background: processing ? G.bg : "linear-gradient(135deg,#f6d860,#c98a14)", color: "#0d1b2a" }}>
            <Gift className="w-4 h-4" />
            {processing ? "Granting..." : "Grant Access"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Approve Request Modal ────────────────────────────────────────────────────
function ApproveModal({ request, onClose, onApproved }) {
  const { toast } = useToast();
  const [duration, setDuration] = useState("1_MONTH");
  const [processing, setProcessing] = useState(false);

  const handleApprove = async () => {
    setProcessing(true);
    try {
      await base44.functions.invoke("approveAccessRequest", {
        request_id: request.request_id,
        duration,
      });
      toast({ title: `✓ Access granted to ${request.name}` });
      onApproved(); onClose();
    } catch (e) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.80)" }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-md rounded-2xl p-6 space-y-5"
        style={{ background: "linear-gradient(145deg,#0c1630,#060c1c)", border: `1px solid ${G.borderHi}` }}
        onClick={e => e.stopPropagation()}
      >
        <div>
          <h2 className="font-inter font-bold text-white text-lg">Approve Request</h2>
          <p className="text-xs text-white/50 mt-0.5">{request.name} · {request.page_name}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: G.dim }}>Grant Duration</p>
          <div className="flex flex-wrap gap-2">
            {DURATION_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setDuration(opt.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  background: duration === opt.value ? G.bgHi : "rgba(255,255,255,0.04)",
                  border: `1px solid ${duration === opt.value ? G.borderHi : "rgba(255,255,255,0.08)"}`,
                  color: duration === opt.value ? G.text : "rgba(255,255,255,0.60)",
                }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-inter font-semibold text-sm"
            style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.text }}>Cancel</button>
          <button onClick={handleApprove} disabled={processing}
            className="flex-1 py-3 rounded-xl font-inter font-bold text-sm flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#f6d860,#c98a14)", color: "#0d1b2a" }}>
            <CheckCircle className="w-4 h-4" />
            {processing ? "Approving..." : "Approve & Grant"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Requests Tab ────────────────────────────────────────────────────────────
function RequestsTab({ requests, onRefresh, adminId }) {
  const { toast } = useToast();
  const [approving, setApproving] = useState(null);
  const [filter, setFilter] = useState("PENDING");

  const filtered = requests.filter(r => filter === "all" || r.status === filter);

  const handleReject = async (req) => {
    try {
      await base44.entities.AccessRequest.update(req.id, {
        status: "REJECTED", approved_by: adminId, approved_at: new Date().toISOString()
      });
      toast({ title: "Rejected" });
      onRefresh();
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const statusColors = { PENDING: "#f59e0b", APPROVED: "#22c55e", REJECTED: "#ef4444" };

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {["PENDING", "APPROVED", "REJECTED", "all"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: filter === f ? G.bgHi : "rgba(255,255,255,0.04)",
              border: `1px solid ${filter === f ? G.borderHi : "rgba(255,255,255,0.08)"}`,
              color: filter === f ? G.text : "rgba(255,255,255,0.50)",
            }}>
            {f === "all" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()} ({requests.filter(r => f === "all" || r.status === f).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12" style={{ color: "rgba(255,255,255,0.30)" }}>
          <Bell className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No {filter !== "all" ? filter.toLowerCase() : ""} requests</p>
        </div>
      ) : (
        filtered.map(req => (
          <div key={req.id} className="rounded-xl border p-4" style={{ background: G.bg, borderColor: G.border }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-inter font-bold text-white text-sm">{req.name}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold"
                    style={{ background: `${statusColors[req.status]}18`, color: statusColors[req.status] }}>
                    {req.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{req.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{req.email}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold"
                    style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>
                    {req.page_name}
                  </span>
                  <span className="text-xs text-white/40">{fmt(req.requested_at)}</span>
                </div>
                {req.message && (
                  <p className="text-xs text-white/50 mt-2 italic">"{req.message}"</p>
                )}
              </div>
              {req.status === "PENDING" && (
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button onClick={() => setApproving(req)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                    style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.30)" }}>
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button onClick={() => handleReject(req)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                    style={{ background: "rgba(239,68,68,0.10)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }}>
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}

      <AnimatePresence>
        {approving && (
          <ApproveModal
            request={approving}
            onClose={() => setApproving(null)}
            onApproved={onRefresh}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Users Tab ───────────────────────────────────────────────────────────────
function UsersTab({ users, permissions, onRefresh, search, setSearch }) {
  const { toast } = useToast();
  const [grantUser, setGrantUser] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter(u =>
      (u.email || "").toLowerCase().includes(q) ||
      (u.full_name || "").toLowerCase().includes(q) ||
      (u.mobile || "").includes(q)
    );
  }, [users, search]);

  const handleRevoke = async (perm) => {
    if (!confirm(`Revoke "${perm.page_name}"?`)) return;
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
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: G.dim }} />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${G.border}` }}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12" style={{ color: "rgba(255,255,255,0.30)" }}>
          <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No users found</p>
        </div>
      ) : (
        filtered.map(u => {
          const userPerms = permissions.filter(p => p.user_id === u.id);
          const activePerms = userPerms.filter(p => p.is_active && !p.is_revoked && !isExp(p.expiry_date));
          const existingPaths = userPerms.filter(p => p.is_active && !p.is_revoked).map(p => p.page_path);
          return (
            <UserRow key={u.id} user={u} userPerms={userPerms} activePerms={activePerms}
              existingPaths={existingPaths} onRevoke={handleRevoke}
              onGrant={() => setGrantUser(u)} />
          );
        })
      )}

      <AnimatePresence>
        {grantUser && (
          <GrantModal
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

function UserRow({ user, userPerms, activePerms, existingPaths, onRevoke, onGrant }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: G.bg, borderColor: G.border }}>
      <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(e => !e)}>
        <div className="flex-1 min-w-0">
          <p className="font-inter font-bold text-white text-sm truncate">{user.full_name || "Unnamed"}</p>
          <p className="text-xs text-white/40 truncate font-mono">{user.email}</p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0"
          style={{
            background: activePerms.length > 0 ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)",
            color: activePerms.length > 0 ? "#4ade80" : "rgba(255,255,255,0.30)",
          }}>
          {activePerms.length} active
        </span>
        <button onClick={e => { e.stopPropagation(); onGrant(); }}
          className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 flex-shrink-0"
          style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
          <Plus className="w-3 h-3" /> Grant
        </button>
        {expanded ? <ChevronUp className="w-4 h-4 text-white/30 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/30 flex-shrink-0" />}
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}>
            <div className="px-4 pb-4 space-y-2 border-t" style={{ borderColor: "rgba(212,175,55,0.12)" }}>
              {userPerms.length === 0 ? (
                <p className="text-white/30 text-xs pt-3">No permissions yet.</p>
              ) : (
                <div className="pt-3 space-y-1.5">
                  {userPerms.map(perm => {
                    const expired = isExp(perm.expiry_date);
                    const revoked = perm.is_revoked;
                    const statusColor = revoked ? "#ef4444" : expired ? "#f59e0b" : "#4ade80";
                    return (
                      <div key={perm.id} className="flex items-center gap-3 p-2.5 rounded-lg"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: statusColor }} />
                        <div className="flex-1 min-w-0">
                          <p className="font-inter text-sm font-semibold text-white truncate">{perm.page_name}</p>
                          <p className="text-xs text-white/35 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {expired ? "Expired" : "Expires"}: {fmt(perm.expiry_date)}
                          </p>
                        </div>
                        {!revoked && !expired && (
                          <button onClick={() => onRevoke(perm)}
                            className="w-7 h-7 rounded flex items-center justify-center hover:bg-red-500/20"
                            style={{ color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }}>
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

// ── VIP Tab ─────────────────────────────────────────────────────────────────
function VIPTab({ vips, onRefresh, adminId }) {
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ identifier: "", identifier_type: "PHONE", label: "", grant_all: false, page_paths: [] });
  const [selectedPages, setSelectedPages] = useState([]);

  const handleAdd = async () => {
    if (!form.identifier.trim()) { toast({ title: "Enter phone or email", variant: "destructive" }); return; }
    try {
      await base44.entities.VIPAccess.create({
        identifier: form.identifier.trim(),
        identifier_type: form.identifier_type,
        label: form.label.trim(),
        grant_all: form.grant_all,
        page_paths: form.grant_all ? [] : selectedPages,
        is_active: true,
        added_by: adminId,
      });
      toast({ title: "✓ VIP added" });
      setAdding(false);
      setForm({ identifier: "", identifier_type: "PHONE", label: "", grant_all: false, page_paths: [] });
      setSelectedPages([]);
      onRefresh();
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleRemove = async (vip) => {
    if (!confirm("Remove VIP?")) return;
    try {
      await base44.entities.VIPAccess.update(vip.id, { is_active: false });
      toast({ title: "✓ Removed" });
      onRefresh();
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/50">VIP members get free access to selected pages.</p>
        <button onClick={() => setAdding(v => !v)}
          className="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
          style={{ background: G.bgHi, border: `1px solid ${G.borderHi}`, color: G.text }}>
          <Plus className="w-3.5 h-3.5" /> Add VIP
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}>
            <div className="rounded-xl border p-4 space-y-4" style={{ background: G.bgHi, borderColor: G.borderHi }}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Type</label>
                  <div className="flex gap-2">
                    {["PHONE", "EMAIL"].map(t => (
                      <button key={t} onClick={() => setForm(f => ({ ...f, identifier_type: t }))}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold"
                        style={{
                          background: form.identifier_type === t ? G.bg : "transparent",
                          border: `1px solid ${form.identifier_type === t ? G.borderHi : "rgba(255,255,255,0.10)"}`,
                          color: form.identifier_type === t ? G.text : "rgba(255,255,255,0.45)",
                        }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Label (optional)</label>
                  <input type="text" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                    placeholder="e.g. Ahmed" className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${G.border}` }} />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">
                  {form.identifier_type === "PHONE" ? "Phone Number" : "Email Address"}
                </label>
                <input type="text" value={form.identifier} onChange={e => setForm(f => ({ ...f, identifier: e.target.value }))}
                  placeholder={form.identifier_type === "PHONE" ? "+971501234567" : "user@example.com"}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${G.border}` }} />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="w-5 h-5 rounded flex items-center justify-center"
                  style={{ background: form.grant_all ? G.text : "transparent", border: `1px solid ${form.grant_all ? G.text : "rgba(255,255,255,0.30)"}` }}>
                  {form.grant_all && <CheckCircle className="w-3.5 h-3.5 text-black" />}
                </div>
                <input type="checkbox" className="hidden" checked={form.grant_all} onChange={e => setForm(f => ({ ...f, grant_all: e.target.checked }))} />
                <span className="text-sm font-semibold" style={{ color: form.grant_all ? G.text : "rgba(255,255,255,0.65)" }}>Grant all pages access</span>
              </label>

              {!form.grant_all && (
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Select Pages</label>
                  <div className="max-h-36 overflow-y-auto space-y-1">
                    {GRANTABLE_PAGES.map(p => {
                      const sel = selectedPages.includes(p.path);
                      return (
                        <button key={p.path} onClick={() => setSelectedPages(prev => sel ? prev.filter(x => x !== p.path) : [...prev, p.path])}
                          className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm"
                          style={{
                            background: sel ? G.bg : "transparent",
                            border: `1px solid ${sel ? G.border : "transparent"}`,
                            color: sel ? "white" : "rgba(255,255,255,0.50)",
                          }}>
                          <div className="w-3.5 h-3.5 rounded flex-shrink-0 flex items-center justify-center"
                            style={{ background: sel ? G.text : "transparent", border: `1px solid ${sel ? G.text : "rgba(255,255,255,0.25)"}` }}>
                            {sel && <CheckCircle className="w-2.5 h-2.5 text-black" />}
                          </div>
                          {p.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setAdding(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.text }}>Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                  style={{ background: "linear-gradient(135deg,#f6d860,#c98a14)", color: "#0d1b2a" }}>Add VIP</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIP List */}
      {vips.length === 0 ? (
        <div className="text-center py-10" style={{ color: "rgba(255,255,255,0.25)" }}>
          <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No VIP members yet</p>
        </div>
      ) : (
        vips.map(vip => (
          <div key={vip.id} className="rounded-xl border p-4 flex items-center gap-4"
            style={{ background: G.bg, borderColor: vip.is_active ? G.border : "rgba(255,255,255,0.08)" }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {vip.identifier_type === "PHONE" ? <Phone className="w-3.5 h-3.5" style={{ color: G.dim }} /> : <Mail className="w-3.5 h-3.5" style={{ color: G.dim }} />}
                <span className="font-inter font-bold text-white text-sm">{vip.identifier}</span>
                {vip.label && <span className="text-xs text-white/40">({vip.label})</span>}
              </div>
              <p className="text-xs text-white/40">
                {vip.grant_all ? "All pages" : `${(vip.page_paths || []).length} page(s)`}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-bold flex-shrink-0"
              style={{
                background: vip.is_active ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.05)",
                color: vip.is_active ? "#4ade80" : "rgba(255,255,255,0.30)",
              }}>
              {vip.is_active ? "Active" : "Inactive"}
            </span>
            <button onClick={() => handleRemove(vip)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/15 flex-shrink-0"
              style={{ color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}

// ── Page Visibility Tab ─────────────────────────────────────────────────────
function PagesTab({ configs, onRefresh }) {
  const { toast } = useToast();
  const [toggling, setToggling] = useState(null);

  const handleToggle = async (page) => {
    setToggling(page.path);
    try {
      await base44.functions.invoke("updatePageVisibility", {
        page_path: page.path,
        page_name: page.name,
        requires_permission: !page.isPrivate,
      });
      toast({ title: `"${page.name}" is now ${page.isPrivate ? "Public" : "Private"}` });
      onRefresh();
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setToggling(null);
    }
  };

  const pages = GRANTABLE_PAGES.map(p => {
    const dbConfig = configs.find(c => c.page_path === p.path);
    const isPrivate = dbConfig ? dbConfig.requires_permission : (ROUTE_PERMISSION_MAP[p.path]?.requiresPermission ?? true);
    return { ...p, isPrivate };
  });

  return (
    <div className="space-y-3">
      <p className="text-xs text-white/50">Toggle pages between Public (free for all) and Private (requires access).</p>
      {pages.map(page => (
        <div key={page.path} className="rounded-xl border p-4 flex items-center gap-4"
          style={{ background: G.bg, borderColor: G.border }}>
          <div className="flex-1 min-w-0">
            <p className="font-inter font-semibold text-white text-sm">{page.name}</p>
            <p className="text-xs font-mono text-white/35">{page.path}</p>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 flex-shrink-0"
            style={{
              background: page.isPrivate ? "rgba(239,68,68,0.10)" : "rgba(34,197,94,0.10)",
              color: page.isPrivate ? "#ef4444" : "#22c55e",
              border: `1px solid ${page.isPrivate ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)"}`,
            }}>
            {page.isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
            {page.isPrivate ? "Private" : "Public"}
          </span>
          <button
            onClick={() => handleToggle(page)}
            disabled={toggling === page.path}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0"
            style={{
              background: toggling === page.path ? "rgba(255,255,255,0.04)" : G.bgHi,
              border: `1px solid ${G.borderHi}`,
              color: G.text,
            }}>
            {toggling === page.path ? "..." : page.isPrivate ? "Make Public" : "Make Private"}
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function OwnerAccessDashboard() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [tab, setTab] = useState("requests");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [vips, setVips] = useState([]);
  const [pageConfigs, setPageConfigs] = useState([]);

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      const me = await base44.auth.me();
      if (!me || (me.role !== "admin" && me.role !== "owner")) {
        setIsAdmin(false); return;
      }
      setIsAdmin(true);
      setAdminId(me.id);
      await loadAll();
    } catch { setIsAdmin(false); }
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [reqs, allUsers, perms, vipList, configs] = await Promise.all([
        base44.entities.AccessRequest.list("-requested_at", 200),
        base44.entities.User.list(),
        base44.entities.PagePermission.list(),
        base44.entities.VIPAccess.list(),
        base44.entities.PageVisibilityConfig.list(),
      ]);
      setRequests(reqs);
      setUsers(allUsers);
      setPermissions(perms);
      setVips(vipList);
      setPageConfigs(configs);
    } catch (e) {
      toast({ title: "Load error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = requests.filter(r => r.status === "PENDING").length;

  if (isAdmin === false) return <Navigate to="/" replace />;

  if (isAdmin === null || loading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-yellow-400 border-r-transparent border-b-yellow-400 border-l-transparent rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageTitle arabic="لوحة تحكم الوصول" latin="Owner Access Dashboard" subtitle="Full Access Control" icon="👑" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 pb-10">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Pending Requests", value: pendingCount, color: "#f59e0b" },
            { label: "Total Users",       value: users.length, color: G.text },
            { label: "Active Permissions", value: permissions.filter(p => p.is_active && !p.is_revoked && !isExp(p.expiry_date)).length, color: "#22c55e" },
            { label: "VIP Members",       value: vips.filter(v => v.is_active).length, color: "#a855f7" },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-4 rounded-xl border text-center" style={{ background: G.bg, borderColor: G.border }}>
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs text-white/45 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all relative"
              style={{
                background: tab === id ? G.bgHi : "rgba(255,255,255,0.03)",
                border: `1px solid ${tab === id ? G.borderHi : "rgba(255,255,255,0.08)"}`,
                color: tab === id ? G.text : "rgba(255,255,255,0.50)",
              }}>
              <Icon className="w-3.5 h-3.5" />
              {label}
              {id === "requests" && pendingCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ background: "#f59e0b", color: "#000" }}>
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "requests" && <RequestsTab requests={requests} onRefresh={loadAll} adminId={adminId} />}
        {tab === "users" && <UsersTab users={users} permissions={permissions} onRefresh={loadAll} search={search} setSearch={setSearch} />}
        {tab === "vip" && <VIPTab vips={vips} onRefresh={loadAll} adminId={adminId} />}
        {tab === "pages" && <PagesTab configs={pageConfigs} onRefresh={loadAll} />}

      </motion.div>
    </PageLayout>
  );
}