'use client';

import { useState, useRef, useEffect } from 'react';
import { useT, Locale } from '@/lib/i18n';
import { Globe, ChevronDown, Check } from 'lucide-react';

const localeLabels: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية',
};

const localeShort: Record<Locale, string> = {
  fr: 'FR',
  en: 'EN',
  ar: 'AR',
};

export function LanguageSwitcher() {
  const { locale, setLocale, tr } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* close on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-1.5 rounded-full border border-line bg-sand-0 px-3 text-xs font-semibold text-sand-900 hover:border-line-strong hover:bg-sand-50 transition-colors duration-150 ease-out group active:scale-[0.97]"
        aria-label={tr("Sélectionner la langue")}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe className="h-3.5 w-3.5 text-sand-600" />
        <span className="tracking-wide">{localeShort[locale]}</span>
        <ChevronDown
          className={`h-3 w-3 text-sand-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* dropdown */}
      {open && (
        <div className="absolute end-0 mt-2 w-40 rounded-token-md bg-sand-0 border border-line shadow-token-lg p-1.5 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-150 ease-out">
          {(Object.keys(localeLabels) as Locale[]).map((l) => (
            <button
              key={l}
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
              className={`w-full rounded-token-xs text-start px-3 py-2 text-[13px] font-medium transition-colors duration-100 flex items-center justify-between ${
                locale === l
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-sand-700 hover:text-sand-900 hover:bg-sand-50'
              }`}
            >
              <span>{localeLabels[l]}</span>
              {locale === l && (
                <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
