import { motion } from "framer-motion";
import { Target, Rocket, Globe } from "lucide-react";

const BrandIntroSection = () => {
  return (
    <section className="py-28 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-semibold text-primary tracking-widest uppercase">
              Who We Are
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mt-3 mb-6">
              Redefining <span className="text-gradient">sports tech</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Sportika is a next-generation sports technology brand that empowers athletes, 
              organizers, and communities through innovative digital solutions and performance products.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From event management to performance beverages, we're building an ecosystem 
              where every athlete can compete, grow, and dominate.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid gap-4"
          >
            {[
              { icon: Target, title: "Performance First", desc: "Every product and feature engineered for peak performance." },
              { icon: Rocket, title: "Innovation Driven", desc: "Leveraging cutting-edge tech to transform sports experiences." },
              { icon: Globe, title: "Global Reach", desc: "Connecting athletes and events across continents." },
            ].map((item) => (
              <div key={item.title} className="glass rounded-xl p-5 flex items-start gap-4 hover:border-primary/30 transition-all">
                <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandIntroSection;
