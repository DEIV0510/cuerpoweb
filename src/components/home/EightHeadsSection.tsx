import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Card';
import { SEGMENT_FIELDS } from '@/data/proportion-recommendations';

/** Presentación de la técnica de las 8 cabezas en la página de inicio. */
export function EightHeadsSection() {
  return (
    <section className="app-shell app-shell-wide px-gutter py-12 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <Eyebrow>Proporción vertical</Eyebrow>
          <h2 className="mt-2.5 text-[1.8rem] leading-tight sm:text-4xl">
            La técnica de las 8 cabezas
          </h2>
          <p className="mt-3 text-muted">
            La silueta explica tus contornos; esta técnica explica tus alturas. El
            cuerpo se divide en unidades del tamaño de tu propia cabeza y así se
            sabe si tu torso es corto o largo, qué tiro de pantalón te sienta, si te
            favorecen las chaquetas cortas o los blazers largos y cuánta altura
            necesita tu zapato.
          </p>
          <p className="mt-3 text-muted">
            No importa si mides 1,50 m o 1,80 m: lo que estiliza es la proporción
            interna, y es pura matemática.
          </p>
          <Link
            href="/proporciones"
            className={buttonClasses('primary', 'lg', 'mt-6 w-full sm:w-auto')}
          >
            Medir mi proporción
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        <ul className="flex flex-col gap-2.5">
          {SEGMENT_FIELDS.map((field) => (
            <li
              key={field.id}
              className="flex items-center gap-4 rounded-card border border-line bg-surface px-5 py-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft font-serif text-lg font-semibold text-brand-dark">
                {field.reference}
              </span>
              <div>
                <p className="font-medium text-ink">{field.label}</p>
                <p className="text-sm text-muted">
                  {field.reference === 1 ? '1 cabeza' : `${field.reference} cabezas`} de
                  referencia
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
