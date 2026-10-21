'use client';

import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BadgeCheck, Camera, ChevronDown, Diamond, ImagePlus, Loader2, Mail, MapPin, Phone, Cake, Globe2 } from 'lucide-react';
import { api } from '@/lib/api';
import { getMediaUrl } from '@/lib/media-url';
import { uploadImage } from './upload-image';
import { useT } from '@/lib/i18n';

// LinkedIn-style profile (cover, overlapping portrait, headline, quick links,
// then Experience / Education / Skills cards) in the Communium game layer:
// night cover, parchment cards, logo-red accent.

export type SheetTab = { id: string; label: string };

type Props = {
  profile: any;
  isBusiness: boolean;
  displayName: string;
  tabs: SheetTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  /** Show the "change photo / cover" controls (own profile only). */
  editable?: boolean;
  /** Buttons and status badges shown under the headline. */
  actions?: React.ReactNode;
  /** Content for every tab except "profile". */
  children?: React.ReactNode;
};

const ACCENT = 'var(--red-500)';

export function ProfileSheet({ profile, isBusiness, displayName, tabs, activeTab, onTabChange, editable, actions, children }: Props) {
  return (
    <div className="page-enter mx-auto w-full max-w-[920px] space-y-3">
      <HeaderCard
        profile={profile}
        isBusiness={isBusiness}
        displayName={displayName}
        editable={editable}
        actions={actions}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      {activeTab === 'profile' ? <ProfileInfo profile={profile} isBusiness={isBusiness} /> : <div className="pt-2">{children}</div>}
    </div>
  );
}

// ─── Header card ────────────────────────────────────────────────────────

