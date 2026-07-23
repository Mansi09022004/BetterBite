import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { subscriptionPlans } from '../data/subscriptionPlans';
import { BiteMockup } from '../components/illustrations/BiteMockup';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal } from '../components/ui/Reveal';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

export default function Subscription() {
  const [searchParams] = useSearchParams();
  const requestedPlan = searchParams.get('plan');
  const defaultPlan = subscriptionPlans.find((p) => p.id === requestedPlan) ?? subscriptionPlans[1];
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan.id);
  const { products } = useProducts();
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([products[0].id]);
  const { addToCart, openDrawer } = useCart();

  const plan = subscriptionPlans.find((p) => p.id === selectedPlan)!;
  const maxFlavors = plan.id === 'starter' ? 1 : plan.id === 'main' ? 3 : 5;

  const savings = useMemo(() => plan.compareAtPrice - plan.pricePerBox, [plan]);

  const toggleFlavor = (id: string) => {
    setSelectedFlavors((prev) => {
      if (prev.includes(id)) return prev.filter((f) => f !== id);
      if (prev.length >= maxFlavors) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const handleAdd = () => {
    const theme = products.find((p) => p.id === selectedFlavors[0])?.theme ?? 'chocolate';
    addToCart(`sub__${plan.id}__${theme}`, 1);
    openDrawer();
  };

  return (
    <div className="min-h-[70vh] py-14 sm:py-20">
      <Helmet>
        <title>Build Your BetterBite Box — BetterBite</title>
        <meta name="description" content="Choose your favourite flavours and create your BetterBite box. Trial packs, one-time boxes, and a monthly subscription — cancel anytime." />
      </Helmet>

      <div className="container-page">
        <SectionHeading
          eyebrow="BetterBite Box"
          title="Build Your BetterBite Box"
          subtitle="Choose your favourite flavours and create your protein bite box. Cancel anytime."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {subscriptionPlans.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <button
                onClick={() => setSelectedPlan(p.id)}
                className={`relative flex h-full w-full flex-col rounded-3xl p-6 text-left transition-all duration-300 ${
                  selectedPlan === p.id
                    ? 'bg-cocoa-600 text-cream-100 shadow-lift ring-2 ring-gold-500'
                    : 'bg-white/70 text-cocoa-700 shadow-soft ring-1 ring-cocoa-600/[0.05] hover:shadow-lift'
                }`}
              >
                {p.best && (
                  <span className="absolute -top-3 right-6 flex items-center gap-1 rounded-full bg-gold-500 px-3 py-1 text-[11px] font-bold uppercase text-cocoa-800">
                    <Sparkles className="h-3 w-3" /> Most Popular
                  </span>
                )}
                <h3 className="font-display text-xl font-bold">{p.name}</h3>
                <p className={`mt-1 text-sm ${selectedPlan === p.id ? 'text-cream-200/80' : 'text-cocoa-400'}`}>
                  {p.bitesPerBox} bites · {p.frequency}
                </p>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-extrabold">₹{p.pricePerBox}</span>
                  {p.compareAtPrice > p.pricePerBox && (
                    <span className={`text-sm line-through ${selectedPlan === p.id ? 'text-cream-200/60' : 'text-cocoa-400'}`}>
                      ₹{p.compareAtPrice}
                    </span>
                  )}
                </div>

                <ul className="mt-5 flex flex-col gap-2 text-sm">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2">
                      <Check className={`h-4 w-4 shrink-0 ${selectedPlan === p.id ? 'text-gold-500' : 'text-gold-700'}`} />
                      {perk}
                    </li>
                  ))}
                </ul>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mx-auto mt-14 max-w-3xl rounded-3xl bg-white/70 p-6 shadow-soft ring-1 ring-cocoa-600/[0.05] sm:p-8">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-cocoa-700">
              Pick your flavours <span className="text-cocoa-400">({selectedFlavors.length}/{maxFlavors})</span>
            </h3>
            {savings > 0 && (
              <span className="rounded-full bg-gold-100 px-3 py-1 text-xs font-bold text-gold-700">
                You save ₹{savings}
              </span>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {products.map((p) => {
              const selected = selectedFlavors.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggleFlavor(p.id)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-colors ${
                    selected ? 'border-gold-500 bg-gold-100/40' : 'border-transparent bg-cocoa-600/[0.04] hover:bg-cocoa-600/[0.07]'
                  }`}
                >
                  <div className="h-14 w-14">
                    <BiteMockup theme={p.theme} />
                  </div>
                  <span className="text-center text-xs font-semibold text-cocoa-700">{p.name}</span>
                  {selected && <Check className="h-4 w-4 text-gold-700" />}
                </button>
              );
            })}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAdd}
            className="btn-primary mt-8 w-full"
          >
            Add {plan.name} to Bag — ₹{plan.pricePerBox}
          </motion.button>
        </Reveal>
      </div>
    </div>
  );
}
