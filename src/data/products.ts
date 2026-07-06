import { subscriptionPlans } from './subscriptionPlans';

export type FlavorTheme = 'chocolate' | 'cookies' | 'peanut' | 'coffee' | 'strawberry';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  theme: FlavorTheme;
  kcal: number;
  protein: number;
  sugar: number;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  description: string;
}

export const products: Product[] = [
  {
    id: 'chocolate-fudge',
    name: 'Chocolate Fudge Bite',
    tagline: 'Rich, dark, unapologetically fudgy',
    theme: 'chocolate',
    kcal: 35,
    protein: 4,
    sugar: 1,
    price: 2.49,
    compareAtPrice: 2.99,
    badge: 'Bestseller',
    description:
      'A dense, melt-in-your-mouth fudge core dipped in dark chocolate — the richest bite in the lineup, sized so you never feel like you overdid it.',
  },
  {
    id: 'cookies-cream',
    name: 'Cookies & Cream Bite',
    tagline: 'Crushed cookie crunch, vanilla cream',
    theme: 'cookies',
    kcal: 32,
    protein: 4,
    sugar: 1,
    price: 2.49,
    description:
      'Real crushed cookie pieces folded into a whipped vanilla protein center. Nostalgic flavor, none of the sugar crash.',
  },
  {
    id: 'peanut-butter-crunch',
    name: 'Peanut Butter Crunch',
    tagline: 'Salty-sweet, crunchy peanut core',
    theme: 'peanut',
    kcal: 38,
    protein: 5,
    sugar: 1,
    price: 2.59,
    badge: 'High Protein',
    description:
      'Roasted peanut butter with a delicate crunch, finished in a thin chocolate shell. The highest protein bite in the box.',
  },
  {
    id: 'coffee-caramel',
    name: 'Coffee Caramel',
    tagline: 'Espresso hit, silky caramel',
    theme: 'coffee',
    kcal: 34,
    protein: 4,
    sugar: 2,
    price: 2.59,
    badge: 'New',
    description:
      'A soft caramel center laced with real espresso, coated in milk chocolate — your afternoon pick-me-up in one bite.',
  },
  {
    id: 'strawberry-cheesecake',
    name: 'Strawberry Cheesecake',
    tagline: 'Tangy strawberry, creamy cheesecake',
    theme: 'strawberry',
    kcal: 36,
    protein: 4,
    sugar: 2,
    price: 2.59,
    description:
      'A tangy-sweet strawberry swirl through a creamy cheesecake-flavored core. Dessert, shrunk down to size.',
  },
];

export const themeColors: Record<FlavorTheme, { base: string; light: string; dark: string; text: string }> = {
  chocolate: { base: '#5A3D2C', light: '#7A5640', dark: '#2E211A', text: '#FBF6EE' },
  cookies: { base: '#3B2A22', light: '#E3D2C4', dark: '#211712', text: '#FBF6EE' },
  peanut: { base: '#A97B5C', light: '#C7AF88', dark: '#5A3D2C', text: '#2E211A' },
  coffee: { base: '#4A2E22', light: '#8C6A4E', dark: '#241713', text: '#FBF6EE' },
  strawberry: { base: '#C4586B', light: '#E3A6B2', dark: '#7A2E3B', text: '#FBF6EE' },
};

export function findProduct(id: string): Product | undefined {
  const direct = products.find((p) => p.id === id);
  if (direct) return direct;

  if (id.startsWith('sub__')) {
    const [, planId, theme] = id.split('__');
    const plan = subscriptionPlans.find((p) => p.id === planId);
    if (!plan) return undefined;
    return {
      id,
      name: `${plan.name} (Subscription)`,
      tagline: `${plan.bitesPerBox} bites · ${plan.frequency}`,
      theme: (theme as FlavorTheme) ?? 'chocolate',
      kcal: 35,
      protein: 4,
      sugar: 1,
      price: plan.pricePerBox,
      compareAtPrice: plan.compareAtPrice,
      description: plan.perks.join(' · '),
    };
  }

  return undefined;
}
