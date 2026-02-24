import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import logo from "@/assets/sportika-wolf-logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/players", label: "Players" },
  { to: "/blog", label: "Blog" },
  { to: "/sponsorship", label: "Sponsorship" },
  { to: "/beverages", label: "Beverages" },
];

const Navbar = () => {
  const { user, role, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dashboardLink = role === "organizer" ? "/organizer" : role === "admin" ? "/admin" : "/athlete";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-navbar shadow-lg"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="Sportika" className="h-10 w-10 object-contain group-hover:scale-110 transition-transform duration-300" />
          <span className="text-xl font-display font-bold text-foreground tracking-tight">
            Sportika
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
                location.pathname === link.to
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {link.label}
              {location.pathname === link.to && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={dashboardLink}
                className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/50 transition-all duration-300"
              >
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/50 px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary hover:border-primary/30 transition-all duration-300"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/50 transition-all duration-300"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="btn-premium inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-primary-foreground"
              >
                Get Started
              </Link>
            </>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-border/30 bg-background/98 backdrop-blur-3xl"
          >
            <div className="container mx-auto py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    location.pathname === link.to
                      ? "text-primary bg-primary/5 font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
