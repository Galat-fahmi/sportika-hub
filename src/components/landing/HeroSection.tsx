import { motion } from "framer-motion";
import heroImage from "@/assets/hero-sports.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Athletes in motion"
          className="w-full h-full object-cover opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 container mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary tracking-wide uppercase">
              The Future of Sports Management
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tight mb-6">
            <span className="text-foreground">Manage.</span>
            <br />
            <span className="text-gradient">Compete.</span>
            <br />
            <span className="text-foreground">Dominate.</span>
          </h1>

          <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-10">
            The all-in-one platform for athletes, organizers, and administrators.
            From registration to results — Sportika powers your entire sports ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all glow-primary"
            >
              Start Free
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-8 py-3.5 text-base font-semibold text-secondary-foreground hover:bg-secondary/80 transition-all"
            >
              Explore Platform
            </a>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { value: "10K+", label: "Athletes" },
            { value: "500+", label: "Events" },
            { value: "50+", label: "Sports" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-display font-bold text-gradient">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
