import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide text-center transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-white shadow-glow hover:-translate-y-0.5 hover:bg-brand-dark',
  secondary:
    'border border-sand bg-white/60 text-ink backdrop-blur hover:-translate-y-0.5 hover:border-brand hover:text-brand-dark',
  ghost: 'border border-transparent text-brand-dark hover:bg-brand-soft/60',
  danger:
    'border border-sand bg-white/70 text-brand-dark backdrop-blur hover:-translate-y-0.5 hover:border-brand hover:bg-brand-soft/50',
};

const SIZES: Record<ButtonSize, string> = {
  md: 'min-h-11 px-6 py-2.5 text-[0.95rem]',
  lg: 'min-h-13 px-8 py-3.5 text-base',
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
