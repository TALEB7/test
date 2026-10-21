'use client';

import Link from 'next/link';
import { Check } from '@phosphor-icons/react/dist/ssr';
import { useT } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { VerifyMock } from '@/components/landing/mocks';
import '../../styles/landing.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { tr } = useT();
  const features = ['Marketplace avec IA sémantique', 'Enchères en temps réel', 'Matching mentor · mentoré', 'Réunions WebRTC intégrées'];
  return (
    <div className="flex min-h-screen bg-sand-0">
      {/* Form panel */}
      <div className="relative z-10 flex flex-1 flex-col px-gutter py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 rounded-full">
            <img src="/communium-logo-red.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
            <span className="font-display text-[15px] font-semibold tracking-tight text-sand-900">The Communium</span>
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[420px] animate-card-reveal">{children}</div>
        </div>

        <p className="text-center text-[12px] text-sand-500">{tr('© 2026 The Communium')}</p>
      </div>

      {/* Showcase panel (desktop only) */}
      <div className="relative hidden flex-1 overflow-hidden border-s border-line bg-sand-50 lg:flex" aria-hidden="true">
        <div className="bg-grid absolute inset-0 opacity-80" />
        <div className="lp-glow -end-32 -top-32 h-[560px] w-[560px]" />
        <div className="lp-glow -bottom-40 -start-24 h-[420px] w-[420px] opacity-70" />

        <div className="relative m-auto flex w-full max-w-[520px] flex-col gap-10 px-12">
          <div>
            <span className="eyebrow-pill">{tr('✦ Plateforme B2B · B2C · Maroc')}</span>
            <h2 className="mt-6 text-h1 font-semibold text-sand-900">
              {tr('Là où les entrepreneurs')}{' '}
              <span className="accent-serif">{tr('grandissent ensemble')}</span>
            </h2>
            <p className="mt-4 max-w-[26rem] text-[15px] leading-relaxed text-sand-600">
              {tr('Réseau professionnel, marketplace intelligente, mentorat et enchères — tout dans un seul espace.')}
            </p>
          </div>

          <div className="rotate-[-1.5deg] rounded-token-xl border border-line bg-sand-0/70 p-2 shadow-token-xl backdrop-blur-sm">
            <VerifyMock />
          </div>

          <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-[14px] text-sand-700">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
                  <Check weight="bold" className="h-3 w-3" />
                </span>
                {tr(f)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
