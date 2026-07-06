import { themeColors, type FlavorTheme } from '../../data/products';

interface BiteMockupProps {
  theme: FlavorTheme;
  className?: string;
  label?: string;
}

/**
 * Studio-style top-down render of a single protein bite: a rounded truffle
 * form with a glossy chocolate shell, drizzle detail, and a soft cast shadow.
 * Pure SVG so it stays crisp at any size and can be animated with Framer Motion.
 */
export function BiteMockup({ theme, className = '', label }: BiteMockupProps) {
  const c = themeColors[theme];
  const uid = theme;

  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label={label ?? `${theme} protein bite`}>
      <defs>
        <radialGradient id={`shell-${uid}`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="55%" stopColor={c.base} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
        <radialGradient id={`shadow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2E211A" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#2E211A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`gloss-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      <ellipse cx="120" cy="205" rx="70" ry="14" fill={`url(#shadow-${uid})`} />

      <circle cx="120" cy="115" r="88" fill={`url(#shell-${uid})`} />

      <path
        d="M55 90 C85 60, 155 55, 185 95"
        stroke="#FBF6EE"
        strokeOpacity="0.5"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M48 120 C90 145, 150 148, 195 122"
        stroke="#FBF6EE"
        strokeOpacity="0.35"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      <ellipse cx="88" cy="78" rx="34" ry="20" fill={`url(#gloss-${uid})`} />

      <circle cx="150" cy="150" r="6" fill="#FBF6EE" opacity="0.4" />
      <circle cx="95" cy="155" r="4" fill="#FBF6EE" opacity="0.3" />
    </svg>
  );
}
