'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, ShoppingBag, Bell, User, Shield, Settings } from 'lucide-react';
import { useNotificationBadge } from '@/hooks/use-notification-badge';
import { cn } from '@/lib/utils';
import { useUser } from '@/lib/auth-client';
import { useT } from '@/lib/i18n';

const items = [
  { href: '/feed',      icon: Home,          label: 'Accueil' },
  { href: '/dashboard', icon: LayoutDashboard,label: 'Tableau' },
  { href: '/marketplace',icon: ShoppingBag,   label: 'Marché' },
  { href: '/notifications',icon: Bell,         label: 'Notifs', badge: true },
  { href: '/profile',   icon: User,           label: 'Profil' },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { unread } = useNotificationBadge();
  const { tr } = useT();
  const { user } = useUser();

  if (user?.role === 'ADMIN') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-sand-0/90 backdrop-blur-xl border-t border-line pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="flex items-center">
          <Link
            href="/admin"
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors relative',
              pathname === '/admin' ? 'text-brand-600' : 'text-sand-500 hover:text-sand-900',
            )}
          >
            <Shield className="h-5 w-5" />
            <span className="text-[10px] font-medium">{tr("Admin")}</span>
          </Link>
          <Link
            href="/settings"
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors relative',
              pathname === '/settings' ? 'text-brand-600' : 'text-sand-500 hover:text-sand-900',
            )}
          >
            <Settings className="h-5 w-5" />
            <span className="text-[10px] font-medium">{tr("Paramètres")}</span>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-sand-0/90 backdrop-blur-xl border-t border-line pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="flex items-center">
        {items.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-[color,transform] duration-150 ease-out active:scale-[0.94]',
                active ? 'text-brand-600' : 'text-sand-500 hover:text-sand-900',
              )}
            >
              <div className={cn('relative grid h-7 w-12 place-items-center rounded-full transition-colors duration-200', active && 'bg-brand-50')}>
                <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
                {badge && unread > 0 && (
                  <span className="absolute -top-1 end-1.5 min-w-[15px] h-[15px] px-1 bg-brand-500 ring-2 ring-sand-0 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </div>
              <span className={cn('text-[10.5px]', active ? 'font-semibold' : 'font-medium')}>{tr(label)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
