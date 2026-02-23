import { useState, useEffect, useMemo } from "react";
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
  Eye,
  Trash2,
  RefreshCw
} from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  getMatches,
  getTournamentGroups,
  getGroupStandings,
  getVenues,
  createMatch,
  updateMatch,
  updateMatchResult,
  createTournamentGroup,
  deleteTournamentGroup,
  createGroupWithMatches,
  generateKnockoutBracket,
  publishResults,
  subscribeToMatches,
  subscribeToGroups,
  type Match,
  type TournamentGroup,
  type GroupStanding,
  type Venue
} from "@/lib/scheduling-api";

interface GroupWithStandings extends TournamentGroup {
  standings: GroupStanding[];
  participants: { athlete_id: string; athlete_name: string; seed_number: number | null }[];
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
  const [selectedWinner, setSelectedWinner] = useState<string>("");
  
  // Dialog states
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [createMatchOpen, setCreateMatchOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);
  
  // Create match form state
  const [newMatch, setNewMatch] = useState({
    round: "",
    position: 1,
    athlete1_id: "",
    athlete2_id: "",
    scheduled_time: "",
    venue_id: "",
    group_id: ""
  });

  const { data: events } = useQuery({
    queryKey: ["organizer-scheduling-events", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("organizer_id", user!.id)
        .in("status", ["published", "ongoing", "completed"])
        .order("start_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: venues } = useQuery({
    queryKey: ["organizer-venues", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return getVenues(user.id);
    },
    enabled: !!user,
  });

  const { data: registrations } = useQuery({
    queryKey: ["organizer-scheduling-registrations", selectedEvent],
    queryFn: async () => {
      if (!selectedEvent) return [];
      const { data, error } = await (supabase as any)
        .from("event_registrations")
        .select("*, profiles:athlete_id(id, full_name, avatar_url)")
        .eq("event_id", selectedEvent)
        .in("status", ["approved", "registered", "confirmed"]);
      if (error) throw error;
      return (data || []) as unknown as { id: string; athlete_id: string; profiles: { id: string; full_name: string; avatar_url: string | null } }[];
    },
    enabled: !!selectedEvent,
  });

  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ["organizer-matches", selectedEvent],
    queryFn: async () => {
      if (!selectedEvent) return [];
      return getMatches(selectedEvent);
    },
    enabled: !!selectedEvent,
  });

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ["organizer-groups", selectedEvent],
    queryFn: async () => {
      if (!selectedEvent) return [];
      const tournamentGroups = await getTournamentGroups(selectedEvent);
      
      // Fetch standings for each group
      const groupsWithStandings = await Promise.all(
        tournamentGroups.map(async (group) => {
          const standings = await getGroupStandings(group.id);
          const participants = group.group_participants?.map(gp => ({
            athlete_id: gp.athlete_id,
            athlete_name: gp.profiles?.full_name || 'Unknown',
            seed_number: gp.seed_number
          })) || [];
          
          return {
            ...group,
            standings,
            participants
          };
        })
      );
      
      return groupsWithStandings;
    },
    enabled: !!selectedEvent,
  });

  // Real-time subscriptions
  useEffect(() => {
    if (!selectedEvent) return;
    
    const matchesSubscription = subscribeToMatches(selectedEvent, (payload) => {
      queryClient.invalidateQueries({ queryKey: ["organizer-matches", selectedEvent] });
    });
    
    const groupsSubscription = subscribeToGroups(selectedEvent, (payload) => {
      queryClient.invalidateQueries({ queryKey: ["organizer-groups", selectedEvent] });
    });
    
    return () => {
      matchesSubscription.unsubscribe();
      groupsSubscription.unsubscribe();
    };
  }, [selectedEvent, queryClient]);

  const updateMatchResultMutation = useMutation({
    mutationFn: async () => {
      if (!selectedMatch || !score1 || !score2) return;
      
      const s1 = parseInt(score1);
      const s2 = parseInt(score2);
      let winnerId: string | null = null;
      
      if (s1 > s2) {
        winnerId = selectedMatch.athlete1_id;
      } else if (s2 > s1) {
        winnerId = selectedMatch.athlete2_id;
      }
      // If tie, winner_id remains null (draw)
      
      await updateMatchResult(selectedMatch.id, s1, s2, winnerId);
    },
    onSuccess: () => {
      toast({ title: "Match result saved!" });
      queryClient.invalidateQueries({ queryKey: ["organizer-matches", selectedEvent] });
      queryClient.invalidateQueries({ queryKey: ["organizer-groups", selectedEvent] });
      setScoreDialogOpen(false);
      setSelectedMatch(null);
      setScore1("");
      setScore2("");
      setSelectedWinner("");
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to save result", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const publishResultsMutation = useMutation({
    mutationFn: async () => {
      if (!selectedEvent) return;
      await publishResults(selectedEvent);
    },
    onSuccess: () => {
      toast({ 
        title: "Results published!", 
        description: "Standings and results are now visible to participants" 
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to publish results", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const generateKnockoutMutation = useMutation({
    mutationFn: async () => {
      if (!selectedEvent || !user?.id || !registrations) return;
      
      const athleteIds = registrations.map(r => r.athlete_id);
      if (athleteIds.length < 2) {
        throw new Error("Need at least 2 participants to generate bracket");
      }
      
      const startTime = new Date();
      startTime.setDate(startTime.getDate() + 1);
      
      await generateKnockoutBracket(
        selectedEvent,
        user.id,
        athleteIds,
        startTime.toISOString()
      );
    },
    onSuccess: () => {
      toast({ 
        title: "Knockout bracket generated!", 
        description: "Tournament bracket has been created" 
      });
      queryClient.invalidateQueries({ queryKey: ["organizer-matches", selectedEvent] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to generate bracket", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const createGroupMutation = useMutation({
    mutationFn: async () => {
      if (!selectedEvent || !user?.id || selectedAthletes.length < 2) {
        throw new Error("Need at least 2 athletes to create a group");
      }
      
      await createGroupWithMatches(
        selectedEvent,
        user.id,
        groupName || `Group ${String.fromCharCode(65 + (groups?.length || 0))}`,
        selectedAthletes
      );
    },
    onSuccess: () => {
      toast({ title: "Group created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["organizer-groups", selectedEvent] });
      queryClient.invalidateQueries({ queryKey: ["organizer-matches", selectedEvent] });
      setCreateGroupOpen(false);
      setGroupName("");
      setSelectedAthletes([]);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create group", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      await deleteTournamentGroup(groupId);
    },
    onSuccess: () => {
      toast({ title: "Group deleted" });
      queryClient.invalidateQueries({ queryKey: ["organizer-groups", selectedEvent] });
      queryClient.invalidateQueries({ queryKey: ["organizer-matches", selectedEvent] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to delete group", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const createMatchMutation = useMutation({
    mutationFn: async () => {
      if (!selectedEvent || !user?.id) throw new Error("Missing required data");
      if (!newMatch.athlete1_id || !newMatch.athlete2_id) {
        throw new Error("Please select both athletes");
      }
      if (newMatch.athlete1_id === newMatch.athlete2_id) {
        throw new Error("Athletes must be different");
      }
      
      const athlete1 = registrations?.find(r => r.athlete_id === newMatch.athlete1_id);
      const athlete2 = registrations?.find(r => r.athlete_id === newMatch.athlete2_id);
      const venue = venues?.find(v => v.id === newMatch.venue_id);
      
      await createMatch({
        event_id: selectedEvent,
        organizer_id: user.id,
        group_id: newMatch.group_id || null,
        round: newMatch.round || "Custom",
        position: newMatch.position,
        athlete1_id: newMatch.athlete1_id,
        athlete2_id: newMatch.athlete2_id,
        athlete1_name: athlete1?.profiles?.full_name || "Unknown",
        athlete2_name: athlete2?.profiles?.full_name || "Unknown",
        winner_id: null,
        score1: null,
        score2: null,
        scheduled_time: newMatch.scheduled_time || null,
        venue_id: newMatch.venue_id || null,
        venue_name: venue?.name || null,
        status: "scheduled"
      });
    },
    onSuccess: () => {
      toast({ title: "Match created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["organizer-matches", selectedEvent] });
      setCreateMatchOpen(false);
      setNewMatch({
        round: "",
        position: 1,
        athlete1_id: "",
        athlete2_id: "",
        scheduled_time: "",
        venue_id: "",
        group_id: ""
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create match", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const openScoreDialog = (match: Match) => {
    setSelectedMatch(match);
    setScore1(match.score1?.toString() || "");
    setScore2(match.score2?.toString() || "");
    setSelectedWinner(match.winner_id || "");
    setScoreDialogOpen(true);
  };

  // Organize matches by round for bracket view
  const matchesByRound = useMemo(() => {
    if (!matches) return {};
    const grouped: Record<string, Match[]> = {};
    matches.forEach(match => {
      if (!grouped[match.round]) {
        grouped[match.round] = [];
      }
      grouped[match.round].push(match);
    });
    // Sort each round by position
    Object.keys(grouped).forEach(round => {
      grouped[round].sort((a, b) => a.position - b.position);
    });
    return grouped;
  }, [matches]);

  const roundOrder = ['Round of 16', 'Quarter Finals', 'Semi Finals', 'Final', 'Group Stage'];

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
    const rounds = Object.keys(matchesByRound).sort((a, b) => {
      const indexA = roundOrder.indexOf(a);
      const indexB = roundOrder.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
    
    if (rounds.length === 0) {
      return (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No matches created yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Generate a knockout bracket or create matches manually
          </p>
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <div className="flex gap-8 min-w-max p-4">
          {rounds.map((round) => (
            <div key={round} className="flex flex-col gap-4">
              <h3 className="font-semibold text-center text-muted-foreground">{round}</h3>
              <div className="flex flex-col gap-6 justify-center flex-1">
                {matchesByRound[round]?.map((match) => (
                  <div 
                    key={match.id} 
                    className={`w-64 p-3 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                      match.status === 'completed' ? 'bg-green-500/5 border-green-500/20' : 'bg-card border-border'
                    }`}
                    onClick={() => openScoreDialog(match)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      {getStatusBadge(match.status)}
                      {match.venue_name && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {match.venue_name}
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
                        {format(parseISO(match.scheduled_time), "MMM d, h:mm a")}
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

  const renderGroups = () => {
    if (groupsLoading) {
      return <p className="text-muted-foreground">Loading groups...</p>;
    }
    
    if (!groups || groups.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No groups created yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create groups and add participants to start the group stage
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups?.map((group) => (
          <Card key={group.id} className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{group.name}</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive"
                onClick={() => deleteGroupMutation.mutate(group.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
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
                    {group.standings?.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-4 text-center text-muted-foreground">
                          No matches completed yet
                        </td>
                      </tr>
                    ) : (
                      group.standings?.map((standing, index) => (
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Participants list */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-2">Participants</p>
                <div className="flex flex-wrap gap-2">
                  {group.participants?.map((p) => (
                    <Badge key={p.athlete_id} variant="secondary">
                      {p.athlete_name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderSchedule = () => {
    // Sort matches by scheduled time
    const sortedMatches = [...(matches || [])].sort((a, b) => {
      if (!a.scheduled_time && !b.scheduled_time) return 0;
      if (!a.scheduled_time) return 1;
      if (!b.scheduled_time) return -1;
      return new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime();
    });
    
    if (sortedMatches.length === 0) {
      return (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No matches scheduled yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create matches to build the event schedule
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {sortedMatches.map((match) => (
          <Card key={match.id} className="glass">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[80px]">
                    <p className="text-sm font-medium">
                      {match.scheduled_time ? format(parseISO(match.scheduled_time), "h:mm a") : 'TBD'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {match.scheduled_time ? format(parseISO(match.scheduled_time), "MMM d") : ''}
                    </p>
                  </div>
                  <div className="h-12 w-px bg-border hidden md:block" />
                  <div>
                    <p className="font-medium">{match.athlete1_name || 'TBD'} vs {match.athlete2_name || 'TBD'}</p>
                    <p className="text-sm text-muted-foreground">{match.round}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {match.venue_name && (
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="h-3 w-3" />
                      {match.venue_name}
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
  };

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
        <div className="flex items-center gap-2 flex-wrap">
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
          <Button 
            variant="outline" 
            onClick={() => generateKnockoutMutation.mutate()}
            disabled={generateKnockoutMutation.isPending || !registrations || registrations.length < 2}
          >
            <Target className="h-4 w-4 mr-2" />
            Generate Bracket
          </Button>
          <Button 
            onClick={() => publishResultsMutation.mutate()}
            disabled={publishResultsMutation.isPending}
          >
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
              <div className="flex items-center gap-2">
                {(!registrations || registrations.length < 2) && (
                  <span className="text-xs text-muted-foreground">
                    Need 2+ participants
                  </span>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    console.log("Add Match clicked, registrations:", registrations);
                    setCreateMatchOpen(true);
                  }}
                  disabled={!registrations || registrations.length < 2}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Match
                </Button>
              </div>
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCreateGroupOpen(true)}
                disabled={!registrations || registrations.length < 2}
              >
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
              <div className="flex items-center gap-2">
                {(!registrations || registrations.length < 2) && (
                  <span className="text-xs text-muted-foreground">
                    Need 2+ participants
                  </span>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    console.log("Add Match clicked, registrations:", registrations);
                    setCreateMatchOpen(true);
                  }}
                  disabled={!registrations || registrations.length < 2}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Match
                </Button>
              </div>
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
              <Label>Winner (optional for draws)</Label>
              <Select value={selectedWinner} onValueChange={setSelectedWinner}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select winner (or leave for draw)" />
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
              onClick={() => updateMatchResultMutation.mutate()}
              disabled={!score1 || !score2 || updateMatchResultMutation.isPending}
            >
              {updateMatchResultMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Result
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Group Dialog */}
      <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Create a round-robin group and add participants
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Group Name</Label>
              <Input 
                value={groupName} 
                onChange={(e) => setGroupName(e.target.value)}
                placeholder={`Group ${String.fromCharCode(65 + (groups?.length || 0))}`}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Select Participants</Label>
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
                {registrations?.map((reg) => (
                  <label 
                    key={reg.athlete_id} 
                    className="flex items-center gap-3 p-2 hover:bg-secondary rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAthletes.includes(reg.athlete_id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAthletes([...selectedAthletes, reg.athlete_id]);
                        } else {
                          setSelectedAthletes(selectedAthletes.filter(id => id !== reg.athlete_id));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span>{reg.profiles?.full_name || 'Unknown'}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {selectedAthletes.length} athletes
              </p>
            </div>
            <Button 
              className="w-full" 
              onClick={() => createGroupMutation.mutate()}
              disabled={selectedAthletes.length < 2 || createGroupMutation.isPending}
            >
              {createGroupMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create Group & Generate Matches
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Match Dialog */}
      <Dialog open={createMatchOpen} onOpenChange={setCreateMatchOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Match</DialogTitle>
            <DialogDescription>
              Manually create a match between two athletes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Round/Stage</Label>
                <Input 
                  value={newMatch.round} 
                  onChange={(e) => setNewMatch({...newMatch, round: e.target.value})}
                  placeholder="e.g., Quarter Finals"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Position</Label>
                <Input 
                  type="number"
                  value={newMatch.position} 
                  onChange={(e) => setNewMatch({...newMatch, position: parseInt(e.target.value) || 1})}
                  className="mt-1"
                  min={1}
                />
              </div>
            </div>
            
            <div>
              <Label>Athlete 1</Label>
              <Select 
                value={newMatch.athlete1_id} 
                onValueChange={(value) => setNewMatch({...newMatch, athlete1_id: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select athlete" />
                </SelectTrigger>
                <SelectContent>
                  {registrations?.map((reg) => (
                    <SelectItem 
                      key={reg.athlete_id} 
                      value={reg.athlete_id}
                      disabled={reg.athlete_id === newMatch.athlete2_id}
                    >
                      {reg.profiles?.full_name || 'Unknown'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Athlete 2</Label>
              <Select 
                value={newMatch.athlete2_id} 
                onValueChange={(value) => setNewMatch({...newMatch, athlete2_id: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select athlete" />
                </SelectTrigger>
                <SelectContent>
                  {registrations?.map((reg) => (
                    <SelectItem 
                      key={reg.athlete_id} 
                      value={reg.athlete_id}
                      disabled={reg.athlete_id === newMatch.athlete1_id}
                    >
                      {reg.profiles?.full_name || 'Unknown'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Scheduled Time</Label>
              <Input 
                type="datetime-local"
                value={newMatch.scheduled_time} 
                onChange={(e) => setNewMatch({...newMatch, scheduled_time: e.target.value})}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Venue (optional)</Label>
              <Select 
                value={newMatch.venue_id} 
                onValueChange={(value) => setNewMatch({...newMatch, venue_id: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select venue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No venue</SelectItem>
                  {venues?.map((venue) => (
                    <SelectItem key={venue.id} value={venue.id}>
                      {venue.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Group (optional)</Label>
              <Select 
                value={newMatch.group_id} 
                onValueChange={(value) => setNewMatch({...newMatch, group_id: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No group</SelectItem>
                  {groups?.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full" 
              onClick={() => createMatchMutation.mutate()}
              disabled={!newMatch.athlete1_id || !newMatch.athlete2_id || createMatchMutation.isPending}
            >
              {createMatchMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create Match
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerScheduling;