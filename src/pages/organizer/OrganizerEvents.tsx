import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { 
  Plus, 
  Calendar, 
  Trash2, 
  Edit, 
  Users, 
  DollarSign, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  Eye,
  FileText,
  Trophy,
  AlertTriangle,
  X,
  ChevronRight,
  Image as ImageIcon
} from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";
import {
  createEvent as apiCreateEvent,
  updateEvent as apiUpdateEvent,
  deleteEvent as apiDeleteEvent,
  getOrganizerEvents,
  getEventRegistrations,
  approveRegistration as apiApproveRegistration,
  rejectRegistration as apiRejectRegistration,
  updateEventStatus as apiUpdateEventStatus,
  uploadEventBanner
} from "@/lib/organizer-event-api";

type EventStatus = Database["public"]["Enums"]["event_status"];

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-green-500/20 text-green-600",
  ongoing: "bg-primary/20 text-primary",
  completed: "bg-secondary text-secondary-foreground",
  cancelled: "bg-destructive/20 text-destructive",
};

const sportCategories = [
  "Running", "Swimming", "Cycling", "Basketball", "Football", 
  "Tennis", "Volleyball", "Athletics", "Gymnastics", "Boxing",
  "Martial Arts", "Golf", "Hockey", "Rugby", "Cricket",
  "Baseball", "Softball", "Table Tennis", "Badminton", "Other"
];

