-- Organizer Dashboard Tables and Functions

-- Create organizer_stats table for dashboard metrics
CREATE TABLE IF NOT EXISTS public.organizer_stats (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_events INT DEFAULT 0,
    active_events INT DEFAULT 0,
    total_revenue NUMERIC(12,2) DEFAULT 0,
    total_participants INT DEFAULT 0,
    upcoming_events INT DEFAULT 0,
    completed_events INT DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create organizer_event_analytics table for event-specific analytics
CREATE TABLE IF NOT EXISTS public.organizer_event_analytics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    registrations_count INT DEFAULT 0,
    attendance_rate DECIMAL(5,2) DEFAULT 0,
    revenue_generated NUMERIC(12,2) DEFAULT 0,
    participant_satisfaction DECIMAL(3,2) DEFAULT 0,
    cost_per_participant NUMERIC(10,2) DEFAULT 0,
    profit_margin DECIMAL(5,2) DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(event_id)
);

-- Create organizer_revenue table for detailed financial tracking
CREATE TABLE IF NOT EXISTS public.organizer_revenue (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('registration_fee', 'sponsorship', 'miscellaneous', 'expense')),
    amount NUMERIC(12,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    description TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    payment_method TEXT,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded', 'failed'))
);

-- Create organizer_participants table for participant management
CREATE TABLE IF NOT EXISTS public.organizer_participants (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'checked_in', 'completed', 'withdrawn', 'no_show')),
    emergency_contact JSONB, -- Store emergency contact info
    medical_conditions TEXT[], -- Array of medical conditions/allergies
    waiver_signed BOOLEAN DEFAULT FALSE,
    checked_in BOOLEAN DEFAULT FALSE,
    bib_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(event_id, athlete_id)
);

-- Create organizer_scheduling table for event scheduling and results management
CREATE TABLE IF NOT EXISTS public.organizer_scheduling (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    schedule_date TIMESTAMP WITH TIME ZONE NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('race', 'heat', 'round', 'ceremony', 'warm_up', 'cool_down', 'break')),
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    duration_minutes INT DEFAULT 60,
    capacity INT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    results_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create organizer_notifications table for organizer-specific notifications
CREATE TABLE IF NOT EXISTS public.organizer_notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('registration', 'payment', 'result', 'participant', 'system', 'alert')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    read_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Create organizer_settings table for organizer-specific preferences
CREATE TABLE IF NOT EXISTS public.organizer_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_preferences JSONB DEFAULT '{}',
    branding_settings JSONB DEFAULT '{}',
    payment_methods JSONB DEFAULT '{}',
    tax_settings JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(organizer_id)
);

-- Create organizer_teams table for managing staff and volunteers
CREATE TABLE IF NOT EXISTS public.organizer_teams (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('staff', 'volunteer', 'judge', 'marshal', 'medical', 'security')),
    member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '[]',
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(organizer_id, member_id)
);

-- Insert default settings for existing organizers
INSERT INTO public.organizer_settings (organizer_id, notification_preferences, branding_settings, payment_methods, tax_settings, privacy_settings)
SELECT 
    u.id,
    '{"email": true, "sms": false, "push": true}',
    '{"primary_color": "#22c55e", "logo_url": null}',
    '{"stripe_enabled": false, "paypal_enabled": false}',
    '{"tax_rate": 0, "tax_inclusive": false}',
    '{"show_participant_data": true}'
FROM auth.users u
JOIN public.profiles p ON u.id = p.user_id
WHERE p.role = 'organizer'
ON CONFLICT (organizer_id) DO NOTHING;

-- Insert default stats for existing organizers
INSERT INTO public.organizer_stats (organizer_id)
SELECT 
    u.id
