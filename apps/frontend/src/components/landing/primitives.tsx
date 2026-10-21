'use client';

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { TrendDown, TrendUp } from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/lib/utils';
import { useT } from '@/lib/i18n';

/* ───── useInView: true once the element scrolls into view (never resets) ───── */
export function useInView<T extends Element>(rootMargin = '0px 0px -12% 0px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === 'undefined') return setInView(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, rootMargin]);
  return [ref, inView] as const;
}

/* ───── Reveal: fade + rise on scroll; `delay` staggers grids ───── */
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  className,
  style,
  children,
  ...rest
}: {
  as?: ElementType;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  [key: string]: unknown;
}) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={cn(inView && 'is-in', className)}
      style={{ ...style, ['--reveal-delay' as string]: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ───── CountUp: animates a number once it is visible ───── */
export function CountUp({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1400,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const { intl } = useT();
  const [ref, inView] = useInView<HTMLSpanElement>();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setShown(value);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setShown(value * (1 - Math.pow(1 - p, 4))); // ease-out quart
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  const text = shown.toLocaleString(intl, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span ref={ref} dir="ltr" className={cn('inline-block tabular-nums', className)}>
      {/* screen readers get the final value, not every frame */}
      <span aria-hidden="true">{prefix}{text}{suffix}</span>
      <span className="sr-only">{prefix}{value.toLocaleString(intl)}{suffix}</span>
    </span>
  );
}

/* ───── Layout ───── */
export function Section({
  id,
  className,
  containerClassName,
  children,
  labelledBy,
}: {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn('relative py-section', className)}>
      <div className={cn('mx-auto w-full max-w-container px-gutter', containerClassName)}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('eyebrow-pill', className)}>{children}</span>;
}

/** Section heading: optional eyebrow, a title whose `accent` part is set in italic red serif, and a lead. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  accent,
  lead,
  align = 'center',
  className,
}: {
  id?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  accent?: ReactNode;
  lead?: ReactNode;
  align?: 'center' | 'start';
  className?: string;
}) {
  return (
    <Reveal className={cn('flex flex-col gap-4', align === 'center' ? 'mx-auto max-w-[44rem] items-center text-center' : 'max-w-[40rem] items-start', className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 id={id} className="text-h2 font-semibold text-sand-900">
        {title}
        {accent && (
          <>
            {' '}
            <span className="accent-serif">{accent}</span>
          </>
        )}
      </h2>
      {lead && <p className="text-[15.5px] leading-relaxed text-sand-600 sm:text-base">{lead}</p>}
    </Reveal>
  );
}

/* ───── Data bits ───── */
export function DeltaBadge({ value, className }: { value: string; className?: string }) {
  const down = value.trim().startsWith('-') || value.trim().startsWith('−');
  const Icon = down ? TrendDown : TrendUp;
  return (
    <span
      dir="ltr"
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums',
        down ? 'bg-brand-50 text-brand-700' : 'bg-success-50 text-success-600',
        className,
      )}
    >
      <Icon weight="bold" className="h-3 w-3" aria-hidden="true" />
      {value}
    </span>
  );
}

export function LiveBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2 py-0.5 text-[11px] font-semibold text-success-600">
      <span className="lp-live-dot" aria-hidden="true" />
      {label}
    </span>
  );
}

/** Stat tile: big value + label (trust bar, hero KPIs, case studies). */
export function StatTile({
  value,
  label,
  sub,
  delta,
  className,
  size = 'md',
}: {
  value: ReactNode;
  label: ReactNode;
  sub?: ReactNode;
  delta?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <div className={cn('stat-tile flex flex-col gap-1', size === 'lg' && 'px-5 py-4', className)}>
      <span className="text-[11px] font-medium text-sand-600">{label}</span>
      <span
        className={cn(
          'font-display font-semibold tracking-tight text-sand-900 tabular-nums',
          size === 'sm' && 'text-[15px]',
          size === 'md' && 'text-xl',
          size === 'lg' && 'text-3xl sm:text-[2.1rem]',
        )}
      >
        {value}
      </span>
      {(delta || sub) && (
        <span className="flex items-center gap-2 text-[11px] text-sand-600">
          {delta && <DeltaBadge value={delta} />}
          {sub}
        </span>
      )}
    </div>
  );
}

/** Browser-like frame for HTML product mockups. */
export function MockWindow({
  title,
  right,
  className,
  bodyClassName,
  children,
}: {
  title?: ReactNode;
  right?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('overflow-hidden rounded-token-lg border border-line bg-sand-0 shadow-token-md', className)}>
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-2.5 w-2.5 rounded-full bg-sand-300" />
          <i className="h-2.5 w-2.5 rounded-full bg-sand-200" />
          <i className="h-2.5 w-2.5 rounded-full bg-sand-200" />
        </span>
        {title && <span className="truncate text-[12px] font-medium text-sand-600">{title}</span>}
        {right && <span className="ms-auto">{right}</span>}
      </div>
      <div className={cn('p-4', bodyClassName)}>{children}</div>
    </div>
  );
}
