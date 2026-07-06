import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { findProduct } from '../data/products';
import { coupons } from '../data/subscriptionPlans';

export interface CartLine {
  productId: string;
  qty: number;
}

interface CartState {
  lines: CartLine[];
}

type CartAction =
  | { type: 'ADD'; productId: string; qty?: number }
  | { type: 'REMOVE'; productId: string }
  | { type: 'SET_QTY'; productId: string; qty: number }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; lines: CartLine[] };

const STORAGE_KEY = 'betterbite-cart-v1';

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { lines: action.lines };
    case 'ADD': {
      const existing = state.lines.find((l) => l.productId === action.productId);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.productId === action.productId ? { ...l, qty: l.qty + (action.qty ?? 1) } : l
          ),
        };
      }
      return { lines: [...state.lines, { productId: action.productId, qty: action.qty ?? 1 }] };
    }
    case 'REMOVE':
      return { lines: state.lines.filter((l) => l.productId !== action.productId) };
    case 'SET_QTY':
      if (action.qty <= 0) {
        return { lines: state.lines.filter((l) => l.productId !== action.productId) };
      }
      return {
        lines: state.lines.map((l) => (l.productId === action.productId ? { ...l, qty: action.qty } : l)),
      };
    case 'CLEAR':
      return { lines: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
  couponError: string | null;
  isDrawerOpen: boolean;
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { lines: CartLine[]; couponCode: string | null };
        dispatch({ type: 'HYDRATE', lines: parsed.lines ?? [] });
        if (parsed.couponCode) setCouponCode(parsed.couponCode);
      }
    } catch {
      // ignore corrupt storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines: state.lines, couponCode }));
  }, [state.lines, couponCode]);

  const subtotal = useMemo(
    () =>
      state.lines.reduce((sum, line) => {
        const product = findProduct(line.productId);
        return sum + (product ? product.price * line.qty : 0);
      }, 0),
    [state.lines]
  );

  const itemCount = useMemo(() => state.lines.reduce((n, l) => n + l.qty, 0), [state.lines]);

  const discount = useMemo(() => {
    if (!couponCode) return 0;
    const rate = coupons[couponCode];
    return rate ? subtotal * rate : 0;
  }, [couponCode, subtotal]);

  const total = Math.max(0, subtotal - discount);

  const value: CartContextValue = {
    lines: state.lines,
    itemCount,
    subtotal,
    discount,
    total,
    couponCode,
    couponError,
    isDrawerOpen,
    addToCart: (productId, qty = 1) => {
      dispatch({ type: 'ADD', productId, qty });
      setDrawerOpen(true);
    },
    removeFromCart: (productId) => dispatch({ type: 'REMOVE', productId }),
    setQty: (productId, qty) => dispatch({ type: 'SET_QTY', productId, qty }),
    clearCart: () => {
      dispatch({ type: 'CLEAR' });
      setCouponCode(null);
    },
    applyCoupon: (code) => {
      const normalized = code.trim().toUpperCase();
      if (coupons[normalized]) {
        setCouponCode(normalized);
        setCouponError(null);
      } else {
        setCouponError('That code doesn’t look right. Try BETTER10, SWEET15, or FIRSTBITE.');
      }
    },
    removeCoupon: () => {
      setCouponCode(null);
      setCouponError(null);
    },
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
