import { supabase } from "@/integrations/supabase/client";

// Organizer Dashboard API functions

/**
 * Get organizer dashboard overview data
 */
export const getOrganizerDashboardOverview = async (organizerId: string) => {
  const { data, error } = await supabase.rpc('get_organizer_dashboard_overview', {
    p_organizer_id: organizerId
  });

  if (error) {
    console.error('Error fetching organizer dashboard overview:', error);
    throw error;
  }

  return data;
};

/**
 * Update organizer stats manually
 */
export const updateOrganizerStats = async (organizerId: string) => {
  const { error } = await supabase.rpc('update_organizer_stats', {
    p_organizer_id: organizerId
  });

  if (error) {
    console.error('Error updating organizer stats:', error);
    throw error;
  }
};

/**
 * Get event analytics
 */
export const getEventAnalytics = async (eventId: string) => {
  const { data, error } = await supabase.rpc('get_event_analytics', {
    p_event_id: eventId
  });

  if (error) {
    console.error('Error fetching event analytics:', error);
    throw error;
  }

  return data;
};

/**
 * Calculate and update event analytics
 */
export const calculateEventAnalytics = async (eventId: string) => {
  const { error } = await supabase.rpc('calculate_event_analytics', {
    p_event_id: eventId
  });

  if (error) {
    console.error('Error calculating event analytics:', error);
    throw error;
  }
};

/**
 * Add a revenue transaction
 */
export const addRevenueTransaction = async (
  organizerId: string,
  eventId: string,
  transactionType: string,
  amount: number,
  description?: string,
  paymentMethod?: string,
  status?: string
) => {
  const { data, error } = await supabase.rpc('add_revenue_transaction', {
    p_organizer_id: organizerId,
    p_event_id: eventId,
    p_transaction_type: transactionType,
    p_amount: amount,
    p_description: description || '',
    p_payment_method: paymentMethod || 'credit_card',
    p_status: status || 'completed'
  });

  if (error) {
    console.error('Error adding revenue transaction:', error);
    throw error;
  }

  return data;
};

/**
 * Register a participant
 */
export const registerParticipant = async (
  organizerId: string,
  eventId: string,
  athleteId: string,
  emergencyContact?: any,
  medicalConditions?: string[],
  waiverSigned?: boolean
) => {
  const { data, error } = await supabase.rpc('register_participant', {
    p_organizer_id: organizerId,
    p_event_id: eventId,
    p_athlete_id: athleteId,
    p_emergency_contact: emergencyContact || {},
    p_medical_conditions: medicalConditions || [],
    p_waiver_signed: waiverSigned || false
  });

  if (error) {
    console.error('Error registering participant:', error);
    throw error;
  }

  return data;
};

/**
 * Send organizer notification
 */
export const sendOrganizerNotification = async (
  organizerId: string,
  eventId: string,
  type: string,
  title: string,
  message: string,
  priority?: string,
  metadata?: any
) => {
  const { data, error } = await supabase.rpc('send_organizer_notification', {
    p_organizer_id: organizerId,
    p_event_id: eventId,
    p_type: type,
    p_title: title,
    p_message: message,
    p_priority: priority || 'normal',
    p_metadata: metadata || {}
  });

  if (error) {
    console.error('Error sending organizer notification:', error);
    throw error;
  }

  return data;
};

/**
 * Get organizer revenue data
 */
export const getOrganizerRevenueData = async (organizerId: string) => {
  // Get organizer stats
  const stats = await getOrganizerDashboardOverview(organizerId);
  
  // Get revenue transactions
  const { data: revenueData, error: revenueError } = await supabase
    .from('organizer_revenue')
    .select('*')
    .eq('organizer_id', organizerId)
    .order('transaction_date', { ascending: false });

  if (revenueError) {
    console.error('Error fetching organizer revenue data:', revenueError);
    throw revenueError;
  }

  return {
    stats,
    revenue: revenueData
  };
};

/**
 * Get organizer participants
 */
export const getOrganizerParticipants = async (organizerId: string) => {
  const { data, error } = await supabase
    .from('organizer_participants')
    .select(`
      *,
      athlete:profiles!organizer_participants_athlete_id_fkey(*),
      event:events!organizer_participants_event_id_fkey(*)
    `)
    .eq('organizer_id', organizerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching organizer participants:', error);
    throw error;
  }

  return data;
};

/**
 * Update participant status
 */
export const updateParticipantStatus = async (participantId: string, status: string) => {
  const { error } = await supabase
    .from('organizer_participants')
    .update({ status })
    .eq('id', participantId);

  if (error) {
    console.error('Error updating participant status:', error);
    throw error;
  }
};

/**
 * Check in participant
 */
export const checkInParticipant = async (participantId: string) => {
  const { error } = await supabase
    .from('organizer_participants')
    .update({ checked_in: true })
    .eq('id', participantId);

  if (error) {
    console.error('Error checking in participant:', error);
    throw error;
  }
};

/**
 * Get organizer notifications
 */
export const getOrganizerNotifications = async (organizerId: string) => {
  const { data, error } = await supabase
    .from('organizer_notifications')
    .select('*')
    .eq('organizer_id', organizerId)
    .order('sent_at', { ascending: false });

  if (error) {
    console.error('Error fetching organizer notifications:', error);
    throw error;
  }

  return data;
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('organizer_notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};