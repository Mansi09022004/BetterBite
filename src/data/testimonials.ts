export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  tag?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Maya R.',
    role: 'Verified Buyer',
    quote:
      'I wanted something sweet after dinner without opening a full chocolate bar. BetterBite fits perfectly.',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Aditya K.',
    role: 'Verified Buyer',
    quote:
      "Finally something small enough for cravings but still gives me protein. Doesn't feel like I'm cheating on my diet.",
    rating: 5,
  },
  {
    id: 't3',
    name: 'Priya N.',
    role: 'Verified Buyer',
    quote:
      "Love that I don't need to eat an entire protein bar after meals. Two bites and I'm satisfied.",
    rating: 5,
  },
  {
    id: 't4',
    name: 'Rohan S.',
    role: 'Verified Buyer',
    quote:
      "Coffee Caramel actually tastes like a treat, not a protein supplement. Tried the Starter Pack out of curiosity and ended up ordering the Monthly Box the same week.",
    rating: 5,
  },
  {
    id: 't5',
    name: 'Ananya D.',
    role: 'Verified Buyer',
    quote:
      "My go-to after lunch when I want something sweet but don't want to overdo it. Keep a box at my desk.",
    rating: 5,
  },
];
