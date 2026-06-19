import { useState, useEffect } from "react";
import { MessageCircle, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { ADMIN_CONFIG } from "@/lib/adminConfig";

/**
 * WhatsAppAccessRequest — opens WhatsApp with a pre-filled message containing
 * the user's name, email, and requested page. Submits an AccessRequest record
 * to the DB so the admin can see it in AdminAccessRequests.
 */
export default function WhatsAppAccessRequest({ pageName, routePath }) {
  const [user, setUser] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleRequest = async () => {
    setLoading(true);
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
    } catch {
      // Even if DB save fails, still open WhatsApp
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
  );
}