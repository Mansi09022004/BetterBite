import { Reveal } from '../ui/Reveal';

export function FounderNote() {
  return (
    <section className="container-page py-20 sm:py-28">
      <Reveal className="mx-auto max-w-3xl rounded-3xl bg-white/70 p-8 shadow-soft ring-1 ring-cocoa-600/[0.05] sm:p-12">
        <span className="eyebrow">A Note From The Founder</span>
        <p className="mt-6 font-display text-2xl font-medium leading-snug text-cocoa-700 sm:text-3xl">
          "I built BetterBite because I was tired of choosing between hitting my goals and
          having something sweet after dinner. This isn't a smaller protein bar — it's a
          completely different category, sized for the craving it's actually solving."
        </p>
        <div className="mt-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cocoa-600 font-display text-lg font-bold text-gold-500">
            S
          </div>
          <div>
            <p className="font-semibold text-cocoa-700">Sam, Founder</p>
            <p className="text-sm text-cocoa-400">BetterBite HQ</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
