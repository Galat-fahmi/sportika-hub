
-- Add new columns to profiles table for enhanced athlete profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sport TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_instagram TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_twitter TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_facebook TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_website TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_documents JSONB DEFAULT '[]'::jsonb;

-- Add payment status to event_registrations
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS payment_amount NUMERIC(10,2);
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ;

-- Add check-in fields to event_registrations
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT false;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;
