import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  Bell, 
  Calendar, 
  CheckCircle, 
  Trophy, 
  Info, 
  Gift,
  Clock,
  Trash2,
  CheckCheck,
  AlertCircle,
  MapPin,
  DollarSign,
  Star,
  Megaphone
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  action_url?: string | null;
  action_label?: string | null;
  metadata?: any;
}

const AthleteNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");

  // Fetch notifications from Supabase
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["athlete-notifications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("id", notificationId);
      
      if (error) throw error;
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athlete-notifications"] });
      toast({ title: "Notification marked as read" });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("user_id", user!.id)
        .eq("is_read", false);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athlete-notifications"] });
      toast({ title: "All notifications marked as read" });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);
      
      if (error) throw error;
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athlete-notifications"] });
      toast({ title: "Notification deleted" });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event_reminder':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'registration_approved':
      case 'registration_rejected':
      case 'registration_waitlisted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'result_announced':
      case 'certificate_issued':
      case 'achievement_earned':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'sponsorship_offer':
        return <Gift className="h-5 w-5 text-purple-500" />;
      case 'platform_update':
      case 'system_alert':
        return <Info className="h-5 w-5 text-cyan-500" />;
      case 'payment_confirmed':
      case 'payment_failed':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'event_reminder':
      case 'event_cancelled':
      case 'event_updated':
        return <Badge variant="secondary" className="text-xs">Event</Badge>;
      case 'registration_approved':
        return <Badge className="bg-green-500/20 text-green-600 text-xs">Approved</Badge>;
      case 'registration_rejected':
        return <Badge className="bg-red-500/20 text-red-600 text-xs">Rejected</Badge>;
      case 'registration_waitlisted':
        return <Badge className="bg-orange-500/20 text-orange-600 text-xs">Waitlisted</Badge>;
      case 'result_announced':
      case 'certificate_issued':
      case 'achievement_earned':
        return <Badge className="bg-yellow-500/20 text-yellow-600 text-xs">Results</Badge>;
      case 'sponsorship_offer':
        return <Badge className="bg-purple-500/20 text-purple-600 text-xs">Sponsorship</Badge>;
      case 'platform_update':
      case 'system_alert':
        return <Badge className="bg-cyan-500/20 text-cyan-600 text-xs">Update</Badge>;
      case 'payment_confirmed':
        return <Badge className="bg-green-500/20 text-green-600 text-xs">Payment</Badge>;
      case 'payment_failed':
        return <Badge className="bg-red-500/20 text-red-600 text-xs">Payment Failed</Badge>;
      case 'message':
        return <Badge className="bg-blue-500/20 text-blue-600 text-xs">Message</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">General</Badge>;
    }
  };

  const filteredNotifications = notifications?.filter((n: Notification) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.is_read;
    return n.notification_type === activeTab;
  });

  const unreadCount = notifications?.filter((n: Notification) => !n.is_read).length ?? 0;

  // Fetch notification preferences
  const { data: preferences } = useQuery({
    queryKey: ["notification-preferences", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      
      if (error) {
        // If no preferences exist, return defaults
        if (error.code === 'PGRST116') {
          return {
            event_reminders_enabled: true,
            registration_updates_enabled: true,
            result_announcements_enabled: true,
            achievements_enabled: true,
            sponsorship_offers_enabled: true,
            platform_updates_enabled: false,
          };
        }
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) return <p className="text-muted-foreground">Loading notifications…</p>;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your events, results, and opportunities.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => markAllAsReadMutation.mutate()}
            className="gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            Mark All Read
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <Bell className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-xl font-display font-bold">{notifications?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-5 w-5 text-red-500 mx-auto mb-2" />
            <p className="text-xl font-display font-bold">{unreadCount}</p>
            <p className="text-xs text-muted-foreground">Unread</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <Calendar className="h-5 w-5 text-blue-500 mx-auto mb-2" />
            <p className="text-xl font-display font-bold">
              {notifications?.filter((n: Notification) => n.notification_type === 'event_reminder').length ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Events</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <Trophy className="h-5 w-5 text-yellow-500 mx-auto mb-2" />
            <p className="text-xl font-display font-bold">
              {notifications?.filter((n: Notification) => n.notification_type === 'result_announced').length ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Results</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <Gift className="h-5 w-5 text-purple-500 mx-auto mb-2" />
            <p className="text-xl font-display font-bold">
              {notifications?.filter((n: Notification) => n.notification_type === 'sponsorship_offer').length ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Offers</p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-6">
          <TabsTrigger value="all">
            All
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">{unreadCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="event_reminder">Events</TabsTrigger>
          <TabsTrigger value="result_announcement">Results</TabsTrigger>
          <TabsTrigger value="sponsorship_offer">Offers</TabsTrigger>
          <TabsTrigger value="platform_update">Updates</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {!filteredNotifications || filteredNotifications.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No notifications found.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeTab === 'unread' 
                    ? "You're all caught up!" 
                    : "Check back later for updates."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification: Notification) => (
                <Card 
                  key={notification.id} 
                  className={`glass transition-all hover:border-primary/30 ${
                    !notification.is_read ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center flex-shrink-0">
                        {getNotificationIcon(notification.notification_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-semibold ${!notification.is_read ? 'text-foreground' : ''}`}>
                                {notification.title}
                              </h3>
                              {!notification.is_read && (
                                <span className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {notification.metadata.event_name && (
                                  <Badge variant="outline" className="text-xs">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {notification.metadata.event_name}
                                  </Badge>
                                )}
                                {notification.metadata.position && (
                                  <Badge variant="outline" className="text-xs">
                                    <Trophy className="h-3 w-3 mr-1" />
                                    {notification.metadata.position === 1 ? '1st' :
                                     notification.metadata.position === 2 ? '2nd' :
                                     notification.metadata.position === 3 ? '3rd' :
                                     `${notification.metadata.position}th`} Place
                                  </Badge>
                                )}
                                {notification.metadata.sponsor_name && (
                                  <Badge variant="outline" className="text-xs">
                                    <Star className="h-3 w-3 mr-1" />
                                    {notification.metadata.sponsor_name}
                                  </Badge>
                                )}
                                {notification.metadata.amount && (
                                  <Badge variant="outline" className="text-xs">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    {notification.metadata.amount}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            {getNotificationBadge(notification.notification_type)}
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => markAsReadMutation.mutate(notification.id)}
                            title="Mark as read"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteNotificationMutation.mutate(notification.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Notification Preferences */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Megaphone className="h-5 w-5 text-primary" /> Notification Preferences
          </CardTitle>
          <CardDescription>Manage what notifications you receive</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Event Reminders</p>
                  <p className="text-sm text-muted-foreground">Upcoming events and registration deadlines</p>
                </div>
              </div>
              <Badge variant={preferences?.event_reminders_enabled ? 'default' : 'outline'}>
                {preferences?.event_reminders_enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Registration Updates</p>
                  <p className="text-sm text-muted-foreground">Approval status and confirmations</p>
                </div>
              </div>
              <Badge variant={preferences?.registration_updates_enabled ? 'default' : 'outline'}>
                {preferences?.registration_updates_enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">Results & Certificates</p>
                  <p className="text-sm text-muted-foreground">Result announcements and certificate availability</p>
                </div>
              </div>
              <Badge variant={preferences?.result_announcements_enabled ? 'default' : 'outline'}>
                {preferences?.result_announcements_enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <Gift className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Sponsorship Offers</p>
                  <p className="text-sm text-muted-foreground">New sponsorship opportunities</p>
                </div>
              </div>
              <Badge variant={preferences?.sponsorship_offers_enabled ? 'default' : 'outline'}>
                {preferences?.sponsorship_offers_enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-cyan-500" />
                <div>
                  <p className="font-medium">Platform Updates</p>
                  <p className="text-sm text-muted-foreground">New features and platform news</p>
                </div>
              </div>
              <Badge variant={preferences?.platform_updates_enabled ? 'default' : 'outline'}>
                {preferences?.platform_updates_enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AthleteNotifications;