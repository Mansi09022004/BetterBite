import { supabase } from '../../lib/supabase';

export interface AdminSettings {
  business_name: string;
  support_email: string;
  shipping_charge: number;
  free_shipping_threshold: number;
  tax_percent: number;
}

export async function getAdminSettings(): Promise<AdminSettings | null> {
  const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
  if (error) {
    console.error('[admin] getAdminSettings failed', error);
    return null;
  }
  return data as AdminSettings;
}

export async function updateAdminSettings(fields: Partial<AdminSettings>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('settings').update(fields).eq('id', 1);
  return { error: error?.message ?? null };
}
