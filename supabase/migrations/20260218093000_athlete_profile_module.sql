
-- Athlete Dashboard: My Profile Module
-- Supports: Personal info, Profile photo, Bio, Social links, Account settings, KYC/Verification

-- ============================================
-- 1. Verification Status Enum
-- ============================================
CREATE TYPE public.verification_status AS ENUM (
  'unverified',
  'pending',
  'in_review',
  'verified',
  'rejected'
);

-- ============================================
-- 2. Enhance Profiles Table (if columns don't exist)
-- ============================================
-- These columns may already exist from previous migration, use IF NOT EXISTS
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS height_cm INTEGER,
  ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state_province TEXT,
  ADD COLUMN IF NOT EXISTS postal_code TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS social_linkedin TEXT,
  ADD COLUMN IF NOT EXISTS social_youtube TEXT,
  ADD COLUMN IF NOT EXISTS social_tiktok TEXT,
  ADD COLUMN IF NOT EXISTS kyc_submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS kyc_reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS kyc_reviewed_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS kyc_rejection_reason TEXT;

-- Update verification_status to use the enum (if it's currently text)
-- Note: This is a safe operation that converts existing text values
DO $$
BEGIN
  -- Check if column exists and is not already the enum type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'verification_status'
    AND data_type = 'text'
  ) THEN
    -- Add a temporary column with enum type
    ALTER TABLE public.profiles 
      ADD COLUMN verification_status_new verification_status DEFAULT 'unverified';
    
    -- Migrate existing data
    UPDATE public.profiles 
    SET verification_status_new = CASE 
      WHEN verification_status = 'verified' THEN 'verified'::verification_status
      WHEN verification_status = 'pending' THEN 'pending'::verification_status
      WHEN verification_status = 'rejected' THEN 'rejected'::verification_status
      ELSE 'unverified'::verification_status
    END;
    
    -- Drop old column and rename new one
    ALTER TABLE public.profiles DROP COLUMN verification_status;
    ALTER TABLE public.profiles RENAME COLUMN verification_status_new TO verification_status;
    
    -- Set not null constraint
    ALTER TABLE public.profiles ALTER COLUMN verification_status SET NOT NULL;
  ELSE
    -- Column doesn't exist, create it
    ALTER TABLE public.profiles 
      ADD COLUMN IF NOT EXISTS verification_status verification_status DEFAULT 'unverified' NOT NULL;
  END IF;
END $$;

-- ============================================
-- 3. KYC Documents Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Document info
  document_type TEXT NOT NULL, -- 'passport', 'national_id', 'drivers_license', 'birth_certificate', 'sports_license'
  document_number TEXT,
  document_country TEXT,
  
  -- File storage references
  front_image_url TEXT,
  back_image_url TEXT,
  selfie_image_url TEXT, -- For identity verification
  
  -- Verification data
  extracted_data JSONB DEFAULT '{}'::jsonb, -- OCR extracted data
  verification_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for kyc_documents
CREATE POLICY "Athletes can view their own KYC documents"
  ON public.kyc_documents FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Athletes can insert their own KYC documents"
  ON public.kyc_documents FOR INSERT
  TO authenticated
  WITH CHECK (athlete_id = auth.uid());

CREATE POLICY "Athletes can update their own KYC documents"
  ON public.kyc_documents FOR UPDATE
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Athletes can delete their own KYC documents"
  ON public.kyc_documents FOR DELETE
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Admins can view all KYC documents"
  ON public.kyc_documents FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all KYC documents"
  ON public.kyc_documents FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_kyc_documents_updated_at
  BEFORE UPDATE ON public.kyc_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 4. Athlete Profile Settings Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.athlete_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification preferences
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  event_reminders BOOLEAN DEFAULT true,
  result_announcements BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  
  -- Privacy settings
  profile_visibility TEXT DEFAULT 'public', -- 'public', 'athletes_only', 'private'
  show_stats_on_profile BOOLEAN DEFAULT true,
  show_results_on_profile BOOLEAN DEFAULT true,
  allow_messages_from TEXT DEFAULT 'verified', -- 'everyone', 'verified', 'none'
  
  -- Portfolio settings
  portfolio_is_public BOOLEAN DEFAULT true,
  allow_pdf_download BOOLEAN DEFAULT true,
  
  -- Security settings
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_method TEXT DEFAULT 'email', -- 'email', 'authenticator_app', 'sms'
  login_alerts BOOLEAN DEFAULT true,
  
  -- Account preferences
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  date_format TEXT DEFAULT 'YYYY-MM-DD',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(athlete_id)
);

