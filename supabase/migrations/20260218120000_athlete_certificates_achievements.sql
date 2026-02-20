
-- Athlete Dashboard: Certificates & Achievements Module
-- Supports: Downloadable certificates, Medals/badges, Achievement timeline, Social sharing

-- ============================================
-- 1. Certificate Types Enum
-- ============================================
CREATE TYPE public.certificate_type AS ENUM (
  'participation',
  'winner',
  'runner_up',
  'podium',
  'completion',
  'record_breaker',
  'milestone',
  'special_achievement'
);

-- ============================================
-- 2. Achievement Types Enum
-- ============================================
CREATE TYPE public.achievement_type AS ENUM (
  'medal',
  'badge',
  'trophy',
  'milestone',
  'streak',
  'record'
);

-- ============================================
-- 3. Achievement Rarity Enum
-- ============================================
CREATE TYPE public.achievement_rarity AS ENUM (
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary'
);

-- ============================================
-- 4. Certificates Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.athlete_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Certificate details
  certificate_type certificate_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  
  -- Event reference (if applicable)
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  event_name TEXT,
  event_date DATE,
  
  -- Achievement details
  position INTEGER, -- Final position/rank
  category TEXT, -- Event category
  sport TEXT,
  
  -- Certificate metadata
  certificate_number TEXT UNIQUE, -- Unique certificate ID (e.g., CERT-2026-001234)
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  issued_by TEXT, -- Organization/Organizer name
  issued_by_user_id UUID REFERENCES auth.users(id),
  
  -- PDF Generation
  pdf_url TEXT, -- URL to generated PDF
  pdf_generated_at TIMESTAMPTZ,
  template_id TEXT, -- Reference to certificate template
  custom_data JSONB DEFAULT '{}'::jsonb, -- Additional data for PDF generation
  
  -- Verification
  is_verified BOOLEAN DEFAULT true,
  verification_code TEXT, -- QR code verification string
  
  -- Social sharing
  is_public BOOLEAN DEFAULT true,
  share_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.athlete_certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Athletes can view their own certificates"
  ON public.athlete_certificates FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Public can view public certificates"
  ON public.athlete_certificates FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Athletes can update their own certificates"
  ON public.athlete_certificates FOR UPDATE
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Admins and organizers can create certificates"
  ON public.athlete_certificates FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::app_role) OR
    public.has_role(auth.uid(), 'organizer'::app_role)
  );

CREATE POLICY "Admins can manage all certificates"
  ON public.athlete_certificates FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_certificates_athlete 
  ON public.athlete_certificates(athlete_id, issue_date DESC);

CREATE INDEX IF NOT EXISTS idx_certificates_event 
  ON public.athlete_certificates(event_id);

CREATE INDEX IF NOT EXISTS idx_certificates_number 
  ON public.athlete_certificates(certificate_number);

-- Trigger for updated_at
CREATE TRIGGER update_athlete_certificates_updated_at
  BEFORE UPDATE ON public.athlete_certificates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 5. Achievement Definitions Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.achievement_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Achievement identity
  code TEXT NOT NULL UNIQUE, -- e.g., 'first_win', 'ten_events', 'podium_streak_3'
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Achievement type and rarity
  achievement_type achievement_type NOT NULL,
  rarity achievement_rarity NOT NULL DEFAULT 'common',
  
  -- Visual assets
  icon_url TEXT,
  badge_url TEXT,
  color_hex TEXT, -- e.g., '#FFD700' for gold
  
  -- Requirements (for automatic awarding)
  requirement_type TEXT, -- 'event_count', 'win_count', 'streak', 'position', 'custom'
  requirement_value NUMERIC, -- e.g., 10 for '10 events'
  requirement_conditions JSONB DEFAULT '{}'::jsonb, -- Additional conditions
  
  -- Points/rewards
  points_value INTEGER DEFAULT 0,
  
  -- Sport-specific
  sport TEXT, -- NULL for all sports
  category TEXT, -- NULL for all categories
  
  -- Visibility
  is_active BOOLEAN DEFAULT true,
  is_hidden BOOLEAN DEFAULT false, -- Hidden until unlocked
  
  -- Order for display
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active achievement definitions"
  ON public.achievement_definitions FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage achievement definitions"
  ON public.achievement_definitions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_achievement_definitions_code 
  ON public.achievement_definitions(code);

