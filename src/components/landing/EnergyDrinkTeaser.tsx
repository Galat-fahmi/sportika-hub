import { motion } from "framer-motion";
import { Flame, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import energyDrinksImage from "@/assets/energy-drinks.jpg";

const EnergyDrinkTeaser = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[200px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[180px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/5 px-4 py-2 mb-8">
              <Flame className="h-4 w-4 text-accent" />
              <span className="text-xs font-bold text-accent tracking-[0.15em] uppercase">
                Coming Soon
              </span>
            </div>

            <h2 className="heading-lg text-foreground mb-6">
              Sportika <span className="text-gradient">Energy</span>
            </h2>
            <p className="body-lg mb-4 max-w-md">
              Fuel your performance with our upcoming line of sports energy drinks.
            </p>
            <p className="body-sm mb-10">
              Four bold flavors crafted to push your limits. Stay tuned.
            </p>

            <Link
              to="/beverages"
              className="btn-energy inline-flex items-center gap-3 rounded-xl px-8 py-4 text-base font-bold text-accent-foreground group"
            >
              Discover Flavors
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden border border-border/40 shadow-2xl">
              <img
                src={energyDrinksImage}
                alt="Sportika Energy drink lineup"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full bg-primary/10 blur-[80px]" />
            <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-accent/10 blur-[60px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnergyDrinkTeaser;
