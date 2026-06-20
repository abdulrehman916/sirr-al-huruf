import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PageLayout from "@/components/PageLayout";
import ApprovedUsersTab from "@/components/admin/ApprovedUsersTab";
import { useToast } from "@/components/ui/use-toast";
import { Shield } from "lucide-react";

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

export default function ApprovedUsersPage() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const currentUser = await base44.auth.me();
      if (!currentUser || currentUser.role !== 'admin') {
        setIsAdmin(false);
        toast({
          title: "Access Denied",
          description: "Only administrators can access this page",
          variant: "destructive"
        });
        return;
      }
      setUser(currentUser);
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
            <p className="text-white/60">Loading...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <div
          className="p-6 rounded-2xl mb-6"
          style={{
            background: `linear-gradient(135deg, ${G.bg} 0%, rgba(212,175,55,0.05) 100%)`,
            border: `1px solid ${G.border}`
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="p-2 rounded-lg"
              style={{ background: "rgba(212,175,55,0.25)", border: `1px solid ${G.text}` }}
            >
              <Shield className="w-6 h-6" style={{ color: G.text }} />
            </div>
            <div>
              <h2 className="font-inter text-lg font-bold text-white">
                Approved Users
              </h2>
              <p className="font-amiri text-sm" style={{ color: G.dim }}>
                المستخدمون المعتمدون
              </p>
            </div>
          </div>
          <p className="text-white/60 text-sm">
            Grant direct access to trusted users without OTP. Approved users can log in instantly with just their email.
          </p>
        </div>

        <ApprovedUsersTab />
      </div>
    </PageLayout>
  );
}