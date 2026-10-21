'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { getMediaUrl } from '@/lib/media-url';
import { uploadImage } from './upload-image';
import { useT } from '@/lib/i18n';

/** Wide banner picker for the profile cover photo. Reports the uploaded URL ('' when removed). */
export function CoverUpload({ currentUrl, onChange }: { currentUrl?: string | null; onChange: (url: string) => void }) {
  const { tr } = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const src = getMediaUrl(currentUrl);

  const pick = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      onChange(await uploadImage(file, 'covers'));
    } catch (e: any) {
      setError(e?.message || "Erreur d'upload");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => !busy && inputRef.current?.click()}
        className="group relative grid aspect-[3/1] w-full place-items-center overflow-hidden rounded-xl border-2 border-dashed border-primary/30 bg-muted transition hover:border-primary/60"
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={tr("Couverture")} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-1 text-xs font-semibold text-muted-foreground">
            <ImagePlus className="h-7 w-7" />
            {tr("Ajouter une photo de couverture")}
          </span>
        )}
        {busy && (
          <span className="absolute inset-0 grid place-items-center bg-black/45">
            <Loader2 className="h-7 w-7 animate-spin text-white" />
          </span>
        )}
      </button>

      <div className="flex items-center justify-between gap-2 text-xs">
        {error ? (
          <p className="font-medium text-primary">{error}</p>
        ) : (
          <p className="text-muted-foreground">{tr("Format large (3:1) · JPG, PNG ou WebP · Max 5 Mo")}</p>
        )}
        {src && !busy && (
          <button type="button" onClick={() => onChange('')} className="inline-flex items-center gap-1 font-semibold text-muted-foreground hover:text-foreground">
            <Trash2 className="h-3.5 w-3.5" /> {tr("Retirer")}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) pick(f);
          e.target.value = '';
        }}
      />
    </div>
  );
}
