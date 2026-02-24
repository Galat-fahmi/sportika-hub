import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Trophy, Medal, Star, Calendar, MapPin, Share2, Download, 
  ChevronLeft, Target, TrendingUp, Award, Heart, MessageCircle,
  Instagram, Twitter, Facebook, Mail, Phone, Globe,
  BarChart3, Users, Clock, Zap, User, Award as AwardIcon
} from "lucide-react";
import athlete1 from "@/assets/athlete-1.jpg";

const AhmedRazaProfile = () => {
  const [liked, setLiked] = useState(false);

  const athleteData = {
    name: "Ahmed Raza",
    sport: "Cricket",
    university: "University of Punjab",
    location: "Lahore, Pakistan",
    image: athlete1,
    rating: 4.9,
    stats: {
      matches: 45,
      wins: 38,
      losses: 7,
      winRate: 84,
      currentStreak: 5,
      bestStreak: 12
    },
    bio: "A dynamic all-rounder known for explosive batting and strategic bowling. Ahmed has represented Pakistan in multiple inter-university championships and is considered one of the most promising young cricketers in the country. His ability to perform under pressure and lead from the front makes him a valuable asset to any team.",
    specialties: [
      { name: "Batting", level: 96, category: "Batting" },
      { name: "Bowling", level: 89, category: "Bowling" },
      { name: "Fielding", level: 92, category: "Fielding" },
      { name: "Leadership", level: 94, category: "Leadership" },
      { name: "Strategy", level: 88, category: "Mental" },
      { name: "Fitness", level: 91, category: "Physical" }
    ],
    achievements: [
      { id: 1, title: "National Champion 2025", year: "2025", category: "Championship", description: "Led University of Punjab to national championship victory" },
      { id: 2, title: "Best Batsman Award", year: "2024", category: "Individual", description: "Awarded for highest run scorer in university league" },
      { id: 3, title: "All-Rounder of the Year", year: "2024", category: "Recognition", description: "Recognized for exceptional performance across all formats" },
      { id: 4, title: "Regional MVP 2024", year: "2024", category: "Individual", description: "Most valuable player in regional cricket tournament" },
      { id: 5, title: "University Gold Medalist", year: "2023", category: "Academic", description: "Balanced academics with exceptional sports performance" }
    ],
    tournaments: [
      { id: 1, name: "National University Cricket Championship", date: "March 2025", position: "1st Place", prize: "$5,000", participants: 64 },
      { id: 2, name: "Regional Cricket Finals", date: "February 2025", position: "1st Place", prize: "$2,500", participants: 32 },
      { id: 3, name: "Punjab University League", date: "January 2025", position: "1st Place", prize: "$1,200", participants: 16 },
      { id: 4, name: "Inter-University Tournament", date: "December 2024", position: "2nd Place", prize: "$800", participants: 24 }
    ],
    gallery: [
      { id: 1, url: athlete1, caption: "Championship Victory", date: "2025-03-15" },
      { id: 2, url: athlete1, caption: "Training Session", date: "2025-02-20" },
      { id: 3, url: athlete1, caption: "Team Celebration", date: "2025-01-10" }
    ],
    socialLinks: {
      instagram: "https://instagram.com/ahmedraza_cricket",
      twitter: "https://twitter.com/ahmedraza25",
      facebook: "https://facebook.com/ahmedraza.cricket",
      email: "ahmed.raza25@pucit.edu.pk",
      phone: "+92 300 1234567",
      website: "https://ahmedraza-cricket.com"
    },
    personalInfo: {
      age: 22,
      height: "5'10\"",
      weight: "72 kg",
      battingStyle: "Right-handed batsman",
      bowlingStyle: "Right-arm medium pace",
      role: "All-rounder & Captain",
      jerseyNumber: "#7"
    }
  };

  const winRate = Math.round((athleteData.stats.wins / athleteData.stats.matches) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Button asChild variant="ghost" className="mb-6">
              <Link to="/players">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Athletes
              </Link>
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <Card className="overflow-hidden bg-card border-border/50">
                <div className="relative">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img 
                      src={athleteData.image} 
                      alt={athleteData.name}
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
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center hidden">
                      <span className="text-muted-foreground text-lg font-medium">Profile Image</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="rounded-full w-10 h-10 p-0"
                      onClick={() => setLiked(!liked)}
                    >
                      <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="secondary" size="sm" className="rounded-full w-10 h-10 p-0">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Share Profile</DialogTitle>
                        </DialogHeader>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1">
                            <Twitter className="w-4 h-4 mr-2" />
                            Twitter
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Facebook className="w-4 h-4 mr-2" />
                            Facebook
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-primary/90 text-primary-foreground text-sm">
                      {athleteData.sport}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{athleteData.rating}</span>
                      <span className="text-muted-foreground text-sm">({winRate}%)</span>
                    </div>
                  </div>
                  
                  <h1 className="font-heading text-3xl font-bold mb-2">{athleteData.name}</h1>
                  <p className="text-muted-foreground mb-4">{athleteData.university}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{athleteData.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>Age: {athleteData.personalInfo.age} | {athleteData.personalInfo.height} | {athleteData.personalInfo.weight}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AwardIcon className="w-4 h-4" />
                      <span>{athleteData.personalInfo.role} | #{athleteData.personalInfo.jerseyNumber}</span>
                    </div>
                  </div>
                  
                  {/* Contact Buttons */}
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Athlete
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Stats
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Social Links Card */}
              <Card className="mt-6 bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="w-5 h-5 text-primary" />
                    Connect
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={athleteData.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram className="w-4 h-4 mr-2 text-pink-500" />
                        Instagram
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={athleteData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-4 h-4 mr-2 text-blue-500" />
                        Twitter
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={`mailto:${athleteData.socialLinks.email}`}>
                        <Mail className="w-4 h-4 mr-2 text-red-500" />
                        Email
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={`tel:${athleteData.socialLinks.phone}`}>
                        <Phone className="w-4 h-4 mr-2 text-green-500" />
                        Call
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  {/* Bio */}
                  <Card className="bg-card border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        About
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {athleteData.bio}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Detailed Stats */}
                  <Card className="bg-card border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Career Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
                          <p className="text-2xl font-bold">{athleteData.stats.matches}</p>
                          <p className="text-sm text-muted-foreground">Total Matches</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <Medal className="w-6 h-6 text-green-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">{athleteData.stats.wins}</p>
                          <p className="text-sm text-muted-foreground">Wins</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">{winRate}%</p>
                          <p className="text-sm text-muted-foreground">Win Rate</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <Zap className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">{athleteData.stats.currentStreak}</p>
                          <p className="text-sm text-muted-foreground">Current Streak</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Specialties */}
                  <Card className="bg-card border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Cricket Specialties
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {athleteData.specialties.slice(0, 6).map((skill) => (
                          <div key={skill.name} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-sm font-medium">{skill.name}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{skill.level}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="stats" className="space-y-6">
                  {/* Detailed Performance Stats */}
                  <Card className="bg-card border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold mb-4">Batting Skills</h3>
                          <div className="space-y-4">
                            {athleteData.specialties.filter(s => s.category === "Batting").map((skill) => (
                              <div key={skill.name}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>{skill.name}</span>
                                  <span className="text-muted-foreground">{skill.level}%</span>
                                </div>
                                <Progress value={skill.level} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-4">Bowling Skills</h3>
                          <div className="space-y-4">
                            {athleteData.specialties.filter(s => s.category === "Bowling").map((skill) => (
                              <div key={skill.name}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>{skill.name}</span>
                                  <span className="text-muted-foreground">{skill.level}%</span>
                                </div>
                                <Progress value={skill.level} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-4">Leadership & Mental</h3>
                          <div className="space-y-4">
                            {athleteData.specialties.filter(s => s.category === "Leadership" || s.category === "Mental").map((skill) => (
                              <div key={skill.name}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>{skill.name}</span>
                                  <span className="text-muted-foreground">{skill.level}%</span>
                                </div>
                                <Progress value={skill.level} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="achievements" className="space-y-6">
                  {/* Achievements */}
                  <Card className="bg-card border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        Career Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {athleteData.achievements.map((achievement) => (
                          <div 
                            key={achievement.id}
                            className="p-4 rounded-lg bg-muted/50 border border-border/30"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold">{achievement.title}</h3>
                              <Badge variant="secondary">{achievement.year}</Badge>
                            </div>
                            <Badge variant="outline" className="mb-2">{achievement.category}</Badge>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tournament History */}
                  <Card className="bg-card border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-primary" />
                        Tournament History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {athleteData.tournaments.map((tournament) => (
                          <div 
                            key={tournament.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/30"
                          >
                            <div className="flex-1">
                              <h3 className="font-medium">{tournament.name}</h3>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-muted-foreground">{tournament.date}</span>
                                <span className="text-sm text-muted-foreground">{tournament.participants} participants</span>
                                <span className="text-sm text-muted-foreground">{tournament.prize}</span>
                              </div>
                            </div>
                            <Badge 
                              variant={tournament.position === "1st Place" ? "default" : "secondary"} 
                              className="text-sm whitespace-nowrap ml-4"
                            >
                              {tournament.position}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="gallery" className="space-y-6">
                  {/* Photo Gallery */}
                  <Card className="bg-card border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        Gallery
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {athleteData.gallery.map((image) => (
                          <div key={image.id} className="aspect-square rounded-lg overflow-hidden bg-muted relative group cursor-pointer">
                            <img 
                              src={image.url} 
                              alt={image.caption}
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
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center hidden">
                              <span className="text-muted-foreground text-sm text-center px-2">Gallery Image</span>
                            </div>
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white text-sm font-medium">{image.caption}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AhmedRazaProfile;