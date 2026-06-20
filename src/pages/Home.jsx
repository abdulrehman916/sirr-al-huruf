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
        {/* ═══ HOME PAGE LOCAL FULL-SCREEN WRAPPER ═══
            Page-local solution to achieve 100vh full-screen layout
            without modifying PageLayout (isolation law compliant)
        ═══════════════════════════════════════════════════ */}
        <div className="relative w-full" style={{
          height: "100dvh",
          width: "100vw",
          maxWidth: "100vw",
          margin: 0,
          padding: 0,
          overflowX: "hidden",
          overflowY: "auto",
          position: "relative",
        }}>
          {/* Absolute background layer — prevents viewport shift */}
          <div style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}>
            <MysticalBackground mouse={mouse} />
          </div>
          
          {/* Content layer — scrolls naturally over background */}
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
        </div>
      </PullToRefresh>
    </PageLayout>
  );
}