import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../ui/Reveal';
import { BiteMockup } from '../illustrations/BiteMockup';

interface AuthLayoutProps {
  heading: string;
  subtitle: string;
  children: ReactNode;
}

/**
 * Shared two-column shell for Login/Register/ForgotPassword: a dark brand
 * panel on the left (hidden on mobile/tablet in favor of a compact header)
 * and a white form card on the right. Reuses the same rounded-3xl/shadow-soft
 * card language as the rest of the site — no new visual tokens.
 */
export function AuthLayout({ heading, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="container-page min-h-[75vh] py-14 sm:py-20">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl shadow-soft ring-1 ring-cocoa-600/[0.05] lg:grid-cols-2">
        <Reveal className="relative hidden flex-col justify-between bg-cocoa-600 p-10 text-cream-100 lg:flex">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 text-sm text-cocoa-800">
              B
            </span>
            BetterBite
          </Link>

          <div>
            <h1 className="font-display text-3xl font-bold leading-tight">{heading}</h1>
            <p className="mt-4 text-cream-200/80">{subtitle}</p>
          </div>

          <div className="h-24 w-24 opacity-90">
            <BiteMockup theme="chocolate" />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="bg-white/90 p-8 sm:p-10">
          <div className="mb-6 flex flex-col items-center gap-2 text-center lg:hidden">
            <Link
              to="/"
              className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight text-cocoa-700"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cocoa-600 text-sm text-gold-500">
                B
              </span>
              BetterBite
            </Link>
            <h1 className="font-display text-2xl font-bold text-cocoa-700">{heading}</h1>
            <p className="text-sm text-cocoa-500">{subtitle}</p>
          </div>

          {children}
        </Reveal>
      </div>
    </div>
  );
}
