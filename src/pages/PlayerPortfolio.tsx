import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Trophy, 
  MapPin, 
  TrendingUp,
  Medal,
  Star,
  Share2,
  Mail,
  Instagram,
  Twitter,
  Globe,
  Calendar,
  Award,
  Target,
  Flag,
  ChevronLeft,
  Download,
  Image as ImageIcon,
  Users,
  FileBadge
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  title: string;
  year: string;
  category: string;
  icon: typeof Trophy;
}

interface GalleryImage {
  id: string;
  src: string;
  caption: string;
  category: string;
}

interface Stat {
  label: string;
  value: string | number;
  icon: typeof Trophy;
  description?: string;
}

// Mock data - in real app, fetch based on playername param
const mockPlayerData: Record<string, {
  id: string;
  name: string;
  photo: string;
  sport: string;
  country: string;
  countryCode: string;
  ranking: number;
  rankingTier: 'elite' | 'pro' | 'amateur';
  bio: string;
  careerSummary: string;
  email: string;
  social: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  stats: Stat[];
  achievements: Achievement[];
  gallery: GalleryImage[];
  badges: string[];
}> = {
  "ahmed-khan": {
    id: "1",
    name: "Ahmed Khan",
    photo: "",
    sport: "Cricket",
    country: "Pakistan",
    countryCode: "PK",
    ranking: 3,
    rankingTier: "elite",
    bio: "Professional cricketer with over 10 years of experience in international cricket. Known for exceptional batting skills and strategic gameplay. Passionate about mentoring young athletes and promoting cricket at grassroots level.",
    careerSummary: "Started professional career in 2014. Represented Pakistan in 3 World Cups, 50+ Test matches, and 100+ ODIs. Captain of national team from 2019-2022. Multiple record holder for highest runs in a single season.",
    email: "ahmed.khan@example.com",
    social: {
      instagram: "@ahmedkhan_cricket",
      twitter: "@ahmedkhan",
      website: "www.ahmedkhan.com"
    },
    stats: [
      { label: "Total Events", value: 156, icon: Calendar, description: "International matches played" },
      { label: "Wins", value: 98, icon: Trophy, description: "Match victories" },
      { label: "Win Rate", value: "62.8%", icon: Target, description: "Career win percentage" },
      { label: "Centuries", value: 42, icon: Star, description: "100+ runs in a match" },
      { label: "Current Ranking", value: "#3", icon: TrendingUp, description: "ICC World Rankings" },
      { label: "Career Runs", value: "12,450", icon: Award, description: "Total runs scored" }
    ],
    achievements: [
      { id: "1", title: "World Cup Winner", year: "2019", category: "International", icon: Trophy },
      { id: "2", title: "Player of the Tournament", year: "2019", category: "Individual", icon: Star },
      { id: "3", title: "ICC Cricketer of the Year", year: "2020", category: "Individual", icon: Award },
      { id: "4", title: "Asia Cup Champion", year: "2018", category: "Regional", icon: Flag },
      { id: "5", title: "Test Series MVP", year: "2021", category: "Individual", icon: Medal },
      { id: "6", title: "T20 World Cup Finalist", year: "2022", category: "International", icon: Trophy }
    ],
    gallery: [
      { id: "1", src: "", caption: "World Cup Victory Celebration", category: "Events" },
      { id: "2", src: "", caption: "Century Against Australia", category: "Highlights" },
      { id: "3", src: "", caption: "Training Session", category: "Training" },
      { id: "4", src: "", caption: "Award Ceremony 2020", category: "Awards" },
      { id: "5", src: "", caption: "Team Pakistan Captain", category: "Leadership" },
      { id: "6", src: "", caption: "Fan Meet & Greet", category: "Community" }
    ],
    badges: ["Century Club", "World Cup Winner", "Captain", "ICC Elite", "10K Runs", "All-Rounder"]
  }
};

// Default player for demo (when no matching slug)
const defaultPlayer = mockPlayerData["ahmed-khan"];

