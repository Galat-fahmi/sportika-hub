import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  Settings, 
  User, 
  Building2, 
  CreditCard, 
  Palette, 
  Shield, 
  Users as UsersIcon,
  Upload,
  Trash2,
  Plus,
  Edit3,
  CheckCircle,
  AlertCircle,
  Lock,
  Mail,
  Phone,
  Globe,
  MapPin
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar?: string;
  status: 'active' | 'pending';
}

const OrganizerSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile form state
  const [profile, setProfile] = useState({
    organizationName: "Sports Events Co.",
    contactName: "John Smith",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    website: "https://sportsevents.co",
    address: "123 Sports Ave, New York, NY 10001",
    bio: "Professional sports event management company with 10+ years of experience organizing tournaments and competitions.",
  });

  // Banking form state
  const [banking, setBanking] = useState({
    accountHolder: "Sports Events Co.",
    bankName: "Chase Bank",
    accountNumber: "****4567",
    routingNumber: "****8901",
    accountType: "business",
    paypalEmail: "payments@sportsevents.co",
    stripeConnected: true,
  });

  // Branding form state
  const [branding, setBranding] = useState({
    primaryColor: "#22c55e",
    logo: null as string | null,
    banner: null as string | null,
    customDomain: "events.sportsevents.co",
    emailSignature: "Best regards,\nSports Events Co. Team",
  });

  // Security form state
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    apiAccess: false,
  });

  // Mock team members
  const teamMembers: TeamMember[] = [
    { id: '1', name: 'John Smith', email: 'john@sportsevents.co', role: 'owner', status: 'active' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@sportsevents.co', role: 'admin', status: 'active' },
    { id: '3', name: 'Mike Davis', email: 'mike@sportsevents.co', role: 'editor', status: 'pending' },
  ];

  const { data: profileData } = useQuery({
    queryKey: ["organizer-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateProfile = useMutation({
    mutationFn: async () => {
      toast({ title: "Profile updated successfully!" });
    },
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["organizer-profile"] });
    },
  });

  const updateBanking = useMutation({
    mutationFn: async () => {
      toast({ title: "Banking details updated!" });
    },
  });

  const updateBranding = useMutation({
    mutationFn: async () => {
      toast({ title: "Branding settings saved!" });
    },
  });

  const handleLogoUpload = () => {
    fileInputRef.current?.click();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <Badge className="bg-primary/20 text-primary">Owner</Badge>;
      case 'admin':
        return <Badge className="bg-blue-500/20 text-blue-600">Admin</Badge>;
      case 'editor':
        return <Badge className="bg-yellow-500/20 text-yellow-600">Editor</Badge>;
      case 'viewer':
        return <Badge variant="secondary">Viewer</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-600"><AlertCircle className="h-3 w-3 mr-1" /> Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your organizer profile, banking, and team settings.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="profile" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="banking" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Banking</span>
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Branding</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Organization Profile
                </CardTitle>
                <CardDescription>Manage your organization details and contact information</CardDescription>
              </div>
              <Button 
                variant={isEditing ? "default" : "outline"}
                onClick={() => isEditing ? updateProfile.mutate() : setIsEditing(true)}
              >
                {isEditing ? (
                  <><CheckCircle className="h-4 w-4 mr-2" /> Save Changes</>
                ) : (
                  <><Edit3 className="h-4 w-4 mr-2" /> Edit Profile</>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={branding.logo || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {profile.organizationName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleLogoUpload}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setBranding({ ...branding, logo: e.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Organization Name</Label>
                  <Input
                    value={profile.organizationName}
                    onChange={(e) => setProfile({ ...profile, organizationName: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Contact Person</Label>
                  <Input
                    value={profile.contactName}
                    onChange={(e) => setProfile({ ...profile, contactName: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </Label>
                  <Input
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Organization Bio</Label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banking Tab */}
        <TabsContent value="banking" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payout Details
              </CardTitle>
              <CardDescription>Manage your bank account for receiving payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Connected Payment Methods */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-secondary/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Stripe</p>
                          <p className="text-sm text-muted-foreground">Connected</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-600">Active</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">PayPal</p>
                          <p className="text-sm text-muted-foreground">{banking.paypalEmail}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Bank Account Details */}
              <div className="space-y-4">
                <h4 className="font-medium">Bank Account</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Account Holder Name</Label>
                    <Input
                      value={banking.accountHolder}
                      onChange={(e) => setBanking({ ...banking, accountHolder: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Bank Name</Label>
                    <Input
                      value={banking.bankName}
                      onChange={(e) => setBanking({ ...banking, bankName: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Account Number</Label>
                    <Input
                      value={banking.accountNumber}
                      onChange={(e) => setBanking({ ...banking, accountNumber: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Routing Number</Label>
                    <Input
                      value={banking.routingNumber}
                      onChange={(e) => setBanking({ ...banking, routingNumber: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => updateBanking.mutate()}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Banking Details
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Branding Customization
              </CardTitle>
              <CardDescription>Customize your event pages and communications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Color */}
              <div>
                <Label>Primary Brand Color</Label>
                <div className="flex items-center gap-4 mt-1">
                  <input
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                    className="w-12 h-12 rounded cursor-pointer"
                  />
                  <Input
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                    className="w-32"
                  />
                </div>
              </div>

              {/* Custom Domain */}
              <div>
                <Label>Custom Domain</Label>
                <Input
                  value={branding.customDomain}
                  onChange={(e) => setBranding({ ...branding, customDomain: e.target.value })}
                  className="mt-1"
                  placeholder="events.yourdomain.com"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your events will be accessible at this domain
                </p>
              </div>

              {/* Email Signature */}
              <div>
                <Label>Email Signature</Label>
                <Textarea
                  value={branding.emailSignature}
                  onChange={(e) => setBranding({ ...branding, emailSignature: e.target.value })}
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <Button onClick={() => updateBranding.mutate()}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Branding Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Security Settings */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>
                <Switch
                  checked={security.twoFactorEnabled}
                  onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Login Notifications</p>
                    <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                  </div>
                </div>
                <Switch
                  checked={security.loginNotifications}
                  onCheckedChange={(checked) => setSecurity({ ...security, loginNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">API Access</p>
                    <p className="text-sm text-muted-foreground">Enable API for integrations</p>
                  </div>
                </div>
                <Switch
                  checked={security.apiAccess}
                  onCheckedChange={(checked) => setSecurity({ ...security, apiAccess: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Team Management */}
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5 text-primary" />
                  Team Members
                </CardTitle>
                <CardDescription>Manage access for your team</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getRoleBadge(member.role)}
                      {getStatusBadge(member.status)}
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizerSettings;