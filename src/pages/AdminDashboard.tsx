import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import { LayoutDashboard, Users, Calendar, BarChart3 } from "lucide-react";

const navItems = [
  { label: "Overview", path: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Users", path: "/admin/users", icon: <Users className="h-4 w-4" /> },
  { label: "Events", path: "/admin/events", icon: <Calendar className="h-4 w-4" /> },
  { label: "Analytics", path: "/admin/analytics", icon: <BarChart3 className="h-4 w-4" /> },
];

const AdminDashboard = () => (
  <DashboardLayout navItems={navItems} title="Admin">
    <Routes>
      <Route index element={<AdminOverview />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="events" element={<AdminEvents />} />
      <Route path="analytics" element={<AdminAnalytics />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </DashboardLayout>
);

export default AdminDashboard;
