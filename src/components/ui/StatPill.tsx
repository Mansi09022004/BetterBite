import type { LucideIcon } from 'lucide-react';

interface StatPillProps {
  icon?: LucideIcon;
  label: string;
  value: string;
  className?: string;
}

export function StatPill({ icon: Icon, label, value, className = '' }: StatPillProps) {
  return (
    <div
      className={`flex flex-col items-center gap-0.5 rounded-2xl bg-cream-100/80 px-4 py-3 text-center shadow-soft ring-1 ring-cocoa-600/[0.06] ${className}`}
    >
      {Icon && <Icon className="mb-1 h-4 w-4 text-gold-700" strokeWidth={2.25} />}
      <span className="font-display text-lg font-bold text-cocoa-700">{value}</span>
      <span className="text-[11px] uppercase tracking-wide text-cocoa-400">{label}</span>
    </div>
  );
}
