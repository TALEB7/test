'use client';

import type { ReactNode } from 'react';
import {
  ChatsCircle,
  Coins,
  Gavel,
  Handshake,
  IdentificationCard,
  Storefront,
  UsersThree,
  VideoCamera,
  Buildings,
} from '@phosphor-icons/react/dist/ssr';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { CountUp, Reveal, Section, SectionHeading } from './primitives';
import {
  AuctionMock,
  CompanyMock,
  ForumMock,
  InboxMock,
  MarketMock,
  MeetingMock,
  MentorMock,
  TokensMock,
  VerifyMock,
} from './mocks';

type IconType = PhosphorIcon;

/** Numbered module card: icon, mono category label, title, copy and a live-looking mock. */
export function FeatureCard({
  index,
  category,
  icon: Icon,
  title,
  description,
  mock,
  highlight = false,
  delay = 0,
  className,
}: {
  index: number;
  category: string;
  icon: IconType;
  title: string;
  description: string;
  mock: ReactNode;
  highlight?: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <Reveal
      as="article"
      delay={delay}
      className={cn(
        'card group relative flex flex-col gap-6 p-6 sm:p-7',
        highlight && 'border-brand-200 bg-gradient-to-b from-brand-50/70 to-sand-0 shadow-red-lg',
        className,
      )}
    >
      {highlight && <div aria-hidden="true" className="lp-glow -end-20 -top-24 h-64 w-64" />}
      <div className="relative flex items-start justify-between">
        <span
          className={cn(
            'grid h-10 w-10 place-items-center rounded-full border',
            highlight ? 'border-brand-600 bg-brand-500 text-white shadow-red' : 'border-line bg-sand-0 text-sand-900',
          )}
        >
          <Icon weight={highlight ? 'fill' : 'regular'} className="h-[18px] w-[18px]" />
        </span>
        <span className="label-mono">
          {category} / {String(index).padStart(2, '0')}
        </span>
      </div>
      <div className="relative">
        <h3 className="text-h3 font-semibold text-sand-900">{title}</h3>
        <p className="mt-2 max-w-[34rem] text-[15px] leading-relaxed text-sand-600">{description}</p>
      </div>
      <div className="relative mt-auto transition-transform duration-500 ease-out group-hover:-translate-y-1">{mock}</div>
    </Reveal>
  );
}

