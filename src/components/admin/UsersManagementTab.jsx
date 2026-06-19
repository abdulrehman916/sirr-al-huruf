import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Users, Search, Mail, Phone, Clock, Globe, Smartphone,
  Calendar, CreditCard, Crown, Ban, CheckCircle, AlertTriangle, X
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const G = {
  border: "rgba(212,175,55,0.35)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

function fmt(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Block/Unblock Modal ───────────────────────────────────────────────────────
function BlockModal({ user, profile, onClose, onDone }) {
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const isBlocked = profile?.account_status === "BLOCKED";

  const handle = async () => {
    setProcessing(true);
    try {
      const me = await base44.auth.me();
      if (isBlocked) {
        // Unblock: restore to ACTIVE
        const existing = await base44.entities.UserAccessProfile.filter({ user_id: user.id }, null, 1);
        if (existing.length > 0) {
          await base44.entities.UserAccessProfile.update(existing[0].id, {
            account_status: "ACTIVE",
            blocked_at: null,
            blocked_by: null,
            block_reason: null,
          });
        }
        toast({ title: `✓ ${user.full_name || user.email} unblocked` });
      } else {
        // Block
        const existing = await base44.entities.UserAccessProfile.filter({ user_id: user.id }, null, 1);
        const now = new Date().toISOString();
        if (existing.length > 0) {
          await base44.entities.UserAccessProfile.update(existing[0].id, {
            account_status: "BLOCKED",
            blocked_at: now,
            blocked_by: me.id,
            block_reason: reason || "Blocked by admin",
          });
        }
        toast({ title: `✓ ${user.full_name || user.email} blocked` });
      }
      onDone();
      onClose();
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="w-full max-w-sm rounded-2xl p-6 space-y-4"
        style={{ background: "linear-gradient(145deg,#0c1630,#060c1c)", border: `1px solid ${isBlocked ? G.borderHi : "rgba(239,68,68,0.60)"}` }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-inter font-bold text-white text-base">
              {isBlocked ? "Unblock User" : "Block User"}
            </h3>
            <p className="text-xs text-white/40 mt-0.5">{user.full_name || user.email}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.40)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isBlocked && (
          <>
            <div className="rounded-xl border p-3 flex items-start gap-2"
              style={{ background: "rgba(239,68,68,0.07)", borderColor: "rgba(239,68,68,0.30)" }}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <p className="text-xs text-red-400/80">
                Blocked users <strong>cannot log in, receive OTP, use subscriptions, or access any pages</strong>.
              </p>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Block Reason (optional)</label>
              <input value={reason} onChange={e => setReason(e.target.value)}
                placeholder="e.g. Violation of terms"
                className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: `1px solid rgba(239,68,68,0.25)` }} />
            </div>
          </>
        )}

        {isBlocked && profile?.block_reason && (
          <p className="text-xs text-white/50 italic">Blocked for: "{profile.block_reason}"</p>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold"
            style={{ background: "transparent", border: `1px solid ${G.border}`, color: G.text }}>
            Cancel
          </button>
          <button onClick={handle} disabled={processing}
            className="flex-1 py-3 rounded-xl text-sm font-bold disabled:opacity-50"
            style={{
              background: isBlocked
                ? "linear-gradient(135deg,#22c55e,#16a34a)"
                : "linear-gradient(135deg,#ef4444,#b91c1c)",
              color: "white"
            }}>
            {processing ? "…" : isBlocked ? "Unblock" : "Block User"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Single User Row ───────────────────────────────────────────────────────────
function UserRow({ u, onBlock }) {
  const navigate = useNavigate();
  const status = u.profile?.account_status || "ACTIVE";
  const isBlocked = status === "BLOCKED";
  const isDeactivated = status === "DEACTIVATED";

  const statusColor = isBlocked ? "#ef4444" : isDeactivated ? "#f59e0b" : status === "SUSPENDED" ? "#f59e0b" : "rgba(255,255,255,0.25)";

  return (
    <div className="rounded-xl border p-4 flex items-center gap-4"
      style={{ background: isBlocked ? "rgba(239,68,68,0.04)" : G.bg, borderColor: isBlocked ? "rgba(239,68,68,0.25)" : G.border }}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
        style={{ background: G.bgHi, color: G.text, border: `1px solid ${G.border}` }}>
        {(u.profile?.full_name || u.full_name || u.email || "?")[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-inter font-bold text-white text-sm truncate">
            {u.profile?.full_name || u.full_name || "Unnamed"}
          </p>
          {u.profile?.lifetime_access && (
            <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold"
              style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.30)" }}>
              <Crown className="w-3 h-3 inline" />
            </span>
          )}
          {isBlocked && (
            <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold"
              style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.30)" }}>
              BLOCKED
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
          <span className="text-xs text-white/40 flex items-center gap-1"><Mail className="w-3 h-3" />{u.email || "—"}</span>
          {(u.profile?.mobile || u.mobile) && (
            <span className="text-xs text-white/40 flex items-center gap-1"><Phone className="w-3 h-3" />{u.profile?.mobile || u.mobile}</span>
          )}
          <span className="text-xs text-white/40 flex items-center gap-1">
            <Clock className="w-3 h-3" />{u.profile?.last_login ? fmt(u.profile.last_login) : "—"}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
          {u.profile?.device_type && u.profile.device_type !== "unknown" && (
            <span className="text-[10px] text-white/25 capitalize flex items-center gap-1">
              <Smartphone className="w-2.5 h-2.5" />{u.profile.device_type}
            </span>
          )}
          {u.profile?.country && (
            <span className="text-[10px] text-white/25 flex items-center gap-1">
              <Globe className="w-2.5 h-2.5" />{u.profile.country}
            </span>
          )}
          <span className="text-[10px] text-white/25 flex items-center gap-1">
            <Calendar className="w-2.5 h-2.5" />{u.profile?.registration_date ? fmt(u.profile.registration_date) : "—"}
          </span>
        </div>
        {isBlocked && u.profile?.block_reason && (
          <p className="text-[10px] text-red-400/60 mt-1 italic">Reason: {u.profile.block_reason}</p>
        )}
      </div>
      <div className="text-right flex-shrink-0 space-y-1.5">
        <p className="text-xs font-semibold" style={{ color: statusColor }}>{status}</p>
        <button onClick={() => navigate(`/admin/user-detail/${u.id}`)}
          className="block px-3 py-1 rounded-lg text-xs font-bold"
          style={{ background: "rgba(59,130,246,0.10)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)" }}>
          Details →
        </button>
        <button onClick={() => onBlock(u)}
          className="block px-3 py-1 rounded-lg text-xs font-bold w-full"
          style={isBlocked
            ? { background: "rgba(34,197,94,0.10)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.25)" }
            : { background: "rgba(239,68,68,0.10)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.22)" }}>
          {isBlocked ? "Unblock" : "Block"}
        </button>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function UsersManagementTab({ users, profiles, onRefresh }) {
  const [search, setSearch] = useState("");
  const [subTab, setSubTab] = useState("active");
  const [blockTarget, setBlockTarget] = useState(null);

  const enriched = useMemo(() => users.map(u => ({
    ...u,
    profile: profiles.find(p => p.user_id === u.id),
  })), [users, profiles]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const bySearch = q
      ? enriched.filter(u => (u.email || "").toLowerCase().includes(q) || (u.full_name || "").toLowerCase().includes(q))
      : enriched;
    if (subTab === "active") return bySearch.filter(u => !u.profile?.account_status || u.profile.account_status === "ACTIVE");
    if (subTab === "removed") return bySearch.filter(u => u.profile?.account_status === "DEACTIVATED" || u.profile?.account_status === "SUSPENDED");
    if (subTab === "blocked") return bySearch.filter(u => u.profile?.account_status === "BLOCKED");
    return bySearch;
  }, [enriched, search, subTab]);

  const counts = useMemo(() => ({
    active: enriched.filter(u => !u.profile?.account_status || u.profile.account_status === "ACTIVE").length,
    removed: enriched.filter(u => u.profile?.account_status === "DEACTIVATED" || u.profile?.account_status === "SUSPENDED").length,
    blocked: enriched.filter(u => u.profile?.account_status === "BLOCKED").length,
  }), [enriched]);

  const SUB_TABS = [
    { id: "active",  label: "Active",   color: "#4ade80", count: counts.active },
    { id: "removed", label: "Removed",  color: "#f59e0b", count: counts.removed },
    { id: "blocked", label: "Blocked",  color: "#ef4444", count: counts.blocked },
  ];

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: G.dim }} />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${G.border}` }}
        />
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2">
        {SUB_TABS.map(st => (
          <button key={st.id} onClick={() => setSubTab(st.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: subTab === st.id ? `${st.color}18` : "rgba(255,255,255,0.03)",
              border: `1px solid ${subTab === st.id ? `${st.color}50` : "rgba(255,255,255,0.07)"}`,
              color: subTab === st.id ? st.color : "rgba(255,255,255,0.45)",
            }}>
            {st.label}
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold"
              style={{ background: subTab === st.id ? `${st.color}25` : "rgba(255,255,255,0.06)", color: subTab === st.id ? st.color : "rgba(255,255,255,0.30)" }}>
              {st.count}
            </span>
          </button>
        ))}
      </div>

      {subTab === "blocked" && counts.blocked > 0 && (
        <div className="rounded-xl border p-3 flex items-start gap-2"
          style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.25)" }}>
          <Ban className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
          <p className="text-xs text-red-400/80">
            Blocked users cannot log in, receive OTP, use subscriptions, or access any pages. Unblocking fully restores their account.
          </p>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: "rgba(255,255,255,0.25)" }}>
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No users in this category</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(u => (
            <UserRow key={u.id} u={u} onBlock={u => setBlockTarget(u)} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {blockTarget && (
          <BlockModal
            user={blockTarget}
            profile={profiles.find(p => p.user_id === blockTarget.id)}
            onClose={() => setBlockTarget(null)}
            onDone={onRefresh}
          />
        )}
      </AnimatePresence>
    </div>
  );
}