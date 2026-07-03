/**
 * FeatureLockedCard — Professional locked screen shown when a user clicks
 * a feature they don't have permission for.
 *
 * All displayed content (name, price, description) comes from the FeatureConfig
 * database entity — fully dynamic, admin-configurable, zero hardcoded values.
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, MessageCircle, KeyRound, CheckCircle, AlertCircle, Loader2, ChevronLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { ADMIN_CONFIG } from "@/lib/adminConfig";
import { getSessionId, mergeGrantedPermissions } from "@/lib/sessionId";
import { getFeatureConfig } from "@/lib/featureConfigCache";
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
  const [loading, setLoading] = useState(true);
  const [showCodeEntry, setShowCodeEntry] = useState(false);
  const [code, setCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [codeResult, setCodeResult] = useState(null);
  const [whatsappSent, setWhatsappSent] = useState(false);

  // Fetch dynamic config from FeatureConfig entity
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cfg = await getFeatureConfig(pagePath, featureId);
      if (!cancelled) { setConfig(cfg); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [pagePath, featureId]);

  // Display values: DB config takes priority, registry fallback
  const registryFeat = getFeatureById(pagePath, featureId);
  const displayName = config?.feature_name || featureLabel || registryFeat?.label || featureId;
  const displayIcon = config?.icon || registryFeat?.icon || "🔒";
  const displayPrice = config?.price || null;
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

  const handleWhatsApp = () => {
    const message =
      `السلام عليكم\n\n` +
      `*طلب وصول — سر الحروف*\n\n` +
      `🔒 الميزة: ${displayName}\n` +
      (displayPrice ? `💰 السعر: ${displayPrice}\n` : "") +
      `\nأرجو إرسال رمز القراءة لهذه الميزة.`;
    const url = `https://wa.me/${ADMIN_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setWhatsappSent(true);
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

      <div className="rounded-2xl border p-8 text-center" style={{
        background: G.bg, borderColor: G.border, boxShadow: "0 0 48px rgba(212,175,55,0.10)",
      }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: G.bgHi, border: `1px solid ${G.border}` }}>
          <Lock className="w-8 h-8" style={{ color: G.text }} />
        </div>

        <p className="font-inter text-xs text-white/30 uppercase tracking-widest mb-2">
          {displayIcon} {displayName}
        </p>

        {displayDescription && (
          <p className="font-inter text-sm text-white/50 mb-3 leading-relaxed px-2">
            {displayDescription}
          </p>
        )}

        <div className="mb-6 mt-3">
          {loading ? (
            <div className="w-6 h-6 border-2 border-t-yellow-400 border-r-transparent border-b-yellow-400 border-l-transparent rounded-full animate-spin mx-auto" />
          ) : displayPrice ? (
            <p className="font-inter text-lg font-bold" style={{ color: G.text }}>
              {displayPrice}
            </p>
          ) : (
            <p className="font-inter text-xs text-white/35">Contact for pricing</p>
          )}
        </div>

        <button
          onClick={handleWhatsApp}
          className="w-full py-3.5 rounded-xl font-inter font-bold text-sm flex items-center justify-center gap-2 mb-3"
          style={{
            background: whatsappSent ? "rgba(37,211,102,0.12)" : "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
            color: whatsappSent ? "#25D366" : "#ffffff",
            border: whatsappSent ? "1px solid rgba(37,211,102,0.40)" : "none",
            boxShadow: whatsappSent ? "none" : "0 0 24px rgba(37,211,102,0.30)",
          }}
        >
          {whatsappSent ? <CheckCircle className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
          {whatsappSent ? "Sent!" : "Contact on WhatsApp"}
        </button>

        <p className="font-inter text-xs text-white/25 mb-4">{ADMIN_CONFIG.WHATSAPP_DISPLAY}</p>

        <button
          onClick={() => setShowCodeEntry(v => !v)}
          className="w-full py-3 rounded-xl font-inter font-semibold text-sm flex items-center justify-center gap-2"
          style={{ background: "rgba(212,175,55,0.07)", border: `1px solid ${G.border}`, color: G.text }}
        >
          <KeyRound className="w-4 h-4" />
          {showCodeEntry ? "Hide Access Code Entry" : "I Have an Access Code"}
        </button>
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