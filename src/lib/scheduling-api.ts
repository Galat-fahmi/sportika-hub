import { supabase } from "@/integrations/supabase/client";

// Suppress TypeScript errors for new tables not yet in generated types
// These will be resolved when types are regenerated from the database
/* eslint-disable @typescript-eslint/no-explicit-any */

// Types
export interface Venue {
  id: string;
  organizer_id: string;
  name: string;
  description: string | null;
  address: string | null;
  capacity: number | null;
  facilities: string[] | null;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface TournamentGroup {
  id: string;
  event_id: string;
  organizer_id: string;
  name: string;
  stage: 'group' | 'knockout' | 'final';
  sort_order: number;
  created_at: string;
  updated_at: string;
  group_participants?: GroupParticipantWithProfile[];
}

export interface GroupParticipant {
  id: string;
  group_id: string;
  athlete_id: string;
  seed_number: number | null;
  created_at: string;
}

export interface GroupParticipantWithProfile extends GroupParticipant {
  profiles?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export interface GroupStanding {
  athlete_id: string;
  athlete_name: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  points_for: number;
  points_against: number;
  point_difference: number;
}

export interface Match {
  id: string;
  event_id: string;
  organizer_id: string;
  group_id: string | null;
  round: string;
  position: number;
  match_number: number | null;
  athlete1_id: string | null;
  athlete2_id: string | null;
  athlete1_name: string | null;
  athlete2_name: string | null;
  winner_id: string | null;
  score1: number | null;
  score2: number | null;
  score_details: any | null;
  scheduled_time: string | null;
  duration_minutes: number;
  venue_id: string | null;
  venue_name: string | null;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'postponed';
  next_match_id: string | null;
  next_match_position: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Helper to cast supabase client for new tables
const fromTable = (table: string) => {
  return (supabase as any).from(table);
};

// Venue API Functions
export const getVenues = async (organizerId: string) => {
  const { data, error } = await fromTable('venues')
    .select('*')
    .eq('organizer_id', organizerId)
    .order('name');
  
  if (error) throw error;
  return (data || []) as unknown as Venue[];
};

export const createVenue = async (venue: Omit<Venue, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await fromTable('venues')
    .insert(venue)
    .select()
    .single();
  
  if (error) throw error;
  return data as unknown as Venue;
};

export const updateVenue = async (id: string, updates: Partial<Venue>) => {
  const { data, error } = await fromTable('venues')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as unknown as Venue;
};

export const deleteVenue = async (id: string) => {
  const { error } = await fromTable('venues')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Tournament Group API Functions
export const getTournamentGroups = async (eventId: string) => {
  const { data, error } = await fromTable('tournament_groups')
    .select(`
      *,
      group_participants(
        *,
        profiles:athlete_id(id, full_name, avatar_url)
      )
    `)
    .eq('event_id', eventId)
    .order('sort_order');
  
  if (error) throw error;
  return (data || []) as unknown as TournamentGroup[];
};

export const createTournamentGroup = async (group: Omit<TournamentGroup, 'id' | 'created_at' | 'updated_at' | 'group_participants'>) => {
  const { data, error } = await fromTable('tournament_groups')
    .insert(group)
    .select()
    .single();
  
  if (error) throw error;
  return data as unknown as TournamentGroup;
};

export const updateTournamentGroup = async (id: string, updates: Partial<TournamentGroup>) => {
  const { data, error } = await fromTable('tournament_groups')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as unknown as TournamentGroup;
};

export const deleteTournamentGroup = async (id: string) => {
  const { error } = await fromTable('tournament_groups')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Group Participants API Functions
export const addGroupParticipant = async (participant: Omit<GroupParticipant, 'id' | 'created_at'>) => {
  const { data, error } = await fromTable('group_participants')
    .insert(participant)
    .select()
    .single();
  
  if (error) throw error;
  return data as unknown as GroupParticipant;
};

export const removeGroupParticipant = async (groupId: string, athleteId: string) => {
  const { error } = await fromTable('group_participants')
    .delete()
    .eq('group_id', groupId)
    .eq('athlete_id', athleteId);
  
  if (error) throw error;
};

// Group Standings API Functions
export const getGroupStandings = async (groupId: string): Promise<GroupStanding[]> => {
  const { data, error } = await (supabase as any)
    .rpc('calculate_group_standings', { p_group_id: groupId });
  
  if (error) throw error;
  return (data || []) as unknown as GroupStanding[];
};

// Match API Functions
export const getMatches = async (eventId: string) => {
  const { data, error } = await fromTable('matches')
    .select(`
      *,
      athlete1:athlete1_id(id, full_name, avatar_url),
      athlete2:athlete2_id(id, full_name, avatar_url),
      winner:winner_id(id, full_name),
      venue:venue_id(*)
    `)
    .eq('event_id', eventId)
    .order('scheduled_time', { ascending: true });
  
  if (error) throw error;
  return (data || []) as unknown as Match[];
};

export const getMatchesByGroup = async (groupId: string) => {
  const { data, error } = await fromTable('matches')
    .select(`
      *,
      athlete1:athlete1_id(id, full_name, avatar_url),
      athlete2:athlete2_id(id, full_name, avatar_url),
      winner:winner_id(id, full_name),
      venue:venue_id(*)
    `)
    .eq('group_id', groupId)
    .order('scheduled_time', { ascending: true });
  
  if (error) throw error;
  return (data || []) as unknown as Match[];
};

export const createMatch = async (match: Omit<Match, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await fromTable('matches')
    .insert(match)
    .select()
    .single();
  
  if (error) throw error;
  return data as unknown as Match;
};

export const updateMatch = async (id: string, updates: Partial<Match>) => {
  const { data, error } = await fromTable('matches')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as unknown as Match;
};

export const deleteMatch = async (id: string) => {
  const { error } = await fromTable('matches')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const updateMatchResult = async (
  matchId: string, 
  score1: number, 
  score2: number, 
  winnerId: string | null
) => {
  const { data, error } = await (supabase as any)
    .rpc('update_match_result', {
      p_match_id: matchId,
      p_score1: score1,
      p_score2: score2,
      p_winner_id: winnerId
    });
  
  if (error) throw error;
  return data as any;
};

// Generate knockout bracket
export const generateKnockoutBracket = async (
  eventId: string,
  organizerId: string,
  participantIds: string[],
  startTime?: string
) => {
  const { data, error } = await (supabase as any)
    .rpc('generate_knockout_bracket', {
      p_event_id: eventId,
      p_organizer_id: organizerId,
      p_participant_ids: participantIds,
      p_start_time: startTime
    });
  
  if (error) throw error;
  return (data || []) as unknown as { match_id: string; round: string; position: number }[];
};

// Real-time subscriptions
export const subscribeToMatches = (
  eventId: string, 
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`matches:${eventId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'matches',
        filter: `event_id=eq.${eventId}`
      } as any,
      callback
    )
    .subscribe();
};

export const subscribeToGroups = (
  eventId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`groups:${eventId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tournament_groups',
        filter: `event_id=eq.${eventId}`
      } as any,
      callback
    )
    .subscribe();
};

// Bulk operations
export const createGroupWithMatches = async (
  eventId: string,
  organizerId: string,
  groupName: string,
  athleteIds: string[]
) => {
  // Create group
  const { data: group, error: groupError } = await fromTable('tournament_groups')
    .insert({
      event_id: eventId,
      organizer_id: organizerId,
      name: groupName,
      stage: 'group'
    })
    .select()
    .single();
  
  if (groupError) throw groupError;
  
  // Add participants
  const participants = athleteIds.map((athleteId, index) => ({
    group_id: (group as any).id,
    athlete_id: athleteId,
    seed_number: index + 1
  }));
  
  const { error: participantsError } = await fromTable('group_participants')
    .insert(participants);
  
  if (participantsError) throw participantsError;
  
  // Generate round-robin matches
  const matches = [];
  for (let i = 0; i < athleteIds.length; i++) {
    for (let j = i + 1; j < athleteIds.length; j++) {
      matches.push({
        event_id: eventId,
        organizer_id: organizerId,
        group_id: (group as any).id,
        round: 'Group Stage',
        position: matches.length + 1,
        athlete1_id: athleteIds[i],
        athlete2_id: athleteIds[j],
        status: 'scheduled'
      });
    }
  }
  
  if (matches.length > 0) {
    const { error: matchesError } = await fromTable('matches')
      .insert(matches);
    
    if (matchesError) throw matchesError;
  }
  
  return group;
};

// Publish results
export const publishResults = async (eventId: string) => {
  // Update all completed matches to have results visible
  const { error } = await fromTable('matches')
    .update({ updated_at: new Date().toISOString() })
    .eq('event_id', eventId)
    .eq('status', 'completed');
  
  if (error) throw error;
  
  // Update event status if needed
  const { error: eventError } = await supabase
    .from('events')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', eventId);
  
  if (eventError) throw eventError;
};
