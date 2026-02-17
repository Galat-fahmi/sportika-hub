import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

const AthleteEvents = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
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

  const { data: myRegistrations } = useQuery({
    queryKey: ["my-registrations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_registrations")
        .select("event_id")
        .eq("athlete_id", user!.id);
      if (error) throw error;
      return new Set(data.map((r) => r.event_id));
    },
    enabled: !!user,
  });

  const registerMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from("event_registrations")
        .insert({ event_id: eventId, athlete_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["athlete-registrations"] });
      toast({ title: "Registered successfully!" });
    },
    onError: () => toast({ title: "Registration failed", variant: "destructive" }),
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
      queryClient.invalidateQueries({ queryKey: ["my-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["athlete-registrations"] });
      toast({ title: "Registration cancelled" });
    },
    onError: () => toast({ title: "Failed to cancel", variant: "destructive" }),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading events…</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Browse Events</h1>
        <p className="text-muted-foreground mt-1">Find and register for upcoming events.</p>
      </div>

      {!events || events.length === 0 ? (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No events available right now. Check back soon!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const isRegistered = myRegistrations?.has(event.id);
            return (
              <Card key={event.id} className="glass hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
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
                  {isRegistered ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => unregisterMutation.mutate(event.id)}
                      disabled={unregisterMutation.isPending}
                    >
                      Cancel Registration
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => registerMutation.mutate(event.id)}
                      disabled={registerMutation.isPending}
                    >
                      Register
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AthleteEvents;
