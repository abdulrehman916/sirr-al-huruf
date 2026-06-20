import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Activity, Search, Shield, CheckCircle, XCircle, AlertTriangle,
  Loader2, Calendar, Clock, User, Globe, ArrowRight
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RESULT_ICONS = {
  GRANTED: CheckCircle,
  DENIED: XCircle,
  EXPIRED: AlertTriangle,
  REVOKED: XCircle,
  NOT_FOUND: AlertTriangle
};

const RESULT_COLORS = {
  GRANTED: "bg-green-500/20 text-green-500 border-green-500/30",
  DENIED: "bg-red-500/20 text-red-500 border-red-500/30",
  EXPIRED: "bg-orange-500/20 text-orange-500 border-orange-500/30",
  REVOKED: "bg-red-500/20 text-red-500 border-red-500/30",
  NOT_FOUND: "bg-gray-500/20 text-gray-500 border-gray-500/30"
};

export default function AdminAccessLogs() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterResult, setFilterResult] = useState("all");
  const [filterPage, setFilterPage] = useState("all");

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
      fetchLogs();
    } catch (err) {
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const allLogs = await base44.entities.AccessLog.list("-timestamp", 100);
      setLogs(allLogs);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load access logs",
        variant: "destructive",
      });
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery === "" || 
      log.user_id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesResult = filterResult === "all" || log.access_result === filterResult;
    const matchesPage = filterPage === "all" || log.page_path === filterPage;
    
    return matchesSearch && matchesResult && matchesPage;
  });

  const uniquePages = [...new Set(logs.map(log => log.page_path))].filter(Boolean);

  if (loading) {
    return (
      <AdminLayout title="Loading..." showBackButton={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Access Logs" subtitle="Monitor all page access attempts and permission checks">
      <div className="max-w-6xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="border-white/10 bg-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-white/70 text-sm">Total Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{logs.length}</div>
            </CardContent>
          </Card>
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-500/70 text-sm">Granted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {logs.filter(l => l.access_result === "GRANTED").length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-red-500/70 text-sm">Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {logs.filter(l => l.access_result === "DENIED").length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-500/20 bg-orange-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-500/70 text-sm">Expired</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {logs.filter(l => l.access_result === "EXPIRED").length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-500/20 bg-gray-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-500/70 text-sm">Revoked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-500">
                {logs.filter(l => l.access_result === "REVOKED").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-white/10 bg-white/5 mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <Input
                    placeholder="Search by User ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div>
                <Select value={filterResult} onValueChange={setFilterResult}>
                  <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Filter by result" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="all" className="text-white">All Results</SelectItem>
                    <SelectItem value="GRANTED" className="text-white">Granted</SelectItem>
                    <SelectItem value="DENIED" className="text-white">Denied</SelectItem>
                    <SelectItem value="EXPIRED" className="text-white">Expired</SelectItem>
                    <SelectItem value="REVOKED" className="text-white">Revoked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filterPage} onValueChange={setFilterPage}>
                  <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Filter by page" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="all" className="text-white">All Pages</SelectItem>
                    {uniquePages.map(page => (
                      <SelectItem key={page} value={page} className="text-white">
                        {page}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(searchQuery || filterResult !== "all" || filterPage !== "all") && (
              <div className="text-sm text-white/60 mt-3">
                Found {filteredLogs.length} log(s)
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logs List */}
        <div className="space-y-3">
          {filteredLogs.length === 0 ? (
            <Card className="border-white/10 bg-white/5">
              <CardContent className="pt-6 text-center text-white/60">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No access logs found</p>
              </CardContent>
            </Card>
          ) : (
            filteredLogs.map((log, idx) => {
              const Icon = RESULT_ICONS[log.access_result] || AlertTriangle;
              const colorClass = RESULT_COLORS[log.access_result] || RESULT_COLORS.NOT_FOUND;
              
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Card className="border-white/10 bg-white/5 hover:border-white/20 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <Badge className={colorClass}>
                            <Icon className="w-3 h-3 mr-1" />
                            {log.access_result}
                          </Badge>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-3 h-3 text-white/50" />
                              <span className="text-white text-sm font-medium truncate">
                                {log.user_id}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-white/60">
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {log.page_path}
                              </span>
                              <span className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                {log.permission_code}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-white/60">
                          <div className="text-right hidden md:block">
                            <div className="flex items-center gap-1 justify-end mb-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(log.timestamp).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1 justify-end">
                              <Clock className="w-3 h-3" />
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/30" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}