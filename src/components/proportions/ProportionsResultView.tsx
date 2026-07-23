'use client';

import { useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Footprints,
  Ruler,
  RotateCcw,
  Shirt,
  Sparkles,
} from 'lucide-react';
import { Accordion } from '@/components/ui/Accordion';
import { buttonClasses } from '@/components/ui/Button';
import { HeadRuler } from '@/components/proportions/HeadRuler';
import {
  SEGMENT_GUIDES,
  SEGMENT_SHORT_LABELS,
  STRATEGY_GUIDES,
} from '@/data/proportion-recommendations';
import { formatCm } from '@/lib/body-shape/calculations';
import {
  formatHeads,
  formatHeadsLabel,
  type ProportionSegment,
} from '@/lib/proportions/eight-heads';
import {
  parseProportions,
  readRawProportions,
  subscribeToAnalysis,
} from '@/lib/storage';
import { formatLongDate } from '@/lib/utils';
import { SITE } from '@/data/navigation';

const PENDING = '__pendiente__';

function getServerSnapshot(): string {
  return PENDING;
}

const SEGMENT_ICONS = {
  torso: Shirt,
  rise: Ruler,
  legs: Footprints,
} as const;

const SEGMENT_ORDER: ProportionSegment[] = ['torso', 'rise', 'legs'];

