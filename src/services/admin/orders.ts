import { supabase } from '../../lib/supabase';

export interface AdminOrderProduct {
  name: string;
  flavor: string;
  qty: number;
  price: number;
}

export interface AdminOrder {
  id: string;
  user_id: string | null;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  subtotal: number;
  discount: number;
  coupon_code: string | null;
  order_status: string;
  payment_status: string;
  payment_method: string | null;
  payment_id: string;
  shipping_address: string;
  city: string;
  pincode: string;
  products: AdminOrderProduct[];
  created_at: string;
  updated_at: string;
}

export const ORDER_STATUS_FLOW = ['Confirmed', 'Preparing', 'Shipped', 'Out For Delivery', 'Delivered'] as const;

export async function listAdminOrders(): Promise<AdminOrder[]> {
  const { data, error } = await supabase
    .from('orders_admin_view')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[admin] listAdminOrders failed', error);
    return [];
  }
  return data as AdminOrder[];
}

export async function updateOrderStatus(orderId: string, status: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('orders').update({ order_status: status }).eq('order_id', orderId);
  return { error: error?.message ?? null };
}
