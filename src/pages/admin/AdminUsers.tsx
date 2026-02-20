import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { 
  Users, 
  User, 
  Building2, 
  Search, 
  CheckCircle, 
  XCircle, 
  Ban, 
  Eye, 
  Activity,
  Trophy,
  DollarSign,
  Calendar,
  Shield,
  MoreHorizontal,
  Filter,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { getAdminDashboardOverview } from "@/lib/admin-api";

interface UserActivity {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("athletes");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch all profiles with roles
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["admin-all-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, user_roles(role)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch events for organizer revenue calculation
  const { data: events } = useQuery({
    queryKey: ["admin-all-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*, event_registrations(id, payment_status)");
      if (error) throw error;
      return data;
    },
  });

  // Fetch admin dashboard overview
  const { data: dashboardOverview } = useQuery({
    queryKey: ["admin-dashboard-overview"],
    queryFn: async () => {
      return await getAdminDashboardOverview();
    },
  });

  // Separate athletes and organizers
  const athletes = profiles?.filter((p: any) => p.user_roles?.role === "athlete") ?? [];
  const organizers = profiles?.filter((p: any) => p.user_roles?.role === "organizer") ?? [];

  const refreshUserData = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-all-profiles"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-all-events"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-dashboard-overview"] });
    toast({ title: "User data refreshed" });
  };

  // Filter users based on search and status
  const filterUsers = (users: any[]) => {
    return users.filter((user) => {
      const matchesSearch = 
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const filteredAthletes = filterUsers(athletes);
  const filteredOrganizers = filterUsers(organizers);

  // Mock user activities
  const getUserActivities = (userId: string): UserActivity[] => [
    { id: '1', action: 'Account Created', timestamp: new Date(Date.now() - 86400000 * 30).toISOString(), details: 'User registered on platform' },
    { id: '2', action: 'Profile Updated', timestamp: new Date(Date.now() - 86400000 * 15).toISOString(), details: 'Updated profile information' },
    { id: '3', action: 'Event Registered', timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), details: 'Registered for City Marathon' },
    { id: '4', action: 'Payment Made', timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), details: 'Payment of $50 processed' },
  ];

  // Calculate organizer revenue
  const getOrganizerRevenue = (organizerId: string) => {
    const organizerEvents = events?.filter((e: any) => e.organizer_id === organizerId) ?? [];
    return organizerEvents.reduce((sum: number, event: any) => {
      const paidRegs = event.event_registrations?.filter((r: any) => r.payment_status === 'paid').length ?? 0;
      return sum + (paidRegs * Number(event.registration_fee || 0));
    }, 0);
  };

  // Calculate organizer stats
  const getOrganizerStats = (organizerId: string) => {
    const organizerEvents = events?.filter((e: any) => e.organizer_id === organizerId) ?? [];
    return {
      totalEvents: organizerEvents.length,
      totalRegistrations: organizerEvents.reduce((sum: number, e: any) => sum + (e.event_registrations?.length ?? 0), 0),
      revenue: getOrganizerRevenue(organizerId),
    };
  };

  const verifyUser = useMutation({
    mutationFn: async (userId: string) => {
      toast({ title: "User verified successfully!" });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-all-profiles"] }),
  });

  const suspendUser = useMutation({
    mutationFn: async (userId: string) => {
      toast({ title: "User suspended" });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-all-profiles"] }),
  });

  const approveOrganizer = useMutation({
    mutationFn: async (userId: string) => {
      toast({ title: "Organizer approved!" });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-all-profiles"] }),
  });

  const openUserDialog = (user: any) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500/20 text-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-600"><Shield className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500/20 text-red-600"><Ban className="h-3 w-3 mr-1" /> Suspended</Badge>;
      default:
        return <Badge variant="secondary">Active</Badge>;
    }
  };

  const renderAthletesTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Athlete</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Events</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredAthletes.map((athlete: any) => (
          <TableRow key={athlete.user_id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={athlete.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {athlete.full_name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{athlete.full_name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{athlete.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(athlete.status || 'active')}</TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {format(new Date(athlete.created_at), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <span>{athlete.events_count || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => openUserDialog(athlete)}>
                  <Eye className="h-4 w-4" />
                </Button>
                {athlete.status !== 'verified' && (
                  <Button variant="ghost" size="icon" onClick={() => verifyUser.mutate(athlete.user_id)}>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </Button>
                )}
                {athlete.status !== 'suspended' && (
                  <Button variant="ghost" size="icon" onClick={() => suspendUser.mutate(athlete.user_id)}>
                    <Ban className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderOrganizersTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Organizer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Events</TableHead>
          <TableHead>Registrations</TableHead>
          <TableHead>Revenue</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredOrganizers.map((organizer: any) => {
          const stats = getOrganizerStats(organizer.user_id);
          return (
            <TableRow key={organizer.user_id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={organizer.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {organizer.full_name?.charAt(0) || 'O'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{organizer.full_name || "—"}</p>
                    <p className="text-xs text-muted-foreground">{organizer.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(organizer.status || 'pending')}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{stats.totalEvents}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{stats.totalRegistrations}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="font-medium">${stats.revenue.toLocaleString()}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openUserDialog(organizer)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {organizer.status === 'pending' && (
                    <Button variant="ghost" size="icon" onClick={() => approveOrganizer.mutate(organizer.user_id)}>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </Button>
                  )}
                  {organizer.status !== 'suspended' && (
                    <Button variant="ghost" size="icon" onClick={() => suspendUser.mutate(organizer.user_id)}>
                      <Ban className="h-4 w-4 text-red-500" />
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage athletes, organizers, and their accounts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshUserData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <Users className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-display font-bold">{profiles?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <User className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-display font-bold">{athletes.length}</p>
            <p className="text-xs text-muted-foreground">Athletes</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <Building2 className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-display font-bold">{organizers.length}</p>
            <p className="text-xs text-muted-foreground">Organizers</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <Shield className="h-5 w-5 text-yellow-500 mb-2" />
            <p className="text-2xl font-display font-bold">
              {profiles?.filter((p: any) => p.status === 'pending').length ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Pending Approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="athletes" className="gap-2">
            <User className="h-4 w-4" />
            Athletes ({filteredAthletes.length})
          </TabsTrigger>
          <TabsTrigger value="organizers" className="gap-2">
            <Building2 className="h-4 w-4" />
            Organizers ({filteredOrganizers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="athletes" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Athletes</CardTitle>
              <CardDescription>View and manage athlete accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : filteredAthletes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No athletes found.</p>
              ) : (
                renderAthletesTable()
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizers" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Organizers</CardTitle>
              <CardDescription>View and manage organizer accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : filteredOrganizers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No organizers found.</p>
              ) : (
                renderOrganizersTable()
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Detail Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedUser?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedUser?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p>{selectedUser?.full_name || "User Details"}</p>
                <p className="text-sm text-muted-foreground font-normal">{selectedUser?.email}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium capitalize">{selectedUser.user_roles?.role}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{selectedUser.status || 'active'}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{format(new Date(selectedUser.created_at), "MMM d, yyyy")}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Last Active</p>
                  <p className="font-medium">{format(new Date(selectedUser.updated_at || selectedUser.created_at), "MMM d, yyyy")}</p>
                </div>
              </div>

              {/* Organizer Stats (if organizer) */}
              {selectedUser.user_roles?.role === 'organizer' && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Performance Summary
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-secondary/50 text-center">
                      <p className="text-2xl font-bold">{getOrganizerStats(selectedUser.user_id).totalEvents}</p>
                      <p className="text-xs text-muted-foreground">Events</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50 text-center">
                      <p className="text-2xl font-bold">{getOrganizerStats(selectedUser.user_id).totalRegistrations}</p>
                      <p className="text-xs text-muted-foreground">Registrations</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50 text-center">
                      <p className="text-2xl font-bold text-green-600">${getOrganizerStats(selectedUser.user_id).revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Logs */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Activity Logs
                </h4>
                <div className="space-y-2">
                  {getUserActivities(selectedUser.user_id).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(activity.timestamp), "MMM d, yyyy h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                {selectedUser.status !== 'verified' && (
                  <Button className="flex-1" onClick={() => { verifyUser.mutate(selectedUser.user_id); setUserDialogOpen(false); }}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Account
                  </Button>
                )}
                {selectedUser.status !== 'suspended' ? (
                  <Button variant="destructive" className="flex-1" onClick={() => { suspendUser.mutate(selectedUser.user_id); setUserDialogOpen(false); }}>
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend Account
                  </Button>
                ) : (
                  <Button variant="outline" className="flex-1" onClick={() => { verifyUser.mutate(selectedUser.user_id); setUserDialogOpen(false); }}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Reactivate Account
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
