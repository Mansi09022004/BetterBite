import { Reveal } from './Reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  light?: boolean;
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'center', light = false }: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left';

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignClass}`}>
      {eyebrow && (
        <Reveal>
          <span className={light ? 'eyebrow bg-cream-100/10 text-cream-100' : 'eyebrow'}>{eyebrow}</span>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2
          className={`font-display text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-[2.75rem] ${
            light ? 'text-cream-100' : 'text-cocoa-700'
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16}>
          <p className={`text-base leading-relaxed sm:text-lg ${light ? 'text-cream-200/80' : 'text-cocoa-500'}`}>
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
