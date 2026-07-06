interface ChocolateDripProps {
  className?: string;
  flip?: boolean;
  color?: string;
}

export function ChocolateDrip({ className = '', flip = false, color = '#FBF6EE' }: ChocolateDripProps) {
  return (
    <svg
      viewBox="0 0 400 60"
      preserveAspectRatio="none"
      className={`${className} ${flip ? 'rotate-180' : ''}`}
      aria-hidden="true"
    >
      <path
        d="M0 0 H400 V10 C380 10 375 45 355 45 C335 45 332 15 310 15 C288 15 286 50 262 50 C238 50 236 12 212 12 C188 12 186 40 162 40 C138 40 136 8 112 8 C88 8 86 42 62 42 C38 42 36 6 0 6 Z"
        fill={color}
      />
    </svg>
  );
}
