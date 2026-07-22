import { AlertCircle, Check } from 'lucide-react';
import { MeasurementIllustration } from '@/components/measurements/MeasurementIllustration';
import { Accordion } from '@/components/ui/Accordion';
import { GENERAL_TIPS, ZONE_GUIDES } from '@/data/measurement-guide';
import { cn } from '@/lib/utils';

interface MeasurementGuideProps {
  /** Versión reducida para paneles y pantallas pequeñas. */
  compact?: boolean;
  className?: string;
}

/**
 * Guía para tomar las tres medidas, pensada para leerse con el teléfono en una
 * mano y la cinta métrica en la otra: ilustración grande, una instrucción
 * corta y el detalle dentro de un acordeón.
 */
export function MeasurementGuide({ compact = false, className }: MeasurementGuideProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <section
        aria-labelledby="guia-general"
        className="rounded-card border border-line bg-surface p-5 sm:p-6"
      >
        <h2 id="guia-general" className={cn(compact ? 'text-xl' : 'text-2xl')}>
          Antes de empezar
        </h2>
        <ul className="mt-4 flex flex-col gap-2.5 md:grid md:grid-cols-2">
          {GENERAL_TIPS.map((tip) => (
            <li key={tip} className="flex gap-2.5 text-[0.95rem] text-muted">
              <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-success" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {ZONE_GUIDES.map((zone, index) => (
        <section
          key={zone.id}
          aria-labelledby={`guia-${zone.id}`}
          className="overflow-hidden rounded-card border border-line bg-surface"
        >
          <div className="bg-blush-radial flex items-center gap-5 px-5 py-6">
            <div className="w-24 shrink-0 sm:w-28">
              <MeasurementIllustration highlight={zone.id} showLabels={false} />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
                Medida {index + 1}
              </span>
              <h3 id={`guia-${zone.id}`} className="mt-1 text-2xl">
                {zone.label}
              </h3>
            </div>
          </div>

          <div className="px-5 pb-5 pt-4">
            <p className="text-[1.05rem] leading-relaxed text-ink">
              {zone.instructions}
            </p>

            <ul className="mt-4 flex flex-col gap-2.5">
              {zone.quickTips.map((tip) => (
                <li key={tip} className="flex gap-2.5 text-[0.95rem] text-muted">
                  <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-success" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 flex gap-2.5 rounded-2xl bg-shell p-4 text-sm text-muted">
              <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <span>
                <span className="font-semibold text-ink">Error frecuente: </span>
                {zone.commonError}
              </span>
            </p>

            <Accordion title="Un detalle más" className="mt-3 border-line bg-shell">
              <p className="text-[0.95rem] text-muted">{zone.tip}</p>
            </Accordion>
          </div>
        </section>
      ))}
    </div>
  );
}
