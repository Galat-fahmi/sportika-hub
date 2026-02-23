import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  User, 
  Camera, 
  Edit3,
  CheckCircle,
  MapPin,
  Globe,
  Phone,
  Mail,
  Building2
} from "lucide-react";
import { getOrganizerProfile, updateOrganizerProfile, uploadProfilePicture } from "@/lib/organizer-profile-api";

const OrganizerProfile = () => {
  const { user, profileAvatarUrl } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile form state
  const [profile, setProfile] = useState({
    full_name: "",
    email: user?.email || "",
    phone: "",
    website: "",
    address: "",
    bio: "",
    avatar_url: ""
  });

  // Fetch the actual profile data
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["organizer-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return await getOrganizerProfile(user.id);
    },
    enabled: !!user,
    onSuccess: (data) => {
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          email: user?.email || "",
          phone: "",
          website: "",
          address: "",
          bio: "",
          avatar_url: data.avatar_url || ""
        });
      }
    }
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (formData: typeof profile) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      return await updateOrganizerProfile(user.id, {
        full_name: formData.full_name,
        avatar_url: formData.avatar_url,
      });
    },
    onSuccess: () => {
      toast({ title: "Profile updated successfully!" });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["organizer-profile", user?.id] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update profile", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // Handle profile picture upload
  const handleProfilePictureUpload = async (file: File) => {
    if (!user?.id) {
      toast({
        title: "Authentication error",
        description: "Please log in to upload profile picture",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Upload to storage
      const { publicUrl, filePath } = await uploadProfilePicture(file, user.id);
      
      // Update profile with new avatar URL
      const updatedProfile = await updateOrganizerProfile(user.id, {
        avatar_url: publicUrl,
        full_name: profile.full_name,
      });
      
      // Update local state
      setProfile(prev => ({
        ...prev,
        avatar_url: publicUrl
      }));
      
      // Invalidate query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["organizer-profile", user?.id] });
      
      toast({
        title: "Profile picture updated!",
        description: "Your profile picture has been saved successfully."
      });
      
    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading your profile picture",
        variant: "destructive"
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProfilePictureUpload(file);
    }
  };

  if (profileLoading) {
    return <p className="text-muted-foreground">Loading profile...</p>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and profile settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture Card */}
        <div className="lg:col-span-1">
          <Card className="glass">
            <CardContent className="p-6 text-center">
              <div className="relative inline-block">
                <Avatar className="h-32 w-32 mx-auto mb-4">
                  <AvatarImage src={profile.avatar_url || profileAvatarUrl || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl h-32 w-32">
                    {profile.full_name.charAt(0) || 'O'}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                    onClick={handleUploadClick}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden"
                onChange={handleFileChange}
              />

              <h3 className="font-medium text-lg">{profile.full_name || user?.email?.split('@')[0]}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details Card */}
        <div className="lg:col-span-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Email Address</Label>
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
                <div className="md:col-span-2">
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
                <div className="md:col-span-2">
                  <Label className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Bio
                  </Label>
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 min-h-[100px]"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button 
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? updateProfileMutation.mutate(profile) : setIsEditing(true)}
                  disabled={updateProfileMutation.isPending}
                >
                  {isEditing ? (
                    <>{updateProfileMutation.isPending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />} Save Changes</>
                  ) : (
                    <><Edit3 className="h-4 w-4 mr-2" /> Edit Profile</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrganizerProfile;