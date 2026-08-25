import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/80',
    secondary:
      'bg-[var(--color-base)] text-[var(--color-text-secondary)] hover:bg-[var(--color-base)]/80',
    outline: 'text-[var(--color-text-primary)] border border-[var(--color-border)]',
    destructive: 'bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger)]/80',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
