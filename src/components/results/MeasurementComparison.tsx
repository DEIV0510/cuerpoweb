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
    { label: 'Entre busto y cadera', value: differences.differenceBustHips },
    { label: 'Entre busto y cintura', value: differences.bustWaistDifference },
    { label: 'Entre cadera y cintura', value: differences.hipsWaistDifference },
    { label: 'Promedio de busto y cadera', value: differences.averageBustHips },
  ];

  return (
    <div className="flex flex-col gap-6">
      <MeasurementBarChart measurements={result.measurements} />

      <dl className="flex flex-col gap-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-3 rounded-2xl bg-shell px-4 py-3"
          >
            <dt className="text-sm text-muted">{row.label}</dt>
            <dd className="shrink-0 font-semibold tabular-nums text-ink">
              {formatCm(Math.abs(row.value))} cm
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
