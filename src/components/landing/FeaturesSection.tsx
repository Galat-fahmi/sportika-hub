import { motion } from "framer-motion";
import { Trophy, BarChart3, Calendar, Shield, Users, Zap } from "lucide-react";

const features = [
  {
    icon: Trophy,
    title: "Event Management",
    description: "Create, schedule, and manage sports events with real-time updates and automated workflows.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track athlete stats, rankings, and progress with powerful data visualization tools.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "AI-powered scheduling that avoids conflicts and optimizes venue utilization.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Secure platform with dedicated dashboards for athletes, organizers, and admins.",
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "Connect athletes, teams, and organizers in a unified sports ecosystem.",
  },
  {
    icon: Zap,
    title: "Real-Time Results",
    description: "Live scoring, instant leaderboard updates, and push notifications.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 relative">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-primary tracking-widest uppercase">Features</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mt-3">
            Everything you need to <span className="text-gradient">win</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4 group-hover:glow-primary transition-all duration-300">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
