import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section' | 'li';
}

/** Superficie base: fondo claro, borde suave y esquinas amplias. */
export function Card({ children, className, as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-card border border-line bg-surface p-6 sm:p-7',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

/** Etiqueta pequeña en mayúsculas que antecede a un título. */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        'text-xs font-semibold uppercase tracking-[0.18em] text-brand',
        className,
      )}
    >
      {children}
    </p>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  id?: string;
}

/** Encabezado reutilizable de sección. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  id,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 id={id} className="text-3xl sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className={cn('text-muted', align === 'center' && 'max-w-2xl')}>
          {description}
        </p>
      ) : null}
    </header>
  );
}
