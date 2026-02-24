import { useState } from "react";
import { useParams } from "react-router-dom";
import AhmedRazaProfile from "@/components/athletes/AhmedRazaProfile";
import FatimaKhanProfile from "@/components/athletes/FatimaKhanProfile";
import HassanAliProfile from "@/components/athletes/HassanAliProfile";

const AthleteProfile = () => {
  const { playername } = useParams<{ playername: string }>();

  // Route to specific athlete profile based on slug
  const renderProfile = () => {
    switch (playername) {
      case "ahmed-raza":
        return <AhmedRazaProfile />;
      case "fatima-khan":
        return <FatimaKhanProfile />;
      case "hassan-ali":
        return <HassanAliProfile />;
      default:
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Athlete Not Found</h2>
              <p className="text-muted-foreground">The requested athlete profile could not be found.</p>
            </div>
          </div>
        );
    }
  };

  return renderProfile();




};

export default AthleteProfile;