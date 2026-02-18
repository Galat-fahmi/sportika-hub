import { motion } from "framer-motion";
import { Handshake, TrendingUp, Eye, Megaphone, Star, Send, Zap, Users, Trophy, Target } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  { 
    icon: Eye, 
    title: "PREMIUM BRAND VISIBILITY", 
    desc: "Reach 50,000+ elite athletes and 1,200+ organizations through our high-performance platform and championship events." 
  },
  { 
    icon: TrendingUp, 
    title: "GROWTH PARTNERSHIP", 
    desc: "Access a rapidly expanding sports tech ecosystem with highly engaged, performance-driven users who demand excellence." 
  },
  { 
    icon: Megaphone, 
    title: "MARKETING AMPLIFICATION", 
    desc: "Leverage cross-promotional opportunities across digital channels, live events, and premium performance products." 
  },
  { 
    icon: Star, 
    title: "EXCLUSIVE ACCESS", 
    desc: "First-mover advantage on cutting-edge features, elite events, and next-generation product launches." 
  },
  { 
    icon: Trophy, 
    title: "CHAMPIONSHIP CREDIBILITY", 
    desc: "Associate your brand with Olympic athletes, professional teams, and world-class sporting events." 
  },
  { 
    icon: Target, 
    title: "PRECISION TARGETING", 
    desc: "Access granular demographic and behavioral data to deliver highly targeted marketing campaigns." 
  },
];

const tiers = [
  {
    name: "Performance",
    price: "Contact Us",
    features: [
      "Logo placement on event pages",
      "Social media mentions across channels",
      "Quarterly performance reports",
      "Basic analytics dashboard",
      "Community engagement opportunities"
    ],
    accent: false,
    color: "from-blue-500/20 to-cyan-500/20",
    textColor: "text-blue-400"
  },
  {
    name: "Elite",
    price: "Contact Us",
    features: [
      "All Performance benefits",
      "Homepage feature placement",
      "Event naming rights",
      "Dedicated partnership manager",
      "Priority product placement",
      "VIP event access",
      "Co-marketing campaign support"
    ],
    accent: true,
    color: "from-primary/20 to-accent/20",
    textColor: "text-primary"
  },
  {
    name: "Championship",
    price: "Contact Us",
    features: [
      "All Elite benefits",
      "Co-branded global campaigns",
      "Product integration opportunities",
      "Executive-level partnership access",
      "Custom analytics and insights",
      "Exclusive event sponsorship",
      "Direct athlete endorsement pathways"
    ],
    accent: false,
    color: "from-yellow-500/20 to-orange-500/20",
    textColor: "text-yellow-400"
  },
];

const Sponsorship = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Inquiry Submitted", description: "We'll be in touch soon. Thank you for your interest!" });
    setForm({ name: "", email: "", company: "", message: "" });
  };

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
                <Handshake className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-primary tracking-widest uppercase">
                  PARTNERSHIP OPPORTUNITIES
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-foreground mb-8 leading-[1.05]">
                PARTNER WITH <span className="text-gradient">SPORTIKA</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                Join the world's most advanced sports technology ecosystem and connect with 
                elite athletes, championship events, and performance-driven communities 
                across 75+ countries.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  50K+ Elite Athletes
                </span>
                <span className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-accent" />
                  1.2K+ Events
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Championship Performance
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Partner */}
        <section className="py-32 relative">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-8">
                <Target className="h-4 w-4 text-accent" />
                <span className="text-xs font-bold text-accent tracking-widest uppercase">
                  WHY PARTNER WITH US
                </span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-display font-black text-foreground mb-6">
                UNPARALLELED <span className="text-gradient">PARTNERSHIP</span> OPPORTUNITIES
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Connect with the world's most passionate and performance-driven sports community
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass rounded-2xl p-8 text-center hover:border-primary/40 transition-all duration-300 border border-border/30"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary mb-6">
                    <b.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-display font-black text-foreground text-xl mb-4">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Tiers */}
        <section className="py-32 relative">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[120px]" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-8">
                <Star className="h-4 w-4 text-accent" />
                <span className="text-xs font-bold text-accent tracking-widest uppercase">
                  PARTNERSHIP TIERS
                </span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-display font-black text-foreground mb-6">
                TIERED <span className="text-gradient">PARTNERSHIP</span> OPTIONS
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Flexible partnership structures designed to maximize your brand's impact and ROI
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
              {tiers.map((tier, i) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.7 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`rounded-3xl p-10 transition-all duration-500 border-2 ${
                    tier.accent
                      ? `glass border-primary/50 glow-primary shadow-2xl relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-accent/5 before:rounded-3xl`
                      : `glass border-border/30 hover:border-primary/40 hover:shadow-xl`
                  }`}
                >
                  {tier.accent && (
                    <div className="absolute -top-2 -right-2 w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center rotate-12">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br ${tier.color}`}>
                    <span className={`font-display font-black text-2xl ${tier.textColor}`}>{tier.name.charAt(0)}</span>
                  </div>
                  
                  <h3 className="text-3xl font-display font-black text-foreground mb-4">{tier.name}</h3>
                  <p className="text-lg font-semibold text-muted-foreground mb-8">{tier.price}</p>
                  
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((f, index) => (
                      <motion.li 
                        key={f} 
                        className="flex items-start gap-3 text-foreground group"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 + index * 0.05 }}
                      >
                        <div className={`mt-1.5 w-2 h-2 rounded-full ${tier.accent ? "bg-primary" : "bg-gradient-to-r from-primary to-accent"} group-hover:scale-150 transition-transform`} />
                        <span className="text-sm leading-relaxed">{f}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full font-bold py-6 text-lg transition-all duration-300 ${
                      tier.accent 
                        ? "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground" 
                        : "border-2 border-primary/30 bg-secondary hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Contact Team
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-32 relative">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-8">
                  <Send className="h-4 w-4 text-accent" />
                  <span className="text-xs font-bold text-accent tracking-widest uppercase">
                    PARTNERSHIP INQUIRY
                  </span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-display font-black text-foreground mb-6">
                  READY TO <span className="text-gradient">PARTNER</span> WITH US?
                </h2>
                
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Our partnerships team is ready to discuss how Sportika can help 
                  amplify your brand and connect you with the world's elite sports community.
                </p>
              </motion.div>

              <motion.form
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onSubmit={handleSubmit}
                className="glass rounded-3xl p-10 space-y-8 border border-primary/20 backdrop-blur-xl"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">Full Name</label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">Email Address</label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@company.com"
                      required
                      className="h-12 text-base"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Company Name</label>
                  <Input
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Your company name"
                    required
                    className="h-12 text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Partnership Interest</label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your partnership goals, target audience, and what you hope to achieve with Sportika..."
                    rows={5}
                    required
                    className="text-base"
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full glow-primary py-6 text-lg font-bold group transition-all duration-300"
                    size="lg"
                  >
                    <Send className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                    Send Partnership Inquiry
                  </Button>
                </div>
                
                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    We typically respond within 24 hours. All inquiries are confidential.
                  </p>
                </div>
              </motion.form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Sponsorship;
