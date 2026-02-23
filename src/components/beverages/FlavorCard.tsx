import { motion } from "framer-motion";
import { Star, LucideIcon } from "lucide-react";

interface FlavorCardProps {
  name: string;
  desc: string;
  tagline: string;
  benefits: string[];
  image: string;
  icon: LucideIcon;
  index: number;
}

const FlavorCard = ({ name, desc, tagline, benefits, image, icon: Icon, index }: FlavorCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <div className="card-premium card-hover h-full">
        {/* Image area */}
        <div className="relative h-72 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

          {/* Tagline badge */}
          <div className="absolute top-5 right-5">
            <div className="glass inline-flex items-center gap-2 px-4 py-2 rounded-full border-primary/20">
              <Icon className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-bold text-foreground/90 uppercase tracking-[0.15em]">
                {tagline}
              </span>
            </div>
          </div>

          {/* Floating rating */}
          <div className="absolute bottom-5 left-6 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-3.5 w-3.5 fill-primary text-primary" />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="p-8 pt-6 space-y-5">
          <h3 className="text-2xl font-display font-black text-foreground group-hover:text-gradient transition-all duration-300">
            {name}
          </h3>

          <p className="body-sm leading-relaxed">{desc}</p>

          {/* Benefit pills */}
          <div className="flex flex-wrap gap-2">
            {benefits.map((benefit) => (
              <span
                key={benefit}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/10"
              >
                {benefit}
              </span>
            ))}
          </div>

          {/* Performance bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Performance Index</span>
              <span className="text-primary font-semibold">9.5 / 10</span>
            </div>
            <div className="h-1 rounded-full bg-border overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "95%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1, duration: 1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FlavorCard;
