import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Search, Clock, X, Send } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const G = {
  border: "rgba(212,175,55,0.35)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

const STATUS_COLORS = {
  OPEN: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  IN_PROGRESS: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  RESOLVED: "bg-green-500/20 text-green-400 border-green-500/40",
  CLOSED: "bg-gray-500/20 text-gray-400 border-gray-500/40"
};

export default function MessagesTab() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const allTickets = await base44.entities.SupportTickets.list("-created_at");
      setTickets(allTickets);
      
      const messagesMap = {};
      for (const ticket of allTickets) {
        const ticketMessages = await base44.entities.SupportMessage.filter({ ticket_id: ticket.ticket_id }, "created_at");
        messagesMap[ticket.ticket_id] = ticketMessages || [];
      }
      setMessages(messagesMap);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!replyText.trim() || !selectedTicket) return;

    setSending(true);
    try {
      await base44.functions.invoke("createSupportMessage", {
        ticket_id: selectedTicket.ticket_id,
        message: replyText,
        sender_type: "ADMIN"
      });
      
      toast({ title: "✓ Message sent" });
      setReplyText("");
      await loadTickets();
    } catch (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("en-GB", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map(status => {
          const count = tickets.filter(t => t.status === status).length;
          return (
            <div key={status} className="rounded-xl border p-3 text-center" style={{ background: G.bg, borderColor: G.border }}>
              <p className={`text-lg font-bold ${STATUS_COLORS[status].split(" ")[1]}`}>{count}</p>
              <p className="text-xs text-white/40 mt-0.5">{status.replace("_", " ")}</p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: G.dim }} />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tickets..."
          className="pl-10 bg-white/5 border-white/10 text-white"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-t-gold border-r-transparent border-b-gold border-l-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center py-12" style={{ color: "rgba(255,255,255,0.25)" }}>
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No tickets found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTickets.map(ticket => (
            <div key={ticket.id} className="rounded-xl border p-4" style={{ background: G.bg, borderColor: G.border }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${STATUS_COLORS[ticket.status]} border text-xs font-semibold`}>
                      {ticket.status.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-white/40 font-mono">{ticket.ticket_id}</span>
                  </div>
                  <p className="font-inter font-bold text-white text-sm">{ticket.subject}</p>
                  <p className="text-xs text-white/40 mt-0.5">{ticket.name} · {ticket.email}</p>
                  <p className="text-xs text-white/30 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(ticket.created_at)}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gold text-gold hover:bg-gold/10"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  View Chat
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }} onClick={() => setSelectedTicket(null)}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-2xl rounded-2xl p-6 flex flex-col max-h-[80vh]"
              style={{ background: "linear-gradient(145deg,#0c1630,#060c1c)", border: `1px solid ${G.borderHi}` }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
              <div>
              <h3 className="font-inter font-bold text-white text-base">{selectedTicket.subject}</h3>
              <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1">
                <span>{selectedTicket.name} · {selectedTicket.email}</span>
                <span className="text-gold">· 🛡️ Sirr al-Huruf Support</span>
              </p>
              </div>
                <button onClick={() => setSelectedTicket(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10" style={{ color: "rgba(255,255,255,0.40)" }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2" style={{ background: "rgba(0,0,0,0.20)", borderRadius: "0.5rem" }}>
                {(messages[selectedTicket.ticket_id] || []).map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender_type === "ADMIN" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender_type === "ADMIN" ? "bg-gold/20 border border-gold/30" : "bg-white/5 border border-white/10"}`}>
                      <p className="text-xs text-white/40 mb-1 flex items-center gap-1">
                        {msg.sender_type === "ADMIN" ? (
                          <>
                            <span className="text-gold font-semibold">🛡️ {msg.sender_name}</span>
                            <span>· {formatTime(msg.created_at)}</span>
                          </>
                        ) : (
                          <>{msg.sender_name} · {formatTime(msg.created_at)}</>
                        )}
                      </p>
                      <p className="text-white text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
                {(!messages[selectedTicket.ticket_id] || messages[selectedTicket.ticket_id].length === 0) && (
                  <p className="text-center text-white/30 text-sm py-8">No messages yet. Start the conversation.</p>
                )}
              </div>

              {/* Reply Input */}
              <div className="flex gap-2">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 bg-white/5 border-white/10 text-white min-h-[60px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={sending || !replyText.trim()}
                  className="btn-gold px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}