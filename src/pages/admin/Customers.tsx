import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { listAdminCustomers, type AdminCustomer } from '../../services/admin/customers';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAdminCustomers()
      .then(setCustomers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Helmet>
        <title>Customers — BetterBite Admin</title>
      </Helmet>
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-cocoa-700 dark:text-slate-100">
        Customers
      </h1>

      <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-soft ring-1 ring-cocoa-600/[0.06] dark:bg-slate-900 dark:ring-white/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-cocoa-600/10 bg-cocoa-600/[0.02] text-[11px] font-bold uppercase tracking-[0.06em] text-cocoa-400 dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-400">
              <th className="px-5 py-3.5">Customer Name</th>
              <th className="px-5 py-3.5">Email</th>
              <th className="px-5 py-3.5">Orders</th>
              <th className="px-5 py-3.5">Lifetime Spend</th>
              <th className="px-5 py-3.5">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-cocoa-400 dark:text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-cocoa-400 dark:text-slate-400">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr
                  key={c.customer_email}
                  className="border-b border-cocoa-600/5 transition-colors last:border-0 hover:bg-cocoa-600/[0.03] dark:border-white/5 dark:hover:bg-white/5"
                >
                  <td className="px-5 py-4 font-semibold text-cocoa-700 dark:text-slate-100">{c.customer_name}</td>
                  <td className="px-5 py-4 text-cocoa-500 dark:text-slate-300">{c.customer_email}</td>
                  <td className="px-5 py-4 text-cocoa-500 dark:text-slate-300">{c.order_count}</td>
                  <td className="px-5 py-4 font-semibold text-cocoa-700 dark:text-slate-100">₹{c.lifetime_spend}</td>
                  <td className="px-5 py-4 text-cocoa-400 dark:text-slate-400">
                    {new Date(c.last_order_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
