import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  Settings, 
  Shield, 
  Eye, 
  Bell, 
  Trash2, 
  AlertTriangle,
  Lock,
  Smartphone,
  Mail,
  Key,
  Fingerprint,
  History,
  Globe,
  Moon,
  LogOut,
  ChevronRight,
  CheckCircle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AthleteSettings = () => {
  const { signOut } = useAuth();
  const [settings, setSettings] = useState({
    // Security
    twoFactorAuth: false,
    biometricLogin: false,
    loginNotifications: true,
    
    // Privacy
    publicProfile: true,
    showResults: true,
    showRankings: true,
    allowTagging: true,
    dataSharing: false,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    
    // Preferences
    darkMode: false,
    language: 'en',
    timezone: 'UTC',
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast({ title: "Setting updated", description: "Your preference has been saved." });
  };

  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    toast({ 
      title: "Account deletion requested", 
      description: "Your account will be deleted within 30 days.",
      variant: "destructive"
    });
  };

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    description, 
    checked, 
    onChange,
    action
  }: { 
    icon: any, 
    title: string, 
    description: string, 
    checked?: boolean, 
    onChange?: () => void,
    action?: React.ReactNode
  }) => (
    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {onChange !== undefined ? (
        <Switch checked={checked} onCheckedChange={onChange} />
      ) : action}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      {/* Security Settings */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-primary" /> Security Settings
          </CardTitle>
          <CardDescription>Protect your account with advanced security features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingItem
            icon={Lock}
            title="Change Password"
            description="Update your password regularly for better security"
            action={
              <Button variant="outline" size="sm">
                Update <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            }
          />
          <SettingItem
            icon={Key}
            title="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            checked={settings.twoFactorAuth}
            onChange={() => handleToggle('twoFactorAuth')}
          />
          <SettingItem
            icon={Fingerprint}
            title="Biometric Login"
            description="Use fingerprint or face recognition to login"
            checked={settings.biometricLogin}
            onChange={() => handleToggle('biometricLogin')}
          />
          <SettingItem
            icon={History}
            title="Login Notifications"
            description="Get notified when someone logs into your account"
            checked={settings.loginNotifications}
            onChange={() => handleToggle('loginNotifications')}
          />
          <Separator />
          <div className="p-4 rounded-lg bg-secondary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Active Sessions</p>
                  <p className="text-sm text-muted-foreground">2 devices currently logged in</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Controls */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5 text-primary" /> Privacy Controls
          </CardTitle>
          <CardDescription>Control who can see your information and activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingItem
            icon={Globe}
            title="Public Profile"
            description="Make your profile visible to other athletes and organizers"
            checked={settings.publicProfile}
            onChange={() => handleToggle('publicProfile')}
          />
          <SettingItem
            icon={CheckCircle}
            title="Show Results"
            description="Display your competition results on your public profile"
            checked={settings.showResults}
            onChange={() => handleToggle('showResults')}
          />
          <SettingItem
            icon={Shield}
            title="Show Rankings"
            description="Display your rankings on leaderboards"
            checked={settings.showRankings}
            onChange={() => handleToggle('showRankings')}
          />
          <SettingItem
            icon={Mail}
            title="Allow Tagging"
            description="Allow others to tag you in photos and posts"
            checked={settings.allowTagging}
            onChange={() => handleToggle('allowTagging')}
          />
          <SettingItem
            icon={Eye}
            title="Data Sharing"
            description="Share anonymized data to improve the platform"
            checked={settings.dataSharing}
            onChange={() => handleToggle('dataSharing')}
          />
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-primary" /> Notification Preferences
          </CardTitle>
          <CardDescription>Choose how you want to be notified</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-secondary/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <Switch 
                    checked={settings.emailNotifications} 
                    onCheckedChange={() => handleToggle('emailNotifications')} 
                  />
                </div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <Switch 
                    checked={settings.pushNotifications} 
                    onCheckedChange={() => handleToggle('pushNotifications')} 
                  />
                </div>
                <p className="font-medium">Push</p>
                <p className="text-sm text-muted-foreground">Receive push notifications</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <Switch 
                    checked={settings.smsNotifications} 
                    onCheckedChange={() => handleToggle('smsNotifications')} 
                  />
                </div>
                <p className="font-medium">SMS</p>
                <p className="text-sm text-muted-foreground">Receive text messages</p>
              </CardContent>
            </Card>
          </div>
          <Separator />
          <SettingItem
            icon={Mail}
            title="Marketing Emails"
            description="Receive updates about new features and promotions"
            checked={settings.marketingEmails}
            onChange={() => handleToggle('marketingEmails')}
          />
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-primary" /> Preferences
          </CardTitle>
          <CardDescription>Customize your app experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingItem
            icon={Moon}
            title="Dark Mode"
            description="Switch between light and dark theme"
            checked={settings.darkMode}
            onChange={() => handleToggle('darkMode')}
          />
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Language</p>
                <p className="text-sm text-muted-foreground">Choose your preferred language</p>
              </div>
            </div>
            <select 
              value={settings.language}
              onChange={(e) => {
                setSettings(prev => ({ ...prev, language: e.target.value }));
                toast({ title: "Language updated" });
              }}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Timezone</p>
                <p className="text-sm text-muted-foreground">Set your local timezone</p>
              </div>
            </div>
            <select 
              value={settings.timezone}
              onChange={(e) => {
                setSettings(prev => ({ ...prev, timezone: e.target.value }));
                toast({ title: "Timezone updated" });
              }}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="CST">Central Time</option>
              <option value="PST">Pacific Time</option>
              <option value="GMT">GMT</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="glass border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-destructive">
            <AlertTriangle className="h-5 w-5" /> Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions for your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10">
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-muted-foreground">Sign out from all devices</p>
              </div>
            </div>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10">
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-destructive">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers including:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Your profile information</li>
                      <li>All competition results</li>
                      <li>Event registrations</li>
                      <li>Achievements and certificates</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, Delete My Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Sportika Athlete Dashboard v1.0.0</p>
        <p className="mt-1">
          <Button variant="link" size="sm" className="h-auto p-0">Terms of Service</Button>
          {' · '}
          <Button variant="link" size="sm" className="h-auto p-0">Privacy Policy</Button>
          {' · '}
          <Button variant="link" size="sm" className="h-auto p-0">Help Center</Button>
        </p>
      </div>
    </div>
  );
};

export default AthleteSettings;