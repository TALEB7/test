'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Eye,
  Heart,
  Edit,
  Trash2,
  Zap,
  MapPin,
} from 'lucide-react';
import { useT } from '@/lib/i18n';
import { LISTING_STATUS_BADGES } from '@communium/shared';
import { useMyListings, useDeleteListing, useBoostListing } from '@/hooks/marketplace';
import { getMediaUrl } from '@/lib/media-url';

export default function MyListingsPage() {
  const { t, tr, intl } = useT();

  const { data: listings, isLoading } = useMyListings();
  const deleteMutation = useDeleteListing();
  const boostMutation = useBoostListing();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 h-[calc(100vh-200px)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const columns = [
    { id: 'ACTIVE', title: tr("En ligne"), icon: '🟢', color: 'border-green-500/50' },
    { id: 'DRAFT', title: tr("Brouillons"), icon: '📝', color: 'border-brand-500/50' },
    { id: 'SOLD', title: tr("Vendus"), icon: '🤝', color: 'border-blue-500/50' },
  ];

  const getListingsByStatus = (status: string) => listings?.filter((l: any) => l.status === status) || [];

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading tracking-wide flex items-center gap-2 drop-shadow-md">
            {tr("Tableau de bord")}
          </h1>
          <p className="text-muted-foreground font-semibold">{listings?.length || 0} annonces au total</p>
        </div>
        <Link
          href="/marketplace/new"
          className="ygo-btn-gold flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {tr("Nouvelle annonce")}
        </Link>
      </div>

      {/* Empty State */}
      {(!listings || listings.length === 0) && (
        <Card className="border-2 border-primary/20 bg-card/60 backdrop-blur-md">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl drop-shadow-lg mb-4 opacity-80">📦</div>
            <h3 className="text-xl font-bold text-foreground font-heading">{tr("Aucune annonce")}</h3>
            <p className="mt-2 text-sm text-muted-foreground font-medium">
              {tr("Commencez à vendre en publiant votre première annonce.")}
            </p>
            <Link
              href="/marketplace/new"
              className="mt-6 ygo-btn-gold"
            >
              {tr("Créer une annonce")}
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Kanban Board Container */}
      {listings && listings.length > 0 && (
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4 snap-x">
          {columns.map((col) => {
            const colListings = getListingsByStatus(col.id);
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
                    <span>{col.icon}</span> {tr(col.title)}
                  </h3>
                  <Badge variant="secondary" className="font-bold bg-muted/80">{colListings.length}</Badge>
                </div>

                {/* Column Body (Scrollable) */}
                <div className="relative flex-1 p-3 overflow-y-auto space-y-4 custom-scrollbar z-10">
                  {colListings.length === 0 ? (
                    <div className="h-28 flex items-center justify-center border-2 border-dashed border-border/40 rounded-xl bg-background/20">
                      <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">{tr("Vide")}</span>
                    </div>
                  ) : (
                    colListings.map((listing: any) => {
                      const hasImage = listing.images?.length > 0;
                      return (
                        <div 
                          key={listing.id} 
                          className="group/card relative rounded-xl border border-brand-500/20 bg-sand-0 shadow-token-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-token-lg hover:border-brand-500/50 overflow-hidden cursor-grab active:cursor-grabbing backdrop-blur-sm"
                        >
                          {/* Image Thumbnail */}
                          {hasImage && (
                            <div className="h-36 w-full overflow-hidden bg-sand-100 border-b border-line relative">
                              <img
                                src={getMediaUrl(listing.images[0]) || listing.images[0]}
                                alt={listing.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110 "
                              />
                              {listing.isBoosted && (
                                <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)] flex items-center gap-1">
                                  <Zap className="h-2.5 w-2.5 fill-current" /> {tr("Boosté")}
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={`/marketplace/${listing.slug}`}
                                className="font-semibold text-[15px] text-foreground group-hover/card:text-brand-600 transition-colors line-clamp-2 leading-snug font-heading"
                              >
                                {listing.title}
                              </Link>
                            </div>

                            <p className="text-xl font-bold text-brand-600 tracking-tighter">
                              {listing.price.toLocaleString(intl)} <span className="text-[10px] uppercase text-brand-600/70">{tr("Dhs")}</span>
                            </p>

                            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              <span className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md border border-border/30">
                                <Eye className="h-3 w-3" /> {listing.viewCount}
                              </span>
                              {listing.city && (
                                <span className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md border border-border/30 truncate max-w-[140px]">
                                  <MapPin className="h-3 w-3" /> {listing.city}
                                </span>
                              )}
                            </div>

                            {/* Actions Footer */}
                            <div className="pt-3 mt-1 flex items-center justify-between gap-2 opacity-70 group-hover/card:opacity-100 transition-opacity">
                              <div className="flex gap-2">
                                <Link
                                  href={`/marketplace/${listing.slug}/edit`}
                                  className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500 hover:text-white text-blue-400 flex items-center justify-center transition-all duration-300"
                                  title={tr("Modifier")}
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Link>
                                <button
                                  onClick={() => {
                                    if (confirm(tr("Supprimer cette annonce ?"))) {
                                      deleteMutation.mutate(listing.id);
                                    }
                                  }}
                                  className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-400 flex items-center justify-center transition-all duration-300"
                                  title={tr("Supprimer")}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              {!listing.isBoosted && listing.status === 'ACTIVE' && (
                                <button
                                  onClick={() => boostMutation.mutate(listing.id)}
                                  disabled={boostMutation.isPending}
                                  className="h-8 px-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 hover:border-amber-400 text-amber-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all hover:shadow-[0_0_12px_rgba(251,191,36,0.3)] disabled:opacity-50"
                                  title={tr("Boost (10 Tks)")}
                                >
                                  <Zap className="h-3 w-3" /> {tr("Boost")}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Custom Scrollbar Styles for the columns */}
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
