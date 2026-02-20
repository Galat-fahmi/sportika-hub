-- Admin Dashboard Tables and Functions

-- Create admin_stats table for dashboard metrics
CREATE TABLE IF NOT EXISTS public.admin_stats (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    total_users INT DEFAULT 0,
    total_athletes INT DEFAULT 0,
    total_organizers INT DEFAULT 0,
    total_admins INT DEFAULT 0,
    total_events INT DEFAULT 0,
    total_registrations INT DEFAULT 0,
    total_revenue NUMERIC(12,2) DEFAULT 0,
    active_events INT DEFAULT 0,
    pending_verifications INT DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_user_analytics table for user-related analytics
CREATE TABLE IF NOT EXISTS public.admin_user_analytics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_date DATE NOT NULL,
    new_users INT DEFAULT 0,
    active_users INT DEFAULT 0,
    user_retention_rate DECIMAL(5,2) DEFAULT 0,
    user_growth_rate DECIMAL(5,2) DEFAULT 0,
    churn_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(metric_date)
);

-- Create admin_event_analytics table for event-related analytics
CREATE TABLE IF NOT EXISTS public.admin_event_analytics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_date DATE NOT NULL,
    total_events INT DEFAULT 0,
    active_events INT DEFAULT 0,
    completed_events INT DEFAULT 0,
    registration_conversion_rate DECIMAL(5,2) DEFAULT 0,
    avg_participants_per_event INT DEFAULT 0,
    avg_revenue_per_event NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(metric_date)
);

-- Create admin_finance_summary table for financial analytics
CREATE TABLE IF NOT EXISTS public.admin_finance_summary (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_revenue NUMERIC(12,2) DEFAULT 0,
    platform_fees NUMERIC(12,2) DEFAULT 0,
    processing_fees NUMERIC(12,2) DEFAULT 0,
    net_revenue NUMERIC(12,2) DEFAULT 0,
    total_transactions INT DEFAULT 0,
    refunded_amount NUMERIC(12,2) DEFAULT 0,
    payout_amount NUMERIC(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(period_start, period_end)
);

-- Create admin_system_monitoring table for system health monitoring
CREATE TABLE IF NOT EXISTS public.admin_system_monitoring (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    service_status TEXT DEFAULT 'operational' CHECK (service_status IN ('operational', 'degraded', 'down', 'maintenance')),
    uptime_percentage DECIMAL(5,2) DEFAULT 100.00,
    response_time_ms INT DEFAULT 0,
    error_rate DECIMAL(5,2) DEFAULT 0,
    active_sessions INT DEFAULT 0,
    database_connections INT DEFAULT 0,
    api_requests_count INT DEFAULT 0,
    storage_usage_mb NUMERIC(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_audit_logs table for tracking admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_reports table for generated reports
CREATE TABLE IF NOT EXISTS public.admin_reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    report_type TEXT NOT NULL CHECK (report_type IN ('user_activity', 'financial', 'event_performance', 'compliance', 'custom')),
    generated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    filters JSONB DEFAULT '{}',
    data_url TEXT, -- URL to stored report file
    status TEXT DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'failed', 'expired')),
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create admin_compliance table for compliance tracking
CREATE TABLE IF NOT EXISTS public.admin_compliance (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    compliance_type TEXT NOT NULL CHECK (compliance_type IN ('gdpr', 'ccpa', 'pci_dss', 'hipaa', 'sox', 'custom')),
    requirement TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'compliant', 'non_compliant', 'waived')),
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_feature_flags table for feature management
CREATE TABLE IF NOT EXISTS public.admin_feature_flags (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    flag_key TEXT NOT NULL UNIQUE,
    flag_name TEXT NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage DECIMAL(5,2) DEFAULT 0,
    targeting_criteria JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_notifications table for system-wide notifications
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT DEFAULT 'info' CHECK (notification_type IN ('info', 'warning', 'error', 'success', 'maintenance')),
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'athletes', 'organizers', 'admins')),
    is_active BOOLEAN DEFAULT TRUE,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial admin stats record
