import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminRoles from "@/pages/admin/AdminRoles";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminMonitoring from "@/pages/admin/AdminMonitoring";
import AdminFinance from "@/pages/admin/AdminFinance";
import AdminSettings from "@/pages/admin/AdminSettings";
import { LayoutDashboard, Users, Calendar, Shield, BarChart3, Activity, DollarSign, Settings } from "lucide-react";

const navItems = [
  { label: "Overview", path: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Users", path: "/admin/users", icon: <Users className="h-4 w-4" /> },
  { label: "Events", path: "/admin/events", icon: <Calendar className="h-4 w-4" /> },
  { label: "Roles & Permissions", path: "/admin/roles", icon: <Shield className="h-4 w-4" /> },
  { label: "Analytics", path: "/admin/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Monitoring", path: "/admin/monitoring", icon: <Activity className="h-4 w-4" /> },
  { label: "Finance", path: "/admin/finance", icon: <DollarSign className="h-4 w-4" /> },
  { label: "Settings", path: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
];

const AdminDashboard = () => (
  <DashboardLayout navItems={navItems} title="Admin">
    <Routes>
      <Route index element={<AdminOverview />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="events" element={<AdminEvents />} />
      <Route path="roles" element={<AdminRoles />} />
      <Route path="analytics" element={<AdminAnalytics />} />
      <Route path="monitoring" element={<AdminMonitoring />} />
      <Route path="finance" element={<AdminFinance />} />
      <Route path="settings" element={<AdminSettings />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </DashboardLayout>
);

export default AdminDashboard;
