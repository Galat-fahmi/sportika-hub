
-- Athlete Dashboard: Notifications Module
-- Supports: Event reminders, Registration approvals, Result announcements, Platform updates, Sponsorship offers

-- ============================================
-- 1. Notification Type Enum
-- ============================================
CREATE TYPE public.notification_type AS ENUM (
  'event_reminder',
  'registration_approved',
  'registration_rejected',
  'registration_waitlisted',
  'payment_confirmed',
  'payment_failed',
  'result_announced',
  'certificate_issued',
  'achievement_earned',
  'event_cancelled',
  'event_updated',
  'platform_update',
  'sponsorship_offer',
  'message',
  'system_alert'
);

-- ============================================
-- 2. Notification Priority Enum
-- ============================================
CREATE TYPE public.notification_priority AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

-- ============================================
-- 3. Notification Channel Enum
-- ============================================
CREATE TYPE public.notification_channel AS ENUM (
  'in_app',
  'email',
  'push',
  'sms'
);

-- ============================================
-- 4. Notifications Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Recipient
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification details
  notification_type notification_type NOT NULL,
  priority notification_priority DEFAULT 'medium',
  
  -- Content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  icon_url TEXT,
  image_url TEXT,
  
  -- Action/Link
  action_url TEXT, -- Deep link or URL to navigate to
  action_label TEXT, -- e.g., "View Event", "See Results"
  
  -- Related entities (for context)
  related_event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  related_registration_id UUID REFERENCES public.event_registrations(id) ON DELETE SET NULL,
  related_certificate_id UUID REFERENCES public.athlete_certificates(id) ON DELETE SET NULL,
  related_achievement_id UUID REFERENCES public.athlete_achievements(id) ON DELETE SET NULL,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb, -- Additional data (sponsorship details, etc.)
  
  -- Delivery status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_delivered BOOLEAN DEFAULT false,
  delivered_at TIMESTAMPTZ,
  
  -- Channels
  sent_via notification_channel[] DEFAULT ARRAY['in_app']::notification_channel[],
  
  -- Scheduling
  scheduled_for TIMESTAMPTZ, -- For future delivery
  expires_at TIMESTAMPTZ, -- Auto-hide after expiry
  
  -- Sender (optional, for messages)
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Any authenticated user/system can create

