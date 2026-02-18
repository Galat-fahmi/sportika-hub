import { motion } from "framer-motion";
import { Target, Lightbulb, Globe, Rocket, Eye, Heart, TrendingUp, Cpu } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const milestones = [
  { year: "2024", title: "Brand Founded", desc: "Sportika was born from a vision to merge sports and technology." },
  { year: "2025", title: "Platform Launch", desc: "Launched the digital platform for athletes and organizers." },
  { year: "2026", title: "Energy Line", desc: "Sportika Energy drink line enters development and testing." },
  { year: "2027", title: "Global Expansion", desc: "Taking Sportika to international markets and partnerships." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="text-xs font-semibold text-primary tracking-widest uppercase">About Us</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mt-4 mb-6">
                Built for <span className="text-gradient">champions</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Sportika is more than a platform — it's a movement to empower athletes, 
                organizers, and communities through innovation and technology.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-10"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6">
                  <Target className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To democratize sports management and empower every athlete — from grassroots competitors 
                  to elite performers — with world-class technology and products that fuel their journey to greatness.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-10"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 text-accent mb-6">
                  <Eye className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To become the world's leading sports technology ecosystem — where every competition is 
                  seamlessly managed, every athlete is data-driven, and every community is connected through sport.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-24 relative">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <span className="text-xs font-semibold text-primary tracking-widest uppercase">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mt-3 mb-6">
                From passion to <span className="text-gradient">platform</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Sportika started with a simple observation: sports management was fragmented, outdated, and 
                inaccessible to most. We set out to change that by building an all-in-one ecosystem that 
                bridges the gap between technology and athletic performance.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Heart, title: "Passion", desc: "Born from a deep love for sport and competition." },
                { icon: Cpu, title: "Technology", desc: "Powered by cutting-edge digital infrastructure." },
                { icon: TrendingUp, title: "Growth", desc: "Rapidly expanding across sports and markets." },
                { icon: Globe, title: "Community", desc: "Building a global network of athletes and organizers." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl p-6 text-center hover:border-primary/30 transition-all"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Innovation */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 text-accent mb-6">
                  <Lightbulb className="h-7 w-7" />
                </div>
                <h2 className="text-4xl font-display font-bold text-foreground mb-4">
                  Innovation at our <span className="text-gradient">core</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We leverage real-time data analytics, AI-powered scheduling, and cloud infrastructure 
                  to deliver a sports management experience that's faster, smarter, and more reliable 
                  than anything that came before.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  From live scoring and instant leaderboards to automated event workflows, 
                  Sportika is setting the new standard for what sports technology can achieve.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-8 space-y-4"
              >
                {[
                  { label: "Real-Time Analytics", value: "99.9%" },
                  { label: "Event Automation", value: "85%" },
                  { label: "User Satisfaction", value: "4.9/5" },
                  { label: "Platform Uptime", value: "99.99%" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <span className="font-display font-bold text-gradient text-lg">{stat.value}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs font-semibold text-primary tracking-widest uppercase">Roadmap</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mt-3">
                The road <span className="text-gradient">ahead</span>
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-6">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl p-6 flex items-start gap-6 hover:border-primary/30 transition-all"
                >
                  <div className="shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10">
                    <span className="font-display font-bold text-primary text-lg">{m.year}</span>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-1">{m.title}</h3>
                    <p className="text-sm text-muted-foreground">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
