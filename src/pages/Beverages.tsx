import { motion } from "framer-motion";
import { Flame, Droplets, Zap, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import energyDrinksImage from "@/assets/energy-drinks.jpg";

const flavors = [
  {
    name: "Arctic Blue Raspberry",
    desc: "An icy blast of blue raspberry that cools and refreshes. Engineered for endurance athletes.",
    color: "from-[hsl(200,100%,50%)] to-[hsl(220,100%,60%)]",
    bgColor: "bg-[hsl(200,100%,50%)]/10",
    textColor: "text-[hsl(200,100%,60%)]",
  },
  {
    name: "Electric Yuzu",
    desc: "Sharp citrus intensity that ignites your senses. A jolt of Japanese yuzu for explosive energy.",
    color: "from-[hsl(65,100%,50%)] to-[hsl(80,100%,45%)]",
    bgColor: "bg-[hsl(65,100%,50%)]/10",
    textColor: "text-[hsl(65,90%,55%)]",
  },
  {
    name: "Midnight Grape",
    desc: "Deep, bold grape with a dark berry undertone. Smooth power for late-night training sessions.",
    color: "from-[hsl(275,80%,50%)] to-[hsl(290,80%,40%)]",
    bgColor: "bg-[hsl(275,80%,50%)]/10",
    textColor: "text-[hsl(275,80%,65%)]",
  },
  {
    name: "Blood Orange Blast",
    desc: "Fiery blood orange with a spicy finish. Explosive flavor for explosive performance.",
    color: "from-[hsl(15,100%,50%)] to-[hsl(0,90%,50%)]",
    bgColor: "bg-[hsl(15,100%,50%)]/10",
    textColor: "text-[hsl(15,100%,60%)]",
  },
];

const Beverages = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Subscribed!", description: "You'll be the first to know when Sportika Energy launches." });
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-6">
                <Flame className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-medium text-accent tracking-wide uppercase">Coming Soon</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mt-2 mb-6">
                Sportika <span className="text-gradient">Energy</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                Performance fuel engineered for athletes. Four bold flavors designed to push your limits, 
                sharpen your focus, and power your next victory.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Product Image */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden border border-border/50 max-w-4xl mx-auto"
            >
              <img
                src={energyDrinksImage}
                alt="Sportika Energy drink lineup featuring four bold flavors"
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* Coming Soon Banner */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 text-center border-accent/20 max-w-3xl mx-auto"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <Zap className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-display font-bold text-foreground">Launching 2027</h2>
              </div>
              <p className="text-muted-foreground">
                Sportika Energy is currently in development. Sign up below to get notified when we launch.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Flavors */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs font-semibold text-primary tracking-widest uppercase">Flavors</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mt-3">
                Four ways to <span className="text-gradient">dominate</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {flavors.map((flavor, i) => (
                <motion.div
                  key={flavor.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${flavor.bgColor} mb-5`}>
                    <Droplets className={`h-6 w-6 ${flavor.textColor}`} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-3">{flavor.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{flavor.desc}</p>
                  <div className={`mt-4 h-1 w-16 rounded-full bg-gradient-to-r ${flavor.color} group-hover:w-24 transition-all duration-500`} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Email Subscription */}
        <section className="py-24 relative">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px]" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-12 md:p-16 text-center max-w-2xl mx-auto border-primary/20"
            >
              <Mail className="h-10 w-10 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Be the first to <span className="text-gradient">taste it</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Get exclusive early access, launch updates, and special offers delivered to your inbox.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1"
                />
                <Button type="submit" className="glow-primary shrink-0">
                  Notify Me
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Beverages;
