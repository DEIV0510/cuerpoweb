import { MeasurementIllustration } from '@/components/measurements/MeasurementIllustration';
import { formatCm } from '@/lib/body-shape/calculations';
import type { Measurements } from '@/types/body-shape';

interface MeasurementSummaryProps {
  measurements: Measurements;
  /** Muestra la ilustración con las tres zonas señaladas. */
  withIllustration?: boolean;
}

const ROWS: Array<{ key: 'bust' | 'waist' | 'hips'; label: string }> = [
  { key: 'bust', label: 'Busto' },
  { key: 'waist', label: 'Cintura' },
  { key: 'hips', label: 'Cadera' },
];

/** Tarjeta de resumen de las medidas registradas. */
export function MeasurementSummary({
  measurements,
  withIllustration = true,
}: MeasurementSummaryProps) {
  return (
    <div className="flex flex-col gap-6 rounded-card border border-line bg-surface p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-7">
      {withIllustration ? (
        <div className="w-24 shrink-0 self-center sm:w-28">
          <MeasurementIllustration highlight="all" showLabels={false} />
        </div>
      ) : null}

      <div className="flex-1">
        <h2 className="text-xl">Medidas registradas</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          {ROWS.map((row) => (
            <div key={row.key} className="rounded-xl bg-shell px-4 py-3">
              <dt className="text-sm text-muted">{row.label}</dt>
              <dd className="text-xl font-semibold text-ink">
                {formatCm(measurements[row.key])}
                <span className="ml-1 text-sm font-normal text-muted">cm</span>
              </dd>
            </div>
          ))}
        </dl>

        {measurements.height !== undefined ? (
          <p className="mt-3 text-sm text-muted">
            Altura registrada: {formatCm(measurements.height)} cm. Es un dato de
            referencia y no participa en la clasificación.
          </p>
        ) : null}
      </div>
    </div>
  );
}
