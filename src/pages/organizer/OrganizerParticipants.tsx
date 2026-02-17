import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

const OrganizerParticipants = () => {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<string>("all");

  const { data: events } = useQuery({
    queryKey: ["organizer-events", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("organizer_id", user!.id)
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: registrations, isLoading } = useQuery({
    queryKey: ["organizer-registrations", user?.id, selectedEvent],
    queryFn: async () => {
      if (!events || events.length === 0) return [];
      const eventIds = selectedEvent === "all" ? events.map((e) => e.id) : [selectedEvent];
      const { data, error } = await supabase
        .from("event_registrations")
        .select("*, events(title, sport), profiles:athlete_id(full_name)")
        .in("event_id", eventIds)
        .order("registered_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!events,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Participants</h1>
        <p className="text-muted-foreground mt-1">View registrations across your events.</p>
      </div>

      <div className="flex items-center gap-3">
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter by event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {events?.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="secondary">{registrations?.length ?? 0} registrations</Badge>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" /> Registered Athletes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !registrations || registrations.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No registrations yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Athlete</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Sport</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((reg: any) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-medium">{reg.profiles?.full_name ?? "Unknown"}</TableCell>
                    <TableCell>{reg.events?.title}</TableCell>
                    <TableCell>{reg.events?.sport}</TableCell>
                    <TableCell><Badge variant="secondary">{reg.status}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {format(new Date(reg.registered_at), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerParticipants;
