import MysticalBackground from "../components/MysticalBackground";
import HeroSection from "../components/HeroSection";
import PageLayout from "../components/PageLayout";
import useMouseParallax from "../hooks/useMouseParallax";

export default function Home() {
  const mouse = useMouseParallax(1);

  return (
    <PageLayout>
      <MysticalBackground mouse={mouse} />
      <HeroSection mouse={mouse} />
    </PageLayout>
  );
}