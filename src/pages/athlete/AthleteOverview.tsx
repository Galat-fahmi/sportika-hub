import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Target, TrendingUp, User, Medal, Star, Zap, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

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
    <div className="space-y-6">
      {/* Welcome Header - Full Width */}
      <div className="px-2 lg:px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Here's what's happening with your athletic journey.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 px-4 py-2 rounded-full">
            <Zap className="h-4 w-4 text-primary" />
            <span>Last updated: {format(new Date(), "MMM d, h:mm a")}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-2 lg:px-4">
        <div className="flex flex-wrap gap-3">
          <Button asChild className="gap-2 px-6 py-3 text-base">
            <Link to="/athlete/events">
              <Calendar className="h-5 w-5" />
              Register Event
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2 px-6 py-3 text-base">
            <Link to="/athlete/profile">
              <User className="h-5 w-5" />
              Update Profile
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview - Full Width */}
      <div className="px-2 lg:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Registered Events" 
            value={registrations?.length ?? 0} 
            icon={<Calendar className="h-6 w-6" />} 
            description="Total event registrations"
            className="bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
          />
          <StatsCard 
            title="Upcoming" 
            value={upcomingEvents.length} 
            icon={<Target className="h-6 w-6" />} 
            description="Events to participate in"
            className="bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
          />
          <StatsCard 
            title="Completed" 
            value={results?.length ?? 0} 
            icon={<TrendingUp className="h-6 w-6" />} 
            description="Events finished"
            className="bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
          />
          <StatsCard 
            title="Podium Finishes" 
            value={podiumFinishes} 
            icon={<Trophy className="h-6 w-6" />} 
            description="Top 3 placements"
            className="bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
          />
        </div>
      </div>

      {/* Performance Summary - Full Width */}
      <div className="px-2 lg:px-4">
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl lg:text-2xl flex items-center gap-3">
              <Medal className="h-6 w-6 text-primary" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-4">
              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <p className="text-3xl font-display font-bold text-foreground">{totalWins}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Wins</p>
              </div>
              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <p className="text-3xl font-display font-bold text-foreground">{totalPoints}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Points</p>
              </div>
              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <p className="text-3xl font-display font-bold text-foreground">
                  {bestRank ? `#${bestRank}` : '-'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Best Rank</p>
              </div>
              <div className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <p className="text-3xl font-display font-bold text-foreground">
                  {results?.length > 0 ? Math.round((podiumFinishes / results.length) * 100) : 0}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">Podium Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events & Recent Results - Full Width */}
      <div className="px-2 lg:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Events
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/athlete/events" className="gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-base text-muted-foreground mb-4">No upcoming events registered.</p>
                  <Button asChild>
                    <Link to="/athlete/events">Browse Events</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.slice(0, 5).map((reg: any) => (
                    <div key={reg.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 border border-border/30">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{reg.events?.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{reg.events?.sport} · {reg.events?.location}</p>
                      </div>
                      <div className="text-right ml-4">
                        <span className="text-sm font-semibold text-primary block">
                          {reg.events?.start_date && format(new Date(reg.events.start_date), "MMM d")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {reg.events?.start_date && format(new Date(reg.events.start_date), "yyyy")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Recent Results
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/athlete/results" className="gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {!results || results.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-base text-muted-foreground">No results recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.slice(0, 5).map((res: any) => (
                    <div key={res.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 border border-border/30">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{res.events?.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{res.events?.sport}</p>
                      </div>
                      <div className="text-right">
                        {res.position && (
                          <span className={`text-base font-bold block ${res.position <= 3 ? "text-primary" : "text-foreground"}`}>
                            {res.position === 1 && "🥇 "}
                            {res.position === 2 && "🥈 "}
                            {res.position === 3 && "🥉 "}
                            #{res.position}
                          </span>
                        )}
                        {res.score && <p className="text-sm text-muted-foreground mt-1">{res.score} pts</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AthleteOverview;