INSERT INTO public.admin_stats DEFAULT VALUES ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_user_analytics_metric_date ON public.admin_user_analytics(metric_date);
CREATE INDEX IF NOT EXISTS idx_admin_event_analytics_metric_date ON public.admin_event_analytics(metric_date);
CREATE INDEX IF NOT EXISTS idx_admin_finance_summary_period ON public.admin_finance_summary(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_admin_system_monitoring_timestamp ON public.admin_system_monitoring(metric_timestamp);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_user_id ON public.admin_audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_reports_generated_at ON public.admin_reports(generated_at);
CREATE INDEX IF NOT EXISTS idx_admin_compliance_due_date ON public.admin_compliance(due_date);
CREATE INDEX IF NOT EXISTS idx_admin_compliance_status ON public.admin_compliance(status);
CREATE INDEX IF NOT EXISTS idx_admin_feature_flags_is_enabled ON public.admin_feature_flags(is_enabled);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_is_active ON public.admin_notifications(is_active);

-- Create trigger function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admin_compliance_updated_at 
    BEFORE UPDATE ON public.admin_compliance 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_feature_flags_updated_at 
    BEFORE UPDATE ON public.admin_feature_flags 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_notifications_updated_at 
    BEFORE UPDATE ON public.admin_notifications 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create functions for admin dashboard operations

-- Function to get admin dashboard overview
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_overview()
RETURNS TABLE(
    total_users INT,
    total_athletes INT,
    total_organizers INT,
    total_admins INT,
    total_events INT,
    total_registrations INT,
    total_revenue NUMERIC,
    active_events INT,
    pending_verifications INT,
    last_updated TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ast.total_users,
        ast.total_athletes,
        ast.total_organizers,
        ast.total_admins,
        ast.total_events,
        ast.total_registrations,
        ast.total_revenue,
        ast.active_events,
        ast.pending_verifications,
        ast.last_updated
    FROM public.admin_stats ast
    ORDER BY ast.last_updated DESC
    LIMIT 1;
END;
$$;

-- Function to update admin stats
CREATE OR REPLACE FUNCTION public.update_admin_stats()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_users INT;
    v_total_athletes INT;
    v_total_organizers INT;
    v_total_admins INT;
    v_total_events INT;
    v_total_registrations INT;
    v_total_revenue NUMERIC;
    v_active_events INT;
    v_pending_verifications INT;
BEGIN
    -- Calculate total users
    SELECT COUNT(*) INTO v_total_users 
    FROM auth.users;
    
    -- Calculate total athletes
    SELECT COUNT(*) INTO v_total_athletes 
    FROM public.user_roles 
    WHERE role = 'athlete';
    
    -- Calculate total organizers
    SELECT COUNT(*) INTO v_total_organizers 
    FROM public.user_roles 
    WHERE role = 'organizer';
    
    -- Calculate total admins
    SELECT COUNT(*) INTO v_total_admins 
    FROM public.user_roles 
    WHERE role = 'admin';
    
    -- Calculate total events
    SELECT COUNT(*) INTO v_total_events 
    FROM public.events;
    
    -- Calculate total registrations
    SELECT COUNT(*) INTO v_total_registrations 
    FROM public.event_registrations;
    
    -- Calculate total revenue (sum of registration fees for paid registrations)
    SELECT COALESCE(SUM(er.amount), 0) INTO v_total_revenue
    FROM public.organizer_revenue er
    WHERE er.status = 'completed';
    
    -- Calculate active events
    SELECT COUNT(*) INTO v_active_events 
    FROM public.events 
    WHERE status IN ('published', 'ongoing');
    
    -- Calculate pending verifications (this would depend on your verification system)
    SELECT 0 INTO v_pending_verifications; -- Placeholder, adjust based on actual verification system
    
    -- Update or insert stats
    INSERT INTO public.admin_stats (
        total_users,
        total_athletes,
        total_organizers,
        total_admins,
        total_events,
        total_registrations,
        total_revenue,
        active_events,
        pending_verifications
    ) VALUES (
        v_total_users,
        v_total_athletes,
        v_total_organizers,
        v_total_admins,
        v_total_events,
        v_total_registrations,
        v_total_revenue,
        v_active_events,
        v_pending_verifications
    )
    ON CONFLICT (id) DO UPDATE SET
        total_users = EXCLUDED.total_users,
        total_athletes = EXCLUDED.total_athletes,
        total_organizers = EXCLUDED.total_organizers,
        total_admins = EXCLUDED.total_admins,
        total_events = EXCLUDED.total_events,
        total_registrations = EXCLUDED.total_registrations,
        total_revenue = EXCLUDED.total_revenue,
        active_events = EXCLUDED.active_events,
        pending_verifications = EXCLUDED.pending_verifications,
        last_updated = NOW();
END;
$$;

-- Function to log admin action
CREATE OR REPLACE FUNCTION public.log_admin_action(
    p_admin_user_id UUID,
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id UUID DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO public.admin_audit_logs (
        admin_user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values,
        ip_address,
        user_agent
    ) VALUES (
        p_admin_user_id,
        p_action,
        p_resource_type,
        p_resource_id,
        p_old_values,
        p_new_values,
        p_ip_address,
        p_user_agent
    ) RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$;

-- Function to generate admin report
CREATE OR REPLACE FUNCTION public.generate_admin_report(
    p_report_type TEXT,
    p_generated_by UUID,
    p_title TEXT,
    p_description TEXT DEFAULT '',
    p_filters JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_report_id UUID;
BEGIN
    INSERT INTO public.admin_reports (
        report_type,
        generated_by,
        title,
        description,
        filters
    ) VALUES (
        p_report_type,
        p_generated_by,
        p_title,
        p_description,
        p_filters
    ) RETURNING id INTO v_report_id;
    
    RETURN v_report_id;
END;
$$;

-- Function to get user analytics for a date range
CREATE OR REPLACE FUNCTION public.get_user_analytics(
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    metric_date DATE,
    new_users INT,
    active_users INT,
    user_retention_rate DECIMAL,
    user_growth_rate DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        aua.metric_date,
        aua.new_users,
        aua.active_users,
        aua.user_retention_rate,
        aua.user_growth_rate
    FROM public.admin_user_analytics aua
    WHERE aua.metric_date BETWEEN p_start_date AND p_end_date
    ORDER BY aua.metric_date;
END;
$$;

-- Function to get event analytics for a date range
CREATE OR REPLACE FUNCTION public.get_event_analytics(
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    metric_date DATE,
    total_events INT,
    active_events INT,
    completed_events INT,
    registration_conversion_rate DECIMAL,
    avg_participants_per_event INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        aea.metric_date,
        aea.total_events,
        aea.active_events,
        aea.completed_events,
        aea.registration_conversion_rate,
        aea.avg_participants_per_event
    FROM public.admin_event_analytics aea
    WHERE aea.metric_date BETWEEN p_start_date AND p_end_date
    ORDER BY aea.metric_date;
END;
$$;

-- Function to get finance summary for a period
CREATE OR REPLACE FUNCTION public.get_finance_summary(
    p_period_start DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_period_end DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    period_start DATE,
    period_end DATE,
    total_revenue NUMERIC,
    platform_fees NUMERIC,
    net_revenue NUMERIC,
    total_transactions INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        afs.period_start,
        afs.period_end,
        afs.total_revenue,
        afs.platform_fees,
        afs.net_revenue,
        afs.total_transactions
    FROM public.admin_finance_summary afs
    WHERE afs.period_start >= p_period_start AND afs.period_end <= p_period_end
    ORDER BY afs.period_start;
END;
$$;

-- Enable Row Level Security on admin tables
ALTER TABLE public.admin_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_event_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_finance_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_system_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin tables
-- Only admins can access admin tables
CREATE POLICY "Admins can view admin stats" ON public.admin_stats
    FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update admin stats" ON public.admin_stats
    FOR UPDATE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can view user analytics" ON public.admin_user_analytics
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can view event analytics" ON public.admin_event_analytics
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can view finance summary" ON public.admin_finance_summary
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can view system monitoring" ON public.admin_system_monitoring
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can view audit logs" ON public.admin_audit_logs
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can manage reports" ON public.admin_reports
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can manage compliance" ON public.admin_compliance
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can manage feature flags" ON public.admin_feature_flags
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can manage notifications" ON public.admin_notifications
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Create trigger to update admin stats when important data changes
CREATE OR REPLACE FUNCTION public.update_admin_stats_after_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Update stats asynchronously to avoid slowing down the main transaction
    -- In a real implementation, you might want to use a background job queue
    -- For now, we'll just call the function directly
    PERFORM public.update_admin_stats();
    RETURN 
        CASE 
            WHEN TG_OP = 'INSERT' THEN NEW
            WHEN TG_OP = 'UPDATE' THEN NEW
            WHEN TG_OP = 'DELETE' THEN OLD
        END;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update admin stats when important data changes
CREATE TRIGGER update_admin_stats_after_user_change
    AFTER INSERT OR UPDATE OR DELETE ON auth.users
    FOR EACH STATEMENT EXECUTE FUNCTION public.update_admin_stats_after_change();

CREATE TRIGGER update_admin_stats_after_event_change
    AFTER INSERT OR UPDATE OR DELETE ON public.events
    FOR EACH STATEMENT EXECUTE FUNCTION public.update_admin_stats_after_change();

CREATE TRIGGER update_admin_stats_after_registration_change
    AFTER INSERT OR UPDATE OR DELETE ON public.event_registrations
    FOR EACH STATEMENT EXECUTE FUNCTION public.update_admin_stats_after_change();

CREATE TRIGGER update_admin_stats_after_revenue_change
    AFTER INSERT OR UPDATE OR DELETE ON public.organizer_revenue
    FOR EACH STATEMENT EXECUTE FUNCTION public.update_admin_stats_after_change();
