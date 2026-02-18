import { motion } from "framer-motion";
import { Target, Zap, Globe, Award } from "lucide-react";

const BrandIntroSection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold text-primary tracking-widest uppercase">
                WHO WE ARE
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-foreground mb-8 leading-[1.1]">
              REDEFINING <span className="text-gradient">SPORTS</span> THROUGH <span className="text-gradient">TECHNOLOGY</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Sportika is the world's most advanced sports technology platform, built for athletes who 
              demand excellence and organizers who refuse to compromise on performance.
            </p>
            
            <p className="text-muted-foreground leading-relaxed mb-8">
              We combine cutting-edge technology, data-driven insights, and championship-level design 
              to create tools that don't just manage sports—they elevate them.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
                Athlete-First Design
              </span>
              <span className="px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold border border-accent/20">
                Real-Time Analytics
              </span>
              <span className="px-4 py-2 rounded-full bg-secondary/10 text-secondary-foreground text-sm font-semibold border border-border">
                Global Scale
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid gap-5"
          >
            {[
              { 
                icon: Target, 
                title: "Precision Performance", 
                desc: "Every feature engineered with millisecond precision and championship-grade reliability." 
              },
              { 
                icon: Zap, 
                title: "Lightning Fast", 
                desc: "Real-time data processing and instant insights that keep pace with elite competition." 
              },
              { 
                icon: Globe, 
                title: "Worldwide Impact", 
                desc: "Connecting athletes, events, and communities across 75+ countries and counting." 
              },
              { 
                icon: Award, 
                title: "Champion Tested", 
                desc: "Trusted by Olympic athletes, professional teams, and grassroots organizations worldwide." 
              },
            ].map((item, index) => (
              <motion.div 
                key={item.title} 
                className="glass rounded-2xl p-6 flex items-start gap-5 hover:border-primary/40 transition-all duration-300 group border border-border/30"
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
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
