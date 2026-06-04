import MysticalBackground from "../components/MysticalBackground";
import HeroSection from "../components/HeroSection";
import PageLayout from "../components/PageLayout";
import useMouseParallax from "../hooks/useMouseParallax";

// Single shared useMouseParallax instance — eliminates duplicate
// rAF loops and mousemove listeners that MysticalBackground, HeroSection,
// and SacredWheel were each creating independently.
export default function Home() {
  const mouse = useMouseParallax(1);

  return (
    <PageLayout>
      <div className="relative -mx-4 -mt-6">
        <MysticalBackground mouse={mouse} />
        <HeroSection mouse={mouse} />
      </div>
    </PageLayout>
  );
}