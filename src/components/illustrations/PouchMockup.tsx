import { themeColors, type FlavorTheme } from '../../data/products';
import { BiteMockup } from './BiteMockup';

interface PouchMockupProps {
  theme: FlavorTheme;
  name?: string;
  className?: string;
  showBites?: boolean;
}

/**
 * Studio-style resealable stand-up pouch mockup used as the primary
 * "product photography" stand-in across the site. Built entirely from SVG
 * gradients/shapes so it renders crisply at any size with no external assets.
 */
export function PouchMockup({ theme, name = 'BetterBite', className = '', showBites = true }: PouchMockupProps) {
  const c = themeColors[theme];
  const uid = `pouch-${theme}`;

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 320 420" className="h-full w-full drop-shadow-xl">
        <defs>
          <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c.light} />
            <stop offset="45%" stopColor={c.base} />
            <stop offset="100%" stopColor={c.dark} />
          </linearGradient>
          <linearGradient id={`${uid}-top`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5ECDA" />
            <stop offset="100%" stopColor="#E8DCC8" />
          </linearGradient>
          <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.28" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`${uid}-floorshadow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2E211A" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#2E211A" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${uid}-clip`}>
            <path d="M60 60 Q160 20 260 60 L272 380 Q160 410 48 380 Z" />
          </clipPath>
        </defs>

        <ellipse cx="160" cy="400" rx="118" ry="18" fill={`url(#${uid}-floorshadow)`} />

        {/* pouch body */}
        <path
          d="M60 60 Q160 20 260 60 L272 380 Q160 410 48 380 Z"
          fill={`url(#${uid}-body)`}
          stroke="#2E211A"
          strokeOpacity="0.08"
          strokeWidth="2"
        />

        {/* fold crease + seal top */}
        <path d="M60 60 Q160 20 260 60 L256 82 Q160 46 64 82 Z" fill={`url(#${uid}-top)`} />
        <rect x="140" y="30" width="40" height="14" rx="7" fill="#D9C7A8" />

        {/* side gussets */}
        <path d="M48 380 L60 60 L74 66 L64 378 Z" fill="#000000" opacity="0.08" />
        <path d="M272 380 L260 60 L246 66 L258 378 Z" fill="#FFFFFF" opacity="0.06" />

        {/* label plate */}
        <g clipPath={`url(#${uid}-clip)`}>
          <rect x="70" y="150" width="180" height="150" rx="18" fill="#FBF6EE" opacity="0.95" />
          <text
            x="160"
            y="195"
            textAnchor="middle"
            fontFamily="Sora, sans-serif"
            fontWeight="700"
            fontSize="26"
            fill={c.dark}
          >
            {name}
          </text>
          <text
            x="160"
            y="222"
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontWeight="600"
            fontSize="12"
            letterSpacing="2"
            fill={c.base}
          >
            PROTEIN BITES
          </text>
          <line x1="100" y1="238" x2="220" y2="238" stroke={c.base} strokeOpacity="0.3" strokeWidth="1" />
          <text
            x="160"
            y="278"
            textAnchor="middle"
            fontFamily="Sora, sans-serif"
            fontWeight="800"
            fontSize="34"
            fill={c.base}
          >
            35 kcal
          </text>

          {/* sheen overlay */}
          <rect x="60" y="60" width="220" height="340" fill={`url(#${uid}-sheen)`} />
        </g>
      </svg>

      {showBites && (
        <div className="absolute -bottom-6 -right-4 h-20 w-20 sm:h-24 sm:w-24">
          <BiteMockup theme={theme} />
        </div>
      )}
    </div>
  );
}
