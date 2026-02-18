import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BillboardBanner from "./BillboardBanner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Zap, 
  LogOut, 
  Search, 
  Bell, 
  User, 
  Settings,
  Menu,
  X,
  ChevronDown
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
  badge?: number;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  title: string;
}

const DashboardLayout = ({ children, navItems, title }: DashboardLayoutProps) => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Show billboard banner only on the main dashboard homepage (/athlete)
  const showBillboard = location.pathname === "/athlete";

  // Get user's initials for avatar
  const getInitials = () => {
    if (!user?.email) return "U";
    return user.email.split("@")[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-border bg-card flex flex-col transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${sidebarOpen ? "lg:w-64" : "lg:w-20"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className={`font-display font-bold text-lg text-foreground transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "lg:opacity-0 lg:w-0 lg:overflow-hidden"}`}>
              {title}
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className={`transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "lg:opacity-0 lg:w-0 lg:overflow-hidden"}`}>
                  {item.label}
                </span>
                {item.badge && (
                  <Badge 
                    variant={isActive ? "secondary" : "destructive"} 
                    className={`ml-auto text-xs ${sidebarOpen ? "" : "lg:hidden"}`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-secondary transition-colors ${sidebarOpen ? "" : "lg:justify-center"}`}>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">{getInitials()}</span>
                </div>
                <div className={`flex-1 text-left min-w-0 transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "lg:opacity-0 lg:w-0 lg:overflow-hidden"}`}>
                  <p className="text-sm font-medium truncate">{user?.email?.split("@")[0]}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "lg:opacity-0 lg:hidden"}`} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/athlete/profile" className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/athlete/settings" className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between gap-4">
            {/* Left: Mobile Menu & Sidebar Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events, results, achievements..."
                  className="pl-9 bg-secondary/50 border-0 focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Search */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Notifications
                    <Badge variant="secondary">3 new</Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-64 overflow-y-auto">
                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                      <p className="text-sm font-medium">Event Starting Soon</p>
                      <p className="text-xs text-muted-foreground">City Marathon starts in 24 hours</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                      <p className="text-sm font-medium">Registration Approved</p>
                      <p className="text-xs text-muted-foreground">Regional Championships</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                      <p className="text-sm font-medium">New Sponsorship Offer</p>
                      <p className="text-xs text-muted-foreground">Nike sent you a proposal</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/athlete/notifications" className="cursor-pointer justify-center text-primary">
                      View All Notifications
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Quick Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 hidden sm:flex">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{getInitials()}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/athlete/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/athlete/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Billboard Banner - Only on homepage */}
        {showBillboard && (
          <div className="px-4 lg:px-8 pt-6">
            <BillboardBanner />
          </div>
        )}

        {/* Page Content - Full Width */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
