
-- Athlete Dashboard: Performance Module
-- Supports: Stats Overview, Rankings, Progress Tracking

-- ============================================
-- 1. Enhance Athlete Stats Table
-- ============================================
ALTER TABLE public.athlete_stats
  ADD COLUMN IF NOT EXISTS podium_finishes INTEGER DEFAULT 0, -- Top 3 finishes
  ADD COLUMN IF NOT EXISTS top_5_finishes INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS top_10_finishes INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0, -- Win streak
  ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS best_position INTEGER, -- Best ever finish
  ADD COLUMN IF NOT EXISTS worst_position INTEGER, -- Worst finish
  ADD COLUMN IF NOT EXISTS average_score NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS best_score NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS sport TEXT, -- For sport-specific stats
  ADD COLUMN IF NOT EXISTS season_year INTEGER, -- For seasonal stats
  ADD COLUMN IF NOT EXISTS season_start_date DATE,
  ADD COLUMN IF NOT EXISTS season_end_date DATE;

-- Create index for faster ranking queries
CREATE INDEX IF NOT EXISTS idx_athlete_stats_sport_points 
  ON public.athlete_stats(sport, total_points DESC);

CREATE INDEX IF NOT EXISTS idx_athlete_stats_sport_wins 
  ON public.athlete_stats(sport, total_wins DESC);

-- ============================================
-- 2. Athlete Rankings Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.athlete_rankings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Ranking scope
  ranking_type TEXT NOT NULL, -- 'local', 'national', 'global', 'category'
  sport TEXT NOT NULL,
  category TEXT, -- For category-based rankings (e.g., 'junior', 'senior', 'veteran')
  region TEXT, -- For local/regional rankings (e.g., 'New York', 'California')
  country TEXT, -- For national rankings
  
  -- Ranking data
  current_rank INTEGER NOT NULL,
  previous_rank INTEGER, -- For tracking rank changes
  rank_change INTEGER GENERATED ALWAYS AS (previous_rank - current_rank) STORED,
  
  -- Points for this ranking
  points NUMERIC(10,2) DEFAULT 0,
  
  -- Time period
  period_start DATE,
  period_end DATE,
  season_year INTEGER,
  
  -- Metadata
  total_athletes INTEGER, -- Total athletes in this ranking
  percentile NUMERIC(5,2), -- Top X% (e.g., 95.5 = top 4.5%)
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(athlete_id, ranking_type, sport, category, region, country, season_year)
);

-- Enable RLS
ALTER TABLE public.athlete_rankings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view athlete rankings"
  ON public.athlete_rankings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Athletes can view their own rankings"
  ON public.athlete_rankings FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Admins can manage all rankings"
  ON public.athlete_rankings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Indexes for ranking queries
CREATE INDEX IF NOT EXISTS idx_athlete_rankings_lookup 
  ON public.athlete_rankings(ranking_type, sport, category, region, country, current_rank);

CREATE INDEX IF NOT EXISTS idx_athlete_rankings_athlete 
  ON public.athlete_rankings(athlete_id);

-- Trigger for updated_at
CREATE TRIGGER update_athlete_rankings_updated_at
  BEFORE UPDATE ON public.athlete_rankings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 3. Personal Bests Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.athlete_personal_bests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Record details
  sport TEXT NOT NULL,
  category TEXT, -- e.g., '100m', 'marathon', 'high_jump'
  metric_type TEXT NOT NULL, -- 'time', 'distance', 'score', 'points'
  
  -- The record value
  record_value NUMERIC(12,4) NOT NULL,
  record_unit TEXT NOT NULL, -- 'seconds', 'meters', 'points', 'kg'
  
  -- Event where record was set
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  event_name TEXT,
  event_date DATE,
  event_location TEXT,
  
  -- Previous record for comparison
  previous_best NUMERIC(12,4),
  improvement NUMERIC(12,4) GENERATED ALWAYS AS (
    CASE 
      WHEN metric_type = 'time' THEN previous_best - record_value
      ELSE record_value - previous_best
    END
  ) STORED,
  
  -- Rank at time of record (optional)
  rank_at_time INTEGER,
  
  -- Verification
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  
  -- Media
  video_url TEXT,
  photo_url TEXT,
  
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(athlete_id, sport, category, metric_type)
);

