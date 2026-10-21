'use client';

import { useId, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Plus, Sparkle } from '@phosphor-icons/react/dist/ssr';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Reveal, Section } from './primitives';

/* ───── Accordion: one item open at a time, smooth height (grid-rows) ───── */
export function Accordion({ items, defaultOpen = 0 }: { items: { q: string; a: ReactNode }[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();
  return (
    <div className="border-t border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className="border-b border-line">
            <h3>
              <button
                type="button"
                id={`${base}-q${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-a${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center gap-4 py-6 text-start"
              >
                <span className={cn('font-mono text-[11px] transition-colors', isOpen ? 'text-brand-600' : 'text-sand-400')}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={cn('flex-1 text-[17px] font-medium tracking-tight transition-colors sm:text-xl', isOpen ? 'text-sand-900' : 'text-sand-700 group-hover:text-sand-900')}>
                  {it.q}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color,transform] duration-300 ease-out',
                    isOpen ? 'rotate-45 border-sand-900 bg-sand-900 text-white' : 'border-line bg-sand-0 text-sand-900 group-hover:border-line-strong',
                  )}
                >
                  <Plus weight="bold" className="h-3.5 w-3.5" />
                </span>
              </button>
            </h3>
            <div id={`${base}-a${i}`} role="region" aria-labelledby={`${base}-q${i}`} className="lp-collapse" data-open={isOpen}>
              <div>
                <p className="max-w-[40rem] pb-7 ps-8 text-[15px] leading-relaxed text-sand-600">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Faq() {
  const { tr } = useT();
  const items = [
    { q: 'Qui peut rejoindre The Communium ?', a: 'Les entrepreneurs, dirigeants, indépendants et investisseurs du Maroc et de la diaspora. Chaque candidature est examinée et chaque profil est vérifié avant d’accéder au réseau.' },
    { q: 'Comment fonctionne la vérification des profils ?', a: 'Vous transmettez une pièce d’identité (CNIE) et, pour les entreprises, les documents ICE / RC. Notre équipe valide votre dossier, puis le badge « Vérifié » apparaît sur votre profil.' },
    { q: 'Que sont les Tks ?', a: 'Les Tks sont les jetons de la plateforme. Vous en recevez à l’inscription selon votre formule, vous en gagnez en contribuant à la communauté et vous les utilisez pour mettre vos annonces en avant.' },
    { q: 'Puis-je changer de formule ?', a: 'Oui, vous pouvez passer à une formule supérieure depuis votre espace Adhésion. Contactez-nous pour toute question sur la facturation.' },
  ];
  return (
    <Section id="faq" labelledBy="faq-title">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="label-mono flex items-center gap-3">
            <span className="text-brand-600">(07)</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
            FAQ
          </p>
          <h2 id="faq-title" className="mt-5 text-h1 font-semibold text-sand-900">
            {tr('Questions')}
            <span className="accent-serif block">{tr('fréquentes')}</span>
          </h2>
          <p className="mt-5 max-w-[22rem] text-[15px] text-sand-600">
            {tr('Une autre question ?')}{' '}
            <Link href="/faq" className="font-semibold text-brand-600 underline-offset-4 hover:underline">{tr('Voir toute la FAQ')}</Link>
          </p>
        </Reveal>
        <Reveal delay={80}>
          <Accordion items={items.map((it) => ({ q: tr(it.q), a: tr(it.a) }))} />
        </Reveal>
      </div>
    </Section>
  );
}

export function CtaBand() {
  const { tr, t } = useT();
  const badges = ['Profils vérifiés KYC', 'Maroc & diaspora', 'Accès sur candidature'];
  return (
    <section aria-labelledby="cta-title" className="px-gutter pb-section">
      <Reveal className="relative mx-auto max-w-container overflow-hidden rounded-token-2xl border border-line bg-sand-50 px-6 pb-8 pt-10 shadow-token-lg sm:px-12 sm:pt-14">
        <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-80" />
        <div aria-hidden="true" className="lp-glow -start-10 top-10 h-[460px] w-[620px]" />
        <div className="relative">
          <p className="label-mono">(08) {tr('Rejoindre le réseau')}</p>
          <div className="mt-6 grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
            <h2 id="cta-title" className="text-display font-semibold text-sand-900">
              <span className="block">{tr('Votre prochaine opportunité')}</span>
              <span className="accent-serif block pe-2">{tr('est peut-être déjà membre.')}</span>
            </h2>
            <div className="flex flex-col items-start gap-6 lg:items-end lg:text-end">
              <p className="max-w-[22rem] text-[15px] text-sand-600">
                {tr('Déposez votre candidature en quelques minutes. Notre équipe examine chaque dossier avec attention.')}
              </p>
              <Link
                href="/sign-up"
                className="group grid grid-cols-1 h-36 w-36 place-items-center rounded-full bg-sand-900 p-4 text-center text-[14px] font-semibold leading-tight text-white shadow-token-xl transition-transform duration-300 ease-out hover:scale-[1.04] active:scale-95 sm:h-40 sm:w-40"
              >
                <span className="flex flex-col items-center gap-2">
                  {t.home.applyToJoin}
                  <ArrowRight weight="bold" className="h-4 w-4 text-brand-400 transition-transform duration-200 group-hover:translate-x-1 rtl:-scale-x-100" aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-5">
            {badges.map((b) => (
              <li key={b} className="label-mono flex items-center gap-2 text-sand-600">
                <Sparkle weight="fill" className="h-3 w-3 text-brand-500" aria-hidden="true" />
                {tr(b)}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

export function LandingFooter() {
  const { tr, t } = useT();
  const h = t.home;
  const cols = [
    { title: 'Plateforme', links: [['Marketplace', '/marketplace'], ['Enchères', '/auctions'], ['Événements', '/events'], ['Mentorat', '/mentorship']] },
    { title: 'Communauté', links: [['Forums', '/forums'], ['Groupes', '/groups'], ['Témoignages', '/testimonials'], ['FAQ', '/faq']] },
    { title: 'The Communium', links: [['Tarifs', '#pricing'], ['Adhésion', '/membership'], ['Prendre rendez-vous', '#booking'], [h.contact, '/contact']] },
  ];
  return (
    <footer className="border-t border-line bg-sand-50">
      <div className="mx-auto grid grid-cols-1 max-w-container gap-12 px-gutter py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-[22rem]">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/communium-logo-red.png" alt="" width={34} height={34} className="h-[34px] w-[34px] object-contain" />
            <span className="font-display text-[15px] font-semibold tracking-tight text-sand-900">The Communium</span>
          </Link>
          <p className="mt-4 text-[14px] leading-relaxed text-sand-600">{h.heroDesc}</p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={tr(c.title)}>
            <p className="text-[13px] font-semibold text-sand-900">{c.title === 'The Communium' ? c.title : tr(c.title)}</p>
            <ul className="mt-4 flex flex-col gap-3">
              {c.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-[14px] text-sand-600 transition-colors hover:text-sand-900">
                    {tr(label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-container flex-col gap-3 px-gutter py-6 text-[13px] text-sand-600 sm:flex-row sm:items-center sm:justify-between">
          <p>{h.copyright}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-sand-900">{h.dataPrivacy}</Link>
            <Link href="/contact" className="transition-colors hover:text-sand-900">{h.contact}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
