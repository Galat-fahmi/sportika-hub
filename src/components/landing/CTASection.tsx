import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-12 md:p-20 text-center max-w-4xl mx-auto border-primary/20"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Ready to transform your <span className="text-gradient">sports experience</span>?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Join thousands of athletes and organizers already using Sportika to manage, compete, and grow.
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all glow-primary group"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
