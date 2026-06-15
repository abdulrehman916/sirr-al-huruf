import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Users, Calendar, Clock, CheckCircle, XCircle, Shield, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageLayout from "@/components/PageLayout";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)"
};

export default function AdminPageSubscriptions() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
        return;
      }
      setIsAdmin(true);
      await loadData();
    } catch (error) {
      setIsAdmin(false);
      toast({
        title: "Authentication Error",
        description: "Please log in to continue",
        variant: "destructive"
      });
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [allSubs, allUsers] = await Promise.all([
        base44.entities.Subscription.list('-start_date', 500),
        base44.entities.User.list(null, 500)
      ]);
      setSubscriptions(allSubs);
      setUsers(allUsers);
    } catch (error) {
      toast({
        title: "Error Loading Data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserById = (userId) => {
    return users.find(u => u.id === userId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false; // Lifetime
    return new Date(expiryDate) < new Date();
  };

  const getStatusBadge = (sub) => {
    if (sub.status === 'CANCELLED') {
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/50 border">Cancelled</Badge>;
    }
    if (isExpired(sub.expiry_date)) {
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 border">Expired</Badge>;
    }
    return <Badge className="bg-green-500/20 text-green-400 border-green-500/50 border">Active</Badge>;
  };

  const getPlanBadge = (planName) => {
    const colors = {
      'TRIAL': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      '30_DAY': 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      '60_DAY': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50',
      '90_DAY': 'bg-pink-500/20 text-pink-400 border-pink-500/50',
      'LIFETIME': 'bg-gold/20 text-gold border-gold/50'
    };
    return (
      <Badge className={`${colors[planName] || 'bg-gray-500/20 text-gray-400 border-gray-500/50'} border`}>
        {planName.replace('_', ' ')}
      </Badge>
    );
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (!searchTerm) return true;
    const user = getUserById(sub.user_id);
    const searchLower = searchTerm.toLowerCase();
    return (
      sub.page_name?.toLowerCase().includes(searchLower) ||
      sub.plan_name?.toLowerCase().includes(searchLower) ||
      user?.full_name?.toLowerCase().includes(searchLower) ||
      user?.email?.toLowerCase().includes(searchLower)
    );
  });

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'ACTIVE' && !isExpired(s.expiry_date)).length,
    expired: subscriptions.filter(s => isExpired(s.expiry_date)).length,
    lifetime: subscriptions.filter(s => s.plan_name === 'LIFETIME').length
  };

  if (isAdmin === false) {
    return <Navigate to="/" replace />;
  }

  if (isAdmin === null || loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-gold border-r-transparent border-b-gold border-l-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading subscriptions...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageTitle 
        title="Page Subscriptions" 
        subtitle="Manage User Subscriptions"
        icon={<Calendar className="w-6 h-6" style={{ color: G.text }} />}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0" style={{ background: G.bg }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70 mb-1">Total</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <Calendar className="w-8 h-8 text-white/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0" style={{ background: G.bg }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70 mb-1">Active</p>
                  <p className="text-2xl font-bold text-white">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-white/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0" style={{ background: G.bg }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70 mb-1">Expired</p>
                  <p className="text-2xl font-bold text-white">{stats.expired}</p>
                </div>
                <Clock className="w-8 h-8 text-white/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0" style={{ background: G.bg }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70 mb-1">Lifetime</p>
                  <p className="text-2xl font-bold text-white">{stats.lifetime}</p>
                </div>
                <Shield className="w-8 h-8 text-white/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search by user, page, or plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* Subscriptions List */}
        <div className="space-y-3">
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: G.dim }} />
              <p className="text-white/60">No subscriptions found</p>
            </div>
          ) : (
            filteredSubscriptions.map(sub => {
              const user = getUserById(sub.user_id);
              return (
                <Card key={sub.subscription_id} className="border-0" style={{ background: G.bg }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-white">
                            {user?.full_name || 'Unknown User'}
                          </h3>
                          {getStatusBadge(sub)}
                        </div>
                        <p className="text-sm text-white/60 mb-3">{user?.email}</p>
                        
                        <div className="flex items-center gap-4 flex-wrap">
                          <div>
                            <p className="text-xs text-white/50 mb-1">Page</p>
                            <p className="text-sm text-white font-semibold">{sub.page_name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/50 mb-1">Plan</p>
                            {getPlanBadge(sub.plan_name)}
                          </div>
                          <div>
                            <p className="text-xs text-white/50 mb-1">Start Date</p>
                            <p className="text-sm text-white">{formatDate(sub.start_date)}</p>
                          </div>
                          {sub.expiry_date && (
                            <div>
                              <p className="text-xs text-white/50 mb-1">Expires</p>
                              <p className="text-sm text-white">{formatDate(sub.expiry_date)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </motion.div>
    </PageLayout>
  );
}