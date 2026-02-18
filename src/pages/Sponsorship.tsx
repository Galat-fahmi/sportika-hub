import { motion } from "framer-motion";
import { Handshake, TrendingUp, Eye, Megaphone, Star, Send } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  { icon: Eye, title: "Brand Visibility", desc: "Reach thousands of athletes and sports enthusiasts through our platform and events." },
  { icon: TrendingUp, title: "Growth Partnership", desc: "Tap into a rapidly growing sports tech ecosystem with engaged, active users." },
  { icon: Megaphone, title: "Marketing Amplification", desc: "Cross-promotional opportunities across digital platforms, events, and products." },
  { icon: Star, title: "Exclusive Access", desc: "First-mover advantage on new features, events, and product launches." },
];

const tiers = [
  {
    name: "Bronze",
    price: "Contact Us",
    features: ["Logo on event pages", "Social media mentions", "Quarterly reports"],
    accent: false,
  },
  {
    name: "Gold",
    price: "Contact Us",
    features: ["All Bronze benefits", "Homepage feature", "Event naming rights", "Dedicated account manager", "Priority placement"],
    accent: true,
  },
  {
    name: "Platinum",
    price: "Contact Us",
    features: ["All Gold benefits", "Co-branded campaigns", "Product integration", "Executive access", "Custom analytics dashboard"],
    accent: false,
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
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="text-xs font-semibold text-primary tracking-widest uppercase">Sponsorship</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mt-4 mb-6">
                Partner with <span className="text-gradient">Sportika</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join a high-growth sports technology brand and connect with an engaged community of athletes, 
                organizers, and sports enthusiasts.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Why Partner */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs font-semibold text-primary tracking-widest uppercase">Why Sportika</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mt-3">
                Why partner with <span className="text-gradient">us</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl p-6 text-center hover:border-primary/30 transition-all"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                    <b.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Tiers */}
        <section className="py-24 relative">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs font-semibold text-primary tracking-widest uppercase">Tiers</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mt-3">
                Partnership <span className="text-gradient">tiers</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {tiers.map((tier, i) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-2xl p-8 transition-all duration-300 ${
                    tier.accent
                      ? "glass border-primary/40 glow-primary"
                      : "glass hover:border-primary/30"
                  }`}
                >
                  {tier.accent && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
                      <Star className="h-3 w-3" /> Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-display font-bold text-foreground mb-2">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{tier.price}</p>
                  <ul className="space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-secondary-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <span className="text-xs font-semibold text-primary tracking-widest uppercase">Get in Touch</span>
                <h2 className="text-4xl font-display font-bold text-foreground mt-3">
                  Sponsorship <span className="text-gradient">inquiry</span>
                </h2>
              </motion.div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onSubmit={handleSubmit}
                className="glass rounded-2xl p-8 space-y-6"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Company</label>
                  <Input
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Company name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your partnership interest..."
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" className="w-full glow-primary" size="lg">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Inquiry
                </Button>
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
