import { Target } from 'lucide-react';
import type { BodyShapeResult } from '@/types/body-shape';

interface VisualObjectiveCardProps {
  result: BodyShapeResult;
}

/** Objetivo visual recomendado para la silueta obtenida. */
export function VisualObjectiveCard({ result }: VisualObjectiveCardProps) {
  return (
    <section
      aria-labelledby="objetivo-visual"
      className="rounded-card border border-brand-soft bg-brand-soft/30 p-6 sm:p-7"
    >
      <div className="flex gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface">
          <Target aria-hidden="true" className="h-5 w-5 text-brand-dark" />
        </span>
        <div>
          <h2 id="objetivo-visual" className="text-2xl">
            Objetivo visual
          </h2>
          <p className="mt-2 text-ink">{result.visualObjective}</p>
          <p className="mt-3 text-[0.95rem] text-brand-dark">
            {result.recommendations.description}
          </p>
        </div>
      </div>
    </section>
  );
}
