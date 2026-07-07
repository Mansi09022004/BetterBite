import { products } from '../../data/products';
import { SectionHeading } from '../ui/SectionHeading';
import { ProductCard } from './ProductCard';

export function ProductGrid() {
  return (
    <section id="shop" className="container-page py-20 sm:py-28">
      <SectionHeading
        eyebrow="Five Flavors"
        title="Pick your sweet escape"
        subtitle="Every flavor is built the same way: real cocoa, real protein, 50 calories. Mix and match your box."
      />

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
