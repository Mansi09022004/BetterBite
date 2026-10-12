import { supabaseAdmin } from './supabaseAdmin.js';
import { subscriptionPlans } from '../../src/data/subscriptionPlans.js';

export interface CartLineInput {
  productId: string;
  qty: number;
}

export interface PricedLine {
  productId: string;
  name: string;
  flavor: string;
  qty: number;
  price: number;
}

export interface OrderTotals {
  lines: PricedLine[];
  subtotal: number;
  discount: number;
  couponCode: string | null;
  shippingCost: number;
  grandTotal: number;
}

interface DbProduct {
  id: string;
  name: string;
  price: number;
}

function resolveLineProduct(id: string, dbProducts: Map<string, DbProduct>): { name: string; price: number } | undefined {
  const direct = dbProducts.get(id);
  if (direct) return { name: direct.name, price: direct.price };

  if (id.startsWith('sub__')) {
    const [, planId] = id.split('__');
    const plan = subscriptionPlans.find((p) => p.id === planId);
    if (!plan) return undefined;
    return { name: `${plan.name} (${plan.bitesPerBox} Bites)`, price: plan.pricePerBox };
  }

  return undefined;
}

/**
 * Single source of truth for order totals, re-derived server-side from the
 * live `products`/`coupons`/`settings` tables in Supabase. The client's own
 * total is never trusted for the actual charge amount — this function is
 * what Razorpay actually bills. Mirrors CartContext's math exactly: subtotal
 * -> coupon discount -> free shipping over the configured threshold.
 * Subscription-box line items (`sub__planId__theme`) still resolve against
 * the static subscriptionPlans data — no admin page manages those.
 */
export async function computeOrderTotals(
  rawLines: CartLineInput[],
  couponCode: string | null | undefined
): Promise<OrderTotals> {
  const [{ data: productRows }, { data: settingsRow }] = await Promise.all([
    supabaseAdmin.from('products').select('id, name, price'),
    supabaseAdmin.from('settings').select('shipping_charge, free_shipping_threshold').eq('id', 1).single(),
  ]);

  const dbProducts = new Map<string, DbProduct>((productRows || []).map((p) => [p.id, p]));
  const shippingCharge = settingsRow?.shipping_charge ?? 49;
  const freeShippingThreshold = settingsRow?.free_shipping_threshold ?? 499;

  const lines: PricedLine[] = [];

  for (const line of rawLines) {
    const product = resolveLineProduct(line.productId, dbProducts);
    if (!product || !Number.isFinite(line.qty) || line.qty <= 0) continue;
    lines.push({
      productId: line.productId,
      name: product.name,
      flavor: product.name,
      qty: line.qty,
      price: product.price,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);

  const normalizedCoupon = couponCode ? couponCode.trim().toUpperCase() : null;
  let discount = 0;
  let appliedCoupon: string | null = null;

  if (normalizedCoupon) {
    const { data: couponRow } = await supabaseAdmin
      .from('coupons')
      .select('discount_percent')
      .eq('code', normalizedCoupon)
      .eq('active', true)
      .maybeSingle();

    if (couponRow) {
      discount = subtotal * (couponRow.discount_percent / 100);
      appliedCoupon = normalizedCoupon;
    }
  }

  const total = Math.max(0, subtotal - discount);
  const shippingCost = subtotal > 0 && subtotal < freeShippingThreshold ? shippingCharge : 0;
  const grandTotal = Math.round(total + shippingCost);

  return {
    lines,
    subtotal: Math.round(subtotal),
    discount: Math.round(discount),
    couponCode: appliedCoupon,
    shippingCost,
    grandTotal,
  };
}
