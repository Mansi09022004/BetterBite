import { Leaf, Recycle, Package } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

const points = [
  {
    icon: Recycle,
    title: 'Recyclable pouches',
    body: 'Our stand-up pouches use a mono-material film designed for standard curbside recycling streams.',
  },
  {
    icon: Package,
    title: 'FSC-certified boxes',
    body: 'Every shipping box is FSC-certified cardboard, printed with soy-based inks, and sized to cut empty air.',
  },
  {
    icon: Leaf,
    title: 'Responsibly sourced cocoa',
    body: 'We source cocoa through certified sustainable co-ops that pay farmers fairly above market rate.',
  },
];

export function Sustainability() {
  return (
    <section id="sustainability" className="bg-beige-100/60 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Packaging With Purpose"
          title="Good for your goals, easier on the planet"
          subtitle="Premium doesn't have to mean wasteful. Here's how we keep our footprint small."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {points.map((point, i) => (
            <Reveal key={point.title} delay={i * 0.08}>
              <div className="flex h-full flex-col items-center gap-4 rounded-3xl bg-white/70 p-8 text-center shadow-soft ring-1 ring-cocoa-600/[0.05]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cocoa-600/[0.08]">
                  <point.icon className="h-6 w-6 text-cocoa-600" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-bold text-cocoa-700">{point.title}</h3>
                <p className="text-sm leading-relaxed text-cocoa-500">{point.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
