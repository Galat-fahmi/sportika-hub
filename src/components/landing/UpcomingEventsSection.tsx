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
    <section className="py-32 relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-primary tracking-widest uppercase">
            Events
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mt-3">
            Upcoming <span className="text-gradient">competitions</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
                {event.sport}
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-4 leading-tight">
                {event.title}
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {event.participants} registered
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline group"
          >
            View all events
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventsSection;
