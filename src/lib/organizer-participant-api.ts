import { supabase } from "@/integrations/supabase/client";

/**
 * Get participants for an event
 */
export const getEventParticipants = async (eventId: string) => {
  const { data, error } = await supabase
    .from('organizer_participants')
    .select(`
      *,
      athlete:profiles!organizer_participants_athlete_id_fkey(*)
    `)
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching event participants:', error);
    throw error;
  }

  return data;
};

/**
 * Update participant information
 */
export const updateParticipantInfo = async (
  participantId: string,
  updates: {
    status?: string;
    emergency_contact?: any;
    medical_conditions?: string[];
    waiver_signed?: boolean;
    checked_in?: boolean;
    bib_number?: string;
  }
) => {
  const { error } = await supabase
    .from('organizer_participants')
    .update(updates)
    .eq('id', participantId);

  if (error) {
    console.error('Error updating participant info:', error);
    throw error;
  }
};

/**
 * Remove participant from event
 */
export const removeParticipant = async (participantId: string) => {
  const { error } = await supabase
    .from('organizer_participants')
    .delete()
    .eq('id', participantId);

  if (error) {
    console.error('Error removing participant:', error);
    throw error;
  }
};

/**
 * Get organizer scheduling data
 */
export const getOrganizerScheduling = async (organizerId: string) => {
  const { data, error } = await supabase
    .from('organizer_scheduling')
    .select('*')
    .eq('organizer_id', organizerId)
    .order('schedule_date', { ascending: true });

  if (error) {
    console.error('Error fetching organizer scheduling:', error);
    throw error;
  }

  return data;
};

/**
 * Get event scheduling data
 */
export const getEventScheduling = async (eventId: string) => {
  const { data, error } = await supabase
    .from('organizer_scheduling')
    .select('*')
    .eq('event_id', eventId)
    .order('schedule_date', { ascending: true });

  if (error) {
    console.error('Error fetching event scheduling:', error);
    throw error;
  }

  return data;
};

/**
 * Update schedule item
 */
export const updateScheduleItem = async (
  scheduleId: string,
  updates: {
    name?: string;
    description?: string;
    schedule_date?: string;
    location?: string;
    duration_minutes?: number;
    capacity?: number;
    status?: string;
    results_published?: boolean;
  }
) => {
  const { error } = await supabase
    .from('organizer_scheduling')
    .update(updates)
    .eq('id', scheduleId);

  if (error) {
    console.error('Error updating schedule item:', error);
    throw error;
  }
};

/**
 * Get organizer settings
 */
export const getOrganizerSettings = async (organizerId: string) => {
  const { data, error } = await supabase
    .from('organizer_settings')
    .select('*')
    .eq('organizer_id', organizerId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
    console.error('Error fetching organizer settings:', error);
    throw error;
  }

  return data;
};

/**
 * Update organizer settings
 */
export const updateOrganizerSettings = async (
  organizerId: string,
  updates: {
    notification_preferences?: any;
    branding_settings?: any;
    payment_methods?: any;
    tax_settings?: any;
    privacy_settings?: any;
  }
) => {
  const { error } = await supabase
    .from('organizer_settings')
    .upsert({
      organizer_id: organizerId,
      ...updates
    }, { onConflict: 'organizer_id' });

  if (error) {
    console.error('Error updating organizer settings:', error);
    throw error;
  }
};

/**
 * Get organizer teams
 */
export const getOrganizerTeams = async (organizerId: string) => {
  const { data, error } = await supabase
    .from('organizer_teams')
    .select(`
      *,
      member:profiles!organizer_teams_member_id_fkey(*)
    `)
    .eq('organizer_id', organizerId);

  if (error) {
    console.error('Error fetching organizer teams:', error);
    throw error;
  }

  return data;
};

/**
 * Add team member
 */
export const addTeamMember = async (
  organizerId: string,
  memberId: string,
  role: string,
  name: string,
  permissions?: string[]
) => {
  const { error } = await supabase
    .from('organizer_teams')
    .insert({
      organizer_id: organizerId,
      member_id: memberId,
      role,
      name,
      permissions: permissions || []
    });

  if (error) {
    console.error('Error adding team member:', error);
    throw error;
  }
};