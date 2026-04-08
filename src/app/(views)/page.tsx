import AnimatedBackground from "~/widgets/animated-background";
import FAQSection from "~/widgets/faq-section";
import FeatureCarousel from "~/widgets/feature-section";
import HeroSection from "~/widgets/hero-section";

export default function LoginPage() {
  return (
    <div className="relative flex flex-col pb-3">
      <FAQSection />
      <HeroSection />
      <FeatureCarousel />
      <AnimatedBackground />
    </div>
  );
}