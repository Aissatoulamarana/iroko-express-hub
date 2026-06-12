import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import ServicesGrid from "@/components/home/ServicesGrid";
import AboutSection from "@/components/home/AboutSection";
import HowItWorks from "@/components/home/HowItWorks";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTABanner from "@/components/home/CTABanner";

const Index = () => {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesGrid />
      <AboutSection />
      <HowItWorks />
      <TestimonialsSection />
      <CTABanner />
    </>
  );
};

export default Index;
