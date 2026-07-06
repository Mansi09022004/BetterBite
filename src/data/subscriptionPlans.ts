export interface SubscriptionPlan {
  id: string;
  name: string;
  bitesPerBox: number;
  pricePerBox: number;
  compareAtPrice: number;
  frequency: string;
  best?: boolean;
  perks: string[];
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter Box',
    bitesPerBox: 20,
    pricePerBox: 34,
    compareAtPrice: 40,
    frequency: 'Every 30 days',
    perks: ['1 flavor of your choice', 'Free shipping', 'Cancel anytime'],
  },
  {
    id: 'classic',
    name: 'Classic Bite Box',
    bitesPerBox: 40,
    pricePerBox: 58,
    compareAtPrice: 72,
    frequency: 'Every 30 days',
    best: true,
    perks: ['Mix up to 3 flavors', 'Free shipping', 'Skip or swap anytime', 'Save 19%'],
  },
  {
    id: 'pro',
    name: 'Pro Bite Box',
    bitesPerBox: 80,
    pricePerBox: 104,
    compareAtPrice: 136,
    frequency: 'Every 30 days',
    perks: ['Mix all 5 flavors', 'Free shipping + priority support', 'Save 24%', 'Early access to new flavors'],
  },
];

export const coupons: Record<string, number> = {
  BETTER10: 0.1,
  SWEET15: 0.15,
  FIRSTBITE: 0.2,
};
