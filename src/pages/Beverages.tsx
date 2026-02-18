import { motion } from "framer-motion";
import { Flame, Droplets, Zap, Mail, ArrowRight, Trophy, Target, Users, Star, Shield, Battery, Clock } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-sports.jpg";
import energyDrinksImage from "@/assets/energy-drinks.jpg";
import arcticBlue from "@/assets/ArcticBlueRaspberry.jpeg";
import electricYuzu from "@/assets/ElectricYuzu.jpeg";
import midnightGrape from "@/assets/MidnightGrape.jpeg";
import bloodOrange from "@/assets/BloodOrangeBlast.jpeg";

const flavors = [
  {
    name: "Arctic Blue Raspberry",
    desc: "An icy blast of blue raspberry that cools and refreshes. Engineered for endurance athletes with beta-alanine for sustained performance.",
    color: "from-[hsl(200,100%,50%)] to-[hsl(220,100%,60%)]",
    bgColor: "bg-[hsl(200,100%,50%)]/10",
    textColor: "text-[hsl(200,100%,60%)]",
    icon: Droplets,
    tagline: "ENDURANCE FUEL",
    benefits: ["200mg Caffeine", "Beta-Alanine", "Electrolytes"],
    image: arcticBlue,
    gradient: "from-blue-400 to-cyan-400"
  },
  {
    name: "Electric Yuzu",
    desc: "Sharp citrus intensity that ignites your senses. A jolt of Japanese yuzu for explosive energy with L-theanine for focus.",
    color: "from-[hsl(65,100%,50%)] to-[hsl(80,100%,45%)]",
    bgColor: "bg-[hsl(65,100%,50%)]/10",
    textColor: "text-[hsl(65,90%,55%)]",
    icon: Zap,
    tagline: "EXPLOSIVE POWER",
    benefits: ["300mg Caffeine", "L-Theanine", "B-Vitamins"],
    image: electricYuzu,
    gradient: "from-lime-400 to-yellow-400"
  },
  {
    name: "Midnight Grape",
    desc: "Deep, bold grape with a dark berry undertone. Smooth power for late-night training sessions with zero crash formula.",
    color: "from-[hsl(275,80%,50%)] to-[hsl(290,80%,40%)]",
    bgColor: "bg-[hsl(275,80%,50%)]/10",
    textColor: "text-[hsl(275,80%,65%)]",
    icon: Trophy,
    tagline: "CHAMPIONSHIP FOCUS",
    benefits: ["150mg Caffeine", "Tyrosine", "Zero Crash"],
    image: midnightGrape,
    gradient: "from-purple-400 to-violet-400"
  },
  {
    name: "Blood Orange Blast",
    desc: "Fiery blood orange with a spicy finish. Explosive flavor for explosive performance with citrulline for pumps.",
    color: "from-[hsl(15,100%,50%)] to-[hsl(0,90%,50%)]",
    bgColor: "bg-[hsl(15,100%,50%)]/10",
    textColor: "text-[hsl(15,100%,60%)]",
    icon: Target,
    tagline: "PRECISION ENERGY",
    benefits: ["250mg Caffeine", "Citrulline", "Niacin"],
    image: bloodOrange,
    gradient: "from-orange-400 to-red-400"
  },
];

