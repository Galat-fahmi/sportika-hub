import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { 
  User, 
  Camera, 
  Trophy, 
  Image as ImageIcon,
  Globe,
  Lock,
  Eye,
  FileText,
  Link as LinkIcon,
  Download,
  Plus,
  X,
  Save,
  ExternalLink,
  Medal,
  Star,
  TrendingUp,
  Share2,
  Trash2,
  Edit3
} from "lucide-react";

interface PortfolioData {
  id: string;
  user_id: string;
  full_name: string;
  photo: string | null;
  sport: string;
  country: string;
  bio: string;
  career_summary: string;
  ranking: number | null;
  is_public: boolean;
  slug: string;
  stats: {
    events: number;
    wins: number;
    win_rate: string;
    ranking_position: number;
  };
  achievements: Achievement[];
  gallery: GalleryImage[];
  social_links: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
}

interface Achievement {
  id: string;
  title: string;
  year: string;
  category: string;
  description?: string;
}

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  uploaded_at: string;
}

// Mock data - replace with actual API call
const usePortfolio = () => {
  return useQuery({
    queryKey: ['athlete-portfolio'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // const { data, error } = await supabase
      //   .from('athlete_profiles')
      //   .select('*')
      //   .single();
      // if (error) throw error;
      // return data as PortfolioData;
      
      // Return demo data for now
      return {
        id: "1",
        user_id: "user-1",
        full_name: "Alex Johnson",
        photo: null,
        sport: "Tennis",
        country: "United States",
        bio: "Professional tennis player with 5 years of competitive experience.",
        career_summary: "Started playing at age 8, turned pro in 2019. Multiple regional championships.",
        ranking: 15,
        is_public: true,
        slug: "alex-johnson",
        stats: {
          events: 45,
          wins: 32,
          win_rate: "71%",
          ranking_position: 15
        },
        achievements: [
          { id: "1", title: "Regional Champion", year: "2023", category: "Regional", description: "Won the regional tennis championship" },
          { id: "2", title: "MVP Award", year: "2022", category: "Individual", description: "Most valuable player of the season" }
        ],
        gallery: [],
        social_links: {
          instagram: "@alexjohnson",
          twitter: "@alexj_tennis"
        }
      } as PortfolioData;
    }
  });
};

