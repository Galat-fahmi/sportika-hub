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
    <section id="features" className="section-padding relative">
      <div className="absolute inset-0 grid-pattern opacity-5" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-bold text-primary tracking-[0.2em] uppercase mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
            Features
          </span>
          <h2 className="heading-lg text-foreground mt-4">
            Everything you need to <span className="text-gradient">win</span>
          </h2>
          <p className="body-md max-w-2xl mx-auto mt-4">
            Built for champions who demand the best tools to track, compete, and grow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="card-premium p-8 group cursor-default card-hover"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="body-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
