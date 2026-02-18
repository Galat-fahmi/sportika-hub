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
  type: 'event_reminder' | 'registration_approval' | 'result_announcement' | 'platform_update' | 'sponsorship_offer';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  metadata?: {
    eventId?: string;
    eventName?: string;
    position?: number;
    sponsorName?: string;
    amount?: string;
  };
}

const AthleteNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");

  // Fetch notifications (simulated with mock data for now)
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["athlete-notifications", user?.id],
    queryFn: async () => {
      // In a real app, this would fetch from a notifications table
      // For now, we'll generate mock notifications based on user data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'event_reminder',
          title: 'Event Starting Soon',
          message: 'The City Marathon starts in 24 hours. Don\'t forget to prepare!',
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
          metadata: { eventId: '1', eventName: 'City Marathon' }
        },
        {
          id: '2',
          type: 'registration_approval',
          title: 'Registration Approved',
          message: 'Your registration for Regional Championships has been approved.',
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          metadata: { eventId: '2', eventName: 'Regional Championships' }
        },
        {
          id: '3',
          type: 'result_announcement',
          title: 'Results Published',
          message: 'Congratulations! You finished 2nd in the Spring Tournament.',
          read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          metadata: { eventId: '3', eventName: 'Spring Tournament', position: 2 }
        },
        {
          id: '4',
          type: 'sponsorship_offer',
          title: 'New Sponsorship Offer',
          message: 'Nike has sent you a sponsorship proposal. Check it out!',
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
          metadata: { sponsorName: 'Nike', amount: '$5,000' }
        },
        {
          id: '5',
          type: 'platform_update',
          title: 'New Feature Available',
          message: 'You can now share your achievements directly to social media!',
          read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
        },
        {
          id: '6',
          type: 'event_reminder',
          title: 'Registration Closing Soon',
          message: 'Registration for Summer League closes in 2 days.',
          read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
          metadata: { eventId: '4', eventName: 'Summer League' }
        },
        {
          id: '7',
          type: 'result_announcement',
          title: 'Certificate Available',
          message: 'Your certificate for Winter Games is now available for download.',
          read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
          metadata: { eventId: '5', eventName: 'Winter Games', position: 3 }
        },
      ];
      return mockNotifications;
    },
    enabled: !!user,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      // In a real app, this would update the database
      // await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athlete-notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      // In a real app, this would update all unread notifications
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athlete-notifications"] });
      toast({ title: "All notifications marked as read" });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      // In a real app, this would delete from the database
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
      case 'registration_approval':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'result_announcement':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'sponsorship_offer':
        return <Gift className="h-5 w-5 text-purple-500" />;
      case 'platform_update':
        return <Info className="h-5 w-5 text-cyan-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'event_reminder':
        return <Badge variant="secondary" className="text-xs">Event</Badge>;
      case 'registration_approval':
        return <Badge className="bg-green-500/20 text-green-600 text-xs">Approved</Badge>;
      case 'result_announcement':
        return <Badge className="bg-yellow-500/20 text-yellow-600 text-xs">Results</Badge>;
      case 'sponsorship_offer':
        return <Badge className="bg-purple-500/20 text-purple-600 text-xs">Sponsorship</Badge>;
      case 'platform_update':
        return <Badge className="bg-cyan-500/20 text-cyan-600 text-xs">Update</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">General</Badge>;
    }
  };

  const filteredNotifications = notifications?.filter((n: Notification) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    return n.type === activeTab;
  });

  const unreadCount = notifications?.filter((n: Notification) => !n.read).length ?? 0;

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
              {notifications?.filter((n: Notification) => n.type === 'event_reminder').length ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Events</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <Trophy className="h-5 w-5 text-yellow-500 mx-auto mb-2" />
            <p className="text-xl font-display font-bold">
              {notifications?.filter((n: Notification) => n.type === 'result_announcement').length ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Results</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <Gift className="h-5 w-5 text-purple-500 mx-auto mb-2" />
            <p className="text-xl font-display font-bold">
              {notifications?.filter((n: Notification) => n.type === 'sponsorship_offer').length ?? 0}
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
                    !notification.read ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-semibold ${!notification.read ? 'text-foreground' : ''}`}>
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <span className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            {notification.metadata && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {notification.metadata.eventName && (
                                  <Badge variant="outline" className="text-xs">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {notification.metadata.eventName}
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
                                {notification.metadata.sponsorName && (
                                  <Badge variant="outline" className="text-xs">
                                    <Star className="h-3 w-3 mr-1" />
                                    {notification.metadata.sponsorName}
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
                            {getNotificationBadge(notification.type)}
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {!notification.read && (
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
              <Badge>Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Registration Updates</p>
                  <p className="text-sm text-muted-foreground">Approval status and confirmations</p>
                </div>
              </div>
              <Badge>Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">Results & Certificates</p>
                  <p className="text-sm text-muted-foreground">Result announcements and certificate availability</p>
                </div>
              </div>
              <Badge>Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <Gift className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Sponsorship Offers</p>
                  <p className="text-sm text-muted-foreground">New sponsorship opportunities</p>
                </div>
              </div>
              <Badge>Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-cyan-500" />
                <div>
                  <p className="font-medium">Platform Updates</p>
                  <p className="text-sm text-muted-foreground">New features and platform news</p>
                </div>
              </div>
              <Badge variant="outline">Disabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AthleteNotifications;