FROM auth.users u
JOIN public.profiles p ON u.id = p.user_id
WHERE p.role = 'organizer'
ON CONFLICT (organizer_id) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_organizer_stats_organizer_id ON public.organizer_stats(organizer_id);
CREATE INDEX IF NOT EXISTS idx_organizer_event_analytics_organizer_id ON public.organizer_event_analytics(organizer_id);
CREATE INDEX IF NOT EXISTS idx_organizer_revenue_organizer_id ON public.organizer_revenue(organizer_id);
CREATE INDEX IF NOT EXISTS idx_organizer_participants_organizer_id ON public.organizer_participants(organizer_id);
CREATE INDEX IF NOT EXISTS idx_organizer_scheduling_organizer_id ON public.organizer_scheduling(organizer_id);
CREATE INDEX IF NOT EXISTS idx_organizer_notifications_organizer_id ON public.organizer_notifications(organizer_id);
CREATE INDEX IF NOT EXISTS idx_organizer_teams_organizer_id ON public.organizer_teams(organizer_id);
CREATE INDEX IF NOT EXISTS idx_organizer_participants_event_id ON public.organizer_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_organizer_revenue_event_id ON public.organizer_revenue(event_id);
CREATE INDEX IF NOT EXISTS idx_organizer_event_analytics_event_id ON public.organizer_event_analytics(event_id);

-- Create functions for organizer dashboard operations

