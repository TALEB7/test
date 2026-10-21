'use client';

/*
 * Small "live-looking" product mockups for the feature cards and steps.
 * Pure HTML/CSS, decorative (aria-hidden): the card's heading + copy carry the meaning.
 * All names and figures are PLACEHOLDERS.
 */

import type { ReactNode } from 'react';
import {
  ArrowUpRight,
  CheckCircle,
  CircleDashed,
  Clock,
  Coins,
  Gavel,
  Sparkle,
  VideoCamera,
} from '@phosphor-icons/react/dist/ssr';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { LiveBadge } from './primitives';

function Frame({ title, right, children, className }: { title: string; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div aria-hidden="true" className={cn('rounded-token-lg border border-line bg-sand-0 p-3.5 shadow-token-md', className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="truncate text-[12px] font-semibold text-sand-900">{title}</span>
        {right}
      </div>
      {children}
    </div>
  );
}

function Avatar({ initials, tone = 'sand' }: { initials: string; tone?: 'sand' | 'red' | 'dark' }) {
  return (
    <span
      className={cn(
        'grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold',
        tone === 'sand' && 'bg-sand-100 text-sand-700',
        tone === 'red' && 'bg-brand-50 text-brand-700',
        tone === 'dark' && 'bg-sand-900 text-sand-0',
      )}
    >
      {initials}
    </span>
  );
}

function Pill({ children, tone = 'sand' }: { children: ReactNode; tone?: 'sand' | 'red' | 'green' }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold',
        tone === 'sand' && 'bg-sand-100 text-sand-700',
        tone === 'red' && 'bg-brand-50 text-brand-700',
        tone === 'green' && 'bg-success-50 text-success-600',
      )}
    >
      {children}
    </span>
  );
}

