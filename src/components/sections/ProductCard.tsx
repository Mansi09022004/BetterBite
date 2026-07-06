import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, Plus } from 'lucide-react';
import type { Product } from '../../data/products';
import { PouchMockup } from '../illustrations/PouchMockup';
import { Badge } from '../ui/Badge';
import { useCart } from '../../context/CartContext';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col rounded-3xl bg-white/70 p-5 shadow-soft ring-1 ring-cocoa-600/[0.05] transition-shadow duration-300 hover:shadow-lift"
    >
      {product.badge && (
        <Badge tone={product.badge === 'New' ? 'berry' : 'gold'} className="absolute left-5 top-5 z-10">
          {product.badge}
        </Badge>
      )}

      <div className="mx-auto h-48 w-36 pt-2">
        <PouchMockup theme={product.theme} showBites />
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="font-display text-lg font-bold text-cocoa-700">{product.name}</h3>
        <p className="mt-1 text-sm text-cocoa-400">{product.tagline}</p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-cocoa-600/[0.05] py-2">
            <span className="flex items-center justify-center gap-1 font-display text-sm font-bold text-cocoa-700">
              <Flame className="h-3 w-3 text-gold-700" /> {product.kcal}
            </span>
            <span className="text-[10px] uppercase text-cocoa-400">kcal</span>
          </div>
          <div className="rounded-xl bg-cocoa-600/[0.05] py-2">
            <span className="font-display text-sm font-bold text-cocoa-700">{product.protein}g</span>
            <span className="block text-[10px] uppercase text-cocoa-400">protein</span>
          </div>
          <div className="rounded-xl bg-cocoa-600/[0.05] py-2">
            <span className="font-display text-sm font-bold text-cocoa-700">{product.sugar}g</span>
            <span className="block text-[10px] uppercase text-cocoa-400">sugar</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold text-cocoa-700">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-cocoa-400 line-through">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ${
              added ? 'bg-gold-500 text-cocoa-800' : 'bg-cocoa-600 text-cream-100 hover:bg-cocoa-700'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
