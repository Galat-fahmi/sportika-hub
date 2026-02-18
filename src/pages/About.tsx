import { motion } from "framer-motion";
import { Target, Lightbulb, Globe, Rocket, Eye, Heart, TrendingUp, Cpu, Award, Zap } from "lucide-react";
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
        <section className="py-32 relative overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[150px] animate-pulse" style={{ animationDelay: "1s" }} />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 mb-8">
                <Zap className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-bold text-primary tracking-widest uppercase">
                  ABOUT SPORTIKA
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-foreground mb-8 leading-[1.05]">
                BUILT FOR <span className="text-gradient">CHAMPIONS</span>
                <br />
                BY <span className="text-gradient">CHAMPIONS</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Sportika isn't just a platform — it's a high-performance ecosystem designed by athletes, 
                for athletes. We're redefining what's possible in sports technology through innovation, 
                precision, and an unwavering commitment to excellence.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-32 relative">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="glass rounded-3xl p-12 border border-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary mb-8">
                  <Target className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-display font-black text-foreground mb-6">OUR MISSION</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To democratize elite-level sports technology and empower every athlete — from grassroots 
                  competitors to Olympic champions — with world-class tools that eliminate barriers and 
                  unlock unprecedented performance potential.
                </p>
                <div className="mt-8 pt-6 border-t border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm text-muted-foreground">Performance Without Compromise</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="glass rounded-3xl p-12 border border-accent/20 hover:border-accent/40 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 text-accent mb-8">
                  <Eye className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-display font-black text-foreground mb-6">OUR VISION</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To become the world's most trusted sports technology ecosystem — where every competition 
                  is optimized, every athlete is empowered with data-driven insights, and every community 
                  thrives through seamless digital connection.
                </p>
                <div className="mt-8 pt-6 border-t border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-sm text-muted-foreground">The Future of Sports is Digital</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-32 relative">
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[120px]" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center mb-20"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-8">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-bold text-accent tracking-widest uppercase">
                  OUR JOURNEY
                </span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-display font-black text-foreground mb-8">
                FROM PASSION TO <span className="text-gradient">PLATFORM</span>
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Sportika was born from a simple yet powerful realization: the world of sports deserved 
                technology that matched the intensity, precision, and passion of athletic competition. 
                We're building that future, one innovation at a time.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  icon: Heart, 
                  title: "PASSION", 
                  desc: "Born from a deep love for sport and competition.",
                  color: "from-red-500/20 to-orange-500/20",
                  textColor: "text-red-400"
                },
                { 
                  icon: Cpu, 
                  title: "TECHNOLOGY", 
                  desc: "Powered by cutting-edge digital infrastructure.",
                  color: "from-blue-500/20 to-cyan-500/20",
                  textColor: "text-blue-400"
                },
                { 
                  icon: TrendingUp, 
                  title: "GROWTH", 
                  desc: "Rapidly expanding across sports and markets.",
                  color: "from-green-500/20 to-emerald-500/20",
                  textColor: "text-green-400"
                },
                { 
                  icon: Globe, 
                  title: "COMMUNITY", 
                  desc: "Building a global network of athletes and organizers.",
                  color: "from-purple-500/20 to-pink-500/20",
                  textColor: "text-purple-400"
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="glass rounded-2xl p-8 text-center hover:border-primary/40 transition-all duration-300 border border-border/30"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br ${item.color}`}>
                    <item.icon className={`h-8 w-8 ${item.textColor}`} />
                  </div>
                  <h3 className="font-display font-black text-foreground text-xl mb-4">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  <div className={`mt-4 h-1 w-12 rounded-full bg-gradient-to-r ${item.color.replace("20", "50")} mx-auto`} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Innovation & Technology */}
        <section className="py-32 relative">
          <div className="absolute inset-0 grid-pattern opacity-5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-8">
                  <Lightbulb className="h-4 w-4 text-accent" />
                  <span className="text-xs font-bold text-accent tracking-widest uppercase">
                    INNOVATION ENGINE
                  </span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-display font-black text-foreground mb-8">
                  INNOVATION AT OUR <span className="text-gradient">CORE</span>
                </h2>
                
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  We harness the power of real-time data analytics, machine learning algorithms, 
                  and cloud-native architecture to deliver sports technology that operates at 
                  championship speed and precision.
                </p>
                
                <p className="text-muted-foreground leading-relaxed mb-8">
                  From predictive performance analytics and AI-powered scheduling to live scoring 
                  systems and automated event workflows, Sportika is redefining what's possible 
                  in sports technology.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">AI-Powered Insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">Real-Time Processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">Cloud-Native</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">Military-Grade Security</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="glass rounded-3xl p-8 space-y-6 border border-border/30"
              >
                {[
                  { label: "Real-Time Analytics", value: "99.9%", color: "from-primary/20 to-accent/20" },
                  { label: "Event Automation", value: "92%", color: "from-green-500/20 to-emerald-500/20" },
                  { label: "User Satisfaction", value: "4.9/5", color: "from-yellow-500/20 to-orange-500/20" },
                  { label: "Platform Uptime", value: "99.99%", color: "from-blue-500/20 to-cyan-500/20" },
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label} 
                    className="flex items-center justify-between py-4 border-b border-border/30 last:border-0 group hover:bg-secondary/20 rounded-lg px-4 transition-all duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.color}`} />
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{stat.label}</span>
                    </div>
                    <span className="font-display font-black text-gradient text-2xl group-hover:scale-110 transition-transform">{stat.value}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Future Roadmap */}
        <section className="py-32 relative">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[120px]" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-8">
                <Rocket className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-primary tracking-widest uppercase">
                  FUTURE ROADMAP
                </span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-display font-black text-foreground mb-6">
                THE ROAD <span className="text-gradient">AHEAD</span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our journey is just beginning. Here's what's coming next in our mission 
                to revolutionize sports technology.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 to-accent/30" />
                
                <div className="space-y-12">
                  {milestones.map((m, i) => (
                    <motion.div
                      key={m.year}
                      initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15, duration: 0.6 }}
                      className="relative pl-20 group"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-6 top-6 w-4 h-4 rounded-full bg-gradient-to-r from-primary to-accent border-4 border-background group-hover:scale-125 transition-transform duration-300" />
                      
                      <div className="glass rounded-2xl p-8 border border-border/30 hover:border-primary/40 transition-all duration-300 group-hover:shadow-xl">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-display font-black text-foreground text-2xl">{m.title}</h3>
                          <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-display font-bold text-lg">
                            {m.year}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{m.desc}</p>
                        
                        {i === 2 && (
                          <div className="mt-6 pt-4 border-t border-border/30">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                              Currently in Development
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
