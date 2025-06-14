import AnimatedBackground from "~/widgets/animated-background";
import FAQSection from "~/widgets/faq-section";
import FeatureCarousel from "~/widgets/feature-section";
import HeroSection from "~/widgets/hero-section";

export default function LoginPage() {
  return (
    <div className="flex flex-col pb-3 relative">
      <FAQSection />
      <HeroSection />
      <FeatureCarousel />
      <AnimatedBackground />
    </div>
  );
}
