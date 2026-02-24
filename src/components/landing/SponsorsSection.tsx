import { motion } from "framer-motion";
import { Handshake, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const sponsors = [
  "Nike", "Adidas", "Gatorade", "Under Armour", "Puma", "New Balance"
];

const SponsorsSection = () => {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-bold text-primary tracking-[0.2em] uppercase mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
            Partners
          </span>
          <h2 className="heading-md text-foreground mt-4">
            Trusted by <span className="text-gradient">industry leaders</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-12"
        >
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-8 py-4 rounded-xl border border-border/40 bg-card/50 text-muted-foreground font-display font-bold text-lg tracking-wide hover:text-foreground hover:border-primary/30 hover:bg-card/80 transition-all duration-400 backdrop-blur-sm"
            >
              {sponsor}
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            to="/sponsorship"
            className="inline-flex items-center gap-2.5 text-sm font-bold text-primary hover:text-foreground transition-colors group"
          >
            <Handshake className="h-4 w-4" />
            Become a partner
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default SponsorsSection;
