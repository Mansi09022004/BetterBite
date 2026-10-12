import { supabase } from '../lib/supabase';

export interface Address {
  id: string;
  user_id: string;
  label: string | null;
  full_name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  zip: string;
  is_default: boolean;
  created_at: string;
}

export type AddressInput = Omit<Address, 'id' | 'user_id' | 'created_at' | 'is_default'>;

export async function listAddresses(userId: string): Promise<Address[]> {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) return [];
  return data as Address[];
}

export async function addAddress(userId: string, input: AddressInput) {
  const { error } = await supabase.from('addresses').insert({ user_id: userId, ...input });
  return { error: error?.message ?? null };
}

export async function updateAddress(id: string, input: Partial<AddressInput>) {
  const { error } = await supabase.from('addresses').update(input).eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteAddress(id: string) {
  const { error } = await supabase.from('addresses').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function setDefaultAddress(userId: string, id: string) {
  await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);
  const { error } = await supabase.from('addresses').update({ is_default: true }).eq('id', id);
  return { error: error?.message ?? null };
}
