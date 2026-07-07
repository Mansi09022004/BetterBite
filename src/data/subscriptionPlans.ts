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
    name: 'Starter Trial Pack',
    bitesPerBox: 5,
    pricePerBox: 199,
    compareAtPrice: 199,
    frequency: 'One-time trial pack',
    perks: ['1 flavour of your choice', 'The easiest way to try BetterBite', 'Cancel anytime'],
  },
  {
    id: 'main',
    name: 'Box of 10',
    bitesPerBox: 10,
    pricePerBox: 399,
    compareAtPrice: 399,
    frequency: 'One-time purchase',
    best: true,
    perks: ['Mix up to 3 flavours', '10 bites in one box', 'Cancel anytime'],
  },
  {
    id: 'monthly',
    name: 'Monthly Bite Box',
    bitesPerBox: 30,
    pricePerBox: 999,
    compareAtPrice: 999,
    frequency: 'Every 30 days',
    perks: ['Mix all 5 flavours', 'Delivered monthly to your door', 'Cancel anytime'],
  },
];

export const coupons: Record<string, number> = {
  BETTER10: 0.1,
  SWEET15: 0.15,
  FIRSTBITE: 0.2,
};
