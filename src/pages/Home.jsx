import MysticalBackground from "../components/MysticalBackground";
import HeroSection from "../components/HeroSection";
import CardsSection from "../components/CardsSection";
import PageLayout from "../components/PageLayout";
import PullToRefresh from "../components/PullToRefresh";
import useMouseParallax from "../hooks/useMouseParallax";

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
        </div>
      </PullToRefresh>
    </PageLayout>
  );
}