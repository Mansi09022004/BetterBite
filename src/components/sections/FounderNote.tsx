import { Reveal } from '../ui/Reveal';

export function FounderNote() {
  return (
    <section className="container-page py-14 sm:py-28">
      <Reveal className="mx-auto max-w-3xl rounded-3xl bg-white/70 p-6 shadow-soft ring-1 ring-cocoa-600/[0.05] sm:p-12">
        <span className="eyebrow">A Note From The Founder</span>
        <p className="mt-6 font-display text-xl font-medium leading-snug text-cocoa-700 sm:text-3xl">
          "I created BetterBite from a simple craving — wanting something sweet after meals
          without eating an entire protein bar. I wanted a bite-sized dessert that fits your
          goals, not fights them."
        </p>
        <div className="mt-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cocoa-600 font-display text-lg font-bold text-gold-500">
            M
          </div>
          <div>
            <p className="font-semibold text-cocoa-700">Mansi Gangji</p>
            <p className="text-sm text-cocoa-400">Founder, BetterBite</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
