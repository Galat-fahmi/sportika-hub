
-- Athlete Dashboard: Settings Module
-- Supports: Security settings, Privacy controls, Notification preferences, Delete account

-- ============================================
-- 1. Account Deletion Status Enum
-- ============================================
CREATE TYPE public.account_deletion_status AS ENUM (
  'active',
  'requested',
  'scheduled',
  'deleted',
  'cancelled'
);

-- ============================================
-- 2. Security Settings Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_security_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Two-Factor Authentication
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_method TEXT, -- 'totp', 'sms', 'email'
  two_factor_secret TEXT, -- Encrypted TOTP secret
  backup_codes TEXT[], -- Encrypted backup codes
  two_factor_enabled_at TIMESTAMPTZ,
  
  -- Session Management
  max_active_sessions INTEGER DEFAULT 5,
  session_timeout_minutes INTEGER DEFAULT 1440, -- 24 hours
  require_reauth_for_sensitive_actions BOOLEAN DEFAULT true,
  
  -- Login Security
  login_alerts_enabled BOOLEAN DEFAULT true,
  suspicious_activity_alerts BOOLEAN DEFAULT true,
  
  -- Password Management
  password_last_changed_at TIMESTAMPTZ,
  password_expires_in_days INTEGER DEFAULT 0, -- 0 = never expires
  require_password_change_on_next_login BOOLEAN DEFAULT false,
  
  -- Device Management
  trusted_devices JSONB DEFAULT '[]'::jsonb, -- Array of trusted device fingerprints
  
  -- Access Log
  last_login_at TIMESTAMPTZ,
  last_login_ip TEXT,
  last_login_device TEXT,
  failed_login_attempts INTEGER DEFAULT 0,
  last_failed_login_at TIMESTAMPTZ,
  account_locked_until TIMESTAMPTZ,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_security_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own security settings"
  ON public.user_security_settings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own security settings"
  ON public.user_security_settings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own security settings"
  ON public.user_security_settings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all security settings"
  ON public.user_security_settings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_security_settings_user 
  ON public.user_security_settings(user_id);

CREATE INDEX IF NOT EXISTS idx_security_settings_locked 
  ON public.user_security_settings(user_id) 
  WHERE account_locked_until IS NOT NULL;

-- Trigger for updated_at
CREATE TRIGGER update_user_security_settings_updated_at
  BEFORE UPDATE ON public.user_security_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 3. Privacy Settings Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_privacy_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Profile Visibility
  profile_visibility TEXT DEFAULT 'public', -- 'public', 'registered_users', 'private'
  show_full_name BOOLEAN DEFAULT true,
  show_email BOOLEAN DEFAULT false,
  show_phone BOOLEAN DEFAULT false,
  show_age BOOLEAN DEFAULT true,
  show_location BOOLEAN DEFAULT true,
  
  -- Portfolio Visibility
  portfolio_is_public BOOLEAN DEFAULT true,
  show_achievements BOOLEAN DEFAULT true,
  show_certificates BOOLEAN DEFAULT true,
  show_event_history BOOLEAN DEFAULT true,
  show_performance_stats BOOLEAN DEFAULT true,
  show_rankings BOOLEAN DEFAULT false,
  
  -- Social/Contact
  allow_messages_from TEXT DEFAULT 'everyone', -- 'everyone', 'verified_only', 'contacts_only', 'no_one'
  allow_sponsorship_offers BOOLEAN DEFAULT true,
  show_social_links BOOLEAN DEFAULT true,
  
  -- Search & Discovery
  appear_in_search_results BOOLEAN DEFAULT true,
  appear_in_leaderboards BOOLEAN DEFAULT true,
  show_online_status BOOLEAN DEFAULT false,
  
  -- Data Sharing
  allow_data_for_analytics BOOLEAN DEFAULT true,
  allow_third_party_integration BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_privacy_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own privacy settings"
  ON public.user_privacy_settings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own privacy settings"
  ON public.user_privacy_settings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own privacy settings"
  ON public.user_privacy_settings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all privacy settings"
  ON public.user_privacy_settings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_privacy_settings_user 
  ON public.user_privacy_settings(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_privacy_settings_updated_at
  BEFORE UPDATE ON public.user_privacy_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 4. Account Deletion Requests Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Request details
  status account_deletion_status DEFAULT 'requested',
  reason TEXT,
  feedback TEXT,
  
  -- Scheduling
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  scheduled_deletion_date TIMESTAMPTZ, -- Grace period (e.g., 30 days)
  deleted_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  
  -- Data retention preferences
  keep_anonymized_stats BOOLEAN DEFAULT false,
  export_data_before_deletion BOOLEAN DEFAULT true,
  data_export_url TEXT,
  data_export_expires_at TIMESTAMPTZ,
  
  -- Admin review
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own deletion requests"
  ON public.account_deletion_requests FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own deletion requests"
  ON public.account_deletion_requests FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own deletion requests"
  ON public.account_deletion_requests FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND status IN ('requested', 'scheduled'));

