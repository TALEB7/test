'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { SignedIn, SignedOut } from '@/lib/auth-client';
import { UserProfileCard } from '@/components/layout/user-profile-card';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useNotificationBadge } from '@/hooks/use-notification-badge';
import { useTokenBalance } from '@/hooks/use-token-balance';
import { useT } from '@/lib/i18n';
import {
  Home, Users2, ShoppingBag, MessageSquare, Bell, ChevronDown,
  Search, MessagesSquare, Calendar, Link2, GraduationCap, BarChart3,
  Megaphone, Gavel, GitCompareArrows, BellRing, Building2, Award,
  Bookmark, HelpCircle, Grid3x3,
} from 'lucide-react';

// ── LinkedIn-style nav tab ──────────────────────────────────────────────────
function NavTab({
  href, icon: Icon, label, badge,
}: {
  href: string; icon: any; label: string; badge?: number;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`relative flex items-center gap-2 rounded-full px-3.5 h-9 text-[13.5px] font-medium transition-colors duration-150 ease-out group
        ${active ? 'bg-brand-50 text-brand-700' : 'text-sand-600 hover:bg-sand-100 hover:text-sand-900'}`}
    >
      <div className="relative">
        <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.25 : 1.75} />
        {badge != null && badge > 0 && (
          <span className="absolute -top-1.5 -end-1.5 min-w-[16px] h-4 px-0.5 bg-brand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </div>
      <span className="hidden lg:block">{label}</span>
    </Link>
  );
}

