import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Globe, Lock, Eye, EyeOff, Save, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageLayout from "@/components/PageLayout";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ROUTE_PERMISSION_MAP } from "@/lib/permissionCodes";

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
  const [savedPages, setSavedPages] = useState(new Set());

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
      await loadPageVisibility();
    } catch (error) {
      setIsAdmin(false);
      toast({
        title: "Authentication Error",
        description: "Please log in to continue",
        variant: "destructive"
      });
    }
  };

  const loadPageVisibility = async () => {
    setLoading(true);
    try {
      const visibilityList = Object.entries(ROUTE_PERMISSION_MAP)
        .filter(([_, config]) => !config.adminOnly)
        .map(([path, config]) => ({
          path,
          name: config.name,
          requiresPermission: config.requiresPermission,
          code: config.code
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      
      setPageVisibility(visibilityList);
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

  const handleToggleVisibility = async (pagePath, newVisibility) => {
    setProcessing(true);
    try {
      await base44.functions.invoke("updatePageVisibility", {
        page_path: pagePath,
        requiresPermission: newVisibility
      });

      setPageVisibility(prev => 
        prev.map(page => 
          page.path === pagePath 
            ? { ...page, requiresPermission: newVisibility }
            : page
        )
      );

      setSavedPages(prev => new Set(prev).add(pagePath));
      
      toast({
        title: "Visibility Updated",
        description: `Page is now ${newVisibility ? 'PRIVATE' : 'PUBLIC'}`,
        variant: "default"
      });

      setTimeout(() => {
        setSavedPages(prev => {
          const next = new Set(prev);
          next.delete(pagePath);
          return next;
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
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
            <p className="text-white/60">Loading page permissions...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageTitle 
        title="Page Permissions" 
        subtitle="Manage Public & Private Access"
        icon={<Globe className="w-6 h-6" style={{ color: G.text }} />}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Info Card */}
        <Card className="border-0" style={{ background: G.bg }}>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 mt-0.5" style={{ color: G.text }} />
              <div>
                <h3 className="font-inter text-sm font-bold text-white mb-1">
                  Page Visibility Control
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Toggle pages between <span className="text-green-400 font-semibold">PUBLIC</span> (no permission required) 
                  and <span className="text-red-400 font-semibold">PRIVATE</span> (requires manual permission grant via Admin Permissions)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Page List */}
        <div className="space-y-3">
          <h2 className="font-inter text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5" style={{ color: G.text }} />
            All Pages ({pageVisibility.length})
          </h2>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {pageVisibility.map(page => {
              const isPrivate = page.requiresPermission;
              const isSaved = savedPages.has(page.path);
              
              return (
                <div
                  key={page.path}
                  className="p-4 rounded-xl border flex items-center justify-between transition-all duration-200"
                  style={{
                    background: isPrivate 
                      ? "rgba(239,68,68,0.05)" 
                      : "rgba(34,197,94,0.05)",
                    borderColor: isPrivate 
                      ? "rgba(239,68,68,0.30)" 
                      : "rgba(34,197,94,0.30)",
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{page.name}</span>
                      <Badge 
                        className={`${isPrivate 
                          ? 'bg-red-500/20 text-red-400 border-red-500/50' 
                          : 'bg-green-500/20 text-green-400 border-green-500/50'
                        } border font-semibold text-xs`}
                      >
                        {isPrivate ? 'PRIVATE' : 'PUBLIC'}
                      </Badge>
                      {isSaved && (
                        <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      )}
                    </div>
                    <p className="text-xs text-white/50 font-mono">{page.path}</p>
                  </div>

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
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
}