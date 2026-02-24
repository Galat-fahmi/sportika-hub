import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PlayersSEO } from "@/components/SEO";
import { 
  Search, 
  Filter, 
  Trophy, 
  MapPin, 
  TrendingUp,
  Medal,
  Star,
  ArrowRight,
  Users,
  ChevronRight,
  Activity,
  Crown,
  Zap,
  Target,
  Globe,
  Award,
  Flame
} from "lucide-react";

interface Player {
  id: string;
  user_id: string;
  name: string;
  photo: string | null;
  sport: string;
  country: string;
  country_code: string;
  ranking: number | null;
  ranking_tier: 'elite' | 'pro' | 'amateur' | null;
  achievements_count: number;
  events_participated: number;
  bio: string | null;
  slug: string;
}

interface PublicAthletePortfolio {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  tagline: string | null;
  bio: string | null;
  profile_image_url: string | null;
  cover_image_url: string | null;
  sports: string[];
  specialties: string[];
  views_count: number;
  is_verified: boolean;
  published_at: string | null;
}

// Enhanced mock data for Pakistani athlete portfolios
const mockAthletePortfolios: PublicAthletePortfolio[] = [
  {
    id: "1",
    user_id: "user1",
    slug: "babar-azam-cricket",
    title: "Babar Azam",
    tagline: "Pakistan Cricket Captain & Batting Sensation",
    bio: "Pakistan's cricket captain and one of the world's top batsmen. Known for elegant stroke play and consistent performances across all formats.",
    profile_image_url: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face",
    cover_image_url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=400&fit=crop",
    sports: ["Cricket"],
    specialties: ["Batting", "Captaincy", "Cover Drive"],
    views_count: 52450,
    is_verified: true,
    published_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    user_id: "user2",
    slug: "shaheen-afridi-cricket",
    title: "Shaheen Afridi",
    tagline: "Pakistan's Pace Spearhead",
    bio: "Left-arm fast bowler representing Pakistan internationally. Known for deadly swing bowling and match-winning performances.",
    profile_image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    cover_image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop",
    sports: ["Cricket"],
    specialties: ["Fast Bowling", "Swing", "Yorkers"],
    views_count: 46890,
    is_verified: true,
    published_at: "2024-01-10T09:15:00Z",
  },
  {
    id: "3",
    user_id: "user3",
    slug: "naseem-shah-cricket",
    title: "Naseem Shah",
    tagline: "Young Pace Sensation",
    bio: "Pakistan's teenage fast bowling prodigy. Youngest bowler to take a hat-trick in Test cricket. Representing Pakistan with pride.",
    profile_image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    cover_image_url: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=400&fit=crop",
    sports: ["Cricket"],
    specialties: ["Fast Bowling", "Pace", "Wickets"],
    views_count: 38210,
    is_verified: true,
    published_at: "2024-01-05T14:20:00Z",
  },
  {
    id: "4",
    user_id: "user4",
    slug: "muhammad-rizwan-cricket",
    title: "Muhammad Rizwan",
    tagline: "Wicketkeeper-Batsman & T20 Star",
    bio: "Pakistan's wicketkeeper-batsman known for his consistency in T20 cricket. Record holder for most runs in a calendar year in T20Is.",
    profile_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    cover_image_url: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&h=400&fit=crop",
    sports: ["Cricket"],
    specialties: ["Wicketkeeping", "Batting", "Finishing"],
    views_count: 42820,
    is_verified: true,
    published_at: "2024-01-20T11:45:00Z",
  },
  {
    id: "5",
    user_id: "user5",
    slug: "shadab-khan-cricket",
    title: "Shadab Khan",
    tagline: "All-Rounder & Leg-Spin Wizard",
    bio: "Pakistan's premier leg-spinner and handy lower-order batsman. Vice-captain of Pakistan T20 team and key player in all formats.",
    profile_image_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face",
    cover_image_url: "https://images.unsplash.com/photo-1569516449771-41c89ee14ca0?w=800&h=400&fit=crop",
    sports: ["Cricket"],
    specialties: ["Leg Spin", "All-Rounder", "Fielding"],
    views_count: 32340,
    is_verified: true,
    published_at: "2024-01-12T16:30:00Z",
  },
  {
    id: "6",
    user_id: "user6",
    slug: "imam-ul-haq-cricket",
    title: "Imam-ul-Haq",
    tagline: "Opening Batsman & ODI Specialist",
    bio: "Pakistan's left-handed opening batsman. Known for solid technique and ability to anchor innings in ODI cricket.",
    profile_image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    cover_image_url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=400&fit=crop",
    sports: ["Cricket"],
    specialties: ["Opening Batting", "ODI Cricket", "Technique"],
    views_count: 28760,
    is_verified: true,
    published_at: "2024-01-18T08:20:00Z",
  },
  {
    id: "7",
    user_id: "user7",
    slug: "fakhar-zaman-cricket",
    title: "Fakhar Zaman",
    tagline: "Explosive Opening Batsman",
    bio: "Pakistan's explosive left-handed opener. First Pakistani batsman to score a double century in ODIs. Champion CT 2017 final hero.",
    profile_image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    cover_image_url: "https://images.unsplash.com/photo-1461896836934-00ba6d2a6a5e?w=800&h=400&fit=crop",
    sports: ["Cricket"],
    specialties: ["Power Hitting", "Opening", "Aggressive Batting"],
    views_count: 36560,
    is_verified: true,
    published_at: "2024-01-22T13:10:00Z",
  },
  {
    id: "8",
    user_id: "user8",
    slug: "haris-rauf-cricket",
    title: "Haris Rauf",
    tagline: "Rawalpindi Express",
    bio: "Pakistan's express fast bowler from Rawalpindi. Known for sheer pace and ability to bowl over 150 km/h consistently.",
    profile_image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
    cover_image_url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=400&fit=crop",
    sports: ["Cricket"],
    specialties: ["Fast Bowling", "Pace", "Death Bowling"],
    views_count: 31340,
    is_verified: true,
    published_at: "2024-01-25T15:45:00Z",
  },
  {
    id: "9",
    user_id: "user9",
    slug: "hassan-ali-football",
    title: "Hassan Ali",
    tagline: "Pakistan Football Captain & Striker",
    bio: "Pakistan's premier football striker and captain of the national team. Known for explosive pace, clinical finishing, and exceptional aerial ability.",
    profile_image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    cover_image_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop",
    sports: ["Football"],
    specialties: ["Finishing", "Aerial Duels", "Pace", "Leadership"],
    views_count: 32150,
    is_verified: true,
    published_at: "2024-01-20T10:30:00Z",
  },
  {
    id: "10",
    user_id: "user10",
    slug: "muhammad-shahzad-basketball",
    title: "Muhammad Shahzad",
    tagline: "Pakistan Basketball Captain & Point Guard",
    bio: "Pakistan's top basketball talent and captain of the national team. Known for exceptional court vision and lightning-fast ball handling.",
    profile_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    cover_image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop",
    sports: ["Basketball"],
    specialties: ["Ball Handling", "Three-Point Shooting", "Court Vision", "Leadership"],
    views_count: 28450,
    is_verified: true,
    published_at: "2024-02-01T09:00:00Z",
  },
  {
    id: "11",
    user_id: "user11",
    slug: "nadia-nazir-athletics",
    title: "Nadia Nazir",
    tagline: "Pakistan's Fastest Female Sprinter",
    bio: "Pakistan's fastest female sprinter and national record holder in both 100m and 200m events. A role model for female athletes across Pakistan.",
    profile_image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    cover_image_url: "https://images.unsplash.com/photo-1461896836934-00ba6d2a6a5e?w=800&h=400&fit=crop",
    sports: ["Athletics"],
    specialties: ["100m Sprint", "200m Sprint", "Explosive Start", "Speed Endurance"],
    views_count: 25680,
    is_verified: true,
    published_at: "2024-01-25T14:00:00Z",
  },
  {
    id: "12",
    user_id: "user12",
    slug: "ahsan-mehsood-badminton",
    title: "Ahsan Mehsood",
    tagline: "Pakistan No. 1 Badminton Player",
    bio: "Pakistan's top-ranked badminton player and a dominant force in South Asian badminton. Known for powerful smashes and exceptional net play.",
    profile_image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    cover_image_url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=400&fit=crop",
    sports: ["Badminton"],
    specialties: ["Smash", "Net Play", "Footwork", "Defensive Play"],
    views_count: 22340,
    is_verified: true,
    published_at: "2024-02-10T11:00:00Z",
  },
];

