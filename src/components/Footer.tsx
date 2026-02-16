import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-foreground">Sportika</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Sportika. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
