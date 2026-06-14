import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Search, Filter, Mail, Phone, User, Calendar, CheckCircle, Clock, AlertCircle, XCircle, ShieldAlert } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageLayout from "@/components/PageLayout";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const STATUS_CONFIG = {
  OPEN: { color: "bg-blue-500/20 text-blue-400 border-blue-500/50", icon: Clock, label: "Open" },
  IN_PROGRESS: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50", icon: AlertCircle, label: "In Progress" },
  RESOLVED: { color: "bg-green-500/20 text-green-400 border-green-500/50", icon: CheckCircle, label: "Resolved" },
  CLOSED: { color: "bg-gray-500/20 text-gray-400 border-gray-500/50", icon: XCircle, label: "Closed" }
};

const CATEGORY_ICONS = {
  "Bug Report": "🐛",
  "Feature Request": "✨",
  "Content Correction": "📝",
  "Access Problem": "🔒",
  "General Question": "❓"
};

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  faint: "rgba(212,175,55,0.22)",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)"
};

export default function AdminSupport() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const user = await base44.auth.me();
      if (!user || user.role !== 'admin') {
        setIsAdmin(false);
        toast({
          title: "Access Denied",
          description: "Only administrators can access this page",
          variant: "destructive"
        });
      } else {
        setIsAdmin(true);
        loadTickets();
      }
    } catch (error) {
      setIsAdmin(false);
      toast({
        title: "Authentication Error",
        description: "Please log in to continue",
        variant: "destructive"
      });
    }
  };

  const loadTickets = async () => {
    setLoading(true);
    try {
      const allTickets = await base44.entities.SupportTickets.list('-created_at');
      setTickets(allTickets);
    } catch (error) {
      toast({
        title: "Error Loading Tickets",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStatusChange = async (ticketId, newStatus) => {
    setUpdatingStatus(true);
    try {
      await base44.entities.SupportTickets.update(ticketId, { status: newStatus });
      await loadTickets();
      toast({
        title: "Status Updated",
        description: `Ticket status changed to ${newStatus}`
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim() || !selectedTicket) return;

    setSubmittingReply(true);
    try {
      await base44.entities.SupportTickets.update(selectedTicket.id, {
        admin_reply: replyText,
        status: selectedTicket.status === "OPEN" ? "IN_PROGRESS" : selectedTicket.status
      });
      toast({
        title: "Reply Saved",
        description: "Admin reply has been saved to the ticket."
      });
      setReplyText("");
      await loadTickets();
    } catch (error) {
      toast({
        title: "Reply Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmittingReply(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.OPEN;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} border font-semibold`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  // Redirect non-admin users to home page
  if (isAdmin === false) {
    return <Navigate to="/" replace />;
  }

  // Show loading state while checking admin access
  if (isAdmin === null) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-gold border-r-transparent border-b-gold border-l-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Verifying access...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageTitle 
        title="Support Tickets" 
        subtitle="Customer Service Administration"
        icon={<Mail className="w-6 h-6" style={{ color: G.text }} />}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(STATUS_CONFIG).map(([status, config]) => {
            const count = tickets.filter(t => t.status === status).length;
            const Icon = config.icon;
            return (
              <Card key={status} className="border-0" style={{ background: config.color, borderColor: config.color.split(' ')[2] }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/70 mb-1">{config.label}</p>
                      <p className="text-2xl font-bold text-white">{count}</p>
                    </div>
                    <Icon className="w-8 h-8 text-white/50" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="border-0" style={{ background: G.bg }}>
          <CardContent className="p-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: G.dim }} />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.keys(STATUS_CONFIG).map(status => (
                    <SelectItem key={status} value={status}>{STATUS_CONFIG[status].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.keys(CATEGORY_ICONS).map(cat => (
                    <SelectItem key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-t-gold border-r-transparent border-b-gold border-l-transparent rounded-full animate-spin mx-auto" />
            <p className="text-white/60 mt-4">Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 mx-auto mb-4" style={{ color: G.dim }} />
            <p className="text-white/60">No tickets found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="border-0" style={{ background: G.bg }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono font-bold text-white">{ticket.ticket_id}</span>
                        {getStatusBadge(ticket.status)}
                        <Badge variant="outline" className="border-white/20 text-white/70">
                          {CATEGORY_ICONS[ticket.category]} {ticket.category}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-white mb-1">{ticket.subject}</h3>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {ticket.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {ticket.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gold text-gold hover:bg-gold/10"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">
                            {ticket.ticket_id} - {ticket.subject}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-white/70">Status</Label>
                              <div className="mt-2">
                                {getStatusBadge(ticket.status)}
                              </div>
                            </div>
                            <div>
                              <Label className="text-white/70">Change Status</Label>
                              <Select 
                                value={ticket.status} 
                                onValueChange={(value) => handleStatusChange(ticket.id, value)}
                                disabled={updatingStatus}
                              >
                                <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.keys(STATUS_CONFIG).map(status => (
                                    <SelectItem key={status} value={status}>{STATUS_CONFIG[status].label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label className="text-white/70">Customer Information</Label>
                            <div className="mt-2 p-3 rounded-lg bg-white/5 space-y-2">
                              <p className="text-white"><strong>Name:</strong> {ticket.name}</p>
                              <p className="text-white"><strong>Email:</strong> {ticket.email}</p>
                              <p className="text-white"><strong>Mobile:</strong> {ticket.mobile}</p>
                              <p className="text-white"><strong>Category:</strong> {ticket.category}</p>
                            </div>
                          </div>

                          <div>
                            <Label className="text-white/70">Message</Label>
                            <div className="mt-2 p-3 rounded-lg bg-white/5">
                              <p className="text-white whitespace-pre-wrap">{ticket.message}</p>
                            </div>
                          </div>

                          {ticket.attachment_url && (
                            <div>
                              <Label className="text-white/70">Attachment</Label>
                              <div className="mt-2">
                                <a 
                                  href={ticket.attachment_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-gold hover:underline"
                                >
                                  View Attachment
                                </a>
                              </div>
                            </div>
                          )}

                          <div>
                            <Label className="text-white/70">Admin Reply</Label>
                            <Textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your reply here..."
                              className="mt-2 bg-white/5 border-white/10 text-white min-h-[100px]"
                            />
                            <Button
                              onClick={handleReplySubmit}
                              disabled={submittingReply || !replyText.trim()}
                              className="mt-2 btn-gold"
                            >
                              {submittingReply ? "Saving..." : "Save Reply"}
                            </Button>
                          </div>

                          {ticket.admin_reply && (
                            <div>
                              <Label className="text-white/70">Previous Reply</Label>
                              <div className="mt-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                                <p className="text-white whitespace-pre-wrap">{ticket.admin_reply}</p>
                              </div>
                            </div>
                          )}

                          <div>
                            <Label className="text-white/70">Created</Label>
                            <p className="text-white mt-1">{new Date(ticket.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </PageLayout>
  );
}