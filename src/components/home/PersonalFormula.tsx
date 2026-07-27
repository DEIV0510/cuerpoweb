import Link from 'next/link';
import {
  ArrowRight,
  Footprints,
  Layers,
  Ruler,
  Shirt,
  Sparkle,
  Target,
  Wand2,
} from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';

/** Las seis decisiones de la fórmula, en su versión genérica. */
const DECISIONS: Array<{ icon: typeof Ruler; label: string }> = [
  { icon: Ruler, label: 'Tiro del pantalón' },
  { icon: Shirt, label: 'La blusa, por dentro o por fuera' },
  { icon: Layers, label: 'Largo de chaqueta o blazer' },
  { icon: Footprints, label: 'La altura del zapato' },
  { icon: Sparkle, label: 'El escote' },
  { icon: Target, label: 'Tu punto focal' },
];

/**
 * Presenta la fórmula personal en la página de inicio: el cruce entre la
 * silueta (qué cortes) y la proporción vertical (a qué altura). Versión
 * estática y explicativa, con la estética de la tarjeta del resultado.
 */
export function PersonalFormula() {
  return (
    <section id="formula" className="app-shell app-shell-wide scroll-mt-20 px-gutter py-4 sm:py-6">
      <div className="rounded-card border border-sand bg-surface p-5 shadow-card sm:p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft">
            <Wand2 aria-hidden="true" className="h-5 w-5 text-brand-dark" />
          </span>
          <div>
            <h2 className="text-2xl leading-tight">Tu fórmula personal</h2>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
              Silueta + proporción vertical
            </p>
          </div>
        </div>

        <p className="mt-4 max-w-2xl text-[1.02rem] text-muted">
          Tu silueta dice <strong className="text-ink">qué cortes</strong> te
          acompañan; la técnica de las 8 cabezas dice{' '}
          <strong className="text-ink">a qué altura</strong> llevarlos. Cuando
          tienes los dos análisis, se cruzan en seis decisiones concretas de
          vestuario:
        </p>

        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {DECISIONS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-line bg-shell px-4 py-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface">
                <Icon aria-hidden="true" className="h-4 w-4 text-brand" />
              </span>
              <span className="text-[0.975rem] font-medium text-ink">{label}</span>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-sm text-faint">
          Tu fórmula aparece personalizada en tu resultado cuando completas la
          silueta y la proporción.
        </p>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <Link href="/analisis" className={buttonClasses('primary', 'lg', 'w-full sm:w-auto')}>
            Empezar por mi silueta
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link
            href="/proporciones"
            className={buttonClasses('secondary', 'lg', 'w-full sm:w-auto')}
          >
            Medir mi proporción
          </Link>
        </div>
      </div>
    </section>
  );
}
