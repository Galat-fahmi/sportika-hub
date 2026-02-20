
-- Athlete Dashboard: Events Module
-- Supports: Browse Events, My Registrations, Event History

-- ============================================
-- 1. Registration Status Enum
-- ============================================
CREATE TYPE public.registration_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'cancelled',
  'waitlisted'
);

-- ============================================
-- 2. Payment Status Enum
-- ============================================
CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'refunded',
  'waived'
);

-- ============================================
-- 3. Enhance Events Table for Better Browsing
-- ============================================
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS banner_image_url TEXT,
  ADD COLUMN IF NOT EXISTS registration_open_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS registration_close_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'competition', -- 'competition', 'training', 'workshop'
  ADD COLUMN IF NOT EXISTS age_category TEXT, -- 'junior', 'senior', 'veteran', 'all'
  ADD COLUMN IF NOT EXISTS skill_level TEXT, -- 'beginner', 'intermediate', 'advanced', 'professional', 'all'
  ADD COLUMN IF NOT EXISTS requirements TEXT, -- JSON or text of requirements
  ADD COLUMN IF NOT EXISTS prizes TEXT, -- JSON of prize structure
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Update event_registrations to use enums
-- First, convert existing text values to enum values
DO $$
BEGIN
  -- Check if column exists and is text type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'event_registrations' 
    AND column_name = 'status'
    AND data_type = 'text'
  ) THEN
    -- Add temporary enum column
    ALTER TABLE public.event_registrations 
      ADD COLUMN status_new registration_status DEFAULT 'pending';
    
    -- Migrate data
    UPDATE public.event_registrations 
    SET status_new = CASE status
      WHEN 'approved' THEN 'approved'::registration_status
      WHEN 'rejected' THEN 'rejected'::registration_status
      WHEN 'cancelled' THEN 'cancelled'::registration_status
      WHEN 'waitlisted' THEN 'waitlisted'::registration_status
      ELSE 'pending'::registration_status
    END;
    
    -- Drop old column and rename
    ALTER TABLE public.event_registrations DROP COLUMN status;
    ALTER TABLE public.event_registrations RENAME COLUMN status_new TO status;
    
    -- Set not null
    ALTER TABLE public.event_registrations ALTER COLUMN status SET NOT NULL;
  ELSE
    -- Column doesn't exist, create it
    ALTER TABLE public.event_registrations 
      ADD COLUMN IF NOT EXISTS status registration_status DEFAULT 'pending' NOT NULL;
  END IF;

  -- Same for payment_status
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'event_registrations' 
    AND column_name = 'payment_status'
    AND data_type = 'text'
  ) THEN
    ALTER TABLE public.event_registrations 
      ADD COLUMN payment_status_new payment_status DEFAULT 'pending';
    
    UPDATE public.event_registrations 
    SET payment_status_new = CASE payment_status
      WHEN 'completed' THEN 'completed'::payment_status
      WHEN 'failed' THEN 'failed'::payment_status
      WHEN 'refunded' THEN 'refunded'::payment_status
      WHEN 'waived' THEN 'waived'::payment_status
      ELSE 'pending'::payment_status
    END;
    
    ALTER TABLE public.event_registrations DROP COLUMN payment_status;
    ALTER TABLE public.event_registrations RENAME COLUMN payment_status_new TO payment_status;
  ELSE
    ALTER TABLE public.event_registrations 
      ADD COLUMN IF NOT EXISTS payment_status payment_status DEFAULT 'pending';
  END IF;
END $$;

-- ============================================
-- 4. Event Categories Table (for filtering)
-- ============================================
CREATE TABLE IF NOT EXISTS public.event_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  sport TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Event to Categories junction table
CREATE TABLE IF NOT EXISTS public.event_category_mappings (
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.event_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, category_id)
);

-- Enable RLS
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_category_mappings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view event categories"
  ON public.event_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view event category mappings"
  ON public.event_category_mappings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage event categories"
  ON public.event_categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Organizers can manage their event categories"
  ON public.event_category_mappings FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.events e 
    WHERE e.id = event_id AND e.organizer_id = auth.uid()
  ));

