import { supabase } from "@/integrations/supabase/client";

/**
 * Upload organizer profile picture to storage
 */
export const uploadProfilePicture = async (file: File, userId: string) => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload an image file');
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds 5MB limit');
  }

  // Create a unique filename using user ID and timestamp
  const fileName = `${userId}/${Date.now()}_${file.name}`;
  const filePath = `avatars/${fileName}`;

  // Upload to Supabase storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    console.error('Error uploading profile picture:', uploadError);
    throw uploadError;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return { publicUrl, filePath };
};

/**
 * Remove profile picture from storage
 */
export const removeProfilePicture = async (filePath: string) => {
  const { error } = await supabase.storage
    .from('avatars')
    .remove([filePath]);

  if (error) {
    console.error('Error removing profile picture:', error);
    throw error;
  }
};

/**
 * Update organizer profile with avatar URL
 */
export const updateOrganizerProfile = async (
  userId: string,
  updates: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  }
) => {
  // First, check if a profile exists
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means "Row not found"
    console.error('Error fetching profile:', fetchError);
    throw fetchError;
  }

  let result;
  if (existingProfile) {
    // Update existing profile
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    result = { id: existingProfile.id, ...updates };
  } else {
    // Create new profile
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        ...updates,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
    
    result = data;
  }

  return result;
};

/**
 * Get organizer profile
 */
export const getOrganizerProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means "Row not found"
    console.error('Error fetching profile:', error);
    throw error;
  }

  return data || null;
};

/**
 * Get organizer profile by profile ID
 */
export const getOrganizerProfileById = async (profileId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }

  return data;
};