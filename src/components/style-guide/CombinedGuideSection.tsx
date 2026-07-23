'use client';

import Link from 'next/link';
import { ArrowRight, Ruler, Wand2 } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import { CombinedGuideCard } from '@/components/style-guide/CombinedGuideCard';
import { useCombinedGuide } from '@/components/style-guide/use-combined-guide';
import { formatHeadsLabel } from '@/lib/proportions/eight-heads';

interface CombinedGuideSectionProps {
  /** Qué análisis se está viendo, para invitar al que falta. */
  from: 'shape' | 'proportions';
}

/**
 * Muestra la fórmula personal cuando los dos análisis están hechos.
 * Si falta alguno, invita a completarlo explicando qué se gana.
 */
export function CombinedGuideSection({ from }: CombinedGuideSectionProps) {
  const { pending, analysis, proportions, guide } = useCombinedGuide();

  if (pending) return null;

  if (guide) {
    return (
      <div className="flex flex-col gap-3">
        <CombinedGuideCard guide={guide} />

        {from === 'shape' && proportions ? (
          <Link
            href="/proporciones/resultado"
            className={buttonClasses('ghost', 'md', 'no-print w-full')}
          >
            Ver el detalle de mi proporción vertical
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        ) : null}

        {from === 'proportions' && analysis ? (
          <Link
            href="/resultado"
            className={buttonClasses('ghost', 'md', 'no-print w-full')}
          >
            Ver el detalle de mi silueta
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    );
  }

  const missing = from === 'shape' ? 'proportions' : 'shape';

  return (
    <section
      aria-labelledby="completar-guia"
      className="no-print rounded-card border border-line bg-surface p-5 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft">
          {missing === 'proportions' ? (
            <Ruler aria-hidden="true" className="h-5 w-5 text-brand-dark" />
          ) : (
            <Wand2 aria-hidden="true" className="h-5 w-5 text-brand-dark" />
          )}
        </span>
        <div>
          <h2 id="completar-guia" className="text-xl leading-tight">
            Completa tu fórmula personal
          </h2>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
            Te falta un análisis
          </p>
        </div>
      </div>

      {missing === 'proportions' ? (
        <>
          <p className="mt-4 text-[0.95rem] text-muted">
            Ya sabes qué cortes acompañan tus contornos. Con la técnica de las 8
            cabezas sabrás <strong className="text-ink">a qué altura</strong>{' '}
            ponerlos: tiro del pantalón, largo de chaqueta y altura del zapato.
          </p>
          <Link
            href="/proporciones"
            className={buttonClasses('primary', 'lg', 'mt-4 w-full')}
          >
            Hacer la técnica de las 8 cabezas
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </>
      ) : (
        <>
          <p className="mt-4 text-[0.95rem] text-muted">
            {proportions
              ? `Tu cuerpo mide ${formatHeadsLabel(proportions.result.totalHeads)} y ya sabes a qué altura poner cada prenda. `
              : ''}
            Con el análisis de silueta sabrás además{' '}
            <strong className="text-ink">qué cortes</strong> acompañan tus
            contornos, y las dos guías se combinan en una sola fórmula.
          </p>
          <Link
            href="/analisis"
            className={buttonClasses('primary', 'lg', 'mt-4 w-full')}
          >
            Analizar mi silueta
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </>
      )}
    </section>
  );
}
