'use client';

import { useState } from 'react';
import { User } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/lib/auth-client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { getMediaUrl } from '@/lib/media-url';

export function UserProfileCard() {
  const { user } = useUser();
  const [imgFailed, setImgFailed] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/profiles/me').then((r) => r.data),
    enabled: !!user?.id,
    staleTime: 60000,
  });

  const dbFirstName = profile?.firstName || user?.firstName;
  const dbLastName = profile?.lastName || user?.lastName;
  const firstName = dbFirstName || 'Demo';
  const lastName  = dbLastName || 'User';
  const fullName  = `${firstName} ${lastName}`;
  const memberId  = user?.id ? `#${user.id.slice(-6).toUpperCase()}` : '#COM-001';

  const isBusiness =
    profile?.accountType === 'business' ||
    profile?.accountType === 'company_creation' ||
    user?.accountType === 'business' ||
    user?.accountType === 'company_creation';
  const displayName = isBusiness ? (profile?.companyName || fullName) : fullName;

  const avatarSrc =
    profile?.avatarUrl                 ||
    profile?.personalProfile?.photoUrl ||
    profile?.businessProfile?.logoUrl  ||
    (user as any)?.avatarUrl           ||
    null;

  const resolvedUrl = getMediaUrl(avatarSrc);

  return (
    <Link
      href="/profile"
      className="flex items-center gap-2.5 rounded-full border border-line bg-sand-0 py-1 ps-1 pe-1 sm:pe-3.5 hover:border-line-strong hover:shadow-token-sm transition-[border-color,box-shadow,transform] duration-200 ease-out active:scale-[0.98] cursor-pointer"
    >
      {/* Avatar */}
      <div className="avatar-glow h-7 w-7 shrink-0 rounded-full overflow-hidden flex items-center justify-center">
        {resolvedUrl && !imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolvedUrl}
            alt={displayName}
            className="h-full w-full object-cover rounded-full"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <User className="h-4 w-4 text-sand-600" />
        )}
      </div>

      {/* Name & ID */}
      <div className="hidden sm:block leading-tight">
        <p className="text-[13px] font-semibold text-sand-900 truncate max-w-[120px]">
          {displayName}
        </p>
        <p className="text-[10px] font-medium text-sand-500 tracking-wide font-mono" dir="ltr">
          {memberId}
        </p>
      </div>
    </Link>
  );
}