-- Enable RLS
ALTER TABLE public.athlete_personal_bests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view personal bests"
  ON public.athlete_personal_bests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Athletes can manage their own personal bests"
  ON public.athlete_personal_bests FOR ALL
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Admins can manage all personal bests"
  ON public.athlete_personal_bests FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_personal_bests_athlete 
  ON public.athlete_personal_bests(athlete_id, sport);

CREATE INDEX IF NOT EXISTS idx_personal_bests_sport_category 
  ON public.athlete_personal_bests(sport, category, record_value);

-- ============================================
-- 4. Performance History Table (for trend charts)
-- ============================================
CREATE TABLE IF NOT EXISTS public.athlete_performance_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Event reference
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  event_name TEXT,
  event_date DATE NOT NULL,
  
  -- Sport/Category
  sport TEXT NOT NULL,
  category TEXT,
  
  -- Performance metrics
  position INTEGER,
  total_participants INTEGER,
  score NUMERIC(10,2),
  points_earned NUMERIC(10,2) DEFAULT 0,
  
  -- Calculated fields
  percentile NUMERIC(5,2), -- Top X%
  is_personal_best BOOLEAN DEFAULT false,
  is_win BOOLEAN GENERATED ALWAYS AS (position = 1) STORED,
  is_podium BOOLEAN GENERATED ALWAYS AS (position <= 3) STORED,
  
  -- Additional data
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.athlete_performance_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view performance history"
  ON public.athlete_performance_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Athletes can view their own performance history"
  ON public.athlete_performance_history FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Admins can manage performance history"
  ON public.athlete_performance_history FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_performance_history_athlete 
  ON public.athlete_performance_history(athlete_id, event_date DESC);

CREATE INDEX IF NOT EXISTS idx_performance_history_sport 
  ON public.athlete_performance_history(athlete_id, sport, event_date DESC);