// ── LinkedIn-style dropdown tab ─────────────────────────────────────────────
function DropdownTab({
  icon: Icon, label, items,
}: {
  icon: any; label: string;
  items: { name: string; href: string; icon: any }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', h);
    document.addEventListener('keydown', k);
    return () => {
      document.removeEventListener('mousedown', h);
      document.removeEventListener('keydown', k);
    };
  }, []);

  return (
    <div ref={ref} className="relative flex items-center">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-2 rounded-full px-3.5 h-9 text-[13.5px] font-medium transition-colors duration-150 ease-out
          ${open ? 'bg-sand-100 text-sand-900' : 'text-sand-600 hover:bg-sand-100 hover:text-sand-900'}`}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
        <span className="hidden lg:flex items-center gap-1">
          {label} <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 origin-top rounded-token-lg border border-line bg-sand-0 p-1.5 shadow-token-lg z-50 animate-in fade-in zoom-in-95 slide-in-from-top-1 duration-150 ease-out"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="group/item flex items-center gap-3 rounded-token-sm px-2.5 py-2 text-sm text-sand-700 hover:bg-sand-50 hover:text-sand-900 transition-colors duration-100"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-sand-0 text-sand-700 transition-colors group-hover/item:border-brand-200 group-hover/item:bg-brand-50 group-hover/item:text-brand-600">
                <item.icon className="w-3.5 h-3.5" />
              </span>
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main header ─────────────────────────────────────────────────────────────
export function DashboardHeader() {
  const { t, tr, intl } = useT();
  const { unread } = useNotificationBadge();
  const { balance } = useTokenBalance();

  const communaute = [
    { name: t.nav.forums,        href: '/forums',       icon: MessagesSquare },
    { name: t.nav.groups,        href: '/groups',       icon: Users2 },
    { name: t.nav.events,        href: '/events',       icon: Calendar },
    { name: t.nav.connections,   href: '/connections',  icon: Link2 },
    { name: t.nav.mentorship,    href: '/mentorship',   icon: GraduationCap },
    { name: t.nav.polls,         href: '/polls',        icon: BarChart3 },
    { name: t.nav.announcements, href: '/announcements',icon: Megaphone },
  ];

  const commerce = [
    { name: t.nav.marketplace,  href: '/marketplace',  icon: ShoppingBag },
    { name: t.nav.auctions,     href: '/auctions',     icon: Gavel },
    { name: t.nav.comparisons,  href: '/comparisons',  icon: GitCompareArrows },
    { name: t.nav.priceAlerts,  href: '/alerts',       icon: BellRing },
  ];

  const outils = [
    { name: t.nav.search,          href: '/search',          icon: Search },
    { name: t.nav.companyCreation, href: '/company-creation', icon: Building2 },
    { name: t.nav.badges,          href: '/badges',           icon: Award },
    { name: t.nav.bookmarks,       href: '/bookmarks',        icon: Bookmark },
    { name: t.nav.helpCenter,      href: '/faq',              icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-30 bg-sand-0/80 backdrop-blur-xl backdrop-saturate-150 border-b border-line">
      <div className="flex items-center h-14 px-3 sm:px-4 gap-2">

        {/* ── LEFT: Mobile + Logo + Search + Messages + Notifications + Profile ── */}
        <div className="flex items-center gap-2 shrink-0">
          <MobileNav />

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0 group">
            <Image src="/communium-logo-red.png" alt="The Communium" width={32} height={32} className="object-contain transition-transform duration-200 ease-out group-active:scale-95" />
            <span className="hidden xl:block font-display text-[15px] font-semibold tracking-tight text-sand-900 whitespace-nowrap">
              The Communium
            </span>
          </Link>

          {/* Search bar */}
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-2 h-9 px-3.5 bg-sand-50 border border-line rounded-full text-[13px] text-sand-500 hover:border-line-strong hover:bg-sand-0 hover:text-sand-700 transition-colors duration-150 ease-out w-40 lg:w-56"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="truncate">{t.header.searchTooltip}</span>
          </Link>

          {/* Profile — right next to search */}
          <div className="hidden sm:block">
            <SignedIn><UserProfileCard /></SignedIn>
            <SignedOut>
              <Link href="/sign-in" className="btn-ghost btn-sm">
                {t.header.signIn}
              </Link>
            </SignedOut>
          </div>
        </div>

        {/* ── CENTER: Nav tabs (no messages/notifs — moved left) ── */}
        <nav className="hidden md:flex items-center flex-1 justify-center gap-1">
          <NavTab href="/feed"         icon={Home}           label={tr("Accueil")} />
          <DropdownTab icon={Users2}      label={t.nav.community} items={communaute} />
          <DropdownTab icon={ShoppingBag} label={t.nav.commerce}  items={commerce} />
          <DropdownTab icon={Grid3x3}     label={t.nav.tools}     items={outils} />
        </nav>

        {/* ── RIGHT: Messages + Notifications + Tks + Language ── */}
        <div className="flex items-center gap-1 shrink-0 ms-auto">

          {/* Messages */}
          <Link
            href="/messages"
            className="flex items-center justify-center w-9 h-9 rounded-full text-sand-600 hover:text-sand-900 hover:bg-sand-100 transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.94]"
            title={t.header.messagesTooltip}
            aria-label={t.header.messagesTooltip}
          >
            <MessageSquare className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </Link>

          {/* Notifications */}
          <Link
            href="/notifications"
            className="relative flex items-center justify-center w-9 h-9 rounded-full text-sand-600 hover:text-sand-900 hover:bg-sand-100 transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.94]"
            title={t.header.notificationsTooltip}
            aria-label={t.header.notificationsTooltip}
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
            {unread > 0 && (
              <span className="absolute top-0.5 end-0.5 min-w-[15px] h-[15px] px-1 bg-brand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none ring-2 ring-sand-0">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </Link>

          <div className="w-px h-5 bg-line mx-1" />

          {/* Tks */}
          <Link
            href="/tokens"
            className="ygo-tokens hidden sm:inline-flex !px-3 !py-1.5 text-xs whitespace-nowrap transition-colors duration-150 ease-out hover:bg-brand-100"
          >
            <span aria-hidden="true">★</span>
            <span dir="ltr">{balance.toLocaleString(intl)} Tks</span>
          </Link>

          <div className="w-px h-5 bg-line hidden sm:block mx-1" />
          <LanguageSwitcher />
        </div>

      </div>
    </header>
  );
}
