-- =====================================================
-- ATHLETE PORTFOLIOS MODULE
-- =====================================================
-- Purpose: Public-facing athlete portfolios with customization and sharing
-- Features: 
--   - Portfolio customization (bio, specialties, media)
--   - Social media links and contact info
--   - Portfolio sections management
--   - Privacy controls and custom URLs
--   - View tracking and analytics
-- =====================================================

-- =====================================================
-- ENUMS
-- =====================================================

-- Portfolio section types
CREATE TYPE public.portfolio_section_type AS ENUM (
  'about',
  'achievements',
  'results',
  'media',
  'stats',
  'sponsors',
  'testimonials',
  'custom'
);

-- Portfolio visibility
CREATE TYPE public.portfolio_visibility AS ENUM (
  'public',
  'unlisted',
  'private'
);

-- =====================================================
-- TABLES
-- =====================================================

-- Athlete Portfolios Table
CREATE TABLE public.athlete_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  slug TEXT UNIQUE, -- Custom URL slug (e.g., athlete.sportika.com/john-smith)
  title TEXT,
  tagline TEXT,
  bio TEXT,
  
  -- Visual Customization
  cover_image_url TEXT,
  profile_image_url TEXT,
  theme_color TEXT DEFAULT '#3B82F6',
  custom_css TEXT,
  
  -- Contact & Social
  email TEXT,
  phone TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}', -- { "instagram": "url", "twitter": "url", etc }
  
  -- Portfolio Settings
  visibility portfolio_visibility DEFAULT 'public',
  allow_comments BOOLEAN DEFAULT true,
  show_contact_form BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  
  -- Specialties
  sports TEXT[] DEFAULT '{}',
  specialties TEXT[] DEFAULT '{}',
  
  -- Stats
  views_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  
  -- Metadata
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT valid_theme_color CHECK (theme_color ~ '^#[0-9A-Fa-f]{6}$')
);

-- Portfolio Sections Table
CREATE TABLE public.portfolio_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.athlete_portfolios(id) ON DELETE CASCADE,
  
  -- Section Info
  section_type portfolio_section_type NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  media_urls TEXT[] DEFAULT '{}',
  
  -- Display
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  
  -- Custom sections
  custom_data JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio Media Gallery Table
CREATE TABLE public.portfolio_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.athlete_portfolios(id) ON DELETE CASCADE,
  
  -- Media Info
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'document')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  description TEXT,
  
  -- Organization
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  
  -- Metadata
  file_size INTEGER,
  mime_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio Views Analytics Table
CREATE TABLE public.portfolio_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.athlete_portfolios(id) ON DELETE CASCADE,
  
  -- Visitor Info
  visitor_id UUID, -- Logged in user or null for anonymous
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  
  -- Location
  country TEXT,
  city TEXT,
  
  -- Referrer
  referrer_url TEXT,
  referrer_source TEXT,
  
  -- Interaction
  time_spent_seconds INTEGER,
  pages_viewed INTEGER DEFAULT 1,
  
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio Testimonials Table
CREATE TABLE public.portfolio_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.athlete_portfolios(id) ON DELETE CASCADE,
  
  -- Author Info
  author_name TEXT NOT NULL,
  author_title TEXT,
  author_company TEXT,
  author_image_url TEXT,
  
  -- Content
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  
  -- Display
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_athlete_portfolios_user_id ON public.athlete_portfolios(user_id);
CREATE INDEX idx_athlete_portfolios_slug ON public.athlete_portfolios(slug);
CREATE INDEX idx_athlete_portfolios_visibility ON public.athlete_portfolios(visibility);
CREATE INDEX idx_athlete_portfolios_featured ON public.athlete_portfolios(is_featured) WHERE is_featured = true;

CREATE INDEX idx_portfolio_sections_portfolio_id ON public.portfolio_sections(portfolio_id);
CREATE INDEX idx_portfolio_sections_order ON public.portfolio_sections(portfolio_id, display_order);

CREATE INDEX idx_portfolio_media_portfolio_id ON public.portfolio_media(portfolio_id);
CREATE INDEX idx_portfolio_media_featured ON public.portfolio_media(portfolio_id, is_featured) WHERE is_featured = true;

CREATE INDEX idx_portfolio_views_portfolio_id ON public.portfolio_views(portfolio_id);
CREATE INDEX idx_portfolio_views_date ON public.portfolio_views(viewed_at);

CREATE INDEX idx_portfolio_testimonials_portfolio_id ON public.portfolio_testimonials(portfolio_id);
CREATE INDEX idx_portfolio_testimonials_approved ON public.portfolio_testimonials(portfolio_id, is_approved) WHERE is_approved = true;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.athlete_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_testimonials ENABLE ROW LEVEL SECURITY;

