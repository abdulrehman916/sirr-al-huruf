import MysticalBackground from "../components/MysticalBackground";
import HeroSection from "../components/HeroSection";
import PageLayout from "../components/PageLayout";
import useMouseParallax from "../hooks/useMouseParallax";

export default function Home() {
  const mouse = useMouseParallax(1);

  return (
    <PageLayout>
      {/* Background is fixed-position, fully out of layout flow */}
      <MysticalBackground mouse={mouse} />
      {/* HeroSection sits in normal document flow — cards scroll naturally */}
      <HeroSection mouse={mouse} />
    </PageLayout>
  );
}