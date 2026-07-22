'use client';

import { useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ClipboardList } from 'lucide-react';
import { ResultHero } from '@/components/results/ResultHero';
import { MeasurementComparison } from '@/components/results/MeasurementComparison';
import { RuleExplanation } from '@/components/results/RuleExplanation';
import { VisualObjectiveCard } from '@/components/results/VisualObjectiveCard';
import { RecommendationAccordion } from '@/components/results/RecommendationAccordion';
import { OutfitCard } from '@/components/results/OutfitCard';
import { ResultActions } from '@/components/results/ResultActions';
import { Accordion } from '@/components/ui/Accordion';
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
      <div className="app-shell px-gutter py-20">
        <p aria-live="polite" className="text-center text-muted">
          Cargando tu resultado…
        </p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="app-shell px-gutter py-12 sm:py-20">
        <div className="flex flex-col items-center gap-5 rounded-card border border-line bg-surface px-6 py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
            <ClipboardList aria-hidden="true" className="h-6 w-6 text-brand-dark" />
          </span>
          <h1 className="text-3xl">Todavía no hay un resultado</h1>
          <p className="max-w-sm text-muted">
            Para ver tu silueta necesitamos tres medidas: busto, cintura y cadera.
            El análisis toma unos minutos y se calcula en tu propio teléfono.
          </p>
          <div className="flex w-full flex-col gap-2.5">
            <Link href="/analisis" className={buttonClasses('primary', 'lg', 'w-full')}>
              Realizar mi análisis
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/como-medirse"
              className={buttonClasses('ghost', 'lg', 'w-full')}
            >
              Ver cómo medirme
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { result, createdAt, source } = analysis;

  return (
    <div className="app-shell flex flex-col gap-4 px-gutter py-5 sm:gap-5 sm:py-8">
      <header className="print-only">
        <p className="font-script text-3xl">{SITE.brand}</p>
        <p className="text-sm">
          {SITE.product} · Ficha del {formatLongDate(createdAt)}
        </p>
        <hr className="mt-3" />
      </header>

      {/* 1 · Resumen de la silueta */}
      <div className="alma-fade-up">
        <ResultHero result={result} createdAt={createdAt} source={source} />
      </div>

      <a
        href="#recomendaciones"
        className={buttonClasses('primary', 'lg', 'no-print w-full')}
      >
        Ver mis recomendaciones
        <ArrowDown aria-hidden="true" className="h-4 w-4" />
      </a>

      {/* 2 · Por qué obtuviste este resultado */}
      <Accordion title="Por qué obtuviste este resultado" defaultOpen>
        <RuleExplanation result={result} />
      </Accordion>

      {/* 3 · Comparación de medidas */}
      <Accordion title="Comparación de tus medidas">
        <MeasurementComparison result={result} />
      </Accordion>

      {/* 4 · Objetivo visual */}
      <VisualObjectiveCard result={result} />

      {/* 5 a 12 · Recomendaciones por categoría */}
      <div id="recomendaciones" className="scroll-mt-20 pt-2">
        <RecommendationAccordion recommendations={result.recommendations} />
      </div>

      {/* 13 · Outfits completos */}
      <section aria-labelledby="titulo-outfits" className="pt-2">
        <h2 id="titulo-outfits" className="text-2xl">
          Outfits completos
        </h2>
        <p className="mt-1.5 text-[0.95rem] text-muted">
          Tres combinaciones para distintos momentos, pensadas para tu silueta.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {result.recommendations.outfitExamples.map((outfit) => (
            <OutfitCard key={outfit.name} outfit={outfit} />
          ))}
        </div>
      </section>

      {/* 14 · Imprimir, guardar o compartir */}
      <section aria-labelledby="titulo-acciones" className="pt-2">
        <h2 id="titulo-acciones" className="text-2xl">
          Guarda tu guía
        </h2>
        <p className="mt-1.5 text-[0.95rem] text-muted">
          Llévala contigo cuando vayas de compras o vuelve cuando quieras: queda
          guardada en este dispositivo.
        </p>
        <div className="mt-4">
          <ResultActions result={result} />
        </div>
      </section>

      <Accordion title="Cómo usar esta guía">
        <ul className="flex flex-col gap-3 text-[0.95rem] text-muted">
          <li>
            Empieza por una sola categoría. Aplicar dos o tres ideas ya cambia la
            forma en que se ve un conjunto.
          </li>
          <li>
            Si te identificas con dos siluetas, combina las recomendaciones de
            ambas: son orientaciones, no reglas rígidas.
          </li>
          <li>
            Repite el análisis cuando quieras; cada resultado reemplaza al anterior
            en tu dispositivo.
          </li>
        </ul>
        <p className="mt-4 text-sm text-faint">{SITE.disclaimer}</p>
      </Accordion>
    </div>
  );
}
