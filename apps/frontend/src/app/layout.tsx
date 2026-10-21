import type { Metadata } from 'next';

import { QueryProvider } from '@/lib/query-provider';
import { Toaster } from '@/components/ui/toaster';
import { Inter_Tight, Instrument_Serif, Noto_Sans_Arabic } from 'next/font/google';
import { I18nProvider } from '@/lib/i18n';
import '../styles/tokens.css';
import '../styles/globals.css';

import { Providers } from '@/components/providers';
import { BackgroundDesign } from '@/components/layout/background-design';

// Headlines + body: Inter Tight. Italic accent phrase in headlines: Instrument Serif.
// Font variables sit on <html> so the tokens in tokens.css (:root) can reference them.
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-inter-tight', weight: ['400', '500', '600', '700'] });
const instrumentSerif = Instrument_Serif({ subsets: ['latin'], variable: '--font-instrument-serif', weight: '400', style: ['normal', 'italic'] });
const notoArabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-arabic', weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'The Communium — Réseau VIP Maroc-Monde',
  description:
    'Plateforme de networking premium pour professionnels et entreprises au Maroc et à l\'international.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

      <html lang="fr" suppressHydrationWarning className={`${interTight.variable} ${instrumentSerif.variable} ${notoArabic.variable}`}>
        <body className="min-h-screen bg-background text-foreground antialiased font-sans">
          <Providers>
            <BackgroundDesign />
            {children}
            <Toaster />
          </Providers>
        </body>
      </html>
  );
}
