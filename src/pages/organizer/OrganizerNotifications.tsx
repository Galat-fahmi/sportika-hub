import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { 
  Bell, 
  Send, 
  Mail, 
  Smartphone, 
  MessageSquare,
  Clock,
  Calendar,
  Trophy,
  Users,
  CheckCircle,
  AlertCircle,
  History,
  Plus,
  Trash2,
  Edit3,
  Eye
} from "lucide-react";
import { format } from "date-fns";

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'push' | 'sms';
}

interface ScheduledNotification {
  id: string;
  event_id: string;
  event_name: string;
  type: 'reminder' | 'results' | 'custom';
  scheduled_for: string;
  status: 'scheduled' | 'sent' | 'cancelled';
  recipient_count: number;
}

const OrganizerNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("compose");
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [notificationType, setNotificationType] = useState<string>("email");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const { data: events } = useQuery({
    queryKey: ["organizer-notif-events", user?.id],
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

  const { data: registrations } = useQuery({
    queryKey: ["organizer-notif-registrations", selectedEvent],
    queryFn: async () => {
      if (!selectedEvent) return [];
      const { data, error } = await supabase
        .from("event_registrations")
        .select("*, profiles:athlete_id(full_name, email)")
        .eq("event_id", selectedEvent)
        .eq("status", "registered");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedEvent,
  });

  // Mock templates
  const templates: NotificationTemplate[] = [
    {
      id: 'reminder-24h',
      name: 'Event Reminder (24h)',
      subject: 'Reminder: Your event is tomorrow!',
      content: 'Hi {{name}},\n\nThis is a friendly reminder that {{event_name}} is starting tomorrow at {{event_time}}.\n\nLocation: {{event_location}}\n\nSee you there!',
      type: 'email',
    },
    {
      id: 'reminder-1h',
      name: 'Event Reminder (1h)',
      subject: 'Starting in 1 hour!',
      content: 'Hi {{name}},\n\n{{event_name}} starts in 1 hour. Please arrive on time!\n\nLocation: {{event_location}}',
      type: 'push',
    },
    {
      id: 'results-published',
      name: 'Results Published',
      subject: 'Results are now available!',
      content: 'Hi {{name}},\n\nThe results for {{event_name}} have been published.\n\nCheck your ranking and download your certificate from the app.\n\nCongratulations to all participants!',
      type: 'email',
    },
    {
      id: 'registration-confirmed',
      name: 'Registration Confirmed',
      subject: 'Registration Confirmed!',
      content: 'Hi {{name}},\n\nYour registration for {{event_name}} has been confirmed.\n\nEvent Date: {{event_date}}\nLocation: {{event_location}}\n\nGood luck!',
      type: 'email',
    },
  ];

  // Mock scheduled notifications
  const scheduledNotifications: ScheduledNotification[] = [
    {
      id: '1',
      event_id: 'evt1',
      event_name: 'City Marathon',
      type: 'reminder',
      scheduled_for: new Date(Date.now() + 86400000).toISOString(),
      status: 'scheduled',
      recipient_count: 150,
    },
    {
      id: '2',
      event_id: 'evt2',
      event_name: 'Spring Tournament',
      type: 'results',
      scheduled_for: new Date(Date.now() - 86400000).toISOString(),
      status: 'sent',
      recipient_count: 64,
    },
  ];

  const sendNotification = useMutation({
    mutationFn: async () => {
      // In a real app, this would send the notification via API
      toast({ 
        title: "Notification sent!", 
        description: `Sent to ${registrations?.length || 0} participants via ${notificationType}` 
      });
    },
    onSuccess: () => {
      setSubject("");
      setMessage("");
      setSelectedEvent("");
    },
  });

  const scheduleNotification = useMutation({
    mutationFn: async () => {
      toast({ 
        title: "Notification scheduled!", 
        description: `Will be sent on ${format(new Date(scheduleDate), "MMM d, yyyy h:mm a")}` 
      });
    },
    onSuccess: () => {
      setScheduleDate("");
    },
  });

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setMessage(template.content);
      setNotificationType(template.type);
    }
  };

  const getRecipientCount = () => {
    if (selectedEvent === "all") {
      // Would need to count all registrations across all events
      return registrations?.length || 0;
    }
    return registrations?.length || 0;
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <Smartphone className="h-4 w-4" />;
      case 'push':
        return <Bell className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500/20 text-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Sent</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500/20 text-blue-600"><Clock className="h-3 w-3 mr-1" /> Scheduled</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/20 text-red-600"><AlertCircle className="h-3 w-3 mr-1" /> Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Notifications & Communication</h1>
        <p className="text-muted-foreground mt-1">Send announcements, reminders, and updates to participants.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Compose Tab */}
        <TabsContent value="compose" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message Composer */}
            <Card className="glass lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Compose Message
                </CardTitle>
                <CardDescription>Create and send notifications to participants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Event Selection */}
                <div>
                  <Label>Select Event</Label>
                  <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose an event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      {events?.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Template Selection */}
                <div>
                  <Label>Use Template (Optional)</Label>
                  <Select value={selectedTemplate} onValueChange={(v) => { setSelectedTemplate(v); applyTemplate(v); }}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Notification Type */}
                <div>
                  <Label>Notification Type</Label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      variant={notificationType === 'email' ? 'default' : 'outline'}
                      className="flex-1 gap-2"
                      onClick={() => setNotificationType('email')}
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                    <Button
                      variant={notificationType === 'push' ? 'default' : 'outline'}
                      className="flex-1 gap-2"
                      onClick={() => setNotificationType('push')}
                    >
                      <Bell className="h-4 w-4" />
                      Push
                    </Button>
                    <Button
                      variant={notificationType === 'sms' ? 'default' : 'outline'}
                      className="flex-1 gap-2"
                      onClick={() => setNotificationType('sms')}
                    >
                      <Smartphone className="h-4 w-4" />
                      SMS
                    </Button>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <Label>Subject</Label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter message subject..."
                    className="mt-1"
                  />
                </div>

                {/* Message */}
                <div>
                  <Label>Message</Label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="mt-1 min-h-[150px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use {'{{name}}'}, {'{{event_name}}'}, {'{{event_date}}'} as placeholders
                  </p>
                </div>

                {/* Schedule Option */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label>Schedule for Later (Optional)</Label>
                    <Input
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Send Button */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Will be sent to <strong>{getRecipientCount()}</strong> participants
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {scheduleDate && (
                      <Button 
                        variant="outline" 
                        onClick={() => scheduleNotification.mutate()}
                        disabled={!subject || !message || !selectedEvent}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                    )}
                    <Button 
                      onClick={() => sendNotification.mutate()}
                      disabled={!subject || !message || !selectedEvent}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-4">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setSelectedTemplate('reminder-24h');
                      applyTemplate('reminder-24h');
                    }}
                  >
                    <Clock className="h-4 w-4" />
                    Send 24h Reminder
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setSelectedTemplate('results-published');
                      applyTemplate('results-published');
                    }}
                  >
                    <Trophy className="h-4 w-4" />
                    Announce Results
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setSelectedTemplate('registration-confirmed');
                      applyTemplate('registration-confirmed');
                    }}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Registration Confirmation
                  </Button>
                </CardContent>
              </Card>

              {/* Recipients Preview */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Recipients</CardTitle>
                  <CardDescription>{getRecipientCount()} participants will receive this</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {registrations?.slice(0, 5).map((reg: any) => (
                      <div key={reg.id} className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{reg.profiles?.full_name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground truncate">{reg.profiles?.email}</p>
                        </div>
                      </div>
                    ))}
                    {registrations && registrations.length > 5 && (
                      <p className="text-center text-sm text-muted-foreground">
                        +{registrations.length - 5} more
                      </p>
                    )}
                    {!registrations?.length && selectedEvent && (
                      <p className="text-center text-sm text-muted-foreground py-4">
                        No registered participants for this event
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Scheduled Tab */}
        <TabsContent value="scheduled" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Scheduled Notifications
              </CardTitle>
              <CardDescription>View and manage upcoming and past notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {scheduledNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No scheduled notifications.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduledNotifications.map((notif) => (
                    <div key={notif.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {notif.type === 'reminder' && <Clock className="h-5 w-5 text-primary" />}
                          {notif.type === 'results' && <Trophy className="h-5 w-5 text-primary" />}
                          {notif.type === 'custom' && <MessageSquare className="h-5 w-5 text-primary" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{notif.event_name}</p>
                            {getStatusBadge(notif.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notif.type === 'reminder' && 'Event Reminder'}
                            {notif.type === 'results' && 'Results Announcement'}
                            {notif.type === 'custom' && 'Custom Message'}
                            {' · '}
                            {format(new Date(notif.scheduled_for), "MMM d, yyyy h:mm a")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notif.recipient_count} recipients
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {notif.status === 'scheduled' && (
                          <>
                            <Button variant="ghost" size="icon">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {notif.status === 'sent' && (
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Message Templates</h3>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge variant="outline" className="gap-1">
                      {getNotificationTypeIcon(template.type)}
                      {template.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{template.subject}</p>
                  <p className="text-xs text-muted-foreground line-clamp-3">{template.content}</p>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setActiveTab('compose');
                        applyTemplate(template.id);
                      }}
                    >
                      Use Template
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizerNotifications;