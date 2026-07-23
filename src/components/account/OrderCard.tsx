import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { Order } from '../../services/orders';
import { Badge } from '../ui/Badge';

const paymentTone = { Paid: 'cocoa', Pending: 'gold', Refunded: 'berry' } as const;
const orderTone = {
  Confirmed: 'gold',
  Processing: 'gold',
  Shipped: 'cocoa',
  Delivered: 'cocoa',
  Cancelled: 'berry',
} as const;

export function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const date = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="rounded-3xl bg-white/70 p-5 shadow-soft ring-1 ring-cocoa-600/[0.05] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display font-bold text-cocoa-700">Order #{order.order_id}</p>
          <p className="text-xs text-cocoa-400">{date}</p>
        </div>
        <div className="flex gap-2">
          <Badge tone={paymentTone[order.payment_status]}>{order.payment_status}</Badge>
          <Badge tone={orderTone[order.order_status]}>{order.order_status}</Badge>
        </div>
      </div>

      <p className="mt-3 text-sm text-cocoa-500">
        {order.products.map((i) => `${i.name} (${i.flavor}) × ${i.qty}`).join(', ')}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-cocoa-600/10 pt-4">
        <span className="font-display text-lg font-bold text-cocoa-700">₹{order.total_amount}</span>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 text-sm font-semibold text-cocoa-600 hover:text-gold-700"
        >
          View Details
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="mt-4 space-y-2 border-t border-cocoa-600/10 pt-4 text-sm text-cocoa-500">
              {order.products.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>
                    {item.name} ({item.flavor}) × {item.qty}
                  </span>
                  <span className="font-semibold text-cocoa-700">₹{item.price * item.qty}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
