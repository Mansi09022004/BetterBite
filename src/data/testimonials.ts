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
      "I used to demolish half a chocolate bar after dinner and feel awful about it. Now I have two Bites, get my protein in, and I'm actually satisfied.",
    rating: 5,
    tag: 'Craving control',
  },
  {
    id: 't2',
    name: 'Coach Dez',
    role: 'Fitness Coach · 210K followers',
    quote:
      'I recommend BetterBite to every client who says they "can\'t stop snacking at night." Portion-controlled protein that actually tastes like dessert — rare combo.',
    rating: 5,
    tag: 'Influencer Partner',
  },
  {
    id: 't3',
    name: 'Alex T.',
    role: 'Verified Buyer',
    quote:
      'Lost 8lbs over 3 months just from swapping my dessert habit for 2 Bites a night. Didn\'t change anything else. The Peanut Butter Crunch is unreal.',
    rating: 5,
    tag: 'Transformation',
  },
  {
    id: 't4',
    name: 'Priya N.',
    role: 'Verified Buyer',
    quote:
      'Finally a "healthy" snack that doesn\'t taste like cardboard. My kids don\'t even know these are protein bites.',
    rating: 5,
  },
  {
    id: 't5',
    name: 'Jordan M.',
    role: 'Powerlifter · Sponsored Athlete',
    quote:
      'Macros are exactly what they say on the pack — I\'ve weighed them myself. That honesty is why I keep a box in my gym bag at all times.',
    rating: 5,
    tag: 'Athlete',
  },
];
