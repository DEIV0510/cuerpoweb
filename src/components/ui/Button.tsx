import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 text-center';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary:
    'bg-surface text-ink border border-line hover:border-brand hover:text-brand-dark',
  ghost: 'text-brand-dark hover:bg-brand-soft/50 border border-transparent',
  danger: 'bg-surface text-brand-dark border border-brand-soft hover:bg-brand-soft/60',
};

const SIZES: Record<ButtonSize, string> = {
  md: 'min-h-11 px-5 py-2.5 text-[0.975rem]',
  lg: 'min-h-13 px-7 py-3 text-base',
};

/** Clases compartidas por botones y enlaces con apariencia de botón. */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
}
