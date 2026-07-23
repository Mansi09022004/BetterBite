import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { coupons as staticCoupons } from '../data/subscriptionPlans';

export interface StoreSettings {
  businessName: string;
  supportEmail: string;
  shippingCharge: number;
  freeShippingThreshold: number;
}

const DEFAULT_SETTINGS: StoreSettings = {
  businessName: 'BetterBite',
  supportEmail: 'support@betterbite.in',
  shippingCharge: 49,
  freeShippingThreshold: 499,
};

interface StoreConfigContextValue {
  coupons: Record<string, number>;
  settings: StoreSettings;
  loading: boolean;
}

const StoreConfigContext = createContext<StoreConfigContextValue | null>(null);

// Same seed-then-swap pattern as ProductsProvider: first paint uses the
// existing static coupon map + hardcoded shipping numbers (identical to
// before), then silently swaps in live Supabase values once loaded.
export function StoreConfigProvider({ children }: { children: ReactNode }) {
  const [coupons, setCoupons] = useState<Record<string, number>>(staticCoupons);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      supabase.from('coupons').select('code, discount_percent').eq('active', true),
      supabase
        .from('settings')
        .select('business_name, support_email, shipping_charge, free_shipping_threshold')
        .eq('id', 1)
        .single(),
    ]).then(([couponsRes, settingsRes]) => {
      if (cancelled) return;

      if (!couponsRes.error && couponsRes.data) {
        const map: Record<string, number> = {};
        for (const row of couponsRes.data) {
          map[row.code] = row.discount_percent / 100;
        }
        if (Object.keys(map).length > 0) setCoupons(map);
      }

      if (!settingsRes.error && settingsRes.data) {
        setSettings({
          businessName: settingsRes.data.business_name,
          supportEmail: settingsRes.data.support_email,
          shippingCharge: settingsRes.data.shipping_charge,
          freeShippingThreshold: settingsRes.data.free_shipping_threshold,
        });
      }

      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <StoreConfigContext.Provider value={{ coupons, settings, loading }}>{children}</StoreConfigContext.Provider>
  );
}

export function useStoreConfig() {
  const ctx = useContext(StoreConfigContext);
  if (!ctx) throw new Error('useStoreConfig must be used within StoreConfigProvider');
  return ctx;
}