/** Resultado de la técnica de las 8 cabezas. */
export function ProportionsResultView() {
  const raw = useSyncExternalStore(
    subscribeToAnalysis,
    readRawProportions,
    getServerSnapshot,
  );

  const stored = useMemo(
    () => (raw === PENDING ? null : parseProportions(raw)),
    [raw],
  );

  if (raw === PENDING) {
    return (
      <div className="app-shell px-gutter py-20">
        <p aria-live="polite" className="text-center text-muted">
          Cargando tu proporción…
        </p>
      </div>
    );
  }

  if (!stored) {
    return (
      <div className="app-shell px-gutter py-12 sm:py-20">
        <div className="flex flex-col items-center gap-5 rounded-card border border-line bg-surface px-6 py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
            <Ruler aria-hidden="true" className="h-6 w-6 text-brand-dark" />
          </span>
          <h1 className="text-3xl">Todavía no calculaste tu proporción</h1>
          <p className="max-w-sm text-muted">
            Con cuatro medidas verticales sabrás si tu torso es corto o largo y qué
            tiro, largo de chaqueta y altura de zapato te acompañan mejor.
          </p>
          <Link href="/proporciones" className={buttonClasses('primary', 'lg', 'w-full')}>
            Hacer la técnica de las 8 cabezas
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const { result, createdAt } = stored;
  const strategy = STRATEGY_GUIDES[result.strategy];

  return (
    <div className="app-shell flex flex-col gap-4 px-gutter py-5 sm:gap-5 sm:py-8">
      <header className="print-only">
        <p className="font-script text-3xl">{SITE.brand}</p>
        <p className="text-sm">
          Proporción vertical · Ficha del {formatLongDate(createdAt)}
        </p>
        <hr className="mt-3" />
      </header>

      <section
        aria-labelledby="titulo-proporcion"
        className="bg-blush-radial alma-fade-up rounded-card border border-line px-5 py-7 text-center sm:px-8"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
          Técnica de las 8 cabezas
        </p>
        <h1 id="titulo-proporcion" className="mt-2 text-[2rem] leading-tight sm:text-4xl">
          {strategy.title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[1.05rem] text-muted">
          {strategy.description}
        </p>

        <dl className="mt-5 flex flex-wrap justify-center gap-2">
          <div className="flex items-baseline gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2">
            <dt className="text-xs text-faint">Tu cabeza</dt>
            <dd className="text-sm font-semibold text-ink">
              {formatCm(result.headCm)} cm
            </dd>
          </div>
          <div className="flex items-baseline gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2">
            <dt className="text-xs text-faint">Tu cuerpo</dt>
            <dd className="text-sm font-semibold text-ink">
              {formatHeadsLabel(result.totalHeads)}
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-xs text-faint">
          Análisis del {formatLongDate(createdAt)}
        </p>

        {result.warnings.length > 0 ? (
          <div className="mt-5 rounded-2xl border border-sand bg-surface/80 p-4 text-left text-sm text-brand-dark">
            <p className="font-semibold">Ten en cuenta</p>
            <ul className="mt-2 flex flex-col gap-2">
              {result.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section
        aria-labelledby="acciones-rapidas"
        className="rounded-card border border-sand bg-brand-soft/45 p-5 sm:p-6"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface">
            <Sparkles aria-hidden="true" className="h-5 w-5 text-brand-dark" />
          </span>
          <h2 id="acciones-rapidas" className="text-xl">
            Cámbialo hoy mismo
          </h2>
        </div>
        <ul className="mt-4 flex flex-col gap-2.5">
          {strategy.quickWins.map((win) => (
            <li key={win} className="flex gap-2.5 text-[0.975rem] text-ink">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
              />
              <span>{win}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="grafico-cabezas"
        className="rounded-card border border-line bg-surface p-5 sm:p-6"
      >
        <h2 id="grafico-cabezas" className="text-2xl">
          Tu cuerpo en cabezas
        </h2>
        <p className="mt-1.5 text-[0.95rem] text-muted">
          Cada bloque es un tramo. La columna de la derecha es la referencia
          clásica: 1 + 2 + 1 + 4.
        </p>
        <div className="mt-6">
          <HeadRuler result={result} />
        </div>
      </section>

      <section aria-labelledby="tramos" className="flex flex-col gap-3">
        <div>
          <h2 id="tramos" className="text-2xl">
            Qué hacer con cada tramo
          </h2>
          <p className="mt-1.5 text-[0.95rem] text-muted">
            Toca cada tramo para ver qué prendas lo acompañan mejor.
          </p>
        </div>

        {SEGMENT_ORDER.map((id, index) => {
          const segment = result.segments[id];
          const guide = SEGMENT_GUIDES[id][segment.balance];
          const Icon = SEGMENT_ICONS[id];

          return (
            <Accordion
              key={id}
              title={guide.title}
              subtitle={`${SEGMENT_SHORT_LABELS[id]} · ${formatHeads(segment.heads)} de ${segment.reference} cabezas`}
              defaultOpen={index === 0}
              leading={
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft">
                  <Icon aria-hidden="true" className="h-4 w-4 text-brand-dark" />
                </span>
              }
            >
              <p className="text-[0.975rem] text-muted">{guide.insight}</p>

              <dl className="mt-4 flex flex-wrap gap-2">
                <div className="flex items-baseline gap-1.5 rounded-full bg-shell px-3 py-1.5 text-sm">
                  <dt className="text-faint">Tu medida</dt>
                  <dd className="font-semibold text-ink">
                    {formatCm(segment.measuredCm)} cm
                  </dd>
                </div>
                <div className="flex items-baseline gap-1.5 rounded-full bg-shell px-3 py-1.5 text-sm">
                  <dt className="text-faint">Diferencia</dt>
                  <dd className="font-semibold text-ink">
                    {segment.difference > 0 ? '+' : ''}
                    {formatCm(segment.differenceCm)} cm
                  </dd>
                </div>
              </dl>

              <ul className="mt-4 flex flex-col gap-3">
                {guide.tips.map((tip) => (
                  <li key={tip} className="flex gap-3 text-[0.975rem] text-ink">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                    />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </Accordion>
          );
        })}
      </section>

      <section aria-labelledby="siguiente-paso" className="pt-2">
        <h2 id="siguiente-paso" className="text-2xl">
          Combínalo con tu silueta
        </h2>
        <p className="mt-1.5 text-[0.95rem] text-muted">
          La silueta te dice qué cortes acompañan tus contornos; la proporción
          vertical, a qué altura ponerlos. Juntas son la guía completa.
        </p>
        <div className="no-print mt-4 flex flex-col gap-2.5">
          <Link href="/resultado" className={buttonClasses('primary', 'lg', 'w-full')}>
            Ver mi silueta
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link href="/proporciones" className={buttonClasses('ghost', 'lg', 'w-full')}>
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Repetir esta medición
          </Link>
        </div>
        <p className="mt-4 text-sm text-faint">
          Método de proporción vertical versión {result.version}. Es una guía de
          imagen, no una evaluación médica.
        </p>
      </section>
    </div>
  );
}
