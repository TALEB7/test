'use client';

import { useState } from 'react';
import { useUser } from '@/lib/auth-client';
import { api } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import {
  User, Lock, Bell, Eye, CreditCard,
  Shield, Globe, Trash2, ChevronRight,
  Check, Loader2, Mail, Phone, Languages,
} from 'lucide-react';
import { useT } from '@/lib/i18n';

// ─── Types ─────────────────────────────────────────────────────────────────
type Section = 'account' | 'security' | 'notifications' | 'visibility' | 'subscription' | 'privacy';

const sections: { id: Section; icon: any; label: string; description: string }[] = [
  { id: 'account',       icon: User,       label: 'Mon compte',              description: 'Email, téléphone, langue' },
  { id: 'security',      icon: Lock,       label: 'Connexion & sécurité',    description: 'Mot de passe, sessions' },
  { id: 'notifications', icon: Bell,       label: 'Notifications',           description: 'Email, push, in-app' },
  { id: 'visibility',    icon: Eye,        label: 'Visibilité du profil',     description: 'Qui peut voir vos infos' },
  { id: 'subscription',  icon: CreditCard, label: 'Abonnement',              description: 'Plan, facturation' },
  { id: 'privacy',       icon: Shield,     label: 'Confidentialité & données', description: 'Données, suppression' },
];

// ─── Toggle switch ─────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-primary' : 'bg-muted'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

