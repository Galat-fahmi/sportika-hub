import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Target, TrendingUp, User, Medal, Star, Zap, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const AthleteOverview = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["athlete-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: registrations } = useQuery({
    queryKey: ["athlete-registrations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_registrations")
        .select("*, events(*)")
        .eq("athlete_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: results } = useQuery({
    queryKey: ["athlete-results", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_results")
        .select("*, events(*)")
        .eq("athlete_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const upcomingEvents = registrations?.filter(
    (r: any) => r.events && new Date(r.events.start_date) > new Date()
  ) ?? [];

  const podiumFinishes = results?.filter((r: any) => r.position && r.position <= 3).length ?? 0;
  const totalWins = results?.filter((r: any) => r.position === 1).length ?? 0;
  const totalPoints = results?.reduce((sum: number, r: any) => sum + (r.score || 0), 0) ?? 0;
  const bestRank = results?.length > 0
    ? Math.min(...results.filter((r: any) => r.position).map((r: any) => r.position))
    : null;

  const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Athlete';

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div {...fadeIn} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Here's your athletic journey at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 px-4 py-2 rounded-full border border-border/30">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span>Updated {format(new Date(), "MMM d, h:mm a")}</span>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div {...fadeIn} transition={{ delay: 0.05 }} className="flex flex-wrap gap-3">
        <Button asChild size="lg" className="gap-2 rounded-xl">
          <Link to="/athlete/events">
            <Calendar className="h-4 w-4" />
            Register Event
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild className="gap-2 rounded-xl">
          <Link to="/athlete/profile">
            <User className="h-4 w-4" />
            Update Profile
          </Link>
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Registered Events"
          value={registrations?.length ?? 0}
          icon={<Calendar className="h-5 w-5" />}
          description="Total registrations"
        />
        <StatsCard
          title="Upcoming"
          value={upcomingEvents.length}
          icon={<Target className="h-5 w-5" />}
          description="Events ahead"
        />
        <StatsCard
          title="Completed"
          value={results?.length ?? 0}
          icon={<TrendingUp className="h-5 w-5" />}
          description="Events finished"
        />
        <StatsCard
          title="Podium Finishes"
          value={podiumFinishes}
          icon={<Trophy className="h-5 w-5" />}
          description="Top 3 placements"
        />
      </motion.div>

      {/* Performance Summary */}
      <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
        <Card className="border border-border/50 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-3">
              <Medal className="h-5 w-5 text-primary" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4">
              {[
                { icon: Trophy, label: "Total Wins", value: totalWins, color: "text-primary" },
                { icon: Star, label: "Total Points", value: totalPoints, color: "text-primary" },
                { icon: Target, label: "Best Rank", value: bestRank ? `#${bestRank}` : '-', color: "text-primary" },
                { icon: TrendingUp, label: "Podium Rate", value: `${results?.length > 0 ? Math.round((podiumFinishes / results.length) * 100) : 0}%`, color: "text-primary" },
              ].map((stat) => (
                <div key={stat.label} className="text-center group">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/5 mx-auto mb-3 group-hover:bg-primary/10 group-hover:scale-105 transition-all duration-300">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Events & Recent Results */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="border border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Upcoming Events
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs gap-1">
              <Link to="/athlete/events">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-10">
                <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">No upcoming events.</p>
                <Button size="sm" asChild>
                  <Link to="/athlete/events">Browse Events</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.slice(0, 4).map((reg: any) => (
                  <div key={reg.id} className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-all duration-300 border border-border/20 group">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">{reg.events?.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{reg.events?.sport} · {reg.events?.location}</p>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <span className="text-sm font-bold text-primary">
                        {reg.events?.start_date && format(new Date(reg.events.start_date), "MMM d")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              Recent Results
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs gap-1">
              <Link to="/athlete/results">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {!results || results.length === 0 ? (
              <div className="text-center py-10">
                <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No results recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.slice(0, 4).map((res: any) => (
                  <div key={res.id} className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-all duration-300 border border-border/20 group">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">{res.events?.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{res.events?.sport}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {res.position && (
                        <span className={`text-sm font-bold ${res.position <= 3 ? "text-primary" : "text-foreground"}`}>
                          {res.position === 1 && "🥇 "}
                          {res.position === 2 && "🥈 "}
                          {res.position === 3 && "🥉 "}
                          #{res.position}
                        </span>
                      )}
                      {res.score && <p className="text-xs text-muted-foreground">{res.score} pts</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AthleteOverview;
