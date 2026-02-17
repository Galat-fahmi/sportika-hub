import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type EventStatus = Database["public"]["Enums"]["event_status"];

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-primary/20 text-primary",
  ongoing: "bg-accent/20 text-accent",
  completed: "bg-secondary text-secondary-foreground",
  cancelled: "bg-destructive/20 text-destructive",
};

const OrganizerEvents = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", sport: "", location: "",
    start_date: "", end_date: "", max_participants: "",
    registration_fee: "0", status: "draft" as EventStatus,
  });

  const { data: events, isLoading } = useQuery({
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

  const createEvent = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("events").insert({
        organizer_id: user!.id,
        title: form.title,
        description: form.description || null,
        sport: form.sport,
        location: form.location || null,
        start_date: new Date(form.start_date).toISOString(),
        end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
        max_participants: form.max_participants ? parseInt(form.max_participants) : null,
        registration_fee: parseFloat(form.registration_fee),
        status: form.status,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
      setOpen(false);
      setForm({ title: "", description: "", sport: "", location: "", start_date: "", end_date: "", max_participants: "", registration_fee: "0", status: "draft" });
      toast({ title: "Event created!" });
    },
    onError: () => toast({ title: "Failed to create event", variant: "destructive" }),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: EventStatus }) => {
      const { error } = await supabase.from("events").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
      toast({ title: "Status updated" });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
      toast({ title: "Event deleted" });
    },
  });

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">My Events</h1>
          <p className="text-muted-foreground mt-1">Create and manage your events.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> New Event</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div><Label>Title *</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} className="mt-1" /></div>
              <div><Label>Sport *</Label><Input value={form.sport} onChange={(e) => set("sport", e.target.value)} placeholder="e.g. Running, Swimming" className="mt-1" /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="mt-1" /></div>
              <div><Label>Location</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Start Date *</Label><Input type="datetime-local" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} className="mt-1" /></div>
                <div><Label>End Date</Label><Input type="datetime-local" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} className="mt-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Max Participants</Label><Input type="number" value={form.max_participants} onChange={(e) => set("max_participants", e.target.value)} className="mt-1" /></div>
                <div><Label>Registration Fee ($)</Label><Input type="number" step="0.01" value={form.registration_fee} onChange={(e) => set("registration_fee", e.target.value)} className="mt-1" /></div>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => createEvent.mutate()} disabled={!form.title || !form.sport || !form.start_date || createEvent.isPending} className="w-full">
                {createEvent.isPending ? "Creating…" : "Create Event"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!events || events.length === 0 ? (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No events yet. Click "New Event" to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <Card key={event.id} className="glass">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                    <Badge className={statusColors[event.status] ?? ""} variant="secondary">{event.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {event.sport} · {event.location ?? "No location"} · {format(new Date(event.start_date), "MMM d, yyyy")}
                    {event.max_participants && ` · Max ${event.max_participants}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Select
                    value={event.status}
                    onValueChange={(v) => updateStatus.mutate({ id: event.id, status: v as EventStatus })}
                  >
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteEvent.mutate(event.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerEvents;
