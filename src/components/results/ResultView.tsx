'use client';

import { useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowRight, ClipboardList } from 'lucide-react';
import { ResultHero } from '@/components/results/ResultHero';
import { MeasurementComparison } from '@/components/results/MeasurementComparison';
import { RuleExplanation } from '@/components/results/RuleExplanation';
import { VisualObjectiveCard } from '@/components/results/VisualObjectiveCard';
import { RecommendationTabs } from '@/components/results/RecommendationTabs';
import { OutfitCard } from '@/components/results/OutfitCard';
import { ResultActions } from '@/components/results/ResultActions';
import { buttonClasses } from '@/components/ui/Button';
import { SITE } from '@/data/navigation';
import {
  parseStoredAnalysis,
  readRawAnalysis,
  subscribeToAnalysis,
} from '@/lib/storage';
import { formatLongDate } from '@/lib/utils';

/**
 * Valor devuelto durante el renderizado en servidor y en la hidratación.
 * Permite mostrar un estado de carga sin provocar diferencias de hidratación.
 */
const PENDING = '__pendiente__';

function getServerSnapshot(): string {
  return PENDING;
}

/** Vista del último análisis guardado en el dispositivo. */
export function ResultView() {
  const raw = useSyncExternalStore(
    subscribeToAnalysis,
    readRawAnalysis,
    getServerSnapshot,
  );

  const analysis = useMemo(
    () => (raw === PENDING ? null : parseStoredAnalysis(raw)),
    [raw],
  );

  if (raw === PENDING) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
        <p aria-live="polite" className="text-center text-muted">
          Cargando tu resultado…
        </p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-col items-center gap-5 rounded-card border border-line bg-surface p-8 text-center sm:p-12">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft/60">
            <ClipboardList aria-hidden="true" className="h-6 w-6 text-brand-dark" />
          </span>
          <h1 className="text-3xl sm:text-4xl">Todavía no hay un resultado</h1>
          <p className="max-w-md text-muted">
            Para ver tu silueta necesitamos tres medidas: busto, cintura y cadera.
            El análisis toma menos de un minuto y se calcula en tu propio
            dispositivo.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/analisis" className={buttonClasses('primary', 'lg')}>
              Realizar mi análisis
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link href="/como-medirse" className={buttonClasses('secondary', 'lg')}>
              Ver cómo medirme
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { result, createdAt } = analysis;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
      <header className="print-only">
        <p className="font-script text-3xl">{SITE.brand}</p>
        <p className="text-sm">
          {SITE.product} · Ficha del {formatLongDate(createdAt)}
        </p>
        <hr className="mt-3" />
      </header>

      <div className="alma-fade-up">
        <ResultHero result={result} createdAt={createdAt} />
      </div>

      <ResultActions result={result} />

      <VisualObjectiveCard result={result} />

      <MeasurementComparison result={result} />

      <RuleExplanation result={result} />

      <RecommendationTabs recommendations={result.recommendations} />

      <section aria-labelledby="titulo-outfits">
        <h2 id="titulo-outfits" className="text-2xl">
          Ejemplos de outfits completos
        </h2>
        <p className="mt-2 text-[0.95rem] text-muted">
          Tres combinaciones para distintos momentos, pensadas para tu silueta.
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {result.recommendations.outfitExamples.map((outfit) => (
            <OutfitCard key={outfit.name} outfit={outfit} />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="cierre-resultado"
        className="rounded-card border border-line bg-surface p-6 sm:p-7"
      >
        <h2 id="cierre-resultado" className="text-2xl">
          Cómo usar esta guía
        </h2>
        <ul className="mt-4 flex flex-col gap-3 text-[0.95rem] text-muted">
          <li>
            Empieza por una sola categoría. Aplicar dos o tres ideas ya cambia la
            forma en que se ve un conjunto.
          </li>
          <li>
            Si te identificas con dos siluetas, combina las recomendaciones de
            ambas: son orientaciones, no reglas rígidas.
          </li>
          <li>
            Guarda o imprime esta ficha y llévala contigo cuando vayas de compras.
          </li>
        </ul>
        <p className="mt-5 text-sm text-muted">{SITE.disclaimer}</p>
      </section>

      <ResultActions result={result} />
    </div>
  );
}
