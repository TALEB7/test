import { useState, useEffect } from 'react';
import { useT } from '@/lib/i18n';
import { X, Loader2 } from 'lucide-react';

interface NewForumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; color: string }) => void;
  isPending: boolean;
  initialData?: { name: string; description: string; color: string } | null;
}

export function NewForumModal({ isOpen, onClose, onSubmit, isPending, initialData }: NewForumModalProps) {
  const { t, tr } = useT();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#e4082c');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setDescription(initialData.description || '');
        setColor(initialData.color || '#e4082c');
      } else {
        setName('');
        setDescription('');
        setColor('#e4082c');
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name, description, color });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {initialData ? tr("Modifier le forum") : tr("Créer un nouveau forum")}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {initialData ? tr("Modifiez les informations du forum ci-dessous.") : tr("Ajoutez un nouvel espace de discussion pour la communauté.")}
            </p>
          </div>
          <button onClick={onClose} disabled={isPending} className="p-1.5 rounded-lg hover:bg-accent transition disabled:opacity-50">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{tr("Nom du forum")}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={tr("Ex: Développement Web")}
              className="w-full px-3 py-2 bg-transparent border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{tr("Description")}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={tr("Courte description de ce forum...")}
              rows={3}
              className="w-full px-3 py-2 bg-transparent border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{tr("Couleur principale")}</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 p-0 border-0 bg-transparent rounded cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 px-3 py-2 bg-transparent border border-border rounded-xl text-sm font-mono uppercase focus:outline-none focus:border-primary text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            disabled={isPending}
            className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent rounded-xl transition disabled:opacity-50"
          >
            {tr("Annuler")}
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={!name.trim() || isPending}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {initialData ? tr("Mettre à jour") : tr("Créer le forum")}
          </button>
        </div>

      </div>
    </div>
  );
}
