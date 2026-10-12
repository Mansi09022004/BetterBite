import { supabase } from '../lib/supabase';

export interface OrderItem {
  name: string;
  flavor: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  order_id: string;
  products: OrderItem[];
  subtotal: number;
  discount: number;
  total_amount: number;
  coupon_code: string | null;
  payment_status: 'Paid' | 'Pending' | 'Refunded';
  payment_method: string | null;
  order_status: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  created_at: string;
  updated_at: string;
}

export async function listOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data as Order[];
}
