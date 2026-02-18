import { motion } from "framer-motion";
import { Flame, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import energyDrinksImage from "@/assets/energy-drinks.jpg";

const EnergyDrinkTeaser = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-6">
              <Flame className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-medium text-accent tracking-wide uppercase">
                Coming Soon
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Sportika <span className="text-gradient">Energy</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-md">
              Fuel your performance with our upcoming line of sports energy drinks. 
              Engineered for athletes, designed for winners.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Four bold flavors crafted to push your limits. Stay tuned.
            </p>

            <Link
              to="/beverages"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-all group"
            >
              Discover Flavors
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden border border-border/50">
              <img
                src={energyDrinksImage}
                alt="Sportika Energy drink lineup"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-primary/10 blur-[60px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnergyDrinkTeaser;
