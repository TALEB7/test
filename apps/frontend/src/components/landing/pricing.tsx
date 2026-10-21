'use client';

import Link from 'next/link';
import { Check } from '@phosphor-icons/react/dist/ssr';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { SignedIn, SignedOut } from '@/lib/auth-client';
import { Reveal, Section, SectionHeading } from './primitives';

type Plan = {
  name: string;
  desc: string;
  price: string;
  unit: string;
  features: string[];
  featured?: boolean;
  badge?: string;
};

export function PricingCard({ plan, cta, delay = 0 }: { plan: Plan; cta: string; delay?: number }) {
  const { tr } = useT();
  const btn = cn('w-full', plan.featured ? 'btn-primary btn-lg' : 'btn-outline btn-lg');
  return (
    <Reveal
      as="article"
      delay={delay}
      className={cn(
        'relative flex flex-col rounded-token-xl border bg-sand-0 p-7 sm:p-8',
        plan.featured ? 'z-10 border-brand-300 shadow-red-lg md:-my-4 md:py-11' : 'border-line shadow-token-sm',
      )}
    >
      {plan.featured && (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-b from-brand-50 to-sand-0" />
          <div aria-hidden="true" className="lp-glow -z-20 inset-x-0 -top-24 h-64" />
        </>
      )}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-sand-900">{plan.name}</h3>
        {plan.badge && (
          <span className="rounded-full bg-brand-500 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white shadow-red">
            {plan.badge}
          </span>
        )}
      </div>
      <p className="mt-1.5 text-[14px] text-sand-600">{plan.desc}</p>

      <p className="mt-7 flex items-baseline gap-1.5">
        <span className="font-display text-5xl font-semibold tracking-tight text-sand-900 tabular-nums">{plan.price}</span>
        <span className="text-[14px] font-medium text-sand-600">{plan.unit}</span>
      </p>

      <div className="mt-7">
        <SignedOut>
          <Link href="/sign-up" className={btn}>{cta}</Link>
        </SignedOut>
        <SignedIn>
          <Link href="/membership" className={btn}>{cta}</Link>
        </SignedIn>
      </div>

      <div className="my-7 h-px bg-line" aria-hidden="true" />
      <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-sand-500">{tr('Inclus')}</p>
      <ul className="flex flex-col gap-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-[14.5px] text-sand-700">
            <span className={cn('mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full', plan.featured ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-600')}>
              <Check weight="bold" className="h-3 w-3" aria-hidden="true" />
            </span>
            {f}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function Pricing() {
  const { t, tr } = useT();
  const h = t.home;
  // The plan marked "popular" sits in the highlighted middle slot.
  const plans: Plan[] = [
    { name: h.planBusiness, desc: h.planBusinessDesc, price: h.planBusinessPrice, unit: h.perYear, features: h.businessFeatures },
    { name: h.planPersonal, desc: h.planPersonalDesc, price: h.planPersonalPrice, unit: h.perYear, features: h.personalFeatures, featured: true, badge: h.popular.replace('★', '').trim() },
    { name: h.planCreation, desc: h.planCreationDesc, price: h.planCreationPrice, unit: '$', features: h.creationFeatures },
  ];
  return (
    <Section id="pricing" labelledBy="pricing-title">
      <SectionHeading
        id="pricing-title"
        eyebrow={tr('Adhésion annuelle')}
        title={h.membershipTitle}
        accent={tr('à votre mesure.')}
        lead={h.membershipSubtitle}
      />
      <div className="mt-16 grid grid-cols-1 items-stretch gap-5 md:grid-cols-3 md:gap-4 lg:gap-6">
        {plans.map((p, i) => (
          <PricingCard key={p.name} plan={p} cta={h.startNow} delay={i * 80} />
        ))}
      </div>
      <p className="mt-12 text-center text-[14px] text-sand-600">
        {tr('Besoin d’aide pour choisir ?')}{' '}
        <a href="#booking" className="font-semibold text-brand-600 underline-offset-4 hover:underline">
          {tr('Réservez un appel découverte')} <span aria-hidden="true" className="inline-block rtl:-scale-x-100">→</span>
        </a>
      </p>
    </Section>
  );
}
