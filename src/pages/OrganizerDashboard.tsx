import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { LayoutDashboard, Calendar, Users, Trophy, DollarSign, BarChart3, Bell, Settings, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load all sub-pages for code splitting
const OrganizerOverview = lazy(() => import("@/pages/organizer/OrganizerOverview"));
const OrganizerEvents = lazy(() => import("@/pages/organizer/OrganizerEvents"));
const OrganizerParticipants = lazy(() => import("@/pages/organizer/OrganizerParticipants"));
const OrganizerScheduling = lazy(() => import("@/pages/organizer/OrganizerScheduling"));
const OrganizerRevenue = lazy(() => import("@/pages/organizer/OrganizerRevenue"));
const OrganizerAnalytics = lazy(() => import("@/pages/organizer/OrganizerAnalytics"));
const OrganizerNotifications = lazy(() => import("@/pages/organizer/OrganizerNotifications"));
const OrganizerSettings = lazy(() => import("@/pages/organizer/OrganizerSettings"));
const OrganizerProfile = lazy(() => import("@/pages/organizer/OrganizerProfile"));

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
  { label: "Overview", path: "/organizer", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Events", path: "/organizer/events", icon: <Calendar className="h-4 w-4" /> },
  { label: "Participants", path: "/organizer/participants", icon: <Users className="h-4 w-4" /> },
  { label: "Scheduling & Results", path: "/organizer/scheduling", icon: <Trophy className="h-4 w-4" /> },
  { label: "Revenue", path: "/organizer/revenue", icon: <DollarSign className="h-4 w-4" /> },
  { label: "Analytics", path: "/organizer/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Notifications", path: "/organizer/notifications", icon: <Bell className="h-4 w-4" /> },
  { label: "Profile", path: "/organizer/profile", icon: <User className="h-4 w-4" /> },
  { label: "Settings", path: "/organizer/settings", icon: <Settings className="h-4 w-4" /> },
];

const OrganizerDashboard = () => (
  <DashboardLayout navItems={navItems} title="Organizer">
    <Suspense fallback={<DashboardSkeleton />}>
      <Routes>
        <Route index element={<OrganizerOverview />} />
        <Route path="events" element={<OrganizerEvents />} />
        <Route path="participants" element={<OrganizerParticipants />} />
        <Route path="scheduling" element={<OrganizerScheduling />} />
        <Route path="revenue" element={<OrganizerRevenue />} />
        <Route path="analytics" element={<OrganizerAnalytics />} />
        <Route path="notifications" element={<OrganizerNotifications />} />
        <Route path="profile" element={<OrganizerProfile />} />
        <Route path="settings" element={<OrganizerSettings />} />
        <Route path="*" element={<Navigate to="/organizer" replace />} />
      </Routes>
    </Suspense>
  </DashboardLayout>
);

export default OrganizerDashboard;
