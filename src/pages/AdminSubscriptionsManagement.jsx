import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, Clock, CheckCircle, XCircle, Search, 
  Loader2, Eye, Trash2, RefreshCw 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";

export default function AdminSubscriptionsManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
      fetchSubscriptions();
    } catch (err) {
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const subs = await base44.entities.Subscription.list();
      setSubscriptions(subs);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load subscriptions",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (subId) => {
    try {
      await base44.entities.Subscription.update(subId, {
        status: "ACTIVE",
        last_modified_by: user.id,
        last_modified_at: new Date().toISOString()
      });
      toast({
        title: "Approved",
        description: "Subscription activated",
      });
      fetchSubscriptions();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (subId) => {
    try {
      await base44.entities.Subscription.update(subId, {
        status: "CANCELLED",
        last_modified_by: user.id,
        last_modified_at: new Date().toISOString()
      });
      toast({
        title: "Rejected",
        description: "Subscription cancelled",
      });
      fetchSubscriptions();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesFilter = filter === "all" || sub.status === filter;
    const matchesSearch = searchQuery === "" || 
      sub.page_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.plan_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      ACTIVE: "bg-green-500/20 text-green-500 border-green-500/30",
      EXPIRED: "bg-red-500/20 text-red-500 border-red-500/30",
      CANCELLED: "bg-gray-500/20 text-gray-500 border-gray-500/30",
    };
    return variants[status] || variants.PENDING;
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
            Subscription Management
          </h1>
          <p className="text-white/70">
            Review and manage user subscriptions
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-white/10 bg-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-white/70 text-sm">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {subscriptions.length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-500/70 text-sm">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">
                {subscriptions.filter(s => s.status === "PENDING").length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-500/70 text-sm">Active</CardTitle>
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
        </div>

        {/* Filters */}
        <Card className="border-white/10 bg-white/5 mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label className="text-white">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <Input
                    placeholder="Search by page or plan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Filter by Status</Label>
                <div className="flex gap-2">
                  {["all", "PENDING", "ACTIVE", "EXPIRED", "CANCELLED"].map((status) => (
                    <Button
                      key={status}
                      variant={filter === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter(status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions List */}
        <div className="space-y-4">
          {filteredSubscriptions.map((sub, idx) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="border-white/10 bg-white/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-bold text-lg">
                          {sub.page_name}
                        </h3>
                        <Badge className={getStatusBadge(sub.status)}>
                          {sub.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-white/60">Plan</p>
                          <p className="text-white font-medium">{sub.plan_name}</p>
                        </div>
                        <div>
                          <p className="text-white/60">User</p>
                          <p className="text-white font-medium">{sub.user_email || sub.user_id}</p>
                        </div>
                        <div>
                          <p className="text-white/60">Start Date</p>
                          <p className="text-white font-medium">
                            {sub.start_date ? new Date(sub.start_date).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60">Expiry</p>
                          <p className="text-white font-medium">
                            {sub.expiry_date ? new Date(sub.expiry_date).toLocaleDateString() : "Lifetime"}
                          </p>
                        </div>
                      </div>
                      {sub.payment_proof_url && (
                        <div className="mt-4">
                          <a
                            href={sub.payment_proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold text-sm hover:underline flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            View Payment Proof
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {sub.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => handleApprove(sub.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(sub.id)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {sub.status === "ACTIVE" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Extend subscription logic here
                            toast({
                              title: "Info",
                              description: "Use extend function to add time",
                            });
                          }}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}