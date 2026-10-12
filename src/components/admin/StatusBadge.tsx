const ORDER_STATUS_TONE: Record<string, string> = {
  Confirmed: 'bg-gold-100 text-gold-700 dark:bg-gold-500/10 dark:text-gold-400',
  Preparing: 'bg-gold-100 text-gold-700 dark:bg-gold-500/10 dark:text-gold-400',
  Shipped: 'bg-cocoa-100 text-cocoa-600 dark:bg-white/10 dark:text-slate-200',
  'Out For Delivery': 'bg-cocoa-100 text-cocoa-600 dark:bg-white/10 dark:text-slate-200',
  Delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Cancelled: 'bg-berry/10 text-berry',
};

const PAYMENT_STATUS_TONE: Record<string, string> = {
  Paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Pending: 'bg-gold-100 text-gold-700 dark:bg-gold-500/10 dark:text-gold-400',
  Refunded: 'bg-berry/10 text-berry',
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
        ORDER_STATUS_TONE[status] || 'bg-cocoa-100 text-cocoa-600 dark:bg-white/10 dark:text-slate-200'
      }`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
        PAYMENT_STATUS_TONE[status] || 'bg-cocoa-100 text-cocoa-600 dark:bg-white/10 dark:text-slate-200'
      }`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
