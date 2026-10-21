'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, useUser } from '@/lib/auth-client';
import { useT } from '@/lib/i18n';
import {
  LayoutDashboard, User, ShoppingBag, Gavel, Settings, Coins, CreditCard,
  GraduationCap, Shield, Search, Building2, GitCompareArrows, BellRing,
  MessagesSquare, Calendar, Users2, Link2, Activity, Award, BarChart3,
  Bookmark, Megaphone, HelpCircle, MessageSquareQuote, Mail,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  '/dashboard': LayoutDashboard, '/feed': Activity, '/profile': User,
  '/forums': MessagesSquare, '/groups': Users2, '/events': Calendar,
  '/connections': Link2, '/mentorship': GraduationCap, '/polls': BarChart3,
  '/announcements': Megaphone, '/testimonials': MessageSquareQuote,
  '/marketplace': ShoppingBag, '/auctions': Gavel, '/comparisons': GitCompareArrows,
  '/alerts': BellRing, '/search': Search, '/company-creation': Building2,
  '/badges': Award, '/bookmarks': Bookmark, '/faq': HelpCircle,
  '/contact': Mail, '/tokens': Coins, '/membership': CreditCard,
  '/admin': Shield, '/settings': Settings,
};

function useSections() {
  const { t } = useT();
  const { user } = useUser();
  const isAdmin = user?.role === 'ADMIN';

  if (isAdmin) {
    return [
      {
        label: t.nav.admin,
        items: [
          { name: t.nav.admin, href: '/admin' },
          { name: t.nav.settings, href: '/settings' },
        ],
      },
    ];
  }

  return [
    {
      label: null,
      items: [
        { name: t.nav.dashboard, href: '/dashboard' },
        { name: t.nav.feed, href: '/feed' },
        { name: t.nav.profile, href: '/profile' },
      ],
    },
    {
      label: t.nav.community,
      items: [
        { name: t.nav.forums, href: '/forums' },
        { name: t.nav.groups, href: '/groups' },
        { name: t.nav.events, href: '/events' },
        { name: t.nav.connections, href: '/connections' },
        { name: t.nav.mentorship, href: '/mentorship' },
        { name: t.nav.polls, href: '/polls' },
        { name: t.nav.announcements, href: '/announcements' },
        { name: t.nav.testimonials, href: '/testimonials' },
      ],
    },
    {
      label: t.nav.commerce,
      items: [
        { name: t.nav.marketplace, href: '/marketplace' },
        { name: t.nav.auctions, href: '/auctions' },
        { name: t.nav.comparisons, href: '/comparisons' },
        { name: t.nav.priceAlerts, href: '/alerts' },
      ],
    },
    {
      label: t.nav.tools,
      items: [
        { name: t.nav.search, href: '/search' },
        { name: t.nav.companyCreation, href: '/company-creation' },
        { name: t.nav.badges, href: '/badges' },
        { name: t.nav.bookmarks, href: '/bookmarks' },
        { name: t.nav.helpCenter, href: '/faq' },
        { name: t.nav.contact, href: '/contact' },
      ],
    },
    {
      label: t.nav.account,
      items: [
        { name: t.nav.tokens, href: '/tokens' },
        { name: t.nav.membership, href: '/membership' },
        { name: t.nav.admin, href: '/admin' },
        { name: t.nav.settings, href: '/settings' },
      ],
    },
  ];
}

function Section({
  label,
  items,
  pathname,
  onClose,
}: {
  label: string | null;
  items: { name: string; href: string }[];
  pathname: string;
  onClose: () => void;
}) {
  const hasActive = items.some((i) => pathname === i.href || pathname.startsWith(i.href + '/'));
  const [open, setOpen] = useState(hasActive || !label);

  return (
    <div>
      {label && (
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between px-3 py-2 mt-2"
        >
          <span className="label-mono">
            {label}
          </span>
          <ChevronDown className={cn('h-3.5 w-3.5 text-sand-500 transition-transform duration-200 ease-out', open ? '' : '-rotate-90 rtl:rotate-90')} />
        </button>
      )}
      {open && (
        <div className="space-y-0.5">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = iconMap[item.href];
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'relative flex items-center gap-3 rounded-full px-4 py-2.5 text-[14px] transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.98]',
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-sand-700 hover:bg-sand-100 hover:text-sand-900',
                )}
              >
                {Icon && <Icon className={cn('h-[18px] w-[18px] shrink-0', isActive ? 'text-brand-600' : 'text-sand-500')} strokeWidth={isActive ? 2.25 : 1.75} />}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const sections = useSections();
  const { signOut } = useAuth();
  const { t, tr } = useT();

  return (
    <>
      {/* Hamburger button — only on < lg */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden grid h-9 w-9 place-items-center rounded-full border border-line text-sand-900 hover:bg-sand-100 transition-[background-color,transform] active:scale-95"
        aria-label={tr("Ouvrir le menu")}
        aria-expanded={open}
      >
        <Menu className="h-[18px] w-[18px]" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-sand-950/30 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        aria-hidden={!open}
        className={cn(
          'fixed top-0 start-0 z-50 h-full w-72 bg-sand-0 border-e border-line shadow-token-xl flex flex-col transition-[transform,visibility] duration-300 ease-drawer lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full',
          !open && 'invisible',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-line">
          <span className="flex items-center gap-2 font-display text-[15px] font-semibold tracking-tight text-sand-900">
            <img src="/communium-logo-red.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
            The Communium
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label={tr("Fermer le menu")}
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-sand-900 hover:bg-sand-100 transition-colors duration-150 active:scale-[0.94]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {sections.map((section, i) => (
            <div key={section.label || 'top'}>
              {i > 0 && section.label && (
                <div className="mx-3 my-1 border-t border-line" />
              )}
              <Section label={section.label} items={section.items} pathname={pathname} onClose={() => setOpen(false)} />
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-line px-4 py-3 space-y-2">
          <button
            onClick={() => { signOut(); setOpen(false); }}
            className="btn-outline btn-sm w-full"
          >
            <LogOut className="h-4 w-4 rtl:-scale-x-100" />
            <span>{t.header?.signOut || tr('Se déconnecter')}</span>
          </button>
          <p className="text-center text-[11px] text-sand-500">
            {tr("© 2026 The Communium")}
          </p>
        </div>
      </aside>
    </>
  );
}
