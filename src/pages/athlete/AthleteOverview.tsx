import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Trophy, Target, TrendingUp } from "lucide-react";
import { format } from "date-fns";

const AthleteOverview = () => {
  const { user } = useAuth();

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, athlete.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Registered Events" value={registrations?.length ?? 0} icon={<Calendar className="h-5 w-5" />} />
        <StatsCard title="Upcoming" value={upcomingEvents.length} icon={<Target className="h-5 w-5" />} />
        <StatsCard title="Completed" value={results?.length ?? 0} icon={<TrendingUp className="h-5 w-5" />} />
        <StatsCard title="Podium Finishes" value={podiumFinishes} icon={<Trophy className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming events. Browse events to register!</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.slice(0, 5).map((reg: any) => (
                  <div key={reg.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{reg.events?.title}</p>
                      <p className="text-xs text-muted-foreground">{reg.events?.sport} · {reg.events?.location}</p>
                    </div>
                    <span className="text-xs text-primary font-medium">
                      {reg.events?.start_date && format(new Date(reg.events.start_date), "MMM d")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Recent Results</CardTitle>
          </CardHeader>
          <CardContent>
            {!results || results.length === 0 ? (
              <p className="text-sm text-muted-foreground">No results yet.</p>
            ) : (
              <div className="space-y-3">
                {results.slice(0, 5).map((res: any) => (
                  <div key={res.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{res.events?.title}</p>
                      <p className="text-xs text-muted-foreground">{res.events?.sport}</p>
                    </div>
                    <div className="text-right">
                      {res.position && (
                        <span className={`text-sm font-bold ${res.position <= 3 ? "text-primary" : "text-foreground"}`}>
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
      </div>
    </div>
  );
};

export default AthleteOverview;