const Beverages = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ 
      title: "Subscribed!", 
      description: "You'll be the first to know when Sportika Energy launches. Check your inbox for a special welcome offer!" 
    });
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Banner with Background Image */}
        <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img
              src={heroBg}
              alt="Athlete performing with Sportika Energy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>

          {/* Animated Elements */}
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-accent/20 blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[150px] animate-pulse" style={{ animationDelay: "1s" }} />
          
          {/* Hero Content */}
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-accent/40 px-5 py-2 mb-8"
              >
                <Flame className="h-4 w-4 text-accent animate-pulse" />
                <span className="text-sm font-bold text-white tracking-widest uppercase">
                  OFFICIAL ENERGY DRINK OF CHAMPIONS
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-6xl md:text-8xl lg:text-9xl font-display font-black text-white mb-6 leading-[0.9]"
              >
                FUEL YOUR
                <br />
                <span className="text-gradient bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                  VICTORY
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-xl md:text-2xl text-white/80 max-w-2xl mb-10 leading-relaxed"
              >
                Championship-grade performance fuel engineered for elite athletes. 
                Zero sugar. Zero crash. Maximum performance.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <Button 
                  size="lg" 
                  className="glow-primary h-14 px-8 text-lg font-bold bg-accent hover:bg-accent/90 text-white"
                  onClick={() => document.getElementById('flavors')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Flavors
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-14 px-8 text-lg font-bold border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                >
                  Watch Film
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="grid grid-cols-3 gap-8 mt-16 max-w-2xl"
              >
                <div>
                  <div className="text-3xl font-black text-white">0g</div>
                  <div className="text-sm text-white/60">Sugar</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white">300mg</div>
                  <div className="text-sm text-white/60">Natural Caffeine</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white">2027</div>
                  <div className="text-sm text-white/60">Launch Year</div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-white/60 uppercase tracking-widest">Scroll</span>
              <div className="w-5 h-10 border-2 border-white/20 rounded-full flex justify-center">
                <motion.div 
                  animate={{ y: [0, 12, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-1 h-2 bg-accent rounded-full mt-2"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Product Showcase - 4 Images with Details */}
        <section id="flavors" className="py-32 relative">
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
                  THE COLLECTION
                </span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-display font-black text-foreground mb-6">
                FOUR WAYS TO <span className="text-gradient">DOMINATE</span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Each flavor engineered for specific performance needs and athlete preferences.
                Zero sugar. Zero artificial colors. Maximum results.
              </p>
            </motion.div>

            {/* Product Grid */}
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {flavors.map((flavor, i) => (
                <motion.div
                  key={flavor.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="glass rounded-3xl overflow-hidden border border-border/50 hover:border-primary/40 transition-all duration-500">
                    {/* Product Image */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                      <img
                        src={flavor.image}
                        alt={flavor.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${flavor.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                      
                      {/* Flavor Tag */}
                      <div className="absolute top-4 right-4">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${flavor.bgColor} backdrop-blur-sm border border-white/10`}>
                          <flavor.icon className={`h-4 w-4 ${flavor.textColor}`} />
                          <span className={`text-xs font-bold ${flavor.textColor} uppercase tracking-wider`}>
                            {flavor.tagline}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-display font-black text-foreground group-hover:text-gradient transition-all duration-300">
                          {flavor.name}
                        </h3>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {flavor.desc}
                      </p>
                      
                      {/* Benefits */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {flavor.benefits.map((benefit, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${flavor.bgColor} ${flavor.textColor}`}
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Performance Index</span>
                          <span className={flavor.textColor}>9.5/10</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-border overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "95%" }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                            className={`h-full rounded-full bg-gradient-to-r ${flavor.color}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Lineup Image */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <div className="rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
                <img
                  src={energyDrinksImage}
                  alt="Sportika Energy drink lineup featuring four bold flavors"
                  className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Banner */}
        <section className="py-20 bg-gradient-to-b from-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { icon: Battery, label: "Sustained Energy", desc: "No crash, just focus" },
                { icon: Shield, label: "Clean Formula", desc: "Zero artificial ingredients" },
                { icon: Trophy, label: "Proven Results", desc: "Trusted by athletes" },
                { icon: Clock, label: "Rapid Absorption", desc: "Works in 15 minutes" }
              ].map((feature, i) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent mb-4">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{feature.label}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon Banner */}
        <section className="py-16 relative">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[150px]" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-10 text-center border border-accent/30 max-w-4xl mx-auto backdrop-blur-xl"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 text-accent">
                  <Zap className="h-8 w-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-black text-foreground">LAUNCHING 2027</h2>
              </div>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Sportika Energy is currently in advanced development with Olympic athletes and 
                professional teams. Join our exclusive preview list to be the first to experience 
                championship-level performance fuel.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Athlete Testing Complete
                </span>
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Formula Finalized
                </span>
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                  Manufacturing Setup
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Email Subscription */}
        <section className="py-32 relative">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/10 blur-[200px] animate-pulse" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-12 md:p-16 text-center max-w-3xl mx-auto border border-primary/30 backdrop-blur-xl shadow-2xl"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary mb-8 mx-auto">
                <Mail className="h-10 w-10" />
              </div>
              
              <h2 className="text-3xl md:text-5xl font-display font-black text-foreground mb-6">
                BE THE FIRST TO <span className="text-gradient">TASTE IT</span>
              </h2>
              
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Join our exclusive preview list and get early access, special launch pricing, 
                and insider updates on Sportika Energy's championship-grade performance fuel.
              </p>
              
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <div className="flex-1">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for exclusive access"
                    required
                    className="h-14 text-base px-6 border-2 border-border/50 focus:border-primary/50 transition-all duration-300"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="glow-primary h-14 px-8 font-bold text-lg group transition-all duration-300 shrink-0"
                >
                  Get Exclusive Access
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
              
              <p className="text-xs text-muted-foreground mt-6">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from Sportika Energy.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Beverages;