-- Function to get organizer dashboard overview
CREATE OR REPLACE FUNCTION public.get_organizer_dashboard_overview(p_organizer_id UUID)
RETURNS TABLE(
    total_events INT,
    active_events INT,
    total_revenue NUMERIC,
    total_participants INT,
    upcoming_events INT,
    completed_events INT,
    last_updated TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        os.total_events,
        os.active_events,
        os.total_revenue,
        os.total_participants,
        os.upcoming_events,
        os.completed_events,
        os.last_updated
    FROM public.organizer_stats os
    WHERE os.organizer_id = p_organizer_id;
END;
$$;

-- Function to update organizer stats
CREATE OR REPLACE FUNCTION public.update_organizer_stats(p_organizer_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_events INT;
    v_active_events INT;
    v_total_revenue NUMERIC;
    v_total_participants INT;
    v_upcoming_events INT;
    v_completed_events INT;
BEGIN
    -- Calculate total events
    SELECT COUNT(*) INTO v_total_events 
    FROM public.events 
    WHERE organizer_id = p_organizer_id;
    
    -- Calculate active events
    SELECT COUNT(*) INTO v_active_events 
    FROM public.events 
    WHERE organizer_id = p_organizer_id 
    AND status IN ('published', 'ongoing');
    
    -- Calculate total revenue
    SELECT COALESCE(SUM(amount), 0) INTO v_total_revenue
    FROM public.organizer_revenue
    WHERE organizer_id = p_organizer_id
    AND status = 'completed';
    
    -- Calculate total participants
    SELECT COUNT(DISTINCT op.athlete_id) INTO v_total_participants
    FROM public.organizer_participants op
    JOIN public.events e ON op.event_id = e.id
    WHERE e.organizer_id = p_organizer_id;
    
    -- Calculate upcoming events
    SELECT COUNT(*) INTO v_upcoming_events
    FROM public.events
    WHERE organizer_id = p_organizer_id
    AND status = 'published'
    AND start_date > NOW();
    
    -- Calculate completed events
    SELECT COUNT(*) INTO v_completed_events
    FROM public.events
    WHERE organizer_id = p_organizer_id
    AND status = 'completed';
    
    -- Insert or update stats
    INSERT INTO public.organizer_stats (
        organizer_id, 
        total_events, 
        active_events, 
        total_revenue, 
        total_participants, 
        upcoming_events, 
        completed_events
    ) VALUES (
        p_organizer_id,
        v_total_events,
        v_active_events,
        v_total_revenue,
        v_total_participants,
        v_upcoming_events,
        v_completed_events
    )
    ON CONFLICT (organizer_id) DO UPDATE SET
        total_events = EXCLUDED.total_events,
        active_events = EXCLUDED.active_events,
        total_revenue = EXCLUDED.total_revenue,
        total_participants = EXCLUDED.total_participants,
        upcoming_events = EXCLUDED.upcoming_events,
        completed_events = EXCLUDED.completed_events,
        last_updated = NOW();
END;
$$;

-- Function to get event analytics
CREATE OR REPLACE FUNCTION public.get_event_analytics(p_event_id UUID)
RETURNS TABLE(
    event_id UUID,
    registrations_count INT,
    attendance_rate DECIMAL,
    revenue_generated NUMERIC,
    participant_satisfaction DECIMAL,
    cost_per_participant NUMERIC,
    profit_margin DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        oea.event_id,
        oea.registrations_count,
        oea.attendance_rate,
        oea.revenue_generated,
        oea.participant_satisfaction,
        oea.cost_per_participant,
        oea.profit_margin
    FROM public.organizer_event_analytics oea
    WHERE oea.event_id = p_event_id;
END;
$$;

-- Function to calculate and update event analytics
CREATE OR REPLACE FUNCTION public.calculate_event_analytics(p_event_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    v_registrations_count INT;
    v_attendance_rate DECIMAL;
    v_revenue_generated NUMERIC;
    v_cost_per_participant NUMERIC;
    v_profit_margin DECIMAL;
    v_organizer_id UUID;
BEGIN
    -- Get organizer ID
    SELECT organizer_id INTO v_organizer_id FROM public.events WHERE id = p_event_id;
    
    -- Calculate registrations count
    SELECT COUNT(*) INTO v_registrations_count
    FROM public.organizer_participants
    WHERE event_id = p_event_id;
    
    -- Calculate attendance rate (based on check-ins)
    SELECT 
        CASE 
            WHEN v_registrations_count > 0 THEN 
                ROUND((COUNT(*) * 100.0 / v_registrations_count), 2)
            ELSE 0
        END
    INTO v_attendance_rate
    FROM public.organizer_participants
    WHERE event_id = p_event_id AND checked_in = true;
    
    -- Calculate revenue generated
    SELECT COALESCE(SUM(amount), 0) INTO v_revenue_generated
    FROM public.organizer_revenue
    WHERE event_id = p_event_id AND status = 'completed';
    
    -- Calculate cost per participant
    SELECT 
        CASE 
            WHEN v_registrations_count > 0 THEN 
                v_revenue_generated / v_registrations_count
            ELSE 0
        END
    INTO v_cost_per_participant;
    
    -- Calculate profit margin (simplified calculation)
    SELECT 
        CASE 
            WHEN v_revenue_generated > 0 THEN 
                ROUND(((v_revenue_generated - (v_cost_per_participant * v_registrations_count)) / v_revenue_generated * 100), 2)
            ELSE 0
        END
    INTO v_profit_margin;
    
    -- Insert or update analytics
    INSERT INTO public.organizer_event_analytics (
        event_id,
        organizer_id,
        registrations_count,
        attendance_rate,
        revenue_generated,
        cost_per_participant,
        profit_margin
    ) VALUES (
        p_event_id,
        v_organizer_id,
        v_registrations_count,
        v_attendance_rate,
        v_revenue_generated,
        v_cost_per_participant,
        v_profit_margin
    )
    ON CONFLICT (event_id) DO UPDATE SET
        registrations_count = EXCLUDED.registrations_count,
        attendance_rate = EXCLUDED.attendance_rate,
        revenue_generated = EXCLUDED.revenue_generated,
        cost_per_participant = EXCLUDED.cost_per_participant,
        profit_margin = EXCLUDED.profit_margin,
        last_updated = NOW();
END;
$$;

-- Function to add revenue transaction
CREATE OR REPLACE FUNCTION public.add_revenue_transaction(
    p_organizer_id UUID,
    p_event_id UUID,
    p_transaction_type TEXT,
    p_amount NUMERIC,
    p_description TEXT DEFAULT '',
    p_payment_method TEXT DEFAULT 'credit_card',
    p_status TEXT DEFAULT 'completed'
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_transaction_id UUID;
BEGIN
    INSERT INTO public.organizer_revenue (
        organizer_id,
        event_id,
        transaction_type,
        amount,
        description,
        payment_method,
        status
    ) VALUES (
        p_organizer_id,
        p_event_id,
        p_transaction_type,
        p_amount,
        p_description,
        p_payment_method,
        p_status
    ) RETURNING id INTO v_transaction_id;
    
    -- Update stats
    PERFORM public.update_organizer_stats(p_organizer_id);
    
    -- Update event analytics
    PERFORM public.calculate_event_analytics(p_event_id);
    
    RETURN v_transaction_id;
END;
$$;

-- Function to register participant
CREATE OR REPLACE FUNCTION public.register_participant(
    p_organizer_id UUID,
    p_event_id UUID,
    p_athlete_id UUID,
    p_emergency_contact JSONB DEFAULT '{}',
    p_medical_conditions TEXT[] DEFAULT '{}',
    p_waiver_signed BOOLEAN DEFAULT FALSE
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_participant_id UUID;
BEGIN
    INSERT INTO public.organizer_participants (
        organizer_id,
        event_id,
        athlete_id,
        emergency_contact,
        medical_conditions,
        waiver_signed
    ) VALUES (
        p_organizer_id,
        p_event_id,
        p_athlete_id,
        p_emergency_contact,
        p_medical_conditions,
        p_waiver_signed
    ) RETURNING id INTO v_participant_id;
    
    -- Update stats
    PERFORM public.update_organizer_stats(p_organizer_id);
    
    -- Update event analytics
    PERFORM public.calculate_event_analytics(p_event_id);
    
    RETURN v_participant_id;
END;
$$;

-- Function to send organizer notification
CREATE OR REPLACE FUNCTION public.send_organizer_notification(
    p_organizer_id UUID,
    p_event_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT,
    p_priority TEXT DEFAULT 'normal',
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO public.organizer_notifications (
        organizer_id,
        event_id,
        type,
        title,
        message,
        priority,
        metadata
    ) VALUES (
        p_organizer_id,
        p_event_id,
        p_type,
        p_title,
        p_message,
        p_priority,
        p_metadata
    ) RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$;

-- Create trigger functions for automated operations

-- Trigger function to update stats when an event is modified
CREATE OR REPLACE FUNCTION public.update_organizer_stats_after_event_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Update stats for the organizer after event changes
    PERFORM public.update_organizer_stats(
        CASE 
            WHEN TG_OP = 'INSERT' THEN NEW.organizer_id
            WHEN TG_OP = 'UPDATE' THEN NEW.organizer_id
            WHEN TG_OP = 'DELETE' THEN OLD.organizer_id
        END
    );
    
    RETURN 
        CASE 
            WHEN TG_OP = 'INSERT' THEN NEW
            WHEN TG_OP = 'UPDATE' THEN NEW
            WHEN TG_OP = 'DELETE' THEN OLD
        END;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to update event analytics when registrations change
CREATE OR REPLACE FUNCTION public.update_event_analytics_after_registration()
RETURNS TRIGGER AS $$
BEGIN
    -- Update event analytics after registration changes
    PERFORM public.calculate_event_analytics(
        CASE 
            WHEN TG_OP = 'INSERT' THEN NEW.event_id
            WHEN TG_OP = 'UPDATE' THEN NEW.event_id
            WHEN TG_OP = 'DELETE' THEN OLD.event_id
        END
    );
    
    -- Update stats for the organizer
    PERFORM public.update_organizer_stats(
        (SELECT organizer_id FROM events WHERE id = 
            CASE 
                WHEN TG_OP = 'INSERT' THEN NEW.event_id
                WHEN TG_OP = 'UPDATE' THEN NEW.event_id
                WHEN TG_OP = 'DELETE' THEN OLD.event_id
            END)
    );
    
    RETURN 
        CASE 
            WHEN TG_OP = 'INSERT' THEN NEW
            WHEN TG_OP = 'UPDATE' THEN NEW
            WHEN TG_OP = 'DELETE' THEN OLD
        END;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to update event analytics when revenue changes
CREATE OR REPLACE FUNCTION public.update_event_analytics_after_revenue()
RETURNS TRIGGER AS $$
BEGIN
    -- Update event analytics after revenue changes if event_id is present
    IF (CASE 
            WHEN TG_OP = 'INSERT' THEN NEW.event_id
            WHEN TG_OP = 'UPDATE' THEN NEW.event_id
            WHEN TG_OP = 'DELETE' THEN OLD.event_id
        END) IS NOT NULL THEN
        
        PERFORM public.calculate_event_analytics(
            CASE 
                WHEN TG_OP = 'INSERT' THEN NEW.event_id
                WHEN TG_OP = 'UPDATE' THEN NEW.event_id
                WHEN TG_OP = 'DELETE' THEN OLD.event_id
            END
        );
    END IF;
    
    -- Update stats for the organizer
    PERFORM public.update_organizer_stats(
        CASE 
            WHEN TG_OP = 'INSERT' THEN NEW.organizer_id
            WHEN TG_OP = 'UPDATE' THEN NEW.organizer_id
            WHEN TG_OP = 'DELETE' THEN OLD.organizer_id
        END
    );
    
    RETURN 
        CASE 
            WHEN TG_OP = 'INSERT' THEN NEW
            WHEN TG_OP = 'UPDATE' THEN NEW
            WHEN TG_OP = 'DELETE' THEN OLD
        END;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to send notifications when important events occur
CREATE OR REPLACE FUNCTION public.send_organizer_notification_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Send notification when a new registration occurs
    IF TG_OP = 'INSERT' THEN
        PERFORM public.send_organizer_notification(
            NEW.organizer_id,
            NEW.event_id,
            'registration',
            'New Registration',
            'A new participant has registered for your event.',
            'normal',
            json_build_object('athlete_id', NEW.athlete_id, 'event_id', NEW.event_id)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automated operations

-- Trigger to update stats after events table changes
CREATE TRIGGER update_organizer_stats_after_event_change
    AFTER INSERT OR UPDATE OR DELETE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.update_organizer_stats_after_event_change();

-- Trigger to update analytics after registrations change
CREATE TRIGGER update_event_analytics_after_registration
    AFTER INSERT OR UPDATE OR DELETE ON public.organizer_participants
    FOR EACH ROW EXECUTE FUNCTION public.update_event_analytics_after_registration();

-- Trigger to update analytics after revenue changes
CREATE TRIGGER update_event_analytics_after_revenue
    AFTER INSERT OR UPDATE OR DELETE ON public.organizer_revenue
    FOR EACH ROW EXECUTE FUNCTION public.update_event_analytics_after_revenue();

-- Trigger to send notifications for new registrations
CREATE TRIGGER send_organizer_notification_after_registration
    AFTER INSERT ON public.organizer_participants
    FOR EACH ROW EXECUTE FUNCTION public.send_organizer_notification_trigger();

-- Create trigger function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_organizer_participants_updated_at 
    BEFORE UPDATE ON public.organizer_participants 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organizer_scheduling_updated_at 
    BEFORE UPDATE ON public.organizer_scheduling 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organizer_settings_updated_at 
    BEFORE UPDATE ON public.organizer_settings 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security on organizer tables
ALTER TABLE public.organizer_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_event_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_scheduling ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_teams ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for organizer_stats
CREATE POLICY "Organizers can view their own stats" ON public.organizer_stats
    FOR SELECT TO authenticated
    USING (organizer_id = auth.uid() AND public.has_role(auth.uid(), 'organizer'::public.app_role));

-- Create RLS policies for organizer_event_analytics
CREATE POLICY "Organizers can view analytics for their events" ON public.organizer_event_analytics
    FOR SELECT TO authenticated
    USING (organizer_id = auth.uid() AND public.has_role(auth.uid(), 'organizer'::public.app_role));

-- Create RLS policies for organizer_revenue
CREATE POLICY "Organizers can view their own revenue" ON public.organizer_revenue
    FOR SELECT TO authenticated
    USING (organizer_id = auth.uid() AND public.has_role(auth.uid(), 'organizer'::public.app_role));

CREATE POLICY "Organizers can add their own revenue" ON public.organizer_revenue
    FOR INSERT TO authenticated
    WITH CHECK (organizer_id = auth.uid() AND public.has_role(auth.uid(), 'organizer'::public.app_role));

CREATE POLICY "Organizers can update their own revenue" ON public.organizer_revenue
    FOR UPDATE TO authenticated
    USING (organizer_id = auth.uid() AND public.has_role(auth.uid(), 'organizer'::public.app_role));

CREATE POLICY "Organizers can delete their own revenue" ON public.organizer_revenue
    FOR DELETE TO authenticated
    USING (organizer_id = auth.uid() AND public.has_role(auth.uid(), 'organizer'::public.app_role));

-- Create RLS policies for organizer_participants
CREATE POLICY "Organizers can view participants for their events" ON public.organizer_participants
    FOR SELECT TO authenticated
    USING (
        organizer_id = auth.uid() AND 
        public.has_role(auth.uid(), 'organizer'::public.app_role) AND
        EXISTS (SELECT 1 FROM events WHERE events.id = event_id AND events.organizer_id = auth.uid())
    );

CREATE POLICY "Organizers can add participants to their events" ON public.organizer_participants
    FOR INSERT TO authenticated
    WITH CHECK (
        organizer_id = auth.uid() AND 
        public.has_role(auth.uid(), 'organizer'::public.app_role) AND
        EXISTS (SELECT 1 FROM events WHERE events.id = event_id AND events.organizer_id = auth.uid())
    );

CREATE POLICY "Organizers can update participant information for their events" ON public.organizer_participants
    FOR UPDATE TO authenticated
    USING (
        organizer_id = auth.uid() AND 
        public.has_role(auth.uid(), 'organizer'::public.app_role) AND
        EXISTS (SELECT 1 FROM events WHERE events.id = event_id AND events.organizer_id = auth.uid())
    );

CREATE POLICY "Organizers can delete participants from their events" ON public.organizer_participants
    FOR DELETE TO authenticated
    USING (
        organizer_id = auth.uid() AND 
        public.has_role(auth.uid(), 'organizer'::public.app_role) AND
        EXISTS (SELECT 1 FROM events WHERE events.id = event_id AND events.organizer_id = auth.uid())
    );

-- Create RLS policies for organizer_scheduling
CREATE POLICY "Organizers can view their own schedules" ON public.organizer_scheduling
    FOR SELECT TO authenticated
    USING (organizer_id = auth.uid() AND public.has_role(auth.uid(), 'organizer'::public.app_role));

CREATE POLICY "Organizers can manage their own schedules" ON public.organizer_scheduling
    FOR ALL TO authenticated
    USING (organizer_id = auth.uid() AND public.has_role(auth.uid(), 'organizer'::public.app_role));

-- Create RLS policies for organizer_notifications
CREATE POLICY "Organizers can view their own notifications" ON public.organizer_notifications
    FOR SELECT TO authenticated
    USING (organizer_id = auth.uid() AND public.has_role(auth.uid(), 'organizer'::public.app_role));

CREATE POLICY "Organizers can manage their own notifications" ON public.organizer_notifications
    FOR ALL TO authenticated
    USING (organizer_id = auth.uid() AND public.has_role(auth.uid(), 'organizer'::public.app_role));

-- Create RLS policies for organizer_settings
CREATE POLICY "Organizers can view their own settings" ON public.organizer_settings
    FOR SELECT TO authenticated
    USING (organizer_id = auth.uid() AND public.has_role(auth.uid(), 'organizer'::public.app_role));

CREATE POLICY "Organizers can manage their own settings" ON public.organizer_settings
    FOR ALL TO authenticated
    USING (organizer_id = auth.uid() AND public.has_role(auth.uid(), 'organizer'::public.app_role));

-- Create RLS policies for organizer_teams
CREATE POLICY "Organizers can view their own teams" ON public.organizer_teams
    FOR SELECT TO authenticated
    USING (organizer_id = auth.uid() AND public.has_role(auth.uid(), 'organizer'::public.app_role));

CREATE POLICY "Organizers can manage their own teams" ON public.organizer_teams
    FOR ALL TO authenticated
    USING (organizer_id = auth.uid() AND public.has_role(auth.uid(), 'organizer'::public.app_role));
