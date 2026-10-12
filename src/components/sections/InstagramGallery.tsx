import { Instagram } from 'lucide-react';
import { themeColors } from '../../data/products';
import { useProducts } from '../../context/ProductsContext';
import { BiteMockup } from '../illustrations/BiteMockup';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

export function InstagramGallery() {
  const { products } = useProducts();
  const gallery = [...products, ...products.slice(0, 3)];
  return (
    <section className="container-page py-14 sm:py-28">
      <SectionHeading eyebrow="@betterbite" title="Join the community" subtitle="Tag us in your sweet-escape moments for a chance to be featured." />

      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {gallery.map((p, i) => {
          const c = themeColors[p.theme];
          return (
            <Reveal key={`${p.id}-${i}`} delay={i * 0.04}>
              <div
                className="group relative aspect-square overflow-hidden rounded-2xl"
                style={{ background: `linear-gradient(135deg, ${c.light}, ${c.dark})` }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-6 transition-transform duration-500 group-hover:scale-110">
                  <BiteMockup theme={p.theme} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-cocoa-800/0 opacity-0 transition-all duration-300 group-hover:bg-cocoa-800/40 group-hover:opacity-100">
                  <Instagram className="h-6 w-6 text-cream-100" />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
