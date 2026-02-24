import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Search, Filter, Trophy, Target, Users, TrendingUp } from "lucide-react";
import athlete1 from "@/assets/athlete-1.jpg";
import athlete2 from "@/assets/athlete-2.jpg";
import athlete3 from "@/assets/athlete-3.jpg";

const athletes = [
  {
    id: "1",
    name: "Ahmed Raza",
    slug: "ahmed-raza",
    sport: "Cricket",
    university: "University of Punjab",
    location: "Lahore, Pakistan",
    image: athlete1,
    achievements: [
      "National Champion 2025", 
      "Best Batsman Award", 
      "All-Rounder of the Year",
      "Regional MVP 2024",
      "University Gold Medalist"
    ],
    stats: { matches: 45, wins: 38, rating: 4.9, winRate: 84 },
    bio: "A dynamic all-rounder known for explosive batting and strategic bowling. Ahmed has represented Pakistan in multiple inter-university championships.",
    specialties: ["Batting", "Bowling", "Fielding", "Leadership"],
    social: { instagram: "@ahmedraza_cricket", twitter: "@ahmedraza25" },
    verified: true,
    featured: true
  },
  {
    id: "2",
    name: "Fatima Khan",
    slug: "fatima-khan",
    sport: "Badminton",
    university: "LUMS",
    location: "Lahore, Pakistan",
    image: athlete2,
    achievements: [
      "Gold Medal - National Games", 
      "University Champion 2024", 
      "Rising Star Award",
      "Best Female Athlete 2024",
      "Regional Champion 2023"
    ],
    stats: { matches: 62, wins: 55, rating: 4.8, winRate: 89 },
    bio: "A fierce competitor with lightning-fast reflexes. Fatima has dominated the national badminton circuit and is a role model for aspiring female athletes.",
    specialties: ["Singles", "Doubles", "Agility", "Strategy"],
    social: { instagram: "@fatimakhan_badminton", twitter: "@fatimakhan24" },
    verified: true,
    featured: true
  },
  {
    id: "3",
    name: "Hassan Ali",
    slug: "hassan-ali",
    sport: "Football",
    university: "FAST-NU",
    location: "Islamabad, Pakistan",
    image: athlete3,
    achievements: [
      "Top Scorer 2025", 
      "Captain - University Team", 
      "MVP Finals 2024",
      "Best Midfielder Award",
      "Team Leadership Excellence"
    ],
    stats: { matches: 78, wins: 52, rating: 4.7, winRate: 67 },
    bio: "An inspiring team captain and prolific goal scorer. Hassan's leadership on and off the field has led his team to multiple championship victories.",
    specialties: ["Midfield", "Scoring", "Leadership", "Team Coordination"],
    social: { instagram: "@hassanali_football", twitter: "@hassanali25" },
    verified: true,
    featured: false
  },
  {
    id: "4",
    name: "Sana Malik",
    slug: "sana-malik",
    sport: "Swimming",
    university: "NUST",
    location: "Rawalpindi, Pakistan",
    image: "/placeholder-athlete-4.jpg",
    achievements: [
      "National Record Holder", 
      "University Swimming Champion", 
      "Best Freestyle Swimmer",
      "Regional Gold Medalist",
      "Academic Excellence Award"
    ],
    stats: { matches: 35, wins: 32, rating: 4.9, winRate: 91 },
    bio: "An exceptional swimmer with record-breaking performances. Sana has set multiple national records and represents Pakistan in international competitions.",
    specialties: ["Freestyle", "Butterfly", "Backstroke", "Breaststroke"],
    social: { instagram: "@sanamalik_swimming", twitter: "@sanamalik25" },
    verified: true,
    featured: true
  },
  {
    id: "5",
    name: "Usman Tariq",
    slug: "usman-tariq",
    sport: "Tennis",
    university: "COMSATS",
    location: "Islamabad, Pakistan",
    image: "/placeholder-athlete-5.jpg",
    achievements: [
      "National Tennis Champion", 
      "University Doubles Winner", 
      "Best Serve Award",
      "Regional Finals Runner-up",
      "Sportsmanship Award"
    ],
    stats: { matches: 58, wins: 45, rating: 4.6, winRate: 78 },
    bio: "A powerful tennis player known for his aggressive baseline game and exceptional serve. Usman has consistently performed at national level competitions.",
    specialties: ["Singles", "Doubles", "Serving", "Baseline Play"],
    social: { instagram: "@usmantariq_tennis", twitter: "@usmantariq25" },
    verified: false,
    featured: false
  },
  {
    id: "6",
    name: "Ayesha Siddiqui",
    slug: "ayesha-siddiqui",
    sport: "Volleyball",
    university: "Quaid-i-Azam University",
    location: "Islamabad, Pakistan",
    image: "/placeholder-athlete-6.jpg",
    achievements: [
      "National Volleyball Team", 
      "University Captain", 
      "Best Setter Award",
      "Regional Tournament Winner",
      "Leadership Excellence"
    ],
    stats: { matches: 67, wins: 51, rating: 4.7, winRate: 76 },
    bio: "An outstanding setter and team captain who orchestrates plays with precision. Ayesha has led her university team to multiple victories.",
    specialties: ["Setting", "Leadership", "Strategy", "Team Coordination"],
    social: { instagram: "@ayeshasiddiqui_vb", twitter: "@ayeshasiddiqui25" },
    verified: true,
    featured: false
  },
];