CREATE POLICY "Admins can manage all notifications"
  ON public.notifications FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_created 
  ON public.notifications(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
  ON public.notifications(user_id, is_read) WHERE is_read = false;

CREATE INDEX IF NOT EXISTS idx_notifications_scheduled 
  ON public.notifications(scheduled_for) WHERE scheduled_for IS NOT NULL AND is_delivered = false;

CREATE INDEX IF NOT EXISTS idx_notifications_type 
  ON public.notifications(notification_type, user_id);

-- Trigger for updated_at
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 5. Notification Preferences Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Global preferences (already in athlete_settings, but specific here)
  enabled_in_app BOOLEAN DEFAULT true,
  enabled_email BOOLEAN DEFAULT true,
  enabled_push BOOLEAN DEFAULT true,
  enabled_sms BOOLEAN DEFAULT false,
  
  -- Per-type preferences
  event_reminders_enabled BOOLEAN DEFAULT true,
  event_reminders_channels notification_channel[] DEFAULT ARRAY['in_app', 'email']::notification_channel[],
  event_reminders_advance_hours INTEGER DEFAULT 24, -- Hours before event
  
  registration_updates_enabled BOOLEAN DEFAULT true,
  registration_updates_channels notification_channel[] DEFAULT ARRAY['in_app', 'email']::notification_channel[],
  
  result_announcements_enabled BOOLEAN DEFAULT true,
  result_announcements_channels notification_channel[] DEFAULT ARRAY['in_app', 'email', 'push']::notification_channel[],
  
  achievements_enabled BOOLEAN DEFAULT true,
  achievements_channels notification_channel[] DEFAULT ARRAY['in_app', 'push']::notification_channel[],
  
  platform_updates_enabled BOOLEAN DEFAULT true,
  platform_updates_channels notification_channel[] DEFAULT ARRAY['in_app']::notification_channel[],
  
  sponsorship_offers_enabled BOOLEAN DEFAULT true,
  sponsorship_offers_channels notification_channel[] DEFAULT ARRAY['in_app', 'email']::notification_channel[],
  
  messages_enabled BOOLEAN DEFAULT true,
  messages_channels notification_channel[] DEFAULT ARRAY['in_app', 'push']::notification_channel[],
  
  -- Quiet hours (DND)
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME DEFAULT '22:00:00',
  quiet_hours_end TIME DEFAULT '08:00:00',
  quiet_hours_timezone TEXT DEFAULT 'UTC',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notification preferences"
  ON public.notification_preferences FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notification preferences"
  ON public.notification_preferences FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own notification preferences"
  ON public.notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all notification preferences"
  ON public.notification_preferences FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user 
  ON public.notification_preferences(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to auto-create notification preferences
CREATE OR REPLACE FUNCTION public.handle_new_user_notification_preferences()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_create_notification_preferences
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_notification_preferences();

-- ============================================
-- 6. Function: Send Notification
-- ============================================
CREATE OR REPLACE FUNCTION public.send_notification(
  _user_id UUID,
  _notification_type TEXT,
  _title TEXT,
  _message TEXT,
  _priority TEXT DEFAULT 'medium',
  _action_url TEXT DEFAULT NULL,
  _action_label TEXT DEFAULT NULL,
  _icon_url TEXT DEFAULT NULL,
  _image_url TEXT DEFAULT NULL,
  _related_event_id UUID DEFAULT NULL,
  _related_registration_id UUID DEFAULT NULL,
  _related_certificate_id UUID DEFAULT NULL,
  _related_achievement_id UUID DEFAULT NULL,
  _metadata JSONB DEFAULT '{}'::jsonb,
  _sender_id UUID DEFAULT NULL,
  _scheduled_for TIMESTAMPTZ DEFAULT NULL,
  _expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _notification_id UUID;
  _prefs RECORD;
  _channels notification_channel[];
BEGIN
  -- Get user notification preferences
  SELECT * INTO _prefs
  FROM public.notification_preferences
  WHERE user_id = _user_id;
  
  -- If no preferences, create defaults
  IF _prefs IS NULL THEN
    INSERT INTO public.notification_preferences (user_id)
    VALUES (_user_id)
    RETURNING * INTO _prefs;
  END IF;
  
  -- Check if notification type is enabled and get channels
  CASE _notification_type
    WHEN 'event_reminder' THEN
      IF NOT _prefs.event_reminders_enabled THEN
        RETURN NULL;
      END IF;
      _channels := _prefs.event_reminders_channels;
      
    WHEN 'registration_approved', 'registration_rejected', 'registration_waitlisted' THEN
      IF NOT _prefs.registration_updates_enabled THEN
        RETURN NULL;
      END IF;
      _channels := _prefs.registration_updates_channels;
      
    WHEN 'result_announced' THEN
      IF NOT _prefs.result_announcements_enabled THEN
        RETURN NULL;
      END IF;
      _channels := _prefs.result_announcements_channels;
      
    WHEN 'achievement_earned', 'certificate_issued' THEN
      IF NOT _prefs.achievements_enabled THEN
        RETURN NULL;
      END IF;
      _channels := _prefs.achievements_channels;
      
    WHEN 'platform_update', 'system_alert' THEN
      IF NOT _prefs.platform_updates_enabled THEN
        RETURN NULL;
      END IF;
      _channels := _prefs.platform_updates_channels;
      
    WHEN 'sponsorship_offer' THEN
      IF NOT _prefs.sponsorship_offers_enabled THEN
        RETURN NULL;
      END IF;
      _channels := _prefs.sponsorship_offers_channels;
      
    WHEN 'message' THEN
      IF NOT _prefs.messages_enabled THEN
        RETURN NULL;
      END IF;
      _channels := _prefs.messages_channels;
      
    ELSE
      _channels := ARRAY['in_app']::notification_channel[];
  END CASE;
  
  -- Create notification
  INSERT INTO public.notifications (
    user_id, notification_type, priority, title, message,
    action_url, action_label, icon_url, image_url,
    related_event_id, related_registration_id, 
    related_certificate_id, related_achievement_id,
    metadata, sender_id, sent_via,
    scheduled_for, expires_at
  )
  VALUES (
    _user_id, _notification_type::notification_type, _priority::notification_priority,
    _title, _message, _action_url, _action_label, _icon_url, _image_url,
    _related_event_id, _related_registration_id,
    _related_certificate_id, _related_achievement_id,
    _metadata, _sender_id, _channels,
    _scheduled_for, _expires_at
  )
  RETURNING id INTO _notification_id;
  
  RETURN _notification_id;
END;
$$;

-- ============================================
-- 7. Function: Get User Notifications
-- ============================================
CREATE OR REPLACE FUNCTION public.get_user_notifications(
  _user_id UUID,
  _unread_only BOOLEAN DEFAULT false,
  _notification_type TEXT DEFAULT NULL,
  _limit INTEGER DEFAULT 50,
  _offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  notification_id UUID,
  notification_type notification_type,
  priority notification_priority,
  title TEXT,
  message TEXT,
  icon_url TEXT,
  image_url TEXT,
  action_url TEXT,
  action_label TEXT,
  is_read BOOLEAN,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  metadata JSONB,
  event_info JSONB,
  sender_info JSONB
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
    n.id,
    n.notification_type,
    n.priority,
    n.title,
    n.message,
    n.icon_url,
    n.image_url,
    n.action_url,
    n.action_label,
    n.is_read,
    n.read_at,
    n.created_at,
    n.metadata,
    CASE 
      WHEN n.related_event_id IS NOT NULL THEN
        jsonb_build_object(
          'event_id', e.id,
          'event_name', e.title,
          'event_date', e.start_date,
          'event_location', e.location
        )
      ELSE NULL
    END,
    CASE 
      WHEN n.sender_id IS NOT NULL THEN
        jsonb_build_object(
          'sender_id', p.user_id,
          'sender_name', p.full_name,
          'sender_avatar', p.avatar_url
        )
      ELSE NULL
    END
  FROM public.notifications n
  LEFT JOIN public.events e ON e.id = n.related_event_id
  LEFT JOIN public.profiles p ON p.user_id = n.sender_id
  WHERE n.user_id = _user_id
    AND (_unread_only = false OR n.is_read = false)
    AND (_notification_type IS NULL OR n.notification_type::TEXT = _notification_type)
    AND (n.expires_at IS NULL OR n.expires_at > now())
  ORDER BY 
    CASE n.priority
      WHEN 'urgent' THEN 1
      WHEN 'high' THEN 2
      WHEN 'medium' THEN 3
      WHEN 'low' THEN 4
    END,
    n.created_at DESC
  LIMIT _limit OFFSET _offset;
END;
$$;

-- ============================================
-- 8. Function: Mark Notification as Read
-- ============================================
CREATE OR REPLACE FUNCTION public.mark_notification_read(
  _notification_id UUID,
  _is_read BOOLEAN DEFAULT true
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _notification RECORD;
BEGIN
  -- Get notification
  SELECT * INTO _notification
  FROM public.notifications
  WHERE id = _notification_id;
  
  IF _notification IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check permissions
  IF auth.uid() != _notification.user_id AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;
  
  -- Update read status
  UPDATE public.notifications
  SET 
    is_read = _is_read,
    read_at = CASE WHEN _is_read THEN now() ELSE NULL END
  WHERE id = _notification_id;
  
  RETURN true;
END;
$$;

-- ============================================
-- 9. Function: Mark All Notifications as Read
-- ============================================
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read(_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _count INTEGER;
BEGIN
  -- Check permissions
  IF auth.uid() != _user_id AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;
  
  UPDATE public.notifications
  SET is_read = true, read_at = now()
  WHERE user_id = _user_id AND is_read = false;
  
  GET DIAGNOSTICS _count = ROW_COUNT;
  
  RETURN _count;
END;
$$;

-- ============================================
-- 10. Function: Delete Notification
-- ============================================
CREATE OR REPLACE FUNCTION public.delete_notification(_notification_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _notification RECORD;
BEGIN
  SELECT * INTO _notification
  FROM public.notifications
  WHERE id = _notification_id;
  
  IF _notification IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check permissions
  IF auth.uid() != _notification.user_id AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;
  
  DELETE FROM public.notifications WHERE id = _notification_id;
  
  RETURN true;
END;
$$;

-- ============================================
-- 11. Function: Get Notification Stats
-- ============================================
CREATE OR REPLACE FUNCTION public.get_notification_stats(_user_id UUID)
RETURNS TABLE (
  total_count BIGINT,
  unread_count BIGINT,
  urgent_count BIGINT,
  today_count BIGINT,
  by_type JSONB
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
    COUNT(*),
    COUNT(*) FILTER (WHERE is_read = false),
    COUNT(*) FILTER (WHERE priority = 'urgent' AND is_read = false),
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE),
    jsonb_object_agg(
      notification_type::TEXT,
      count
    )
  FROM (
    SELECT 
      notification_type,
      COUNT(*) as count
    FROM public.notifications
    WHERE user_id = _user_id
    AND (expires_at IS NULL OR expires_at > now())
    GROUP BY notification_type
  ) sub;
END;
$$;

-- ============================================
-- 12. Function: Update Notification Preferences
-- ============================================
CREATE OR REPLACE FUNCTION public.update_notification_preferences(
  _user_id UUID,
  _event_reminders_enabled BOOLEAN DEFAULT NULL,
  _event_reminders_channels notification_channel[] DEFAULT NULL,
  _event_reminders_advance_hours INTEGER DEFAULT NULL,
  _registration_updates_enabled BOOLEAN DEFAULT NULL,
  _registration_updates_channels notification_channel[] DEFAULT NULL,
  _result_announcements_enabled BOOLEAN DEFAULT NULL,
  _result_announcements_channels notification_channel[] DEFAULT NULL,
  _achievements_enabled BOOLEAN DEFAULT NULL,
  _achievements_channels notification_channel[] DEFAULT NULL,
  _platform_updates_enabled BOOLEAN DEFAULT NULL,
  _platform_updates_channels notification_channel[] DEFAULT NULL,
  _sponsorship_offers_enabled BOOLEAN DEFAULT NULL,
  _sponsorship_offers_channels notification_channel[] DEFAULT NULL,
  _quiet_hours_enabled BOOLEAN DEFAULT NULL,
  _quiet_hours_start TIME DEFAULT NULL,
  _quiet_hours_end TIME DEFAULT NULL
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
  
  -- Ensure preferences exist
  INSERT INTO public.notification_preferences (user_id)
  VALUES (_user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Update preferences
  UPDATE public.notification_preferences
  SET
    event_reminders_enabled = COALESCE(_event_reminders_enabled, event_reminders_enabled),
    event_reminders_channels = COALESCE(_event_reminders_channels, event_reminders_channels),
    event_reminders_advance_hours = COALESCE(_event_reminders_advance_hours, event_reminders_advance_hours),
    registration_updates_enabled = COALESCE(_registration_updates_enabled, registration_updates_enabled),
    registration_updates_channels = COALESCE(_registration_updates_channels, registration_updates_channels),
    result_announcements_enabled = COALESCE(_result_announcements_enabled, result_announcements_enabled),
    result_announcements_channels = COALESCE(_result_announcements_channels, result_announcements_channels),
    achievements_enabled = COALESCE(_achievements_enabled, achievements_enabled),
    achievements_channels = COALESCE(_achievements_channels, achievements_channels),
    platform_updates_enabled = COALESCE(_platform_updates_enabled, platform_updates_enabled),
    platform_updates_channels = COALESCE(_platform_updates_channels, platform_updates_channels),
    sponsorship_offers_enabled = COALESCE(_sponsorship_offers_enabled, sponsorship_offers_enabled),
    sponsorship_offers_channels = COALESCE(_sponsorship_offers_channels, sponsorship_offers_channels),
    quiet_hours_enabled = COALESCE(_quiet_hours_enabled, quiet_hours_enabled),
    quiet_hours_start = COALESCE(_quiet_hours_start, quiet_hours_start),
    quiet_hours_end = COALESCE(_quiet_hours_end, quiet_hours_end),
    updated_at = now()
  WHERE user_id = _user_id;
  
  RETURN true;
END;
$$;

-- ============================================
-- 13. Trigger: Registration Status Change Notification
-- ============================================
CREATE OR REPLACE FUNCTION public.notify_registration_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _event RECORD;
  _title TEXT;
  _message TEXT;
  _notif_type TEXT;
BEGIN
  -- Only notify on status change
  IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Get event details
  SELECT * INTO _event
  FROM public.events
  WHERE id = NEW.event_id;
  
  -- Determine notification type and content
  CASE NEW.status::TEXT
    WHEN 'approved' THEN
      _notif_type := 'registration_approved';
      _title := 'Registration Approved ✅';
      _message := 'Your registration for "' || _event.title || '" has been approved!';
      
    WHEN 'rejected' THEN
      _notif_type := 'registration_rejected';
      _title := 'Registration Not Approved';
      _message := 'Unfortunately, your registration for "' || _event.title || '" was not approved.';
      
    WHEN 'waitlisted' THEN
      _notif_type := 'registration_waitlisted';
      _title := 'Added to Waitlist';
      _message := 'You have been added to the waitlist for "' || _event.title || '".';
      
    ELSE
      RETURN NEW;
  END CASE;
  
  -- Send notification
  PERFORM public.send_notification(
    NEW.athlete_id,
    _notif_type,
    _title,
    _message,
    'high',
    '/events/' || NEW.event_id::TEXT,
    'View Event',
    NULL,
    _event.banner_image_url,
    NEW.event_id,
    NEW.id
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_registration_status_change
  AFTER UPDATE ON public.event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_registration_status_change();

-- ============================================
-- 14. Trigger: Result Announcement Notification
-- ============================================
CREATE OR REPLACE FUNCTION public.notify_result_announced()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _event RECORD;
  _title TEXT;
  _message TEXT;
BEGIN
  -- Get event details
  SELECT * INTO _event
  FROM public.events
  WHERE id = NEW.event_id;
  
  -- Prepare notification
  _title := 'Results Announced 🏆';
  
  IF NEW.position = 1 THEN
    _message := 'Congratulations! You won "' || _event.title || '"!';
  ELSIF NEW.position <= 3 THEN
    _message := 'Great job! You finished #' || NEW.position || ' in "' || _event.title || '"!';
  ELSE
    _message := 'Results are in for "' || _event.title || '". You finished #' || NEW.position || '.';
  END IF;
  
  -- Send notification
  PERFORM public.send_notification(
    NEW.athlete_id,
    'result_announced',
    _title,
    _message,
    CASE WHEN NEW.position <= 3 THEN 'high' ELSE 'medium' END,
    '/events/' || NEW.event_id::TEXT || '/results',
    'View Results',
    NULL,
    _event.banner_image_url,
    NEW.event_id
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_result_announced
  AFTER INSERT ON public.event_results
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_result_announced();

-- ============================================
-- 15. Trigger: Achievement Earned Notification (Already handled in achievements module)
-- ============================================
-- Update the existing award_achievement function to send notification
-- This is handled in the achievement module, but we ensure it's integrated

-- ============================================
-- 16. Function: Schedule Event Reminders
-- ============================================
CREATE OR REPLACE FUNCTION public.schedule_event_reminders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _registration RECORD;
  _event RECORD;
  _prefs RECORD;
  _reminder_time TIMESTAMPTZ;
BEGIN
  -- Find events happening in the next 48 hours that need reminders
  FOR _registration IN
    SELECT DISTINCT er.athlete_id, er.event_id
    FROM public.event_registrations er
    JOIN public.events e ON e.id = er.event_id
    WHERE er.status = 'approved'
    AND e.start_date BETWEEN now() AND now() + INTERVAL '48 hours'
    AND NOT EXISTS (
      SELECT 1 FROM public.notifications n
      WHERE n.user_id = er.athlete_id
      AND n.related_event_id = er.event_id
      AND n.notification_type = 'event_reminder'
      AND n.created_at > now() - INTERVAL '48 hours'
    )
  LOOP
    -- Get event and preferences
    SELECT * INTO _event FROM public.events WHERE id = _registration.event_id;
    SELECT * INTO _prefs FROM public.notification_preferences WHERE user_id = _registration.athlete_id;
    
    -- Calculate reminder time
    IF _prefs IS NOT NULL THEN
      _reminder_time := _event.start_date - (_prefs.event_reminders_advance_hours || ' hours')::INTERVAL;
    ELSE
      _reminder_time := _event.start_date - INTERVAL '24 hours';
    END IF;
    
    -- Send reminder if it's time
    IF _reminder_time <= now() THEN
      PERFORM public.send_notification(
        _registration.athlete_id,
        'event_reminder',
        'Event Tomorrow! 📅',
        'Don''t forget: "' || _event.title || '" starts on ' || 
          TO_CHAR(_event.start_date, 'Mon DD at HH:MI AM'),
        'high',
        '/events/' || _event.id::TEXT,
        'View Event Details',
        NULL,
        _event.banner_image_url,
        _event.id,
        _registration.event_id::UUID
      );
    END IF;
  END LOOP;
END;
$$;

-- ============================================
-- 17. Function: Send Bulk Notifications
-- ============================================
CREATE OR REPLACE FUNCTION public.send_bulk_notification(
  _user_ids UUID[],
  _notification_type TEXT,
  _title TEXT,
  _message TEXT,
  _priority TEXT DEFAULT 'medium',
  _action_url TEXT DEFAULT NULL,
  _action_label TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
  _count INTEGER := 0;
BEGIN
  -- Only admins can send bulk notifications
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Permission denied: Admin only';
  END IF;
  
  FOREACH _user_id IN ARRAY _user_ids
  LOOP
    PERFORM public.send_notification(
      _user_id,
      _notification_type,
      _title,
      _message,
      _priority,
      _action_url,
      _action_label
    );
    _count := _count + 1;
  END LOOP;
  
  RETURN _count;
END;
$$;
