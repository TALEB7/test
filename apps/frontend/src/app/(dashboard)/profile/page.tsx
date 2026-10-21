'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Pencil, FileText, ShoppingBag, Image as ImageIcon, Film, Music,
  FolderOpen, Heart, MessageCircle, AlertCircle, Download
} from 'lucide-react';
import Link from 'next/link';
import { getMediaUrl } from '@/lib/media-url';
import KycStatusBadge from '@/components/kyc/KycStatusBadge';
import { ProfileSheet } from '@/components/profile/profile-sheet';
import { useT } from '@/lib/i18n';

export default function ProfilePage() {
  const { data: session } = useSession();
  const { userId } = useAuth();
  const user = session?.user as any;
  const [activeTab, setActiveTab] = useState('profile');
  const { tr, intl } = useT();

  // Fetch complete profile info
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/profiles/me').then((res) => res.data),
  });

  // Fetch KYC status
  const { data: kyc } = useQuery({
    queryKey: ['kyc-status'],
    queryFn: () => api.get('/kyc/status').then((res) => res.data),
  });

  // Fetch User's Posts for Timeline
  const { data: userPostsData } = useQuery({
    queryKey: ['user-posts', profile?.id],
    queryFn: () => api.get(`/forums/posts/user/${profile.id}`).then((res) => res.data),
    enabled: !!profile?.id,
  });

  // Fetch User's Listings for Marketplace
  const { data: userListingsData } = useQuery({
    queryKey: ['user-listings', profile?.id],
    queryFn: () => api.get('/marketplace/listings', { params: { sellerId: profile.id } }).then((res) => res.data),
    enabled: !!profile?.id,
  });

  const isBusiness = profile?.accountType === 'business' || profile?.accountType === 'company_creation';
  const displayName = isBusiness ? (profile?.companyName || tr('Entreprise')) : `${profile?.firstName || user?.firstName || ''} ${profile?.lastName || user?.lastName || ''}`.trim() || tr('Utilisateur');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'photos', label: 'Photos' },
    { id: 'videos', label: 'Videos' },
    { id: 'music', label: 'Music' },
    { id: 'documents', label: 'Documents' },
    { id: 'marketplace', label: 'Marketplace' },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <ProfileSheet
        profile={profile}
        isBusiness={isBusiness}
        displayName={displayName}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        editable
        actions={
          <>
            <Link
              href={isBusiness ? "/profile/edit?type=business" : "/profile/edit?type=personal"}
              className="btn-primary btn-sm"
            >
              <Pencil />
              {tr('Modifier le profil')}
            </Link>
            <Badge variant={isBusiness ? "default" : "secondary"}>
              {tr(profile?.accountType === "company_creation" ? "Création d'entreprise" : isBusiness ? "Business" : "Personnel")}
            </Badge>
            {kyc && kyc.status && kyc.status !== "none" && (
              <KycStatusBadge status={kyc.status} type={kyc.type || profile?.accountType} />
            )}
            {!isBusiness && (!kyc || kyc.status === "none" || kyc.status === "rejected") && (
              <Link href="/onboarding/verify/personal" className="text-xs font-bold text-[var(--red-500)] underline underline-offset-2">
                {tr('Vérifier mon identité')}
              </Link>
            )}
          </>
        }
      >
        {activeTab === "timeline" && (
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">{tr("Fil d'actualité")}</h3>
            {userPostsData?.posts && userPostsData.posts.length > 0 ? (
              userPostsData.posts.map((post: any) => (
                <Card key={post.id} className="hover:border-primary/40 transition">
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-accent overflow-hidden shrink-0 flex items-center justify-center border">
                        {profile?.avatarUrl ? (
                          <img src={getMediaUrl(profile.avatarUrl)!} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-primary">{displayName[0]}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground leading-tight">{displayName}</h4>
                        <p className="text-[10px] text-muted-foreground">{new Date(post.createdAt).toLocaleDateString(intl, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-foreground hover:text-primary transition font-heading">
                        <Link href={`/forums/posts/${post.id}`}>{post.title}</Link>
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-3">{post.content}</p>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((t: string) => (
                          <span key={t} className="text-[10px] text-primary bg-primary/5 px-2 py-0.5 rounded-full font-bold">#{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 border-t border-border/40 pt-2 text-[10px] font-bold text-muted-foreground">
                      <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {tr("{n} J'aime", { n: post._count?.likes || 0 })}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {tr("{n} commentaires", { n: post._count?.comments || 0 })}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-card border border-border rounded-xl">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground font-semibold">{tr("Aucune publication sur le fil d'actualité pour le moment.")}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "marketplace" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">{tr("Annonces publiées")}</h3>
            {userListingsData?.data && userListingsData.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {userListingsData.data.map((listing: any) => (
                  <Card key={listing.id} className="overflow-hidden hover:border-primary/40 transition">
                    <div className="h-40 bg-accent relative flex items-center justify-center border-b overflow-hidden">
                      {listing.images && listing.images.length > 0 ? (
                        <img src={getMediaUrl(listing.images[0])!} alt={listing.title} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                      )}
                      <div className="absolute top-2 right-2 bg-primary text-white font-semibold text-[10px] px-2 py-0.5 rounded-full">
                        {listing.price} MAD
                      </div>
                    </div>
                    <CardContent className="pt-3 space-y-1">
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-primary">{listing.category?.name}</span>
                      <h4 className="text-xs font-bold text-foreground line-clamp-1 hover:text-primary transition">
                        <Link href={`/marketplace/listings/${listing.slug}`}>{listing.title}</Link>
                      </h4>
                      <p className="text-[10px] text-muted-foreground line-clamp-2">{listing.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[9px] text-muted-foreground font-bold">
                        <span>{tr('État')} : {tr(listing.condition === 'new' ? 'Neuf' : listing.condition === 'like_new' ? 'Comme neuf' : 'Bon état')}</span>
                        <span>{listing.city}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card border border-border rounded-xl">
                <ShoppingBag className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground font-semibold">{tr("Aucune annonce en ligne dans le Marketplace.")}</p>
              </div>
            )}
          </div>
        )}

        {(activeTab === "photos" || activeTab === "videos" || activeTab === "music" || activeTab === "documents") && (
          <MediaTab type={activeTab} userId={userId} />
        )}
      </ProfileSheet>
    </div>
  );
}

// Helper component for Sidebar Identity values
function InfoRowSidebar({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-bold">{value}</span>
    </div>
  );
}

// ─── MediaTab — Real media grid from ProfileMedia API ────────────────────
function MediaTab({ type, userId }: { type: string; userId?: string | null }) {
  const { tr } = useT();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['profile-media', 'me', type],
    queryFn: () => api.get(`/profile-media/me?type=${type}`).then((r) => r.data),
    enabled: !!userId,
    staleTime: 30000,
  });

  const icons: Record<string, any> = {
    photos: ImageIcon, videos: Film, music: Music, documents: FolderOpen,
  };
  const Icon = icons[type] || FolderOpen;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-card border border-border rounded-xl max-w-xl mx-auto">
        <Icon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          {tr(type === 'photos' ? 'Aucune photo' : type === 'videos' ? 'Aucune vidéo' : type === 'music' ? 'Aucune musique' : 'Aucun document')}
        </h4>
        <p className="text-xs text-muted-foreground font-semibold mt-1">
          {tr("Publiez depuis la page d'accueil pour remplir cet espace.")}
        </p>
        <Link href="/feed" className="mt-3 inline-block text-xs text-primary font-bold hover:underline">
          {tr('Aller publier →')}
        </Link>
      </div>
    );
  }

  // Photos grid
  if (type === 'photos') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {items.map((item: any) => (
          <div key={item.id} className="relative group aspect-square overflow-hidden rounded-xl border border-border bg-accent">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getMediaUrl(item.url) || item.url}
              alt={item.name || tr('Photo')}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {item.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition">
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Videos grid
  if (type === 'videos') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-xl overflow-hidden border border-border bg-card">
            <video
              src={getMediaUrl(item.url) || item.url}
              controls
              className="w-full max-h-56 bg-black"
            />
            {item.caption && (
              <p className="text-xs text-muted-foreground px-3 py-2 truncate">{item.caption}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Music list
  if (type === 'music') {
    return (
      <div className="space-y-2">
        {items.map((item: any) => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent transition">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
              <Music className="h-5 w-5 text-purple-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{item.name || 'Audio'}</p>
              {item.caption && <p className="text-xs text-muted-foreground truncate">{item.caption}</p>}
            </div>
            <audio src={getMediaUrl(item.url) || item.url} controls className="h-8 max-w-[180px]" />
          </div>
        ))}
      </div>
    );
  }

  // Documents list
  return (
    <div className="space-y-2">
      {items.map((item: any) => (
        <a
          key={item.id}
          href={getMediaUrl(item.url) || item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent transition group"
        >
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{item.name || 'Document'}</p>
            {item.caption && <p className="text-xs text-muted-foreground truncate">{item.caption}</p>}
          </div>
          <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
        </a>
      ))}
    </div>
  );
}
