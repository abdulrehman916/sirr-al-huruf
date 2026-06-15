import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Clock, CreditCard, Loader2, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";

const PLANS = [
  { id: "1_MONTH", name: "1 Month", duration: 30 },
  { id: "6_MONTHS", name: "6 Months", duration: 180 },
  { id: "1_YEAR", name: "1 Year", duration: 365 },
  { id: "LIFETIME", name: "Lifetime", duration: 99999 },
];

const PREMIUM_PAGES = [
  { path: "/abjad", name: "Abjad Kabir" },
  { path: "/hadim", name: "Hadim" },
  { path: "/vefkin-yapilisi", name: "Vefk" },
  { path: "/mizaan9", name: "Mizan" },
  { path: "/magic-sqayer", name: "Magic Sqayer" },
  { path: "/basthul-huroof-2", name: "Bast Huroof" },
  { path: "/faal-hasrath", name: "Faal Hasrath" },
  { path: "/evil-jinn", name: "Evil Jinn" },
  { path: "/holy-names", name: "Holy Names" },
  { path: "/astro-clock", name: "Astro Clock" },
];

export default function PremiumAccessRequest() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState({});
  const [selectedPage, setSelectedPage] = useState(PREMIUM_PAGES[0]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUser(u);
    }).catch(() => navigate("/otp-login"));
  }, [navigate]);

  useEffect(() => {
    if (selectedPage) {
      fetchPricing();
    }
  }, [selectedPage]);

  const fetchPricing = async () => {
    try {
      const response = await base44.functions.invoke("getPagePricing", {
        page_path: selectedPage.path
      });
      if (response.data.success) {
        const pricingMap = {};
        response.data.pricing.forEach((p) => {
          pricingMap[p.plan_name] = p;
        });
        setPricing(pricingMap);
      }
    } catch (err) {
      console.error("Failed to load pricing:", err);
    }
  };

  const handleSubmitRequest = async () => {
    if (!selectedPlan) {
      toast({
        title: "Select Plan",
        description: "Please choose a subscription plan",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await base44.functions.invoke("createPageSubscription", {
        user_id: user.id,
        page_path: selectedPage.path,
        page_name: selectedPage.name,
        plan_name: selectedPlan.plan_name,
        price: selectedPlan.price,
        currency: selectedPlan.currency,
        payment_method: "Pending",
        transaction_id: "PENDING",
        payment_proof_url: "",
        message: message
      });

      if (response.data.success) {
        toast({
          title: "Access Request Submitted",
          description: "Admin will review your request shortly",
        });
        navigate("/subscription-pending");
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to submit request",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
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
      <div className="max-w-4xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Request Premium Access
          </h1>
          <p className="text-white/70">
            Select a page and plan - your details are auto-filled
          </p>
        </motion.div>

        {/* User Info Card */}
        <Card className="mb-6 border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-green-500 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              Logged in as
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-white/60 text-xs mb-1">Name</p>
                <p className="text-white font-medium">{user.full_name || "Not set"}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Email</p>
                <p className="text-white font-medium">{user.email || "Not set"}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Phone</p>
                <p className="text-white font-medium">Verified via OTP</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Page Selection */}
        <Card className="mb-6 border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Select Premium Page</CardTitle>
            <CardDescription className="text-white/70">
              Choose which page you want to access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select 
              value={selectedPage.path} 
              onValueChange={(value) => setSelectedPage(PREMIUM_PAGES.find(p => p.path === value))}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                <SelectValue placeholder="Select a page" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                {PREMIUM_PAGES.map((page) => (
                  <SelectItem key={page.path} value={page.path} className="text-white">
                    {page.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Plan Selection */}
        <Card className="mb-6 border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Select Subscription Plan</CardTitle>
            <CardDescription className="text-white/70">
              Choose your subscription duration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PLANS.map((plan, idx) => {
                const pricingData = pricing[plan.id];
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all ${
                        selectedPlan?.plan_name === plan.id
                          ? "border-gold bg-gold/10"
                          : "border-white/10 hover:border-gold/50"
                      }`}
                      onClick={() => setSelectedPlan(pricingData)}
                    >
                      <CardHeader>
                        <CardTitle className="text-white">{plan.name}</CardTitle>
                        <CardDescription className="text-white/70">
                          {plan.id === "LIFETIME" ? "One-time payment" : "Recurring access"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-gold">
                          {pricingData?.price || "—"} {pricingData?.currency || "AED"}
                        </div>
                      </CardContent>
                      {selectedPlan?.plan_name === plan.id && (
                        <div className="absolute top-2 right-2">
                          <Check className="w-5 h-5 text-gold" />
                        </div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Message */}
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">Message (Optional)</CardTitle>
                <CardDescription className="text-white/70">
                  Add any notes or special requests for the admin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any specific requirements or questions..."
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                />
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="border-white/20 text-white/70 hover:bg-white/10"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button
                  className="btn-gold h-12 px-8"
                  onClick={handleSubmitRequest}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Info Box */}
        <Card className="mt-6 border-blue-500/20 bg-blue-500/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-white font-medium text-sm">Admin Approval Required</h4>
                <p className="text-white/70 text-xs mt-1">
                  Your access request will be reviewed within 24 hours. You'll receive a WhatsApp notification once approved.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}