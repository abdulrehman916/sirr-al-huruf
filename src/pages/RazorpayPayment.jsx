import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Shield, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";

export default function RazorpayPayment() {
  const { pagePath } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pricing, setPricing] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const DECODED_PAGE_PATH = decodeURIComponent(pagePath || "");

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => navigate("/otp-login"));
  }, [navigate]);

  useEffect(() => {
    if (DECODED_PAGE_PATH) {
      fetchPricing();
      loadRazorpay();
    }
  }, [DECODED_PAGE_PATH]);

  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  };

  const fetchPricing = async () => {
    try {
      const response = await base44.functions.invoke("getPagePricing", {
        page_path: DECODED_PAGE_PATH
      });
      if (response.data.success) {
        setPricing(response.data.pricing);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load pricing",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async (plan) => {
    if (!razorpayLoaded) {
      toast({
        title: "Loading...",
        description: "Payment gateway is loading",
      });
      return;
    }

    setLoading(true);
    try {
      // Create Razorpay order
      const orderResponse = await base44.functions.invoke("createRazorpayOrder", {
        amount: plan.price,
        page_path: DECODED_PAGE_PATH,
        page_name: getPageName(),
        plan_name: plan.plan_name
      });

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message);
      }

      const { order_id, amount, key_id } = orderResponse.data;

      // Open Razorpay checkout
      const options = {
        key: key_id,
        amount: amount * 100,
        currency: "INR",
        name: "Occult Encyclopedia",
        description: `Subscription - ${plan.plan_name.replace("_", " ")}`,
        order_id: order_id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await base44.functions.invoke("verifyRazorpayPayment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              page_path: DECODED_PAGE_PATH,
              page_name: getPageName(),
              plan_name: plan.plan_name,
              amount: amount
            });

            if (verifyResponse.data.success) {
              toast({
                title: "Payment Successful!",
                description: "Your subscription is now active",
              });
              navigate("/");
            } else {
              throw new Error(verifyResponse.data.message);
            }
          } catch (err) {
            toast({
              title: "Verification Failed",
              description: err.message,
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user?.full_name || "",
          email: user?.email || "",
          contact: user?.mobile || ""
        },
        theme: {
          color: "#D4AF37"
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      toast({
        title: "Payment Error",
        description: err.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const getPageName = () => {
    const pageNames = {
      "/abjad": "Abjad Kabir",
      "/vefkin-yapilisi": "Vefk",
      "/mizaan9": "Mizan",
      "/hadim": "Hadim",
    };
    return pageNames[DECODED_PAGE_PATH] || "Premium Page";
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
            Subscribe to {getPageName()}
          </h1>
          <p className="text-white/70">
            Choose a plan and pay securely with Razorpay
          </p>
        </motion.div>

        {/* Payment Methods Info */}
        <Card className="border-gold/20 bg-gold/5 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-gold" />
              <h3 className="text-white font-semibold">Secure Payment via Razorpay</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 text-white/80">
                <Check className="w-4 h-4 text-gold" />
                UPI (GPay, PhonePe, Paytm)
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Check className="w-4 h-4 text-gold" />
                Debit Cards
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Check className="w-4 h-4 text-gold" />
                Credit Cards
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Check className="w-4 h-4 text-gold" />
                Net Banking
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Check className="w-4 h-4 text-gold" />
                Wallets
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Check className="w-4 h-4 text-gold" />
                Instant Access
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pricing.map((plan, idx) => (
            <motion.div
              key={plan.plan_name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card 
                className={`border-white/10 bg-white/5 hover:border-gold/50 transition-all cursor-pointer ${
                  selectedPlan?.plan_name === plan.plan_name ? "border-gold bg-gold/10" : ""
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <CardHeader>
                  <CardTitle className="text-white">{plan.plan_name.replace("_", " ")}</CardTitle>
                  <CardDescription className="text-white/70">
                    {plan.plan_name === "LIFETIME" ? "One-time payment" : "Recurring access"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gold mb-2">
                    ₹{plan.price}
                  </div>
                  {plan.plan_name !== "LIFETIME" && (
                    <div className="text-xs text-white/60">
                      ₹{Math.round(plan.price / (plan.plan_name === "1_MONTH" ? 1 : plan.plan_name === "6_MONTHS" ? 6 : 12))}/month
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handlePayment(plan)}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay ₹{plan.price}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}