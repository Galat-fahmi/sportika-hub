import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, UserCheck, Trophy } from "lucide-react";

const AdminOverview = () => {
  const { data: profiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id");
      if (error) throw error;
      return data;
    },
  });

  const { data: roles } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role");
      if (error) throw error;
      return data;
    },
  });

  const { data: events } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("id, status, created_at");
      if (error) throw error;
      return data;
    },
  });

  const { data: registrations } = useQuery({
    queryKey: ["admin-registrations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("event_registrations").select("id");
      if (error) throw error;
      return data;
    },
  });

  const totalUsers = profiles?.length ?? 0;
  const athleteCount = roles?.filter((r) => r.role === "athlete").length ?? 0;
  const organizerCount = roles?.filter((r) => r.role === "organizer").length ?? 0;
  const totalEvents = events?.length ?? 0;
  const publishedEvents = events?.filter((e) => e.status === "published").length ?? 0;
  const totalRegistrations = registrations?.length ?? 0;

  const recentEvents = events
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Platform Overview</h1>
        <p className="text-muted-foreground mt-1">System-wide metrics and activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Users" value={totalUsers} icon={<Users className="h-5 w-5" />} description={`${athleteCount} athletes · ${organizerCount} organizers`} />
        <StatsCard title="Total Events" value={totalEvents} icon={<Calendar className="h-5 w-5" />} description={`${publishedEvents} published`} />
        <StatsCard title="Registrations" value={totalRegistrations} icon={<UserCheck className="h-5 w-5" />} />
        <StatsCard title="Active Events" value={events?.filter((e) => e.status === "ongoing").length ?? 0} icon={<Trophy className="h-5 w-5" />} />
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          {recentEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events yet.</p>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((e) => (
                <div key={e.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground truncate">{e.id.slice(0, 8)}…</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground capitalize">{e.status}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
