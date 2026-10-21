'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Locale, Translations } from './types';
import { fr } from './fr';
import { en } from './en';
import { ar } from './ar';
import { PHRASES } from './phrases';

const translations: Record<Locale, Translations> = { fr, en, ar };

const STORAGE_KEY = 'communium-locale';

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'fr';
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored && translations[stored]) return stored;
  return 'fr';
}

type Vars = Record<string, string | number | null | undefined>;

/**
 * Phrase translation: `tr('Texte source')` looks the source text up in PHRASES
 * and returns it in the current locale (falls back to the source text).
 * `{name}` placeholders are filled from `vars`. Brand name "THE COMMUNIUM" is never translated.
 */
export function translatePhrase(locale: Locale, source: string, vars?: Vars): string {
  const entry = PHRASES[source];
  let out = (entry && entry[locale]) || source;
  if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? '') + '');
  return out;
}

/** Locale tag for Intl date/number formatting. */
export const INTL_LOCALE: Record<Locale, string> = { fr: 'fr-FR', en: 'en-US', ar: 'ar-MA' };

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
  /** Translate a phrase by its source text (see PHRASES). */
  tr: (source: string, vars?: Vars) => string;
  /** Locale tag for toLocaleDateString / toLocaleString. */
  intl: string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'fr',
  setLocale: () => {},
  t: fr,
  tr: (s, v) => translatePhrase('fr', s, v),
  intl: 'fr-FR',
  dir: 'ltr',
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(getInitialLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const t = translations[locale];

  // Update <html> lang and dir attributes
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir, mounted]);

  const tr = useCallback((s: string, v?: Vars) => translatePhrase(locale, s, v), [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, tr, intl: INTL_LOCALE[locale], dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT(): I18nContextValue {
  const ctx = useContext(I18nContext);
  // A provider instance kept alive by hot reload may predate `tr`/`intl`: rebuild them instead of crashing.
  if (typeof ctx.tr === 'function' && ctx.intl) return ctx;
  const locale = ctx.locale || 'fr';
  return {
    ...ctx,
    tr: (s, v) => translatePhrase(locale, s, v),
    intl: INTL_LOCALE[locale],
  };
}

export { type Locale, type Translations };
