import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BarChart3 } from "lucide-react";

const COLORS = ["hsl(145,100%,45%)", "hsl(190,100%,50%)", "hsl(225,25%,30%)", "hsl(0,72%,51%)", "hsl(40,100%,50%)"];

const AdminAnalytics = () => {
  const { data: roles } = useQuery({
    queryKey: ["admin-analytics-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role");
      if (error) throw error;
      return data;
    },
  });

  const { data: events } = useQuery({
    queryKey: ["admin-analytics-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("id, status, sport, title");
      if (error) throw error;
      return data;
    },
  });

  const { data: registrations } = useQuery({
    queryKey: ["admin-analytics-regs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("event_registrations").select("event_id");
      if (error) throw error;
      return data;
    },
  });

  // Role distribution
  const roleData = roles
    ? Object.entries(
        roles.reduce<Record<string, number>>((acc, r) => { acc[r.role] = (acc[r.role] ?? 0) + 1; return acc; }, {})
      ).map(([name, value]) => ({ name, value }))
    : [];

  // Events by sport
  const sportData = events
    ? Object.entries(
        events.reduce<Record<string, number>>((acc, e) => { acc[e.sport] = (acc[e.sport] ?? 0) + 1; return acc; }, {})
      ).map(([name, value]) => ({ name, value }))
    : [];

  // Top events by registrations
  const regCounts = registrations?.reduce<Record<string, number>>((acc, r) => {
    acc[r.event_id] = (acc[r.event_id] ?? 0) + 1;
    return acc;
  }, {}) ?? {};

  const topEvents = events
    ?.map((e) => ({ name: e.title.length > 18 ? e.title.slice(0, 18) + "…" : e.title, registrations: regCounts[e.id] ?? 0 }))
    .sort((a, b) => b.registrations - a.registrations)
    .slice(0, 8) ?? [];

  const hasData = (events?.length ?? 0) > 0 || (roles?.length ?? 0) > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Platform Analytics</h1>
        <p className="text-muted-foreground mt-1">Insights across all users and events.</p>
      </div>

      {!hasData ? (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No data available yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass">
            <CardHeader><CardTitle className="text-lg">User Role Distribution</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={roleData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(225,30%,10%)", border: "1px solid hsl(225,20%,18%)", borderRadius: 8, color: "hsl(210,40%,96%)" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader><CardTitle className="text-lg">Events by Sport</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sportData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(225,20%,18%)" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "hsl(225,30%,10%)", border: "1px solid hsl(225,20%,18%)", borderRadius: 8, color: "hsl(210,40%,96%)" }} />
                  <Bar dataKey="value" fill="hsl(190,100%,50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass lg:col-span-2">
            <CardHeader><CardTitle className="text-lg">Top Events by Registrations</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topEvents}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(225,20%,18%)" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "hsl(225,30%,10%)", border: "1px solid hsl(225,20%,18%)", borderRadius: 8, color: "hsl(210,40%,96%)" }} />
                  <Bar dataKey="registrations" fill="hsl(145,100%,45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