/* 01 — verification */
export function VerifyMock() {
  const { tr } = useT();
  const rows = [
    { label: 'Identité (CNIE)', done: true },
    { label: 'Entreprise (ICE / RC)', done: true },
    { label: 'Références professionnelles', done: false },
  ];
  return (
    <Frame title={tr('Vérification du profil')} right={<Pill tone="green">{tr('2/3 validés')}</Pill>}>
      <div className="mb-3 flex items-center gap-3 rounded-token-sm bg-sand-50 p-2.5">
        <Avatar initials="SA" tone="dark" />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[12px] font-semibold text-sand-900">Salma A.</p>
          <p className="truncate text-[11px] text-sand-600">{tr('Fondatrice · Fintech')}</p>
        </div>
        <span className="ms-auto inline-flex items-center gap-1 text-[11px] font-semibold text-success-600">
          <CheckCircle weight="fill" className="h-3.5 w-3.5" />
          {tr('Vérifié')}
        </span>
      </div>
      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-2 rounded-token-xs border border-line px-2.5 py-2 text-[11.5px] text-sand-700">
            {r.done ? (
              <CheckCircle weight="fill" className="h-4 w-4 text-success-600" />
            ) : (
              <CircleDashed weight="bold" className="h-4 w-4 text-sand-400" />
            )}
            {tr(r.label)}
            <span className="ms-auto text-[10.5px] text-sand-500">{r.done ? tr('Validé') : tr('En cours')}</span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/* 02 — messaging */
export function InboxMock() {
  const { tr } = useT();
  const items = [
    { who: 'Youssef K.', i: 'YK', tag: 'Message', text: 'Parfait, on se voit jeudi à 10h ?', time: '09:42', unread: true },
    { who: 'Groupe Fintech', i: 'GF', tag: 'Groupe', text: 'Nouveau post : levée de fonds seed', time: '09:15', unread: true },
    { who: 'Nadia C.', i: 'NC', tag: 'Événement', text: 'Merci pour la conférence d’hier !', time: tr('Hier'), unread: false },
  ];
  return (
    <Frame title={tr('Messagerie')} right={<Pill tone="red">{tr('2 non lus')}</Pill>}>
      <ul className="space-y-1.5">
        {items.map((m) => (
          <li key={m.who} className={cn('flex items-center gap-2.5 rounded-token-sm px-2.5 py-2', m.unread ? 'bg-sand-50' : '')}>
            <Avatar initials={m.i} tone={m.unread ? 'red' : 'sand'} />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-sand-900">
                <span className="truncate">{tr(m.who)}</span>
                <span className="text-[10px] font-medium text-brand-600">{tr(m.tag)}</span>
              </p>
              <p className="truncate text-[11px] text-sand-600">{tr(m.text)}</p>
            </div>
            <span className="flex flex-col items-end gap-1 text-[10px] text-sand-500">
              {m.time}
              {m.unread && <i className="h-1.5 w-1.5 rounded-full bg-brand-500" />}
            </span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/* 03 — marketplace */
export function MarketMock() {
  const { tr } = useT();
  const items = [
    { name: 'Audit de cybersécurité', price: '12 000 MAD', tone: 'from-brand-100 to-brand-50' },
    { name: 'Local commercial · Maarif', price: '9 500 MAD/mois', tone: 'from-sand-200 to-sand-100' },
  ];
  return (
    <Frame title={tr('Marketplace')} right={<Pill tone="red"><Sparkle weight="fill" className="h-3 w-3" />{tr('Suggestions IA')}</Pill>}>
      <div className="grid grid-cols-2 gap-2">
        {items.map((it) => (
          <div key={it.name} className="overflow-hidden rounded-token-sm border border-line">
            <div className={cn('h-14 bg-gradient-to-br', it.tone)} />
            <div className="p-2 leading-tight">
              <p className="line-clamp-2 text-[11px] font-semibold text-sand-900">{tr(it.name)}</p>
              <p className="mt-1 text-[11px] font-semibold text-brand-600 tabular-nums">{tr(it.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* 04 — auctions */
export function AuctionMock() {
  const { tr } = useT();
  const bids = [
    { who: 'M. Lahlou', amount: '48 500', you: false },
    { who: tr('Vous'), amount: '47 000', you: true },
    { who: 'R. Faassi', amount: '45 000', you: false },
  ];
  return (
    <Frame title={tr('Enchère · Lot #128')} right={<LiveBadge label={tr('En direct')} />}>
      <div className="mb-2.5 flex items-end justify-between rounded-token-sm bg-sand-50 p-2.5">
        <div className="leading-tight">
          <p className="text-[10.5px] text-sand-600">{tr('Offre actuelle')}</p>
          <p className="font-display text-lg font-semibold tracking-tight text-sand-900 tabular-nums">48 500 MAD</p>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 tabular-nums">
          <Clock weight="bold" className="h-3.5 w-3.5" />
          02:14:09
        </span>
      </div>
      <ul className="mb-2.5 space-y-1">
        {bids.map((b) => (
          <li key={b.amount} className="flex items-center justify-between px-1 text-[11px]">
            <span className={cn(b.you ? 'font-semibold text-sand-900' : 'text-sand-600')}>{b.who}</span>
            <span className="tabular-nums text-sand-700">{b.amount} MAD</span>
          </li>
        ))}
      </ul>
      <span className="flex items-center justify-center gap-1.5 rounded-full bg-brand-500 py-2 text-[11.5px] font-semibold text-white">
        <Gavel weight="bold" className="h-3.5 w-3.5" />
        {tr('Enchérir 50 000 MAD')}
      </span>
    </Frame>
  );
}

/* 05 — events & video meetings (dark tile for rhythm) */
export function MeetingMock() {
  const { tr } = useT();
  return (
    <div aria-hidden="true" className="relative overflow-hidden rounded-token-lg bg-sand-900 p-3.5 text-sand-0 shadow-token-md">
      <div aria-hidden="true" className="absolute -end-10 -top-12 h-40 w-40 rounded-full bg-brand-500/30 blur-2xl" />
      <div className="relative mb-6 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-2 py-0.5 text-[10.5px] font-bold">
          <span className="lp-live-dot bg-white" />
          LIVE
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-sand-300 tabular-nums">
          <VideoCamera weight="fill" className="h-3.5 w-3.5" />
          128
        </span>
      </div>
      <div className="relative flex flex-col items-center gap-1.5 pb-4">
        <span className="grid grid-cols-1 h-12 w-12 place-items-center rounded-full bg-sand-0 text-sm font-bold text-sand-900 ring-4 ring-brand-500/40">KB</span>
        <p className="text-[12px] font-semibold">{tr('Karim B. · Hôte')}</p>
        <p className="text-[11px] text-sand-300">{tr('Masterclass : lever des fonds au Maroc')}</p>
      </div>
      <div className="relative flex items-center justify-between rounded-token-sm bg-white/10 px-2.5 py-2 text-[11px]">
        <span className="text-sand-200">{tr('Sophie : Super contenu !')}</span>
        <span className="flex -space-x-1.5 rtl:space-x-reverse">
          {['AL', 'MR', 'ZT'].map((i) => (
            <span key={i} className="grid grid-cols-1 h-5 w-5 place-items-center rounded-full bg-sand-700 text-[8px] font-bold ring-2 ring-sand-900">{i}</span>
          ))}
        </span>
      </div>
    </div>
  );
}

/* 06 — mentorship */
export function MentorMock() {
  const { tr } = useT();
  return (
    <Frame title={tr('Matching mentorat')} right={<Pill tone="green">{tr('Compatibilité 92%')}</Pill>}>
      <div className="mb-3 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-token-sm bg-sand-50 p-2">
          <Avatar initials="OB" tone="dark" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[11.5px] font-semibold text-sand-900">Omar B.</span>
            <span className="block truncate text-[10.5px] text-sand-600">{tr('Mentor · Ex-CFO')}</span>
          </span>
        </div>
        <span className="text-sand-400">⟷</span>
        <div className="flex flex-1 items-center gap-2 rounded-token-sm bg-sand-50 p-2">
          <Avatar initials="IL" tone="red" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[11.5px] font-semibold text-sand-900">Imane L.</span>
            <span className="block truncate text-[10.5px] text-sand-600">{tr('Fondatrice · Agritech')}</span>
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px] text-sand-600">
        <span>{tr('Sessions réalisées')}</span>
        <span className="font-semibold text-sand-900 tabular-nums">3 / 6</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sand-100">
        <div className="h-full w-1/2 rounded-full bg-brand-500" />
      </div>
    </Frame>
  );
}

/* 07 — forums & groups */
export function ForumMock() {
  const { tr } = useT();
  const threads = [
    { title: 'Créer une SARL AU en 2026 : retours ?', tag: 'Juridique', replies: 24 },
    { title: 'Recrutement de développeurs à Rabat', tag: 'Tech', replies: 17 },
    { title: 'Export vers l’Afrique de l’Ouest', tag: 'Commerce', replies: 31 },
  ];
  return (
    <Frame title={tr('Forums')} right={<Pill>{tr('12 groupes actifs')}</Pill>}>
      <ul className="space-y-1.5">
        {threads.map((t) => (
          <li key={t.title} className="flex items-center gap-2.5 rounded-token-xs border border-line px-2.5 py-2">
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[11.5px] font-semibold text-sand-900">{tr(t.title)}</p>
              <p className="text-[10.5px] text-brand-600">{tr(t.tag)}</p>
            </div>
            <span className="text-[10.5px] text-sand-500 tabular-nums">{tr('{n} réponses', { n: t.replies })}</span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/* 08 — company creation */
export function CompanyMock() {
  const { tr } = useT();
  const steps = [
    { label: 'Certificat négatif', state: 'done' },
    { label: 'Statuts & signatures', state: 'done' },
    { label: 'Domiciliation', state: 'doing' },
    { label: 'Immatriculation RC / ICE', state: 'todo' },
  ];
  return (
    <Frame title={tr('Création de société')} right={<Pill tone="red">{tr('Étape 3/4')}</Pill>}>
      <ol className="relative space-y-2 ps-1">
        {steps.map((s) => (
          <li key={s.label} className="flex items-center gap-2.5 text-[11.5px]">
            {s.state === 'done' && <CheckCircle weight="fill" className="h-4 w-4 text-success-600" />}
            {s.state === 'doing' && <span className="lp-live-dot lp-live-dot--red mx-[4.5px]" />}
            {s.state === 'todo' && <CircleDashed weight="bold" className="h-4 w-4 text-sand-300" />}
            <span className={cn(s.state === 'todo' ? 'text-sand-500' : 'text-sand-900', s.state === 'doing' && 'font-semibold')}>
              {tr(s.label)}
            </span>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

/* 09 — tokens & badges */
export function TokensMock() {
  const { tr } = useT();
  const tx = [
    { label: 'Bonus de bienvenue', amount: '+50' },
    { label: 'Mise en avant d’annonce', amount: '−20' },
    { label: 'Badge « Mentor actif »', amount: '+30' },
  ];
  return (
    <Frame title={tr('Portefeuille Tks')} right={<Coins weight="fill" className="h-4 w-4 text-brand-500" />}>
      <p className="font-display text-2xl font-semibold tracking-tight text-sand-900 tabular-nums">1 250 Tks</p>
      <p className="mb-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-success-600">
        <ArrowUpRight weight="bold" className="h-3 w-3" />
        {tr('+60 ce mois-ci')}
      </p>
      <ul className="space-y-1">
        {tx.map((t) => (
          <li key={t.label} className="flex items-center justify-between rounded-token-xs bg-sand-50 px-2.5 py-1.5 text-[11px]">
            <span className="text-sand-700">{tr(t.label)}</span>
            <span className={cn('font-semibold tabular-nums', t.amount.startsWith('+') ? 'text-success-600' : 'text-sand-600')}>{t.amount}</span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}