CREATE INDEX IF NOT EXISTS idx_achievement_definitions_type 
  ON public.achievement_definitions(achievement_type, rarity);

-- ============================================
-- 6. Athlete Achievements Table (Earned Achievements)
-- ============================================
CREATE TABLE IF NOT EXISTS public.athlete_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievement_definitions(id) ON DELETE CASCADE,
  
  -- When and how it was earned
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  earned_from_event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  earned_from_event_name TEXT,
  
  -- Progress tracking (for progressive achievements)
  progress_value NUMERIC DEFAULT 0,
  progress_target NUMERIC,
  is_completed BOOLEAN DEFAULT true,
  
  -- Social sharing
  is_showcased BOOLEAN DEFAULT false, -- Pin to profile
  share_count INTEGER DEFAULT 0,
  
  -- Metadata
  custom_data JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  
  UNIQUE(athlete_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.athlete_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Athletes can view their own achievements"
  ON public.athlete_achievements FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Public can view showcased achievements"
  ON public.athlete_achievements FOR SELECT
  TO authenticated
  USING (is_showcased = true);

CREATE POLICY "Athletes can update their own achievements"
  ON public.athlete_achievements FOR UPDATE
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "System can create achievements"
  ON public.athlete_achievements FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Achievements awarded by system/admins

CREATE POLICY "Admins can manage all achievements"
  ON public.athlete_achievements FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_athlete_achievements_athlete 
  ON public.athlete_achievements(athlete_id, earned_at DESC);

CREATE INDEX IF NOT EXISTS idx_athlete_achievements_achievement 
  ON public.athlete_achievements(achievement_id);

CREATE INDEX IF NOT EXISTS idx_athlete_achievements_showcased 
  ON public.athlete_achievements(athlete_id, is_showcased) WHERE is_showcased = true;

-- ============================================
-- 7. Achievement Timeline/Feed Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.achievement_timeline (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Timeline entry type
  entry_type TEXT NOT NULL, -- 'certificate', 'achievement', 'milestone', 'record'
  
  -- Reference to source
  certificate_id UUID REFERENCES public.athlete_certificates(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.athlete_achievements(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  
  -- Entry details
  title TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  
  -- Timeline metadata
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_milestone BOOLEAN DEFAULT false,
  
  -- Social sharing
  is_public BOOLEAN DEFAULT true,
  share_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.achievement_timeline ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Athletes can view their own timeline"
  ON public.achievement_timeline FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Public can view public timeline entries"
  ON public.achievement_timeline FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "System can create timeline entries"
  ON public.achievement_timeline FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Athletes can update their own timeline"
  ON public.achievement_timeline FOR UPDATE
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Admins can manage all timeline entries"
  ON public.achievement_timeline FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_achievement_timeline_athlete 
  ON public.achievement_timeline(athlete_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_achievement_timeline_public 
  ON public.achievement_timeline(is_public, occurred_at DESC) WHERE is_public = true;

-- ============================================
-- 8. Storage Bucket Setup for Certificates
-- ============================================
/*
Bucket Name: certificates
Configuration:
  - Public: false (private by default, shareable via signed URLs)
  - Allowed MIME types: application/pdf
  - Max file size: 10MB
  - Folder structure: /{athlete_id}/{year}/{certificate_id}.pdf
  
Bucket Name: achievement-assets
Configuration:
  - Public: true (icons, badges are public)
  - Allowed MIME types: image/png, image/svg+xml, image/webp
  - Max file size: 2MB
  - Folder structure: /badges/{achievement_code}.png
*/

-- ============================================
-- 9. Function: Generate Certificate Number
-- ============================================
CREATE OR REPLACE FUNCTION public.generate_certificate_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  _year TEXT;
  _sequence TEXT;
  _cert_number TEXT;
BEGIN
  _year := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  -- Get next sequence number for this year
  SELECT LPAD(
    (COUNT(*) + 1)::TEXT, 
    6, 
    '0'
  ) INTO _sequence
  FROM public.athlete_certificates
  WHERE EXTRACT(YEAR FROM issue_date) = EXTRACT(YEAR FROM CURRENT_DATE);
  
  _cert_number := 'CERT-' || _year || '-' || _sequence;
  
  RETURN _cert_number;
END;
$$;

-- ============================================
-- 10. Function: Issue Certificate
-- ============================================
CREATE OR REPLACE FUNCTION public.issue_certificate(
  _athlete_id UUID,
  _certificate_type TEXT,
  _title TEXT,
  _description TEXT DEFAULT NULL,
  _event_id UUID DEFAULT NULL,
  _event_name TEXT DEFAULT NULL,
  _event_date DATE DEFAULT NULL,
  _position INTEGER DEFAULT NULL,
  _category TEXT DEFAULT NULL,
  _sport TEXT DEFAULT NULL,
  _issued_by TEXT DEFAULT NULL,
  _template_id TEXT DEFAULT 'default',
  _custom_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _certificate_id UUID;
  _cert_number TEXT;
  _verification_code TEXT;
BEGIN
  -- Generate certificate number
  _cert_number := public.generate_certificate_number();
  
  -- Generate verification code (hash of cert number + athlete_id)
  _verification_code := encode(
    digest(_cert_number || _athlete_id::TEXT, 'sha256'),
    'hex'
  );
  
  -- Insert certificate
  INSERT INTO public.athlete_certificates (
    athlete_id, certificate_type, title, description,
    event_id, event_name, event_date,
    position, category, sport,
    certificate_number, issued_by, issued_by_user_id,
    template_id, custom_data, verification_code
  )
  VALUES (
    _athlete_id, _certificate_type::certificate_type, _title, _description,
    _event_id, _event_name, _event_date,
    _position, _category, _sport,
    _cert_number, _issued_by, auth.uid(),
    _template_id, _custom_data, _verification_code
  )
  RETURNING id INTO _certificate_id;
  
  -- Add to timeline
  INSERT INTO public.achievement_timeline (
    athlete_id, entry_type, certificate_id, title, description, occurred_at
  )
  VALUES (
    _athlete_id, 'certificate', _certificate_id, _title, 
    'Certificate earned: ' || _title,
    COALESCE(_event_date, CURRENT_DATE)::TIMESTAMPTZ
  );
  
  RETURN _certificate_id;
END;
$$;

-- ============================================
-- 11. Function: Award Achievement
-- ============================================
CREATE OR REPLACE FUNCTION public.award_achievement(
  _athlete_id UUID,
  _achievement_code TEXT,
  _event_id UUID DEFAULT NULL,
  _event_name TEXT DEFAULT NULL,
  _custom_data JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  achievement_id UUID,
  is_new BOOLEAN,
  achievement_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _achievement_def RECORD;
  _athlete_achievement_id UUID;
  _is_new BOOLEAN;
BEGIN
  -- Get achievement definition
  SELECT * INTO _achievement_def
  FROM public.achievement_definitions
  WHERE code = _achievement_code AND is_active = true;
  
  IF _achievement_def IS NULL THEN
    RAISE EXCEPTION 'Achievement not found: %', _achievement_code;
  END IF;
  
  -- Check if already earned
  IF EXISTS (
    SELECT 1 FROM public.athlete_achievements
    WHERE athlete_id = _athlete_id AND achievement_id = _achievement_def.id
  ) THEN
    _is_new := false;
    SELECT id INTO _athlete_achievement_id
    FROM public.athlete_achievements
    WHERE athlete_id = _athlete_id AND achievement_id = _achievement_def.id;
  ELSE
    _is_new := true;
    
    -- Award achievement
    INSERT INTO public.athlete_achievements (
      athlete_id, achievement_id, earned_from_event_id, 
      earned_from_event_name, custom_data
    )
    VALUES (
      _athlete_id, _achievement_def.id, _event_id, _event_name, _custom_data
    )
    RETURNING id INTO _athlete_achievement_id;
    
    -- Add to timeline
    INSERT INTO public.achievement_timeline (
      athlete_id, entry_type, achievement_id, event_id,
      title, description, icon_url, occurred_at
    )
    VALUES (
      _athlete_id, 'achievement', _athlete_achievement_id, _event_id,
      _achievement_def.name, _achievement_def.description,
      _achievement_def.badge_url, now()
    );
  END IF;
  
  RETURN QUERY SELECT _athlete_achievement_id, _is_new, _achievement_def.name;
END;
$$;

-- ============================================
-- 12. Function: Get Athlete Certificates
-- ============================================
CREATE OR REPLACE FUNCTION public.get_athlete_certificates(
  _athlete_id UUID,
  _certificate_type TEXT DEFAULT NULL,
  _limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  certificate_id UUID,
  certificate_type certificate_type,
  title TEXT,
  description TEXT,
  event_name TEXT,
  event_date DATE,
  "position" INTEGER,
  category TEXT,
  sport TEXT,
  certificate_number TEXT,
  issue_date DATE,
  issued_by TEXT,
  pdf_url TEXT,
  verification_code TEXT,
  is_public BOOLEAN,
  share_count INTEGER
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
    c.id,
    c.certificate_type,
    c.title,
    c.description,
    c.event_name,
    c.event_date,
    c.position,
    c.category,
    c.sport,
    c.certificate_number,
    c.issue_date,
    c.issued_by,
    c.pdf_url,
    c.verification_code,
    c.is_public,
    c.share_count
  FROM public.athlete_certificates c
  WHERE c.athlete_id = _athlete_id
    AND (_certificate_type IS NULL OR c.certificate_type::TEXT = _certificate_type)
  ORDER BY c.issue_date DESC, c.created_at DESC
  LIMIT _limit;
END;
$$;

-- ============================================
-- 13. Function: Get Athlete Achievements
-- ============================================
CREATE OR REPLACE FUNCTION public.get_athlete_achievements(
  _athlete_id UUID,
  _achievement_type TEXT DEFAULT NULL,
  _rarity TEXT DEFAULT NULL,
  _showcased_only BOOLEAN DEFAULT false
)
RETURNS TABLE (
  athlete_achievement_id UUID,
  achievement_code TEXT,
  achievement_name TEXT,
  description TEXT,
  achievement_type achievement_type,
  rarity achievement_rarity,
  icon_url TEXT,
  badge_url TEXT,
  color_hex TEXT,
  points_value INTEGER,
  earned_at TIMESTAMPTZ,
  earned_from_event_name TEXT,
  is_showcased BOOLEAN,
  share_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    aa.id,
    ad.code,
    ad.name,
    ad.description,
    ad.achievement_type,
    ad.rarity,
    ad.icon_url,
    ad.badge_url,
    ad.color_hex,
    ad.points_value,
    aa.earned_at,
    aa.earned_from_event_name,
    aa.is_showcased,
    aa.share_count
  FROM public.athlete_achievements aa
  JOIN public.achievement_definitions ad ON ad.id = aa.achievement_id
  WHERE aa.athlete_id = _athlete_id
    AND aa.is_completed = true
    AND (_achievement_type IS NULL OR ad.achievement_type::TEXT = _achievement_type)
    AND (_rarity IS NULL OR ad.rarity::TEXT = _rarity)
    AND (_showcased_only = false OR aa.is_showcased = true)
  ORDER BY aa.earned_at DESC;
END;
$$;

-- ============================================
-- 14. Function: Get Achievement Timeline
-- ============================================
CREATE OR REPLACE FUNCTION public.get_achievement_timeline(
  _athlete_id UUID,
  _limit INTEGER DEFAULT 50,
  _offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  timeline_id UUID,
  entry_type TEXT,
  title TEXT,
  description TEXT,
  icon_url TEXT,
  occurred_at TIMESTAMPTZ,
  is_milestone BOOLEAN,
  is_public BOOLEAN,
  certificate_details JSONB,
  achievement_details JSONB
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
    t.id,
    t.entry_type,
    t.title,
    t.description,
    t.icon_url,
    t.occurred_at,
    t.is_milestone,
    t.is_public,
    CASE 
      WHEN t.certificate_id IS NOT NULL THEN
        jsonb_build_object(
          'certificate_id', c.id,
          'certificate_number', c.certificate_number,
          'certificate_type', c.certificate_type,
          'pdf_url', c.pdf_url
        )
      ELSE NULL
    END,
    CASE 
      WHEN t.achievement_id IS NOT NULL THEN
        jsonb_build_object(
          'achievement_code', ad.code,
          'achievement_name', ad.name,
          'badge_url', ad.badge_url,
          'rarity', ad.rarity
        )
      ELSE NULL
    END
  FROM public.achievement_timeline t
  LEFT JOIN public.athlete_certificates c ON c.id = t.certificate_id
  LEFT JOIN public.athlete_achievements aa ON aa.id = t.achievement_id
  LEFT JOIN public.achievement_definitions ad ON ad.id = aa.achievement_id
  WHERE t.athlete_id = _athlete_id
  ORDER BY t.occurred_at DESC, t.created_at DESC
  LIMIT _limit OFFSET _offset;
END;
$$;

-- ============================================
-- 15. Function: Get Social Share Data
-- ============================================
CREATE OR REPLACE FUNCTION public.get_share_metadata(
  _item_type TEXT, -- 'certificate' or 'achievement'
  _item_id UUID
)
RETURNS TABLE (
  share_url TEXT,
  title TEXT,
  description TEXT,
  image_url TEXT,
  metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _athlete_name TEXT;
  _base_url TEXT;
BEGIN
  _base_url := 'https://sportika.com'; -- Update with actual domain
  
  IF _item_type = 'certificate' THEN
    RETURN QUERY
    SELECT 
      _base_url || '/certificates/' || c.id::TEXT,
      c.title || ' - ' || p.full_name,
      'Certificate earned: ' || c.title || ' on ' || c.issue_date::TEXT,
      c.pdf_url, -- Or thumbnail URL
      jsonb_build_object(
        'type', 'certificate',
        'certificate_number', c.certificate_number,
        'athlete', p.full_name,
        'date', c.issue_date,
        'event', c.event_name
      )
    FROM public.athlete_certificates c
    JOIN public.profiles p ON p.user_id = c.athlete_id
    WHERE c.id = _item_id AND c.is_public = true;
    
  ELSIF _item_type = 'achievement' THEN
    RETURN QUERY
    SELECT 
      _base_url || '/achievements/' || aa.id::TEXT,
      ad.name || ' - ' || p.full_name,
      'Achievement unlocked: ' || ad.description,
      ad.badge_url,
      jsonb_build_object(
        'type', 'achievement',
        'achievement_code', ad.code,
        'athlete', p.full_name,
        'rarity', ad.rarity,
        'date', aa.earned_at
      )
    FROM public.athlete_achievements aa
    JOIN public.achievement_definitions ad ON ad.id = aa.achievement_id
    JOIN public.profiles p ON p.user_id = aa.athlete_id
    WHERE aa.id = _item_id;
  END IF;
END;
$$;

-- ============================================
-- 16. Function: Increment Share Count
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_share_count(
  _item_type TEXT, -- 'certificate' or 'achievement'
  _item_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _item_type = 'certificate' THEN
    UPDATE public.athlete_certificates
    SET share_count = share_count + 1
    WHERE id = _item_id;
  ELSIF _item_type = 'achievement' THEN
    UPDATE public.athlete_achievements
    SET share_count = share_count + 1
    WHERE id = _item_id;
  END IF;
END;
$$;

-- ============================================
-- 17. Function: Check Achievement Progress
-- ============================================
CREATE OR REPLACE FUNCTION public.check_achievement_progress(_athlete_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _achievement RECORD;
  _current_value NUMERIC;
BEGIN
  -- Check each achievement definition
  FOR _achievement IN 
    SELECT * FROM public.achievement_definitions 
    WHERE is_active = true 
    AND requirement_type IS NOT NULL
  LOOP
    -- Calculate current progress based on requirement type
    CASE _achievement.requirement_type
      WHEN 'event_count' THEN
        SELECT COUNT(*) INTO _current_value
        FROM public.event_registrations
        WHERE athlete_id = _athlete_id;
        
      WHEN 'win_count' THEN
        SELECT COUNT(*) INTO _current_value
        FROM public.event_results
        WHERE athlete_id = _athlete_id AND position = 1;
        
      WHEN 'podium_count' THEN
        SELECT COUNT(*) INTO _current_value
        FROM public.event_results
        WHERE athlete_id = _athlete_id AND position <= 3;
        
      ELSE
        CONTINUE;
    END CASE;
    
    -- Award achievement if requirement met
    IF _current_value >= _achievement.requirement_value THEN
      PERFORM public.award_achievement(_athlete_id, _achievement.code);
    END IF;
  END LOOP;
END;
$$;

-- ============================================
-- 18. Trigger: Auto-check achievements on result insert
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_result_achievements()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if athlete earned any new achievements
  PERFORM public.check_achievement_progress(NEW.athlete_id);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_result_check_achievements
  AFTER INSERT ON public.event_results
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_result_achievements();

-- ============================================
-- 19. Function: Get Certificates and Achievements Summary
-- ============================================
CREATE OR REPLACE FUNCTION public.get_certificates_achievements_summary(_athlete_id UUID)
RETURNS TABLE (
  total_certificates BIGINT,
  total_achievements BIGINT,
  total_badges BIGINT,
  total_medals BIGINT,
  rarity_counts JSONB,
  recent_certificates JSONB,
  showcased_achievements JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    -- Total counts
    (SELECT COUNT(*) FROM public.athlete_certificates WHERE athlete_id = _athlete_id),
    (SELECT COUNT(*) FROM public.athlete_achievements WHERE athlete_id = _athlete_id AND is_completed = true),
    (SELECT COUNT(*) FROM public.athlete_achievements aa
     JOIN public.achievement_definitions ad ON ad.id = aa.achievement_id
     WHERE aa.athlete_id = _athlete_id AND ad.achievement_type = 'badge'),
    (SELECT COUNT(*) FROM public.athlete_achievements aa
     JOIN public.achievement_definitions ad ON ad.id = aa.achievement_id
     WHERE aa.athlete_id = _athlete_id AND ad.achievement_type = 'medal'),
    
    -- Rarity distribution
    (SELECT jsonb_object_agg(rarity, count)
     FROM (
       SELECT ad.rarity::TEXT, COUNT(*) as count
       FROM public.athlete_achievements aa
       JOIN public.achievement_definitions ad ON ad.id = aa.achievement_id
       WHERE aa.athlete_id = _athlete_id
       GROUP BY ad.rarity
     ) sub),
    
    -- Recent certificates (last 3)
    (SELECT jsonb_agg(jsonb_build_object(
      'id', c.id,
      'title', c.title,
      'issue_date', c.issue_date,
      'certificate_type', c.certificate_type
    ) ORDER BY c.issue_date DESC)
     FROM (
       SELECT * FROM public.athlete_certificates
       WHERE athlete_id = _athlete_id
       ORDER BY issue_date DESC
       LIMIT 3
     ) c),
    
    -- Showcased achievements
    (SELECT jsonb_agg(jsonb_build_object(
      'id', aa.id,
      'name', ad.name,
      'badge_url', ad.badge_url,
      'rarity', ad.rarity
    ))
     FROM public.athlete_achievements aa
     JOIN public.achievement_definitions ad ON ad.id = aa.achievement_id
     WHERE aa.athlete_id = _athlete_id AND aa.is_showcased = true);
END;
$$;
