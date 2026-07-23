import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Resend } from 'resend';
import { computeOrderTotals, type CartLineInput } from './_lib/pricing.js';
import { supabaseAdmin, isSupabaseAdminConfigured } from './_lib/supabaseAdmin.js';
import { renderCustomerEmail, renderAdminEmail, type EmailOrderData } from './_lib/emailTemplates.js';

interface VerifyPaymentBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  lines: CartLineInput[];
  couponCode?: string | null;
  customer: { name: string; email: string; phone: string };
  shippingAddress: { address: string; city: string; zip: string };
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
  if (!isSupabaseAdminConfigured) {
    res.status(500).json({ error: 'Order storage is not configured yet.' });
    return;
  }

  const body = req.body as VerifyPaymentBody;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400).json({ error: 'Missing payment details.' });
    return;
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    res.status(400).json({ error: 'Payment verification failed.' });
    return;
  }

  // The authenticated user's id must come from a server-verified session
  // token, never from a client-supplied field — a client value could be
  // stale, spoofed, or simply missing due to a frontend timing bug, any of
  // which would silently leave user_id NULL for a real logged-in customer.
  let userId: string | null = null;
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length);
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !authData.user) {
      console.error('[verify-payment] auth token present but failed verification', authError);
    } else {
      userId = authData.user.id;
    }
  }

  const lines = Array.isArray(body.lines) ? body.lines : [];
  const totals = await computeOrderTotals(lines, body.couponCode);

  if (totals.lines.length === 0 || totals.grandTotal <= 0) {
    res.status(400).json({ error: 'Cart is empty or invalid.' });
    return;
  }

  const { data: existing } = await supabaseAdmin
    .from('orders')
    .select('order_id')
    .eq('payment_id', razorpay_payment_id)
    .maybeSingle();

  if (existing) {
    res.status(200).json({ success: true, orderId: existing.order_id, duplicate: true });
    return;
  }

  const customer = body.customer || { name: 'Customer', email: '', phone: '' };
  const shippingAddress = body.shippingAddress || { address: '', city: '', zip: '' };

  let paymentMethod = 'razorpay';
  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    paymentMethod = payment.method || paymentMethod;
  } catch (err) {
    console.error('[verify-payment] could not fetch payment method from Razorpay', err);
  }

  // order_id is intentionally omitted — a Postgres trigger generates the
  // sequential BB-0001 style id. We read it back from the inserted row.
  const { data: inserted, error: insertError } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id: userId,
      products: totals.lines.map((l) => ({ name: l.name, flavor: l.flavor, qty: l.qty, price: l.price })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      total_amount: totals.grandTotal,
      coupon_code: totals.couponCode,
      payment_status: 'Paid',
      order_status: 'Confirmed',
      payment_id: razorpay_payment_id,
      payment_method: paymentMethod,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address: shippingAddress.address,
      city: shippingAddress.city,
      pincode: shippingAddress.zip,
    })
    .select('order_id')
    .single();

  if (insertError || !inserted) {
    console.error('[verify-payment] order insert failed', insertError);
    res.status(500).json({ error: 'Payment succeeded but saving the order failed. Please contact support.' });
    return;
  }

  const orderId = inserted.order_id;

  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'BetterBite <onboarding@resend.dev>';
  const siteUrl = process.env.SITE_URL || 'https://betterbite-mu.vercel.app';

  const { data: settingsRow } = await supabaseAdmin.from('settings').select('support_email').eq('id', 1).single();
  const supportEmail = settingsRow?.support_email || adminEmail || 'support@betterbite.in';

  if (!resendApiKey) {
    console.warn('[verify-payment] RESEND_API_KEY not set — skipping order emails.');
    res.status(200).json({ success: true, orderId });
    return;
  }

  const resend = new Resend(resendApiKey);
  const emailData: EmailOrderData = {
    orderNumber: orderId,
    orderDate: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    lines: totals.lines,
    couponCode: totals.couponCode,
    discount: totals.discount,
    subtotal: totals.subtotal,
    shippingCost: totals.shippingCost,
    grandTotal: totals.grandTotal,
    paymentMethod,
    paymentId: razorpay_payment_id,
    shippingAddress,
    siteUrl,
    supportEmail,
  };

  try {
    if (customer.email) {
      await resend.emails.send({
        from: fromEmail,
        to: customer.email,
        subject: '🎉 Your BetterBite Order is Confirmed!',
        html: renderCustomerEmail(emailData),
      });
    }
  } catch (err) {
    console.error('[verify-payment] customer email failed', err);
  }

  try {
    if (adminEmail) {
      await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: 'New BetterBite Order Received',
        html: renderAdminEmail(emailData),
      });
    }
  } catch (err) {
    console.error('[verify-payment] admin email failed', err);
  }

  res.status(200).json({ success: true, orderId });
}
