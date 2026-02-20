import { supabase } from "@/integrations/supabase/client";

// Admin Dashboard API functions

/**
 * Get admin dashboard overview data
 */
export const getAdminDashboardOverview = async () => {
  const { data, error } = await supabase.rpc('get_admin_dashboard_overview');

  if (error) {
    console.error('Error fetching admin dashboard overview:', error);
    throw error;
  }

  return data;
};

/**
 * Update admin stats manually
 */
export const updateAdminStats = async () => {
  const { error } = await supabase.rpc('update_admin_stats');

  if (error) {
    console.error('Error updating admin stats:', error);
    throw error;
  }
};

/**
 * Log admin action
 */
export const logAdminAction = async (
  adminUserId: string,
  action: string,
  resourceType: string,
  resourceId?: string,
  oldValues?: any,
  newValues?: any,
  ipAddress?: string,
  userAgent?: string
) => {
  const { error } = await supabase.rpc('log_admin_action', {
    p_admin_user_id: adminUserId,
    p_action: action,
    p_resource_type: resourceType,
    p_resource_id: resourceId,
    p_old_values: oldValues || null,
    p_new_values: newValues || null,
    p_ip_address: ipAddress || null,
    p_user_agent: userAgent || null
  });

  if (error) {
    console.error('Error logging admin action:', error);
    throw error;
  }
};

/**
 * Generate admin report
 */
export const generateAdminReport = async (
  reportType: string,
  generatedBy: string,
  title: string,
  description?: string,
  filters?: any
) => {
  const { data, error } = await supabase.rpc('generate_admin_report', {
    p_report_type: reportType,
    p_generated_by: generatedBy,
    p_title: title,
    p_description: description || '',
    p_filters: filters || {}
  });

  if (error) {
    console.error('Error generating admin report:', error);
    throw error;
  }

  return data;
};

/**
 * Get user analytics
 */
export const getUserAnalytics = async (
  startDate?: string,
  endDate?: string
) => {
  const { data, error } = await supabase.rpc('get_user_analytics', {
    p_start_date: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    p_end_date: endDate || new Date().toISOString().split('T')[0]
  });

  if (error) {
    console.error('Error fetching user analytics:', error);
    throw error;
  }

  return data;
};

/**
 * Get event analytics
 */
export const getEventAnalytics = async (
  startDate?: string,
  endDate?: string
) => {
  const { data, error } = await supabase.rpc('get_event_analytics', {
    p_start_date: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    p_end_date: endDate || new Date().toISOString().split('T')[0]
  });

  if (error) {
    console.error('Error fetching event analytics:', error);
    throw error;
  }

  return data;
};

/**
 * Get finance summary
 */
export const getFinanceSummary = async (
  periodStart?: string,
  periodEnd?: string
) => {
  const { data, error } = await supabase.rpc('get_finance_summary', {
    p_period_start: periodStart || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    p_period_end: periodEnd || new Date().toISOString().split('T')[0]
  });

  if (error) {
    console.error('Error fetching finance summary:', error);
    throw error;
  }

  return data;
};

/**
 * Get all audit logs
 */
export const getAuditLogs = async (limit: number = 100, offset: number = 0) => {
  const { data, error } = await supabase
    .from('admin_audit_logs')
    .select(`
      *,
      admin_user:profiles!admin_audit_logs_admin_user_id_fkey(full_name)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }

  return data;
};

/**
 * Get system monitoring data
 */
export const getSystemMonitoring = async (hoursBack: number = 24) => {
  const { data, error } = await supabase
    .from('admin_system_monitoring')
    .select('*')
    .gte('metric_timestamp', new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString())
    .order('metric_timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching system monitoring data:', error);
    throw error;
  }

  return data;
};

/**
 * Get compliance items
 */
export const getComplianceItems = async (status?: string) => {
  let query = supabase.from('admin_compliance').select(`
    *,
    assigned_user:profiles!admin_compliance_assigned_to_fkey(full_name)
  `).order('due_date', { ascending: true });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching compliance items:', error);
    throw error;
  }

  return data;
};

/**
 * Update compliance item
 */
export const updateComplianceItem = async (
  complianceId: string,
  updates: {
    status?: string;
    notes?: string;
    due_date?: string;
    assigned_to?: string;
  }
) => {
  const { error } = await supabase
    .from('admin_compliance')
    .update(updates)
    .eq('id', complianceId);

  if (error) {
    console.error('Error updating compliance item:', error);
    throw error;
  }
};

/**
 * Get feature flags
 */
export const getFeatureFlags = async () => {
  const { data, error } = await supabase
    .from('admin_feature_flags')
    .select('*')
    .order('flag_name', { ascending: true });

  if (error) {
    console.error('Error fetching feature flags:', error);
    throw error;
  }

  return data;
};

/**
 * Update feature flag
 */
export const updateFeatureFlag = async (
  flagId: string,
  updates: {
    is_enabled?: boolean;
    rollout_percentage?: number;
    targeting_criteria?: any;
  }
) => {
  const { error } = await supabase
    .from('admin_feature_flags')
    .update(updates)
    .eq('id', flagId);

  if (error) {
    console.error('Error updating feature flag:', error);
    throw error;
  }
};

/**
 * Get admin notifications
 */
export const getAdminNotifications = async (isActive: boolean = true) => {
  const { data, error } = await supabase
    .from('admin_notifications')
    .select('*')
    .eq('is_active', isActive)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin notifications:', error);
    throw error;
  }

  return data;
};

/**
 * Update notification
 */
export const updateNotification = async (
  notificationId: string,
  updates: {
    title?: string;
    message?: string;
    notification_type?: string;
    severity?: string;
    target_audience?: string;
    is_active?: boolean;
    scheduled_at?: string;
    expires_at?: string;
  }
) => {
  const { error } = await supabase
    .from('admin_notifications')
    .update(updates)
    .eq('id', notificationId);

  if (error) {
    console.error('Error updating notification:', error);
    throw error;
  }
};

/**
 * Create notification
 */
export const createNotification = async (
  title: string,
  message: string,
  notificationType?: string,
  severity?: string,
  targetAudience?: string,
  scheduledAt?: string,
  expiresAt?: string
) => {
  const { error } = await supabase
    .from('admin_notifications')
    .insert({
      title,
      message,
      notification_type: notificationType || 'info',
      severity: severity || 'medium',
      target_audience: targetAudience || 'all',
      scheduled_at: scheduledAt,
      expires_at: expiresAt,
      created_by: (await supabase.auth.getUser()).data.user?.id
    });

  if (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};