export function FeatureBento() {
  const { tr } = useT();
  const f = (
    index: number,
    category: string,
    icon: IconType,
    title: string,
    description: string,
    mock: ReactNode,
    extra?: { highlight?: boolean },
  ) => ({ index, category: tr(category), icon, title: tr(title), description: tr(description), mock, ...extra });

  const rows = [
    {
      cols: 'md:grid-cols-2',
      items: [
        f(1, 'Confiance', IdentificationCard, 'Réseau 100% vérifié', 'Chaque membre passe une vérification d’identité et d’entreprise (KYC). Vous savez toujours à qui vous parlez.', <VerifyMock key="v" />),
        f(2, 'Échanges', ChatsCircle, 'Messagerie & notifications', 'Messages privés, groupes et alertes réunis dans une seule boîte, avec tout l’historique de la relation.', <InboxMock key="i" />),
      ],
    },
    {
      cols: 'md:grid-cols-2 lg:grid-cols-3',
      items: [
        f(3, 'Commerce', Storefront, 'Marketplace B2B', 'Publiez vos offres et services. L’IA met en avant les annonces qui correspondent à votre activité.', <MarketMock key="m" />),
        f(4, 'Ventes', Gavel, 'Enchères en temps réel', 'Vendez et achetez aux enchères avec des offres en direct, un compte à rebours et un historique transparent.', <AuctionMock key="a" />, { highlight: true }),
        f(5, 'Rencontres', VideoCamera, 'Événements & visio', 'Masterclass, conférences et rendez-vous vidéo intégrés, sans application externe.', <MeetingMock key="mt" />),
      ],
    },
    {
      cols: 'md:grid-cols-2',
      items: [
        f(6, 'Croissance', Handshake, 'Mentorat intelligent', 'Un matching mentor · mentoré basé sur vos objectifs, avec un suivi des sessions.', <MentorMock key="me" />),
        f(7, 'Communauté', UsersThree, 'Forums & groupes', 'Des discussions par secteur et par ville pour partager des retours concrets entre pairs.', <ForumMock key="fo" />),
      ],
    },
    {
      cols: 'md:grid-cols-2',
      items: [
        f(8, 'Entreprise', Buildings, 'Création de société', 'De la demande de certificat négatif à l’immatriculation : un accompagnement complet, étape par étape.', <CompanyMock key="c" />),
        f(9, 'Récompenses', Coins, 'Tokens & badges', 'Gagnez des Tks en contribuant à la communauté et utilisez-les pour mettre vos annonces en avant.', <TokensMock key="t" />),
      ],
    },
  ];

  return (
    <Section id="features" labelledBy="features-title">
      <SectionHeading
        id="features-title"
        align="start"
        title={tr("Tout ce qu'il faut pour")}
        accent={tr('faire grandir vos affaires.')}
        lead={tr('Tout ce dont un entrepreneur a besoin pour rencontrer, vendre, apprendre et grandir, déjà connecté nativement.')}
      />
      <div className="mt-12 flex flex-col gap-4">
        {rows.map((row, r) => (
          <div key={r} className={cn('grid gap-4', row.cols)}>
            {row.items.map((it, i) => (
              <FeatureCard key={it.index} {...it} delay={i * 80} />
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ───── "+15 tools. One platform." — chips orbiting the central card ───── */
const INNER = ['Profil', 'Messagerie', 'Marketplace', 'Enchères', 'Événements', 'Mentorat'];
const OUTER = ['Forums', 'Groupes', 'Sondages', 'Annonces', 'Tokens', 'Badges', 'Alertes', 'Comparateur', 'Visio'];

function Ring({ items, radius, duration, reverse, offset = 0 }: { items: string[]; radius: number; duration: number; reverse?: boolean; offset?: number }) {
  const { tr } = useT();
  return (
    <div
      className={cn('lp-orbit absolute inset-0', reverse && 'lp-orbit--reverse')}
      style={{ ['--orbit-duration' as string]: `${duration}s` }}
    >
      {items.map((label, i) => {
        const a = ((i / items.length) * 360 + offset) * (Math.PI / 180);
        return (
          <div
            key={label}
            className="lp-orbit__item absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(50 + radius * Math.cos(a)).toFixed(3)}%`, top: `${(50 + radius * Math.sin(a)).toFixed(3)}%` }}
          >
            <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-sand-0 px-2 py-0.5 text-[10px] font-medium text-sand-700 shadow-token-sm sm:px-3 sm:py-1 sm:text-[12px]">
              <i className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              {tr(label)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ToolOrbit() {
  const { tr } = useT();
  return (
    <Section labelledBy="orbit-title" className="overflow-hidden">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col items-start gap-6">
          <SectionHeading
            id="orbit-title"
            align="start"
            title={tr("Tout votre réseau d'affaires,")}
            accent={tr('au même endroit.')}
            lead={tr('Réseau, messagerie, marketplace, enchères, événements, mentorat et création de société : The Communium remplace une dizaine d’abonnements et d’applications dispersées.')}
          />
          <Reveal delay={120} className="flex items-center gap-5 rounded-token-lg border border-line bg-sand-0 px-6 py-4 shadow-token-md">
            <span className="font-display text-5xl font-semibold tracking-tight text-sand-900">
              <CountUp value={1} />
            </span>
            <span className="h-10 w-px bg-line" aria-hidden="true" />
            <span className="text-[14px] leading-snug text-sand-600">
              {tr('seul compte')}
              <br />
              {tr('pour tout votre business')}
            </span>
          </Reveal>
        </div>

        <Reveal delay={100} className="relative mx-auto aspect-square w-full max-w-[560px]" aria-hidden="true">
          <div className="lp-glow inset-[18%]" />
          {/* rings are inset on small screens so chips never leave the viewport */}
          <div className="absolute inset-[11%] sm:inset-[2%]">
            <div className="absolute inset-[16%] rounded-full border border-dashed border-line-strong" />
            <div className="absolute inset-[2%] rounded-full border border-dashed border-line" />
            <Ring items={INNER} radius={34} duration={70} />
            <Ring items={OUTER} radius={48} duration={90} reverse offset={20} />
          </div>
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-token-lg border border-brand-200 bg-sand-0 px-5 py-4 text-center shadow-red-lg">
            <img src="/communium-logo-red.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="font-display text-[13px] font-semibold text-sand-900">The Communium</span>
            <span className="text-[11px] text-sand-600">{tr('Un seul réseau.')}</span>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
