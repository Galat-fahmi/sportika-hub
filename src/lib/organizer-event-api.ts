import { supabase } from "@/integrations/supabase/client";

// Types
export interface EventFormData {
  title: string;
  description?: string;
  sport: string;
  location?: string;
  start_date: string;
  end_date?: string;
  max_participants?: string;
  registration_fee: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  rules?: string;
  banner_url?: string;
}

// Event Creation and Management
export const createEvent = async (formData: EventFormData, organizerId: string) => {
  const { data, error } = await supabase
    .from('events')
    .insert({
      organizer_id: organizerId,
      title: formData.title,
      description: formData.description || null,
      sport: formData.sport,
      location: formData.location || null,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
      registration_fee: parseFloat(formData.registration_fee),
      status: formData.status,
      banner_url: formData.banner_url || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateEvent = async (eventId: string, formData: EventFormData) => {
  const { data, error } = await supabase
    .from('events')
    .update({
      title: formData.title,
      description: formData.description || null,
      sport: formData.sport,
      location: formData.location || null,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
      registration_fee: parseFloat(formData.registration_fee),
      status: formData.status,
      banner_url: formData.banner_url || null,
    })
    .eq('id', eventId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteEvent = async (eventId: string) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) throw error;
};

export const getOrganizerEvents = async (organizerId: string) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', organizerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getAllPublishedEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .in('status', ['published', 'ongoing'])
    .order('start_date', { ascending: true });

  if (error) throw error;
  return data;
};

// Event Registrations Management
export const getEventRegistrations = async (eventIds: string[]) => {
  if (eventIds.length === 0) return [];
  
  const { data, error } = await supabase
    .from('event_registrations')
    .select('*, events(title)')
    .in('event_id', eventIds)
    .order('registered_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const approveRegistration = async (registrationId: string) => {
  // First check if the registration exists and get event details
  const { data: registration, error: fetchError } = await supabase
    .from('event_registrations')
    .select('*, events!inner(organizer_id)')
    .eq('id', registrationId)
    .single();
  
  if (fetchError) {
    console.error('Error fetching registration:', fetchError);
    throw new Error('Registration not found');
  }
  
  // Update the registration status
  const { data, error } = await supabase
    .from('event_registrations')
    .update({ status: 'approved' })
    .eq('id', registrationId)
    .select();

  if (error) {
    console.error('Error approving registration:', error);
    throw new Error(`Failed to approve registration: ${error.message}`);
  }
  
  if (!data || data.length === 0) {
    throw new Error('Registration not found or access denied');
  }
  
  return data[0];
};

export const rejectRegistration = async (registrationId: string) => {
  // First check if the registration exists
  const { data: registration, error: fetchError } = await supabase
    .from('event_registrations')
    .select('*, events!inner(organizer_id)')
    .eq('id', registrationId)
    .single();
  
  if (fetchError) {
    console.error('Error fetching registration:', fetchError);
    throw new Error('Registration not found');
  }
  
  // Update the registration status
  const { data, error } = await supabase
    .from('event_registrations')
    .update({ status: 'rejected' })
    .eq('id', registrationId)
    .select();

  if (error) {
    console.error('Error rejecting registration:', error);
    throw new Error(`Failed to reject registration: ${error.message}`);
  }
  
  if (!data || data.length === 0) {
    throw new Error('Registration not found or access denied');
  }
  
  return data[0];
};

export const updateEventStatus = async (eventId: string, status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled') => {
  const { data, error } = await supabase
    .from('events')
    .update({ status })
    .eq('id', eventId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Banner Upload Functions
export const uploadEventBanner = async (file: File, userId: string) => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload an image file');
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds 5MB limit');
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `banners/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('event-banners')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('event-banners')
    .getPublicUrl(filePath);

  return { publicUrl, filePath };
};

export const deleteEventBanner = async (filePath: string) => {
  const { error } = await supabase.storage
    .from('event-banners')
    .remove([filePath]);

  if (error) throw error;
};

// Analytics Functions
export const getEventAnalytics = async (eventId: string) => {
  const { data, error } = await supabase
    .from('organizer_event_analytics')
    .select('*')
    .eq('event_id', eventId)
    .single();

  if (error) throw error;
  return data;
};

export const getOrganizerStats = async (organizerId: string) => {
  const { data, error } = await supabase
    .from('organizer_stats')
    .select('*')
    .eq('organizer_id', organizerId)
    .single();

  if (error) throw error;
  return data;
};