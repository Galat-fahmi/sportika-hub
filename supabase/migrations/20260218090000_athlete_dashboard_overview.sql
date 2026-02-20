
-- Athlete Dashboard Overview Schema
-- Supports: Welcome header, Upcoming events, Recent results, Performance summary, Quick actions

-- ============================================
-- 1. Athlete Stats Table (Performance Summary)
-- ============================================
CREATE TABLE IF NOT EXISTS public.athlete_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Performance metrics
  current_rank INTEGER DEFAULT 0,
  total_points NUMERIC(10,2) DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  total_events INTEGER DEFAULT 0,
  
  -- Additional stats
  win_rate NUMERIC(5,2) DEFAULT 0,
  average_position NUMERIC(5,2) DEFAULT 0,
  
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(athlete_id)
);

-- Enable RLS
ALTER TABLE public.athlete_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for athlete_stats
CREATE POLICY "Athletes can view their own stats"
  ON public.athlete_stats FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Admins can view all athlete stats"
  ON public.athlete_stats FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Organizers can view athlete stats"
  ON public.athlete_stats FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'organizer'::app_role));

-- Trigger to auto-create athlete stats on profile creation
CREATE OR REPLACE FUNCTION public.handle_new_athlete_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create stats if user is an athlete
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.user_id AND role = 'athlete') THEN
    INSERT INTO public.athlete_stats (athlete_id)
    VALUES (NEW.user_id)
    ON CONFLICT (athlete_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_athlete_stats
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_athlete_stats();

-- Trigger to update athlete_stats.updated_at
CREATE TRIGGER update_athlete_stats_updated_at
  BEFORE UPDATE ON public.athlete_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 2. Function: Get Athlete Dashboard Overview
-- ============================================
-- Returns all data needed for the Athlete Dashboard Overview page
CREATE OR REPLACE FUNCTION public.get_athlete_dashboard_overview(_athlete_id UUID)
RETURNS TABLE (
  -- User info
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  sport TEXT,
  
  -- Performance summary
  current_rank INTEGER,
  total_points NUMERIC,
  total_wins INTEGER,
  total_events INTEGER,
  win_rate NUMERIC,
  average_position NUMERIC,
  
  -- Upcoming events (as JSON array)
  upcoming_events JSONB,
  
  -- Recent results (as JSON array)
  recent_results JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH upcoming AS (
    -- Get upcoming registered events
    SELECT 
      e.id,
      e.title,
      e.start_date,
      e.location,
      er.status as registration_status,
      er.payment_status
    FROM public.event_registrations er
    JOIN public.events e ON e.id = er.event_id
    WHERE er.athlete_id = _athlete_id
      AND e.start_date >= now()
    ORDER BY e.start_date ASC
    LIMIT 5
  ),
  results AS (
    -- Get recent results
    SELECT 
      e.id as event_id,
      e.title as event_name,
      e.start_date as event_date,
      r.position,
      r.score,
      r.notes
    FROM public.event_results r
    JOIN public.events e ON e.id = r.event_id
    WHERE r.athlete_id = _athlete_id
    ORDER BY e.start_date DESC
    LIMIT 5
  )
  SELECT 
    p.user_id,
    p.full_name,
    p.avatar_url,
    p.sport,
    COALESCE(s.current_rank, 0),
    COALESCE(s.total_points, 0),
    COALESCE(s.total_wins, 0),
    COALESCE(s.total_events, 0),
    COALESCE(s.win_rate, 0),
    COALESCE(s.average_position, 0),
    COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
        'event_id', u.id,
        'event_name', u.title,
        'event_date', u.start_date,
        'location', u.location,
        'status', u.registration_status,
        'payment_status', u.payment_status
      ) ORDER BY u.start_date) FROM upcoming u),
      '[]'::jsonb
    ),
    COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
        'event_id', r.event_id,
        'event_name', r.event_name,
        'event_date', r.event_date,
        'position', r.position,
        'score', r.score,
        'notes', r.notes
      ) ORDER BY r.event_date DESC) FROM results r),
      '[]'::jsonb
    )
  FROM public.profiles p
  LEFT JOIN public.athlete_stats s ON s.athlete_id = p.user_id
  WHERE p.user_id = _athlete_id;
