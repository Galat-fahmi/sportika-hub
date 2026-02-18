import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Medal, 
  Target, 
  TrendingUp, 
  Calendar, 
  Star,
  Award,
  BarChart3,
  ChevronRight,
  MapPin
} from "lucide-react";
import { format } from "date-fns";

const AthleteResults = () => {
  const { user } = useAuth();

  const { data: results, isLoading } = useQuery({
    queryKey: ["athlete-results-all", user?.id],
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

  // Calculate performance metrics
  const totalEvents = results?.length ?? 0;
  const completedEvents = results?.filter((r: any) => r.position !== null).length ?? 0;
  const totalWins = results?.filter((r: any) => r.position === 1).length ?? 0;
  const podiumFinishes = results?.filter((r: any) => r.position && r.position <= 3).length ?? 0;
  const top10Finishes = results?.filter((r: any) => r.position && r.position <= 10).length ?? 0;
  const totalPoints = results?.reduce((sum: number, r: any) => sum + (r.score || 0), 0) ?? 0;
  const bestRank = results?.length > 0 
    ? Math.min(...results.filter((r: any) => r.position).map((r: any) => r.position)) 
    : null;
  const averageRank = results?.length > 0 
    ? (results.filter((r: any) => r.position).reduce((sum: number, r: any) => sum + r.position, 0) / 
       results.filter((r: any) => r.position).length).toFixed(1)
    : null;

  // Get unique sports participated in
  const sportsParticipated = [...new Set(results?.map((r: any) => r.events?.sport).filter(Boolean))];

  // Group results by sport for analysis
  const resultsBySport = sportsParticipated.map(sport => {
    const sportResults = results?.filter((r: any) => r.events?.sport === sport) ?? [];
    const bestPosition = Math.min(...sportResults.filter((r: any) => r.position).map((r: any) => r.position));
    const avgPosition = sportResults.filter((r: any) => r.position).length > 0
      ? (sportResults.filter((r: any) => r.position).reduce((sum: number, r: any) => sum + r.position, 0) / 
         sportResults.filter((r: any) => r.position).length).toFixed(1)
      : '-';
    return { sport, count: sportResults.length, bestPosition, avgPosition };
  });

  const getPositionBadge = (position: number | null) => {
    if (!position) return <span className="text-muted-foreground">—</span>;
    if (position === 1) return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">🥇 1st</Badge>;
    if (position === 2) return <Badge className="bg-gray-400/20 text-gray-500 border-gray-400/30">🥈 2nd</Badge>;
    if (position === 3) return <Badge className="bg-amber-600/20 text-amber-700 border-amber-600/30">🥉 3rd</Badge>;
    if (position <= 10) return <Badge variant="outline" className="text-primary">#{position}</Badge>;
    return <Badge variant="secondary">#{position}</Badge>;
  };

  const getPerformanceTrend = () => {
    if (!results || results.length < 2) return null;
    const recentResults = results.slice(0, 5).filter((r: any) => r.position);
    if (recentResults.length < 2) return null;
    const avgRecent = recentResults.reduce((sum: number, r: any) => sum + r.position, 0) / recentResults.length;
    const olderResults = results.slice(5, 10).filter((r: any) => r.position);
    if (olderResults.length === 0) return null;
    const avgOlder = olderResults.reduce((sum: number, r: any) => sum + r.position, 0) / olderResults.length;
    
    if (avgRecent < avgOlder) return { trend: 'improving', text: 'Improving' };
    if (avgRecent > avgOlder) return { trend: 'declining', text: 'Declining' };
    return { trend: 'stable', text: 'Stable' };
  };

  const trend = getPerformanceTrend();

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Event History</h1>
        <p className="text-muted-foreground mt-1">Your complete competition history and performance analytics.</p>
      </div>

      {/* Performance Overview Cards */}
      {totalEvents > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-display font-bold">{totalEvents}</p>
              <p className="text-xs text-muted-foreground">Total Events</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <Medal className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-display font-bold">{totalWins}</p>
              <p className="text-xs text-muted-foreground">Wins</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-display font-bold">{podiumFinishes}</p>
              <p className="text-xs text-muted-foreground">Podiums</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-display font-bold">{top10Finishes}</p>
              <p className="text-xs text-muted-foreground">Top 10</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-display font-bold">{bestRank ? `#${bestRank}` : '-'}</p>
              <p className="text-xs text-muted-foreground">Best Rank</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-display font-bold">{averageRank || '-'}</p>
              <p className="text-xs text-muted-foreground">Avg Rank</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="history">Competition History</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        {/* Competition History Tab */}
        <TabsContent value="history" className="space-y-6">
          {/* Recent Achievements */}
          {podiumFinishes > 0 && (
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Medal className="h-5 w-5 text-primary" /> Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {results?.filter((r: any) => r.position && r.position <= 3).slice(0, 3).map((result: any) => (
                    <div key={result.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <div className="text-2xl">
                        {result.position === 1 && "🥇"}
                        {result.position === 2 && "🥈"}
                        {result.position === 3 && "🥉"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{result.events?.title}</p>
                        <p className="text-xs text-muted-foreground">{result.events?.sport}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(result.events?.start_date), "MMM yyyy")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Full History Table */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" /> Complete Event History
              </CardTitle>
              <CardDescription>All your competition results in chronological order</CardDescription>
            </CardHeader>
            <CardContent>
              {!results || results.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No competition results recorded yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Participate in events to see your results here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Sport</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((r: any) => (
                        <TableRow key={r.id} className="hover:bg-secondary/30">
                          <TableCell className="font-medium">
                            <div>
                              <p>{r.events?.title}</p>
                              {r.notes && (
                                <p className="text-xs text-muted-foreground">{r.notes}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">{r.events?.sport}</Badge>
                          </TableCell>
                          <TableCell>
                            {r.events?.start_date && format(new Date(r.events.start_date), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-muted-foreground text-sm">
                              <MapPin className="h-3 w-3" />
                              {r.events?.location || "—"}
                            </div>
                          </TableCell>
                          <TableCell>{getPositionBadge(r.position)}</TableCell>
                          <TableCell>
                            {r.score ? (
                              <span className="font-medium">{r.score} pts</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {r.position && (
                              <div className="flex items-center gap-1">
                                {r.position <= 3 ? (
                                  <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : r.position <= 10 ? (
                                  <TrendingUp className="h-4 w-4 text-primary" />
                                ) : (
                                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className={`text-xs ${
                                  r.position <= 3 ? 'text-green-600' : 
                                  r.position <= 10 ? 'text-primary' : 'text-muted-foreground'
                                }`}>
                                  {r.position <= 3 ? 'Excellent' : 
                                   r.position <= 10 ? 'Good' : 'Participated'}
                                </span>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {totalEvents === 0 ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No data available for analytics.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete some events to see your performance analytics.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Performance Trend */}
              {trend && (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5 text-primary" /> Performance Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`p-4 rounded-lg ${
                      trend.trend === 'improving' ? 'bg-green-500/10' :
                      trend.trend === 'declining' ? 'bg-red-500/10' : 'bg-secondary/50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          trend.trend === 'improving' ? 'bg-green-500/20' :
                          trend.trend === 'declining' ? 'bg-red-500/20' : 'bg-secondary'
                        }`}>
                          <TrendingUp className={`h-6 w-6 ${
                            trend.trend === 'improving' ? 'text-green-600' :
                            trend.trend === 'declining' ? 'text-red-600' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-lg">{trend.text}</p>
                          <p className="text-sm text-muted-foreground">
                            Based on your recent 5 events compared to previous performances
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Sport-wise Performance */}
              {sportsParticipated.length > 0 && (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5 text-primary" /> Performance by Sport
                    </CardTitle>
                    <CardDescription>Your rankings across different sports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {resultsBySport.map(({ sport, count, bestPosition, avgPosition }) => (
                        <div key={sport} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Trophy className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{sport}</p>
                              <p className="text-xs text-muted-foreground">{count} events participated</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <p className="text-lg font-display font-bold text-primary">
                                  #{bestPosition === Infinity ? '-' : bestPosition}
                                </p>
                                <p className="text-xs text-muted-foreground">Best</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-display font-bold">{avgPosition}</p>
                                <p className="text-xs text-muted-foreground">Average</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-lg">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium">
                        {completedEvents}/{totalEvents} events
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Events where final positions were recorded
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-lg">Podium Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500 rounded-full transition-all"
                            style={{ width: `${completedEvents > 0 ? (podiumFinishes / completedEvents) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium">
                        {completedEvents > 0 ? Math.round((podiumFinishes / completedEvents) * 100) : 0}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Percentage of events with podium finishes
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AthleteResults;
