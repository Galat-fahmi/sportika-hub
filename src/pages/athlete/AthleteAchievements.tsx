import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { 
  Award, 
  Medal, 
  Trophy, 
  Star, 
  Download, 
  Share2, 
  Linkedin,
  Twitter,
  Facebook,
  CheckCircle,
  Clock,
  Calendar,
  FileText,
  Crown,
  Zap,
  Target,
  Flame,
  Gem,
  ScrollText
} from "lucide-react";
import { format } from "date-fns";

interface Achievement {
  id: string;
  type: 'medal' | 'badge' | 'milestone';
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  eventName?: string;
  position?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Certificate {
  id: string;
  eventId: string;
  eventName: string;
  sport: string;
  position: number | null;
  date: string;
  certificateUrl?: string;
}

const AthleteAchievements = () => {
  const { user } = useAuth();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const { data: results, isLoading: resultsLoading } = useQuery({
    queryKey: ["athlete-achievements-results", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_results")
        .select("*, events(*)")
        .eq("athlete_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: profile } = useQuery({
    queryKey: ["athlete-achievements-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Generate achievements based on results
  const generateAchievements = (): Achievement[] => {
    const achievements: Achievement[] = [];
    if (!results) return achievements;

    const totalEvents = results.length;
    const wins = results.filter((r: any) => r.position === 1).length;
    const podiums = results.filter((r: any) => r.position && r.position <= 3).length;
    const top10s = results.filter((r: any) => r.position && r.position <= 10).length;

    // First event achievement
    if (totalEvents >= 1) {
      achievements.push({
        id: 'first-event',
        type: 'milestone',
        title: 'First Steps',
        description: 'Completed your first competitive event',
        icon: 'footprints',
        earnedAt: results[results.length - 1]?.created_at,
        rarity: 'common'
      });
    }

    // Win achievements
    if (wins >= 1) {
      achievements.push({
        id: 'first-win',
        type: 'medal',
        title: 'Champion',
        description: 'Won your first competition',
        icon: 'crown',
        earnedAt: results.find((r: any) => r.position === 1)?.created_at,
        rarity: 'epic'
      });
    }

    if (wins >= 3) {
      achievements.push({
        id: 'triple-crown',
        type: 'medal',
        title: 'Triple Crown',
        description: 'Won 3 competitions',
        icon: 'crown',
        earnedAt: results.filter((r: any) => r.position === 1)[2]?.created_at,
        rarity: 'legendary'
      });
    }

    // Podium achievements
    if (podiums >= 3) {
      achievements.push({
        id: 'podium-master',
        type: 'badge',
        title: 'Podium Master',
        description: 'Reached the podium 3 times',
        icon: 'medal',
        earnedAt: results.filter((r: any) => r.position && r.position <= 3)[2]?.created_at,
        rarity: 'rare'
      });
    }

    if (podiums >= 10) {
      achievements.push({
        id: 'podium-legend',
        type: 'badge',
        title: 'Podium Legend',
        description: 'Reached the podium 10 times',
        icon: 'award',
        earnedAt: results.filter((r: any) => r.position && r.position <= 3)[9]?.created_at,
        rarity: 'legendary'
      });
    }

    // Top 10 achievements
    if (top10s >= 5) {
      achievements.push({
        id: 'consistent-performer',
        type: 'badge',
        title: 'Consistent Performer',
        description: 'Finished in top 10 five times',
        icon: 'target',
        earnedAt: results.filter((r: any) => r.position && r.position <= 10)[4]?.created_at,
        rarity: 'rare'
      });
    }

    // Event count achievements
    if (totalEvents >= 5) {
      achievements.push({
        id: 'veteran',
        type: 'milestone',
        title: 'Veteran',
        description: 'Competed in 5 events',
        icon: 'zap',
        earnedAt: results[results.length - 5]?.created_at,
        rarity: 'common'
      });
    }

    if (totalEvents >= 10) {
      achievements.push({
        id: 'seasoned-athlete',
        type: 'milestone',
        title: 'Seasoned Athlete',
        description: 'Competed in 10 events',
        icon: 'flame',
        earnedAt: results[results.length - 10]?.created_at,
        rarity: 'rare'
      });
    }

    if (totalEvents >= 25) {
      achievements.push({
        id: 'iron-athlete',
        type: 'milestone',
        title: 'Iron Athlete',
        description: 'Competed in 25 events',
        icon: 'gem',
        earnedAt: results[results.length - 25]?.created_at,
        rarity: 'epic'
      });
    }

    // Perfect score achievement
    const perfectScore = results.find((r: any) => r.score && r.score >= 100);
    if (perfectScore) {
      achievements.push({
        id: 'perfect-score',
        type: 'badge',
        title: 'Perfect Score',
        description: 'Achieved a perfect score of 100+',
        icon: 'star',
        earnedAt: perfectScore.created_at,
        rarity: 'legendary'
      });
    }

    return achievements.sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime());
  };

  // Generate certificates from results
  const generateCertificates = (): Certificate[] => {
    if (!results) return [];
    return results
      .filter((r: any) => r.position && r.position <= 10)
      .map((r: any) => ({
        id: r.id,
        eventId: r.event_id,
        eventName: r.events?.title || 'Unknown Event',
        sport: r.events?.sport || 'Unknown Sport',
        position: r.position,
        date: r.events?.start_date || r.created_at,
      }));
  };

  const achievements = generateAchievements();
  const certificates = generateCertificates();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-500/20 to-amber-600/20 border-yellow-500/30 text-yellow-600';
      case 'epic': return 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-600';
      case 'rare': return 'from-blue-500/20 to-cyan-600/20 border-blue-500/30 text-blue-600';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-600';
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">Legendary</Badge>;
      case 'epic': return <Badge className="bg-purple-500/20 text-purple-600 border-purple-500/30">Epic</Badge>;
      case 'rare': return <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">Rare</Badge>;
      default: return <Badge variant="secondary">Common</Badge>;
    }
  };

  const getAchievementIcon = (iconName: string, className: string = "h-6 w-6") => {
    switch (iconName) {
      case 'crown': return <Crown className={className} />;
      case 'medal': return <Medal className={className} />;
      case 'award': return <Award className={className} />;
      case 'star': return <Star className={className} />;
      case 'zap': return <Zap className={className} />;
      case 'target': return <Target className={className} />;
      case 'flame': return <Flame className={className} />;
      case 'gem': return <Gem className={className} />;
      default: return <Trophy className={className} />;
    }
  };

  const handleDownloadCertificate = (certificate: Certificate) => {
    // In a real app, this would generate and download a PDF
    toast({ 
      title: "Certificate Downloaded", 
      description: `Certificate for ${certificate.eventName} has been downloaded.` 
    });
  };

  const handleShare = (platform: string) => {
    const text = selectedAchievement 
      ? `I just earned the "${selectedAchievement.title}" achievement on Sportika! 🏆`
      : `Check out my certificate from ${selectedCertificate?.eventName}! 🏆`;
    
    const url = window.location.origin;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShareModalOpen(false);
  };

  const getPositionSuffix = (position: number) => {
    if (position === 1) return 'st';
    if (position === 2) return 'nd';
    if (position === 3) return 'rd';
    return 'th';
  };

  if (resultsLoading) return <p className="text-muted-foreground">Loading achievements…</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Certificates & Achievements</h1>
        <p className="text-muted-foreground mt-1">Your earned certificates, medals, and achievements.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <ScrollText className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">{certificates.length}</p>
            <p className="text-xs text-muted-foreground">Certificates</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <Medal className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">{achievements.filter(a => a.type === 'medal').length}</p>
            <p className="text-xs text-muted-foreground">Medals</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <Award className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">{achievements.filter(a => a.type === 'badge').length}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">{achievements.filter(a => a.rarity === 'legendary').length}</p>
            <p className="text-xs text-muted-foreground">Legendary</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="certificates" className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-6">
          {certificates.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <ScrollText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No certificates yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Finish in top 10 to earn certificates!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <Card key={cert.id} className="glass hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{cert.eventName}</CardTitle>
                        <CardDescription>{cert.sport}</CardDescription>
                      </div>
                      <div className="text-center">
                        <span className={`text-2xl font-display font-bold ${
                          cert.position === 1 ? 'text-yellow-500' :
                          cert.position === 2 ? 'text-gray-400' :
                          cert.position === 3 ? 'text-amber-600' :
                          'text-primary'
                        }`}>
                          {cert.position}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {getPositionSuffix(cert.position!)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(cert.date), "MMMM d, yyyy")}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-2"
                        onClick={() => handleDownloadCertificate(cert)}
                      >
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedCertificate(cert);
                          setShareModalOpen(true);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          {achievements.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No achievements yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start competing to unlock achievements!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`glass hover:border-primary/30 transition-all cursor-pointer bg-gradient-to-br ${getRarityColor(achievement.rarity)}`}
                  onClick={() => setSelectedAchievement(achievement)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-background/50 flex items-center justify-center flex-shrink-0">
                        {getAchievementIcon(achievement.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-sm truncate">{achievement.title}</h3>
                          {getRarityBadge(achievement.rarity)}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Earned {format(new Date(achievement.earnedAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          {achievements.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No timeline data yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-6">
                {achievements.map((achievement, index) => (
                  <div key={achievement.id} className="relative flex items-start gap-4 pl-10">
                    <div className={`absolute left-2 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center ${
                      achievement.rarity === 'legendary' ? 'bg-yellow-500' :
                      achievement.rarity === 'epic' ? 'bg-purple-500' :
                      achievement.rarity === 'rare' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`}>
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                    <Card className="flex-1 glass">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center">
                              {getAchievementIcon(achievement.icon, "h-5 w-5")}
                            </div>
                            <div>
                              <p className="font-medium">{achievement.title}</p>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(achievement.earnedAt), "MMM d, yyyy")}
                            </p>
                            {getRarityBadge(achievement.rarity)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Achievement Detail Modal */}
      <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAchievement && getAchievementIcon(selectedAchievement.icon)}
              {selectedAchievement?.title}
            </DialogTitle>
            <DialogDescription>{selectedAchievement?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className={`p-4 rounded-lg bg-gradient-to-br ${selectedAchievement ? getRarityColor(selectedAchievement.rarity) : ''}`}>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-background/50 flex items-center justify-center mx-auto mb-3">
                  {selectedAchievement && getAchievementIcon(selectedAchievement.icon, "h-10 w-10")}
                </div>
                <p className="font-semibold">{selectedAchievement?.title}</p>
                {selectedAchievement && getRarityBadge(selectedAchievement.rarity)}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Earned on</span>
              <span className="font-medium">
                {selectedAchievement && format(new Date(selectedAchievement.earnedAt), "MMMM d, yyyy")}
              </span>
            </div>
            <Button 
              className="w-full gap-2"
              onClick={() => {
                setShareModalOpen(true);
              }}
            >
              <Share2 className="h-4 w-4" />
              Share Achievement
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Share to Social Media</DialogTitle>
            <DialogDescription>Share your achievement with your network</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className="flex-col h-20 gap-2"
              onClick={() => handleShare('twitter')}
            >
              <Twitter className="h-6 w-6" />
              <span className="text-xs">Twitter</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex-col h-20 gap-2"
              onClick={() => handleShare('facebook')}
            >
              <Facebook className="h-6 w-6" />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex-col h-20 gap-2"
              onClick={() => handleShare('linkedin')}
            >
              <Linkedin className="h-6 w-6" />
              <span className="text-xs">LinkedIn</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AthleteAchievements;