import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { KeyRound, Shield } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "@/components/PageLayout";
import AccessCodesTab from "@/components/admin/AccessCodesTab";

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

export default function AdminAccessCodes() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(null);

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
    } catch (error) {
      setIsAdmin(false);
      toast({
        title: "Authentication Error",
        description: "Please log in to continue",
        variant: "destructive"
      });
    }
  };

  if (isAdmin === false) {
    return <Navigate to="/" replace />;
  }

  if (isAdmin === null) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-gold border-r-transparent border-b-gold border-l-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading access codes...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className="p-2.5 rounded-xl"
            style={{ background: G.bgHi, border: `1px solid ${G.borderHi}` }}
          >
            <KeyRound className="w-6 h-6" style={{ color: G.text }} />
          </div>
          <div>
            <h1 className="font-inter text-xl font-bold text-white">
              Access Code Management
            </h1>
            <p className="font-amiri text-sm" style={{ color: G.dim }}>
              إدارة رموز الوصول
            </p>
          </div>
        </div>

        <div
          className="p-4 rounded-xl border"
          style={{ background: G.bg, borderColor: G.border }}
        >
          <p className="text-sm text-white/70">
            Create and manage access codes. Each code can unlock specific pages for customers with custom expiry dates.
          </p>
        </div>

        {/* Access Codes Tab Component */}
        <AccessCodesTab />
      </div>
    </PageLayout>
  );
}