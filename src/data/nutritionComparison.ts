export interface ComparisonRow {
  label: string;
  unit: string;
  betterbite: number;
  chocolate: number;
  proteinBar: number;
  max: number;
}

export const comparisonRows: ComparisonRow[] = [
  { label: 'Calories', unit: 'kcal', betterbite: 50, chocolate: 150, proteinBar: 220, max: 220 },
  { label: 'Protein', unit: 'g', betterbite: 5, chocolate: 1, proteinBar: 18, max: 18 },
  { label: 'Added Sugar', unit: 'g', betterbite: 0, chocolate: 14, proteinBar: 6, max: 14 },
  { label: 'Portion size', unit: 'g', betterbite: 14, chocolate: 45, proteinBar: 60, max: 60 },
];

export const comparisonColumns = [
  { key: 'betterbite', label: 'BetterBite Bite', accent: '#3B2A22', highlight: true },
  { key: 'chocolate', label: 'Normal Chocolate', accent: '#C7AF88', highlight: false },
  { key: 'proteinBar', label: 'Standard Protein Bar', accent: '#A97B5C', highlight: false },
] as const;
