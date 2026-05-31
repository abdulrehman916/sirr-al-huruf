import MysticalBackground from "../components/MysticalBackground";
import HeroSection from "../components/HeroSection";

export default function Home() {
  return (
    <div className="min-h-screen font-inter relative overflow-x-hidden">
      <MysticalBackground />
      <HeroSection />
    </div>
  );
}