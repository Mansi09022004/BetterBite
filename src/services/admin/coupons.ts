import { supabase } from '../../lib/supabase';

export interface Coupon {
  code: string;
  discount_percent: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export async function listCoupons(): Promise<Coupon[]> {
  const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('[admin] listCoupons failed', error);
    return [];
  }
  return data as Coupon[];
}

export async function createCoupon(input: { code: string; discount_percent: number }): Promise<{ error: string | null }> {
  const { error } = await supabase.from('coupons').insert({
    code: input.code.trim().toUpperCase(),
    discount_percent: input.discount_percent,
  });
  return { error: error?.message ?? null };
}

export async function updateCoupon(
  code: string,
  fields: Partial<Pick<Coupon, 'discount_percent' | 'active'>>
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('coupons').update(fields).eq('code', code);
  return { error: error?.message ?? null };
}

export async function deleteCoupon(code: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('coupons').delete().eq('code', code);
  return { error: error?.message ?? null };
}
