import { useEffect } from "react";
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
  // Update document title and meta for SEO
  useEffect(() => {
    document.title = "Sportika Pakistan | #1 Sports Event Management Platform for Universities & Athletes";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Pakistan's leading sports event management platform. Connect with university sports competitions, cricket & football tournaments, athlete sponsorship opportunities, and corporate sports events in Karachi, Lahore, Islamabad & across Pakistan.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Hidden Content */}
      <div className="sr-only" aria-hidden="true">
        <h1>Sportika Pakistan - Leading Sports Event Management Platform</h1>
        <p>Sportika is Pakistan's premier digital sports ecosystem connecting athletes, universities, colleges, and corporate organizers. We facilitate sports tournaments, athlete sponsorships, and inter-university competitions across Karachi, Lahore, Islamabad, and all major cities in Pakistan.</p>
        <h2>University Sports Pakistan</h2>
        <p>Join inter-university sports competitions, cricket tournaments, football leagues, and athletics events. Platform for student athletes in Pakistani universities and colleges.</p>
        <h2>Corporate Sports Events Pakistan</h2>
        <p>Organize corporate sports events, team building activities, and company tournaments. Best sports event management platform for businesses in Pakistan.</p>
        <h2>Athlete Sponsorship Pakistan</h2>
        <p>Discover talented Pakistani athletes, explore sponsorship opportunities, and build athlete portfolios. Talent scouting and sports sponsorship platform.</p>
        <h2>Sports Tournaments Karachi Lahore Islamabad</h2>
        <p>Participate in sports events and tournaments in Karachi, Lahore, Islamabad, Faisalabad, and Rawalpindi. Online sports tournament registration available.</p>
      </div>

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
