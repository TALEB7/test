import type { Locale } from './types';
import data from './phrases.json';

/**
 * Phrase dictionary for `tr()`: key = the source text as written in the code
 * (French or English), value = that text in each locale. A missing locale
 * falls back to the source text. Never add the brand name "THE COMMUNIUM".
 */
export const PHRASES = data as Record<string, Partial<Record<Locale, string>>>;
