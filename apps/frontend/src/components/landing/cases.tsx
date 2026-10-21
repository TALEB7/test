'use client';

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import {
  Bank,
  Buildings,
  Factory,
  Plant,
  RocketLaunch,
  Quotes,
} from '@phosphor-icons/react/dist/ssr';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Reveal, Section, SectionHeading, StatTile } from './primitives';

type IconType = PhosphorIcon;

/** Accessible tabs (roving tabindex, arrow keys / Home / End). Panels render through `children(activeIndex)`. */
export function Tabs({
  label,
  items,
  children,
}: {
  label: string;
  items: { label: string; icon?: IconType }[];
  children: (active: number, panelProps: { id: string; role: 'tabpanel'; 'aria-labelledby': string; tabIndex: 0 }) => ReactNode;
}) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = items.length - 1;
    const rtl = document.documentElement.dir === 'rtl';
    let next = active;
    if (e.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) next = active === last ? 0 : active + 1;
    else if (e.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) next = active === 0 ? last : active - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <>
      <div className="-mx-gutter overflow-x-auto px-gutter pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div role="tablist" aria-label={label} className="mx-auto flex w-max gap-1 rounded-full border border-line bg-sand-0 p-1 shadow-token-sm">
          {items.map((it, i) => {
            const Icon = it.icon;
            const selected = active === i;
            return (
              <button
                key={it.label}
                ref={(el) => { refs.current[i] = el; }}
                type="button"
                role="tab"
                id={`${base}-tab-${i}`}
                aria-selected={selected}
                aria-controls={`${base}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={onKey}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition-[background-color,color,box-shadow] duration-200',
                  selected ? 'bg-brand-500 text-white shadow-red' : 'text-sand-600 hover:bg-sand-100 hover:text-sand-900',
                )}
              >
                {Icon && <Icon weight={selected ? 'fill' : 'regular'} className="h-4 w-4" />}
                {it.label}
              </button>
            );
          })}
        </div>
      </div>
      {children(active, { id: `${base}-panel`, role: 'tabpanel', 'aria-labelledby': `${base}-tab-${active}`, tabIndex: 0 })}
    </>
  );
}

// PLACEHOLDER case studies — illustrative profiles and figures, replace with real member stories.
const CASES = [
  { sector: 'Finance & assurance', icon: Bank, profile: 'Cabinet de conseil financier', city: 'Casablanca', copy: 'Un cabinet de 12 personnes cherchait à rencontrer des dirigeants de PME en croissance sans passer par la prospection à froid.', metrics: [['+38', 'nouveaux clients en 6 mois'], ['72 h', 'délai moyen de premier rendez-vous'], ['4,6/5', 'satisfaction des mises en relation']], result: 'La majorité de nos nouveaux mandats viennent désormais de recommandations entre membres.' },
  { sector: 'Immobilier', icon: Buildings, profile: 'Promoteur résidentiel', city: 'Tanger', copy: 'Un promoteur souhaitait toucher des acheteurs de la diaspora et des investisseurs qualifiés pour un nouveau programme.', metrics: [['+120', 'contacts investisseurs qualifiés'], ['3', 'lots vendus aux enchères'], ['−40%', 'de coût d’acquisition']], result: 'Les enchères privées nous ont permis de vendre plus vite, avec des acheteurs déjà vérifiés.' },
  { sector: 'Industrie', icon: Factory, profile: 'PME de sous-traitance', city: 'Kénitra', copy: 'Une PME industrielle voulait diversifier ses donneurs d’ordre au-delà du secteur automobile.', metrics: [['+9', 'nouveaux donneurs d’ordre'], ['2', 'partenariats à l’export'], ['+26%', 'de chiffre d’affaires']], result: 'Les forums sectoriels nous ont ouvert des portes que nous n’aurions jamais trouvées seuls.' },
  { sector: 'Tech & startups', icon: RocketLaunch, profile: 'Startup SaaS B2B', city: 'Rabat', copy: 'Une jeune startup avait besoin de mentors expérimentés et de premiers clients pour préparer sa levée seed.', metrics: [['4', 'mentors actifs'], ['15', 'clients pilotes'], ['6 sem.', 'pour boucler le tour']], result: 'Le mentorat et le réseau ont accéléré notre levée de plusieurs mois.' },
  { sector: 'Agroalimentaire', icon: Plant, profile: 'Coopérative d’huile d’argan', city: 'Agadir', copy: 'Une coopérative voulait vendre directement à des distributeurs au Maroc et en Europe.', metrics: [['+18', 'distributeurs contactés'], ['5', 'contrats signés'], ['+31%', 'de marge par litre']], result: 'La marketplace nous a mis en relation avec des acheteurs sérieux, sans intermédiaire.' },
];

export function CaseStudies() {
  const { tr } = useT();
  return (
    <Section id="cases" labelledBy="cases-title">
      <SectionHeading
        id="cases-title"
        eyebrow={tr('Histoires de membres')}
        title={tr('Comment nos membres')}
        accent={tr('font avancer leurs projets.')}
        lead={tr('Sélectionnez un secteur pour découvrir comment des entreprises utilisent The Communium pour trouver clients, partenaires et mentors.')}
      />
      <Reveal delay={80} className="mt-10">
        <Tabs label={tr('Secteurs')} items={CASES.map((c) => ({ label: tr(c.sector), icon: c.icon }))}>
          {(active, panelProps) => {
            const c = CASES[active];
            return (
              <div key={active} {...panelProps} className="card mt-6 grid grid-cols-1 gap-8 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300 sm:p-8 lg:grid-cols-[1.15fr_1fr]">
                <div>
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-600">{tr(c.sector)}</span>
                    <span className="rounded-full bg-sand-100 px-2 py-0.5 text-[10.5px] font-medium text-sand-600">{tr('Exemple illustratif')}</span>
                  </p>
                  <h3 className="mt-2 text-h3 font-semibold text-sand-900">{tr(c.profile)}</h3>
                  <p className="text-[13px] text-sand-600">{c.city}</p>
                  <p className="mt-4 max-w-[36rem] text-[15px] leading-relaxed text-sand-700">{tr(c.copy)}</p>
                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {c.metrics.map(([v, l]) => (
                      <StatTile key={l} size="lg" className="bg-gradient-to-b from-sand-0 to-sand-50" value={tr(v)} label={tr(l)} />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-6">
                  <figure className="relative overflow-hidden rounded-token-lg border border-brand-100 bg-gradient-to-br from-brand-50 to-sand-0 p-6">
                    <Quotes weight="fill" className="h-7 w-7 text-brand-300" aria-hidden="true" />
                    <figcaption className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-600">{tr('Résultat')}</figcaption>
                    <blockquote className="mt-2 text-[17px] font-medium leading-relaxed text-sand-900">“{tr(c.result)}”</blockquote>
                  </figure>
                  <a href="/testimonials" className="group inline-flex items-center gap-1.5 self-start text-[14px] font-semibold text-brand-600 hover:text-brand-700">
                    {tr('Voir les témoignages des membres')}
                    <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 rtl:-scale-x-100">→</span>
                  </a>
                </div>
              </div>
            );
          }}
        </Tabs>
      </Reveal>
    </Section>
  );
}
