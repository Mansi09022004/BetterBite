import { themeColors, type FlavorTheme } from '../../data/products';

interface BiteMockupProps {
  theme: FlavorTheme;
  className?: string;
  label?: string;
}

/**
 * Top-down render of a single protein bite, styled to read as a photographed
 * matte truffle rather than a glossy 3D-rendered ball: an irregular hand-made
 * silhouette, muted directional lighting, fine cocoa-dust speckling, and a
 * natural coating fissure instead of a cartoon gloss streak.
 */
export function BiteMockup({ theme, className = '', label }: BiteMockupProps) {
  const c = themeColors[theme];
  const uid = theme;

  // Slightly irregular, hand-formed silhouette — not a perfect circle.
  const blob =
    'M118,30 C150,28 178,44 190,74 C201,103 197,132 184,158 C171,184 148,203 116,206 C84,209 55,196 40,170 ' +
    'C25,144 24,111 38,84 C52,57 86,32 118,30 Z';

  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label={label ?? `${theme} protein bite`}>
      <defs>
        <radialGradient id={`shell-${uid}`} cx="38%" cy="34%" r="80%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="50%" stopColor={c.base} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
        <radialGradient id={`core-shadow-${uid}`} cx="68%" cy="72%" r="55%">
          <stop offset="0%" stopColor="#160F0B" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#160F0B" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`highlight-${uid}`} cx="34%" cy="28%" r="45%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`shadow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2E211A" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#2E211A" stopOpacity="0" />
        </radialGradient>
        <pattern id={`speckle-${uid}`} width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="1.3" cy="2" r="0.6" fill="#160F0B" opacity="0.1" />
          <circle cx="5.5" cy="4.2" r="0.45" fill="#160F0B" opacity="0.07" />
          <circle cx="3.2" cy="7" r="0.5" fill="#FBF6EE" opacity="0.08" />
          <circle cx="7.6" cy="7.4" r="0.4" fill="#160F0B" opacity="0.08" />
        </pattern>
        <clipPath id={`clip-${uid}`}>
          <path d={blob} />
        </clipPath>
      </defs>

      {/* soft, broad grounded shadow */}
      <ellipse cx="122" cy="214" rx="68" ry="13" fill={`url(#shadow-${uid})`} />

      <g clipPath={`url(#clip-${uid})`}>
        <path d={blob} fill={`url(#shell-${uid})`} />
        {/* form-modeling core shadow for volume, no glossy specular dot */}
        <ellipse cx="160" cy="168" rx="75" ry="70" fill={`url(#core-shadow-${uid})`} />
        {/* muted directional highlight, matte not glossy */}
        <ellipse cx="88" cy="72" rx="58" ry="46" fill={`url(#highlight-${uid})`} />
        {/* cocoa-dust speckle texture */}
        <rect x="0" y="0" width="240" height="240" fill={`url(#speckle-${uid})`} />
        {/* natural coating fissures, not a glossy drizzle streak */}
        <path
          d="M70 96 C95 90, 118 100, 128 118"
          stroke="#160F0B"
          strokeOpacity="0.18"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M132 122 C148 132, 156 148, 150 165"
          stroke="#160F0B"
          strokeOpacity="0.14"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      <path d={blob} fill="none" stroke="#160F0B" strokeOpacity="0.12" strokeWidth="1.5" />
    </svg>
  );
}
