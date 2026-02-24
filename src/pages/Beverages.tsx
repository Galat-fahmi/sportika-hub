import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BeverageHero from "@/components/beverages/BeverageHero";
import FlavorShowcase from "@/components/beverages/FlavorShowcase";
import LineupImage from "@/components/beverages/LineupImage";
import BeverageFeatures from "@/components/beverages/BeverageFeatures";
import LaunchBanner from "@/components/beverages/LaunchBanner";
import BeverageCTA from "@/components/beverages/BeverageCTA";

const Beverages = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <BeverageHero />
        <FlavorShowcase />
        <LineupImage />
        <BeverageFeatures />
        <LaunchBanner />
        <BeverageCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Beverages;
