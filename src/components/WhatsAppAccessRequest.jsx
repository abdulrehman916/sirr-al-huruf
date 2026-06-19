import { useState, useEffect, lazy, Suspense } from "react";
import { MessageCircle, CheckCircle, KeyRound, AlertCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { ADMIN_CONFIG } from "@/lib/adminConfig";

const RedeemCodeModal = lazy(() => import("@/components/RedeemCodeModal"));

/**
 * WhatsAppAccessRequest — opens WhatsApp with a pre-filled message containing
 * the user's name, email, and requested page. Submits an AccessRequest record
 * to the DB so the admin can see it in AdminAccessRequests.
 */
export default function WhatsAppAccessRequest({ pageName, routePath }) {
  const [user, setUser] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const [dbError, setDbError] = useState("");

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleRequest = async () => {
    setLoading(true);
    setDbError("");
    try {
      // 1. Save AccessRequest record for admin visibility
      const requestId = "REQ-" + Date.now();
      await base44.entities.AccessRequest.create({
        request_id: requestId,
        user_id: user?.id || "",
        name: user?.full_name || "Unknown",
        phone: "",
        email: user?.email || "",
        page_path: routePath,
        page_name: pageName,
        message: "WhatsApp access request",
        status: "PENDING",
        requested_at: new Date().toISOString(),
      });

      // 2. Build WhatsApp message
      const name = user?.full_name || "Unknown User";
      const email = user?.email || "No email";
      const message =
        `السلام عليكم\n\n` +
        `*Access Request — Sirr al-Huruf*\n\n` +
        `👤 Name: ${name}\n` +
        `📧 Email: ${email}\n` +
        `📄 Page: ${pageName}\n` +
        `🔗 Path: ${routePath}\n\n` +
        `Please grant me access to this page.`;

      const url = `https://wa.me/${ADMIN_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
      setSubmitted(true);
    } catch (err) {
      // DB save failed — show error, do NOT silently continue
      setDbError("Failed to save your request. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="w-full py-3.5 rounded-xl font-inter font-semibold text-sm flex items-center justify-center gap-2"
        style={{
          background: "rgba(37,211,102,0.12)",
          border: "1px solid rgba(37,211,102,0.40)",
          color: "#25D366",
        }}
      >
        <CheckCircle className="w-4 h-4" />
        Request Sent — Awaiting Admin Approval
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 w-full">
        {dbError && (
          <div className="flex items-start gap-2 p-3 rounded-xl"
            style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.35)" }}>
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-300">{dbError}</p>
          </div>
        )}
        <button
          onClick={handleRequest}
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-inter font-bold text-sm flex items-center justify-center gap-2 transition-all"
          style={{
            background: loading
              ? "rgba(37,211,102,0.08)"
              : "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
            color: loading ? "#25D366" : "#ffffff",
            border: loading ? "1px solid rgba(37,211,102,0.40)" : "none",
            boxShadow: loading ? "none" : "0 0 24px rgba(37,211,102,0.35)",
            opacity: loading ? 0.7 : 1,
          }}
        >
          <MessageCircle className="w-4 h-4" />
          {loading ? "Opening WhatsApp..." : "Request Access via WhatsApp"}
        </button>

        <button
          onClick={() => setShowRedeem(true)}
          className="w-full py-3 rounded-xl font-inter font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          style={{
            background: "rgba(212,175,55,0.08)",
            border: "1px solid rgba(212,175,55,0.35)",
            color: "#F5D060",
          }}
        >
          <KeyRound className="w-4 h-4" />
          Have a Code? Redeem it
        </button>
      </div>

      <AnimatePresence>
        {showRedeem && (
          <Suspense fallback={null}>
            <RedeemCodeModal onClose={() => setShowRedeem(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
}