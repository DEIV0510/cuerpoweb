import { Sparkle } from 'lucide-react';
import { Accordion } from '@/components/ui/Accordion';
import { RECOMMENDATION_SECTIONS } from '@/data/recommendations';
import type { BodyShapeRecommendation } from '@/types/body-shape';

interface RecommendationAccordionProps {
  recommendations: BodyShapeRecommendation;
}

/**
 * Recomendaciones por categoría en acordeones.
 * La primera categoría llega abierta para que se entienda el patrón; el resto
 * se despliega con un toque. Al imprimir se abren todas.
 */
export function RecommendationAccordion({
  recommendations,
}: RecommendationAccordionProps) {
  return (
    <section aria-labelledby="titulo-recomendaciones" className="flex flex-col gap-3">
      <div>
        <h2 id="titulo-recomendaciones" className="text-2xl">
          Tus recomendaciones
        </h2>
        <p className="mt-1.5 text-[0.95rem] text-muted">
          Toca cada categoría para desplegarla. Tómalas como punto de partida y
          quédate con lo que sientas cómodo y propio.
        </p>
      </div>

      {RECOMMENDATION_SECTIONS.map((section, index) => {
        const items = recommendations[section.key];

        return (
          <Accordion
            key={section.key}
            title={section.label}
            subtitle={`${items.length} sugerencias`}
            defaultOpen={index === 0}
          >
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li key={item} className="flex gap-3 text-[0.975rem] text-ink">
                  <Sparkle
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-brand"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Accordion>
        );
      })}
    </section>
  );
}
