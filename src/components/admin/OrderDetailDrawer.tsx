import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import type { AdminOrder } from '../../services/admin/orders';
import { ORDER_STATUS_FLOW } from '../../services/admin/orders';
import { OrderStatusBadge, PaymentStatusBadge } from './StatusBadge';

export function OrderDetailDrawer({
  order,
  onClose,
  onStatusChange,
}: {
  order: AdminOrder | null;
  onClose: () => void;
  onStatusChange: (orderId: string, status: string) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);
  const currentIndex = order ? ORDER_STATUS_FLOW.indexOf(order.order_status as (typeof ORDER_STATUS_FLOW)[number]) : -1;
  const isFinal = order?.order_status === 'Delivered' || order?.order_status === 'Cancelled';

  const handleAdvance = async () => {
    if (!order || currentIndex === -1 || currentIndex >= ORDER_STATUS_FLOW.length - 1) return;
    setUpdating(true);
    await onStatusChange(order.order_id, ORDER_STATUS_FLOW[currentIndex + 1]);
    setUpdating(false);
  };

  const handleCancel = async () => {
    if (!order) return;
    setUpdating(true);
    await onStatusChange(order.order_id, 'Cancelled');
    setUpdating(false);
  };

  return (
    <AnimatePresence>
      {order && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-cocoa-800/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="ml-auto flex h-full w-full max-w-lg flex-col overflow-y-auto bg-cream-100 shadow-2xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-cocoa-600/10 p-6 dark:border-white/10">
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight text-cocoa-700 dark:text-slate-100">
                  {order.order_id}
                </h3>
                <p className="mt-0.5 text-xs text-cocoa-400 dark:text-slate-400">
                  {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-cocoa-600 transition-colors hover:bg-cocoa-600/[0.06] dark:text-slate-300 dark:hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-7 p-6">
              <div className="flex gap-2">
                <OrderStatusBadge status={order.order_status} />
                <PaymentStatusBadge status={order.payment_status} />
              </div>

              <section>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.06em] text-cocoa-400 dark:text-slate-400">Customer</h4>
                <p className="mt-1 text-sm text-cocoa-700 dark:text-slate-200">{order.customer_name}</p>
                <p className="text-sm text-cocoa-500 dark:text-slate-400">{order.customer_email}</p>
                <p className="text-sm text-cocoa-500 dark:text-slate-400">{order.customer_phone || '—'}</p>
              </section>

              <section>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.06em] text-cocoa-400 dark:text-slate-400">Shipping Address</h4>
                <p className="mt-1 text-sm text-cocoa-700 dark:text-slate-200">
                  {order.shipping_address}, {order.city} {order.pincode}
                </p>
              </section>

              <section>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.06em] text-cocoa-400 dark:text-slate-400">Products</h4>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {order.products.map((p, i) => (
                    <li key={i} className="flex justify-between text-cocoa-600 dark:text-slate-300">
                      <span>{p.name} × {p.qty}</span>
                      <span className="font-semibold text-cocoa-700 dark:text-slate-100">₹{p.price * p.qty}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 space-y-1 border-t border-cocoa-600/10 pt-3 text-sm dark:border-white/10">
                  <div className="flex justify-between text-cocoa-500 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-gold-700 dark:text-gold-400">
                      <span>Discount {order.coupon_code && `(${order.coupon_code})`}</span>
                      <span>-₹{order.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-display text-base font-bold text-cocoa-700 dark:text-slate-100">
                    <span>Total</span>
                    <span>₹{order.total_amount}</span>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.06em] text-cocoa-400 dark:text-slate-400">Payment</h4>
                <p className="mt-1 text-sm capitalize text-cocoa-700 dark:text-slate-200">{order.payment_method || '—'}</p>
                <p className="text-xs text-cocoa-400 dark:text-slate-400">{order.payment_id}</p>
              </section>

              <section>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.06em] text-cocoa-400 dark:text-slate-400">Order Status</h4>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {ORDER_STATUS_FLOW.map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <span
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          i <= currentIndex
                            ? 'bg-cocoa-600 text-cream-100 dark:bg-gold-500 dark:text-cocoa-900'
                            : 'bg-cocoa-600/[0.06] text-cocoa-400 dark:bg-white/5 dark:text-slate-400'
                        }`}
                      >
                        {i < currentIndex && <Check className="h-3 w-3" />}
                        {s}
                      </span>
                      {i < ORDER_STATUS_FLOW.length - 1 && (
                        <span className="h-px w-3 bg-cocoa-600/15 dark:bg-white/10" />
                      )}
                    </div>
                  ))}
                </div>

                {order.order_status === 'Cancelled' ? (
                  <p className="mt-4 text-sm font-semibold text-berry">This order was cancelled.</p>
                ) : (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleAdvance}
                      disabled={updating || isFinal}
                      className="btn-primary !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isFinal ? 'Delivered' : `Mark as ${ORDER_STATUS_FLOW[currentIndex + 1]}`}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={updating || isFinal}
                      className="rounded-full border border-berry/40 px-4 py-2 text-sm font-semibold text-berry disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </section>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
