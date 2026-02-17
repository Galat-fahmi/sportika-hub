import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AthleteOverview from "@/pages/athlete/AthleteOverview";
import AthleteProfile from "@/pages/athlete/AthleteProfile";
import AthleteEvents from "@/pages/athlete/AthleteEvents";
import AthleteResults from "@/pages/athlete/AthleteResults";
import { LayoutDashboard, User, Calendar, Trophy } from "lucide-react";

const navItems = [
  { label: "Overview", path: "/athlete", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Events", path: "/athlete/events", icon: <Calendar className="h-4 w-4" /> },
  { label: "Results", path: "/athlete/results", icon: <Trophy className="h-4 w-4" /> },
  { label: "Profile", path: "/athlete/profile", icon: <User className="h-4 w-4" /> },
];

const AthleteDashboard = () => (
  <DashboardLayout navItems={navItems} title="Athlete">
    <Routes>
      <Route index element={<AthleteOverview />} />
      <Route path="events" element={<AthleteEvents />} />
      <Route path="results" element={<AthleteResults />} />
      <Route path="profile" element={<AthleteProfile />} />
      <Route path="*" element={<Navigate to="/athlete" replace />} />
    </Routes>
  </DashboardLayout>
);

export default AthleteDashboard;
