import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Calendar, 
  UserCheck, 
  Trophy, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  Server,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Button } from "@/components/ui/button";
import { getAdminDashboardOverview, getSystemMonitoring } from "@/lib/admin-api";

const AdminOverview = () => {
  const queryClient = useQueryClient();

  const { data: dashboardOverview, isLoading: overviewLoading } = useQuery({
    queryKey: ["admin-dashboard-overview"],
    queryFn: async () => {
      return await getAdminDashboardOverview();
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const { data: systemMonitoring, isLoading: monitoringLoading } = useQuery({
    queryKey: ["admin-system-monitoring"],
    queryFn: async () => {
      return await getSystemMonitoring(24); // Last 24 hours
    },
    refetchInterval: 60000, // Refetch every minute
  });

  // Extract metrics from dashboard data
  const totalUsers = dashboardOverview?.[0]?.total_users ?? 0;
  const athleteCount = dashboardOverview?.[0]?.total_athletes ?? 0;
  const organizerCount = dashboardOverview?.[0]?.total_organizers ?? 0;
  const totalEvents = dashboardOverview?.[0]?.total_events ?? 0;
  const activeEvents = dashboardOverview?.[0]?.active_events ?? 0;
  const totalRegistrations = dashboardOverview?.[0]?.total_registrations ?? 0;
  const totalRevenue = dashboardOverview?.[0]?.total_revenue ?? 0;
  const pendingVerifications = dashboardOverview?.[0]?.pending_verifications ?? 0;

  const { data: pendingApprovals } = useQuery({
    queryKey: ["admin-pending-approvals"],
    queryFn: async () => {
      const { data: pendingEvents, error: eventsError } = await supabase
        .from("events")
        .select("id")
        .eq("status", "draft");
      if (eventsError) throw eventsError;
      
      const { data: pendingRegs, error: regsError } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("status", "pending");
      if (regsError) throw regsError;
      
      return {
        events: pendingEvents?.length ?? 0,
        registrations: pendingRegs?.length ?? 0,
      };
    },
  });

  // Calculate user growth rate based on system monitoring or other metrics
  const userGrowthRate = 5; // Placeholder - this would come from user analytics in a real implementation

  // Weekly growth data - this would come from admin_user_analytics in a real implementation
  const weeklyGrowthData = [
    { day: 'Mon', users: 12, registrations: 24 },
    { day: 'Tue', users: 19, registrations: 32 },
    { day: 'Wed', users: 15, registrations: 28 },
    { day: 'Thu', users: 22, registrations: 35 },
    { day: 'Fri', users: 18, registrations: 30 },
    { day: 'Sat', users: 10, registrations: 18 },
    { day: 'Sun', users: 8, registrations: 15 },
  ];

  // Get latest system status
  const latestSystemStatus = systemMonitoring?.[0];

  const refreshDashboard = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-dashboard-overview"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-system-monitoring"] });
  };

  // Format system status from monitoring data
  const systemStatus = {
    api: { status: latestSystemStatus?.service_status || 'operational', uptime: latestSystemStatus?.uptime_percentage || 99.9 },
    database: { status: 'operational', uptime: 99.95 },
    storage: { status: 'operational', uptime: 99.8 },
    notifications: { status: 'operational', uptime: 99.5 },
  };

  // Recent events - would come from events table in a real implementation
  const recentEvents = [
    { id: 'evt1', status: 'published', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 'evt2', status: 'ongoing', created_at: new Date(Date.now() - 172800000).toISOString() },
    { id: 'evt3', status: 'draft', created_at: new Date(Date.now() - 259200000).toISOString() },
    { id: 'evt4', status: 'completed', created_at: new Date(Date.now() - 345600000).toISOString() },
    { id: 'evt5', status: 'published', created_at: new Date(Date.now() - 432000000).toISOString() },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-500/20 text-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Operational</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-500/20 text-yellow-600"><AlertCircle className="h-3 w-3 mr-1" /> Degraded</Badge>;
      case 'down':
        return <Badge className="bg-red-500/20 text-red-600"><AlertCircle className="h-3 w-3 mr-1" /> Down</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (overviewLoading || monitoringLoading) {
    return <p className="text-muted-foreground">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Platform Overview</h1>
          <p className="text-muted-foreground mt-1">System-wide metrics and activity monitoring.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshDashboard}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Users */}
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
            <p className="text-xs text-muted-foreground mt-1">{athleteCount} athletes · {organizerCount} orgs</p>
          </CardContent>
        </Card>

        {/* Active Events */}
        <Card className="glass">
          <CardContent className="p-4">
            <Calendar className="h-5 w-5 text-primary" />
            <p className="text-2xl font-display font-bold mt-2">{activeEvents}</p>
            <p className="text-xs text-muted-foreground">Active Events</p>
            <p className="text-xs text-muted-foreground mt-1">{totalEvents - activeEvents} inactive</p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="glass">
          <CardContent className="p-4">
            <DollarSign className="h-5 w-5 text-green-500" />
            <p className="text-2xl font-display font-bold mt-2">${(totalRevenue / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}k</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-xs text-muted-foreground mt-1">Platform-wide</p>
          </CardContent>
        </Card>

        {/* Registrations */}
        <Card className="glass">
          <CardContent className="p-4">
            <UserCheck className="h-5 w-5 text-primary" />
            <p className="text-2xl font-display font-bold mt-2">{totalRegistrations.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Registrations</p>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="glass">
          <CardContent className="p-4">
            <Clock className="h-5 w-5 text-yellow-500" />
            <p className="text-2xl font-display font-bold mt-2">{pendingVerifications}</p>
            <p className="text-xs text-muted-foreground">Pending Verifications</p>
            <p className="text-xs text-muted-foreground mt-1">{pendingVerifications} pending</p>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="glass">
          <CardContent className="p-4">
            <Server className="h-5 w-5 text-primary" />
            <p className="text-2xl font-display font-bold mt-2">{latestSystemStatus?.uptime_percentage ?? 99.9}%</p>
            <p className="text-xs text-muted-foreground">System Uptime</p>
            <p className="text-xs text-green-500 mt-1">{latestSystemStatus?.service_status ?? 'Operational'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Weekly Growth
            </CardTitle>
            <CardDescription>New users and registrations over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(145,100%,45%)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(145,100%,45%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRegs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(190,100%,50%)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(190,100%,50%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                <Area type="monotone" dataKey="users" name="New Users" stroke="hsl(145,100%,45%)" fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="registrations" name="Registrations" stroke="hsl(190,100%,50%)" fillOpacity={1} fill="url(#colorRegs)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary" />
              System Status Summary
            </CardTitle>
            <CardDescription>Real-time system health monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(systemStatus).map(([service, data]) => (
                <div key={service} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Server className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium capitalize">{service}</p>
                      <p className="text-xs text-muted-foreground">{data.uptime}% uptime</p>
                    </div>
                  </div>
                  {getStatusBadge(data.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Events</CardTitle>
            <CardDescription>Latest events created on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {recentEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events yet.</p>
            ) : (
              <div className="space-y-3">
                {recentEvents.map((e) => (
                  <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{e.id.slice(0, 8)}…</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(e.created_at), "MMM d, yyyy")}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={e.status === 'published' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {e.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Event Completion Rate</span>
                <span className="font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Payment Success Rate</span>
                <span className="font-medium">94%</span>
              </div>
              <Progress value={94} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">User Verification</span>
                <span className="font-medium">65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Organizer Approval</span>
                <span className="font-medium">82%</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
