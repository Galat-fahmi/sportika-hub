import { motion, useScroll, useTransform } from "framer-motion";
import { Flame, ArrowRight, ChevronDown } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-sports.jpg";

const BeverageHero = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const stats = [
    { value: "0g", label: "Sugar" },
    { value: "300mg", label: "Natural Caffeine" },
    { value: "2027", label: "Launch Year" },
  ];

  return (
    <section
      ref={ref}
      className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img
          src={heroBg}
          alt="Athlete performing with Sportika Energy"
          className="w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </motion.div>

      {/* Ambient glow */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[180px] animate-pulse-slow" />
      <div className="absolute bottom-1/3 left-1/6 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[150px] animate-pulse-slow" style={{ animationDelay: "1.5s" }} />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 rounded-full glass px-5 py-2.5 mb-10 border-primary/20"
          >
            <Flame className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-xs font-bold text-foreground/90 tracking-[0.2em] uppercase">
              Official Energy Drink of Champions
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="heading-xl text-foreground mb-6 leading-[0.9]"
          >
            FUEL YOUR
            <br />
            <span className="text-gradient">VICTORY</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="body-lg max-w-2xl mb-10 text-foreground/70"
          >
            Championship-grade performance fuel engineered for elite athletes.
            Zero sugar. Zero crash. Maximum performance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-4"
          >
            <Button
              size="lg"
              className="btn-premium h-14 px-8 text-lg rounded-2xl"
              onClick={() =>
                document
                  .getElementById("flavors")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Flavors
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="btn-outline-premium h-14 px-8 text-lg rounded-2xl"
            >
              Watch Film
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex gap-12 mt-16"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-display font-black text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-primary/60" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default BeverageHero;
