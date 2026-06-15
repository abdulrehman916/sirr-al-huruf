import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Upload, CreditCard, Clock, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";

const PLANS = [
  { id: "1_MONTH", name: "1 Month", duration: 30 },
  { id: "6_MONTHS", name: "6 Months", duration: 180 },
  { id: "1_YEAR", name: "1 Year", duration: 365 },
  { id: "LIFETIME", name: "Lifetime", duration: 99999 },
];

export default function SubscriptionPayment() {
  const { pagePath } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pricing, setPricing] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const DECODED_PAGE_PATH = decodeURIComponent(pagePath || "");

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => navigate("/otp-login"));
  }, [navigate]);

  useEffect(() => {
    if (DECODED_PAGE_PATH) {
      fetchPricing();
    }
  }, [DECODED_PAGE_PATH]);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await base44.integrations.Core.UploadFile({ file });
      setPaymentProof(response.file_url);
      toast({
        title: "Upload Successful",
        description: "Payment proof uploaded",
      });
    } catch (err) {
      toast({
        title: "Upload Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitSubscription = async () => {
    if (!selectedPlan || !paymentProof || !transactionId || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields and upload payment proof",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await base44.functions.invoke("createPageSubscription", {
        user_id: user.id,
        page_path: DECODED_PAGE_PATH,
        page_name: getPageName(),
        plan_name: selectedPlan.plan_name,
        price: selectedPlan.price,
        currency: selectedPlan.currency,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        payment_proof_url: paymentProof
      });

      if (response.data.success) {
        toast({
          title: "Subscription Submitted",
          description: "Your subscription is pending admin approval",
        });
        navigate("/subscription-pending");
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to create subscription",
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
            Choose a plan and upload payment proof for instant access
          </p>
        </motion.div>

        {/* Plan Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {pricing.map((plan, idx) => (
            <motion.div
              key={plan.plan_name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all ${
                  selectedPlan?.plan_name === plan.plan_name
                    ? "border-gold bg-gold/10"
                    : "border-white/10 hover:border-gold/50"
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
                  <div className="text-3xl font-bold text-gold">
                    {plan.price} {plan.currency}
                  </div>
                </CardContent>
                {selectedPlan?.plan_name === plan.plan_name && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-5 h-5 text-gold" />
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">Payment Details</CardTitle>
                <CardDescription className="text-white/70">
                  Upload proof of payment to activate your subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Payment Method */}
                <div className="space-y-2">
                  <Label className="text-white">Payment Method</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Bank Transfer", "Cash App", "Crypto", "Other"].map((method) => (
                      <Button
                        key={method}
                        type="button"
                        variant={paymentMethod === method ? "default" : "outline"}
                        className="h-12"
                        onClick={() => setPaymentMethod(method)}
                      >
                        {method}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Transaction ID */}
                <div className="space-y-2">
                  <Label htmlFor="transactionId" className="text-white">
                    Transaction ID / Reference Number
                  </Label>
                  <Input
                    id="transactionId"
                    placeholder="e.g., TXN123456789"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="h-12 bg-white/5 border-white/10 text-white"
                  />
                </div>

                {/* Payment Proof Upload */}
                <div className="space-y-2">
                  <Label className="text-white">Upload Payment Proof</Label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-white/50" />
                    <p className="text-white/70 text-sm mb-2">
                      Upload screenshot of payment/transaction
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="paymentProof"
                    />
                    <Label htmlFor="paymentProof" asChild>
                      <Button variant="outline" disabled={uploading}>
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          "Choose File"
                        )}
                      </Button>
                    </Label>
                    {paymentProof && (
                      <p className="text-green-500 text-sm mt-2">
                        ✓ File uploaded successfully
                      </p>
                    )}
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-white font-medium text-sm">Admin Verification Required</h4>
                      <p className="text-white/70 text-xs mt-1">
                        Your subscription will be activated within 24 hours after admin verifies the payment proof.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full h-12"
                  onClick={handleSubmitSubscription}
                  disabled={loading || !paymentProof || !transactionId || !paymentMethod}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Submit for {selectedPlan.price} {selectedPlan.currency}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}