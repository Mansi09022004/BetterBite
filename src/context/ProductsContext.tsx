import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { products as staticProducts, type Product } from '../data/products';
import { subscriptionPlans } from '../data/subscriptionPlans';

interface ProductsContextValue {
  products: Product[];
  findProduct: (id: string) => Product | undefined;
  loading: boolean;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

interface DbProductRow {
  id: string;
  name: string;
  tagline: string;
  theme: Product['theme'];
  kcal: number;
  protein: number;
  sugar: number;
  price: number;
  compare_at_price: number | null;
  badge: string | null;
  description: string;
}

function mapRow(row: DbProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    theme: row.theme,
    kcal: row.kcal,
    protein: row.protein,
    sugar: row.sugar,
    price: row.price,
    compareAtPrice: row.compare_at_price ?? undefined,
    badge: row.badge ?? undefined,
    description: row.description,
  };
}

function resolveProduct(id: string, list: Product[]): Product | undefined {
  const direct = list.find((p) => p.id === id);
  if (direct) return direct;

  if (id.startsWith('sub__')) {
    const [, planId, theme] = id.split('__');
    const plan = subscriptionPlans.find((p) => p.id === planId);
    if (!plan) return undefined;
    return {
      id,
      name: `${plan.name} (${plan.bitesPerBox} Bites)`,
      tagline: `${plan.bitesPerBox} bites · ${plan.frequency}`,
      theme: (theme as Product['theme']) ?? 'chocolate',
      kcal: 50,
      protein: 5,
      sugar: 0,
      price: plan.pricePerBox,
      compareAtPrice: plan.compareAtPrice,
      description: plan.perks.join(' · '),
    };
  }

  return undefined;
}

// Seeds with the same static data the site always used, so first paint is
// byte-for-byte identical to before — then silently swaps in the live
// Supabase result once it resolves, so admin edits reach the storefront
// without ever showing a loading state.
export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from('products')
      .select('id, name, tagline, theme, kcal, protein, sugar, price, compare_at_price, badge, description')
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data && data.length > 0) {
          setProducts((data as DbProductRow[]).map(mapRow));
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value: ProductsContextValue = {
    products,
    findProduct: (id) => resolveProduct(id, products),
    loading,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
