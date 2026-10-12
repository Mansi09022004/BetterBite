import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { listAdminProducts, updateProduct, type AdminProduct } from '../../services/admin/products';

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAdminProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const handlePriceChange = async (id: string, value: string) => {
    const price = Number(value);
    if (!Number.isFinite(price) || price <= 0) return;
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, price } : p)));
    await updateProduct(id, { price });
  };

  const handleStockChange = async (id: string, value: string) => {
    const stock = Number(value);
    if (!Number.isFinite(stock) || stock < 0) return;
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock } : p)));
    await updateProduct(id, { stock });
  };

  const handleToggleActive = async (product: AdminProduct) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, active: !p.active } : p)));
    await updateProduct(product.id, { active: !product.active });
  };

  return (
    <div>
      <Helmet>
        <title>Products — BetterBite Admin</title>
      </Helmet>
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-cocoa-700 dark:text-slate-100">
        Products
      </h1>
      <p className="mt-2 text-[15px] text-cocoa-400 dark:text-slate-400">
        Changes here reach the live storefront immediately.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-soft ring-1 ring-cocoa-600/[0.06] dark:bg-slate-900 dark:ring-white/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-cocoa-600/10 bg-cocoa-600/[0.02] text-[11px] font-bold uppercase tracking-[0.06em] text-cocoa-400 dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-400">
              <th className="px-5 py-3.5">Product</th>
              <th className="px-5 py-3.5">Price (₹)</th>
              <th className="px-5 py-3.5">Stock</th>
              <th className="px-5 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-cocoa-400 dark:text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-cocoa-600/5 transition-colors last:border-0 hover:bg-cocoa-600/[0.03] dark:border-white/5 dark:hover:bg-white/5"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-cocoa-700 dark:text-slate-100">{p.name}</p>
                    <p className="mt-0.5 text-xs text-cocoa-400 dark:text-slate-400">{p.tagline}</p>
                  </td>
                  <td className="px-5 py-4">
                    <input
                      type="number"
                      min={1}
                      defaultValue={p.price}
                      onBlur={(e) => handlePriceChange(p.id, e.target.value)}
                      className="input-field w-24 !py-1.5"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <input
                      type="number"
                      min={0}
                      defaultValue={p.stock}
                      onBlur={(e) => handleStockChange(p.id, e.target.value)}
                      className="input-field w-24 !py-1.5"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleActive(p)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                        p.active
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : 'bg-cocoa-600/[0.08] text-cocoa-400 dark:bg-white/5 dark:text-slate-400'
                      }`}
                    >
                      {p.active ? 'Active' : 'Disabled'}
                    </button>
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
