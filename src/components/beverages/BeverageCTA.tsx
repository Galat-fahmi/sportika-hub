import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const BeverageCTA = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Subscribed!",
      description:
        "You'll be the first to know when Sportika Energy launches. Check your inbox for a special welcome offer!",
    });
    setEmail("");
  };

  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[200px] animate-pulse-slow" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="card-premium p-12 md:p-20 text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-10 mx-auto"
          >
            <Mail className="h-10 w-10" />
          </motion.div>

          <h2 className="heading-lg text-foreground mb-6">
            BE THE FIRST TO <span className="text-gradient">TASTE IT</span>
          </h2>

          <p className="body-lg mb-12 max-w-2xl mx-auto">
            Join our exclusive preview list and get early access, special launch
            pricing, and insider updates on championship-grade performance fuel.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
          >
            <div className="flex-1">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for exclusive access"
                required
                className="h-14 text-base px-6 bg-background/50 border-2 border-border/50 focus:border-primary/50 rounded-2xl transition-all duration-300"
              />
            </div>
            <Button
              type="submit"
              className="btn-premium h-14 px-8 font-bold text-base rounded-2xl group shrink-0"
            >
              Get Exclusive Access
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-8">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates from Sportika Energy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BeverageCTA;
