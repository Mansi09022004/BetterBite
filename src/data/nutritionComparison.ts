export interface ComparisonRow {
  label: string;
  unit: string;
  betterbite: number;
  chocolate: number;
  proteinBar: number;
  max: number;
}

export const comparisonRows: ComparisonRow[] = [
  { label: 'Calories', unit: 'kcal', betterbite: 35, chocolate: 150, proteinBar: 220, max: 220 },
  { label: 'Protein', unit: 'g', betterbite: 4, chocolate: 1, proteinBar: 20, max: 20 },
  { label: 'Sugar', unit: 'g', betterbite: 1, chocolate: 14, proteinBar: 6, max: 14 },
  { label: 'Portion size', unit: 'g', betterbite: 12, chocolate: 45, proteinBar: 60, max: 60 },
];

export const comparisonColumns = [
  { key: 'betterbite', label: 'BetterBite Bite', accent: '#3B2A22', highlight: true },
  { key: 'chocolate', label: 'Normal Chocolate', accent: '#C7AF88', highlight: false },
  { key: 'proteinBar', label: 'Standard Protein Bar', accent: '#A97B5C', highlight: false },
] as const;
