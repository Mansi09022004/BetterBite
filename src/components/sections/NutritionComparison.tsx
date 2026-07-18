import { motion } from 'framer-motion';
import { comparisonColumns, comparisonRows } from '../../data/nutritionComparison';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

export function NutritionComparison() {
  return (
    <section className="bg-beige-100/60 py-14 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="The Numbers"
          title="Same craving, smarter portion."
          subtitle="Here's how one BetterBite stacks up against a normal chocolate bar and a standard protein bar."
        />

        <div className="mt-14 flex flex-wrap justify-center gap-3">
          {comparisonColumns.map((col) => (
            <span
              key={col.key}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-soft"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: col.accent }} />
              {col.label}
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-10">
          {comparisonRows.map((row, rowIndex) => (
            <Reveal key={row.label} delay={rowIndex * 0.05}>
              <p className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-cocoa-500">
                {row.label} <span className="text-cocoa-300">({row.unit})</span>
              </p>
              <div className="flex flex-col gap-3">
                {comparisonColumns.map((col) => {
                  const value = row[col.key];
                  const pct = Math.max(4, (value / row.max) * 100);
                  return (
                    <div key={col.key} className="flex items-center gap-4">
                      <span className="w-20 shrink-0 text-[11px] font-medium text-cocoa-400 sm:w-40 sm:text-sm">
                        {col.label}
                      </span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-cocoa-600/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: col.accent }}
                        />
                      </div>
                      <span className="w-14 shrink-0 text-right font-display text-sm font-bold text-cocoa-700">
                        {value}{row.unit === 'kcal' ? '' : row.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