END;
$$;

-- ============================================
-- 3. Function: Update Athlete Stats
-- ============================================
-- Recalculates athlete stats based on event results
CREATE OR REPLACE FUNCTION public.recalculate_athlete_stats(_athlete_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _total_events INTEGER;
  _total_wins INTEGER;
  _total_points NUMERIC;
  _win_rate NUMERIC;
  _avg_position NUMERIC;
BEGIN
  -- Calculate stats from results
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE position = 1),
    COALESCE(SUM(score), 0),
    COALESCE(AVG(position), 0)
  INTO _total_events, _total_wins, _total_points, _avg_position
  FROM public.event_results
  WHERE athlete_id = _athlete_id;

  -- Calculate win rate
  IF _total_events > 0 THEN
    _win_rate := ROUND((_total_wins::NUMERIC / _total_events) * 100, 2);
  ELSE
    _win_rate := 0;
  END IF;

  -- Update or insert stats
  INSERT INTO public.athlete_stats (
    athlete_id, 
    total_events, 
    total_wins, 
    total_points, 
    win_rate, 
    average_position
  )
  VALUES (
    _athlete_id, 
    _total_events, 
    _total_wins, 
    _total_points, 
    _win_rate, 
    _avg_position
  )
  ON CONFLICT (athlete_id) 
  DO UPDATE SET
    total_events = EXCLUDED.total_events,
    total_wins = EXCLUDED.total_wins,
    total_points = EXCLUDED.total_points,
    win_rate = EXCLUDED.win_rate,
    average_position = EXCLUDED.average_position,
    updated_at = now();
END;
$$;

-- ============================================
-- 4. Trigger: Auto-update stats on result insert/update
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_result_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.recalculate_athlete_stats(OLD.athlete_id);
    RETURN OLD;
  ELSE
    PERFORM public.recalculate_athlete_stats(NEW.athlete_id);
    RETURN NEW;
  END IF;
END;
$$;

CREATE TRIGGER on_result_change
  AFTER INSERT OR UPDATE OR DELETE ON public.event_results
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_result_change();

-- ============================================
-- 5. Function: Get Upcoming Events for Athlete
-- ============================================
CREATE OR REPLACE FUNCTION public.get_athlete_upcoming_events(_athlete_id UUID, _limit INTEGER DEFAULT 5)
RETURNS TABLE (
  event_id UUID,
  event_name TEXT,
  event_date TIMESTAMPTZ,
  location TEXT,
  status TEXT,
  payment_status TEXT
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
    e.start_date,
    e.location,
    er.status,
    er.payment_status
  FROM public.event_registrations er
  JOIN public.events e ON e.id = er.event_id
  WHERE er.athlete_id = _athlete_id
    AND e.start_date >= now()
  ORDER BY e.start_date ASC
  LIMIT _limit;
END;
$$;

-- ============================================
-- 6. Function: Get Recent Results for Athlete
-- ============================================
CREATE OR REPLACE FUNCTION public.get_athlete_recent_results(_athlete_id UUID, _limit INTEGER DEFAULT 5)
RETURNS TABLE (
  event_id UUID,
  event_name TEXT,
  event_date TIMESTAMPTZ,
  "position" INTEGER,
  score NUMERIC,
  notes TEXT
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
    e.start_date,
    r.position,
    r.score,
    r.notes
  FROM public.event_results r
  JOIN public.events e ON e.id = r.event_id
  WHERE r.athlete_id = _athlete_id
  ORDER BY e.start_date DESC
  LIMIT _limit;
END;
$$;

