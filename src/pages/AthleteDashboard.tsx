import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { LayoutDashboard, User, Calendar, Trophy, BarChart3, Award, Bell, Settings, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load all sub-pages for code splitting
const AthleteOverview = lazy(() => import("@/pages/athlete/AthleteOverview"));
const AthleteProfile = lazy(() => import("@/pages/athlete/AthleteProfile"));
const AthleteEvents = lazy(() => import("@/pages/athlete/AthleteEvents"));
const AthleteResults = lazy(() => import("@/pages/athlete/AthleteResults"));
const AthletePerformance = lazy(() => import("@/pages/athlete/AthletePerformance"));
const AthleteAchievements = lazy(() => import("@/pages/athlete/AthleteAchievements"));
const AthleteNotifications = lazy(() => import("@/pages/athlete/AthleteNotifications"));
const AthleteSettings = lazy(() => import("@/pages/athlete/AthleteSettings"));
const AthletePortfolio = lazy(() => import("@/pages/athlete/AthletePortfolio"));

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
  { label: "Overview", path: "/athlete", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "My Portfolio", path: "/athlete/portfolio", icon: <Globe className="h-4 w-4" /> },
  { label: "Profile", path: "/athlete/profile", icon: <User className="h-4 w-4" /> },
  { label: "Events", path: "/athlete/events", icon: <Calendar className="h-4 w-4" /> },
  { label: "Results", path: "/athlete/results", icon: <Trophy className="h-4 w-4" /> },
  { label: "Performance", path: "/athlete/performance", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Achievements", path: "/athlete/achievements", icon: <Award className="h-4 w-4" /> },
  { label: "Notifications", path: "/athlete/notifications", icon: <Bell className="h-4 w-4" /> },
  { label: "Settings", path: "/athlete/settings", icon: <Settings className="h-4 w-4" /> },
];

const AthleteDashboard = () => (
  <DashboardLayout navItems={navItems} title="Athlete">
    <Suspense fallback={<DashboardSkeleton />}>
      <Routes>
        <Route index element={<AthleteOverview />} />
        <Route path="portfolio" element={<AthletePortfolio />} />
        <Route path="profile" element={<AthleteProfile />} />
        <Route path="events" element={<AthleteEvents />} />
        <Route path="results" element={<AthleteResults />} />
        <Route path="performance" element={<AthletePerformance />} />
        <Route path="achievements" element={<AthleteAchievements />} />
        <Route path="notifications" element={<AthleteNotifications />} />
        <Route path="settings" element={<AthleteSettings />} />
        <Route path="*" element={<Navigate to="/athlete" replace />} />
      </Routes>
    </Suspense>
  </DashboardLayout>
);

export default AthleteDashboard;
