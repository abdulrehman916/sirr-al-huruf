import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Globe, Lock, Eye, EyeOff, CheckCircle, Search, Filter } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageLayout from "@/components/PageLayout";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ROUTE_PERMISSION_MAP } from "@/lib/permissionCodes";
import { PERMISSION_STABILITY_RULES } from "@/lib/permissionStabilityRules";

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

export default function PagePermissions() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(null);
  const [pageVisibility, setPageVisibility] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const user = await base44.auth.me();
      if (!['admin', 'owner'].includes(user?.role)) {
        setIsAdmin(false);
        toast({ title: "Access Denied", description: "Only administrators can access this page", variant: "destructive" });
        return;
      }
      setIsAdmin(true);
      await loadPageVisibility();
    } catch (error) {
      setIsAdmin(false);
      toast({ title: "Authentication Error", description: "Please log in to continue", variant: "destructive" });
    }
  };

  const loadPageVisibility = async () => {
    setLoading(true);
    try {
      const visibilityList = Object.entries(ROUTE_PERMISSION_MAP).map(([path, config]) => ({
        path,
        name: config.name,
        requiresPermission: config.requiresPermission,
        adminOnly: config.adminOnly || false,
        isLocked: PERMISSION_STABILITY_RULES.LOCKED_PAGES.includes(path)
      }));
      
      setPageVisibility(visibilityList.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      toast({ title: "Error Loading Data", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredPages = pageVisibility.filter(page => {
    const matchesSearch = page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         page.path.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    if (filterType === "public") return matchesSearch && !page.requiresPermission && !page.adminOnly;
    if (filterType === "private") return matchesSearch && page.requiresPermission && !page.adminOnly;
    if (filterType === "admin") return matchesSearch && page.adminOnly;
    
    return matchesSearch;
  });

  const handleBulkUpdate = async (action) => {
    const actionLabel = action === 'MAKE_ALL_PUBLIC' ? 'PUBLIC' : 'PRIVATE';
    if (!confirm(`⚠️ Make ALL non-locked pages ${actionLabel}?\n\nLocked pages will remain unchanged.`)) return;

    setBulkProcessing(true);
    try {
      const result = await base44.functions.invoke("bulkUpdatePageVisibility", {
        action,
        exclude_paths: []
      });

      toast({
        title: "Bulk Update Complete",
        description: `${result.data.total_updated} pages set to ${actionLabel}`,
        variant: "default"
      });

      await loadPageVisibility();
    } catch (error) {
      toast({ title: "Bulk Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleToggleVisibility = async (pagePath, newVisibility) => {
    const page = pageVisibility.find(p => p.path === pagePath);
    if (page?.isLocked) {
      toast({ title: "Locked Page", description: `${page.name} cannot be modified`, variant: "destructive" });
      return;
    }

    setProcessing(true);
    try {
      await base44.functions.invoke("updatePageVisibility", {
        page_path: pagePath,
        requiresPermission: newVisibility
      });

      setPageVisibility(prev => 
        prev.map(p => 
          p.path === pagePath 
            ? { ...p, requiresPermission: newVisibility }
            : p
        )
      );
      
      toast({
        title: "Updated",
        description: `${page?.name} is now ${newVisibility ? 'PRIVATE' : 'PUBLIC'}`,
        variant: "default"
      });
    } catch (error) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  if (isAdmin === false) return <Navigate to="/" replace />;

  if (isAdmin === null || loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-gold border-r-transparent border-b-gold border-l-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading page permissions...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  const publicCount = pageVisibility.filter(p => !p.requiresPermission && !p.adminOnly).length;
  const privateCount = pageVisibility.filter(p => p.requiresPermission && !p.adminOnly).length;
  const adminCount = pageVisibility.filter(p => p.adminOnly).length;

  return (
    <PageLayout>
      <PageTitle 
        title="Page Permission Manager" 
        subtitle="Control Public & Private Access"
        icon={<Globe className="w-6 h-6" style={{ color: G.text }} />}
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0" style={{ background: "rgba(34,197,94,0.08)" }}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{publicCount}</p>
              <p className="text-xs text-white/60">Public Pages</p>
            </CardContent>
          </Card>
          <Card className="border-0" style={{ background: "rgba(239,68,68,0.08)" }}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-400">{privateCount}</p>
              <p className="text-xs text-white/60">Private Pages</p>
            </CardContent>
          </Card>
          <Card className="border-0" style={{ background: "rgba(249,115,22,0.08)" }}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-400">{adminCount}</p>
              <p className="text-xs text-white/60">Admin Only</p>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={bulkProcessing}
            className="border-green-400 text-green-400 hover:bg-green-400/10"
            onClick={() => handleBulkUpdate('MAKE_ALL_PUBLIC')}
          >
            <Globe className="w-3.5 h-3.5 mr-1.5" />
            Make All Public
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={bulkProcessing}
            className="border-red-400 text-red-400 hover:bg-red-400/10"
            onClick={() => handleBulkUpdate('MAKE_ALL_PRIVATE')}
          >
            <Lock className="w-3.5 h-3.5 mr-1.5" />
            Make All Private
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white text-sm appearance-none cursor-pointer"
              style={{ minWidth: 140 }}
            >
              <option value="all">All Pages</option>
              <option value="public">Public Only</option>
              <option value="private">Private Only</option>
              <option value="admin">Admin Only</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Page List */}
        <div className="space-y-3">
          <h2 className="font-inter text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5" style={{ color: G.text }} />
            All Pages ({filteredPages.length})
          </h2>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {filteredPages.map(page => {
              const isPrivate = page.requiresPermission;
              const isAdminOnly = page.adminOnly;
              const isLocked = page.isLocked;
              
              return (
                <div
                  key={page.path}
                  className="p-4 rounded-xl border flex items-center justify-between transition-all duration-200"
                  style={{
                    background: isAdminOnly 
                      ? "rgba(249,115,22,0.05)" 
                      : isPrivate 
                        ? "rgba(239,68,68,0.05)" 
                        : "rgba(34,197,94,0.05)",
                    borderColor: isAdminOnly 
                      ? "rgba(249,115,22,0.30)" 
                      : isPrivate 
                        ? "rgba(239,68,68,0.30)" 
                        : "rgba(34,197,94,0.30)",
                    opacity: isLocked ? 0.7 : 1
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{page.name}</span>
                      {isLocked && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 border font-semibold text-xs">
                          LOCKED
                        </Badge>
                      )}
                      <Badge 
                        className={`${isAdminOnly 
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' 
                          : isPrivate 
                            ? 'bg-red-500/20 text-red-400 border-red-500/50' 
                            : 'bg-green-500/20 text-green-400 border-green-500/50'
                          } border font-semibold text-xs`}
                      >
                        {isAdminOnly ? 'ADMIN ONLY' : isPrivate ? 'PRIVATE' : 'PUBLIC'}
                      </Badge>
                    </div>
                    <p className="text-xs text-white/50 font-mono">{page.path}</p>
                  </div>

                  {!isAdminOnly && !isLocked && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={processing}
                      className={`min-w-[110px] transition-all duration-200 ${
                        isPrivate 
                          ? 'border-green-400 text-green-400 hover:bg-green-400/10 hover:border-green-400' 
                          : 'border-red-400 text-red-400 hover:bg-red-400/10 hover:border-red-400'
                      }`}
                      onClick={() => handleToggleVisibility(page.path, !isPrivate)}
                    >
                      {isPrivate ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 mr-1.5" />
                          Make Public
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 mr-1.5" />
                          Make Private
                        </>
                      )}
                    </Button>
                  )}

                  {(isAdminOnly || isLocked) && (
                    <div className="text-xs text-white/40 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {isLocked ? 'Permanent' : 'Admin Only'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Card */}
        <Card className="border-0" style={{ background: G.bg }}>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 mt-0.5" style={{ color: G.text }} />
              <div>
                <h3 className="font-inter text-sm font-bold text-white mb-1">
                  Permission Stability Rules
                </h3>
                <ul className="text-white/60 text-sm space-y-1">
                  <li>✓ Settings persist across deployments</li>
                  <li>✓ No automatic resets or AI overwrites</li>
                  <li>✓ Locked pages (Home, Customer Service, OTP Login) cannot be changed</li>
                  <li>✓ Database is the source of truth</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </PageLayout>
  );
}