import { Check } from 'lucide-react';
import { MeasurementIllustration } from '@/components/measurements/MeasurementIllustration';
import { GENERAL_TIPS, ZONE_GUIDES } from '@/data/measurement-guide';
import { cn } from '@/lib/utils';

interface MeasurementGuideProps {
  /** Versión reducida para usar dentro del panel de ayuda del formulario. */
  compact?: boolean;
  className?: string;
}

/** Guía completa para tomar las tres medidas. */
export function MeasurementGuide({ compact = false, className }: MeasurementGuideProps) {
  return (
    <div className={cn('flex flex-col gap-8', className)}>
      <section
        aria-labelledby="guia-general"
        className="rounded-card border border-line bg-surface p-6 sm:p-7"
      >
        <h2 id="guia-general" className={cn(compact ? 'text-xl' : 'text-2xl')}>
          Antes de empezar
        </h2>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {GENERAL_TIPS.map((tip) => (
            <li key={tip} className="flex gap-2.5 text-[0.95rem] text-muted">
              <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-success" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {ZONE_GUIDES.map((zone, index) => (
          <section
            key={zone.id}
            aria-labelledby={`guia-${zone.id}`}
            className="flex flex-col rounded-card border border-line bg-surface p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                  Medida {index + 1}
                </span>
                <h3 id={`guia-${zone.id}`} className="mt-1 text-xl">
                  {zone.label}
                </h3>
              </div>
              <div className="w-20 shrink-0">
                <MeasurementIllustration highlight={zone.id} showLabels={false} />
              </div>
            </div>

            <p className="mt-3 text-[0.95rem] text-muted">{zone.instructions}</p>

            <p className="mt-4 rounded-xl bg-shell p-4 text-sm text-muted">
              <span className="font-semibold text-ink">Consejo: </span>
              {zone.tip}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
