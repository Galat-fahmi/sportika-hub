import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { 
  Trophy, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Swords,
  ChevronRight,
  ChevronLeft,
  Save,
  Share2,
  Trophy as TrophyIcon,
  Medal,
  Target,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit3,
  Eye
} from "lucide-react";
import { format } from "date-fns";

interface Match {
  id: string;
  event_id: string;
  round: string;
  position: number;
  athlete1_id: string | null;
  athlete2_id: string | null;
  athlete1_name?: string;
  athlete2_name?: string;
  winner_id: string | null;
  score1: number | null;
  score2: number | null;
  scheduled_time: string | null;
  venue: string | null;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

interface Group {
  id: string;
  name: string;
  athletes: string[];
  standings: {
    athlete_id: string;
    athlete_name: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    points: number;
  }[];
}

const OrganizerScheduling = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [activeTab, setActiveTab] = useState("brackets");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");

  const { data: events } = useQuery({
    queryKey: ["organizer-scheduling-events", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("organizer_id", user!.id)
        .in("status", ["published", "ongoing"])
        .order("start_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: registrations } = useQuery({
    queryKey: ["organizer-scheduling-registrations", selectedEvent],
    queryFn: async () => {
      if (!selectedEvent) return [];
      const { data, error } = await supabase
        .from("event_registrations")
        .select("*, profiles:athlete_id(full_name)")
        .eq("event_id", selectedEvent)
        .eq("status", "registered");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedEvent,
  });

  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ["organizer-matches", selectedEvent],
    queryFn: async () => {
      if (!selectedEvent) return [];
      // Mock data for demonstration
      const mockMatches: Match[] = [
        {
          id: '1',
          event_id: selectedEvent,
          round: 'Quarter Finals',
          position: 1,
          athlete1_id: 'a1',
          athlete2_id: 'a2',
          athlete1_name: 'John Smith',
          athlete2_name: 'Mike Johnson',
          winner_id: null,
          score1: null,
          score2: null,
          scheduled_time: new Date().toISOString(),
          venue: 'Court A',
          status: 'scheduled',
        },
        {
          id: '2',
          event_id: selectedEvent,
          round: 'Quarter Finals',
          position: 2,
          athlete1_id: 'a3',
          athlete2_id: 'a4',
          athlete1_name: 'David Lee',
          athlete2_name: 'Chris Brown',
          winner_id: 'a3',
          score1: 21,
          score2: 15,
          scheduled_time: new Date(Date.now() - 3600000).toISOString(),
          venue: 'Court B',
          status: 'completed',
        },
        {
          id: '3',
          event_id: selectedEvent,
          round: 'Semi Finals',
          position: 1,
          athlete1_id: null,
          athlete2_id: 'a3',
          athlete1_name: 'TBD',
          athlete2_name: 'David Lee',
          winner_id: null,
          score1: null,
          score2: null,
          scheduled_time: null,
          venue: 'Main Court',
          status: 'scheduled',
        },
      ];
      return mockMatches;
    },
    enabled: !!selectedEvent,
  });

  const { data: groups } = useQuery({
    queryKey: ["organizer-groups", selectedEvent],
    queryFn: async () => {
      if (!selectedEvent) return [];
      // Mock group data
      const mockGroups: Group[] = [
        {
          id: 'g1',
          name: 'Group A',
          athletes: ['a1', 'a2', 'a3', 'a4'],
          standings: [
            { athlete_id: 'a1', athlete_name: 'John Smith', played: 3, wins: 3, draws: 0, losses: 0, points: 9 },
            { athlete_id: 'a2', athlete_name: 'Mike Johnson', played: 3, wins: 2, draws: 0, losses: 1, points: 6 },
            { athlete_id: 'a3', athlete_name: 'David Lee', played: 3, wins: 1, draws: 0, losses: 2, points: 3 },
            { athlete_id: 'a4', athlete_name: 'Chris Brown', played: 3, wins: 0, draws: 0, losses: 3, points: 0 },
          ],
        },
        {
          id: 'g2',
          name: 'Group B',
          athletes: ['a5', 'a6', 'a7', 'a8'],
          standings: [
            { athlete_id: 'a5', athlete_name: 'Alex Wilson', played: 3, wins: 2, draws: 1, losses: 0, points: 7 },
            { athlete_id: 'a6', athlete_name: 'Sam Taylor', played: 3, wins: 2, draws: 0, losses: 1, points: 6 },
            { athlete_id: 'a7', athlete_name: 'Jordan Lee', played: 3, wins: 1, draws: 1, losses: 1, points: 4 },
            { athlete_id: 'a8', athlete_name: 'Casey Kim', played: 3, wins: 0, draws: 0, losses: 3, points: 0 },
          ],
        },
      ];
      return mockGroups;
    },
    enabled: !!selectedEvent,
  });

  const updateMatchResult = useMutation({
    mutationFn: async () => {
      if (!selectedMatch) return;
      // In real app, update database
      toast({ title: "Match result saved!" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-matches"] });
      setScoreDialogOpen(false);
      setSelectedMatch(null);
      setScore1("");
      setScore2("");
    },
  });

  const publishResults = useMutation({
    mutationFn: async () => {
      toast({ title: "Results published!", description: "Standings and results are now visible to participants" });
    },
  });

  const generateStandings = useMutation({
    mutationFn: async () => {
      toast({ title: "Standings generated!", description: "Auto-calculated from match results" });
    },
  });

  const openScoreDialog = (match: Match) => {
    setSelectedMatch(match);
    setScore1(match.score1?.toString() || "");
    setScore2(match.score2?.toString() || "");
    setScoreDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'ongoing':
        return <Badge className="bg-primary/20 text-primary"><Swords className="h-3 w-3 mr-1" /> Ongoing</Badge>;
      case 'scheduled':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderBracket = () => {
    const rounds = [...new Set(matches?.map(m => m.round))];
    
    return (
      <div className="overflow-x-auto">
        <div className="flex gap-8 min-w-max p-4">
          {rounds.map((round, roundIndex) => (
            <div key={round} className="flex flex-col gap-4">
              <h3 className="font-semibold text-center text-muted-foreground">{round}</h3>
              <div className="flex flex-col gap-6 justify-center flex-1">
                {matches?.filter(m => m.round === round).map((match) => (
                  <div 
                    key={match.id} 
                    className={`w-64 p-3 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                      match.status === 'completed' ? 'bg-green-500/5 border-green-500/20' : 'bg-card border-border'
                    }`}
                    onClick={() => openScoreDialog(match)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      {getStatusBadge(match.status)}
                      {match.venue && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {match.venue}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className={`flex justify-between items-center p-2 rounded ${match.winner_id === match.athlete1_id ? 'bg-primary/10 font-medium' : 'bg-secondary/50'}`}>
                        <span className="truncate flex-1">{match.athlete1_name || 'TBD'}</span>
                        {match.score1 !== null && <span className="font-bold ml-2">{match.score1}</span>}
                      </div>
                      <div className={`flex justify-between items-center p-2 rounded ${match.winner_id === match.athlete2_id ? 'bg-primary/10 font-medium' : 'bg-secondary/50'}`}>
                        <span className="truncate flex-1">{match.athlete2_name || 'TBD'}</span>
                        {match.score2 !== null && <span className="font-bold ml-2">{match.score2}</span>}
                      </div>
                    </div>
                    {match.scheduled_time && (
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        {format(new Date(match.scheduled_time), "MMM d, h:mm a")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGroups = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {groups?.map((group) => (
        <Card key={group.id} className="glass">
          <CardHeader>
            <CardTitle className="text-lg">{group.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground border-b">
                    <th className="pb-2">#</th>
                    <th className="pb-2">Athlete</th>
                    <th className="pb-2 text-center">P</th>
                    <th className="pb-2 text-center">W</th>
                    <th className="pb-2 text-center">D</th>
                    <th className="pb-2 text-center">L</th>
                    <th className="pb-2 text-center">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {group.standings.map((standing, index) => (
                    <tr key={standing.athlete_id} className="border-b last:border-0">
                      <td className="py-3">
                        {index === 0 && <Medal className="h-4 w-4 text-yellow-500" />}
                        {index === 1 && <Medal className="h-4 w-4 text-gray-400" />}
                        {index === 2 && <Medal className="h-4 w-4 text-amber-600" />}
                        {index > 2 && <span className="text-muted-foreground">{index + 1}</span>}
                      </td>
                      <td className="py-3 font-medium">{standing.athlete_name}</td>
                      <td className="py-3 text-center text-muted-foreground">{standing.played}</td>
                      <td className="py-3 text-center text-green-600">{standing.wins}</td>
                      <td className="py-3 text-center text-yellow-600">{standing.draws}</td>
                      <td className="py-3 text-center text-red-600">{standing.losses}</td>
                      <td className="py-3 text-center font-bold">{standing.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-4">
      {matches?.map((match) => (
        <Card key={match.id} className="glass">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center min-w-[80px]">
                  <p className="text-sm font-medium">{match.scheduled_time ? format(new Date(match.scheduled_time), "h:mm a") : 'TBD'}</p>
                  <p className="text-xs text-muted-foreground">{match.scheduled_time ? format(new Date(match.scheduled_time), "MMM d") : ''}</p>
                </div>
                <div className="h-12 w-px bg-border hidden md:block" />
                <div>
                  <p className="font-medium">{match.athlete1_name || 'TBD'} vs {match.athlete2_name || 'TBD'}</p>
                  <p className="text-sm text-muted-foreground">{match.round}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {match.venue && (
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="h-3 w-3" />
                    {match.venue}
                  </Badge>
                )}
                {getStatusBadge(match.status)}
                <Button size="sm" variant="outline" onClick={() => openScoreDialog(match)}>
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (!selectedEvent) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Scheduling & Results</h1>
          <p className="text-muted-foreground mt-1">Manage match brackets, schedules, and results.</p>
        </div>
        
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Select an event to manage scheduling and results</p>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-[300px] mx-auto">
                <SelectValue placeholder="Choose an event" />
              </SelectTrigger>
              <SelectContent>
                {events?.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Scheduling & Results</h1>
          <p className="text-muted-foreground mt-1">Manage match brackets, schedules, and results.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger className="w-[250px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {events?.map((e) => (
                <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => generateStandings.mutate()}>
            <Target className="h-4 w-4 mr-2" />
            Generate Standings
          </Button>
          <Button onClick={() => publishResults.mutate()}>
            <Share2 className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <Swords className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">{matches?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Total Matches</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">{matches?.filter(m => m.status === 'completed').length || 0}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">{matches?.filter(m => m.status === 'scheduled').length || 0}</p>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <Users className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">{registrations?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Participants</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="brackets">Match Brackets</TabsTrigger>
          <TabsTrigger value="groups">Group Stages</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="brackets" className="space-y-4">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tournament Bracket</CardTitle>
                <CardDescription>Knockout stage visualization</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Match
              </Button>
            </CardHeader>
            <CardContent>
              {matchesLoading ? (
                <p className="text-muted-foreground">Loading brackets...</p>
              ) : (
                renderBracket()
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Group Stage Standings</CardTitle>
                <CardDescription>Round-robin group tables</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Group
              </Button>
            </CardHeader>
            <CardContent>
              {renderGroups()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Match Schedule</CardTitle>
                <CardDescription>Time slots and venue assignments</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Time Slot
              </Button>
            </CardHeader>
            <CardContent>
              {renderSchedule()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Score Entry Dialog */}
      <Dialog open={scoreDialogOpen} onOpenChange={setScoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Match Result</DialogTitle>
            <DialogDescription>
              {selectedMatch?.round} - Update scores and winner
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{selectedMatch?.athlete1_name || 'Athlete 1'}</Label>
                <Input 
                  type="number" 
                  value={score1} 
                  onChange={(e) => setScore1(e.target.value)}
                  className="mt-1 text-center text-2xl"
                  placeholder="0"
                />
              </div>
              <div>
                <Label>{selectedMatch?.athlete2_name || 'Athlete 2'}</Label>
                <Input 
                  type="number" 
                  value={score2} 
                  onChange={(e) => setScore2(e.target.value)}
                  className="mt-1 text-center text-2xl"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label>Winner</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select winner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={selectedMatch?.athlete1_id || ''}>
                    {selectedMatch?.athlete1_name || 'Athlete 1'}
                  </SelectItem>
                  <SelectItem value={selectedMatch?.athlete2_id || ''}>
                    {selectedMatch?.athlete2_name || 'Athlete 2'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full" 
              onClick={() => updateMatchResult.mutate()}
              disabled={!score1 || !score2}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Result
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerScheduling;