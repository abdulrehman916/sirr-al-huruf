import { motion } from "framer-motion";
import { Navigate, Link } from "react-router-dom";
import { AlertCircle, CreditCard, Home, Mail } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";

const G = {
  border: "rgba(212,175,55,0.40)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.07)"
};

export default function SubscriptionExpired() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await base44.auth.me();
      if (!user) {
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);

      // Fetch subscription details
      const response = await base44.functions.invoke("checkSubscriptionStatus", {});
      setSubscription(response.data);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-gold border-r-transparent border-b-gold border-l-transparent rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  return (
    <PageLayout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="border-0" style={{ background: G.bg }}>
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10" style={{ color: "#ef4444" }} />
              </div>

              <h1 className="font-inter text-2xl font-bold text-white mb-2">
                Subscription Expired
              </h1>

              <p className="text-white/60 mb-6">
                Your access has expired. Please contact support to renew your subscription.
              </p>

              {subscription && !subscription.is_lifetime && (
                <div className="p-4 rounded-lg mb-6" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <p className="text-sm text-white/70 mb-2">Previous Plan</p>
                  <p className="text-lg font-bold" style={{ color: G.text }}>
                    {subscription.plan_name?.replace('_', ' ')}
                  </p>
                  {subscription.expired_at && (
                    <p className="text-xs text-white/50 mt-2">
                      Expired: {new Date(subscription.expired_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <Link to="/customer-service">
                  <Button className="w-full btn-gold">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white/70 hover:bg-white/10"
                  onClick={() => window.location.href = '/'}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Return to Home
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t" style={{ borderColor: G.border }}>
                <p className="text-xs text-white/40">
                  Need help? Email us at support@example.com
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageLayout>
  );
}