-- ============================================
-- 5. Function: Browse Events (with filters)
-- ============================================
CREATE OR REPLACE FUNCTION public.browse_events(
  _sport TEXT DEFAULT NULL,
  _location TEXT DEFAULT NULL,
  _start_date_from TIMESTAMPTZ DEFAULT NULL,
  _start_date_to TIMESTAMPTZ DEFAULT NULL,
  _event_type TEXT DEFAULT NULL,
  _age_category TEXT DEFAULT NULL,
  _skill_level TEXT DEFAULT NULL,
  _search_query TEXT DEFAULT NULL,
  _is_featured BOOLEAN DEFAULT NULL,
  _limit INTEGER DEFAULT 20,
  _offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  event_id UUID,
  title TEXT,
  description TEXT,
  sport TEXT,
  location TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  registration_fee NUMERIC,
  max_participants INTEGER,
  banner_image_url TEXT,
  event_type TEXT,
  age_category TEXT,
  skill_level TEXT,
  is_featured BOOLEAN,
  registration_open_date TIMESTAMPTZ,
  registration_close_date TIMESTAMPTZ,
  status event_status,
  registered_count BIGINT,
  is_registered BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id as event_id,
    e.title,
    e.description,
    e.sport,
    e.location,
    e.start_date,
    e.end_date,
    e.registration_fee,
    e.max_participants,
    e.banner_image_url,
    e.event_type,
    e.age_category,
    e.skill_level,
    e.is_featured,
    e.registration_open_date,
    e.registration_close_date,
    e.status,
    COUNT(er.id) as registered_count,
    EXISTS (
      SELECT 1 FROM public.event_registrations er2 
      WHERE er2.event_id = e.id AND er2.athlete_id = auth.uid()
    ) as is_registered
  FROM public.events e
  LEFT JOIN public.event_registrations er ON er.event_id = e.id
  WHERE 
    e.status IN ('published', 'ongoing')
    AND (_sport IS NULL OR e.sport ILIKE '%' || _sport || '%')
    AND (_location IS NULL OR e.location ILIKE '%' || _location || '%')
    AND (_start_date_from IS NULL OR e.start_date >= _start_date_from)
    AND (_start_date_to IS NULL OR e.start_date <= _start_date_to)
    AND (_event_type IS NULL OR e.event_type = _event_type)
    AND (_age_category IS NULL OR e.age_category = _age_category)
    AND (_skill_level IS NULL OR e.skill_level = _skill_level)
    AND (_is_featured IS NULL OR e.is_featured = _is_featured)
    AND (_search_query IS NULL OR 
         e.title ILIKE '%' || _search_query || '%' OR
         e.description ILIKE '%' || _search_query || '%')
  GROUP BY e.id
  ORDER BY e.is_featured DESC, e.start_date ASC
  LIMIT _limit OFFSET _offset;
END;
$$;

-- ============================================
-- 6. Function: Get Event Details
-- ============================================
CREATE OR REPLACE FUNCTION public.get_event_details(_event_id UUID)
RETURNS TABLE (
  event_id UUID,
  title TEXT,
  description TEXT,
  sport TEXT,
  location TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  registration_fee NUMERIC,
  max_participants INTEGER,
  banner_image_url TEXT,
  event_type TEXT,
  age_category TEXT,
  skill_level TEXT,
  requirements TEXT,
  prizes TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  is_featured BOOLEAN,
  registration_open_date TIMESTAMPTZ,
  registration_close_date TIMESTAMPTZ,
  status event_status,
  organizer_id UUID,
  organizer_name TEXT,
  registered_count BIGINT,
  spots_remaining INTEGER,
  is_registration_open BOOLEAN,
  is_registered BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.title,
    e.description,
    e.sport,
    e.location,
    e.start_date,
    e.end_date,
    e.registration_fee,
    e.max_participants,
    e.banner_image_url,
    e.event_type,
    e.age_category,
    e.skill_level,
    e.requirements,
    e.prizes,
    e.contact_email,
    e.contact_phone,
    e.is_featured,
    e.registration_open_date,
    e.registration_close_date,
    e.status,
    e.organizer_id,
    p.full_name as organizer_name,
    COUNT(er.id) as registered_count,
    CASE 
      WHEN e.max_participants IS NULL THEN NULL
      ELSE GREATEST(0, e.max_participants - COUNT(er.id)::INTEGER)
    END as spots_remaining,
    (
      e.registration_open_date <= now() 
      AND (e.registration_close_date IS NULL OR e.registration_close_date >= now())
      AND e.status = 'published'
    ) as is_registration_open,
    EXISTS (
      SELECT 1 FROM public.event_registrations er2 
      WHERE er2.event_id = e.id AND er2.athlete_id = auth.uid()
    ) as is_registered
  FROM public.events e
  LEFT JOIN public.profiles p ON p.user_id = e.organizer_id
  LEFT JOIN public.event_registrations er ON er.event_id = e.id
  WHERE e.id = _event_id
  GROUP BY e.id, p.full_name;
END;
$$;

-- ============================================
-- 7. Function: Register for Event
-- ============================================
CREATE OR REPLACE FUNCTION public.register_for_event(
  _event_id UUID,
  _payment_amount NUMERIC DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  registration_id UUID,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _event_record RECORD;
  _registration_id UUID;
  _registered_count INTEGER;
BEGIN
  -- Check if user is an athlete
  IF NOT public.has_role(auth.uid(), 'athlete'::app_role) THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Only athletes can register for events'::TEXT;
    RETURN;
  END IF;

  -- Get event details
  SELECT * INTO _event_record 
  FROM public.events 
  WHERE id = _event_id;

  IF _event_record IS NULL THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Event not found'::TEXT;
    RETURN;
  END IF;

  -- Check if already registered
  IF EXISTS (
    SELECT 1 FROM public.event_registrations 
    WHERE event_id = _event_id AND athlete_id = auth.uid()
  ) THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Already registered for this event'::TEXT;
    RETURN;
  END IF;

  -- Check if registration is open
  IF _event_record.status != 'published' THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Registration is not open for this event'::TEXT;
    RETURN;
  END IF;

  IF _event_record.registration_open_date > now() THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Registration has not opened yet'::TEXT;
    RETURN;
  END IF;

  IF _event_record.registration_close_date IS NOT NULL 
     AND _event_record.registration_close_date < now() THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Registration has closed'::TEXT;
    RETURN;
  END IF;

  -- Check if event is full
  SELECT COUNT(*) INTO _registered_count
  FROM public.event_registrations
  WHERE event_id = _event_id;

  IF _event_record.max_participants IS NOT NULL 
     AND _registered_count >= _event_record.max_participants THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Event is full'::TEXT;
    RETURN;
  END IF;

  -- Create registration
  INSERT INTO public.event_registrations (
    event_id,
    athlete_id,
    status,
    payment_amount,
    payment_status
  ) VALUES (
    _event_id,
    auth.uid(),
    'pending'::registration_status,
    COALESCE(_payment_amount, _event_record.registration_fee),
    CASE 
      WHEN _event_record.registration_fee = 0 OR _event_record.registration_fee IS NULL 
      THEN 'waived'::payment_status
      ELSE 'pending'::payment_status
    END
  )
  RETURNING id INTO _registration_id;

  RETURN QUERY SELECT true, _registration_id, 'Registration successful'::TEXT;
END;
$$;

-- ============================================
-- 8. Function: Get My Registrations
-- ============================================
CREATE OR REPLACE FUNCTION public.get_my_registrations(
  _athlete_id UUID,
  _status_filter TEXT DEFAULT NULL, -- 'upcoming', 'past', 'all'
  _registration_status TEXT DEFAULT NULL, -- filter by registration status
  _payment_status TEXT DEFAULT NULL, -- filter by payment status
  _limit INTEGER DEFAULT 20,
  _offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  registration_id UUID,
  event_id UUID,
  event_title TEXT,
  event_description TEXT,
  event_sport TEXT,
  event_location TEXT,
  event_start_date TIMESTAMPTZ,
  event_end_date TIMESTAMPTZ,
  event_banner_image_url TEXT,
  registration_status registration_status,
  payment_status payment_status,
  payment_amount NUMERIC,
  registered_at TIMESTAMPTZ,
  checked_in BOOLEAN,
  checked_in_at TIMESTAMPTZ,
  is_upcoming BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check permissions
  IF auth.uid() != _athlete_id AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  RETURN QUERY
  SELECT 
    er.id as registration_id,
    e.id as event_id,
    e.title as event_title,
    e.description as event_description,
    e.sport as event_sport,
    e.location as event_location,
    e.start_date as event_start_date,
    e.end_date as event_end_date,
    e.banner_image_url as event_banner_image_url,
    er.status as registration_status,
    er.payment_status,
    er.payment_amount,
    er.registered_at,
    er.checked_in,
    er.checked_in_at,
    (e.start_date >= now()) as is_upcoming
  FROM public.event_registrations er
  JOIN public.events e ON e.id = er.event_id
  WHERE er.athlete_id = _athlete_id
    AND (_status_filter IS NULL OR _status_filter = 'all' OR
         (_status_filter = 'upcoming' AND e.start_date >= now()) OR
         (_status_filter = 'past' AND e.start_date < now()))
    AND (_registration_status IS NULL OR er.status::TEXT = _registration_status)
    AND (_payment_status IS NULL OR er.payment_status::TEXT = _payment_status)
  ORDER BY 
    CASE WHEN e.start_date >= now() THEN 0 ELSE 1 END,
    ABS(EXTRACT(EPOCH FROM (e.start_date - now())))
  LIMIT _limit OFFSET _offset;
END;
$$;

-- ============================================
-- 9. Function: Get Event History (Completed Competitions)
-- ============================================
CREATE OR REPLACE FUNCTION public.get_event_history(
  _athlete_id UUID,
  _sport TEXT DEFAULT NULL,
  _limit INTEGER DEFAULT 20,
  _offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  event_id UUID,
  event_title TEXT,
  event_sport TEXT,
  event_location TEXT,
  event_start_date TIMESTAMPTZ,
  event_end_date TIMESTAMPTZ,
  event_banner_image_url TEXT,
  registration_status registration_status,
  result_id UUID,
  "position" INTEGER,
  score NUMERIC,
  result_notes TEXT,
  total_participants BIGINT,
  percentile NUMERIC,
  performance_rating TEXT -- 'excellent', 'good', 'average', 'below_average'
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check permissions
  IF auth.uid() != _athlete_id AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  RETURN QUERY
  WITH event_stats AS (
    SELECT 
      r.event_id,
      COUNT(*) as total_count,
      AVG(r.position) as avg_position
    FROM public.event_results r
    GROUP BY r.event_id
  )
  SELECT 
    e.id as event_id,
    e.title as event_title,
    e.sport as event_sport,
    e.location as event_location,
    e.start_date as event_start_date,
    e.end_date as event_end_date,
    e.banner_image_url as event_banner_image_url,
    er.status as registration_status,
    r.id as result_id,
    r.position,
    r.score,
    r.notes as result_notes,
    COALESCE(es.total_count, 0) as total_participants,
    CASE 
      WHEN es.total_count > 0 AND r.position IS NOT NULL 
      THEN ROUND(((es.total_count - r.position + 1)::NUMERIC / es.total_count) * 100, 2)
      ELSE NULL
    END as percentile,
    CASE 
      WHEN r.position IS NULL THEN NULL
      WHEN r.position = 1 THEN 'excellent'
      WHEN r.position <= 3 THEN 'excellent'
      WHEN r.position <= es.total_count * 0.25 THEN 'good'
      WHEN r.position <= es.total_count * 0.5 THEN 'average'
      ELSE 'below_average'
    END as performance_rating
  FROM public.event_registrations er
  JOIN public.events e ON e.id = er.event_id
  LEFT JOIN public.event_results r ON r.event_id = e.id AND r.athlete_id = _athlete_id
  LEFT JOIN event_stats es ON es.event_id = e.id
  WHERE er.athlete_id = _athlete_id
    AND e.status = 'completed'
    AND (_sport IS NULL OR e.sport = _sport)
  ORDER BY e.start_date DESC
  LIMIT _limit OFFSET _offset;
END;
$$;

-- ============================================
-- 10. Function: Cancel Registration
-- ============================================
CREATE OR REPLACE FUNCTION public.cancel_registration(_registration_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _registration RECORD;
BEGIN
  -- Get registration
  SELECT * INTO _registration
  FROM public.event_registrations
  WHERE id = _registration_id;

  IF _registration IS NULL THEN
    RETURN false;
  END IF;

  -- Check permissions
  IF auth.uid() != _registration.athlete_id AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  -- Check if can cancel (only if event hasn't started)
  IF EXISTS (
    SELECT 1 FROM public.events 
    WHERE id = _registration.event_id 
    AND start_date <= now()
  ) THEN
    RAISE EXCEPTION 'Cannot cancel registration for event that has already started';
  END IF;

  -- Update status to cancelled
  UPDATE public.event_registrations
  SET status = 'cancelled'::registration_status
  WHERE id = _registration_id;

  RETURN true;
END;
$$;

-- ============================================
-- 11. Function: Get Registration Details
-- ============================================
CREATE OR REPLACE FUNCTION public.get_registration_details(_registration_id UUID)
RETURNS TABLE (
  registration_id UUID,
  event_id UUID,
  event_title TEXT,
  event_start_date TIMESTAMPTZ,
  event_location TEXT,
  registration_status registration_status,
  payment_status payment_status,
  payment_amount NUMERIC,
  payment_date TIMESTAMPTZ,
  registered_at TIMESTAMPTZ,
  checked_in BOOLEAN,
  checked_in_at TIMESTAMPTZ,
  qr_code_data TEXT -- For check-in
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    er.id,
    e.id,
    e.title,
    e.start_date,
    e.location,
    er.status,
    er.payment_status,
    er.payment_amount,
    er.payment_date,
    er.registered_at,
    er.checked_in,
    er.checked_in_at,
    -- QR code data: registration_id:athlete_id:event_id
    encode(
      digest(
        er.id::TEXT || ':' || er.athlete_id::TEXT || ':' || e.id::TEXT,
        'sha256'
      ),
      'hex'
    ) as qr_code_data
  FROM public.event_registrations er
  JOIN public.events e ON e.id = er.event_id
  WHERE er.id = _registration_id
    AND (er.athlete_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));
END;
$$;

-- ============================================
-- 12. Function: Increment Event View Count
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_event_view(_event_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.events
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = _event_id;
END;
$$;

-- ============================================
-- 13. Update RLS Policies for event_registrations
-- ============================================

-- Drop existing policies that may conflict
DROP POLICY IF EXISTS "Athletes can view their own registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Athletes can register for events" ON public.event_registrations;
DROP POLICY IF EXISTS "Athletes can cancel their registration" ON public.event_registrations;

-- Recreate policies
CREATE POLICY "Athletes can view their own registrations"
  ON public.event_registrations FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Athletes can register for events"
  ON public.event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (athlete_id = auth.uid() AND public.has_role(auth.uid(), 'athlete'));

CREATE POLICY "Athletes can update their own registration"
  ON public.event_registrations FOR UPDATE
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Athletes can delete/cancel their registration"
  ON public.event_registrations FOR DELETE
  TO authenticated
  USING (athlete_id = auth.uid());

