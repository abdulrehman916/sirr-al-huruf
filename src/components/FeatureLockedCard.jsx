/**
 * FeatureLockedCard — Professional locked screen shown when a user clicks
 * a feature they don't have permission for.
 *
 * All displayed content comes from the database:
 * - Feature name & description: FeatureConfig entity
 * - Subscription plans & prices: SubscriptionPlanConfig entity
 *
 * User selects a plan card, then sees WhatsApp Contact + Redeem Access Code.
 * Fully dynamic — admin changes appear immediately, zero hardcoded values.
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, MessageCircle, KeyRound, CheckCircle, AlertCircle, Loader2, ChevronLeft, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { ADMIN_CONFIG } from "@/lib/adminConfig";
import { getSessionId, mergeGrantedPermissions } from "@/lib/sessionId";
import { getFeatureConfig } from "@/lib/featureConfigCache";
import { getFeaturePlans, formatPlan } from "@/lib/subscriptionPlanCache";
import { getFeatureById } from "@/lib/featureRegistry";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)",
};

export default function FeatureLockedCard({ pagePath, featureId, featureLabel, onBack, onUnlocked }) {
  const [config, setConfig] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCodeEntry, setShowCodeEntry] = useState(false);
  const [code, setCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [codeResult, setCodeResult] = useState(null);
  const [creatingRequest, setCreatingRequest] = useState(false);
  const [requestCreated, setRequestCreated] = useState(false);

  // Fetch both FeatureConfig (description) and SubscriptionPlanConfig (plans) in parallel
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [cfg, planList] = await Promise.all([
        getFeatureConfig(pagePath, featureId),
        getFeaturePlans(pagePath, featureId),
      ]);
      if (!cancelled) {
        setConfig(cfg);
        setPlans(planList);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [pagePath, featureId]);

  // Display values: DB config takes priority, registry fallback
  const registryFeat = getFeatureById(pagePath, featureId);
  const displayName = config?.feature_name || featureLabel || registryFeat?.label || featureId;
  const displayIcon = config?.icon || registryFeat?.icon || "🔒";
  const displayDescription = config?.description || null;

  const handleRedeem = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setRedeeming(true);
    setCodeResult(null);
    try {
      const sessionId = getSessionId();
      const res = await base44.functions.invoke("redeemCodeGuest", {
        code: trimmed,
        session_id: sessionId,
      });
      const data = res.data;
      if (data?.success && data?.permissions) {
        mergeGrantedPermissions(data.permissions);
        setCodeResult({ success: true, message: data.message });
        setTimeout(() => {
          if (onUnlocked) onUnlocked();
          else window.location.reload();
        }, 1200);
      } else {
        setCodeResult({ success: false, message: data?.message || "Invalid code." });
      }
    } catch (e) {
      setCodeResult({ success: false, message: e.message || "Redemption failed." });
    } finally {
      setRedeeming(false);
    }
  };

  const handleRequestAccess = async () => {
    setCreatingRequest(true);
    setCodeResult(null);
    try {
      const planLine = selectedPlan ? formatPlan(selectedPlan) : "Contact for pricing";
      const priceLine = selectedPlan ? `${selectedPlan.currency} ${selectedPlan.price}` : "";
      const messageText = `Plan: ${planLine}${priceLine ? ` | Price: ${priceLine}` : ""}`;

      await base44.functions.invoke("submitAccessRequest", {
        name: "",
        phone: "",
        email: "",
        page_path: pagePath,
        page_name: displayName,
        message: messageText,
      });

      setRequestCreated(true);
    } catch (e) {
      setCodeResult({ success: false, message: "Failed to send request. Please try again." });
    } finally {
      setCreatingRequest(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-sm mx-auto space-y-4"
    >
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-inter text-xs font-semibold"
          style={{ background: "rgba(212,175,55,0.06)", border: `1px solid ${G.border}`, color: G.text }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      )}

      <div className="rounded-2xl border p-6 text-center" style={{
        background: G.bg, borderColor: G.border, boxShadow: "0 0 48px rgba(212,175,55,0.10)",
      }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: G.bgHi, border: `1px solid ${G.border}` }}>
          <Lock className="w-7 h-7" style={{ color: G.text }} />
        </div>

        <p className="font-inter text-xs text-white/30 uppercase tracking-widest mb-1">
          {displayIcon} {displayName}
        </p>

        {displayDescription && (
          <p className="font-inter text-sm text-white/50 mb-3 leading-relaxed px-2">
            {displayDescription}
          </p>
        )}

        {/* Plans as selectable cards */}
        <div className="mb-5 mt-3">
          {loading ? (
            <div className="w-6 h-6 border-2 border-t-yellow-400 border-r-transparent border-b-yellow-400 border-l-transparent rounded-full animate-spin mx-auto" />
          ) : plans.length > 0 ? (
            <div className="space-y-1.5">
              <p className="font-inter text-[10px] text-white/30 uppercase tracking-widest mb-2">
                {selectedPlan ? "Selected Plan" : "Select a plan to unlock"}
              </p>
              {plans.map(plan => {
                const isSelected = selectedPlan?.plan_config_id === plan.plan_config_id;
                return (
                  <button
                    key={plan.plan_config_id}
                    onClick={() => setSelectedPlan(isSelected ? null : plan)}
                    className="w-full rounded-lg border py-2.5 px-3 flex items-center justify-between transition-all"
                    style={{
                      background: isSelected ? "rgba(212,175,55,0.18)" : "rgba(212,175,55,0.04)",
                      borderColor: isSelected ? G.borderHi : "rgba(212,175,55,0.20)",
                      boxShadow: isSelected ? "0 0 16px rgba(212,175,55,0.15)" : "none",
                    }}
                  >
                    <span className="font-inter text-sm text-white/80 font-medium flex items-center gap-2">
                      {isSelected && <Check className="w-3.5 h-3.5" style={{ color: G.text }} />}
                      {plan.plan_name}
                    </span>
                    <span className="font-inter text-sm font-bold" style={{ color: G.text }}>
                      {plan.currency} {plan.price}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="font-inter text-xs text-white/35">Contact for pricing</p>
          )}
        </div>

        {/* Request Access + Redeem — shown after plan selection (or immediately if no plans) */}
        {(selectedPlan || plans.length === 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            style={{ overflow: "hidden" }}
          >
            {!requestCreated ? (
              <button
                onClick={handleRequestAccess}
                disabled={creatingRequest}
                className="w-full py-3.5 rounded-xl font-inter font-bold text-sm flex items-center justify-center gap-2 mb-3 disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #f6d860 0%, #c98a14 100%)",
                  color: "#0d1b2a",
                  boxShadow: "0 0 24px rgba(212,175,55,0.30)",
                }}
              >
                {creatingRequest ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                {creatingRequest ? "Sending…" : "Request Access"}
              </button>
            ) : (
              <div className="rounded-xl border p-4 mb-3" style={{ background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.30)" }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-inter font-bold text-sm text-green-400">Request Sent!</span>
                </div>
                <p className="font-inter text-xs text-white/50 text-center leading-relaxed">
                  The admin will contact you on WhatsApp ({ADMIN_CONFIG.WHATSAPP_DISPLAY}) shortly with payment details and next steps.
                </p>
              </div>
            )}

            <button
              onClick={() => setShowCodeEntry(v => !v)}
              className="w-full py-3 rounded-xl font-inter font-semibold text-sm flex items-center justify-center gap-2"
              style={{ background: "rgba(212,175,55,0.07)", border: `1px solid ${G.border}`, color: G.text }}
            >
              <KeyRound className="w-4 h-4" />
              {showCodeEntry ? "Hide Code Entry" : "I Have a Reading Code"}
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showCodeEntry && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div className="rounded-2xl border p-5 space-y-4" style={{
              background: "linear-gradient(145deg, #0c1630 0%, #060c1c 100%)", borderColor: G.borderHi,
            }}>
              <h3 className="font-inter font-bold text-white text-sm flex items-center gap-2">
                <KeyRound className="w-4 h-4" style={{ color: G.text }} />
                Enter Access Code
              </h3>

              {codeResult && (
                <div className="rounded-xl border p-3 flex items-start gap-2" style={{
                  background: codeResult.success ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                  borderColor: codeResult.success ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)",
                }}>
                  {codeResult.success
                    ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    : <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                  <p className={`text-xs ${codeResult.success ? "text-green-300" : "text-red-300"}`}>
                    {codeResult.message}
                  </p>
                </div>
              )}

              <input
                value={code}
                onChange={e => { setCode(e.target.value.toUpperCase()); setCodeResult(null); }}
                onKeyDown={e => e.key === "Enter" && !redeeming && handleRedeem()}
                placeholder="e.g. ACCESS-1234"
                className="w-full px-4 py-3 rounded-xl text-white font-bold text-base text-center tracking-[0.15em] outline-none placeholder-white/20"
                style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}`, fontSize: "16px" }}
                autoCapitalize="characters" autoComplete="off" spellCheck={false}
              />

              <button
                onClick={handleRedeem}
                disabled={redeeming || !code.trim()}
                className="w-full py-3.5 rounded-xl font-inter font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #f6d860 0%, #c98a14 100%)", color: "#0d1b2a" }}
              >
                {redeeming ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                {redeeming ? "Verifying…" : "Activate Code"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}