import { motion } from "framer-motion";
import { LogOut, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
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

  const dashboardLink = role === "organizer" ? "/organizer" : role === "admin" ? "/admin" : "/athlete";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-navbar"
    >
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Sportika" className="h-10 w-10 object-contain" />
          <span className="text-xl font-display font-bold text-foreground tracking-tight">
            Sportika
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-all duration-300 hover-lift ${
                location.pathname === link.to
                  ? "text-primary font-bold text-gradient"
                  : "text-muted-foreground hover:text-foreground hover:text-gradient-subtle"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={dashboardLink}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-secondary/80 px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 hover:border-primary/50 transition-all duration-300 hover-lift"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-bold text-primary-foreground hover:from-primary/90 hover:to-accent/90 transition-all duration-300 hover-lift glow-primary"
              >
                Get Started
              </Link>
            </>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-3xl"
        >
          <div className="container mx-auto py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`text-sm py-2 font-medium transition-all duration-300 hover-lift ${
                  location.pathname === link.to
                    ? "text-primary font-bold text-gradient"
                    : "text-muted-foreground hover:text-foreground hover:text-gradient-subtle"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
