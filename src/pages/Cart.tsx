import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Tag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { findProduct } from '../data/products';
import { PouchMockup } from '../components/illustrations/PouchMockup';
import { Reveal } from '../components/ui/Reveal';

export default function Cart() {
  const { lines, setQty, removeFromCart, subtotal, discount, total, couponCode, couponError, applyCoupon, removeCoupon } =
    useCart();
  const [code, setCode] = useState('');
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const handleApply = () => {
    if (!code.trim()) return;
    applyCoupon(code);
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const shipping = subtotal > 0 && subtotal < 499 ? 49 : 0;
  const grandTotal = total + shipping;

  return (
    <div className="container-page min-h-[70vh] py-14 sm:py-20">
      <Helmet>
        <title>Your Bag — BetterBite</title>
      </Helmet>

      <h1 className="font-display text-3xl font-bold text-cocoa-700 sm:text-4xl">Your Bag</h1>

      {lines.length === 0 ? (
        <Reveal className="mt-16 flex flex-col items-center gap-5 text-center">
          <p className="text-lg text-cocoa-500">Your bag is empty — let's fix that.</p>
          <Link to="/#shop">
            <button className="btn-primary">Shop Flavors</button>
          </Link>
        </Reveal>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <ul className="flex flex-col gap-4">
            {lines.map((line) => {
              const product = findProduct(line.productId);
              if (!product) return null;
              return (
                <motion.li
                  layout
                  key={line.productId}
                  className="flex gap-4 rounded-3xl bg-white/70 p-4 shadow-soft ring-1 ring-cocoa-600/[0.05] sm:p-5"
                >
                  <div className="h-24 w-16 shrink-0 sm:h-28 sm:w-20">
                    <PouchMockup theme={product.theme} flavor={product.name.replace(/ Bite$/, '')} showBites={false} />
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display font-bold text-cocoa-700">{product.name}</p>
                        <p className="text-xs text-cocoa-400">
                          {product.kcal} kcal · {product.protein}g protein · {product.sugar}g added sugar
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(line.productId)}
                        className="text-cocoa-400 hover:text-berry"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQty(line.productId, line.qty - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-cocoa-600/[0.08] hover:bg-cocoa-600/15"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center font-semibold">{line.qty}</span>
                        <button
                          onClick={() => setQty(line.productId, line.qty + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-cocoa-600/[0.08] hover:bg-cocoa-600/15"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-display font-bold text-cocoa-700">
                        ₹{Math.round(product.price * line.qty)}
                      </span>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>

          <div className="h-fit rounded-3xl bg-white/80 p-6 shadow-soft ring-1 ring-cocoa-600/[0.05]">
            <h2 className="font-display text-lg font-bold text-cocoa-700">Order Summary</h2>

            <div className="mt-5">
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cocoa-400">
                <Tag className="h-3.5 w-3.5" /> Coupon Code
              </label>
              {couponCode ? (
                <div className="flex items-center justify-between rounded-xl bg-gold-100 px-4 py-2.5 text-sm font-semibold text-gold-700">
                  <span>{couponCode} applied</span>
                  <button onClick={removeCoupon} className="text-xs underline">
                    Remove
                  </button>
                </div>
              ) : (
                <motion.div
                  animate={shake ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="flex gap-2"
                >
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Try BETTER10"
                    className="w-full rounded-xl border border-cocoa-600/15 bg-cream-100 px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
                  />
                  <button onClick={handleApply} className="btn-secondary !px-4 !py-2.5 text-sm">
                    Apply
                  </button>
                </motion.div>
              )}
              {couponError && !couponCode && <p className="mt-2 text-xs text-berry">{couponError}</p>}
            </div>

            <div className="mt-6 space-y-2.5 border-t border-cocoa-600/10 pt-5 text-sm">
              <div className="flex justify-between text-cocoa-500">
                <span>Subtotal</span>
                <span>₹{Math.round(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-gold-700">
                  <span>Discount</span>
                  <span>-₹{Math.round(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-cocoa-500">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between border-t border-cocoa-600/10 pt-3 font-display text-lg font-bold text-cocoa-700">
                <span>Total</span>
                <span>₹{Math.round(grandTotal)}</span>
              </div>
            </div>

            <button onClick={() => navigate('/checkout')} className="btn-primary mt-6 w-full">
              Checkout <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
