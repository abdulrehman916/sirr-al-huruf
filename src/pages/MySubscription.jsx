import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Clock, CheckCircle, Lock, RefreshCw, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageLayout from "@/components/PageLayout";
import PageTitle from "@/components/PageTitle";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const G = {
  border: "rgba(212,175,55,0.35)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

function fmt(d) {
  if (!d) return "Permanent";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function daysLeft(d) {
  if (!d) return null;
  return Math.ceil((new Date(d) - new Date()) / 86400000);
}

export default function MySubscription() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [requests, setRequests] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const [permsRes, reqsRes] = await Promise.all([
        base44.functions.invoke("getUserSubscriptions", {}),
        base44.entities.PremiumAccessRequest.filter({ status: "PENDING" }, "-requested_at", 50),
      ]);
      setPermissions(permsRes.data?.permissions || []);
      setRequests(reqsRes || []);
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <PageLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
      </div>
    </PageLayout>
  );

  const activePerms = permissions.filter(p => p.is_active && !p.is_revoked && (!p.expiry_date || new Date(p.expiry_date) > new Date()));
  const expiredPerms = permissions.filter(p => p.expiry_date && new Date(p.expiry_date) < new Date());

  return (
    <PageLayout>
      <PageTitle arabic="اشتراكاتي" latin="My Access" subtitle="Permissions · Requests" icon="⭐" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-10">

        {/* Active Permissions */}
        {activePerms.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-inter font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" /> My Active Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activePerms.map(perm => {
                const days = daysLeft(perm.expiry_date);
                const urgent = days !== null && days < 14;
                return (
                  <Card key={perm.id} className="border-white/10 bg-white/5"
                    style={{ borderColor: urgent ? "rgba(239,68,68,0.40)" : undefined }}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-white text-sm">{perm.page_name}</CardTitle>
                          <CardDescription className="text-white/50 text-xs mt-0.5">
                            {perm.permission_code?.replace("_ACCESS", "") || "Access"}
                          </CardDescription>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <Clock className="w-3.5 h-3.5" />
                        {days !== null && days < 36000
                          ? <span style={{ color: urgent ? "#f87171" : undefined }}>
                              Expires in {days} day{days !== 1 ? "s" : ""} · {fmt(perm.expiry_date)}
                            </span>
                          : "Permanent access"}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Pending Requests */}
        {requests.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-inter font-bold text-white text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Pending Requests
            </h2>
            {requests.map(req => (
              <Card key={req.id} className="border-amber-500/20 bg-amber-500/5">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-inter font-semibold text-white text-sm">{req.page_name}</p>
                      <p className="text-xs text-white/40 mt-0.5">
                        Requested {new Date(req.requested_at).toLocaleDateString()}
                      </p>
                      {req.message && (
                        <p className="text-xs text-white/50 mt-1 italic">"{req.message}"</p>
                      )}
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                      Pending
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Expired Permissions */}
        {expiredPerms.length > 0 && (
          <div className="space-y-2">
            <h2 className="font-inter font-bold text-white/40 text-xs uppercase tracking-widest">Expired Access</h2>
            {expiredPerms.map(perm => (
              <Card key={perm.id} className="border-white/5 bg-white/[0.02]">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-inter font-semibold text-white/50 text-sm">{perm.page_name}</p>
                      <p className="text-xs text-white/30">{fmt(perm.expiry_date)}</p>
                    </div>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                      Expired
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No access yet */}
        {activePerms.length === 0 && requests.length === 0 && (
          <Card className="border-white/10 bg-white/5">
            <CardContent className="pt-8 text-center">
              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-white/60 text-sm mb-4">You don't have any page access yet.</p>
              <Button
                onClick={() => window.location.href = "/premium-access-request"}
                className="btn-gold"
              >
                <FileText className="w-4 h-4 mr-2" />
                Request Access
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1 border-white/20 text-white/70 hover:bg-white/10"
            onClick={() => window.location.href = "/premium-access-request"}
          >
            <FileText className="w-4 h-4 mr-2" />
            New Request
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-white/20 text-white/70 hover:bg-white/10"
            onClick={load}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

      </motion.div>
    </PageLayout>
  );
}