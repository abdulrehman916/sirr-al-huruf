import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ScrollText, ShieldCheck } from "lucide-react";
import MysticalBackground from "../components/MysticalBackground";
import HeroSection from "../components/HeroSection";
import CardsSection from "../components/CardsSection";
import PageLayout from "../components/PageLayout";
import PullToRefresh from "../components/PullToRefresh";
import useMouseParallax from "../hooks/useMouseParallax";
import { useAuth } from "@/lib/AuthContext";
import NavDebugPanel from "@/components/NavDebugPanel";

// ── Build version marker — bump this string on every source change so the
//    APK can be visually verified against the latest commit. If this string
//    is missing or shows an old value, the APK was not built from latest source.
export const BUILD_VERSION = "Build 2026-07-04-02";

export default function Home() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const mouse = useMouseParallax(1);

  const handleRefresh = () => new Promise(res => setTimeout(res, 800));

  return (
    <PageLayout>
      <PullToRefresh onRefresh={handleRefresh}>
        {/* ═══ HOME PAGE CONTENT — SCROLL HANDLED BY PageLayout ═══
            Removed local scroll wrapper to prevent nested scroll containers
        ═══════════════════════════════════════════════════════════════ */}
        
        {/* Absolute background layer — prevents viewport shift */}
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}>
          <MysticalBackground mouse={mouse} />
        </div>
        
        {/* Content layer — scrolls with PageLayout container */}
        <div className="relative z-10" style={{
          minHeight: "100%",
          width: "100%",
        }}>
          {/* Hero section — edge-to-edge, no padding */}
          <div style={{ width: "100%", margin: 0, padding: 0 }}>
            <HeroSection mouse={mouse} />
          </div>
          
          {/* Cards section — CardsSection handles its own responsive padding */}
          <div style={{ width: "100%", margin: 0, padding: 0 }}>
            <CardsSection />
          </div>
        </div>
      </PullToRefresh>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate("/rules-conditions")}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg"
        style={{
          background: "linear-gradient(135deg, #f6d860 0%, #c98a14 100%)",
          boxShadow: "0 4px 24px rgba(212,175,55,0.35), 0 0 48px rgba(212,175,55,0.15)",
        }}
      >
        <ScrollText className="w-5 h-5" style={{ color: "#0d1b2a" }} />
        <span className="font-inter font-bold text-sm" style={{ color: "#0d1b2a" }}>
          Rules
        </span>
      </motion.button>

      {/* Owner / Admin login entry — visible only to guests (not authenticated).
          Once the Owner logs in, the admin nav button appears in the top bar. */}
      {role === "guest" && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => navigate("/login")}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg"
          style={{
            background: "rgba(8,16,38,0.92)",
            border: "1px solid rgba(212,175,55,0.45)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.45), 0 0 32px rgba(212,175,55,0.12)",
          }}
        >
          <ShieldCheck className="w-5 h-5" style={{ color: "#D4AF37" }} />
          <span className="font-inter font-bold text-sm" style={{ color: "#D4AF37" }}>
            Owner / Admin Login
          </span>
        </motion.button>
      )}

      {/* TEMPORARY NAV DEBUG — remove after SHOP ADMIN investigation */}
      <NavDebugPanel />

      {/* Build version marker — always visible so the APK can be verified
          against the latest source commit. */}
      <div
        className="fixed top-14 left-2 z-50 px-2 py-1 rounded-md font-inter text-[10px] font-semibold tracking-wide pointer-events-none"
        style={{
          background: "rgba(2,6,16,0.85)",
          border: "1px solid rgba(212,175,55,0.30)",
          color: "rgba(212,175,55,0.85)",
        }}
      >
        {BUILD_VERSION}
      </div>
    </PageLayout>
  );
}