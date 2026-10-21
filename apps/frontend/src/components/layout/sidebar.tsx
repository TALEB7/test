'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, LayoutDashboard, User,
  ShoppingBag, MessagesSquare,
  Search, Settings, Coins, LogOut, Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useT } from '@/lib/i18n';
import { useAuth, useUser } from '@/lib/auth-client';

function NavIcon({ href, icon: Icon, label, exact = false }: {
  href: string; icon: any; label: string; exact?: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex items-center justify-center w-10 h-10 rounded-full transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.94]',
        active
          ? 'bg-brand-50 text-brand-600'
          : 'text-sand-500 hover:bg-sand-100 hover:text-sand-900',
      )}
    >
      {/* Active rail */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute -start-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-e-full bg-brand-500 transition-[opacity,transform] duration-200 ease-out',
          active ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50',
        )}
      />
      <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.25 : 1.75} />
      {/* Tooltip — short delay on enter, instant on leave */}
      <span className="pointer-events-none absolute start-full ms-3 origin-left scale-95 rounded-full bg-sand-900 px-3 py-1 text-xs font-medium text-sand-0 whitespace-nowrap shadow-token-md opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover:scale-100 group-hover:opacity-100 group-hover:delay-300 group-focus-visible:scale-100 group-focus-visible:opacity-100 z-50">
        {label}
      </span>
    </Link>
  );
}

function Divider() {
  return <div className="w-6 border-t border-line my-1.5 mx-auto" aria-hidden="true" />;
}

export function Sidebar() {
  const { t, tr } = useT();
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <aside className="hidden lg:flex flex-col items-center w-16 shrink-0 border-e border-line bg-sand-0/80 backdrop-blur-md py-3 gap-1 h-[calc(100vh-56px)] sticky top-14">

      {/* Main */}
      <NavIcon href="/feed"      icon={Home}            label={tr("Accueil")} exact />
      <NavIcon href="/dashboard" icon={LayoutDashboard} label={t.nav.dashboard} exact />
      <NavIcon href="/profile"   icon={User}            label={t.nav.profile} />

      <Divider />

      {/* Community & Commerce — les plus utilisés */}
      <NavIcon href="/forums"      icon={MessagesSquare} label={t.nav.forums} />
      <NavIcon href="/marketplace" icon={ShoppingBag}   label={t.nav.marketplace} />

      <Divider />

      {/* Outils */}
      <NavIcon href="/search"   icon={Search}   label={t.nav.search} />
      <NavIcon href="/tokens"   icon={Coins}    label={t.nav.tokens} />
      <NavIcon href="/settings" icon={Settings} label={t.nav.settings} />

      {user?.role === 'ADMIN' && (
        <>
          <Divider />
          <NavIcon href="/admin" icon={Shield} label={t.nav.admin} />
        </>
      )}

      {/* Logout en bas */}
      <div className="flex-1" />
      <Divider />
      <button
        onClick={() => signOut()}
        aria-label={tr("Se déconnecter")}
        title={tr("Se déconnecter")}
        className="flex items-center justify-center w-10 h-10 rounded-full text-sand-500 hover:text-brand-600 hover:bg-brand-50 transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.94]"
      >
        <LogOut className="h-5 w-5 rtl:-scale-x-100" strokeWidth={1.75} />
      </button>
    </aside>
  );
}
