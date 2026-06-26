import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings, MessageCircle, Info } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/components/ui/use-toast";

const G = {
  border: "rgba(212,175,55,0.40)",
  text: "#F5D060",
  bg: "rgba(212,175,55,0.07)",
};

export default function AdminSettings() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(null);
  const [whatsapp, setWhatsapp] = useState("+971500000000");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (!user || user.role !== "admin") { setIsAdmin(false); return; }
      setIsAdmin(true);
    }).catch(() => setIsAdmin(false));
  }, []);

  if (isAdmin === false) return <Navigate to="/" replace />;
  if (isAdmin === null) return (
    <AdminLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
      </div>
    </AdminLayout>
  );

  const handleSave = async () => {
    setSaving(true);
    // Settings saved locally for now (extend to backend as needed)
    await new Promise(r => setTimeout(r, 600));
    toast({ title: "Settings saved" });
    setSaving(false);
  };

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-xl">
        <div>
          <h1 className="font-inter text-xl font-bold text-white">Settings</h1>
          <p className="font-inter text-xs text-white/40 mt-0.5">Admin configuration options</p>
        </div>

        {/* WhatsApp Contact Number */}
        <div className="rounded-xl border p-5 space-y-3" style={{ background: G.bg, borderColor: G.border }}>
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle className="w-4 h-4" style={{ color: "#25D166" }} />
            <span className="font-inter text-sm font-bold text-white">WhatsApp Contact Number</span>
          </div>
          <p className="font-inter text-xs text-white/40">
            This number is shown to users on locked premium pages to request access.
          </p>
          <input
            value={whatsapp}
            onChange={e => setWhatsapp(e.target.value)}
            placeholder="+971500000000"
            className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}`, fontSize: 16 }}
          />
        </div>

        {/* Payment method info */}
        <div className="rounded-xl border p-5 space-y-2"
          style={{ background: "rgba(37,209,102,0.05)", borderColor: "rgba(37,209,102,0.25)" }}>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-green-400" />
            <span className="font-inter text-sm font-bold text-green-300">Payment Method</span>
          </div>
          <p className="font-inter text-xs text-white/50 leading-relaxed">
            All payments are processed manually via WhatsApp. No payment gateway is configured.
            After payment confirmation, issue a Reading Code via the <strong className="text-white/70">Reading Codes</strong> section.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl font-inter font-bold text-sm disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#f6d860,#c98a14)", color: "#0d1b2a" }}
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </motion.div>
    </AdminLayout>
  );
}