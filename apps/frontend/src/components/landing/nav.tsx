'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, List, X } from '@phosphor-icons/react/dist/ssr';
import { SignedIn, SignedOut, UserButton } from '@/lib/auth-client';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export const NAV_LINKS = [
  { href: '#features', label: 'Plateforme' },
  { href: '#steps', label: 'Comment ça marche' },
  { href: '#cases', label: 'Cas membres' },
  { href: '#pricing', label: 'Tarifs' },
];

/** Primary call to action: "Apply to join" (sign-up), or the dashboard when signed in. */
export function PrimaryCta({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const { t } = useT();
  const cls = cn('btn-primary group', size === 'sm' && 'btn-sm', size === 'lg' && 'btn-lg', className);
  const arrow = (
    <ArrowRight
      weight="bold"
      aria-hidden="true"
      className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
    />
  );
  return (
    <>
      <SignedOut>
        <Link href="/sign-up" className={cls}>
          {t.home.applyToJoin}
          {arrow}
        </Link>
      </SignedOut>
      <SignedIn>
        <Link href="/dashboard" className={cls}>
          {t.home.goToDashboard}
          {arrow}
        </Link>
      </SignedIn>
    </>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5 rounded-full" aria-label="The Communium">
      <img src="/communium-logo-red.png" alt="" width={34} height={34} className="h-[34px] w-[34px] object-contain" />
      <span className="hidden font-display text-[15px] font-semibold tracking-tight text-sand-900 sm:block">
        The Communium
      </span>
    </Link>
  );
}

export function LandingNav() {
  const { tr, t } = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile sheet: lock page scroll, close on Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 px-gutter pt-3">
      <nav
        aria-label={tr('Navigation principale')}
        className={cn(
          'mx-auto flex max-w-container items-center justify-between gap-4 rounded-full border py-2 pe-2 ps-4 transition-[background-color,border-color,box-shadow] duration-300 ease-out sm:ps-5',
          scrolled
            ? 'border-line bg-sand-0/80 shadow-token-md backdrop-blur-xl backdrop-saturate-150'
            : 'border-line/60 bg-sand-0/60 backdrop-blur-md',
        )}
      >
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-[14px] font-medium text-sand-600 transition-colors duration-150 hover:bg-sand-100 hover:text-sand-900"
              >
                {tr(l.label)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <SignedOut>
            <Link href="/sign-in" className="btn-ghost btn-sm hidden md:inline-flex">
              {t.home.signIn}
            </Link>
          </SignedOut>
          <SignedIn>
            <span className="hidden md:block">
              <UserButton afterSignOutUrl="/" />
            </span>
          </SignedIn>
          <PrimaryCta size="sm" className="hidden sm:inline-flex" />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="lp-mobile-menu"
            aria-label={tr('Ouvrir le menu')}
            className="grid grid-cols-1 h-10 w-10 place-items-center rounded-full border border-line bg-sand-0 text-sand-900 transition-transform active:scale-95 lg:hidden"
          >
            <List weight="bold" className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen sheet */}
      {open && (
      <div
        id="lp-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={tr('Menu')}
        className="fixed inset-0 z-50 flex flex-col bg-sand-0 px-gutter pb-8 pt-3 animate-in fade-in duration-200 lg:hidden"
      >
        <div className="flex items-center justify-between rounded-full border border-line py-2 pe-2 ps-4">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={tr('Fermer le menu')}
            className="grid grid-cols-1 h-10 w-10 place-items-center rounded-full border border-line text-sand-900 active:scale-95"
          >
            <X weight="bold" className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <ul className="mt-8 flex flex-col">
          {NAV_LINKS.map((l, i) => (
            <li key={l.href} className="border-b border-line">
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-5 font-display text-2xl font-semibold tracking-tight text-sand-900"
              >
                {tr(l.label)}
                <span className="label-mono">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col gap-3">
          <div className="self-start">
            <LanguageSwitcher />
          </div>
          <SignedOut>
            <Link href="/sign-in" className="btn-outline btn-lg w-full">
              {t.home.signIn}
            </Link>
          </SignedOut>
          <PrimaryCta size="lg" className="w-full" />
        </div>
      </div>
      )}
    </header>
  );
}
