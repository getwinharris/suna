'use client';

import { cn } from '@/lib/utils';

interface BapxLogoProps {
  size?: number;
  variant?: 'symbol' | 'logomark';
  className?: string;
}

export function BapxLogo({ size = 24, variant = 'symbol', className }: BapxLogoProps) {
  if (variant === 'logomark') {
    return (
      <span
        className={cn('inline-flex items-center gap-2 font-semibold tracking-tight text-foreground flex-shrink-0', className)}
        style={{ fontSize: `${size}px`, lineHeight: 1 }}
        aria-label="Bapx Media Hub"
        suppressHydrationWarning
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bapx-symbol.svg"
          alt=""
          className="dark:invert flex-shrink-0"
          style={{ width: `${size}px`, height: `${size}px` }}
          suppressHydrationWarning
        />
        <span>Bapx Media Hub</span>
      </span>
    );
  }

  // Default symbol variant behavior - invert for dark mode
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/bapx-symbol.svg"
      alt="Bapx Media Hub"
      className={cn('dark:invert flex-shrink-0', className)}
      style={{ width: `${size}px`, height: `${size}px` }}
      suppressHydrationWarning
    />
  );
}
