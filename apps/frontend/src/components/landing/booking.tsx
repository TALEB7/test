'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  CaretLeft,
  CaretRight,
  Clock,
  EnvelopeSimple,
  GlobeHemisphereEast,
  HandWaving,
  VideoCamera,
} from '@phosphor-icons/react/dist/ssr';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Reveal, Section, SectionHeading } from './primitives';

// PLACEHOLDER booking widget: replace with the real scheduling embed (Calendly, Cal.com…) when available.
// Confirming sends the visitor to /contact with the chosen slot.
const SLOTS = ['09:30', '11:00', '14:30', '16:00'];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function BookingCalendar() {
  const { tr, intl } = useT();
  const [today, setToday] = useState<Date | null>(null);
  const [month, setMonth] = useState<Date | null>(null);
  const [day, setDay] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);

  // Dates are computed on the client only (avoids server/client mismatch).
  useEffect(() => {
    const t = startOfDay(new Date());
    setToday(t);
    setMonth(new Date(t.getFullYear(), t.getMonth(), 1));
  }, []);

  const days = useMemo(() => {
    if (!month) return [];
    const first = (month.getDay() + 6) % 7; // Monday-first
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  }, [month]);

  const weekdays = useMemo(() => {
    const monday = new Date(2024, 0, 1); // a Monday
    return Array.from({ length: 7 }, (_, i) =>
      new Intl.DateTimeFormat(intl, { weekday: 'short' }).format(new Date(monday.getTime() + i * 864e5)),
    );
  }, [intl]);

  const bookable = (d: Date) => !!today && d > today && d.getDay() !== 0 && d.getDay() !== 6;
  const canPrev = !!month && !!today && (month.getFullYear() > today.getFullYear() || month.getMonth() > today.getMonth());
  const shift = (n: number) => month && setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));

  const iso = day ? `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}` : '';

  return (
    <div className="rounded-token-xl border border-line bg-sand-0 p-2 shadow-token-xl">
      <div className="rounded-token-lg border border-line p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <img src="/communium-logo-red.png" alt="" width={40} height={40} className="h-10 w-10 rounded-token-sm border border-line object-contain p-1" />
          <div>
            <p className="text-[15px] font-semibold text-sand-900">{tr('Appel découverte · 30 min')}</p>
            <p className="text-[12px] text-sand-600">{tr('Avec un membre de l’équipe The Communium')}</p>
          </div>
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-sand-600">
          <li className="flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden="true" />30 min</li>
          <li className="flex items-center gap-1.5"><VideoCamera className="h-4 w-4" aria-hidden="true" />{tr('Visio intégrée')}</li>
          <li className="flex items-center gap-1.5"><GlobeHemisphereEast className="h-4 w-4" aria-hidden="true" />Africa/Casablanca</li>
        </ul>

        <div className="mt-6 flex items-center justify-between">
          <button type="button" onClick={() => shift(-1)} disabled={!canPrev} aria-label={tr('Mois précédent')} className="grid grid-cols-1 h-9 w-9 place-items-center rounded-full text-sand-700 transition-colors hover:bg-sand-100 disabled:opacity-30">
            <CaretLeft weight="bold" className="h-4 w-4 rtl:-scale-x-100" />
          </button>
          <p className="text-[14px] font-semibold capitalize text-sand-900" aria-live="polite">
            {month ? new Intl.DateTimeFormat(intl, { month: 'long', year: 'numeric' }).format(month) : ' '}
          </p>
          <button type="button" onClick={() => shift(1)} aria-label={tr('Mois suivant')} className="grid grid-cols-1 h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-600 transition-colors hover:bg-brand-100">
            <CaretRight weight="bold" className="h-4 w-4 rtl:-scale-x-100" />
          </button>
        </div>

        <div role="group" aria-label={tr('Choisissez une date')} className="mt-3 grid grid-cols-7 gap-1 text-center">
          {weekdays.map((w) => (
            <span key={w} aria-hidden="true" className="pb-1 text-[11px] font-medium capitalize text-sand-500">{w}</span>
          ))}
          {days.map((d, i) =>
            d ? (
              <button
                key={i}
                type="button"
                disabled={!bookable(d)}
                aria-pressed={!!day && d.getTime() === day.getTime()}
                aria-label={new Intl.DateTimeFormat(intl, { dateStyle: 'full' }).format(d)}
                onClick={() => { setDay(d); setSlot(null); }}
                className={cn(
                  'mx-auto grid h-9 w-9 place-items-center rounded-full text-[13px] tabular-nums transition-colors duration-150',
                  !bookable(d) && 'text-sand-300',
                  bookable(d) && 'bg-brand-50 font-semibold text-brand-700 hover:bg-brand-100',
                  day && d.getTime() === day.getTime() && '!bg-brand-500 !text-white shadow-red',
                )}
              >
                {d.getDate()}
              </button>
            ) : (
              <span key={i} />
            ),
          )}
        </div>

        <div className={cn('grid transition-[grid-template-rows] duration-300 ease-out', day ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
          <div className="overflow-hidden">
            <p className="mt-5 text-[12px] font-medium text-sand-600">{tr('Créneaux disponibles')}</p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {SLOTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  tabIndex={day ? 0 : -1}
                  aria-pressed={slot === s}
                  onClick={() => setSlot(s)}
                  className={cn(
                    'rounded-full border py-2 text-[13px] font-semibold tabular-nums transition-colors duration-150',
                    slot === s ? 'border-brand-500 bg-brand-500 text-white' : 'border-line text-sand-800 hover:border-brand-300',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {day && slot ? (
          <Link href={`/contact?date=${iso}&time=${slot}`} className="btn-primary btn-lg mt-5 w-full">
            {tr('Confirmer le rendez-vous')}
          </Link>
        ) : (
          <button type="button" disabled className="btn-primary btn-lg mt-5 w-full">
            {day ? tr('Choisissez un créneau') : tr('Choisissez une date')}
          </button>
        )}
      </div>
    </div>
  );
}

export function Booking() {
  const { tr } = useT();
  const reassurance = [
    { icon: EnvelopeSimple, label: 'Confirmation immédiate par email' },
    { icon: HandWaving, label: 'Sans engagement' },
    { icon: CalendarCheck, label: 'Un conseiller dédié pour votre candidature' },
  ];
  return (
    <Section id="booking" labelledBy="booking-title" className="overflow-hidden">
      <div aria-hidden="true" className="lp-glow -end-40 top-20 h-[520px] w-[520px] opacity-70" />
      <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <SectionHeading
            id="booking-title"
            align="start"
            eyebrow={tr('Prise de rendez-vous directe')}
            title={tr('Échangez avec')}
            accent={tr('notre équipe.')}
            lead={tr('Choisissez la date et l’horaire qui vous conviennent pour parler de vos objectifs et découvrir la plateforme.')}
          />
          <ul className="mt-8 flex max-w-[26rem] flex-col gap-3">
            {reassurance.map(({ icon: Icon, label }, i) => (
              <Reveal as="li" key={label} delay={80 + i * 60} className="flex items-center gap-3 rounded-full border border-line bg-sand-0 py-2.5 pe-5 ps-2.5 text-[14px] font-medium text-sand-800 shadow-token-sm">
                <span className="grid grid-cols-1 h-8 w-8 place-items-center rounded-full bg-brand-50 text-brand-600">
                  <Icon weight="bold" className="h-4 w-4" aria-hidden="true" />
                </span>
                {tr(label)}
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal delay={120}>
          <BookingCalendar />
        </Reveal>
      </div>
    </Section>
  );
}
