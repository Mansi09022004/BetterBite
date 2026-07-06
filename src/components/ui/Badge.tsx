import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  tone?: 'gold' | 'cocoa' | 'berry';
  className?: string;
}

const toneClass: Record<NonNullable<BadgeProps['tone']>, string> = {
  gold: 'bg-gold-500 text-cocoa-800',
  cocoa: 'bg-cocoa-600 text-cream-100',
  berry: 'bg-berry text-cream-100',
};

export function Badge({ children, tone = 'gold', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm ${toneClass[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
