import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import { listAdminOrders, updateOrderStatus, type AdminOrder } from '../../services/admin/orders';
import { OrderStatusBadge, PaymentStatusBadge } from '../../components/admin/StatusBadge';
import { OrderDetailDrawer } from '../../components/admin/OrderDetailDrawer';

const STATUS_FILTERS = ['All', 'Confirmed', 'Preparing', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'];
const PAGE_SIZE = 15;

type SortKey = 'created_at' | 'total_amount' | 'customer_name';

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const load = () => {
    setLoading(true);
    listAdminOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = orders.filter((o) => {
      const matchesQuery =
        !q ||
        o.order_id.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_email.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || o.order_status === statusFilter;
      return matchesQuery && matchesStatus;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'created_at') cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      else if (sortKey === 'total_amount') cmp = a.total_amount - b.total_amount;
      else cmp = a.customer_name.localeCompare(b.customer_name);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [orders, query, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleStatusChange = async (orderId: string, status: string) => {
    const { error } = await updateOrderStatus(orderId, status);
    if (!error) {
      setOrders((prev) => prev.map((o) => (o.order_id === orderId ? { ...o, order_status: status } : o)));
      setSelected((prev) => (prev && prev.order_id === orderId ? { ...prev, order_status: status } : prev));
    }
  };

  return (
    <div>
      <Helmet>
        <title>Orders — BetterBite Admin</title>
      </Helmet>
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-cocoa-700 dark:text-slate-100">
        Orders
      </h1>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[240px] flex-1 items-center gap-2.5 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-cocoa-600/[0.08] dark:bg-slate-900 dark:ring-white/10">
          <Search className="h-4 w-4 shrink-0 text-cocoa-400 dark:text-slate-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search order ID, name, or email"
            className="w-full bg-transparent text-sm text-cocoa-700 outline-none placeholder:text-cocoa-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-xl bg-white px-3.5 py-3 text-sm font-medium text-cocoa-700 shadow-sm ring-1 ring-cocoa-600/[0.08] dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={`${sortKey}-${sortDir}`}
          onChange={(e) => {
            const [key, dir] = e.target.value.split('-') as [SortKey, 'asc' | 'desc'];
            setSortKey(key);
            setSortDir(dir);
          }}
          className="rounded-xl bg-white px-3.5 py-3 text-sm font-medium text-cocoa-700 shadow-sm ring-1 ring-cocoa-600/[0.08] dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10"
        >
          <option value="created_at-desc">Newest first</option>
          <option value="created_at-asc">Oldest first</option>
          <option value="total_amount-desc">Amount: high to low</option>
          <option value="total_amount-asc">Amount: low to high</option>
          <option value="customer_name-asc">Customer name: A–Z</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-soft ring-1 ring-cocoa-600/[0.06] dark:bg-slate-900 dark:ring-white/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-cocoa-600/10 bg-cocoa-600/[0.02] text-[11px] font-bold uppercase tracking-[0.06em] text-cocoa-400 dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-400">
              <th className="px-5 py-3.5">Customer Name</th>
              <th className="px-5 py-3.5">Order ID</th>
              <th className="px-5 py-3.5">Email</th>
              <th className="px-5 py-3.5">Total Amount</th>
              <th className="px-5 py-3.5">Order Status</th>
              <th className="px-5 py-3.5">Payment Status</th>
              <th className="px-5 py-3.5">Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-cocoa-400 dark:text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-cocoa-400 dark:text-slate-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              paged.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelected(order)}
                  className="cursor-pointer border-b border-cocoa-600/5 transition-colors last:border-0 hover:bg-cocoa-600/[0.03] dark:border-white/5 dark:hover:bg-white/5"
                >
                  <td className="px-5 py-4 font-semibold text-cocoa-700 dark:text-slate-100">{order.customer_name}</td>
                  <td className="px-5 py-4 text-cocoa-500 dark:text-slate-300">{order.order_id}</td>
                  <td className="px-5 py-4 text-cocoa-500 dark:text-slate-300">{order.customer_email}</td>
                  <td className="px-5 py-4 font-semibold text-cocoa-700 dark:text-slate-100">₹{order.total_amount}</td>
                  <td className="px-5 py-4">
                    <OrderStatusBadge status={order.order_status} />
                  </td>
                  <td className="px-5 py-4">
                    <PaymentStatusBadge status={order.payment_status} />
                  </td>
                  <td className="px-5 py-4 text-cocoa-400 dark:text-slate-400">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                p === page
                  ? 'bg-cocoa-600 text-cream-100 dark:bg-gold-500 dark:text-cocoa-900'
                  : 'bg-white text-cocoa-500 shadow-sm ring-1 ring-cocoa-600/[0.08] dark:bg-slate-900 dark:text-slate-300 dark:ring-white/10'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <OrderDetailDrawer order={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />
    </div>
  );
}
