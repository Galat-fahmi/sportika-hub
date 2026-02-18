import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { 
  Shield, 
  User, 
  Building2, 
  Crown, 
  Star,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  Plus,
  Search,
  History,
  Lock,
  Eye,
  FileEdit,
  Settings,
  Users,
  Calendar,
  DollarSign,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: string[];
  userCount: number;
}

interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  performedByName: string;
  targetUser: string;
  targetUserName: string;
  oldRole: string;
  newRole: string;
  timestamp: string;
  reason: string;
}

const AdminRoles = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("roles");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedNewRole, setSelectedNewRole] = useState<string>("");

  // Define all permissions
  const permissions: Permission[] = [
    // User Management
    { id: 'users.view', name: 'View Users', description: 'View user profiles and lists', category: 'Users' },
    { id: 'users.create', name: 'Create Users', description: 'Create new user accounts', category: 'Users' },
    { id: 'users.edit', name: 'Edit Users', description: 'Modify user information', category: 'Users' },
    { id: 'users.delete', name: 'Delete Users', description: 'Remove user accounts', category: 'Users' },
    { id: 'users.verify', name: 'Verify Users', description: 'Verify athlete/organizer accounts', category: 'Users' },
    { id: 'users.suspend', name: 'Suspend Users', description: 'Suspend or ban user accounts', category: 'Users' },
    
    // Event Management
    { id: 'events.view', name: 'View Events', description: 'View all events', category: 'Events' },
    { id: 'events.create', name: 'Create Events', description: 'Create new events', category: 'Events' },
    { id: 'events.edit', name: 'Edit Events', description: 'Modify event details', category: 'Events' },
    { id: 'events.delete', name: 'Delete Events', description: 'Remove events', category: 'Events' },
    { id: 'events.approve', name: 'Approve Events', description: 'Approve pending events', category: 'Events' },
    
    // Registration Management
    { id: 'registrations.view', name: 'View Registrations', description: 'View event registrations', category: 'Registrations' },
    { id: 'registrations.manage', name: 'Manage Registrations', description: 'Approve/reject registrations', category: 'Registrations' },
    
    // Financial
    { id: 'payments.view', name: 'View Payments', description: 'View payment transactions', category: 'Financial' },
    { id: 'payments.refund', name: 'Process Refunds', description: 'Issue refunds to users', category: 'Financial' },
    { id: 'revenue.view', name: 'View Revenue', description: 'View platform revenue', category: 'Financial' },
    
    // Analytics
    { id: 'analytics.view', name: 'View Analytics', description: 'Access analytics dashboard', category: 'Analytics' },
    { id: 'analytics.export', name: 'Export Data', description: 'Export analytics reports', category: 'Analytics' },
    
    // System
    { id: 'settings.view', name: 'View Settings', description: 'View system settings', category: 'System' },
    { id: 'settings.edit', name: 'Edit Settings', description: 'Modify system settings', category: 'System' },
    { id: 'roles.manage', name: 'Manage Roles', description: 'Create and edit roles', category: 'System' },
    { id: 'logs.view', name: 'View Audit Logs', description: 'Access system audit logs', category: 'System' },
  ];

  // Define roles
  const roles: Role[] = [
    {
      id: 'athlete',
      name: 'Athlete',
      description: 'Standard user who can register for events and view their profile',
      color: 'bg-blue-500',
      permissions: ['events.view', 'registrations.view'],
      userCount: 1245,
    },
    {
      id: 'organizer',
      name: 'Organizer',
      description: 'Can create and manage events, view registrations, and access revenue data',
      color: 'bg-green-500',
      permissions: ['events.view', 'events.create', 'events.edit', 'events.delete', 'registrations.view', 'registrations.manage', 'payments.view', 'revenue.view', 'analytics.view'],
      userCount: 89,
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Full access to user management, event approval, and platform analytics',
      color: 'bg-purple-500',
      permissions: ['users.view', 'users.verify', 'users.suspend', 'events.view', 'events.approve', 'events.delete', 'registrations.view', 'registrations.manage', 'payments.view', 'payments.refund', 'revenue.view', 'analytics.view', 'analytics.export', 'settings.view', 'logs.view'],
      userCount: 5,
    },
    {
      id: 'super_admin',
      name: 'Super Admin',
      description: 'Complete system access including role management and system settings',
      color: 'bg-red-500',
      permissions: permissions.map(p => p.id), // All permissions
      userCount: 1,
    },
  ];

  // Fetch users with roles
  const { data: users } = useQuery({
    queryKey: ["admin-role-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, user_roles(role)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Mock audit logs
  const auditLogs: AuditLog[] = [
    {
      id: '1',
      action: 'Role Assigned',
      performedBy: 'admin-1',
      performedByName: 'Super Admin',
      targetUser: 'user-123',
      targetUserName: 'John Smith',
      oldRole: 'Athlete',
      newRole: 'Organizer',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      reason: 'User requested to become an organizer',
    },
    {
      id: '2',
      action: 'Role Revoked',
      performedBy: 'admin-1',
      performedByName: 'Super Admin',
      targetUser: 'user-456',
      targetUserName: 'Jane Doe',
      oldRole: 'Organizer',
      newRole: 'Athlete',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      reason: 'Violation of terms of service',
    },
    {
      id: '3',
      action: 'Permissions Updated',
      performedBy: 'admin-1',
      performedByName: 'Super Admin',
      targetUser: 'role-admin',
      targetUserName: 'Admin Role',
      oldRole: 'Admin',
      newRole: 'Admin',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      reason: 'Added refund permissions',
    },
  ];

  const assignRole = useMutation({
    mutationFn: async () => {
      toast({ 
        title: "Role assigned successfully!", 
        description: `User is now ${selectedNewRole}` 
      });
    },
    onSuccess: () => {
      setAssignDialogOpen(false);
      setSelectedUser("");
      setSelectedNewRole("");
      queryClient.invalidateQueries({ queryKey: ["admin-role-users"] });
    },
  });

  const updateRolePermissions = useMutation({
    mutationFn: async ({ roleId, permissions }: { roleId: string; permissions: string[] }) => {
      toast({ title: "Role permissions updated!" });
    },
    onSuccess: () => {
      setRoleDialogOpen(false);
      setSelectedRole(null);
    },
  });

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'athlete':
        return <User className="h-5 w-5" />;
      case 'organizer':
        return <Building2 className="h-5 w-5" />;
      case 'admin':
        return <Shield className="h-5 w-5" />;
      case 'super_admin':
        return <Crown className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  const getPermissionIcon = (permissionId: string) => {
    if (permissionId.includes('users')) return <Users className="h-4 w-4" />;
    if (permissionId.includes('events')) return <Calendar className="h-4 w-4" />;
    if (permissionId.includes('payment') || permissionId.includes('revenue')) return <DollarSign className="h-4 w-4" />;
    if (permissionId.includes('analytics')) return <BarChart3 className="h-4 w-4" />;
    if (permissionId.includes('settings') || permissionId.includes('roles')) return <Settings className="h-4 w-4" />;
    return <Lock className="h-4 w-4" />;
  };

  const filteredUsers = users?.filter((user: any) => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group permissions by category
  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Role & Permission Control</h1>
        <p className="text-muted-foreground mt-1">Manage RBAC, access levels, and audit logs.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {roles.map((role) => (
          <Card key={role.id} className="glass">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-full ${role.color} bg-opacity-20 flex items-center justify-center mb-3`}>
                <div className={role.color.replace('bg-', 'text-')}>
                  {getRoleIcon(role.name)}
                </div>
              </div>
              <p className="text-2xl font-display font-bold">{role.userCount}</p>
              <p className="text-sm text-muted-foreground">{role.name}s</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="assign" className="gap-2">
            <Users className="h-4 w-4" />
            Assign Roles
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <History className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roles.map((role) => (
              <Card key={role.id} className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${role.color} bg-opacity-20 flex items-center justify-center`}>
                        <div className={role.color.replace('bg-', 'text-')}>
                          {getRoleIcon(role.name)}
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <CardDescription>{role.userCount} users</CardDescription>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => { setSelectedRole(role); setRoleDialogOpen(true); }}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Key Permissions:</p>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.slice(0, 5).map((permId) => {
                        const perm = permissions.find(p => p.id === permId);
                        return perm ? (
                          <Badge key={permId} variant="secondary" className="text-xs">
                            {perm.name}
                          </Badge>
                        ) : null;
                      })}
                      {role.permissions.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Assign Roles Tab */}
        <TabsContent value="assign" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Assign Roles to Users</CardTitle>
              <CardDescription>Search and select users to assign or change their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={() => setAssignDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Role
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.map((user: any) => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {user.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.full_name || "—"}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            user.user_roles?.role === 'super_admin' ? 'bg-red-500/20 text-red-600' :
                            user.user_roles?.role === 'admin' ? 'bg-purple-500/20 text-purple-600' :
                            user.user_roles?.role === 'organizer' ? 'bg-green-500/20 text-green-600' :
                            'bg-blue-500/20 text-blue-600'
                          }
                        >
                          {user.user_roles?.role || 'athlete'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(user.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => { setSelectedUser(user.user_id); setAssignDialogOpen(true); }}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Change Role
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Role Assignment Audit Logs
              </CardTitle>
              <CardDescription>Track all role changes and permission updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <History className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{log.action}</span>
                        <span className="text-muted-foreground">by</span>
                        <span className="font-medium">{log.performedByName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Target:</span>
                        <span className="font-medium">{log.targetUserName}</span>
                        {log.oldRole !== log.newRole && (
                          <>
                            <span className="text-muted-foreground">changed from</span>
                            <Badge variant="outline">{log.oldRole}</Badge>
                            <span className="text-muted-foreground">to</span>
                            <Badge variant="default">{log.newRole}</Badge>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Reason: {log.reason}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(log.timestamp), "MMM d, yyyy h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRole && getRoleIcon(selectedRole.name)}
              Edit Role: {selectedRole?.name}
            </DialogTitle>
            <DialogDescription>
              Manage permissions for this role
            </DialogDescription>
          </DialogHeader>
          
          {selectedRole && (
            <div className="space-y-6">
              <div>
                <Label>Role Description</Label>
                <Input 
                  value={selectedRole.description} 
                  className="mt-1"
                  readOnly
                />
              </div>

              <div>
                <Label className="text-base">Permissions</Label>
                <div className="space-y-4 mt-3">
                  {Object.entries(permissionsByCategory).map(([category, perms]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {perms.map((permission) => (
                          <div 
                            key={permission.id} 
                            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                          >
                            <div className="flex items-center gap-3">
                              {getPermissionIcon(permission.id)}
                              <div>
                                <p className="font-medium text-sm">{permission.name}</p>
                                <p className="text-xs text-muted-foreground">{permission.description}</p>
                              </div>
                            </div>
                            <Switch 
                              checked={selectedRole.permissions.includes(permission.id)}
                              onCheckedChange={(checked) => {
                                const newPerms = checked 
                                  ? [...selectedRole.permissions, permission.id]
                                  : selectedRole.permissions.filter(p => p !== permission.id);
                                setSelectedRole({ ...selectedRole, permissions: newPerms });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  className="flex-1"
                  onClick={() => updateRolePermissions.mutate({ roleId: selectedRole.id, permissions: selectedRole.permissions })}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Role Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Select a user and assign them a new role
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Select User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((user: any) => (
                    <SelectItem key={user.user_id} value={user.user_id}>
                      {user.full_name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Select Role</Label>
              <Select value={selectedNewRole} onValueChange={setSelectedNewRole}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(role.name)}
                        {role.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                className="flex-1"
                onClick={() => assignRole.mutate()}
                disabled={!selectedUser || !selectedNewRole}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Assign Role
              </Button>
              <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRoles;