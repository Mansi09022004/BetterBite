import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PartyPopper } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { useStoreConfig } from '../context/StoreConfigContext';
import { supabase } from '../lib/supabase';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Step = 'shipping' | 'done';

export default function Checkout() {
  const { lines, subtotal, discount, total, couponCode, clearCart } = useCart();
  const { profile } = useAuth();
  const { findProduct } = useProducts();
  const { settings } = useStoreConfig();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('shipping');
  const [shipping, setShipping] = useState({ name: '', address: '', city: '', zip: '', email: '' });
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const shippingCost = subtotal > 0 && subtotal < settings.freeShippingThreshold ? settings.shippingCharge : 0;
  const grandTotal = total + shippingCost;

  if (lines.length === 0 && step !== 'done') {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-lg text-cocoa-500">Your bag is empty — add some Bites before checking out.</p>
        <button onClick={() => navigate('/#shop')} className="btn-primary">
          Shop Flavors
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (placing) return;
    setOrderError(null);

    if (typeof window.Razorpay !== 'function') {
      setOrderError('Payment is still loading — please try again in a moment.');
      return;
    }

    setPlacing(true);

    try {
      const orderRes = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines, couponCode }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setOrderError(orderData.error || 'Could not start payment. Please try again.');
        setPlacing(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.razorpayOrderId,
        name: 'BetterBite',
        description: 'BetterBite order',
        prefill: {
          name: shipping.name,
          email: shipping.email,
          contact: profile?.phone || '',
        },
        theme: { color: '#3B2A22' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData.session?.access_token;

            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
              },
              body: JSON.stringify({
                ...response,
                lines,
                couponCode,
                customer: {
                  name: shipping.name,
                  email: shipping.email,
                  phone: profile?.phone || '',
                },
                shippingAddress: {
                  address: shipping.address,
                  city: shipping.city,
                  zip: shipping.zip,
                },
              }),
            });
            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              setOrderError(verifyData.error || 'Payment verification failed. Please contact support.');
              setPlacing(false);
              return;
            }

            setOrderId(verifyData.orderId || null);
            setStep('done');
            clearCart();
          } catch {
            setOrderError('Payment succeeded but we could not confirm your order. Please contact support.');
          } finally {
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: () => setPlacing(false),
        },
      });

      razorpay.open();
    } catch {
      setOrderError('Could not start payment. Please check your connection and try again.');
      setPlacing(false);
    }
  };

  return (
    <div className="container-page min-h-[70vh] py-14 sm:py-20">
      <Helmet>
        <title>Checkout — BetterBite</title>
      </Helmet>

      {step !== 'done' && (
        <>
          <h1 className="font-display text-3xl font-bold text-cocoa-700 sm:text-4xl">Checkout</h1>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-3xl bg-white/80 p-6 shadow-soft ring-1 ring-cocoa-600/[0.05] sm:p-8"
            >
              <h2 className="mb-5 font-display text-lg font-bold text-cocoa-700">Shipping Details</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePlaceOrder();
                }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <input
                  required
                  placeholder="Full name"
                  value={shipping.name}
                  onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                  className="input-field sm:col-span-2"
                />
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  value={shipping.email}
                  onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  className="input-field sm:col-span-2"
                />
                <input
                  required
                  placeholder="Street address"
                  value={shipping.address}
                  onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  className="input-field sm:col-span-2"
                />
                <input
                  required
                  placeholder="City"
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  className="input-field"
                />
                <input
                  required
                  placeholder="ZIP / Postal code"
                  value={shipping.zip}
                  onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                  className="input-field"
                />
                {orderError && (
                  <div className="rounded-xl bg-berry/10 px-4 py-2.5 text-sm font-medium text-berry sm:col-span-2">
                    {orderError}
                  </div>
                )}
                <button
                  type="submit"
                  className="btn-primary sm:col-span-2 mt-2 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={placing}
                >
                  {placing ? 'Processing…' : `Place Order · ₹${Math.round(grandTotal)}`}
                </button>
              </form>
            </motion.div>

            <div className="h-fit rounded-3xl bg-white/80 p-6 shadow-soft ring-1 ring-cocoa-600/[0.05]">
              <h2 className="font-display text-lg font-bold text-cocoa-700">Order Summary</h2>
              <ul className="mt-4 space-y-2 text-sm text-cocoa-500">
                {lines.map((l) => {
                  const p = findProduct(l.productId);
                  return p ? (
                    <li key={l.productId} className="flex justify-between">
                      <span>{p.name} × {l.qty}</span>
                      <span>₹{Math.round(p.price * l.qty)}</span>
                    </li>
                  ) : null;
                })}
              </ul>
              <div className="mt-4 space-y-2 border-t border-cocoa-600/10 pt-4 text-sm">
                <div className="flex justify-between text-cocoa-500">
                  <span>Subtotal</span>
                  <span>₹{Math.round(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-gold-700">
                    <span>Discount {couponCode && `(${couponCode})`}</span>
                    <span>-₹{Math.round(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-cocoa-500">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between border-t border-cocoa-600/10 pt-3 font-display text-lg font-bold text-cocoa-700">
                  <span>Total</span>
                  <span>₹{Math.round(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {step === 'done' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto flex max-w-lg flex-col items-center gap-5 rounded-3xl bg-white/80 p-10 text-center shadow-soft"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500 text-cocoa-800"
          >
            <PartyPopper className="h-8 w-8" />
          </motion.div>
          <h1 className="font-display text-2xl font-bold text-cocoa-700">Order Confirmed!</h1>
          <p className="text-cocoa-500">
            Thanks{shipping.name ? `, ${shipping.name}` : ''} — your Bites are on their way. A confirmation email is
            headed to {shipping.email || 'your inbox'}.
            {orderId && (
              <>
                {' '}
                Your order ID is <span className="font-semibold text-cocoa-700">{orderId}</span>.
              </>
            )}
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </motion.div>
      )}
    </div>
  );
}
