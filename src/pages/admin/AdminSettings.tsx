import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { 
  Settings, 
  Globe, 
  Palette, 
  Mail, 
  Bell, 
  Shield, 
  CheckCircle,
  Save,
  Upload,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Key,
  FileText,
  Image,
  Languages,
  RefreshCw,
  Clock
} from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
}

interface NotificationRule {
  id: string;
  event: string;
  channels: ('email' | 'push' | 'sms')[];
  recipients: ('user' | 'admin' | 'organizer')[];
  enabled: boolean;
}

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [showApiKey, setShowApiKey] = useState(false);

  // Global platform settings
  const [platformSettings, setPlatformSettings] = useState({
    platformName: "Sportika",
    platformUrl: "https://sportika.app",
    supportEmail: "support@sportika.app",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    language: "en",
    maintenanceMode: false,
    userRegistration: true,
    organizerRegistration: true,
  });

  // Branding settings
  const [brandingSettings, setBrandingSettings] = useState({
    primaryColor: "#22c55e",
    secondaryColor: "#3b82f6",
    logo: null as string | null,
    favicon: null as string | null,
    customCss: "",
    emailHeaderImage: null as string | null,
    emailFooterText: "© 2024 Sportika. All rights reserved.",
  });

  // Email templates
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([
    {
      id: 'welcome',
      name: 'Welcome Email',
      subject: 'Welcome to Sportika!',
      category: 'User',
      content: `Hi {{name}},

Welcome to Sportika! We're excited to have you join our community of athletes and sports enthusiasts.

Get started by:
• Completing your profile
• Exploring upcoming events
• Registering for your first competition

Best regards,
The Sportika Team`,
    },
    {
      id: 'event-confirmation',
      name: 'Event Registration Confirmation',
      subject: 'You\'re registered for {{event_name}}!',
      category: 'Events',
      content: `Hi {{name}},

Your registration for {{event_name}} has been confirmed.

Event Details:
Date: {{event_date}}
Location: {{event_location}}
Registration Fee: {{amount}}

We look forward to seeing you there!

Best regards,
The Sportika Team`,
    },
    {
      id: 'password-reset',
      name: 'Password Reset',
      subject: 'Reset your Sportika password',
      category: 'Security',
      content: `Hi {{name}},

You requested to reset your password. Click the link below to set a new password:

{{reset_link}}

This link will expire in 24 hours.

If you didn't request this, please ignore this email.

Best regards,
The Sportika Team`,
    },
    {
      id: 'payout-notification',
      name: 'Payout Processed',
      subject: 'Your payout has been processed',
      category: 'Finance',
      content: `Hi {{name}},

Your payout of {{amount}} has been processed and will arrive in your account within 3-5 business days.

Payout Details:
Amount: {{amount}}
Method: {{payout_method}}
Reference: {{reference_id}}

Best regards,
The Sportika Team`,
    },
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  // Notification rules
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([
    { id: '1', event: 'User Registration', channels: ['email'], recipients: ['user', 'admin'], enabled: true },
    { id: '2', event: 'Event Registration', channels: ['email', 'push'], recipients: ['user', 'organizer'], enabled: true },
    { id: '3', event: 'Payment Received', channels: ['email'], recipients: ['user', 'organizer'], enabled: true },
    { id: '4', event: 'Event Reminder (24h)', channels: ['email', 'push'], recipients: ['user'], enabled: true },
    { id: '5', event: 'Payout Processed', channels: ['email'], recipients: ['organizer'], enabled: true },
    { id: '6', event: 'Account Suspicious Activity', channels: ['email', 'sms'], recipients: ['user', 'admin'], enabled: true },
    { id: '7', event: 'New Event Created', channels: ['push'], recipients: ['admin'], enabled: true },
    { id: '8', event: 'Refund Processed', channels: ['email'], recipients: ['user'], enabled: true },
  ]);

  // Security policies
  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: true,
    requireStrongPasswords: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordExpiryDays: 90,
    apiKey: "sk_live_51HYs0jJ9...",
    webhookSecret: "whsec_...",
    enableAuditLogs: true,
    dataRetentionDays: 365,
  });

  const saveSettings = useMutation({
    mutationFn: async () => {
      toast({ title: "Settings saved successfully!" });
    },
  });

  const regenerateApiKey = useMutation({
    mutationFn: async () => {
      toast({ title: "API key regenerated!", description: "Make sure to update your integrations" });
    },
  });

  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Badge variant="secondary" className="gap-1"><Mail className="h-3 w-3" /> Email</Badge>;
      case 'push':
        return <Badge variant="secondary" className="gap-1"><Bell className="h-3 w-3" /> Push</Badge>;
      case 'sms':
        return <Badge variant="secondary" className="gap-1"><Smartphone className="h-3 w-3" /> SMS</Badge>;
      default:
        return <Badge variant="secondary">{channel}</Badge>;
    }
  };

  const getRecipientBadge = (recipient: string) => {
    switch (recipient) {
      case 'user':
        return <Badge className="bg-blue-500/20 text-blue-600">User</Badge>;
      case 'admin':
        return <Badge className="bg-purple-500/20 text-purple-600">Admin</Badge>;
      case 'organizer':
        return <Badge className="bg-green-500/20 text-green-600">Organizer</Badge>;
      default:
        return <Badge variant="secondary">{recipient}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Platform Settings</h1>
        <p className="text-muted-foreground mt-1">Configure global platform settings, branding, and policies.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-3xl grid-cols-5">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="emails" className="gap-2">
            <Mail className="h-4 w-4" />
            Emails
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Global Platform Settings
              </CardTitle>
              <CardDescription>Configure basic platform information and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Platform Name</Label>
                  <Input
                    value={platformSettings.platformName}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, platformName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Platform URL</Label>
                  <Input
                    value={platformSettings.platformUrl}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, platformUrl: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Support Email</Label>
                  <Input
                    type="email"
                    value={platformSettings.supportEmail}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Default Timezone</Label>
                  <Select 
                    value={platformSettings.timezone} 
                    onValueChange={(v) => setPlatformSettings({ ...platformSettings, timezone: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date Format</Label>
                  <Select 
                    value={platformSettings.dateFormat} 
                    onValueChange={(v) => setPlatformSettings({ ...platformSettings, dateFormat: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Default Language</Label>
                  <Select 
                    value={platformSettings.language} 
                    onValueChange={(v) => setPlatformSettings({ ...platformSettings, language: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div>
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Temporarily disable access to the platform</p>
                  </div>
                  <Switch
                    checked={platformSettings.maintenanceMode}
                    onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, maintenanceMode: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div>
                    <Label className="text-base">User Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new user accounts to be created</p>
                  </div>
                  <Switch
                    checked={platformSettings.userRegistration}
                    onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, userRegistration: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div>
                    <Label className="text-base">Organizer Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new organizers to sign up</p>
                  </div>
                  <Switch
                    checked={platformSettings.organizerRegistration}
                    onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, organizerRegistration: checked })}
                  />
                </div>
              </div>

              <Button onClick={() => saveSettings.mutate()}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Settings */}
        <TabsContent value="branding" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Branding Control
              </CardTitle>
              <CardDescription>Customize the platform appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Primary Brand Color</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <input
                      type="color"
                      value={brandingSettings.primaryColor}
                      onChange={(e) => setBrandingSettings({ ...brandingSettings, primaryColor: e.target.value })}
                      className="w-12 h-12 rounded cursor-pointer"
                    />
                    <Input
                      value={brandingSettings.primaryColor}
                      onChange={(e) => setBrandingSettings({ ...brandingSettings, primaryColor: e.target.value })}
                      className="w-32"
                    />
                  </div>
                </div>
                <div>
                  <Label>Secondary Brand Color</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <input
                      type="color"
                      value={brandingSettings.secondaryColor}
                      onChange={(e) => setBrandingSettings({ ...brandingSettings, secondaryColor: e.target.value })}
                      className="w-12 h-12 rounded cursor-pointer"
                    />
                    <Input
                      value={brandingSettings.secondaryColor}
                      onChange={(e) => setBrandingSettings({ ...brandingSettings, secondaryColor: e.target.value })}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Platform Logo
                  </Label>
                  <div className="mt-2 p-4 border-2 border-dashed border-border rounded-lg text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">SVG, PNG, JPG (max. 2MB)</p>
                  </div>
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Favicon
                  </Label>
                  <div className="mt-2 p-4 border-2 border-dashed border-border rounded-lg text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">ICO, PNG (32x32px)</p>
                  </div>
                </div>
              </div>

              <div>
                <Label>Email Footer Text</Label>
                <Input
                  value={brandingSettings.emailFooterText}
                  onChange={(e) => setBrandingSettings({ ...brandingSettings, emailFooterText: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Custom CSS (Advanced)</Label>
                <Textarea
                  value={brandingSettings.customCss}
                  onChange={(e) => setBrandingSettings({ ...brandingSettings, customCss: e.target.value })}
                  placeholder="/* Add your custom CSS here */"
                  className="mt-1 min-h-[150px] font-mono text-sm"
                />
              </div>

              <Button onClick={() => saveSettings.mutate()}>
                <Save className="h-4 w-4 mr-2" />
                Save Branding
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Templates */}
        <TabsContent value="emails" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Email Templates
              </CardTitle>
              <CardDescription>Customize email content sent to users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Template List */}
                <div className="space-y-2">
                  {emailTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedTemplate?.id === template.id ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/50 hover:bg-secondary'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.category}</p>
                    </div>
                  ))}
                </div>

                {/* Template Editor */}
                <div className="lg:col-span-2 space-y-4">
                  {selectedTemplate ? (
                    <>
                      <div>
                        <Label>Template Name</Label>
                        <Input
                          value={selectedTemplate.name}
                          onChange={(e) => {
                            const updated = { ...selectedTemplate, name: e.target.value };
                            setSelectedTemplate(updated);
                            setEmailTemplates(emailTemplates.map(t => t.id === updated.id ? updated : t));
                          }}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Email Subject</Label>
                        <Input
                          value={selectedTemplate.subject}
                          onChange={(e) => {
                            const updated = { ...selectedTemplate, subject: e.target.value };
                            setSelectedTemplate(updated);
                            setEmailTemplates(emailTemplates.map(t => t.id === updated.id ? updated : t));
                          }}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Email Content</Label>
                        <Textarea
                          value={selectedTemplate.content}
                          onChange={(e) => {
                            const updated = { ...selectedTemplate, content: e.target.value };
                            setSelectedTemplate(updated);
                            setEmailTemplates(emailTemplates.map(t => t.id === updated.id ? updated : t));
                          }}
                          className="mt-1 min-h-[300px]"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Use {'{{variable_name}}'} for dynamic content
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => saveSettings.mutate()}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Template
                        </Button>
                        <Button variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Test
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Select a template to edit</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Rules */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Rules
              </CardTitle>
              <CardDescription>Configure when and how notifications are sent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationRules.map((rule) => (
                  <div key={rule.id} className="p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{rule.event}</span>
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(checked) => {
                            setNotificationRules(notificationRules.map(r => 
                              r.id === rule.id ? { ...r, enabled: checked } : r
                            ));
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Channels</p>
                        <div className="flex flex-wrap gap-2">
                          {['email', 'push', 'sms'].map((channel) => (
                            <label key={channel} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={rule.channels.includes(channel as any)}
                                onChange={(e) => {
                                  const newChannels = e.target.checked
                                    ? [...rule.channels, channel]
                                    : rule.channels.filter(c => c !== channel);
                                  setNotificationRules(notificationRules.map(r => 
                                    r.id === rule.id ? { ...r, channels: newChannels as any } : r
                                  ));
                                }}
                                className="rounded"
                              />
                              {getChannelBadge(channel)}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Recipients</p>
                        <div className="flex flex-wrap gap-2">
                          {rule.recipients.map((recipient) => getRecipientBadge(recipient))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4" onClick={() => saveSettings.mutate()}>
                <Save className="h-4 w-4 mr-2" />
                Save Notification Rules
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Policies */}
        <TabsContent value="security" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Policies
              </CardTitle>
              <CardDescription>Configure platform security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div>
                    <Label className="text-base">Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">Users must verify email before accessing platform</p>
                  </div>
                  <Switch
                    checked={securitySettings.requireEmailVerification}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, requireEmailVerification: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div>
                    <Label className="text-base">Require Strong Passwords</Label>
                    <p className="text-sm text-muted-foreground">Enforce password complexity requirements</p>
                  </div>
                  <Switch
                    checked={securitySettings.requireStrongPasswords}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, requireStrongPasswords: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div>
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div>
                    <Label className="text-base">Enable Audit Logs</Label>
                    <p className="text-sm text-muted-foreground">Log all administrative actions</p>
                  </div>
                  <Switch
                    checked={securitySettings.enableAuditLogs}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, enableAuditLogs: checked })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Max Login Attempts</Label>
                  <Input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Password Expiry (days)</Label>
                  <Input
                    type="number"
                    value={securitySettings.passwordExpiryDays}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiryDays: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Data Retention (days)</Label>
                  <Input
                    type="number"
                    value={securitySettings.dataRetentionDays}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, dataRetentionDays: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* API Keys */}
              <div className="p-4 rounded-lg bg-secondary/50">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  API Keys
                </h4>
                <div className="space-y-4">
                  <div>
                    <Label>Live API Key</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        value={securitySettings.apiKey}
                        readOnly
                        className="font-mono"
                      />
                      <Button variant="outline" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" onClick={() => regenerateApiKey.mutate()}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Webhook Secret</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="password"
                        value={securitySettings.webhookSecret}
                        readOnly
                        className="font-mono"
                      />
                      <Button variant="outline" size="icon" onClick={() => {}}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={() => saveSettings.mutate()}>
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;