import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

// Helper function to generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export interface PublicAthletePortfolio {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  tagline: string | null;
  bio: string | null;
  profile_image_url: string | null;
  cover_image_url: string | null;
  theme_color: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  social_links: any;
  sports: string[];
  specialties: string[];
  views_count: number;
  is_verified: boolean;
  published_at: string | null;
}

export interface PortfolioSection {
  id: string;
  section_type: Database["public"]["Enums"]["portfolio_section_type"];
  title: string;
  content: string | null;
  media_urls: string[] | null;
  display_order: number;
  is_visible: boolean;
  custom_data: any;
}

export interface PortfolioMedia {
  id: string;
  media_type: string;
  url: string;
  thumbnail_url: string | null;
  title: string | null;
  description: string | null;
  category: string | null;
  tags: string[];
  display_order: number;
  is_featured: boolean;
  uploaded_at: string;
}

export const getPublicPortfolios = async (): Promise<PublicAthletePortfolio[]> => {
  const { data, error } = await supabase
    .rpc('get_portfolio_by_slug', { _slug: null }) // We'll need to create a new function for getting all public portfolios
    .select(`
      id,
      user_id,
      slug,
      title,
      tagline,
      bio,
      profile_image_url,
      cover_image_url,
      sports,
      specialties,
      views_count,
      is_verified,
      published_at
    `)
    .eq('visibility', 'public');

  if (error) {
    console.error('Error fetching public portfolios:', error);
    throw error;
  }

  return data;
};

// Alternative approach: Direct query for all public portfolios
export const getAllPublicPortfolios = async (): Promise<PublicAthletePortfolio[]> => {
  const { data, error } = await supabase
    .from('athlete_portfolios')
    .select(`
      id,
      user_id,
      slug,
      title,
      tagline,
      bio,
      profile_image_url,
      cover_image_url,
      theme_color,
      email,
      phone,
      website,
      social_links,
      sports,
      specialties,
      views_count,
      is_verified,
      published_at
    `)
    .eq('visibility', 'public')
    .order('views_count', { ascending: false });

  if (error) {
    console.error('Error fetching all public portfolios:', error);
    throw error;
  }

  return data;
};

export const getPortfolioBySlug = async (slug: string): Promise<PublicAthletePortfolio | null> => {
  const { data, error } = await supabase
    .from('athlete_portfolios')
    .select(`
      id,
      user_id,
      slug,
      title,
      tagline,
      bio,
      profile_image_url,
      cover_image_url,
      theme_color,
      email,
      phone,
      website,
      social_links,
      sports,
      specialties,
      views_count,
      is_verified,
      published_at
    `)
    .eq('slug', slug)
    .eq('visibility', 'public')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned, which means portfolio doesn't exist or isn't public
      return null;
    }
    console.error('Error fetching portfolio by slug:', error);
    throw error;
  }

  return data;
};

export const getPortfolioSections = async (portfolioId: string): Promise<PortfolioSection[]> => {
  const { data, error } = await supabase
    .from('portfolio_sections')
    .select(`
      id,
      section_type,
      title,
      content,
      media_urls,
      display_order,
      is_visible,
      custom_data
    `)
    .eq('portfolio_id', portfolioId)
    .eq('is_visible', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching portfolio sections:', error);
    throw error;
  }

  return data;
};

export const getPortfolioMedia = async (portfolioId: string): Promise<PortfolioMedia[]> => {
  const { data, error } = await supabase
    .from('portfolio_media')
    .select(`
      id,
      media_type,
      url,
      thumbnail_url,
      title,
      description,
      category,
      tags,
      display_order,
      is_featured,
      uploaded_at
    `)
    .eq('portfolio_id', portfolioId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching portfolio media:', error);
    throw error;
  }

  return data;
};

export const incrementPortfolioView = async (portfolioId: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_portfolio_views', {
    _portfolio_id: portfolioId
  });

  if (error) {
    console.error('Error incrementing portfolio view:', error);
    // Don't throw error as this shouldn't break the user experience
  }
};

