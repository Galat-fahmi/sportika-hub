import { Link } from "react-router-dom";
import logo from "@/assets/sportika-wolf-logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-14">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <img src={logo} alt="Sportika" className="h-9 w-9 object-contain group-hover:scale-110 transition-transform duration-300" />
              <span className="font-display font-bold text-foreground text-lg">Sportika</span>
            </Link>
            <p className="body-sm max-w-xs">
              Next-generation sports technology platform empowering athletes and organizers worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-5 text-sm tracking-wide uppercase">Platform</h4>
            <div className="flex flex-col gap-3">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/register", label: "Get Started" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-5 text-sm tracking-wide uppercase">Products</h4>
            <div className="flex flex-col gap-3">
              {[
                { to: "/beverages", label: "Sportika Energy" },
                { to: "/sponsorship", label: "Sponsorship" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-5 text-sm tracking-wide uppercase">Connect</h4>
            <div className="flex flex-col gap-3">
              {[
                { to: "/login", label: "Log In" },
                { to: "/sponsorship", label: "Contact Us" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Sportika. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Privacy</span>
            <span className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
