interface BlobBackgroundProps {
  className?: string;
  variant?: 'gold' | 'cocoa' | 'beige';
}

export function BlobBackground({ className = '', variant = 'gold' }: BlobBackgroundProps) {
  const colors = {
    gold: ['#F0E3C2', '#DCC086'],
    cocoa: ['#E3D2C4', '#C6A588'],
    beige: ['#F5ECDA', '#E8DCC8'],
  }[variant];

  return (
    <div className={`pointer-events-none absolute -z-10 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 600 600" className="h-full w-full opacity-70 blur-2xl">
        <defs>
          <linearGradient id={`blob-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        <path
          fill={`url(#blob-${variant})`}
          d="M433.5,313.5Q413,377,353,411.5Q293,446,229,427.5Q165,409,120,357.5Q75,306,89,239.5Q103,173,157.5,131Q212,89,278.5,93Q345,97,392.5,141Q440,185,443,249.5Q446,314,433.5,313.5Z"
        />
      </svg>
    </div>
  );
}
