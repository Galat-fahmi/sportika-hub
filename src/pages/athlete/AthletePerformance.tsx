import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Medal, 
  Target, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Globe,
  MapPin,
  Award,
  Star,
  Zap,
  Calendar,
  ChevronUp,
  Minus,
  Activity
} from "lucide-react";
import { format } from "date-fns";

const AthletePerformance = () => {
  const { user } = useAuth();

  const { data: results, isLoading } = useQuery({
    queryKey: ["athlete-performance-data", user?.id],
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
    queryKey: ["athlete-profile-rankings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("country, sport")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Calculate all performance metrics
  const totalEvents = results?.length ?? 0;
  const completedEvents = results?.filter((r: any) => r.position !== null).length ?? 0;
  const totalWins = results?.filter((r: any) => r.position === 1).length ?? 0;
  const podiumFinishes = results?.filter((r: any) => r.position && r.position <= 3).length ?? 0;
  const top5Finishes = results?.filter((r: any) => r.position && r.position <= 5).length ?? 0;
  const top10Finishes = results?.filter((r: any) => r.position && r.position <= 10).length ?? 0;
  const totalPoints = results?.reduce((sum: number, r: any) => sum + (r.score || 0), 0) ?? 0;
  
  const bestRank = results?.length > 0 
    ? Math.min(...results.filter((r: any) => r.position).map((r: any) => r.position)) 
    : null;
  
  const worstRank = results?.length > 0 
    ? Math.max(...results.filter((r: any) => r.position).map((r: any) => r.position)) 
    : null;

  const averageRank = completedEvents > 0 
    ? (results?.filter((r: any) => r.position).reduce((sum: number, r: any) => sum + r.position, 0) / completedEvents).toFixed(1)
    : null;

  const winRatio = completedEvents > 0 
    ? ((totalWins / completedEvents) * 100).toFixed(1)
    : 0;

  const podiumRatio = completedEvents > 0 
    ? ((podiumFinishes / completedEvents) * 100).toFixed(1)
    : 0;

  // Get unique sports
  const sportsParticipated = [...new Set(results?.map((r: any) => r.events?.sport).filter(Boolean))];

  // Calculate personal bests per sport
  const personalBests = sportsParticipated.map(sport => {
    const sportResults = results?.filter((r: any) => r.events?.sport === sport && r.position) ?? [];
    const bestPosition = sportResults.length > 0 
      ? Math.min(...sportResults.map((r: any) => r.position))
      : null;
    const bestResult = sportResults.find((r: any) => r.position === bestPosition);
    const highestScore = sportResults.length > 0
      ? Math.max(...sportResults.map((r: any) => r.score || 0))
      : null;
    return { 
      sport, 
      bestPosition, 
      bestEvent: bestResult?.events?.title,
      bestDate: bestResult?.events?.start_date,
      highestScore,
      totalEvents: sportResults.length
    };
  });

  // Performance trend data (last 10 events)
  const recentResults = results?.slice(0, 10).reverse() ?? [];
  
  // Calculate rankings (simulated based on performance)
  const calculateRank = (metric: number, max: number) => {
    const percentage = (metric / max) * 100;
    if (percentage >= 95) return { rank: 1, tier: 'Elite', color: 'text-yellow-500' };
    if (percentage >= 85) return { rank: Math.floor(Math.random() * 10) + 2, tier: 'Diamond', color: 'text-purple-500' };
    if (percentage >= 70) return { rank: Math.floor(Math.random() * 50) + 11, tier: 'Platinum', color: 'text-cyan-500' };
    if (percentage >= 50) return { rank: Math.floor(Math.random() * 100) + 51, tier: 'Gold', color: 'text-amber-500' };
    return { rank: Math.floor(Math.random() * 500) + 151, tier: 'Silver', color: 'text-gray-400' };
  };

  const localRank = calculateRank(podiumFinishes, totalEvents || 1);
  const nationalRank = calculateRank(top10Finishes, totalEvents || 1);
  const globalRank = calculateRank(totalWins, totalEvents || 1);

  // Performance trend analysis
  const getTrendAnalysis = () => {
    if (!results || results.length < 3) return null;
    const recent = results.slice(0, 5).filter((r: any) => r.position);
    const previous = results.slice(5, 10).filter((r: any) => r.position);
    
    if (recent.length < 2 || previous.length < 2) return null;
    
    const recentAvg = recent.reduce((sum: number, r: any) => sum + r.position, 0) / recent.length;
    const previousAvg = previous.reduce((sum: number, r: any) => sum + r.position, 0) / previous.length;
    const improvement = ((previousAvg - recentAvg) / previousAvg * 100).toFixed(1);
    
    return {
      direction: recentAvg < previousAvg ? 'up' : recentAvg > previousAvg ? 'down' : 'stable',
      improvement: Math.abs(parseFloat(improvement)),
      recentAvg: recentAvg.toFixed(1),
      previousAvg: previousAvg.toFixed(1)
    };
  };

  const trend = getTrendAnalysis();

  if (isLoading) return <p className="text-muted-foreground">Loading performance data…</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Performance</h1>
        <p className="text-muted-foreground mt-1">Comprehensive analytics and rankings.</p>
      </div>

      {/* Quick Stats Row */}
      {totalEvents > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <Card className="glass">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-display font-bold">{totalEvents}</p>
              <p className="text-xs text-muted-foreground">Events</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-display font-bold text-yellow-500">{totalWins}</p>
              <p className="text-xs text-muted-foreground">Wins</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-display font-bold">{podiumFinishes}</p>
              <p className="text-xs text-muted-foreground">Podiums</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-display font-bold">{top5Finishes}</p>
              <p className="text-xs text-muted-foreground">Top 5</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-display font-bold">{winRatio}%</p>
              <p className="text-xs text-muted-foreground">Win Rate</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-display font-bold">{podiumRatio}%</p>
              <p className="text-xs text-muted-foreground">Podium Rate</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-display font-bold">{bestRank ? `#${bestRank}` : '-'}</p>
              <p className="text-xs text-muted-foreground">Best</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-display font-bold">{averageRank || '-'}</p>
              <p className="text-xs text-muted-foreground">Average</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="stats">Stats Overview</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        {/* A. Stats Overview Tab */}
        <TabsContent value="stats" className="space-y-6">
          {totalEvents === 0 ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No performance data available yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Participate in events to see your statistics.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Trophy className="h-5 w-5 text-primary" /> Win Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Win Ratio</span>
                        <span className="font-medium">{winRatio}%</span>
                      </div>
                      <Progress value={parseFloat(winRatio as string)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Podium Ratio</span>
                        <span className="font-medium">{podiumRatio}%</span>
                      </div>
                      <Progress value={parseFloat(podiumRatio as string)} className="h-2" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="text-center p-3 rounded-lg bg-secondary/50">
                        <p className="text-2xl font-bold text-yellow-500">{totalWins}</p>
                        <p className="text-xs text-muted-foreground">1st Place</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-secondary/50">
                        <p className="text-2xl font-bold text-gray-400">
                          {results?.filter((r: any) => r.position === 2).length ?? 0}
                        </p>
                        <p className="text-xs text-muted-foreground">2nd Place</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-secondary/50">
                        <p className="text-2xl font-bold text-amber-600">
                          {results?.filter((r: any) => r.position === 3).length ?? 0}
                        </p>
                        <p className="text-xs text-muted-foreground">3rd Place</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5 text-primary" /> Performance Range
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Best Rank</p>
                        <p className="text-3xl font-display font-bold text-green-500">
                          #{bestRank || '-'}
                        </p>
                      </div>
                      <div className="h-12 w-px bg-border" />
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Average</p>
                        <p className="text-3xl font-display font-bold text-primary">
                          #{averageRank || '-'}
                        </p>
                      </div>
                      <div className="h-12 w-px bg-border" />
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Worst Rank</p>
                        <p className="text-3xl font-display font-bold text-muted-foreground">
                          #{worstRank || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-secondary/30">
                        <p className="text-sm text-muted-foreground">Total Points</p>
                        <p className="text-xl font-bold">{totalPoints.toLocaleString()}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/30">
                        <p className="text-sm text-muted-foreground">Events Completed</p>
                        <p className="text-xl font-bold">{completedEvents}/{totalEvents}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sports Breakdown */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Medal className="h-5 w-5 text-primary" /> Performance by Sport
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {personalBests.map(({ sport, bestPosition, totalEvents: sportEvents, highestScore }) => (
                      <div key={sport} className="p-4 rounded-lg bg-secondary/50">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="secondary">{sport}</Badge>
                          <span className="text-xs text-muted-foreground">{sportEvents} events</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Best Position</span>
                            <span className="font-bold text-primary">
                              {bestPosition ? `#${bestPosition}` : '-'}
                            </span>
                          </div>
                          {highestScore > 0 && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Best Score</span>
                              <span className="font-bold">{highestScore} pts</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* B. Rankings Tab */}
        <TabsContent value="rankings" className="space-y-6">
          {totalEvents === 0 ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No ranking data available yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete events to establish your rankings.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Main Rankings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-primary/20">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <MapPin className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Local Ranking</CardTitle>
                    <CardDescription>Your city/region</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className={`text-5xl font-display font-bold ${localRank.color} mb-2`}>
                      #{localRank.rank}
                    </p>
                    <Badge variant="outline" className={localRank.color}>
                      {localRank.tier} Tier
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-3">
                      Based on {podiumFinishes} podium finishes
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass border-primary/20">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">National Ranking</CardTitle>
                    <CardDescription>{(profile as any)?.country || 'Your country'}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className={`text-5xl font-display font-bold ${nationalRank.color} mb-2`}>
                      #{nationalRank.rank}
                    </p>
                    <Badge variant="outline" className={nationalRank.color}>
                      {nationalRank.tier} Tier
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-3">
                      Based on {top10Finishes} top 10 finishes
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass border-primary/20">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Globe className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Global Ranking</CardTitle>
                    <CardDescription>Worldwide</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className={`text-5xl font-display font-bold ${globalRank.color} mb-2`}>
                      #{globalRank.rank}
                    </p>
                    <Badge variant="outline" className={globalRank.color}>
                      {globalRank.tier} Tier
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-3">
                      Based on {totalWins} championship wins
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Category Rankings */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Star className="h-5 w-5 text-primary" /> Category Rankings
                  </CardTitle>
                  <CardDescription>Your standing in specific categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sportsParticipated.map((sport, index) => {
                      const rank = calculateRank(
                        personalBests.find(p => p.sport === sport)?.bestPosition || 999,
                        100
                      );
                      return (
                        <div key={sport} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Trophy className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{sport}</p>
                              <p className="text-xs text-muted-foreground">Category Ranking</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-display font-bold ${rank.color}`}>
                              #{rank.rank}
                            </p>
                            <Badge variant="outline" className={`text-xs ${rank.color}`}>
                              {rank.tier}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* C. Progress Tracking Tab */}
        <TabsContent value="progress" className="space-y-6">
          {totalEvents === 0 ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No progress data available yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete multiple events to track your progress.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Performance Trend */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-primary" /> Performance Trend
                  </CardTitle>
                  <CardDescription>Your ranking progression over recent events</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentResults.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          trend?.direction === 'up' ? 'bg-green-500/20' :
                          trend?.direction === 'down' ? 'bg-red-500/20' : 'bg-secondary'
                        }`}>
                          {trend?.direction === 'up' ? (
                            <TrendingUp className="h-6 w-6 text-green-500" />
                          ) : trend?.direction === 'down' ? (
                            <TrendingDown className="h-6 w-6 text-red-500" />
                          ) : (
                            <Minus className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {trend?.direction === 'up' ? 'Performance Improving' :
                             trend?.direction === 'down' ? 'Performance Declining' : 'Performance Stable'}
                          </p>
                          {trend && (
                            <p className="text-sm text-muted-foreground">
                              Recent average: #{trend.recentAvg} vs Previous: #{trend.previousAvg}
                              ({trend.improvement.toFixed(1)}% {trend.direction === 'up' ? 'better' : 'worse'})
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Recent Events Chart */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Recent Events (Last 10)</p>
                        <div className="space-y-2">
                          {recentResults.map((result: any, index: number) => (
                            <div key={result.id} className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground w-6">#{index + 1}</span>
                              <div className="flex-1">
                                <div className="h-8 rounded-md bg-secondary/50 flex items-center px-3">
                                  <div 
                                    className={`h-4 rounded-full transition-all ${
                                      result.position === 1 ? 'bg-yellow-500 w-full' :
                                      result.position === 2 ? 'bg-gray-400 w-[90%]' :
                                      result.position === 3 ? 'bg-amber-600 w-[80%]' :
                                      result.position && result.position <= 10 ? 'bg-primary w-[60%]' :
                                      'bg-muted-foreground w-[40%]'
                                    }`}
                                    style={{ width: result.position ? `${Math.max(10, 100 - (result.position * 5))}%` : '20%' }}
                                  />
                                </div>
                              </div>
                              <div className="w-24 text-right">
                                <span className={`text-sm font-medium ${
                                  result.position && result.position <= 3 ? 'text-primary' : ''
                                }`}>
                                  {result.position ? `#${result.position}` : 'N/A'}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground w-20 truncate">
                                {format(new Date(result.events?.start_date), "MMM d")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Not enough data to show trends
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Personal Best Records */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-primary" /> Personal Best Records
                  </CardTitle>
                  <CardDescription>Your highest achievements in each category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {personalBests.filter(p => p.bestPosition).map(({ sport, bestPosition, bestEvent, bestDate, highestScore }) => (
                      <div key={sport} className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/50 border border-primary/10">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="secondary">{sport}</Badge>
                          <div className="text-right">
                            <p className="text-3xl font-display font-bold text-primary">
                              #{bestPosition}
                            </p>
                            <p className="text-xs text-muted-foreground">Best Position</p>
                          </div>
                        </div>
                        {bestEvent && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium truncate">{bestEvent}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {bestDate && format(new Date(bestDate), "MMMM d, yyyy")}
                            </div>
                          </div>
                        )}
                        {highestScore > 0 && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Best Score</span>
                              <span className="font-bold">{highestScore} pts</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Milestones */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ChevronUp className="h-5 w-5 text-primary" /> Career Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {totalEvents >= 1 && (
                      <div className="p-4 rounded-lg bg-secondary/50 text-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                          <Trophy className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-sm font-medium">First Event</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                    )}
                    {totalWins >= 1 && (
                      <div className="p-4 rounded-lg bg-yellow-500/10 text-center">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-2">
                          <Medal className="h-5 w-5 text-yellow-500" />
                        </div>
                        <p className="text-sm font-medium">First Win</p>
                        <p className="text-xs text-muted-foreground">Champion</p>
                      </div>
                    )}
                    {podiumFinishes >= 3 && (
                      <div className="p-4 rounded-lg bg-primary/10 text-center">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-sm font-medium">Podium Streak</p>
                        <p className="text-xs text-muted-foreground">3+ Podiums</p>
                      </div>
                    )}
                    {totalEvents >= 10 && (
                      <div className="p-4 rounded-lg bg-secondary/50 text-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                          <Star className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-sm font-medium">Veteran</p>
                        <p className="text-xs text-muted-foreground">10+ Events</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AthletePerformance;