CREATE POLICY "Admins can view all deletion requests"
  ON public.account_deletion_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all deletion requests"
  ON public.account_deletion_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_deletion_requests_user 
  ON public.account_deletion_requests(user_id);

CREATE INDEX IF NOT EXISTS idx_deletion_requests_status 
  ON public.account_deletion_requests(status, scheduled_deletion_date);

-- Trigger for updated_at
CREATE TRIGGER update_account_deletion_requests_updated_at
  BEFORE UPDATE ON public.account_deletion_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 5. User Activity Log Table (for security monitoring)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Activity details
  activity_type TEXT NOT NULL, -- 'login', 'logout', 'password_change', '2fa_enabled', 'settings_update', etc.
  activity_description TEXT,
  
  -- Context
  ip_address TEXT,
  user_agent TEXT,
  device_info JSONB,
  location_info JSONB, -- { country, city, coordinates }
  
  -- Security flags
  is_suspicious BOOLEAN DEFAULT false,
  risk_score INTEGER, -- 0-100
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own activity log"
  ON public.user_activity_log FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create activity logs"
  ON public.user_activity_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all activity logs"
  ON public.user_activity_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_activity_log_user_created 
  ON public.user_activity_log(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_activity_log_suspicious 
  ON public.user_activity_log(user_id, is_suspicious) WHERE is_suspicious = true;

CREATE INDEX IF NOT EXISTS idx_activity_log_type 
  ON public.user_activity_log(activity_type, created_at DESC);

-- ============================================
-- 6. Trigger: Auto-create security & privacy settings
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create security settings
  INSERT INTO public.user_security_settings (user_id)
  VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create privacy settings
  INSERT INTO public.user_privacy_settings (user_id)
  VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_create_user_settings
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_settings();

-- ============================================
-- 7. Function: Get User Settings (All)
-- ============================================
CREATE OR REPLACE FUNCTION public.get_user_settings(_user_id UUID)
RETURNS TABLE (
  security_settings JSONB,
  privacy_settings JSONB,
  notification_preferences JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check permissions
  IF auth.uid() != _user_id AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  RETURN QUERY
  SELECT 
    row_to_json(sec.*)::jsonb,
    row_to_json(priv.*)::jsonb,
    row_to_json(notif.*)::jsonb
  FROM public.user_security_settings sec
  FULL OUTER JOIN public.user_privacy_settings priv ON priv.user_id = sec.user_id
  FULL OUTER JOIN public.notification_preferences notif ON notif.user_id = sec.user_id
  WHERE sec.user_id = _user_id OR priv.user_id = _user_id OR notif.user_id = _user_id
  LIMIT 1;
END;
$$;

-- ============================================
-- 8. Function: Update Security Settings
-- ============================================
CREATE OR REPLACE FUNCTION public.update_security_settings(
  _user_id UUID,
  _two_factor_enabled BOOLEAN DEFAULT NULL,
  _login_alerts_enabled BOOLEAN DEFAULT NULL,
  _suspicious_activity_alerts BOOLEAN DEFAULT NULL,
  _max_active_sessions INTEGER DEFAULT NULL,
  _session_timeout_minutes INTEGER DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check permissions
  IF auth.uid() != _user_id AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;
  
  -- Ensure settings exist
  INSERT INTO public.user_security_settings (user_id)
  VALUES (_user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Update settings
  UPDATE public.user_security_settings
  SET
    two_factor_enabled = COALESCE(_two_factor_enabled, two_factor_enabled),
    two_factor_enabled_at = CASE 
      WHEN _two_factor_enabled IS NOT NULL AND _two_factor_enabled = true AND two_factor_enabled = false 
      THEN now() 
      ELSE two_factor_enabled_at 
    END,
    login_alerts_enabled = COALESCE(_login_alerts_enabled, login_alerts_enabled),
    suspicious_activity_alerts = COALESCE(_suspicious_activity_alerts, suspicious_activity_alerts),
    max_active_sessions = COALESCE(_max_active_sessions, max_active_sessions),
    session_timeout_minutes = COALESCE(_session_timeout_minutes, session_timeout_minutes),
    updated_at = now()
  WHERE user_id = _user_id;
  
  -- Log activity
  INSERT INTO public.user_activity_log (user_id, activity_type, activity_description)
  VALUES (_user_id, 'settings_update', 'Security settings updated');
  
  RETURN true;
END;
$$;

-- ============================================
-- 9. Function: Update Privacy Settings
-- ============================================
CREATE OR REPLACE FUNCTION public.update_privacy_settings(
  _user_id UUID,
  _profile_visibility TEXT DEFAULT NULL,
  _portfolio_is_public BOOLEAN DEFAULT NULL,
  _show_achievements BOOLEAN DEFAULT NULL,
  _show_event_history BOOLEAN DEFAULT NULL,
  _show_performance_stats BOOLEAN DEFAULT NULL,
  _show_rankings BOOLEAN DEFAULT NULL,
  _allow_messages_from TEXT DEFAULT NULL,
  _allow_sponsorship_offers BOOLEAN DEFAULT NULL,
  _appear_in_search_results BOOLEAN DEFAULT NULL,
  _appear_in_leaderboards BOOLEAN DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check permissions
  IF auth.uid() != _user_id AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;
  
  -- Ensure settings exist
  INSERT INTO public.user_privacy_settings (user_id)
  VALUES (_user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Update settings
  UPDATE public.user_privacy_settings
  SET
    profile_visibility = COALESCE(_profile_visibility, profile_visibility),
    portfolio_is_public = COALESCE(_portfolio_is_public, portfolio_is_public),
    show_achievements = COALESCE(_show_achievements, show_achievements),
    show_event_history = COALESCE(_show_event_history, show_event_history),
    show_performance_stats = COALESCE(_show_performance_stats, show_performance_stats),
    show_rankings = COALESCE(_show_rankings, show_rankings),
    allow_messages_from = COALESCE(_allow_messages_from, allow_messages_from),
    allow_sponsorship_offers = COALESCE(_allow_sponsorship_offers, allow_sponsorship_offers),
    appear_in_search_results = COALESCE(_appear_in_search_results, appear_in_search_results),
    appear_in_leaderboards = COALESCE(_appear_in_leaderboards, appear_in_leaderboards),
    updated_at = now()
  WHERE user_id = _user_id;
  
  -- Log activity
  INSERT INTO public.user_activity_log (user_id, activity_type, activity_description)
  VALUES (_user_id, 'settings_update', 'Privacy settings updated');
  
  RETURN true;
END;
$$;

-- ============================================
-- 10. Function: Log User Activity
-- ============================================
CREATE OR REPLACE FUNCTION public.log_user_activity(
  _user_id UUID,
  _activity_type TEXT,
  _activity_description TEXT DEFAULT NULL,
  _ip_address TEXT DEFAULT NULL,
  _user_agent TEXT DEFAULT NULL,
  _device_info JSONB DEFAULT NULL,
  _is_suspicious BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _log_id UUID;
BEGIN
  INSERT INTO public.user_activity_log (
    user_id, activity_type, activity_description,
    ip_address, user_agent, device_info, is_suspicious
  )
  VALUES (
    _user_id, _activity_type, _activity_description,
    _ip_address, _user_agent, _device_info, _is_suspicious
  )
  RETURNING id INTO _log_id;
  
  RETURN _log_id;
END;
$$;

-- ============================================
-- 11. Function: Get User Activity Log
-- ============================================
CREATE OR REPLACE FUNCTION public.get_user_activity_log(
  _user_id UUID,
  _activity_type TEXT DEFAULT NULL,
  _limit INTEGER DEFAULT 50,
  _offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  log_id UUID,
  activity_type TEXT,
  activity_description TEXT,
  ip_address TEXT,
  user_agent TEXT,
  device_info JSONB,
  is_suspicious BOOLEAN,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check permissions
  IF auth.uid() != _user_id AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  RETURN QUERY
  SELECT 
    l.id,
    l.activity_type,
    l.activity_description,
    l.ip_address,
    l.user_agent,
    l.device_info,
    l.is_suspicious,
    l.created_at
  FROM public.user_activity_log l
  WHERE l.user_id = _user_id
    AND (_activity_type IS NULL OR l.activity_type = _activity_type)
  ORDER BY l.created_at DESC
  LIMIT _limit OFFSET _offset;
END;
$$;

-- ============================================
-- 12. Function: Request Account Deletion
-- ============================================
CREATE OR REPLACE FUNCTION public.request_account_deletion(
  _user_id UUID,
  _reason TEXT DEFAULT NULL,
  _feedback TEXT DEFAULT NULL,
  _keep_anonymized_stats BOOLEAN DEFAULT false,
  _export_data BOOLEAN DEFAULT true
)
RETURNS TABLE (
  deletion_request_id UUID,
  scheduled_deletion_date TIMESTAMPTZ,
  grace_period_days INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _request_id UUID;
  _scheduled_date TIMESTAMPTZ;
  _grace_days INTEGER := 30; -- 30-day grace period
BEGIN
  -- Check permissions
  IF auth.uid() != _user_id THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;
  
  -- Check for existing active request
  IF EXISTS (
    SELECT 1 FROM public.account_deletion_requests
    WHERE user_id = _user_id AND status IN ('requested', 'scheduled')
  ) THEN
    RAISE EXCEPTION 'An active deletion request already exists';
  END IF;
  
  -- Calculate scheduled deletion date (30 days from now)
  _scheduled_date := now() + (_grace_days || ' days')::INTERVAL;
  
  -- Create deletion request
  INSERT INTO public.account_deletion_requests (
    user_id, reason, feedback, 
    keep_anonymized_stats, export_data_before_deletion,
    scheduled_deletion_date, status
  )
  VALUES (
    _user_id, _reason, _feedback,
    _keep_anonymized_stats, _export_data,
    _scheduled_date, 'scheduled'
  )
  RETURNING id INTO _request_id;
  
  -- Log activity
  INSERT INTO public.user_activity_log (user_id, activity_type, activity_description)
  VALUES (_user_id, 'account_deletion_requested', 'User requested account deletion');
  
  -- Send notification
  PERFORM public.send_notification(
    _user_id,
    'system_alert',
    'Account Deletion Scheduled',
    'Your account will be permanently deleted on ' || TO_CHAR(_scheduled_date, 'Mon DD, YYYY') || 
    '. You can cancel this request anytime before that date.',
    'urgent',
    '/settings/account',
    'Review Request'
  );
  
  RETURN QUERY
  SELECT _request_id, _scheduled_date, _grace_days;
END;
$$;

-- ============================================
-- 13. Function: Cancel Account Deletion
-- ============================================
CREATE OR REPLACE FUNCTION public.cancel_account_deletion(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check permissions
  IF auth.uid() != _user_id THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;
  
  -- Update deletion request
  UPDATE public.account_deletion_requests
  SET 
    status = 'cancelled',
    cancelled_at = now(),
    updated_at = now()
  WHERE user_id = _user_id 
    AND status IN ('requested', 'scheduled');
  
  -- Log activity
  INSERT INTO public.user_activity_log (user_id, activity_type, activity_description)
  VALUES (_user_id, 'account_deletion_cancelled', 'User cancelled account deletion request');
  
  -- Send notification
  PERFORM public.send_notification(
    _user_id,
    'system_alert',
    'Account Deletion Cancelled',
    'Your account deletion request has been cancelled. Your account remains active.',
    'medium',
    '/settings/account',
    'View Settings'
  );
  
  RETURN true;
END;
$$;

-- ============================================
-- 14. Function: Get Deletion Request Status
-- ============================================
CREATE OR REPLACE FUNCTION public.get_deletion_request_status(_user_id UUID)
RETURNS TABLE (
  request_id UUID,
  status account_deletion_status,
  scheduled_deletion_date TIMESTAMPTZ,
  days_remaining INTEGER,
  can_cancel BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check permissions
  IF auth.uid() != _user_id AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  RETURN QUERY
  SELECT 
    r.id,
    r.status,
    r.scheduled_deletion_date,
    EXTRACT(DAY FROM (r.scheduled_deletion_date - now()))::INTEGER,
    (r.status IN ('requested', 'scheduled') AND r.scheduled_deletion_date > now())
  FROM public.account_deletion_requests r
  WHERE r.user_id = _user_id
    AND r.status IN ('requested', 'scheduled')
  ORDER BY r.created_at DESC
  LIMIT 1;
END;
$$;

-- ============================================
-- 15. Function: Change Password (with logging)
-- ============================================
CREATE OR REPLACE FUNCTION public.change_password_with_logging(_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update security settings
  UPDATE public.user_security_settings
  SET 
    password_last_changed_at = now(),
    failed_login_attempts = 0,
    updated_at = now()
  WHERE user_id = _user_id;
  
  -- Log activity
  INSERT INTO public.user_activity_log (user_id, activity_type, activity_description)
  VALUES (_user_id, 'password_change', 'User changed password');
  
  -- Send notification
  PERFORM public.send_notification(
    _user_id,
    'system_alert',
    'Password Changed',
    'Your password was successfully changed. If you did not make this change, please contact support immediately.',
    'high',
    '/settings/security',
    'Review Security'
  );
END;
$$;

-- ============================================
-- 16. Function: Export User Data (GDPR compliance)
-- ============================================
CREATE OR REPLACE FUNCTION public.export_user_data(_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _export_data JSONB;
BEGIN
  -- Check permissions
  IF auth.uid() != _user_id THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;
  
  -- Compile all user data
  SELECT jsonb_build_object(
    'profile', (SELECT row_to_json(p.*) FROM public.profiles p WHERE p.user_id = _user_id),
    'athlete_stats', (SELECT row_to_json(s.*) FROM public.athlete_stats s WHERE s.athlete_id = _user_id),
    'events', (SELECT jsonb_agg(row_to_json(e.*)) FROM public.event_registrations e WHERE e.athlete_id = _user_id),
    'results', (SELECT jsonb_agg(row_to_json(r.*)) FROM public.event_results r WHERE r.athlete_id = _user_id),
    'certificates', (SELECT jsonb_agg(row_to_json(c.*)) FROM public.athlete_certificates c WHERE c.athlete_id = _user_id),
    'achievements', (SELECT jsonb_agg(row_to_json(a.*)) FROM public.athlete_achievements a WHERE a.athlete_id = _user_id),
    'notifications', (SELECT jsonb_agg(row_to_json(n.*)) FROM public.notifications n WHERE n.user_id = _user_id),
    'activity_log', (SELECT jsonb_agg(row_to_json(l.*)) FROM public.user_activity_log l WHERE l.user_id = _user_id),
    'exported_at', now()
  ) INTO _export_data;
  
  -- Log activity
  INSERT INTO public.user_activity_log (user_id, activity_type, activity_description)
  VALUES (_user_id, 'data_export', 'User exported their data');
  
  RETURN _export_data;
END;
$$;
