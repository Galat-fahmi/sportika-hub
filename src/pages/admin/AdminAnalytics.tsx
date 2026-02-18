import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  ComposedChart,
  Legend
} from "recharts";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign,
  MapPin,
  Trophy,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Target
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval, subDays } from "date-fns";

const COLORS = ["hsl(145,100%,45%)", "hsl(190,100%,50%)", "hsl(225,25%,30%)", "hsl(0,72%,51%)", "hsl(40,100%,50%)"];
const SPORT_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#ec4899"];
const GEO_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

const AdminAnalytics = () => {
  const { data: profiles } = useQuery({
    queryKey: ["admin-analytics-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*, user_roles(role), created_at");
      if (error) throw error;
      return data;
    },
  });

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
      const { data, error } = await supabase.from("events").select("*, registration_fee, created_at, start_date");
      if (error) throw error;
      return data;
    },
  });

  const { data: registrations } = useQuery({
    queryKey: ["admin-analytics-regs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("event_registrations").select("event_id, registered_at, payment_status");
      if (error) throw error;
      return data;
    },
  });

  // Calculate total metrics
  const totalUsers = profiles?.length ?? 0;
  const totalEvents = events?.length ?? 0;
  const totalRegistrations = registrations?.length ?? 0;
  const totalRevenue = registrations?.reduce((sum: number, r: any) => {
    const event = events?.find((e: any) => e.id === r.event_id);
    return sum + (r.payment_status === 'paid' ? Number(event?.registration_fee || 0) : 0);
  }, 0) ?? 0;

  // User Growth Trends (last 6 months)
  const userGrowthData = (() => {
    if (!profiles) return [];
    const months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date(),
    });
    
    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const athletes = profiles.filter((p: any) => {
        const date = new Date(p.created_at);
        return date >= monthStart && date <= monthEnd && p.user_roles?.role === 'athlete';
      }).length;
      const organizers = profiles.filter((p: any) => {
        const date = new Date(p.created_at);
        return date >= monthStart && date <= monthEnd && p.user_roles?.role === 'organizer';
      }).length;
      
      return {
        month: format(month, "MMM yyyy"),
        athletes,
        organizers,
        total: athletes + organizers,
      };
    });
  })();

  // Event Performance Metrics
  const eventPerformanceData = events?.map((event: any) => {
    const eventRegs = registrations?.filter((r: any) => r.event_id === event.id) ?? [];
    const revenue = eventRegs.reduce((sum: number, r: any) => 
      sum + (r.payment_status === 'paid' ? Number(event.registration_fee || 0) : 0), 0
    );
    return {
      name: event.title.length > 15 ? event.title.slice(0, 15) + "…" : event.title,
      registrations: eventRegs.length,
      revenue: revenue,
      fillRate: event.max_participants ? Math.round((eventRegs.length / event.max_participants) * 100) : 0,
    };
  }).slice(0, 10) ?? [];

  // Revenue Analytics (monthly)
  const revenueData = (() => {
    if (!registrations || !events) return [];
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
        .reduce((sum: number, r: any) => {
          const event = events.find((e: any) => e.id === r.event_id);
          return sum + Number(event?.registration_fee || 0);
        }, 0);
      
      cumulativeRevenue += monthRevenue;
      
      return {
        month: format(month, "MMM yyyy"),
        revenue: monthRevenue,
        cumulative: cumulativeRevenue,
      };
    });
  })();

  // Geographic Distribution (mock data - would come from user profiles)
  const geographicData = [
    { region: "North America", users: 450, events: 32, revenue: 45000 },
    { region: "Europe", users: 380, events: 28, revenue: 38000 },
    { region: "Asia Pacific", users: 290, events: 21, revenue: 29000 },
    { region: "Latin America", users: 120, events: 8, revenue: 12000 },
    { region: "Middle East & Africa", users: 85, events: 5, revenue: 8500 },
  ];

  // Most Active Sports Categories
  const sportCategoryData = (() => {
    if (!events) return [];
    const sportCounts: Record<string, { events: number; registrations: number; revenue: number }> = {};
    
    events.forEach((event: any) => {
      if (!sportCounts[event.sport]) {
        sportCounts[event.sport] = { events: 0, registrations: 0, revenue: 0 };
      }
      sportCounts[event.sport].events++;
      
      const eventRegs = registrations?.filter((r: any) => r.event_id === event.id) ?? [];
      sportCounts[event.sport].registrations += eventRegs.length;
      
      const revenue = eventRegs.reduce((sum: number, r: any) => 
        sum + (r.payment_status === 'paid' ? Number(event.registration_fee || 0) : 0), 0
      );
      sportCounts[event.sport].revenue += revenue;
    });
    
    return Object.entries(sportCounts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.registrations - a.registrations)
      .slice(0, 8);
  })();

  // Role distribution
  const roleData = roles
    ? Object.entries(
        roles.reduce<Record<string, number>>((acc, r) => { acc[r.role] = (acc[r.role] ?? 0) + 1; return acc; }, {})
      ).map(([name, value]) => ({ name, value }))
    : [];

  // Weekly active users trend
  const weeklyActiveData = (() => {
    const days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));
    return days.map(day => ({
      day: format(day, "EEE"),
      active: Math.floor(Math.random() * 200) + 100, // Mock data
      new: Math.floor(Math.random() * 50) + 10,
    }));
  })();

  // Calculate growth rates
  const thisMonthUsers = profiles?.filter((p: any) => new Date(p.created_at) >= subDays(new Date(), 30)).length ?? 0;
  const lastMonthUsers = profiles?.filter((p: any) => {
    const date = new Date(p.created_at);
    return date >= subDays(new Date(), 60) && date < subDays(new Date(), 30);
  }).length ?? 0;
  const userGrowthRate = lastMonthUsers > 0 ? Math.round(((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100) : 0;

  const hasData = (events?.length ?? 0) > 0 || (profiles?.length ?? 0) > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Platform Analytics</h1>
        <p className="text-muted-foreground mt-1">Comprehensive insights across all platform activities.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Users className="h-5 w-5 text-primary" />
              {userGrowthRate >= 0 ? (
                <Badge className="bg-green-500/20 text-green-600 text-xs">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {userGrowthRate}%
                </Badge>
              ) : (
                <Badge className="bg-red-500/20 text-red-600 text-xs">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  {Math.abs(userGrowthRate)}%
                </Badge>
              )}
            </div>
            <p className="text-2xl font-display font-bold mt-2">{totalUsers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <Calendar className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-display font-bold">{totalEvents.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Events</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <Activity className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-display font-bold">{totalRegistrations.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Registrations</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <DollarSign className="h-5 w-5 text-green-500 mb-2" />
            <p className="text-2xl font-display font-bold">${(totalRevenue / 1000).toFixed(1)}k</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      {!hasData ? (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No data available yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="growth" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="growth" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Growth
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="revenue" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="sports" className="gap-2">
              <Trophy className="h-4 w-4" />
              Sports
            </TabsTrigger>
          </TabsList>

          {/* Growth Tab */}
          <TabsContent value="growth" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Trends */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    User Growth Trends
                  </CardTitle>
                  <CardDescription>New user registrations by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={userGrowthData}>
                      <defs>
                        <linearGradient id="colorAthletes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(145,100%,45%)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(145,100%,45%)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOrganizers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(190,100%,50%)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(190,100%,50%)" stopOpacity={0}/>
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
                      <Legend />
                      <Area type="monotone" dataKey="athletes" name="Athletes" stroke="hsl(145,100%,45%)" fillOpacity={1} fill="url(#colorAthletes)" />
                      <Area type="monotone" dataKey="organizers" name="Organizers" stroke="hsl(190,100%,50%)" fillOpacity={1} fill="url(#colorOrganizers)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Weekly Active Users */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-primary" />
                    Weekly Active Users
                  </CardTitle>
                  <CardDescription>Daily active users over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyActiveData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(225,20%,18%)" />
                      <XAxis dataKey="day" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                      <YAxis tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ 
                          background: "hsl(225,30%,10%)", 
                          border: "1px solid hsl(225,20%,18%)", 
                          borderRadius: 8, 
                          color: "hsl(210,40%,96%)" 
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="active" name="Active Users" stroke="hsl(145,100%,45%)" strokeWidth={2} />
                      <Line type="monotone" dataKey="new" name="New Users" stroke="hsl(190,100%,50%)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Geographic Distribution */}
              <Card className="glass lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="h-5 w-5 text-primary" />
                    Geographic Distribution
                  </CardTitle>
                  <CardDescription>Users, events, and revenue by region</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={geographicData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(225,20%,18%)" />
                      <XAxis dataKey="region" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                      <YAxis yAxisId="left" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} allowDecimals={false} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          background: "hsl(225,30%,10%)", 
                          border: "1px solid hsl(225,20%,18%)", 
                          borderRadius: 8, 
                          color: "hsl(210,40%,96%)" 
                        }} 
                        formatter={(value: number, name: string) => {
                          if (name === 'revenue') return `$${value.toLocaleString()}`;
                          return value;
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="users" name="Users" fill="hsl(145,100%,45%)" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="left" dataKey="events" name="Events" fill="hsl(190,100%,50%)" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue ($)" stroke="hsl(40,100%,50%)" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Event Performance Metrics */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-primary" />
                    Event Performance Metrics
                  </CardTitle>
                  <CardDescription>Top events by registrations and fill rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={eventPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(225,20%,18%)" />
                      <XAxis dataKey="name" tick={{ fill: "hsl(220,15%,55%)", fontSize: 11 }} />
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
                      <Line yAxisId="right" type="monotone" dataKey="fillRate" name="Fill Rate %" stroke="hsl(190,100%,50%)" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Role Distribution */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-primary" />
                    User Role Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie 
                        data={roleData} 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={100} 
                        dataKey="value" 
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Revenue Analytics
                </CardTitle>
                <CardDescription>Monthly revenue and cumulative growth</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(145,100%,45%)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(145,100%,45%)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(190,100%,50%)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(190,100%,50%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
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
                    <Area type="monotone" dataKey="revenue" name="Monthly Revenue" stroke="hsl(145,100%,45%)" fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="cumulative" name="Cumulative Revenue" stroke="hsl(190,100%,50%)" fillOpacity={1} fill="url(#colorCumulative)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sports Tab */}
          <TabsContent value="sports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Most Active Sports Categories */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Trophy className="h-5 w-5 text-primary" />
                    Most Active Sports Categories
                  </CardTitle>
                  <CardDescription>Events, registrations, and revenue by sport</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sportCategoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(225,20%,18%)" />
                      <XAxis dataKey="name" tick={{ fill: "hsl(220,15%,55%)", fontSize: 11 }} />
                      <YAxis tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ 
                          background: "hsl(225,30%,10%)", 
                          border: "1px solid hsl(225,20%,18%)", 
                          borderRadius: 8, 
                          color: "hsl(210,40%,96%)" 
                        }}
                        formatter={(value: number, name: string) => {
                          if (name === 'revenue') return `$${value.toLocaleString()}`;
                          return value;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="events" name="Events" fill="hsl(145,100%,45%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="registrations" name="Registrations" fill="hsl(190,100%,50%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Sports Revenue Distribution */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Revenue by Sport
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie 
                        data={sportCategoryData} 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={100} 
                        dataKey="revenue" 
                        nameKey="name"
                        label={({ name, value }) => `${name}: $${(value / 1000).toFixed(1)}k`}
                      >
                        {sportCategoryData.map((_, i) => <Cell key={i} fill={SPORT_COLORS[i % SPORT_COLORS.length]} />)}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          background: "hsl(225,30%,10%)", 
                          border: "1px solid hsl(225,20%,18%)", 
                          borderRadius: 8, 
                          color: "hsl(210,40%,96%)" 
                        }}
                        formatter={(value: number) => `$${value.toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Sports Category Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sportCategoryData.slice(0, 8).map((sport, index) => (
                <Card key={sport.name} className="glass">
                  <CardContent className="p-4">
                    <div 
                      className="w-3 h-3 rounded-full mb-2"
                      style={{ backgroundColor: SPORT_COLORS[index % SPORT_COLORS.length] }}
                    />
                    <p className="font-medium text-sm">{sport.name}</p>
                    <p className="text-2xl font-bold">{sport.events}</p>
                    <p className="text-xs text-muted-foreground">{sport.registrations} registrations</p>
                    <p className="text-xs text-green-600">${sport.revenue.toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdminAnalytics;
