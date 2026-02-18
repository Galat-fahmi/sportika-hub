import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AthleteOverview from "@/pages/athlete/AthleteOverview";
import AthleteProfile from "@/pages/athlete/AthleteProfile";
import AthleteEvents from "@/pages/athlete/AthleteEvents";
import AthleteResults from "@/pages/athlete/AthleteResults";
import AthletePerformance from "@/pages/athlete/AthletePerformance";
import AthleteAchievements from "@/pages/athlete/AthleteAchievements";
import AthleteNotifications from "@/pages/athlete/AthleteNotifications";
import AthleteSettings from "@/pages/athlete/AthleteSettings";
import AthletePortfolio from "@/pages/athlete/AthletePortfolio";
import { LayoutDashboard, User, Calendar, Trophy, BarChart3, Award, Bell, Settings, Globe } from "lucide-react";

const navItems = [
  { label: "Overview", path: "/athlete", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "My Portfolio", path: "/athlete/portfolio", icon: <Globe className="h-4 w-4" /> },
  { label: "Events", path: "/athlete/events", icon: <Calendar className="h-4 w-4" /> },
  { label: "Results", path: "/athlete/results", icon: <Trophy className="h-4 w-4" /> },
  { label: "Performance", path: "/athlete/performance", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Achievements", path: "/athlete/achievements", icon: <Award className="h-4 w-4" /> },
  { label: "Notifications", path: "/athlete/notifications", icon: <Bell className="h-4 w-4" /> },
  { label: "Settings", path: "/athlete/settings", icon: <Settings className="h-4 w-4" /> },
];

const AthleteDashboard = () => (
  <DashboardLayout navItems={navItems} title="Athlete">
    <Routes>
      <Route index element={<AthleteOverview />} />
      <Route path="portfolio" element={<AthletePortfolio />} />
      <Route path="events" element={<AthleteEvents />} />
      <Route path="results" element={<AthleteResults />} />
      <Route path="performance" element={<AthletePerformance />} />
      <Route path="achievements" element={<AthleteAchievements />} />
      <Route path="notifications" element={<AthleteNotifications />} />
      <Route path="settings" element={<AthleteSettings />} />
      <Route path="profile" element={<AthleteProfile />} />
      <Route path="*" element={<Navigate to="/athlete" replace />} />
    </Routes>
  </DashboardLayout>
);

export default AthleteDashboard;
