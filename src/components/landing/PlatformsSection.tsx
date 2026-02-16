import { motion } from "framer-motion";
import { User, Flag, ShieldCheck } from "lucide-react";

const platforms = [
  {
    icon: User,
    title: "Athlete Dashboard",
    description: "Track your performance, register for events, view rankings, and manage your athletic profile.",
    features: ["Performance stats", "Event history", "Certificates", "Notifications"],
    accent: "primary" as const,
  },
  {
    icon: Flag,
    title: "Organizer Dashboard",
    description: "Create events, manage participants, enter results, and track revenue — all in one place.",
    features: ["Event creation", "Participant management", "Revenue tracking", "Analytics"],
    accent: "accent" as const,
  },
  {
    icon: ShieldCheck,
    title: "Admin Dashboard",
    description: "Full platform control with user management, event approvals, and system monitoring.",
    features: ["User management", "Role control", "Approvals", "System health"],
    accent: "primary" as const,
  },
];

const PlatformsSection = () => {
  return (
    <section id="platforms" className="py-32 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-primary tracking-widest uppercase">Platforms</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mt-3">
            One ecosystem, <span className="text-gradient">three portals</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="glass rounded-2xl p-8 hover:border-primary/30 transition-all duration-500 group"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 ${
                platform.accent === "accent" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
              }`}>
                <platform.icon className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-display font-bold text-foreground mb-3">{platform.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{platform.description}</p>

              <div className="space-y-2">
                {platform.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-sm text-secondary-foreground">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    {feat}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformsSection;
