import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Ban, 
  CheckCircle, 
  XCircle, 
  Flag, 
  Eye, 
  AlertTriangle,
  Search,
  Filter,
  Users,
  Clock,
  MapPin,
  DollarSign,
  Shield,
  Lock,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { getAdminDashboardOverview, getEventAnalytics } from "@/lib/admin-api";
import type { Database } from "@/integrations/supabase/types";

type EventStatus = Database["public"]["Enums"]["event_status"];

const statusColor: Record<EventStatus, string> = {
  draft: "secondary",
  published: "default",
  ongoing: "default",
  completed: "secondary",
  cancelled: "destructive",
};

interface EventDetails {
  id: string;
  title: string;
  description: string;
  sport: string;
  status: EventStatus;
  start_date: string;
  end_date: string;
  location: string;
  registration_fee: number;
  max_participants: number;
  organizer_id: string;
  created_at: string;
  is_flagged?: boolean;
  flag_reason?: string;
}

const AdminEvents = () => {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-all-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*, profiles:organizer_id(full_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as EventDetails[];
    },
  });

  const { data: regCounts } = useQuery({
    queryKey: ["admin-reg-counts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("event_registrations").select("event_id, status");
      if (error) throw error;
      const counts: Record<string, { total: number; pending: number; approved: number }> = {};
      data.forEach((r) => { 
        if (!counts[r.event_id]) {
          counts[r.event_id] = { total: 0, pending: 0, approved: 0 };
        }
        counts[r.event_id].total++;
        if (r.status === 'pending') counts[r.event_id].pending++;
        if (r.status === 'registered') counts[r.event_id].approved++;
      });
      return counts;
    },
  });

  // Filter events based on tab, search, and status
  const filteredEvents = events?.filter((event) => {
    const matchesTab = 
      activeTab === "all" ? true :
      activeTab === "pending" ? event.status === "draft" :
      activeTab === "flagged" ? event.is_flagged :
      activeTab === "active" ? ["published", "ongoing"].includes(event.status) :
      true;
    
    const matchesSearch = 
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.sport?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event as any).profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    
    return matchesTab && matchesSearch && matchesStatus;
  });

  const approveEvent = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from("events")
        .update({ status: "published" as EventStatus })
        .eq("id", eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-all-events"] });
      toast({ title: "Event approved and published!" });
      setEventDialogOpen(false);
    },
  });

  const rejectEvent = useMutation({
    mutationFn: async (eventId: string) => {
      // In real app, would also store rejection reason
      const { error } = await supabase
        .from("events")
        .update({ status: "draft" as EventStatus })
        .eq("id", eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-all-events"] });
      toast({ title: "Event rejected", description: "Organizer has been notified" });
      setRejectDialogOpen(false);
      setEventDialogOpen(false);
      setRejectReason("");
    },
  });

  const flagEvent = useMutation({
    mutationFn: async (eventId: string) => {
      // In real app, would store flag in database
      toast({ title: "Event flagged for review" });
    },
    onSuccess: () => {
      setFlagDialogOpen(false);
      setFlagReason("");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase.from("events").update({ status: "cancelled" as EventStatus }).eq("id", eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-all-events"] });
      toast({ title: "Event force-closed" });
    },
  });

  const openEventDetails = (event: EventDetails) => {
    setSelectedEvent(event);
    setEventDialogOpen(true);
  };

  const getStatusBadge = (status: EventStatus, isFlagged?: boolean) => {
    if (isFlagged) {
      return <Badge className="bg-red-500/20 text-red-600"><Flag className="h-3 w-3 mr-1" /> Flagged</Badge>;
    }
    return <Badge variant={statusColor[status] as any}>{status}</Badge>;
  };

  const renderEventTable = (events: EventDetails[] | undefined) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Organizer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Registrations</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events?.map((event) => {
          const counts = regCounts?.[event.id];
          return (
            <TableRow key={event.id} className={event.is_flagged ? "bg-red-500/5" : ""}>
              <TableCell>
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{event.sport}</p>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {(event as any).profiles?.full_name || "Unknown"}
              </TableCell>
              <TableCell>{getStatusBadge(event.status, event.is_flagged)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{counts?.total ?? 0}</span>
                  {counts && counts.pending > 0 && (
                    <span className="text-xs text-yellow-600">({counts.pending} pending)</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {format(new Date(event.start_date), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEventDetails(event)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {event.status === "draft" && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => approveEvent.mutate(event.id)}
                        className="text-green-600"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => { setSelectedEvent(event); setRejectDialogOpen(true); }}
                        className="text-red-600"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {!["cancelled", "completed"].includes(event.status) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => cancelMutation.mutate(event.id)}
                      className="text-destructive"
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  )}
                  {!event.is_flagged && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => { setSelectedEvent(event); setFlagDialogOpen(true); }}
                      className="text-yellow-600"
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  // Stats
  const pendingCount = events?.filter(e => e.status === "draft").length ?? 0;
  const flaggedCount = events?.filter(e => e.is_flagged).length ?? 0;
  const activeCount = events?.filter(e => ["published", "ongoing"].includes(e.status)).length ?? 0;

  const refreshEventData = async () => {
    await qc.invalidateQueries({ queryKey: ["admin-all-events"] });
    toast({ title: "Event data refreshed" });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Event Management & Approvals</h1>
          <p className="text-muted-foreground mt-1">Review, approve, and monitor all platform events.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshEventData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <Calendar className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-display font-bold">{events?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground">Total Events</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <Clock className="h-5 w-5 text-yellow-500 mb-2" />
            <p className="text-2xl font-display font-bold">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending Approval</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <AlertTriangle className="h-5 w-5 text-red-500 mb-2" />
            <p className="text-2xl font-display font-bold">{flaggedCount}</p>
            <p className="text-xs text-muted-foreground">Flagged Events</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <CheckCircle className="h-5 w-5 text-green-500 mb-2" />
            <p className="text-2xl font-display font-bold">{activeCount}</p>
            <p className="text-xs text-muted-foreground">Active Events</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="all">All ({events?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Pending ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="flagged" className="gap-2">
            <Flag className="h-4 w-4" />
            Flagged ({flaggedCount})
          </TabsTrigger>
          <TabsTrigger value="active" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Active ({activeCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>
                {activeTab === "all" && "All Events"}
                {activeTab === "pending" && "Pending Approval"}
                {activeTab === "flagged" && "Flagged Events"}
                {activeTab === "active" && "Active Events"}
              </CardTitle>
              <CardDescription>
                {filteredEvents?.length ?? 0} events found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : filteredEvents?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No events found.</p>
              ) : (
                renderEventTable(filteredEvents)
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Event Details Dialog */}
      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedEvent?.is_flagged && <Flag className="h-5 w-5 text-red-500" />}
              {selectedEvent?.title}
            </DialogTitle>
            <DialogDescription>
              Event details and management options
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-6">
              {/* Event Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Sport</p>
                  <p className="font-medium capitalize">{selectedEvent.sport}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{selectedEvent.status}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedEvent.start_date), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Registration Fee</p>
                  <p className="font-medium">${selectedEvent.registration_fee}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="font-medium">{selectedEvent.max_participants} participants</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedEvent.location || "TBD"}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{selectedEvent.description || "No description provided"}</p>
              </div>

              {/* Registration Stats */}
              <div>
                <p className="text-sm font-medium mb-2">Registration Statistics</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold">{regCounts?.[selectedEvent.id]?.total ?? 0}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold text-yellow-600">{regCounts?.[selectedEvent.id]?.pending ?? 0}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold text-green-600">{regCounts?.[selectedEvent.id]?.approved ?? 0}</p>
                    <p className="text-xs text-muted-foreground">Approved</p>
                  </div>
                </div>
              </div>

              {/* Flag Warning */}
              {selectedEvent.is_flagged && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="font-medium">This event has been flagged</p>
                  </div>
                  <p className="text-sm text-red-600/80">{selectedEvent.flag_reason}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                {selectedEvent.status === "draft" && (
                  <>
                    <Button 
                      className="flex-1" 
                      onClick={() => approveEvent.mutate(selectedEvent.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve & Publish
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => setRejectDialogOpen(true)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {!["cancelled", "completed", "draft"].includes(selectedEvent.status) && (
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => cancelMutation.mutate(selectedEvent.id)}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Force Close
                  </Button>
                )}
                {!selectedEvent.is_flagged && (
                  <Button 
                    variant="outline"
                    onClick={() => setFlagDialogOpen(true)}
                    className="text-yellow-600"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Flag
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Flag Dialog */}
      <Dialog open={flagDialogOpen} onOpenChange={setFlagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-600">
              <Flag className="h-5 w-5" />
              Flag Event
            </DialogTitle>
            <DialogDescription>
              Provide a reason for flagging this event for review
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter reason for flagging..."
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                variant="destructive"
                onClick={() => flagEvent.mutate(selectedEvent?.id || "")}
                disabled={!flagReason}
              >
                <Flag className="h-4 w-4 mr-2" />
                Flag Event
              </Button>
              <Button variant="outline" onClick={() => setFlagDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Reject Event
            </DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this event
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                variant="destructive"
                onClick={() => rejectEvent.mutate(selectedEvent?.id || "")}
                disabled={!rejectReason}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Event
              </Button>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEvents;