-- Athlete Portfolios Policies
CREATE POLICY "Public portfolios are viewable by everyone"
  ON public.athlete_portfolios FOR SELECT
  USING (visibility = 'public' OR (visibility = 'unlisted' AND slug IS NOT NULL));

CREATE POLICY "Users can view own portfolio regardless of visibility"
  ON public.athlete_portfolios FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own portfolio"
  ON public.athlete_portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolio"
  ON public.athlete_portfolios FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolio"
  ON public.athlete_portfolios FOR DELETE
  USING (auth.uid() = user_id);

-- Portfolio Sections Policies
CREATE POLICY "Portfolio sections viewable if portfolio is viewable"
  ON public.portfolio_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.athlete_portfolios
      WHERE id = portfolio_sections.portfolio_id
      AND (visibility IN ('public', 'unlisted') OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage own portfolio sections"
  ON public.portfolio_sections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.athlete_portfolios
      WHERE id = portfolio_sections.portfolio_id AND user_id = auth.uid()
    )
  );

-- Portfolio Media Policies
CREATE POLICY "Portfolio media viewable if portfolio is viewable"
  ON public.portfolio_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.athlete_portfolios
      WHERE id = portfolio_media.portfolio_id
      AND (visibility IN ('public', 'unlisted') OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage own portfolio media"
  ON public.portfolio_media FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.athlete_portfolios
      WHERE id = portfolio_media.portfolio_id AND user_id = auth.uid()
    )
  );

-- Portfolio Views Policies (Read-only for analytics)
CREATE POLICY "Anyone can create portfolio view"
  ON public.portfolio_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Portfolio owner can view analytics"
  ON public.portfolio_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.athlete_portfolios
      WHERE id = portfolio_views.portfolio_id AND user_id = auth.uid()
    )
  );

-- Portfolio Testimonials Policies
CREATE POLICY "Approved testimonials viewable with portfolio"
  ON public.portfolio_testimonials FOR SELECT
  USING (
    is_approved = true
    AND EXISTS (
      SELECT 1 FROM public.athlete_portfolios
      WHERE id = portfolio_testimonials.portfolio_id
      AND (visibility IN ('public', 'unlisted') OR user_id = auth.uid())
    )
  );

CREATE POLICY "Portfolio owner can manage testimonials"
  ON public.portfolio_testimonials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.athlete_portfolios
      WHERE id = portfolio_testimonials.portfolio_id AND user_id = auth.uid()
    )
  );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Get Portfolio by Slug
