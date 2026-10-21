'use client';

import type { ReactNode } from 'react';
import { Check } from '@phosphor-icons/react/dist/ssr';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Reveal, Section, SectionHeading } from './primitives';

/**
 * Infinite marquee. The track holds two copies of the items and slides by -50%,
 * so the loop is seamless. Pauses on hover/focus; static (scrollable) under reduced motion.
 */
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  label,
  className,
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="region"
      aria-label={label}
      className={cn('lp-marquee', reverse && 'lp-marquee--reverse', className)}
      style={{ ['--marquee-duration' as string]: `${duration}s` }}
    >
      <div className="lp-marquee__track">
        <ul className="flex shrink-0 items-center">{children}</ul>
        {/* duplicate for the seamless loop, hidden from assistive tech */}
        <ul className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </ul>
      </div>
    </div>
  );
}

// PLACEHOLDER partner logos — invented names, replace with real member/partner logos (SVG) before launch.
const LOGOS_A = ['Northbeam', 'Qantara', 'Lumora', 'Veridian', 'Solenne', 'Kairo', 'Halcyon'];
const LOGOS_B = ['Brixa', 'Meridia', 'Ostrom', 'Aurelle', 'Tessaly', 'Novacap', 'Zephra'];
const SHAPES = ['circle', 'square', 'diamond', 'ring'] as const;

function PlaceholderLogo({ name, i }: { name: string; i: number }) {
  const shape = SHAPES[i % SHAPES.length];
  return (
    <li className="mx-7 flex items-center gap-2 text-sand-400 transition-colors duration-200 hover:text-sand-700 sm:mx-10">
      <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
        {shape === 'circle' && <circle cx="10" cy="10" r="8" fill="currentColor" />}
        {shape === 'square' && <rect x="2.5" y="2.5" width="15" height="15" rx="4" fill="currentColor" />}
        {shape === 'diamond' && <path d="M10 1.5 18.5 10 10 18.5 1.5 10Z" fill="currentColor" />}
        {shape === 'ring' && <circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="3" />}
      </svg>
      <span className="whitespace-nowrap font-display text-lg font-semibold tracking-tight">{name}</span>
    </li>
  );
}

export function LogoMarquee() {
  const { tr } = useT();
  return (
    <Section labelledBy="logos-title" className="!pb-12">
      <SectionHeading
        id="logos-title"
        title={tr('Choisi par les entrepreneurs les plus exigeants.')}
        lead={tr('Fondateurs, dirigeants et investisseurs du Maroc et de la diaspora se retrouvent sur The Communium pour faire avancer leurs projets.')}
      />
      <Reveal delay={80} className="mt-12 flex flex-col gap-6">
        <Marquee label={tr('Membres et partenaires')} duration={42}>
          {LOGOS_A.map((n, i) => <PlaceholderLogo key={n} name={n} i={i} />)}
        </Marquee>
        <Marquee label={tr('Membres et partenaires')} duration={50} reverse>
          {LOGOS_B.map((n, i) => <PlaceholderLogo key={n} name={n} i={i + 1} />)}
        </Marquee>
      </Reveal>
      <Reveal delay={140} as="ul" className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[13px] text-sand-600">
        {['Profils vérifiés par KYC', 'Communauté Maroc & diaspora', 'Accès sur candidature uniquement'].map((s) => (
          <li key={s} className="flex items-center gap-2">
            <Check weight="bold" className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
            {tr(s)}
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
