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
      className="rounded-card border border-sand bg-brand-soft/45 p-5 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface">
          <Target aria-hidden="true" className="h-5 w-5 text-brand-dark" />
        </span>
        <h2 id="objetivo-visual" className="text-xl">
          Objetivo visual
        </h2>
      </div>

      <p className="mt-3 text-[1.05rem] text-ink">{result.visualObjective}</p>
      <p className="mt-2 text-[0.95rem] text-brand-dark">
        {result.recommendations.description}
      </p>
    </section>
  );
}
