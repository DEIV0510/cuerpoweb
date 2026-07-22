'use client';

import { useRef, useState } from 'react';
import { RecommendationCard } from '@/components/results/RecommendationCard';
import { RECOMMENDATION_SECTIONS } from '@/data/recommendations';
import type { RecommendationSectionKey } from '@/data/recommendations';
import type { BodyShapeRecommendation } from '@/types/body-shape';
import { cn } from '@/lib/utils';

interface RecommendationTabsProps {
  recommendations: BodyShapeRecommendation;
}

/**
 * Pestañas de recomendaciones.
 * En pantallas pequeñas la lista se desplaza horizontalmente y al imprimir se
 * despliegan todas las secciones.
 */
export function RecommendationTabs({ recommendations }: RecommendationTabsProps) {
  const [active, setActive] = useState<RecommendationSectionKey>('tops');
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function focusTab(index: number) {
    const total = RECOMMENDATION_SECTIONS.length;
    const next = (index + total) % total;
    const key = RECOMMENDATION_SECTIONS[next].key;
    setActive(key);
    tabRefs.current[key]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        focusTab(index + 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        focusTab(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusTab(0);
        break;
      case 'End':
        event.preventDefault();
        focusTab(RECOMMENDATION_SECTIONS.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <section aria-labelledby="titulo-recomendaciones" data-print-expand>
      <h2 id="titulo-recomendaciones" className="text-2xl">
        Recomendaciones para tu silueta
      </h2>
      <p className="mt-2 text-[0.95rem] text-muted">
        Sugerencias por categoría. Tómalas como un punto de partida y quédate con
        lo que se sienta cómodo y propio.
      </p>

      <div
        role="tablist"
        aria-label="Categorías de recomendaciones"
        data-print-tablist
        className="scrollbar-thin mt-5 flex gap-2 overflow-x-auto pb-2"
      >
        {RECOMMENDATION_SECTIONS.map((section, index) => {
          const isActive = section.key === active;
          return (
            <button
              key={section.key}
              ref={(node) => {
                tabRefs.current[section.key] = node;
              }}
              type="button"
              role="tab"
              id={`tab-${section.key}`}
              aria-selected={isActive}
              aria-controls={`panel-${section.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(section.key)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                'min-h-11 shrink-0 rounded-full border px-4 text-[0.95rem] transition-colors',
                isActive
                  ? 'border-brand bg-brand text-white'
                  : 'border-line bg-surface text-muted hover:text-ink',
              )}
            >
              {section.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        {RECOMMENDATION_SECTIONS.map((section) => (
          <div
            key={section.key}
            role="tabpanel"
            id={`panel-${section.key}`}
            aria-labelledby={`tab-${section.key}`}
            hidden={section.key !== active}
            tabIndex={0}
            className="mb-4"
          >
            <RecommendationCard
              title={section.label}
              items={recommendations[section.key]}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