-- ============================================
-- 5. Function: Get Athlete Performance Stats Overview
-- ============================================
CREATE OR REPLACE FUNCTION public.get_athlete_performance_stats(
  _athlete_id UUID,
  _sport TEXT DEFAULT NULL,
  _season_year INTEGER DEFAULT NULL
)
RETURNS TABLE (
  -- Basic stats
  total_events BIGINT,
  total_wins BIGINT,
  podium_finishes BIGINT,
  top_5_finishes BIGINT,
  top_10_finishes BIGINT,
  
  -- Points and ratios
  total_points NUMERIC,
  win_ratio NUMERIC,
  podium_ratio NUMERIC,
  
  -- Position stats
  best_position INTEGER,
  worst_position INTEGER,
  average_position NUMERIC,
  
  -- Score stats
  best_score NUMERIC,
  average_score NUMERIC,
  
  -- Streaks
  current_streak INTEGER,
  longest_streak INTEGER,
  
  -- Recent form (last 5 events)
  recent_form JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH recent_results AS (
    SELECT 
      r.position,
      r.score,
      e.start_date,
      CASE WHEN r.position = 1 THEN 1 ELSE 0 END as is_win
    FROM public.event_results r
    JOIN public.events e ON e.id = r.event_id
    WHERE r.athlete_id = _athlete_id
      AND (_sport IS NULL OR e.sport = _sport)
      AND (_season_year IS NULL OR EXTRACT(YEAR FROM e.start_date) = _season_year)
    ORDER BY e.start_date DESC
    LIMIT 5
  ),
  streak_calc AS (
    SELECT 
      COUNT(*) FILTER (WHERE position = 1) as current_streak
    FROM (
      SELECT position, ROW_NUMBER() OVER (ORDER BY start_date DESC) as rn
      FROM recent_results
    ) sub
    WHERE position = 1 
    AND rn <= (SELECT COUNT(*) FILTER (WHERE position = 1) FROM recent_results)
  )
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE r.position = 1),
    COUNT(*) FILTER (WHERE r.position <= 3),
    COUNT(*) FILTER (WHERE r.position <= 5),
    COUNT(*) FILTER (WHERE r.position <= 10),
    COALESCE(SUM(r.score), 0),
    CASE WHEN COUNT(*) > 0 
         THEN ROUND(COUNT(*) FILTER (WHERE r.position = 1)::NUMERIC / COUNT(*) * 100, 2)
         ELSE 0 
    END,
    CASE WHEN COUNT(*) > 0 
         THEN ROUND(COUNT(*) FILTER (WHERE r.position <= 3)::NUMERIC / COUNT(*) * 100, 2)
         ELSE 0 
    END,
    MIN(r.position),
    MAX(r.position),
    ROUND(AVG(r.position), 2),
    MAX(r.score),
    ROUND(AVG(r.score), 2),
    COALESCE((SELECT current_streak FROM streak_calc), 0),
    COALESCE(
      (SELECT MAX(streak) FROM (
        SELECT COUNT(*) as streak
        FROM (
          SELECT *, 
            SUM(CASE WHEN position = 1 THEN 0 ELSE 1 END) OVER (ORDER BY start_date) as grp
          FROM recent_results
        ) sub
        WHERE position = 1
        GROUP BY grp
      ) streaks),
      0
    ),
    COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
        'position', position,
        'score', score,
        'date', start_date
      ) ORDER BY start_date DESC) FROM recent_results),
      '[]'::jsonb
    )
  FROM public.event_results r
  JOIN public.events e ON e.id = r.event_id
  WHERE r.athlete_id = _athlete_id
    AND (_sport IS NULL OR e.sport = _sport)
    AND (_season_year IS NULL OR EXTRACT(YEAR FROM e.start_date) = _season_year);
END;
$$;

