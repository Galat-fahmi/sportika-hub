import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  User, 
  Camera, 
  MapPin, 
  Calendar, 
  Trophy, 
  Globe, 
  Instagram, 
  Twitter, 
  Facebook, 
  Link as LinkIcon, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  X
} from "lucide-react";

const AthleteProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Form states
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [age, setAge] = useState<string>("");
  const [sport, setSport] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialTwitter, setSocialTwitter] = useState("");
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialWebsite, setSocialWebsite] = useState("");
  const [uploading, setUploading] = useState(false);

  // Sync form state when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setAvatarUrl(profile.avatar_url ?? "");
      setAge(profile.age?.toString() ?? "");
      setSport(profile.sport ?? "");
      setCountry(profile.country ?? "");
      setBio(profile.bio ?? "");
      setSocialInstagram(profile.social_instagram ?? "");
      setSocialTwitter(profile.social_twitter ?? "");
      setSocialFacebook(profile.social_facebook ?? "");
      setSocialWebsite(profile.social_website ?? "");
    }
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          full_name: fullName, 
          avatar_url: avatarUrl,
          age: age ? parseInt(age) : null,
          sport: sport || null,
          country: country || null,
          bio: bio || null,
          social_instagram: socialInstagram || null,
          social_twitter: socialTwitter || null,
          social_facebook: socialFacebook || null,
          social_website: socialWebsite || null,
        })
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast({ title: "Profile updated successfully!" });
    },
    onError: () => toast({ title: "Failed to update profile", variant: "destructive" }),
  });

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      
      // Auto-save the avatar URL to profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("user_id", user!.id);
      
      if (updateError) throw updateError;
      
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast({ title: "Photo uploaded and saved!" });
    } catch (error) {
      toast({ title: "Failed to upload photo", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const getVerificationBadge = () => {
    const status = profile?.verification_status || 'unverified';
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <AlertCircle className="h-3 w-3 mr-1" />
            Unverified
          </Badge>
        );
    }
  };

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-8">
      {/* Header Section - Full Width */}
      <div className="px-2 lg:px-4">
        <div className="py-6 border-b border-border/50">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your personal information and settings.</p>
        </div>
      </div>

      {/* Profile Photo & Basic Info - Full Width */}
      <div className="px-2 lg:px-4">
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
              <Camera className="h-6 w-6 text-primary" /> Profile Photo
            </CardTitle>
            <CardDescription className="text-base">Upload a profile picture to personalize your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-4 border-border shadow-lg cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <User className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:scale-110"
                  disabled={uploading}
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Click the camera icon to upload a new photo.<br />
                  Recommended: Square image, at least 400x400px
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Information - Full Width */}
      <div className="px-2 lg:px-4">
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
              <User className="h-6 w-6 text-primary" /> Personal Information
            </CardTitle>
            <CardDescription className="text-base">Your basic profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="md:col-span-2 lg:col-span-3">
                <Label className="text-base font-medium">Email</Label>
                <Input value={user?.email ?? ""} disabled className="mt-2 bg-secondary/50 h-12 text-base" />
                <p className="text-sm text-muted-foreground mt-2">Email cannot be changed</p>
              </div>
              <div>
                <Label className="text-base font-medium flex items-center gap-2">
                  <User className="h-4 w-4" /> Full Name
                </Label>
                <Input 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  className="mt-2 h-12 text-base" 
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label className="text-base font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Age
                </Label>
                <Input 
                  type="number"
                  value={age} 
                  onChange={(e) => setAge(e.target.value)} 
                  className="mt-2 h-12 text-base" 
                  placeholder="25"
                  min="1"
                  max="120"
                />
              </div>
              <div>
                <Label className="text-base font-medium flex items-center gap-2">
                  <Trophy className="h-4 w-4" /> Sport
                </Label>
                <Input 
                  value={sport} 
                  onChange={(e) => setSport(e.target.value)} 
                  className="mt-2 h-12 text-base" 
                  placeholder="e.g., Basketball, Tennis, Swimming"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Country
                </Label>
                <Input 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)} 
                  className="mt-2 h-12 text-base" 
                  placeholder="e.g., United States, Kenya, Brazil"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bio / Athletic Summary - Full Width */}
      <div className="px-2 lg:px-4">
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
              <User className="h-6 w-6 text-primary" /> Bio / Athletic Summary
            </CardTitle>
            <CardDescription className="text-base">Tell others about yourself and your athletic achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share your athletic journey, achievements, goals, and what drives you..."
              className="min-h-[160px] resize-none text-base p-4"
              maxLength={500}
            />
            <p className="text-sm text-muted-foreground mt-3 text-right">
              {bio.length}/500 characters
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Social Links - Full Width */}
      <div className="px-2 lg:px-4">
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
              <Globe className="h-6 w-6 text-primary" /> Social Links
            </CardTitle>
            <CardDescription className="text-base">Connect your social media profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium flex items-center gap-2">
                  <Instagram className="h-5 w-5 text-pink-500" /> Instagram
                </Label>
                <Input 
                  value={socialInstagram} 
                  onChange={(e) => setSocialInstagram(e.target.value)} 
                  className="mt-2 h-12 text-base" 
                  placeholder="@username"
                />
              </div>
              <div>
                <Label className="text-base font-medium flex items-center gap-2">
                  <Twitter className="h-5 w-5 text-blue-400" /> Twitter / X
                </Label>
                <Input 
                  value={socialTwitter} 
                  onChange={(e) => setSocialTwitter(e.target.value)} 
                  className="mt-2 h-12 text-base" 
                  placeholder="@username"
                />
              </div>
              <div>
                <Label className="text-base font-medium flex items-center gap-2">
                  <Facebook className="h-5 w-5 text-blue-600" /> Facebook
                </Label>
                <Input 
                  value={socialFacebook} 
                  onChange={(e) => setSocialFacebook(e.target.value)} 
                  className="mt-2 h-12 text-base" 
                  placeholder="facebook.com/username"
                />
              </div>
              <div>
                <Label className="text-base font-medium flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-primary" /> Website
                </Label>
                <Input 
                  value={socialWebsite} 
                  onChange={(e) => setSocialWebsite(e.target.value)} 
                  className="mt-2 h-12 text-base" 
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KYC / Verification Status - Full Width */}
      <div className="px-2 lg:px-4">
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
              <Shield className="h-6 w-6 text-primary" /> KYC / Verification Status
            </CardTitle>
            <CardDescription className="text-base">Your account verification status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-xl bg-secondary/30 border border-border/30 hover:bg-secondary/40 transition-colors">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-lg">Identity Verification</p>
                  <p className="text-muted-foreground mt-1">
                    {profile?.verification_status === 'verified' 
                      ? "Your identity has been verified" 
                      : profile?.verification_status === 'pending'
                      ? "Your verification is under review"
                      : "Complete verification to unlock all features"}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                {getVerificationBadge()}
              </div>
            </div>
            
            {profile?.verification_status !== 'verified' && (
              <div className="p-6 rounded-xl border border-dashed border-border bg-secondary/20">
                <p className="text-muted-foreground mb-4 text-base">
                  Verification helps us ensure the authenticity of athletes on our platform. 
                  Verified athletes get priority access to events and sponsorship opportunities.
                </p>
                <Button variant="outline" disabled size="lg" className="px-6">
                  {profile?.verification_status === 'pending' ? "Verification in Progress" : "Start Verification (Coming Soon)"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Account Settings - Full Width */}
      <div className="px-2 lg:px-4">
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
              <User className="h-6 w-6 text-primary" /> Account Settings
            </CardTitle>
            <CardDescription className="text-base">Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-xl bg-secondary/30 border border-border/30 hover:bg-secondary/40 transition-colors">
              <div className="mb-4 sm:mb-0">
                <p className="font-medium text-foreground text-lg">Password</p>
                <p className="text-muted-foreground mt-1">Change your account password</p>
              </div>
              <Button variant="outline" asChild size="lg" className="px-6">
                <a href="/reset-password">Change Password</a>
              </Button>
            </div>
            <Separator className="my-2" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-xl bg-secondary/30 border border-border/30">
              <div>
                <p className="font-medium text-foreground text-lg">Email Address</p>
                <p className="text-muted-foreground mt-1">{user?.email}</p>
              </div>
              <Badge variant="outline" className="mt-2 sm:mt-0 px-3 py-1 text-base">Primary</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button - Full Width */}
      <div className="px-2 lg:px-4 pb-8">
        <div className="flex justify-end pt-6 border-t border-border/30">
          <Button 
            onClick={() => updateProfile.mutate()} 
            disabled={updateProfile.isPending}
            size="lg"
            className="gap-2 px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {updateProfile.isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AthleteProfile;
