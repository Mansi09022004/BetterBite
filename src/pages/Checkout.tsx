import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, CreditCard, Landmark, Smartphone, Wallet, PartyPopper } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { findProduct } from '../data/products';

type Step = 'shipping' | 'payment' | 'review' | 'done';
type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'applepay' | 'googlepay';

const steps: { id: Step; label: string }[] = [
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

export default function Checkout() {
  const { lines, subtotal, discount, total, couponCode, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('shipping');
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [shipping, setShipping] = useState({ name: '', address: '', city: '', zip: '', email: '' });

  const shippingCost = subtotal > 0 && subtotal < 499 ? 49 : 0;
  const grandTotal = total + shippingCost;
  const currentIndex = steps.findIndex((s) => s.id === step);

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

  const handlePlaceOrder = () => {
    setStep('done');
    clearCart();
  };

  return (
    <div className="container-page min-h-[70vh] py-14 sm:py-20">
      <Helmet>
        <title>Checkout — BetterBite</title>
      </Helmet>

      {step !== 'done' && (
        <>
          <h1 className="font-display text-3xl font-bold text-cocoa-700 sm:text-4xl">Checkout</h1>

          <div className="mt-8 flex items-center gap-2 sm:gap-4">
            {steps.map((s, i) => (
              <div key={s.id} className="flex flex-1 items-center gap-2 sm:gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    i <= currentIndex ? 'bg-cocoa-600 text-cream-100' : 'bg-cocoa-600/10 text-cocoa-400'
                  }`}
                >
                  {i < currentIndex ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={`hidden text-sm font-semibold sm:inline ${
                    i <= currentIndex ? 'text-cocoa-700' : 'text-cocoa-400'
                  }`}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && <div className="h-0.5 flex-1 rounded bg-cocoa-600/10" />}
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
            <AnimatePresence mode="wait">
              {step === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="rounded-3xl bg-white/80 p-6 shadow-soft ring-1 ring-cocoa-600/[0.05] sm:p-8"
                >
                  <h2 className="mb-5 font-display text-lg font-bold text-cocoa-700">Shipping Details</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setStep('payment');
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
                    <button type="submit" className="btn-primary sm:col-span-2 mt-2">
                      Continue to Payment
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="rounded-3xl bg-white/80 p-6 shadow-soft ring-1 ring-cocoa-600/[0.05] sm:p-8"
                >
                  <h2 className="mb-5 font-display text-lg font-bold text-cocoa-700">Payment Method</h2>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { id: 'card', label: 'Card', icon: CreditCard },
                      { id: 'upi', label: 'UPI', icon: Smartphone },
                      { id: 'netbanking', label: 'Net Banking', icon: Landmark },
                      { id: 'wallet', label: 'Wallet', icon: Wallet },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMethod(m.id as PaymentMethod)}
                        className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 text-xs font-semibold transition-colors ${
                          method === m.id
                            ? 'border-cocoa-600 bg-cocoa-600/[0.06] text-cocoa-700'
                            : 'border-transparent bg-cocoa-600/[0.04] text-cocoa-400 hover:bg-cocoa-600/[0.07]'
                        }`}
                      >
                        <m.icon className="h-5 w-5" />
                        {m.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => setMethod('applepay')}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-colors ${
                        method === 'applepay' ? 'bg-black text-white' : 'bg-cocoa-600/[0.06] text-cocoa-600 hover:bg-black hover:text-white'
                      }`}
                    >
                       Pay
                    </button>
                    <button
                      onClick={() => setMethod('googlepay')}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-colors ${
                        method === 'googlepay'
                          ? 'bg-cocoa-700 text-cream-100'
                          : 'bg-cocoa-600/[0.06] text-cocoa-600 hover:bg-cocoa-700 hover:text-cream-100'
                      }`}
                    >
                      G Pay
                    </button>
                  </div>

                  <div className="mt-6 rounded-2xl bg-cream-200/60 p-5">
                    {method === 'card' && (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <input placeholder="Card number" className="input-field sm:col-span-2" />
                        <input placeholder="MM / YY" className="input-field" />
                        <input placeholder="CVC" className="input-field" />
                        <input placeholder="Name on card" className="input-field sm:col-span-2" />
                      </div>
                    )}
                    {method === 'upi' && (
                      <input placeholder="yourname@upi" className="input-field w-full" />
                    )}
                    {method === 'netbanking' && (
                      <select className="input-field w-full">
                        <option>Select your bank</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>State Bank</option>
                        <option>Chase</option>
                        <option>Bank of America</option>
                      </select>
                    )}
                    {method === 'wallet' && (
                      <select className="input-field w-full">
                        <option>Select wallet</option>
                        <option>PayPal</option>
                        <option>Paytm</option>
                        <option>Amazon Pay</option>
                      </select>
                    )}
                    {(method === 'applepay' || method === 'googlepay') && (
                      <p className="text-center text-sm text-cocoa-500">
                        You'll confirm this payment via your device's secure {method === 'applepay' ? 'Apple' : 'Google'} Pay sheet.
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button onClick={() => setStep('shipping')} className="btn-secondary flex-1">
                      Back
                    </button>
                    <button onClick={() => setStep('review')} className="btn-primary flex-1">
                      Review Order
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="rounded-3xl bg-white/80 p-6 shadow-soft ring-1 ring-cocoa-600/[0.05] sm:p-8"
                >
                  <h2 className="mb-5 font-display text-lg font-bold text-cocoa-700">Review & Place Order</h2>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="font-semibold text-cocoa-600">Shipping to</p>
                      <p className="text-cocoa-500">
                        {shipping.name || 'Jane Doe'}, {shipping.address || '123 Main St'}, {shipping.city || 'Springfield'}{' '}
                        {shipping.zip}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-cocoa-600">Payment method</p>
                      <p className="capitalize text-cocoa-500">{method.replace('pay', ' Pay')}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-cocoa-600">Items</p>
                      <ul className="mt-1 space-y-1 text-cocoa-500">
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
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button onClick={() => setStep('payment')} className="btn-secondary flex-1">
                      Back
                    </button>
                    <button onClick={handlePlaceOrder} className="btn-primary flex-1">
                      Place Order · ₹{Math.round(grandTotal)}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </motion.div>
      )}
    </div>
  );
}
