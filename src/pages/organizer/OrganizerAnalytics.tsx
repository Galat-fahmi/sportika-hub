import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BarChart3 } from "lucide-react";

const COLORS = ["hsl(145,100%,45%)", "hsl(190,100%,50%)", "hsl(225,25%,30%)", "hsl(0,72%,51%)", "hsl(225,20%,50%)"];

const OrganizerAnalytics = () => {
  const { user } = useAuth();

  const { data: events } = useQuery({
    queryKey: ["organizer-events", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("organizer_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: registrations } = useQuery({
    queryKey: ["organizer-all-registrations", user?.id],
    queryFn: async () => {
      if (!events || events.length === 0) return [];
      const { data, error } = await supabase
        .from("event_registrations")
        .select("event_id")
        .in("event_id", events.map((e) => e.id));
      if (error) throw error;
      return data;
    },
    enabled: !!events,
  });

  // Status breakdown
  const statusData = events
    ? Object.entries(
        events.reduce<Record<string, number>>((acc, e) => {
          acc[e.status] = (acc[e.status] ?? 0) + 1;
          return acc;
        }, {})
      ).map(([name, value]) => ({ name, value }))
    : [];

  // Registrations per event
  const regCounts = registrations
    ? registrations.reduce<Record<string, number>>((acc, r) => {
        acc[r.event_id] = (acc[r.event_id] ?? 0) + 1;
        return acc;
      }, {})
    : {};

  const barData = events
    ?.slice(0, 8)
    .map((e) => ({
      name: e.title.length > 15 ? e.title.slice(0, 15) + "…" : e.title,
      registrations: regCounts[e.id] ?? 0,
    })) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Insights into your events and participation.</p>
      </div>

      {!events || events.length === 0 ? (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Create events to see analytics here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Registrations per Event</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(225,20%,18%)" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "hsl(225,30%,10%)", border: "1px solid hsl(225,20%,18%)", borderRadius: 8, color: "hsl(210,40%,96%)" }} />
                  <Bar dataKey="registrations" fill="hsl(145,100%,45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Event Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(225,30%,10%)", border: "1px solid hsl(225,20%,18%)", borderRadius: 8, color: "hsl(210,40%,96%)" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OrganizerAnalytics;
