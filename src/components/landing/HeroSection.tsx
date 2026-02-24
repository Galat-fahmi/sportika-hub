import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-sports.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Athletes in motion"
          className="w-full h-full object-cover opacity-30"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/70" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-primary/15 blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-accent/15 blur-[150px] animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 container mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 mb-8 backdrop-blur-sm">
            <Zap className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary tracking-wider uppercase">
              Performance-Driven Sports Technology
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-[0.9] tracking-tighter mb-8">
            <span className="text-foreground">PAKISTAN'S #1</span>
            <br />
            <span className="text-gradient">SPORTS PLATFORM</span>
            <br />
            <span className="text-foreground">FOR ATHLETES</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-12 leading-relaxed font-medium">
            Connect with university sports competitions, cricket & football tournaments, 
            athlete sponsorship opportunities, and corporate sports events across Karachi, Lahore, Islamabad & Pakistan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
            <Link
              to="/register"
              className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-4 text-lg font-bold text-primary-foreground hover:from-primary/90 hover:to-accent/90 transition-all duration-300 glow-primary shadow-2xl hover:shadow-primary/25"
            >
              Join Sportika
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="#cta"
              className="inline-flex items-center gap-3 rounded-xl border-2 border-border bg-secondary/50 px-8 py-4 text-lg font-bold text-secondary-foreground hover:bg-secondary hover:border-primary/50 transition-all duration-300 backdrop-blur-sm"
            >
              Explore Solutions
            </Link>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { value: "50K+", label: "Active Athletes" },
            { value: "1.2K+", label: "Events Managed" },
            { value: "75+", label: "Countries" },
            { value: "99.99%", label: "Platform Uptime" },
          ].map((stat, index) => (
            <motion.div 
              key={stat.label} 
              className="text-center p-6 rounded-2xl glass border border-border/30 hover:border-primary/40 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="text-3xl md:text-4xl font-display font-black text-gradient mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
