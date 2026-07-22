import type { ReactNode } from 'react';
import { Eyebrow } from '@/components/ui/Card';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

/** Cabecera estándar de las páginas interiores, compacta en móvil. */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <section className="bg-blush-radial relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-16 h-64 w-64 rounded-full bg-sand/40 blur-3xl"
      />
      <div className="app-shell app-shell-wide relative px-gutter py-8 sm:py-12">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-2.5 text-[2.1rem] leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-muted sm:text-lg">{description}</p>
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  );
}
