import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export function useCountUp(target: number, duration = 1.2, decimals = 0) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();

  return { ref, display };
}
