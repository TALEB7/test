import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-primary/40 bg-primary/10 text-primary',
        secondary: 'border-border/60 bg-muted/60 text-muted-foreground',
        destructive: 'gem-badge-ruby rounded-md',
        outline: 'text-foreground border-primary/30',
        gold: 'gem-badge-gold rounded-md',
        emerald: 'gem-badge-emerald rounded-md',
        sapphire: 'gem-badge-sapphire rounded-md',
        teal: 'border-gem-teal/30 bg-gem-teal/10 text-gem-teal',
        ruby: 'gem-badge-ruby rounded-md',
        ultra: 'rarity-ultra text-[10px] font-bold uppercase tracking-[0.12em]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
