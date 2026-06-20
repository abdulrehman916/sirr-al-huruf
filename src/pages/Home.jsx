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
        {/* Full-screen mobile-first wrapper — edge-to-edge layout */}
        <div className="relative w-full" style={{
          minHeight: "100dvh",
          width: "100vw",
          maxWidth: "100vw",
          margin: 0,
          padding: 0,
          flex: "1 1 auto",
          overflowX: "hidden",
        }}>
          <MysticalBackground mouse={mouse} />
          {/* Hero section — full width, no centered container */}
          <div className="w-full" style={{ maxWidth: "100vw", margin: 0, padding: 0 }}>
            <HeroSection mouse={mouse} />
          </div>
          {/* Cards section — edge-to-edge on mobile */}
          <div className="w-full" style={{ maxWidth: "100vw", margin: 0, paddingLeft: "4px", paddingRight: "4px" }}>
            <CardsSection />
          </div>
        </div>
      </PullToRefresh>
    </PageLayout>
  );
}