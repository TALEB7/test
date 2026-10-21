'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth, useUser } from '@/lib/auth-client';
import { api } from '@/lib/api';
import { useT } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users, ShoppingBag, Coins, TrendingUp,
  MessageCircle, Bell, Award, GraduationCap,
  Calendar, Users2, Bookmark, MessagesSquare,
  Activity, CreditCard, ArrowRight,
} from 'lucide-react';
import { DashboardSkeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function DashboardPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const { t } = useT();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard', userId],
    queryFn: () => api.get(`/analytics/dashboard/${userId}`).then((r) => r.data),
    enabled: !!userId,
  });

  if (isLoading) return <DashboardSkeleton />;

  const stats        = dashboard?.stats        || {};
  const tokens       = dashboard?.tokens       || {};
  const membership   = dashboard?.membership;
  const notifications= dashboard?.notifications|| {};
  const messages     = dashboard?.messages     || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-heading tracking-wide">
          {t.dashboard.greeting}, <span className="text-primary">{user?.firstName ?? dashboard?.user?.firstName ?? 'Demo'}</span>
        </h1>
        <p className="mt-1 text-muted-foreground">{t.dashboard.overview}</p>
        <div aria-hidden="true" className="ygo-accent-line max-w-xs mt-4 [background:linear-gradient(90deg,hsl(var(--primary)),transparent)]" />
      </div>

      {/* Key Metrics */}
      <div className="stagger grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Users className="h-4 w-4 text-primary" />}       label={t.dashboard.connectionsLabel} value={stats.connections ?? 0} />
        <StatCard icon={<ShoppingBag className="h-4 w-4 text-primary" />} label={t.dashboard.listingsLabel}    value={stats.listings ?? 0} />
        <StatCard icon={<Coins className="h-4 w-4 text-primary" />}       label={t.dashboard.tksBalance}       value={tokens.balance ?? 0} sub={t.dashboard.tokensAvailable} />
        <StatCard icon={<TrendingUp className="h-4 w-4 text-primary" />}  label={t.dashboard.profileViews}     value={dashboard?.user?.profileViews ?? 0} sub={t.dashboard.total} />
      </div>

      {/* Notifications + Messages + Membership */}
      <div className="stagger grid gap-4 md:grid-cols-3">
        <Card className="border-border">
          <CardContent className="pt-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.dashboard.notifications}</p>
                <p className="text-xs text-muted-foreground">{t.dashboard.unreadNotif.replace('{n}', String(notifications.unread ?? 0))}</p>
              </div>
            </div>
            <Link href="/notifications" className="text-xs text-primary font-semibold hover:underline">
              {t.common.see} <ArrowRight className="inline h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gem-sapphire/10 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-gem-sapphire" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.dashboard.messages}</p>
                <p className="text-xs text-muted-foreground">{t.dashboard.unreadMsg.replace('{n}', String(messages.unread ?? 0))}</p>
              </div>
            </div>
            <Link href="/messages" className="text-xs text-primary font-semibold hover:underline">
              {t.common.see} <ArrowRight className="inline h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.dashboard.membershipLabel}</p>
                <p className="text-xs text-muted-foreground">
                  {membership?.plan
                    ? <Badge variant="outline" className="text-[10px] border-primary text-primary">{membership.plan}</Badge>
                    : t.common.free}
                </p>
              </div>
            </div>
            <Link href="/membership" className="text-xs text-primary font-semibold hover:underline">
              {t.common.manage} <ArrowRight className="inline h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Activity mini stats */}
      <div className="stagger grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        <MiniStat icon={MessagesSquare} label={t.dashboard.forumPosts}       value={stats.forumPosts ?? 0} />
        <MiniStat icon={Award}          label={t.dashboard.badgesLabel}       value={stats.badges ?? 0} />
        <MiniStat icon={GraduationCap}  label={t.dashboard.mentorshipLabel}   value={stats.mentorshipSessions ?? 0} />
        <MiniStat icon={Calendar}       label={t.dashboard.eventsLabel}       value={stats.events ?? 0} />
        <MiniStat icon={Users2}         label={t.dashboard.groupsLabel}       value={stats.groups ?? 0} />
        <MiniStat icon={Bookmark}       label={t.dashboard.favoritesLabel}    value={stats.bookmarks ?? 0} />
      </div>

      {/* Quick actions */}
      <Card className="border-border">
        <CardHeader>
          <h2 className="ygo-section-title">{t.dashboard.quickActions}</h2>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickAction href="/profile"     title={t.dashboard.completeProfile}      description={t.dashboard.completeProfileDesc} />
          <QuickAction href="/marketplace" title={t.dashboard.exploreMarketplace}   description={t.dashboard.exploreMarketplaceDesc} />
          <QuickAction href="/forums"      title={t.dashboard.joinForums}            description={t.dashboard.joinForumsDesc} />
          <QuickAction href="/events"      title={t.dashboard.discoverEvents}        description={t.dashboard.discoverEventsDesc} />
          <QuickAction href="/tokens"      title={t.dashboard.myTokens}              description={t.dashboard.myTokensDesc} />
          <QuickAction href="/badges"      title={t.dashboard.myBadges}              description={t.dashboard.myBadgesDesc} />
        </CardContent>
      </Card>

      {/* Recent activity link */}
      {dashboard?.recentActivity > 0 && (
        <Card className="border-border">
          <CardContent className="pt-5 flex items-center gap-3">
            <Activity className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              {t.dashboard.recentActivity.replace('{n}', String(dashboard.recentActivity))}
            </p>
            <Link href="/feed" className="ml-auto text-xs text-primary font-semibold hover:underline">
              {t.dashboard.seeFeed} <ArrowRight className="inline h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Stat plate — styled after the ATK/DEF band of a monster card
function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: number | string; sub?: string }) {
  const { intl, tr } = useT();
  return (
    <div className="ygo-stat !px-5 !py-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{tr(label)}</p>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
          {icon}
        </span>
      </div>
      <div className="mt-3 font-heading text-3xl font-bold tabular-nums text-foreground">
        {typeof value === 'number' ? value.toLocaleString(intl) : value}
      </div>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  const { tr } = useT();
  return (
    <div className="surface-card p-3 text-center">
      <Icon className="h-4 w-4 text-primary mx-auto mb-1.5" />
      <p className="text-lg font-bold tabular-nums text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{tr(label)}</p>
    </div>
  );
}

function QuickAction({ href, title, description }: { href: string; title: string; description: string }) {
  const { tr } = useT();
  return (
    <Link href={href} className="card-interactive surface-card group flex items-start justify-between gap-3 p-4 transition-[border-color,box-shadow,transform] duration-200 ease-out">
      <div>
        <h3 className="font-semibold text-foreground text-sm transition-colors duration-150 group-hover:text-primary">{tr(title)}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-[transform,color] duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}