// ─── Row ────────────────────────────────────────────────────────────────────
function Row({ label, sub, children }: { label: string; sub?: string; children?: React.ReactNode }) {
  const { tr } = useT();
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{tr(label)}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── Section: Account ──────────────────────────────────────────────────────
function AccountSection() {
  const { tr } = useT();
  const { user } = useUser();
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/profiles/me').then((r) => r.data),
    enabled: !!user?.id,
  });
  const { toast } = useToast();
  const [editing, setEditing] = useState<string | null>(null);
  const [val, setVal] = useState('');

  const save = () => {
    toast({ title: tr("Sauvegardé"), description: tr("Modification enregistrée.") });
    setEditing(null);
  };

  const accountType = profile?.accountType || user?.accountType;
  const accountTypeLabel = (accountType === 'business' || accountType === 'company_creation') ? 'Business' : 'Personnel';

  return (
    <div>
      <SectionHeader icon={User} title={tr("Mon compte")} sub={tr("Gérez vos informations de compte")} />
      <div className="mt-4 bg-card border border-border rounded-xl divide-y divide-border">
        {[
          { key: 'email', label: 'Adresse email', icon: Mail, value: user?.email || '—' },
          { key: 'phone', label: tr("Téléphone"),      icon: Phone, value: (user as any)?.phone || tr("Non renseigné") },
          { key: 'lang',  label: 'Langue',         icon: Languages, value: tr("Français") },
          { key: 'type',  label: tr("Type de compte"), icon: User, value: accountTypeLabel },
        ].map(({ key, label, icon: Icon, value }) => (
          <div key={key} className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{tr(label)}</p>
                {editing === key
                  ? <input autoFocus value={val} onChange={(e) => setVal(e.target.value)}
                      className="mt-1 text-xs border border-border rounded-lg px-2 py-1 bg-background text-foreground w-48" />
                  : <p className="text-xs text-muted-foreground">{value}</p>}
              </div>
            </div>
            {editing === key
              ? <div className="flex gap-2">
                  <button onClick={save} className="text-xs font-semibold text-primary hover:underline">{tr("Sauvegarder")}</button>
                  <button onClick={() => setEditing(null)} className="text-xs text-muted-foreground hover:underline">{tr("Annuler")}</button>
                </div>
              : key !== 'type' && (
                  <button onClick={() => { setEditing(key); setVal(value); }}
                    className="text-xs font-semibold text-primary hover:underline">
                    {tr("Modifier")}
                  </button>
                )}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3 px-1">
        Pour modifier votre nom et photo, visitez{' '}
        <Link href="/profile/edit" className="text-primary hover:underline font-medium">{tr("la page profil")}</Link>.
      </p>
    </div>
  );
}

// ─── Section: Security ─────────────────────────────────────────────────────
function SecuritySection() {
  const { tr } = useT();
  const { toast } = useToast();
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (pw.next !== pw.confirm) {
      toast({ title: tr("Erreur"), description: tr("Les mots de passe ne correspondent pas."), variant: 'destructive' });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setPw({ current: '', next: '', confirm: '' });
    toast({ title: tr("Mot de passe mis à jour"), description: tr("Votre mot de passe a été modifié avec succès.") });
  };

  return (
    <div>
      <SectionHeader icon={Lock} title={tr("Connexion & sécurité")} sub={tr("Gérez votre mot de passe et vos sessions")} />
      <div className="mt-4 bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">{tr("Changer le mot de passe")}</h3>
        {[
          { key: 'current', label: tr("Mot de passe actuel") },
          { key: 'next',    label: tr("Nouveau mot de passe") },
          { key: 'confirm', label: tr("Confirmer le nouveau") },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="text-xs text-muted-foreground mb-1 block">{tr(label)}</label>
            <input
              type="password"
              value={pw[key as keyof typeof pw]}
              onChange={(e) => setPw((p) => ({ ...p, [key]: e.target.value }))}
              className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:border-primary transition"
              placeholder="••••••••"
            />
          </div>
        ))}
        <button
          onClick={save}
          disabled={loading || !pw.current || !pw.next || !pw.confirm}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:brightness-110 disabled:opacity-50 transition"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {tr("Mettre à jour")}
        </button>
      </div>

      <div className="mt-3 bg-card border border-border rounded-xl p-5">
        <Row label={tr("Sessions actives")} sub={tr("Vous êtes connecté sur 1 appareil")}>
          <button className="text-xs font-semibold text-destructive hover:underline">{tr("Déconnecter tout")}</button>
        </Row>
        <Row label={tr("Authentification à deux facteurs")} sub={tr("Sécurité renforcée pour votre compte")}>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{tr("Bientôt disponible")}</span>
        </Row>
      </div>
    </div>
  );
}

// ─── Section: Notifications ────────────────────────────────────────────────
function NotificationsSection() {
  const { tr } = useT();
  const { user } = useUser();
  const { toast } = useToast();
  const [local, setLocal] = useState<Record<string, boolean>>({});

  const { data: prefs = {}, isLoading } = useQuery<Record<string, boolean>>({
    queryKey: ['notif-prefs', user?.id],
    queryFn: () => api.get(`/notifications/${user!.id}/preferences`).then((r) => r.data),
    enabled: !!user?.id,
  });

  const merged = { ...prefs, ...local };
  const toggle = (k: string) => setLocal((p) => ({ ...p, [k]: !merged[k] }));

  const save = useMutation({
    mutationFn: () => api.patch(`/notifications/${user?.id}/preferences`, merged),
    onSuccess: () => { toast({ title: tr("Préférences sauvegardées") }); setLocal({}); },
    onError: () => toast({ title: tr("Erreur"), variant: 'destructive' }),
  });

  const groups = [
    { title: tr("Messages"), items: [
      { key: 'emailMessages', label: tr("Par email") },
      { key: 'pushMessages',  label: 'Notifications push' },
      { key: 'inAppMessages', label: tr("Dans l'application") },
    ]},
    { title: tr("Enchères & Marketplace"), items: [
      { key: 'emailBids', label: tr("Par email") },
      { key: 'pushBids',  label: 'Notifications push' },
      { key: 'inAppBids', label: tr("Dans l'application") },
    ]},
    { title: tr("Mentorat"), items: [
      { key: 'emailMentorship', label: tr("Par email") },
      { key: 'pushMentorship',  label: 'Notifications push' },
      { key: 'inAppMentorship', label: tr("Dans l'application") },
    ]},
    { title: tr("Connexions & Réseau"), items: [
      { key: 'emailConnections', label: tr("Nouvelles connexions par email") },
      { key: 'inAppConnections', label: tr("Dans l'application") },
    ]},
  ];

  return (
    <div>
      <SectionHeader icon={Bell} title={tr("Notifications")} sub={tr("Choisissez comment vous êtes averti")} />
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="mt-4 space-y-3">
          {groups.map((group) => (
            <div key={group.title} className="bg-card border border-border rounded-xl px-5 divide-y divide-border">
              <p className="py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">{tr(group.title)}</p>
              {group.items.map(({ key, label }) => (
                <Row key={key} label={label}>
                  <Toggle checked={!!merged[key]} onChange={() => toggle(key)} />
                </Row>
              ))}
            </div>
          ))}
          <button
            onClick={() => save.mutate()}
            disabled={save.isPending || Object.keys(local).length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:brightness-110 disabled:opacity-50 transition"
          >
            {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {tr("Sauvegarder les préférences")}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Section: Visibility ───────────────────────────────────────────────────
function VisibilitySection() {
  const { tr } = useT();
  const [prefs, setPrefs] = useState({ publicProfile: true, showEmail: false, showPhone: false, showConnections: true, indexable: true });
  const toggle = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));
  const { toast } = useToast();

  return (
    <div>
      <SectionHeader icon={Eye} title={tr("Visibilité du profil")} sub={tr("Contrôlez qui peut voir vos informations")} />
      <div className="mt-4 bg-card border border-border rounded-xl px-5 divide-y divide-border">
        <Row label={tr("Profil public")} sub={tr("Votre profil est visible par tous les membres")}>
          <Toggle checked={prefs.publicProfile} onChange={() => toggle('publicProfile')} />
        </Row>
        <Row label={tr("Afficher l'email")} sub={tr("Les autres membres peuvent voir votre email")}>
          <Toggle checked={prefs.showEmail} onChange={() => toggle('showEmail')} />
        </Row>
        <Row label={tr("Afficher le téléphone")} sub={tr("Visible sur votre profil public")}>
          <Toggle checked={prefs.showPhone} onChange={() => toggle('showPhone')} />
        </Row>
        <Row label={tr("Afficher mes connexions")} sub={tr("Les autres peuvent voir votre réseau")}>
          <Toggle checked={prefs.showConnections} onChange={() => toggle('showConnections')} />
        </Row>
        <Row label={tr("Référencement externe")} sub={tr("Votre profil peut apparaître dans les moteurs de recherche")}>
          <Toggle checked={prefs.indexable} onChange={() => toggle('indexable')} />
        </Row>
      </div>
      <button
        onClick={() => toast({ title: tr("Préférences sauvegardées") })}
        className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:brightness-110 transition"
      >
        <Check className="h-4 w-4" /> {tr("Sauvegarder")}
      </button>
    </div>
  );
}

// ─── Section: Subscription ─────────────────────────────────────────────────
function SubscriptionSection() {
  const { tr } = useT();
  const plans = [
    { id: 'free',             label: 'Gratuit',         price: '0 MAD/mois',   features: [tr("Accès de base"), '50 Tks offerts', '5 annonces actives'] },
    { id: 'personal_premium', label: 'Personnel Premium', price: '200 MAD/an',  features: [tr("Tout du gratuit"), tr("Badge Vérifié"), tr("Messagerie illimitée"), '150 Tks/mois'] },
    { id: 'business_premium', label: 'Business Premium', price: '500 MAD/an',  features: [tr("Tout du Premium"), tr("Annonces illimitées"), tr("Analytics avancés"), '500 Tks/mois'] },
  ];

  return (
    <div>
      <SectionHeader icon={CreditCard} title={tr("Abonnement")} sub={tr("Gérez votre plan et votre facturation")} />
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-card border border-border rounded-xl p-4">
            <p className="font-bold text-foreground text-sm">{tr(plan.label)}</p>
            <p className="text-primary font-semibold text-lg mt-1">{tr(plan.price)}</p>
            <ul className="mt-3 space-y-1.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" /> {tr(f)}
                </li>
              ))}
            </ul>
            <Link href="/membership"
              className="mt-4 block text-center text-xs font-semibold text-primary border border-primary/40 rounded-lg py-1.5 hover:bg-primary/5 transition">
              {plan.id === 'free' ? tr('Plan actuel') : tr("Passer à ce plan")}
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-3 bg-card border border-border rounded-xl px-5 divide-y divide-border">
        <Row label={tr("Historique de paiements")}>
          <Link href="/membership" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
            {tr("Voir")} <ChevronRight className="h-3 w-3" />
          </Link>
        </Row>
        <Row label={tr("Méthode de paiement")} sub={tr("Stripe / CMI")}>
          <Link href="/membership" className="text-xs text-primary font-semibold hover:underline">{tr("Gérer")}</Link>
        </Row>
      </div>
    </div>
  );
}

