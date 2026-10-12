import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';
import { computeOrderTotals, type CartLineInput } from './_lib/pricing.js';

interface CreateOrderBody {
  lines: CartLineInput[];
  couponCode?: string | null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    res.status(500).json({ error: 'Payments are not configured yet.' });
    return;
  }

  const body = req.body as CreateOrderBody;
  const lines = Array.isArray(body?.lines) ? body.lines : [];

  const totals = await computeOrderTotals(lines, body?.couponCode);

  if (totals.lines.length === 0 || totals.grandTotal <= 0) {
    res.status(400).json({ error: 'Cart is empty or invalid.' });
    return;
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(totals.grandTotal * 100),
      currency: 'INR',
      receipt: `bb_${Date.now()}`,
    });

    res.status(200).json({
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      grandTotal: totals.grandTotal,
    });
  } catch (err) {
    console.error('[create-razorpay-order] failed', err);
    res.status(500).json({ error: 'Could not create payment order. Please try again.' });
  }
}
