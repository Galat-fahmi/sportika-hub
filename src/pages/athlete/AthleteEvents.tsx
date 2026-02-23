import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Search, 
  Filter, 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle,
  CreditCard,
  ChevronRight,
  Info
} from "lucide-react";
import { format } from "date-fns";

const AthleteEvents = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["published-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .in("status", ["published", "ongoing"])
        .order("start_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: myRegistrations, isLoading: registrationsLoading } = useQuery({
    queryKey: ["my-registrations-details", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_registrations")
        .select("*, events(*)")
        .eq("athlete_id", user!.id)
        .order("registered_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const registerMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from("event_registrations")
        .insert({ 
          event_id: eventId, 
          athlete_id: user!.id,
          status: 'pending'
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-registrations-details"] });
      queryClient.invalidateQueries({ queryKey: ["athlete-registrations"] });
      toast({ title: "Registered successfully!" });
    },
    onError: (error) => {
      console.error('Registration error:', error);
      toast({ 
        title: "Registration failed", 
        description: error.message || "Unable to register for the event. Please try again.",
        variant: "destructive" 
      });
    },
  });

  const unregisterMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", eventId)
        .eq("athlete_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-registrations-details"] });
      queryClient.invalidateQueries({ queryKey: ["athlete-registrations"] });
      toast({ title: "Registration cancelled" });
    },
    onError: (error) => {
      console.error('Unregistration error:', error);
      toast({ 
        title: "Failed to cancel registration", 
        description: error.message || "Unable to cancel registration. Please try again.",
        variant: "destructive" 
      });
    },
  });

  // Get unique sports and locations for filters
  const uniqueSports = [...new Set(events?.map(e => e.sport) ?? [])];
  const uniqueLocations = [...new Set(events?.map(e => e.location).filter(Boolean) ?? [])];

  // Filter events
  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = !sportFilter || event.sport === sportFilter;
    const matchesLocation = !locationFilter || event.location === locationFilter;
    return matchesSearch && matchesSport && matchesLocation;
  });

  // Separate registrations into upcoming and past
  const now = new Date();
  const upcomingRegistrations = myRegistrations?.filter((reg: any) => 
    reg.events && new Date(reg.events.start_date) > now
  ) ?? [];
  const pastRegistrations = myRegistrations?.filter((reg: any) => 
    reg.events && new Date(reg.events.start_date) <= now
  ) ?? [];

  const getRegistrationStatusBadge = (status: string) => {
    switch (status) {
      case 'registered':
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string | null) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30"><CheckCircle className="h-3 w-3 mr-1" /> Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-600 border-red-500/30"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Pending'}</Badge>;
    }
  };

  const isRegistered = (eventId: string) => 
    myRegistrations?.some((reg: any) => reg.event_id === eventId);

  // Helper function to determine the actual status of an event based on dates
  const getActualEventStatus = (event: any) => {
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = event.end_date ? new Date(event.end_date) : null;
    
    if (startDate <= now && (!endDate || endDate > now)) {
      return 'ongoing';
    } else if (startDate > now) {
      return 'upcoming';
    } else {
      return 'completed';
    }
  };

  // Filter for real-time ongoing events
  const ongoingEvents = events?.filter(event => getActualEventStatus(event) === 'ongoing') ?? [];

  const EventDetailDialog = ({ event, children }: { event: any; children: React.ReactNode }) => (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {event.title}
            <Badge variant="secondary">{event.sport}</Badge>
          </DialogTitle>
          <DialogDescription>Event Details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {event.description && (
            <p className="text-sm text-muted-foreground">{event.description}</p>
          )}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Starts: {format(new Date(event.start_date), "MMMM d, yyyy · h:mm a")}</span>
            </div>
            {event.end_date && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Ends: {format(new Date(event.end_date), "MMMM d, yyyy · h:mm a")}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
            )}
            {event.max_participants && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                Max {event.max_participants} participants
              </div>
            )}
          </div>
          {event.registration_fee && Number(event.registration_fee) > 0 ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm font-medium">Registration Fee</span>
              <span className="text-lg font-bold text-primary">${event.registration_fee}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Free Registration</span>
            </div>
          )}
          {isRegistered(event.id) ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => unregisterMutation.mutate(event.id)}
              disabled={unregisterMutation.isPending}
            >
              Cancel Registration
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={() => registerMutation.mutate(event.id)}
              disabled={registerMutation.isPending}
            >
              Register Now
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  const RegistrationCard = ({ registration }: { registration: any }) => (
    <Card className="glass hover:border-primary/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{registration.events?.title}</CardTitle>
            <CardDescription>{registration.events?.sport}</CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            {format(new Date(registration.events?.start_date), "MMM d")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {format(new Date(registration.events?.start_date), "MMM d, yyyy · h:mm a")}
          </div>
          {registration.events?.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {registration.events?.location}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {getRegistrationStatusBadge(registration.status)}
          {getPaymentStatusBadge(registration.payment_status)}
        </div>
        {new Date(registration.events?.start_date) > now && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => unregisterMutation.mutate(registration.event_id)}
            disabled={unregisterMutation.isPending}
          >
            Cancel Registration
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (eventsLoading || registrationsLoading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Events</h1>
        <p className="text-muted-foreground mt-1">Browse and manage your event registrations.</p>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="live">Live Events</TabsTrigger>
          <TabsTrigger value="browse">Browse Events</TabsTrigger>
          <TabsTrigger value="my-registrations">My Registrations</TabsTrigger>
        </TabsList>

        {/* Live Events Tab */}
        <TabsContent value="live" className="space-y-6">
          {/* Live Events Grid */}
          {ongoingEvents.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No live events happening right now. Check back soon!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ongoingEvents.map((event) => (
                <Card key={event.id} className="glass border-primary/50 ring-1 ring-primary/20">
                  {event.banner_image_url && (
                    <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
                      <img 
                        src={event.banner_image_url} 
                        alt={`${event.title} banner`} 
                        className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent rounded-t-lg opacity-60" />
                    </div>
                  )}
                  <CardHeader className={`pb-3 ${event.banner_image_url ? 'pt-16' : 'pt-3'}`}>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{event.title}</CardTitle>
                      <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-xs">LIVE NOW</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {event.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                    )}
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Started: {format(new Date(event.start_date), "MMM d, yyyy · h:mm a")}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.location}
                        </div>
                      )}
                      {event.max_participants && (
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          {event.max_participants} max participants
                        </div>
                      )}
                    </div>
                    {event.registration_fee && Number(event.registration_fee) > 0 && (
                      <p className="text-sm font-medium text-primary">${event.registration_fee}</p>
                    )}
                    <div className="flex gap-2">
                      <EventDetailDialog event={event}>
                        <Button variant="outline" size="sm" className="flex-1">
                          Details <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </EventDetailDialog>
                      {isRegistered(event.id) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => unregisterMutation.mutate(event.id)}
                          disabled={unregisterMutation.isPending}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => registerMutation.mutate(event.id)}
                          disabled={registerMutation.isPending}
                        >
                          Join Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Browse Events Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Search & Filters */}
          <Card className="glass">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={sportFilter}
                    onChange={(e) => setSportFilter(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">All Sports</option>
                    {uniqueSports.map(sport => (
                      <option key={sport} value={sport}>{sport}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Events Grid */}
          {!filteredEvents || filteredEvents.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">
                  {searchQuery || sportFilter || locationFilter 
                    ? "No events match your filters. Try adjusting your search."
                    : "No events available right now. Check back soon!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="glass hover:border-primary/30 transition-colors">
                  {event.banner_image_url && (
                    <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
                      <img 
                        src={event.banner_image_url} 
                        alt={`${event.title} banner`} 
                        className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent rounded-t-lg opacity-60" />
                    </div>
                  )}
                  <CardHeader className={`pb-3 ${event.banner_image_url ? 'pt-16' : 'pt-3'}`}>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{event.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">{event.sport}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {event.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                    )}
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(event.start_date), "MMM d, yyyy · h:mm a")}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.location}
                        </div>
                      )}
                      {event.max_participants && (
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          Max {event.max_participants} participants
                        </div>
                      )}
                    </div>
                    {event.registration_fee && Number(event.registration_fee) > 0 && (
                      <p className="text-sm font-medium text-primary">${event.registration_fee}</p>
                    )}
                    <div className="flex gap-2">
                      <EventDetailDialog event={event}>
                        <Button variant="outline" size="sm" className="flex-1">
                          Details <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </EventDetailDialog>
                      {isRegistered(event.id) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => unregisterMutation.mutate(event.id)}
                          disabled={unregisterMutation.isPending}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => registerMutation.mutate(event.id)}
                          disabled={registerMutation.isPending}
                        >
                          Register
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* My Registrations Tab */}
        <TabsContent value="my-registrations" className="space-y-6">
          {/* Upcoming Events */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Events
            </h3>
            {upcomingRegistrations.length === 0 ? (
              <Card className="glass">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No upcoming events registered.</p>
                  <Button variant="outline" className="mt-4" onClick={() => {
                    const browseTab = document.querySelector('[value="browse"]') as HTMLElement;
                    browseTab?.click();
                  }}>
                    Browse Events
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingRegistrations.map((registration: any) => (
                  <RegistrationCard key={registration.id} registration={registration} />
                ))}
              </div>
            )}
          </div>

          {/* Past Events */}
          {pastRegistrations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Past Events
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastRegistrations.map((registration: any) => (
                  <RegistrationCard key={registration.id} registration={registration} />
                ))}
              </div>
            </div>
          )}

          {/* Registration Info */}
          <Card className="glass bg-secondary/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Registration Status Guide</p>
                  <ul className="space-y-1">
                    <li><span className="text-green-600">Approved</span> - Your registration is confirmed</li>
                    <li><span className="text-yellow-600">Pending</span> - Awaiting organizer approval</li>
                    <li><span className="text-green-600">Paid</span> - Payment completed</li>
                    <li><span className="text-yellow-600">Pending Payment</span> - Payment required to complete registration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AthleteEvents;
