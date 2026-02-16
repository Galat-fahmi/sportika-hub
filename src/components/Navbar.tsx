import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <Zap className="h-7 w-7 text-primary" />
          <span className="text-xl font-display font-bold text-foreground tracking-tight">
            Sportika
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#platforms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Platforms
          </a>
          <a href="#events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Events
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
