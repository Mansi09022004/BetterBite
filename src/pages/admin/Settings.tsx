import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getAdminSettings, updateAdminSettings, type AdminSettings } from '../../services/admin/settings';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAdminSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    await updateAdminSettings(settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading || !settings) {
    return <p className="text-cocoa-400 dark:text-slate-400">Loading...</p>;
  }

  return (
    <div>
      <Helmet>
        <title>Settings — BetterBite Admin</title>
      </Helmet>
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-cocoa-700 dark:text-slate-100">
        Settings
      </h1>

      <div className="mt-8 max-w-xl space-y-6 rounded-2xl bg-white p-7 shadow-soft ring-1 ring-cocoa-600/[0.06] dark:bg-slate-900 dark:ring-white/10">
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.06em] text-cocoa-400 dark:text-slate-400">
            Business Name
          </label>
          <input
            value={settings.business_name}
            onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.06em] text-cocoa-400 dark:text-slate-400">
            Support Email
          </label>
          <input
            type="email"
            value={settings.support_email}
            onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
            className="input-field w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.06em] text-cocoa-400 dark:text-slate-400">
              Shipping Charge (₹)
            </label>
            <input
              type="number"
              min={0}
              value={settings.shipping_charge}
              onChange={(e) => setSettings({ ...settings, shipping_charge: Number(e.target.value) })}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.06em] text-cocoa-400 dark:text-slate-400">
              Free Shipping Above (₹)
            </label>
            <input
              type="number"
              min={0}
              value={settings.free_shipping_threshold}
              onChange={(e) => setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })}
              className="input-field w-full"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.06em] text-cocoa-400 dark:text-slate-400">
            Tax Percent
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={settings.tax_percent}
            onChange={(e) => setSettings({ ...settings, tax_percent: Number(e.target.value) })}
            className="input-field w-32"
          />
          <p className="mt-1.5 text-xs text-cocoa-400 dark:text-slate-400">
            Stored for record-keeping — not yet applied to checkout totals.
          </p>
        </div>

        <div className="flex items-center gap-3 border-t border-cocoa-600/10 pt-6 dark:border-white/10">
          <button onClick={handleSave} disabled={saving} className="btn-primary !py-2.5 text-sm">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          {saved && <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Saved</span>}
        </div>
      </div>
    </div>
  );
}
