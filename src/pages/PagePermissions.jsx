import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Lock, EyeOff, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ROUTE_PERMISSION_MAP } from "@/lib/permissionCodes";
import { MASTER_PAGE_REGISTRY } from "@/lib/permissionStabilityRules";

const LOCKED_PAGES = MASTER_PAGE_REGISTRY.filter(p => p.locked).map(p => p.path);

export default function PagePermissions() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(null);
  const [pageVisibility, setPageVisibility] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const user = await base44.auth.me();
      if (user?.role !== 'admin') {
        setIsAdmin(false);
        return;
      }
      setIsAdmin(true);
      await loadPages();
    } catch (error) {
      setIsAdmin(false);
      toast({ title: "Error", description: "Please log in", variant: "destructive" });
    }
  };

  const loadPages = async () => {
    setLoading(true);
    try {
      // Get database records first (source of truth)
      const dbConfigs = await base44.entities.PageVisibilityConfig.list(null, 500);
      const dbMap = {};
      (dbConfigs || []).forEach(config => {
        dbMap[config.page_path] = config.requires_permission;
      });

      // Merge: database values override hardcoded defaults
      const list = Object.entries(ROUTE_PERMISSION_MAP)
        .filter(([_, config]) => !config.adminOnly)
        .map(([path, config]) => ({
          path,
          name: config.name,
          requiresPermission: dbMap.hasOwnProperty(path) ? dbMap[path] : config.requiresPermission,
          isLocked: LOCKED_PAGES.includes(path)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      
      setPageVisibility(list);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (pagePath, newVisibility) => {
    const page = pageVisibility.find(p => p.path === pagePath);
    if (page?.isLocked) {
      toast({
        variant: "destructive",
        title: "Locked",
        description: `${page.name} is locked`,
      });
      return;
    }

    setProcessing(true);
    try {
      await base44.functions.invoke("updatePageVisibility", {
        page_path: pagePath,
        requires_permission: newVisibility
      });

      setPageVisibility(prev => 
        prev.map(p => p.path === pagePath ? { ...p, requiresPermission: newVisibility } : p)
      );
      
      toast({
        title: "✓ Updated",
        description: `${page.name} → ${newVisibility ? 'Private' : 'Public'}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "✗ Failed",
        description: error.message,
      });
    } finally {
      setProcessing(false);
    }
  };

  if (isAdmin === false) return <Navigate to="/" replace />;

  if (isAdmin === null || loading) {
    return (
      <AdminLayout title="Loading..." showBackButton={false}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-gold border-r-transparent border-b-gold border-l-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Page Permissions" subtitle="Manage public and private access">

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
          {pageVisibility.map(page => {
            const isPrivate = page.requiresPermission;
            const isLocked = page.isLocked;
            
            return (
              <div
                key={page.path}
                className="p-3 rounded-lg border flex items-center justify-between"
                style={{
                  background: isPrivate ? "rgba(239,68,68,0.05)" : "rgba(34,197,94,0.05)",
                  borderColor: isPrivate ? "rgba(239,68,68,0.30)" : "rgba(34,197,94,0.30)",
                  opacity: isLocked ? 0.6 : 1
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{page.name}</span>
                    {isLocked && (
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 border text-xs">
                        Locked
                      </Badge>
                    )}
                    <Badge 
                      className={`${isPrivate 
                        ? 'bg-red-500/20 text-red-400 border-red-500/50' 
                        : 'bg-green-500/20 text-green-400 border-green-500/50'
                      } border text-xs`}
                    >
                      {isPrivate ? 'Private' : 'Public'}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/40 font-mono mt-0.5">{page.path}</p>
                </div>

                {!isLocked ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={processing}
                    className={`h-8 text-xs ${
                      isPrivate 
                        ? 'border-green-400 text-green-400 hover:bg-green-400/10' 
                        : 'border-red-400 text-red-400 hover:bg-red-400/10'
                    }`}
                    onClick={() => handleToggle(page.path, !isPrivate)}
                  >
                    {isPrivate ? (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 mr-1" />
                        Private
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="text-xs text-white/30 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {page.adminOnly ? 'Admin' : 'Permanent'}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-3 rounded-lg border text-xs text-white/50" style={{ background: "rgba(212,175,55,0.07)", borderColor: "rgba(212,175,55,0.30)" }}>
          <span className="text-gold font-semibold">Note:</span> Settings persist across deployments. Locked pages cannot be changed.
        </div>
      </motion.div>
    </AdminLayout>
  );
}