-- ============================================
-- 6. Function: Get Athlete Rankings
-- ============================================
CREATE OR REPLACE FUNCTION public.get_athlete_rankings(
  _athlete_id UUID,
  _sport TEXT DEFAULT NULL
)
RETURNS TABLE (
  ranking_id UUID,
  ranking_type TEXT,
  sport TEXT,
  category TEXT,
  region TEXT,
  country TEXT,
  current_rank INTEGER,
  previous_rank INTEGER,
  rank_change INTEGER,
  points NUMERIC,
  total_athletes INTEGER,
  percentile NUMERIC,
  season_year INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ar.id,
    ar.ranking_type,
    ar.sport,
    ar.category,
    ar.region,
    ar.country,
    ar.current_rank,
    ar.previous_rank,
    ar.rank_change,
    ar.points,
    ar.total_athletes,
    ar.percentile,
    ar.season_year
  FROM public.athlete_rankings ar
  WHERE ar.athlete_id = _athlete_id
    AND (_sport IS NULL OR ar.sport = _sport)
  ORDER BY 
    CASE ar.ranking_type 
      WHEN 'global' THEN 1 
      WHEN 'national' THEN 2 
      WHEN 'local' THEN 3 
      WHEN 'category' THEN 4 
      ELSE 5 
    END,
    ar.sport,
    ar.current_rank;
END;
$$;

-- ============================================
-- 7. Function: Get Performance Trend Chart Data
-- ============================================
CREATE OR REPLACE FUNCTION public.get_performance_trend(
  _athlete_id UUID,
  _sport TEXT DEFAULT NULL,
  _category TEXT DEFAULT NULL,
  _time_range TEXT DEFAULT '1year', -- '1month', '3months', '6months', '1year', 'all'
  _metric TEXT DEFAULT 'position' -- 'position', 'score', 'points'
)
RETURNS TABLE (
  event_date DATE,
  event_name TEXT,
  "position" INTEGER,
  score NUMERIC,
  points_earned NUMERIC,
  is_personal_best BOOLEAN,
  trend_value NUMERIC -- The value to plot on chart
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _start_date DATE;
BEGIN
  -- Calculate start date based on time range
  _start_date := CASE _time_range
    WHEN '1month' THEN CURRENT_DATE - INTERVAL '1 month'
    WHEN '3months' THEN CURRENT_DATE - INTERVAL '3 months'
    WHEN '6months' THEN CURRENT_DATE - INTERVAL '6 months'
    WHEN '1year' THEN CURRENT_DATE - INTERVAL '1 year'
    ELSE NULL
  END;

  RETURN QUERY
  SELECT 
    ph.event_date,
    ph.event_name,
    ph.position,
    ph.score,
    ph.points_earned,
    ph.is_personal_best,
    CASE _metric
      WHEN 'position' THEN ph.position::NUMERIC
      WHEN 'score' THEN ph.score
      WHEN 'points' THEN ph.points_earned
      ELSE ph.position::NUMERIC
    END as trend_value
  FROM public.athlete_performance_history ph
  WHERE ph.athlete_id = _athlete_id
    AND (_sport IS NULL OR ph.sport = _sport)
    AND (_category IS NULL OR ph.category = _category)
    AND (_start_date IS NULL OR ph.event_date >= _start_date)
  ORDER BY ph.event_date ASC;
END;
$$;

-- ============================================
-- 8. Function: Get Personal Bests
-- ============================================
CREATE OR REPLACE FUNCTION public.get_athlete_personal_bests(
  _athlete_id UUID,
  _sport TEXT DEFAULT NULL
)
RETURNS TABLE (
  personal_best_id UUID,
  sport TEXT,
  category TEXT,
  metric_type TEXT,
  record_value NUMERIC,
  record_unit TEXT,
  event_name TEXT,
  event_date DATE,
  event_location TEXT,
  previous_best NUMERIC,
  improvement NUMERIC,
  is_verified BOOLEAN,
  video_url TEXT,
  photo_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pb.id,
    pb.sport,
    pb.category,
    pb.metric_type,
    pb.record_value,
    pb.record_unit,
    pb.event_name,
    pb.event_date,
    pb.event_location,
    pb.previous_best,
    pb.improvement,
    pb.is_verified,
    pb.video_url,
    pb.photo_url
  FROM public.athlete_personal_bests pb
  WHERE pb.athlete_id = _athlete_id
    AND (_sport IS NULL OR pb.sport = _sport)
  ORDER BY pb.sport, pb.category, pb.metric_type;
END;
$$;

-- ============================================
-- 9. Function: Update/Record Personal Best
-- ============================================
CREATE OR REPLACE FUNCTION public.record_personal_best(
  _athlete_id UUID,
  _sport TEXT,
  _category TEXT,
  _metric_type TEXT,
  _record_value NUMERIC,
  _record_unit TEXT,
  _event_id UUID DEFAULT NULL,
  _event_name TEXT DEFAULT NULL,
  _event_date DATE DEFAULT NULL,
  _event_location TEXT DEFAULT NULL,
  _video_url TEXT DEFAULT NULL,
  _photo_url TEXT DEFAULT NULL,
  _notes TEXT DEFAULT NULL
)
RETURNS TABLE (
  is_new_record BOOLEAN,
  previous_value NUMERIC,
  improvement NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _existing RECORD;
  _is_better BOOLEAN;
BEGIN
  -- Check if user is recording their own PB or is admin
  IF auth.uid() != _athlete_id AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  -- Get existing record
  SELECT * INTO _existing
  FROM public.athlete_personal_bests
  WHERE athlete_id = _athlete_id
    AND sport = _sport
    AND category = _category
    AND metric_type = _metric_type;

  -- Determine if new value is better
  IF _existing IS NULL THEN
    _is_better := true;
  ELSIF _metric_type = 'time' THEN
    _is_better := _record_value < _existing.record_value;
  ELSE
    _is_better := _record_value > _existing.record_value;
  END IF;

  IF _is_better THEN
    INSERT INTO public.athlete_personal_bests (
      athlete_id, sport, category, metric_type,
      record_value, record_unit, previous_best,
      event_id, event_name, event_date, event_location,
      video_url, photo_url, notes
    )
    VALUES (
      _athlete_id, _sport, _category, _metric_type,
      _record_value, _record_unit, COALESCE(_existing.record_value, _record_value),
      _event_id, _event_name, _event_date, _event_location,
      _video_url, _photo_url, _notes
    )
    ON CONFLICT (athlete_id, sport, category, metric_type)
    DO UPDATE SET
      record_value = EXCLUDED.record_value,
      previous_best = CASE 
        WHEN athlete_personal_bests.metric_type = 'time' 
        THEN LEAST(athlete_personal_bests.record_value, EXCLUDED.record_value)
        ELSE GREATEST(athlete_personal_bests.record_value, EXCLUDED.record_value)
      END,
      event_id = EXCLUDED.event_id,
      event_name = EXCLUDED.event_name,
      event_date = EXCLUDED.event_date,
      event_location = EXCLUDED.event_location,
      video_url = EXCLUDED.video_url,
      photo_url = EXCLUDED.photo_url,
      notes = EXCLUDED.notes;

    RETURN QUERY SELECT 
      true,
      COALESCE(_existing.record_value, _record_value),
      CASE 
        WHEN _metric_type = 'time' THEN COALESCE(_existing.record_value, _record_value) - _record_value
        ELSE _record_value - COALESCE(_existing.record_value, _record_value)
      END;
  ELSE
    RETURN QUERY SELECT false, _existing.record_value, 0::NUMERIC;
  END IF;
END;
$$;

-- ============================================
-- 10. Function: Add Performance History Entry
-- ============================================
CREATE OR REPLACE FUNCTION public.add_performance_history(
  _athlete_id UUID,
  _event_id UUID,
  _event_name TEXT,
  _event_date DATE,
  _sport TEXT,
  _category TEXT DEFAULT NULL,
  _position INTEGER DEFAULT NULL,
  _total_participants INTEGER DEFAULT NULL,
  _score NUMERIC DEFAULT NULL,
  _points_earned NUMERIC DEFAULT 0,
  _notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _history_id UUID;
  _percentile NUMERIC;
BEGIN
  -- Calculate percentile
  IF _total_participants IS NOT NULL AND _position IS NOT NULL THEN
    _percentile := ROUND(((_total_participants - _position + 1)::NUMERIC / _total_participants) * 100, 2);
  END IF;

  INSERT INTO public.athlete_performance_history (
    athlete_id, event_id, event_name, event_date,
    sport, category, position, total_participants,
    score, points_earned, percentile, notes
  )
  VALUES (
    _athlete_id, _event_id, _event_name, _event_date,
    _sport, _category, _position, _total_participants,
    _score, _points_earned, _percentile, _notes
  )
  RETURNING id INTO _history_id;

  RETURN _history_id;
END;
$$;

-- ============================================
-- 11. Function: Calculate and Update Rankings
-- ============================================
CREATE OR REPLACE FUNCTION public.calculate_athlete_rankings(
  _sport TEXT,
  _season_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _total_athletes INTEGER;
BEGIN
  -- Get total athletes for this sport/season
  SELECT COUNT(DISTINCT athlete_id) INTO _total_athletes
  FROM public.athlete_stats
  WHERE sport = _sport
    AND season_year = _season_year;

  -- Update global rankings
  WITH ranked AS (
    SELECT 
      athlete_id,
      total_points,
      ROW_NUMBER() OVER (ORDER BY total_points DESC) as new_rank
    FROM public.athlete_stats
    WHERE sport = _sport
      AND season_year = _season_year
  )
  INSERT INTO public.athlete_rankings (
    athlete_id, ranking_type, sport, current_rank, 
    previous_rank, points, total_athletes, percentile, season_year
  )
  SELECT 
    athlete_id, 'global', _sport, new_rank,
    COALESCE((SELECT current_rank FROM public.athlete_rankings 
              WHERE athlete_id = ranked.athlete_id 
              AND ranking_type = 'global' 
              AND sport = _sport 
              AND season_year = _season_year), new_rank),
    total_points, _total_athletes,
    ROUND(((_total_athletes - new_rank + 1)::NUMERIC / _total_athletes) * 100, 2),
    _season_year
  FROM ranked
  ON CONFLICT (athlete_id, ranking_type, sport, category, region, country, season_year)
  DO UPDATE SET
    previous_rank = athlete_rankings.current_rank,
    current_rank = EXCLUDED.current_rank,
    points = EXCLUDED.points,
    total_athletes = EXCLUDED.total_athletes,
    percentile = EXCLUDED.percentile,
    updated_at = now();
END;
$$;

-- ============================================
-- 12. Trigger: Auto-update performance history on result insert
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_result_performance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _event_record RECORD;
BEGIN
  -- Get event details
  SELECT * INTO _event_record
  FROM public.events
  WHERE id = NEW.event_id;

  -- Add to performance history
  PERFORM public.add_performance_history(
    NEW.athlete_id,
    NEW.event_id,
    _event_record.title,
    _event_record.start_date::DATE,
    _event_record.sport,
    _event_record.age_category,
    NEW.position,
    (SELECT COUNT(*) FROM public.event_results WHERE event_id = NEW.event_id),
    NEW.score,
    COALESCE(NEW.score, 0),
    NEW.notes
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_result_insert_performance_history
  AFTER INSERT ON public.event_results
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_result_performance();

-- ============================================
-- 13. Function: Get Complete Performance Dashboard
-- ============================================
CREATE OR REPLACE FUNCTION public.get_performance_dashboard(
  _athlete_id UUID,
  _sport TEXT DEFAULT NULL
)
RETURNS TABLE (
  stats_overview JSONB,
  rankings JSONB,
  personal_bests JSONB,
  recent_trend JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    -- Stats overview
    (SELECT jsonb_build_object(
      'total_events', total_events,
      'total_wins', total_wins,
      'podium_finishes', podium_finishes,
      'win_ratio', win_ratio,
      'podium_ratio', podium_ratio,
      'best_position', best_position,
      'average_position', average_position,
      'best_score', best_score,
      'average_score', average_score,
      'current_streak', current_streak,
      'longest_streak', longest_streak
    ) FROM public.get_athlete_performance_stats(_athlete_id, _sport)),
    
    -- Rankings
    COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
        'ranking_type', ranking_type,
        'sport', sport,
        'category', category,
        'current_rank', current_rank,
        'rank_change', rank_change,
        'points', points,
        'percentile', percentile
      )) FROM public.get_athlete_rankings(_athlete_id, _sport)),
      '[]'::jsonb
    ),
    
    -- Personal bests
    COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
        'sport', sport,
        'category', category,
        'metric_type', metric_type,
        'record_value', record_value,
        'record_unit', record_unit,
        'event_date', event_date,
        'improvement', improvement,
        'is_verified', is_verified
      )) FROM public.get_athlete_personal_bests(_athlete_id, _sport)),
      '[]'::jsonb
    ),
    
    -- Recent trend (last 10 events)
    COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
        'event_date', event_date,
        'event_name', event_name,
        'position', position,
        'score', score,
        'is_personal_best', is_personal_best
      ) ORDER BY event_date DESC) 
      FROM public.get_performance_trend(_athlete_id, _sport, NULL, 'all', 'position')
      LIMIT 10),
      '[]'::jsonb
    );
END;
$$;
