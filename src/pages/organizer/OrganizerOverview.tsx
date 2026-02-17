import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, DollarSign, BarChart3 } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-primary/20 text-primary",
  ongoing: "bg-accent/20 text-accent",
  completed: "bg-secondary text-secondary-foreground",
  cancelled: "bg-destructive/20 text-destructive",
};

const OrganizerOverview = () => {
  const { user } = useAuth();

  const { data: events } = useQuery({
    queryKey: ["organizer-events", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("organizer_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: totalRegistrations } = useQuery({
    queryKey: ["organizer-registrations-count", user?.id],
    queryFn: async () => {
      if (!events || events.length === 0) return 0;
      const eventIds = events.map((e) => e.id);
      const { count, error } = await supabase
        .from("event_registrations")
        .select("*", { count: "exact", head: true })
        .in("event_id", eventIds);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!events,
  });

  const publishedCount = events?.filter((e) => e.status === "published" || e.status === "ongoing").length ?? 0;
  const totalRevenue = events?.reduce((sum, e) => sum + Number(e.registration_fee ?? 0), 0) ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your events and track performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Events" value={events?.length ?? 0} icon={<Calendar className="h-5 w-5" />} />
        <StatsCard title="Active Events" value={publishedCount} icon={<BarChart3 className="h-5 w-5" />} />
        <StatsCard title="Total Registrations" value={totalRegistrations ?? 0} icon={<Users className="h-5 w-5" />} />
        <StatsCard title="Avg Fee" value={`$${events?.length ? (totalRevenue / events.length).toFixed(0) : 0}`} icon={<DollarSign className="h-5 w-5" />} />
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          {!events || events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events yet. Create your first event!</p>
          ) : (
            <div className="space-y-3">
              {events.slice(0, 6).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.sport} · {format(new Date(event.start_date), "MMM d, yyyy")}</p>
                  </div>
                  <Badge className={statusColors[event.status] ?? ""}>{event.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerOverview;
