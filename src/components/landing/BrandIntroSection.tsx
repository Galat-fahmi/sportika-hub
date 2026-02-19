import { motion } from "framer-motion";
import { Target, Zap, Globe, Award } from "lucide-react";

const items = [
  {
    icon: Target,
    title: "Precision Performance",
    desc: "Every feature engineered with millisecond precision and championship-grade reliability.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Real-time data processing and instant insights that keep pace with elite competition.",
  },
  {
    icon: Globe,
    title: "Worldwide Impact",
    desc: "Connecting athletes, events, and communities across 75+ countries and counting.",
  },
  {
    icon: Award,
    title: "Champion Tested",
    desc: "Trusted by Olympic athletes, professional teams, and grassroots organizations worldwide.",
  },
];

const BrandIntroSection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-primary/3 blur-[180px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/3 blur-[180px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-8">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold text-primary tracking-[0.2em] uppercase">
                Who We Are
              </span>
            </div>

            <h2 className="heading-lg text-foreground mb-8">
              REDEFINING <span className="text-gradient">SPORTS</span> THROUGH <span className="text-gradient">TECHNOLOGY</span>
            </h2>

            <p className="body-lg mb-4">
              Sportika is the world's most advanced sports technology platform, built for athletes who
              demand excellence and organizers who refuse to compromise on performance.
            </p>

            <p className="body-md mb-10">
              We combine cutting-edge technology, data-driven insights, and championship-level design
              to create tools that don't just manage sports—they elevate them.
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                { label: "Athlete-First Design", variant: "primary" },
                { label: "Real-Time Analytics", variant: "accent" },
                { label: "Global Scale", variant: "secondary" },
              ].map((tag) => (
                <span
                  key={tag.label}
                  className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors duration-300 ${
                    tag.variant === "primary"
                      ? "bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
                      : tag.variant === "accent"
                      ? "bg-accent/5 text-accent border-accent/20 hover:bg-accent/10"
                      : "bg-secondary/50 text-secondary-foreground border-border hover:bg-secondary"
                  }`}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="grid gap-4"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.title}
                className="card-premium p-6 flex items-start gap-5 group card-hover"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary group-hover:from-primary/25 group-hover:to-accent/25 transition-all duration-500">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground text-lg mb-2">{item.title}</h3>
                  <p className="body-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandIntroSection;
