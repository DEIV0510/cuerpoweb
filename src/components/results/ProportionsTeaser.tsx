'use client';

import { useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowRight, Ruler } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import { STRATEGY_GUIDES } from '@/data/proportion-recommendations';
import { formatHeadsLabel } from '@/lib/proportions/eight-heads';
import {
  parseProportions,
  readRawProportions,
  subscribeToAnalysis,
} from '@/lib/storage';

const PENDING = '__pendiente__';

function getServerSnapshot(): string {
  return PENDING;
}

/**
 * Enlace entre los dos análisis: si la proporción vertical ya está calculada
 * muestra el resumen; si no, invita a hacerla.
 */
export function ProportionsTeaser() {
  const raw = useSyncExternalStore(
    subscribeToAnalysis,
    readRawProportions,
    getServerSnapshot,
  );

  const stored = useMemo(
    () => (raw === PENDING ? null : parseProportions(raw)),
    [raw],
  );

  const strategy = stored ? STRATEGY_GUIDES[stored.result.strategy] : null;

  return (
    <section
      aria-labelledby="proporcion-vertical"
      className="rounded-card border border-line bg-surface p-5 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft">
          <Ruler aria-hidden="true" className="h-5 w-5 text-brand-dark" />
        </span>
        <div>
          <h2 id="proporcion-vertical" className="text-xl leading-tight">
            Tu proporción vertical
          </h2>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
            Técnica de las 8 cabezas
          </p>
        </div>
      </div>

      {stored && strategy ? (
        <>
          <p className="mt-4 text-[1.05rem] text-ink">{strategy.title}</p>
          <p className="mt-1 text-[0.95rem] text-muted">
            Tu cuerpo mide {formatHeadsLabel(stored.result.totalHeads)}. La
            silueta define los cortes; la proporción, a qué altura ponerlos.
          </p>
          <Link
            href="/proporciones/resultado"
            className={buttonClasses('secondary', 'lg', 'no-print mt-4 w-full')}
          >
            Ver mi proporción vertical
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </>
      ) : (
        <>
          <p className="mt-4 text-[0.95rem] text-muted">
            Con cuatro medidas verticales sabrás si tu torso es corto o largo, qué
            tiro de pantalón te sienta mejor, si te favorecen las chaquetas cortas o
            los blazers largos, y cuánta altura necesita tu zapato.
          </p>
          <Link
            href="/proporciones"
            className={buttonClasses('secondary', 'lg', 'no-print mt-4 w-full')}
          >
            Hacer la técnica de las 8 cabezas
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </>
      )}
    </section>
  );
}
