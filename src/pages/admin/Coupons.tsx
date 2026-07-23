import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2 } from 'lucide-react';
import { listCoupons, createCoupon, updateCoupon, deleteCoupon, type Coupon } from '../../services/admin/coupons';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('10');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    listCoupons()
      .then(setCoupons)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async () => {
    if (!newCode.trim() || !newDiscount) return;
    setSaving(true);
    setError(null);
    const { error } = await createCoupon({ code: newCode, discount_percent: Number(newDiscount) });
    setSaving(false);
    if (error) {
      setError(error);
      return;
    }
    setNewCode('');
    setNewDiscount('10');
    load();
  };

  const handleToggleActive = async (coupon: Coupon) => {
    setCoupons((prev) => prev.map((c) => (c.code === coupon.code ? { ...c, active: !c.active } : c)));
    await updateCoupon(coupon.code, { active: !coupon.active });
  };

  const handleDiscountChange = async (code: string, value: string) => {
    const discount = Number(value);
    if (!Number.isFinite(discount)) return;
    setCoupons((prev) => prev.map((c) => (c.code === code ? { ...c, discount_percent: discount } : c)));
    await updateCoupon(code, { discount_percent: discount });
  };

  const handleDelete = async (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    await deleteCoupon(code);
  };

  return (
    <div>
      <Helmet>
        <title>Coupons — BetterBite Admin</title>
      </Helmet>
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-cocoa-700 dark:text-slate-100">
        Coupons
      </h1>

      <div className="mt-8 flex flex-wrap items-end gap-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-cocoa-600/[0.06] dark:bg-slate-900 dark:ring-white/10">
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.06em] text-cocoa-400 dark:text-slate-400">
            Coupon Code
          </label>
          <input
            value={newCode}
            onChange={(e) => setNewCode(e.target.value.toUpperCase())}
            placeholder="SUMMER20"
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.06em] text-cocoa-400 dark:text-slate-400">
            Discount %
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={newDiscount}
            onChange={(e) => setNewDiscount(e.target.value)}
            className="input-field w-28"
          />
        </div>
        <button onClick={handleCreate} disabled={saving} className="btn-primary !py-2.5 text-sm">
          <Plus className="h-4 w-4" /> Create Coupon
        </button>
        {error && <p className="text-sm text-berry">{error}</p>}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-soft ring-1 ring-cocoa-600/[0.06] dark:bg-slate-900 dark:ring-white/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-cocoa-600/10 bg-cocoa-600/[0.02] text-[11px] font-bold uppercase tracking-[0.06em] text-cocoa-400 dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-400">
              <th className="px-5 py-3.5">Code</th>
              <th className="px-5 py-3.5">Discount %</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-cocoa-400 dark:text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-cocoa-400 dark:text-slate-400">
                  No coupons yet.
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr
                  key={c.code}
                  className="border-b border-cocoa-600/5 transition-colors last:border-0 hover:bg-cocoa-600/[0.03] dark:border-white/5 dark:hover:bg-white/5"
                >
                  <td className="px-5 py-4 font-semibold text-cocoa-700 dark:text-slate-100">{c.code}</td>
                  <td className="px-5 py-4">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      defaultValue={c.discount_percent}
                      onBlur={(e) => handleDiscountChange(c.code, e.target.value)}
                      className="input-field w-20 !py-1.5"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleActive(c)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                        c.active
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : 'bg-cocoa-600/[0.08] text-cocoa-400 dark:bg-white/5 dark:text-slate-400'
                      }`}
                    >
                      {c.active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleDelete(c.code)}
                      aria-label="Delete coupon"
                      className="text-cocoa-400 transition-colors hover:text-berry"
                    >
                      <Trash2 className="h-4 w-4" />
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
