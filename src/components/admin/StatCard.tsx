import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    let raf: number;
    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const progress = Math.min(1, (ts - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

export function StatCard({
  label,
  value,
  format,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: number;
  format?: (n: number) => string;
  icon: LucideIcon;
  delay?: number;
}) {
  const animated = useCountUp(value);
  const rounded = Math.round(animated);
  const display = format ? format(rounded) : rounded.toLocaleString('en-IN');

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-cocoa-600/[0.06] transition-shadow duration-200 hover:shadow-lift dark:bg-slate-900 dark:ring-white/10"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-cocoa-400 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2.5 font-display text-4xl font-extrabold tracking-tight text-cocoa-700 dark:text-slate-100">
            {display}
          </p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-700 dark:bg-gold-500/10 dark:text-gold-400">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
      </div>
    </motion.div>
  );
}
