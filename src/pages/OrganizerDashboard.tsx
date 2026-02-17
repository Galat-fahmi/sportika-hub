import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import OrganizerOverview from "@/pages/organizer/OrganizerOverview";
import OrganizerEvents from "@/pages/organizer/OrganizerEvents";
import OrganizerParticipants from "@/pages/organizer/OrganizerParticipants";
import OrganizerAnalytics from "@/pages/organizer/OrganizerAnalytics";
import { LayoutDashboard, Calendar, Users, BarChart3 } from "lucide-react";

const navItems = [
  { label: "Overview", path: "/organizer", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Events", path: "/organizer/events", icon: <Calendar className="h-4 w-4" /> },
  { label: "Participants", path: "/organizer/participants", icon: <Users className="h-4 w-4" /> },
  { label: "Analytics", path: "/organizer/analytics", icon: <BarChart3 className="h-4 w-4" /> },
];

const OrganizerDashboard = () => (
  <DashboardLayout navItems={navItems} title="Organizer">
    <Routes>
      <Route index element={<OrganizerOverview />} />
      <Route path="events" element={<OrganizerEvents />} />
      <Route path="participants" element={<OrganizerParticipants />} />
      <Route path="analytics" element={<OrganizerAnalytics />} />
      <Route path="*" element={<Navigate to="/organizer" replace />} />
    </Routes>
  </DashboardLayout>
);

export default OrganizerDashboard;
