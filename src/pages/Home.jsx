import { Link } from "react-router-dom";
import { ScrollText } from "lucide-react";
import MysticalBackground from "../components/MysticalBackground";
import HeroSection from "../components/HeroSection";
import CardsSection from "../components/CardsSection";
import PageLayout from "../components/PageLayout";
import PullToRefresh from "../components/PullToRefresh";
import useMouseParallax from "../hooks/useMouseParallax";
import RedeemCodeButton from "../components/RedeemCodeButton";

export default function Home() {
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

          {/* Rules & Conditions — permanent access button */}
          <div style={{ width: "100%", textAlign: "center", padding: "16px 16px 32px" }}>
            <Link to="/rules-conditions"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-inter text-xs font-semibold tracking-wide transition-all"
              style={{
                background: "rgba(212,175,55,0.08)",
                border: "1px solid rgba(212,175,55,0.25)",
                color: "rgba(212,175,55,0.80)",
              }}>
              <ScrollText className="w-3.5 h-3.5" />
              Rules & Conditions
            </Link>
          </div>
        </div>
      </PullToRefresh>
      <RedeemCodeButton />
    </PageLayout>
  );
}