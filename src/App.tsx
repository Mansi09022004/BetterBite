import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PromoBar } from './components/layout/PromoBar';
import { MiniCartDrawer } from './components/layout/MiniCartDrawer';
import Home from './pages/Home';

const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Subscription = lazy(() => import('./pages/Subscription'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <CartProvider>
        <PromoBar />
        <Navbar />
        <ScrollManager />
        <main>
          <Suspense fallback={<div className="py-32 text-center text-cocoa-400">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/subscribe" element={<Subscription />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <MiniCartDrawer />
      </CartProvider>
    </HelmetProvider>
  );
}
