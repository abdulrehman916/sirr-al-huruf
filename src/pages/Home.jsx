import MysticalBackground from "../components/MysticalBackground";
import HeroSection from "../components/HeroSection";
import PageLayout from "../components/PageLayout";

export default function Home() {
  return (
    <PageLayout>
      <div className="relative overflow-x-hidden -mx-4 -mt-6">
        <MysticalBackground />
        <HeroSection />
      </div>
    </PageLayout>
  );
}