import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { PouchMockup } from '../illustrations/PouchMockup';
import { BiteMockup } from '../illustrations/BiteMockup';
import { BlobBackground } from '../illustrations/BlobBackground';
import { StatPill } from '../ui/StatPill';
import { useCountUp } from '../../hooks/useCountUp';

export function Hero() {
  const { ref, display } = useCountUp(40, 1.4);

  return (
    <section className="relative overflow-hidden pb-20 pt-10 sm:pt-16">
      <BlobBackground variant="gold" className="-left-40 -top-32 h-[520px] w-[520px]" />
      <BlobBackground variant="beige" className="-right-32 top-40 h-[420px] w-[420px]" />

      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <div className="relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold-700" />
            30-40 Calories · Real Protein
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-cocoa-700 sm:text-5xl lg:text-6xl"
          >
            Your{' '}
            <span ref={ref as never} className="relative inline-block text-gold-700">
              {display}
            </span>{' '}
            Calorie
            <br /> Sweet Escape
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-cocoa-500"
          >
            Protein. Pleasure. No guilt. Mini protein bites made for the moment after
            lunch or dinner when you want something sweet — without wrecking your goals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a href="#shop">
              <button className="btn-primary">Shop Now</button>
            </a>
            <Link to="/subscribe">
              <button className="btn-secondary">Try Starter Pack</button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 grid max-w-md grid-cols-3 gap-3"
          >
            <StatPill label="Calories" value="30-40" />
            <StatPill label="Protein" value="4-5g" />
            <StatPill label="Added Sugar" value="~1g" />
          </motion.div>
        </div>

        <div className="relative z-10 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-56 sm:w-64 lg:w-72"
          >
            <div className="animate-float">
              <PouchMockup theme="chocolate" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="absolute -left-6 top-6 h-20 w-20 animate-floatSlow sm:h-24 sm:w-24"
          >
            <BiteMockup theme="strawberry" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="absolute -right-2 bottom-10 h-16 w-16 animate-float sm:h-20 sm:w-20"
          >
            <BiteMockup theme="peanut" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
