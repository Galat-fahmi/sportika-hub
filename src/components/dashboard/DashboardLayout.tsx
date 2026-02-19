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

  const showBillboard = location.pathname === "/athlete";

  const getInitials = () => {
    if (!user?.email) return "U";
    return user.email.split("@")[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 border-r border-border/50 bg-card/95 backdrop-blur-xl flex flex-col transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        } ${sidebarOpen ? "lg:w-64" : "lg:w-[72px]"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-border/30">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-primary/25 transition-shadow duration-300">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className={`font-display font-bold text-lg text-foreground transition-all duration-300 ${sidebarOpen ? "opacity-100" : "lg:opacity-0 lg:w-0 lg:overflow-hidden"}`}>
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                <span className={`transition-all duration-300 ${sidebarOpen ? "opacity-100" : "lg:opacity-0 lg:w-0 lg:overflow-hidden"}`}>
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
        <div className="p-3 border-t border-border/30">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-secondary/50 transition-all duration-300 ${sidebarOpen ? "" : "lg:justify-center"}`}>
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">{getInitials()}</span>
                </div>
                <div className={`flex-1 text-left min-w-0 transition-all duration-300 ${sidebarOpen ? "opacity-100" : "lg:opacity-0 lg:w-0 lg:overflow-hidden"}`}>
                  <p className="text-sm font-medium truncate">{user?.email?.split("@")[0]}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-all duration-300 ${sidebarOpen ? "opacity-100" : "lg:opacity-0 lg:hidden"}`} />
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
        <header className="h-16 border-b border-border/30 bg-card/50 backdrop-blur-xl sticky top-0 z-30">
          <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex rounded-xl"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events, results..."
                  className="pl-10 bg-secondary/30 border-border/30 rounded-xl focus-visible:ring-primary/50 h-10"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="md:hidden rounded-xl">
                <Search className="h-5 w-5" />
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-xl">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full ring-2 ring-card" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Notifications
                    <Badge variant="secondary" className="text-xs">3 new</Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-64 overflow-y-auto">
                    {[
                      { title: "Event Starting Soon", desc: "City Marathon starts in 24 hours", time: "2h ago" },
                      { title: "Registration Approved", desc: "Regional Championships", time: "5h ago" },
                      { title: "New Sponsorship Offer", desc: "Nike sent you a proposal", time: "1d ago" },
                    ].map((n) => (
                      <DropdownMenuItem key={n.title} className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.desc}</p>
                        <p className="text-xs text-muted-foreground">{n.time}</p>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/athlete/notifications" className="cursor-pointer justify-center text-primary text-sm font-medium">
                      View All Notifications
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 hidden sm:flex rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{getInitials()}</span>
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

        {/* Billboard Banner */}
        {showBillboard && (
          <div className="px-4 lg:px-6 pt-6">
            <BillboardBanner />
          </div>
        )}

        {/* Page Content */}
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