const usePlayers = () => {
  return { 
    data: mockAthletePortfolios, 
    isLoading: false, 
    error: null 
  } as {
    data: PublicAthletePortfolio[];
    isLoading: boolean;
    error: any;
  };
};

// Sport filter tabs - Pakistani Sports Focus
const sportFilters = [
  { id: 'all', label: 'All Athletes', icon: Users },
  { id: 'Cricket', label: 'Cricket', icon: Activity },
  { id: 'Football', label: 'Football', icon: Flame },
  { id: 'Hockey', label: 'Hockey', icon: Target },
  { id: 'Squash', label: 'Squash', icon: Zap },
  { id: 'Badminton', label: 'Badminton', icon: Award },
];

const Players = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSport, setActiveSport] = useState("all");
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);

  const { data: players, isLoading } = usePlayers();

  // Map portfolio data to Player interface for display
  const mappedPlayers = useMemo(() => {
    if (!players) return [];
    return players.map(portfolio => ({
      id: portfolio.id,
      user_id: portfolio.user_id,
      name: portfolio.title,
      photo: portfolio.profile_image_url,
      cover: portfolio.cover_image_url,
      sport: portfolio.sports && portfolio.sports.length > 0 ? portfolio.sports[0] : 'Athlete',
      tagline: portfolio.tagline,
      country: 'Pakistan',
      country_code: 'PK',
      ranking: portfolio.views_count > 30000 ? 1 : portfolio.views_count > 20000 ? 2 : 3,
      ranking_tier: portfolio.is_verified ? 'elite' : 'pro',
      achievements_count: portfolio.specialties.length,
      views_count: portfolio.views_count,
      bio: portfolio.bio,
      slug: portfolio.slug,
      verified: portfolio.is_verified,
      specialties: portfolio.specialties,
    }));
  }, [players]);

  // Filter players
  const filteredPlayers = useMemo(() => {
    if (!mappedPlayers) return [];
    return mappedPlayers.filter(player => {
      const matchesSearch = 
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (player.tagline && player.tagline.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesSport = activeSport === "all" || player.sport === activeSport;
      
      return matchesSearch && matchesSport;
    });
  }, [mappedPlayers, searchQuery, activeSport]);

  // Featured players (top 3 by views)
  const featuredPlayers = useMemo(() => {
    return [...mappedPlayers].sort((a, b) => b.views_count - a.views_count).slice(0, 3);
  }, [mappedPlayers]);

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PlayersSEO />
      <Navbar />
      
      {/* Hero Section - Modern & Impactful */}
      <section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl opacity-30" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Crown className="h-4 w-4" />
              <span>Pakistan's Finest Athletes</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 tracking-tight">
              Discover{' '}
              <span className="text-gradient">Pakistani Stars</span>
            </h1>
            
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Explore profiles of Pakistan's top athletes from Karachi, Lahore, Islamabad, and beyond. 
              Connect with cricket stars, football heroes, and rising talent across the nation.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                placeholder="Search athletes, sports, or specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-6 text-lg bg-card/50 border-border/50 rounded-2xl focus:border-primary focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Athletes Section */}
      {!searchQuery && activeSport === 'all' && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-display font-bold text-foreground mb-2">Featured Athletes</h2>
                <p className="text-foreground-muted">Top performers making waves in their sports</p>
              </div>
              <Badge variant="outline" className="px-4 py-2">
                <Flame className="h-4 w-4 mr-2 text-primary" />
                Trending
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPlayers.map((player, index) => (
                <Link key={player.id} to={`/player/${player.slug}`}>
                  <Card 
                    className="group relative overflow-hidden border-0 bg-gradient-to-br from-card to-background hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                    onMouseEnter={() => setHoveredPlayer(player.id)}
                    onMouseLeave={() => setHoveredPlayer(null)}
                  >
                    {/* Cover Image */}
                    <div className="absolute inset-0 h-32 overflow-hidden">
                      <img 
                        src={player.cover} 
                        alt="" 
                        className="w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/80 to-card" />
                    </div>

                    <CardContent className="relative p-6 pt-16">
                      <div className="flex items-start justify-between mb-4">
                        <Avatar className="h-20 w-20 border-4 border-card shadow-xl">
                          <AvatarImage src={player.photo} alt={player.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                            {player.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            #{index + 1}
                          </Badge>
                          {player.verified && (
                            <Badge variant="outline" className="text-xs">
                              <Star className="h-3 w-3 mr-1 fill-primary text-primary" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {player.name}
                      </h3>
                      <p className="text-sm text-foreground-muted mb-3">{player.tagline}</p>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-foreground-secondary">
                          <Activity className="h-4 w-4 text-primary" />
                          {player.sport}
                        </span>
                        <span className="flex items-center gap-1 text-foreground-secondary">
                          <Users className="h-4 w-4 text-primary" />
                          {formatNumber(player.views_count)} views
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {player.specialties.slice(0, 2).map((specialty, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sport Filter Tabs */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {sportFilters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveSport(filter.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeSport === filter.id
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'bg-card text-foreground-secondary hover:bg-card-hover hover:text-foreground border border-border'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Players Grid - Modern Card Design */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                {activeSport === 'all' ? 'All Athletes' : `${activeSport} Athletes`}
              </h2>
              <p className="text-foreground-muted mt-1">
                {filteredPlayers.length} {filteredPlayers.length === 1 ? 'athlete' : 'athletes'} found
              </p>
            </div>
          </div>

          {filteredPlayers.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">No athletes found</h3>
              <p className="text-foreground-muted max-w-md mx-auto">
                Try adjusting your search or selecting a different sport category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlayers.map((player) => (
                <Link key={player.id} to={`/player/${player.slug}`}>
                  <Card 
                    className="group h-full overflow-hidden border-border/50 bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                    onMouseEnter={() => setHoveredPlayer(player.id)}
                    onMouseLeave={() => setHoveredPlayer(null)}
                  >
                    {/* Cover Image Area */}
                    <div className="relative h-28 overflow-hidden">
                      <img 
                        src={player.cover} 
                        alt="" 
                        className="w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
                      
                      {/* Verified Badge */}
                      {player.verified && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-primary text-primary-foreground border-0 shadow-lg">
                            <Crown className="h-3 w-3 mr-1" />
                            Pro
                          </Badge>
                        </div>
                      )}

                      {/* Avatar - Positioned to overlap */}
                      <div className="absolute -bottom-8 left-4">
                        <Avatar className="h-16 w-16 border-4 border-card shadow-lg">
                          <AvatarImage src={player.photo} alt={player.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                            {player.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    <CardContent className="pt-10 pb-5 px-5">
                      <h3 className="text-lg font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {player.name}
                      </h3>
                      <p className="text-sm text-foreground-muted mb-4 line-clamp-1">
                        {player.tagline}
                      </p>

                      {/* Stats Row */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Trophy className="h-4 w-4 text-primary" />
                          <span className="text-foreground-secondary font-medium">
                            {player.achievements_count} titles
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Globe className="h-4 w-4 text-primary" />
                          <span className="text-foreground-secondary font-medium">
                            {player.sport}
                          </span>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1.5">
                        {player.specialties.slice(0, 3).map((specialty, i) => (
                          <Badge 
                            key={i} 
                            variant="secondary" 
                            className="text-xs font-normal bg-secondary/50"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      {/* View Profile Link */}
                      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                        <span className="text-sm text-foreground-muted">
                          {formatNumber(player.views_count)} views
                        </span>
                        <span className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                          View Profile
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Players;