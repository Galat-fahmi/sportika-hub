import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import BrandIntroSection from "@/components/landing/BrandIntroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import UpcomingEventsSection from "@/components/landing/UpcomingEventsSection";
import EnergyDrinkTeaser from "@/components/landing/EnergyDrinkTeaser";
import SponsorsSection from "@/components/landing/SponsorsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <BrandIntroSection />
        <FeaturesSection />
        <UpcomingEventsSection />
        <EnergyDrinkTeaser />
        <SponsorsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
