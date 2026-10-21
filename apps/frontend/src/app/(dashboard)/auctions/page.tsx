'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gavel, Clock, TrendingUp, Plus, Users, Eye } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { getMediaUrl } from '@/lib/media-url';

function formatCountdown(endTime: string) {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return 'Terminée';
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (d > 0) return `${d}j ${h}h`;
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min ${s}s`;
}

function CountdownTimer({ endTime }: { endTime: string }) {
  const [text, setText] = useState(formatCountdown(endTime));

  useEffect(() => {
    const interval = setInterval(() => setText(formatCountdown(endTime)), 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const isUrgent = new Date(endTime).getTime() - Date.now() < 3600000;

  return (
    <span
      className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider drop-shadow-md ${
        isUrgent ? 'text-red-400' : 'text-white'
      }`}
    >
      <Clock className="h-3 w-3" />
      {text}
    </span>
  );
}

export default function AuctionsPage() {
  const { t, tr } = useT();

  const { data: activeAuctions, isLoading: loadingActive } = useQuery({
    queryKey: ['auctions-active'],
    queryFn: () => api.get('/auctions').then((r) => r.data),
    refetchInterval: 10000,
  });

  const { data: endedAuctions, isLoading: loadingEnded } = useQuery({
    queryKey: ['auctions-ended'],
    queryFn: () => api.get('/auctions/ended').then((r) => r.data),
  });

  const { data: myAuctions, isLoading: loadingMine } = useQuery({
    queryKey: ['my-auctions'],
    queryFn: () => api.get('/auctions/my/auctions').then((r) => r.data),
  });

  const { data: myBids, isLoading: loadingBids } = useQuery({
    queryKey: ['my-bids'],
    queryFn: () => api.get('/auctions/my/bids').then((r) => r.data),
  });

  const isLoading = loadingActive || loadingEnded || loadingMine || loadingBids;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 h-[calc(100vh-200px)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const myBidsMapped = (myBids || []).map((bid: any) => ({ ...bid.auction, myBid: bid }));

  const columns = [
    { id: 'active', title: 'En cours', icon: <Gavel className="h-4 w-4" />, data: activeAuctions?.data || [], color: 'border-green-500/50', badgeBg: 'bg-green-500' },
    { id: 'bids', title: 'Mes Mises', icon: <TrendingUp className="h-4 w-4" />, data: myBidsMapped, color: 'border-blue-500/50', badgeBg: 'bg-blue-500' },
    { id: 'mine', title: 'Mes Ventes', icon: <Users className="h-4 w-4" />, data: myAuctions || [], color: 'border-brand-500/50', badgeBg: 'bg-brand-500' },
    { id: 'ended', title: 'Terminées', icon: <Clock className="h-4 w-4" />, data: endedAuctions?.data || [], color: 'border-sand-500/50', badgeBg: 'bg-sand-500' },
  ];

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading tracking-wide flex items-center gap-2 drop-shadow-md">
            {tr("Salle des Enchères")}
          </h1>
          <p className="text-muted-foreground font-semibold">{tr("Suivez vos enchères en temps réel")}</p>
        </div>
        <Link
          href="/auctions/new"
          className="ygo-btn-gold flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {tr("Créer une enchère")}
        </Link>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 snap-x">
        {columns.map((col) => {
          return (
            <div 
              key={col.id} 
              className="flex flex-col min-w-[320px] max-w-[350px] w-full shrink-0 snap-center rounded-xl bg-card/30 backdrop-blur-xl border border-border/50 shadow-lg overflow-hidden relative group"
            >
              {/* Column Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Column Header */}
              <div className={`relative p-4 border-b-2 ${col.color} bg-background/60 backdrop-blur-md flex items-center justify-between shrink-0 z-10`}>
                <h3 className="font-bold text-[13px] tracking-widest uppercase text-foreground flex items-center gap-2 font-heading">
                  <span className={`flex items-center justify-center w-6 h-6 rounded-md ${col.badgeBg} text-white shadow-sm`}>{col.icon}</span> {tr(col.title)}
                </h3>
                <Badge variant="secondary" className="font-bold bg-muted/80">{col.data.length}</Badge>
              </div>

              {/* Column Body (Scrollable) */}
              <div className="relative flex-1 p-3 overflow-y-auto space-y-4 custom-scrollbar z-10">
                {col.data.length === 0 ? (
                  <div className="h-28 flex items-center justify-center border-2 border-dashed border-border/40 rounded-xl bg-background/20">
                    <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">{tr("Vide")}</span>
                  </div>
                ) : (
                  col.data.map((auction: any) => (
                    <AuctionCard key={auction.id} auction={auction} tab={col.id} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(228,8,44,0.2);
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(228,8,44,0.5);
        }
      `}} />
    </div>
  );
}

function AuctionCard({ auction, tab }: { auction: any; tab: string }) {
  const { tr, intl } = useT();
  const listing = auction.listing;
  const hasImage = listing?.images?.length > 0;
  const isActive = auction.status === 'ACTIVE';
  const isEnded = auction.status === 'ENDED';

  return (
    <Link href={`/auctions/${auction.id}`} className="block">
      <div className="group/card relative rounded-xl border border-brand-500/20 bg-sand-0 shadow-token-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-token-lg hover:border-brand-500/50 overflow-hidden cursor-pointer backdrop-blur-sm">
        
        {/* Image Thumbnail */}
        <div className="h-32 w-full overflow-hidden bg-sand-100 border-b border-line relative">
          {hasImage ? (
            <img
              src={getMediaUrl(listing.images[0]) || listing.images[0]}
              alt={listing?.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110 "
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl text-muted-foreground/30 group-hover/card:scale-110 transition-transform duration-700">
              🔨
            </div>
          )}

          {/* Status Badge */}
          <div className={`absolute left-2 top-2 px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider shadow-md ${
            isActive ? 'bg-green-500 text-white' : isEnded ? 'bg-sand-600 text-white' : auction.status === 'SCHEDULED' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {isActive ? tr("🟢 En cours") : isEnded ? tr("🏁 Terminée") : auction.status}
          </div>

          {/* Countdown */}
          {isActive && (
            <div className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 backdrop-blur-md border border-white/10">
              <CountdownTimer endTime={auction.endTime} />
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-[14px] text-foreground group-hover/card:text-brand-600 transition-colors line-clamp-2 leading-snug font-heading">
            {listing?.title}
          </h3>

          {/* Prices */}
          <div className="flex items-end justify-between border-t border-brand-500/10 pt-2 mt-2">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">{tr("Actuel")}</p>
              <p className="text-lg font-bold text-brand-600 tracking-tighter leading-none">
                {(auction.currentPrice || auction.startingPrice).toLocaleString(intl)} <span className="text-[9px] uppercase text-brand-600/70">{tr("Dhs")}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">{tr("Départ")}</p>
              <p className="text-sm font-bold text-muted-foreground leading-none">
                {auction.startingPrice.toLocaleString(intl)} <span className="text-[9px] uppercase">{tr("Dhs")}</span>
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-background/30 rounded-md p-1.5 border border-border/30">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-blue-400" />
              {auction.totalBids} mises
            </span>
            {auction.minIncrement && (
              <span className="text-amber-500/80">Min +{auction.minIncrement.toLocaleString(intl)}</span>
            )}
          </div>

          {/* My bid info */}
          {tab === 'bids' && auction.myBid && (
            <div
              className={`rounded-md p-2 text-center text-[10px] font-bold uppercase tracking-wider ${
                auction.myBid.isWinning
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              Ma mise: {auction.myBid.amount.toLocaleString(intl)} Dhs
              {auction.myBid.isWinning ? tr(" ✅ Tête") : tr(" ❌ Surenchéri")}
            </div>
          )}

          {/* Winner */}
          {isEnded && auction.winner && (
            <div className="rounded-md bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-2 text-center text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30">
              🏆 Gagné par {auction.winner.firstName} {auction.winner.lastName?.[0]}.
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
