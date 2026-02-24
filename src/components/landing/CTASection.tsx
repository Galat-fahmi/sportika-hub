import { motion } from "framer-motion";
import { ArrowRight, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section id="cta" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[200px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/8 blur-[200px] animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="card-premium p-12 md:p-20 text-center max-w-5xl mx-auto border-primary/20"
        >
          <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/5 px-5 py-2 mb-10">
            <Zap className="h-4 w-4 text-accent animate-pulse" />
            <span className="text-xs font-bold text-accent tracking-[0.2em] uppercase">
              Champions Choose Sportika
            </span>
          </div>

          <h2 className="heading-lg text-foreground mb-8 max-w-3xl mx-auto">
            READY TO <span className="text-gradient">ELEVATE</span> YOUR GAME?
          </h2>

          <p className="body-lg mb-14 max-w-2xl mx-auto">
            Join 50,000+ elite athletes and 1,200+ organizations who trust Sportika 
            to deliver championship-level results.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-14">
            <Link
              to="/register"
              className="group btn-premium inline-flex items-center gap-3 rounded-xl px-10 py-5 text-lg text-primary-foreground w-full sm:w-auto justify-center"
            >
              <Users className="h-5 w-5" />
              Join Sportika Now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
            </Link>

            <Link
              to="/beverages"
              className="btn-outline-premium inline-flex items-center gap-3 rounded-xl px-10 py-5 text-lg text-foreground w-full sm:w-auto justify-center"
            >
              Explore Energy Drinks
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            {["No credit card required", "Free forever plan", "Set up in minutes"].map((text) => (
              <span key={text} className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-primary/60 animate-pulse" />
                {text}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
