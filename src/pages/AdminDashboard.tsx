import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { LayoutDashboard, Users, Calendar, Shield, BarChart3, Activity, DollarSign, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load all sub-pages for code splitting
const AdminOverview = lazy(() => import("@/pages/admin/AdminOverview"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const AdminEvents = lazy(() => import("@/pages/admin/AdminEvents"));
const AdminRoles = lazy(() => import("@/pages/admin/AdminRoles"));
const AdminAnalytics = lazy(() => import("@/pages/admin/AdminAnalytics"));
const AdminMonitoring = lazy(() => import("@/pages/admin/AdminMonitoring"));
const AdminFinance = lazy(() => import("@/pages/admin/AdminFinance"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));

// Dashboard loading skeleton
const DashboardSkeleton = () => (
  <div className="space-y-6 p-1">
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
    <Skeleton className="h-64 rounded-xl" />
  </div>
);

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
    <Suspense fallback={<DashboardSkeleton />}>
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
    </Suspense>
  </DashboardLayout>
);

export default AdminDashboard;
