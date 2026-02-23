import { motion } from "framer-motion";
import { Battery, Shield, Trophy, Clock } from "lucide-react";

const features = [
  { icon: Battery, label: "Sustained Energy", desc: "No crash, just focus" },
  { icon: Shield, label: "Clean Formula", desc: "Zero artificial ingredients" },
  { icon: Trophy, label: "Proven Results", desc: "Trusted by athletes" },
  { icon: Clock, label: "Rapid Absorption", desc: "Works in 15 minutes" },
];

const BeverageFeatures = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle gradient band */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-5 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110 group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-foreground mb-1.5 text-sm md:text-base">
                {feature.label}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeverageFeatures;
