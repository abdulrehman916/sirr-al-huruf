import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, ShieldOff, RefreshCw, Clock, User, Mail, FileText, Calendar } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const G = {
  border: "rgba(212,175,55,0.30)",
  text: "#F5D060",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
};

const STATUS_COLORS = {
  PENDING:  { bg: "rgba(234,179,8,0.12)",  border: "rgba(234,179,8,0.50)",  text: "#eab308" },
  APPROVED: { bg: "rgba(34,197,94,0.10)",  border: "rgba(34,197,94,0.40)",  text: "#22c55e" },
  REJECTED: { bg: "rgba(239,68,68,0.10)",  border: "rgba(239,68,68,0.40)",  text: "#ef4444" },
};

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const APPROVE_DURATIONS = [
  { key: "1_DAY",    label: "1 Day",    days: 1 },
  { key: "1_MONTH",  label: "1 Month",  days: 30 },
  { key: "6_MONTHS", label: "6 Months", days: 180 },
  { key: "1_YEAR",   label: "1 Year",   days: 365 },
  { key: "LIFETIME", label: "Lifetime", days: null },
];

export default function AdminAccessRequests() {
  const { toast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");
  const [processing, setProcessing] = useState(null);
  const [user, setUser] = useState(null);
  const [approvingReq, setApprovingReq] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState("1_MONTH");
  const [rejectingReq, setRejectingReq] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const all = await base44.entities.AccessRequest.list("-requested_at", 500);
      setRequests(all);
    } catch {
      toast({ title: "Error loading requests", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const filtered = requests.filter(r =>
    filter === "ALL" ? true : r.status === filter
  );

  // Step 1: open duration picker
  const handleApprove = (req) => {
    setSelectedDuration("1_MONTH");
    setApprovingReq(req);
  };

  // Step 2: execute approval with chosen duration
  const confirmApprove = async () => {
    const req = approvingReq;
    setApprovingReq(null);
    setProcessing(req.id);
    try {
      const opt = APPROVE_DURATIONS.find(d => d.key === selectedDuration) || APPROVE_DURATIONS[1];
      const now = new Date();
      // null expiry_date = Lifetime (never expires, per BUG-05 fix in checkPageAccess.js)
      const expiryDate = opt.days === null
        ? null
        : new Date(now.getTime() + opt.days * 86400000).toISOString();
      const permCode = req.page_path.replace(/^\//, "").replace(/[\/\-:]/g, "_").toUpperCase() + "_ACCESS";

      await base44.functions.invoke("grantPagePermission", {
        user_id: req.user_id,
        page_path: req.page_path,
        page_name: req.page_name,
        permission_code: permCode,
        start_date: now.toISOString(),
        expiry_date: expiryDate,
      });

      // Mark request as APPROVED
      await base44.entities.AccessRequest.update(req.id, {
        status: "APPROVED",
        approved_by: user?.id || "admin",
        approved_at: new Date().toISOString(),
      });

      toast({ title: "✅ Access Granted", description: `${req.name} can now access ${req.page_name}` });
      loadRequests();
    } catch (e) {
      toast({ title: "Error", description: e.message || "Failed to grant access", variant: "destructive" });
    } finally {
      setProcessing(null);
    }
  };

  // Legacy inline handler still used for keyboard dismiss
  const cancelApprove = () => setApprovingReq(null);

  const handleReject = (req) => {
    setRejectReason("");
    setRejectingReq(req);
  };

  const confirmReject = async () => {
    const req = rejectingReq;
    setRejectingReq(null);
    setProcessing(req.id);
    try {
      await base44.entities.AccessRequest.update(req.id, {
        status: "REJECTED",
        approved_by: user?.id || "admin",
        approved_at: new Date().toISOString(),
        rejection_reason: rejectReason.trim() || "No reason provided",
      });
      toast({ title: "Request Rejected", description: `${req.name}'s request has been rejected.` });
      loadRequests();
    } catch (e) {
      toast({ title: "Error", description: e.message || "Failed to reject", variant: "destructive" });
    } finally {
      setProcessing(null);
    }
  };

  const cancelReject = () => setRejectingReq(null);

  const handleRevoke = async (req) => {
    setProcessing(req.id);
    try {
      // Find the active permission
      const perms = await base44.entities.PagePermission.filter({
        user_id: req.user_id,
        page_path: req.page_path,
        is_active: true,
        is_revoked: false,
      }, null, 10);

      if (perms.length > 0) {
        await base44.functions.invoke("revokePagePermission", {
          permission_id: perms[0].permission_id || perms[0].id,
          reason: "Revoked by admin from access requests panel",
        });
      }

      await base44.entities.AccessRequest.update(req.id, {
        status: "REJECTED",
        approved_by: user?.id || "admin",
        approved_at: new Date().toISOString(),
      });

      toast({ title: "Access Revoked", description: `${req.name}'s access has been revoked.` });
      loadRequests();
    } catch (e) {
      toast({ title: "Error", description: e.message || "Failed to revoke", variant: "destructive" });
    } finally {
      setProcessing(null);
    }
  };

  const TABS = ["PENDING", "APPROVED", "REJECTED", "ALL"];
  const COUNTS = {
    PENDING: requests.filter(r => r.status === "PENDING").length,
    APPROVED: requests.filter(r => r.status === "APPROVED").length,
    REJECTED: requests.filter(r => r.status === "REJECTED").length,
    ALL: requests.length,
  };

  return (
    <AdminLayout title="Payment Requests" subtitle="Approve, reject, or revoke user access requests">
      <div className="max-w-4xl mx-auto space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-amiri text-2xl font-bold" style={{ color: G.text }}>
              WhatsApp Access Requests
            </h1>
            <p className="font-inter text-xs text-white/50 mt-0.5">
              Approve, reject, or revoke user access requests
            </p>
          </div>
          <button
            onClick={loadRequests}
            disabled={loading}
            className="p-2 rounded-xl"
            style={{ border: `1px solid ${G.border}`, background: G.bg, color: G.text }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="px-4 py-1.5 rounded-xl font-inter text-xs font-bold transition-all"
              style={{
                background: filter === tab ? G.bgHi : G.bg,
                border: `1px solid ${filter === tab ? "rgba(212,175,55,0.60)" : G.border}`,
                color: filter === tab ? G.text : "rgba(255,255,255,0.50)",
              }}
            >
              {tab} {COUNTS[tab] > 0 && <span className="ml-1 opacity-70">({COUNTS[tab]})</span>}
            </button>
          ))}
        </div>

        {/* Request List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-t-yellow-400 border-r-transparent border-b-yellow-400 border-l-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border p-10 text-center" style={{ background: G.bg, borderColor: G.border }}>
            <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: G.text }} />
            <p className="font-inter text-sm text-white/40">No {filter.toLowerCase()} requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(req => {
              const sc = STATUS_COLORS[req.status] || STATUS_COLORS.PENDING;
              const isProcessing = processing === req.id;
              return (
                <div
                  key={req.id}
                  className="rounded-2xl border p-5"
                  style={{ background: G.bg, borderColor: G.border }}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    {/* Info */}
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="px-2 py-0.5 rounded-full font-inter text-[10px] font-bold uppercase tracking-wider"
                          style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}
                        >
                          {req.status}
                        </span>
                        <span className="font-inter text-[10px] text-white/40">{req.request_id}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: G.text }}>
                        <User className="w-3.5 h-3.5 flex-shrink-0" />
                        {req.name || "Unknown"}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-white/60">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        {req.email || "—"}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-white/60">
                        <FileText className="w-3 h-3 flex-shrink-0" />
                        {req.page_name || req.page_path}
                        <span className="text-white/30">·</span>
                        <span className="text-white/40 font-mono">{req.page_path}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-white/40">
                         <Calendar className="w-3 h-3 flex-shrink-0" />
                         {fmtDate(req.requested_at || req.created_date)}
                       </div>
                       {req.message && (
                         <div className="rounded-lg p-2 mt-1" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                           <p className="font-inter text-[9px] text-white/30 uppercase tracking-wider mb-0.5">Request Details</p>
                           <p className="font-inter text-xs text-white/55">{req.message}</p>
                         </div>
                       )}
                       {req.status === "REJECTED" && req.rejection_reason && (
                         <div className="rounded-lg p-2 mt-1" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.20)" }}>
                           <p className="font-inter text-[9px] text-red-400/60 uppercase tracking-wider mb-0.5">Rejection Reason</p>
                           <p className="font-inter text-xs text-red-300/80">{req.rejection_reason}</p>
                         </div>
                       )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {req.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApprove(req)}
                            disabled={isProcessing}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-inter text-xs font-bold transition-all"
                            style={{
                              background: "rgba(34,197,94,0.15)",
                              border: "1px solid rgba(34,197,94,0.45)",
                              color: "#22c55e",
                              opacity: isProcessing ? 0.6 : 1,
                            }}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            {isProcessing ? "Granting…" : "Approve"}
                          </button>
                          <button
                            onClick={() => handleReject(req)}
                            disabled={isProcessing}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-inter text-xs font-bold transition-all"
                            style={{
                              background: "rgba(239,68,68,0.10)",
                              border: "1px solid rgba(239,68,68,0.40)",
                              color: "#ef4444",
                              opacity: isProcessing ? 0.6 : 1,
                            }}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            {isProcessing ? "..." : "Reject"}
                          </button>
                        </>
                      )}
                      {req.status === "APPROVED" && req.user_id && (
                        <button
                          onClick={() => handleRevoke(req)}
                          disabled={isProcessing}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-inter text-xs font-bold transition-all"
                          style={{
                            background: "rgba(239,68,68,0.10)",
                            border: "1px solid rgba(239,68,68,0.40)",
                            color: "#ef4444",
                            opacity: isProcessing ? 0.6 : 1,
                          }}
                        >
                          <ShieldOff className="w-3.5 h-3.5" />
                          {isProcessing ? "..." : "Revoke"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Duration picker modal */}
      {approvingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={cancelApprove}>
          <div className="w-full max-w-sm rounded-2xl p-6 space-y-4"
            style={{ background: "linear-gradient(145deg,#0c1630,#060c1c)", border: "1px solid rgba(212,175,55,0.50)" }}
            onClick={e => e.stopPropagation()}>
            <div>
              <h3 className="font-inter font-bold text-white text-sm">Select Access Duration</h3>
              <p className="text-xs text-white/40 mt-0.5">{approvingReq.name} · {approvingReq.page_name}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {APPROVE_DURATIONS.map(opt => (
                <button key={opt.key} onClick={() => setSelectedDuration(opt.key)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{
                    background: selectedDuration === opt.key ? "rgba(212,175,55,0.20)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${selectedDuration === opt.key ? "rgba(212,175,55,0.60)" : "rgba(255,255,255,0.10)"}`,
                    color: selectedDuration === opt.key ? "#F5D060" : "rgba(255,255,255,0.50)",
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={cancelApprove}
                className="flex-1 py-2.5 rounded-xl font-inter font-semibold text-sm"
                style={{ background: "transparent", border: "1px solid rgba(212,175,55,0.35)", color: "#F5D060" }}>
                Cancel
              </button>
              <button onClick={confirmApprove}
                className="flex-1 py-2.5 rounded-xl font-inter font-bold text-sm"
                style={{ background: "linear-gradient(135deg,#f6d860,#c98a14)", color: "#0d1b2a" }}>
                Grant Access
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection reason modal */}
      {rejectingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={cancelReject}>
          <div className="w-full max-w-sm rounded-2xl p-6 space-y-4"
            style={{ background: "linear-gradient(145deg,#0c1630,#060c1c)", border: "1px solid rgba(239,68,68,0.50)" }}
            onClick={e => e.stopPropagation()}>
            <div>
              <h3 className="font-inter font-bold text-white text-sm">Reject Request</h3>
              <p className="text-xs text-white/40 mt-0.5">{rejectingReq.name} · {rejectingReq.page_name}</p>
            </div>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason (will be visible to the user)..."
              className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none resize-none min-h-[80px]"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(239,68,68,0.30)" }}
              autoFocus
            />
            <div className="flex gap-3 pt-1">
              <button onClick={cancelReject}
                className="flex-1 py-2.5 rounded-xl font-inter font-semibold text-sm"
                style={{ background: "transparent", border: "1px solid rgba(212,175,55,0.35)", color: "#F5D060" }}>
                Cancel
              </button>
              <button onClick={confirmReject}
                className="flex-1 py-2.5 rounded-xl font-inter font-bold text-sm"
                style={{ background: "linear-gradient(135deg,#ef4444,#b91c1c)", color: "#fff" }}>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}