const OrganizerEvents = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [viewRegistrationsOpen, setViewRegistrationsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [form, setForm] = useState({
    title: "", 
    description: "", 
    sport: "", 
    location: "",
    start_date: "", 
    end_date: "", 
    max_participants: "",
    registration_fee: "0", 
    status: "draft" as EventStatus,
    rules: "",
    banner_url: "",
  });

  // Memoized handlers to prevent unnecessary re-renders
  const handleInputChange = useCallback((field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleSelectChange = useCallback((field: keyof typeof form) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["organizer-events", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      return await getOrganizerEvents(user.id);
    },
    enabled: !!user,
  });

  const { data: registrations, isLoading: registrationsLoading } = useQuery({
    queryKey: ["organizer-all-registrations", user?.id],
    queryFn: async () => {
      if (!events || events.length === 0) return [];
      const eventIds = events.map((e) => e.id);
      // Direct API call instead of using the imported function to avoid type issues
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*, events(title)')
        .in('event_id', eventIds)
        .order('registered_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!events && events.length > 0,
  });

  const createEventMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      return await apiCreateEvent(form, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
      setCreateDialogOpen(false);
      resetForm();
      toast({ title: "Event created successfully!" });
    },
    onError: (error: any) => {
      console.error("Error creating event:", error);
      toast({ 
        title: "Failed to create event", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async () => {
      if (!selectedEvent) throw new Error('No event selected');
      return await apiUpdateEvent(selectedEvent.id, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
      setEditDialogOpen(false);
      setSelectedEvent(null);
      toast({ title: "Event updated successfully!" });
    },
    onError: (error: any) => {
      console.error("Error updating event:", error);
      toast({ 
        title: "Failed to update event", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: EventStatus }) => {
      return await apiUpdateEventStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
      toast({ title: "Status updated" });
    },
    onError: (error: any) => {
      console.error("Error updating status:", error);
      toast({ 
        title: "Failed to update status", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiDeleteEvent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
      toast({ title: "Event deleted" });
    },
    onError: (error: any) => {
      console.error("Error deleting event:", error);
      toast({ 
        title: "Failed to delete event", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    },
  });

  const approveRegistrationMutation = useMutation({
    mutationFn: async (registrationId: string) => {
      return await apiApproveRegistration(registrationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-all-registrations"] });
      toast({ title: "Registration approved" });
    },
    onError: (error: any) => {
      console.error("Error approving registration:", error);
      toast({ 
        title: "Failed to approve registration", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    },
  });

  const rejectRegistrationMutation = useMutation({
    mutationFn: async (registrationId: string) => {
      return await apiRejectRegistration(registrationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-all-registrations"] });
      toast({ title: "Registration rejected" });
    },
    onError: (error: any) => {
      console.error("Error rejecting registration:", error);
      toast({ 
        title: "Failed to reject registration", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    },
  });

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: "Please upload an image file", variant: "destructive" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File size exceeds 5MB limit", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${user!.id}-${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-banners')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('event-banners')
        .getPublicUrl(filePath);

      setForm(prev => ({ ...prev, banner_url: publicUrl }));
      toast({ title: "Banner uploaded successfully!" });
    } catch (error: any) {
      console.error("Error uploading banner:", error);
      toast({ 
        title: "Failed to upload banner", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "", description: "", sport: "", location: "",
      start_date: "", end_date: "", max_participants: "",
      registration_fee: "0", status: "draft", rules: "", banner_url: "",
    });
  };

  const openEditDialog = (event: any) => {
    setSelectedEvent(event);
    setForm({
      title: event.title,
      description: event.description || "",
      sport: event.sport,
      location: event.location || "",
      start_date: format(new Date(event.start_date), "yyyy-MM-dd'T'HH:mm"),
      end_date: event.end_date ? format(new Date(event.end_date), "yyyy-MM-dd'T'HH:mm") : "",
      max_participants: event.max_participants?.toString() || "",
      registration_fee: event.registration_fee?.toString() || "0",
      status: event.status,
      rules: "",
      banner_url: event.banner_url || event.banner_image_url || "",
    });
    setEditDialogOpen(true);
  };

  const openViewRegistrations = (event: any) => {
    setSelectedEvent(event);
    setViewRegistrationsOpen(true);
  };



  const getEventRegistrations = (eventId: string) => {
    return registrations?.filter((r: any) => r.event_id === eventId) ?? [];
  };

  // Filter events for different tabs
  const now = new Date();
  const publishedEvents = events?.filter(e => e.status === 'published') ?? [];
  const draftEvents = events?.filter(e => e.status === 'draft') ?? [];
  const pastEvents = events?.filter(e => {
    const eventEnd = e.end_date ? new Date(e.end_date) : new Date(e.start_date);
    return eventEnd < now || e.status === 'completed' || e.status === 'cancelled';
  }) ?? [];

  if (eventsLoading || registrationsLoading) return <p className="text-muted-foreground">Loading…</p>;

  // Reusable Event Card Component
  const EventCard = ({ event }: { event: any }) => {
    const eventRegistrations = getEventRegistrations(event.id);
    const registrationCount = eventRegistrations.length;
    const isFull = event.max_participants && registrationCount >= event.max_participants;
    
    return (
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="font-medium text-foreground truncate">{event.title}</p>
                <Badge className={statusColors[event.status]}>{event.status}</Badge>
                {isFull && <Badge variant="destructive">Full</Badge>}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5" />
                  {event.sport}
                </span>
                {event.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {format(new Date(event.start_date), "MMM d, yyyy")}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {registrationCount}{event.max_participants ? `/${event.max_participants}` : ''} registered
                </span>
                {event.registration_fee && Number(event.registration_fee) > 0 && (
                  <span className="flex items-center gap-1 text-green-600">
                    <DollarSign className="h-3.5 w-3.5" />
                    {event.registration_fee}
                  </span>
                )}
              </div>
              {event.max_participants && (
                <div className="mt-2">
                  <Progress 
                    value={(registrationCount / event.max_participants) * 100} 
                    className="h-1.5" 
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openViewRegistrations(event)}
                className="gap-1"
              >
                <Eye className="h-4 w-4" />
                View
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openEditDialog(event)}
                className="gap-1"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Select
                value={event.status}
                onValueChange={(v) => updateStatus.mutate({ id: event.id, status: v as EventStatus })}
              >
                <SelectTrigger className="w-[110px] h-8 text-xs">
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Event?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete "{event.title}" and all its registrations.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => deleteEventMutation.mutate(event.id)}
                      className="bg-destructive text-destructive-foreground"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Create Event Form Component
  const EventForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      {/* Banner Upload */}
      <div>
        <Label>Event Banner</Label>
        <div className="mt-2">
          {form.banner_url ? (
            <div className="relative">
              <img src={form.banner_url} alt="Banner" className="w-full h-32 object-cover rounded-lg" />
              <button
                onClick={() => setForm(prev => ({ ...prev, banner_url: "" }))}
                className="absolute top-2 right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors"
            >
              {uploading ? (
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Click to upload banner</span>
                  <span className="text-xs text-muted-foreground">Recommended: 1200x400px</span>
                </>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerUpload}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Event Name *</Label>
          <Input 
            value={form.title} 
            onChange={handleInputChange('title')} 
            placeholder="e.g., City Marathon 2024"
            className="mt-1" 
          />
        </div>
        <div>
          <Label>Sport Category *</Label>
          <Select value={form.sport} onValueChange={handleSelectChange('sport')}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              {sportCategories.map(sport => (
                <SelectItem key={sport} value={sport}>{sport}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Location</Label>
        <Input 
          value={form.location} 
          onChange={handleInputChange('location')} 
          placeholder="e.g., Central Park, New York"
          className="mt-1" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Start Date & Time *</Label>
          <Input 
            type="datetime-local" 
            value={form.start_date} 
            onChange={handleInputChange('start_date')} 
            className="mt-1" 
          />
        </div>
        <div>
          <Label>End Date & Time</Label>
          <Input 
            type="datetime-local" 
            value={form.end_date} 
            onChange={handleInputChange('end_date')} 
            className="mt-1" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Capacity Limit</Label>
          <Input 
            type="number" 
            value={form.max_participants} 
            onChange={handleInputChange('max_participants')}
            placeholder="Leave empty for unlimited"
            className="mt-1" 
          />
        </div>
        <div>
          <Label>Registration Fee ($)</Label>
          <Input 
            type="number" 
            step="0.01" 
            value={form.registration_fee} 
            onChange={handleInputChange('registration_fee')}
            placeholder="0 for free"
            className="mt-1" 
          />
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea 
          value={form.description} 
          onChange={handleInputChange('description')}
          placeholder="Describe your event..."
          className="mt-1 min-h-[80px]" 
        />
      </div>

      <div>
        <Label>Rules & Regulations</Label>
        <Textarea 
          value={form.rules} 
          onChange={handleInputChange('rules')}
          placeholder="List event rules and regulations..."
          className="mt-1 min-h-[80px]" 
        />
      </div>

      <div>
        <Label>Status</Label>
        <Select value={form.status} onValueChange={handleSelectChange('status')}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Draft events are only visible to you. Published events are visible to athletes.
        </p>
      </div>

      <Button 
        onClick={() => isEdit ? updateEventMutation.mutate() : createEventMutation.mutate()} 
        disabled={!form.title || !form.sport || !form.start_date || createEventMutation.isPending || updateEventMutation.isPending} 
        className="w-full"
      >
        {createEventMutation.isPending || updateEventMutation.isPending ? "Saving…" : isEdit ? "Update Event" : "Create Event"}
      </Button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Events Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage your sporting events.</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> 
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>Fill in the details to create your event</DialogDescription>
            </DialogHeader>
            <EventForm />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {!events || events.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No events yet. Create your first event!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Published Events Tab */}
        <TabsContent value="published" className="space-y-4">
          {publishedEvents.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No published events. Publish a draft event to see it here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {publishedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Draft Events Tab */}
        <TabsContent value="draft" className="space-y-4">
          {draftEvents.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No draft events. Create a new event to save it as a draft.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {draftEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Past Events Tab */}
        <TabsContent value="past" className="space-y-4">
          {pastEvents.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No past events. Completed or cancelled events will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Event Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update your event details</DialogDescription>
          </DialogHeader>
          <EventForm isEdit />
        </DialogContent>
      </Dialog>

      {/* View Registrations Dialog */}
      <Dialog open={viewRegistrationsOpen} onOpenChange={setViewRegistrationsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Event Registrations</DialogTitle>
            <DialogDescription>
              {selectedEvent?.title} - Manage participant registrations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {getEventRegistrations(selectedEvent?.id || '').length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No registrations yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getEventRegistrations(selectedEvent?.id || '').map((reg: any) => (
                  <div key={reg.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Athlete ID: {reg.athlete_id.slice(0, 8)}...</p>
                        <p className="text-sm text-muted-foreground">
                          Registered {format(new Date(reg.registered_at), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={reg.status === 'approved' ? 'default' : reg.status === 'pending' ? 'secondary' : 'destructive'}
                      >
                        {reg.status}
                      </Badge>
                      {reg.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => approveRegistrationMutation.mutate(reg.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => rejectRegistrationMutation.mutate(reg.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerEvents;
