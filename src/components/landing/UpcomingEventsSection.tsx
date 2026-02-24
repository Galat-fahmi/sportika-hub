import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const events = [
  {
    title: "National Track & Field Championship",
    date: "Mar 15, 2026",
    location: "Olympic Stadium, Lagos",
    sport: "Athletics",
    participants: 240,
  },
  {
    title: "West African Swimming Open",
    date: "Apr 02, 2026",
    location: "Aquatic Center, Accra",
    sport: "Swimming",
    participants: 180,
  },
  {
    title: "Continental Cycling Grand Prix",
    date: "Apr 20, 2026",
    location: "Circuit de Dakar",
    sport: "Cycling",
    participants: 120,
  },
];

const UpcomingEventsSection = () => {
  return (
    <section className="section-padding relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-bold text-primary tracking-[0.2em] uppercase mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
            Events
          </span>
          <h2 className="heading-lg text-foreground mt-4">
            Upcoming <span className="text-gradient">competitions</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="card-premium p-7 group cursor-default card-hover"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary mb-5 tracking-wide uppercase">
                {event.sport}
              </div>
              <h3 className="text-lg font-display font-bold text-foreground mb-5 leading-tight">
                {event.title}
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-accent shrink-0" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{event.participants} registered</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            to="/register"
            className="inline-flex items-center gap-2.5 text-sm font-bold text-primary hover:text-foreground transition-colors group"
          >
            View all events
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default UpcomingEventsSection;
