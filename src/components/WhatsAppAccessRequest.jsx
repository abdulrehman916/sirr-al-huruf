import { useState, lazy, Suspense } from "react";
import { MessageCircle, CheckCircle, KeyRound } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { ADMIN_CONFIG } from "@/lib/adminConfig";

const RedeemCodeModal = lazy(() => import("@/components/RedeemCodeModal"));

/**
 * WhatsAppAccessRequest — opens WhatsApp with a pre-filled message.
 * No auth required.
 */
export default function WhatsAppAccessRequest({ pageName, routePath }) {
  const [submitted, setSubmitted] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);

  const handleRequest = () => {
    const message =
      `السلام عليكم\n\n` +
      `*Access Request — Sirr al-Huruf*\n\n` +
      `📄 Page: ${pageName}\n` +
      `🔗 Path: ${routePath}\n\n` +
      `Please send me the reading code for this page.`;
    const url = `https://wa.me/${ADMIN_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setSubmitted(true);
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
        Request Sent — Check WhatsApp
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 w-full">
        <button
          onClick={handleRequest}
          className="w-full py-3.5 rounded-xl font-inter font-bold text-sm flex items-center justify-center gap-2 transition-all"
          style={{
            background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
            color: "#ffffff",
            boxShadow: "0 0 24px rgba(37,211,102,0.35)",
          }}
        >
          <MessageCircle className="w-4 h-4" />
          Request Access via WhatsApp
        </button>

        <button
          onClick={() => setShowRedeem(true)}
          className="w-full py-3 rounded-xl font-inter font-semibold text-sm flex items-center justify-center gap-2"
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