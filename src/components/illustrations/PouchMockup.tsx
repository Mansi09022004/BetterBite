import { themeColors, type FlavorTheme } from '../../data/products';
import { BiteMockup } from './BiteMockup';

interface PouchMockupProps {
  theme: FlavorTheme;
  name?: string;
  flavor?: string;
  className?: string;
  showBites?: boolean;
}

/**
 * Studio-style resealable stand-up pouch mockup used as the primary
 * "product photography" stand-in across the site. Built entirely from SVG
 * gradients/shapes so it renders crisply at any size with no external assets.
 * Tuned for a matte, hand-filled pouch feel: muted directional light instead
 * of a glossy streak, irregular crinkle lines instead of mirrored folds, and
 * layered shadows for a grounded, physical (not glossy-plastic) read.
 */
export function PouchMockup({
  theme,
  name = 'BetterBite',
  flavor,
  className = '',
  showBites = true,
}: PouchMockupProps) {
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
          <radialGradient id={`${uid}-matte-light`} cx="30%" cy="18%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${uid}-matte-shade`} cx="76%" cy="70%" r="60%">
            <stop offset="0%" stopColor="#160F0B" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#160F0B" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}-foldshadow`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#160F0B" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#160F0B" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${uid}-baseshadow`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#160F0B" stopOpacity="0" />
            <stop offset="100%" stopColor="#160F0B" stopOpacity="0.22" />
          </linearGradient>
          <radialGradient id={`${uid}-floorshadow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2E211A" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#2E211A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${uid}-contactshadow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#160F0B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#160F0B" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${uid}-clip`}>
            <path d="M60 60 Q160 20 260 60 L272 380 Q160 410 48 380 Z" />
          </clipPath>
          <pattern id={`${uid}-grain`} width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.4" r="0.55" fill="#160F0B" opacity="0.08" />
            <circle cx="4.6" cy="2.6" r="0.4" fill="#160F0B" opacity="0.06" />
            <circle cx="2.8" cy="5.2" r="0.5" fill="#FBF6EE" opacity="0.07" />
            <circle cx="5.8" cy="5.8" r="0.35" fill="#160F0B" opacity="0.06" />
          </pattern>
        </defs>

        {/* ambient + tight contact shadow for a grounded, physical feel */}
        <ellipse cx="160" cy="402" rx="122" ry="20" fill={`url(#${uid}-floorshadow)`} />
        <ellipse cx="160" cy="396" rx="70" ry="9" fill={`url(#${uid}-contactshadow)`} />

        {/* pouch body */}
        <path
          d="M60 60 Q160 20 260 60 L272 380 Q160 410 48 380 Z"
          fill={`url(#${uid}-body)`}
          stroke="#2E211A"
          strokeOpacity="0.1"
          strokeWidth="2"
        />

        {/* material grain texture, clipped to the pouch silhouette */}
        <g clipPath={`url(#${uid}-clip)`}>
          <rect x="40" y="10" width="240" height="410" fill={`url(#${uid}-grain)`} />
          {/* muted directional light + falloff shade for a matte, rounded (not glossy) surface */}
          <ellipse cx="96" cy="76" rx="130" ry="150" fill={`url(#${uid}-matte-light)`} />
          <ellipse cx="240" cy="300" rx="120" ry="160" fill={`url(#${uid}-matte-shade)`} />

          {/* irregular hand-filled crinkle lines — deliberately unmirrored */}
          <path d="M78 104 C96 112, 112 108, 124 118" stroke="#160F0B" strokeOpacity="0.14" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <path d="M206 92 C220 100, 214 112, 228 120" stroke="#160F0B" strokeOpacity="0.12" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M64 330 C80 322, 92 334, 108 328" stroke="#160F0B" strokeOpacity="0.16" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M214 340 C228 348, 238 338, 252 344" stroke="#160F0B" strokeOpacity="0.14" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <path d="M60 358 C90 368, 130 372, 160 370" stroke="#160F0B" strokeOpacity="0.1" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          <path d="M56 200 C60 220, 58 245, 64 268" stroke="#160F0B" strokeOpacity="0.08" strokeWidth="1" strokeLinecap="round" fill="none" />
          <path d="M262 210 C258 232, 260 255, 254 276" stroke="#FFFFFF" strokeOpacity="0.1" strokeWidth="1" strokeLinecap="round" fill="none" />
        </g>

        {/* fold crease + seal top */}
        <path d="M60 60 Q160 20 260 60 L256 82 Q160 46 64 82 Z" fill={`url(#${uid}-top)`} />
        <rect x="140" y="30" width="40" height="14" rx="7" fill="#D9C7A8" />
        {/* soft shadow cast by the top fold onto the body below it */}
        <path d="M64 82 Q160 46 256 82 L258 100 Q160 66 62 100 Z" fill={`url(#${uid}-foldshadow)`} />
        {/* resealable zip track detail */}
        <path d="M78 92 Q160 60 242 92" stroke="#2E211A" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="3 4" fill="none" />
        <path d="M78 100 Q160 68 242 100" stroke="#2E211A" strokeOpacity="0.14" strokeWidth="1.5" strokeDasharray="3 4" fill="none" />

        {/* side gussets */}
        <path d="M48 380 L60 60 L74 66 L64 378 Z" fill="#000000" opacity="0.1" />
        <path d="M272 380 L260 60 L246 66 L258 378 Z" fill="#FFFFFF" opacity="0.07" />

        {/* base fold shadow for volume at the bottom gusset */}
        <path d="M52 350 Q160 380 268 350 L272 380 Q160 410 48 380 Z" fill={`url(#${uid}-baseshadow)`} />

        {/* label plate */}
        <g clipPath={`url(#${uid}-clip)`}>
          <rect x="64" y="128" width="192" height="192" rx="18" fill="#FBF6EE" opacity="0.97" />

          <text x="160" y="156" textAnchor="middle" fontFamily="Sora, sans-serif" fontWeight="700" fontSize="20" fill={c.dark}>
            {name}
          </text>

          {flavor && (
            <text x="160" y="177" textAnchor="middle" fontFamily="Sora, sans-serif" fontWeight="700" fontSize="14" fill={c.base}>
              {flavor}
            </text>
          )}

          <text x="160" y="193" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="9.5" letterSpacing="2" fill={c.base} opacity="0.85">
            PROTEIN BITES
          </text>

          <line x1="96" y1="202" x2="224" y2="202" stroke={c.base} strokeOpacity="0.28" strokeWidth="1" />

          {/* pack-size badge */}
          <rect x="118" y="211" width="84" height="16" rx="8" fill={c.base} opacity="0.14" />
          <text x="160" y="222.5" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="9" letterSpacing="1" fill={c.dark}>
            10 BITES PACK
          </text>

          <text x="160" y="247" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="10.5" fill={c.dark}>
            50 Calories Per Bite
          </text>
          <text x="160" y="262" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="10.5" fill={c.dark}>
            5g Protein Per Bite
          </text>
          <text x="160" y="277" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="10.5" fill={c.base}>
            Zero Added Sugar
          </text>

          {/* faint matte sheen, kept subtle rather than a glossy plastic streak */}
          <rect x="64" y="128" width="192" height="192" fill={`url(#${uid}-matte-light)`} opacity="0.5" />
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
