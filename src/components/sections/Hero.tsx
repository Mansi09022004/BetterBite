import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { PouchMockup } from '../illustrations/PouchMockup';
import { BlobBackground } from '../illustrations/BlobBackground';
import { StatPill } from '../ui/StatPill';
import { useCountUp } from '../../hooks/useCountUp';

export function Hero() {
  const { ref, display } = useCountUp(50, 1.4);

  return (
    <section className="relative overflow-hidden pb-14 pt-8 sm:pb-20 sm:pt-16">
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
            50 Calories · 5g Protein
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
            lunch or dinner when you want something sweet — without eating an entire
            protein bar.
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
            <Link to="/subscribe?plan=starter">
              <button className="btn-secondary">Try Starter Pack</button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 grid max-w-md grid-cols-3 gap-3"
          >
            <StatPill label="Calories" value="50" />
            <StatPill label="Protein" value="5g" />
            <StatPill label="Added Sugar" value="0g" />
          </motion.div>
        </div>

        <div className="relative z-10 flex justify-center">
          <div className="relative flex flex-col items-center">
            {/* one shared soft ground shadow beneath the whole lineup */}
            <div className="absolute bottom-1 left-1/2 h-4 w-52 -translate-x-1/2 rounded-full bg-cocoa-900/20 blur-md sm:h-5 sm:w-64 lg:h-6 lg:w-72" />

            {/* back row: two flavors, spread wide */}
            <div className="flex items-end justify-center gap-5 sm:gap-9 lg:gap-11">
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="w-16 sm:w-28 lg:w-32"
              >
                <div className="rotate-[-4deg]">
                  <PouchMockup theme="cookies" flavor="Cookies & Cream" showBites={false} />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="w-16 sm:w-28 lg:w-32"
              >
                <div className="rotate-[4deg]">
                  <PouchMockup theme="strawberry" flavor="Strawberry Cheesecake" showBites={false} />
                </div>
              </motion.div>
            </div>

            {/* front row: three flavors side by side, Chocolate Fudge only slightly bigger */}
            <div className="-mt-4 flex items-end justify-center -space-x-2 sm:-mt-6 sm:-space-x-4 lg:-mt-7">
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
                className="w-20 sm:w-32 lg:w-36"
              >
                <div className="rotate-[-3deg]">
                  <PouchMockup theme="peanut" flavor="Peanut Butter Crunch" showBites={false} />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-24 sm:w-36 lg:w-40"
              >
                <div className="animate-float">
                  <PouchMockup theme="chocolate" flavor="Chocolate Fudge" showBites={false} />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
                className="w-20 sm:w-32 lg:w-36"
              >
                <div className="rotate-[3deg]">
                  <PouchMockup theme="coffee" flavor="Coffee Caramel" showBites={false} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
