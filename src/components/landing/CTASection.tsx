import { motion } from "framer-motion";
import { ArrowRight, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section id="cta" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-[150px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass rounded-3xl p-12 md:p-20 text-center max-w-5xl mx-auto border border-primary/30 backdrop-blur-xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-2 mb-8">
            <Zap className="h-4 w-4 text-accent animate-pulse" />
            <span className="text-sm font-bold text-accent tracking-widest uppercase">
              CHAMPIONS CHOOSE SPORTIKA
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-display font-black text-foreground mb-6 leading-[1.1]">
            ELEVATE YOUR <span className="text-gradient">PERFORMANCE</span>
            <br />
            WITH SPORTIKA <span className="text-gradient">PRO</span>
          </h2>
          
          <p className="text-muted-foreground text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Join 50,000+ elite athletes and 1,200+ organizations who trust Sportika to deliver 
            championship-level results. Experience the future of sports technology today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <Link
              to="/register"
              className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-primary to-accent px-10 py-5 text-lg font-bold text-primary-foreground hover:from-primary/90 hover:to-accent/90 transition-all duration-300 glow-primary shadow-2xl hover:shadow-primary/30 w-full sm:w-auto justify-center"
            >
              <Users className="h-5 w-5" />
              Join Sportika Now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              to="/beverages"
              className="inline-flex items-center gap-3 rounded-xl border-2 border-border bg-secondary/50 px-10 py-5 text-lg font-bold text-secondary-foreground hover:bg-secondary hover:border-primary/50 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto justify-center"
            >
              Explore Energy Drinks
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Free forever plan
            </span>
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Set up in minutes
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
