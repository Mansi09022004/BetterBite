export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    id: 'f1',
    question: 'How are BetterBite Bites only 30-40 calories?',
    answer:
      'It comes down to portion engineering, not magic. Each Bite is a concentrated, protein-forward center (whey/milk protein isolate blend) coated in a thin layer of real chocolate — sized at roughly 12g so you get full dessert flavor without the 45-60g portion of a candy bar or protein bar.',
  },
  {
    id: 'f2',
    question: 'Will I actually feel satisfied eating something this small?',
    answer:
      "Yes — the protein and slow-digesting fiber blunt the sugar spike that leaves you wanting more. Most people find 2-3 Bites hits the same satisfaction as a full dessert, because the craving was for the flavor and texture, not the volume.",
  },
  {
    id: 'f3',
    question: "What's actually in them?",
    answer:
      'A whey/milk protein isolate blend, real cocoa butter or chocolate coating, natural sweeteners (allulose/erythritol blend), and flavor-specific inclusions like real peanut butter or freeze-dried strawberry. No artificial dyes, no hydrogenated oils. Full ingredient list is on every product page.',
  },
  {
    id: 'f4',
    question: 'How do I store them / do they melt?',
    answer:
      'Store below 24°C (75°F) for the firmest bite. They can soften in hot weather like any real chocolate — pop them in the fridge for 10 minutes to firm back up. No preservative aftertaste, ever.',
  },
  {
    id: 'f5',
    question: 'How does the Bite Box subscription work?',
    answer:
      'Pick a plan and flavor mix, and a fresh box ships every 30 days. You can swap flavors, change frequency, skip a month, or cancel anytime from your account — no phone calls required.',
  },
  {
    id: 'f6',
    question: 'Is the packaging recyclable?',
    answer:
      'Our pouches are made from a recyclable mono-material film and our shipping boxes are 100% curbside-recyclable, FSC-certified cardboard with soy-based ink printing.',
  },
];
