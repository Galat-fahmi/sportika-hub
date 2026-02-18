import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import OrganizerOverview from "@/pages/organizer/OrganizerOverview";
import OrganizerEvents from "@/pages/organizer/OrganizerEvents";
import OrganizerParticipants from "@/pages/organizer/OrganizerParticipants";
import OrganizerScheduling from "@/pages/organizer/OrganizerScheduling";
import OrganizerRevenue from "@/pages/organizer/OrganizerRevenue";
import OrganizerAnalytics from "@/pages/organizer/OrganizerAnalytics";
import OrganizerNotifications from "@/pages/organizer/OrganizerNotifications";
import OrganizerSettings from "@/pages/organizer/OrganizerSettings";
import { LayoutDashboard, Calendar, Users, Trophy, DollarSign, BarChart3, Bell, Settings } from "lucide-react";

const navItems = [
  { label: "Overview", path: "/organizer", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Events", path: "/organizer/events", icon: <Calendar className="h-4 w-4" /> },
  { label: "Participants", path: "/organizer/participants", icon: <Users className="h-4 w-4" /> },
  { label: "Scheduling & Results", path: "/organizer/scheduling", icon: <Trophy className="h-4 w-4" /> },
  { label: "Revenue", path: "/organizer/revenue", icon: <DollarSign className="h-4 w-4" /> },
  { label: "Analytics", path: "/organizer/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Notifications", path: "/organizer/notifications", icon: <Bell className="h-4 w-4" /> },
  { label: "Settings", path: "/organizer/settings", icon: <Settings className="h-4 w-4" /> },
];

const OrganizerDashboard = () => (
  <DashboardLayout navItems={navItems} title="Organizer">
    <Routes>
      <Route index element={<OrganizerOverview />} />
      <Route path="events" element={<OrganizerEvents />} />
      <Route path="participants" element={<OrganizerParticipants />} />
      <Route path="scheduling" element={<OrganizerScheduling />} />
      <Route path="revenue" element={<OrganizerRevenue />} />
      <Route path="analytics" element={<OrganizerAnalytics />} />
      <Route path="notifications" element={<OrganizerNotifications />} />
      <Route path="settings" element={<OrganizerSettings />} />
      <Route path="*" element={<Navigate to="/organizer" replace />} />
    </Routes>
  </DashboardLayout>
);

export default OrganizerDashboard;
