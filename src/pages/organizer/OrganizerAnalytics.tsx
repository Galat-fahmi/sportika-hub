import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend
} from "recharts";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Trophy, 
  DollarSign,
  Calendar,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns";

const COLORS = ["hsl(145,100%,45%)", "hsl(190,100%,50%)", "hsl(225,25%,30%)", "hsl(0,72%,51%)", "hsl(225,20%,50%)"];
const SPORT_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"];

const OrganizerAnalytics = () => {
  const { user } = useAuth();

  const { data: events } = useQuery({
    queryKey: ["organizer-analytics-events", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("organizer_id", user!.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: registrations } = useQuery({
    queryKey: ["organizer-analytics-registrations", user?.id],
    queryFn: async () => {
      if (!events || events.length === 0) return [];
      const { data, error } = await supabase
        .from("event_registrations")
        .select("*, events(sport, registration_fee)")
        .in("event_id", events.map((e) => e.id))
        .order("registered_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!events,
  });

  // Calculate metrics
  const totalEvents = events?.length ?? 0;
  const totalRegistrations = registrations?.length ?? 0;
  const totalRevenue = registrations?.reduce((sum: number, r: any) => 
    sum + Number(r.events?.registration_fee || 0), 0
  ) ?? 0;
  
  const avgRegistrationsPerEvent = totalEvents > 0 ? Math.round(totalRegistrations / totalEvents) : 0;
  
  // Event performance data
  const eventPerformanceData = events?.map((event) => {
    const eventRegs = registrations?.filter((r: any) => r.event_id === event.id) ?? [];
    const revenue = eventRegs.reduce((sum: number, r: any) => sum + Number(event.registration_fee || 0), 0);
    return {
      name: event.title.length > 12 ? event.title.slice(0, 12) + "…" : event.title,
      registrations: eventRegs.length,
      revenue: revenue,
      capacity: event.max_participants || 100,
      fillRate: event.max_participants ? Math.round((eventRegs.length / event.max_participants) * 100) : 0,
    };
  }).slice(-8) ?? [];

  // Participation trends (last 6 months)
  const participationTrendData = (() => {
    if (!registrations) return [];
    const months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date(),
    });
    
    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const count = registrations.filter((r: any) => {
        const date = new Date(r.registered_at);
        return date >= monthStart && date <= monthEnd;
      }).length;
      
      return {
        month: format(month, "MMM yyyy"),
        registrations: count,
      };
    });
  })();

  // Revenue growth data
  const revenueGrowthData = (() => {
    if (!registrations) return [];
    const months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date(),
    });
    
    let cumulativeRevenue = 0;
    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthRevenue = registrations
        .filter((r: any) => {
          const date = new Date(r.registered_at);
          return date >= monthStart && date <= monthEnd && r.payment_status === 'paid';
        })
        .reduce((sum: number, r: any) => sum + Number(r.events?.registration_fee || 0), 0);
      
      cumulativeRevenue += monthRevenue;
      
      return {
        month: format(month, "MMM yyyy"),
        revenue: monthRevenue,
        cumulative: cumulativeRevenue,
      };
    });
  })();

  // Sport category popularity
  const sportCategoryData = (() => {
    if (!events) return [];
    const sportCounts: Record<string, number> = {};
    events.forEach(event => {
      sportCounts[event.sport] = (sportCounts[event.sport] ?? 0) + 1;
    });
    return Object.entries(sportCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  })();

  // Status breakdown
  const statusData = events
    ? Object.entries(
        events.reduce<Record<string, number>>((acc, e) => {
          acc[e.status] = (acc[e.status] ?? 0) + 1;
          return acc;
        }, {})
      ).map(([name, value]) => ({ name, value }))
    : [];

  // Retention rate calculation (mock data - would need historical data in real app)
  const retentionRate = 78; // Mock percentage
  const retentionChange = 12; // Mock percentage change

  // Top performing events
  const topEvents = eventPerformanceData
    .sort((a, b) => b.registrations - a.registrations)
    .slice(0, 3);

  if (!events || events.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Insights into your events and participation.</p>
        </div>
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Create events to see analytics here.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Comprehensive insights into your events and performance.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-display font-bold">{totalEvents}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Participants</p>
                <p className="text-2xl font-display font-bold">{totalRegistrations}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <span className="text-muted-foreground">Avg per event:</span>
              <span className="font-medium">{avgRegistrationsPerEvent}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-display font-bold">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Retention Rate</p>
                <p className="text-2xl font-display font-bold">{retentionRate}%</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+{retentionChange}%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {/* Event Performance Chart */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-primary" />
                Event Performance Metrics
              </CardTitle>
              <CardDescription>Registrations and fill rates by event</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={eventPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(225,20%,18%)" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} allowDecimals={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: "hsl(225,30%,10%)", 
                      border: "1px solid hsl(225,20%,18%)", 
                      borderRadius: 8, 
                      color: "hsl(210,40%,96%)" 
                    }} 
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="registrations" name="Registrations" fill="hsl(145,100%,45%)" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="fillRate" name="Fill Rate %" fill="hsl(190,100%,50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Performing Events */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-primary" />
                Top Performing Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{event.name}</p>
                        <p className="text-sm text-muted-foreground">{event.registrations} registrations</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{event.fillRate}%</p>
                      <p className="text-xs text-muted-foreground">fill rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          {/* Participation Trends */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Participation Trends
              </CardTitle>
              <CardDescription>Monthly registration trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={participationTrendData}>
                  <defs>
                    <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(145,100%,45%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(145,100%,45%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(225,20%,18%)" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: "hsl(225,30%,10%)", 
                      border: "1px solid hsl(225,20%,18%)", 
                      borderRadius: 8, 
                      color: "hsl(210,40%,96%)" 
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="registrations" 
                    stroke="hsl(145,100%,45%)" 
                    fillOpacity={1} 
                    fill="url(#colorRegistrations)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Growth */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Revenue Growth
              </CardTitle>
              <CardDescription>Monthly and cumulative revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(225,20%,18%)" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: "hsl(225,30%,10%)", 
                      border: "1px solid hsl(225,20%,18%)", 
                      borderRadius: 8, 
                      color: "hsl(210,40%,96%)" 
                    }} 
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Monthly Revenue" stroke="hsl(145,100%,45%)" strokeWidth={2} />
                  <Line type="monotone" dataKey="cumulative" name="Cumulative" stroke="hsl(190,100%,50%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sport Categories */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="h-5 w-5 text-primary" />
                  Popular Sport Categories
                </CardTitle>
                <CardDescription>Distribution of events by sport</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      data={sportCategoryData} 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={100} 
                      dataKey="value" 
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {sportCategoryData.map((_, i) => (
                        <Cell key={i} fill={SPORT_COLORS[i % SPORT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: "hsl(225,30%,10%)", 
                        border: "1px solid hsl(225,20%,18%)", 
                        borderRadius: 8, 
                        color: "hsl(210,40%,96%)" 
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Event Status */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  Event Status Breakdown
                </CardTitle>
                <CardDescription>Current status distribution</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      data={statusData} 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={100} 
                      dataKey="value" 
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: "hsl(225,30%,10%)", 
                        border: "1px solid hsl(225,20%,18%)", 
                        borderRadius: 8, 
                        color: "hsl(210,40%,96%)" 
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sport Category List */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Sport Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sportCategoryData.map((sport, index) => (
                  <div key={sport.name} className="p-4 rounded-lg bg-secondary/50 text-center">
                    <div 
                      className="w-4 h-4 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: SPORT_COLORS[index % SPORT_COLORS.length] }}
                    />
                    <p className="font-medium">{sport.name}</p>
                    <p className="text-2xl font-bold">{sport.value}</p>
                    <p className="text-xs text-muted-foreground">events</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizerAnalytics;