const Athletes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  // Get unique sports for filter dropdown
  const sports = useMemo(() => {
    const uniqueSports = [...new Set(athletes.map(athlete => athlete.sport))];
    return ["all", ...uniqueSports];
  }, []);

  // Filter and sort athletes
  const filteredAthletes = useMemo(() => {
    let result = athletes.filter(athlete => 
      athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (sportFilter === "all" || athlete.sport === sportFilter)
    );

    // Sort athletes
    switch (sortBy) {
      case "rating":
        return result.sort((a, b) => b.stats.rating - a.stats.rating);
      case "wins":
        return result.sort((a, b) => b.stats.wins - a.stats.wins);
      case "featured":
        return result.sort((a, b) => (b.featured === a.featured) ? 0 : b.featured ? 1 : -1);
      default:
        return result;
    }
  }, [searchTerm, sportFilter, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">
                Discover <span className="gradient-text">Elite Athletes</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Connect with verified champions showcasing achievements, stats, and career highlights.
                Find your next sports inspiration or potential team member.
              </p>
              
              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/30">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{athletes.length}+</p>
                  <p className="text-sm text-muted-foreground">Athletes</p>
                </div>
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/30">
                  <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{sports.length - 1}</p>
                  <p className="text-sm text-muted-foreground">Sports</p>
                </div>
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/30">
                  <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{athletes.filter(a => a.verified).length}</p>
                  <p className="text-sm text-muted-foreground">Verified</p>
                </div>
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/30">
                  <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {Math.round(athletes.reduce((acc, a) => acc + a.stats.winRate, 0) / athletes.length)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Win Rate</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-muted/30 border-y border-border/20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search athletes by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by sport" />
                </SelectTrigger>
                <SelectContent>
                  {sports.map(sport => (
                    <SelectItem key={sport} value={sport}>
                      {sport === "all" ? "All Sports" : sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="wins">Most Wins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Athletes Grid */}
        <section className="py-12 pb-20">
          <div className="container mx-auto px-6">
            {filteredAthletes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No athletes found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {sportFilter !== "all" ? `${sportFilter} Athletes` : "All Athletes"}
                    <span className="text-muted-foreground font-normal ml-2">({filteredAthletes.length})</span>
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Sorted by {sortBy === "featured" ? "featured status" : sortBy}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredAthletes.map((athlete, index) => (
                    <motion.div
                      key={athlete.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="h-full"
                    >
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        <div className="relative">
                          <div className="aspect-video overflow-hidden">
                            <img 
                              src={athlete.image} 
                              alt={athlete.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                const fallback = img.nextElementSibling as HTMLElement;
                                if (img && fallback) {
                                  img.style.display = 'none';
                                  fallback.style.display = 'flex';
                                }
                              }}
                            />
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center hidden">
                              <span className="text-muted-foreground text-lg font-medium">Athlete Profile</span>
                            </div>
                          </div>
                          {athlete.featured && (
                            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                              Featured
                            </Badge>
                          )}
                          {athlete.verified && (
                            <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        <CardContent className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="secondary" className="text-sm">
                              {athlete.sport}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-semibold">{athlete.stats.rating}</span>
                              <span className="text-muted-foreground text-sm">({athlete.stats.winRate}%)</span>
                            </div>
                          </div>
                          
                          <h3 className="font-heading text-xl font-bold mb-2">{athlete.name}</h3>
                          <p className="text-muted-foreground text-sm mb-2">{athlete.university}</p>
                          
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4" />
                            <span>{athlete.location}</span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                            {athlete.bio}
                          </p>
                          
                          {/* Quick Stats */}
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="text-center p-2 bg-muted/30 rounded-lg">
                              <p className="font-bold text-sm">{athlete.stats.matches}</p>
                              <p className="text-xs text-muted-foreground">Matches</p>
                            </div>
                            <div className="text-center p-2 bg-muted/30 rounded-lg">
                              <p className="font-bold text-sm">{athlete.stats.wins}</p>
                              <p className="text-xs text-muted-foreground">Wins</p>
                            </div>
                            <div className="text-center p-2 bg-muted/30 rounded-lg">
                              <p className="font-bold text-sm">{athlete.stats.winRate}%</p>
                              <p className="text-xs text-muted-foreground">Win Rate</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-auto">
                            <Button asChild variant="outline" size="sm" className="flex-1">
                              <Link to={`/player/${athlete.slug}`}>View Profile</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Athletes;