const PlayerPortfolio = () => {
  const { playername } = useParams<{ playername: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  
  // In real app, fetch player data based on playername
  const player = mockPlayerData[playername || ""] || defaultPlayer;

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({ 
      title: "Portfolio link copied!",
      description: "Share this link with others to showcase this athlete."
    });
  };

  const getRankingBadge = (tier: string) => {
    switch (tier) {
      case 'elite':
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30 text-sm"><Trophy className="h-3 w-3 mr-1" /> Elite</Badge>;
      case 'pro':
        return <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 text-sm"><Star className="h-3 w-3 mr-1" /> Pro</Badge>;
      case 'amateur':
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-sm"><TrendingUp className="h-3 w-3 mr-1" /> Amateur</Badge>;
      default:
        return <Badge variant="secondary">{tier}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/20" />
        
        {/* Back Button */}
        <div className="relative max-w-7xl mx-auto mb-8">
          <Link 
            to="/players" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Players
          </Link>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Profile Image */}
            <div className="relative">
              <Avatar className="h-40 w-40 lg:h-56 lg:w-56 border-4 border-primary/20 shadow-2xl">
                <AvatarImage src={player.photo} alt={player.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-4xl lg:text-5xl font-bold">
                  {player.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                {getRankingBadge(player.rankingTier)}
              </div>
            </div>

            {/* Player Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl lg:text-5xl font-display font-bold text-foreground mb-2">
                    {player.name}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-primary" />
                      {player.sport}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {player.country}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Rank #{player.ranking}
                    </span>
                  </div>
                </div>

                {/* Share Button */}
                <Button onClick={handleShare} variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Portfolio
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                {player.social.instagram && (
                  <a 
                    href={`https://instagram.com/${player.social.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-secondary hover:bg-primary/10 transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {player.social.twitter && (
                  <a 
                    href={`https://twitter.com/${player.social.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-secondary hover:bg-primary/10 transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {player.social.website && (
                  <a 
                    href={`https://${player.social.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-secondary hover:bg-primary/10 transition-colors"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
                <a 
                  href={`mailto:${player.email}`}
                  className="p-2 rounded-full bg-secondary hover:bg-primary/10 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="text-center p-3 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold text-primary">{player.stats[0].value}</p>
                  <p className="text-xs text-muted-foreground">Events</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold text-primary">{player.stats[1].value}</p>
                  <p className="text-xs text-muted-foreground">Wins</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold text-primary">{player.achievements.length}</p>
                  <p className="text-xs text-muted-foreground">Titles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* About Section */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        About Athlete
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-foreground leading-relaxed">{player.bio}</p>
                      <Separator />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Career Summary</h4>
                        <p className="text-muted-foreground leading-relaxed">{player.careerSummary}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Badges */}
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Badges & Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {player.badges.map((badge, index) => (
                          <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                            <Medal className="h-3 w-3 mr-1" />
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{player.email}</span>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Social Media</p>
                        {player.social.instagram && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Instagram className="h-4 w-4" />
                            {player.social.instagram}
                          </div>
                        )}
                        {player.social.twitter && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Twitter className="h-4 w-4" />
                            {player.social.twitter}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass bg-primary/5 border-primary/20">
                    <CardContent className="p-6 text-center">
                      <Trophy className="h-12 w-12 text-primary mx-auto mb-3" />
                      <p className="text-3xl font-bold text-foreground">#{player.ranking}</p>
                      <p className="text-sm text-muted-foreground">World Ranking</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="stats">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Performance Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {player.stats.map((stat, index) => (
                      <div key={index} className="p-6 rounded-xl bg-secondary/50 text-center group hover:bg-secondary transition-colors">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                          <stat.icon className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                        <p className="font-medium text-foreground mb-1">{stat.label}</p>
                        <p className="text-sm text-muted-foreground">{stat.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Career Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {player.achievements.map((achievement) => (
                      <div 
                        key={achievement.id} 
                        className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <achievement.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                            <Badge variant="outline">{achievement.year}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{achievement.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Photo Gallery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {player.gallery.map((image) => (
                      <div 
                        key={image.id} 
                        className="group relative aspect-square rounded-lg overflow-hidden bg-secondary/50 cursor-pointer"
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                          <p className="font-medium text-sm">{image.caption}</p>
                          <Badge variant="secondary" className="mt-1 text-xs">{image.category}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlayerPortfolio;