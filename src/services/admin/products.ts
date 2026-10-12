import { supabase } from '../../lib/supabase';

export interface AdminProduct {
  id: string;
  name: string;
  tagline: string;
  theme: string;
  price: number;
  compare_at_price: number | null;
  stock: number;
  active: boolean;
  badge: string | null;
  description: string;
}

export async function listAdminProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabase.from('products').select('*').order('name', { ascending: true });
  if (error) {
    console.error('[admin] listAdminProducts failed', error);
    return [];
  }
  return data as AdminProduct[];
}

export async function updateProduct(
  id: string,
  fields: Partial<Pick<AdminProduct, 'price' | 'stock' | 'active'>>
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('products').update(fields).eq('id', id);
  return { error: error?.message ?? null };
}
