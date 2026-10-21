'use client';

import { useState } from 'react';
import { Play } from '@phosphor-icons/react/dist/ssr';
import { useT } from '@/lib/i18n';
import { Reveal, SectionHeading } from './primitives';

// PLACEHOLDER: set the product video URL (mp4/webm) here. Nothing is downloaded until play is pressed.
const VIDEO_SRC = '';

export function VideoSection() {
  const { tr } = useT();
  const [playing, setPlaying] = useState(false);

  return (
    <section id="platform" aria-labelledby="video-title" className="relative py-section">
      <div className="mx-auto w-full max-w-container px-gutter">
        <div className="relative overflow-hidden rounded-token-2xl border border-line bg-sand-0 px-4 pb-10 pt-14 shadow-token-lg sm:px-10 sm:pt-20">
          <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-60" />
          <div aria-hidden="true" className="lp-glow -start-40 -top-40 h-[520px] w-[520px]" />
          <div aria-hidden="true" className="lp-glow -bottom-48 -end-40 h-[480px] w-[480px] opacity-70" />

          <div className="relative">
            <SectionHeading
              id="video-title"
              eyebrow={tr('Visite guidée')}
              title={tr('Une visite de')}
              accent={tr('deux minutes.')}
              lead={tr('Voyez comment le réseau, la messagerie, la marketplace et les événements fonctionnent ensemble dans une interface fluide.')}
            />

            <Reveal delay={100} className="mx-auto mt-12 max-w-[880px]">
              <div className="relative overflow-hidden rounded-token-xl border-[6px] border-sand-200 bg-sand-950 shadow-token-xl">
                <div className="relative aspect-video">
                  {playing && VIDEO_SRC ? (
                    <video src={VIDEO_SRC} controls autoPlay playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <>
                      {/* poster: brand gradient, no image download */}
                      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(70%_90%_at_10%_0%,var(--red-700),transparent_60%),radial-gradient(50%_70%_at_100%_100%,var(--red-900),transparent_70%)]" />
                      <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-[0.07] invert" />
                      <div className="absolute inset-0 grid grid-cols-1 place-items-center">
                        <button
                          type="button"
                          onClick={() => VIDEO_SRC && setPlaying(true)}
                          aria-disabled={!VIDEO_SRC}
                          aria-label={VIDEO_SRC ? tr('Lire la vidéo de présentation') : tr('Vidéo bientôt disponible')}
                          className="group relative grid grid-cols-1 h-20 w-20 place-items-center rounded-full bg-sand-0 text-sand-900 shadow-token-xl transition-transform duration-200 ease-out hover:scale-105 active:scale-95 sm:h-24 sm:w-24"
                        >
                          <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-sand-0/30 [animation-duration:2.4s] motion-reduce:hidden" />
                          <Play weight="fill" className="relative h-8 w-8 translate-x-0.5 text-brand-500" />
                        </button>
                      </div>
                      <div className="absolute bottom-4 start-4 hidden items-center gap-3 rounded-full sm:flex bg-white/10 py-1.5 pe-4 ps-1.5 text-[12px] text-white backdrop-blur-md">
                        <img src="/communium-logo-red.png" alt="" width={26} height={26} className="h-[26px] w-[26px] rounded-full bg-white object-contain p-0.5" />
                        {VIDEO_SRC ? tr('Présentation · 2 min') : tr('Vidéo bientôt disponible')}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Reveal>

            <p className="mt-8 text-center text-[13px] text-sand-600">
              {[tr('Réseau vérifié'), tr('Messagerie'), tr('Marketplace'), tr('Enchères'), tr('Événements & visio'), tr('Mentorat')].join(' · ')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