CREATE OR REPLACE FUNCTION public.get_portfolio_by_slug(
  _slug TEXT
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  slug TEXT,
  title TEXT,
  tagline TEXT,
  bio TEXT,
  cover_image_url TEXT,
  profile_image_url TEXT,
  theme_color TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  social_links JSONB,
  visibility portfolio_visibility,
  sports TEXT[],
  specialties TEXT[],
  views_count INTEGER,
  is_verified BOOLEAN,
  published_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.user_id,
    p.slug,
    p.title,
    p.tagline,
    p.bio,
    p.cover_image_url,
    p.profile_image_url,
    p.theme_color,
    p.email,
    p.phone,
    p.website,
    p.social_links,
    p.visibility,
    p.sports,
    p.specialties,
    p.views_count,
    p.is_verified,
    p.published_at
  FROM public.athlete_portfolios p
  WHERE p.slug = _slug
    AND p.visibility IN ('public', 'unlisted');
END;
$$;

-- Get Portfolio Sections
CREATE OR REPLACE FUNCTION public.get_portfolio_sections(
  _portfolio_id UUID
)
RETURNS TABLE (
  id UUID,
  section_type portfolio_section_type,
  title TEXT,
  content TEXT,
  media_urls TEXT[],
  display_order INTEGER,
  is_visible BOOLEAN,
  custom_data JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.section_type,
    s.title,
    s.content,
    s.media_urls,
    s.display_order,
    s.is_visible,
    s.custom_data
  FROM public.portfolio_sections s
  WHERE s.portfolio_id = _portfolio_id
    AND s.is_visible = true
  ORDER BY s.display_order ASC;
END;
$$;

-- Increment Portfolio View Count
CREATE OR REPLACE FUNCTION public.increment_portfolio_views(
  _portfolio_id UUID,
  _visitor_id UUID DEFAULT NULL,
  _session_id TEXT DEFAULT NULL,
  _referrer_url TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Increment view count
  UPDATE public.athlete_portfolios
  SET views_count = views_count + 1
  WHERE id = _portfolio_id;
  
  -- Log the view
  INSERT INTO public.portfolio_views (
    portfolio_id,
    visitor_id,
    session_id,
    referrer_url
  ) VALUES (
    _portfolio_id,
    _visitor_id,
    _session_id,
    _referrer_url
  );
  
  RETURN true;
END;
$$;

-- Update Portfolio
CREATE OR REPLACE FUNCTION public.update_athlete_portfolio(
  _user_id UUID,
  _slug TEXT DEFAULT NULL,
  _title TEXT DEFAULT NULL,
  _tagline TEXT DEFAULT NULL,
  _bio TEXT DEFAULT NULL,
  _cover_image_url TEXT DEFAULT NULL,
  _profile_image_url TEXT DEFAULT NULL,
  _theme_color TEXT DEFAULT NULL,
  _email TEXT DEFAULT NULL,
  _phone TEXT DEFAULT NULL,
  _website TEXT DEFAULT NULL,
  _social_links JSONB DEFAULT NULL,
  _visibility portfolio_visibility DEFAULT NULL,
  _sports TEXT[] DEFAULT NULL,
  _specialties TEXT[] DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_portfolio_id UUID;
BEGIN
  -- Get or create portfolio
  SELECT id INTO v_portfolio_id
  FROM public.athlete_portfolios
  WHERE user_id = _user_id;
  
  IF v_portfolio_id IS NULL THEN
    -- Create new portfolio
    INSERT INTO public.athlete_portfolios (
      user_id,
      slug,
      title,
      tagline,
      bio,
      cover_image_url,
      profile_image_url,
      theme_color,
      email,
      phone,
      website,
      social_links,
      visibility,
      sports,
      specialties,
      published_at
    ) VALUES (
      _user_id,
      _slug,
      _title,
      _tagline,
      _bio,
      _cover_image_url,
      _profile_image_url,
      COALESCE(_theme_color, '#3B82F6'),
      _email,
      _phone,
      _website,
      COALESCE(_social_links, '{}'::JSONB),
      COALESCE(_visibility, 'public'),
      COALESCE(_sports, ARRAY[]::TEXT[]),
      COALESCE(_specialties, ARRAY[]::TEXT[]),
      NOW()
    )
    RETURNING id INTO v_portfolio_id;
  ELSE
    -- Update existing portfolio
    UPDATE public.athlete_portfolios
    SET
      slug = COALESCE(_slug, slug),
      title = COALESCE(_title, title),
      tagline = COALESCE(_tagline, tagline),
      bio = COALESCE(_bio, bio),
      cover_image_url = COALESCE(_cover_image_url, cover_image_url),
      profile_image_url = COALESCE(_profile_image_url, profile_image_url),
      theme_color = COALESCE(_theme_color, theme_color),
      email = COALESCE(_email, email),
      phone = COALESCE(_phone, phone),
      website = COALESCE(_website, website),
      social_links = COALESCE(_social_links, social_links),
      visibility = COALESCE(_visibility, visibility),
      sports = COALESCE(_sports, sports),
      specialties = COALESCE(_specialties, specialties),
      last_updated_at = NOW()
    WHERE id = v_portfolio_id;
  END IF;
  
  RETURN v_portfolio_id;
END;
$$;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update portfolio sections timestamp
CREATE OR REPLACE FUNCTION public.update_portfolio_section_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_portfolio_section_timestamp
  BEFORE UPDATE ON public.portfolio_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_portfolio_section_timestamp();

-- Auto-update parent portfolio timestamp when sections change
CREATE OR REPLACE FUNCTION public.update_parent_portfolio_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.athlete_portfolios
  SET last_updated_at = NOW()
  WHERE id = COALESCE(NEW.portfolio_id, OLD.portfolio_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trigger_update_parent_portfolio_on_section_change
  AFTER INSERT OR UPDATE OR DELETE ON public.portfolio_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_parent_portfolio_timestamp();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE public.athlete_portfolios IS 'Public-facing athlete portfolios with customization';
COMMENT ON TABLE public.portfolio_sections IS 'Customizable sections within athlete portfolios';
COMMENT ON TABLE public.portfolio_media IS 'Media gallery for athlete portfolios';
COMMENT ON TABLE public.portfolio_views IS 'Analytics tracking for portfolio views';
COMMENT ON TABLE public.portfolio_testimonials IS 'Testimonials and reviews for athletes';

COMMENT ON FUNCTION public.get_portfolio_by_slug IS 'Retrieve portfolio by custom slug';
COMMENT ON FUNCTION public.get_portfolio_sections IS 'Get visible sections for a portfolio';
COMMENT ON FUNCTION public.increment_portfolio_views IS 'Track portfolio view and increment counter';
COMMENT ON FUNCTION public.update_athlete_portfolio IS 'Create or update athlete portfolio';
