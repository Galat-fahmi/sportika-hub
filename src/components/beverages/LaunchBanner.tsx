import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const milestones = [
  { label: "Athlete Testing Complete", status: "done" },
  { label: "Formula Finalized", status: "done" },
  { label: "Manufacturing Setup", status: "progress" },
];

const LaunchBanner = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[180px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card-premium p-10 md:p-14 text-center max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary">
              <Zap className="h-7 w-7" />
            </div>
            <h2 className="heading-md text-foreground">LAUNCHING 2027</h2>
          </div>

          <p className="body-lg mb-10 max-w-2xl mx-auto">
            Sportika Energy is in advanced development with Olympic athletes and
            professional teams. Join the exclusive preview list.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {milestones.map((m) => (
              <span
                key={m.label}
                className="flex items-center gap-2.5 text-sm text-muted-foreground"
              >
                <span
                  className={`h-2 w-2 rounded-full animate-pulse ${
                    m.status === "done" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                />
                {m.label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LaunchBanner;
