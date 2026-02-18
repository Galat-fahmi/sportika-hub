import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Ban } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type EventStatus = Database["public"]["Enums"]["event_status"];

const statusColor: Record<EventStatus, string> = {
  draft: "secondary",
  published: "default",
  ongoing: "default",
  completed: "secondary",
  cancelled: "destructive",
};

const AdminEvents = () => {
  const qc = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-all-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: regCounts } = useQuery({
    queryKey: ["admin-reg-counts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("event_registrations").select("event_id");
      if (error) throw error;
      const counts: Record<string, number> = {};
      data.forEach((r) => { counts[r.event_id] = (counts[r.event_id] ?? 0) + 1; });
      return counts;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase.from("events").update({ status: "cancelled" as EventStatus }).eq("id", eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-all-events"] });
      toast.success("Event cancelled");
    },
    onError: () => toast.error("Failed to cancel event"),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Event Oversight</h1>
        <p className="text-muted-foreground mt-1">Monitor and moderate all platform events.</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            All Events ({events?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !events || events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Sport</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registrations</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.title}</TableCell>
                    <TableCell className="capitalize">{e.sport}</TableCell>
                    <TableCell>
                      <Badge variant={statusColor[e.status] as any}>{e.status}</Badge>
                    </TableCell>
                    <TableCell>{regCounts?.[e.id] ?? 0}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(e.start_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {e.status !== "cancelled" && e.status !== "completed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelMutation.mutate(e.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Ban className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                      )}
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

export default AdminEvents;
