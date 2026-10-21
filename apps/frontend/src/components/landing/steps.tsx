'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Reveal, Section, SectionHeading } from './primitives';
import { InboxMock, MarketMock, MentorMock, VerifyMock } from './mocks';

type Step = { key: string; tags: string; titleA: string; titleB: string; copy: string; mock: ReactNode };

/**
 * 4-step process. Desktop: sticky rail on the left whose active item and
 * progress line follow the step card currently in the middle of the viewport.
 */
export function Steps() {
  const { tr } = useT();
  const [active, setActive] = useState(0);
  const cards = useRef<(HTMLElement | null)[]>([]);

  const steps: Step[] = [
    { key: 'Vérifier', tags: 'KYC, profil, entreprise', titleA: 'Entrez dans un cercle', titleB: 'de confiance.', copy: 'Vérification d’identité et d’entreprise, profil professionnel complet : votre crédibilité est établie dès le premier jour.', mock: <VerifyMock /> },
    { key: 'Connecter', tags: 'Matching, messages, groupes', titleA: 'Parlez à la bonne personne', titleB: 'au bon moment.', copy: 'Le matching par IA vous présente les membres qui comptent pour vos projets, et la messagerie garde tout le contexte.', mock: <InboxMock /> },
    { key: 'Échanger', tags: 'Marketplace, enchères, événements', titleA: 'Transformez les rencontres', titleB: 'en opportunités.', copy: 'Publiez vos offres, répondez aux enchères et rencontrez vos prospects lors d’événements réservés aux membres.', mock: <MarketMock /> },
    { key: 'Grandir', tags: 'Mentorat, création, tokens', titleA: 'Faites grandir votre activité', titleB: 'avec la communauté.', copy: 'Mentorat, accompagnement à la création de société et récompenses : la communauté travaille avec vous sur la durée.', mock: <MentorMock /> },
  ];

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    cards.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <Section id="steps" labelledBy="steps-title" className="bg-sand-50">
      <SectionHeading
        id="steps-title"
        align="start"
        eyebrow={tr('Votre parcours membre')}
        title={tr('De la première rencontre')}
        accent={tr('au premier contrat.')}
      />

      <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">
        {/* sticky rail (desktop) */}
        <nav aria-label={tr('Étapes')} className="hidden lg:block">
          <div className="sticky top-[calc(var(--nav-height)+40px)] rounded-token-lg border border-line bg-sand-0 p-2 shadow-token-md">
            <div className="relative">
              <span aria-hidden="true" className="absolute bottom-6 start-[27px] top-6 w-px bg-line" />
              <span
                aria-hidden="true"
                className="lp-progress absolute start-[27px] top-6 w-px bg-brand-500"
                style={{ height: 'calc(100% - 48px)', transform: `scaleY(${active / (steps.length - 1)})` }}
              />
              <ol className="relative flex flex-col gap-1">
                {steps.map((s, i) => (
                  <li key={s.key}>
                    <a
                      href={`#step-${i + 1}`}
                      aria-current={active === i ? 'step' : undefined}
                      className={cn(
                        'flex items-center gap-3 rounded-token-md px-3 py-3 text-[15px] font-medium transition-colors duration-200',
                        active === i ? 'bg-brand-50 text-sand-900' : 'text-sand-600 hover:bg-sand-50',
                      )}
                    >
                      <span
                        className={cn(
                          'relative grid h-7 w-7 place-items-center rounded-full font-mono text-[11px] font-semibold transition-colors duration-200',
                          active >= i ? 'bg-brand-500 text-white' : 'bg-sand-100 text-sand-600',
                        )}
                      >
                        0{i + 1}
                      </span>
                      {tr(s.key)}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </nav>

        <div className="flex flex-col gap-5">
          {steps.map((s, i) => (
            <Reveal
              as="article"
              key={s.key}
              id={`step-${i + 1}`}
              className="card grid grid-cols-1 scroll-mt-28 items-center gap-8 p-6 sm:p-8 md:grid-cols-[1fr_1.05fr]"
            >
              <div ref={(el: HTMLDivElement | null) => { cards.current[i] = el; }} data-step={i}>
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="font-display text-5xl font-semibold leading-none tracking-tight text-brand-500">0{i + 1}</span>
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 font-mono text-[11px] text-brand-700">{tr(s.tags)}</span>
                </div>
                <h3 className="text-h3 font-semibold text-sand-900">
                  {tr(s.titleA)} <span className="text-sand-500">{tr(s.titleB)}</span>
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-sand-600">{tr(s.copy)}</p>
              </div>
              <div className="relative rounded-token-xl bg-gradient-to-br from-brand-50 to-sand-50 p-3 sm:p-4">{s.mock}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
