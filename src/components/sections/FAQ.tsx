import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { faqs } from '../../data/faqs';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <section id="faq" className="bg-beige-100/60 py-14 sm:py-28">
      <div className="container-page">
        <SectionHeading eyebrow="Questions" title="Everything you're wondering about" />

        <div className="mx-auto mt-12 flex max-w-2xl flex-col gap-3">
          {faqs.map((faq, i) => {
            const open = openId === faq.id;
            return (
              <Reveal key={faq.id} delay={i * 0.04}>
                <div className="rounded-2xl bg-white/70 shadow-soft ring-1 ring-cocoa-600/[0.05]">
                  <button
                    onClick={() => setOpenId(open ? null : faq.id)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-semibold text-cocoa-700">{faq.question}</span>
                    <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown className="h-5 w-5 shrink-0 text-cocoa-500" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm leading-relaxed text-cocoa-500">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
