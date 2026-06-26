import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, ChevronLeft, Shield } from "lucide-react";
import PageLayout from "@/components/PageLayout";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  text: "#F5D060",
  bg: "rgba(212,175,55,0.06)",
};

export default function PaymentPage() {
  const navigate = useNavigate();

  const handleWhatsApp = () => {
    const message = encodeURIComponent("السلام عليكم، أرغب في الحصول على صلاحية الوصول إلى الصفحات المميزة في تطبيق سر الحروف.");
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto py-12 space-y-6"
      >
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Card */}
        <div
          className="rounded-2xl border p-8 text-center space-y-6"
          style={{
            background: "linear-gradient(145deg, rgba(8,20,52,0.98), rgba(4,12,34,0.99))",
            borderColor: G.borderHi,
            boxShadow: "0 0 60px rgba(212,175,55,0.18)",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.35)" }}
          >
            <MessageCircle className="w-8 h-8" style={{ color: "#25D166" }} />
          </div>

          <div>
            <h1 className="font-amiri text-2xl font-bold text-white mb-2">للوصول إلى المحتوى المميز</h1>
            <p className="font-inter text-sm text-white/55 leading-relaxed">
              يتم تفعيل الوصول يدوياً عبر واتساب فقط.
              تواصل معنا لطلب رمز القراءة الخاص بك.
            </p>
          </div>

          <div
            className="rounded-xl border p-4 text-sm text-white/60 text-right space-y-1"
            style={{ background: G.bg, borderColor: G.border }}
          >
            <p className="font-amiri text-base text-white/80">كيفية الحصول على الوصول:</p>
            <p>١. تواصل معنا عبر واتساب</p>
            <p>٢. أخبرنا بالصفحات التي تريد الوصول إليها</p>
            <p>٣. بعد التحقق، ستحصل على رمز وصول خاص</p>
            <p>٤. أدخل الرمز في شاشة تأمين الصفحة</p>
          </div>

          <button
            onClick={handleWhatsApp}
            className="w-full py-4 rounded-xl font-inter font-bold text-base flex items-center justify-center gap-3 transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #25D166, #1aab52)",
              color: "#fff",
              boxShadow: "0 0 32px rgba(37,211,102,0.35)",
            }}
          >
            <MessageCircle className="w-5 h-5" />
            تواصل عبر واتساب
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-white/30">
            <Shield className="w-3.5 h-3.5" />
            <span>الدفع والتحقق يدوي عبر واتساب فقط</span>
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
}