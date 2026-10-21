'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Gavel, AlertTriangle } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { getMediaUrl } from '@/lib/media-url';

export default function CreateAuctionPage() {
  const { t, tr, intl } = useT();
  const router = useRouter();
  const { toast } = useToast();

  const [listingId, setListingId] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [reservePrice, setReservePrice] = useState('');
  const [minIncrement, setMinIncrement] = useState('10');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  // Fetch user's active listings (only those without auctions)
  const { data: myListings, isLoading } = useQuery({
    queryKey: ['my-listings-for-auction'],
    queryFn: () => api.get('/marketplace/my-listings').then((r) => r.data),
  });

  const availableListings = myListings?.filter(
    (l: any) => l.status === 'ACTIVE' && !l.auction,
  ) || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/auctions', data),
    onSuccess: (res) => {
      toast({ title: tr("Enchère créée avec succès !") });
      router.push(`/auctions/${res.data.id}`);
    },
    onError: (err: any) => {
      toast({
        title: tr("Erreur"),
        description: err.response?.data?.message || tr("Impossible de créer l'enchère"),
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!listingId || !startingPrice || !startDate || !startTime || !endDate || !endTime) {
      toast({
        title: tr("Champs requis"),
        description: tr("Veuillez remplir tous les champs obligatoires."),
        variant: 'destructive',
      });
      return;
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    if (end <= start) {
      toast({
        title: tr("Dates invalides"),
        description: tr("La date de fin doit être après la date de début."),
        variant: 'destructive',
      });
      return;
    }

    const diffHours = (end.getTime() - start.getTime()) / 3600000;
    if (diffHours < 1) {
      toast({
        title: tr("Durée trop courte"),
        description: tr("L'enchère doit durer au moins 1 heure."),
        variant: 'destructive',
      });
      return;
    }

    createMutation.mutate({
      listingId,
      startingPrice: parseFloat(startingPrice),
      reservePrice: reservePrice ? parseFloat(reservePrice) : undefined,
      minIncrement: minIncrement ? parseFloat(minIncrement) : undefined,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    });
  };

  // Set default dates
  const now = new Date();
  const defaultStart = now.toISOString().slice(0, 10);
  const defaultTime = now.toTimeString().slice(0, 5);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/auctions" className="rounded-lg border p-2 hover:bg-muted">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-primary font-heading tracking-wide">{tr("Créer une enchère")}</h1>
          <p className="text-sm text-muted-foreground">{tr("Mettez un de vos articles aux enchères")}</p>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="flex gap-3 p-4">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">{tr("Informations importantes")}</p>
            <ul className="mt-1 list-disc pl-4 text-xs">
              <li>{tr("Seules vos annonces actives sans enchère existante sont disponibles")}</li>
              <li>{tr("L'enchère dure au minimum 1 heure")}</li>
              <li>{tr("Vous ne pouvez annuler que s'il n'y a aucune mise")}</li>
              <li>{tr("Le prix de réserve est optionnel et reste secret")}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select Listing */}
        <Card>
          <CardHeader>
            <CardTitle>{tr("Article à mettre aux enchères")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : availableListings.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Aucune annonce active disponible.{' '}
                  <Link href="/marketplace/new" className="text-primary hover:underline">
                    {tr("Créez-en une d'abord")}
                  </Link>
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableListings.map((l: any) => (
                  <label
                    key={l.id}
                    className={`flex cursor-pointer items-center gap-3 rounded border p-3 transition ${
                      listingId === l.id
                        ? 'border-primary bg-accent'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <input
                      type="radio"
                      name="listing"
                      value={l.id}
                      checked={listingId === l.id}
                      onChange={() => setListingId(l.id)}
                      className="accent-primary"
                    />
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      {l.images?.length > 0 ? (
                        <img src={getMediaUrl(l.images[0]) || l.images[0]} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-lg">📦</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{l.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Prix de vente : {l.price.toLocaleString(intl)} Dhs
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>{tr("Prix")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                  {tr("Prix de départ (Dhs)")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  placeholder="100"
                  min="1"
                  step="1"
                  className="w-full rounded-lg border px-4 py-2.5 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                  {tr("Prix de réserve (Dhs)")}
                </label>
                <input
                  type="number"
                  value={reservePrice}
                  onChange={(e) => setReservePrice(e.target.value)}
                  placeholder={tr("Optionnel")}
                  min="1"
                  step="1"
                  className="w-full rounded-lg border px-4 py-2.5 text-sm"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {tr("Prix minimum que vous acceptez (invisible aux enchérisseurs)")}
                </p>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                {tr("Incrément minimum (Dhs)")}
              </label>
              <input
                type="number"
                value={minIncrement}
                onChange={(e) => setMinIncrement(e.target.value)}
                placeholder="10"
                min="1"
                step="1"
                className="w-full rounded-lg border px-4 py-2.5 text-sm sm:w-1/2"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {tr("Montant minimum au-dessus de la mise actuelle")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Timing */}
        <Card>
          <CardHeader>
            <CardTitle>{tr("Programmation")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                  {tr("Date de début")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={defaultStart}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                  {tr("Heure de début")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm"
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                  {tr("Date de fin")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || defaultStart}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                  {tr("Heure de fin")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/auctions"
            className="rounded-lg border px-6 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted"
          >
            {tr("Annuler")}
          </Link>
          <button
            type="submit"
            disabled={createMutation.isPending || !listingId}
            className="ygo-btn-blue flex items-center gap-2 px-6 py-2.5 disabled:opacity-50"
          >
            <Gavel className="h-4 w-4" />
            {createMutation.isPending ? tr("Création...") : tr("Créer l'enchère")}
          </button>
        </div>
      </form>
    </div>
  );
}
