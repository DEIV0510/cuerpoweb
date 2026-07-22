import { MeasurementBarChart } from '@/components/results/MeasurementBarChart';
import { formatCm } from '@/lib/body-shape/calculations';
import type { BodyShapeResult } from '@/types/body-shape';

interface MeasurementComparisonProps {
  result: BodyShapeResult;
}

/** Comparación de las tres medidas y de las diferencias calculadas. */
export function MeasurementComparison({ result }: MeasurementComparisonProps) {
  const { calculatedDifferences: differences } = result;

  const rows = [
    {
      label: 'Diferencia entre busto y cadera',
      value: differences.differenceBustHips,
    },
    {
      label: 'Diferencia entre busto y cintura',
      value: differences.bustWaistDifference,
    },
    {
      label: 'Diferencia entre cadera y cintura',
      value: differences.hipsWaistDifference,
    },
    {
      label: 'Promedio de busto y cadera',
      value: differences.averageBustHips,
    },
  ];

  return (
    <section
      aria-labelledby="comparacion-medidas"
      className="rounded-card border border-line bg-surface p-6 sm:p-7"
    >
      <h2 id="comparacion-medidas" className="text-2xl">
        Comparación de tus medidas
      </h2>
      <p className="mt-2 text-[0.95rem] text-muted">
        Las barras muestran la proporción entre los tres contornos registrados.
      </p>

      <div className="mt-6">
        <MeasurementBarChart measurements={result.measurements} />
      </div>

      <dl className="mt-7 grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-3 rounded-xl bg-shell px-4 py-3"
          >
            <dt className="text-sm text-muted">{row.label}</dt>
            <dd className="shrink-0 font-semibold text-ink">
              {formatCm(Math.abs(row.value))} cm
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
