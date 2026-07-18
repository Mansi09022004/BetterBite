import { Star } from 'lucide-react';
import { testimonials } from '../../data/testimonials';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

export function Testimonials() {
  return (
    <section className="container-page py-14 sm:py-28">
      <SectionHeading
        eyebrow="Customer Reviews"
        title="Built for everyday cravings"
        subtitle="Real feedback from people who added BetterBite to their after-meal routine."
      />

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.id} delay={i * 0.06}>
            <figure className="flex h-full flex-col rounded-3xl bg-white/70 p-6 shadow-soft ring-1 ring-cocoa-600/[0.05]">
              <div className="flex items-center gap-0.5 text-gold-500">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-cocoa-600">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cocoa-600 font-display text-sm font-bold text-gold-500">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-cocoa-700">{t.name}</p>
                  <p className="text-xs text-cocoa-400">{t.role}</p>
                </div>
                {t.tag && (
                  <span className="ml-auto rounded-full bg-gold-100 px-2.5 py-1 text-[10px] font-bold uppercase text-gold-700">
                    {t.tag}
                  </span>
                )}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
