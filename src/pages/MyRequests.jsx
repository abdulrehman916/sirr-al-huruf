/**
 * MyRequests — User inbox page showing all access requests and conversations.
 * Public route — uses session_id (localStorage) to identify the user.
 */
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { getSessionId } from "@/lib/sessionId";
import { Inbox, RefreshCw, ChevronLeft, Send, Loader2, AlertCircle, KeyRound } from "lucide-react";
import RequestConversation from "@/components/RequestConversation";

const G = {
  border: "rgba(212,175,55,0.30)",
  text: "#F5D060",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
};

const STATUS_COLORS = {
  PENDING: "#eab308",
  AWAITING_PAYMENT: "#f97316",
  PAYMENT_CONFIRMED: "#22c55e",
  CODE_UPDATED: "#3b82f6",
  APPROVED: "#22c55e",
  REJECTED: "#ef4444",
};

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [error, setError] = useState(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke("getUserRequests", {
        session_id: getSessionId(),
      });
      if (res.data?.success) {
        setRequests(res.data.requests || []);
      } else {
        setError(res.data?.error || "Failed to load requests");
      }
    } catch (e) {
      setError(e.message || "Failed to load requests");
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const handleReply = async (requestId) => {
    if (!replyText.trim()) return;
    setReplying(true);
    try {
      await base44.functions.invoke("replyToAccessRequest", {
        request_id: requestId,
        session_id: getSessionId(),
        message: replyText.trim(),
      });
      setReplyText("");
      await loadRequests();
    } catch (e) {
      setError(e.message);
    }
    setReplying(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "#020710" }}>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-inter text-xs font-semibold"
              style={{ background: G.bg, border: `1px solid ${G.border}`, color: G.text }}>
              <ChevronLeft className="w-4 h-4" />
              Home
            </Link>
            <h1 className="font-amiri text-2xl font-bold" style={{ color: G.text }}>
              My Requests
            </h1>
          </div>
          <button onClick={loadRequests} disabled={loading}
            className="p-2 rounded-xl" style={{ border: `1px solid ${G.border}`, background: G.bg, color: G.text }}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {error && (
          <div className="rounded-xl border p-3 flex items-center gap-2"
            style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.35)" }}>
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: G.text }} />
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border p-10 text-center" style={{ background: G.bg, borderColor: G.border }}>
            <Inbox className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: G.text }} />
            <p className="font-inter text-sm text-white/40 mb-2">No requests yet</p>
            <p className="font-inter text-xs text-white/30">
              When you request access to a premium feature, your requests and conversations will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map(req => {
              const isExpanded = expandedId === req.request_id;
              const sc = STATUS_COLORS[req.status] || STATUS_COLORS.PENDING;
              const lastMsg = req.messages?.[req.messages.length - 1];
              return (
                <div key={req.request_id} className="rounded-2xl border overflow-hidden"
                  style={{ background: G.bg, borderColor: G.border }}>
                  {/* Request summary — clickable */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : req.request_id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: `${sc}20`, border: `1px solid ${sc}60`, color: sc }}>
                        {req.status.replace(/_/g, " ")}
                      </span>
                      <span className="font-mono text-[10px] text-white/40">{req.request_id}</span>
                    </div>
                    <p className="font-inter text-sm font-semibold text-white/80 mb-1">{req.page_name}</p>
                    <div className="flex items-center gap-2 text-xs text-white/40 flex-wrap">
                      {req.plan_name && <span style={{ color: G.text }}>{req.plan_name}</span>}
                      {req.price && <span>· {req.currency} {req.price}</span>}
                      <span>· {fmtDate(req.requested_at)}</span>
                    </div>
                    {lastMsg && (
                      <p className="text-xs text-white/50 mt-2 truncate">
                        <span className="text-white/30">{lastMsg.sender_type === "ADMIN" ? "Admin: " : "You: "}</span>
                        {lastMsg.message}
                      </p>
                    )}
                  </button>

                  {/* Expanded conversation + reply */}
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: G.border }}>
                      <div className="pt-3">
                        <p className="font-inter text-[10px] text-white/30 uppercase tracking-wider mb-2">Conversation</p>
                        <RequestConversation messages={req.messages || []} />
                      </div>

                      {/* Reply box */}
                      <div className="flex gap-2 items-end">
                        <textarea
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Type your reply..."
                          rows={1}
                          className="flex-1 px-3 py-2 rounded-xl text-sm text-white outline-none placeholder-white/20 resize-none"
                          style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}`, fontSize: "16px" }}
                        />
                        <button
                          onClick={() => handleReply(req.request_id)}
                          disabled={replying || !replyText.trim()}
                          className="p-2.5 rounded-xl disabled:opacity-50"
                          style={{ background: "linear-gradient(135deg, #f6d860 0%, #c98a14 100%)", color: "#0d1b2a" }}
                        >
                          {replying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Redeem code prompt if CODE_UPDATED */}
                      {req.status === "CODE_UPDATED" && (
                        <div className="rounded-xl border p-3 flex items-center gap-2"
                          style={{ background: "rgba(59,130,246,0.08)", borderColor: "rgba(59,130,246,0.35)" }}>
                          <KeyRound className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <p className="text-xs text-blue-300">
                            Your Reading Code has been updated. Please redeem it again to unlock this feature.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}