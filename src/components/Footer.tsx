import { Link } from "react-router-dom";
import logo from "@/assets/sportika-wolf-logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Sportika" className="h-8 w-8 object-contain" />
              <span className="font-display font-bold text-foreground">Sportika</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Next-generation sports technology platform empowering athletes and organizers worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4 text-sm">Platform</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Get Started</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4 text-sm">Products</h4>
            <div className="flex flex-col gap-2">
              <Link to="/beverages" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sportika Energy</Link>
              <Link to="/sponsorship" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sponsorship</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4 text-sm">Connect</h4>
            <div className="flex flex-col gap-2">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Log In</Link>
              <Link to="/sponsorship" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Sportika. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground">Privacy</span>
            <span className="text-xs text-muted-foreground">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
