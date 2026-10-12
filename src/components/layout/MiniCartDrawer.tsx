import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductsContext';
import { PouchMockup } from '../illustrations/PouchMockup';

export function MiniCartDrawer() {
  const { lines, isDrawerOpen, closeDrawer, setQty, subtotal, removeFromCart } = useCart();
  const { findProduct } = useProducts();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-cocoa-800/40 backdrop-blur-sm"
          onClick={closeDrawer}
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="ml-auto flex h-full w-full max-w-md flex-col bg-cream-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-cocoa-600/10 p-5">
              <h3 className="font-display text-lg font-bold text-cocoa-700">Your Bag ({lines.length})</h3>
              <button onClick={closeDrawer} aria-label="Close cart">
                <X className="h-5 w-5 text-cocoa-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <p className="text-cocoa-500">Your bag is empty. Time to fix that.</p>
                  <Link to="/#shop" onClick={closeDrawer}>
                    <button className="btn-primary">Shop Flavors</button>
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {lines.map((line) => {
                    const product = findProduct(line.productId);
                    if (!product) return null;
                    return (
                      <li key={line.productId} className="flex gap-3 rounded-2xl bg-white/60 p-3 shadow-soft">
                        <div className="h-20 w-14 shrink-0">
                          <PouchMockup theme={product.theme} flavor={product.name.replace(/ Bite$/, '')} showBites={false} />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-bold text-cocoa-700">{product.name}</p>
                              <p className="text-xs text-cocoa-400">₹{product.price} each</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(line.productId)}
                              aria-label="Remove item"
                              className="text-cocoa-400 hover:text-berry"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setQty(line.productId, line.qty - 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-cocoa-600/[0.08] hover:bg-cocoa-600/15"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">{line.qty}</span>
                            <button
                              onClick={() => setQty(line.productId, line.qty + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-cocoa-600/[0.08] hover:bg-cocoa-600/15"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-cocoa-600/10 p-5">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-cocoa-500">Subtotal</span>
                  <span className="font-display text-lg font-bold text-cocoa-700">₹{Math.round(subtotal)}</span>
                </div>
                <Link to="/cart" onClick={closeDrawer}>
                  <button className="btn-primary w-full">View Bag & Checkout</button>
                </Link>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
