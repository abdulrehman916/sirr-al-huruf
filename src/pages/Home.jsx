import MysticalBackground from "../components/MysticalBackground";
import HeroSection from "../components/HeroSection";
import PageLayout from "../components/PageLayout";
import useMouseParallax from "../hooks/useMouseParallax";

export default function Home() {
  const mouse = useMouseParallax(1);

  return (
    <PageLayout>
      {/* MysticalBackground is fixed inset-0, fully out of layout flow */}
      <MysticalBackground mouse={mouse} />
      {/* Negative margins cancel PageLayout's px-3/py-4 padding so HeroSection
          occupies full available width — identical to the original structure */}
      <div className="-mx-3 sm:-mx-4 md:-mx-6 -mt-4 sm:-mt-6">
        <HeroSection mouse={mouse} />
      </div>
    </PageLayout>
  );
}