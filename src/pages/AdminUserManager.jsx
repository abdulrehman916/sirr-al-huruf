import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, Search, Clock, CheckCircle, XCircle, RefreshCw, 
  Loader2, Shield, Calendar, Phone, Mail
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";

export default function AdminUserManager() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await base44.auth.me();
      if (!currentUser || currentUser.role !== "admin") {
        toast({
          title: "Access Denied",
          description: "Admin access required",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      setUser(currentUser);
      fetchData();
    } catch (err) {
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [userProfiles, subs] = await Promise.all([
        base44.entities.UserAccessProfile.list(),
        base44.entities.Subscription.list()
      ]);
      setUsers(userProfiles);
      setSubscriptions(subs);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    }
  };

  const handleExtendSubscription = async (subId, days) => {
    try {
      const sub = subscriptions.find(s => s.id === subId);
      if (!sub) return;

      const currentExpiry = sub.expiry_date ? new Date(sub.expiry_date) : new Date();
      const newExpiry = new Date(currentExpiry.getTime() + (days * 24 * 60 * 60 * 1000));

      await base44.entities.Subscription.update(subId, {
        expiry_date: newExpiry.toISOString(),
        status: "ACTIVE",
        last_modified_by: user.id,
        last_modified_at: new Date().toISOString()
      });

      toast({
        title: "Extended",
        description: `Subscription extended by ${days} days`,
      });
      fetchData();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleRevokeSubscription = async (subId) => {
    try {
      await base44.entities.Subscription.update(subId, {
        status: "CANCELLED",
        last_modified_by: user.id,
        last_modified_at: new Date().toISOString()
      });

      toast({
        title: "Revoked",
        description: "Subscription access revoked",
      });
      fetchData();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = searchQuery === "" || 
      u.mobile?.includes(searchQuery) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getUserSubscriptions = (userId) => {
    return subscriptions.filter(s => s.user_id === userId);
  };

  const getStatusBadge = (status) => {
    const variants = {
      ACTIVE: "bg-green-500/20 text-green-500 border-green-500/30",
      EXPIRED: "bg-red-500/20 text-red-500 border-red-500/30",
      CANCELLED: "bg-gray-500/20 text-gray-500 border-gray-500/30",
    };
    return variants[status] || variants.ACTIVE;
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            User & Subscription Manager
          </h1>
          <p className="text-white/70">
            Manage users, view subscriptions, extend or revoke access
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-white/10 bg-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-white/70 text-sm">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{users.length}</div>
            </CardContent>
          </Card>
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-500/70 text-sm">Active Subs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {subscriptions.filter(s => s.status === "ACTIVE").length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-red-500/70 text-sm">Expired</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">
                {subscriptions.filter(s => s.status === "EXPIRED").length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-500/70 text-sm">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">
                ₹{subscriptions.filter(s => s.status === "ACTIVE").length * 500}+
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-white/10 bg-white/5 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-white/50" />
              <Input
                placeholder="Search by phone number or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((u, idx) => {
            const userSubs = getUserSubscriptions(u.user_id);
            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="w-5 h-5 text-gold" />
                          <h3 className="text-white font-bold text-lg">
                            {u.email || "User"}
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-white/80">
                            <Phone className="w-4 h-4" />
                            {u.mobile || "N/A"}
                          </div>
                          <div className="flex items-center gap-2 text-white/80">
                            <Mail className="w-4 h-4" />
                            {u.email || "N/A"}
                          </div>
                          <div className="flex items-center gap-2 text-white/80">
                            <Calendar className="w-4 h-4" />
                            Joined: {new Date(u.registration_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-white/80">
                            <CheckCircle className="w-4 h-4" />
                            Status: {u.account_status}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User's Subscriptions */}
                    {userSubs.length > 0 && (
                      <div className="border-t border-white/10 pt-4 mt-4">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-gold" />
                          Subscriptions
                        </h4>
                        <div className="space-y-2">
                          {userSubs.map(sub => (
                            <div 
                              key={sub.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-white font-medium">{sub.page_name}</span>
                                  <Badge className={getStatusBadge(sub.status)}>
                                    {sub.status}
                                  </Badge>
                                </div>
                                <div className="text-xs text-white/60">
                                  Plan: {sub.plan_name} • 
                                  Expires: {sub.expiry_date ? new Date(sub.expiry_date).toLocaleDateString() : "Lifetime"}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {sub.status === "ACTIVE" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleExtendSubscription(sub.id, 30)}
                                    >
                                      <RefreshCw className="w-3 h-3" />
                                      +30d
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleRevokeSubscription(sub.id)}
                                    >
                                      <XCircle className="w-3 h-3" />
                                      Revoke
                                    </Button>
                                  </>
                                )}
                                {sub.status === "EXPIRED" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleExtendSubscription(sub.id, 30)}
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    Reactivate
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}