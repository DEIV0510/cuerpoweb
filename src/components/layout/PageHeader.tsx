import type { ReactNode } from 'react';
import { Eyebrow } from '@/components/ui/Card';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

/** Cabecera estándar de las páginas interiores. */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-3 text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{description}</p>
        {children ? <div className="mt-7">{children}</div> : null}
      </div>
    </section>
  );
}
