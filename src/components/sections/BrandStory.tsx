import { Reveal } from '../ui/Reveal';
import { BiteMockup } from '../illustrations/BiteMockup';
import { ChocolateDrip } from '../illustrations/ChocolateDrip';

export function BrandStory() {
  return (
    <section id="story" className="relative overflow-hidden bg-cocoa-700 py-24 text-cream-100 sm:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute left-10 top-16 h-24 w-24 animate-float opacity-40">
          <BiteMockup theme="chocolate" />
        </div>
        <div className="absolute bottom-16 right-14 h-20 w-20 animate-floatSlow opacity-40">
          <BiteMockup theme="coffee" />
        </div>
      </div>

      <div className="container-page relative z-10 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal>
          <span className="eyebrow bg-cream-100/10 text-gold-500">The Origin</span>
          <h2 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            It started with one craving, after dinner, that a protein bar couldn't fix.
          </h2>
        </Reveal>

        <Reveal delay={0.15} className="space-y-5 text-lg leading-relaxed text-cream-200/80">
          <p>
            The idea started from a simple moment — wanting something sweet after a meal
            without eating an entire protein bar. Every option felt like overkill: 200
            calories, a brick-sized bar, more than what the craving actually asked for.
          </p>
          <p>
            So we went the other way. We stripped a protein bar down to the one bite that
            actually satisfies the craving — rich chocolate, real protein, gone in under a
            minute — and left everything else out.
          </p>
          <p className="font-display text-xl font-semibold text-gold-500">
            The result: the perfect mini bite. Dessert-level satisfaction, 30-40 calories,
            zero guilt.
          </p>
        </Reveal>
      </div>

      <div className="absolute bottom-0 left-0 w-full text-cream-100">
        <ChocolateDrip className="h-8 w-full" />
      </div>
    </section>
  );
}
