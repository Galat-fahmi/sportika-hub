import { useCallback } from 'react';

// Map of route paths to their lazy import functions
const routeModules: Record<string, () => Promise<any>> = {
  // Athlete routes
  '/athlete': () => import('@/pages/athlete/AthleteOverview'),
  '/athlete/portfolio': () => import('@/pages/athlete/AthletePortfolio'),
  '/athlete/events': () => import('@/pages/athlete/AthleteEvents'),
  '/athlete/results': () => import('@/pages/athlete/AthleteResults'),
  '/athlete/performance': () => import('@/pages/athlete/AthletePerformance'),
  '/athlete/achievements': () => import('@/pages/athlete/AthleteAchievements'),
  '/athlete/notifications': () => import('@/pages/athlete/AthleteNotifications'),
  '/athlete/settings': () => import('@/pages/athlete/AthleteSettings'),
  '/athlete/profile': () => import('@/pages/athlete/AthleteProfile'),
  
  // Organizer routes
  '/organizer': () => import('@/pages/organizer/OrganizerOverview'),
  '/organizer/events': () => import('@/pages/organizer/OrganizerEvents'),
  '/organizer/participants': () => import('@/pages/organizer/OrganizerParticipants'),
  '/organizer/scheduling': () => import('@/pages/organizer/OrganizerScheduling'),
  '/organizer/revenue': () => import('@/pages/organizer/OrganizerRevenue'),
  '/organizer/analytics': () => import('@/pages/organizer/OrganizerAnalytics'),
  '/organizer/notifications': () => import('@/pages/organizer/OrganizerNotifications'),
  '/organizer/settings': () => import('@/pages/organizer/OrganizerSettings'),
  
  // Admin routes
  '/admin': () => import('@/pages/admin/AdminOverview'),
  '/admin/users': () => import('@/pages/admin/AdminUsers'),
  '/admin/events': () => import('@/pages/admin/AdminEvents'),
  '/admin/roles': () => import('@/pages/admin/AdminRoles'),
  '/admin/analytics': () => import('@/pages/admin/AdminAnalytics'),
  '/admin/monitoring': () => import('@/pages/admin/AdminMonitoring'),
  '/admin/finance': () => import('@/pages/admin/AdminFinance'),
  '/admin/settings': () => import('@/pages/admin/AdminSettings'),
};

// Cache to track which routes have been prefetched
const prefetchedRoutes = new Set<string>();

/**
 * Hook to prefetch route components on hover/focus
 * This preloads the JavaScript chunk before navigation for instant page loads
 */
export const usePrefetch = () => {
  const prefetch = useCallback((path: string) => {
    // Avoid prefetching the same route twice
    if (prefetchedRoutes.has(path)) return;
    
    const loadModule = routeModules[path];
    if (loadModule) {
      // Mark as prefetched immediately to avoid duplicate requests
      prefetchedRoutes.add(path);
      // Prefetch in idle time or after a short delay
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => loadModule());
      } else {
        setTimeout(() => loadModule(), 100);
      }
    }
  }, []);

  return { prefetch };
};

/**
 * Prefetch multiple routes at once
 */
export const prefetchRoutes = (paths: string[]) => {
  paths.forEach(path => {
    if (prefetchedRoutes.has(path)) return;
    
    const loadModule = routeModules[path];
    if (loadModule) {
      prefetchedRoutes.add(path);
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => loadModule());
      } else {
        setTimeout(() => loadModule(), 100);
      }
    }
  });
};
