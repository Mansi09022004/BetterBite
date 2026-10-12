import { supabase } from '../../lib/supabase';

export interface DashboardStats {
  total_orders: number;
  total_revenue: number;
  total_customers: number;
  todays_orders: number;
  pending_orders: number;
}

export async function getDashboardStats(): Promise<DashboardStats | null> {
  const { data, error } = await supabase.from('admin_dashboard_stats').select('*').single();
  if (error) {
    console.error('[admin] getDashboardStats failed', error);
    return null;
  }
  return data as DashboardStats;
}
