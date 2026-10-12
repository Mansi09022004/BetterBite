import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { BiteMockup } from '../illustrations/BiteMockup';
import { useProducts } from '../../context/ProductsContext';

export function SubscriptionTeaser() {
  const { products } = useProducts();
  return (
    <section className="container-page py-14 sm:py-28">
      <div className="relative overflow-hidden rounded-[2rem] bg-cocoa-600 px-5 py-10 sm:rounded-[2.5rem] sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -right-10 -top-10 grid grid-cols-3 gap-4 opacity-20 sm:opacity-30">
          {products.map((p) => (
            <div key={p.id} className="h-16 w-16">
              <BiteMockup theme={p.theme} />
            </div>
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-xl text-center">
          <Reveal>
            <span className="eyebrow bg-cream-100/10 text-gold-500">BetterBite Box</span>
            <h2 className="mt-5 font-display text-3xl font-bold text-cream-100 sm:text-4xl">
              Build Your BetterBite Box
            </h2>
            <p className="mt-4 text-cream-200/80">
              Choose your favourite flavours and create your monthly protein bite box.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-cream-200/90">
            {['Custom flavour mix', 'Delivered monthly', 'Cancel anytime'].map((perk) => (
              <span key={perk} className="flex items-center gap-2 rounded-full bg-cream-100/10 px-4 py-2">
                <Check className="h-3.5 w-3.5 text-gold-500" /> {perk}
              </span>
            ))}
          </Reveal>

          <Reveal delay={0.2} className="mt-9">
            <Link to="/subscribe">
              <button className="btn-gold">Build My Bite Box</button>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
