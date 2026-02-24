import { motion } from "framer-motion";
import { Droplets, Zap, Trophy, Target, Star } from "lucide-react";
import FlavorCard from "./FlavorCard";
import arcticBlue from "@/assets/ArcticBlueRaspberry.jpeg";
import electricYuzu from "@/assets/ElectricYuzu.jpeg";
import midnightGrape from "@/assets/MidnightGrape.jpeg";
import bloodOrange from "@/assets/BloodOrangeBlast.jpeg";

const flavors = [
  {
    name: "Arctic Blue Raspberry",
    desc: "An icy blast of blue raspberry that cools and refreshes. Engineered for endurance athletes with beta-alanine for sustained performance.",
    icon: Droplets,
    tagline: "ENDURANCE FUEL",
    benefits: ["200mg Caffeine", "Beta-Alanine", "Electrolytes"],
    image: arcticBlue,
  },
  {
    name: "Electric Yuzu",
    desc: "Sharp citrus intensity that ignites your senses. A jolt of Japanese yuzu for explosive energy with L-theanine for focus.",
    icon: Zap,
    tagline: "EXPLOSIVE POWER",
    benefits: ["300mg Caffeine", "L-Theanine", "B-Vitamins"],
    image: electricYuzu,
  },
  {
    name: "Midnight Grape",
    desc: "Deep, bold grape with a dark berry undertone. Smooth power for late-night training sessions with zero crash formula.",
    icon: Trophy,
    tagline: "CHAMPIONSHIP FOCUS",
    benefits: ["150mg Caffeine", "Tyrosine", "Zero Crash"],
    image: midnightGrape,
  },
  {
    name: "Blood Orange Blast",
    desc: "Fiery blood orange with a spicy finish. Explosive flavor for explosive performance with citrulline for pumps.",
    icon: Target,
    tagline: "PRECISION ENERGY",
    benefits: ["250mg Caffeine", "Citrulline", "Niacin"],
    image: bloodOrange,
  },
];

const FlavorShowcase = () => {
  return (
    <section id="flavors" className="section-padding relative">
      {/* Background ambiance */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass border-primary/20 px-5 py-2 mb-8">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">
              The Collection
            </span>
          </div>

          <h2 className="heading-lg text-foreground mb-6">
            FOUR WAYS TO <span className="text-gradient">DOMINATE</span>
          </h2>

          <p className="body-lg max-w-3xl mx-auto">
            Each flavor engineered for specific performance needs. Zero sugar.
            Zero artificial colors. Maximum results.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {flavors.map((flavor, i) => (
            <FlavorCard key={flavor.name} {...flavor} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlavorShowcase;
