import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  BarChart3, 
  Plus, 
  Eye, 
  Trophy,
  TrendingUp,
  Clock,
  MapPin,
  ArrowRight,
  Zap,
  RefreshCw
} from "lucide-react";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { Link } from "react-router-dom";
import { getOrganizerDashboardOverview, getOrganizerParticipants } from "@/lib/organizer-api";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-green-500/20 text-green-600",
  ongoing: "bg-primary/20 text-primary",
  completed: "bg-secondary text-secondary-foreground",
  cancelled: "bg-destructive/20 text-destructive",
};

const OrganizerOverview = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: events, isLoading: eventsLoading } = useQuery({
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

  const { data: dashboardOverview, isLoading: overviewLoading } = useQuery({
    queryKey: ["organizer-dashboard-overview", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return await getOrganizerDashboardOverview(user.id);
    },
    enabled: !!user,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const { data: participantsData, isLoading: participantsLoading } = useQuery({
    queryKey: ["organizer-participants", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await getOrganizerParticipants(user.id);
    },
    enabled: !!user,
  });

  // Calculate metrics
  const now = new Date();
  const activeEvents = events?.filter((e) => e.status === "published" || e.status === "ongoing") ?? [];
  const totalParticipants = participantsData?.length ?? 0;
  
  // Use dashboard data for revenue if available
  const totalRevenue = dashboardOverview?.[0]?.total_revenue ?? 0;

  // Upcoming matches (events starting within next 7 days)
  const upcomingMatches = events?.filter((e) => {
    const startDate = new Date(e.start_date);
    return isAfter(startDate, now) && isBefore(startDate, addDays(now, 7));
  }).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()) ?? [];

  // Recent registrations
  const recentRegistrations = participantsData?.slice(0, 5) ?? [];

  // Calculate registration rate for active events
  const getRegistrationRate = (eventId: string, maxParticipants: number | null) => {
    if (!maxParticipants) return 0;
    const count = participantsData?.filter((r: any) => r.event_id === eventId).length ?? 0;
    return Math.round((count / maxParticipants) * 100);
  };

  // Function to refresh dashboard data
  const refreshDashboard = async () => {
    if (user?.id) {
      await queryClient.invalidateQueries({ queryKey: ["organizer-dashboard-overview", user?.id] });
      await queryClient.invalidateQueries({ queryKey: ["organizer-participants", user?.id] });
      await queryClient.invalidateQueries({ queryKey: ["organizer-events", user?.id] });
    }
  };

  if (eventsLoading || overviewLoading || participantsLoading) {
    return <p className="text-muted-foreground">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your events and track performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshDashboard}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <div className="text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-primary inline mr-1" />
            <span>Last updated: {dashboardOverview?.[0]?.last_updated ? format(new Date(dashboardOverview[0].last_updated), "MMM d, h:mm a") : format(new Date(), "MMM d, h:mm a")}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild className="gap-2">
          <Link to="/organizer/events">
            <Plus className="h-4 w-4" />
            Create Event
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild className="gap-2">
          <Link to="/organizer/participants">
            <Eye className="h-4 w-4" />
            View Participants
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Active Events" 
          value={dashboardOverview?.[0]?.active_events ?? activeEvents.length} 
          icon={<Calendar className="h-5 w-5" />} 
          description="Published & ongoing events"
        />
        <StatsCard 
          title="Total Participants" 
          value={dashboardOverview?.[0]?.total_participants ?? totalParticipants} 
          icon={<Users className="h-5 w-5" />} 
          description="Across all your events"
        />
        <StatsCard 
          title="Total Revenue" 
          value={`$${(dashboardOverview?.[0]?.total_revenue ?? totalRevenue).toLocaleString()}`} 
          icon={<DollarSign className="h-5 w-5" />} 
          description="From registrations"
        />
        <StatsCard 
          title="Upcoming Events" 
          value={dashboardOverview?.[0]?.upcoming_events ?? 0} 
          icon={<TrendingUp className="h-5 w-5" />} 
          description="Scheduled in next 30 days"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Matches */}
        <Card className="glass lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Upcoming Matches (Next 7 Days)
              </CardTitle>
              <CardDescription>Events starting soon</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/organizer/events" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingMatches.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No upcoming matches in the next 7 days.</p>
                <Button size="sm" className="mt-4" asChild>
                  <Link to="/organizer/events">Create Event</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingMatches.map((event) => {
                  const registrationRate = getRegistrationRate(event.id, event.max_participants);
                  const participantCount = registrationsData?.filter((r: any) => r.event_id === event.id).length ?? 0;
                  
                  return (
                    <div key={event.id} className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-foreground">{event.title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(event.start_date), "MMM d, yyyy · h:mm a")}
                            {event.location && (
                              <>
                                <span>·</span>
                                <MapPin className="h-3.5 w-3.5" />
                                {event.location}
                              </>
                            )}
                          </div>
                        </div>
                        <Badge className={statusColors[event.status]}>{event.status}</Badge>
                      </div>
                      
                      {event.max_participants && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Registration</span>
                            <span className="font-medium">{participantCount}/{event.max_participants}</span>
                          </div>
                          <Progress value={registrationRate} className="h-2" />
                        </div>
                      )}
                      
                      {event.registration_fee && Number(event.registration_fee) > 0 && (
                        <div className="mt-2 flex items-center gap-1 text-sm">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="font-medium">{event.registration_fee}</span>
                          <span className="text-muted-foreground">entry fee</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Registrations
            </CardTitle>
            <CardDescription>Latest participant sign-ups</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRegistrations.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No registrations yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRegistrations.map((reg: any) => (
                  <div key={reg.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{reg.event?.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {reg.created_at ? format(new Date(reg.created_at), "MMM d, h:mm a") : format(new Date(reg.registered_at), "MMM d, h:mm a")}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">New</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Summary */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Revenue Summary
          </CardTitle>
          <CardDescription>Financial overview of your events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <p className="text-3xl font-display font-bold text-green-600">
                ${(dashboardOverview?.[0]?.total_revenue ?? totalRevenue).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Total Revenue</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <p className="text-3xl font-display font-bold">
                ${events?.length ? Math.round((dashboardOverview?.[0]?.total_revenue ?? totalRevenue) / events.length) : 0}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Avg per Event</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <p className="text-3xl font-display font-bold">
                ${totalParticipants > 0 ? Math.round((dashboardOverview?.[0]?.total_revenue ?? totalRevenue) / totalParticipants) : 0}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Avg per Participant</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <p className="text-3xl font-display font-bold text-primary">
                {dashboardOverview?.[0]?.active_events ?? activeEvents.length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Active Events</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Events */}
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              All Events
            </CardTitle>
            <CardDescription>Complete list of your events</CardDescription>
          </div>
          <Button size="sm" asChild>
            <Link to="/organizer/events" className="gap-1">
              Manage Events <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {!events || events.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground mb-3">No events created yet.</p>
              <Button asChild>
                <Link to="/organizer/events">Create Your First Event</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.slice(0, 6).map((event) => {
                const participantCount = participantsData?.filter((r: any) => r.event_id === event.id).length ?? 0;
                const isFull = event.max_participants && participantCount >= event.max_participants;
                
                return (
                  <div key={event.id} className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={statusColors[event.status]}>{event.status}</Badge>
                      {isFull && <Badge variant="destructive" className="text-xs">Full</Badge>}
                    </div>
                    <p className="font-medium text-foreground truncate">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.sport}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(event.start_date), "MMM d")}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {participantCount}{event.max_participants ? `/${event.max_participants}` : ''}
                      </div>
                      {event.registration_fee && Number(event.registration_fee) > 0 && (
                        <div className="flex items-center gap-1 text-green-600">
                          <DollarSign className="h-4 w-4" />
                          {event.registration_fee}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerOverview;
