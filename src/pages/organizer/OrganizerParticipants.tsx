import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { 
  Users, 
  Download, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  Search,
  Filter,
  FileSpreadsheet,
  MessageSquare,
  QrCode,
  CheckSquare,
  Mail,
  Smartphone,
  Calendar,
  Trophy,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  Wifi
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";

const OrganizerParticipants = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [qrInput, setQrInput] = useState("");
  const [isRealTimeConnected, setIsRealTimeConnected] = useState(false);

  // Real-time subscription for event registrations
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('organizer-registrations-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_registrations'
        },
        (payload) => {
          console.log('Real-time registration update:', payload);
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ["organizer-registrations"] });
          
          // Show toast for new registrations
          if (payload.eventType === 'INSERT') {
            toast({ 
              title: "New Registration!", 
              description: "A new participant has registered for your event."
            });
          }
        }
      )
      .subscribe((status) => {
        setIsRealTimeConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const { data: events, isLoading: eventsLoading } = useQuery({
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
    refetchInterval: 30000, // Refetch every 30 seconds as fallback
    staleTime: 10000,
  });

  const { data: registrations, isLoading: registrationsLoading, refetch: refetchRegistrations } = useQuery({
    queryKey: ["organizer-registrations", user?.id, selectedEvent],
    queryFn: async () => {
      // First, get the events owned by this organizer
      const { data: organizerEvents, error: eventsError } = await supabase
        .from("events")
        .select("id")
        .eq("organizer_id", user!.id);
      
      if (eventsError) {
        console.error('Error fetching organizer events:', eventsError);
        throw eventsError;
      }
      
      if (!organizerEvents || organizerEvents.length === 0) {
        // If no events, return empty array
        return [];
      }
      
      // Get event IDs
      const eventIds = organizerEvents.map(e => e.id);
      
      // Now fetch registrations for these events
      let queryBuilder = supabase
        .from("event_registrations")
        .select("*, events:event_id(title, sport, start_date), profiles:athlete_id(full_name, email)")
        .in("event_id", eventIds)
        .order("registered_at", { ascending: false });
      
      // Apply additional filter if specific event is selected
      if (selectedEvent !== "all") {
        queryBuilder = queryBuilder.eq("event_id", selectedEvent);
      }
      
      const { data, error } = await queryBuilder;
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    refetchInterval: 15000, // Refetch every 15 seconds for real-time feel
    staleTime: 5000,
  });

  const approveRegistration = useMutation({
    mutationFn: async (registrationId: string) => {
      const { error } = await supabase
        .from('event_registrations')
        .update({ status: 'approved' })
        .eq('id', registrationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-registrations"] });
      toast({ title: "Registration approved" });
    },
    onError: (error: any) => {
      console.error('Error approving registration:', error);
      toast({ 
        title: "Failed to approve registration", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    },
  });

  const rejectRegistration = useMutation({
    mutationFn: async (registrationId: string) => {
      const { error } = await supabase
        .from('event_registrations')
        .update({ status: 'rejected' })
        .eq('id', registrationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-registrations"] });
      toast({ title: "Registration rejected" });
    },
    onError: (error: any) => {
      console.error('Error rejecting registration:', error);
      toast({ 
        title: "Failed to reject registration", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    },
  });

  const sendAnnouncement = useMutation({
    mutationFn: async () => {
      // In a real app, this would send notifications to participants
      toast({ title: "Announcement sent!", description: `Message sent to ${filteredRegistrations.length} participants` });
    },
  });

  const checkInParticipant = useMutation({
    mutationFn: async (registrationId: string) => {
      const { error } = await supabase
        .from("event_registrations")
        .update({ checked_in: true, checked_in_at: new Date().toISOString() })
        .eq("id", registrationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-registrations"] });
      toast({ title: "Check-in successful!" });
      setQrInput("");
    },
  });

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    if (!registrations) return [];
    return registrations.filter((reg: any) => {
      const matchesSearch = 
        (reg.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         reg.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         reg.events?.title.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === "all" || reg.status === statusFilter;
      const matchesPayment = paymentFilter === "all" || reg.payment_status === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [registrations, searchQuery, statusFilter, paymentFilter]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Name", "Email", "Event", "Sport", "Status", "Payment Status", "Registered Date"];
    const rows = filteredRegistrations.map((reg: any) => [
      reg.profiles?.full_name || "N/A",
      reg.profiles?.email || "N/A",
      reg.events?.title,
      reg.events?.sport,
      reg.status,
      reg.payment_status || "pending",
      format(new Date(reg.registered_at), "yyyy-MM-dd HH:mm")
    ]);
    
    const csvContent = [headers.join(","), ...rows.map((r: any[]) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `participants-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: "CSV exported successfully" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-600"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-600"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string | null) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/20 text-green-600"><DollarSign className="h-3 w-3 mr-1" /> Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-600"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-600"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const stats = {
    total: filteredRegistrations.length,
    approved: filteredRegistrations.filter((r: any) => r.status === 'approved').length,
    pending: filteredRegistrations.filter((r: any) => r.status === 'pending').length,
    paid: filteredRegistrations.filter((r: any) => r.payment_status === 'paid').length,
    checkedIn: filteredRegistrations.filter((r: any) => r.checked_in).length,
  };

  if (eventsLoading || registrationsLoading) return <p className="text-muted-foreground">Loading participants...</p>;

  const refreshParticipants = async () => {
    await queryClient.invalidateQueries({ queryKey: ["organizer-registrations"] });
    await queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
    toast({ title: "Data refreshed" });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display font-bold text-foreground">Participant Management</h1>
            {isRealTimeConnected && (
              <Badge className="bg-green-500/20 text-green-600 gap-1">
                <Wifi className="h-3 w-3" />
                Live
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">Manage registrations, approvals, and check-ins. {isRealTimeConnected ? 'Data updates automatically.' : ''}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={refreshParticipants} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportToCSV} className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Export CSV
          </Button>
          <Dialog open={announcementOpen} onOpenChange={setAnnouncementOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Send className="h-4 w-4" />
                Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Announcement</DialogTitle>
                <DialogDescription>Send a message to {filteredRegistrations.length} participants</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Select defaultValue="email">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                    </SelectItem>
                    <SelectItem value="sms">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        SMS
                      </div>
                    </SelectItem>
                    <SelectItem value="push">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Push Notification
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Type your announcement message..."
                  value={announcementMessage}
                  onChange={(e) => setAnnouncementMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  className="w-full gap-2" 
                  onClick={() => sendAnnouncement.mutate()}
                  disabled={!announcementMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                  Send to {filteredRegistrations.length} Participants
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={checkInOpen} onOpenChange={setCheckInOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <QrCode className="h-4 w-4" />
                Check-In
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Event Check-In</DialogTitle>
                <DialogDescription>Scan QR code or enter participant ID</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter registration ID or scan QR..."
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => {
                      if (qrInput) {
                        checkInParticipant.mutate(qrInput);
                      }
                    }}
                    disabled={!qrInput}
                  >
                    <CheckSquare className="h-4 w-4 mr-1" />
                    Check In
                  </Button>
                </div>
                <div className="p-8 border-2 border-dashed border-border rounded-lg text-center">
                  <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">QR Scanner placeholder</p>
                  <p className="text-sm text-muted-foreground">In production, this would open camera for QR scanning</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <Users className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">{stats.approved}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-5 w-5 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">{stats.paid}</p>
            <p className="text-xs text-muted-foreground">Paid</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <CheckSquare className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">{stats.checkedIn}</p>
            <p className="text-xs text-muted-foreground">Checked In</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search participants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events?.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Approval status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Participants Table */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" /> Registered Athletes
          </CardTitle>
          <CardDescription>Manage participant registrations and check-ins</CardDescription>
        </CardHeader>
        <CardContent>
          {!filteredRegistrations || filteredRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No participants found.</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery || statusFilter !== "all" || paymentFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Registrations will appear here when athletes sign up"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Athlete</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Approval</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Check-In</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((reg: any) => (
                    <TableRow key={reg.id} className={reg.checked_in ? "bg-green-500/5" : ""}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reg.profiles?.full_name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{reg.profiles?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reg.events?.title}</p>
                          <p className="text-xs text-muted-foreground">{reg.events?.sport}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(reg.status)}</TableCell>
                      <TableCell>{getPaymentBadge(reg.payment_status)}</TableCell>
                      <TableCell>
                        {reg.checked_in ? (
                          <Badge className="bg-green-500/20 text-green-600">
                            <CheckSquare className="h-3 w-3 mr-1" />
                            {format(new Date(reg.checked_in_at), "HH:mm")}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not Checked In</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {format(new Date(reg.registered_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {reg.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => approveRegistration.mutate(reg.id)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-500/10"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => rejectRegistration.mutate(reg.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-500/10"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {!reg.checked_in && reg.status === 'approved' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => checkInParticipant.mutate(reg.id)}
                            >
                              Check In
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerParticipants;
