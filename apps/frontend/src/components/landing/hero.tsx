'use client';

import {
  CaretRight,
  ChartLineUp,
  ChatsCircle,
  House,
  ShieldCheck,
  Storefront,
  UsersThree,
  CalendarBlank,
} from '@phosphor-icons/react/dist/ssr';
import { useT } from '@/lib/i18n';
import { CountUp, LiveBadge, MockWindow, Reveal, StatTile, useInView } from './primitives';
import { PrimaryCta } from './nav';
import { cn } from '@/lib/utils';

// Placeholder figures for the mockup — replace with real metrics when available.
const KPIS = [
  { label: 'Membres vérifiés', value: 2480, delta: '+12%' },
  { label: 'Mises en relation', value: 18920, delta: '+8%' },
  { label: 'Événements', value: 46, delta: '+5%' },
  { label: 'Deals marketplace', value: 1.2, decimals: 1, suffix: ' M MAD', delta: '+24%' },
];
const BARS = [34, 48, 30, 62, 44, 70, 56, 86];

function HeroDashboard() {
  const { tr, intl } = useT();
  const [ref, inView] = useInView<HTMLDivElement>();
  const month = new Intl.DateTimeFormat(intl, { month: 'long', year: 'numeric' }).format(new Date());

  return (
    <div ref={ref} className={cn('relative', inView && 'is-in')}>
      <div aria-hidden="true" className="lp-glow -end-16 -top-24 h-[420px] w-[520px] opacity-90" />

      <div className="relative rounded-token-xl border border-line bg-sand-0/70 p-2 shadow-token-xl backdrop-blur-sm">
        <MockWindow title={tr('Tableau de bord')} bodyClassName="flex gap-4 p-3 sm:p-4">
          {/* sidebar */}
          <div className="hidden flex-col items-center gap-3 border-e border-line pe-3 sm:flex" aria-hidden="true">
            <span className="grid grid-cols-1 h-7 w-7 place-items-center rounded-full bg-sand-900 text-sand-0">
              <House weight="fill" className="h-3.5 w-3.5" />
            </span>
            {[UsersThree, ChatsCircle, Storefront, CalendarBlank].map((I, i) => (
              <I key={i} className="h-4 w-4 text-sand-400" />
            ))}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <p className="text-[13px] font-semibold text-sand-900">{tr("Vue d'ensemble")}</p>
                <p className="text-[11px] capitalize text-sand-500">{month}</p>
              </div>
              <LiveBadge label={tr('En direct')} />
            </div>

            <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
              {KPIS.map((k) => (
                <StatTile
                  key={k.label}
                  size="sm"
                  className="rounded-token-sm bg-sand-50 px-3 py-2.5 shadow-none"
                  label={tr(k.label)}
                  value={<CountUp value={k.value} decimals={k.decimals} suffix={k.suffix} />}
                  delta={k.delta}
                />
              ))}
            </div>

            <div className="mt-3 flex h-28 items-end gap-2 rounded-token-sm border border-line px-3 pb-3 pt-4 sm:h-32" aria-hidden="true">
              {BARS.map((h, i) => (
                <span
                  key={i}
                  className={cn('lp-bar flex-1 rounded-t-[6px]', i === BARS.length - 1 ? 'bg-brand-500' : 'bg-brand-100')}
                  style={{ height: `${h}%`, ['--bar-delay' as string]: `${i * 60}ms` }}
                />
              ))}
            </div>
          </div>
        </MockWindow>
      </div>

      {/* floating badges */}
      <div className="lp-float absolute -end-2 -top-5 flex items-center gap-2.5 rounded-token-md border border-line bg-sand-0 px-3 py-2 shadow-token-lg sm:-end-5">
        <span className="grid grid-cols-1 h-8 w-8 place-items-center rounded-full bg-success-50 text-success-600">
          <ShieldCheck weight="fill" className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="leading-tight">
          <span className="block text-[11px] text-sand-600">{tr('Profils vérifiés')}</span>
          <span className="block text-[13px] font-semibold text-sand-900">KYC 100%</span>
        </span>
      </div>
      <div className="lp-float lp-float--late absolute -bottom-6 -start-2 flex items-center gap-2.5 rounded-token-md border border-line bg-sand-0 px-3 py-2 shadow-token-lg sm:-start-6">
        <span className="grid grid-cols-1 h-8 w-8 place-items-center rounded-full bg-brand-50 text-brand-600">
          <ChartLineUp weight="bold" className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="leading-tight">
          <span className="block text-[11px] text-sand-600">{tr('Taux de matching')}</span>
          <span className="block text-[13px] font-semibold text-sand-900 tabular-nums">87,4%</span>
        </span>
      </div>
    </div>
  );
}

export function Hero() {
  const { tr, t } = useT();
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden="true" className="bg-grid absolute inset-0 mask-fade-b opacity-70" />
      <div className="relative mx-auto grid grid-cols-1 w-full max-w-container items-center gap-16 px-gutter pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.12fr_1fr] lg:gap-12 lg:pb-28">
        <div className="flex flex-col items-start">
          <Reveal>
            <span className="eyebrow-pill">{tr('Le réseau business VIP Maroc–Monde')}</span>
          </Reveal>

          <Reveal as="h1" delay={60} id="hero-title" className="mt-6 text-display font-semibold text-sand-900">
            <span className="block">{tr("Un réseau d'affaires.")}</span>
            <span className="block">{tr('Vérifié, connecté.')}</span>
            <span className="accent-serif block pe-2">{tr('Sans frontières.')}</span>
          </Reveal>

          <Reveal as="p" delay={120} className="mt-7 max-w-[34rem] text-lead text-sand-600">
            {t.home.heroDesc}
          </Reveal>

          <Reveal delay={180} className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <PrimaryCta size="lg" />
            <a href="#platform" className="btn-outline btn-lg group">
              {tr('Découvrir la plateforme')}
              <CaretRight weight="bold" aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:-scale-x-100" />
            </a>
          </Reveal>
        </div>

        <Reveal delay={160} className="mx-2 sm:mx-6 lg:mx-0">
          <HeroDashboard />
        </Reveal>
      </div>
    </section>
  );
}

export function TrustBar() {
  const { tr } = useT();
  const items = [
    { value: <CountUp value={100} suffix="%" />, label: tr('Profils vérifiés par KYC') },
    { value: <CountUp value={3} />, label: tr('langues · FR · EN · AR') },
    { value: <CountUp value={1} />, label: tr('compte pour le réseau, la marketplace et les événements') },
  ];
  return (
    <div className="mx-auto w-full max-w-container px-gutter">
      <Reveal className="grid grid-cols-1 gap-2 rounded-token-xl border border-line bg-sand-50 p-2 sm:grid-cols-3">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-4 rounded-token-lg border border-line bg-sand-0 px-5 py-5 shadow-token-xs sm:px-6">
            <span className="font-display text-[2.1rem] font-semibold leading-none tracking-tight text-sand-900">
              {it.value}
            </span>
            <span className="text-[13px] leading-snug text-sand-600">{it.label}</span>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
