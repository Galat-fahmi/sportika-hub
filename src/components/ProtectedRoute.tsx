import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";

type AppRole = "athlete" | "organizer" | "admin";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: AppRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Redirect admin routes to admin auth, others to regular login
    const isAdminRoute = location.pathname.startsWith('/admin');
    return <Navigate to={isAdminRoute ? "/admin/auth" : "/login"} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on role
    const redirectMap: Record<AppRole, string> = {
      athlete: "/athlete",
      organizer: "/organizer",
      admin: "/admin",
    };
    return <Navigate to={redirectMap[role] || "/"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
