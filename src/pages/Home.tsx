import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/sections/Hero';
import { ProductGrid } from '../components/sections/ProductGrid';
import { BrandStory } from '../components/sections/BrandStory';
import { NutritionComparison } from '../components/sections/NutritionComparison';
import { Testimonials } from '../components/sections/Testimonials';
import { SubscriptionTeaser } from '../components/sections/SubscriptionTeaser';
import { Sustainability } from '../components/sections/Sustainability';
import { FounderNote } from '../components/sections/FounderNote';
import { InstagramGallery } from '../components/sections/InstagramGallery';
import { FAQ } from '../components/sections/FAQ';
import { Newsletter } from '../components/sections/Newsletter';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>BetterBite — Your 40 Calorie Sweet Escape</title>
        <meta
          name="description"
          content="Mini protein bites at 30-40 calories each. Real dessert flavor, real protein, zero guilt. Shop 5 flavors or subscribe & save."
        />
      </Helmet>
      <Hero />
      <ProductGrid />
      <BrandStory />
      <NutritionComparison />
      <Testimonials />
      <SubscriptionTeaser />
      <Sustainability />
      <FounderNote />
      <InstagramGallery />
      <FAQ />
      <Newsletter />
    </>
  );
}