// ─── Section: Privacy ──────────────────────────────────────────────────────
function PrivacySection() {
  const { tr } = useT();
  const { toast } = useToast();
  return (
    <div>
      <SectionHeader icon={Shield} title={tr("Confidentialité & données")} sub={tr("Contrôlez vos données personnelles")} />
      <div className="mt-4 bg-card border border-border rounded-xl px-5 divide-y divide-border">
        <Row label={tr("Télécharger mes données")} sub={tr("Recevez une copie de vos données personnelles")}>
          <button
            onClick={() => toast({ title: tr("Demande envoyée"), description: tr("Vous recevrez un email sous 24h.") })}
            className="text-xs font-semibold text-primary hover:underline"
          >
            {tr("Demander")}
          </button>
        </Row>
        <Row label={tr("Politique de confidentialité")}>
          <Link href="/faq" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            {tr("Lire")} <ChevronRight className="h-3 w-3" />
          </Link>
        </Row>
        <Row label={tr("Cookies & tracking")} sub={tr("Gestion des préférences de cookies")}>
          <button
            onClick={() => toast({ title: tr("Préférences cookies"), description: tr("Fonctionnalité disponible bientôt.") })}
            className="text-xs font-semibold text-primary hover:underline"
          >
            {tr("Gérer")}
          </button>
        </Row>
      </div>

      <div className="mt-3 bg-destructive/5 border border-destructive/20 rounded-xl px-5 divide-y divide-destructive/10">
        <Row label={tr("Fermer mon compte")} sub={tr("Cette action est irréversible. Toutes vos données seront supprimées.")}>
          <button
            onClick={() => toast({ title: tr("Contactez le support"), description: tr("Envoyez un email à support@communium.ma"), variant: 'destructive' })}
            className="flex items-center gap-1.5 text-xs font-semibold text-destructive hover:underline"
          >
            <Trash2 className="h-3.5 w-3.5" /> {tr("Supprimer")}
          </button>
        </Row>
      </div>
    </div>
  );
}

// ─── Section header ────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, sub }: { icon: any; title: string; sub: string }) {
  const { tr } = useT();
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-border">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h2 className="text-base font-bold text-foreground">{tr(title)}</h2>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { tr } = useT();
  const [active, setActive] = useState<Section>('account');

  const content: Record<Section, React.ReactNode> = {
    account:       <AccountSection />,
    security:      <SecuritySection />,
    notifications: <NotificationsSection />,
    visibility:    <VisibilitySection />,
    subscription:  <SubscriptionSection />,
    privacy:       <PrivacySection />,
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-bold text-foreground mb-6">{tr("Paramètres")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">

        {/* Left nav */}
        <nav className="space-y-1">
          {sections.map(({ id, icon: Icon, label, description }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all
                ${active === id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${active === id ? 'text-primary' : ''}`} />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{tr(label)}</p>
                <p className="text-[10px] truncate opacity-70">{description}</p>
              </div>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="min-w-0">
          {content[active]}
        </div>

      </div>
    </div>
  );
}