function HeaderCard({
  profile, isBusiness, displayName, editable, actions, tabs, activeTab, onTabChange,
}: Omit<Props, 'children'>) {
  const { tr, intl } = useT();
  const [showContact, setShowContact] = useState(false);
  const p = profile || {};

  const headline = isBusiness ? p.activities : p.profession;
  const location = isBusiness
    ? p.headquarters || [p.city, p.country].filter(Boolean).join(', ')
    : [p.city, p.country].filter(Boolean).join(', ');

  const { data: connectionCount } = useQuery({
    queryKey: ['connection-count', p.id],
    queryFn: () => api.get(`/connections/${p.id}/count`).then((r) => r.data),
    enabled: !!p.id,
    staleTime: 60_000,
  });
  const count = typeof connectionCount === 'number' ? connectionCount : connectionCount?.count;

  // Right-hand quick links: current company + school (people), HQ + website (companies)
  const work = sortByStart(asList(p.workHistory));
  const current = work.find((w: any) => isPresent(w.endDate)) || work[0];
  const school = asList(p.education)[0];
  const quick: { name: string; sub?: string }[] = isBusiness
    ? [p.subsidiaries?.length && { name: p.subsidiaries.join(', '), sub: tr('Filiales') }].filter(Boolean) as any
    : [current?.company && { name: current.company }, school && { name: school.school || school.degree }].filter(Boolean) as any;

  const contactRows: [React.ReactNode, string, React.ReactNode][] = [
    [<Phone key="p" />, tr('Téléphone'), p.phone],
    [<Mail key="m" />, tr('Email'), p.email && <a href={`mailto:${p.email}`} className="hover:underline">{p.email}</a>],
    [<Globe2 key="w" />, tr('Site web'), p.website && <a href={withProtocol(p.website)} target="_blank" rel="noopener noreferrer" className="hover:underline">{p.website}</a>],
    [<Cake key="b" />, isBusiness ? tr('Création') : tr('Anniversaire'), formatLongDate(isBusiness ? p.creationDate : p.birthday, intl)],
    [<MapPin key="a" />, tr('Adresse'), p.address],
  ];
  const visibleContact = contactRows.filter(([, , v]) => v);

  return (
    <section className="card overflow-hidden !border-0 !shadow-none">
      <Cover profile={p} editable={editable} isBusiness={isBusiness} />

      <div className="relative px-5 pb-1 sm:px-7">
        <div className="-mt-16 sm:-mt-24">
          <Portrait profile={p} displayName={displayName} isBusiness={isBusiness} editable={editable} />
        </div>

        <div className="mt-3 grid gap-5 sm:grid-cols-[1fr_minmax(0,240px)]">
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 font-title text-[26px] font-semibold leading-tight text-[var(--sand-900)] sm:text-[30px]">
              {displayName}
              {p.isVerified && <BadgeCheck className="h-6 w-6 shrink-0" style={{ color: ACCENT }} aria-label={tr("Vérifié")} />}
            </h1>
            {headline && <p className="mt-1 text-[16px] leading-snug text-[var(--sand-900)] sm:text-[17px]">{headline}</p>}

            <p className="mt-2 text-sm text-[var(--sand-600)]">
              {location}
              {location && visibleContact.length > 0 && ' · '}
              {visibleContact.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowContact((v) => !v)}
                  aria-expanded={showContact}
                  className="inline-flex items-center gap-0.5 font-bold hover:underline"
                  style={{ color: ACCENT }}
                >
                  {tr('Contact info')}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showContact ? 'rotate-180' : ''}`} />
                </button>
              )}
            </p>

            {showContact && (
              <dl className="mt-3 grid gap-2 rounded-xl border border-[var(--sand-200)] bg-[var(--sand-25)]/60 p-4 text-sm sm:grid-cols-2">
                {visibleContact.map(([icon, label, value]) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-[var(--sand-600)] [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
                    <div className="min-w-0">
                      <dt className="text-xs font-bold text-[var(--sand-600)]">{label}</dt>
                      <dd className="break-words text-[var(--sand-900)]">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            )}

            {typeof count === 'number' && (
              <p className="mt-2 text-sm font-bold text-[var(--sand-600)]">
                {tr(count === 1 ? '{n} connexion' : '{n} connexions', { n: count.toLocaleString(intl) })}
              </p>
            )}

            {actions && <div className="mt-4 flex flex-wrap items-center gap-2">{actions}</div>}
          </div>

          {quick.length > 0 && (
            <ul className="space-y-3 self-start sm:pt-1">
              {quick.map((q) => (
                <li key={q.name} className="flex items-center gap-3">
                  <OrgMark name={q.name} size={36} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[var(--sand-900)]">{q.name}</p>
                    {q.sub && <p className="text-xs text-[var(--sand-600)]">{q.sub}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Tabs */}
      <nav aria-label={tr("Sections du profil")} className="mt-4 flex overflow-x-auto border-t border-[var(--sand-200)] px-3 sm:px-5">
        {tabs.map((t) => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              aria-current={active ? 'page' : undefined}
              className={`relative shrink-0 px-3 py-3.5 text-sm font-bold transition-colors ${
                active ? 'text-[var(--sand-900)]' : 'text-[var(--sand-600)] hover:text-[var(--sand-900)]'
              }`}
            >
              {tr(t.label)}
              {active && <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-t" style={{ background: ACCENT }} />}
            </button>
          );
        })}
      </nav>
    </section>
  );
}

// ─── Cover & portrait ───────────────────────────────────────────────────

/** Saves one image field straight onto the profile, then refreshes it. */
function usePhotoField(field: 'avatarUrl' | 'coverUrl', isBusiness: boolean) {
  const { tr } = useT();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const url = await uploadImage(file, field === 'avatarUrl' ? 'avatars' : 'covers');
      await api.put('/profiles/me', { accountType: isBusiness ? 'business' : 'personal', [field]: url });
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['profile'] }),
        qc.invalidateQueries({ queryKey: ['public-profile'] }),
      ]);
    } catch (e: any) {
      setError(e?.message || "Erreur d'upload");
    } finally {
      setBusy(false);
    }
  };
  return { busy, error: error && tr(error), save };
}

function FilePicker({ onPick, children }: { onPick: (f: File) => void; children: (open: () => void) => React.ReactNode }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      {children(() => ref.current?.click())}
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = '';
        }}
      />
    </>
  );
}

function Cover({ profile, editable, isBusiness }: { profile: any; editable?: boolean; isBusiness: boolean }) {
  const src = getMediaUrl(profile?.coverUrl);
  const [failed, setFailed] = useState(false);
  const { busy, error, save } = usePhotoField('coverUrl', isBusiness);
  const { tr } = useT();
  const show = src && !failed;

  return (
    <div className="relative aspect-[3/1] w-full overflow-hidden sm:aspect-[4/1]">
      {show ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <div
          className="h-full w-full"
          style={{
            background:
              'radial-gradient(40rem 18rem at 12% 120%, rgb(228 8 44 / .35), transparent 60%),' +
              'radial-gradient(30rem 16rem at 100% 0%, rgb(90 70 170 / .45), transparent 65%),' +
              'linear-gradient(180deg, var(--sand-700), var(--sand-900))',
          }}
        />
      )}

      {editable && (
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          <FilePicker onPick={save}>
            {(open) => (
              <button type="button" onClick={open} disabled={busy} aria-busy={busy} className="btn-outline btn-sm">
                {busy ? <Loader2 /> : <ImagePlus />}
                <span className="hidden sm:inline">{show ? tr('Changer la couverture') : tr('Ajouter une couverture')}</span>
              </button>
            )}
          </FilePicker>
          {error && <p className="rounded-md bg-black/70 px-2 py-1 text-xs text-white">{error}</p>}
        </div>
      )}
    </div>
  );
}

function Portrait({ profile, displayName, isBusiness, editable }: { profile: any; displayName: string; isBusiness: boolean; editable?: boolean }) {
  const src = getMediaUrl(profile?.avatarUrl);
  const [failed, setFailed] = useState(false);
  const { busy, error, save } = usePhotoField('avatarUrl', isBusiness);
  const { tr } = useT();
  const show = src && !failed;
  // Companies get a rounded square so a whole logo fits; people a circle.
  const shape = isBusiness ? 'rounded-[22px]' : 'rounded-full';

  return (
    <div className="relative inline-block">
      <div
        className={`relative grid h-32 w-32 place-items-center overflow-hidden sm:h-40 sm:w-40 ${shape} ${isBusiness ? 'bg-white' : 'bg-[var(--sand-800)]'}`}
        style={{ boxShadow: '0 0 0 4px var(--sand-0), 0 0 0 6px var(--red-500), var(--shadow-md)' }}
      >
        {show ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={displayName}
            className={`h-full w-full ${isBusiness ? 'object-contain p-3' : 'object-cover'}`}
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="font-title text-5xl font-semibold text-[var(--red-400)]">{displayName[0]?.toUpperCase() || 'U'}</span>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-black/45">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>

      {editable && (
        <FilePicker onPick={save}>
          {(open) => (
            <button
              type="button"
              onClick={open}
              disabled={busy}
              aria-label={show ? tr('Changer la photo de profil') : tr('Ajouter une photo de profil')}
              className="btn-primary absolute bottom-1 right-1 !h-10 !min-h-0 !w-10 !rounded-full !p-0"
            >
              <Camera />
            </button>
          )}
        </FilePicker>
      )}
      {error && <p className="mt-2 text-xs font-bold" style={{ color: ACCENT }}>{error}</p>}
    </div>
  );
}

// ─── Profile tab ────────────────────────────────────────────────────────

function ProfileInfo({ profile, isBusiness }: { profile: any; isBusiness: boolean }) {
  const { tr } = useT();
  const p = profile || {};

  return (
    <>
      <Card title={tr("About")}>
        {p.bio ? <ExpandableText text={p.bio} /> : <Empty>{tr("Aucune présentation rédigée pour le moment.")}</Empty>}
      </Card>

      {!isBusiness && (
        <>
          <Card title={tr("Experience")}>
            {asList(p.workHistory).length ? <ExperienceList entries={p.workHistory} /> : <Empty>{tr("Aucune expérience enregistrée.")}</Empty>}
          </Card>

          <Card title={tr("Education")}>
            {asList(p.education).length ? (
              <ul className="divide-y divide-[var(--sand-200)]">
                {asList(p.education).map((e: any, i: number) => (
                  <li key={i} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <OrgMark name={e.school || e.degree} />
                    <div className="min-w-0">
                      <p className="font-bold text-[var(--sand-900)]">{e.school || e.degree}</p>
                      {e.school && e.degree && <p className="text-sm text-[var(--sand-900)]">{e.degree}</p>}
                      <DateLine start={e.startDate} end={e.endDate} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>{tr("Aucune formation enregistrée.")}</Empty>
            )}
          </Card>

          <SkillsCard technical={asList(p.technicalSkills)} soft={asList(p.softSkills)} />

          {asList(p.languages).length > 0 && (
            <Card title={tr("Languages")}>
              <ul className="divide-y divide-[var(--sand-200)]">
                {asList(p.languages).map((l: any, i: number) => (
                  <li key={i} className="py-2.5 first:pt-0 last:pb-0">
                    <p className="font-bold text-[var(--sand-900)]">{l.language}</p>
                    {l.level && <p className="text-sm text-[var(--sand-600)]">{l.level}</p>}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {(asList(p.interests).length > 0 || asList(p.sports).length > 0 || asList(p.gaming).length > 0) && (
            <Card title={tr("Interests")}>
              <div className="space-y-3">
                {asList(p.interests).length > 0 && <Chips items={p.interests} />}
                {asList(p.sports).length > 0 && <LabeledRow label={tr("Sports")} value={p.sports.join(' · ')} />}
                {asList(p.gaming).length > 0 && <LabeledRow label={tr("Gaming")} value={p.gaming.join(' · ')} />}
              </div>
            </Card>
          )}
        </>
      )}

      {isBusiness && (
        <>
          <Card title={tr("Projects")}>
            {asList(p.projects).length ? (
              <ul className="divide-y divide-[var(--sand-200)]">
                {asList(p.projects).map((pr: any, i: number) => (
                  <li key={i} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <OrgMark name={pr.name} />
                    <div className="min-w-0">
                      <p className="font-bold text-[var(--sand-900)]">
                        {pr.url ? (
                          <a href={withProtocol(pr.url)} target="_blank" rel="noopener noreferrer" className="hover:underline">{pr.name}</a>
                        ) : pr.name}
                      </p>
                      <DateLine start={pr.startDate} end={pr.endDate} />
                      {pr.location && <p className="text-sm text-[var(--sand-600)]">{pr.location}</p>}
                      {pr.description && <p className="mt-1.5 text-sm text-[var(--sand-900)]">{pr.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>{tr("Aucun projet ajouté pour le moment.")}</Empty>
            )}
          </Card>

          {(asList(p.licenses).length > 0 || asList(p.certifications).length > 0) && (
            <Card title={tr("Licenses & Certifications")}>
              <div className="space-y-3">
                {asList(p.licenses).length > 0 && <LabeledRow label={tr("Licenses")} value={<Chips items={p.licenses} />} />}
                {asList(p.certifications).length > 0 && <LabeledRow label={tr("Certifications")} value={<Chips items={p.certifications} />} />}
              </div>
            </Card>
          )}

          {(asList(p.humanResources).length > 0 || asList(p.technicalEquipment).length > 0) && (
            <Card title={tr("Team & Equipment")}>
              <div className="grid gap-5 sm:grid-cols-2">
                {asList(p.humanResources).length > 0 && (
                  <CountList label={tr("Team")} items={asList(p.humanResources).map((h: any) => [h.count, h.role])} />
                )}
                {asList(p.technicalEquipment).length > 0 && (
                  <CountList label={tr("Equipment")} items={asList(p.technicalEquipment).map((e: any) => [e.count, e.name])} />
                )}
              </div>
            </Card>
          )}

          {(asList(p.events).length > 0 || asList(p.onlineMeetings).length > 0 || asList(p.trainingPrograms).length > 0) && (
            <Card title={tr("Events & Training")}>
              <ul className="divide-y divide-[var(--sand-200)]">
                {[
                  ...asList(p.events).map((e: any) => ({ kind: tr('Événement'), title: e.title, date: e.date, where: e.location })),
                  ...asList(p.onlineMeetings).map((m: any) => ({ kind: tr('Réunion en ligne'), title: m.title, date: m.date, where: m.platform })),
                  ...asList(p.trainingPrograms).map((t: any) => ({ kind: tr('Formation'), title: t.title, date: t.date, where: t.location })),
                ].map((ev, i) => (
                  <li key={i} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <DateTile date={ev.date} />
                    <div className="min-w-0">
                      <p className="font-bold text-[var(--sand-900)]">{ev.title || ev.kind}</p>
                      <p className="text-sm text-[var(--sand-600)]">{[ev.kind, ev.where].filter(Boolean).join(' · ')}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card title={tr("Sectors of Interest")}>
            {asList(p.sectorsOfInterests).length ? <Chips items={p.sectorsOfInterests} /> : <Empty>{tr("Aucun secteur d'intérêt ajouté.")}</Empty>}
          </Card>

          {(p.rc || p.ice || p.ifNumber) && (
            <Card title={tr("Legal Information")}>
              <div className="grid gap-3 sm:grid-cols-3">
                {p.rc && <LabeledRow label={tr("RC")} value={p.rc} />}
                {p.ice && <LabeledRow label={tr("ICE")} value={p.ice} />}
                {p.ifNumber && <LabeledRow label={tr("IF")} value={p.ifNumber} />}
              </div>
            </Card>
          )}
        </>
      )}
    </>
  );
}

// ─── Experience (LinkedIn grouping) ─────────────────────────────────────

function ExperienceList({ entries }: { entries: any[] }) {
  const { tr } = useT();
  // Keep the member's own order; every role at the same company is grouped
  // under that company's first appearance, newest role first, with a timeline.
  const groups: { company: string; roles: any[] }[] = [];
  const byCompany = new Map<string, { company: string; roles: any[] }>();
  for (const e of asList(entries)) {
    const key = norm(e.company);
    const existing = key ? byCompany.get(key) : undefined;
    if (existing) existing.roles.push(e);
    else {
      const g = { company: e.company || '', roles: [e] };
      groups.push(g);
      if (key) byCompany.set(key, g);
    }
  }
  groups.forEach((g) => { g.roles = sortByStart(g.roles); });

  return (
    <ul className="divide-y divide-[var(--sand-200)]">
      {groups.map((g, gi) => (
        <li key={gi} className="flex gap-3 py-4 first:pt-0 last:pb-0">
          <OrgMark name={g.company || g.roles[0].title} />
          <div className="min-w-0 flex-1">
            {g.roles.length === 1 ? (
              <Role role={g.roles[0]} withCompany />
            ) : (
              <>
                <p className="font-bold text-[var(--sand-900)]">{g.company}</p>
                <p className="text-sm text-[var(--sand-900)]">{totalSpan(g.roles, tr)}</p>
                {commonMode(g.roles) && <p className="text-sm text-[var(--sand-600)]">{tr(commonMode(g.roles))}</p>}
                <ol className="mt-3 space-y-4">
                  {g.roles.map((r, ri) => (
                    <li key={ri} className="relative pl-6">
                      <span className="absolute left-[3px] top-2 h-2 w-2 rounded-full bg-[var(--sand-600)]" aria-hidden />
                      {ri < g.roles.length - 1 && (
                        <span className="absolute bottom-[-18px] left-[6px] top-5 w-0.5 bg-[var(--sand-200)]" aria-hidden />
                      )}
                      <Role role={r} />
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function Role({ role, withCompany }: { role: any; withCompany?: boolean }) {
  const { tr } = useT();
  const type = role.employmentType && tr(role.employmentType);
  const sub = withCompany ? [role.company, type].filter(Boolean).join(' · ') : type;
  const place = [role.location, role.workMode && tr(role.workMode)].filter(Boolean).join(' · ');
  const skills = splitList(role.skills);
  const bullets = String(role.description || '').split('\n').map((s) => s.trim()).filter(Boolean);

  return (
    <div>
      <p className="font-bold text-[var(--sand-900)]">{role.title}</p>
      {sub && <p className="text-sm text-[var(--sand-900)]">{sub}</p>}
      <DateLine start={role.startDate} end={role.endDate} />
      {place && <p className="text-sm text-[var(--sand-600)]">{place}</p>}
      {bullets.length > 0 && <Bullets items={bullets} />}
      {skills.length > 0 && (
        <p className="mt-2 flex items-start gap-1.5 text-sm font-bold text-[var(--sand-900)]">
          <Diamond className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: ACCENT }} />
          <span>
            {skills.slice(0, 2).join(', ')}
            {skills.length > 2 && <> {tr(skills.length - 2 > 1 ? 'et +{n} compétences' : 'et +{n} compétence', { n: skills.length - 2 })}</>}
          </span>
        </p>
      )}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  const { tr } = useT();
  const [open, setOpen] = useState(false);
  const shown = open ? items : items.slice(0, 2);
  return (
    <ul className="mt-2 space-y-0.5 text-sm text-[var(--sand-900)]">
      {shown.map((b, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45" style={{ background: ACCENT }} aria-hidden />
          <span>{b}</span>
        </li>
      ))}
      {items.length > 2 && (
        <li>
          <button type="button" onClick={() => setOpen((v) => !v)} className="text-[var(--sand-600)] hover:underline">
            {open ? tr('voir moins') : tr('…plus')}
          </button>
        </li>
      )}
    </ul>
  );
}

// ─── Skills ─────────────────────────────────────────────────────────────

function SkillsCard({ technical, soft }: { technical: string[]; soft: any[] }) {
  const { tr } = useT();
  const [showAll, setShowAll] = useState(false);
  const softRows = soft.flatMap((s: any) => (Array.isArray(s.skills) ? s.skills : splitList(s.skills)).map((k: string) => ({ name: k, group: s.category })));
  const rows = [...technical.map((t) => ({ name: t, group: tr('Compétence technique') })), ...softRows].filter((r) => r.name);
  if (!rows.length) {
    return <Card title={tr("Skills")}><Empty>{tr("Aucune compétence ajoutée.")}</Empty></Card>;
  }
  const shown = showAll ? rows : rows.slice(0, 5);
  return (
    <Card title={tr("Skills")} flush>
      <ul className="divide-y divide-[var(--sand-200)] px-5 sm:px-7">
        {shown.map((r, i) => (
          <li key={i} className="py-3">
            <p className="font-bold text-[var(--sand-900)]">{r.name}</p>
            {r.group && <p className="text-sm text-[var(--sand-600)]">{r.group}</p>}
          </li>
        ))}
      </ul>
      {rows.length > 5 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="w-full border-t border-[var(--sand-200)] py-3 text-sm font-bold text-[var(--sand-700)] transition-colors hover:bg-[var(--sand-100)]/50"
        >
          {showAll ? tr('Afficher moins') : tr('Afficher les {n} compétences →', { n: rows.length })}
        </button>
      )}
    </Card>
  );
}

// ─── Small pieces ───────────────────────────────────────────────────────

function Card({ title, children, flush }: { title: string; children: React.ReactNode; flush?: boolean }) {
  return (
    <section className={`card overflow-hidden !border-0 !shadow-none ${flush ? 'pt-5 sm:pt-6' : 'px-5 py-5 sm:px-7 sm:py-6'}`}>
      <h2 className={`mb-3 font-title text-[21px] font-semibold text-[var(--sand-900)] ${flush ? 'px-5 sm:px-7' : ''}`}>{title}</h2>
      {children}
    </section>
  );
}

function ExpandableText({ text }: { text: string }) {
  const { tr } = useT();
  const [open, setOpen] = useState(false);
  const long = text.length > 320;
  return (
    <div className="text-[15px] leading-relaxed text-[var(--sand-900)]">
      <p className={`whitespace-pre-wrap ${!open && long ? 'line-clamp-4' : ''}`}>{text}</p>
      {long && (
        <button type="button" onClick={() => setOpen((v) => !v)} className="mt-1 text-sm font-bold text-[var(--sand-600)] hover:underline">
          {open ? tr('voir moins') : tr('…voir plus')}
        </button>
      )}
    </div>
  );
}

/** Square company/school mark: initials on a colour picked from the name. */
function OrgMark({ name, size = 48 }: { name?: string; size?: number }) {
  const label = initials(name || '?');
  const palette = ['var(--red-500)', 'var(--sand-900)', 'var(--info-600)', 'var(--sand-700)', 'var(--violet-600)', 'var(--success-600)', 'var(--red-800)'];
  const bg = palette[hash(name || '') % palette.length];
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-lg font-title font-semibold text-white shadow-sm"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.38 }}
    >
      {label}
    </span>
  );
}

function DateTile({ date }: { date?: string }) {
  const { intl } = useT();
  const d = parseDate(date);
  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-[var(--sand-200)] bg-[var(--sand-25)] text-center leading-none">
      {d ? (
        <span>
          <span className="block text-[10px] font-bold uppercase" style={{ color: ACCENT }}>{d.toLocaleDateString(intl, { month: 'short' })}</span>
          <span className="block font-title text-lg font-semibold text-[var(--sand-900)]">{d.getDate()}</span>
        </span>
      ) : (
        <span className="text-[10px] font-bold text-[var(--sand-600)]">{date || '—'}</span>
      )}
    </span>
  );
}

function DateLine({ start, end }: { start?: string; end?: string }) {
  const { tr, intl } = useT();
  if (!start && !end) return null;
  const range = `${formatMonth(start, intl)} - ${isPresent(end) ? tr('Présent') : formatMonth(end, intl)}`;
  const dur = duration(start, end, tr);
  return <p className="text-sm text-[var(--sand-600)]">{range}{dur && ` · ${dur}`}</p>;
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.filter(Boolean).map((t, i) => (
        <li key={i} className="rounded-full border border-[var(--sand-300)] bg-[var(--sand-25)] px-3 py-1 text-sm font-semibold text-[var(--sand-900)]">
          {t}
        </li>
      ))}
    </ul>
  );
}

function CountList({ label, items }: { label: string; items: [any, any][] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--sand-600)]">{label}</p>
      <ul className="space-y-1.5">
        {items.map(([n, what], i) => (
          <li key={i} className="flex items-baseline gap-2 text-[var(--sand-900)]">
            <span className="min-w-[2ch] text-right font-title text-lg font-semibold" style={{ color: ACCENT }}>{n}</span>
            <span>{what}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LabeledRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--sand-600)]">{label}</p>
      <div className="text-[var(--sand-900)]">{value}</div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm italic text-[var(--sand-600)]">{children}</p>;
}

// ─── helpers ────────────────────────────────────────────────────────────

const asList = (v: any): any[] => (Array.isArray(v) ? v : []);
const norm = (s?: string) => (s || '').trim().toLowerCase();
const splitList = (v: any): string[] =>
  (Array.isArray(v) ? v : String(v || '').split(',')).map((s: string) => String(s).trim()).filter(Boolean);
const withProtocol = (url: string) => (url.startsWith('http') ? url : `https://${url}`);
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const initials = (s: string) =>
  s.replace(/[^\p{L}\p{N}\s&-]/gu, '').split(/[\s&-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

function isPresent(end?: string) {
  return !end || /^(present|présent|presente|current|now|aujourd'hui|en cours)$/i.test(end.trim());
}

/** Accepts "March 15th, 2025", "2025-03", "03/2025", "2008", ISO dates. */
function parseDate(s?: string): Date | null {
  if (!s || isPresent(s)) return null;
  const t = s.trim().replace(/(\d+)(st|nd|rd|th)\b/gi, '$1');
  if (/^\d{4}$/.test(t)) return new Date(Number(t), 0, 1);
  const mmYYYY = t.match(/^(\d{1,2})[/.-](\d{4})$/);
  if (mmYYYY) return new Date(Number(mmYYYY[2]), Number(mmYYYY[1]) - 1, 1);
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatMonth(s: string | undefined, intl: string) {
  if (!s) return '';
  if (/^\d{4}$/.test(s.trim())) return s.trim();
  const d = parseDate(s);
  return d ? d.toLocaleDateString(intl, { month: 'short', year: 'numeric' }) : s;
}

function formatLongDate(s: string | undefined, intl: string) {
  const d = parseDate(s);
  return d ? d.toLocaleDateString(intl, { day: 'numeric', month: 'long', year: 'numeric' }) : s;
}

function monthsBetween(start?: string, end?: string): number | null {
  const a = parseDate(start);
  if (!a) return null;
  const b = isPresent(end) ? new Date() : parseDate(end);
  if (!b) return null;
  return Math.max(1, (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1);
}

type Tr = (s: string, v?: Record<string, string | number>) => string;

function formatMonths(m: number, tr: Tr) {
  const y = Math.floor(m / 12);
  const r = m % 12;
  const parts = [];
  if (y) parts.push(tr(y > 1 ? '{n} ans' : '{n} an', { n: y }));
  if (r) parts.push(tr('{n} mois', { n: r }));
  return parts.join(' ');
}

function duration(start: string | undefined, end: string | undefined, tr: Tr) {
  const m = monthsBetween(start, end);
  return m ? formatMonths(m, tr) : '';
}

/** Span of a whole company group: earliest start → latest end. */
function totalSpan(roles: any[], tr: Tr) {
  const starts = roles.map((r) => parseDate(r.startDate)).filter(Boolean) as Date[];
  if (!starts.length) return '';
  const first = new Date(Math.min(...starts.map((d) => d.getTime())));
  const anyCurrent = roles.some((r) => isPresent(r.endDate));
  const ends = roles.map((r) => parseDate(r.endDate)).filter(Boolean) as Date[];
  const last = anyCurrent || !ends.length ? new Date() : new Date(Math.max(...ends.map((d) => d.getTime())));
  const m = (last.getFullYear() - first.getFullYear()) * 12 + (last.getMonth() - first.getMonth()) + 1;
  return formatMonths(Math.max(1, m), tr);
}

function commonMode(roles: any[]) {
  const modes = [...new Set(roles.map((r) => r.workMode).filter(Boolean))];
  return modes.length === 1 ? modes[0] : '';
}

/** Current roles first, then most recent start date first (LinkedIn order). */
function sortByStart(list: any[]) {
  return [...list].sort((a, b) => {
    const pa = isPresent(a.endDate) ? 1 : 0;
    const pb = isPresent(b.endDate) ? 1 : 0;
    if (pa !== pb) return pb - pa;
    return (parseDate(b.startDate)?.getTime() ?? 0) - (parseDate(a.startDate)?.getTime() ?? 0);
  });
}
