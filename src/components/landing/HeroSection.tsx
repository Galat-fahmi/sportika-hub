import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Zap, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-sports.jpg";

const HeroSection = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img
          src={heroImage}
          alt="Athletes in motion"
          className="w-full h-full object-cover opacity-25 scale-110"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
      </motion.div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-10" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[180px] animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[180px] animate-pulse-slow" style={{ animationDelay: "1.5s" }} />

      <motion.div style={{ opacity }} className="relative z-10 container mx-auto text-center px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div 
            className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/5 px-5 py-2.5 mb-10 backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Zap className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-xs font-bold text-primary tracking-[0.2em] uppercase">
              Performance-Driven Sports Technology
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black leading-[0.85] tracking-tighter mb-10">
            <motion.span 
              className="block text-foreground"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              ELEVATE
            </motion.span>
            <motion.span 
              className="block text-gradient my-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55, duration: 0.7 }}
            >
              YOUR GAME
            </motion.span>
          </h1>

          <motion.p 
            className="max-w-xl mx-auto text-lg md:text-xl text-muted-foreground mb-14 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            The ultimate sports technology platform connecting athletes, organizers, and brands.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
          >
            <Link
              to="/register"
              className="group btn-premium inline-flex items-center gap-3 rounded-xl px-10 py-4 text-lg text-primary-foreground"
            >
              Join Sportika
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
            </Link>
            <Link
              to="/about"
              className="btn-outline-premium inline-flex items-center gap-3 rounded-xl px-10 py-4 text-lg text-foreground"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
        >
          {[
            { value: "50K+", label: "Athletes" },
            { value: "1.2K+", label: "Events" },
            { value: "75+", label: "Countries" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-5 md:p-6 rounded-2xl glass-card hover:border-primary/30 transition-all duration-500 group"
              whileHover={{ y: -4, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
            >
              <div className="text-2xl md:text-3xl font-display font-black text-gradient mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-[0.15em] font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-6 w-6 text-muted-foreground/50" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
