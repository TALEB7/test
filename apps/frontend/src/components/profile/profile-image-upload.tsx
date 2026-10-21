"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X, Loader2, CheckCircle2 } from "lucide-react";
import { useT } from '@/lib/i18n';

interface ProfileImageUploadProps {
  initialValue?: string;
  onUploadComplete: (url: string) => void;
}

export function ProfileImageUpload({ initialValue, onUploadComplete }: ProfileImageUploadProps) {
  const { tr } = useT();
  // preview = local blob URL for instant display; serverUrl = the URL saved to DB
  const [preview, setPreview] = useState<string | null>(initialValue || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(!!initialValue);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevBlobRef = useRef<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError(tr("L'image est trop volumineuse (max 5 Mo)"));
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError(tr("Veuillez sélectionner une image valide"));
      return;
    }

    // ── Immediate local preview ──────────────────────────────────────────────
    if (prevBlobRef.current) URL.revokeObjectURL(prevBlobRef.current);
    const blobUrl = URL.createObjectURL(file);
    prevBlobRef.current = blobUrl;
    setPreview(blobUrl);
    setSaved(false);
    setError(null);
    setUploading(true);

    // ── Upload to server ──────────────────────────────────────────────────────
    const formData = new FormData();
    formData.append("files", file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      const res = await fetch(`${apiUrl}/uploads/avatars`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Erreur serveur ${res.status}`);

      const data = await res.json();
      const serverUrl: string = data.urls?.[0] ?? data.url ?? "";

      // Keep showing the local blob preview (instant), pass server URL to parent
      onUploadComplete(serverUrl);
      setSaved(true);
    } catch (err: any) {
      setError(tr("Upload échoué. Vérifiez que le serveur est démarré."));
      console.error(err);
      // Keep the local preview so the user can see their selection
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    if (prevBlobRef.current) {
      URL.revokeObjectURL(prevBlobRef.current);
      prevBlobRef.current = null;
    }
    setPreview(null);
    setSaved(false);
    onUploadComplete("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        {/* Avatar circle */}
        <div className={`w-32 h-32 rounded-full border-4 overflow-hidden flex items-center justify-center transition-all
          bg-sand-100 border-sand-200
          ${uploading ? "opacity-60" : "group-hover:border-primary/50"}`}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={tr("Avatar")}
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="w-12 h-12 text-sand-500" />
          )}

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
          )}
        </div>

        {/* Remove button */}
        {preview && !uploading && (
          <button
            onClick={removeImage}
            className="absolute -top-1 -right-1 p-1.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Upload button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute -bottom-1 -right-1 p-2.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:scale-100"
        >
          <Upload className="w-4 h-4" />
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Status */}
      {error ? (
        <p className="text-xs text-primary font-medium text-center max-w-[200px]">{error}</p>
      ) : uploading ? (
        <p className="text-xs text-sand-500">{tr("Envoi en cours...")}</p>
      ) : saved ? (
        <p className="text-xs text-primary flex items-center gap-1 font-medium">
          <CheckCircle2 className="w-3 h-3" /> {tr("Photo enregistrée")}
        </p>
      ) : (
        <p className="text-xs text-sand-500">{tr("JPG, PNG ou WebP · Max 5 Mo")}</p>
      )}
    </div>
  );
}