// Ensure slug is properly set for a portfolio
export const ensurePortfolioSlug = async (userId: string, title?: string): Promise<string> => {
  // First check if portfolio exists and has a slug
  const { data: existingPortfolio } = await supabase
    .from('athlete_portfolios')
    .select('slug, title')
    .eq('user_id', userId)
    .single();
  
  if (existingPortfolio?.slug) {
    return existingPortfolio.slug;
  }
  
  // Generate slug from provided title or existing title
  const slug = generateSlug(title || existingPortfolio?.title || `athlete-${Date.now()}`);
  
  // Check if slug already exists (avoid duplicates)
  const { data: existingSlugs } = await supabase
    .from('athlete_portfolios')
    .select('slug')
    .ilike('slug', `${slug}%`);
  
  let finalSlug = slug;
  if (existingSlugs && existingSlugs.length > 0) {
    // Find an available slug by appending a number
    let counter = 1;
    while (existingSlugs.some(p => p.slug === finalSlug)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
  }
  
  // Update the portfolio with the slug if it exists
  if (existingPortfolio) {
    await supabase
      .from('athlete_portfolios')
      .update({ slug: finalSlug })
      .eq('user_id', userId);
  }
  
  return finalSlug;
};

// Update athlete portfolio using RPC function
export const updateAthletePortfolio = async (
  userId: string,
  portfolioData: {
    slug?: string;
    title?: string;
    tagline?: string;
    bio?: string;
    cover_image_url?: string;
    profile_image_url?: string;
    theme_color?: string;
    email?: string;
    phone?: string;
    website?: string;
    social_links?: any;
    visibility?: 'public' | 'private';
    sports?: string[];
    specialties?: string[];
  }
): Promise<string> => {
  const { data, error } = await supabase.rpc('update_athlete_portfolio', {
    _user_id: userId,
    _slug: portfolioData.slug,
    _title: portfolioData.title,
    _tagline: portfolioData.tagline,
    _bio: portfolioData.bio,
    _cover_image_url: portfolioData.cover_image_url,
    _profile_image_url: portfolioData.profile_image_url,
    _theme_color: portfolioData.theme_color,
    _email: portfolioData.email,
    _phone: portfolioData.phone,
    _website: portfolioData.website,
    _social_links: portfolioData.social_links,
    _visibility: portfolioData.visibility,
    _sports: portfolioData.sports,
    _specialties: portfolioData.specialties
  });

  if (error) {
    console.error('Error updating athlete portfolio:', error);
    throw error;
  }

  return data;
};

// Upload portfolio image to Supabase Storage
export const uploadPortfolioImage = async (
  userId: string,
  file: File,
  type: 'profile' | 'cover' | 'gallery'
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${type}-${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('portfolio-images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(filePath);

  return publicUrl;
};

// Add achievement to portfolio
export const addPortfolioAchievement = async (
  portfolioId: string,
  achievement: {
    title: string;
    year: string;
    category: string;
    description?: string;
  }
): Promise<void> => {
  const { error } = await supabase
    .from('portfolio_achievements')
    .insert({
      portfolio_id: portfolioId,
      title: achievement.title,
      year: achievement.year,
      category: achievement.category,
      description: achievement.description
    });

  if (error) {
    console.error('Error adding achievement:', error);
    throw error;
  }
};

// Delete achievement from portfolio
export const deletePortfolioAchievement = async (
  achievementId: string
): Promise<void> => {
  const { error } = await supabase
    .from('portfolio_achievements')
    .delete()
    .eq('id', achievementId);

  if (error) {
    console.error('Error deleting achievement:', error);
    throw error;
  }
};

// Add gallery image to portfolio
export const addPortfolioGalleryImage = async (
  portfolioId: string,
  imageData: {
    url: string;
    caption?: string;
  }
): Promise<void> => {
  const { error } = await supabase
    .from('portfolio_media')
    .insert({
      portfolio_id: portfolioId,
      media_type: 'image',
      url: imageData.url,
      caption: imageData.caption,
      uploaded_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error adding gallery image:', error);
    throw error;
  }
};

// Delete gallery image from portfolio
export const deletePortfolioGalleryImage = async (
  imageId: string
): Promise<void> => {
  const { error } = await supabase
    .from('portfolio_media')
    .delete()
    .eq('id', imageId);

  if (error) {
    console.error('Error deleting gallery image:', error);
    throw error;
  }
};

// Get athlete's own portfolio (for dashboard)
export const getMyPortfolio = async (userId: string): Promise<PublicAthletePortfolio | null> => {
  const { data, error } = await supabase
    .from('athlete_portfolios')
    .select(`
      id,
      user_id,
      slug,
      title,
      tagline,
      bio,
      profile_image_url,
      cover_image_url,
      theme_color,
      email,
      phone,
      website,
      social_links,
      sports,
      specialties,
      views_count,
      is_verified,
      published_at,
      visibility
    `)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No portfolio exists yet
      return null;
    }
    console.error('Error fetching my portfolio:', error);
    throw error;
  }

  return data;
};