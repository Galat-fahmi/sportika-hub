import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Search, 
  Filter, 
  Trophy, 
  MapPin, 
  TrendingUp,
  Medal,
  Star,
  ArrowRight,
  Users
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

// TODO: Replace with actual API call when backend is ready
const usePlayers = () => {
  return { 
    data: [] as Player[], 
    isLoading: false, 
    error: null 
  };
};

const Players = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedRanking, setSelectedRanking] = useState<string>("all");

  const { data: players, isLoading } = usePlayers();

  // Get unique sports and countries from actual data
  const sports = useMemo(() => 
    [...new Set(players.map(p => p.sport))].filter(Boolean).sort(),
    [players]
  );
  
  const countries = useMemo(() => 
    [...new Set(players.map(p => p.country))].filter(Boolean).sort(),
    [players]
  );

  // Filter players
  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      const matchesSearch = 
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.country.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSport = selectedSport === "all" || player.sport === selectedSport;
      const matchesCountry = selectedCountry === "all" || player.country === selectedCountry;
      const matchesRanking = selectedRanking === "all" || player.ranking_tier === selectedRanking;
      
      return matchesSearch && matchesSport && matchesCountry && matchesRanking;
    });
  }, [players, searchQuery, selectedSport, selectedCountry, selectedRanking]);

  const getRankingBadge = (tier: string) => {
    switch (tier) {
      case 'elite':
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30"><Trophy className="h-3 w-3 mr-1" /> Elite</Badge>;
      case 'pro':
        return <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30"><Star className="h-3 w-3 mr-1" /> Pro</Badge>;
      case 'amateur':
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30"><TrendingUp className="h-3 w-3 mr-1" /> Amateur</Badge>;
      default:
        return <Badge variant="secondary">{tier}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/20" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            <span>Athlete Directory</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
            Discover Elite Athletes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our comprehensive directory of professional athletes from around the world. 
            View their achievements, rankings, and upcoming events.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-y border-border/50 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search athletes by name, sport, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger className="w-[180px] h-11">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  {sports.map(sport => (
                    <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-[180px] h-11">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRanking} onValueChange={setSelectedRanking}>
                <SelectTrigger className="w-[180px] h-11">
                  <Trophy className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Ranking" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="elite">Elite</SelectItem>
                  <SelectItem value="pro">Professional</SelectItem>
                  <SelectItem value="amateur">Amateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `Showing ${filteredPlayers.length} athletes`}
          </div>
        </div>
      </section>

      {/* Players Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-20">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No athletes found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlayers.map((player) => (
                <Card key={player.id} className="glass group hover:border-primary/50 transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Player Header */}
                    <div className="relative p-6 pb-4">
                      <div className="absolute top-4 right-4">
                        {getRankingBadge(player.ranking_tier || '')}
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <Avatar className="h-24 w-24 mb-4 border-4 border-primary/10">
                          <AvatarImage src={player.photo} alt={player.name} />
                          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                            {player.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <h3 className="text-lg font-semibold text-foreground text-center">
                          {player.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span className="capitalize">{player.sport}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {player.country_code}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-px bg-border/50 border-y border-border/50">
                      <div className="bg-secondary/30 p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-primary mb-1">
                          <Trophy className="h-4 w-4" />
                          <span className="font-bold">#{player.ranking}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Ranking</p>
                      </div>
                      <div className="bg-secondary/30 p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-primary mb-1">
                          <Medal className="h-4 w-4" />
                          <span className="font-bold">{player.achievements_count}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Titles</p>
                      </div>
                      <div className="bg-secondary/30 p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-primary mb-1">
                          <Star className="h-4 w-4" />
                          <span className="font-bold">{player.events_participated}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Events</p>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {player.bio}
                      </p>
                      <Link to={`/player/${player.slug}`}>
                        <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          View Portfolio
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
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