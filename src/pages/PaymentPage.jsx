import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Loader2, CheckCircle, Globe, MapPin } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageLayout from "@/components/PageLayout";
import PageTitle from "@/components/PageTitle";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const G = {
  border: "rgba(212,175,55,0.35)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.06)",
  bgHi: "rgba(212,175,55,0.14)",
};

const DURATION_OPTIONS = [
  { value: "1_MONTH", label: "1 Month", labelShort: "/ mo" },
  { value: "6_MONTHS", label: "6 Months", labelShort: "/ 6mo" },
  { value: "1_YEAR", label: "1 Year", labelShort: "/ yr" },
  { value: "LIFETIME", label: "Lifetime", labelShort: "" },
];

export default function PaymentPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [plan, setPlan] = useState(null);
  const [duration, setDuration] = useState("1_MONTH");
  const [gateway, setGateway] = useState("razorpay"); // razorpay | stripe
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => navigate("/otp-login"));
  }, [navigate]);

  useEffect(() => {
    if (planId) {
      loadPlan();
    }
  }, [planId]);

  const loadPlan = async () => {
    setLoading(true);
    try {
      const plans = await base44.entities.SubscriptionPlan.filter({ plan_id: planId, is_active: true });
      if (plans.length === 0) {
        toast({ title: "Plan not found", variant: "destructive" });
        navigate("/my-subscription");
        return;
      }
      setPlan(plans[0]);
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
      navigate("/my-subscription");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!plan || !user) return;
    setProcessing(true);

    const priceKey = { "1_MONTH": "price_monthly", "6_MONTHS": "price_6months", "1_YEAR": "price_yearly", "LIFETIME": "price_lifetime" };
    const amount = plan[priceKey[duration]];

    try {
      if (gateway === "razorpay") {
        // Razorpay flow
        const orderRes = await base44.functions.invoke("createRazorpayOrder", {
          amount,
          page_path: `/plan/${plan.plan_id}`,
          page_name: `${plan.plan_name} Plan`,
          plan_name: duration,
        });

        if (!orderRes.data?.success) throw new Error(orderRes.data?.message || "Failed to create order");

        const { order_id, key_id } = orderRes.data;

        // Load Razorpay script
        if (!window.Razorpay) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        const options = {
          key: key_id,
          amount: amount * 100,
          currency: "INR",
          name: "Occult Encyclopedia",
          description: `${plan.plan_name} - ${duration}`,
          order_id,
          handler: async (response) => {
            try {
              const verifyRes = await base44.functions.invoke("verifyRazorpayPayment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan_id: plan.plan_id,
                duration,
                amount,
                currency: "INR",
              });

              if (verifyRes.data?.success) {
                toast({ title: "✓ Payment Successful!", description: "Access granted instantly." });
                navigate("/my-subscription");
              } else {
                throw new Error(verifyRes.data?.message || "Verification failed");
              }
            } catch (err) {
              toast({ title: "Verification Failed", description: err.message, variant: "destructive" });
            }
          },
          prefill: {
            name: user.full_name || "",
            email: user.email || "",
            contact: user.mobile || "",
          },
          theme: { color: "#D4AF37" },
          modal: {
            ondismiss: () => setProcessing(false),
          },
        };

        new window.Razorpay(options).open();
      } else {
        // Stripe Checkout redirect flow
        const checkoutRes = await base44.functions.invoke("createStripePaymentIntent", {
          plan_id: plan.plan_id,
          duration,
          amount,
          currency: plan.currency || "USD",
          return_url: window.location.origin + "/my-subscription",
        });

        if (!checkoutRes.data?.success) throw new Error(checkoutRes.data?.message || "Failed to create checkout");

        const { checkout_url } = checkoutRes.data;

        if (checkout_url) {
          // Redirect to Stripe Checkout — callback handled by verifyStripePayment webhook
          window.location.href = checkout_url;
        } else {
          throw new Error("No checkout URL returned");
        }
      }
    } catch (e) {
      toast({ title: "Payment Error", description: e.message, variant: "destructive" });
      setProcessing(false);
    }
  };

  if (loading || !user) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (!plan) return null;

  const priceKey = { "1_MONTH": "price_monthly", "6_MONTHS": "price_6months", "1_YEAR": "price_yearly", "LIFETIME": "price_lifetime" };
  const price = plan[priceKey[duration]];
  const planColor = plan.color || "#F5D060";

  return (
    <PageLayout>
      <PageTitle arabic="الدفع" latin="Payment" subtitle="Secure Checkout" icon="💳" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-10">
        
        {/* Plan Summary */}
        <div className="rounded-xl border p-5" style={{ background: G.bg, borderColor: `${planColor}40` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-inter font-bold text-white text-lg">{plan.plan_name} Plan</h2>
              <p className="text-sm text-white/45 mt-1">{plan.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(plan.page_paths || []).slice(0, 5).map(path => (
                  <span key={path} className="px-2 py-0.5 rounded text-xs" style={{ background: `${planColor}12`, color: planColor, border: `1px solid ${planColor}30` }}>
                    {path.replace(/\//g, '')}
                  </span>
                ))}
                {(plan.page_paths || []).length > 5 && (
                  <span className="px-2 py-0.5 rounded text-xs text-white/40" style={{ border: `1px solid ${G.border}` }}>
                    +{(plan.page_paths || []).length - 5} more
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold" style={{ color: planColor }}>
                {plan.currency || "INR"} {price}
              </p>
              <p className="text-xs text-white/35 mt-0.5">{DURATION_OPTIONS.find(d => d.value === duration)?.label}</p>
            </div>
          </div>
        </div>

        {/* Duration Selection */}
        <div>
          <h3 className="font-inter font-bold text-white text-sm mb-3">Duration</h3>
          <div className="grid grid-cols-2 gap-2">
            {DURATION_OPTIONS.map(opt => {
              const p = plan[priceKey[opt.value]];
              if (p === undefined || p === null || p === 0) return null;
              return (
                <button
                  key={opt.value}
                  onClick={() => setDuration(opt.value)}
                  className="p-3 rounded-xl text-left transition-all"
                  style={{
                    background: duration === opt.value ? `${planColor}18` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${duration === opt.value ? planColor + "66" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <p className="font-inter font-bold text-sm" style={{ color: duration === opt.value ? planColor : "rgba(255,255,255,0.70)" }}>
                    {opt.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: duration === opt.value ? planColor + "bb" : "rgba(255,255,255,0.35)" }}>
                    {plan.currency || "INR"} {p}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gateway Selection */}
        <div>
          <h3 className="font-inter font-bold text-white text-sm mb-3">Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setGateway("razorpay")}
              className="p-4 rounded-xl text-left transition-all"
              style={{
                background: gateway === "razorpay" ? "rgba(79, 164, 244, 0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${gateway === "razorpay" ? "rgba(79, 164, 244, 0.45)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(79, 164, 244, 0.15)" }}>
                  <MapPin className="w-4 h-4" style={{ color: "#4FA4F4" }} />
                </div>
                <span className="font-inter font-bold text-white text-sm">Razorpay</span>
              </div>
              <p className="text-xs text-white/40">India (INR)</p>
              <p className="text-xs text-white/30 mt-1">UPI, Cards, Net Banking</p>
            </button>

            <button
              onClick={() => setGateway("stripe")}
              className="p-4 rounded-xl text-left transition-all"
              style={{
                background: gateway === "stripe" ? "rgba(100, 115, 255, 0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${gateway === "stripe" ? "rgba(100, 115, 255, 0.45)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(100, 115, 255, 0.15)" }}>
                  <Globe className="w-4 h-4" style={{ color: "#6473FF" }} />
                </div>
                <span className="font-inter font-bold text-white text-sm">Stripe</span>
              </div>
              <p className="text-xs text-white/40">International (USD/EUR)</p>
              <p className="text-xs text-white/30 mt-1">Cards, Apple Pay, Google Pay</p>
            </button>
          </div>
        </div>

        {/* Payment Info */}
        <div className="rounded-xl border p-4" style={{ background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.25)" }}>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#4ade80" }} />
            <div>
              <p className="text-sm font-semibold text-white">Instant Access</p>
              <p className="text-xs text-white/40 mt-0.5">
                Your subscription activates immediately after payment. All pages in the {plan.plan_name} plan will be unlocked automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          disabled={processing || price === 0}
          className="w-full py-4 rounded-xl font-inter font-bold text-base"
          style={{
            background: `linear-gradient(135deg, ${planColor}, ${planColor}88)`,
            color: "#0d1b2a",
            opacity: processing ? 0.6 : 1,
          }}
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Pay {plan.currency || "INR"} {price}
            </>
          )}
        </Button>



      </motion.div>
    </PageLayout>
  );
}