-- Enable RLS
ALTER TABLE public.athlete_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for athlete_settings
CREATE POLICY "Athletes can view their own settings"
  ON public.athlete_settings FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Athletes can update their own settings"
  ON public.athlete_settings FOR UPDATE
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Admins can view all athlete settings"
  ON public.athlete_settings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Trigger to auto-create settings on profile creation
CREATE OR REPLACE FUNCTION public.handle_new_athlete_settings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create settings if user is an athlete
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.user_id AND role = 'athlete') THEN
    INSERT INTO public.athlete_settings (athlete_id)
    VALUES (NEW.user_id)
    ON CONFLICT (athlete_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Drop existing trigger if exists to avoid errors
DROP TRIGGER IF EXISTS on_profile_created_athlete_settings ON public.profiles;

CREATE TRIGGER on_profile_created_athlete_settings
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_athlete_settings();

-- Trigger for updated_at
CREATE TRIGGER update_athlete_settings_updated_at
  BEFORE UPDATE ON public.athlete_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 5. Storage Bucket Setup for Profile Photos
-- ============================================
-- Note: This requires Supabase CLI or dashboard to create the actual bucket
-- This migration documents the bucket configuration

/*
Bucket Name: profile-photos
Configuration:
  - Public: true (avatars are public)
  - Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
  - Max file size: 5MB
  - Folder structure: /{user_id}/{filename}
  
RLS Policy for Storage:
  - Users can upload to their own folder
  - Users can delete their own files
  - Anyone can read (public avatars)
*/

-- ============================================
-- 6. Function: Get Athlete Profile (Complete)
-- ============================================
CREATE OR REPLACE FUNCTION public.get_athlete_profile(_athlete_id UUID)
RETURNS TABLE (
  -- Personal info
  user_id UUID,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  age INTEGER,
  date_of_birth DATE,
  gender TEXT,
  height_cm INTEGER,
  weight_kg NUMERIC,
  
  -- Sport info
  sport TEXT,
  
  -- Location
  country TEXT,
  city TEXT,
  state_province TEXT,
  postal_code TEXT,
  
  -- Contact
  phone TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  
  -- Social links
  social_instagram TEXT,
  social_twitter TEXT,
  social_facebook TEXT,
  social_linkedin TEXT,
  social_youtube TEXT,
  social_tiktok TEXT,
  social_website TEXT,
  
  -- KYC/Verification
  verification_status TEXT,
  kyc_submitted_at TIMESTAMPTZ,
  kyc_reviewed_at TIMESTAMPTZ,
  kyc_rejection_reason TEXT,
  
  -- Settings
  settings JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.user_id,
    p.full_name,
    u.email,
    p.avatar_url,
    p.bio,
    p.age,
    p.date_of_birth,
    p.gender,
    p.height_cm,
    p.weight_kg,
    p.sport,
    p.country,
    p.city,
    p.state_province,
    p.postal_code,
    p.phone,
    p.emergency_contact_name,
    p.emergency_contact_phone,
    p.social_instagram,
    p.social_twitter,
    p.social_facebook,
    p.social_linkedin,
    p.social_youtube,
    p.social_tiktok,
    p.social_website,
    p.verification_status::TEXT,
    p.kyc_submitted_at,
    p.kyc_reviewed_at,
    p.kyc_rejection_reason,
    COALESCE(
      (SELECT jsonb_build_object(
        'email_notifications', s.email_notifications,
        'push_notifications', s.push_notifications,
        'sms_notifications', s.sms_notifications,
        'event_reminders', s.event_reminders,
        'profile_visibility', s.profile_visibility,
        'show_stats_on_profile', s.show_stats_on_profile,
        'portfolio_is_public', s.portfolio_is_public,
        'language', s.language,
        'timezone', s.timezone
      ) FROM public.athlete_settings s WHERE s.athlete_id = p.user_id),
      '{}'::jsonb
    )
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.user_id
  WHERE p.user_id = _athlete_id;
END;
$$;

-- ============================================
-- 7. Function: Update Athlete Profile
-- ============================================
CREATE OR REPLACE FUNCTION public.update_athlete_profile(
  _athlete_id UUID,
  _full_name TEXT DEFAULT NULL,
  _bio TEXT DEFAULT NULL,
  _age INTEGER DEFAULT NULL,
  _date_of_birth DATE DEFAULT NULL,
  _gender TEXT DEFAULT NULL,
  _height_cm INTEGER DEFAULT NULL,
  _weight_kg NUMERIC DEFAULT NULL,
  _sport TEXT DEFAULT NULL,
  _country TEXT DEFAULT NULL,
  _city TEXT DEFAULT NULL,
  _state_province TEXT DEFAULT NULL,
  _postal_code TEXT DEFAULT NULL,
  _phone TEXT DEFAULT NULL,
  _emergency_contact_name TEXT DEFAULT NULL,
  _emergency_contact_phone TEXT DEFAULT NULL,
  _social_instagram TEXT DEFAULT NULL,
  _social_twitter TEXT DEFAULT NULL,
  _social_facebook TEXT DEFAULT NULL,
  _social_linkedin TEXT DEFAULT NULL,
  _social_youtube TEXT DEFAULT NULL,
  _social_tiktok TEXT DEFAULT NULL,
  _social_website TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is updating their own profile or is admin
  IF auth.uid() != _athlete_id AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  UPDATE public.profiles
  SET
    full_name = COALESCE(_full_name, full_name),
    bio = COALESCE(_bio, bio),
    age = COALESCE(_age, age),
    date_of_birth = COALESCE(_date_of_birth, date_of_birth),
    gender = COALESCE(_gender, gender),
    height_cm = COALESCE(_height_cm, height_cm),
    weight_kg = COALESCE(_weight_kg, weight_kg),
    sport = COALESCE(_sport, sport),
    country = COALESCE(_country, country),
    city = COALESCE(_city, city),
    state_province = COALESCE(_state_province, state_province),
    postal_code = COALESCE(_postal_code, postal_code),
    phone = COALESCE(_phone, phone),
    emergency_contact_name = COALESCE(_emergency_contact_name, emergency_contact_name),
    emergency_contact_phone = COALESCE(_emergency_contact_phone, emergency_contact_phone),
    social_instagram = COALESCE(_social_instagram, social_instagram),
    social_twitter = COALESCE(_social_twitter, social_twitter),
    social_facebook = COALESCE(_social_facebook, social_facebook),
    social_linkedin = COALESCE(_social_linkedin, social_linkedin),
    social_youtube = COALESCE(_social_youtube, social_youtube),
    social_tiktok = COALESCE(_social_tiktok, social_tiktok),
    social_website = COALESCE(_social_website, social_website),
    updated_at = now()
  WHERE user_id = _athlete_id;

  RETURN FOUND;
END;
$$;

-- ============================================
-- 8. Function: Submit KYC Verification
-- ============================================
CREATE OR REPLACE FUNCTION public.submit_kyc_verification(
  _athlete_id UUID,
  _documents JSONB -- Array of {document_type, document_number, document_country, front_image_url, back_image_url, selfie_image_url}
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _doc JSONB;
BEGIN
  -- Check if user is submitting their own KYC
  IF auth.uid() != _athlete_id THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  -- Insert KYC documents
  FOR _doc IN SELECT * FROM jsonb_array_elements(_documents)
  LOOP
    INSERT INTO public.kyc_documents (
      athlete_id,
      document_type,
      document_number,
      document_country,
      front_image_url,
      back_image_url,
      selfie_image_url
    ) VALUES (
      _athlete_id,
      _doc->>'document_type',
      _doc->>'document_number',
      _doc->>'document_country',
      _doc->>'front_image_url',
      _doc->>'back_image_url',
      _doc->>'selfie_image_url'
    );
  END LOOP;

  -- Update profile verification status
  UPDATE public.profiles
  SET 
    verification_status = 'pending',
    kyc_submitted_at = now(),
    updated_at = now()
  WHERE user_id = _athlete_id;

  RETURN true;
END;
$$;

-- ============================================
-- 9. Function: Update Athlete Settings
-- ============================================
CREATE OR REPLACE FUNCTION public.update_athlete_settings(
  _athlete_id UUID,
  _email_notifications BOOLEAN DEFAULT NULL,
  _push_notifications BOOLEAN DEFAULT NULL,
  _sms_notifications BOOLEAN DEFAULT NULL,
  _event_reminders BOOLEAN DEFAULT NULL,
  _result_announcements BOOLEAN DEFAULT NULL,
  _marketing_emails BOOLEAN DEFAULT NULL,
  _profile_visibility TEXT DEFAULT NULL,
  _show_stats_on_profile BOOLEAN DEFAULT NULL,
  _show_results_on_profile BOOLEAN DEFAULT NULL,
  _allow_messages_from TEXT DEFAULT NULL,
  _portfolio_is_public BOOLEAN DEFAULT NULL,
  _allow_pdf_download BOOLEAN DEFAULT NULL,
  _two_factor_enabled BOOLEAN DEFAULT NULL,
  _two_factor_method TEXT DEFAULT NULL,
  _login_alerts BOOLEAN DEFAULT NULL,
  _language TEXT DEFAULT NULL,
  _timezone TEXT DEFAULT NULL,
  _date_format TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is updating their own settings or is admin
  IF auth.uid() != _athlete_id AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  -- Ensure settings record exists
  INSERT INTO public.athlete_settings (athlete_id)
  VALUES (_athlete_id)
  ON CONFLICT (athlete_id) DO NOTHING;

  UPDATE public.athlete_settings
  SET
    email_notifications = COALESCE(_email_notifications, email_notifications),
    push_notifications = COALESCE(_push_notifications, push_notifications),
    sms_notifications = COALESCE(_sms_notifications, sms_notifications),
    event_reminders = COALESCE(_event_reminders, event_reminders),
    result_announcements = COALESCE(_result_announcements, result_announcements),
    marketing_emails = COALESCE(_marketing_emails, marketing_emails),
    profile_visibility = COALESCE(_profile_visibility, profile_visibility),
    show_stats_on_profile = COALESCE(_show_stats_on_profile, show_stats_on_profile),
    show_results_on_profile = COALESCE(_show_results_on_profile, show_results_on_profile),
    allow_messages_from = COALESCE(_allow_messages_from, allow_messages_from),
    portfolio_is_public = COALESCE(_portfolio_is_public, portfolio_is_public),
    allow_pdf_download = COALESCE(_allow_pdf_download, allow_pdf_download),
    two_factor_enabled = COALESCE(_two_factor_enabled, two_factor_enabled),
    two_factor_method = COALESCE(_two_factor_method, two_factor_method),
    login_alerts = COALESCE(_login_alerts, login_alerts),
    language = COALESCE(_language, language),
    timezone = COALESCE(_timezone, timezone),
    date_format = COALESCE(_date_format, date_format),
    updated_at = now()
  WHERE athlete_id = _athlete_id;

  RETURN FOUND;
END;
$$;

-- ============================================
-- 10. Function: Update Profile Avatar
-- ============================================
CREATE OR REPLACE FUNCTION public.update_profile_avatar(
  _athlete_id UUID,
  _avatar_url TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is updating their own avatar or is admin
  IF auth.uid() != _athlete_id AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  UPDATE public.profiles
  SET 
    avatar_url = _avatar_url,
    updated_at = now()
  WHERE user_id = _athlete_id;

  RETURN FOUND;
END;
$$;

-- ============================================
-- 11. Function: Admin Review KYC (for admin use)
-- ============================================
CREATE OR REPLACE FUNCTION public.admin_review_kyc(
  _athlete_id UUID,
  _status TEXT, -- 'verified', 'rejected'
  _rejection_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only admins can review KYC
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Permission denied: Admin only';
  END IF;

  UPDATE public.profiles
  SET 
    verification_status = _status::verification_status,
    kyc_reviewed_at = now(),
    kyc_reviewed_by = auth.uid(),
    kyc_rejection_reason = _rejection_reason,
    updated_at = now()
  WHERE user_id = _athlete_id;

  RETURN FOUND;
END;
$$;

