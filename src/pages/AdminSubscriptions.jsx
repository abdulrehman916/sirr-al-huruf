import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { CreditCard, Users, Calendar, Clock, CheckCircle, XCircle, Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageLayout from "@/components/PageLayout";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

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

const PLAN_OPTIONS = [
  { value: "TRIAL", label: "Trial (7 days)", days: 7 },
  { value: "30_DAY", label: "30 Days", days: 30 },
  { value: "60_DAY", label: "60 Days", days: 60 },
  { value: "90_DAY", label: "90 Days", days: 90 },
  { value: "LIFETIME", label: "Lifetime", days: null }
];

export default function AdminSubscriptions() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grantDialogOpen, setGrantDialogOpen] = useState(false);
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [grantForm, setGrantForm] = useState({
    user_id: "",
    plan_name: "TRIAL",
    notes: ""
  });
  const [modifyForm, setModifyForm] = useState({
    days_to_add: ""
  });
  const [processing, setProcessing] = useState(false);

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
      const [allUsers, allSubscriptions] = await Promise.all([
        base44.entities.User.list(),
        base44.entities.Subscription.list()
      ]);
      setUsers(allUsers);
      setSubscriptions(allSubscriptions);
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

  const handleGrantSubscription = async () => {
    if (!grantForm.user_id || !grantForm.plan_name) {
      toast({
        title: "Missing Information",
        description: "Please select user and plan",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      await base44.functions.invoke("createSubscription", {
        user_id: grantForm.user_id,
        plan_name: grantForm.plan_name,
        notes: grantForm.notes
      });

      toast({
        title: "Subscription Granted",
        description: "Access granted successfully"
      });

      setGrantDialogOpen(false);
      setGrantForm({ user_id: "", plan_name: "TRIAL", notes: "" });
      await loadData();
    } catch (error) {
      toast({
        title: "Grant Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleModifySubscription = async () => {
    if (!selectedSubscription || !modifyForm.days_to_add) {
      toast({
        title: "Missing Information",
        description: "Please enter days to add/remove",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      const days = parseInt(modifyForm.days_to_add);
      await base44.functions.invoke("modifySubscription", {
        subscription_id: selectedSubscription.subscription_id,
        days_to_add: days
      });

      toast({
        title: "Subscription Modified",
        description: `Subscription ${days > 0 ? 'extended' : 'reduced'} by ${Math.abs(days)} days`
      });

      setModifyDialogOpen(false);
      setModifyForm({ days_to_add: "" });
      setSelectedSubscription(null);
      await loadData();
    } catch (error) {
      toast({
        title: "Modification Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelSubscription = async (subscription) => {
    if (!confirm(`Cancel subscription for ${subscription.plan_name}?`)) return;

    setProcessing(true);
    try {
      await base44.functions.invoke("modifySubscription", {
        subscription_id: subscription.subscription_id,
        days_to_add: 0,
        action: "cancel"
      });

      toast({
        title: "Subscription Cancelled",
        description: "Access has been revoked"
      });

      await loadData();
    } catch (error) {
      toast({
        title: "Cancel Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
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

  const getRemainingDays = (subscription) => {
    if (subscription.plan_name === 'LIFETIME') return '∞';
    if (!subscription.expiry_date) return 'N/A';
    
    const now = new Date();
    const expiry = new Date(subscription.expiry_date);
    const days = Math.ceil((expiry - now) / (24 * 60 * 60 * 1000));
    return days;
  };

  const getStatusBadge = (subscription) => {
    if (subscription.status === 'CANCELLED') {
      return { label: 'Cancelled', color: 'bg-gray-500/20 text-gray-400 border-gray-500/50' };
    }
    if (subscription.status === 'EXPIRED') {
      return { label: 'Expired', color: 'bg-red-500/20 text-red-400 border-red-500/50' };
    }
    
    const days = getRemainingDays(subscription);
    if (typeof days === 'number' && days <= 3) {
      return { label: `Expiring Soon (${days}d)`, color: 'bg-orange-500/20 text-orange-400 border-orange-500/50' };
    }
    
    return { label: 'Active', color: 'bg-green-500/20 text-green-400 border-green-500/50' };
  };

  const getPlanLabel = (planName) => {
    const plan = PLAN_OPTIONS.find(p => p.value === planName);
    return plan ? plan.label : planName;
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

  const activeSubs = subscriptions.filter(s => s.status === 'ACTIVE');
  const expiringSoon = activeSubs.filter(s => {
    const days = getRemainingDays(s);
    return typeof days === 'number' && days <= 7;
  });
  const expiredSubs = subscriptions.filter(s => s.status === 'EXPIRED');

  return (
    <PageLayout>
      <PageTitle 
        title="Subscription Management" 
        subtitle="Admin Access Control"
        icon={<CreditCard className="w-6 h-6" style={{ color: G.text }} />}
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
                  <p className="text-xs text-white/70 mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-white">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-white/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0" style={{ background: G.bg }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70 mb-1">Active Subs</p>
                  <p className="text-2xl font-bold text-white">{activeSubs.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-white/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0" style={{ background: G.bg }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70 mb-1">Expiring Soon</p>
                  <p className="text-2xl font-bold text-white">{expiringSoon.length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-white/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0" style={{ background: G.bg }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70 mb-1">Expired</p>
                  <p className="text-2xl font-bold text-white">{expiredSubs.length}</p>
                </div>
                <XCircle className="w-8 h-8 text-white/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grant Subscription Button */}
        <div className="flex justify-end">
          <Dialog open={grantDialogOpen} onOpenChange={setGrantDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gold">
                <Plus className="w-4 h-4 mr-2" />
                Grant Subscription
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Grant Subscription Access</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-white/80">Select User *</Label>
                  <Select 
                    value={grantForm.user_id} 
                    onValueChange={(value) => setGrantForm(prev => ({ ...prev, user_id: value }))}
                  >
                    <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Choose a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name || user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white/80">Select Plan *</Label>
                  <Select 
                    value={grantForm.plan_name} 
                    onValueChange={(value) => setGrantForm(prev => ({ ...prev, plan_name: value }))}
                  >
                    <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Choose a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLAN_OPTIONS.map(plan => (
                        <SelectItem key={plan.value} value={plan.value}>
                          {plan.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white/80">Notes (Optional)</Label>
                  <Input
                    value={grantForm.notes}
                    onChange={(e) => setGrantForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-2 bg-white/5 border-white/10 text-white"
                    placeholder="Admin notes..."
                  />
                </div>

                <Button
                  onClick={handleGrantSubscription}
                  disabled={processing}
                  className="w-full btn-gold"
                >
                  {processing ? "Granting..." : "Grant Access"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Subscriptions List */}
        <div className="space-y-4">
          <h2 className="font-inter text-lg font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" style={{ color: G.text }} />
            All Subscriptions
          </h2>

          {subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 mx-auto mb-4" style={{ color: G.dim }} />
              <p className="text-white/60">No subscriptions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {subscriptions.map(subscription => {
                const status = getStatusBadge(subscription);
                const remainingDays = getRemainingDays(subscription);
                const user = users.find(u => u.id === subscription.user_id);
                
                return (
                  <Card key={subscription.id} className="border-0" style={{ background: G.bg }}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-white">{user?.full_name || "Unnamed User"}</h3>
                            <Badge className={`${status.color} border font-semibold text-xs`}>
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-white/60">{user?.email}</p>
                        </div>
                        <Badge variant="outline" className="border-gold text-gold">
                          {getPlanLabel(subscription.plan_name)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-white/50 mb-1">Start Date</p>
                          <p className="text-white font-mono text-xs">{formatDate(subscription.start_date)}</p>
                        </div>
                        <div>
                          <p className="text-white/50 mb-1">
                            {subscription.plan_name === 'LIFETIME' ? 'Status' : 'Expiry Date'}
                          </p>
                          <p className="text-white font-mono text-xs">
                            {subscription.plan_name === 'LIFETIME' 
                              ? 'Lifetime Access' 
                              : formatDate(subscription.expiry_date)}
                          </p>
                        </div>
                        {subscription.plan_name !== 'LIFETIME' && (
                          <div>
                            <p className="text-white/50 mb-1">Remaining Days</p>
                            <p className={`font-bold text-lg ${
                              typeof remainingDays === 'number' && remainingDays <= 3 
                                ? 'text-red-400' 
                                : typeof remainingDays === 'number' && remainingDays <= 7 
                                  ? 'text-orange-400' 
                                  : 'text-green-400'
                            }`}>
                              {typeof remainingDays === 'number' ? `${remainingDays} days` : remainingDays}
                            </p>
                          </div>
                        )}
                      </div>

                      {subscription.status === 'ACTIVE' && subscription.plan_name !== 'LIFETIME' && (
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t" style={{ borderColor: G.border }}>
                          <Dialog open={modifyDialogOpen && selectedSubscription?.id === subscription.id} onOpenChange={(open) => {
                            setModifyDialogOpen(open);
                            if (!open) setSelectedSubscription(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gold text-gold hover:bg-gold/10"
                                onClick={() => setSelectedSubscription(subscription)}
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Modify Days
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md bg-slate-900 border-slate-700">
                              <DialogHeader>
                                <DialogTitle className="text-white">Modify Subscription</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                <div>
                                  <p className="text-white/80 mb-2">
                                    <strong>User:</strong> {user?.full_name || 'User'}
                                  </p>
                                  <p className="text-white/60 text-sm mb-4">
                                    <strong>Plan:</strong> {getPlanLabel(subscription.plan_name)}
                                  </p>
                                  <p className="text-white/60 text-sm mb-4">
                                    <strong>Current Expiry:</strong> {formatDate(subscription.expiry_date)}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-white/80">Days to Add/Remove</Label>
                                  <Input
                                    type="number"
                                    value={modifyForm.days_to_add}
                                    onChange={(e) => setModifyForm(prev => ({ ...prev, days_to_add: e.target.value }))}
                                    className="mt-2 bg-white/5 border-white/10 text-white"
                                    placeholder="e.g., 30 or -5"
                                  />
                                  <p className="text-xs text-white/50 mt-2">
                                    Positive number to extend, negative to reduce
                                  </p>
                                </div>
                                <Button
                                  onClick={handleModifySubscription}
                                  disabled={processing}
                                  className="w-full btn-gold"
                                >
                                  {processing ? "Modifying..." : "Update Subscription"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-400 text-red-400 hover:bg-red-400/10"
                            onClick={() => handleCancelSubscription(subscription)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </PageLayout>
  );
}