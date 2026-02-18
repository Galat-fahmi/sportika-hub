import { motion } from "framer-motion";
import { Handshake, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const sponsors = [
  "Nike", "Adidas", "Gatorade", "Under Armour", "Puma", "New Balance"
];

const SponsorsSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold text-primary tracking-widest uppercase">
            Partners
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3">
            Trusted by <span className="text-gradient">industry leaders</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-10"
        >
          {sponsors.map((sponsor) => (
            <div
              key={sponsor}
              className="px-6 py-3 rounded-lg border border-border/50 bg-secondary/30 text-muted-foreground font-display font-semibold text-lg tracking-wide hover:text-foreground hover:border-primary/30 transition-all duration-300"
            >
              {sponsor}
            </div>
          ))}
        </motion.div>

        <div className="text-center">
          <Link
            to="/sponsorship"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline group"
          >
            <Handshake className="h-4 w-4" />
            Become a partner
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