const AthletePortfolio = () => {
  const queryClient = useQueryClient();
  const { data: portfolio, isLoading } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState<Partial<PortfolioData>>({});
  const [newAchievement, setNewAchievement] = useState({ title: "", year: "", category: "", description: "" });
  const [newImage, setNewImage] = useState({ caption: "" });

  // Mutations
  const updatePortfolio = useMutation({
    mutationFn: async (data: Partial<PortfolioData>) => {
      // TODO: Replace with actual API call
      // const { error } = await supabase
      //   .from('athlete_profiles')
      //   .update(data)
      //   .eq('id', portfolio?.id);
      // if (error) throw error;
      toast({ title: "Portfolio updated successfully!" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athlete-portfolio'] });
      setIsEditing(false);
    }
  });

  const handleSave = () => {
    updatePortfolio.mutate(formData);
  };

  const handleTogglePrivacy = (isPublic: boolean) => {
    updatePortfolio.mutate({ is_public: isPublic });
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/player/${portfolio?.slug}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Link copied to clipboard!" });
    setShowShareDialog(false);
  };

  const handleGeneratePDF = () => {
    toast({ 
      title: "Generating PDF...",
      description: "Your portfolio PDF will be ready shortly."
    });
    // TODO: Implement PDF generation
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({ title: "Image uploaded successfully!" });
      // TODO: Implement actual image upload
    }
  };

  const handleAddAchievement = () => {
    if (newAchievement.title && newAchievement.year) {
      toast({ title: "Achievement added!" });
      setNewAchievement({ title: "", year: "", category: "", description: "" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-48 bg-secondary rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-96 bg-secondary rounded animate-pulse" />
          <div className="lg:col-span-2 h-96 bg-secondary rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">My Portfolio</h1>
          <p className="text-muted-foreground mt-1">Manage your public athlete profile</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" onClick={() => setShowShareDialog(true)}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Privacy Toggle */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${portfolio?.is_public ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
                {portfolio?.is_public ? (
                  <Globe className="h-5 w-5 text-green-600" />
                ) : (
                  <Lock className="h-5 w-5 text-yellow-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {portfolio?.is_public ? "Public Profile" : "Private Profile"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {portfolio?.is_public 
                    ? "Your profile is visible on the public players listing" 
                    : "Your profile is hidden from public view"}
                </p>
              </div>
            </div>
            <Switch
              checked={portfolio?.is_public}
              onCheckedChange={handleTogglePrivacy}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Photo Card */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Profile Photo</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative inline-block">
                  <Avatar className="h-32 w-32 mx-auto border-4 border-primary/10">
                    <AvatarImage src={portfolio?.photo || undefined} alt={portfolio?.full_name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                      {portfolio?.full_name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  {isEditing ? "Click camera icon to upload new photo" : "Your public profile photo"}
                </p>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card className="glass lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    {isEditing ? (
                      <Input
                        value={formData.full_name || portfolio?.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-foreground">{portfolio?.full_name}</p>
                    )}
                  </div>
                  <div>
                    <Label>Sport</Label>
                    {isEditing ? (
                      <Input
                        value={formData.sport || portfolio?.sport}
                        onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-foreground">{portfolio?.sport}</p>
                    )}
                  </div>
                  <div>
                    <Label>Country</Label>
                    {isEditing ? (
                      <Input
                        value={formData.country || portfolio?.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-foreground">{portfolio?.country}</p>
                    )}
                  </div>
                  <div>
                    <Label>Current Ranking</Label>
                    <p className="mt-1 text-foreground">#{portfolio?.ranking || "N/A"}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Bio</Label>
                  {isEditing ? (
                    <Textarea
                      value={formData.bio || portfolio?.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1 text-foreground">{portfolio?.bio}</p>
                  )}
                </div>

                <div>
                  <Label>Career Summary</Label>
                  {isEditing ? (
                    <Textarea
                      value={formData.career_summary || portfolio?.career_summary}
                      onChange={(e) => setFormData({ ...formData, career_summary: e.target.value })}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1 text-foreground">{portfolio?.career_summary}</p>
                  )}
                </div>

                <Separator />

                <div>
                  <Label className="mb-2 block">Social Links</Label>
                  <div className="space-y-3">
                    {isEditing ? (
                      <>
                        <Input
                          placeholder="Instagram handle (e.g., @username)"
                          value={formData.social_links?.instagram || portfolio?.social_links?.instagram}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            social_links: { ...formData.social_links, instagram: e.target.value }
                          })}
                        />
                        <Input
                          placeholder="Twitter handle (e.g., @username)"
                          value={formData.social_links?.twitter || portfolio?.social_links?.twitter}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            social_links: { ...formData.social_links, twitter: e.target.value }
                          })}
                        />
                        <Input
                          placeholder="Website URL"
                          value={formData.social_links?.website || portfolio?.social_links?.website}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            social_links: { ...formData.social_links, website: e.target.value }
                          })}
                        />
                      </>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {portfolio?.social_links?.instagram && (
                          <Badge variant="secondary">Instagram: {portfolio.social_links.instagram}</Badge>
                        )}
                        {portfolio?.social_links?.twitter && (
                          <Badge variant="secondary">Twitter: {portfolio.social_links.twitter}</Badge>
                        )}
                        {portfolio?.social_links?.website && (
                          <Badge variant="secondary">Website: {portfolio.social_links.website}</Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Achievements & Titles</CardTitle>
                <CardDescription>Showcase your career accomplishments</CardDescription>
              </div>
              {isEditing && (
                <Dialog>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Achievement</DialogTitle>
                      <DialogDescription>Add a new title or award to your portfolio</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={newAchievement.title}
                          onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                          placeholder="e.g., Regional Champion"
                        />
                      </div>
                      <div>
                        <Label>Year</Label>
                        <Input
                          value={newAchievement.year}
                          onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })}
                          placeholder="e.g., 2023"
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={newAchievement.category}
                          onChange={(e) => setNewAchievement({ ...newAchievement, category: e.target.value })}
                          placeholder="e.g., Regional, National, International"
                        />
                      </div>
                      <div>
                        <Label>Description (Optional)</Label>
                        <Textarea
                          value={newAchievement.description}
                          onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                          placeholder="Brief description of the achievement"
                        />
                      </div>
                      <Button onClick={handleAddAchievement} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Achievement
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portfolio?.achievements?.map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                        <Badge variant="outline">{achievement.year}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.category}</p>
                      {achievement.description && (
                        <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                      )}
                    </div>
                    {isEditing && (
                      <button className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                {portfolio?.achievements?.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No achievements added yet</p>
                    {isEditing && <p className="text-sm">Click the + button to add your first achievement</p>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Photo Gallery</CardTitle>
                  <CardDescription>Upload photos from events and competitions</CardDescription>
                </div>
                {isEditing && (
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Photo
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {portfolio?.gallery?.map((image) => (
                  <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden bg-secondary group">
                    <img src={image.url} alt={image.caption} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-white text-sm">{image.caption}</p>
                    </div>
                    {isEditing && (
                      <button className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                {portfolio?.gallery?.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No photos uploaded yet</p>
                    {isEditing && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Upload First Photo
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Performance Statistics</CardTitle>
              <CardDescription>Update your career statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-xl bg-secondary/50 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={formData.stats?.events || portfolio?.stats.events}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        stats: { ...formData.stats, events: parseInt(e.target.value) }
                      })}
                      className="text-center text-2xl font-bold"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-foreground">{portfolio?.stats.events}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">Total Events</p>
                </div>

                <div className="p-6 rounded-xl bg-secondary/50 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Medal className="h-6 w-6 text-primary" />
                  </div>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={formData.stats?.wins || portfolio?.stats.wins}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        stats: { ...formData.stats, wins: parseInt(e.target.value) }
                      })}
                      className="text-center text-2xl font-bold"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-foreground">{portfolio?.stats.wins}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">Wins</p>
                </div>

                <div className="p-6 rounded-xl bg-secondary/50 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  {isEditing ? (
                    <Input
                      value={formData.stats?.win_rate || portfolio?.stats.win_rate}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        stats: { ...formData.stats, win_rate: e.target.value }
                      })}
                      className="text-center text-2xl font-bold"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-foreground">{portfolio?.stats.win_rate}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">Win Rate</p>
                </div>

                <div className="p-6 rounded-xl bg-secondary/50 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={formData.stats?.ranking_position || portfolio?.stats.ranking_position}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        stats: { ...formData.stats, ranking_position: parseInt(e.target.value) }
                      })}
                      className="text-center text-2xl font-bold"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-foreground">#{portfolio?.stats.ranking_position}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">Current Ranking</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Portfolio Preview</DialogTitle>
            <DialogDescription>This is how your public profile will appear</DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <div className="p-6 rounded-lg bg-secondary/30 text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={portfolio?.photo || undefined} />
                <AvatarFallback className="text-2xl">{portfolio?.full_name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{portfolio?.full_name}</h2>
              <p className="text-muted-foreground">{portfolio?.sport} • {portfolio?.country}</p>
              <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={handleCopyLink}>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button variant="outline" size="sm" onClick={handleGeneratePDF}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate PDF
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Portfolio</DialogTitle>
            <DialogDescription>Share your athlete profile with others</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Public Link</Label>
              <div className="flex gap-2 mt-1">
                <Input 
                  readOnly 
                  value={`${window.location.origin}/player/${portfolio?.slug}`}
                />
                <Button onClick={handleCopyLink}>
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleGeneratePDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={() => window.open(`/player/${portfolio?.slug}`, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Public Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AthletePortfolio;