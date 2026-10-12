import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) return null;
  return data as Profile;
}

export async function upsertProfile(userId: string, fields: { full_name?: string; phone?: string }) {
  const { error } = await supabase.from('profiles').upsert({ id: userId, ...fields });
  return { error: error?.message ?? null };
}
