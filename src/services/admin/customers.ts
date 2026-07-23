import { supabase } from '../../lib/supabase';

export interface AdminCustomer {
  customer_name: string;
  customer_email: string;
  order_count: number;
  lifetime_spend: number;
  last_order_date: string;
}

export async function listAdminCustomers(): Promise<AdminCustomer[]> {
  const { data, error } = await supabase
    .from('customers_admin_view')
    .select('*')
    .order('lifetime_spend', { ascending: false });
  if (error) {
    console.error('[admin] listAdminCustomers failed', error);
    return [];
  }
  return data as AdminCustomer[];
}
